(function () {
  var vueApp = null;
  var script = document.currentScript || document.querySelector('script[src$="course-dev.js"]');
  var coverUrl = script ? new URL('../../../anesthesilogy.jpg', script.src).href : '';
  var uploadImageUrl = script ? new URL('../../assets/course-upload.png', script.src).href : '';
  var aiImageUrl = script ? new URL('../../assets/course-ai-gen.png', script.src).href : '';

  // Lucide icon helper — returns inline SVG string
  var ICONS = {
    'file-text': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>',
    'book-open': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
    'target': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
    'mail': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
    'list': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>',
    'building': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>',
    'clipboard-check': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>',
    'folder-open': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"/></svg>',
    'download': '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>',
    'play': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 3 20 12 6 21 6 3"/></svg>',
    'check': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    'check-circle': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    'alert-circle': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>',
    'video': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>',
    'image': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>',
    'chevron-right': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
    'arrow-left': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>',
    'grip-vertical': '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></svg>',
    'trash-2': '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>',
    'plus': '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
    'upload': '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>',
    'sparkles': '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>',
    'layout-template': '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="7" x="3" y="3" rx="1"/><rect width="9" height="7" x="3" y="14" rx="1"/><rect width="5" height="7" x="16" y="14" rx="1"/></svg>',
    'users': '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    'clock': '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    'link': '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
    'monitor': '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>',
    'help-circle': '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>',
    'file-question': '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M10 10.3c.2-.4.5-.8.9-1a2.1 2.1 0 0 1 2.6.4c.3.4.5.8.5 1.3 0 1.3-2 2-2 2"/><path d="M12 17h.01"/></svg>',
    'library': '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/></svg>',
    'package': '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 21.73v-9.73"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.3 7 12 12l8.7-5"/><path d="M12 22V12"/></svg>',
    'search': '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
    'panel-right-open': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M15 3v18"/><path d="m10 15-3-3 3-3"/></svg>',
    'panel-right-close': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M15 3v18"/><path d="m7 9 3 3-3 3"/></svg>'
  };

  function icon(name, size) {
    var svg = ICONS[name] || '';
    if (size) svg = svg.replace(/width="\d+"/, 'width="' + size + '"').replace(/height="\d+"/, 'height="' + size + '"');
    return svg;
  }

  function shouldHandle() {
    return ['teacher', 'admin'].includes(document.body.dataset.role)
      && document.body.dataset.active === '课程开发';
  }

  function injectCSS() {
    if (document.getElementById('cd-module-css') || !script) return;
    var link = document.createElement('link');
    link.id = 'cd-module-css';
    link.rel = 'stylesheet';
    link.href = script.src.replace(/course-dev\.js$/, 'course-dev.css');
    document.head.appendChild(link);
  }

  function waitForVue(callback, startedAt) {
    var start = startedAt || Date.now();
    if (window.Vue && window.Vue.createApp && window.ArcoVue) callback();
    else if (Date.now() - start < 8000) setTimeout(function () { waitForVue(callback, start); }, 50);
  }

  function render() {
    if (!shouldHandle()) {
      if (vueApp) { try { vueApp.unmount(); } catch (e) {} vueApp = null; }
      return;
    }

    injectCSS();
    var content = document.querySelector('.content');
    if (!content) return;
    content.innerHTML = '<div id="course-dev-app"></div>';

    waitForVue(function () {
      var app = Vue.createApp({
        template: `
          <div class="cd-app">
            <template v-if="page === 'list'">
              <section class="cd-workbench">
                <div class="cd-tabs-row">
                  <div class="cd-main-tabs" role="tablist">
                    <button :class="{ active: mainTab === 'course' }" @click="mainTab = 'course'">课程 <span>{{ courses.length }}</span></button>
                    <button :class="{ active: mainTab === 'program' }" @click="mainTab = 'program'">专项课程 <span>{{ programs.length }}</span></button>
                  </div>
                  <div class="cd-toolbar-controls">
                    <a-input-search v-model="filters.keyword" allow-clear placeholder="搜索课程名称..." class="app-toolbar-search"></a-input-search>
                  </div>
                </div>

                <div class="cd-filter-row">
                  <div v-if="mainTab === 'course'" class="cd-view-switch" aria-label="视图切换">
                    <button :class="{ active: viewMode === 'card' }" @click="viewMode = 'card'" title="卡片视图">
                      <svg viewBox="0 0 24 24"><rect x="4" y="4" width="6" height="6"></rect><rect x="14" y="4" width="6" height="6"></rect><rect x="4" y="14" width="6" height="6"></rect><rect x="14" y="14" width="6" height="6"></rect></svg>
                    </button>
                    <button :class="{ active: viewMode === 'list' }" @click="viewMode = 'list'" title="列表视图">
                      <svg viewBox="0 0 24 24"><path d="M9 6h11M9 12h11M9 18h11"></path><path d="M4 6h.01M4 12h.01M4 18h.01"></path></svg>
                    </button>
                  </div>
                  <a-select v-model="filters.status" allow-clear placeholder="开发状态" style="width: 132px">
                    <a-option value="开发中">开发中</a-option><a-option value="待审核">待审核</a-option>
                    <a-option value="返修中">返修中</a-option><a-option value="审核通过">审核通过</a-option>
                    <a-option value="申请修订中">申请修订中</a-option>
                  </a-select>
                  <a-select v-model="filters.type" allow-clear placeholder="课程类型" style="width: 140px">
                    <a-option value="临床技术性技能课程">临床技术性技能课程</a-option><a-option value="临床非技术性技能课程">临床非技术性技能课程</a-option>
                    <a-option value="情境模拟课程">情境模拟课程</a-option><a-option value="通识课程">通识课程</a-option>
                  </a-select>
                  <a-select v-model="filters.audience" allow-clear placeholder="授课对象" style="width: 154px">
                    <a-option value="住培一年级">住培一年级</a-option>
                    <a-option value="住培二年级">住培二年级</a-option>
                    <a-option value="住培三年级">住培三年级</a-option>
                    <a-option value="专培一年级">专培一年级</a-option>
                    <a-option value="专培二年级">专培二年级</a-option>
                    <a-option value="专培三年级">专培三年级</a-option>
                    <a-option value="进修医师">进修医师</a-option>
                    <a-option value="进修护士">进修护士</a-option>
                    <a-option value="医生（本院职工）">医生（本院职工）</a-option>
                    <a-option value="护士（本院职工）">护士（本院职工）</a-option>
                    <a-option value="社会人员">社会人员</a-option>
                    <a-option value="本科生">本科生</a-option>
                    <a-option value="研究生">研究生</a-option>
                  </a-select>
                  <a-select v-model="filters.year" allow-clear placeholder="全部年份" style="width: 112px">
                    <a-option value="2026">2026</a-option><a-option value="2025">2025</a-option>
                  </a-select>
                  <a-button type="text" @click="resetFilters">重置</a-button>
                  <div class="cd-filter-actions">
                    <a-button @click="openCreateProgram"><template #icon><span class="cd-plus">＋</span></template>新建专项课程</a-button>
                    <a-button type="primary" @click="openStart"><template #icon><span class="cd-plus">＋</span></template>创建课程</a-button>
                  </div>
                </div>

                <div v-if="mainTab === 'course' && viewMode === 'card'" class="cd-course-grid">
                  <article v-for="course in filteredCourses" :key="course.id" class="cd-course-card">
                    <div class="cd-card-main">
                      <div class="cd-cover">
                        <img :src="course.cover" :alt="course.name + '课程封面'">
                        <span :class="'cd-status tone-' + statusTone(course.status)">{{ course.status }}</span>
                      </div>
                      <div class="cd-card-copy">
                        <h2>{{ course.name }}</h2>
                        <div class="cd-tag-line"><span>{{ course.type }}</span><span>{{ course.audience }}</span></div>
                        <dl>
                          <div><dt>负责人</dt><dd>{{ course.owner }}</dd></div>
                          <div><dt>开发团队</dt><dd>{{ course.team }} 人</dd></div>
                          <div><dt>最近更新</dt><dd>{{ course.updated }}</dd></div>
                        </dl>
                      </div>
                    </div>
                    <div class="cd-card-meta">
                      <span class="cd-compact-progress"><i :style="{ width: (course.complete / 6 * 100) + '%' }"></i></span>
                      <span>完整度 {{ course.complete }}/6</span>
                      <span v-if="course.programs.length" class="cd-one-program" :title="course.programs[0]">{{ course.programs[0] }}</span>
                    </div>
                    <footer>
                      <span v-if="course.complete < 6" class="cd-missing">待完善：{{ course.missing }}</span>
                      <span v-else class="cd-ready">课程档案完整</span>
                      <div>
                        <button class="cd-icon-action" :title="primaryAction(course)" @click="courseAction(course)">打开</button>
                        <a-dropdown trigger="click">
                          <button class="cd-more" aria-label="更多操作">···</button>
                          <template #content>
                            <a-doption @click="joinProgram(course)">加入专项课程</a-doption>
                            <a-doption v-if="course.status === '开发中'">删除草稿</a-doption>
                            <a-doption v-else>查看版本记录</a-doption>
                            <a-doption v-if="course.status === '审核通过'" @click="requestRevision(course)">申请修订</a-doption>
                          </template>
                        </a-dropdown>
                      </div>
                    </footer>
                  </article>
                  <div v-if="!filteredCourses.length" class="cd-empty">没有匹配的课程，请调整筛选条件。</div>
                </div>

                <div v-if="mainTab === 'course' && viewMode === 'list'" class="cd-table-wrap">
                  <table class="cd-table">
                    <thead><tr><th>课程名称</th><th>课程类型</th><th>学习对象</th><th>负责人</th><th>所属专项课程</th><th>状态</th><th>更新时间</th><th>操作</th></tr></thead>
                    <tbody>
                      <tr v-for="course in filteredCourses" :key="course.id" class="cd-click-row" @click="previewCourse(course)">
                        <td><strong>{{ course.name }}</strong><small>完整度 {{ course.complete }} / 6</small></td>
                        <td>{{ course.type }}</td><td>{{ course.audience }}</td><td>{{ course.owner }}</td>
                        <td><span class="cd-table-program">{{ course.programs[0] || '未加入' }}</span></td>
                        <td><span :class="'cd-status tone-' + statusTone(course.status)">{{ course.status }}</span></td>
                        <td>{{ course.updated }}</td>
                        <td @click.stop><button @click="courseAction(course)">{{ primaryAction(course) }}</button><a-dropdown trigger="click"><button class="cd-more">···</button><template #content><a-doption @click="joinProgram(course)">添加到专项课程</a-doption><a-doption>删除</a-doption></template></a-dropdown></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div v-if="mainTab === 'program'" class="cd-program-list">
                  <article v-for="program in programs" :key="program.id" class="cd-program-card">
              <header>
                <div class="cd-program-header-row">
                  <div class="cd-program-info">
                    <span class="cd-program-type">专项课程</span>
                    <span v-if="program.source" class="cd-program-source-tag">{{ program.source }}</span>
                    <h2>{{ program.name }}</h2>
                    <p>{{ program.audience }} · 负责人 {{ program.owner }} · 开发团队 {{ program.team }} 人 · 更新于 {{ program.updated }}</p>
                  </div>
                  <div class="cd-program-actions">
                    <a-button type="primary" size="small" @click="program.expanded = !program.expanded">{{ program.expanded ? '收起课次' : '展开课次' }}</a-button>
                    <a-button size="small" @click="addCourseToProgram(program)">添加课程</a-button>
                    <a-button size="small" status="danger" @click="dissolveProgram(program)">解散</a-button>
                  </div>
                </div>
                <div class="cd-program-meta-row">
                  <div class="cd-program-progress">
                    <strong>{{ program.approved }} / {{ program.total }}</strong><span>审核通过课程</span>
                    <a-progress :percent="Math.round(program.approved / program.total * 100) / 100" :show-text="false" size="small"></a-progress>
                  </div>
                  <div class="cd-program-composition-tags">
                    <span v-for="type in getCompositionTypes(program)" :key="type">{{ type }} {{ getCompositionCount(program, type) }}</span>
                  </div>
                </div>
              </header>
              <div v-if="program.expanded" class="cd-program-lessons">
                      <div v-for="(lesson, index) in program.lessons" :key="lesson.name">
                        <b>{{ index + 1 }}</b><span><strong>{{ lesson.name }}</strong><small>原课程：{{ lesson.source }} · {{ lesson.type }} · {{ lesson.owner }}</small></span>
                        <span :class="'cd-status tone-' + statusTone(lesson.status)">{{ lesson.status }}</span>
                        <button @click="previewCourse(lesson)">查看</button>
                      </div>
                    </div>
                  </article>
                </div>
              </section>
            </template>

            <template v-else-if="page === 'start'">
              <button class="cd-back cd-start-back" @click="page = 'list'"><svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"></path></svg>返回课程列表</button>
              <main class="cd-create-panel">
                <header><h1>上传 / 生成教案</h1><p>上传已有教案，使用 AI 生成，或从已确认的标准模板开始。</p></header>
                <div class="cd-create-options">
                  <article>
                    <img :src="uploadImageUrl" alt="上传教案文件">
                    <h2>上传教案文件</h2>
                    <p>支持 Word、PDF、PPT 等格式，上传后自动解析课程内容。</p>
                    <a-button type="primary" size="large" long @click="simulateUpload">{{ uploaded ? '已选择：儿童导尿术教案.docx' : '选择文件上传' }}</a-button>
                  </article>
                  <article>
                    <img :src="aiImageUrl" alt="AI 生成教案">
                    <h2>AI 生成教案</h2>
                    <p>输入课程主题与授课对象，快速生成可继续编辑的教案初稿。</p>
                    <a-button size="large" long @click="aiCreateVisible = true">开始 AI 生成</a-button>
                  </article>
                  <article class="cd-template-option">
                    <div class="cd-template-art"><span></span><span></span><span></span></div>
                    <h2>使用课程开发示范库的模板</h2>
                    <p>从示范库中选择成熟课程模板，预览教案与示范视频后创建课程。</p>
                    <a-button size="large" long @click="demoLibraryVisible = true">浏览示范库</a-button>
                  </article>
                </div>
                <div v-if="uploaded" class="cd-upload-ready"><span v-html="icon('check-circle')" class="cd-success-icon"></span><div><strong>文件读取完成</strong><p>已识别课程基本信息与教学内容，可进入教案继续核对和编辑。</p></div><a-button type="primary" @click="enterEditor">进入教案编辑</a-button></div>
              </main>

              <a-modal :visible="aiCreateVisible" title="AI 智能备课助手" width="760px" @cancel="aiCreateVisible = false" @ok="enterEditor">
                <div class="cd-ai-create-form">
                  <label><span>课程主题</span><a-input v-model="startForm.name" placeholder="例如：儿童生长发育评估"></a-input></label>
                  <label><span>授课对象</span><a-input v-model="startForm.audience"></a-input></label>
                  <label class="wide"><span>教学目标（可选）</span><a-textarea v-model="startForm.idea" :auto-size="{ minRows: 3, maxRows: 5 }" placeholder="请输入本节课的核心教学目标"></a-textarea></label>
                  <label class="wide"><span>课程类型</span><a-radio-group v-model="startForm.type"><a-radio v-for="type in courseTypes" :key="type" :value="type">{{ type }}</a-radio></a-radio-group></label>
                  <div class="wide cd-reference-upload">点击或拖拽上传参考资料（可选）<small>支持 PDF、Word、PPTX、MP4 等素材</small></div>
                </div>
              </a-modal>

              <a-modal :visible="templateVisible" title="选择标准课程模板" width="820px" @cancel="templateVisible = false" @ok="enterEditor">
                <div class="cd-template-grid">
                  <button v-for="item in templates" :key="item" :class="{ active: selectedTemplate === item }" @click="selectedTemplate = item"><strong>{{ item }}</strong><span>使用已确认的课程教案结构创建</span></button>
                </div>
              </a-modal>

              <!-- 课程开发示范库弹窗 -->
              <a-modal :visible="demoLibraryVisible" title="课程开发示范库" width="1200px" @cancel="demoLibraryVisible = false" :footer="false">
                <div class="cd-demo-library">
                  <p class="cd-demo-library-desc">按受众分类浏览课程示范包，可预览模板、创建课程或下载模板。</p>
                  <div class="cd-demo-search">
                    <a-input-search v-model="demoSearch" placeholder="搜索课程名称或关键词…" allow-clear></a-input-search>
                  </div>
                  <div class="cd-demo-layout">
                    <aside class="cd-demo-sidebar">
                      <button v-for="(pkg, idx) in demoLibrary" :key="pkg.audience" :class="{ active: demoSelectedAudience === idx }" @click="demoSelectedAudience = idx; demoSelectedTab = 0">
                        <strong>{{ pkg.audience }}</strong>
                      </button>
                    </aside>
                    <section class="cd-demo-content">
                      <template v-if="!demoSearch">
                        <div v-for="(tab, tabIdx) in currentDemoAudience.tabs" :key="tabIdx" class="cd-demo-category">
                          <header><span>{{ tab.label }}</span></header>
                          <div class="cd-demo-grid">
                            <article v-for="(lesson, lIdx) in tab.lessons" :key="lIdx" class="cd-demo-card" :class="{ selected: demoSelectedLesson === lesson.courseName }" @click="demoSelectedLesson = lesson.courseName">
                              <div>
                                <h4>{{ lesson.courseName }}</h4>
                                <p>{{ lesson.teacher }} · {{ lesson.dept }}</p>
                              </div>
                              <div class="cd-demo-card-actions">
                                <a-button size="small" type="outline" @click.stop="previewDemoLesson(lesson)">预览示范教案</a-button>
                                <a-button v-if="lesson.video" size="small" type="outline" @click.stop="previewDemoVideo(lesson.video)">预览示范课程</a-button>
                              </div>
                            </article>
                          </div>
                          <div v-if="tab.videos && tab.videos.length" class="cd-demo-videos">
                            <h5>示范课程录像 · {{ tab.videos.length }} 个</h5>
                            <div class="cd-demo-grid">
                              <article v-for="(v, vIdx) in tab.videos" :key="vIdx" class="cd-demo-card cd-demo-video-card">
                                <div>
                                  <h4>{{ v.name }}</h4>
                                  <p>时长 {{ v.duration }} 分钟</p>
                                </div>
                                <a-button size="small" type="outline" @click="previewDemoVideo(v)">播放示范录像</a-button>
                              </article>
                            </div>
                          </div>
                        </div>
                      </template>
                      <div v-else class="cd-demo-search-results">
                        <p>共找到 {{ filteredDemoResults.length }} 个匹配课程</p>
                        <div class="cd-demo-grid">
                          <article v-for="r in filteredDemoResults" :key="r.key" class="cd-demo-card" :class="{ selected: demoSelectedLesson === r.courseName }" @click="demoSelectedLesson = r.courseName">
                            <div>
                              <small>{{ r.audience }} · {{ r.tabLabel }}</small>
                              <h4>{{ r.courseName }}</h4>
                              <p>{{ r.teacher }} · {{ r.dept }}</p>
                            </div>
                            <div class="cd-demo-card-actions">
                              <a-button size="small" type="outline" @click.stop="previewDemoLesson(r)">预览示范教案</a-button>
                              <a-button v-if="r.video" size="small" type="outline" @click.stop="previewDemoVideo(r.video)">预览示范课程</a-button>
                            </div>
                          </article>
                        </div>
                      </div>
                    </section>
                  </div>
                  <div class="cd-demo-footer">
                    <a-button @click="demoLibraryVisible = false">关闭</a-button>
                    <a-button type="outline" :disabled="!demoSelectedLesson" @click="downloadDemoTemplate">
                      <template #icon><span v-html="icon('file-text')"></span></template>下载空白模板
                    </a-button>
                    <a-button type="outline" :disabled="!demoSelectedLesson" @click="downloadDemoLesson">
                      <template #icon><span v-html="icon('download')"></span></template>下载示范教案
                    </a-button>
                    <a-button type="primary" :disabled="!demoSelectedLesson" @click="createCourseFromDemo">
                      <template #icon><span class="cd-plus">＋</span></template>创建课程
                    </a-button>
                  </div>
                </div>
              </a-modal>

              <!-- 示范教案预览弹窗 -->
              <a-modal :visible="demoPreviewVisible" title="示范教案预览" width="800px" @cancel="demoPreviewVisible = false" :footer="false">
                <div class="cd-demo-preview" v-if="currentPreviewLesson">
                  <div class="cd-demo-preview-meta">
                    <a-tag>{{ currentPreviewLesson.dept }}</a-tag>
                    <a-tag>{{ currentPreviewLesson.teacher }}</a-tag>
                  </div>
                  <div class="cd-demo-preview-modules">
                    <div class="fw-bold small mb-2">教案模板包含模块</div>
                    <div class="cd-demo-preview-module-grid">
                      <span v-for="m in ['基本信息', '课程目标', '课前内容', '课程内容', '实施要求', '资源与评估']" :key="m" class="cd-demo-preview-module-tag">{{ m }}</span>
                    </div>
                  </div>
                  <div class="cd-demo-preview-fulltext">
                    <div class="fw-bold small mb-2">示范教案全文</div>
                    <div class="cd-demo-preview-text">
                      <h4>{{ currentPreviewLesson.courseName }} - 教案</h4>
                      <p><strong>一、课程概述</strong></p>
                      <p>本课程面向{{ currentPreviewLesson.dept }}学员，由{{ currentPreviewLesson.teacher }}老师主讲。课程通过理论讲授、操作演示与技能站训练相结合的方式，帮助学员掌握核心操作技能。</p>
                      <p><strong>二、教学目标</strong></p>
                      <p>知识目标：掌握操作的适应证、禁忌证与无菌原则。</p>
                      <p>技能目标：能够规范完成操作全流程。</p>
                      <p>态度目标：建立患者隐私保护和人文沟通意识。</p>
                      <p><strong>三、教学流程</strong></p>
                      <p>模块1：导入与知识准备（15分钟）</p>
                      <p>模块2：导师分步演示（20分钟）</p>
                      <p>技能站：操作分步练习（40分钟）</p>
                      <p>模块4：总结与评估（15分钟）</p>
                    </div>
                  </div>
                  <div class="cd-demo-preview-footer">
                    <a-button @click="demoPreviewVisible = false">关闭</a-button>
                    <a-button type="outline" @click="downloadDemoLesson">下载示范教案</a-button>
                    <a-button type="outline" @click="downloadBlankTemplate">下载空白模板</a-button>
                    <a-button type="primary" @click="createCourseFromDemo">创建课程</a-button>
                  </div>
                </div>
              </a-modal>

              <!-- 示范课程视频预览弹窗 -->
              <a-modal :visible="demoVideoVisible" title="示范课程视频" width="680px" @cancel="demoVideoVisible = false" :footer="false">
                <div class="cd-demo-video-preview" v-if="currentPreviewVideo">
                  <div class="cd-demo-video-player">
                    <div class="cd-demo-video-play-btn" v-html="icon('play', 20)"></div>
                    <div class="cd-demo-video-label">点击播放示范课程录像</div>
                  </div>
                  <div class="cd-demo-video-meta">
                    <span>课程：{{ currentPreviewVideo.name }}</span>
                    <span>时长：{{ currentPreviewVideo.duration }} 分钟</span>
                  </div>
                  <div class="cd-demo-video-footer">
                    <a-button @click="demoVideoVisible = false">关闭</a-button>
                  </div>
                </div>
              </a-modal>
            </template>

            <template v-else-if="page === 'editor'">
              <div class="cd-editor-layout" :class="{ 'overview-collapsed': !sidePanelOpen }">
                <div class="cd-editor-toolbar">
                  <div class="cd-editor-toolbar-left">
                    <button class="cd-back" @click="page = 'list'"><svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"></path></svg>返回</button>
                    <strong>{{ editingCourse.name }}</strong>
                  </div>
                  <button class="cd-overview-toggle" @click="sidePanelOpen = !sidePanelOpen" :title="sidePanelOpen ? '收起概览区' : '展开概览区'" :aria-label="sidePanelOpen ? '收起概览区' : '展开概览区'">
                    <span v-html="icon(sidePanelOpen ? 'panel-right-close' : 'panel-right-open')"></span>
                  </button>
                </div>
                <div class="cd-editor-shell">
                <!-- Left Anchor Nav -->
                <nav class="cd-anchor-nav">
                  <div class="cd-anchor-title">页面导航</div>
                  <ul class="cd-anchor-list">
                    <li><a href="#cd-section-basic" :class="{ active: activeAnchor === 'basic' }" @click.prevent="scrollToSection('basic')">· 基本信息</a></li>
                    <li><a href="#cd-section-overview" :class="{ active: activeAnchor === 'overview' }" @click.prevent="scrollToSection('overview')">· 课程概述</a></li>
                    <li><a href="#cd-section-objectives" :class="{ active: activeAnchor === 'objectives' }" @click.prevent="scrollToSection('objectives')">· 课程目标</a></li>
                    <li><a href="#cd-section-content" :class="{ active: activeAnchor === 'content' }" @click.prevent="scrollToSection('content')">· 课程内容</a></li>
                    <li><a href="#cd-section-stages" :class="{ active: activeAnchor === 'stages' }" @click.prevent="scrollToSection('stages')">· 授课阶段</a></li>
                    <li><a href="#cd-section-assessment" :class="{ active: activeAnchor === 'assessment' }" @click.prevent="scrollToSection('assessment')">· 考核评价</a></li>
                    <li><a href="#cd-section-attachments" :class="{ active: activeAnchor === 'attachments' }" @click.prevent="scrollToSection('attachments')">· 附件库</a></li>
                  </ul>
                </nav>

                <!-- Center Editor Main -->
                <div class="cd-editor-main">
              <div class="cd-native-editor">
                <div class="cd-editor-tools"><button class="cd-back" @click="page = 'list'"><svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"></path></svg>返回课程列表</button><div><a-button @click="saveDraft">保存草稿</a-button><a-button type="primary" @click="page = 'review'">预览发布</a-button></div></div>

                <section class="cd-edit-hero">
                  <img :src="coverUrl" alt="课程封面">
                  <div><span>技能培训中心 · 标准课程教案</span><h1>{{ editingCourse.name }}</h1></div>
                </section>

                <section id="cd-section-basic" class="cd-edit-card cd-basic-card">
                  <header><h2><span v-html="icon('file-text')" class="cd-card-icon"></span>基本信息</h2><a-button type="text" size="small" @click="basicEditing = !basicEditing">{{ basicEditing ? '完成编辑' : '编辑信息' }}</a-button></header>
                  <div v-if="!basicEditing" class="cd-basic-display">
                    <dl><div><dt>课程名称</dt><dd>{{ editingCourse.name }}</dd></div><div><dt>课程负责人</dt><dd>{{ editingCourse.owner }}</dd></div><div><dt>授课对象</dt><dd>{{ editingCourse.audience }}</dd></div><div><dt>课程开发团队</dt><dd>{{ editingCourse.teacherTeam.join('、') }}</dd></div></dl>
                    <img :src="editingCourse.cover" alt="课程封面">
                  </div>
                  <div v-else class="cd-basic-form">
                    <label><span>课程名称</span><a-input v-model="editingCourse.name"></a-input></label>
                    <label><span>课程负责人</span>
                      <a-select v-model="editingCourse.owner" placeholder="请选择课程负责人">
                        <a-option v-for="teacher in teacherOptions" :key="teacher.value" :value="teacher.value">
                          <div style="display: flex; align-items: center; gap: 8px;">
                            <a-avatar :size="24" shape="circle"><img :src="teacher.avatar" /></a-avatar>
                            <span>{{ teacher.label.split(' / ')[0] }}</span>
                            <small style="color: var(--color-text-3);">{{ teacher.label.split(' / ')[1] }}</small>
                          </div>
                        </a-option>
                      </a-select>
                    </label>
                    <label><span>授课对象</span>
                      <a-select v-model="editingCourse.audience" placeholder="请选择类别">
                        <a-option v-for="aud in audienceOptions" :key="aud.value" :value="aud.value">{{ aud.label }}</a-option>
                      </a-select>
                    </label>
                    <label><span>课程类型</span><a-select v-model="editingCourse.type"><a-option v-for="type in courseTypes" :key="type" :value="type">{{ type }}</a-option></a-select></label>
                    <label class="cd-full-width"><span>课程开发团队</span>
                      <a-select v-model="editingCourse.teacherTeam" multiple allow-search allow-create placeholder="输入姓名搜索老师">
                        <a-option v-for="teacher in teacherOptions" :key="teacher.value" :value="teacher.value">
                          <div style="display: flex; align-items: center; gap: 8px;">
                            <a-avatar :size="24" shape="circle"><img :src="teacher.avatar" /></a-avatar>
                            <span>{{ teacher.label.split(' / ')[0] }}</span>
                            <small style="color: var(--color-text-3);">{{ teacher.label.split(' / ')[1] }}</small>
                          </div>
                        </a-option>
                      </a-select>
                    </label>
                    <label class="cd-full-width"><span>课程封面</span>
                      <div class="cd-cover-upload">
                        <img :src="editingCourse.cover" alt="课程封面" />
                        <a-button size="small" @click="changeCover">更换封面</a-button>
                      </div>
                    </label>
                  </div>
                </section>

                <div id="cd-section-overview" class="cd-overview-grid">
                  <section class="cd-edit-card"><header><h2><span v-html="icon('book-open')" class="cd-card-icon"></span>课程概述</h2><a-button type="text" size="small" @click="overviewEditing = !overviewEditing">{{ overviewEditing ? '完成' : '编辑概述' }}</a-button></header><a-textarea v-if="overviewEditing" v-model="courseOverview" :auto-size="{minRows:5,maxRows:8}"></a-textarea><p v-else>{{ courseOverview }}</p><small>当前为摘要显示</small></section>
                  <section class="cd-edit-card"><header><h2><span v-html="icon('book-open')" class="cd-card-icon"></span>课程建设依据</h2><a-button type="text" size="small" @click="basisEditing = !basisEditing">{{ basisEditing ? '完成' : '编辑依据' }}</a-button></header><a-textarea v-if="basisEditing" v-model="courseBasis" :auto-size="{minRows:5,maxRows:8}"></a-textarea><p v-else>{{ courseBasis }}</p><small>摘要展示</small></section>
                </div>

                <section id="cd-section-objectives" class="cd-edit-card">
                  <header><h2><span v-html="icon('target')" class="cd-card-icon"></span>课程目标</h2><a-button type="text" size="small" @click="openEditorDrawer('课程目标')">编辑目标</a-button></header>
                  <div class="cd-objective-grid">
                    <article v-for="item in objectives" :key="item.id" :class="'tone-' + getObjectiveTone(item.type)">
                      <strong>{{ item.type }}</strong>
                      <p v-for="goal in item.goals" :key="goal.code"><b>{{ goal.code }}</b> {{ goal.text }}</p>
                      <span>胜任力 · {{ formatCompetencies(item.competencies) }}</span>
                    </article>
                  </div>
                </section>

                <section class="cd-edit-card cd-letter-card"><header><h2><span v-html="icon('mail')" class="cd-card-icon"></span>课前信</h2><a-switch v-model="preLetterEnabled" size="small"></a-switch></header><p>课前信默认关闭。打开后，可在课程内容发布前通过站内信告知学习目标、准备事项和课堂安排。</p><a-textarea v-if="preLetterEnabled" v-model="preLetter" :auto-size="{minRows:3,maxRows:5}"></a-textarea></section>

                <section id="cd-section-content" class="cd-edit-card">
                  <header><div><h2><span v-html="icon('list')" class="cd-card-icon"></span>课程内容</h2><p>请检查并完善教学方式、资料、考核与时长等信息</p></div><a-button type="primary" size="small" @click="addContentRow">＋ 添加一级标题</a-button></header>
                  <div class="cd-editor-stats"><span>总时长 <b>5 学时</b></span><span>单元数 <b>{{ totalContentRows }}</b></span><span>资料数 <b>5</b></span><span>考核数 <b>6</b></span></div>
                  <div v-for="(stage, stageIdx) in contentStages" :key="stage.id" class="cd-content-stage">
                    <div class="cd-stage-header">
                      <h3>{{ stage.title }}</h3>
                      <p>{{ stage.description }}</p>
                    </div>
                    <article v-for="(row, index) in stage.rows" :key="row.id" class="cd-syllabus-row" :class="{expanded: contentEditingId === row.id, 'cd-syllabus-sub': row.seq.includes('.')}" :draggable="contentEditingId !== row.id" @dragstart="handleContentDragStart(stageIdx, index, $event)" @dragover.prevent="handleContentDragOver(index, $event)" @drop="handleContentDrop(stageIdx, index, $event)" @dragend="handleContentDragEnd">
                      <template v-if="contentEditingId !== row.id">
                        <span class="cd-drag-handle" v-html="icon('grip-vertical')"></span>
                        <b>{{ row.seq }}</b>
                        <div>
                          <strong>{{ row.title }}</strong>
                          <p>{{ row.desc }}</p>
                          <span v-for="tag in row.methods" :key="tag">{{ tag }}</span>
                        </div>
                        <div class="cd-row-meta">
                          <strong v-if="row.duration > 0">{{ row.duration }} 分钟</strong>
                          <small>资料 × {{ row.resources }} 考核 × {{ row.assessments }}</small>
                        </div>
                        <div class="cd-row-actions">
                          <button v-if="!row.seq.includes('.')" @click="addSubContentRow(stageIdx, row)" title="添加子项">
                            <span v-html="icon('plus')"></span>
                          </button>
                          <button @click="contentEditingId = row.id">展开编辑</button>
                          <button class="danger" @click="removeContentRow(stageIdx, index)">删除</button>
                        </div>
                      </template>
                      <div v-else class="cd-inline-editor">
                        <div class="cd-editor-header">
                          <span class="cd-drag-handle" v-html="icon('grip-vertical')"></span>
                          <b>{{ row.seq }}</b>
                          <h3>{{ row.title }}</h3>
                          <div class="cd-editor-actions">
                            <button @click="contentEditingId = ''">取消</button>
                            <button class="primary" @click="contentEditingId = ''">收起保存</button>
                          </div>
                        </div>
                        <div class="cd-editor-grid">
                          <label><span>标题</span><a-input v-model="row.title"></a-input></label>
                          <label><span>教学方式</span>
                            <a-select v-model="row.methods" multiple allow-create placeholder="输入后回车添加">
                              <a-option value="理论讲授">理论讲授</a-option>
                              <a-option value="提问互动">提问互动</a-option>
                              <a-option value="课堂讨论">课堂讨论</a-option>
                              <a-option value="案例分析">案例分析</a-option>
                              <a-option value="CBL">CBL</a-option>
                              <a-option value="小组讨论">小组讨论</a-option>
                            </a-select>
                          </label>
                          <label><span>时长（分钟）</span><a-input-number v-model="row.duration"></a-input-number></label>
                        </div>
                        <div class="cd-resource-area">
                          <div class="cd-resource-panel">
                            <span>配套资料</span>
                            <div class="cd-resource-tags">
                              <a-tag v-for="(res, i) in row.resourcesList" :key="i" size="small" color="arcoblue" closable @close="row.resourcesList.splice(i, 1)">{{ res }}</a-tag>
                              <a-tag size="small" @click="openEditorDrawer('配套资源与考核')">+ 添加资源</a-tag>
                            </div>
                          </div>
                          <div class="cd-resource-panel">
                            <span>考核与作业</span>
                            <div class="cd-resource-tags">
                              <a-tag v-for="(assess, i) in row.assessmentsList" :key="i" size="small" color="orangered" closable @close="row.assessmentsList.splice(i, 1)">{{ assess }}</a-tag>
                              <a-tag size="small" @click="openEditorDrawer('配套资源与考核')">+ 添加</a-tag>
                            </div>
                          </div>
                        </div>
                        <label class="wide"><span>主要内容</span><a-textarea v-model="row.desc" :auto-size="{minRows:3,maxRows:5}"></a-textarea></label>
                        <div class="cd-editor-tip">
                          <span v-html="icon('help-circle')"></span>
                          支持继续补充资源、考核方式与教学活动配置
                        </div>
                      </div>
                    </article>
                  </div>
                  <button class="cd-add-line" @click="addContentRow">＋ 添加一级标题</button>
                </section>

                <section id="cd-section-stages" class="cd-edit-card">
                  <header><h2><span v-html="icon('building')" class="cd-card-icon"></span>授课阶段及场地物资需求</h2><a-button type="primary" size="small" @click="addStage">＋ 添加课程阶段</a-button></header>
                  <article v-for="(stage,index) in stages" :key="stage.id" class="cd-stage-row" :class="{expanded: stageEditingId === stage.id}">
                    <template v-if="stageEditingId !== stage.id"><b>{{ String(index + 1).padStart(2,'0') }}</b><div><strong>{{ stage.title }}</strong><p><span>{{ stage.duration }} 分钟</span><span>{{ stage.ratio }}</span><span>{{ stage.mode }}</span><span>{{ stage.site }}</span></p></div><small>人员 {{ stage.people }} 项　物资 {{ stage.materials }} 项</small><button @click="stageEditingId = stage.id">展开编辑</button><button class="danger" @click="stages.splice(index,1)">删除</button></template>
                    <div v-else class="cd-inline-editor"><label><span>阶段名称</span><a-input v-model="stage.title"></a-input></label><label><span>学时</span><a-input-number v-model="stage.duration"></a-input-number></label><label><span>师生比</span><a-input v-model="stage.ratio"></a-input></label><label><span>场地需求</span><a-input v-model="stage.site"></a-input></label><div class="wide cd-inline-actions"><a-button @click="openEditorDrawer('人员与物资需求')">配置人员与物资</a-button><a-button type="primary" @click="stageEditingId = ''">收起保存</a-button></div></div>
                  </article>
                </section>

                <div id="cd-section-assessment" class="cd-bottom-grid">
                  <section class="cd-edit-card"><header><h2><span v-html="icon('clipboard-check')" class="cd-card-icon"></span>考核与评价</h2><a-button type="text" size="small" @click="openEditorDrawer('考核与评价')">查看全部</a-button></header><div class="cd-summary-panes"><button @click="openEditorDrawer('学生考核与评价')"><strong>学生考核与评价</strong><span>学习问卷　已选 1 个</span><span>课程反馈　已选 1 个</span></button><button @click="openEditorDrawer('教师评估表')"><strong>教师评估表</strong><span>授课评价　已选 2 个</span><span>理论考试　已选 2 个</span></button></div></section>
                  <section id="cd-section-attachments" class="cd-edit-card"><header><h2><span v-html="icon('folder-open')" class="cd-card-icon"></span>课程附件库</h2><a-button type="text" size="small" @click="openEditorDrawer('课程附件库')">查看全部</a-button></header><div class="cd-attachment-grid"><button v-for="item in attachments" :key="item.title" @click="openEditorDrawer(item.title)"><b v-html="icon(item.icon)" class="cd-attachment-icon"></b><strong>{{ item.title }}</strong><span>{{ item.count }} 个文件</span></button></div></section>
                </div>
                <footer class="cd-editor-footer"><a-button @click="saveDraft">保存草稿</a-button><a-button>上一步</a-button><a-button type="primary" @click="page = 'review'">下一步：预览发布</a-button></footer>
              </div>
                </div>

                <!-- Right Side Panel -->
                <aside v-if="sidePanelOpen" class="cd-side-panel cd-overview-panel">
                  <div class="cd-panel-header">
                    <h3>课程资源</h3>
                    <button class="cd-panel-toggle" @click="sidePanelOpen = false" title="收起面板">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
                    </button>
                  </div>
                  <div class="cd-panel-body">
                    <div class="cd-overview-panel-title">
                      <span v-html="icon('layout-template')"></span>
                      <strong>概览区</strong>
                    </div>
                    <section class="cd-overview-block">
                      <div class="cd-overview-label">课程类型</div>
                      <a-select v-model="editingCourse.type" size="small" class="cd-course-type-select">
                        <a-option v-for="type in courseTypes" :key="type" :value="type">{{ type }}</a-option>
                      </a-select>
                    </section>

                    <section class="cd-overview-block">
                      <div class="cd-overview-section-head">
                        <h3>课程概览</h3>
                      </div>
                      <ul class="cd-overview-nav">
                        <li>
                          <a href="#cd-section-basic" :class="{ active: activeAnchor === 'basic' }" @click.prevent="scrollToSection('basic')">
                            <span>基本信息</span><em class="is-done">已完成</em>
                          </a>
                        </li>
                        <li>
                          <a href="#cd-section-overview" :class="{ active: activeAnchor === 'overview' }" @click.prevent="scrollToSection('overview')">
                            <span>课程概述</span><em class="is-confirm">待确认</em>
                          </a>
                        </li>
                        <li>
                          <a href="#cd-section-objectives" :class="{ active: activeAnchor === 'objectives' }" @click.prevent="scrollToSection('objectives')">
                            <span>课程目标</span><em class="is-done">已完成</em>
                          </a>
                        </li>
                        <li class="has-children">
                          <a href="#cd-section-content" :class="{ active: activeAnchor === 'content' }" @click.prevent="scrollToSection('content')">
                            <span>课程内容</span><em class="is-confirm">待确认</em>
                          </a>
                        </li>
                        <li>
                          <a href="#cd-section-stages" :class="{ active: activeAnchor === 'stages' }" @click.prevent="scrollToSection('stages')">
                            <span>实施计划</span><em class="is-todo">未完成</em>
                          </a>
                        </li>
                      </ul>
                    </section>

                    <div class="cd-overview-divider"></div>

                    <section class="cd-overview-block">
                      <div class="cd-overview-section-head">
                        <h3>考核和评价 <small>{{ addedItems.length }}</small></h3>
                        <button @click="openEditorDrawer('考核与评价')">+ 添加</button>
                      </div>
                      <div class="cd-overview-list">
                        <button v-for="item in addedItems" :key="item.id" @click="handlePanelItemClick(item)">
                          <span>{{ item.name }}</span><small>{{ item.desc }}</small>
                        </button>
                      </div>
                    </section>

                    <section class="cd-overview-block">
                      <div class="cd-overview-section-head">
                        <h3>课程资源 <small>{{ uploadedFiles.length + 3 }}</small></h3>
                        <button @click="openEditorDrawer('配套资源与考核')">+ 添加资源</button>
                      </div>
                      <div class="cd-overview-list">
                        <button @click="openEditorDrawer('课件')"><span>课件</span></button>
                        <button @click="openEditorDrawer('试卷')"><span>试卷</span></button>
                        <button @click="openEditorDrawer('外部链接')"><span>外部链接</span></button>
                        <button v-for="file in uploadedFiles" :key="file.id" @click="handlePanelItemClick(file)">
                          <span>{{ file.name }}</span><small>{{ file.size }}</small>
                        </button>
                      </div>
                    </section>
                    <!-- 已添加 Section -->
                    <div class="cd-panel-section">
                      <div class="cd-panel-section-header">
                        <div class="cd-panel-section-title">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-4"/><path d="M9 11V7a3 3 0 0 1 6 0v4"/></svg>
                          已添加
                        </div>
                        <span class="cd-panel-section-count">{{ addedItems.length }}</span>
                      </div>
                      <div v-if="addedItems.length > 0">
                        <div v-for="item in addedItems" :key="item.id" class="cd-panel-item" @click="handlePanelItemClick(item)">
                          <div class="cd-panel-item-icon" :class="item.tone">
                            <span v-html="icon(item.icon)"></span>
                          </div>
                          <div class="cd-panel-item-info">
                            <strong>{{ item.name }}</strong>
                            <span>{{ item.desc }}</span>
                          </div>
                          <div class="cd-panel-item-status">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                          </div>
                        </div>
                      </div>
                      <div v-else class="cd-panel-empty">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
                        <p>暂无已添加项</p>
                      </div>
                    </div>

                    <!-- 已上传 Section -->
                    <div class="cd-panel-section">
                      <div class="cd-panel-section-header">
                        <div class="cd-panel-section-title">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                          已上传
                        </div>
                        <span class="cd-panel-section-count">{{ uploadedFiles.length }}</span>
                      </div>
                      <div v-if="uploadedFiles.length > 0">
                        <div v-for="file in uploadedFiles" :key="file.id" class="cd-panel-item" @click="handlePanelItemClick(file)">
                          <div class="cd-panel-item-icon" :class="file.tone">
                            <span v-html="icon(file.icon)"></span>
                          </div>
                          <div class="cd-panel-item-info">
                            <strong>{{ file.name }}</strong>
                            <span>{{ file.size }}</span>
                          </div>
                        </div>
                      </div>
                      <div v-else class="cd-panel-empty">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                        <p>暂无已上传文件</p>
                      </div>
                    </div>
                  </div>
                </aside>
                </div>
              </div>

              <button class="cd-lesson-assistant-trigger" @click="openAi('当前教案')" aria-label="打开课程开发助手">
                <span class="cd-lesson-assistant-avatar">AI</span>
                <span class="cd-lesson-assistant-text">
                  <strong>{{ assistantPromptText }}</strong>
                  <small>课程开发助手</small>
                </span>
                <span class="cd-lesson-assistant-send" v-html="icon('chevron-right')"></span>
              </button>

              <div v-if="aiVisible" class="cd-lesson-assistant-mask" @click.self="aiVisible = false">
                <section class="cd-lesson-assistant-modal" role="dialog" aria-modal="true" aria-label="课程开发助手">
                  <header class="cd-lesson-assistant-head">
                    <div>
                      <span v-html="icon('sparkles')"></span>
                      <strong>课程开发助手</strong>
                    </div>
                    <button @click="aiVisible = false" aria-label="关闭课程开发助手">×</button>
                  </header>
                  <div class="cd-lesson-assistant-body">
                    <div class="cd-lesson-assistant-intro">
                      <span class="cd-lesson-assistant-avatar large">AI</span>
                      <div>
                        <p>我正在围绕《{{ editingCourse.name }}》这份教案提供建议。</p>
                        <small>{{ editingCourse.type }} · {{ editingCourse.audience }} · 负责人：{{ editingCourse.owner }}</small>
                      </div>
                    </div>
                    <div class="cd-lesson-assistant-summary">
                      <article>
                        <b>课程概述</b>
                        <p>{{ courseOverview }}</p>
                      </article>
                      <article>
                        <b>当前重点</b>
                        <p>{{ assistantCourseFocus }}</p>
                      </article>
                    </div>
                    <div class="cd-lesson-assistant-grid">
                      <article>
                        <h3>可继续完善的问题</h3>
                        <button v-for="question in assistantCourseQuestions" :key="question" @click="useAssistantQuestion(question)">
                          <span v-html="icon('sparkles')"></span>
                          <span>{{ question }}</span>
                          <em>→</em>
                        </button>
                      </article>
                      <article>
                        <h3>当前教案提醒</h3>
                        <button v-for="risk in assistantCourseRisks" :key="risk" @click="useAssistantQuestion(risk)">
                          <span v-html="icon('alert-circle')"></span>
                          <span>{{ risk }}</span>
                          <em>→</em>
                        </button>
                      </article>
                    </div>
                  </div>
                  <footer class="cd-lesson-assistant-footer">
                    <div>
                      <button v-for="action in aiActions" :key="action" @click="applyAi(action)">{{ action }}</button>
                    </div>
                    <label>
                      <input v-model="aiInput" :placeholder="assistantPromptText">
                      <button @click="sendAssistantInput" aria-label="发送问题" v-html="icon('chevron-right')"></button>
                    </label>
                    <small>以上内容基于当前教案页面信息生成，仅供临时辅助参考</small>
                  </footer>
                </section>
              </div>

              <!-- Panel Expand Button (when collapsed) -->
              <button v-if="!sidePanelOpen" class="cd-panel-expand-btn" @click="sidePanelOpen = true" title="展开面板">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>
              </button>

              <!-- 编辑课中组件抽屉 -->
              <a-drawer :visible="editorDrawerVisible" :width="680" :footer="false" @cancel="editorDrawerVisible = false" unmount-on-close>
                <template #title>{{ editorDrawerTitle }}</template>
                <div v-if="editorDrawerTitle === '配套资源与考核'" class="cd-component-drawer">
                  <a-tabs v-model:active-key="componentTab" class="cd-component-tabs">
                    <a-tab-pane key="resources" title="添加资料">
                      <div class="cd-tab-content">
                        <div class="cd-filter-bar">
                          <a-select v-model="resourceFilter.type" allow-clear placeholder="资料类型" style="width: 140px">
                            <a-option value="video">视频</a-option>
                            <a-option value="document">文档</a-option>
                            <a-option value="image">图片</a-option>
                            <a-option value="other">其他</a-option>
                          </a-select>
                          <a-input-search v-model="resourceFilter.keyword" placeholder="搜索资料..." allow-clear></a-input-search>
                        </div>
                        <div class="cd-resource-list">
                          <article v-for="item in resourceList" :key="item.id" :class="{ selected: resourceSelected.includes(item.id) }">
                            <div>
                              <span class="cd-resource-icon" v-html="icon(item.icon)"></span>
                              <div>
                                <strong>{{ item.name }}</strong>
                                <small>{{ item.size }} · {{ item.type }}</small>
                              </div>
                            </div>
                            <a-checkbox v-model="resourceSelected" :value="item.id"></a-checkbox>
                          </article>
                        </div>
                      </div>
                    </a-tab-pane>
                    <a-tab-pane key="courses" title="引用课程">
                      <div class="cd-tab-content">
                        <div class="cd-filter-bar">
                          <a-select v-model="refCourseFilter.type" allow-clear placeholder="课程类型" style="width: 140px">
                            <a-option value="技能课程">技能课程</a-option>
                            <a-option value="非技能课程">非技能课程</a-option>
                          </a-select>
                          <a-input-search v-model="refCourseFilter.keyword" placeholder="搜索课程..." allow-clear></a-input-search>
                        </div>
                        <div class="cd-course-ref-list">
                          <article v-for="course in refCourseList" :key="course.id">
                            <div>
                              <strong>{{ course.name }}</strong>
                              <small>{{ course.type }} · {{ course.audience }}</small>
                            </div>
                            <button @click="toggleRefCourse(course.id)">添加引用</button>
                          </article>
                        </div>
                      </div>
                    </a-tab-pane>
                    <a-tab-pane key="online" title="线上训练">
                      <div class="cd-tab-content">
                        <p>选择线上训练平台配置</p>
                        <div class="cd-online-options">
                          <label><a-checkbox v-model="onlineConfig.platforms" value="wechat">微信学习平台</a-checkbox></label>
                          <label><a-checkbox v-model="onlineConfig.platforms" value="elearning">院内E-learning平台</a-checkbox></label>
                          <label><a-checkbox v-model="onlineConfig.platforms" value="other">其他平台</a-checkbox></label>
                        </div>
                        <label><span>关联线上课程</span><a-select v-model="onlineConfig.course" style="width: 100%">
                          <a-option value="">请选择</a-option>
                          <a-option value="1">儿童导尿术理论预习</a-option>
                          <a-option value="2">无菌操作原则</a-option>
                        </a-select></label>
                      </div>
                    </a-tab-pane>
                    <a-tab-pane key="assessment" title="设置考评">
                      <div class="cd-tab-content">
                        <div class="cd-assessment-options">
                          <label><a-checkbox v-model="assessmentConfig.types" value="quiz">随堂测验</a-checkbox></label>
                          <label><a-checkbox v-model="assessmentConfig.types" value="rubric">评分量表</a-checkbox></label>
                          <label><a-checkbox v-model="assessmentConfig.types" value="survey">学习问卷</a-checkbox></label>
                        </div>
                        <label><span>关联评分表</span><a-select v-model="assessmentConfig.rubric" style="width: 100%">
                          <a-option value="">请选择</a-option>
                          <a-option value="1">儿童导尿术操作评分表</a-option>
                        </a-select></label>
                      </div>
                    </a-tab-pane>
                    <a-tab-pane key="homework" title="添加作业">
                      <div class="cd-tab-content">
                        <label><span>作业名称</span><a-input v-model="homeworkConfig.name" placeholder="请输入作业名称"></a-input></label>
                        <label><span>作业类型</span><a-select v-model="homeworkConfig.type" style="width: 100%">
                          <a-option value="upload">提交作业</a-option>
                          <a-option value="quiz">在线测验</a-option>
                        </a-select></label>
                        <label><span>截止时间</span><a-date-picker v-model="homeworkConfig.deadline" show-time></a-date-picker></label>
                      </div>
                    </a-tab-pane>
                    <a-tab-pane key="prerequisite" title="前置条件">
                      <div class="cd-tab-content">
                        <p>设置本课程/章节的前置学习要求</p>
                        <div class="cd-prereq-options">
                          <label><a-checkbox v-model="prereqConfig.required" value="course">需完成前置课程</a-checkbox></label>
                          <label><a-checkbox v-model="prereqConfig.required" value="test">需通过前置考核</a-checkbox></label>
                        </div>
                        <label v-if="prereqConfig.required.includes('course')"><span>前置课程</span><a-select v-model="prereqConfig.course" style="width: 100%">
                          <a-option value="">请选择</a-option>
                          <a-option value="1">无菌操作基础</a-option>
                        </a-select></label>
                      </div>
                    </a-tab-pane>
                  </a-tabs>
                  <footer class="cd-component-footer">
                    <a-button @click="editorDrawerVisible = false">取消</a-button>
                    <a-button type="primary" @click="saveComponent">保存组件</a-button>
                  </footer>
                </div>
                <div v-else-if="editorDrawerTitle === '学生考核与评价'" class="cd-editor-drawer cd-assessment-drawer">
                  <div class="cd-drawer-toolbar">
                    <div>
                      <h3>学生考核与评价</h3>
                      <p>管理课程中的问卷调研和反馈收集方式</p>
                    </div>
                    <a-dropdown trigger="click">
                      <a-button type="primary" size="small">
                        <template #icon><span v-html="icon('plus')"></span></template>
                        添加
                      </a-button>
                      <template #content>
                        <a-doption @click="addStudentAssessment('survey')">问卷调研</a-doption>
                        <a-doption @click="addStudentAssessment('feedback')">反馈收集</a-doption>
                      </template>
                    </a-dropdown>
                  </div>

                  <div class="cd-drawer-section">
                    <h4>问卷调研</h4>
                    <div class="cd-drawer-list">
                      <article v-for="(item, index) in studentAssessments.surveys" :key="'survey-' + index" class="cd-drawer-list-item">
                        <div class="cd-field">
                          <span>名称</span>
                          <a-input v-model="item.name" size="small"></a-input>
                        </div>
                        <div class="cd-field">
                          <span>类型</span>
                          <a-input v-model="item.type" size="small"></a-input>
                        </div>
                        <div class="cd-field">
                          <span>题目数</span>
                          <a-input-number v-model="item.questions" size="small" :min="1"></a-input-number>
                        </div>
                        <a-button type="text" status="danger" size="small" @click="studentAssessments.surveys.splice(index, 1)">
                          <template #icon><span v-html="icon('trash-2')"></span></template>
                        </a-button>
                      </article>
                    </div>
                  </div>

                  <div class="cd-drawer-section">
                    <h4>反馈收集</h4>
                    <div class="cd-drawer-list">
                      <article v-for="(item, index) in studentAssessments.feedback" :key="'feedback-' + index" class="cd-drawer-list-item">
                        <div class="cd-field">
                          <span>名称</span>
                          <a-input v-model="item.name" size="small"></a-input>
                        </div>
                        <div class="cd-field">
                          <span>类型</span>
                          <a-input v-model="item.type" size="small"></a-input>
                        </div>
                        <a-button type="text" status="danger" size="small" @click="studentAssessments.feedback.splice(index, 1)">
                          <template #icon><span v-html="icon('trash-2')"></span></template>
                        </a-button>
                      </article>
                    </div>
                  </div>

                  <footer class="cd-component-footer">
                    <a-button @click="editorDrawerVisible = false">取消</a-button>
                    <a-button type="primary" @click="saveAssessment">保存配置</a-button>
                  </footer>
                </div>

                <div v-else-if="editorDrawerTitle === '教师评估表'" class="cd-editor-drawer cd-assessment-drawer">
                  <div class="cd-drawer-toolbar">
                    <div>
                      <h3>教师评估表</h3>
                      <p>管理导师/助教的评价表和考试安排</p>
                    </div>
                    <a-dropdown trigger="click">
                      <a-button type="primary" size="small">
                        <template #icon><span v-html="icon('plus')"></span></template>
                        添加
                      </a-button>
                      <template #content>
                        <a-doption @click="addTeacherAssessment('evaluation')">评价表</a-doption>
                        <a-doption @click="addTeacherAssessment('exam')">考试</a-doption>
                      </template>
                    </a-dropdown>
                  </div>

                  <div class="cd-drawer-section">
                    <h4>评价表</h4>
                    <div class="cd-drawer-list">
                      <article v-for="(item, index) in teacherAssessments.evaluations" :key="'eval-' + index" class="cd-drawer-list-item">
                        <div class="cd-field">
                          <span>名称</span>
                          <a-input v-model="item.name" size="small"></a-input>
                        </div>
                        <div class="cd-field">
                          <span>评价维度数</span>
                          <a-input-number v-model="item.criteria" size="small" :min="1"></a-input-number>
                        </div>
                        <a-button type="text" status="danger" size="small" @click="teacherAssessments.evaluations.splice(index, 1)">
                          <template #icon><span v-html="icon('trash-2')"></span></template>
                        </a-button>
                      </article>
                    </div>
                  </div>

                  <div class="cd-drawer-section">
                    <h4>考试</h4>
                    <div class="cd-drawer-list">
                      <article v-for="(item, index) in teacherAssessments.exams" :key="'exam-' + index" class="cd-drawer-list-item">
                        <div class="cd-field">
                          <span>名称</span>
                          <a-input v-model="item.name" size="small"></a-input>
                        </div>
                        <div class="cd-field">
                          <span>题目数</span>
                          <a-input-number v-model="item.questions" size="small" :min="1"></a-input-number>
                        </div>
                        <div class="cd-field">
                          <span>时长(分钟)</span>
                          <a-input-number v-model="item.duration" size="small" :min="1"></a-input-number>
                        </div>
                        <a-button type="text" status="danger" size="small" @click="teacherAssessments.exams.splice(index, 1)">
                          <template #icon><span v-html="icon('trash-2')"></span></template>
                        </a-button>
                      </article>
                    </div>
                  </div>

                  <footer class="cd-component-footer">
                    <a-button @click="editorDrawerVisible = false">取消</a-button>
                    <a-button type="primary" @click="saveAssessment">保存配置</a-button>
                  </footer>
                </div>

                <div v-else-if="editorDrawerTitle === '课程附件库'" class="cd-editor-drawer cd-attachment-drawer">
                  <div class="cd-drawer-toolbar">
                    <div>
                      <h3>课程附件库</h3>
                      <p>管理课程手册、测试题、评分表和参考资料</p>
                    </div>
                    <a-upload :auto-upload="false" @change="handleAttachmentUpload">
                      <a-button type="primary" size="small">
                        <template #icon><span v-html="icon('upload')"></span></template>
                        上传附件
                      </a-button>
                    </a-upload>
                  </div>

                  <a-tabs v-model:active-key="attachmentTab" type="rounded" size="small">
                    <a-tab-pane key="handbook" title="课程手册">
                      <div class="cd-drawer-list">
                        <article v-for="(item, index) in attachmentLibrary.handbooks" :key="'handbook-' + index" class="cd-drawer-list-item">
                          <div class="cd-attachment-info">
                            <span v-html="icon('file-text')"></span>
                            <div>
                              <strong>{{ item.name }}</strong>
                              <span>{{ item.size }} · {{ item.updated }}</span>
                            </div>
                          </div>
                          <div class="cd-attachment-actions">
                            <a-button type="text" size="small" @click="downloadAttachment(item)">
                              <template #icon><span v-html="icon('download')"></span></template>
                            </a-button>
                            <a-button type="text" status="danger" size="small" @click="attachmentLibrary.handbooks.splice(index, 1)">
                              <template #icon><span v-html="icon('trash-2')"></span></template>
                            </a-button>
                          </div>
                        </article>
                      </div>
                    </a-tab-pane>

                    <a-tab-pane key="test" title="测试题">
                      <div class="cd-drawer-toolbar" style="padding: 0 0 12px 0;">
                        <a-button type="outline" size="small" @click="createTest">
                          <template #icon><span v-html="icon('plus')"></span></template>
                          创建测试题
                        </a-button>
                      </div>
                      <div class="cd-drawer-list">
                        <article v-for="(item, index) in attachmentLibrary.tests" :key="'test-' + index" class="cd-drawer-list-item">
                          <div class="cd-attachment-info">
                            <span v-html="icon('file-question')"></span>
                            <div>
                              <strong>{{ item.name }}</strong>
                              <span>{{ item.questions }} 题 · {{ item.duration }} 分钟</span>
                            </div>
                          </div>
                          <div class="cd-attachment-actions">
                            <a-button type="text" size="small" @click="editTest(item)">编辑</a-button>
                            <a-button type="text" status="danger" size="small" @click="attachmentLibrary.tests.splice(index, 1)">
                              <template #icon><span v-html="icon('trash-2')"></span></template>
                            </a-button>
                          </div>
                        </article>
                      </div>
                    </a-tab-pane>

                    <a-tab-pane key="rubric" title="评分表">
                      <div class="cd-drawer-toolbar" style="padding: 0 0 12px 0;">
                        <a-button type="outline" size="small" @click="createRubric">
                          <template #icon><span v-html="icon('plus')"></span></template>
                          创建评分表
                        </a-button>
                      </div>
                      <div class="cd-drawer-list">
                        <article v-for="(item, index) in attachmentLibrary.rubrics" :key="'rubric-' + index" class="cd-drawer-list-item">
                          <div class="cd-attachment-info">
                            <span v-html="icon('clipboard-check')"></span>
                            <div>
                              <strong>{{ item.name }}</strong>
                              <span>{{ item.criteria }} 个评价维度</span>
                            </div>
                          </div>
                          <div class="cd-attachment-actions">
                            <a-button type="text" size="small" @click="editRubric(item)">编辑</a-button>
                            <a-button type="text" status="danger" size="small" @click="attachmentLibrary.rubrics.splice(index, 1)">
                              <template #icon><span v-html="icon('trash-2')"></span></template>
                            </a-button>
                          </div>
                        </article>
                      </div>
                    </a-tab-pane>

                    <a-tab-pane key="reference" title="参考资料">
                      <div class="cd-drawer-list">
                        <article v-for="(item, index) in attachmentLibrary.references" :key="'ref-' + index" class="cd-drawer-list-item">
                          <div class="cd-attachment-info">
                            <span v-html="icon('book-open')"></span>
                            <div>
                              <strong>{{ item.name }}</strong>
                              <span>{{ item.size }} · {{ item.type }}</span>
                            </div>
                          </div>
                          <div class="cd-attachment-actions">
                            <a-button type="text" size="small" @click="downloadAttachment(item)">
                              <template #icon><span v-html="icon('download')"></span></template>
                            </a-button>
                            <a-button type="text" status="danger" size="small" @click="attachmentLibrary.references.splice(index, 1)">
                              <template #icon><span v-html="icon('trash-2')"></span></template>
                            </a-button>
                          </div>
                        </article>
                      </div>
                    </a-tab-pane>
                  </a-tabs>

                  <footer class="cd-component-footer">
                    <a-button @click="editorDrawerVisible = false">关闭</a-button>
                  </footer>
                </div>

                <div v-else-if="editorDrawerTitle === '人员与物资需求'" class="cd-editor-drawer cd-personnel-material-drawer">
                  <div class="cd-drawer-toolbar">
                    <div>
                      <h3>人员与物资需求</h3>
                      <p>配置课程所需的导师、助教和物资设备</p>
                    </div>
                  </div>

                  <a-tabs v-model:active-key="personnelMaterialTab" type="rounded" size="small">
                    <a-tab-pane key="personnel" title="人员配置">
                      <div class="cd-drawer-section">
                        <div class="cd-section-header">
                          <h4>导师</h4>
                          <a-button type="outline" size="mini" @click="addPersonnel('instructor')">
                            <template #icon><span v-html="icon('plus')"></span></template>
                            添加导师
                          </a-button>
                        </div>
                        <div class="cd-drawer-list">
                          <article v-for="(item, index) in personnelConfig.instructors" :key="'inst-' + index" class="cd-drawer-list-item">
                            <div class="cd-field">
                              <span>姓名</span>
                              <a-input v-model="item.name" size="small"></a-input>
                            </div>
                            <div class="cd-field">
                              <span>职称</span>
                              <a-input v-model="item.title" size="small"></a-input>
                            </div>
                            <div class="cd-field">
                              <span>角色</span>
                              <a-input v-model="item.role" size="small"></a-input>
                            </div>
                            <a-button type="text" status="danger" size="small" @click="personnelConfig.instructors.splice(index, 1)">
                              <template #icon><span v-html="icon('trash-2')"></span></template>
                            </a-button>
                          </article>
                        </div>
                      </div>

                      <div class="cd-drawer-section">
                        <div class="cd-section-header">
                          <h4>助教</h4>
                          <a-button type="outline" size="mini" @click="addPersonnel('assistant')">
                            <template #icon><span v-html="icon('plus')"></span></template>
                            添加助教
                          </a-button>
                        </div>
                        <div class="cd-drawer-list">
                          <article v-for="(item, index) in personnelConfig.assistants" :key="'asst-' + index" class="cd-drawer-list-item">
                            <div class="cd-field">
                              <span>姓名</span>
                              <a-input v-model="item.name" size="small"></a-input>
                            </div>
                            <div class="cd-field">
                              <span>职称</span>
                              <a-input v-model="item.title" size="small"></a-input>
                            </div>
                            <a-button type="text" status="danger" size="small" @click="personnelConfig.assistants.splice(index, 1)">
                              <template #icon><span v-html="icon('trash-2')"></span></template>
                            </a-button>
                          </article>
                        </div>
                      </div>
                    </a-tab-pane>

                    <a-tab-pane key="material" title="物资设备">
                      <div class="cd-drawer-section">
                        <div class="cd-section-header">
                          <h4>设备</h4>
                          <a-button type="outline" size="mini" @click="addMaterial('equipment')">
                            <template #icon><span v-html="icon('plus')"></span></template>
                            添加设备
                          </a-button>
                        </div>
                        <div class="cd-drawer-list">
                          <article v-for="(item, index) in materialsConfig.equipment" :key="'equip-' + index" class="cd-drawer-list-item">
                            <div class="cd-field">
                              <span>名称</span>
                              <a-input v-model="item.name" size="small"></a-input>
                            </div>
                            <div class="cd-field">
                              <span>数量</span>
                              <a-input-number v-model="item.quantity" size="small" :min="1"></a-input-number>
                            </div>
                            <div class="cd-field">
                              <span>单位</span>
                              <a-input v-model="item.unit" size="small" style="width: 80px;"></a-input>
                            </div>
                            <a-button type="text" status="danger" size="small" @click="materialsConfig.equipment.splice(index, 1)">
                              <template #icon><span v-html="icon('trash-2')"></span></template>
                            </a-button>
                          </article>
                        </div>
                      </div>

                      <div class="cd-drawer-section">
                        <div class="cd-section-header">
                          <h4>耗材</h4>
                          <a-button type="outline" size="mini" @click="addMaterial('consumable')">
                            <template #icon><span v-html="icon('plus')"></span></template>
                            添加耗材
                          </a-button>
                        </div>
                        <div class="cd-drawer-list">
                          <article v-for="(item, index) in materialsConfig.consumables" :key="'cons-' + index" class="cd-drawer-list-item">
                            <div class="cd-field">
                              <span>名称</span>
                              <a-input v-model="item.name" size="small"></a-input>
                            </div>
                            <div class="cd-field">
                              <span>数量</span>
                              <a-input-number v-model="item.quantity" size="small" :min="1"></a-input-number>
                            </div>
                            <div class="cd-field">
                              <span>单位</span>
                              <a-input v-model="item.unit" size="small" style="width: 80px;"></a-input>
                            </div>
                            <a-button type="text" status="danger" size="small" @click="materialsConfig.consumables.splice(index, 1)">
                              <template #icon><span v-html="icon('trash-2')"></span></template>
                            </a-button>
                          </article>
                        </div>
                      </div>
                    </a-tab-pane>
                  </a-tabs>

                  <footer class="cd-component-footer">
                    <a-button @click="editorDrawerVisible = false">取消</a-button>
                    <a-button type="primary" @click="savePersonnelMaterial">保存配置</a-button>
                  </footer>
                </div>

                <div v-else class="cd-editor-drawer">
                  <p>在此维护"{{ editorDrawerTitle }}"的详细配置。所有变更均可继续编辑并保存。</p>
                  <label><span>名称 / 标题</span><a-input v-model="drawerForm.title"></a-input></label>
                  <label><span>说明</span><a-textarea v-model="drawerForm.desc" :auto-size="{minRows:5,maxRows:8}"></a-textarea></label>
                  <div class="cd-drawer-list">
                    <article v-for="(item,index) in drawerItems" :key="index">
                      <strong>{{ item }}</strong>
                      <a-button type="text" status="danger" size="small" @click="drawerItems.splice(index,1)">删除</a-button>
                    </article>
                    <a-button long @click="drawerItems.push('新增配置项')">＋ 添加配置项</a-button>
                  </div>
                  <a-button type="primary" long @click="saveDrawer">保存配置</a-button>
                </div>

              </a-drawer>

              <!-- 课程目标编辑抽屉 -->
              <a-drawer
                :visible="objectiveDrawerVisible"
                :width="620"
                title="编辑课程目标"
                unmount-on-close
                @cancel="objectiveDrawerVisible = false"
              >
                <div class="cd-drawer-toolbar">
                  <div>
                    <h3>学习目标</h3>
                    <p>按目标类型维护，胜任力支持项目六大领域级联多选。</p>
                  </div>
                  <a-button type="primary" size="small" @click="addObjective">
                    <template #icon><span v-html="icon('plus')"></span></template>
                    添加目标类型
                  </a-button>
                </div>
                <div class="cd-drawer-list">
                  <article v-for="item in objectives" :key="item.id" class="cd-drawer-list-item">
                    <label class="cd-field">
                      <span>目标类型</span>
                      <a-input v-model="item.type" size="small" placeholder="如：知识目标"></a-input>
                    </label>
                    <label class="cd-field">
                      <span>具体目标</span>
                      <div class="cd-goal-list-editor">
                        <div v-for="(goal, goalIndex) in item.goals" :key="goal.code + '-' + goalIndex" class="cd-goal-editor-row">
                          <span class="cd-goal-hint">{{ goal.code || (objectiveCodePrefix(item.type) + (goalIndex + 1)) }}</span>
                          <a-textarea
                            v-model="goal.text"
                            :placeholder="(goal.code || (objectiveCodePrefix(item.type) + (goalIndex + 1))) + '：请输入具体目标'"
                            :auto-size="{ minRows: 1, maxRows: 3 }"
                          ></a-textarea>
                        </div>
                        <a-button size="mini" type="outline" @click="addGoalItem(item)">添加具体目标</a-button>
                      </div>
                    </label>
                    <label class="cd-field">
                      <span>匹配的胜任力</span>
                      <a-cascader
                        v-model="item.competencies"
                        :options="acgmeCompetencyOptions"
                        multiple
                        check-strictly
                        size="small"
                        placeholder="选择胜任力维度 / 子维度"
                      ></a-cascader>
                    </label>
                  </article>
                </div>
                <template #footer>
                  <a-button @click="objectiveDrawerVisible = false">取消</a-button>
                  <a-button type="primary" @click="saveObjectives">保存</a-button>
                </template>
              </a-drawer>
            </template>

            <template v-else-if="page === 'review'">
              <header class="cd-subpage-head">
                <button class="cd-back" @click="page = 'editor'"><svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"></path></svg>返回教案编辑</button>
                <div><span>课程开发 / 儿童导尿术（男性）</span><h1>提交审核</h1><p>请确认课程档案完整后提交</p></div>
                <a-button @click="saveDraft">保存草稿</a-button>
              </header>
              <main class="cd-review-layout">
                <section>
                  <article class="cd-review-summary"><img :src="coverUrl" alt="儿童导尿术课程封面"><div><span class="cd-status tone-blue">临床技术性技能课程</span><h2>儿童导尿术（男性）</h2><p>住培一年级 · 负责人 刘国强 · 开发团队 8 人</p></div><strong>完整度<br><em>5 / 6</em></strong></article>
                  <article class="cd-review-card"><header><div><h2>完整性检查</h2><p>提交前请确认六大模块内容准确、完整。</p></div><a-button @click="runCheck">重新检查</a-button></header><div class="cd-check-list"><button v-for="item in reviewChecks" :key="item.label" :class="{ warning: !item.complete }" @click="page = 'editor'"><span v-html="item.complete ? icon('check-circle') : icon('alert-circle')"></span><div><strong>{{ item.label }}</strong><small>{{ item.note }}</small></div><em>{{ item.complete ? '已完成' : '待完善' }}</em><svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"></path></svg></button></div></article>
                  <article class="cd-missing-card"><header><h2>提交前建议完善</h2><span>1 项</span></header><div><strong>缺少学员评估表</strong><p>技能目标 S2 尚未关联学员评估工具。可暂存草稿，或返回补充后提交。</p><a-button size="small" @click="page = 'editor'">返回补充</a-button></div></article>
                </section>
                <aside class="cd-submit-panel"><h2>提交说明</h2><p>提交后课程将进入待审核状态，审核前如需修改可以撤回。</p><ul><li>管理员将审核课程内容与实施要求</li><li>返修意见会同步给课程开发团队</li><li>审核通过后成为可复用课程资产</li></ul><a-checkbox v-model="reviewConfirmed">我已确认课程档案内容准确</a-checkbox><a-button type="primary" size="large" long :disabled="!reviewConfirmed" @click="submitReview">提交审核</a-button><a-button long @click="previewCourse(editingCourse)">预览课程档案</a-button></aside>
              </main>
            </template>

            <a-modal :visible="successVisible" :footer="false" width="520px" @cancel="successVisible = false">
              <div class="cd-success"><span v-html="icon('check-circle', 24)"></span><h2>课程提交成功</h2><p>当前状态：待审核。管理员审核结果将同步给课程开发团队。</p><div><a-button @click="successVisible = false">查看课程档案</a-button><a-button type="primary" @click="backAfterSubmit">返回课程开发列表</a-button></div></div>
            </a-modal>

            <!-- 创建专项课程抽屉 -->
            <div v-if="createProgramVisible" class="cd-create-program-overlay" @click.self="createProgramVisible = false">
              <div class="cd-create-program-drawer">
                <div class="cd-cp-header">
                  <div class="cd-cp-header-left">
                    <span class="cd-cp-header-icon" v-html="icon('package')"></span>
                    <div>
                      <h2>创建专项课程</h2>
                      <p>将多个课次组合为一个系列，便于统一管理与排课</p>
                    </div>
                  </div>
                  <button class="cd-cp-close" @click="createProgramVisible = false" aria-label="关闭">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                </div>
                <div class="cd-cp-body">
                  <div class="cd-cp-section">
                    <h3 class="cd-cp-section-title"><span v-html="icon('alert-circle')" style="color:var(--color-primary);width:16px;height:16px;display:inline-flex;vertical-align:middle;margin-right:4px;"></span>基本信息</h3>
                    <div class="cd-cp-form-row cd-cp-form-row-3">
                      <label class="cd-cp-field">
                        <span>专项课程名称 <em>*</em></span>
                        <a-input v-model="programForm.name" placeholder="请输入专项课程名称"></a-input>
                      </label>
                      <label class="cd-cp-field">
                        <span>课次数量 <em>*</em></span>
                        <a-input-number v-model="programForm.sessionCount" :min="1" :max="20"></a-input-number>
                        <small>系列共含几个课次</small>
                      </label>
                      <label class="cd-cp-field">
                        <span>课程 ID</span>
                        <a-input v-model="programForm.courseId" disabled placeholder="自动生成"></a-input>
                      </label>
                    </div>
                    <div class="cd-cp-form-row cd-cp-form-row-2">
                      <label class="cd-cp-field">
                        <span>课程类型 <em>*</em></span>
                        <a-select v-model="programForm.type" placeholder="请选择课程类型">
                          <a-option v-for="type in courseTypes" :key="type" :value="type">{{ type }}</a-option>
                        </a-select>
                      </label>
                      <label class="cd-cp-field">
                        <span>课程负责人 <em>*</em></span>
                        <a-input-search v-model="programForm.ownerSearch" placeholder="搜索教师姓名或工号" allow-clear>
                          <template #prefix><span v-html="icon('search')" style="color:var(--color-text-3);"></span></template>
                        </a-input-search>
                        <small>输入姓名或工号快速匹配</small>
                      </label>
                    </div>
                    <div class="cd-cp-form-row cd-cp-form-row-2">
                      <label class="cd-cp-field">
                        <span>授课对象</span>
                        <a-select v-model="programForm.audience" placeholder="请选择类别" allow-clear>
                          <a-option v-for="aud in audienceOptions" :key="aud.value" :value="aud.value">{{ aud.label }}</a-option>
                        </a-select>
                      </label>
                      <label class="cd-cp-field cd-cp-field-empty">
                      </label>
                    </div>
                    <p class="cd-cp-hint">可选填，也可在添加全部课次后汇总填充</p>
                    <label class="cd-cp-field cd-cp-field-full">
                      <span>课程开发团队 <small style="font-weight:normal;color:var(--color-text-3);">（选填，将自动汇总各课次团队）</small></span>
                      <div class="cd-cp-team-search">
                        <a-input-search v-model="programForm.teamSearch" placeholder="搜索并添加团队成员姓名或工号" allow-clear style="flex:1;">
                          <template #prefix><span v-html="icon('search')" style="color:var(--color-text-3);"></span></template>
                        </a-input-search>
                        <a-button type="outline" @click="addTeamMember">＋ 添加</a-button>
                      </div>
                      <small>输入姓名或工号选择后点击添加</small>
                      <div v-if="programForm.teamMembers.length" class="cd-cp-team-tags">
                        <a-tag v-for="(member, idx) in programForm.teamMembers" :key="idx" closable @close="programForm.teamMembers.splice(idx, 1)">{{ member }}</a-tag>
                      </div>
                    </label>
                  </div>
                  <div class="cd-cp-tip">
                    <span v-html="icon('alert-circle')" style="color:var(--color-primary);width:16px;height:16px;display:inline-flex;vertical-align:middle;margin-right:4px;flex-shrink:0;"></span>
                    创建后可在专项课程卡片中点击<strong>编辑</strong>来添加课次、调整顺序和系列内名称。
                  </div>
                </div>
                <div class="cd-cp-footer">
                  <a-button @click="createProgramVisible = false">取消</a-button>
                  <a-button type="primary" @click="confirmCreateProgram">
                    <template #icon><span v-html="icon('check')"></span></template>
                    确认创建
                  </a-button>
                </div>
              </div>
            </div>

            <!-- 添加课程到专项课程抽屉 -->
            <div v-if="addCourseDrawerVisible" class="cd-add-course-overlay" @click.self="addCourseDrawerVisible = false">
              <div class="cd-add-course-drawer">
                <div class="cd-ac-header">
                  <div class="cd-ac-header-left">
                    <span class="cd-ac-header-icon" v-html="icon('plus')"></span>
                    <div>
                      <h2>添加课程到《{{ currentProgram ? currentProgram.name : '' }}》</h2>
                      <p>从课程池中选择要加入本专项课程的课次</p>
                    </div>
                  </div>
                  <button class="cd-ac-close" @click="addCourseDrawerVisible = false" aria-label="关闭">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                </div>
                <div class="cd-ac-body">
                  <div class="cd-ac-filter-row">
                    <a-select v-model="poolFilters.status" allow-clear placeholder="开发状态" style="width: 132px">
                      <a-option value="开发中">开发中</a-option><a-option value="待审核">待审核</a-option>
                      <a-option value="返修中">返修中</a-option><a-option value="审核通过">审核通过</a-option>
                      <a-option value="申请修订中">申请修订中</a-option>
                    </a-select>
                    <a-select v-model="poolFilters.type" allow-clear placeholder="课程类型" style="width: 140px">
                      <a-option value="临床技术性技能课程">临床技术性技能课程</a-option><a-option value="临床非技术性技能课程">临床非技术性技能课程</a-option>
                      <a-option value="情境模拟课程">情境模拟课程</a-option><a-option value="通识课程">通识课程</a-option>
                    </a-select>
                    <a-select v-model="poolFilters.audience" allow-clear placeholder="授课对象" style="width: 154px">
                      <a-option value="住培一年级">住培一年级</a-option>
                      <a-option value="住培二年级">住培二年级</a-option>
                      <a-option value="住培三年级">住培三年级</a-option>
                      <a-option value="专培一年级">专培一年级</a-option>
                      <a-option value="专培二年级">专培二年级</a-option>
                      <a-option value="专培三年级">专培三年级</a-option>
                      <a-option value="进修医师">进修医师</a-option>
                      <a-option value="进修护士">进修护士</a-option>
                      <a-option value="医生（本院职工）">医生（本院职工）</a-option>
                      <a-option value="护士（本院职工）">护士（本院职工）</a-option>
                      <a-option value="社会人员">社会人员</a-option>
                      <a-option value="本科生">本科生</a-option>
                      <a-option value="研究生">研究生</a-option>
                    </a-select>
                    <a-select v-model="poolFilters.year" allow-clear placeholder="全部年份" style="width: 112px">
                      <a-option value="2026">2026</a-option><a-option value="2025">2025</a-option>
                    </a-select>
                    <a-button type="text" @click="resetPoolFilters">重置</a-button>
                    <a-input-search v-model="poolFilters.keyword" allow-clear placeholder="搜索课程名称..." class="cd-ac-search"></a-input-search>
                  </div>
                  <div class="cd-ac-course-list">
                    <div v-for="course in filteredPoolCourses" :key="course.id" class="cd-ac-course-item" :class="{ selected: selectedPoolCourses.indexOf(course.id) !== -1 }" @click="togglePoolCourse(course.id)">
                      <div class="cd-ac-course-check">
                        <span v-if="selectedPoolCourses.indexOf(course.id) !== -1" v-html="icon('check-circle')"></span>
                      </div>
                      <div class="cd-ac-course-info">
                        <div class="cd-ac-course-main">
                          <span :class="'cd-status tone-' + statusTone(course.status)">{{ course.status }}</span>
                          <strong>{{ course.name }}</strong>
                        </div>
                        <div class="cd-ac-course-meta">
                          <span>{{ course.type }}</span>
                          <span>{{ course.audience }}</span>
                          <span>负责人：{{ course.owner }}</span>
                          <span>更新于 {{ course.updated }}</span>
                        </div>
                      </div>
                    </div>
                    <div v-if="!filteredPoolCourses.length" class="cd-empty">没有匹配的课程，请调整筛选条件。</div>
                  </div>
                </div>
                <div class="cd-ac-footer">
                  <div class="cd-ac-footer-info">
                    已选择 <strong>{{ selectedPoolCourses.length }}</strong> 门课程
                  </div>
                  <div class="cd-ac-footer-actions">
                    <a-button @click="addCourseDrawerVisible = false">取消</a-button>
                    <a-button type="primary" @click="confirmAddCourses">
                      <template #icon><span v-html="icon('check')"></span></template>
                      确认添加
                    </a-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `,
        data: function () {
          return {
            page: 'list', mainTab: 'course', viewMode: 'card', coverUrl: coverUrl, uploadImageUrl: uploadImageUrl, aiImageUrl: aiImageUrl,
            sidePanelOpen: true, activeAnchor: 'basic',
            addedItems: [
              { id: 1, name: '教师评估表', desc: '授课评价 × 2', icon: 'clipboard-check', tone: 'tone-blue' },
              { id: 2, name: '学员评估表', desc: '学习问卷 × 1', icon: 'clipboard-check', tone: 'tone-green' },
              { id: 3, name: '课程反馈链接', desc: '外部链接 × 3', icon: 'link', tone: 'tone-purple' }
            ],
            uploadedFiles: [
              { id: 1, name: '课件.pptx', size: '12.5 MB', icon: 'file-text', tone: 'tone-orange' },
              { id: 2, name: '操作指南.pdf', size: '3.2 MB', icon: 'file-text', tone: 'tone-blue' },
              { id: 3, name: '示范视频.mp4', size: '156 MB', icon: 'video', tone: 'tone-purple' }
            ],
            filters: { status: '', type: '', audience: '', year: '', keyword: '' },
            stats: [
              { key: '开发中', label: '开发中课程', value: 6, tone: 'blue', icon: '<svg viewBox="0 0 24 24"><path d="M7 3h10l4 4v14H3V3h4Z"></path><path d="M8 12h8M8 16h6"></path></svg>' },
              { key: '待审核', label: '待审核课程', value: 3, tone: 'orange', icon: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></svg>' },
              { key: '返修中', label: '返修中课程', value: 1, tone: 'red', icon: '<svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 3-6"></path><path d="M4 4v6h6"></path></svg>' },
              { key: 'program', label: '专项课程', value: 4, tone: 'green', icon: '<svg viewBox="0 0 24 24"><path d="M4 5h16v14H4z"></path><path d="M8 9h8M8 13h8M8 17h5"></path></svg>' }
            ],
            courses: [
              { id: 1, name: '儿童导尿术（男性）', type: '临床技术性技能课程', audience: '住培一年级', owner: '刘国强', team: 8, updated: '2026-04-28', year: '2026', status: '开发中', step: 1, complete: 5, missing: '资源与评估', programs: ['儿科住培一年级基础技能训练'], cover: coverUrl },
              { id: 2, name: '坏消息告知', type: '临床非技术性技能课程', audience: '住培二年级', owner: '张盛鑫', team: 7, updated: '2026-04-18', year: '2026', status: '待审核', step: 2, complete: 6, missing: '', programs: ['人文沟通能力提升训练营'], cover: coverUrl },
              { id: 3, name: '梗阻性休克的识别与处理', type: '情境模拟课程', audience: '专培一年级', owner: '张盛鑫', team: 7, updated: '2026-04-06', year: '2026', status: '审核通过', step: 3, complete: 6, missing: '', programs: ['儿科急救技能训练营'], cover: coverUrl },
              { id: 4, name: '腰椎穿刺术', type: '临床技术性技能课程', audience: '住培一年级', owner: '李娜', team: 4, updated: '2026-05-08', year: '2026', status: '返修中', step: 1, complete: 4, missing: '课程目标、评估工具', programs: ['儿科住培一年级基础技能训练'], cover: coverUrl },
              { id: 5, name: '新生儿复苏（NRP）', type: '临床技术性技能课程', audience: '专培一年级', owner: '王明', team: 7, updated: '2026-04-30', year: '2026', status: '审核通过', step: 3, complete: 6, missing: '', programs: ['新生儿复苏专项训练'], cover: coverUrl },
              { id: 6, name: '支气管哮喘的评估与管理', type: '通识课程', audience: '本科生', owner: '陈国平', team: 5, updated: '2026-05-03', year: '2026', status: '申请修订中', step: 3, complete: 6, missing: '', programs: [], cover: coverUrl }
            ],
            programs: [
              { id: 1, name: 'AHA项目：PALS', audience: '专培一年级', owner: '刘国强', team: 6, total: 2, approved: 1, updated: '2026-05-09', expanded: false, composition: ['临床技术性技能课程 1', '情境模拟课程 1'], source: '引进课程', lessons: [
                { name: 'PALS · 课次一：理论基础与快速识别', source: '儿科心肺复苏理论基础（PALS）', type: '临床技术性技能课程', owner: '刘国强', status: '审核通过' },
                { name: 'PALS · 课次二：高级生命支持情境模拟', source: '儿科AHA-PALS团队情境模拟训练', type: '情境模拟课程', owner: '张盛鑫', status: '待审核' }
              ]},
              { id: 2, name: '中国儿童医学模拟导师通识课程项目', audience: '医生（本院职工）', owner: '刘国强', team: 11, total: 11, approved: 11, updated: '2026-06-01', expanded: false, composition: ['通识课程 11'], source: '原创课程', lessons: [
                { name: '课次一：模拟教学的概论、历史与国际国内进展·模拟提升改善患者安全', source: '模拟教学的概论、历史与国际国内进展·模拟提升改善患者安全', type: '通识课程', owner: '吕建平', status: '审核通过' },
                { name: '课次二：医学模拟在医务人员临床能力培养的价值和应用', source: '医学模拟在医务人员临床能力培养的价值和应用', type: '通识课程', owner: '陈志桥', status: '审核通过' },
                { name: '课次三：医学模拟教育学原理', source: '医学模拟教育学原理', type: '通识课程', owner: '林轶群', status: '审核通过' },
                { name: '课次四：医学模拟的技术和方法', source: '医学模拟的技术和方法', type: '通识课程', owner: '钱欣', status: '审核通过' },
                { name: '课次五：教学设计在技能模拟培训中的运用', source: '教学设计在技能模拟培训中的运用', type: '通识课程', owner: '林轶群', status: '审核通过' },
                { name: '课次六：医学模拟技能课程设计（含医学模拟引导）', source: '医学模拟技能课程设计（含医学模拟引导）', type: '通识课程', owner: '陈志桥', status: '审核通过' },
                { name: '课次七：医学模拟前简介：准备和介绍', source: '医学模拟前简介：准备和介绍', type: '通识课程', owner: '林轶群', status: '审核通过' },
                { name: '课次八：实践技能考站（OSCE）命制与实施', source: '实践技能考站（OSCE）命制与实施', type: '通识课程', owner: '陈志桥', status: '审核通过' },
                { name: '课次九：医学模拟中的反馈', source: '医学模拟中的反馈', type: '通识课程', owner: '项明方', status: '审核通过' },
                { name: '课次十：医学模拟复盘', source: '医学模拟复盘', type: '通识课程', owner: '刘小娥', status: '审核通过' },
                { name: '课次十一：医学模拟的评估与评价', source: '医学模拟的评估与评价', type: '通识课程', owner: '任增福', status: '审核通过' }
              ]}
            ],
            startMethod: 'upload', uploaded: false, parsed: false, aiCreateVisible: false, templateVisible: false, selectedTemplate: '技能课程模板',
            demoLibraryVisible: false, demoSearch: '', demoSelectedAudience: 0, demoSelectedTab: 0, demoSelectedLesson: '',
            demoPreviewVisible: false, demoVideoVisible: false, currentPreviewLesson: null, currentPreviewVideo: null,
            // 示范库数据统一从 window.CourseDemoData 读取（深拷贝避免污染公共数据）
            // 数据源位于 shared/modules/course-demo-data.js
            demoLibrary: (function () {
              if (window.CourseDemoData && typeof window.CourseDemoData.getNestedLibrary === 'function') {
                return window.CourseDemoData.deepClone(window.CourseDemoData.getNestedLibrary());
              }
              // 数据源未加载时的回退（保持页面不报错）
              return [
                {
                  audience: '学员培训',
                  tabs: [
                    { label: '临床技术性技能课程', lessons: [], videos: [] },
                    { label: '临床非技术性技能课程', lessons: [], videos: [] },
                    { label: '情境模拟课程', lessons: [], videos: [] }
                  ]
                },
                {
                  audience: '师资培训',
                  tabs: [
                    { label: '临床技术性技能课程', lessons: [], videos: [] },
                    { label: '临床非技术性技能课程', lessons: [], videos: [] },
                    { label: '情境模拟课程', lessons: [], videos: [] }
                  ]
                }
              ];
            })(),
            methods: [
              { key: 'upload', title: '已有教案，帮我标准化', desc: '上传 Word、PDF 或 PPT，AI 自动识别并整理为标准教案。', action: '上传并解析', tone: 'blue', helper: '上传已有教案，AI 将识别课程结构与待确认信息。', icon: '<svg viewBox="0 0 24 24"><path d="M12 16V4m0 0L7 9m5-5 5 5"></path><path d="M4 15v4h16v-4"></path></svg>' },
              { key: 'idea', title: '只有想法，AI 帮我生成', desc: '输入课程主题、目标与参考资料，生成可编辑的教案初稿。', action: '描述课程想法', tone: 'purple', helper: '描述课程主题与教学目标，AI 将生成第一版教案。', icon: '<svg viewBox="0 0 24 24"><path d="M9 18h6M10 22h4"></path><path d="M8 14a7 7 0 1 1 8 0c-1 1-1 2-1 2h-6s0-1-1-2Z"></path></svg>' },
              { key: 'template', title: '从模板开始', desc: '选择成熟课程模板，再由 AI 根据主题和资料补充内容。', action: '选择课程模板', tone: 'green', helper: '选择课程类型模板，快速获得符合规范的六大模块结构。', icon: '<svg viewBox="0 0 24 24"><path d="M4 4h16v16H4z"></path><path d="M8 8h8M8 12h8M8 16h5"></path></svg>' }
            ],
            templates: ['临床技术性技能课程模板', '临床非技术性技能课程模板', '情境模拟课程模板', '通识课程模板', '小讲课模板', '病例讨论模板'],
            courseTypes: ['临床技术性技能课程', '临床非技术性技能课程', '情境模拟课程', '通识课程'],
            startForm: { name: '儿童导尿术（男性）', type: '临床技术性技能课程', audience: '住培一年级', owner: '刘国强', idea: '' },
            recognized: ['已识别技能站', '已识别实施要求', '已识别资源材料', '已识别评估表'],
            editingCourse: { name: '儿童导尿术（男性）', type: '临床技术性技能课程', audience: '住培一年级', owner: '刘国强', teacherTeam: ['刘国强', '王雨桐', '蔡小芳'], cover: coverUrl },
            teacherOptions: [
              { value: '刘国强', label: '刘国强 / 主任医师', avatar: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f1344837483c84025a1e749c957e.png~tplv-uwbnlip3yd-webp.webp' },
              { value: '王雨桐', label: '王雨桐 / 副主任医师', avatar: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f1344837483c84025a1e749c957e.png~tplv-uwbnlip3yd-webp.webp' },
              { value: '蔡小芳', label: '蔡小芳 / 主治医师', avatar: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f1344837483c84025a1e749c957e.png~tplv-uwbnlip3yd-webp.webp' },
              { value: '李娜', label: '李娜 / 主治医师', avatar: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f1344837483c84025a1e749c957e.png~tplv-uwbnlip3yd-webp.webp' },
              { value: '陈国平', label: '陈国平 / 教授', avatar: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f1344837483c84025a1e749c957e.png~tplv-uwbnlip3yd-webp.webp' }
            ],
            audienceOptions: [
              { value: '住培一年级', label: '住培一年级' },
              { value: '住培二年级', label: '住培二年级' },
              { value: '住培三年级', label: '住培三年级' },
              { value: '专培一年级', label: '专培一年级' },
              { value: '专培二年级', label: '专培二年级' },
              { value: '专培三年级', label: '专培三年级' },
              { value: '进修医师', label: '进修医师' },
              { value: '进修护士', label: '进修护士' },
              { value: '医生（本院职工）', label: '医生（本院职工）' },
              { value: '护士（本院职工）', label: '护士（本院职工）' },
              { value: '社会人员', label: '社会人员' },
              { value: '本科生', label: '本科生' },
              { value: '研究生', label: '研究生' }
            ],
            basicEditing: false, overviewEditing: false, basisEditing: false, preLetterEnabled: false, contentEditingId: '', stageEditingId: '', draggedIndex: null, draggedStageIdx: null,
            courseOverview: '课程聚焦住培医师在严格无菌条件下完成男性患儿导尿操作的核心能力，结合分步教学、技能站训练和即时反馈完成标准化培养。',
            courseBasis: '依据住培能力培养要求、儿科学教学标准与岗位胜任力框架构建课程内容，重点支持技能训练、临床推理和规范操作。',
            preLetter: '各位同学，本节课将围绕儿童导尿术展开，请提前阅读学员手册并完成课前测。',
            editorDrawerVisible: false, editorDrawerTitle: '', drawerForm: { title: '', desc: '' }, drawerItems: ['标准配置项 A', '标准配置项 B'],
            componentTab: 'resources',
            resourceFilter: { type: '', keyword: '' },
            resourceSelected: [],
            resourceList: [
              { id: 1, name: '儿童导尿术操作指南.pdf', type: '文档', size: '2.3 MB', icon: 'file-text' },
              { id: 2, name: '无菌操作原则.pdf', type: '文档', size: '1.1 MB', icon: 'file-text' },
              { id: 3, name: '儿童导尿术操作示范.mp4', type: '视频', size: '18.5 MB', icon: 'video' },
              { id: 4, name: '操作流程图.png', type: '图片', size: '320 KB', icon: 'image' },
              { id: 5, name: '评估量表.pdf', type: '文档', size: '560 KB', icon: 'file-text' }
            ],
            refCourseFilter: { type: '', keyword: '' },
            refCourseList: [
              { id: 1, name: '无菌操作基础', type: '临床技术性技能课程', audience: '住培一年级' },
              { id: 2, name: '医患沟通技巧', type: '临床非技术性技能课程', audience: '住培一年级' }
            ],
            onlineConfig: { platforms: [], course: '' },
            assessmentConfig: { types: [], rubric: '' },
            homeworkConfig: { name: '', type: 'upload', deadline: '' },
            prereqConfig: { required: [], course: '' },
            assessmentTab: 'student',
            attachmentTab: 'handbook',
            personnelMaterialTab: 'personnel',
            studentAssessments: {
              surveys: [
                { name: '课前学习问卷', type: '选择题', questions: 10 },
                { name: '课后反馈问卷', type: '混合题型', questions: 15 }
              ],
              feedback: [
                { name: '课程满意度调查', type: '量表题' },
                { name: '教学效果反馈', type: '开放题' }
              ]
            },
            teacherAssessments: {
              evaluations: [
                { name: '导师授课评价表', criteria: 8 },
                { name: '助教工作评价表', criteria: 6 }
              ],
              exams: [
                { name: '理论知识考试', questions: 50, duration: 60 },
                { name: '案例分析考试', questions: 5, duration: 90 }
              ]
            },
            attachmentLibrary: {
              handbooks: [
                { name: '学员手册-儿童导尿术.pdf', size: '2.5 MB', updated: '2026-05-20' },
                { name: '操作指南手册.pdf', size: '3.2 MB', updated: '2026-05-18' }
              ],
              tests: [
                { name: '课前测试题', questions: 10, duration: 15 },
                { name: '课后测试题', questions: 20, duration: 30 }
              ],
              rubrics: [
                { name: '导尿术操作评分表', criteria: 12 },
                { name: '沟通能力评分表', criteria: 8 }
              ],
              references: [
                { name: '临床操作规范.pdf', size: '1.8 MB', type: 'PDF文档' },
                { name: '相关文献汇编.pdf', size: '4.5 MB', type: 'PDF文档' }
              ]
            },
            personnelConfig: {
              instructors: [
                { name: '刘国强', title: '主任医师', role: '主讲导师' },
                { name: '王雨桐', title: '副主任医师', role: '操作指导' }
              ],
              assistants: [
                { name: '蔡小芳', title: '主治医师' },
                { name: '李娜', title: '主治医师' }
              ]
            },
            materialsConfig: {
              equipment: [
                { name: '导尿术模拟训练器', quantity: 4, unit: '台' },
                { name: '多媒体投影设备', quantity: 1, unit: '套' },
                { name: '监控录像系统', quantity: 1, unit: '套' }
              ],
              consumables: [
                { name: '导尿管', quantity: 20, unit: '根' },
                { name: '无菌手套', quantity: 40, unit: '副' },
                { name: '消毒液', quantity: 10, unit: '瓶' },
                { name: '润滑剂', quantity: 20, unit: '支' }
              ]
            },
            contentStages: [
              { id: 'pre', title: '课前阶段', description: 'AI 自动识别：课前预习、资料学习、课前测试等内容', rows: [
                { id: 1, seq: '1', title: '课前信', desc: '已生成，含学习目标与准备要求', duration: 0, methods: [], resources: 1, assessments: 0, resourcesList: ['课前信模板'], assessmentsList: [] },
                { id: 2, seq: '2', title: '课前学习资料', desc: '5 份资料', duration: 0, methods: [], resources: 5, assessments: 0, resourcesList: ['操作指南.pdf', '流程图.png', '评估表.pdf', '示范视频.mp4', '练习手册.pdf'], assessmentsList: [] },
                { id: 3, seq: '3', title: '课前视频', desc: '1 个操作示范视频', duration: 15, methods: ['视频学习'], resources: 1, assessments: 0, resourcesList: ['儿童导尿术操作示范.mp4'], assessmentsList: [] },
                { id: 4, seq: '4', title: '课前测试', desc: '10 题 · 已配置', duration: 10, methods: ['在线测试'], resources: 0, assessments: 1, resourcesList: [], assessmentsList: ['课前测验'] }
              ]},
              { id: 'in', title: '课中阶段', description: 'AI 自动识别：课堂导入、讲授、示教、实操、考核与总结等内容', rows: [
                { id: 5, seq: '1', title: '模块：绪论与操作要点', desc: '适应证、禁忌证、无菌原则与风险识别。', duration: 45, methods: ['CBL', '小组讨论'], resources: 2, assessments: 2, resourcesList: ['操作指南.pdf', '流程图.png'], assessmentsList: ['课堂提问', '操作评分'] },
                { id: 6, seq: '1.1', title: '操作前准备与患儿评估', desc: '核对身份、评估患儿状态并完成沟通。', duration: 45, methods: ['理论授课', '提问互动'], resources: 2, assessments: 1, resourcesList: ['评估表.pdf'], assessmentsList: ['操作评分'] },
                { id: 7, seq: '1.2', title: '导尿操作分步演示', desc: '导师演示关键步骤、常见错误与风险处置。', duration: 45, methods: ['同步演示', '课堂练习'], resources: 1, assessments: 1, resourcesList: ['示范视频.mp4'], assessmentsList: ['步骤检查表'] },
                { id: 8, seq: '2', title: '技能站轮转练习', desc: '学员分组完成操作练习，导师即时反馈。', duration: 45, methods: ['技能站', '反馈'], resources: 2, assessments: 2, resourcesList: ['练习手册.pdf', '评分表.pdf'], assessmentsList: ['技能考核', '同伴评价'] }
              ]},
              { id: 'post', title: '课后阶段', description: 'AI 自动识别：课后延伸、临床观察、作业反馈等内容', rows: [
                { id: 9, seq: '1', title: '课后作业', desc: '提交操作反思记录，列出至少两项改进措施', duration: 0, methods: ['作业提交'], resources: 0, assessments: 1, resourcesList: [], assessmentsList: ['操作反思报告'] },
                { id: 10, seq: '2', title: '临床观察', desc: '在临床场景中应用所学技能', duration: 0, methods: ['临床实践'], resources: 0, assessments: 1, resourcesList: [], assessmentsList: ['临床观察记录'] }
              ]}
            ],
            stages: [
              { id: 1, title: '理论教学阶段', duration: 48, ratio: '1:200', mode: '线下', site: '多媒体教室', people: 1, materials: 1 },
              { id: 2, title: '技能教学阶段', duration: 20, ratio: '1:40', mode: '线下', site: '技能培训中心', people: 2, materials: 3 },
              { id: 3, title: '临床实践阶段', duration: 10, ratio: '1:8', mode: '线下', site: '临床技能中心', people: 2, materials: 2 }
            ],
            attachments: [{ title: '学员手册', count: 2, icon: 'book-open' }, { title: '测试题', count: 1, icon: 'file-question' }, { title: '评分表', count: 2, icon: 'clipboard-check' }, { title: '参考资料', count: 1, icon: 'library' }],
            activeModule: 'basic', aiVisible: false, aiModule: '当前教案', aiInput: '', successVisible: false, reviewConfirmed: false,
            createProgramVisible: false,
            programForm: { name: '', sessionCount: 2, courseId: '', type: '', ownerSearch: '', audience: '', teamSearch: '', teamMembers: [] },
            addCourseDrawerVisible: false,
            currentProgram: null,
            poolFilters: { status: '', type: '', audience: '', year: '', keyword: '' },
            selectedPoolCourses: [],
            modules: [{ key: 'basic', label: '基本信息', complete: true }, { key: 'goals', label: '课程目标', complete: true }, { key: 'pre', label: '课前内容', complete: true }, { key: 'content', label: '课程内容', complete: true }, { key: 'requirements', label: '课程实施要求', complete: true }, { key: 'resources', label: '资源与评估', complete: false }],
            goals: [{ code: 'K', title: '知识目标', text: '掌握儿童导尿术的适应证、禁忌证与无菌原则。', tag: '重点', tone: 'blue' }, { code: 'S', title: '技能目标', text: '能够规范完成男性患儿导尿全流程。', tag: '重点 · 难点', tone: 'orange' }, { code: 'A', title: '情感目标', text: '建立患儿隐私保护和人文沟通意识。', tag: '已关联评估', tone: 'green' }],
            objectiveDrawerVisible: false,
            objectives: [
              { id: 'obj-1', type: '知识目标', goals: [
                { code: 'K1', text: '掌握儿童导尿术的适应证、禁忌证与无菌原则。' },
                { code: 'K2', text: '能够列举导尿术常见并发症及其预防措施。' },
                { code: 'K3', text: '说明导尿术前评估要点与知情同意流程。' }
              ], competencies: [['knowledgeSkill', 'basicTheory'], ['knowledgeSkill', 'clinicalDiagnosis']] },
              { id: 'obj-2', type: '技能目标', goals: [
                { code: 'S1', text: '能够规范完成男性患儿导尿全流程操作。' },
                { code: 'S2', text: '能够在模拟场景中正确选择导尿管型号与润滑材料。' }
              ], competencies: [['knowledgeSkill', 'skillOperation'], ['patientCare', 'treatmentPlan']] },
              { id: 'obj-3', type: '情感目标', goals: [
                { code: 'A1', text: '建立患儿隐私保护和人文沟通意识。' },
                { code: 'A2', text: '形成在操作前充分告知并取得配合的职业态度。' }
              ], competencies: [['professionalism', 'medicalEthics'], ['communication', 'doctorPatientCommunication']] }
            ],
            acgmeCompetencyOptions: [
              { value: 'professionalism', label: '职业素养', children: [
                { value: 'medicalEthics', label: '医学伦理' },
                { value: 'lawsRegulations', label: '法律法规' },
                { value: 'professionalSpirit', label: '职业精神' },
                { value: 'altruism', label: '利他主义' }
              ]},
              { value: 'knowledgeSkill', label: '知识技能', children: [
                { value: 'basicTheory', label: '基础理论' },
                { value: 'clinicalDiagnosis', label: '临床诊断' },
                { value: 'skillOperation', label: '技能操作' },
                { value: 'clinicalReasoning', label: '临床推理' }
              ]},
              { value: 'patientCare', label: '病人照护', children: [
                { value: 'historyTaking', label: '病史采集' },
                { value: 'treatmentPlan', label: '治疗方案' },
                { value: 'patientManagement', label: '患者管理' },
                { value: 'informedConsent', label: '知情同意' }
              ]},
              { value: 'communication', label: '沟通合作', children: [
                { value: 'doctorPatientCommunication', label: '医患沟通' },
                { value: 'teamwork', label: '团队协作' },
                { value: 'multidisciplinaryCooperation', label: '多学科合作' }
              ]},
              { value: 'lifelongLearning', label: '终身学习', children: [
                { value: 'informationRetrieval', label: '信息检索' },
                { value: 'criticalThinking', label: '批判性思维' },
                { value: 'selfAssessment', label: '自我评估' }
              ]},
              { value: 'teachingAbility', label: '教学能力', children: [
                { value: 'healthEducation', label: '健康宣教' },
                { value: 'clinicalTeaching', label: '临床带教' },
                { value: 'teachingDesign', label: '教学设计' }
              ]}
            ],
            preClass: [{ title: '课前信', value: '已生成，含学习目标与准备要求', icon: '<svg viewBox="0 0 24 24"><path d="M4 5h16v14H4z"></path><path d="m4 7 8 6 8-6"></path></svg>' }, { title: '课前学习资料', value: '5 份资料', icon: '<svg viewBox="0 0 24 24"><path d="M6 3h12v18H6z"></path><path d="M9 8h6M9 12h6"></path></svg>' }, { title: '课前视频', value: '1 个操作示范视频', icon: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14"></rect><path d="m10 9 5 3-5 3Z"></path></svg>' }, { title: '课前测试', value: '10 题 · 已配置', icon: '<svg viewBox="0 0 24 24"><path d="M7 3h10v18H7z"></path><path d="M10 8h4M10 12h4"></path></svg>' }],
            requirements: [{ title: '时间安排', value: '总时长 90 分钟', icon: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></svg>' }, { title: '人员要求', value: '导师 4 人、助教 1 人、协调员 1 人', icon: '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"></circle><path d="M4 20v-2a5 5 0 0 1 10 0v2"></path><path d="M16 11a4 4 0 0 1 4 4v5"></path></svg>' }, { title: '场地要求', value: '技能培训中心示教室', icon: '<svg viewBox="0 0 24 24"><path d="M4 21V5l8-3v19M20 21V9l-8-4"></path></svg>' }, { title: '设备与物资', value: '模拟训练器 2 台、物资 23 项', icon: '<svg viewBox="0 0 24 24"><path d="m3 7 9-4 9 4-9 4-9-4Z"></path><path d="M3 7v10l9 4 9-4V7"></path></svg>' }],
            resources: [{ title: '学习资源', value: 'PPT 1 份、视频 1 个、文献 6 篇', warning: false, icon: '<svg viewBox="0 0 24 24"><path d="M4 4h16v16H4z"></path><path d="M8 8h8M8 12h8M8 16h5"></path></svg>' }, { title: '评估工具', value: '导师评估表 4 份，缺少学员评估表', warning: true, icon: '<svg viewBox="0 0 24 24"><path d="M7 3h10v18H7z"></path><path d="m10 12 2 2 4-5"></path></svg>' }, { title: '反馈要求', value: '实时反馈、操作后反馈、Plus / Delta', warning: false, icon: '<svg viewBox="0 0 24 24"><path d="M4 4h16v13H8l-4 4V4Z"></path></svg>' }, { title: '补习计划', value: '已配置未通过处理与再考核安排', warning: false, icon: '<svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 3-6"></path><path d="M4 4v6h6"></path></svg>' }],
            reviewChecks: [{ label: '基本信息', complete: true, note: '课程信息、负责人和开发团队已填写' }, { label: '课程目标', complete: true, note: 'K / S / A 三类目标已配置' }, { label: '课前内容', complete: true, note: '课前信、资料、视频和课前测已配置' }, { label: '课程内容', complete: true, note: '教学模块、技能站与操作步骤已配置' }, { label: '课程实施要求', complete: true, note: '时间、人员、场地、设备和物资已配置' }, { label: '资源与评估', complete: false, note: '缺少学员评估表' }],
            aiActions: ['补齐缺失项', '改写为标准表达', '关联课程内容与评估', '生成评估项']
          };
        },
        computed: {
          filteredCourses: function () {
            var f = this.filters;
            return this.courses.filter(function (course) {
              var text = (course.name + course.owner).toLowerCase();
              return (!f.status || course.status === f.status) && (!f.type || course.type === f.type) && (!f.audience || course.audience === f.audience) && (!f.year || course.year === f.year) && (!f.keyword || text.indexOf(f.keyword.toLowerCase()) !== -1);
            });
          },
          filteredPoolCourses: function () {
            var f = this.poolFilters;
            var program = this.currentProgram;
            return this.courses.filter(function (course) {
              var text = (course.name + course.owner).toLowerCase();
              var alreadyInProgram = program && program.lessons && program.lessons.some(function (l) { return l.source === course.name; });
              return !alreadyInProgram && (!f.status || course.status === f.status) && (!f.type || course.type === f.type) && (!f.audience || course.audience === f.audience) && (!f.year || course.year === f.year) && (!f.keyword || text.indexOf(f.keyword.toLowerCase()) !== -1);
            });
          },
          currentDemoAudience: function () { return this.demoLibrary[this.demoSelectedAudience] || {}; },
          filteredDemoResults: function () {
            if (!this.demoSearch) return [];
            var results = [];
            this.demoLibrary.forEach(function (audience) {
              audience.tabs.forEach(function (tab) {
                tab.lessons.forEach(function (lesson, idx) {
                  if (lesson.courseName.toLowerCase().indexOf(this.demoSearch.toLowerCase()) !== -1) {
                    results.push({ key: audience.audience + '-' + tab.label + '-' + idx, audience: audience.audience, tabLabel: tab.label, courseName: lesson.courseName, teacher: lesson.teacher, dept: lesson.dept, video: lesson.video });
                  }
                }.bind(this));
              }.bind(this));
            }.bind(this));
            return results;
          },
          totalContentRows: function () {
            var total = 0;
            this.contentStages.forEach(function (stage) { total += stage.rows.length; });
            return total;
          },
          assistantPromptText: function () {
            var name = this.editingCourse && this.editingCourse.name ? this.editingCourse.name : '当前教案';
            return '帮我完善《' + name + '》教案';
          },
          assistantCourseFocus: function () {
            var firstStage = this.contentStages && this.contentStages[0] ? this.contentStages[0].title : '课程内容';
            var firstGoal = this.objectives && this.objectives[0] && this.objectives[0].goals[0] ? this.objectives[0].goals[0].text : '课程目标';
            return firstStage + '已配置，建议继续核对“' + firstGoal + '”与考核方式、资源材料是否一一对应。';
          },
          assistantCourseQuestions: function () {
            var name = this.editingCourse && this.editingCourse.name ? this.editingCourse.name : '当前课程';
            var audience = this.editingCourse && this.editingCourse.audience ? this.editingCourse.audience : '当前学员';
            return [
              '这份《' + name + '》教案还缺哪些关键模块？',
              '如何把教学目标改写得更适合' + audience + '？',
              '课程内容和考核评价是否已经对齐？',
              '帮我生成课前准备和课后反馈建议'
            ];
          },
          assistantCourseRisks: function () {
            var incomplete = this.reviewChecks.filter(function (item) { return !item.complete; }).map(function (item) { return item.label + '：' + item.note; });
            if (incomplete.length) return incomplete;
            return [
              '建议复核师生比、场地和物资数量是否满足授课安排',
              '建议检查每个技能目标是否有关联评分表',
              '建议确认课前资料、示范视频和课后作业已上传'
            ];
          },
          currentMethod: function () { return this.methods.find(function (item) { return item.key === this.startMethod; }.bind(this)) || this.methods[0]; },
          contentCards: function () {
            if (this.editingCourse.type === '非技能课程') return [
              { title: '模块 1：建立关系与沟通框架', desc: '视频导入、讨论与 SPIKES 框架讲解', tags: ['视频示范', '讨论'], duration: '20 min' },
              { title: '沟通技能站：坏消息告知练习', desc: 'SP 脚本、情绪反应与沟通评价', tags: ['SP 脚本', '沟通评价'], duration: '35 min' },
              { title: '模块 3：反馈与复盘', desc: 'Plus / Delta 反馈与自我反思', tags: ['反馈', '复盘'], duration: '20 min' }
            ];
            if (this.editingCourse.type === '情景模拟课程') return [
              { title: '情景 1：初始接诊', desc: '识别患儿危重状态，模拟人 SpO2 持续下降', tags: ['触发事件', '生命体征'], duration: '12 min' },
              { title: '情景 2：团队处置', desc: '完成气道、循环评估与团队任务分工', tags: ['团队协作', '参数变化'], duration: '18 min' },
              { title: '复盘设计', desc: '教师提示、预期行为与 Debriefing 问题', tags: ['复盘', '常见错误'], duration: '25 min' }
            ];
            return [
              { title: '模块 1：导入与知识准备', desc: '适应证、禁忌证、无菌原则与操作风险', tags: ['理论讲授', '视频导入'], duration: '15 min' },
              { title: '模块 2：导师分步演示', desc: '操作前准备、清洁消毒、导尿管置入与固定', tags: ['同步演示', '流程图'], duration: '20 min' },
              { title: '技能站：操作分步练习', desc: '四个技能站轮转训练，导师即时反馈', tags: ['技能站', '评分表'], duration: '40 min' },
              { title: '模块 4：总结与评估', desc: '关键动作复盘、常见错误与课后测', tags: ['评估', '反馈'], duration: '15 min' }
            ];
          }
        },
        methods: {
          icon: icon,
          statusTone: function (status) { return ({ '开发中': 'blue', '待审核': 'orange', '返修中': 'red', '审核通过': 'green', '申请修订中': 'purple' })[status] || 'gray'; },
          primaryAction: function (course) { return ({ '开发中': '继续编辑', '待审核': '查看详情', '返修中': '处理返修', '审核通过': '查看详情', '申请修订中': '查看详情' })[course.status] || '查看详情'; },
          resetFilters: function () { this.filters = { status: '', type: '', audience: '', year: '', keyword: '' }; },
          applyStat: function (stat) { if (stat.key === 'program') this.mainTab = 'program'; else { this.mainTab = 'course'; this.filters.status = stat.key; } },
          openStart: function () { this.page = 'start'; },
          openDemoLibrary: function () { this.demoLibraryVisible = true; },
          previewDemoLesson: function (lesson) { this.currentPreviewLesson = lesson; this.demoPreviewVisible = true; },
          previewDemoVideo: function (video) { this.currentPreviewVideo = video; this.demoVideoVisible = true; },
          downloadDemoTemplate: function () { this.$message.success('已下载空白模板：' + (this.demoSelectedLesson || '课程模板')); },
          downloadDemoLesson: function () { this.$message.success('已下载示范教案：' + (this.demoSelectedLesson || '课程教案')); },
          createCourseFromDemo: function () {
            this.demoLibraryVisible = false;
            this.demoPreviewVisible = false;
            this.$message.success('已基于《' + (this.demoSelectedLesson || '示范课程') + '》创建新课程');
            this.page = 'editor';
            window.scrollTo(0, 0);
          },
          selectMethod: function (method) { this.startMethod = method; this.parsed = false; },
          simulateUpload: function () { this.uploaded = true; this.$message.success('已读取《儿童导尿术教案.docx》'); },
          generateDraft: function () { this.uploaded = true; this.parsed = true; this.$message.success('AI 已生成第一版标准教案'); setTimeout(function () { document.querySelector('.cd-parse-panel')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 100); },
          enterEditor: function () {
            this.aiCreateVisible = false;
            this.templateVisible = false;
            // 填充 mock 课程数据
            this.editingCourse = {
              name: '儿童导尿术（男性）',
              type: '临床技术性技能课程',
              audience: '住培一年级',
              owner: '刘国强',
              teacherTeam: ['刘国强', '王雨桐', '蔡小芳'],
              cover: coverUrl
            };
            this.page = 'editor';
            window.scrollTo(0, 0);
          },
          courseAction: function (course) {
            // 设置当前编辑的课程数据
            this.editingCourse = {
              name: course.name,
              type: course.type,
              audience: course.audience,
              owner: course.owner,
              teacherTeam: ['刘国强', '王雨桐', '蔡小芳'],
              cover: course.cover || coverUrl
            };
            if (course.status === '开发中' || course.status === '返修中') {
              this.page = 'editor';
              window.scrollTo(0, 0);
            } else {
              this.previewCourse(course);
            }
          },
          previewCourse: function (course) { this.$message.info('正在预览《' + (course.name || course.source) + '》标准课程档案'); },
          joinProgram: function (course) { if (!course.programs.includes('新生儿专科技能训练')) course.programs.push('新生儿专科技能训练'); this.$message.success('已加入专项课程'); },
          addCourseToProgram: function (program) {
            this.currentProgram = program;
            this.selectedPoolCourses = [];
            this.poolFilters = { status: '', type: '', audience: '', year: '', keyword: '' };
            this.addCourseDrawerVisible = true;
          },
          resetPoolFilters: function () {
            this.poolFilters = { status: '', type: '', audience: '', year: '', keyword: '' };
          },
          togglePoolCourse: function (courseId) {
            var idx = this.selectedPoolCourses.indexOf(courseId);
            if (idx !== -1) {
              this.selectedPoolCourses.splice(idx, 1);
            } else {
              this.selectedPoolCourses.push(courseId);
            }
          },
          confirmAddCourses: function () {
            if (!this.selectedPoolCourses.length) { this.$message.warning('请至少选择一门课程'); return; }
            var program = this.currentProgram;
            var self = this;
            this.selectedPoolCourses.forEach(function (courseId) {
              var course = self.courses.find(function (c) { return c.id === courseId; });
              if (course && program) {
                program.lessons.push({
                  name: course.name,
                  source: course.name,
                  type: course.type,
                  owner: course.owner,
                  status: course.status
                });
                program.total = program.lessons.length;
              }
            });
            this.addCourseDrawerVisible = false;
            this.$message.success('已添加 ' + this.selectedPoolCourses.length + ' 门课程到《' + program.name + '》');
          },
          saveDraft: function () { this.$message.success('课程草稿已保存'); },
          changeCover: function () { 
            this.$message.info('封面更换功能开发中');
            // Demo: 模拟更换封面
            this.editingCourse.cover = this.editingCourse.cover === coverUrl ? uploadImageUrl : coverUrl;
          },
          addContentRow: function () {
            // 默认添加到课中阶段
            var stage = this.contentStages.find(function (s) { return s.id === 'in'; });
            if (!stage) stage = this.contentStages[1];
            var newSeq = String(stage.rows.filter(function (r) { return !r.seq.includes('.'); }).length + 1);
            stage.rows.push({
              id: Date.now(),
              seq: newSeq,
              title: '新增课程内容',
              desc: '请补充主要内容',
              duration: 45,
              methods: ['理论授课'],
              resources: 0,
              assessments: 0,
              resourcesList: [],
              assessmentsList: []
            });
          },
          addSubContentRow: function (stageIdx, parentRow) {
            var stage = this.contentStages[stageIdx];
            var parentIndex = stage.rows.indexOf(parentRow);
            var parentSeq = parentRow.seq;
            var subCount = stage.rows.filter(function (r) { return r.seq.startsWith(parentSeq + '.'); }).length;
            var newSeq = parentSeq + '.' + (subCount + 1);
            var newRow = {
              id: Date.now(),
              seq: newSeq,
              title: '新增子任务',
              desc: '请补充子任务内容',
              duration: 20,
              methods: ['理论授课'],
              resources: 0,
              assessments: 0,
              resourcesList: [],
              assessmentsList: []
            };
            stage.rows.splice(parentIndex + 1, 0, newRow);
          },
          removeContentRow: function (stageIdx, index) {
            var stage = this.contentStages[stageIdx];
            var row = stage.rows[index];
            if (row && !row.seq.includes('.')) {
              var subRows = stage.rows.filter(function (r) { return r.seq.startsWith(row.seq + '.'); });
              if (subRows.length > 0) {
                if (!confirm('删除此模块将同时删除其下的 ' + subRows.length + ' 个子任务，是否继续？')) {
                  return;
                }
              }
            }
            stage.rows.splice(index, 1);
          },
          handleContentDragStart: function (stageIdx, index, event) {
            if (this.contentEditingId) {
              event.preventDefault();
              return;
            }
            this.draggedStageIdx = stageIdx;
            this.draggedIndex = index;
            event.dataTransfer.effectAllowed = 'move';
            event.target.classList.add('cd-dragging');
          },
          handleContentDragOver: function (index, event) {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'move';
            event.target.closest('.cd-syllabus-row')?.classList.add('cd-drag-over');
          },
          handleContentDrop: function (stageIdx, index, event) {
            event.preventDefault();
            if (this.draggedIndex === null || (this.draggedStageIdx === stageIdx && this.draggedIndex === index)) return;
            var draggedStage = this.contentStages[this.draggedStageIdx];
            var targetStage = this.contentStages[stageIdx];
            var draggedRow = draggedStage.rows[this.draggedIndex];
            var targetRow = targetStage.rows[index];
            if (draggedRow.seq.includes('.') !== targetRow.seq.includes('.')) {
              this.$message.warning('不能在不同层级之间拖拽');
              return;
            }
            draggedStage.rows.splice(this.draggedIndex, 1);
            targetStage.rows.splice(index, 0, draggedRow);
            this.reindexSyllabusRows();
          },
          handleContentDragEnd: function (event) {
            event.target.classList.remove('cd-dragging');
            document.querySelectorAll('.cd-drag-over').forEach(function (el) {
              el.classList.remove('cd-drag-over');
            });
            this.draggedIndex = null;
            this.draggedStageIdx = null;
          },
          reindexSyllabusRows: function () {
            this.contentStages.forEach(function (stage) {
              var mainIndex = 0;
              var subIndices = {};
              stage.rows.forEach(function (row) {
                if (!row.seq.includes('.')) {
                  mainIndex++;
                  row.seq = String(mainIndex);
                  subIndices[row.seq] = 0;
                } else {
                  var parentSeq = row.seq.split('.')[0];
                  subIndices[parentSeq] = (subIndices[parentSeq] || 0) + 1;
                  row.seq = parentSeq + '.' + subIndices[parentSeq];
                }
              });
            });
          },
          addStage: function () { this.stages.push({ id: Date.now(), title: '新增课程阶段', duration: 20, ratio: '1:20', mode: '线下', site: '普通教室', people: 1, materials: 1 }); },
          openEditorDrawer: function (title) {
            if (title === '课程目标') {
              this.objectiveDrawerVisible = true;
              return;
            }
            this.editorDrawerTitle = title;
            this.drawerForm = { title: title, desc: '请在此维护详细配置与说明。' };
            this.editorDrawerVisible = true;
          },
          addObjective: function () {
            this.objectives.push({
              id: 'obj-' + Date.now(),
              type: '',
              goals: [{ code: 'N1', text: '' }],
              competencies: []
            });
          },
          objectiveCodePrefix: function (type) {
            var prefixMap = { '知识目标': 'K', '技能目标': 'S', '情感目标': 'A' };
            return prefixMap[type] || 'N';
          },
          addGoalItem: function (item) {
            var prefix = this.objectiveCodePrefix(item.type);
            item.goals.push({ code: prefix + (item.goals.length + 1), text: '' });
          },
          saveObjectives: function () {
            this.objectiveDrawerVisible = false;
            this.$message.success('课程目标已保存');
          },
          getObjectiveTone: function (type) {
            var toneMap = { '知识目标': 'blue', '技能目标': 'orange', '情感目标': 'green' };
            return toneMap[type] || 'blue';
          },
          formatCompetencies: function (competencies) {
            if (!competencies || competencies.length === 0) return '未设置';
            var labels = [];
            competencies.forEach(function (path) {
              if (Array.isArray(path) && path.length === 2) {
                var parent = this.acgmeCompetencyOptions.find(function (item) { return item.value === path[0]; });
                var child = parent && parent.children ? parent.children.find(function (item) { return item.value === path[1]; }) : null;
                if (parent && child) labels.push(parent.label + '/' + child.label);
              }
            }.bind(this));
            return labels.join('、') || '未设置';
          },
          saveDrawer: function () { this.editorDrawerVisible = false; this.$message.success(this.editorDrawerTitle + '已保存'); },
          toggleRefCourse: function (id) { this.$message.info('引用课程功能开发中'); },
          saveComponent: function () { this.editorDrawerVisible = false; this.$message.success('组件配置已保存'); },
          addStudentAssessment: function (type) {
            if (type === 'survey') {
              this.studentAssessments.surveys.push({ name: '新问卷', type: '选择题', questions: 10 });
            } else if (type === 'feedback') {
              this.studentAssessments.feedback.push({ name: '新反馈', type: '量表题' });
            } else {
              this.studentAssessments.surveys.push({ name: '新问卷', type: '选择题', questions: 10 });
            }
          },
          addTeacherAssessment: function (type) {
            if (type === 'evaluation') {
              this.teacherAssessments.evaluations.push({ name: '新评价表', criteria: 5 });
            } else if (type === 'exam') {
              this.teacherAssessments.exams.push({ name: '新考试', questions: 20, duration: 60 });
            } else {
              this.teacherAssessments.evaluations.push({ name: '新评价表', criteria: 5 });
            }
          },
          saveAssessment: function () {
            this.editorDrawerVisible = false;
            this.$message.success('考核与评价配置已保存');
          },
          handleAttachmentUpload: function (fileList) {
            this.$message.success('附件已上传');
          },
          downloadAttachment: function (file) {
            this.$message.info('正在下载：' + file.name);
          },
          editTest: function (file) {
            this.$message.info('编辑测试题：' + file.name);
          },
          createTest: function () {
            this.attachmentLibrary.tests.push({ name: '新测试题', questions: 10, duration: 15 });
            this.$message.success('已创建新测试题');
          },
          editRubric: function (file) {
            this.$message.info('编辑评分表：' + file.name);
          },
          createRubric: function () {
            this.attachmentLibrary.rubrics.push({ name: '新评分表', criteria: 10 });
            this.$message.success('已创建新评分表');
          },
          addPersonnel: function (type) {
            if (type === 'instructor') {
              this.personnelConfig.instructors.push({ name: '新导师', title: '医师', role: '指导导师' });
            } else if (type === 'assistant') {
              this.personnelConfig.assistants.push({ name: '新助教', title: '医师' });
            }
          },
          addMaterial: function (type) {
            if (type === 'equipment') {
              this.materialsConfig.equipment.push({ name: '新设备', quantity: 1, unit: '台' });
            } else if (type === 'consumable') {
              this.materialsConfig.consumables.push({ name: '新耗材', quantity: 10, unit: '个' });
            }
          },
          savePersonnelMaterial: function () {
            this.editorDrawerVisible = false;
            this.$message.success('人员与物资配置已保存');
          },
          scrollModule: function (key) { this.activeModule = key; document.getElementById('module-' + key)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); },
          openAi: function (module) { this.aiModule = module; this.aiInput = this.assistantPromptText; this.aiVisible = true; },
          useAssistantQuestion: function (question) { this.aiInput = question; this.$message.info('已带入问题：' + question); },
          sendAssistantInput: function () {
            var question = (this.aiInput || this.assistantPromptText).trim();
            this.$message.success('课程开发助手已基于当前教案生成建议：' + question);
          },
          applyAi: function (item) { this.$message.success('AI 已生成“' + item + '”建议'); },
          runCheck: function () { this.$message.success('完整性检查已更新'); },
          submitReview: function () { this.successVisible = true; },
          backAfterSubmit: function () { this.successVisible = false; this.page = 'list'; this.filters.status = '待审核'; },
          programAction: function () {},
          openCreateProgram: function () {
            this.programForm = { name: '', sessionCount: 2, courseId: 'SRS-' + Math.floor(100000 + Math.random() * 900000), type: '', ownerSearch: '', audience: '', teamSearch: '', teamMembers: [] };
            this.createProgramVisible = true;
          },
          confirmCreateProgram: function () {
            if (!this.programForm.name) { this.$message.warning('请输入专项课程名称'); return; }
            if (!this.programForm.type) { this.$message.warning('请选择课程类型'); return; }
            if (!this.programForm.ownerSearch) { this.$message.warning('请指定课程负责人'); return; }
            this.programs.push({
              id: Date.now(),
              name: this.programForm.name,
              audience: this.programForm.audience || '待定',
              owner: this.programForm.ownerSearch,
              team: this.programForm.teamMembers.length || 1,
              total: this.programForm.sessionCount,
              approved: 0,
              updated: new Date().toISOString().slice(0, 10),
              expanded: false,
              composition: [],
              lessons: []
            });
            this.createProgramVisible = false;
            this.$message.success('专项课程《' + this.programForm.name + '》创建成功');
          },
          addTeamMember: function () {
            if (!this.programForm.teamSearch) { this.$message.warning('请输入成员姓名或工号'); return; }
            if (this.programForm.teamMembers.indexOf(this.programForm.teamSearch) !== -1) { this.$message.warning('该成员已在列表中'); return; }
            this.programForm.teamMembers.push(this.programForm.teamSearch);
            this.programForm.teamSearch = '';
          },
          getCompositionTypes: function (program) {
            var types = {};
            program.composition.forEach(function (item) {
              var parts = item.split(' ');
              if (parts.length >= 2) {
                var type = parts[0];
                types[type] = (types[type] || 0) + 1;
              }
            });
            return Object.keys(types);
          },
          getCompositionCount: function (program, type) {
            var count = 0;
            program.composition.forEach(function (item) {
              if (item.startsWith(type)) count++;
            });
            return count;
          },
        }
      });
      app.use(ArcoVue);
      vueApp = app.mount('#course-dev-app');
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
  new MutationObserver(render).observe(document.body, { attributes: true, attributeFilter: ['data-role', 'data-active'] });
}());
