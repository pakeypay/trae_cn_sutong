(function () {
  var vueApp = null;
  var handledPages = ['服务大厅'];

  // Authentic Lucide Line Icons dictionary (SVG strings with 2px stroke, fill="none")
  var lucideIcons = {
    building: '<svg class="lucide" viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="9" y1="22" x2="9" y2="16"></line><line x1="15" y1="22" x2="15" y2="16"></line><line x1="9" y1="16" x2="15" y2="16"></line><path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M12 6h.01M12 10h.01M8 14h.01M16 14h.01M12 14h.01"></path></svg>',
    package: '<svg class="lucide" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>',
    tasks: '<svg class="lucide" viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>',
    cloud: '<svg class="lucide" viewBox="0 0 24 24"><path d="M21.2 15c.9-1.2 1-2.9.2-4.1-.8-1.1-2.2-1.6-3.5-1.2C17.3 6.8 14.8 5 12 5 9.2 5 6.7 6.8 6.1 9.7c-1.3-.4-2.7.1-3.5 1.2-.8 1.2-.7 2.9.2 4.1.8 1.1 2.2 1.6 3.5 1.2H18c1.3.4 2.7-.1 3.2-1.2z"></path><polyline points="12 12 12 18"></polyline><polyline points="9 15 12 12 15 15"></polyline></svg>',
    calendar: '<svg class="lucide" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>',
    video: '<svg class="lucide" viewBox="0 0 24 24"><path d="M23 7l-7 5 7 5V7z"></path><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>',
    shield: '<svg class="lucide" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M12 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"></path><path d="M6 18a6 6 0 0 1 12 0"></path></svg>',
    wrench: '<svg class="lucide" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>',
    diagram: '<svg class="lucide" viewBox="0 0 24 24"><circle cx="12" cy="5" r="3"></circle><circle cx="5" cy="19" r="3"></circle><circle cx="19" cy="19" r="3"></circle><path d="M5 16v-3a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v3"></path><line x1="12" y1="8" x2="12" y2="9"></line></svg>',
    award: '<svg class="lucide" viewBox="0 0 24 24"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>',
    trophy: '<svg class="lucide" viewBox="0 0 24 24"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34"></path><path d="M12 2a5 5 0 0 0-5 5v3c0 2.2 1.8 4 4 4h2c2.2 0 4-1.8 4-4V7a5 5 0 0 0-5-5z"></path></svg>',
    users: '<svg class="lucide" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-2 2v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
    plus: '<svg class="lucide" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>'
  };

  function waitForVue(callback) {
    if (window.Vue && window.Vue.createApp && window.ArcoVue) {
      callback();
    } else {
      setTimeout(function () { waitForVue(callback); }, 50);
    }
  }

  function shouldHandle() {
    var role = document.body.dataset.role;
    // Enabled for ALL 6 roles in the training system
    return (role === 'teacher' || role === 'student' || role === 'admin' || role === 'scheduler' || role === 'material' || role === 'external') && handledPages.indexOf(document.body.dataset.active) !== -1;
  }

  function injectCSS() {
    if (document.getElementById('sh-module-css')) return;
    var script = document.currentScript || document.querySelector('script[src$="service-hall.js"]');
    var basePath = script ? script.src.replace(/service-hall\.js$/, '') : '../shared/modules/service-hall/';
    var link = document.createElement('link');
    link.id = 'sh-module-css';
    link.rel = 'stylesheet';
    link.href = basePath + 'service-hall.css';
    document.head.appendChild(link);
  }

  function getTemplate() {
    return [
      '<div class="service-hall-wrapper">',
        '<!-- 1. Feishu Top Header Bar -->',
        '<div class="fs-top-bar">',
          '<div class="fs-search-box">',
            '<span class="fs-search-icon"><i class="fas fa-search"></i></span>',
            '<input type="text" class="fs-search-input" placeholder="搜索应用、服务及自助申办事项..." v-model="searchKeyword" @keyup.enter="handleSearch" />',
            '<span class="fs-search-shortcut">⌘+K</span>',
          '</div>',
          '<div class="fs-top-actions">',
            '<div class="fs-action-item" @click="triggerService(\'获取应用大厅\')">',
              '<i class="fas fa-th-large" style="color:#3370ff;"></i>',
              '<span>获取应用</span>',
            '</div>',
            '<div class="fs-action-item" @click="triggerService(\'创建服务流程\')">',
              '<i class="fas fa-plus" style="color:#00b42a;"></i>',
              '<span>创建应用</span>',
            '</div>',
            '<div class="fs-action-item" @click="triggerService(\'工作台个性化配置\')">',
              '<i class="fas fa-cog" style="color:#646a73;"></i>',
              '<span>设置</span>',
            '</div>',
          '</div>',
        '</div>',

        '<div class="fs-content">',
          '<!-- 2. "常用应用" (Favorites) Section -->',
          '<div class="fs-section">',
            '<div class="fs-section-title">常用服务</div>',
            '<div class="fs-favorites-grid">',
              '<!-- Card 1: 场地预约 -->',
              '<div class="fs-fav-card" @click="handleSpaceAction(\'room\')">',
                '<div class="fs-fav-icon blue" v-html="lucideIcons.building"></div>',
                '<div class="fs-fav-title">场地预约（含物资）</div>',
              '</div>',

              '<!-- Card 2: 物资申请 -->',
              '<div v-if="!isStudent" class="fs-fav-card" @click="handleSpaceAction(\'material\')">',
                '<div class="fs-fav-icon purple" v-html="lucideIcons.package"></div>',
                '<div class="fs-fav-title">物资申请（不含场地）</div>',
              '</div>',

              '<!-- Card 3: 我的申请 -->',
              '<div class="fs-fav-card" @click="handleSpaceAction(\'my-applications\')">',
                '<div class="fs-fav-icon green" v-html="lucideIcons.tasks"></div>',
                '<div class="fs-fav-title">我的申请进度</div>',
              '</div>',

              '<!-- Card 4: 添加常用 -->',
              '<div class="fs-fav-card" style="border:1.5px dashed #dee0e3; background:#fafbfc;" @click="triggerService(\'添加常用服务\')">',
                '<div class="fs-fav-icon grey" v-html="lucideIcons.plus"></div>',
                '<div class="fs-fav-title" style="color:#8f959e; font-weight:500;">添加常用</div>',
              '</div>',
            '</div>',
          '</div>',

          '<!-- 3. "全部应用" (All Apps) Section with category tabs separated by / -->',
          '<div class="fs-section">',
            '<div class="fs-section-title">全部服务</div>',
            
            '<!-- Feishu Separated inline category bar -->',
            '<div class="fs-tabs-bar">',
              '<template v-for="(cat, idx) in categories" :key="cat.id">',
                '<div class="fs-tab-item" :class="{ active: activeCategory === cat.id }" @click="activeCategory = cat.id">',
                  '{{ cat.label }}',
                '</div>',
                '<span v-if="idx < categories.length - 1" class="fs-tab-divider">/</span>',
              '</template>',
            '</div>',

            '<!-- 4. Feishu Style App Cards Grid -->',
            '<div class="fs-apps-grid">',
              '<div v-for="app in filteredApps" :key="app.name" class="fs-app-card" @click="handleAppClick(app)">',
                '<div class="fs-app-icon" :class="app.iconColor" v-html="lucideIcons[app.lucideKey]"></div>',
                '<div class="fs-app-info">',
                  '<div class="fs-app-name">{{ app.name }}</div>',
                  '<div class="fs-app-desc">{{ app.desc }}</div>',
                '</div>',
              '</div>',
            '</div>',
          '</div>',
        '</div>',
      '</div>'
    ].join('');
  }

  function initVueApp() {
    if (!shouldHandle()) return;
    injectCSS();

    var container = document.querySelector('.content');
    if (!container) return;

    container.innerHTML = '<div id="sh-app"></div>';

    waitForVue(function () {
      if (vueApp) { try { vueApp.unmount(); } catch (e) {} vueApp = null; }

      var app = Vue.createApp({
        template: getTemplate(),
        setup: function () {
          var role = Vue.ref(document.body.dataset.role || 'teacher');
          var searchKeyword = Vue.ref('');
          var activeCategory = Vue.ref('all');

          var isStudent = Vue.computed(function () {
            return role.value === 'student' || role.value === 'external';
          });

          // Feishu-style categories
          var categories = Vue.ref([
            { id: 'all', label: '全部' },
            { id: 'space', label: '场地物资' },
            { id: 'teaching', label: '教务教学' },
            { id: 'osce', label: 'OSCE考务' },
            { id: 'academic', label: '学术学分' },
            { id: 'history', label: '我的申请' }
          ]);

          // Feishu App Cards List mapping directly to dynamic Lucide keys
          var allApps = Vue.ref([
            { name: '场地预约（含物资）', desc: '预订教学课室、PBL房或模拟手术舱，并勾选配套教具模型及备品耗材。', category: 'space', lucideKey: 'building', iconColor: 'blue', action: 'room' },
            { name: '仅物资申请', desc: '适用于科室小班授课、外带讲课等场景，单独预约医学物理教具模型或领用消耗包。', category: 'space', lucideKey: 'package', iconColor: 'purple', action: 'material' },
            { name: '我的申请进度', desc: '随时查询您的空间占用审批结果、模型出库进度及超期拍照自助归还签退。', category: 'history', lucideKey: 'tasks', iconColor: 'green', action: 'my-applications' },
            
            { name: '教案课件一键提报', desc: '提报本学年最新版教学大纲、课件案，自动流转至教研室负责人评审。', category: 'teaching', lucideKey: 'cloud', iconColor: 'purple', trigger: '教案课件快速审核流' },
            { name: '补调课在线申报', desc: '课程时间紧急微调、改课改期，支持AI检测教学大楼教室占用及师资时间重叠。', category: 'teaching', lucideKey: 'calendar', iconColor: 'blue', trigger: '补调课与时间自动冲突避让' },
            { name: '跨院区云带教邀约', desc: '申请与徐汇分院及兄弟点开展音视频连线，一键预约云讲堂多媒体双向高清信道。', category: 'teaching', lucideKey: 'video', iconColor: 'teal', trigger: '跨院区视频云教学连线' },
            
            { name: 'OSCE考官资质培训', desc: '申报国家考官及OSCE大厅打分权限培训，获取儿科大考数字化终端登录打分授信。', category: 'osce', lucideKey: 'shield', iconColor: 'teal', trigger: 'OSCE考官资格培训认证' },
            { name: '考站大屏与班牌故障报修', desc: '技能大楼班牌、大屏考机网络异常，或人体模型压力按压无感应，一键指派报修。', category: 'osce', lucideKey: 'wrench', iconColor: 'orange', trigger: '设备故障异常报修' },
            { name: '考前实训模拟沙盘', desc: '专门针对儿科执考冲刺设计，以全真流程模拟考生现场抽签、备考及入站操作。', category: 'osce', lucideKey: 'diagram', iconColor: 'green', trigger: '模拟考前沙盘预约' },
            
            { name: '继续医学教育学分申报', desc: '登记国家级/市级继续教育项目学分，规培学员在此录入常规实训绩点与信用积分。', category: 'academic', lucideKey: 'award', iconColor: 'orange', trigger: 'CME学分申报录入' },
            { name: '优秀教学成果卓越奖参评', desc: '提报本年度规培卓越教案、经典录播微课成果，参加技能中心卓越教学奖评选。', category: 'academic', lucideKey: 'trophy', iconColor: 'purple', trigger: '卓越教学课件成果参评征集' },
            { name: '导师学员双向匹配申报', desc: '开启年度导师-规培学员配对互选志愿表申报，一键上报您的志愿、研究方向与科室。', category: 'academic', lucideKey: 'users', iconColor: 'blue', trigger: '导师学员志愿配对双选' }
          ]);

          var filteredApps = Vue.computed(function () {
            var keyword = searchKeyword.value.trim().toLowerCase();
            return allApps.value.filter(function (app) {
              var matchesCat = activeCategory.value === 'all' || app.category === activeCategory.value;
              var matchesKeyword = !keyword || app.name.toLowerCase().indexOf(keyword) !== -1 || app.desc.toLowerCase().indexOf(keyword) !== -1;
              return matchesCat && matchesKeyword;
            });
          });

          function handleSpaceAction(action) {
            window.spaceReservationStartAction = action;
            window.navigateTo('场地与物资申请');
          }

          function handleAppClick(appItem) {
            if (appItem.action) {
              handleSpaceAction(appItem.action);
            } else if (appItem.trigger) {
              triggerService(appItem.trigger);
            }
          }

          function triggerService(serviceName) {
            window.ArcoVue.Message.info({
              content: '【数字化服务大厅】已为您成功开启《' + serviceName + '》线上自助申办通道，请在此上传您的电子证明凭据材料。',
              duration: 3500,
              showIcon: true
            });
          }

          function handleSearch() {
            window.ArcoVue.Message.success('已在大厅内过滤 “' + searchKeyword.value + '” 相关的核心服务卡片');
          }

          return {
            lucideIcons: lucideIcons,
            isStudent: isStudent,
            searchKeyword: searchKeyword,
            activeCategory: activeCategory,
            categories: categories,
            filteredApps: filteredApps,
            handleSpaceAction: handleSpaceAction,
            handleAppClick: handleAppClick,
            triggerService: triggerService,
            handleSearch: handleSearch
          };
        }
      });

      app.use(window.ArcoVue);
      vueApp = app;
      vueApp.mount('#sh-app');
    });
  }

  function boot() {
    var observer = new MutationObserver(function () {
      if (shouldHandle()) {
        if (!document.getElementById('sh-app')) {
          initVueApp();
        }
      }
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ['data-active', 'data-role'] });
    initVueApp();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
}());
