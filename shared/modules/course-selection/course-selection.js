(function () {
  var vueApp = null;

  function waitForDeps(callback) {
    if (window.Vue && window.Vue.createApp && window.ArcoVue) {
      callback();
    } else {
      setTimeout(function () { waitForDeps(callback); }, 50);
    }
  }

  function shouldHandle() {
    var role = document.body.dataset.role;
    var active = document.body.dataset.active;
    return ['student', 'out-student'].indexOf(role) !== -1 && (active === '可选课程' || active === '选课报名');
  }

  function injectCSS() {
    if (document.getElementById('cs-module-css')) return;
    var script = document.querySelector('script[src$="course-selection.js"]');
    var link = document.createElement('link');
    link.id = 'cs-module-css';
    link.rel = 'stylesheet';
    link.href = script
      ? script.src.replace(/course-selection\.js$/, 'course-selection.css')
      : '../shared/modules/course-selection/course-selection.css';
    document.head.appendChild(link);
  }

  function getTemplate() {
    return [
      '<div class="cs-container">',
        '<!-- Page Header Title -->',
        '<div style="background:#fff;border-radius:8px;padding:18px 20px;border:1px solid var(--cs-border);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">',
          '<div>',
            '<div style="color:var(--cs-text-muted);font-size:12px;margin-bottom:4px;"><a-breadcrumb><a-breadcrumb-item>工作台</a-breadcrumb-item><a-breadcrumb-item>选课报名</a-breadcrumb-item></a-breadcrumb></div>',
            '<h2 style="font-size:20px;font-weight:600;color:var(--cs-text-title);">第一轮住培选课工作台</h2>',
            '<p style="color:var(--cs-text-body);font-size:13px;margin-top:4px;">请根据您的个人培养计划和学分要求，合理安排您的必修与选修实训技能课程。系统支持暂存修改，提交申请后将锁定审核。</p>',
          '</div>',
          '<div style="display:flex;gap:8px;">',
            '<a-button @click="resetSelections" :disabled="submitted" type="outline">重置选课</a-button>',
            '<a-button @click="submitSelections" :disabled="submitted || cart.length === 0" type="primary">提交选课申请</a-button>',
          '</div>',
        '</div>',

        '<!-- Credit Dashboard Panel -->',
        '<div class="cs-dashboard">',
          '<div class="cs-kpi-card">',
            '<div class="cs-kpi-icon-wrapper"><i class="fas fa-graduation-cap"></i></div>',
            '<div class="cs-kpi-info">',
              '<div class="cs-kpi-label">学位公共必修课 / 通识技能</div>',
              '<div class="cs-kpi-value">{{requiredCreditsSelected}} / 9.0 <span style="font-size:12px;color:var(--cs-text-muted);">学分</span></div>',
              '<div class="cs-kpi-progress-bar"><div class="cs-kpi-progress-inner" :style="{width: (Math.min(requiredCreditsSelected/9.0, 1)*100) + \'%\'}"></div></div>',
            '</div>',
          '</div>',
          '<div class="cs-kpi-card">',
            '<div class="cs-kpi-icon-wrapper"><i class="fas fa-flask"></i></div>',
            '<div class="cs-kpi-info">',
              '<div class="cs-kpi-label">学科专业课 / 方向实训</div>',
              '<div class="cs-kpi-value">{{majorCreditsSelected}} / 6.0 <span style="font-size:12px;color:var(--cs-text-muted);">学分</span></div>',
              '<div class="cs-kpi-progress-bar"><div class="cs-kpi-progress-inner" :style="{width: (Math.min(majorCreditsSelected/6.0, 1)*100) + \'%\', background:\'#00b374\'}"></div></div>',
            '</div>',
          '</div>',
          '<div class="cs-kpi-card">',
            '<div class="cs-kpi-icon-wrapper"><i class="fas fa-chart-pie"></i></div>',
            '<div class="cs-kpi-info">',
              '<div class="cs-kpi-label">已选学分总占比</div>',
              '<div class="cs-kpi-value">{{totalCreditsSelected}} <span style="font-size:12px;color:var(--cs-text-muted);">/ 24 最低要求学分</span></div>',
              '<div class="cs-kpi-progress-bar"><div class="cs-kpi-progress-inner" :style="{width: (Math.min(totalCreditsSelected/24.0, 1)*100) + \'%\', background:\'linear-gradient(90deg, #fa8c16, #ff7a45)\'}"></div></div>',
            '</div>',
          '</div>',
        '</div>',

        '<!-- Categories Filters -->',
        '<div class="cs-filter-panel">',
          '<div class="cs-tab-row">',
            '<div :class="[\'cs-tab\', {active: selectedCategory === \'all\'}]" @click="selectedCategory = \'all\'">全部可选课程 ({{courses.length}})</div>',
            '<div :class="[\'cs-tab\', {active: selectedCategory === \'mandatory\'}]" @click="selectedCategory = \'mandatory\'">学位必修 ({{courses.filter(c => c.isMandatory).length}})</div>',
            '<div :class="[\'cs-tab\', {active: selectedCategory === \'elective\'}]" @click="selectedCategory = \'elective\'">限选/公共课程 ({{courses.filter(c => !c.isMandatory).length}})</div>',
          '</div>',
          '<div class="cs-search-row">',
            '<a-input-search v-model="searchQuery" placeholder="搜索课程名称、讲师姓名..." style="width: 280px;"></a-input-search>',
            '<a-select v-model="creditFilter" placeholder="过滤学分" style="width: 120px;" allow-clear>',
              '<a-option :value="1.0">1.0 学分</a-option>',
              '<a-option :value="1.5">1.5 学分</a-option>',
              '<a-option :value="2.0">2.0 学分</a-option>',
            '</a-select>',
          '</div>',
        '</div>',

        '<!-- Main Panel Split Layout -->',
        '<div class="cs-workspace">',
          '<!-- Left Column: Course Cards Grid -->',
          '<div class="cs-course-list">',
            '<div v-if="filteredCourses.length === 0" style="background:#fff;border-radius:8px;padding:48px 16px;text-align:center;color:var(--cs-text-muted);border:1px dashed var(--cs-border);">',
              '暂无匹配当前过滤条件的课程',
            '</div>',
            '<div v-for="course in filteredCourses" :key="course.id" class="cs-course-card" @click="openSelectionDrawer(course)">',
              '<!-- Course Card Item Main Body -->',
              '<div class="cs-course-info">',
                '<div class="cs-course-header">',
                  '<span class="cs-course-title">{{course.name}}</span>',
                  '<a-tag v-if="course.isMandatory" color="red" size="small">必修技能</a-tag>',
                  '<a-tag v-else color="arcoblue" size="small">限选课程</a-tag>',
                  '<a-tag size="small" color="gray">{{course.subCategory}}</a-tag>',
                '</div>',
                '<div class="cs-course-desc">{{course.desc}}</div>',
                '<div class="cs-course-meta-tags">',
                  '<div class="cs-course-meta-item"><i class="fas fa-user-circle"></i> 讲师: {{course.teacher}}</div>',
                  '<div class="cs-course-meta-item"><i class="fas fa-clock"></i> 学时: {{course.hours}}学时</div>',
                  '<div class="cs-course-meta-item"><i class="fas fa-exclamation-circle"></i> 取消截止: 开课前24小时</div>',
                '</div>',
              '</div>',
              '<div class="cs-course-actions">',
                '<span class="cs-course-credit">{{course.credit}} 学分</span>',
                '<a-button size="small" type="primary" :status="isCourseInCart(course.id) ? \'success\' : \'primary\'">',
                  '{{isCourseInCart(course.id) ? \'已暂存\' : \'选课/报名\'}}',
                '</a-button>',
              '</div>',
            '</div>',
          '</div>',

          '<!-- Right Panel: Timetable Cart -->',
          '<div class="cs-right-panel">',
            '<!-- Timetable Schedule Widget -->',
            '<div class="cs-side-card">',
              '<div class="cs-side-header" style="cursor:pointer;user-select:none;" @click="timetableCollapsed = !timetableCollapsed">',
                '<span><i class="fas fa-calendar-alt"></i> 我的个人课表对齐</span>',
                '<span style="font-size:12px;color:var(--cs-text-muted);">{{timetableCollapsed ? \'展开\' : \'收起\'}}</span>',
              '</div>',
              '<div v-show="!timetableCollapsed" class="cs-timetable">',
                '<!-- Headings -->',
                '<div class="cs-tt-header"></div>',
                '<div class="cs-tt-header">一</div>',
                '<div class="cs-tt-header">二</div>',
                '<div class="cs-tt-header">三</div>',
                '<div class="cs-tt-header">四</div>',
                '<div class="cs-tt-header">五</div>',

                '<!-- AM Row -->',
                '<div class="cs-tt-time-label">上午<br><span style="font-size:8px;">09:00-12:00</span></div>',
                '<div v-for="day in [1,2,3,4,5]" :key="\'am-\'+day" :class="[\'cs-tt-cell\', getTimetableCellClass(day, \'AM\')]">',
                  '<div v-if="getTimetableSession(day, \'AM\')" class="cs-tt-item">',
                    '{{getTimetableSession(day, \'AM\').courseName}}',
                  '</div>',
                  '<div v-else-if="day === 2" class="cs-tt-shift-badge">',
                    '轮转值班',
                  '</div>',
                '</div>',

                '<!-- PM Row -->',
                '<div class="cs-tt-time-label">下午<br><span style="font-size:8px;">14:00-17:00</span></div>',
                '<div v-for="day in [1,2,3,4,5]" :key="\'pm-\'+day" :class="[\'cs-tt-cell\', getTimetableCellClass(day, \'PM\')]">',
                  '<div v-if="getTimetableSession(day, \'PM\')" class="cs-tt-item">',
                    '{{getTimetableSession(day, \'PM\').courseName}}',
                  '</div>',
                  '<div v-else-if="day === 2" class="cs-tt-shift-badge">',
                    '轮转值班',
                  '</div>',
                '</div>',
              '</div>',
              '<div v-show="!timetableCollapsed" style="padding:8px 12px;background:#fafafc;border-top:1px solid var(--cs-border);font-size:11px;color:var(--cs-text-muted);display:flex;justify-content:space-between;">',
                '<span>● 选课时段已填充</span>',
                '<span style="color:var(--cs-danger);">时段冲突</span>',
              '</div>',
            '</div>',

            '<!-- Selection Cart Detail Widget -->',
            '<div class="cs-side-card">',
              '<div class="cs-side-header">',
                '<span><i class="fas fa-shopping-cart"></i> 选课购物车 (暂存)</span>',
                '<a-tag size="small" color="blue">{{cart.length}} 门</a-tag>',
              '</div>',
              '<div class="cs-cart-list">',
                '<div v-if="cart.length === 0" class="cs-cart-empty">',
                  '暂未加入暂存课程<br><span style="font-size:11px;color:var(--cs-text-muted);margin-top:6px;display:inline-block;">请在左侧列表选择小班并加入</span>',
                '</div>',
                '<div v-for="item in cart" :key="item.sessionId" class="cs-cart-item" :style="getCartItemStyle(item)">',
                  '<div class="cs-cart-info">',
                    '<div class="cs-cart-title">{{item.courseName}}</div>',
                    '<div class="cs-cart-time">班级: {{item.sessionName}} ({{item.credit}}学分)</div>',
                    '<div style="font-size:11px;color:var(--cs-text-muted);">{{item.weekdayLabel}} {{item.timeLabel}}</div>',
                  '</div>',
                  '<span class="cs-cart-remove" @click="removeFromCart(item.sessionId)" v-if="!submitted">✕</span>',
                '</div>',
              '</div>',
              '<div class="cs-cart-footer">',
                '<div class="cs-cart-summary">',
                  '<span>已选暂存学分:</span>',
                  '<span><strong>{{totalCreditsSelected}}</strong> / 24 学分</span>',
                '</div>',
                '<a-alert v-if="submitted" type="success" show-icon style="padding:6px 12px;font-size:12px;">已正式提交，等待教务部审核...</a-alert>',
                '<a-alert v-else-if="timeConflictsList.length > 0" type="error" show-icon style="padding:6px 12px;font-size:11px;">存在 {{timeConflictsList.length}} 处排课冲突，请调整后再提交。</a-alert>',
                '<a-alert v-else type="info" style="padding:4px 8px;font-size:11px;">提示: 暂存草稿随时可修改，正式提交后不可自行撤销。</a-alert>',
              '</div>',
            '</div>',
          '</div>',
        '</div>',

        '<!-- Arco Drawer Panel for Selecting Class Sessions -->',
        '<a-drawer v-model:visible="drawerVisible" :title="currentCourse ? currentCourse.name : \'选择教学班\'" :width="540" :mask="true" :footer="false" unmount-on-close>',
          '<div v-if="currentCourse" style="display:flex;flex-direction:column;gap:16px;">',
            '<div style="background:var(--cs-primary-light);border:1px solid #c9d7ee;border-radius:6px;padding:12px 14px;color:var(--cs-primary);font-size:13px;line-height:1.5;">',
              '<strong>课程介绍：</strong>{{currentCourse.desc}}<br>',
              '<span style="font-size:12px;color:var(--cs-text-body);margin-top:6px;display:inline-block;">选择合适时间段的教学班，如果班级时段与已有课表或轮转值班发生冲突，系统将高亮予以警告提示。</span>',
            '</div>',

            '<div style="font-size:14px;font-weight:600;color:var(--cs-text-title);">全部可选小班时段：</div>',
            '<div style="display:flex;flex-direction:column;gap:10px;">',
              '<div v-for="session in currentCourse.sessions" :key="session.id" :class="[\'cs-session-row\', {conflict: hasConflictOrOverlap(session.id) && !isSessionInCart(session.id)}]">',
                '<div style="flex:1;">',
                  '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">',
                    '<strong style="font-size:14px;color:var(--cs-text-title);">{{session.name}}</strong>',
                    '<span class="cs-quota-circle-wrapper">',
                      '<i :class="[\'cs-quota-dot\', session.filled === session.capacity ? \'danger\' : (session.filled/session.capacity >= 0.8 ? \'warning\' : \'success\')]"></i>',
                      '<small style="font-size:11px;color:var(--cs-text-muted);">名额: {{session.filled}}/{{session.capacity}}</small>',
                    '</span>',
                  '</div>',
                  '<div style="font-size:13px;color:var(--cs-text-body);margin-top:2px;">时间段：{{session.weekdayLabel}} {{session.timeLabel}}</div>',
                  '<div style="font-size:12px;color:var(--cs-text-muted);display:flex;align-items:center;gap:4px;">地点: 技能中心 302 穿刺实训室</div>',
                  '<div v-if="hasConflictOrOverlap(session.id) && !isSessionInCart(session.id)" class="cs-conflict-label">',
                    '与 {{getConflictLabel(session.id)}} 冲突',
                  '</div>',
                '</div>',
                '<div>',
                  '<a-button v-if="isSessionInCart(session.id)" size="small" type="primary" status="success" @click="removeFromCart(session.id)" :disabled="submitted">已选择</a-button>',
                  '<a-button v-else-if="session.filled === session.capacity" size="small" disabled>已满额</a-button>',
                  '<a-button v-else-if="hasConflictOrOverlap(session.id)" size="small" type="outline" @click="addToCart(currentCourse, session)" :disabled="submitted">强行暂存</a-button>',
                  '<a-button v-else size="small" type="primary" @click="addToCart(currentCourse, session)" :disabled="submitted">选择此班</a-button>',
                '</div>',
              '</div>',
            '</div>',
            '<div style="margin-top:16px;border-top:1px solid var(--cs-border);padding-top:16px;text-align:right;">',
              '<a-button type="outline" @click="drawerVisible = false">关闭面板</a-button>',
            '</div>',
          '</div>',
        '</a-drawer>',
      '</div>'
    ].join('');
  }

  var COURSES = [
    { id: '1', name: '腰穿实训', isMandatory: true, subCategory: '学位必修', credit: 1.5, hours: 4, teacher: '邱甜、龙莎莎', desc: '掌握腰椎穿刺的适应证评估、穿刺定位、无菌操作配合、标本处理与术后并发症观察。', sessions: [
      { id: '101', name: '腰穿一班', weekday: 2, slot: 'AM', weekdayLabel: '周二上午', timeLabel: '09:00-12:00', filled: 13, capacity: 20 },
      { id: '102', name: '腰穿二班', weekday: 4, slot: 'PM', weekdayLabel: '周四下午', timeLabel: '14:00-17:00', filled: 20, capacity: 20 }
    ]},
    { id: '2', name: '骨髓穿刺实训', isMandatory: true, subCategory: '学位必修', credit: 1.5, hours: 4, teacher: '富洋', desc: '训练骨髓穿刺的体位摆放、穿刺定位、无菌铺巾、标本采集与术后观察要点。', sessions: [
      { id: '201', name: '骨穿一班', weekday: 1, slot: 'PM', weekdayLabel: '周一下午', timeLabel: '14:00-17:00', filled: 8, capacity: 20 },
      { id: '202', name: '骨穿二班', weekday: 3, slot: 'AM', weekdayLabel: '周三上午', timeLabel: '09:00-12:00', filled: 19, capacity: 20 }
    ]},
    { id: '3', name: '胸腔穿刺与气道管理', isMandatory: true, subCategory: '学位必修', credit: 1.5, hours: 6, teacher: '陈伟呈', desc: '训练胸腔穿刺的临床定位、无菌铺巾、穿刺流程、标本处理、胸腔闭式引流配合与术后观察。', sessions: [
      { id: '301', name: '胸穿一班', weekday: 3, slot: 'PM', weekdayLabel: '周三下午', timeLabel: '14:00-17:00', filled: 12, capacity: 25 },
      { id: '302', name: '胸穿二班', weekday: 5, slot: 'AM', weekdayLabel: '周五上午', timeLabel: '09:00-12:00', filled: 25, capacity: 25 }
    ]},
    { id: '4', name: '腹腔镜基本持镜与基本缝合技术', isMandatory: false, subCategory: '学科专业', credit: 2.0, hours: 8, teacher: '李大志', desc: '训练腔镜下双眼协调能力、深度感觉、器械操作、缝合与结扎技能。', sessions: [
      { id: '401', name: '持镜一班', weekday: 4, slot: 'AM', weekdayLabel: '周四上午', timeLabel: '09:00-12:00', filled: 6, capacity: 15 },
      { id: '402', name: '持镜二班', weekday: 5, slot: 'PM', weekdayLabel: '周五下午', timeLabel: '14:00-17:00', filled: 15, capacity: 15 }
    ]},
    { id: '5', name: '儿科危重症与高级生命支持演练', isMandatory: false, subCategory: '通识选修', credit: 1.0, hours: 4, teacher: '叶双双', desc: '掌握小儿心肺复苏、高级气道管理、除颤操作流程与复苏团队协作配合。', sessions: [
      { id: '501', name: '儿科生命支持一班', weekday: 1, slot: 'AM', weekdayLabel: '周一上午', timeLabel: '09:00-12:00', filled: 10, capacity: 30 }
    ]}
  ];

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

    content.innerHTML = '<div id="cs-app" v-cloak>' + getTemplate() + '</div>';

    waitForDeps(function () {
      if (vueApp) {
        try { vueApp.unmount(); } catch (e) {}
        vueApp = null;
      }

      var app = Vue.createApp({
        setup: function () {
          var courses = Vue.ref(COURSES);
          var cart = Vue.ref([]);
          var searchQuery = Vue.ref('');
          var selectedCategory = Vue.ref('all');
          var creditFilter = Vue.ref(undefined);
          var submitted = Vue.ref(false);
          var timetableCollapsed = Vue.ref(false);

          var drawerVisible = Vue.ref(false);
          var currentCourse = Vue.ref(null);

          // Get initial cart from local storage or empty
          var stored = localStorage.getItem('fudan_pediatric_cs_cart');
          if (stored) {
            try {
              cart.value = JSON.parse(stored);
            } catch(e) {}
          }
          var storedStatus = localStorage.getItem('fudan_pediatric_cs_submitted');
          if (storedStatus === 'true') {
            submitted.value = true;
          }

          var filteredCourses = Vue.computed(function () {
            return courses.value.filter(function (c) {
              // Category filter
              if (selectedCategory.value === 'mandatory' && !c.isMandatory) return false;
              if (selectedCategory.value === 'elective' && c.isMandatory) return false;

              // Credit filter
              if (creditFilter.value !== undefined && creditFilter.value !== null && c.credit !== creditFilter.value) return false;

              // Search query
              var query = searchQuery.value.trim().toLowerCase();
              if (query) {
                return c.name.toLowerCase().indexOf(query) !== -1 ||
                       c.teacher.toLowerCase().indexOf(query) !== -1 ||
                       c.desc.toLowerCase().indexOf(query) !== -1;
              }
              return true;
            });
          });

          var requiredCreditsSelected = Vue.computed(function () {
            return cart.value
              .filter(function (item) { return item.isMandatory; })
              .reduce(function (sum, item) { return sum + item.credit; }, 0);
          });

          var majorCreditsSelected = Vue.computed(function () {
            return cart.value
              .filter(function (item) { return !item.isMandatory; })
              .reduce(function (sum, item) { return sum + item.credit; }, 0);
          });

          var totalCreditsSelected = Vue.computed(function () {
            return requiredCreditsSelected.value + majorCreditsSelected.value;
          });

          var timeConflictsList = Vue.computed(function () {
            var list = [];
            var seen = {};
            cart.value.forEach(function (item) {
              var key = item.weekday + '-' + item.slot;
              if (seen[key]) {
                list.push({
                  key: key,
                  courseName1: seen[key].courseName,
                  courseName2: item.courseName,
                  weekdayLabel: item.weekdayLabel,
                  timeLabel: item.timeLabel
                });
              } else {
                seen[key] = item;
              }
              // Tuesday AM/PM is fixed shift shift conflict
              if (item.weekday === 2) {
                list.push({
                  key: key,
                  courseName1: '周二轮转值班',
                  courseName2: item.courseName,
                  weekdayLabel: item.weekdayLabel,
                  timeLabel: item.timeLabel
                });
              }
            });
            return list;
          });

          function isCourseInCart(courseId) {
            return cart.value.some(function (item) { return item.courseId === courseId; });
          }

          function isSessionInCart(sessionId) {
            return cart.value.some(function (item) { return item.sessionId === sessionId; });
          }

          function hasConflictOrOverlap(sessionId) {
            var currentSession = null;
            courses.value.forEach(function (c) {
              var s = c.sessions.find(function (x) { return x.id === sessionId; });
              if (s) {
                currentSession = s;
              }
            });
            if (!currentSession) return false;

            // Tuesday PM is fixed clinical shift shift conflict
            if (currentSession.weekday === 2) {
              return true;
            }

            // Check overlap in cart
            return cart.value.some(function (item) {
              return item.sessionId !== sessionId && item.weekday === currentSession.weekday && item.slot === currentSession.slot;
            });
          }

          function getConflictLabel(sessionId) {
            var currentSession = null;
            var courseName = '';
            courses.value.forEach(function (c) {
              var s = c.sessions.find(function (x) { return x.id === sessionId; });
              if (s) {
                currentSession = s;
                courseName = c.name;
              }
            });
            if (!currentSession) return '';

            if (currentSession.weekday === 2) {
              return '周二轮转值班';
            }

            var overlapItem = cart.value.find(function (item) {
              return item.sessionId !== sessionId && item.weekday === currentSession.weekday && item.slot === currentSession.slot;
            });

            return overlapItem ? overlapItem.courseName : '';
          }

          function addToCart(course, session) {
            // Remove existing session for this course if any
            cart.value = cart.value.filter(function (item) { return item.courseId !== course.id; });

            cart.value.push({
              courseId: course.id,
              courseName: course.name,
              sessionId: session.id,
              sessionName: session.name,
              weekday: session.weekday,
              slot: session.slot,
              weekdayLabel: session.weekdayLabel,
              timeLabel: session.timeLabel,
              credit: course.credit,
              isMandatory: course.isMandatory
            });

            localStorage.setItem('fudan_pediatric_cs_cart', JSON.stringify(cart.value));
            window.ArcoVue.Message.success('已加入暂存课表');
          }

          function removeFromCart(sessionId) {
            cart.value = cart.value.filter(function (item) { return item.sessionId !== sessionId; });
            localStorage.setItem('fudan_pediatric_cs_cart', JSON.stringify(cart.value));
            window.ArcoVue.Message.info('已移除暂存课程');
          }

          function resetSelections() {
            cart.value = [];
            submitted.value = false;
            localStorage.removeItem('fudan_pediatric_cs_cart');
            localStorage.removeItem('fudan_pediatric_cs_submitted');
            window.ArcoVue.Message.success('选课草稿已重置');
          }

          function submitSelections() {
            if (timeConflictsList.value.length > 0) {
              window.ArcoVue.Message.error('存在时间冲突，请调整课表后提交！');
              return;
            }
            submitted.value = true;
            localStorage.setItem('fudan_pediatric_cs_submitted', 'true');
            window.ArcoVue.Message.success('选课申请提交成功！');
          }

          function openSelectionDrawer(course) {
            currentCourse.value = course;
            drawerVisible.value = true;
          }

          function getTimetableSession(day, slot) {
            return cart.value.find(function (item) { return item.weekday === day && item.slot === slot; });
          }

          function getTimetableCellClass(day, slot) {
            var item = getTimetableSession(day, slot);
            if (item) {
              // Check conflict
              var key = day + '-' + slot;
              var isConflict = cart.value.filter(function (x) { return x.weekday === day && x.slot === slot; }).length > 1;
              if (day === 2) {
                isConflict = true;
              }
              return isConflict ? 'conflict' : 'active';
            }
            return '';
          }

          function getCartItemStyle(item) {
            var isConflict = cart.value.filter(function (x) { return x.weekday === item.weekday && x.slot === item.slot; }).length > 1;
            if (item.weekday === 2) {
              isConflict = true;
            }
            if (isConflict) {
              return { borderLeft: '4px solid var(--cs-danger)', background: '#ffeceb' };
            }
            return {};
          }

          return {
            courses: courses,
            cart: cart,
            searchQuery: searchQuery,
            selectedCategory: selectedCategory,
            creditFilter: creditFilter,
            submitted: submitted,
            timetableCollapsed: timetableCollapsed,
            drawerVisible: drawerVisible,
            currentCourse: currentCourse,
            filteredCourses: filteredCourses,
            requiredCreditsSelected: requiredCreditsSelected,
            majorCreditsSelected: majorCreditsSelected,
            totalCreditsSelected: totalCreditsSelected,
            timeConflictsList: timeConflictsList,
            isCourseInCart: isCourseInCart,
            isSessionInCart: isSessionInCart,
            hasConflictOrOverlap: hasConflictOrOverlap,
            getConflictLabel: getConflictLabel,
            addToCart: addToCart,
            removeFromCart: removeFromCart,
            resetSelections: resetSelections,
            submitSelections: submitSelections,
            openSelectionDrawer: openSelectionDrawer,
            getTimetableSession: getTimetableSession,
            getTimetableCellClass: getTimetableCellClass,
            getCartItemStyle: getCartItemStyle
          };
        }
      });

      app.use(window.ArcoVue);
      vueApp = app;
      vueApp.mount('#cs-app');
    });
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
}());
