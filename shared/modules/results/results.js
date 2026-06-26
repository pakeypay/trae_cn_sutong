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
    if (document.getElementById('results-module-css')) return;
    var link = document.createElement('link');
    link.id = 'results-module-css';
    link.rel = 'stylesheet';
    link.href = (document.querySelector('script[src$="results.js"]') || {}).src
      .replace(/results\.js$/, 'results.css');
    document.head.appendChild(link);
  }

  function shouldHandle() {
    var role = document.body.dataset.role;
    var active = document.body.dataset.active;
    var teacherPages = ['我的成果', '成果申报', '我的学员画像', '我的画像'];
    var studentPages = ['我的成果', '成果申报', '我的证书', '我的画像'];
    return (role === 'teacher' && teacherPages.indexOf(active) !== -1) ||
      (role === 'student' && studentPages.indexOf(active) !== -1);
  }

  function renderShell() {
    injectCSS();
    var content = document.querySelector('.content');
    if (!content || !shouldHandle()) {
      if (vueApp) { try { vueApp.unmount(); } catch (e) {} vueApp = null; }
      return;
    }

    if (vueApp) { try { vueApp.unmount(); } catch (e) {} vueApp = null; }
    content.innerHTML = '<div id="results-app"></div>';

    waitForVue(function () {
      var app = Vue.createApp({
        template: `
          <section class="results-wrapper">
            <div class="results-top-toolbar">
              <div class="results-toolbar-title">
                <strong>我的成果</strong>
                <div class="results-tabs" role="tablist" aria-label="成果页面">
                  <button v-for="tab in tabs" :key="tab" type="button" :class="{ active: activePage === tab }" @click="switchPage(tab)">{{ tab }}</button>
                </div>
              </div>
              <label class="results-toolbar-search">
                <i class="fas fa-search"></i>
                <input v-model="searchQuery" type="search" placeholder="搜索成果、学员、能力项...">
              </label>
            </div>

            <div class="results-content-layout">
              <main class="results-main">
                <template v-if="activePage === '成果申报'">
                  <section class="results-section">
                    <div class="results-section-head">
                      <h2>成果申报</h2>
                      <a-button type="primary" size="small" @click="showToast('已进入新建申报流程')">
                        <template #icon><i class="fas fa-plus"></i></template>新建申报
                      </a-button>
                    </div>
                    <div class="results-grid">
                      <article v-for="item in filteredAchievements" :key="item.id" class="result-card-arco">
                        <div class="result-card-icon" :class="item.tone"><i :class="item.icon"></i></div>
                        <div class="result-card-body">
                          <strong>{{ item.title }}</strong>
                          <span>{{ item.type }} · {{ item.year }}</span>
                          <p>{{ item.desc }}</p>
                        </div>
                        <a-tag size="small" :color="item.statusColor">{{ item.status }}</a-tag>
                      </article>
                    </div>
                  </section>
                </template>

                <template v-else-if="activePage === '我的学员画像'">
                  <section class="results-section">
                    <div class="results-section-head">
                      <h2>我的学员画像</h2>
                      <span>按课程、能力项和预警状态查看带教学员。</span>
                    </div>
                    <div class="student-portrait-list">
                      <article v-for="student in filteredStudents" :key="student.name" class="student-portrait-row">
                        <a-avatar :size="40">{{ student.name.charAt(0) }}</a-avatar>
                        <div>
                          <strong>{{ student.name }}</strong>
                          <span>{{ student.grade }} · {{ student.course }}</span>
                        </div>
                        <div class="portrait-bars">
                          <em v-for="item in student.skills" :key="item.label">
                            <span>{{ item.label }}</span>
                            <a-progress :percent="item.value / 100" size="mini" :show-text="false"></a-progress>
                          </em>
                        </div>
                        <a-tag size="small" :color="student.risk ? 'orange' : 'green'">{{ student.risk ? '需关注' : '稳定' }}</a-tag>
                      </article>
                    </div>
                  </section>
                </template>

                <template v-else>
                  <section class="results-section">
                    <div class="results-section-head">
                      <h2>{{ activePage }}</h2>
                      <span>汇总个人成长、能力雷达和阶段性教学成果。</span>
                    </div>
                    <div class="self-portrait-panel">
                      <div class="self-score">
                        <strong>92</strong>
                        <span>综合成长指数</span>
                      </div>
                      <div class="self-metrics">
                        <article v-for="metric in selfMetrics" :key="metric.label">
                          <span>{{ metric.label }}</span>
                          <strong>{{ metric.value }}</strong>
                        </article>
                      </div>
                    </div>
                  </section>
                </template>
              </main>

              <aside class="results-overview-panel">
                <section>
                  <h3>概览区</h3>
                  <div class="overview-stat">
                    <span>待处理</span>
                    <strong>{{ pendingCount }}</strong>
                  </div>
                  <div class="overview-stat">
                    <span>已归档</span>
                    <strong>12</strong>
                  </div>
                </section>
                <section>
                  <h3>快速定位</h3>
                  <button v-for="item in overviewLinks" :key="item.label" type="button" @click="switchPage(item.page)">
                    <span>{{ item.label }}</span>
                    <i class="fas fa-chevron-right"></i>
                  </button>
                </section>
              </aside>
            </div>
          </section>
        `,
        data: function () {
          var active = document.body.dataset.active || '成果申报';
          var role = document.body.dataset.role;
          var tabs = role === 'student' ? ['成果申报', '我的证书', '我的画像'] : ['成果申报', '我的学员画像', '我的画像'];
          if (active === '我的成果' || tabs.indexOf(active) === -1) active = tabs[0];
          return {
            activePage: active,
            tabs: tabs,
            searchQuery: '',
            achievements: [
              { id: 1, title: '儿童导尿术标准化课程建设', type: '教学改革', year: '2026', status: '待完善', statusColor: 'orange', tone: 'blue', icon: 'fas fa-book-medical', desc: '课程大纲、评价工具与课后反馈已形成初稿。' },
              { id: 2, title: '儿科急救情境模拟案例库', type: '资源建设', year: '2026', status: '审核通过', statusColor: 'green', tone: 'green', icon: 'fas fa-folder-open', desc: '已沉淀 8 套高频急救情境训练材料。' },
              { id: 3, title: '住培带教优秀案例', type: '教学奖励', year: '2025', status: '已归档', statusColor: 'arcoblue', tone: 'purple', icon: 'fas fa-award', desc: '用于年度教学质量复盘与成果申报。' }
            ],
            students: [
              { name: '林小明', grade: '住培一年级', course: '儿童导尿术（男性）', risk: false, skills: [{ label: '操作', value: 92 }, { label: '沟通', value: 88 }] },
              { name: '王雪', grade: '住培一年级', course: '坏消息告知', risk: false, skills: [{ label: '操作', value: 86 }, { label: '沟通', value: 94 }] },
              { name: '张伟', grade: '专培一年级', course: '梗阻性休克处理', risk: true, skills: [{ label: '操作', value: 68 }, { label: '沟通', value: 73 }] }
            ],
            selfMetrics: [
              { label: '本年度授课', value: '36.5h' },
              { label: '课程建设', value: '6门' },
              { label: '学员反馈', value: '98%' },
              { label: '成果材料', value: '9项' }
            ]
          };
        },
        computed: {
          filteredAchievements: function () {
            var q = this.searchQuery.trim().toLowerCase();
            if (!q) return this.achievements;
            return this.achievements.filter(function (item) {
              return (item.title + item.type + item.year + item.status).toLowerCase().indexOf(q) !== -1;
            });
          },
          filteredStudents: function () {
            var q = this.searchQuery.trim().toLowerCase();
            if (!q) return this.students;
            return this.students.filter(function (item) {
              return (item.name + item.grade + item.course).toLowerCase().indexOf(q) !== -1;
            });
          },
          pendingCount: function () {
            return this.achievements.filter(function (item) { return item.status !== '已归档'; }).length;
          },
          overviewLinks: function () {
            return this.tabs.map(function (tab) {
              return { label: tab, page: tab };
            });
          }
        },
        methods: {
          switchPage: function (page) {
            this.activePage = page;
            if (document.body.dataset.active !== page) document.body.dataset.active = page;
          },
          showToast: function (msg) {
            if (window.ArcoVue && window.ArcoVue.Message) {
              window.ArcoVue.Message.info(msg);
            }
          }
        }
      });

      app.use(window.ArcoVue);
      vueApp = app;
      vueApp.mount('#results-app');
    });
  }

  function boot() {
    renderShell();
    var obs = new MutationObserver(function () { renderShell(); });
    obs.observe(document.body, { attributes: true, attributeFilter: ['data-role', 'data-active'] });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
}());
