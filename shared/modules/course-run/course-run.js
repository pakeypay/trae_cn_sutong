(function () {
  // Mock course batch data
  if (!window.SharedRunBatches) {
    window.SharedRunBatches = [
      {
        id: 'CN-20260601',
        name: '儿童导尿术 - 住培2026级A班',
        courseName: '儿童导尿术',
        status: 'register', // register (报名中), ready_to_start (可开课), auto_start (自动开课), failed_to_start (未开课), running (教学中), completed (结课), archived (已归档), cancelled (已取消)
        category: '通识',
        audience: '住培一年级',
        timeStr: '2026-06-15 09:00 - 11:30',
        venue: '技能模拟中心 301室',
        instructors: ['储晨 (副主任医师)', '吴春星 (主治医师)'],
        enroll: 3,
        minEnroll: 5,
        maxEnroll: 12,
        readiness: { teacher: 'ready', space: 'ready', materials: 'ready' },
        students: [
          { name: '张旭', dept: '儿内科', time: '06-01 10:12', status: 'normal' },
          { name: '李瑞', dept: '小儿外科', time: '06-01 11:45', status: 'normal' },
          { name: '王敏', dept: '新生儿科', time: '06-02 09:30', status: 'normal' }
        ]
      },
      {
        id: 'CN-20260602',
        name: '儿科腰椎穿刺术 - 儿科规培第一期',
        courseName: '儿科腰椎穿刺术',
        status: 'ready_to_start',
        category: '通识',
        audience: '住培一年级',
        timeStr: '2026-06-16 14:00 - 16:30',
        venue: '技能模拟中心 302室',
        instructors: ['富洋 (主治医师)'],
        enroll: 8,
        minEnroll: 5,
        maxEnroll: 10,
        readiness: { teacher: 'ready', space: 'ready', materials: 'ready' },
        students: [
          { name: '赵强', dept: '儿内科', time: '06-01 10:00', status: 'normal' },
          { name: '钱亮', dept: '重症医学科', time: '06-01 10:15', status: 'normal' },
          { name: '孙艳', dept: '儿外科', time: '06-01 10:30', status: 'normal' },
          { name: '李雷', dept: '门急诊', time: '06-01 11:00', status: 'normal' },
          { name: '韩梅梅', dept: '儿内科', time: '06-02 08:22', status: 'normal' },
          { name: '周博', dept: '普外科', time: '06-02 14:15', status: 'normal' },
          { name: '吴天', dept: '儿保科', time: '06-03 09:40', status: 'normal' },
          { name: '郑洁', dept: '新生儿科', time: '06-03 16:05', status: 'normal' }
        ]
      },
      {
        id: 'CN-20260603',
        name: '新生儿窒息复苏 - 住培2026级B班',
        courseName: '新生儿窒息复苏',
        status: 'auto_start',
        category: '通识',
        audience: '住培二年级',
        timeStr: '2026-06-18 10:00 - 12:00',
        venue: '急诊技能训练室 401',
        instructors: ['陈艳 (副主任医师)', '蔡小狄 (主任医师)'],
        enroll: 12, // Equal to maxEnroll -> Auto Start
        minEnroll: 6,
        maxEnroll: 12,
        readiness: { teacher: 'ready', space: 'ready', materials: 'warning' },
        students: [
          { name: '陈志飞', dept: '新生儿科', time: '05-28', status: 'normal' },
          { name: '林立', dept: '重症医学科', time: '05-28', status: 'normal' },
          { name: '徐蕾', dept: '儿内科', time: '05-28', status: 'normal' },
          { name: '郭涛', dept: '儿内科', time: '05-29', status: 'normal' },
          { name: '马丽', dept: '儿保科', time: '05-29', status: 'normal' },
          { name: '梁晨', dept: '门急诊', time: '05-30', status: 'normal' },
          { name: '邓超', dept: '普外科', time: '05-30', status: 'normal' },
          { name: '张杰', dept: '重症医学科', time: '05-30', status: 'normal' },
          { name: '谢娜', dept: '儿内科', time: '06-01', status: 'normal' },
          { name: '黄晓明', dept: '儿外科', time: '06-01', status: 'normal' },
          { name: '杨颖', dept: '骨科', time: '06-01', status: 'normal' },
          { name: '冯绍峰', dept: '儿内科', time: '06-02', status: 'normal' }
        ]
      },
      {
        id: 'CN-20260604',
        name: '小儿胸腔穿刺术 - 进修生第二期',
        courseName: '小儿胸腔穿刺术',
        status: 'failed_to_start',
        category: '通识',
        audience: '进修医师',
        timeStr: '2026-06-06 14:00 - 16:30', // Time passed, failed to reach minimum enrollment
        venue: '综合模拟训练室 305',
        instructors: ['汤梁峰 (主治医师)'],
        enroll: 2,
        minEnroll: 5,
        maxEnroll: 10,
        readiness: { teacher: 'pending', space: 'ready', materials: 'ready' },
        students: [
          { name: '高圆圆', dept: '儿内科进修', time: '06-01', status: 'normal' },
          { name: '赵又廷', dept: '骨科进修', time: '06-02', status: 'normal' }
        ]
      },
      {
        id: 'CN-20260605',
        name: '小儿缝合打结 - 住培2026级C班',
        status: 'running',
        category: '外科',
        audience: '住培一年级',
        timeStr: '2026-06-07 09:30 - 11:30', // Today
        venue: '外科技能实训室 203',
        instructors: ['王宏胜 (副主任医师)'],
        enroll: 15,
        minEnroll: 6,
        maxEnroll: 15,
        readiness: { teacher: 'ready', space: 'ready', materials: 'ready' },
        students: [
          { name: '胡歌', dept: '普外科', checkIn: '09:25', checkStatus: 'present' },
          { name: '彭于晏', dept: '普外科', checkIn: '09:28', checkStatus: 'present' },
          { name: '刘亦菲', dept: '小儿外科', checkIn: '09:22', checkStatus: 'present' },
          { name: '杨幂', dept: '骨科', checkIn: '09:30', checkStatus: 'present' },
          { name: '唐嫣', dept: '泌尿外科', checkIn: '09:20', checkStatus: 'present' },
          { name: '刘诗诗', dept: '儿外科', checkIn: '', checkStatus: 'absent' },
          { name: '霍建华', dept: '脑外科', checkIn: '09:24', checkStatus: 'present' },
          { name: '靳东', dept: '普外科', checkIn: '09:15', checkStatus: 'present' },
          { name: '王凯', dept: '普外科', checkIn: '09:27', checkStatus: 'present' },
          { name: '吴磊', dept: '骨科', checkIn: '09:29', checkStatus: 'present' },
          { name: '江疏影', dept: '普外科', checkIn: '09:26', checkStatus: 'present' },
          { name: '倪妮', dept: '小儿外科', checkIn: '09:23', checkStatus: 'present' },
          { name: '井柏然', dept: '重症医学科', checkIn: '09:25', checkStatus: 'present' },
          { name: '鹿晗', dept: '儿保科', checkIn: '09:28', checkStatus: 'present' },
          { name: '关晓彤', dept: '儿内科', checkIn: '09:27', checkStatus: 'present' }
        ]
      },
      {
        id: 'CN-20260606',
        name: '儿童骨穿与胸穿 - 进修生理论实践第一期',
        status: 'completed',
        category: '通识',
        audience: '进修医师',
        timeStr: '2026-06-05 14:00 - 16:30',
        venue: '综合模拟训练室 305',
        instructors: ['周颖 (住院医师)'],
        enroll: 8,
        minEnroll: 4,
        maxEnroll: 10,
        readiness: { teacher: 'ready', space: 'ready', materials: 'ready' },
        students: [
          { name: '高圆圆', dept: '儿内科进修', score: '92', checkStatus: 'present' },
          { name: '赵又廷', dept: '骨科进修', score: '88', checkStatus: 'present' },
          { name: '贾静雯', dept: '小儿外科进修', score: '90', checkStatus: 'present' },
          { name: '苏有朋', dept: '儿内科进修', score: '85', checkStatus: 'present' },
          { name: '陈坤', dept: '重症进修', score: '94', checkStatus: 'present' },
          { name: '周迅', dept: '新生儿进修', score: '95', checkStatus: 'present' },
          { name: '黄磊', dept: '儿保科进修', score: '89', checkStatus: 'present' },
          { name: '海清', dept: '儿内科进修', score: '91', checkStatus: 'present' }
        ]
      },
      {
        id: 'CN-20260607',
        name: '胃管洗胃 - 护理规范化培训第三期',
        status: 'archived',
        category: '通识',
        audience: '进修护士',
        timeStr: '2026-05-28 09:00 - 11:30',
        venue: '护理技能操作室 102',
        instructors: ['朱雪梅 (副主任医师)'],
        enroll: 10,
        minEnroll: 5,
        maxEnroll: 10,
        readiness: { teacher: 'ready', space: 'ready', materials: 'ready' },
        students: []
      },
      {
        id: 'CN-20260608',
        name: '儿童除颤与心肺复苏 - 校外公开课',
        status: 'cancelled',
        category: '通识',
        audience: '社会人员',
        timeStr: '2026-06-01 10:00 - 12:00',
        venue: '技能模拟中心 301室',
        instructors: ['汤梁峰 (主治医师)'],
        enroll: 2,
        minEnroll: 8,
        maxEnroll: 15,
        readiness: { teacher: 'pending', space: 'pending', materials: 'pending' },
        students: []
      }
    ];
  }
  var runBatches = window.SharedRunBatches;

  var activeTab = 'all';
  var filters = { keyword: '', category: '' };
  var currentDrawerRecord = null;

  function injectCSS() {
    if (document.getElementById('cr-module-css')) return;
    var link = document.createElement('link');
    link.id = 'cr-module-css';
    link.rel = 'stylesheet';
    link.href = '../../shared/modules/course-run/course-run.css';
    document.head.appendChild(link);
  }

  function getStatusLabel(status) {
    var map = {
      register: '报名中',
      ready_to_start: '可开课',
      auto_start: '自动开课',
      failed_to_start: '未开课',
      running: '教学实施中',
      completed: '结课待考评',
      archived: '已归档',
      cancelled: '已取消'
    };
    return map[status] || status;
  }

  function renderShell() {
    injectCSS();
    var content = document.querySelector('.content');
    if (!content || document.body.dataset.active !== '报名情况') return;

    content.innerHTML = 
      '<section class="course-run-page">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;">' +
          '<div style="display:flex;flex-direction:column;gap:4px;">' +
            '<h1 style="margin:0;font-size:18px;font-weight:600;color:#1d2129;">报名情况管理</h1>' +
            '<p style="margin:0;font-size:12px;color:#86909c;">管理已排课程的报名情况与开课状态：监控学员报名进度、判定并操作是否确认开课、自动释放或流转课程资源。</p>' +
          '</div>' +
        '</div>' +
        
        // KPI Rows
        '<div class="run-kpis p-status-summary" id="runKpiGrid"></div>' +

        // Tab menu
        '<div class="run-tabs">' +
          '<button class="run-tab active" data-tab="all">全部班次</button>' +
          '<button class="run-tab" data-tab="register">报名中</button>' +
          '<button class="run-tab" data-tab="ready_to_start">可开课</button>' +
          '<button class="run-tab" data-tab="auto_start">自动/已开课</button>' +
          '<button class="run-tab" data-tab="failed_to_start">未开课</button>' +
        '</div>' +

        // Filters Panel
        '<div class="run-table-panel p-task-container">' +
          '<div class="run-filters">' +
            '<input type="text" id="crSearchKeyword" placeholder="搜索班次名称、编码、教师...">' +
            '<select id="crCategoryFilter">' +
              '<option value="">课程分类：全部</option>' +
              '<option value="通识">通识</option>' +
              '<option value="外科">外科</option>' +
              '<option value="内科">内科</option>' +
            '</select>' +
          '</div>' +

          // Main data table
          '<table class="run-table">' +
            '<thead>' +
              '<tr>' +
                '<th>班次名称与编码</th>' +
                '<th style="width:130px;">授课老师</th>' +
                '<th style="width:170px;">时间与地点</th>' +
                '<th style="width:180px;">报名进度</th>' +
                '<th style="width:100px;">当前状态</th>' +
                '<th style="width:160px;text-align:right;">操作</th>' +
              '</tr>' +
            '</thead>' +
            '<tbody id="runTableRows"></tbody>' +
          '</table>' +
        '</div>' +

        // Sliding Drawer
        '<div class="run-drawer-mask" id="runDrawerMask"></div>' +
        '<aside class="run-drawer" id="runDrawer">' +
          '<div class="drawer-header">' +
            '<h3 id="runDrawerTitle">课程运行单</h3>' +
            '<button class="drawer-close-btn" id="runDrawerClose">✕</button>' +
          '</div>' +
          '<div class="drawer-scroller" id="runDrawerBody"></div>' +
          '<div class="drawer-actions" id="runDrawerActions"></div>' +
        '</aside>' +

        // Toast Notification
        '<div class="run-toast" id="runToast">' +
          '<span id="runToastIcon">ℹ️</span>' +
          '<span id="runToastText"></span>' +
        '</div>' +
      '</section>';

    bindEvents();
    renderKpis();
    renderTable();
  }

  function renderKpis() {
    var kpiGrid = document.getElementById('runKpiGrid');
    if (!kpiGrid) return;

    var registerCount = runBatches.filter(function (x) { return x.status === 'register'; }).length;
    var readyCount = runBatches.filter(function (x) { return x.status === 'ready_to_start'; }).length;
    var runningCount = runBatches.filter(function (x) { return x.status === 'running' || x.status === 'auto_start'; }).length;
    var failedCount = runBatches.filter(function (x) { return x.status === 'failed_to_start'; }).length;

    kpiGrid.innerHTML =
      '<div class="kpi-card">' +
        '<div class="kpi-left">' +
          '<span class="kpi-label">正在报名中</span>' +
          '<span class="kpi-val" style="color:#165dff;">' + registerCount + '</span>' +
        '</div>' +
        '<div class="kpi-icon" style="color:#165dff;background:#e8f3ff;"><svg class="lucide" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-2 2v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></div>' +
      '</div>' +
      '<div class="kpi-card">' +
        '<div class="kpi-left">' +
          '<span class="kpi-label">已达到起开标准（可开课）</span>' +
          '<span class="kpi-val" style="color:#00b42a;">' + readyCount + '</span>' +
        '</div>' +
        '<div class="kpi-icon" style="color:#00b42a;background:#e8ffea;"><svg class="lucide" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg></div>' +
      '</div>' +
      '<div class="kpi-card">' +
        '<div class="kpi-left">' +
          '<span class="kpi-label">自动/正在教学中</span>' +
          '<span class="kpi-val" style="color:#16a34a;">' + runningCount + '</span>' +
        '</div>' +
        '<div class="kpi-icon" style="color:#16a34a;background:#e8ffea;"><svg class="lucide" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg></div>' +
      '</div>' +
      '<div class="kpi-card' + (failedCount > 0 ? ' danger' : '') + '">' +
        '<div class="kpi-left">' +
          '<span class="kpi-label">人数不足预警（未开课）</span>' +
          '<span class="kpi-val" style="color:#f53f3f;">' + failedCount + '</span>' +
        '</div>' +
        '<div class="kpi-icon" style="color:#f53f3f;background:#ffece8;"><svg class="lucide" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></div>' +
      '</div>';
  }

  function renderTable() {
    var tbody = document.getElementById('runTableRows');
    if (!tbody) return;

    var kw = filters.keyword.trim().toLowerCase();
    var cat = filters.category;

    var records = runBatches.filter(function (record) {
      // Tab filter
      if (activeTab === 'register' && record.status !== 'register') return false;
      if (activeTab === 'ready_to_start' && record.status !== 'ready_to_start') return false;
      if (activeTab === 'auto_start' && record.status !== 'auto_start' && record.status !== 'running') return false;
      if (activeTab === 'failed_to_start' && record.status !== 'failed_to_start') return false;
      if (activeTab === 'completed' && record.status !== 'completed' && record.status !== 'archived' && record.status !== 'cancelled') return false;

      // Category filter
      if (cat && record.category !== cat) return false;

      // Keyword filter
      if (kw) {
        var matchName = record.name.toLowerCase().indexOf(kw) !== -1;
        var matchId = record.id.toLowerCase().indexOf(kw) !== -1;
        var matchTeacher = record.instructors.some(function (t) { return t.toLowerCase().indexOf(kw) !== -1; });
        var matchVenue = record.venue.toLowerCase().indexOf(kw) !== -1;
        return matchName || matchId || matchTeacher || matchVenue;
      }
      return true;
    });

    if (!records.length) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:40px;color:#86909c;"><i class="fas fa-folder-open" style="font-size:24px;opacity:0.3;display:block;margin-bottom:8px;"></i>暂无匹配的课程班次</td></tr>';
      return;
    }

    tbody.innerHTML = records.map(function (record) {
      // Enrollment HTML
      var enrollPct = Math.round((record.enroll / record.maxEnroll) * 100);
      var isWarning = (record.status === 'register' || record.status === 'failed_to_start') && record.enroll < record.minEnroll;
      var fillClass = isWarning ? 'insufficient' : 'sufficient';
      
      var enrollHtml = 
        '<div class="enroll-info">' +
          '<div class="enroll-nums">' +
            '<span>' + record.enroll + ' / ' + record.maxEnroll + '人</span>' +
            '<span style="color:#86909c;">起开:' + record.minEnroll + '</span>' +
          '</div>' +
          '<div class="enroll-bar-bg">' +
            '<div class="enroll-bar-fill ' + fillClass + '" style="width:' + enrollPct + '%;"></div>' +
          '</div>' +
          (isWarning ? '<span class="enroll-warning-text">⚠️ 人数未达最低要求</span>' : '') +
        '</div>';

      if (record.status === 'completed' || record.status === 'archived' || record.status === 'cancelled') {
        enrollHtml = '<div style="color:#4e5969;font-weight:500;">' + record.enroll + '人 已参训</div>';
      }

      // Readiness HTML
      var readinessHtml = '';
      if (record.status === 'cancelled') {
        readinessHtml = '<span style="color:#86909c;">- (已释放)</span>';
      } else {
        var tClass = record.readiness.teacher === 'ready' ? 'ready' : 'pending';
        var tText = record.readiness.teacher === 'ready' ? '师资就绪' : '师资待认';
        var sClass = record.readiness.space === 'ready' ? 'ready' : 'pending';
        var sText = record.readiness.space === 'ready' ? '场地已锁' : '场地待批';
        var mClass = record.readiness.materials === 'ready' ? 'ready' : (record.readiness.materials === 'warning' ? 'warning' : 'pending');
        var mText = record.readiness.materials === 'ready' ? '物资齐备' : (record.readiness.materials === 'warning' ? '物资缺件 ⚠️' : '无物资');

        readinessHtml = 
          '<div class="readiness-list">' +
            '<span class="readiness-badge ' + tClass + '"><i class="fas fa-chalkboard-teacher"></i> ' + tText + '</span>' +
            '<span class="readiness-badge ' + sClass + '"><i class="fas fa-door-closed"></i> ' + sText + '</span>' +
            '<span class="readiness-badge ' + mClass + '"><i class="fas fa-box-open"></i> ' + mText + '</span>' +
          '</div>';
      }

      // Status Badge
      var statusClassMap = {
        register: 'register',
        ready_to_start: 'ready_to_start',
        auto_start: 'auto_start',
        failed_to_start: 'failed_to_start',
        running: 'running',
        completed: 'completed',
        archived: 'archived',
        cancelled: 'cancelled'
      };
      var statusBadgeHtml = '<span class="run-status ' + (statusClassMap[record.status] || '') + '">' + getStatusLabel(record.status) + '</span>';

      // Actions Column — 报名情况页只承载开课前操作（报名中 / 可开课 / 未开课 / 自动或手动已开课后）
      var actionBtnHtml = '';
      var rowClickable = ' style="cursor:pointer;" onclick="window.CourseRunModule.openDrawer(\'' + record.id + '\')"';
      if (record.status === 'register') {
        actionBtnHtml = '<button class="run-btn" onclick="event.stopPropagation();window.CourseRunModule.openDrawer(\'' + record.id + '\')">查看</button>';
      } else if (record.status === 'ready_to_start') {
        actionBtnHtml =
          '<button class="run-btn primary" onclick="event.stopPropagation();window.CourseRunModule.manuallyStartCourse(\'' + record.id + '\')"><i class="fas fa-play"></i> 手动开课</button>' +
          '<button class="run-btn" style="margin-left:4px;" onclick="event.stopPropagation();window.CourseRunModule.openDrawer(\'' + record.id + '\')">查看</button>';
      } else if (record.status === 'failed_to_start') {
        actionBtnHtml =
          '<button class="run-btn primary" style="background:#ff7d00;border-color:#ff7d00;color:#fff;" onclick="event.stopPropagation();window.CourseRunModule.adjustCourse(\'' + record.id + '\')"><i class="fas fa-edit"></i> 改课</button>' +
          '<button class="run-btn" style="margin-left:4px;" onclick="event.stopPropagation();window.CourseRunModule.openDrawer(\'' + record.id + '\')">查看</button>';
      } else {
        // auto_start / running / completed / archived / cancelled — 已超出报名情况页职责范围
        actionBtnHtml = '<button class="run-btn" onclick="event.stopPropagation();window.CourseRunModule.openDrawer(\'' + record.id + '\')">查看</button>';
      }

      return '<tr' + rowClickable + '>' +
        '<td>' +
          '<div style="font-weight:600;font-size:13.5px;color:#1d2129;margin-bottom:2px;">' + record.name + '</div>' +
          '<div style="font-size:11px;color:#86909c;">编码: ' + record.id + ' · ' + record.category + ' · ' + record.audience + '</div>' +
        '</td>' +
        '<td style="color:#4e5969;font-size:12.5px;">' + record.instructors.join('<br>') + '</td>' +
        '<td>' +
          '<div style="color:#1d2129;font-size:12.5px;margin-bottom:2px;"><i class="far fa-clock" style="color:#86909c;margin-right:4px;"></i>' + record.timeStr + '</div>' +
          '<div style="color:#4e5969;font-size:12px;"><i class="fas fa-map-marker-alt" style="color:#86909c;margin-right:4px;"></i>' + record.venue + '</div>' +
        '</td>' +
        '<td>' + enrollHtml + '</td>' +
        '<td>' + statusBadgeHtml + '</td>' +
        '<td style="text-align:right;white-space:nowrap;">' + actionBtnHtml + '</td>' +
      '</tr>';
    }).join('');
  }

  function openDrawer(recordId) {
    var record = runBatches.find(function (x) { return x.id === recordId; });
    if (!record) return;
    currentDrawerRecord = record;

    var drawer = document.getElementById('runDrawer');
    var mask = document.getElementById('runDrawerMask');
    var titleEl = document.getElementById('runDrawerTitle');
    var bodyEl = document.getElementById('runDrawerBody');
    var actionsEl = document.getElementById('runDrawerActions');

    titleEl.innerHTML = '<span style="color:#86909c;font-size:13px;font-weight:400;margin-right:8px;">CN-RUN-SHEET</span>' + record.name;

    var bodyHtml = '';

    // Metadata section
    bodyHtml += 
      '<section class="sheet-sec">' +
        '<h4 class="sheet-sec-title">班次基本信息</h4>' +
        '<div class="meta-grid">' +
          '<div class="meta-item"><span class="meta-label">课程名称</span><span class="meta-val">' + record.courseName + '</span></div>' +
          '<div class="meta-item"><span class="meta-label">班次编码</span><span class="meta-val">' + record.id + '</span></div>' +
          '<div class="meta-item"><span class="meta-label">授课时间</span><span class="meta-val">' + record.timeStr + '</span></div>' +
          '<div class="meta-item"><span class="meta-label">教学场地</span><span class="meta-val">' + record.venue + '</span></div>' +
          '<div class="meta-item"><span class="meta-label">适用对象</span><span class="meta-val">' + record.audience + '</span></div>' +
          '<div class="meta-item"><span class="meta-label">任课老师</span><span class="meta-val">' + record.instructors.join(', ') + '</span></div>' +
          '<div class="meta-item"><span class="meta-label">当前状态</span><span class="meta-val"><span class="run-status ' + record.status + '">' + getStatusLabel(record.status) + '</span></span></div>' +
        '</div>' +
      '</section>';

    // Target Threshold Warning Banner
    if (record.status === 'register' || record.status === 'failed_to_start' || record.status === 'ready_to_start' || record.status === 'auto_start') {
      var bannerClass = '';
      var icon = '⚠️';
      var bannerTitle = '';
      var bannerDesc = '';

      if (record.status === 'register') {
        bannerClass = '';
        bannerTitle = '课程正在选课报名中';
        bannerDesc = '该班次最低要求 <strong>' + record.minEnroll + '</strong> 人，当前已有 <strong>' + record.enroll + '</strong> 人报名。报名阶段管理员无需干预，名额报满后将自动启动开课。';
      } else if (record.status === 'ready_to_start') {
        bannerClass = 'ok';
        icon = '✅';
        bannerTitle = '报名人数已达起开门槛（已可开课）';
        bannerDesc = '该班次已成功报名 <strong>' + record.enroll + '</strong> 名学员，达到最低 <strong>' + record.minEnroll + '</strong> 人的要求。您可以随时点击下方的“手动开课”进入实施，或者等待时间截止后继续开课。';
      } else if (record.status === 'auto_start') {
        bannerClass = 'ok';
        icon = '🚀';
        bannerTitle = '报名人数已满（自动开课）';
        bannerDesc = '该班次名额已全部报满（<strong>' + record.enroll + ' / ' + record.maxEnroll + '</strong> 人），系统已自动完成锁定并开启准备流程。';
      } else if (record.status === 'failed_to_start') {
        bannerClass = '';
        bannerTitle = '报名截止人数未达标（未开课）';
        bannerDesc = '截止到开课期限，仅有 <strong>' + record.enroll + '</strong> 名学员报名（最低要求 <strong>' + record.minEnroll + '</strong> 人）。根据规则已标记为【未开课】，您可以点击下方的“改课”重新调整该班次的时间/场地，或直接“取消开课”。';
      }

      bodyHtml += 
        '<div class="threshold-banner ' + bannerClass + '">' +
          '<span class="threshold-banner-icon">' + icon + '</span>' +
          '<div class="threshold-banner-content">' +
            '<div class="threshold-banner-title">' + bannerTitle + '</div>' +
            '<div>' + bannerDesc + '</div>' +
          '</div>' +
        '</div>';
    }



    // Student Roster Section
    if (record.status !== 'cancelled' && record.students && record.students.length > 0) {
      var rosterRows = record.students.map(function (s) {
        var statusLabel = '';
        var actionColHtml = '';

        if (record.status === 'register' || record.status === 'ready_to_start' || record.status === 'failed_to_start') {
          statusLabel = '<span class="roster-badge present">已报名</span>';
        } else if (record.status === 'running' || record.status === 'auto_start') {
          if (s.checkStatus === 'present') {
            statusLabel = '<span class="roster-badge present"><i class="fas fa-check"></i> ' + s.checkIn + ' 已签</span>';
          } else {
            statusLabel = '<span class="roster-badge absent">缺席</span>';
          }
          actionColHtml = '<button class="run-btn" onclick="window.CourseRunModule.toggleAttendance(\'' + record.id + '\', \'' + s.name + '\')">补签</button>';
        } else if (record.status === 'completed' || record.status === 'archived') {
          statusLabel = '<span class="roster-badge present">已参训</span>';
          var scoreVal = s.score || '未录入';
          var scoreStyle = scoreVal === '未录入' ? 'color:#ff7d00;' : 'color:#1d2129;font-weight:600;';
          actionColHtml = '<span style="' + scoreStyle + '">得分: ' + scoreVal + '</span>';
        }

        return '<tr>' +
          '<td style="font-weight:500;">' + s.name + '</td>' +
          '<td>' + (s.dept || '-') + '</td>' +
          '<td>' + statusLabel + '</td>' +
          '<td style="text-align:right;">' + actionColHtml + '</td>' +
        '</tr>';
      }).join('');

      bodyHtml += 
        '<section class="sheet-sec">' +
          '<h4 class="sheet-sec-title">参训人员名单</h4>' +
          '<table class="roster-table">' +
            '<thead>' +
              '<tr>' +
                '<th>姓名</th>' +
                '<th>所属科室</th>' +
                '<th>考勤状态</th>' +
                '<th style="text-align:right;">操作/成绩</th>' +
              '</tr>' +
            '</thead>' +
            '<tbody>' + rosterRows + '</tbody>' +
          '</table>' +
        '</section>';
    } else if (record.status !== 'cancelled') {
      bodyHtml += 
        '<section class="sheet-sec">' +
          '<h4 class="sheet-sec-title">参训人员名单</h4>' +
          '<div class="roster-empty">当前暂无学员报名选课。</div>' +
        '</section>';
    } else {
      bodyHtml += 
        '<section class="sheet-sec">' +
          '<h4 class="sheet-sec-title">参训人员名单</h4>' +
          '<div class="roster-empty" style="color:#f53f3f;">该班次已被取消，参训人员选课退回，名额释放。</div>' +
        '</section>';
    }

    bodyEl.innerHTML = bodyHtml;

    // Drawer footer actions
    var actionsHtml = '';
    if (record.status === 'register') {
      actionsHtml = 
        '<button class="run-btn danger" style="margin-right:auto;" onclick="window.CourseRunModule.confirmCancel(\'' + record.id + '\')"><i class="fas fa-times-circle"></i> 取消开课</button>' +
        '<button class="run-btn" onclick="window.CourseRunModule.delayEnrollDeadline(\'' + record.id + '\')">延长报名</button>' +
        '<button class="run-btn" onclick="window.CourseRunModule.closeDrawer()">关闭</button>';
    } else if (record.status === 'ready_to_start') {
      actionsHtml = 
        '<button class="run-btn primary" onclick="window.CourseRunModule.manuallyStartCourse(\'' + record.id + '\')"><i class="fas fa-play"></i> 手动开课</button>' +
        '<button class="run-btn" onclick="window.CourseRunModule.delayEnrollDeadline(\'' + record.id + '\')">延长报名</button>' +
        '<button class="run-btn" onclick="window.CourseRunModule.closeDrawer()">关闭</button>';
    } else if (record.status === 'failed_to_start') {
      actionsHtml = 
        '<button class="run-btn primary" style="background:#ff7d00;border-color:#ff7d00;color:#fff;" onclick="window.CourseRunModule.adjustCourse(\'' + record.id + '\')"><i class="fas fa-edit"></i> 改课</button>' +
        '<button class="run-btn danger" onclick="window.CourseRunModule.confirmCancel(\'' + record.id + '\')"><i class="fas fa-times-circle"></i> 取消开课</button>' +
        '<button class="run-btn" onclick="window.CourseRunModule.closeDrawer()">关闭</button>';
    } else if (record.status === 'auto_start' || record.status === 'running') {
      var completeBtnLabel = record.status === 'auto_start' ? '确认完成课前准备' : '完成授课(转考评)';
      var actionMethod = record.status === 'auto_start' ? 'window.CourseRunModule.confirmPrepComplete(\'' + record.id + '\')' : 'window.CourseRunModule.finishCourseRun(\'' + record.id + '\')';
      
      actionsHtml = 
        '<button class="run-btn primary" onclick="' + actionMethod + '">' + completeBtnLabel + '</button>' +
        '<button class="run-btn" onclick="window.CourseRunModule.closeDrawer()">关闭</button>';
    } else if (record.status === 'completed') {
      actionsHtml = 
        '<button class="run-btn primary" onclick="window.CourseRunModule.recordRosterScores(\'' + record.id + '\')">保存学员成绩 & 归档</button>' +
        '<button class="run-btn" onclick="window.CourseRunModule.closeDrawer()">关闭</button>';
    } else {
      actionsHtml = '<button class="run-btn" onclick="window.CourseRunModule.closeDrawer()">关闭</button>';
    }
    actionsEl.innerHTML = actionsHtml;

    // Show drawer
    mask.classList.add('show');
    drawer.classList.add('show');
  }

  function closeDrawer() {
    var drawer = document.getElementById('runDrawer');
    var mask = document.getElementById('runDrawerMask');
    if (drawer) drawer.classList.remove('show');
    if (mask) mask.classList.remove('show');
    currentDrawerRecord = null;
  }

  function showToast(text, icon) {
    var toast = document.getElementById('runToast');
    var iconEl = document.getElementById('runToastIcon');
    var textEl = document.getElementById('runToastText');
    if (!toast) return;

    iconEl.textContent = icon || 'ℹ️';
    textEl.textContent = text;
    toast.classList.add('show');

    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(function () {
      toast.classList.remove('show');
    }, 3800);
  }

  // Action implementations
  function manuallyStartCourse(recordId) {
    var record = runBatches.find(function (x) { return x.id === recordId; });
    if (!record) return;

    record.status = 'running';
    closeDrawer();
    renderKpis();
    renderTable();
    showToast('已手动开启开课！已向 ' + record.enroll + ' 名已报名学员和任课老师发送上课确认通知，并通知物资库房。', '✅');
  }

  function adjustCourse(recordId) {
    var record = runBatches.find(function (x) { return x.id === recordId; });
    if (!record) return;

    // Reset status back to register and shift date forward
    record.status = 'register';
    record.timeStr = '2026-06-22 09:00 - 11:30 (已改课)';
    closeDrawer();
    renderKpis();
    renderTable();
    showToast('已成功为该班次办理改课！授课时间已调整并重新开启报名，已自动通知相关老师重新确认日程。', '📅');
  }

  function confirmCancel(recordId) {
    var record = runBatches.find(function (x) { return x.id === recordId; });
    if (!record) return;

    var confirmed = confirm(
      '确定要取消该班次吗？\n' +
      '【' + record.name + '】\n\n' +
      '注意：此操作将自动：\n' +
      '1. 释放已锁定的排课场地（' + record.venue + '）\n' +
      '2. 释放 ' + record.instructors.length + ' 位授课老师日程占用\n' +
      '3. 回收预锁定的相关教学耗材/物资\n' +
      '4. 退回并释放已报名学员名额，并自动发送短信/通知提醒。'
    );

    if (confirmed) {
      record.status = 'cancelled';
      closeDrawer();
      renderKpis();
      renderTable();
      showToast('已成功取消开课！已自动释放 ' + record.venue + ' 场地及 ' + record.instructors.join(', ') + ' 等老师的日程绑定，已发学员通知。', '✅');
    }
  }

  function delayEnrollDeadline(recordId) {
    var record = runBatches.find(function (x) { return x.id === recordId; });
    if (!record) return;

    record.maxEnroll += 3;
    showToast('已将报名截止期限延长 3 天，限额已上调至 ' + record.maxEnroll + '人。', '📅');
    if (currentDrawerRecord && currentDrawerRecord.id === recordId) {
      openDrawer(recordId);
    }
    renderTable();
  }

  function resolveMaterialsWarning(recordId) {
    var record = runBatches.find(function (x) { return x.id === recordId; });
    if (!record) return;

    record.readiness.materials = 'ready';
    showToast('已向库房自动发起跨模拟中心调拨，12 套无菌操作包已全部就绪！', '📦');
    if (currentDrawerRecord && currentDrawerRecord.id === recordId) {
      openDrawer(recordId);
    }
    renderTable();
  }

  function confirmPrepComplete(recordId) {
    var record = runBatches.find(function (x) { return x.id === recordId; });
    if (!record) return;

    record.status = 'running';
    closeDrawer();
    showToast('该班次已在 ' + record.venue + ' 现场开启实施。', '🚀');
    renderKpis();
    renderTable();
  }

  function finishCourseRun(recordId) {
    var record = runBatches.find(function (x) { return x.id === recordId; });
    if (!record) return;

    record.status = 'completed';
    closeDrawer();
    showToast('本期授课圆满结束！参训学员已收到考评打分提醒，待录入成绩。', '🎓');
    renderKpis();
    renderTable();
  }

  function toggleAttendance(recordId, studentName) {
    var record = runBatches.find(function (x) { return x.id === recordId; });
    if (!record) return;

    var s = record.students.find(function (x) { return x.name === studentName; });
    if (s) {
      s.checkStatus = 'present';
      s.checkIn = '10:05';
      showToast('成功为学员 ' + studentName + ' 补签考勤！', '✅');
      openDrawer(recordId);
    }
  }

  function recordRosterScores(recordId) {
    var record = runBatches.find(function (x) { return x.id === recordId; });
    if (!record) return;

    record.students.forEach(function (s) {
      if (!s.score) s.score = '90'; // Mock filling scores
    });
    record.status = 'archived';
    closeDrawer();
    showToast('本期课程运行数据已全部考核并归档，进入质量改进追踪系统！', '🗄️');
    renderKpis();
    renderTable();
  }

  function bindEvents() {
    // Tab filtering clicks
    document.querySelectorAll('.run-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        document.querySelectorAll('.run-tab').forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        activeTab = tab.dataset.tab;
        renderTable();
      });
    });

    // Keyword input search
    var searchInput = document.getElementById('crSearchKeyword');
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        filters.keyword = searchInput.value;
        renderTable();
      });
    }

    // Category select filter
    var catSelect = document.getElementById('crCategoryFilter');
    if (catSelect) {
      catSelect.addEventListener('change', function () {
        filters.category = catSelect.value;
        renderTable();
      });
    }

    // Close drawer events
    var closeBtn = document.getElementById('runDrawerClose');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeDrawer);
    }
    var mask = document.getElementById('runDrawerMask');
    if (mask) {
      mask.addEventListener('click', closeDrawer);
    }
  }

  // Hook into the body's data-active observer for hot-reloading in the nav-render context
  function boot() {
    renderShell();
    var lastActive = document.body.dataset.active;
    var obs = new MutationObserver(function () {
      var cur = document.body.dataset.active;
      if (cur !== lastActive) { 
        lastActive = cur; 
        renderShell(); 
      }
    });
    obs.observe(document.body, { attributes: true, attributeFilter: ['data-active'] });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  // Expose triggers globally
  window.CourseRunModule = {
    openDrawer: openDrawer,
    closeDrawer: closeDrawer,
    manuallyStartCourse: manuallyStartCourse,
    adjustCourse: adjustCourse,
    confirmCancel: confirmCancel,
    delayEnrollDeadline: delayEnrollDeadline,
    resolveMaterialsWarning: resolveMaterialsWarning,
    confirmPrepComplete: confirmPrepComplete,
    finishCourseRun: finishCourseRun,
    toggleAttendance: toggleAttendance,
    recordRosterScores: recordRosterScores
  };
}());
