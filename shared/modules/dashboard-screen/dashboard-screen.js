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
    if (document.getElementById('dbs-module-css')) return;
    var link = document.createElement('link');
    link.id = 'dbs-module-css';
    link.rel = 'stylesheet';
    link.href = (document.querySelector('script[src$="dashboard-screen.js"]') || {}).src
      .replace(/dashboard-screen\.js$/, 'dashboard-screen.css');
    document.head.appendChild(link);
  }

  function shouldHandle() {
    var role = document.body.dataset.role;
    var active = document.body.dataset.active;
    return role === 'admin' && active === '数据大屏';
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

    content.innerHTML = '<div id="admin-dashboard-screen-app"></div>';

    waitForVue(function () {
      var app = Vue.createApp({
        template: `
          <div class="db-dashboard-wrapper">
            <!-- Page Header -->
            <header class="db-dashboard-header">
              <div class="header-left">
                <div class="breadcrumb">
                  <span>首页</span> / <span>教务管理</span> / <strong>数据大屏 (业务汇总)</strong>
                </div>
                <h1>学院教学管理与资源调度汇总大屏</h1>
                <p class="subtitle">整合全院师资情况、学员在训、课程建设、教学排课、物资流转及空间占用状态的结构化决策面板。</p>
              </div>
              <div class="header-right">
                <span class="update-time"><span class="lucide-icon" v-html="getIcon('sync')"></span> 数据更新时间：{{ currentTime }}</span>
                <a-button type="primary" size="small" @click="reloadData">
                  <template #icon><span class="lucide-icon" v-html="getIcon('sync')"></span></template>刷新数据
                </a-button>
              </div>
            </header>

            <!-- Top KPI Grid -->
            <section class="kpi-grid">
              <div class="kpi-card" v-for="kpi in kpis" :key="kpi.label">
                <div class="kpi-icon-wrap" :style="{ color: kpi.color, background: kpi.bg }">
                  <span class="lucide-icon" v-html="getIcon(kpi.icon)"></span>
                </div>
                <div class="kpi-content">
                  <span class="kpi-label">{{ kpi.label }}</span>
                  <strong class="kpi-value">{{ kpi.value }}</strong>
                  <span class="kpi-subtext" :class="kpi.trendClass">{{ kpi.subtext }}</span>
                </div>
              </div>
            </section>

            <section class="db-scheduling-analysis" aria-label="课程与授课分布">
              <div class="db-analysis-head">
                <div>
                  <span>排课数据分析</span>
                  <h2>课程与授课分布</h2>
                  <p>从排课工作台迁移，用于观察待排课程结构与授课资源分布。</p>
                </div>
                <div class="db-analysis-total">
                  <strong>{{ schedulingSummary.totalCourses }}</strong>
                  <span>门待排课程 · {{ schedulingSummary.totalStudents }} 人次</span>
                </div>
              </div>
              <div class="db-distribution-grid">
                <article class="db-distribution-card">
                  <h3>课程按学员类型分布</h3>
                  <div v-for="item in reusedStudentTypeChart" :key="item.label" class="db-distribution-row">
                    <span>{{ item.label }}</span>
                    <div><i :style="{ width: item.value + '%', background: item.color }"></i></div>
                    <strong>{{ item.display }}</strong>
                  </div>
                </article>
                <article class="db-distribution-card">
                  <h3>课程按专业基地分布</h3>
                  <div v-for="item in reusedBaseChart" :key="item.label" class="db-distribution-row">
                    <span>{{ item.label }}</span>
                    <div><i :style="{ width: item.value + '%', background: item.color }"></i></div>
                    <strong>{{ item.display }}</strong>
                  </div>
                </article>
                <article class="db-distribution-card">
                  <h3>儿科基地按科室分布</h3>
                  <div v-for="item in reusedPediatricsChart" :key="item.label" class="db-distribution-row">
                    <span>{{ item.label }}</span>
                    <div><i :style="{ width: item.value * 5 + '%', background: '#4080ff' }"></i></div>
                    <strong>{{ item.display }}</strong>
                  </div>
                </article>
                <article class="db-distribution-card">
                  <h3>儿外基地按科室分布</h3>
                  <div v-for="item in reusedSurgeryChart" :key="item.label" class="db-distribution-row">
                    <span>{{ item.label }}</span>
                    <div><i :style="{ width: item.value * 5 + '%', background: '#14c9c9' }"></i></div>
                    <strong>{{ item.display }}</strong>
                  </div>
                </article>
              </div>
            </section>

            <!-- Main Modules Grid -->
            <div class="modules-grid">
              
              <!-- Module 1: 师资情况 -->
              <section class="module-card" aria-label="师资情况模块">
                <div class="module-card-header">
                  <div class="header-title">
                    <span class="lucide-icon icon-blue" v-html="getIcon('userMd')"></span>
                    <h3>师资情况</h3>
                  </div>
                  <a-tag size="small" color="blue">全院统计</a-tag>
                </div>
                <div class="module-card-body">
                  <div class="stats-row">
                    <div class="stats-item">
                      <span>带教老师总数</span>
                      <strong>384 <small>人</small></strong>
                    </div>
                    <div class="stats-item">
                      <span>活跃授课讲师</span>
                      <strong>{{ activeTeachersCount }} <small>人</small></strong>
                    </div>
                  </div>
                  
                  <div class="sub-section-title">职称与资质构成</div>
                  <div class="title-distribution">
                    <div v-for="title in teacherTitles" :key="title.name" class="dist-row">
                      <span class="dist-label">{{ title.name }}</span>
                      <div class="dist-bar-wrapper">
                        <div class="dist-bar" :style="{ width: title.percent + '%', background: '#165DFF' }"></div>
                      </div>
                      <span class="dist-value">{{ title.count }}人 ({{ title.percent }}%)</span>
                    </div>
                  </div>

                  <div class="sub-section-title">活跃教师教学时长排行 (前5名)</div>
                  <div class="structured-list">
                    <div v-for="(teacher, index) in topTeachers" :key="teacher.id" class="list-item">
                      <span class="item-index">{{ index + 1 }}</span>
                      <span class="item-name">{{ teacher.name }}</span>
                      <span class="item-dept">{{ teacher.department }} · {{ teacher.title }}</span>
                      <strong class="item-value text-blue">{{ teacher.hours }}h</strong>
                    </div>
                  </div>
                </div>
              </section>

              <!-- Module 2: 学员情况 -->
              <section class="module-card" aria-label="学员情况模块">
                <div class="module-card-header">
                  <div class="header-title">
                    <span class="lucide-icon icon-indigo" v-html="getIcon('userGraduate')"></span>
                    <h3>学员情况</h3>
                  </div>
                  <a-tag size="small" color="indigo">教学对象</a-tag>
                </div>
                <div class="module-card-body">
                  <div class="stats-row">
                    <div class="stats-item">
                      <span>在训总人数</span>
                      <strong>1,280 <small>人</small></strong>
                    </div>
                    <div class="stats-item">
                      <span>平均出勤率</span>
                      <strong class="text-green">98.6%</strong>
                    </div>
                  </div>
                  
                  <div class="sub-section-title">各学员类型在训及教学进度</div>
                  <div class="table-container">
                    <table class="dashboard-table">
                      <thead>
                        <tr>
                          <th>学员类型</th>
                          <th class="text-right">人数</th>
                          <th class="text-right">计划门数</th>
                          <th class="text-right">已完/待完</th>
                          <th>教学进度</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="group in studentProgress" :key="group.id">
                          <td>
                            <span class="student-badge" :class="group.tone">{{ group.short }}</span>
                            <strong>{{ group.name }}</strong>
                          </td>
                          <td class="text-right">{{ group.total }}人</td>
                          <td class="text-right">{{ group.plan }}门</td>
                          <td class="text-right text-muted">{{ group.done }} / {{ group.undone }}</td>
                          <td>
                            <div class="progress-cell">
                              <a-progress :percent="group.percent" size="small" :color="group.color" />
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              <!-- Module 3: 课程情况 -->
              <section class="module-card" aria-label="课程情况模块">
                <div class="module-card-header">
                  <div class="header-title">
                    <span class="lucide-icon icon-green" v-html="getIcon('bookMedical')"></span>
                    <h3>课程情况</h3>
                  </div>
                  <a-tag size="small" color="green">资源库</a-tag>
                </div>
                <div class="module-card-body">
                  <div class="stats-row">
                    <div class="stats-item">
                      <span>发布课程总数</span>
                      <strong>156 <small>门</small></strong>
                    </div>
                    <div class="stats-item">
                      <span>开发中/草稿</span>
                      <strong>12 <small>门</small></strong>
                    </div>
                  </div>

                  <div class="sub-section-title">专业基地课程数量分布</div>
                  <div class="title-distribution">
                    <div v-for="base in courseBases" :key="base.name" class="dist-row">
                      <span class="dist-label">{{ base.name }}基地</span>
                      <div class="dist-bar-wrapper">
                        <div class="dist-bar" :style="{ width: base.percent + '%', background: base.color }"></div>
                      </div>
                      <span class="dist-value">{{ base.count }}门 ({{ base.percent }}%)</span>
                    </div>
                  </div>

                  <div class="sub-section-title">高频开课核心课程 (前5门)</div>
                  <div class="structured-list">
                    <div v-for="(course, index) in topCourses" :key="course.id" class="list-item">
                      <span class="item-index">{{ index + 1 }}</span>
                      <div class="item-main">
                        <strong>{{ course.name }}</strong>
                        <span>{{ course.base }} · {{ course.department }}</span>
                      </div>
                      <div class="item-meta">
                        <span>师生比 {{ course.ratio }}</span>
                        <span>每次 {{ course.capacity }} 人</span>
                      </div>
                      <strong class="item-value">{{ course.sessions }}次/年</strong>
                    </div>
                  </div>
                </div>
              </section>

              <!-- Module 4: 排课情况 -->
              <section class="module-card" aria-label="排课情况模块">
                <div class="module-card-header">
                  <div class="header-title">
                    <span class="lucide-icon icon-orange" v-html="getIcon('calendar')"></span>
                    <h3>排课情况 (数据复用自排课管理)</h3>
                  </div>
                  <a-tag size="small" color="orange">排课工作台</a-tag>
                </div>
                <div class="module-card-body">
                  <div class="stats-row">
                    <div class="stats-item">
                      <span>待排课程总数</span>
                      <strong>{{ schedulingSummary.totalCourses }} <small>门</small></strong>
                    </div>
                    <div class="stats-item">
                      <span>待排学员总数</span>
                      <strong>{{ schedulingSummary.totalStudents }} <small>人</small></strong>
                    </div>
                  </div>

                  <div class="sub-section-title">课程按教学对象分布</div>
                  <div class="type-grid">
                    <div v-for="item in reusedStudentTypeChart" :key="item.label" class="type-stat-card">
                      <span class="type-color-dot" :style="{ background: item.color }"></span>
                      <div class="type-stat-info">
                        <span class="type-label">{{ item.label }}学员</span>
                        <strong>{{ item.display }}</strong>
                        <small>学员人数: {{ item.value }}人</small>
                      </div>
                    </div>
                  </div>

                  <div class="sub-section-title">住培课程按基地分布</div>
                  <div class="title-distribution">
                    <div v-for="item in reusedBaseChart" :key="item.label" class="dist-row">
                      <span class="dist-label"><i class="dot" :style="{ background: item.color }"></i>{{ item.label }}</span>
                      <div class="dist-bar-wrapper">
                        <div class="dist-bar" :style="{ width: (item.value / 40 * 100) + '%', background: item.color }"></div>
                      </div>
                      <span class="dist-value">{{ item.display }} (权重{{ item.value }})</span>
                    </div>
                  </div>

                  <div class="sub-section-title">科室分布统计 (Top 4)</div>
                  <div class="dept-dist-row">
                    <div class="dept-col">
                      <div class="dept-col-title">儿科基地</div>
                      <div v-for="item in reusedPediatricsChart.slice(0, 4)" :key="item.label" class="dept-item">
                        <span>{{ item.label }}</span>
                        <strong>{{ item.display }}</strong>
                      </div>
                    </div>
                    <div class="dept-col">
                      <div class="dept-col-title">儿外科基地</div>
                      <div v-for="item in reusedSurgeryChart.slice(0, 4)" :key="item.label" class="dept-item">
                        <span>{{ item.label }}</span>
                        <strong>{{ item.display }}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <!-- Module 5: 物资情况 -->
              <section class="module-card" aria-label="物资情况模块">
                <div class="module-card-header">
                  <div class="header-title">
                    <span class="lucide-icon icon-pink" v-html="getIcon('boxes')"></span>
                    <h3>物资情况</h3>
                  </div>
                  <a-tag size="small" color="pink">物资资产</a-tag>
                </div>
                <div class="module-card-body">
                  <div class="stats-row">
                    <div class="stats-item">
                      <span>在库物资总数</span>
                      <strong>142 <small>件</small></strong>
                    </div>
                    <div class="stats-item">
                      <span>月度使用次数</span>
                      <strong>286 <small>次</small></strong>
                    </div>
                  </div>

                  <div class="sub-section-title">在库物资分类统计</div>
                  <div class="inventory-mix-grid">
                    <div v-for="item in reusedInventoryMix" :key="item.name" class="inv-card">
                      <div class="inv-main">
                        <strong>{{ item.count }} <small>件</small></strong>
                        <span>{{ item.name }}</span>
                      </div>
                      <div class="inv-breakdown">
                        <span v-for="sub in item.breakdown" :key="sub.name">{{ sub.name }}: {{ sub.value }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="sub-section-title">物资异常与警告事件</div>
                  <div class="structured-list danger-list">
                    <div v-for="todo in reusedTodos" :key="todo.title" class="list-item list-item-warning">
                      <span class="warning-badge" :style="{ background: todo.color }">{{ todo.source }}</span>
                      <div class="item-main">
                        <strong>{{ todo.title }}</strong>
                        <span>{{ todo.desc }}</span>
                      </div>
                      <strong class="item-value text-red">{{ todo.time }}</strong>
                    </div>
                  </div>
                </div>
              </section>

              <!-- Module 6: 空间情况 -->
              <section class="module-card" aria-label="空间情况模块">
                <div class="module-card-header">
                  <div class="header-title">
                    <span class="lucide-icon icon-cyan" v-html="getIcon('doorOpen')"></span>
                    <h3>空间情况</h3>
                  </div>
                  <a-tag size="small" color="cyan">空间资产</a-tag>
                </div>
                <div class="module-card-body">
                  <div class="stats-row">
                    <div class="stats-item">
                      <span>教室/实训室总数</span>
                      <strong>{{ totalRooms }} <small>间</small></strong>
                    </div>
                    <div class="stats-item">
                      <span>今日使用率</span>
                      <strong class="text-orange">82.0%</strong>
                    </div>
                  </div>

                  <div class="sub-section-title">空间当前占用状态</div>
                  <div class="room-status-strip">
                    <div class="status-seg bg-green" style="flex: 18">在用 18 间 (53%)</div>
                    <div class="status-seg bg-orange" style="flex: 10">已预约 10 间 (29%)</div>
                    <div class="status-seg bg-gray" style="flex: 6">空闲 6 间 (18%)</div>
                  </div>

                  <div class="sub-section-title">教学空间列表及配置</div>
                  <div class="table-container">
                    <table class="dashboard-table rooms-table">
                      <thead>
                        <tr>
                          <th>教室名称</th>
                          <th>类型</th>
                          <th class="text-right">容量</th>
                          <th>配备设备</th>
                          <th>使用状态</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="room in reusedRooms.slice(0, 5)" :key="room.id">
                          <td><strong>{{ room.name }}</strong></td>
                          <td>{{ room.type }}</td>
                          <td class="text-right">{{ room.capacity }}人</td>
                          <td>
                            <span v-for="eq in room.equipment" :key="eq" class="eq-tag">{{ eq }}</span>
                          </td>
                          <td>
                            <a-badge :status="room.status === 'open' ? 'success' : 'warning'" :text="room.status === 'open' ? '开放中' : '维护中'" />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

            </div>
          </div>
        `,
        data() {
          return {
            currentTime: '',
            timer: null,
            kpis: [
              { label: '带教老师总数', value: '384 人', subtext: '教学活跃度 94.2%', color: '#165dff', bg: 'rgba(22,93,255,0.08)', icon: 'userMd' },
              { label: '在训学员总数', value: '1,280 人', subtext: '今日考勤 98.6%', color: '#722ed1', bg: 'rgba(114,46,209,0.08)', icon: 'userGraduate' },
              { label: '发布课程总数', value: '156 门', subtext: '新增 12 门大纲', color: '#00b42a', bg: 'rgba(0,180,42,0.08)', icon: 'bookMedical' },
              { label: '教学评估均分', value: '98.2 分', subtext: '满意率 99.1%', color: '#ff7d00', bg: 'rgba(255,125,0,0.08)', icon: 'star' },
              { label: '物资运转充足率', value: '95.8 %', subtext: '4件设备待维修', color: '#eb2f96', bg: 'rgba(235,47,150,0.08)', icon: 'boxes' },
              { label: '空间今日占用率', value: '82.0 %', subtext: '今日排课 34 场', color: '#13c2c2', bg: 'rgba(19,194,194,0.08)', icon: 'doorOpen' }
            ],
            // 师资构成
            teacherTitles: [
              { name: '主任医师', count: 48, percent: 12.5 },
              { name: '副主任医师', count: 96, percent: 25 },
              { name: '主治医师', count: 164, percent: 42.7 },
              { name: '主管护师/讲师', count: 76, percent: 19.8 }
            ],
            // 课程基地分布
            courseBases: [
              { name: '通识教研', count: 54, percent: 34.6, color: '#00b42a' },
              { name: '儿科临床', count: 62, percent: 39.7, color: '#165dff' },
              { name: '儿外临床', count: 40, percent: 25.7, color: '#ff7d00' }
            ]
          };
        },
        computed: {
          activeTeachersCount() {
            if (window.PendingCourseMockData && window.PendingCourseMockData.teachers) {
              return window.PendingCourseMockData.teachers.length;
            }
            return 32;
          },
          topTeachers() {
            if (window.PendingCourseMockData && window.PendingCourseMockData.teachers) {
              var list = window.PendingCourseMockData.teachers.slice(0, 5);
              var hours = [18.0, 17.2, 14.3, 12.5, 10.8];
              return list.map(function (t, i) {
                return {
                  id: t.id,
                  name: t.name,
                  department: t.department,
                  title: t.title,
                  hours: hours[i] || 8.0
                };
              });
            }
            return [];
          },
          studentProgress() {
            if (window.PendingCourseMockData && window.PendingCourseMockData.studentGroups) {
              return window.PendingCourseMockData.studentGroups.map(function (g) {
                var percent = Math.round((g.done / g.plan) * 100);
                var color = '#165dff';
                if (g.tone === 'cyan') color = '#14c9c9';
                if (g.tone === 'purple') color = '#722ed1';
                if (g.tone === 'minor') color = '#86909c';
                return {
                  id: g.id,
                  name: g.name,
                  short: g.short,
                  tone: g.tone,
                  total: g.total,
                  plan: g.plan,
                  done: g.done,
                  undone: g.undone,
                  percent: percent,
                  color: color
                };
              });
            }
            return [];
          },
          topCourses() {
            if (window.PendingCourseMockData && window.PendingCourseMockData.courses) {
              return window.PendingCourseMockData.courses.slice(0, 5).map(function (c) {
                return {
                  id: c.id,
                  name: c.name,
                  base: c.base,
                  department: c.department,
                  ratio: c.teacherStudentRatio || '1:4~6',
                  capacity: c.capacity,
                  sessions: c.sessions * 4
                };
              });
            }
            return [];
          },
          // Reused Scheduling Data from window.PendingCourseMockData
          reusedStudentTypeChart() {
            return [
              { label: '住1', value: 47, display: '12门', color: '#165DFF' },
              { label: '住2', value: 42, display: '10门', color: '#14C9C9' },
              { label: '住3', value: 39, display: '3门', color: '#722ED1' },
              { label: '本科', value: 12, display: '1门', color: '#ff7d00' },
              { label: '外院', value: 8, display: '1门', color: '#86909c' }
            ];
          },
          reusedBaseChart() {
            return [
              { label: '通识教研', value: 36, display: '14门', color: '#00b42a' },
              { label: '儿外基地', value: 24, display: '7门', color: '#ff7d00' },
              { label: '儿科基地', value: 40, display: '4门', color: '#165DFF' }
            ];
          },
          reusedPediatricsChart() {
            return [
              { label: '呼吸科', value: 8, display: '2门' },
              { label: '消化科', value: 10, display: '1门' },
              { label: '神经内科', value: 11, display: '1门' },
              { label: '心内科', value: 8, display: '0门' }
            ];
          },
          reusedSurgeryChart() {
            return [
              { label: '普外科', value: 8, display: '1门' },
              { label: '骨科', value: 7, display: '1门' },
              { label: '泌尿外科', value: 9, display: '1门' },
              { label: '胸外科', value: 7, display: '2门' }
            ];
          },
          schedulingSummary() {
            if (window.PendingCourseMockData && window.PendingCourseMockData.courses) {
              var coursesCount = window.PendingCourseMockData.courses.length;
              var studentsCount = window.PendingCourseMockData.courses.reduce(function (sum, c) {
                return sum + c.total;
              }, 0);
              return {
                totalCourses: coursesCount,
                totalStudents: studentsCount
              };
            }
            return { totalCourses: 27, totalStudents: 142 };
          },
          // Reused Material Data
          reusedInventoryMix() {
            return [
              { name: '模型', count: 62, percent: 44, type: 'model', breakdown: [{ name: '基础模型', value: 30 }, { name: '高端模型', value: 32 }] },
              { name: '医疗设备', count: 28, percent: 20, type: 'medical', breakdown: [{ name: '小型器械', value: 16 }, { name: '大型设备', value: 12 }] },
              { name: '耗材', count: 34, percent: 24, type: 'consumable', breakdown: [{ name: '回收耗材', value: 14 }, { name: '一次耗材', value: 20 }] },
              { name: '其他设备', count: 18, percent: 12, type: 'device', breakdown: [{ name: '多媒体型', value: 10 }, { name: '其他型号', value: 8 }] },
            ];
          },
          reusedTodos() {
            return [
              { rank: 1, title: '婴儿 CPR 模型等待报修', desc: '归还核对发现胸廓回弹异常。', source: '等待报修', color: '#ff7d00', time: '10:40' },
              { rank: 2, title: '急救护理综合实训课程准备', desc: '3F·302 教室，CPR 模型、按压反馈系统。', source: '课程准备', color: '#165dff', time: '今天 14:00' },
              { rank: 3, title: '腹腔镜训练系统逾期未还', desc: '张医生借用超期1天。', source: '逾期未还', color: '#f53f3f', time: '逾期 1 天' },
              { rank: 4, title: '月度盘点出现位置异常', desc: '便携式超声扫码位置与档案库位不一致。', source: '盘点异常', color: '#722ed1', time: '待确认' },
            ];
          },
          // Reused Space Data
          reusedRooms() {
            if (window.SpaceData && window.SpaceData.ROOMS) {
              return window.SpaceData.ROOMS;
            }
            return [];
          },
          totalRooms() {
            return this.reusedRooms.length || 17;
          }
        },
        mounted() {
          this.updateTime();
          this.timer = setInterval(this.updateTime, 1000);
        },
        beforeUnmount() {
          clearInterval(this.timer);
        },
        methods: {
          getIcon(name) {
            return (window.RoleNav && window.RoleNav.icons && window.RoleNav.icons[name]) || '';
          },
          updateTime() {
            const now = new Date();
            const dateStr = now.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
            const timeStr = now.toTimeString().split(' ')[0];
            this.currentTime = `${dateStr} ${timeStr}`;
          },
          reloadData() {
            this.updateTime();
            window.ArcoVue?.Message?.success?.('数据刷新成功，已同步最新排课管理、物资流转与空间预约数据');
          }
        }
      });

      app.use(window.ArcoVue);
      vueApp = app;
      vueApp.mount('#admin-dashboard-screen-app');
    });
  }

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
}());
