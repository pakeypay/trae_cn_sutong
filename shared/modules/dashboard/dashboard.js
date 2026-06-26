(function () {
  var vueApp = null;

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
            <div class="dashboard-top-toolbar">
              <div class="dashboard-toolbar-title">
                <strong>工作台</strong>
                <span>今日教学</span>
              </div>
              <label class="dashboard-toolbar-search">
                <i class="fas fa-search"></i>
                <input v-model="dashboardQuery" type="search" placeholder="搜索课程、任务、通知..." @keyup.enter="handleDashboardSearch">
              </label>
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
              <div class="dashboard-toolbar-title">
                <strong>工作台</strong>
                <span>学习概览</span>
              </div>
              <label class="dashboard-toolbar-search">
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
    waitForVue(function () {
      var app = Vue.createApp({
        template: `
          <div class="admin-dashboard-wrapper">
            <div class="dashboard-top-toolbar">
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
                  <div class="admin-service-icon" :class="'tone-' + svc.tone">
                    <i :class="svc.icon"></i>
                  </div>
                  <strong>{{ svc.label }}</strong>
                </div>
                <div class="admin-service-card add-common" @click="showToast('添加常用服务')">
                  <div class="admin-service-icon tone-grey">
                    <span style="font-size:20px;">+</span>
                  </div>
                  <strong style="color:var(--color-text-3);">添加常用</strong>
                </div>
              </div>
            </div>

            <!-- All Services -->
            <div class="admin-section">
              <h3 class="admin-section-title">全部服务</h3>
              <div class="admin-tabs-bar">
                <span v-for="(cat, idx) in categories" :key="cat">
                  <span class="admin-tab-item" :class="{ active: activeCategory === cat }" @click="activeCategory = cat">{{ cat }}</span>
                  <span v-if="idx < categories.length - 1" class="admin-tab-divider">/</span>
                </span>
              </div>

              <div v-for="group in filteredGroups" :key="group.category" class="admin-service-group">
                <div class="admin-group-header">
                  <span class="admin-group-title">{{ group.category }}</span>
                </div>
                <div class="admin-service-grid">
                  <div v-for="svc in group.items" :key="svc.label" class="admin-service-card" @click="handleServiceClick(svc)">
                    <div class="admin-service-icon" :class="'tone-' + svc.tone">
                      <i :class="svc.icon"></i>
                    </div>
                    <div class="admin-service-info">
                      <strong>{{ svc.label }}</strong>
                      <small>{{ svc.desc }}</small>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="filteredGroups.length === 0" class="admin-empty">未找到匹配的服务</div>
            </div>
          </div>
        `,
        data() {
          return {
            searchQuery: '',
            activeCategory: '全部',
            commonServices: [
              { label: '今日待办', icon: 'fas fa-calendar-day', tone: 'blue' },
              { label: '重点工作', icon: 'fas fa-bookmark', tone: 'purple' },
              { label: '工作推进', icon: 'fas fa-check-circle', tone: 'green' }
            ],
            categories: ['全部', '工作台', '数据大屏', '轮转管理', '课程管理', '排课管理', '空间管理', '物资管理', '教学资源库', '师生管理', '成果管理', '评估管理'],
            allServices: [
              { label: '今日待办', category: '工作台', desc: '进入工作台，办理或查看"今日待办"相关业务。', icon: 'fas fa-calendar-day', tone: 'blue' },
              { label: '重点工作', category: '工作台', desc: '进入工作台，办理或查看"重点工作"相关业务。', icon: 'fas fa-bookmark', tone: 'purple' },
              { label: '工作推进', category: '工作台', desc: '进入工作台，办理或查看"工作推进"相关业务。', icon: 'fas fa-check-circle', tone: 'green' },
              { label: '师资情况', category: '数据大屏', desc: '进入数据大屏，办理或查看"师资情况"相关业务。', icon: 'fas fa-users', tone: 'blue' },
              { label: '学员情况', category: '数据大屏', desc: '进入数据大屏，办理或查看"学员情况"相关业务。', icon: 'fas fa-user-graduate', tone: 'purple' },
              { label: '课程情况', category: '数据大屏', desc: '进入数据大屏，办理或查看"课程情况"相关业务。', icon: 'fas fa-book', tone: 'green' },
              { label: '评估情况', category: '数据大屏', desc: '进入数据大屏，办理或查看"评估情况"相关业务。', icon: 'fas fa-clipboard-check', tone: 'teal' },
              { label: '物资情况', category: '数据大屏', desc: '进入数据大屏，办理或查看"物资情况"相关业务。', icon: 'fas fa-box', tone: 'orange' },
              { label: '空间情况', category: '数据大屏', desc: '进入数据大屏，办理或查看"空间情况"相关业务。', icon: 'fas fa-building', tone: 'red' },
              { label: '轮转安排', category: '轮转管理', desc: '进入轮转管理，办理或查看"轮转安排"相关业务。', icon: 'fas fa-calendar-alt', tone: 'blue' },
              { label: '教学活动', category: '轮转管理', desc: '进入轮转管理，办理或查看"教学活动"相关业务。', icon: 'fas fa-chalkboard-teacher', tone: 'purple' },
              { label: '课程开发', category: '课程管理', desc: '进入课程管理，办理或查看"课程开发"相关业务。', icon: 'fas fa-edit', tone: 'blue' },
              { label: '课程池', category: '课程管理', desc: '进入课程管理，办理或查看"课程池"相关业务。', icon: 'fas fa-database', tone: 'purple' },
              { label: '开课计划', category: '课程管理', desc: '进入课程管理，办理或查看"开课计划"相关业务。', icon: 'fas fa-calendar', tone: 'green' },
              { label: '课程实施', category: '课程管理', desc: '进入课程管理，办理或查看"课程实施"相关业务。', icon: 'fas fa-list-alt', tone: 'teal' },
              { label: '排课工作台', category: '排课管理', desc: '进入排课管理，办理或查看"排课工作台"相关业务。', icon: 'fas fa-calendar-check', tone: 'blue' },
              { label: '开课条件总览', category: '排课管理', desc: '进入排课管理，办理或查看"开课条件总览"相关业务。', icon: 'fas fa-table', tone: 'purple' },
              { label: '已排课表', category: '排课管理', desc: '进入排课管理，办理或查看"已排课表"相关业务。', icon: 'fas fa-list', tone: 'green' },
              { label: '报名情况', category: '排课管理', desc: '进入排课管理，办理或查看"报名情况"相关业务。', icon: 'fas fa-user-plus', tone: 'teal' },
              { label: '空间预约审批', category: '空间管理', desc: '进入空间管理，办理或查看"空间预约审批"相关业务。', icon: 'fas fa-building', tone: 'blue' },
              { label: '空间资产管理', category: '空间管理', desc: '进入空间管理，办理或查看"空间资产管理"相关业务。', icon: 'fas fa-box-open', tone: 'purple' },
              { label: '班牌和大屏管理', category: '空间管理', desc: '进入空间管理，办理或查看"班牌和大屏管理"相关业务。', icon: 'fas fa-tv', tone: 'green' },
              { label: '物资工作台', category: '物资管理', desc: '进入物资管理，办理或查看"物资工作台"相关业务。', icon: 'fas fa-box', tone: 'blue' },
              { label: '物资档案', category: '物资管理', desc: '进入物资管理，办理或查看"物资档案"相关业务。', icon: 'fas fa-folder', tone: 'purple' },
              { label: '维修管理', category: '物资管理', desc: '进入物资管理，办理或查看"维修管理"相关业务。', icon: 'fas fa-tools', tone: 'orange' },
              { label: '盘点管理', category: '物资管理', desc: '进入物资管理，办理或查看"盘点管理"相关业务。', icon: 'fas fa-clipboard-list', tone: 'teal' },
              { label: '个人云盘', category: '教学资源库', desc: '进入教学资源库，办理或查看"个人云盘"相关业务。', icon: 'fas fa-cloud', tone: 'blue' },
              { label: '科室云盘', category: '教学资源库', desc: '进入教学资源库，办理或查看"科室云盘"相关业务。', icon: 'fas fa-folder-open', tone: 'purple' },
              { label: '公共库', category: '教学资源库', desc: '进入教学资源库，办理或查看"公共库"相关业务。', icon: 'fas fa-globe', tone: 'green' },
              { label: '师资管理', category: '师生管理', desc: '进入师生管理，办理或查看"师资管理"相关业务。', icon: 'fas fa-user-tie', tone: 'blue' },
              { label: '学员管理', category: '师生管理', desc: '进入师生管理，办理或查看"学员管理"相关业务。', icon: 'fas fa-user-graduate', tone: 'purple' },
              { label: '科研成果', category: '成果管理', desc: '进入成果管理，办理或查看"科研成果"相关业务。', icon: 'fas fa-award', tone: 'blue' },
              { label: '教学奖励', category: '成果管理', desc: '进入成果管理，办理或查看"教学奖励"相关业务。', icon: 'fas fa-trophy', tone: 'orange' },
              { label: '学员评价体系配置', category: '评估管理', desc: '进入评估管理，办理或查看"学员评价体系配置"相关业务。', icon: 'fas fa-bullseye', tone: 'blue' },
              { label: '教师评价体系配置', category: '评估管理', desc: '进入评估管理，办理或查看"教师评价体系配置"相关业务。', icon: 'fas fa-bullseye', tone: 'purple' },
              { label: '评估工具库', category: '评估管理', desc: '进入评估管理，办理或查看"评估工具库"相关业务。', icon: 'fas fa-clipboard', tone: 'green' },
              { label: '评估任务中心', category: '评估管理', desc: '进入评估管理，办理或查看"评估任务中心"相关业务。', icon: 'fas fa-tasks', tone: 'teal' },
              { label: '评估结果与分析', category: '评估管理', desc: '进入评估管理，办理或查看"评估结果与分析"相关业务。', icon: 'fas fa-chart-bar', tone: 'orange' }
            ]
          };
        },
        computed: {
          filteredGroups() {
            var keyword = this.searchQuery.trim().toLowerCase();
            var filtered = this.allServices;
            if (this.activeCategory !== '全部') {
              filtered = filtered.filter(function (s) { return s.category === this.activeCategory; }.bind(this));
            }
            if (keyword) {
              filtered = filtered.filter(function (s) {
                return s.label.toLowerCase().indexOf(keyword) !== -1 || s.desc.toLowerCase().indexOf(keyword) !== -1;
              });
            }
            var groups = {};
            filtered.forEach(function (s) {
              if (!groups[s.category]) groups[s.category] = [];
              groups[s.category].push(s);
            });
            return Object.keys(groups).map(function (cat) {
              return { category: cat, items: groups[cat] };
            });
          }
        },
        methods: {
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
