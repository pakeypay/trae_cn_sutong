(function () {
  const teachers = [
    { id:1, name:'王宏胜', title:'副主任医师', dept:'普外科', phone:'138****1001' }, { id:2, name:'富洋', title:'主治医师', dept:'骨科', phone:'138****1002' },
    { id:3, name:'曹萍', title:'主治医师', dept:'儿保科', phone:'138****1003' }, { id:4, name:'邱甜', title:'住院医师', dept:'门急诊', phone:'138****1004' },
    { id:5, name:'龙莎莎', title:'主治医师', dept:'内分泌代谢科', phone:'138****1005' }, { id:6, name:'李军', title:'主任医师', dept:'普外科', phone:'138****1006' },
    { id:7, name:'陈伟呈', title:'副主任医师', dept:'消化科', phone:'138****1007' }, { id:8, name:'朱雪梅', title:'副主任医师', dept:'呼吸综合科', phone:'138****1008' },
    { id:9, name:'周颖', title:'住院医师', dept:'血液科', phone:'138****1009' }, { id:10, name:'汤梁峰', title:'主治医师', dept:'神经科', phone:'138****1010' },
    { id:11, name:'缪千帆', title:'主治医师', dept:'心内科', phone:'138****1011' }, { id:12, name:'柴毅明', title:'主任医师', dept:'重症医学科', phone:'138****1012' },
    { id:13, name:'储晨', title:'副主任医师', dept:'门急诊', phone:'138****1013' }, { id:14, name:'闫钢风', title:'主任医师', dept:'重症医学科', phone:'138****1014' },
    { id:15, name:'李志华', title:'主治医师', dept:'麻醉科', phone:'138****1015' }, { id:16, name:'陶金好', title:'副主任医师', dept:'重症医学科', phone:'138****1016' },
    { id:17, name:'朱丽', title:'主治医师', dept:'骨科', phone:'138****1017' }, { id:18, name:'刘盼', title:'住院医师', dept:'呼吸综合科', phone:'138****1018' },
    { id:19, name:'诸壬卿', title:'主治医师', dept:'泌尿外科', phone:'138****1019' }, { id:20, name:'宁波', title:'主任医师', dept:'神经外科', phone:'138****1020' },
    { id:21, name:'郑继翠', title:'副主任医师', dept:'门急诊', phone:'138****1021' }, { id:22, name:'何炜婧', title:'住院医师', dept:'消化科', phone:'138****1022' },
    { id:23, name:'宋君', title:'副主任医师', dept:'内分泌代谢科', phone:'138****1023' }, { id:24, name:'吴春星', title:'主治医师', dept:'普外科', phone:'138****1024' },
    { id:25, name:'蔡小狄', title:'主任医师', dept:'重症医学科', phone:'138****1025' }, { id:26, name:'赵璐', title:'副主任医师', dept:'感染传染科', phone:'138****1026' },
    { id:27, name:'陈伟明', title:'主任医师', dept:'心内科', phone:'138****1027' }, { id:28, name:'祁媛媛', title:'住院医师', dept:'神经科', phone:'138****1028' },
    { id:29, name:'张蓉', title:'副主任医师', dept:'内分泌代谢科', phone:'138****1029' }, { id:30, name:'陈艳', title:'副主任医师', dept:'重症医学科', phone:'138****1030' },
    { id:31, name:'葛艳玲', title:'主治医师', dept:'普外急诊', phone:'138****1031' }, { id:32, name:'王一雪', title:'主任医师', dept:'重症医学科', phone:'138****1032' },
    { id:33, name:'王玉环', title:'副主任医师', dept:'消化科', phone:'138****1033' }, { id:34, name:'胡黎园', title:'住院医师', dept:'肾脏科', phone:'138****1034' },
    { id:35, name:'程若倩', title:'主治医师', dept:'内分泌代谢科', phone:'138****1035' }, { id:36, name:'马健', title:'主任医师', dept:'神经科', phone:'138****1036' },
    { id:37, name:'张澜', title:'主治医师', dept:'心胸外科', phone:'138****1037' }, { id:38, name:'朱海涛', title:'住院医师', dept:'普外科', phone:'138****1038' },
    { id:39, name:'程晔', title:'副主任医师', dept:'重症医学科', phone:'138****1039' }, { id:40, name:'赵趣鸣', title:'主治医师', dept:'超声科', phone:'138****1040' },
    { id:41, name:'陈扬', title:'副主任医师', dept:'重症医学科', phone:'138****1041' }, { id:42, name:'景延辉', title:'待填写', dept:'-', phone:'-' },
    { id:43, name:'张志强', title:'待填写', dept:'-', phone:'-' }, { id:44, name:'姚伟', title:'待填写', dept:'-', phone:'-' },
    { id:45, name:'钟海军', title:'待填写', dept:'-', phone:'-' }, { id:46, name:'郑超', title:'待填写', dept:'-', phone:'-' },
    { id:47, name:'朱志成', title:'待填写', dept:'-', phone:'-' }, { id:48, name:'孙松', title:'待填写', dept:'-', phone:'-' },
    { id:49, name:'高瑞伟', title:'待填写', dept:'-', phone:'-' }
  ];

  const audienceOptions = [
    { value: 'bk', label: '本科生', children: ['见习', '实习', '全体'].map(function (l) { return { value: l, label: l }; }) },
    { value: 'yjs', label: '研究生', children: ['一年级', '二年级', '三年级', '全体'].map(function (l) { return { value: l, label: l }; }) },
    { value: 'gp', label: '住培医师', children: ['一年级', '二年级', '三年级', '全体'].map(function (l) { return { value: l, label: l }; }) },
    { value: 'zp', label: '专培医师', children: ['内科', '外科', '其他', '医技科室', '全体'].map(function (l) { return { value: l, label: l }; }) },
    { value: 'jx', label: '进修医师', children: ['内科', '外科', '其他', '医技科室', '全体'].map(function (l) { return { value: l, label: l }; }) },
    { value: 'jxhs', label: '进修护士', children: ['内科', '外科', '其他', '医技科室', '全体'].map(function (l) { return { value: l, label: l }; }) },
    { value: 'doc', label: '医生（本院职工）', children: ['内科', '外科', '其他', '医技科室', '全体'].map(function (l) { return { value: l, label: l }; }) },
    { value: 'nur', label: '护士（本院职工）', children: ['内科', '外科', '其他', '医技科室', '全体'].map(function (l) { return { value: l, label: l }; }) },
    { value: 'she', label: '社会人员', children: [{ value: '全体', label: '全体' }] }
  ];

  function audLabel(code) {
    for (var i = 0; i < audienceOptions.length; i++) {
      var g = audienceOptions[i];
      if (g.value === code[0]) {
        for (var j = 0; j < g.children.length; j++) {
          if (g.children[j].value === code[1]) return g.label + '·' + g.children[j].label;
        }
        return g.label;
      }
    }
    return code.join('·');
  }

  function legacyAudToCodes(aud) {
    var map = { '住培一年级': ['gp','一年级'], '住培二年级': ['gp','二年级'], '住培三年级': ['gp','三年级'], 'TTT七期': ['gp','全体'] };
    if (map[aud]) return [map[aud]];
    return [['gp', '全体']];
  }

  const studentCourses = [
    { id:'pilot-ready-1', name:'儿科坏消息告知', category:'通识', audience:'住培一年级', audCodes:[['gp','一年级']], teacherIds:[12,13], depts:['医学人文教研室'], status:'configured' },
    { id:'pilot-blocked-1', name:'儿科AHA-PALS团队情境模拟训练', category:'通识', audience:'专培医师', audCodes:[['zp','内科']], teacherIds:[14,16], depts:['重症医学科'], status:'configured' },
    { id:'s1', name:'腰穿', category:'通识', audience:'住培一年级', audCodes:[['gp','一年级']], teacherIds:[4,5], depts:['重症医学科'], status:'configured' },
    { id:'s2', name:'骨穿', category:'通识', audience:'住培一年级', audCodes:[['gp','一年级']], teacherIds:[2], depts:['重症医学科'], status:'configured' },
    { id:'s3', name:'腹穿', category:'通识', audience:'住培一年级', audCodes:[['gp','一年级']], teacherIds:[6], depts:['重症医学科'], status:'configured' },
    { id:'s4', name:'胸穿', category:'通识', audience:'住培一年级', audCodes:[['gp','一年级']], teacherIds:[7], depts:['重症医学科'], status:'configured' },
    { id:'s5', name:'胃管洗胃', category:'通识', audience:'住培一年级', audCodes:[['gp','一年级']], teacherIds:[8,9], depts:['门急诊'], status:'configured' },
    { id:'s6', name:'导尿', category:'通识', audience:'住培一年级', audCodes:[['gp','一年级']], teacherIds:[10,11], depts:['重症医学科'], status:'configured' },
    { id:'s7', name:'病史采集', category:'通识', audience:'住培一年级', audCodes:[['gp','一年级']], teacherIds:[12,13], depts:['门急诊'], status:'configured' },
    { id:'s8', name:'体格检查', category:'通识', audience:'住培一年级', audCodes:[['gp','一年级']], teacherIds:[13,12], depts:['门急诊'], status:'configured' },
    { id:'s9', name:'缝合打结', category:'外科', audience:'住培一年级', audCodes:[['gp','一年级']], teacherIds:[19,42,43], depts:['普外科'], status:'configured' },
    { id:'s10', name:'扩肛灌肠', category:'外科', audience:'住培一年级', audCodes:[['gp','一年级']], teacherIds:[44,22], depts:['消化科'], status:'configured' },
    { id:'s11', name:'消毒铺巾', category:'外科', audience:'住培一年级', audCodes:[['gp','一年级']], teacherIds:[45,46], depts:['普外科'], status:'pending' },
    { id:'s12', name:'外科换药', category:'外科', audience:'住培一年级', audCodes:[['gp','一年级']], teacherIds:[23,24], depts:['普外科'], status:'configured' },
    { id:'s13', name:'休克识别+液体复苏', category:'通识', audience:'住培二年级', audCodes:[['gp','二年级']], teacherIds:[25,26], depts:['重症医学科'], status:'configured' },
    { id:'s14', name:'呼吸困难+上下气道梗阻', category:'通识', audience:'住培二年级', audCodes:[['gp','二年级']], teacherIds:[27,28], depts:['呼吸综合科'], status:'configured' },
    { id:'s15', name:'血气分析+病例模拟', category:'通识', audience:'住培二年级', audCodes:[['gp','二年级']], teacherIds:[37,30], depts:['重症医学科'], status:'configured' },
    { id:'s16', name:'输液反应+过敏性休克', category:'通识', audience:'住培二年级', audCodes:[['gp','二年级']], teacherIds:[31,32], depts:['门急诊'], status:'configured' },
    { id:'s17', name:'腹泻补液', category:'内科', audience:'住培二年级', audCodes:[['gp','二年级']], teacherIds:[33,47], depts:['消化科'], status:'configured' },
    { id:'s18', name:'酮症酸中毒', category:'内科', audience:'住培二年级', audCodes:[['gp','二年级']], teacherIds:[35,8], depts:['内分泌代谢科'], status:'configured' },
    { id:'s19', name:'惊厥急诊处理', category:'内科', audience:'住培二年级', audCodes:[['gp','二年级']], teacherIds:[36,4], depts:['神经科'], status:'pending' },
    { id:'s20', name:'外科小手术', category:'外科', audience:'住培二年级', audCodes:[['gp','二年级']], teacherIds:[24,42], depts:['普外科'], status:'configured' },
    { id:'s21', name:'腔镜基础操作', category:'外科', audience:'住培二年级', audCodes:[['gp','二年级']], teacherIds:[10,6], depts:['普外科'], status:'configured' },
    { id:'s22', name:'急腹症', category:'外科', audience:'住培二年级', audCodes:[['gp','二年级']], teacherIds:[22,48], depts:['普外急诊'], status:'configured' },
    { id:'s23', name:'创伤系列/创伤休克评估处理', category:'通识', audience:'住培三年级', audCodes:[['gp','三年级']], teacherIds:[21,39], depts:['门急诊'], status:'configured' },
    { id:'s24', name:'新生儿窒息复苏', category:'通识', audience:'住培三年级', audCodes:[['gp','三年级']], teacherIds:[37,49], depts:['新生儿诊疗中心'], status:'pushed' },
    { id:'s25', name:'严重心律失常', category:'内科', audience:'住培三年级', audCodes:[['gp','三年级']], teacherIds:[40,41], depts:['心内科'], status:'configured' },
    { id:'s26', name:'急腹症', category:'内科', audience:'住培三年级', audCodes:[['gp','三年级']], teacherIds:[22,48], depts:['消化科'], status:'configured' },
    { id:'s27', name:'气管插管', category:'内科', audience:'住培三年级', audCodes:[['gp','三年级']], teacherIds:[16,17], depts:['麻醉科'], status:'configured' },
    { id:'s28', name:'肠梗阻', category:'外科', audience:'住培三年级', audCodes:[['gp','三年级']], teacherIds:[22,48], depts:['普外科'], status:'configured' },
    { id:'s29', name:'腔镜阑尾切除', category:'外科', audience:'住培三年级', audCodes:[['gp','三年级']], teacherIds:[10,6], depts:['普外科'], status:'configured' }
  ];

  const teacherCourses = [{
    id:'t102', name:'中国儿童医学模拟导师通识课程项目', category:'通识', audience:'TTT七期', audCodes:[['gp','全体']],
    depts:['跨科室'], status:'pending',
    sessions:[
      ['s01','一阶段','七期学员一阶段理论（一）','直播',[39,25],'configured'], ['s02','一阶段','七期学员一阶段理论（二）','直播',[36,16],'configured'],
      ['s03','一阶段','七期学员一阶段理论（三）','直播',[41,30],'configured'], ['s04','一阶段','七期学员一阶段理论（四）','直播',[27,37],'configured'],
      ['s05','一阶段','七期学员一阶段理论（五）','直播',[32,16],'configured'], ['s06','一阶段','七期学员一阶段理论（六）','直播',[14,39],'configured'],
      ['s07','一阶段','七期学员一阶段理论（七）','直播',[20,36],'configured'], ['s08','一阶段','七期学员一阶段理论（八）','直播',[15,2],'configured'],
      ['s09','一阶段','七期学员一阶段理论（九）','直播',[],'pending'], ['s10','一阶段','七期学员一阶段理论（十）','直播',[],'pending'],
      ['s11','一阶段','七期学员一阶段理论（十一）','直播',[],'pending'], ['s12','一阶段','七期学员一阶段实践','线下',[14,25,39],'configured'],
      ['s13','二阶段','七期学员二阶段理论（一）','直播',[32,41],'configured'], ['s14','二阶段','七期学员二阶段理论（二）','直播',[25,16],'configured'],
      ['s15','二阶段','七期学员二阶段理论（三）','直播',[36,30],'configured'], ['s16','二阶段','七期学员二阶段理论（四）','直播',[],'pending'],
      ['s17','二阶段','七期学员二阶段理论（五）','直播',[],'pending'], ['s18','二阶段','七期学员二阶段理论（六）','直播',[],'pending'],
      ['s19','二阶段','七期学员二阶段理论（七）','直播',[],'pending'], ['s20','二阶段','七期学员二阶段实践','线下',[14,25],'pushed'],
      ['s21','三阶段','七期学员三阶段理论（一）','直播',[36,20],'configured'], ['s22','三阶段','七期学员三阶段理论（二）','直播',[],'pending'],
      ['s23','三阶段','七期学员三阶段理论（三）','直播',[],'pending'], ['s24','三阶段','七期学员三阶段理论（四）','直播',[],'pending'],
      ['s25','三阶段','七期学员三阶段实践','线下',[],'pending']
    ].map(function (s) { return { sid:s[0], phase:s[1], name:s[2], format:s[3], teacherIds:s[4], status:s[5] }; })
  }];

  let activePool = 'student';
  let filters = { keyword:'', audience:'', category:'', status:'' };
  let drawerRecord = null;
  let openMoreId = null;
  var selectedIds = new Set();
  var tooltipEl = null;
  var courseCenterPages = ['课程中心', '课程池', '课程审核'];

  function teacherInfo(id) {
    var t = teachers.find(function (x) { return x.id === id; });
    return t || { name:'-', title:'', dept:'', phone:'' };
  }

  function getRecords() {
    if (activePool === 'student') return studentCourses;
    return teacherCourses.map(function (course) {
      var sessions = course.sessions;
      var configured = sessions.filter(function (s) { return s.teacherIds.length > 0; }).length;
      var pushed = sessions.filter(function (s) { return s.status === 'pushed'; }).length;
      var status = course.status === 'pushed' ? 'pushed' : configured > 0 || pushed > 0 ? 'configured' : 'pending';
      return Object.assign({}, course, {
        teacherIds: Array.from(new Set(sessions.flatMap(function (s) { return s.teacherIds; }))),
        status: status
      });
    });
  }

  function filteredRecords() {
    return getRecords().filter(function (record) {
      var q = filters.keyword.trim().toLowerCase();
      if (q && [record.name, record.category].join(' ').toLowerCase().indexOf(q) === -1) {
        var audMatch = (record.audCodes || []).some(function (c) { return audLabel(c).toLowerCase().indexOf(q) !== -1; });
        if (!audMatch) return false;
      }
      if (filters.audience && record.audience !== filters.audience) return false;
      if (filters.category && record.category !== filters.category) return false;
      if (filters.status && record.status !== filters.status) return false;
      return true;
    });
  }

  function injectCSS() {
    if (document.getElementById('cc-module-css')) return;
    var link = document.createElement('link');
    link.id = 'cc-module-css';
    link.rel = 'stylesheet';
    link.href = '../../shared/modules/course-center/course-center.css';
    document.head.appendChild(link);
  }

  function renderShell() {
    injectCSS();
    var main = document.querySelector('.main');
    var validRoles = ['admin', 'teacher'];
    if (!main || validRoles.indexOf(document.body.dataset.role) === -1 || courseCenterPages.indexOf(document.body.dataset.active) === -1) return;
    main.innerHTML = '<section class="course-pool-page">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">' +
      '<div class="pool-tabs"><button class="pool-tab active" data-pool="student">学员培训课程池</button><button class="pool-tab" data-pool="teacher">师资培训课程池</button></div>' +
      '<label class="course-pool-search"><input id="globalCourseSearch" placeholder="搜索课程 / 教师"><span>⌕</span></label></div>' +
      '<div class="kpi-row" id="poolKpis"></div>' +
      '<section class="course-list-panel"><div class="course-list-head"><h2>课程列表</h2></div>' +
      '<div class="pool-filters"><input id="courseKeyword" placeholder="搜索课程名称…"><select id="audienceFilter"></select><select id="categoryFilter"></select><select id="statusFilter"><option value="">状态：全部</option><option value="configured">已配师资</option><option value="pending">待配师资</option><option value="pushed">已推送排课</option></select>' +
      '<div class="batch-in-filter hidden" id="batchFilterArea"><span id="selectedCount" style="white-space:nowrap;"></span><button class="pool-button" id="batchPushBtn">批量推送</button></div></div>' +
      '<table class="course-table"><thead><tr><th style="width:30px;"><input type="checkbox" id="selectAllCheck" class="head-checkbox"></th><th>课程名称</th><th style="width:68px;">分类</th><th style="width:120px;">科室</th><th style="width:150px;">适用对象</th><th style="width:auto;">师资</th><th style="width:150px;">进入排课条件</th><th style="width:68px;">状态</th><th style="width:92px;">操作</th></tr></thead><tbody id="courseRows"></tbody></table></section>' +
      '<div id="drawerMask" class="drawer-mask"></div><aside id="courseDrawer" class="course-drawer"><div class="drawer-head"><h2 id="drawerTitle"></h2><button class="drawer-close" id="drawerClose">×</button></div><div id="drawerBody" class="drawer-body"></div><div class="drawer-footer" style="display:flex;justify-content:space-between;align-items:center;"><div><button class="pool-button primary" id="drawerPush" style="display:none">推送给排课管理员</button></div><div style="display:flex;gap:8px;"><button class="pool-button" id="drawerCancel">取消</button><button class="pool-button" style="border-color:#165dff;background:#165dff;color:#fff;" id="drawerSave">保存</button></div></div></aside><div id="toast" class="toast"></div>' +
      '</section>';
    bindEvents();
    renderAll();
    initTooltip();
  }

  function initTooltip() {
    if (tooltipEl) return;
    tooltipEl = document.createElement('div');
    tooltipEl.className = 'chart-tooltip';
    document.body.appendChild(tooltipEl);
    var kpiRow = document.getElementById('poolKpis');
    kpiRow.addEventListener('mousemove', function (e) {
      var seg = e.target.closest('.seg');
      if (!seg) { tooltipEl.style.display = 'none'; return; }
      var svg = seg.parentNode;
      var raw = svg.dataset.segs;
      if (!raw) { tooltipEl.style.display = 'none'; return; }
      var allSegs;
      try { allSegs = JSON.parse(raw); } catch (_) { tooltipEl.style.display = 'none'; return; }
      var hoverName = seg.dataset.name;
      var unit = svg.dataset.unit || '';
      tooltipEl.innerHTML = allSegs.map(function (s) {
        var active = s.name === hoverName ? ' active' : '';
        return '<div class="tt-row' + active + '"><span class="tt-dot" style="background:' + s.color + '"></span><span class="tt-name">' + s.name + '</span><span class="tt-num">' + s.value + (unit ? ' ' + unit : '') + '</span></div>';
      }).join('');
      tooltipEl.style.display = 'block';
      var x = e.clientX + 14, y = e.clientY - 12;
      if (x + 130 > window.innerWidth) x = e.clientX - 130;
      if (y < 8) y = 8;
      tooltipEl.style.left = x + 'px';
      tooltipEl.style.top = y + 'px';
    });
    kpiRow.addEventListener('mouseleave', function () { tooltipEl.style.display = 'none'; });
  }

  function bindEvents() {
    document.querySelectorAll('.pool-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        activePool = tab.dataset.pool;
        document.querySelectorAll('.pool-tab').forEach(function (t) { t.classList.toggle('active', t === tab); });
        filters = { keyword:'', audience:'', category:'', status:'' };
        selectedIds = new Set();
        renderAll();
      });
    });
    ['globalCourseSearch', 'courseKeyword'].forEach(function (id) {
      document.getElementById(id).addEventListener('input', function (e) {
        filters.keyword = e.target.value;
        document.getElementById(id === 'globalCourseSearch' ? 'courseKeyword' : 'globalCourseSearch').value = e.target.value;
        selectedIds = new Set();
        renderAll();
      });
    });
    document.getElementById('audienceFilter').addEventListener('change', function (e) { filters.audience = e.target.value; renderAll(); });
    document.getElementById('categoryFilter').addEventListener('change', function (e) { filters.category = e.target.value; renderAll(); });
    document.getElementById('statusFilter').addEventListener('change', function (e) { filters.status = e.target.value; renderAll(); });
    document.getElementById('drawerClose').addEventListener('click', closeDrawer);
    document.getElementById('drawerCancel').addEventListener('click', closeDrawer);
    document.getElementById('drawerSave').addEventListener('click', closeDrawer);
    document.getElementById('drawerMask').addEventListener('click', closeDrawer);
    document.getElementById('selectAllCheck').addEventListener('change', function (e) {
      var visible = filteredRecords();
      if (e.target.checked) { visible.forEach(function (r) { selectedIds.add(r.id); }); }
      else { visible.forEach(function (r) { selectedIds.delete(r.id); }); }
      renderTable();
    });
    document.getElementById('batchPushBtn').addEventListener('click', function () {
      var pool = activePool === 'student' ? studentCourses : teacherCourses;
      selectedIds.forEach(function (id) {
        var r = pool.find(function (x) { return x.id === id; });
        if (r) r.status = 'pushed';
      });
      var count = selectedIds.size;
      selectedIds = new Set();
      renderAll();
      showToast('已推送 ' + count + ' 门课程至排课管理');
    });
    document.addEventListener('click', function () {
      if (openMoreId) { openMoreId = null; renderTable(); }
      document.querySelectorAll('.edit-dropdown.show, .cascader-panel.show, .teacher-picker.show').forEach(function (el) { el.classList.remove('show'); });
    });
  }

  function renderAll() {
    document.getElementById('globalCourseSearch').value = filters.keyword;
    document.getElementById('courseKeyword').value = filters.keyword;
    renderFilterOptions();
    renderKpis();
    renderTable();
  }

  function renderFilterOptions() {
    var records = getRecords();
    var audiences = Array.from(new Set(records.map(function (r) { return r.audience; })));
    var categories = Array.from(new Set(records.map(function (r) { return r.category; })));
    document.getElementById('audienceFilter').innerHTML = '<option value="">适用对象：全部</option>' + audiences.map(function (v) { return '<option ' + (filters.audience === v ? 'selected' : '') + '>' + v + '</option>'; }).join('');
    document.getElementById('categoryFilter').innerHTML = '<option value="">课程分类：全部</option>' + categories.map(function (v) { return '<option ' + (filters.category === v ? 'selected' : '') + '>' + v + '</option>'; }).join('');
    document.getElementById('statusFilter').value = filters.status;
  }

  function drawDonut(svg, segs, unit) {
    svg.querySelectorAll('.seg').forEach(function (e) { e.remove(); });
    if (!segs || segs.length === 0) return;
    var r = 44, C = 2 * Math.PI * r, sw = 18;
    var total = segs.reduce(function (s, g) { return s + g.value; }, 0) || 1;
    var cum = 0;
    var named = segs.filter(function (s) { return s.name; });
    svg.dataset.segs = JSON.stringify(named);
    svg.dataset.unit = unit || '';
    segs.forEach(function (seg) {
      var raw = (seg.value / total) * C;
      var gap = segs.length > 1 ? 2.8 : 0;
      var disp = Math.max(0, raw - gap);
      var el = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      el.setAttribute('class', 'seg');
      el.setAttribute('cx', '60'); el.setAttribute('cy', '60');
      el.setAttribute('r', String(r));
      el.setAttribute('fill', 'none');
      el.setAttribute('stroke', seg.color);
      el.setAttribute('stroke-width', String(sw));
      el.setAttribute('stroke-dasharray', disp + ' ' + (C - disp));
      el.setAttribute('stroke-dashoffset', String(C - cum));
      el.setAttribute('stroke-linecap', 'round');
      el.dataset.name = seg.name;
      el.dataset.value = seg.value;
      el.dataset.color = seg.color;
      el.dataset.unit = unit || '';
      svg.appendChild(el);
      cum += raw;
    });
  }

  function renderKpis() {
    var records = getRecords();
    var allTeacherIds = new Set(records.flatMap(function (r) { return r.teacherIds || []; }));
    var configured = records.filter(function (r) { return r.status === 'configured' || r.status === 'pushed'; }).length;
    var pending = records.length - configured;
    var audienceMap = {};
    records.forEach(function (r) { audienceMap[r.audience] = (audienceMap[r.audience] || 0) + 1; });
    var categoryMap = {};
    records.forEach(function (r) { categoryMap[r.category] = (categoryMap[r.category] || 0) + 1; });
    var deptSet = new Set(records.flatMap(function (r) { return r.depts || []; }));
    var titleMap = {};
    allTeacherIds.forEach(function (id) {
      var t = teachers.find(function (x) { return x.id === id; });
      var title = t ? t.title : '其他';
      titleMap[title] = (titleMap[title] || 0) + 1;
    });
    document.getElementById('poolKpis').innerHTML =
      '<div class="chart-card"><div class="chart-header"><span class="chart-header-name">总课程数按学员分布</span><span class="chart-header-count">' + records.length + '</span></div><div class="chart-wrap"><svg class="donut-svg" viewBox="0 0 120 120" id="kpiSvg1"><circle class="donut-bg" cx="60" cy="60" r="44"/></svg></div></div>' +
      '<div class="chart-card"><div class="chart-header"><span class="chart-header-name">总课程按科室分布</span><span class="chart-header-count">' + deptSet.size + '</span></div><div class="chart-wrap"><svg class="donut-svg" viewBox="0 0 120 120" id="kpiSvg2"><circle class="donut-bg" cx="60" cy="60" r="44"/></svg></div></div>' +
      '<div class="chart-card"><div class="chart-header"><span class="chart-header-name">课程师资配置进度</span><span class="chart-header-count">' + configured + '<span style="font-size:12px;color:#86909c;font-weight:400;margin-left:2px;">已配</span><span style="font-size:12px;color:#ddd;margin:0 2px;">/</span>' + pending + '<span style="font-size:12px;color:#86909c;font-weight:400;margin-left:2px;">待配</span></span></div><div class="chart-wrap"><svg class="donut-svg" viewBox="0 0 120 120" id="kpiSvg3"><circle class="donut-bg" cx="60" cy="60" r="44"/></svg></div></div>' +
      '<div class="chart-card"><div class="chart-header"><span class="chart-header-name">师资职称分布</span><span class="chart-header-count">' + allTeacherIds.size + '</span></div><div class="chart-wrap"><svg class="donut-svg" viewBox="0 0 120 120" id="kpiSvg4"><circle class="donut-bg" cx="60" cy="60" r="44"/></svg></div></div>';
    var colors1 = ['#1c6ab9','#3d9be9','#64b5f6','#7c3aed','#52c41a','#faad14'];
    var segs1 = Object.entries(audienceMap).map(function (e, i) { return { name: e[0], value: e[1], color: colors1[i % colors1.length] }; });
    drawDonut(document.getElementById('kpiSvg1'), segs1, '门');
    var colors2 = ['#1c6ab9','#26c6da','#52c41a','#faad14','#f759ab'];
    var segs2 = Object.entries(categoryMap).map(function (e, i) { return { name: e[0], value: e[1], color: colors2[i % colors2.length] }; });
    drawDonut(document.getElementById('kpiSvg2'), segs2, '门');
    var segs3 = [];
    if (configured > 0) segs3.push({ name: '已配师资', value: configured, color: '#52c41a' });
    if (pending > 0) segs3.push({ name: '待配师资', value: pending, color: '#faad14' });
    drawDonut(document.getElementById('kpiSvg3'), segs3, '门');
    var titleOrder = ['主任医师','副主任医师','主治医师','住院医师'];
    var colors4 = ['#1c6ab9','#3d9be9','#7c3aed','#52c41a'];
    var segs4 = titleOrder.filter(function (k) { return titleMap[k]; }).map(function (name, i) { return { name: name, value: titleMap[name], color: colors4[i % colors4.length] }; });
    if (titleMap['待填写']) segs4.push({ name: '其他', value: titleMap['待填写'], color: '#bbb' });
    drawDonut(document.getElementById('kpiSvg4'), segs4, '人');
  }

  function catBadge(cat) {
    var map = { '通识':'gs', '内科':'nk', '外科':'wk' };
    return '<span class="cat-badge ' + (map[cat] || '') + '">' + cat + '</span>';
  }

  function statusTag(status) {
    return '<span class="status-tag ' + status + '">' + ({ configured:'已配师资', pending:'待配师资', pushed:'已推送排课' }[status] || status) + '</span>';
  }

  function businessState(record) {
    if (window.TeachingBusiness && typeof window.TeachingBusiness.getCourseState === 'function') {
      return window.TeachingBusiness.getCourseState(record.name);
    }
    return { scenario:'unmapped', stageCode:'unmapped', stageLabel:'待梳理', tone:'neutral', blockers:[], downstream:'尚未纳入首个端到端试点。' };
  }

  function readinessState(record) {
    if (window.TeachingBusiness && typeof window.TeachingBusiness.getReadiness === 'function') {
      return window.TeachingBusiness.getReadiness(record.name);
    }
    return { completed:0, total:8, percent:0 };
  }

  function readinessTag(record) {
    var state = businessState(record);
    if (state.scenario === 'unmapped') {
      return '<div class="pool-readiness neutral"><strong>待梳理</strong><span>未纳入试点</span></div>';
    }
    var ready = readinessState(record);
    return '<div class="pool-readiness ' + state.tone + '"><strong>' + state.stageLabel + '</strong><span>' + ready.completed + '/' + ready.total + ' 项条件完成</span></div>';
  }

  function canPushToScheduling(record) {
    var state = businessState(record);
    if (state.scenario === 'unmapped') return record.status === 'configured';
    return state.stageCode === 'ready-for-plan';
  }

  function hasSchedulingHandoff(record) {
    return !!(record && window.TeachingBusiness && window.TeachingBusiness.getSchedulingHandoff && window.TeachingBusiness.getSchedulingHandoff(record.name));
  }

  function pushActionLabel(record) {
    if (record.status === 'pushed' || hasSchedulingHandoff(record)) return '已推送';
    if (record.name === '儿科坏消息告知' && canPushToScheduling(record)) return '创建开课计划';
    return canPushToScheduling(record) ? '推送排课' : '查看阻塞';
  }

  function renderTable() {
    var rows = filteredRecords();
    var tbody = document.getElementById('courseRows');
    var checked = 0;
    tbody.innerHTML = rows.map(function (record) {
      var sel = selectedIds.has(record.id);
      if (sel) checked++;
      var tIds = record.teacherIds || [];
      var names = tIds.slice(0, 3).map(function (id) { return teacherInfo(id).name; }).join('、');
      if (tIds.length > 3) names += '等';
      var deptsHtml = (record.depts || []).map(function (d) { return '<span class="dept-tag">' + d + '</span>'; }).join('');
      var audCodes = record.audCodes || legacyAudToCodes(record.audience);
      var audHtml = audCodes.map(function (c) { return '<span class="aud-tag">' + audLabel(c) + '</span>'; }).join('');
      return '<tr data-id="' + record.id + '" class="' + (sel ? 'selected' : '') + '">' +
        '<td><input type="checkbox" class="row-checkbox" data-id="' + record.id + '" ' + (sel ? 'checked' : '') + '></td>' +
        '<td><button class="course-name-link" data-open="' + record.id + '">' + record.name + '</button></td>' +
        '<td>' + catBadge(record.category) + '</td>' +
        '<td><div class="dept-tags">' + deptsHtml + '</div></td>' +
        '<td><div class="audience-cell">' + audHtml + '</div></td>' +
        '<td><span class="teacher-names">' + (names || '<span style="color:#86909c;">待配置</span>') + '</span></td>' +
        '<td>' + readinessTag(record) + '</td>' +
        '<td>' + statusTag(record.status) + '</td>' +
        '<td><div class="row-actions"><span class="row-btn ' + (canPushToScheduling(record) ? 'primary' : 'warning') + '" data-push="' + record.id + '" title="' + pushActionLabel(record) + '">' + pushActionLabel(record) + '</span>' +
        '<span class="more-wrap"><span class="row-btn" data-more="' + record.id + '" onclick="event.stopPropagation()">更多 <span style="margin-left:2px;font-size:10px;">▾</span></span>' +
        '<div class="more-dropdown" id="more_' + record.id + '"><div class="more-dropdown-item danger" data-delete="' + record.id + '">删除</div></div></span></div></td>' +
        '</tr>';
    }).join('') || '<tr><td colspan="9" style="text-align:center;color:#86909c;padding:36px">未找到符合条件的课程</td></tr>';
    var allCheck = document.getElementById('selectAllCheck');
    allCheck.checked = rows.length > 0 && checked === rows.length;
    allCheck.indeterminate = checked > 0 && checked < rows.length;
    var batchArea = document.getElementById('batchFilterArea');
    if (selectedIds.size > 0) {
      batchArea.classList.remove('hidden');
      document.getElementById('selectedCount').textContent = '已选 ' + selectedIds.size + ' 门';
    } else { batchArea.classList.add('hidden'); }
    tbody.querySelectorAll('.row-checkbox').forEach(function (box) {
      box.addEventListener('change', function (e) { e.stopPropagation(); if (box.checked) selectedIds.add(box.dataset.id); else selectedIds.delete(box.dataset.id); renderTable(); });
    });
    tbody.querySelectorAll('tr').forEach(function (tr) {
      tr.addEventListener('click', function (e) {
        if (e.target.closest('.row-checkbox') || e.target.closest('.row-actions') || e.target.closest('.more-wrap')) return;
        var id = tr.dataset.id;
        if (id) openDrawer(id);
      });
    });
    tbody.querySelectorAll('[data-push]').forEach(function (btn) { btn.addEventListener('click', function (e) { e.stopPropagation(); pushRecord(btn.dataset.push); }); });
    tbody.querySelectorAll('[data-more]').forEach(function (btn) { btn.addEventListener('click', function (e) { e.stopPropagation(); toggleMore(btn.dataset.more); }); });
    tbody.querySelectorAll('[data-delete]').forEach(function (btn) { btn.addEventListener('click', function (e) { e.stopPropagation(); deleteRecord(btn.dataset.delete); }); });
  }

  function toggleMore(id) {
    var was = openMoreId;
    openMoreId = was === id ? null : id;
    document.querySelectorAll('.more-dropdown').forEach(function (el) { el.classList.remove('show'); });
    if (openMoreId) document.getElementById('more_' + openMoreId).classList.add('show');
  }

  function deleteRecord(id) {
    var pool = activePool === 'student' ? studentCourses : teacherCourses;
    var idx = pool.findIndex(function (r) { return r.id === id; });
    if (idx !== -1) pool.splice(idx, 1);
    selectedIds.delete(id);
    openMoreId = null;
    renderAll();
    showToast('已删除课程');
  }

  function pushRecord(id) {
    var pool = activePool === 'student' ? studentCourses : teacherCourses;
    var record = pool.find(function (r) { return r.id === id; });
    if (record && (record.status === 'pushed' || hasSchedulingHandoff(record))) {
      showToast('该课程已推送至排课管理');
      return;
    }
    if (record && !canPushToScheduling(record)) {
      var state = businessState(record);
      showToast(state.blockers && state.blockers.length ? '暂不能推送：' + state.blockers[0] : '请先完成进入排课所需条件');
      openDrawer(id);
      return;
    }
    if (record && record.name === '儿科坏消息告知' && typeof window.navigateTo === 'function') {
      selectedIds.delete(id);
      if (drawerRecord && drawerRecord.id === id) closeDrawer();
      window.navigateTo('开课计划');
      return;
    }
    if (record) { record.status = 'pushed'; }
    if (record && window.TeachingBusiness && window.TeachingBusiness.recordSchedulingHandoff) {
      window.TeachingBusiness.recordSchedulingHandoff(record.name, {
        sourceVersion: '课程标准 v1.0',
        openingPlanId: 'PLAN-2026-0001',
        requestedTimeWindow: '2026 年 7 月，工作日下午',
        handedOffBy: '教务管理员'
      });
    }
    selectedIds.delete(id);
    renderAll();
    showToast('已推送至排课管理');
    if (drawerRecord && drawerRecord.id === id) closeDrawer();
  }

  function openDrawer(id) {
    drawerRecord = getRecords().find(function (r) { return r.id === id; });
    if (!drawerRecord) return;
    var record = drawerRecord;
    var pool = activePool === 'student' ? studentCourses : teacherCourses;
    var sourceRecord = pool.find(function (r) { return r.id === id; }) || record;

    document.getElementById('drawerTitle').textContent = record.name;
    var catMeta = record.category + ' · ' + (record.depts || []).join('、');

    var audCodes = record.audCodes || legacyAudToCodes(record.audience);
    var audTags = audCodes.map(function (c) { return '<span class="aud-tag">' + audLabel(c) + '</span>'; }).join(' ');

    // 授课老师卡片
    var teacherCards = (record.teacherIds || []).map(function (tid) {
      var t = teacherInfo(tid);
      return '<div class="teacher-card"><div class="tc-avatar">' + t.name.charAt(0) + '</div><div class="tc-info"><div class="tc-name">' + t.name + '</div><div class="tc-meta">' + t.title + ' · ' + t.dept + ' · ' + t.phone + '</div></div><span class="tc-remove" data-rm-tid="' + tid + '">×</span></div>';
    }).join('') || '<div style="color:#86909c;font-size:13px;padding:8px 0;">暂未配置授课老师</div>';

    // 师资选择列表
    var allTeacherHtml = teachers.map(function (t) {
      var selected = (record.teacherIds || []).indexOf(t.id) !== -1;
      return '<div class="teacher-picker-item' + (selected ? ' selected' : '') + '" data-tid="' + t.id + '"><div class="tp-avatar">' + t.name.charAt(0) + '</div><div class="tp-info"><div class="tp-name">' + t.name + '</div><div class="tp-meta">' + t.title + ' · ' + t.dept + '</div></div><div class="tp-check">' + (selected ? '✓' : '') + '</div></div>';
    }).join('');

    var isPushed = record.status === 'pushed' || hasSchedulingHandoff(record);
    var state = businessState(record);
    var ready = readinessState(record);
    var blockersHtml = (state.blockers || []).map(function (item) { return '<li>' + item + '</li>'; }).join('');
    var businessHtml = state.scenario === 'unmapped' ? '' :
      '<section class="pool-business-state ' + state.tone + '">' +
      '<div class="pool-business-state-head"><div><span>进入排课条件</span><strong>' + state.stageLabel + '</strong></div><em>' + ready.completed + '/' + ready.total + ' 项完成</em></div>' +
      '<p>' + state.downstream + '</p>' +
      (blockersHtml ? '<ul>' + blockersHtml + '</ul>' : '<div class="pool-business-clear">暂无阻塞，可继续创建开课计划并推送排课。</div>') +
      '<div class="pool-business-next"><span>' + state.ownerLabel + '</span><strong>' + state.nextAction + '</strong></div>' +
      '</section>';

    document.getElementById('drawerBody').innerHTML =
      '<div style="font-size:12px;color:#86909c;margin-bottom:12px;">' + catMeta + '</div>' +
      businessHtml +

      // 分类 - 单选
      '<div class="field-row"><div class="field-label">分类</div><div class="field-value"><div class="edit-select"><span class="edit-select-trigger" data-target="catDropdown">' + catBadge(record.category) + '</span><div class="edit-dropdown" id="catDropdown"><div class="edit-dropdown-item' + (record.category === '通识' ? ' selected' : '') + '" data-cat="通识">通识</div><div class="edit-dropdown-item' + (record.category === '内科' ? ' selected' : '') + '" data-cat="内科">内科</div><div class="edit-dropdown-item' + (record.category === '外科' ? ' selected' : '') + '" data-cat="外科">外科</div></div></div></div></div>' +

      // 科室 - 单选
      '<div class="field-row"><div class="field-label">科室</div><div class="field-value"><div class="edit-select"><span class="edit-select-trigger" data-target="deptDropdown">' + (record.depts || []).join('、') + '</span><div class="edit-dropdown" id="deptDropdown" style="min-width:180px;max-height:200px;overflow-y:auto;">' +
      ['重症医学科','门急诊','普外科','消化科','呼吸综合科','内分泌代谢科','神经科','心内科','普外急诊','新生儿诊疗中心','麻醉科','骨科','泌尿外科','神经外科','超声科','感染传染科','心胸外科','血液科','肾脏科','跨科室'].map(function (d) {
        var cur = (record.depts || [])[0];
        return '<div class="edit-dropdown-item' + (cur === d ? ' selected' : '') + '" data-dept="' + d + '">' + d + '</div>';
      }).join('') + '</div></div></div></div>' +

      // 授课对象 - 级联多选
      '<div class="field-row"><div class="field-label">授课对象</div><div class="field-value"><div class="cascader-wrap"><span class="cascader-trigger" id="audTrigger">' + audTags + '</span>' +
      '<div class="cascader-panel" id="audPanel">' +
      audienceOptions.map(function (group) {
        return '<div class="cascader-group"><div class="cascader-group-title">' + group.label + '</div>' +
          group.children.map(function (child) {
            var checked = audCodes.some(function (c) { return c[0] === group.value && c[1] === child.value; });
            return '<div class="cascader-option" data-code="' + group.value + '" data-child="' + child.value + '"><input type="checkbox" ' + (checked ? 'checked' : '') + '><label>' + child.label + '</label></div>';
          }).join('') + '</div>';
      }).join('') + '</div></div></div></div>' +

      // 授课老师
      '<div class="field-row"><div class="field-label">授课老师</div><div class="field-value" style="display:block;">' +
      '<div class="teacher-group-list">' + teacherCards + '</div>' +
      '<div class="teacher-picker-wrap"><div class="teacher-picker-trigger" id="teacherPickerTrigger">+ 从师资库添加老师</div>' +
      '<div class="teacher-picker" id="teacherPicker"><input type="text" class="tp-search" id="teacherSearch" placeholder="搜索教师姓名 / 科室">' +
      '<div class="teacher-picker-list" id="teacherPickerList">' + allTeacherHtml + '</div></div></div></div></div>' +

      // 推送
      '<div style="background:#fafafa;border-radius:6px;padding:12px 14px;"><div style="font-size:12px;color:#4e5969;margin-bottom:6px;">推送状态：<span class="status-tag ' + (isPushed ? 'pushed' : 'pending') + '" style="font-weight:500;">' + (isPushed ? '已推送' : '未推送') + '</span></div>' +
      '<div style="font-size:12px;color:#666;background:#fffbe6;border:1px solid #ffe58f;border-radius:4px;padding:8px 10px;line-height:1.5;">推送后，排课管理员将获得该课程的教师名单，逐一联系各位教师确定可授课时间，并填写<strong>教师授课信息表</strong>。</div></div>';

    var drawerPush = document.getElementById('drawerPush');
    drawerPush.style.display = isPushed ? 'none' : 'inline-block';
    drawerPush.disabled = !canPushToScheduling(record);
    drawerPush.textContent = canPushToScheduling(record)
      ? (record.name === '儿科坏消息告知' ? '创建开课计划' : '推送给排课管理员')
      : '存在阻塞，暂不能推送';
    drawerPush.onclick = function () { pushRecord(record.id); };
    document.getElementById('drawerMask').classList.add('show');
    document.getElementById('courseDrawer').classList.add('show');

    // 分类单选
    document.querySelectorAll('[data-target="catDropdown"]').forEach(function (el) {
      el.addEventListener('click', function (e) { e.stopPropagation(); toggleDropdown('catDropdown'); });
    });
    document.querySelectorAll('#catDropdown .edit-dropdown-item').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.stopPropagation();
        sourceRecord.category = el.dataset.cat;
        reopenDrawer(record.id);
      });
    });

    // 科室单选（只保留一个）
    document.querySelectorAll('[data-target="deptDropdown"]').forEach(function (el) {
      el.addEventListener('click', function (e) { e.stopPropagation(); toggleDropdown('deptDropdown'); });
    });
    document.querySelectorAll('#deptDropdown .edit-dropdown-item').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.stopPropagation();
        sourceRecord.depts = [el.dataset.dept];
        reopenDrawer(record.id);
      });
    });

    // 授课对象级联
    document.getElementById('audTrigger').addEventListener('click', function (e) { e.stopPropagation(); document.getElementById('audPanel').classList.toggle('show'); });
    document.querySelectorAll('#audPanel .cascader-option').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.stopPropagation();
        var cb = el.querySelector('input[type="checkbox"]');
        cb.checked = !cb.checked;
        var codes = sourceRecord.audCodes || legacyAudToCodes(sourceRecord.audience);
        var groupVal = el.dataset.code, childVal = el.dataset.child;
        if (cb.checked) {
          codes.push([groupVal, childVal]);
        } else {
          var idx = codes.findIndex(function (c) { return c[0] === groupVal && c[1] === childVal; });
          if (idx !== -1) codes.splice(idx, 1);
        }
        sourceRecord.audCodes = codes;
        reopenDrawer(record.id);
      });
    });

    // 师资选择
    document.getElementById('teacherPickerTrigger').addEventListener('click', function (e) { e.stopPropagation(); document.getElementById('teacherPicker').classList.toggle('show'); document.getElementById('teacherSearch').focus(); });
    document.getElementById('teacherSearch').addEventListener('input', function () {
      var q = this.value.trim().toLowerCase();
      document.querySelectorAll('#teacherPickerList .teacher-picker-item').forEach(function (el) {
        el.style.display = (!q || el.textContent.toLowerCase().indexOf(q) !== -1) ? '' : 'none';
      });
    });
    document.querySelectorAll('#teacherPickerList .teacher-picker-item').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.stopPropagation();
        var tid = parseInt(el.dataset.tid);
        var tIds = sourceRecord.teacherIds || [];
        var idx = tIds.indexOf(tid);
        if (idx !== -1) tIds.splice(idx, 1); else tIds.push(tid);
        reopenDrawer(record.id);
      });
    });

    // 移除教师
    document.querySelectorAll('[data-rm-tid]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.stopPropagation();
        var tid = parseInt(el.dataset.rmTid);
        var tIds = sourceRecord.teacherIds || [];
        var idx = tIds.indexOf(tid);
        if (idx !== -1) tIds.splice(idx, 1);
        reopenDrawer(record.id);
      });
    });
  }

  function reopenDrawer(id) {
    closeDrawer();
    openDrawer(id);
  }

  function toggleDropdown(id) {
    var el = document.getElementById(id);
    if (el) el.classList.toggle('show');
  }

  function closeDrawer() {
    document.getElementById('drawerMask').classList.remove('show');
    document.getElementById('courseDrawer').classList.remove('show');
    drawerRecord = null;
  }

  function showToast(text) {
    var toast = document.getElementById('toast');
    toast.textContent = text;
    toast.classList.add('show');
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(function () { toast.classList.remove('show'); }, 1800);
  }

  function boot() {
    renderShell();
    var lastActive = document.body.dataset.active;
    var obs = new MutationObserver(function () {
      var cur = document.body.dataset.active;
      if (cur !== lastActive) { lastActive = cur; renderShell(); }
    });
    obs.observe(document.body, { attributes: true, attributeFilter: ['data-active'] });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
}());
