(function () {
  var vueApp = null;

  function waitForDeps(callback) {
    if (window.Vue && window.Vue.createApp && window.ArcoVue) callback();
    else setTimeout(function () { waitForDeps(callback); }, 50);
  }

  function shouldHandle() {
    var role = document.body.dataset.role;
    return ['admin', 'scheduler'].indexOf(role) !== -1 && document.body.dataset.active === '班牌和大屏管理';
  }

  function injectCSS() {
    if (document.getElementById('bdm-module-css')) return;
    var script = document.querySelector('script[src$="brand-display-management.js"]');
    var link = document.createElement('link');
    link.id = 'bdm-module-css';
    link.rel = 'stylesheet';
    link.href = script ? script.src.replace(/brand-display-management\.js$/, 'brand-display-management.css') : '../shared/modules/brand-display-management/brand-display-management.css';
    document.head.appendChild(link);
  }

  var signsSeed = [
    { id: 'sg1', name: '三楼 PBL 教室班牌', serial: 'BP-301-001', location: '三楼 301 PBL 教室门口', type: '电子班牌', owner: '空间与排课管理', enabled: true, template: '课程日程模板', updatedAt: '2026-05-28 09:30', imageType: 'sign', desc: '展示今日课程、授课教师、预约状态和临时调课提醒。' },
    { id: 'sg2', name: '415 模拟手术室班牌', serial: 'BP-415-010', location: '四楼 415 模拟手术室门口', type: '电子班牌', owner: '空间与排课管理', enabled: true, template: '手术室训练模板', updatedAt: '2026-05-27 16:10', imageType: 'sign', desc: '用于门口课程确认、设备准备提示和考站状态展示。' },
    { id: 'sg3', name: 'OSCE 考站 3 班牌', serial: 'BP-503-003', location: '五楼 OSCE 考站 3', type: '考站班牌', owner: '考核评价', enabled: false, template: 'OSCE 考站模板', updatedAt: '2026-05-24 11:20', imageType: 'sign', desc: '展示考站编号、考核题组、候考提醒和考官签到状态。' }
  ];

  var screensSeed = [
    { id: 'sc1', name: '三楼大厅信息大屏', serial: 'A1234567', location: '三楼主入口大厅', type: '大厅信息屏', owner: '空间与排课管理', enabled: true, template: '大厅综合看板', updatedAt: '2026-05-29 08:40', imageType: 'screen', desc: '轮播今日排课、教室使用状态、预约审批提醒和教学通知。' },
    { id: 'sc2', name: '四楼走廊教学大屏', serial: 'C5544332', location: '四楼走廊中央', type: '大厅信息屏', owner: '空间与排课管理', enabled: false, template: '楼层引导模板', updatedAt: '2026-05-25 15:00', imageType: 'screen', desc: '展示楼层课程分布、实训室占用、设备维护和临时指引。' },
    { id: 'sc3', name: '护理实训区信息屏', serial: 'SCR-20002', location: '五楼护理实训区入口', type: '房间信息屏', owner: '护理教研室', enabled: true, template: '课程与公告模板', updatedAt: '2026-05-26 10:15', imageType: 'screen', desc: '展示实训区课程、报名二维码和重要通知。' }
  ];

  var noticesSeed = [
    { id: 'n1', title: '2026 春夏学期排课完成通知', type: '排课通知', author: '刘老师', publishTime: '2026-05-20 10:00', status: '已发布', pin: true, content: '2026 春夏学期教学排课已完成，请各教研室及时确认课程时间、地点和授课教师。如需调整，请在空间与排课管理中提交调课申请。' },
    { id: 'n2', title: '401 模拟病房设备维护公告', type: '设备维护', author: '刘老师', publishTime: '2026-05-22 09:30', status: '已发布', pin: false, content: '401 模拟病房将进行监护仪固件升级和录播系统巡检，维护期间暂停预约。已预约课程请联系排课管理员协调场地。' },
    { id: 'n3', title: 'OSCE 综合考核时间安排', type: '考核公告', author: '周主任', publishTime: '2026-05-24 08:00', status: '草稿', pin: false, content: 'OSCE 综合考核拟安排在五楼考站区进行，具体候考时间和分组名单确认后统一发布。' }
  ];

  function newDevice(kind) {
    return {
      id: '',
      name: '',
      serial: '',
      location: '',
      type: kind === 'sign' ? '电子班牌' : '大厅信息屏',
      owner: '空间与排课管理',
      enabled: true,
      template: kind === 'sign' ? '课程日程模板' : '大厅综合看板',
      updatedAt: '',
      imageType: kind === 'sign' ? 'sign' : 'screen',
      desc: ''
    };
  }

  function newNotice() {
    return { id: '', title: '', type: '排课通知', author: '刘老师', publishTime: '', status: '草稿', pin: false, content: '', targetDevice: '', targetLocation: '' };
  }

  function formatNow() {
    var d = new Date();
    var pad = function (n) { return String(n).padStart(2, '0'); };
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }

  function renderShell() {
    injectCSS();
    var content = document.querySelector('.content');
    if (!content || !shouldHandle()) {
      if (vueApp) {
        try { vueApp.unmount(); } catch (e) {}
        vueApp = null;
      }
      return;
    }

    content.innerHTML = '<div id="bdm-app" v-cloak>' + getTemplate() + '</div>';

    waitForDeps(function () {
      if (vueApp) {
        try { vueApp.unmount(); } catch (e) {}
        vueApp = null;
      }

      vueApp = Vue.createApp({
        setup: function () {
          var activeTab = Vue.ref('sign');
          var keyword = Vue.ref('');
          var statusFilter = Vue.ref('');
          var deviceDrawer = Vue.ref(false);
          var noticeDrawer = Vue.ref(false);
          var drawerMode = Vue.ref('view');
          var deviceKind = Vue.ref('sign');
          var deviceForm = Vue.reactive(newDevice('sign'));
          var noticeMode = Vue.ref('create');
          var noticeForm = Vue.reactive(newNotice());
          var signs = Vue.ref(signsSeed.slice());
          var screens = Vue.ref(screensSeed.slice());
          var notices = Vue.ref(noticesSeed.slice());

          var currentList = Vue.computed(function () {
            return activeTab.value === 'sign' ? signs.value : screens.value;
          });

          var filteredDevices = Vue.computed(function () {
            var q = keyword.value.trim().toLowerCase();
            return currentList.value.filter(function (item) {
              var text = [item.name, item.serial, item.location, item.type, item.owner].join(' ').toLowerCase();
              var hitKeyword = !q || text.indexOf(q) > -1;
              var hitStatus = statusFilter.value === '' || String(item.enabled) === statusFilter.value;
              return hitKeyword && hitStatus;
            });
          });

          var stats = Vue.computed(function () {
            var devices = signs.value.concat(screens.value);
            return {
              signs: signs.value.length,
              screens: screens.value.length,
              enabled: devices.filter(function (item) { return item.enabled; }).length,
              disabled: devices.filter(function (item) { return !item.enabled; }).length
            };
          });

          function resetDeviceForm(kind) {
            Object.assign(deviceForm, newDevice(kind));
          }

          function copyDevice(item) {
            Object.assign(deviceForm, JSON.parse(JSON.stringify(item)));
          }

          function openDevice(mode, kind, item) {
            drawerMode.value = mode;
            deviceKind.value = kind;
            if (item) copyDevice(item);
            else resetDeviceForm(kind);
            deviceDrawer.value = true;
          }

          function saveDevice() {
            if (!deviceForm.name || !deviceForm.location) {
              ArcoVue.Message.error('请填写名称和绑定位置');
              return;
            }
            var list = deviceKind.value === 'sign' ? signs.value : screens.value;
            deviceForm.updatedAt = formatNow();
            if (drawerMode.value === 'edit') {
              var index = list.findIndex(function (item) { return item.id === deviceForm.id; });
              if (index > -1) list[index] = JSON.parse(JSON.stringify(deviceForm));
              ArcoVue.Message.success('已更新' + (deviceKind.value === 'sign' ? '班牌' : '信息大屏'));
            } else {
              deviceForm.id = (deviceKind.value === 'sign' ? 'sg' : 'sc') + Date.now();
              deviceForm.serial = deviceForm.serial || (deviceKind.value === 'sign' ? 'BP-' : 'SCR-') + Math.floor(10000 + Math.random() * 89999);
              list.unshift(JSON.parse(JSON.stringify(deviceForm)));
              ArcoVue.Message.success('已新增' + (deviceKind.value === 'sign' ? '班牌' : '信息大屏'));
            }
            deviceDrawer.value = false;
          }

          function removeDevice(kind, id) {
            var list = kind === 'sign' ? signs : screens;
            var item = list.value.find(function (row) { return row.id === id; });
            list.value = list.value.filter(function (row) { return row.id !== id; });
            ArcoVue.Message.success('已删除' + (item ? '「' + item.name + '」' : '记录'));
          }

          function toggleDevice(item) {
            item.enabled = !item.enabled;
            item.updatedAt = formatNow();
            ArcoVue.Message.success(item.enabled ? '已启用' : '已停用');
          }

          function resetFilters() {
            keyword.value = '';
            statusFilter.value = '';
          }

          function copyNotice(item) {
            Object.assign(noticeForm, JSON.parse(JSON.stringify(item)));
          }

          function openNotice(mode, item) {
            noticeMode.value = mode;
            if (item) copyNotice(item);
            else Object.assign(noticeForm, newNotice());
            noticeDrawer.value = true;
          }

          function openDeviceNotice(record) {
            Object.assign(noticeForm, newNotice());
            noticeForm.targetDevice = record.name;
            noticeForm.targetLocation = record.location;
            noticeMode.value = 'create';
            noticeDrawer.value = true;
          }

          function saveNotice(immediate) {
            if (!noticeForm.title) {
              ArcoVue.Message.error('请填写公告标题');
              return;
            }
            noticeForm.status = immediate ? '已发布' : '草稿';
            noticeForm.publishTime = immediate ? formatNow() : (noticeForm.publishTime || '待发布');
            if (noticeMode.value === 'edit') {
              var index = notices.value.findIndex(function (item) { return item.id === noticeForm.id; });
              if (index > -1) notices.value[index] = JSON.parse(JSON.stringify(noticeForm));
            } else {
              noticeForm.id = 'n' + Date.now();
              notices.value.unshift(JSON.parse(JSON.stringify(noticeForm)));
            }
            noticeDrawer.value = false;
            ArcoVue.Message.success(immediate ? '通知已发布' : '通知已保存为草稿');
          }

          function publishNotice(id) {
            var item = notices.value.find(function (row) { return row.id === id; });
            if (item) {
              item.status = '已发布';
              item.publishTime = formatNow();
              ArcoVue.Message.success('通知已发布');
            }
          }

          function removeNotice(id) {
            notices.value = notices.value.filter(function (row) { return row.id !== id; });
            ArcoVue.Message.success('通知已删除');
          }

          function tabChanged(key) {
            activeTab.value = key;
            resetFilters();
          }

          return {
            activeTab: activeTab,
            keyword: keyword,
            statusFilter: statusFilter,
            deviceDrawer: deviceDrawer,
            noticeDrawer: noticeDrawer,
            drawerMode: drawerMode,
            deviceKind: deviceKind,
            deviceForm: deviceForm,
            noticeMode: noticeMode,
            noticeForm: noticeForm,
            notices: notices,
            filteredDevices: filteredDevices,
            stats: stats,
            openDevice: openDevice,
            saveDevice: saveDevice,
            removeDevice: removeDevice,
            toggleDevice: toggleDevice,
            resetFilters: resetFilters,
            openNotice: openNotice,
            openDeviceNotice: openDeviceNotice,
            saveNotice: saveNotice,
            publishNotice: publishNotice,
            removeNotice: removeNotice,
            tabChanged: tabChanged
          };
        }
      });

      vueApp.use(window.ArcoVue);
      vueApp.mount('#bdm-app');
    });
  }

  function getTemplate() {
    return [
      '<section class="bdm-page">',
      '  <div class="app-page-toolbar bdm-top-toolbar">',
      '    <div class="app-page-toolbar-left">',
      '      <strong class="app-page-title">班牌和信息大屏管理</strong>',
      '      <a-tabs class="app-page-tabs bdm-tabs" :active-key="activeTab" @change="tabChanged"><a-tab-pane key="sign" title="班牌管理"></a-tab-pane><a-tab-pane key="screen" title="信息大屏"></a-tab-pane></a-tabs>',
      '    </div>',
      '    <div class="app-page-toolbar-right">',
      '      <a-input-search v-model="keyword" allow-clear class="app-page-search bdm-search" placeholder="请输入名称、序列号或位置"></a-input-search>',
      '      <a-select v-model="statusFilter" placeholder="启用状态" allow-clear class="app-page-search bdm-status-filter"><a-option value="true">启用</a-option><a-option value="false">停用</a-option></a-select>',
      '      <a-button @click="resetFilters"><template #icon><icon-refresh /></template>重置</a-button>',
      '    </div>',
      '  </div>',
      '  <div class="bdm-stat-grid"><div class="bdm-stat"><span>班牌总数</span><strong>{{ stats.signs }}</strong></div><div class="bdm-stat"><span>信息大屏</span><strong>{{ stats.screens }}</strong></div><div class="bdm-stat"><span>启用设备</span><strong>{{ stats.enabled }}</strong></div><div class="bdm-stat"><span>停用设备</span><strong>{{ stats.disabled }}</strong></div></div>',
      '  <section class="bdm-card">',
      '    <div class="bdm-toolbar"><div class="bdm-actions"><a-button type="primary" @click="openDevice(\'create\', activeTab)"><template #icon><icon-plus /></template>{{ activeTab === \'sign\' ? \'新建班牌\' : \'新建信息大屏\' }}</a-button></div></div>',
      '    <div class="bdm-table-wrap"><a-table :data="filteredDevices" :pagination="{ pageSize: 6, showTotal: true }" row-key="id" :bordered="false"><template #columns><a-table-column title="画面" :width="150"><template #cell="{ record }"><div class="bdm-thumb" :class="record.imageType"></div></template></a-table-column><a-table-column title="基本信息" :width="230"><template #cell="{ record }"><div class="bdm-name-cell"><strong>{{ record.name }}</strong><span>{{ record.serial }}</span></div></template></a-table-column><a-table-column title="绑定位置" data-index="location"></a-table-column><a-table-column title="类型" :width="130"><template #cell="{ record }"><span class="bdm-tag" :class="{ pink: record.type.indexOf(\'大厅\') > -1, green: record.type.indexOf(\'班牌\') > -1 }">{{ record.type }}</span></template></a-table-column><a-table-column title="模板" data-index="template" :width="150"></a-table-column><a-table-column title="状态" :width="100"><template #cell="{ record }"><span class="bdm-status"><i class="bdm-dot" :class="{ off: !record.enabled }"></i>{{ record.enabled ? \'启用\' : \'停用\' }}</span></template></a-table-column><a-table-column title="操作" :width="220" align="center"><template #cell="{ record }"><span class="bdm-row-actions"><a-button type="text" size="small" @click="openDevice(\'edit\', activeTab, record)">编辑</a-button><a-popconfirm content="确认删除这条记录？" @ok="removeDevice(activeTab, record.id)"><a-button type="text" size="small" status="danger">删除</a-button></a-popconfirm><a-button type="text" size="small" @click="openDeviceNotice(record)">通知</a-button></span></template></a-table-column></template></a-table></div>',
      '  </section>',
      '  <a-drawer v-model:visible="deviceDrawer" :width="760" :title="drawerMode === \'view\' ? \'查看详情\' : (drawerMode === \'edit\' ? \'编辑\' : \'新建\') + (deviceKind === \'sign\' ? \'班牌\' : \'信息大屏\')" unmount-on-close><div class="bdm-drawer-body"><div><div class="bdm-section"><div class="bdm-section-title">基本信息</div><dl v-if="drawerMode === \'view\'" class="bdm-read-grid"><dt>名称</dt><dd>{{ deviceForm.name }}</dd><dt>设备序列号</dt><dd>{{ deviceForm.serial }}</dd><dt>绑定位置</dt><dd>{{ deviceForm.location }}</dd><dt>类型</dt><dd>{{ deviceForm.type }}</dd><dt>启用状态</dt><dd>{{ deviceForm.enabled ? \'启用\' : \'停用\' }}</dd><dt>维护归属</dt><dd>{{ deviceForm.owner }}</dd><dt>展示模板</dt><dd>{{ deviceForm.template }}</dd><dt>更新时间</dt><dd>{{ deviceForm.updatedAt }}</dd></dl><a-form v-else :model="deviceForm" layout="vertical"><div class="bdm-form-grid"><a-form-item label="名称" required><a-input v-model="deviceForm.name" placeholder="请输入名称" /></a-form-item><a-form-item label="设备序列号"><a-input v-model="deviceForm.serial" placeholder="留空自动生成" /></a-form-item><a-form-item label="绑定位置" required><a-input v-model="deviceForm.location" placeholder="如：三楼 301 门口" /></a-form-item><a-form-item label="类型"><a-select v-model="deviceForm.type"><a-option v-if="deviceKind === \'sign\'" value="电子班牌">电子班牌</a-option><a-option v-if="deviceKind === \'sign\'" value="考站班牌">考站班牌</a-option><a-option v-if="deviceKind === \'screen\'" value="大厅信息屏">大厅信息屏</a-option><a-option v-if="deviceKind === \'screen\'" value="房间信息屏">房间信息屏</a-option></a-select></a-form-item><a-form-item label="维护归属"><a-input v-model="deviceForm.owner" /></a-form-item><a-form-item label="展示模板"><a-input v-model="deviceForm.template" /></a-form-item></div><a-form-item label="启用状态"><a-switch v-model="deviceForm.enabled" /></a-form-item><a-form-item label="说明"><a-textarea v-model="deviceForm.desc" :auto-size="{ minRows: 3, maxRows: 5 }" placeholder="请输入展示用途或维护说明" /></a-form-item></a-form></div><div class="bdm-section"><div class="bdm-section-title">展示说明</div><div class="bdm-notice-detail">{{ deviceForm.desc || \'暂无说明\' }}</div></div></div><aside class="bdm-preview"><div class="bdm-preview-img" :class="deviceForm.imageType"><h3>{{ deviceForm.name || (deviceKind === \'sign\' ? \'班牌预览\' : \'信息大屏预览\') }}</h3><p>{{ deviceForm.location || \'绑定位置待填写\' }}</p><div class="bdm-preview-lines"><i></i><i></i><i></i></div></div><div class="bdm-preview-meta">图片预览：{{ deviceForm.template || \'默认模板\' }}</div></aside></div><template #footer><a-button @click="deviceDrawer = false">关闭</a-button><a-button v-if="drawerMode !== \'view\'" type="primary" @click="saveDevice">保存</a-button></template></a-drawer>',
      '  <a-drawer v-model:visible="noticeDrawer" :width="620" :title="noticeMode === \'view\' ? \'通知详情\' : (noticeMode === \'edit\' ? \'编辑通知\' : \'新建通知\')" unmount-on-close><div class="bdm-notice-layout"><div v-if="noticeMode === \'view\'" class="bdm-section"><div class="bdm-section-title">{{ noticeForm.title }}</div><dl class="bdm-read-grid"><dt>目标设备</dt><dd>{{ noticeForm.targetDevice || \'无\' }}</dd><dt>设备位置</dt><dd>{{ noticeForm.targetLocation || \'无\' }}</dd><dt>类型</dt><dd>{{ noticeForm.type }}</dd><dt>发布人</dt><dd>{{ noticeForm.author }}</dd><dt>发布时间</dt><dd>{{ noticeForm.publishTime }}</dd><dt>状态</dt><dd>{{ noticeForm.status }}</dd><dt>置顶</dt><dd>{{ noticeForm.pin ? \'是\' : \'否\' }}</dd></dl></div><a-form v-else :model="noticeForm" layout="vertical"><a-form-item label="目标设备"><a-input v-model="noticeForm.targetDevice" placeholder="目标设备" disabled /></a-form-item><a-form-item label="设备位置"><a-input v-model="noticeForm.targetLocation" placeholder="设备位置" disabled /></a-form-item><a-form-item label="通知标题" required><a-input v-model="noticeForm.title" placeholder="请输入通知标题" /></a-form-item><div class="bdm-form-grid"><a-form-item label="通知类型"><a-select v-model="noticeForm.type"><a-option value="排课通知">排课通知</a-option><a-option value="设备维护">设备维护</a-option><a-option value="考核公告">考核公告</a-option><a-option value="其他">其他</a-option></a-select></a-form-item><a-form-item label="发布人"><a-input v-model="noticeForm.author" /></a-form-item></div><a-form-item label="通知内容"><a-textarea v-model="noticeForm.content" :auto-size="{ minRows: 8, maxRows: 12 }" placeholder="请输入通知内容" /></a-form-item><a-form-item><a-checkbox v-model="noticeForm.pin">置顶展示到目标设备</a-checkbox></a-form-item></a-form><div class="bdm-notice-detail">{{ noticeForm.content || \'暂无通知内容\' }}</div></div><template #footer><a-button @click="noticeDrawer = false">关闭</a-button><a-button v-if="noticeMode !== \'view\'" @click="saveNotice(false)">保存草稿</a-button><a-button v-if="noticeMode !== \'view\'" type="primary" @click="saveNotice(true)">立即发布</a-button></template></a-drawer>',
      '</section>'
    ].join('');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', renderShell);
  else renderShell();
}());
