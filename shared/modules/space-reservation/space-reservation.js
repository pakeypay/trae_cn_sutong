(function () {
  var vueApp = null;
  var handledPages = ['场地和物资申请', '场地与物资申请'];

  function waitForVue(callback) {
    if (window.Vue && window.Vue.createApp && window.ArcoVue) {
      callback();
    } else {
      setTimeout(function () { waitForVue(callback); }, 50);
    }
  }

  function shouldHandle() {
    var role = document.body.dataset.role;
    return (role === 'teacher' || role === 'student' || role === 'admin' || role === 'scheduler' || role === 'material' || role === 'external' || role === 'out-student') && handledPages.indexOf(document.body.dataset.active) !== -1;
  }

  function injectCSS() {
    if (document.getElementById('sr-module-css')) return;
    var script = document.querySelector('script[src$="space-reservation.js"]');
    var basePath = script ? script.src.replace(/space-reservation\.js$/, '') : '../shared/modules/space-reservation/';
    var link = document.createElement('link');
    link.id = 'sr-module-css';
    link.rel = 'stylesheet';
    link.href = basePath + 'space-reservation.css';
    document.head.appendChild(link);
  }

  var ROOMS = [
    { id: 'rm1', name: '301 PBL教室(录播)', floorLabel: '三楼', capacity: 15, openForBook: true, desc: '支持小组协作与PBL圆桌讨论', equipment: ['360全景录播', '触控大屏'] },
    { id: 'rm2', name: '305 阶梯教室(大)', floorLabel: '三楼', capacity: 200, openForBook: true, desc: '适合全院大型公开学术会议及多媒体大课', equipment: ['专业扩音', '大屏投影'] },
    { id: 'rm3', name: '415 模拟手术室', floorLabel: '四楼', capacity: 30, openForBook: false, desc: '高规格全保真模拟手术实训空间', equipment: ['腔镜训练台', '多系统录播'] },
    { id: 'rm4', name: '501 自主训练室', floorLabel: '五楼', capacity: 10, openForBook: true, desc: '专供学生课后小组模拟技能操作练习', equipment: ['静脉穿刺手臂', '基础除颤仪'] },
    { id: 'rm5', name: '505 OSCE考站', floorLabel: '五楼', capacity: 30, openForBook: true, desc: '标准OSCE综合临床技能考点基站', equipment: ['AI考评终端', '双向通话录像'] }
  ];

  var MATERIALS = [
    { id: 'mat1', code: 'M-0021', name: '高保真小儿心肺复苏模拟人', category: '医学模型', sub: '急救模型', returns: true },
    { id: 'mat2', code: 'M-0941', name: '多功能穿刺操作手臂', category: '医学模型', sub: '穿刺技能', returns: true },
    { id: 'mat3', code: 'M-0812', name: '便携式床旁彩色超声诊断仪', category: '仪器设备', sub: '临床监护', returns: true },
    { id: 'mat4', code: 'C-0101', name: '一次性无菌手套(7.5码)', category: '医用耗材', sub: '防护耗材', returns: false },
    { id: 'mat5', code: 'C-0294', name: '无菌纱布敷料包', category: '医用耗材', sub: '包扎耗材', returns: false },
    { id: 'mat6', code: 'C-0482', name: '一次性使用腰椎穿刺耗材包', category: '医用耗材', sub: '穿刺耗材', returns: false }
  ];

  var INITIAL_RECORDS = [
    {
      code: 'SP-2026053001',
      type: '空间预约',
      usageType: '模拟演练',
      resource: '415 模拟手术室',
      date: '2026-05-30',
      timeRange: '14:00 - 16:00',
      headcount: 15,
      status: 'in_use',
      returnMethod: 'center_collect',
      items: ['小儿复苏插管头模型', '一次性插管包'],
      needsReturn: true,
      reason: '高水平小儿插管与麻醉诱导模拟训练'
    },
    {
      code: 'MT-2026053002',
      type: '物资借用',
      usageType: '科室示教',
      resource: '便携式床旁彩色超声诊断仪',
      date: '2026-05-30',
      timeRange: '09:00 - 18:00',
      headcount: 8,
      status: 'approved',
      returnMethod: 'self_return',
      items: ['便携式床旁超声仪'],
      needsReturn: true,
      reason: '儿内科大病房床旁超声快速诊断示教'
    },
    {
      code: 'MT-2026052903',
      type: '物资借用',
      usageType: '科室示教',
      resource: '一次性无菌手套、无菌纱布敷料包',
      date: '2026-05-29',
      timeRange: '10:00 - 12:00',
      headcount: 6,
      status: 'archived',
      returnMethod: 'disposable_only',
      items: ['一次性无菌手套', '无菌纱布'],
      needsReturn: false,
      reason: '门诊换药基础无菌带教演示'
    }
  ];

  function getTemplate() {
    return [
      '<div class="sr-module">',
        '<!-- Header section -->',
        '<div class="sr-page-top">',
          '<div class="sr-title">',
            '<div class="sr-breadcrumb"><a-breadcrumb><a-breadcrumb-item><a href="#" @click.prevent="backToServiceHall" style="color:#165dff; font-weight:600; text-decoration:none; display:inline-flex; align-items:center; gap:6px;"><i class="fas fa-arrow-left"></i> 返回服务大厅</a></a-breadcrumb-item><a-breadcrumb-item>{{ activePage }}</a-breadcrumb-item></a-breadcrumb></div>',
            '<h2>{{ isStudent ? \'学生自主实训与备考平台\' : \'教学准备与保障工作台\' }}</h2>',
            '<p>{{ isStudent ? \'预约5楼开放练习室与操作模型，完成自主技能强化，随时进行扫码签到与记录查询。\' : \'一站式发起技能大楼空间租用、常规教学模型预订及科室外带示教设备领用申请。\' }}</p>',
          '</div>',
        '</div>',

        '<!-- Two Column Workdesk Landing Layout -->',
        '<div class="sr-workdesk-grid">',
          '<!-- Left Column: Active Schedules & Action boards -->',
          '<div class="sr-schedules-col">',
            '<div class="sr-card">',
              '<div class="sr-card-header">',
                '<span class="header-title">',
                  '<i class="fas" :class="isStudent ? \'fa-award\' : \'fa-tasks\'"></i>',
                  '{{ isStudent ? \'我的训练日程与信用额度\' : \'当前申请与日程看板\' }}',
                '</span>',
                '<a-tag size="small" color="arcoblue" v-if="filteredRecords.length">{{ filteredRecords.length }} 项进行中</a-tag>',
              '</div>',

              '<!-- Student Credit Info Overlay -->',
              '<div v-if="isStudent" class="sr-student-credit-bar">',
                '<div class="credit-metric">',
                  '<i class="fas fa-star text-amber"></i>',
                  '<span>自主实训信用分：<strong>98</strong> 分 (信用优秀)</span>',
                '</div>',
                '<div class="credit-metric">',
                  '<i class="fas fa-history text-indigo"></i>',
                  '<span>本周剩余可用额度：<strong>2</strong> 次 (上限 3 次)</span>',
                '</div>',
              '</div>',

              '<div class="sr-schedules-list">',
                '<div v-if="!filteredRecords.length" class="sr-empty-schedule">',
                  '<span class="empty-icon"><i class="fas fa-folder-open"></i></span>',
                  '<p>暂无进行中的申请或实训日程</p>',
                  '<small>请从右侧卡片快捷选择相应场景发起申请</small>',
                '</div>',

                '<div v-for="item in filteredRecords" :key="item.code" class="sr-schedule-item" :class="item.status">',
                  '<div class="item-main">',
                    '<div class="item-meta">',
                      '<span class="item-code"><code>{{ item.code }}</code></span>',
                      '<a-tag size="small" :color="item.type === \'空间预约\' ? \'arcoblue\' : \'purple\'">{{ item.type }}</a-tag>',
                      '<a-tag size="small" color="gray">{{ item.usageType }}</a-tag>',
                    '</div>',
                    '<h4>{{ item.resource }}</h4>',
                    '<div class="item-time">',
                      '<span><i class="far fa-calendar-alt"></i> 日期: {{ item.date }}</span>',
                      '<span class="ml-4"><i class="far fa-clock"></i> 时段: {{ item.timeRange }}</span>',
                    '</div>',
                    '<div v-if="item.type === \'物资借用\' && item.needsReturn" class="item-return-info">',
                      '<i class="fas fa-info-circle text-orange"></i>',
                      '<span>需归还物资 · 预计最晚归还时间：当日 18:00 前</span>',
                    '</div>',
                  '</div>',

                  '<div class="item-actions">',
                    '<span class="item-status-tag" :class="item.status">{{ getStatusText(item.status) }}</span>',
                    '<div class="item-buttons">',
                      '<a-button type="text" size="small" @click="openDetail(item)">查看详情</a-button>',
                      // Return Action Trigger
                      '<a-button v-if="item.status === \'in_use\' && item.returnMethod === \'self_return\'" type="primary" size="small" @click="openSelfReturn(item)">自助拍照归还</a-button>',
                      '<span v-if="item.status === \'in_use\' && item.returnMethod === \'center_collect\'" class="免操作说明">中心自动收回(免操作)</span>',
                      '<a-button v-if="item.status === \'pending\'" type="text" size="small" status="danger" @click="openWithdraw(item)">撤回申请</a-button>',
                    '</div>',
                  '</div>',
                '</div>',
              '</div>',
            '</div>',
          '</div>',

          '<!-- Right Column: Portal Call To Action Cards -->',
          '<div class="sr-gateways-col">',
            '<div class="sr-card">',
              '<div class="sr-card-header"><span class="header-title"><i class="fas fa-paper-plane"></i> 发起新申请</span></div>',
              '<div class="sr-gateways-list">',
                // Card A: Space booking
                '<div class="sr-gateway-card blue" @click="openRoomModal">',
                  '<div class="gateway-icon"><i class="fas fa-building"></i></div>',
                  '<div class="gateway-body">',
                    '<h3>{{ isStudent ? \'预约练习空间\' : \'空间预约申请\' }}</h3>',
                    '<p>{{ isStudent ? \'预约5楼开放多媒体房间，可同步配发常规操作模型。\' : \'适用于大班授课、学术会议、多媒体录播活动，可勾选配套物资包。\' }}</p>',
                    '<span class="action-btn">立即发起 <i class="fas fa-arrow-right"></i></span>',
                  '</div>',
                '</div>',

                // Card B: Material only (Hidden for students)
                '<div v-if="!isStudent" class="sr-gateway-card purple" @click="openMaterialModal">',
                  '<div class="gateway-icon"><i class="fas fa-box-open"></i></div>',
                  '<div class="gateway-body">',
                    '<h3>仅借用物资</h3>',
                    '<p>适合科室示教、外带讲课、院内活动等单独借用模型道具或领用一次性耗材场景，不占用技能教室。</p>',
                    '<span class="action-btn">立即发起 <i class="fas fa-arrow-right"></i></span>',
                  '</div>',
                '</div>',

                // Student Card B: Scan Signage (Only for students)
                '<div v-if="isStudent" class="sr-gateway-card amber" @click="openScanGate">',
                  '<div class="gateway-icon"><i class="fas fa-qrcode"></i></div>',
                  '<div class="gateway-body">',
                    '<h3>扫码极速预约/签到</h3>',
                    '<p>在实训教室门口，直接用手机扫描班牌完成实时空余房间的锁定或练习日常的出勤签到开门。</p>',
                    '<span class="action-btn">立即开门 <i class="fas fa-arrow-right"></i></span>',
                  '</div>',
                '</div>',
              '</div>',
            '</div>',
          '</div>',
        '</div>',

        '<!-- ═══════════ 服务大厅 额外自助业务模块 (教务、考务、学术) ═══════════ -->',
        '<div class="sr-card" style="margin-top:24px; padding:20px;">',
          '<div class="sr-card-header" style="border-bottom:none; margin-bottom:16px; padding-bottom:0;">',
            '<span class="header-title" style="font-size:15px; font-weight:700;"><i class="fas fa-th-large" style="color:var(--primary); margin-right:8px;"></i>服务大厅 · 其他教研考务自助申办通道</span>',
          '</div>',
          
          '<div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:16px;">',
            '<!-- Column 1: 教务教学服务 -->',
            '<div style="background:#f8fafc; border:1px solid #e5e6eb; border-radius:8px; padding:16px; display:flex; flex-direction:column; justify-content:space-between; min-height:160px; transition:transform 0.2s ease;">',
              '<div>',
                '<div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">',
                  '<div style="width:30px; height:30px; border-radius:6px; background:rgba(114,46,209,0.1); color:#722ed1; display:grid; place-items:center; font-size:14px;"><i class="fas fa-graduation-cap"></i></div>',
                  '<strong style="font-size:13.5px; color:#1d2129;">教务教学服务</strong>',
                '</div>',
                '<ul style="padding-left:16px; margin:0; font-size:12px; color:#4e5969; line-height:1.7;">',
                  '<li>教案/课件一键快速提报审核</li>',
                  '<li>补调课与时间自动避让排查</li>',
                  '<li>跨院区多媒体教学连线申请</li>',
                '</ul>',
              '</div>',
              '<div style="text-align:right; border-top:1px solid rgba(229,230,235,0.6); padding-top:10px; margin-top:8px;">',
                '<a-button type="text" size="small" style="padding:0; height:auto; color:#165dff; font-weight:600;" @click="triggerService(\'教务教学服务\')">申办入口 <i class="fas fa-chevron-right" style="font-size:10px;"></i></a-button>',
              '</div>',
            '</div>',

            '<!-- Column 2: OSCE 考务服务 -->',
            '<div style="background:#f8fafc; border:1px solid #e5e6eb; border-radius:8px; padding:16px; display:flex; flex-direction:column; justify-content:space-between; min-height:160px;">',
              '<div>',
                '<div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">',
                  '<div style="width:30px; height:30px; border-radius:6px; background:rgba(20,201,201,0.1); color:#14c9c9; display:grid; place-items:center; font-size:14px;"><i class="fas fa-id-card-alt"></i></div>',
                  '<strong style="font-size:13.5px; color:#1d2129;">OSCE 考务服务</strong>',
                '</div>',
                '<ul style="padding-left:16px; margin:0; font-size:12px; color:#4e5969; line-height:1.7;">',
                  '<li>OSCE 考官资格培训认证申报</li>',
                  '<li>考站考机与多媒体设备故障报修</li>',
                  '<li>考前自主实训模拟沙盘预订</li>',
                '</ul>',
              '</div>',
              '<div style="text-align:right; border-top:1px solid rgba(229,230,235,0.6); padding-top:10px; margin-top:8px;">',
                '<a-button type="text" size="small" style="padding:0; height:auto; color:#165dff; font-weight:600;" @click="triggerService(\'OSCE考务服务\')">申办入口 <i class="fas fa-chevron-right" style="font-size:10px;"></i></a-button>',
              '</div>',
            '</div>',

            '<!-- Column 3: 学术学分与个人发展 -->',
            '<div style="background:#f8fafc; border:1px solid #e5e6eb; border-radius:8px; padding:16px; display:flex; flex-direction:column; justify-content:space-between; min-height:160px;">',
              '<div>',
                '<div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">',
                  '<div style="width:30px; height:30px; border-radius:6px; background:rgba(255,125,0,0.1); color:#ff7d00; display:grid; place-items:center; font-size:14px;"><i class="fas fa-medal"></i></div>',
                  '<strong style="font-size:13.5px; color:#1d2129;">学术与学分服务</strong>',
                '</div>',
                '<ul style="padding-left:16px; margin:0; font-size:12px; color:#4e5969; line-height:1.7;">',
                  '<li>国家级 CME 继续教育学分申报</li>',
                  '<li>本年度卓越教学优秀成果征集</li>',
                  '<li>导师与学员双向志愿互选申报</li>',
                '</ul>',
              '</div>',
              '<div style="text-align:right; border-top:1px solid rgba(229,230,235,0.6); padding-top:10px; margin-top:8px;">',
                '<a-button type="text" size="small" style="padding:0; height:auto; color:#165dff; font-weight:600;" @click="triggerService(\'学术与学分服务\')">申办入口 <i class="fas fa-chevron-right" style="font-size:10px;"></i></a-button>',
              '</div>',
            '</div>',
          '</div>',
        '</div>',

        /* ═══════════ 场地预约弹窗 (含物资配置与归还方式选择) ═══════════ */
        '<a-drawer v-model:visible="roomModalVisible" title="空间与物资配套预约申请" :width="680" :footer="false" unmount-on-close>',
          '<a-form layout="vertical">',
            '<div class="form-section-title">基本信息</div>',
            '<a-row :gutter="16">',
              '<a-col :span="8"><a-form-item label="申请人"><a-input :model-value="currentUser.name" disabled /></a-form-item></a-col>',
              '<a-col :span="8"><a-form-item label="所属科室"><a-input :model-value="currentUser.dept" disabled /></a-form-item></a-col>',
              '<a-col :span="8"><a-form-item label="联系电话" required><a-input v-model="roomForm.phone" placeholder="请输入手机号" /></a-form-item></a-col>',
            '</a-row>',
            '<a-row :gutter="16">',
              '<a-col :span="8">',
                '<a-form-item label="用途类型" required>',
                  '<a-select v-model="roomForm.usageType">',
                    '<a-option v-for="item in usageOptions" :key="item" :value="item">{{ item }}</a-option>',
                  '</a-select>',
                '</a-form-item>',
              '</a-col>',
              '<a-col :span="8"><a-form-item label="预约日期" required><a-date-picker v-model="roomForm.date" style="width:100%" /></a-form-item></a-col>',
              '<a-col :span="8"><a-form-item label="使用时段" required><a-time-picker v-model="roomForm.startTime" style="width:46%" /> 至 <a-time-picker v-model="roomForm.endTime" style="width:46%" /></a-form-item></a-col>',
            '</a-row>',

            '<div class="form-section-title">选择场地 ({{ isStudent ? \'仅显示学生开放区域\' : \'全部区域\' }})</div>',
            '<div class="sr-room-grid">',
              '<div v-for="room in filteredRooms" :key="room.id" :class="[\'sr-room-card\', {selected: roomForm.selectedRoom===room.id}]" @click="roomForm.selectedRoom=room.id">',
                '<div class="sr-room-name">',
                  '{{room.name}}',
                  '<a-tag v-if="room.openForBook" color="green" size="small">可申请</a-tag>',
                  '<a-tag v-else color="orange" size="small">需协调</a-tag>',
                '</div>',
                '<div class="sr-room-meta">{{room.floorLabel}} · {{room.capacity}}人最大容量 · {{room.desc}}</div>',
                '<div class="sr-room-tags"><a-tag v-for="eq in room.equipment" :key="eq" size="small" color="blue">{{eq}}</a-tag></div>',
              '</div>',
            '</div>',

            '<div v-if="!isStudent">',
              '<div class="form-section-title">物资配套选项 (可选配套教具与模型耗材)</div>',
              '<div style="background:#f7f8fa;padding:12px;border-radius:6px;border:1px solid #e5e6eb;margin-bottom:14px;">',
                '<a-checkbox v-model="roomForm.includeMaterials">配套模型与教学物资申请</a-checkbox>',
                '<span style="font-size:12px;color:var(--sr-text-muted);display:block;margin-top:4px;">勾选后，系统将自动生成对应的库房物资分发指令，无需单独发起借用。</span>',
              '</div>',

              '<div v-if="roomForm.includeMaterials" class="sr-mat-search-area">',
                '<div class="sr-mat-search">',
                  '<span class="search-icon"><i class="fas fa-search"></i></span>',
                  '<input v-model="matSearchKeyword" placeholder="快速添加模型、器材或消耗品..." @input="searchMaterials" />',
                '</div>',
                '<div :class="[\'sr-mat-results\',{show:matSearchResults.length>0}]">',
                  '<div v-for="m in matSearchResults" :key="m.id" class="sr-mat-item" @click="toggleMat(m.id)">',
                    '<a-checkbox :checked="selectedMatIds.has(m.id)" />',
                    '<div style="flex:1">',
                      '<strong>{{m.name}}</strong>',
                      '<a-tag v-if="m.returns" color="orange" size="small" style="margin-left:6px">需归还</a-tag>',
                      '<a-tag v-else size="small" style="margin-left:6px">免归还</a-tag>',
                    '</div>',
                  '</div>',
                '</div>',

                '<div class="sr-selected-mats-panel" style="margin-top:10px;">',
                  '<div v-if="!selectedMatIds.size" class="empty-list-label">未选择任何配套物资</div>',
                  '<div v-else class="mats-list">',
                    '<div v-for="m in selectedMats" :key="m.id" class="mat-list-row">',
                      '<span>{{m.name}}</span>',
                      '<a-tag v-if="m.returns" color="orange" size="small">需归还</a-tag>',
                      '<a-tag v-else color="green" size="small">耗材</a-tag>',
                      '<a-button type="text" status="danger" size="small" @click="removeMat(m.id)">移除</a-button>',
                    '</div>',
                  '</div>',
                '</div>',

                // Return Methods choice (Only show if returnable items are present)
                '<div v-if="selectedMatIds.size && hasReturnableItems" class="sr-return-method-card" style="margin-top:16px;">',
                  '<div class="method-title"><i class="fas fa-undo"></i> 确认物资归还方式</div>',
                  '<a-radio-group v-model="roomForm.returnMethod" direction="vertical">',
                    '<a-radio value="self_return">',
                      '<strong>自助归还 (自己放回原柜并拍照确认)</strong>',
                      '<span style="display:block;font-size:11px;color:var(--sr-text-muted);margin-top:2px;">下课后由老师放回中心物资柜，并在系统工作台拍照上传完成核销。</span>',
                    '</a-radio>',
                    '<a-radio value="center_collect">',
                      '<strong>中心收回 (上完课直接走人，免除老师操作负担)</strong>',
                      '<span style="display:block;font-size:11px;color:var(--sr-text-muted);margin-top:2px;">下课后阿姨或管理老师会自动派单清点，并自动核销。老师免除一切归还照片上传操作。</span>',
                    '</a-radio>',
                  '</a-radio-group>',
                '</div>',
              '</div>',
            '</div>',

            '<a-form-item label="备注/特殊要求说明" style="margin-top:16px;">',
              '<a-textarea v-model="roomForm.reason" placeholder="请简要描述活动主题或设备的特殊摆放配置需求" :auto-size="{minRows:3,maxRows:4}" />',
            '</a-form-item>',
          '</a-form>',

          '<div class="sr-drawer-footer" style="text-align:right;margin-top:16px;border-top:1px solid #f2f3f5;padding-top:16px;">',
            '<a-space>',
              '<a-button @click="roomModalVisible=false">取消</a-button>',
              '<a-button type="primary" @click="submitRoom">提交空间预约</a-button>',
            '</a-space>',
          '</div>',
        '</a-drawer>',

        /* ═══════════ 仅借用物资弹窗 (免除场地绑定，动态校验归还时间) ═══════════ */
        '<a-drawer v-model:visible="matModalVisible" title="仅借用物资申请 (科室外带/教学演示)" :width="680" :footer="false" unmount-on-close>',
          '<a-form layout="vertical">',
            '<a-row :gutter="16">',
              '<a-col :span="8"><a-form-item label="申请人"><a-input :model-value="currentUser.name" disabled /></a-form-item></a-col>',
              '<a-col :span="8"><a-form-item label="联系电话" required><a-input v-model="matForm.phone" /></a-form-item></a-col>',
              '<a-col :span="8"><a-form-item label="外带使用地点" required><a-input v-model="matForm.location" placeholder="如：儿科三病区医生办公室" /></a-form-item></a-col>',
            '</a-row>',
            '<a-row :gutter="16">',
              '<a-col :span="8"><a-form-item label="用途大类"><a-select v-model="matForm.usageType"><a-option>科室示教</a-option><a-option>外带演练</a-option><a-option>考试考核</a-option></a-select></a-form-item></a-col>',
              '<a-col :span="8"><a-form-item label="借出提取日期" required><a-date-picker v-model="matForm.startDate" style="width:100%" /></a-form-item></a-col>',
              // Expected return time: Dynamic visibility!
              '<a-col :span="8" v-if="hasReturnableItems">',
                '<a-form-item label="预计归还日期" required>',
                  '<a-date-picker v-model="matForm.returnDate" style="width:100%" />',
                  '<span style="color:var(--sr-warning);font-size:11px;display:block;margin-top:2px;">清单中包含可回收模型，请指定预计归还时间。</span>',
                '</a-form-item>',
              '</a-col>',
              '<a-col :span="8" v-else>',
                '<div style="padding-top:24px;color:var(--sr-success);font-size:12px;">',
                  '<i class="fas fa-check-circle"></i> 当前清单内全部为一次性耗材，免归还。',
                '</div>',
              '</a-col>',
            '</a-row>',

            '<div class="form-section-title">查找并勾选物资</div>',
            '<div class="sr-mat-search">',
              '<span class="search-icon"><i class="fas fa-search"></i></span>',
              '<input v-model="matSearchKeyword" placeholder="输入模型名称、耗材编号进行模糊查找..." @input="searchMaterials" />',
            '</div>',
            '<div :class="[\'sr-mat-results\',{show:matSearchResults.length>0}]">',
              '<div v-for="m in matSearchResults" :key="m.id" class="sr-mat-item" @click="toggleMat(m.id)">',
                '<a-checkbox :checked="selectedMatIds.has(m.id)" />',
                '<div style="flex:1">',
                  '<strong>{{m.name}}</strong>',
                  '<small style="margin-left:8px;color:var(--sr-text-muted);">{{m.code}} · {{m.sub}}</small>',
                  '<a-tag v-if="m.returns" color="orange" size="small" style="margin-left:6px">需归还</a-tag>',
                  '<a-tag v-else size="small" style="margin-left:6px">消耗品</a-tag>',
                '</div>',
              '</div>',
            '</div>',

            '<div class="sr-selected-mats-panel" style="margin-top:12px;">',
              '<div class="sr-mat-list-head">📋 已选物资清单 <a-tag size="small" color="blue">{{selectedMatIds.size}} 项</a-tag></div>',
              '<div class="sr-mat-list-body" style="padding:8px 0;">',
                '<div v-if="!selectedMatIds.size" class="sr-mat-empty">请在上方搜索栏勾选设备或模型包</div>',
                '<div v-for="m in selectedMats" :key="m.id" class="mat-list-row" style="padding:6px 14px;border-bottom:1px solid #f2f3f5;display:flex;justify-content:space-between;align-items:center;">',
                  '<span>{{m.name}}</span>',
                  '<a-space>',
                    '<a-tag v-if="m.returns" color="orange" size="small">需归还</a-tag>',
                    '<a-tag v-else color="green" size="small">免归还耗材</a-tag>',
                    '<a-button type="text" status="danger" size="small" @click="removeMat(m.id)">移除</a-button>',
                  '</a-space>',
                '</div>',
              '</div>',
            '</div>',

            '<a-form-item label="备注说明" style="margin-top:16px;">',
              '<a-textarea v-model="matForm.remark" placeholder="请输入具体物资配套要求或预计分发需求" :auto-size="{minRows:2,maxRows:3}" />',
            '</a-form-item>',
          '</a-form>',

          '<div class="sr-drawer-footer" style="text-align:right;margin-top:16px;border-top:1px solid #f2f3f5;padding-top:16px;">',
            '<a-space>',
              '<a-button @click="matModalVisible=false">取消</a-button>',
              '<a-button type="primary" @click="submitMaterial">提交借用申请</a-button>',
            '</a-space>',
          '</div>',
        '</a-drawer>',

        /* ═══════════ 自助归还拍照确认弹窗 ═══════════ */
        '<a-modal v-model:visible="returnModalVisible" title="自助归还物资与拍照上传" :width="520" @ok="confirmSelfReturn" unmount-on-close>',
          '<div style="font-size:13px;line-height:1.5;color:var(--sr-text-body);margin-bottom:14px;">',
            '您正在对借用编号为 <code>{{ activeReturnRecord ? activeReturnRecord.code : \'\' }}</code> 的物资进行自助拍照归还。请将模型仪器物归原位、线缆整理妥当，并拍照上传归还画面以作凭证。',
          '</div>',
          '<div class="sr-photo-upload-placeholder" @click="mockUploadPhoto" style="height:150px;border:2px dashed var(--sr-border);border-radius:6px;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;background:#fafafa;">',
            '<span v-if="uploadedPhotos === 0" style="font-size:32px;color:var(--sr-text-muted);"><i class="fas fa-camera"></i></span>',
            '<span v-else style="font-size:32px;color:var(--sr-success);"><i class="fas fa-check-circle"></i></span>',
            '<p style="margin:8px 0 0;font-weight:600;font-size:14px;color:var(--sr-text-title);">{{ uploadedPhotos === 0 ? \'点击模拟拍照归还\' : \'已成功拍摄 1 张实物归还照片\' }}</p>',
            '<small style="color:var(--sr-text-muted);margin-top:2px;">（模拟从移动端上传归还细节图片）</small>',
          '</div>',
        '</a-modal>',

        /* ═══════════ 申请详情弹窗 ═══════════ */
        '<a-modal v-model:visible="detailVisible" :title="\'申请单号：\' + (detailRecord?detailRecord.code:\'\')" :width="700" :footer="false" unmount-on-close>',
          '<a-descriptions :column="2" bordered size="medium">',
            '<a-descriptions-item label="申请类型">{{detailRecord?detailRecord.type:\'\'}}</a-descriptions-item>',
            '<a-descriptions-item label="用途类型">{{detailRecord?detailRecord.usageType:\'\'}}</a-descriptions-item>',
            '<a-descriptions-item label="场地/主要物资">{{detailRecord?detailRecord.resource:\'\'}}</a-descriptions-item>',
            '<a-descriptions-item label="预订日期">{{detailRecord?detailRecord.date:\'\'}}</a-descriptions-item>',
            '<a-descriptions-item label="具体时间">{{detailRecord?detailRecord.timeRange:\'\'}}</a-descriptions-item>',
            '<a-descriptions-item label="预计人数">{{detailRecord?detailRecord.headcount:\'\'}} 人</a-descriptions-item>',
          '</a-descriptions>',
          '<div style="text-align:right;margin-top:16px;border-top:1px solid #f2f3f5;padding-top:16px;">',
            '<a-button @click="detailVisible=false">关闭</a-button>',
          '</div>',
        '</a-modal>',

        /* ═══════════ 撤回确认弹窗 ═══════════ */
        '<a-modal v-model:visible="withdrawVisible" title="撤回申请" :width="480" @ok="confirmWithdraw" @cancel="withdrawVisible=false" unmount-on-close>',
          '<a-alert type="warning" style="margin-bottom:16px">撤回后该申请将被取消，已占用的场地或物资资源将同步释放。</a-alert>',
          '<a-form-item label="撤回原因（选填）" style="margin-top:12px"><a-textarea v-model="withdrawReason" placeholder="请简要说明撤回原因" :auto-size="{minRows:2,maxRows:4}" /></a-form-item>',
        '</a-modal>',

        /* ═══════════ 学生端扫码签到弹窗 ═══════════ */
        '<a-modal v-model:visible="scanVisible" title="扫码极速预约与开门签到" :width="480" :footer="false" unmount-on-close>',
          '<div style="text-align:center;padding:20px 10px;">',
            '<div class="sr-qrcode-box" @click="mockQrScan" style="width:200px;height:200px;margin:0 auto 16px;border:1px solid var(--sr-border);border-radius:8px;display:flex;align-items:center;justify-content:center;background:#fff;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.04);">',
              '<span style="font-size:80px;color:var(--sr-primary);"><i class="fas fa-qrcode"></i></span>',
            '</div>',
            '<strong style="font-size:15px;color:var(--sr-text-title);display:block;">模拟手机摄像头扫码</strong>',
            '<p style="font-size:12px;color:var(--sr-text-muted);margin:8px 0 0;line-height:1.5;">请站在5楼自主训练室电子班牌前，点击上方二维码框模拟扫描班牌，即可一键锁定当前空闲段并自动发送开门信号。</p>',
          '</div>',
        '</a-modal>',
      '</div>'
    ].join('');
  }

  function boot() {
    renderShell();
    var lastRole = document.body.dataset.role;
    var lastActive = document.body.dataset.active;
    var obs = new MutationObserver(function () {
      var curRole = document.body.dataset.role;
      var curActive = document.body.dataset.active;
      if (curRole === lastRole && curActive === lastActive) return;
      lastRole = curRole;
      lastActive = curActive;
      renderShell();
    });
    obs.observe(document.body, { attributes: true, attributeFilter: ['data-role', 'data-active'] });
  }

  function renderShell() {
    injectCSS();
    var content = document.querySelector('.content');
    if (!content || !shouldHandle()) {
      if (vueApp) { try { vueApp.unmount(); } catch (e) {} vueApp = null; }
      return;
    }

    content.innerHTML = '<div id="sr-app" v-cloak>' + getTemplate() + '</div>';

    waitForVue(function () {
      if (vueApp) { try { vueApp.unmount(); } catch (e) {} vueApp = null; }

      var app = Vue.createApp({
        setup: function () {
          var activePage = Vue.ref(document.body.dataset.active || '场地与物资申请');
          var role = Vue.ref(document.body.dataset.role || 'teacher');

          var isStudent = Vue.computed(function () {
            return role.value === 'student' || role.value === 'out-student';
          });

          var records = Vue.ref(INITIAL_RECORDS.slice());

          var typeFilter = Vue.ref('all');
          var statusFilter = Vue.ref('all');

          var roomModalVisible = Vue.ref(false);
          var matModalVisible = Vue.ref(false);
          var detailVisible = Vue.ref(false);
          var withdrawVisible = Vue.ref(false);
          var returnModalVisible = Vue.ref(false);
          var scanVisible = Vue.ref(false);

          var detailRecord = Vue.ref(null);
          var withdrawRecord = Vue.ref(null);
          var activeReturnRecord = Vue.ref(null);
          var uploadedPhotos = Vue.ref(0);
          var withdrawReason = Vue.ref('');

          var roleMeta = window.RoleNav && window.RoleNav.roles ? window.RoleNav.roles[role.value] : null;
          var roleNameStr = roleMeta ? roleMeta.userName : '张老师';
          var roleRoleStr = roleMeta ? roleMeta.userRole : '授课老师';

          var currentUser = Vue.reactive({
            name: roleNameStr,
            dept: roleRoleStr === '学生' || roleRoleStr === '校外学生' ? '儿科临床系' : '儿科教研室',
            phone: roleRoleStr === '学生' || roleRoleStr === '校外学生' ? '15900000000' : '13800000000'
          });

          // Form States
          var roomForm = Vue.reactive({
            phone: currentUser.phone,
            usageType: '技能训练',
            date: new Date().toISOString().split('T')[0],
            startTime: '14:00',
            endTime: '16:00',
            headcount: 12,
            reason: '',
            selectedRoom: null,
            includeMaterials: false,
            returnMethod: 'self_return'
          });

          var matForm = Vue.reactive({
            phone: currentUser.phone,
            location: '',
            usageType: '科室示教',
            startDate: new Date().toISOString().split('T')[0],
            returnDate: '',
            remark: ''
          });

          var usageOptions = Vue.computed(function () {
            return isStudent.value
              ? ['自主操作练习', '考核备考', '小组协作讨论']
              : ['课程授课', '模拟演练', '学术讲座/会议', '科室教学活动'];
          });

          var matSearchKeyword = Vue.ref('');
          var matSearchResults = Vue.ref([]);
          var selectedMatIds = Vue.reactive(new Set());

          var filteredRooms = Vue.computed(function () {
            if (isStudent.value) {
              return ROOMS.filter(function (r) { return r.floorLabel === '五楼'; });
            }
            return ROOMS;
          });

          var selectedMats = Vue.computed(function () {
            return MATERIALS.filter(function (m) { return selectedMatIds.has(m.id); });
          });

          var hasReturnableItems = Vue.computed(function () {
            if (currentTabIsRoom()) {
              return selectedMats.value.some(function (m) { return m.returns; });
            }
            return selectedMats.value.some(function (m) { return m.returns; });
          });

          function currentTabIsRoom() {
            return roomModalVisible.value;
          }

          var filteredRecords = Vue.computed(function () {
            // Live/ongoing active requests
            return records.value.filter(function (r) {
              return r.status !== 'archived' && r.status !== 'rejected';
            });
          });

          function searchMaterials() {
            var q = matSearchKeyword.value.trim().toLowerCase();
            if (!q) {
              matSearchResults.value = [];
              return;
            }
            matSearchResults.value = MATERIALS.filter(function (m) {
              return m.name.toLowerCase().indexOf(q) !== -1 || m.code.toLowerCase().indexOf(q) !== -1;
            });
          }

          function toggleMat(id) {
            if (selectedMatIds.has(id)) {
              selectedMatIds.delete(id);
            } else {
              selectedMatIds.add(id);
            }
          }

          function removeMat(id) {
            selectedMatIds.delete(id);
          }

          function openRoomModal() {
            roomForm.phone = currentUser.phone;
            roomForm.selectedRoom = filteredRooms.value[0] ? filteredRooms.value[0].id : null;
            roomForm.includeMaterials = false;
            roomForm.reason = '';
            selectedMatIds.clear();
            roomModalVisible.value = true;
          }

          function openMaterialModal() {
            matForm.phone = currentUser.phone;
            matForm.location = '';
            matForm.returnDate = '';
            matForm.remark = '';
            selectedMatIds.clear();
            matModalVisible.value = true;
          }

          function submitRoom() {
            var room = ROOMS.find(function (r) { return r.id === roomForm.selectedRoom; });
            if (!room) {
              window.ArcoVue.Message.warning('请选择一个场地');
              return;
            }
            records.value.unshift({
              code: 'SP-' + Math.floor(100000 + Math.random() * 900000),
              type: '空间预约',
              usageType: roomForm.usageType,
              resource: room.name,
              date: roomForm.date,
              timeRange: roomForm.startTime + ' - ' + roomForm.endTime,
              headcount: roomForm.headcount,
              status: 'pending',
              returnMethod: roomForm.returnMethod,
              items: selectedMats.value.map(function (m) { return m.name; }),
              needsReturn: hasReturnableItems.value,
              reason: roomForm.reason
            });
            roomModalVisible.value = false;
            window.ArcoVue.Message.success('场地预约申请提交成功，请等待管理员审核');
          }

          function submitMaterial() {
            if (!selectedMatIds.size) {
              window.ArcoVue.Message.warning('请先选择需要借用的物资');
              return;
            }
            if (hasReturnableItems.value && !matForm.returnDate) {
              window.ArcoVue.Message.warning('清单中包含需归还的教学模型，请指定归还日期');
              return;
            }
            var matsStr = selectedMats.value.map(function (m) { return m.name; }).join('、');
            records.value.unshift({
              code: 'MT-' + Math.floor(100000 + Math.random() * 900000),
              type: '物资借用',
              usageType: matForm.usageType,
              resource: matsStr.length > 24 ? matsStr.substring(0, 24) + '...' : matsStr,
              date: matForm.startDate,
              timeRange: '当日前提取',
              headcount: 0,
              status: 'pending',
              returnMethod: hasReturnableItems.value ? 'self_return' : 'disposable_only',
              items: selectedMats.value.map(function (m) { return m.name; }),
              needsReturn: hasReturnableItems.value,
              reason: matForm.remark
            });
            matModalVisible.value = false;
            window.ArcoVue.Message.success('物资借出领用申请已提交');
          }

          function openSelfReturn(item) {
            activeReturnRecord.value = item;
            uploadedPhotos.value = 0;
            returnModalVisible.value = true;
          }

          function mockUploadPhoto() {
            uploadedPhotos.value = 1;
            window.ArcoVue.Message.success('照片上传就绪');
          }

          function confirmSelfReturn() {
            if (uploadedPhotos.value === 0) {
              window.ArcoVue.Message.warning('请先点击模拟拍照上传实物照片');
              return;
            }
            if (activeReturnRecord.value) {
              activeReturnRecord.value.status = 'archived';
            }
            returnModalVisible.value = false;
            window.ArcoVue.Message.success('物资自助归还成功，已流转至库管老师审核');
          }

          function openDetail(item) {
            detailRecord.value = item;
            detailVisible.value = true;
          }

          function openWithdraw(item) {
            withdrawRecord.value = item;
            withdrawReason.value = '';
            withdrawVisible.value = true;
          }

          function confirmWithdraw() {
            if (withdrawRecord.value) {
              records.value = records.value.filter(function (r) { return r.code !== withdrawRecord.value.code; });
            }
            withdrawVisible.value = false;
            window.ArcoVue.Message.success('申请单已成功撤回');
          }

          function getStatusText(status) {
            switch (status) {
              case 'pending': return '待审批';
              case 'approved': return '已通过 / 待领取';
              case 'in_use': return '使用中';
              case 'archived': return '已完成 / 已归还';
              case 'rejected': return '已驳回';
              default: return '未知';
            }
          }

          function openScanGate() {
            scanVisible.value = true;
          }

          function mockQrScan() {
            scanVisible.value = false;
            window.ArcoVue.Message.success('扫码识别成功！已匹配 501 自主训练室，门锁已自动打开，欢迎使用！');
            // Add a mock check-in record
            records.value.unshift({
              code: 'SP-' + Math.floor(100000 + Math.random() * 900000),
              type: '空间预约',
              usageType: '自主操作练习',
              resource: '501 自主训练室',
              date: new Date().toISOString().split('T')[0],
              timeRange: '当前扫码段 90分钟',
              headcount: 1,
              status: 'in_use',
              returnMethod: 'center_collect',
              items: [],
              needsReturn: false,
              reason: '门口班牌扫码极速实训开门'
            });
          }

          Vue.onMounted(function () {
            if (window.spaceReservationStartAction === 'room') {
              openRoomModal();
              window.spaceReservationStartAction = null;
            } else if (window.spaceReservationStartAction === 'material') {
              openMaterialModal();
              window.spaceReservationStartAction = null;
            }
          });

          function backToServiceHall() {
            window.navigateTo('服务大厅');
          }

          function triggerService(serviceName) {
            window.ArcoVue.Message.info({
              content: '【服务大厅】已为您成功开启《' + serviceName + '》线上自助申办通道，请在此上传您的电子证明凭据材料。',
              duration: 3500,
              showIcon: true
            });
          }

          return {
            backToServiceHall: backToServiceHall,
            triggerService: triggerService,
            activePage: activePage,
            isStudent: isStudent,
            currentUser: currentUser,
            records: records,
            filteredRecords: filteredRecords,
            typeFilter: typeFilter,
            statusFilter: statusFilter,
            roomModalVisible: roomModalVisible,
            matModalVisible: matModalVisible,
            detailVisible: detailVisible,
            withdrawVisible: withdrawVisible,
            returnModalVisible: returnModalVisible,
            scanVisible: scanVisible,
            detailRecord: detailRecord,
            withdrawRecord: withdrawRecord,
            activeReturnRecord: activeReturnRecord,
            uploadedPhotos: uploadedPhotos,
            withdrawReason: withdrawReason,
            roomForm: roomForm,
            matForm: matForm,
            usageOptions: usageOptions,
            matSearchKeyword: matSearchKeyword,
            matSearchResults: matSearchResults,
            selectedMatIds: selectedMatIds,
            filteredRooms: filteredRooms,
            selectedMats: selectedMats,
            hasReturnableItems: hasReturnableItems,
            searchMaterials: searchMaterials,
            toggleMat: toggleMat,
            removeMat: removeMat,
            openRoomModal: openRoomModal,
            openMaterialModal: openMaterialModal,
            submitRoom: submitRoom,
            submitMaterial: submitMaterial,
            openSelfReturn: openSelfReturn,
            mockUploadPhoto: mockUploadPhoto,
            confirmSelfReturn: confirmSelfReturn,
            openDetail: openDetail,
            openWithdraw: openWithdraw,
            confirmWithdraw: confirmWithdraw,
            getStatusText: getStatusText,
            openScanGate: openScanGate,
            mockQrScan: mockQrScan,
            ROOMS: ROOMS,
            MATERIALS: MATERIALS
          };
        }
      });

      app.use(window.ArcoVue);
      vueApp = app;
      vueApp.mount('#sr-app');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
}());
