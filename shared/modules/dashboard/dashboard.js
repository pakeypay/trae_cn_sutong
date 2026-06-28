(function () {
  var vueApp = null;

  var dashboardIconParkIcons = {
    search: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10.5 3a7.5 7.5 0 1 0 4.73 13.32L20.91 22 22 20.91l-5.68-5.68A7.5 7.5 0 0 0 10.5 3zm0 2a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11z"/></svg>',
    clipboardList: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-2.5A2.5 2.5 0 0 0 14 1h-4a2.5 2.5 0 0 0-2.5 2H5a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-9-1h4a1 1 0 0 1 0 2h-4a1 1 0 0 1 0-2zm-1 12a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm7 4H8v-2h8zm0-5H8v-2h8z"/></svg>',
    clipboardCheck: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-2.5A2.5 2.5 0 0 0 14 1h-4a2.5 2.5 0 0 0-2.5 2H5a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-9-1h4a1 1 0 0 1 0 2h-4a1 1 0 0 1 0-2zm1 15-4-4 1.4-1.4 2.6 2.6 5.6-5.6L18 10z"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 16H5V9h14zM7 11h5v5H7z"/></svg>',
    calendarCheck: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 16H5V9h14zm-8-1 7-7-1.4-1.4-5.6 5.6-2.6-2.6L7 14z"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 11h-6V7h2v4h4z"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 4.5c-1.1-.33-2.3-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5C10.55 4.4 8.45 4 6.5 4S2.45 4.9 1 6v14.65a.5.5 0 0 0 .75.45C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05a.5.5 0 0 0 .75-.5V6a4.83 4.83 0 0 0-2-1.5z"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 4v16l14-8z"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 2.95 6.91 7.55.65-5.73 4.95 1.73 7.4L12 18.13 5.5 21.9l1.73-7.4L1.5 9.56l7.55-.65z"/></svg>',
    tasks: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h8v8H3zm2 2v4h4V5zm8 0h8v2h-8zm0 6h8v2h-8zM3 13h8v8H3zm2 2v4h4v-4zm8 2h8v2h-8z"/></svg>',
    graduation: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 3 11 5-11 5L1 8zm-7 8.3V16c0 2.2 3.1 4 7 4s7-1.8 7-4v-4.7l-7 3.2zM21 10h2v7h-2z"/></svg>',
    edit: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z"/></svg>',
    exchange: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m16 3 5 5-5 5V9H3V7h13zM8 11v4h13v2H8v4l-5-5z"/></svg>',
    mapPin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a8 8 0 0 0-8 8c0 6 8 12 8 12s8-6 8-12a8 8 0 0 0-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/></svg>',
    users: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0 2c-2.67 0-8 1.34-8 4v2h11v-2.07A6.92 6.92 0 0 1 14 14zm10-6a3.5 3.5 0 1 0-3.5-3.5A3.5 3.5 0 0 0 19 8zm1.5 5c-1.83 0-5.5.92-5.5 2.75V19h11v-3.25c0-1.83-3.67-2.75-5.5-2.75z"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>',
    building: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15 11V5l-3-3-3 3v2H3v14h18V11zM7 19H5v-2h2zm0-4H5v-2h2zm6 4h-2v-2h2zm0-4h-2v-2h2zm6 4h-2v-2h2z"/></svg>',
    door: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 2h14a2 2 0 0 1 2 2v18h-3V5H7v17H4zm9 9h2v2h-2z"/></svg>',
    package: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 9 4.5v11L12 22l-9-4.5v-11zm0 2.2L6.2 7 12 9.8 17.8 7zM5 8.6v7.7l6 3v-7.7zm14 0-6 3v7.7l6-3z"/></svg>',
    folder: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8z"/></svg>',
    database: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3C7.58 3 4 4.79 4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7c0-2.21-3.58-4-8-4zm6 14.5c0 .5-2.13 1.5-6 1.5s-6-1-6-1.5v-2.23c1.61.78 3.72 1.23 6 1.23s4.39-.45 6-1.23zm0-5c0 .5-2.13 1.5-6 1.5s-6-1-6-1.5V9.73c1.61.78 3.72 1.23 6 1.23s4.39-.45 6-1.23z"/></svg>',
    table: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 3v18h18V3zm6 16H5v-6h4zm0-8H5V5h4zm6 8h-4v-6h4zm0-8h-4V5h4zm6 8h-4v-6h4zm0-8h-4V5h4z"/></svg>',
    presentation: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 4h18v2H3zm1 4h16v9a2 2 0 0 1-2 2h-5v2h2v2H9v-2h2v-2H6a2 2 0 0 1-2-2z"/></svg>',
    monitor: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 4H3a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h7v2H7v2h10v-2h-3v-2h7a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1zm-1 11H4V6h16z"/></svg>',
    wrench: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z"/></svg>',
    box: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4a2 2 0 0 0-2 2v3a2 2 0 0 0 1 1.72V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.72A2 2 0 0 0 22 7V4a2 2 0 0 0-2-2zm-5 12H9v-2h6zm5-7H4V4h16z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm-1.4 14.6L6 12l1.4-1.4 3.2 3.2 6-6L18 9.2z"/></svg>',
    file: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9zm1 1.5L19.5 8H15zM7 13h10v2H7zm0 4h8v2H7z"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 9.2h3V19H5zm5.6-4.2h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/></svg>',
    pieChart: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 2v20c-5.07-.5-9-4.79-9-10s3.93-9.5 9-10zm2.03 0v8.99H22c-.47-4.74-4.24-8.52-8.97-8.99zm0 11.01V22c4.74-.47 8.5-4.25 8.97-8.99z"/></svg>',
    award: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 5h-2V3H7v2H5a2 2 0 0 0-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0 0 11 14.9V19H7v2h10v-2h-4v-4.1a5.01 5.01 0 0 0 3.61-2.96C19.08 12.63 21 10.55 21 8V7a2 2 0 0 0-2-2z"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg>',
    lightbulb: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 21h6v-2H9zm3-19a7 7 0 0 0-4 12.74V17h8v-2.26A7 7 0 0 0 12 2z"/></svg>',
    list: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h2v-2H3zm0 4h2v-2H3zm0-8h2V7H3zm4 4h14v-2H7zm0 4h14v-2H7zM7 7v2h14V7z"/></svg>',
    clipboard: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 2h-4.18A2.9 2.9 0 0 0 12 0a2.9 2.9 0 0 0-2.82 2H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm-2 14H7v-2h10zm0-4H7v-2h10z"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z"/></svg>'
  };

  function getDashboardIcon(iconName) {
    return dashboardIconParkIcons[iconName] || '';
  }

  function waitForVue(callback) {
    if (window.Vue && window.Vue.createApp) {
      callback();
    } else {
      setTimeout(function () { waitForVue(callback); }, 50);
    }
  }

  function injectCSS() {
    if (document.getElementById('db-module-css')) return;
    var link = document.createElement('link');
    link.id = 'db-module-css';
    link.rel = 'stylesheet';
    link.href = (document.querySelector('script[src$="dashboard.js"]') || {}).src
      .replace(/dashboard\.js$/, 'dashboard.css');
    document.head.appendChild(link);
  }

  function shouldHandle() {
    var role = document.body.dataset.role;
    var active = document.body.dataset.active;
    return (role === 'teacher' || role === 'student' || role === 'admin') && (active === '工作台' || active === '首页');
  }

  function renderShell() {
    injectCSS();
    var content = document.querySelector('.content');
    if (!content || !shouldHandle()) {
      if (vueApp) { try { vueApp.unmount(); } catch (e) {} vueApp = null; }
      return;
    }

    if (vueApp) { try { vueApp.unmount(); } catch (e) {} vueApp = null; }

    var role = document.body.dataset.role;
    if (role === 'student') {
      content.innerHTML = '<div id="student-dashboard-app"></div>';
      renderStudentDashboard();
    } else if (role === 'admin') {
      content.innerHTML = '<div id="admin-dashboard-app"></div>';
      renderAdminDashboard();
    } else {
      content.innerHTML = '<div id="teacher-dashboard-app"></div>';
      renderTeacherDashboard();
    }
  }

  function renderTeacherDashboard() {
    waitForVue(function () {
      var app = Vue.createApp({
        template: `
          <div class="teacher-dashboard-wrapper">
            <div class="app-page-toolbar dashboard-top-toolbar">
              <div class="app-page-toolbar-left dashboard-toolbar-title">
                <strong class="app-page-title">工作台</strong>
              </div>
              <div class="app-page-toolbar-right">
                <label class="dashboard-toolbar-search app-page-search">
                  <i class="fas fa-search"></i>
                  <input v-model="dashboardQuery" type="search" placeholder="搜索课程、任务、通知..." @keyup.enter="handleDashboardSearch">
                </label>
              </div>
            </div>

            <!-- Welcome Banner Card -->
            <div class="welcome-banner-card">
              <div>
                <h1 class="banner-title">中午好，张老师！</h1>
                <p class="banner-desc">今天您有 <strong class="text-primary">2 门课程</strong> 需要授课，目前待批改作业 <strong class="text-warning">3 份</strong>。各项物资准备工作已就绪。</p>
                <div class="banner-tags">
                  <a-tag size="small" color="arcoblue"><i class="fas fa-stethoscope" style="margin-right: 4px;"></i>科室: 儿科重症监护室 (PICU)</a-tag>
                  <a-tag size="small" color="green"><i class="fas fa-clock" style="margin-right: 4px;"></i>今日值班: 白班教学讲师</a-tag>
                </div>
              </div>
              <div class="banner-actions">
                <a-button type="outline" @click="quickNavigate('课程开发')">
                  <template #icon><i class="fas fa-plus"></i></template>新建课程大纲
                </a-button>
                <a-button type="primary" @click="quickNavigate('我的课表')">
                  <template #icon><i class="fas fa-exchange-alt"></i></template>申请调课安排
                </a-button>
              </div>
            </div>

            <!-- Stats Overview Cards -->
            <a-row :gutter="16" style="margin-bottom: 24px;">
              <a-col :span="6" v-for="metric in metrics" :key="metric.label">
                <div class="metrics-block">
                  <div>
                    <div class="metric-label">{{ metric.label }}</div>
                    <div class="metric-value">{{ metric.value }}</div>
                  </div>
                  <div class="metric-icon">
                    <i :class="metric.icon + ' fa-lg'"></i>
                  </div>
                </div>
              </a-col>
            </a-row>

            <!-- Main Layout Grids -->
            <a-row :gutter="20">
              <!-- Left Column: Tasks and Schedules -->
              <a-col :span="16">
                <!-- Today's Schedules timeline -->
                <a-card title="今日教学排期日程" :bordered="false" class="db-card">
                  <template #extra>
                    <a-button type="text" size="small" @click="quickNavigate('我的课表')">查看全部课表 <i class="fas fa-chevron-right" style="margin-left: 4px;"></i></a-button>
                  </template>
                  <div class="db-col-gap">
                    <div v-for="sched in todaySchedules" :key="sched.id" class="schedule-item-row">
                      <div style="display: flex; align-items: center; gap: 18px; flex: 1; min-width: 0;">
                        <div class="schedule-time-col">
                          <strong class="time-text">{{ sched.time }}</strong>
                          <span class="duration-text">{{ sched.duration }}分钟</span>
                        </div>
                        <div style="flex: 1; min-width: 0;">
                          <div class="schedule-detail-row">
                            <strong class="schedule-detail-name">{{ sched.name }}</strong>
                            <a-tag size="small" :color="sched.statusColor">{{ sched.statusText }}</a-tag>
                            <a-tag size="small" color="gray">{{ sched.type }}</a-tag>
                          </div>
                          <div class="schedule-detail-meta">
                            <span><i class="fas fa-map-marker-alt" style="margin-right: 4px;"></i>{{ sched.place }}</span>
                            <span style="margin-left: 16px;"><i class="fas fa-users" style="margin-right: 4px;"></i>学员群: {{ sched.students }}</span>
                          </div>
                        </div>
                      </div>
                      <a-button type="primary" size="small" :status="sched.isLive ? 'success' : 'primary'" @click="handleAction(sched)">
                        {{ sched.actionText }}
                      </a-button>
                    </div>
                  </div>
                </a-card>

                <!-- Urgent Tasks lists -->
                <a-card title="教学管理待办与任务 (3)" :bordered="false" class="db-card">
                  <div class="db-col-gap">
                    <div v-for="task in todoTasks" :key="task.id" class="todo-task-row">
                      <div style="display: flex; align-items: center; gap: 12px;">
                        <a-checkbox v-model="task.completed" @change="completeTodo(task)"></a-checkbox>
                        <div>
                          <strong :class="['task-title', task.completed ? 'completed' : '']">{{ task.title }}</strong>
                          <div class="task-deadline"><i class="far fa-calendar-alt"></i> 截止时间: {{ task.deadline }}</div>
                        </div>
                      </div>
                      <a-button type="text" size="small" @click="quickNavigate(task.module)">去处理 <i class="fas fa-chevron-right" style="margin-left: 4px;"></i></a-button>
                    </div>
                  </div>
                </a-card>
              </a-col>

              <!-- Right Column: Notifications and Audits -->
              <a-col :span="8">
                <!-- Notifications Board -->
                <a-card title="教学系统最新通知" :bordered="false" class="db-card">
                  <div class="db-col-gap">
                    <div v-for="note in notifications" :key="note.id" class="notification-item">
                      <div class="note-header">
                        <span class="note-title">{{ note.title }}</span>
                        <a-tag size="mini" :color="note.tagColor">{{ note.tag }}</a-tag>
                      </div>
                      <p class="note-desc">{{ note.desc }}</p>
                      <div class="note-time">{{ note.time }}</div>
                    </div>
                  </div>
                </a-card>

                <!-- Quick shortcuts -->
                <a-card title="快速教学应用" :bordered="false" class="db-card">
                  <a-grid :cols="2" :col-gap="10" :row-gap="10">
                    <a-grid-item v-for="short in shortcuts" :key="short.title">
                      <div class="shortcut-box" @click="quickNavigate(short.module)">
                        <div :style="'font-size: 20px; margin-bottom: 6px; color:' + short.color"><i :class="short.icon"></i></div>
                        <div class="shortcut-label">{{ short.title }}</div>
                      </div>
                    </a-grid-item>
                  </a-grid>
                </a-card>
              </a-col>
            </a-row>
          </div>
        `,
        data() {
          return {
            dashboardQuery: '',
            metrics: [
              { label: '本季度累计课时', value: '36.5 小时', icon: 'fas fa-book-reader' },
              { label: '所授课程好评度', value: '98.4 %', icon: 'fas fa-star-and-crescent' },
              { label: '批改进度占比', value: '92.0 %', icon: 'fas fa-tasks' },
              { label: '所带规培生通过率', value: '95.6 %', icon: 'fas fa-user-graduate' }
            ],
            todaySchedules: [
              { id: 1, name: '急救护理综合实训', time: '14:00', duration: 180, isLive: true, statusColor: 'red', statusText: '正在进行', type: '情境模拟实训', place: '3F 302 临床技能中心', students: '专培二年级 · 重症班 (32人)', actionText: '进入课堂', targetModule: '我的课程' },
              { id: 2, name: '儿童气管插管术操作示教', time: '16:30', duration: 60, isLive: false, statusColor: 'arcoblue', statusText: '未开课', type: '实操示教课', place: '模拟ICU-病房 801', students: '住培一年级 (24人)', actionText: '查看准备', targetModule: '我的课程' }
            ],
            todoTasks: [
              { id: 101, title: '审核并批改新生儿插管操作课后作业 (3份)', deadline: '今天 18:00', completed: false, module: '作业考试' },
              { id: 102, title: '补录上周儿童静脉输液实训考核成绩', deadline: '明天 12:00', completed: false, module: '成绩评价' },
              { id: 103, title: '完善下周儿科坏消息告知情景大纲草稿', deadline: '06-03 17:00', completed: false, module: '课程开发' }
            ],
            notifications: [
              { id: 201, title: '排课安排临时微调', desc: '陆老师因学术会议与您调换下周五《医患沟通》课次，已为您更新至课表。', tag: '调课确认', tagColor: 'green', time: '10分钟前' },
              { id: 202, title: '急救实训所需物资已备货', desc: '您预订 of 「婴儿PALS心肺复苏模型x4」已通过审批，技能中心已就位。', tag: '物资准备', tagColor: 'arcoblue', time: '2小时前' },
              { id: 203, title: '有新的课程大纲通过审批', desc: '您提交的《儿科医患模拟告知进阶课程》已由院部教务完成三级评审。', tag: '课程评审', tagColor: 'orange', time: '昨天 15:30' }
            ],
            shortcuts: [
              { title: '可视课表', icon: 'fas fa-calendar-alt', color: '#165dff', module: '我的课表' },
              { title: '备件申请', icon: 'fas fa-box-open', color: '#00b42a', module: '场地与物资申请' },
              { title: '教研资源', icon: 'fas fa-folder-open', color: '#ff7d00', module: '教学资源库' },
              { title: '考核评价', icon: 'fas fa-file-signature', color: '#722ed1', module: '作业考试' }
            ]
          };
        },
        methods: {
          quickNavigate(pageName) {
            if (window.navigateTo) {
              window.navigateTo(pageName);
            }
          },
          handleAction(sched) {
            this.quickNavigate(sched.targetModule);
          },
          completeTodo(task) {
            if (window.ArcoVue && window.ArcoVue.Message) {
              window.ArcoVue.Message.success('已标记任务【' + task.title + '】为完成状态');
            }
          },
          handleDashboardSearch() {
            var q = this.dashboardQuery.trim();
            if (!q) return;
            var target = this.shortcuts.find(function (item) {
              return item.title.indexOf(q) !== -1;
            });
            if (target) {
              this.quickNavigate(target.module);
            } else if (window.ArcoVue && window.ArcoVue.Message) {
              window.ArcoVue.Message.info('未找到匹配的快捷入口');
            }
          }
        }
      });
      app.use(window.ArcoVue);
      vueApp = app;
      vueApp.mount('#teacher-dashboard-app');
    });
  }

  function renderStudentDashboard() {
    waitForVue(function () {
      var app = Vue.createApp({
        template: `
          <div class="student-dashboard-wrapper">
            <div class="dashboard-top-toolbar">
              <div class="dashboard-toolbar-title app-page-header-main">
                <strong>工作台</strong>
                <span>学习概览</span>
              </div>
              <label class="dashboard-toolbar-search app-page-header-actions">
                <i class="fas fa-search"></i>
                <input v-model="dashboardQuery" type="search" placeholder="搜索课程、任务、日程..." @keyup.enter="handleDashboardSearch">
              </label>
            </div>

            <!-- Welcome Banner Card -->
            <div class="welcome-banner-card">
              <div>
                <h1 class="banner-title">中午好，王同学！</h1>
                <p class="banner-desc">当前轮转科室：<strong class="text-primary">儿科重症监护病房 (PICU)</strong>。带教老师：<strong>刘国强</strong>，责任导师：<strong>王一</strong>。</p>
                <div class="banner-tags">
                  <a-tag size="small" color="arcoblue"><i class="fas fa-hospital" style="margin-right: 4px;"></i>已轮转: 18天 / 计划: 30天</a-tag>
                  <a-tag size="small" color="green"><i class="fas fa-book-reader" style="margin-right: 4px;"></i>今日待上课: 1 门</a-tag>
                </div>
              </div>
              <div class="banner-actions">
                <a-button type="outline" @click="openCalendar">
                  <template #icon><i class="far fa-calendar-alt"></i></template>查看学习日程
                </a-button>
                <a-button type="primary" @click="quickNavigate('选课报名')">
                  <template #icon><i class="fas fa-plus"></i></template>去选课报名
                </a-button>
              </div>
            </div>

            <!-- Stats Overview Cards -->
            <a-row :gutter="16" style="margin-bottom: 24px;">
              <a-col :span="6" v-for="metric in metrics" :key="metric.label">
                <div class="metrics-block">
                  <div>
                    <div class="metric-label">{{ metric.label }}</div>
                    <div class="metric-value">{{ metric.value }}</div>
                  </div>
                  <div class="metric-icon">
                    <i :class="metric.icon + ' fa-lg'"></i>
                  </div>
                </div>
              </a-col>
            </a-row>

            <!-- Main Layout Grids -->
            <a-row :gutter="20">
              <!-- Left Column: Tasks and Schedules -->
              <a-col :span="16">
                <!-- Todo Tasks Card -->
                <a-card title="学员待办任务与答卷" :bordered="false" class="db-card">
                  <template #extra>
                    <a-radio-group v-model="todoFilter" type="button" size="small" @change="filterTodos">
                      <a-radio value="all">全部 ({{ todoCount.all }})</a-radio>
                      <a-radio value="course">学习 ({{ todoCount.course }})</a-radio>
                      <a-radio value="hw">作业 ({{ todoCount.hw }})</a-radio>
                      <a-radio value="exam">考试 ({{ todoCount.exam }})</a-radio>
                      <a-radio value="assess">评价 ({{ todoCount.assess }})</a-radio>
                    </a-radio-group>
                  </template>

                  <div class="db-col-gap">
                    <div v-for="task in filteredTodos" :key="task.id" class="todo-task-row">
                      <div style="display: flex; align-items: center; gap: 12px;">
                        <div class="todo-icon-box">
                          <i :class="getTodoIcon(task.type)"></i>
                        </div>
                        <div>
                          <strong class="task-title">{{ task.name }}</strong>
                          <div class="task-meta">
                            <span>课程: {{ task.course }}</span>
                            <span style="margin-left: 12px;"><i class="far fa-clock"></i> 截止: {{ task.due }}</span>
                          </div>
                        </div>
                      </div>
                      <a-button type="outline" size="small" :status="task.btnClass === 'ongoing' ? 'success' : 'primary'" @click="handleTodoAction(task)">
                        {{ task.btnLabel }}
                      </a-button>
                    </div>
                  </div>
                </a-card>

                <!-- Active Courses Progress -->
                <a-card title="进行中课程学习进度" :bordered="false" class="db-card">
                  <div class="db-col-gap">
                    <div v-for="course in activeCourses" :key="course.name" class="course-progress-item">
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <div>
                          <strong class="course-name">{{ course.name }}</strong>
                          <span class="course-status">{{ course.statusText }}</span>
                        </div>
                        <span class="course-pct">{{ course.pct }}%</span>
                      </div>
                      <a-progress :percent="course.pct / 100" :show-text="false" size="small" />
                      <div class="course-tip"><i class="far fa-lightbulb"></i> {{ course.tip }}</div>
                    </div>
                  </div>
                </a-card>
              </a-col>

              <!-- Right Column: Competency and Shortcuts -->
              <a-col :span="8">
                <!-- Competency Radar Card -->
                <a-card title="个人胜任力雷达" :bordered="false" class="db-card">
                  <div class="radar-container">
                    <svg width="200" height="200" viewBox="0 0 300 300" style="margin: 0 auto; display: block;">
                      <!-- background grid hexagons -->
                      <polygon points="150,30 254,90 254,210 150,270 46,210 46,90" fill="none" stroke="var(--color-border)" stroke-width="1" />
                      <polygon points="150,60 228,105 228,195 150,240 72,195 72,105" fill="none" stroke="var(--color-border)" stroke-width="1" />
                      <polygon points="150,90 202,120 202,180 150,210 98,180 98,120" fill="none" stroke="var(--color-border)" stroke-width="1" />
                      <polygon points="150,120 176,135 176,165 150,180 124,165 124,135" fill="none" stroke="var(--color-border)" stroke-width="1" />
                      
                      <!-- grid axis lines -->
                      <line x1="150" y1="150" x2="150" y2="30" stroke="var(--color-border)" stroke-width="1" />
                      <line x1="150" y1="150" x2="254" y2="90" stroke="var(--color-border)" stroke-width="1" />
                      <line x1="150" y1="150" x2="254" y2="210" stroke="var(--color-border)" stroke-width="1" />
                      <line x1="150" y1="150" x2="150" y2="270" stroke="var(--color-border)" stroke-width="1" />
                      <line x1="150" y1="150" x2="46" y2="210" stroke="var(--color-border)" stroke-width="1" />
                      <line x1="150" y1="150" x2="46" y2="90" stroke="var(--color-border)" stroke-width="1" />
                      
                      <!-- labels -->
                      <text x="150" y="20" font-size="12" font-weight="600" text-anchor="middle" fill="var(--color-text-2)">知识技能</text>
                      <text x="264" y="94" font-size="12" font-weight="600" text-anchor="start" fill="var(--color-text-2)">病人照护</text>
                      <text x="264" y="214" font-size="12" font-weight="600" text-anchor="start" fill="var(--color-text-2)">沟通合作</text>
                      <text x="150" y="285" font-size="12" font-weight="600" text-anchor="middle" fill="var(--color-text-2)">终身学习</text>
                      <text x="36" y="214" font-size="12" font-weight="600" text-anchor="end" fill="var(--color-text-2)">教学能力</text>
                      <text x="36" y="94" font-size="12" font-weight="600" text-anchor="end" fill="var(--color-text-2)">职业素养</text>
                      
                      <!-- actual student polygon -->
                      <polygon :points="radarPoints" fill="rgba(24,144,255,0.18)" stroke="var(--color-primary)" stroke-width="2.5" />
                      
                      <!-- active nodes dots -->
                      <circle v-for="node in radarNodes" :key="node.x" :cx="node.x" :cy="node.y" r="4.5" fill="var(--color-primary)" />
                    </svg>
                    
                    <a-button type="outline" size="small" style="margin-top: 10px; width: 100%;" @click="showToast('查看胜任力成长曲线...')">
                      查看胜任力成长曲线
                    </a-button>
                  </div>
                </a-card>

                <!-- Quick Shortcuts -->
                <a-card title="快速教学应用" :bordered="false" class="db-card">
                  <a-grid :cols="2" :col-gap="10" :row-gap="10">
                    <a-grid-item v-for="short in shortcuts" :key="short.title">
                      <div class="shortcut-box" @click="quickNavigate(short.module)">
                        <div :style="'font-size: 20px; margin-bottom: 6px; color:' + short.color"><i :class="short.icon"></i></div>
                        <div class="shortcut-label">{{ short.title }}</div>
                      </div>
                    </a-grid-item>
                  </a-grid>
                </a-card>
              </a-col>
            </a-row>

            <!-- ── Calendar Schedule Drawer ── -->
            <a-drawer v-model:visible="calendarVisible" title="我的学习日程与轮转" width="560px" :footer="false">
              <div style="padding: 8px 0;">
                <div class="calendar-drawer-title"><i class="far fa-calendar-check text-primary"></i> 近期学习与轮转日程安排</div>
                
                <a-timeline>
                  <a-timeline-item v-for="ev in calEvents" :key="ev.title" :label="ev.date" :dot-color="getEventDotColor(ev.type)">
                    <strong class="task-title">{{ ev.title }}</strong>
                    <div class="calendar-drawer-detail">
                      <span>时间: {{ ev.time || '全天' }}</span>
                      <span v-if="ev.place" style="margin-left: 12px;"><i class="fas fa-map-marker-alt"></i> {{ ev.place }}</span>
                    </div>
                    <div v-if="ev.teacher" class="calendar-drawer-teacher">
                      <span>授课带教: {{ ev.teacher }}</span>
                    </div>
                  </a-timeline-item>
                </a-timeline>
              </div>
            </a-drawer>
          </div>
        `,
        data() {
          return {
            dashboardQuery: '',
            calendarVisible: false,
            todoFilter: 'all',
            metrics: [
              { label: '本周已学时长', value: '6.5 小时', icon: 'far fa-clock' },
              { label: '进行中课程', value: '2 门', icon: 'fas fa-book-open' },
              { label: '已完成科室活动', value: '3 / 8 个', icon: 'fas fa-circle-check' },
              { label: '里程碑评级', value: 'M2 · 规范实践', icon: 'fas fa-trophy' }
            ],
            todos: [
              { id: 1, type: 'assess', name: '技能站二：清洁、消毒与局麻', course: '儿童导尿术（男性）', due: '今日课堂', group: 'today', imminent: true, btnLabel: '进行中', btnClass: 'ongoing' },
              { id: 2, type: 'assess', name: '技能站三：插入导尿管', course: '儿童导尿术（男性）', due: '今日课堂', group: 'today', imminent: true, btnLabel: '进行中', btnClass: 'ongoing' },
              { id: 3, type: 'assess', name: '技能站四：固定与术后护理', course: '儿童导尿术（男性）', due: '今日课堂', group: 'today', imminent: false, btnLabel: '进行中', btnClass: 'ongoing' },
              { id: 4, type: 'hw', name: '沟通准备学习单', course: '坏消息告知', due: '05/20前', group: 'upcoming', imminent: false, btnLabel: '去完成', btnClass: '' },
              { id: 5, type: 'exam', name: '儿童气管切开术课后考核', course: '儿科危重症生命支持', due: '本周五前', group: 'upcoming', imminent: false, btnLabel: '去考试', btnClass: '' }
            ],
            activeCourses: [
              { name: '儿童导尿术（男性）', pct: 72, statusText: '进行中 · 技能训练阶段', tip: '学习小结: 本周已完成男性儿童导尿术自主预习，进入操作模型训练，建议多预约技能中心练习。' },
              { name: '坏消息告知', pct: 35, statusText: '进行中 · 自主学习阶段', tip: '学习小结: 课前自主学习尚有未读章节，本周五前需提交沟通准备学习单。' }
            ],
            shortcuts: [
              { title: '日程日历', icon: 'fas fa-calendar-alt', color: '#165dff', module: '日程日历' },
              { title: '场地预约', icon: 'fas fa-door-open', color: '#00b42a', module: '场地与物资申请' },
              { title: '自适应学习', icon: 'fas fa-bolt', color: '#ff7d00', module: '自适应学习' },
              { title: '成果申报', icon: 'fas fa-trophy', color: '#722ed1', module: '成果申报' }
            ],
            competencies: [
              { name: '知识技能', level: 2 },
              { name: '病人照护', level: 3 },
              { name: '沟通合作', level: 2 },
              { name: '终身学习', level: 2 },
              { name: '教学能力', level: 1 },
              { name: '职业素养', level: 3 }
            ],
            calEvents: [
              { date: '2024-02-05', title: 'PICU科室轮转开始', type: 'rotation', time: '08:00', place: 'PICU病区', teacher: '刘国强' },
              { date: '2024-02-19', title: '《儿童导尿术》课前自主学习开放', type: 'course', time: '自主完成', place: '线上平台', teacher: '刘国强' },
              { date: '2024-02-26', title: 'PICU科室教学查房', type: 'rotation', time: '08:00-09:00', place: 'PICU 12F', teacher: '导师王一' },
              { date: '2024-02-28', title: '儿科危重症病例讨论会', type: 'rotation', time: '16:00-17:00', place: '示教室', teacher: '科室主任' },
              { date: '2024-03-01', title: '操作培训：PICC深静脉置管术', type: 'rotation', time: '10:00-12:00', place: 'PICU操作室', teacher: '刘国强' },
              { date: '2024-03-03', title: '儿童导尿术（男性）技能模拟课 (今天)', type: 'course', time: '14:00-17:00', place: '410多功能教室', teacher: '刘国强' },
              { date: '2024-03-15', title: 'PICU科室出科理论与操作考核', type: 'rotation', time: '09:00-11:00', place: '技能考核教学楼', teacher: '刘国强' }
            ]
          };
        },
        computed: {
          todoCount() {
            var c = { all: this.todos.length, course: 0, hw: 0, exam: 0, assess: 0 };
            this.todos.forEach(t => {
              if (c[t.type] !== undefined) c[t.type]++;
            });
            return c;
          },
          filteredTodos() {
            if (this.todoFilter === 'all') return this.todos;
            return this.todos.filter(t => t.type === this.todoFilter);
          },
          radarPoints() {
            var center = 150;
            var radius = 120;
            var angles = [-Math.PI/2, -Math.PI/2 + (2*Math.PI/6), -Math.PI/2 + (4*Math.PI/6), -Math.PI/2 + (6*Math.PI/6), -Math.PI/2 + (8*Math.PI/6), -Math.PI/2 + (10*Math.PI/6)];
            var pts = [];
            for (var i = 0; i < 6; i++) {
              var val = this.competencies[i].level / 4;
              var x = center + radius * val * Math.cos(angles[i]);
              var y = center + radius * val * Math.sin(angles[i]);
              pts.push(x.toFixed(1) + ',' + y.toFixed(1));
            }
            return pts.join(' ');
          },
          radarNodes() {
            var center = 150;
            var radius = 120;
            var angles = [-Math.PI/2, -Math.PI/2 + (2*Math.PI/6), -Math.PI/2 + (4*Math.PI/6), -Math.PI/2 + (6*Math.PI/6), -Math.PI/2 + (8*Math.PI/6), -Math.PI/2 + (10*Math.PI/6)];
            var list = [];
            for (var i = 0; i < 6; i++) {
              var val = this.competencies[i].level / 4;
              var x = center + radius * val * Math.cos(angles[i]);
              var y = center + radius * val * Math.sin(angles[i]);
              list.push({ x: x.toFixed(1), y: y.toFixed(1) });
            }
            return list;
          }
        },
        methods: {
          showToast(msg) {
            if (window.ArcoVue && window.ArcoVue.Message) {
              window.ArcoVue.Message.info(msg);
            } else {
              alert(msg);
            }
          },
          quickNavigate(pageName) {
            if (window.navigateTo) {
              window.navigateTo(pageName);
            }
          },
          openCalendar() {
            this.calendarVisible = true;
          },
          getTodoIcon(type) {
            return {
              hw: 'fas fa-pencil-ruler',
              exam: 'fas fa-file-alt',
              assess: 'fas fa-clipboard-check',
              course: 'fas fa-play-circle'
            }[type] || 'fas fa-circle';
          },
          getEventDotColor(type) {
            return {
              rotation: '#fa8c16',
              course: '#52c41a',
              exam: '#ff4d4f'
            }[type] || '#1890ff';
          },
          handleTodoAction(task) {
            if (task.btnClass === 'ongoing') {
              this.showToast('任务《' + task.name + '》正在技能中心实时开展评估中...');
            } else {
              this.showToast('正在为您打开任务《' + task.name + '》答卷或自学页面...');
            }
          },
          handleDashboardSearch() {
            var q = this.dashboardQuery.trim();
            if (!q) return;
            var target = this.shortcuts.find(function (item) {
              return item.title.indexOf(q) !== -1;
            });
            if (target) {
              this.quickNavigate(target.module);
            } else {
              this.showToast('未找到匹配的快捷入口');
            }
          }
        }
      });
      app.use(window.ArcoVue);
      vueApp = app;
      vueApp.mount('#student-dashboard-app');
    });
  }

  function renderAdminDashboard() {
    // IconPark-style "面性" (filled) icons — solid filled, rounded corners, modern.
    // Falls back to window.RoleNav.icons (line style) if a key is missing here.
    var iconParkIcons = {
      home: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3 2 12h3v8h6v-6h2v6h6v-8h3z"/></svg>',
      grid: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
      clipboardList: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-2.5A2.5 2.5 0 0 0 14 1h-4a2.5 2.5 0 0 0-2.5 2H5a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-9-1h4a1 1 0 0 1 0 2h-4a1 1 0 0 1 0-2zm-1 12a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm6.5 4a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm0-4a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm-3 4a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm-3.5 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/></svg>',
      clipboardCheck: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-2.5A2.5 2.5 0 0 0 14 1h-4a2.5 2.5 0 0 0-2.5 2H5a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-9-1h4a1 1 0 0 1 0 2h-4a1 1 0 0 1 0-2zm5.5 14L11 11.5l1.4-1.4 3.1 3.1 5.1-5.1L22 9.5z"/></svg>',
      star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 2.95 6.91 7.55.65-5.73 4.95 1.73 7.4L12 18.13 5.5 21.9l1.73-7.4L1.5 9.56l7.55-.65z"/></svg>',
      target: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 16a6 6 0 1 1 6-6 6 6 0 0 1-6 6zm0-10a4 4 0 1 0 4 4 4 4 0 0 0-4-4zm0 6a2 2 0 1 1 2-2 2 2 0 0 1-2 2z"/></svg>',
      play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 4v16l14-8z"/></svg>',
      wrench: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
      monitor: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 4H3a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h7v2H7v2h10v-2h-3v-2h7a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1zm-1 11H4V6h16z"/></svg>',
      users: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0 2c-2.67 0-8 1.34-8 4v2h11v-2.07A6.92 6.92 0 0 1 14 14H9zm10-6a3.5 3.5 0 1 0-3.5-3.5A3.5 3.5 0 0 0 19 8zm1.5 5c-1.83 0-5.5.92-5.5 2.75V19h11v-3.25c0-1.83-3.67-2.75-5.5-2.75z"/></svg>',
      user: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>',
      book: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 4.5c-1.1-.33-2.3-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65a.5.5 0 0 0 .5.5c.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05a.5.5 0 0 0 .5-.5V6a4.83 4.83 0 0 0-1.75-1.5zM19.5 18c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5z"/></svg>',
      check: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm-1.4 14.6L6 12l1.4-1.4 3.2 3.2 6-6L18 9.2z"/></svg>',
      package: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 8h-3V4H3a2 2 0 0 0-2 2v11h2a3 3 0 0 0 6 0h6a3 3 0 0 0 6 0h2v-5zM6 18.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm13.5-9L17 12.5h-2.5v-3z"/></svg>',
      building: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15 11V5l-3-3-3 3v2H3v14h18V11zm-8 8H5v-2h2zm0-4H5v-2h2zm0-4H5V9h2zm6 8h-2v-2h2zm0-4h-2v-2h2zm0-4h-2V9h2zm0-4h-2V5h2zm6 12h-2v-2h2zm0-4h-2v-2h2z"/></svg>',
      calendar: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 16H5V9h14zM7 11h5v5H7z"/></svg>',
      calendarCheck: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 16H5V9h14zM7.7 14.7l1.4-1.4 2 2 5.6-5.6 1.4 1.4-7 7z"/></svg>',
      presentation: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 4h18v2H3zm1 4h16v9a2 2 0 0 1-2 2h-5v2h2v2H9v-2h2v-2H6a2 2 0 0 1-2-2z"/></svg>',
      edit: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z"/></svg>',
      database: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3C7.58 3 4 4.79 4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7c0-2.21-3.58-4-8-4zm6 14.5c0 .5-2.13 1.5-6 1.5s-6-1-6-1.5v-2.23c1.61.78 3.72 1.23 6 1.23s4.39-.45 6-1.23zm0-5c0 .5-2.13 1.5-6 1.5s-6-1-6-1.5V9.73C7.61 10.51 9.72 10.96 12 10.96s4.39-.45 6-1.23zm-6-3.5c-3.87 0-6-1-6-1.5s2.13-1.5 6-1.5 6 1 6 1.5-2.13 1.5-6 1.5z"/></svg>',
      list: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h2v-2H3zm0 4h2v-2H3zm0-8h2V7H3zm4 4h14v-2H7zm0 4h14v-2H7zM7 7v2h14V7z"/></svg>',
      table: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 3v18h18V3zm6 16H5v-6h4zm0-8H5V5h4zm6 8h-4v-6h4zm0-8h-4V5h4zm6 8h-4v-6h4zm0-8h-4V5h4z"/></svg>',
      userPlus: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 8h-2V6a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2zM9 6h6v2H9zm9 12h-2v2h-2v-2h-2v-2h2v-2h2v2h2z"/></svg>',
      folder: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8z"/></svg>',
      refresh: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.65 6.35A8 8 0 0 0 4 12h-2l3.5 4 3.5-4H7a6 6 0 1 1 1.76 4.24l-1.42 1.42A8 8 0 1 0 17.65 6.35z"/></svg>',
      box: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4a2 2 0 0 0-2 2v3a2 2 0 0 0 1 1.72V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.72A2 2 0 0 0 22 7V4a2 2 0 0 0-2-2zm-5 12H9v-2h6zm5-7H4V4h16z"/></svg>',
      clipboard: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 2h-4.18A2.9 2.9 0 0 0 12 0a2.9 2.9 0 0 0-2.82 2H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm-7 0a1 1 0 1 1-1 1 1 1 0 0 1 1-1zm5 14H7v-2h10zm0-4H7v-2h10zm0-4H7V6h10z"/></svg>',
      chart: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 9.2h3V19H5zm5.6-4.2h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/></svg>',
      pieChart: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 2v20c-5.07-.5-9-4.79-9-10s3.93-9.5 9-10zm2.03 0v8.99H22c-.47-4.74-4.24-8.52-8.97-8.99zm0 11.01V22c4.74-.47 8.5-4.25 8.97-8.99z"/></svg>',
      award: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 5h-2V3H7v2H5a2 2 0 0 0-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0 0 11 14.9V19H7v2h10v-2h-4v-4.1a5.01 5.01 0 0 0 3.61-2.96C19.08 12.63 21 10.55 21 8V7a2 2 0 0 0-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2z"/></svg>',
      trophy: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2H6v7a6 6 0 0 0 5 5.92V17H8v2H6v2h12v-2h-2v-2h-3v-2.08A6 6 0 0 0 18 9V8h2a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm-5 18h-2v-2h2zm5-14h-2V4h2z"/></svg>',
      plus: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z"/></svg>'
    };

    waitForVue(function () {
      var app = Vue.createApp({
        template: `
          <div class="admin-dashboard-wrapper app-content-v2">
            <div class="dashboard-top-toolbar app-page-header">
              <div class="dashboard-toolbar-title">
                <strong>工作台</strong>
                <span>全部服务</span>
              </div>
              <label class="dashboard-toolbar-search">
                <i class="fas fa-search"></i>
                <input v-model="searchQuery" type="search" placeholder="搜索应用、服务及自助办理事项..." @keyup.enter="handleSearch">
              </label>
            </div>

            <!-- Common Services -->
            <div class="admin-section">
              <h3 class="admin-section-title">常用服务</h3>
              <div class="admin-common-grid">
                <div v-for="svc in commonServices" :key="svc.label" class="admin-service-card" @click="handleServiceClick(svc)">
                  <div class="admin-service-icon" :class="'tone-' + svc.tone" v-html="getLucideIcon(svc.icon)"></div>
                  <div class="admin-service-info">
                    <strong>{{ svc.label }}</strong>
                    <small v-if="svc.desc">{{ svc.desc }}</small>
                  </div>
                </div>
                <div class="admin-service-card add-common" @click="showToast('添加常用服务')">
                  <div class="admin-service-icon tone-grey" v-html="getLucideIcon('plus')"></div>
                  <div class="admin-service-info">
                    <strong style="color:var(--color-text-3);">添加常用</strong>
                    <small style="color:var(--color-text-4);">将高频功能固定到顶部</small>
                  </div>
                </div>
              </div>
            </div>

            <!-- All Services -->
            <div class="admin-section">
              <h3 class="admin-section-title">全部服务</h3>
              <div class="admin-tabs-bar">
                <a v-for="cat in categories" :key="cat" class="admin-tab-item" :class="{ active: activeCategory === cat }" :href="'#anchor-' + categoryAnchor(cat)" @click.prevent="scrollToCategory(cat)">{{ cat }}</a>
              </div>

              <div v-for="group in groupedServices" :key="group.category" class="admin-service-group" :id="'anchor-' + categoryAnchor(group.category)">
                <div class="admin-group-header">
                  <span class="admin-group-title">{{ group.category }}</span>
                </div>
                <div class="admin-service-grid">
                  <div v-for="svc in group.items" :key="svc.label" class="admin-service-card" @click="handleServiceClick(svc)">
                    <div class="admin-service-icon" :class="'tone-' + svc.tone" v-html="getLucideIcon(svc.icon)"></div>
                    <div class="admin-service-info">
                      <strong>{{ svc.label }}</strong>
                      <small v-if="svc.desc">{{ svc.desc }}</small>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="groupedServices.length === 0" class="admin-empty">未找到匹配的服务</div>
            </div>
          </div>
        `,
        data() {
          return {
            searchQuery: '',
            activeCategory: '',
            commonServices: [
              { label: '今日待办', desc: '今日紧急事项集中处理', icon: 'clipboardList', tone: 'solid-todo' },
              { label: '轮转安排', desc: '学员科室轮转编排', icon: 'calendar', tone: 'solid-blue' },
              { label: '课程开发', desc: '大纲教案创建迭代', icon: 'edit', tone: 'solid-purple' },
              { label: '课程实施', desc: '实施进度与课堂反馈', icon: 'play', tone: 'solid-purple' },
              { label: '排课工作台', desc: '可视化排课与冲突检测', icon: 'table', tone: 'solid-orange' },
              { label: '报名情况', desc: '报名与候补实时统计', icon: 'users', tone: 'solid-orange' },
              { label: '空间预约审批', desc: '教室考站预约审批', icon: 'building', tone: 'solid-teal' },
              { label: '物资档案', desc: '物资规格与效期维护', icon: 'folder', tone: 'solid-material' },
              { label: '个人资源库', desc: '个人课件教案云存储', icon: 'book', tone: 'solid-pink' },
              { label: '评估结果与分析', desc: '评估报告与改进建议', icon: 'pieChart', tone: 'solid-cyan' }
            ],
            categories: ['轮转管理', '课程管理', '排课管理', '空间管理', '物资管理', '教学资源库', '师生管理', '评估管理'],
            allServices: [
              { label: '轮转安排', category: '轮转管理', desc: '学员科室轮转编排', icon: 'calendar', tone: 'solid-blue' },
              { label: '教学活动', category: '轮转管理', desc: '教学查房、小讲课、病例讨论', icon: 'presentation', tone: 'solid-blue' },

              { label: '课程开发', category: '课程管理', desc: '大纲教案创建迭代', icon: 'edit', tone: 'solid-purple' },
              { label: '课程审核', category: '课程管理', desc: '课程评审与发布审核', icon: 'clipboardCheck', tone: 'solid-purple' },
              { label: '课程池', category: '课程管理', desc: '优质课程资产共享', icon: 'database', tone: 'solid-purple' },
              { label: '课程实施', category: '课程管理', desc: '实施进度与课堂反馈', icon: 'play', tone: 'solid-purple' },

              { label: '排课工作台', category: '排课管理', desc: '可视化排课与冲突检测', icon: 'table', tone: 'solid-orange' },
              { label: '已排课表', category: '排课管理', desc: '已确认课表查看导出', icon: 'calendarCheck', tone: 'solid-orange' },
              { label: '报名情况', category: '排课管理', desc: '报名与候补实时统计', icon: 'users', tone: 'solid-orange' },

              { label: '空间预约审批', category: '空间管理', desc: '教室考站预约审批', icon: 'building', tone: 'solid-teal' },
              { label: '空间资产管理', category: '空间管理', desc: '房间与设备资产台账', icon: 'box', tone: 'solid-teal' },
              { label: '班牌和大屏管理', category: '空间管理', desc: '考站班牌与大屏管理', icon: 'monitor', tone: 'solid-teal' },

              { label: '物资工作台', category: '物资管理', desc: '教具领用与跨科调度', icon: 'package', tone: 'solid-material' },
              { label: '物资档案', category: '物资管理', desc: '物资规格与效期维护', icon: 'folder', tone: 'solid-material' },
              { label: '维修管理', category: '物资管理', desc: '设备报修登记跟踪', icon: 'wrench', tone: 'solid-material' },
              { label: '盘点管理', category: '物资管理', desc: '盘点任务与差异归档', icon: 'clipboardList', tone: 'solid-material' },

              { label: '个人资源库', category: '教学资源库', desc: '个人课件教案云存储', icon: 'book', tone: 'solid-pink' },
              { label: '科室资源库', category: '教学资源库', desc: '科室共享病例与文献', icon: 'database', tone: 'solid-pink' },
              { label: '院级资源库', category: '教学资源库', desc: '全院公共资源管理', icon: 'box', tone: 'solid-pink' },

              { label: '师资管理', category: '师生管理', desc: '教师档案与带教资格', icon: 'users', tone: 'solid-green' },
              { label: '学员管理', category: '师生管理', desc: '学员学籍与轮转记录', icon: 'user', tone: 'solid-green' },
              { label: '成果审批', category: '师生管理', desc: '成果申报审核流程', icon: 'check', tone: 'solid-green' },
              { label: '成果档案', category: '师生管理', desc: '成果材料归档查询', icon: 'folder', tone: 'solid-green' },

              { label: '学员评价体系', category: '评估管理', desc: '学员胜任力指标配置', icon: 'clipboardCheck', tone: 'solid-cyan' },
              { label: '教师评价体系', category: '评估管理', desc: '教师评价维度权重', icon: 'chart', tone: 'solid-cyan' },
              { label: '评估工具库', category: '评估管理', desc: '评估表单集中管理', icon: 'clipboard', tone: 'solid-cyan' },
              { label: '评估任务中心', category: '评估管理', desc: '评估任务下发回收', icon: 'list', tone: 'solid-cyan' },
              { label: '评估结果与分析', category: '评估管理', desc: '评估报告与改进建议', icon: 'pieChart', tone: 'solid-cyan' }
            ]
          };
        },
        computed: {
          groupedServices() {
            var keyword = this.searchQuery.trim().toLowerCase();
            var filtered = this.allServices;
            if (keyword) {
              filtered = filtered.filter(function (s) {
                return s.label.toLowerCase().includes(keyword)
                  || s.category.toLowerCase().includes(keyword);
              });
            }
            var groups = {};
            var self = this;
            // Preserve canonical order from `categories`
            this.categories.forEach(function (cat) { groups[cat] = []; });
            filtered.forEach(function (s) {
              if (!groups[s.category]) groups[s.category] = [];
              groups[s.category].push(s);
            });
            return this.categories
              .map(function (cat) { return { category: cat, items: groups[cat] || [] }; })
              .filter(function (g) { return g.items.length > 0; });
          }
        },
        mounted() {
          this._scrollEl = document.querySelector('.main-inner') || window;
          this._onScroll = this.updateActiveCategory.bind(this);
          this._scrollEl.addEventListener('scroll', this._onScroll, { passive: true });
          this.updateActiveCategory();
        },
        beforeUnmount() {
          if (this._onScroll && this._scrollEl) {
            this._scrollEl.removeEventListener('scroll', this._onScroll);
          }
        },
        methods: {
          getLucideIcon(iconName) {
            // Prefer the local IconPark-style filled ("面性") icon set
            if (iconParkIcons[iconName]) {
              return iconParkIcons[iconName];
            }
            var icons = window.RoleNav && window.RoleNav.icons;
            if (icons && icons[iconName]) {
              return icons[iconName];
            }
            return '';
          },
          categoryAnchor(cat) {
            // Generate a URL-safe anchor id from a Chinese label
            return 'cat-' + cat;
          },
          getScrollContainer() {
            return this._scrollEl || (this._scrollEl = document.querySelector('.main-inner') || window);
          },
          scrollToCategory(cat) {
            this.activeCategory = cat;
            var id = 'anchor-' + this.categoryAnchor(cat);
            var el = document.getElementById(id);
            if (!el) return;
            var container = this.getScrollContainer();
            var containerRect = container.getBoundingClientRect();
            var elRect = el.getBoundingClientRect();
            // Offset: keep group header below the sticky top toolbar (64px) + sticky tab bar (~45px)
            var offset = 64 + 48;
            var targetTop;
            if (container === window) {
              targetTop = window.pageYOffset + elRect.top - offset;
              window.scrollTo({ top: targetTop, behavior: 'smooth' });
            } else {
              targetTop = container.scrollTop + elRect.top - containerRect.top - offset;
              container.scrollTo({ top: targetTop, behavior: 'smooth' });
            }
          },
          updateActiveCategory() {
            if (!this.categories || this.categories.length === 0) return;
            var groups = document.querySelectorAll('.admin-service-group');
            if (!groups.length) return;
            var container = this.getScrollContainer();
            var probe;
            if (container === window) {
              probe = window.pageYOffset + 120;
            } else {
              var containerRect = container.getBoundingClientRect();
              probe = -containerRect.top + 120;
            }
            var current = this.categories[0];
            for (var i = 0; i < groups.length; i++) {
              var g = groups[i];
              var top = g.getBoundingClientRect().top;
              if (top <= 120) {
                current = this.categories[i] || current;
              }
            }
            if (current !== this.activeCategory) {
              this.activeCategory = current;
            }
          },
          handleServiceClick(svc) {
            if (window.navigateTo) {
              window.navigateTo(svc.label);
            }
          },
          handleSearch() {
            var q = this.searchQuery.trim();
            if (!q) return;
            var found = this.allServices.find(function (s) {
              return s.label.toLowerCase().indexOf(q.toLowerCase()) !== -1;
            });
            if (found && window.navigateTo) {
              window.navigateTo(found.label);
            } else if (window.ArcoVue && window.ArcoVue.Message) {
              window.ArcoVue.Message.info('未找到匹配的服务');
            }
          },
          showToast(msg) {
            if (window.ArcoVue && window.ArcoVue.Message) {
              window.ArcoVue.Message.info(msg);
            }
          }
        }
      });
      app.use(window.ArcoVue);
      vueApp = app;
      vueApp.mount('#admin-dashboard-app');
    });
  }

  function boot() {
    renderShell();
    var lastActive = document.body.dataset.active;
    var lastRole = document.body.dataset.role;
    var obs = new MutationObserver(function () {
      var curActive = document.body.dataset.active;
      var curRole = document.body.dataset.role;
      if (curActive !== lastActive || curRole !== lastRole) {
        lastActive = curActive;
        lastRole = curRole;
        renderShell();
      }
    });
    obs.observe(document.body, { attributes: true, attributeFilter: ['data-active', 'data-role'] });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
}());
