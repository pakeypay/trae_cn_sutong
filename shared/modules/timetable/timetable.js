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
    if (document.getElementById('tt-module-css')) return;
    var link = document.createElement('link');
    link.id = 'tt-module-css';
    link.rel = 'stylesheet';
    link.href = (document.querySelector('script[src$="timetable.js"]') || {}).src
      .replace(/timetable\.js$/, 'timetable.css');
    document.head.appendChild(link);
  }

  function shouldHandle() {
    var active = document.body.dataset.active;
    return active === '我的课表' || active === '年度课表';
  }

  function renderShell() {
    injectCSS();
    var content = document.querySelector('.content');
    if (!content || !shouldHandle()) {
      if (vueApp) { try { vueApp.unmount(); } catch (e) {} vueApp = null; }
      return;
    }

    content.innerHTML = '<div id="timetable-app"></div>';

    waitForVue(function () {
      var app = Vue.createApp({
        template: `
          <div class="timetable-container">
            <!-- Breadcrumbs -->
            <a-breadcrumb style="margin-bottom: 16px;">
              <a-breadcrumb-item>首页</a-breadcrumb-item>
              <a-breadcrumb-item>{{ activePage === '我的课表' ? '我的课程' : '排课管理' }}</a-breadcrumb-item>
              <a-breadcrumb-item>{{ activePage }}</a-breadcrumb-item>
            </a-breadcrumb>

            <!-- Title & Top controls -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
              <div>
                <h1 style="font-size: 20px; font-weight: 700; color: #1d2129; margin: 0; display: flex; align-items: center; gap: 8px;">
                  <span v-html="getIcon('calendar')" class="text-primary" style="display:inline-flex;"></span> {{ activePage }}
                </h1>
                <p style="font-size: 13px; color: #86909c; margin: 4px 0 0;">
                  {{ activePage === '我的课表' ? '查看您担任负责人及讲师的教学课程日程安排。' : '全院临床技能培训年度可视化课表，监控各月份排课热度与质量控制统计指标。' }}
                </p>
              </div>

              <!-- Interactive Role Switcher for Timetable (ONLY in Teacher mode for testing) -->
              <div v-if="activePage === '我的课表'" style="display: flex; align-items: center; gap: 12px; background:#fff; padding:6px 12px; border:1px solid #e5e6eb; border-radius:6px; box-shadow:0 2px 6px rgba(0,0,0,0.015);">
                <span style="font-size:12px; color:#4e5969; font-weight:600;"><span v-html="getIcon('userShield')" style="display:inline-flex;margin-right:4px;"></span> 测试角色身份：</span>
                <a-radio-group v-model="teacherRoleType" type="button" size="small">
                  <a-radio value="instructor">授课讲师 (支持调课)</a-radio>
                  <a-radio value="assistant">助教老师 (禁止调课)</a-radio>
                </a-radio-group>
              </div>
            </div>

            <!-- Annual Statistics KPI Cards (For Admin Annual Calendar) -->
            <a-row v-if="activePage === '年度课表'" :gutter="16" style="margin-bottom: 24px;">
              <a-col :span="6" v-for="m in annualMetrics" :key="m.label">
                <div class="kpi-stat-card" style="background:#fff; border-radius:8px; padding:18px; border:1px solid #e5e6eb; display:flex; align-items:center; justify-content:space-between; box-shadow:0 4px 10px rgba(0,0,0,0.015); border-left:4px solid #175898;">
                  <div>
                    <div style="font-size:12px; color:#86909c;">{{ m.label }}</div>
                    <div style="font-size:24px; font-weight:700; color:#1d2129; margin-top:4px;">{{ m.value }}</div>
                  </div>
                  <div style="width:40px; height:40px; border-radius:50%; background:#f0f5ff; color:#175898; display:grid; place-items:center;">
                    <span v-html="getIcon(m.icon)" style="display:inline-flex;width:18px;height:18px;"></span>
                  </div>
                </div>
              </a-col>
            </a-row>

            <!-- Filters Bar & View Tab Switches -->
            <div style="background:#fff; border-radius:8px; border: 1px solid #e5e6eb; box-shadow: 0 4px 14px rgba(0,0,0,0.02); padding: 18px; margin-bottom: 20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
              <!-- Left side filters -->
              <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
                <span style="font-size:13px; color:#4e5969; font-weight:bold;">课表控制：</span>
                <a-select v-model="filterYear" placeholder="2026年" style="width:100px;" size="small">
                  <a-option>2026年</a-option>
                  <a-option>2025年</a-option>
                </a-select>
                <a-select v-if="activePage === '年度课表'" v-model="adminFilterDept" placeholder="全部老师" style="width:120px;" size="small">
                  <a-option>全部老师</a-option>
                  <a-option>刘国强</a-option>
                  <a-option>陆国平</a-option>
                  <a-option>蔡小芳</a-option>
                </a-select>
                <a-select v-model="filterStatus" placeholder="全部状态" style="width:120px;" size="small">
                  <a-option>全部状态</a-option>
                  <a-option>进行中</a-option>
                  <a-option>待开课</a-option>
                </a-select>
              </div>

              <!-- Month Navigator (Only when month view is active) -->
              <div v-if="currentView === 'month'" style="display:flex; align-items:center; gap:8px;">
                <a-button size="small" type="text" @click="prevMonth"><span v-html="getIcon('chevronLeft')" style="display:inline-flex;"></span></a-button>
                <span style="font-weight:bold; font-size:14px; color:#1d2129;">{{ currentMonthText }}</span>
                <a-button size="small" type="text" @click="nextMonth"><span v-html="getIcon('chevronRight')" style="display:inline-flex;"></span></a-button>
              </div>

              <!-- Right side Three-Way View Switches -->
              <a-radio-group v-model="currentView" type="button" size="medium">
                <a-radio value="list">课表</a-radio>
                <a-radio value="month">月历</a-radio>
                <a-radio value="year">年历</a-radio>
              </a-radio-group>
            </div>

            <!-- ================= VIEW 1: AGENDA LIST VIEW (课表) ================= -->
            <div v-if="currentView === 'list'" style="background:#fff; border-radius:8px; border: 1px solid #e5e6eb; box-shadow: 0 4px 14px rgba(0,0,0,0.02); padding: 20px;">
              <div style="display:flex; flex-direction:column; gap:10px;">
                <div v-for="t in filteredTimetables" :key="t.id" class="agenda-list-item">
                  <div style="display:flex; align-items:center; gap:20px; flex:1; min-width:0;">
                    <div class="time-badge" style="flex-shrink:0;">
                      <span v-html="getIcon('clock')" style="display:inline-flex;"></span> {{ t.date }} {{ t.time }}
                    </div>
                    <div style="flex:1; min-width:0;">
                      <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:4px;">
                        <strong style="font-size:15px; color:#1d2129;">{{ t.name }}</strong>
                        <a-tag size="small" color="arcoblue">{{ t.type }}</a-tag>
                        <a-tag size="small" color="green">{{ t.venue }}</a-tag>
                        <a-tag v-if="t.hasPendingAdjustment" color="gold"><span v-html="getIcon('hourglassHalf')" style="display:inline-flex;margin-right:4px;"></span> 调课申请审批中</a-tag>
                      </div>
                      <div style="font-size:12px; color:#86909c;">
                        <span><span v-html="getIcon('usersClass')" style="display:inline-flex;margin-right:4px;"></span> 授课班级：{{ t.classes }}</span>
                        <span style="margin-left:16px;"><span v-html="getIcon('userTie')" style="display:inline-flex;margin-right:4px;"></span> 讲师：{{ t.lecturer }}</span>
                        <span style="margin-left:16px;"><span v-html="getIcon('stethoscope')" style="display:inline-flex;margin-right:4px;"></span> 科室：{{ t.dept }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div style="flex-shrink:0; margin-left:16px;">
                    <a-button v-if="teacherRoleType === 'instructor' || activePage === '年度课表'" type="outline" size="small" class="btn-change-timetable" @click="initiateAdjustment(t)">
                      <template #icon><span v-html="getIcon('exchange')" style="display:inline-flex;"></span></template>
                      申请调课
                    </a-button>
                    
                    <a-popover v-else trigger="hover" position="top">
                      <a-button type="outline" size="small" disabled class="assistant-disabled-tip" style="color:#c9cdd4; border-color:#e5e6eb;">
                        <template #icon><span v-html="getIcon('exchange')" style="display:inline-flex;"></span></template>
                        申请调课
                      </a-button>
                      <template #content>
                        <div style="color:#f53f3f; font-size:12px; font-weight:bold; display:flex; align-items:center; gap:6px;">
                          <span v-html="getIcon('alertTriangle')" style="display:inline-flex;"></span>
                          <span>助教角色暂不支持发起调课</span>
                        </div>
                      </template>
                    </a-popover>
                  </div>
                </div>
              </div>
            </div>

            <!-- ================= VIEW 2: MONTHLY CALENDAR VIEW (月历) ================= -->
            <div v-if="currentView === 'month'" class="monthly-calendar-wrapper">
              <div class="monthly-calendar-header-week">
                <span>周日</span><span>周一</span><span>周二</span><span>周三</span><span>周四</span><span>周五</span><span>周六</span>
              </div>
              <div class="monthly-calendar-grid-cells">
                <!-- empty offset cells (e.g. November 2026 starts on Sunday, 0 offsets) -->
                <div v-for="cell in monthCells" :key="cell.id" :class="['monthly-calendar-cell', { 'other-month': cell.isOther }]">
                  <div class="monthly-cell-number">{{ cell.day }}</div>
                  
                  <!-- Class Blocks inside cell -->
                  <div v-for="c in cell.classes" :key="c.id" 
                    :class="['monthly-class-block', getMonthlyClassColor(c)]"
                    @click="handleClassBlockClick(c)">
                    <div style="font-weight:bold; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">{{ c.name }}</div>
                    <div style="font-size:9.5px; opacity:0.8; margin-top:2px;">{{ c.time }} · {{ c.lecturer }}</div>
                    <div v-if="c.hasPendingAdjustment" style="font-size:9px; color:#ff7d00; font-weight:bold; margin-top:2px;"><span v-html="getIcon('hourglassHalf')" style="display:inline-flex;"></span> 调课中</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ================= VIEW 3: ANNUAL CALENDAR VIEW (年历) ================= -->
            <div v-if="currentView === 'year'">
              <div class="annual-grid">
                <div v-for="month in monthsData" :key="month.name" class="month-block">
                  <div class="month-title">{{ month.name }}月</div>
                  <div class="calendar-days-header-year">
                    <span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span><span>日</span>
                  </div>
                  <div class="calendar-cells-grid-year">
                    <!-- offset empty cells -->
                    <div v-for="offset in month.offset" :key="'offset-' + offset" class="calendar-cell-year level-empty"></div>
                    <!-- active day cells -->
                    <div v-for="day in month.days" :key="day.num"
                      :class="'calendar-cell-year level-' + getHeatmapLevel(day.classesCount)"
                      @click="drillDownDate(month.name, day)">
                      {{ day.num }}
                      <span v-if="day.classesCount > 0" class="cell-dot-indicator"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ================= Drawer: Timetable Adjustment Drawer ================= -->
            <a-drawer :visible="adjustmentDrawerVisible" @cancel="adjustmentDrawerVisible = false" width="560px" title="申请调课 / 教学安排调整" @ok="submitAdjustment">
              <a-form :model="adjForm" layout="vertical" v-if="activeTimetableTarget">
                <div style="background:#f0f5ff; color:#175898; border-radius:6px; padding:12px; margin-bottom:20px; font-size:12.5px;">
                  <div style="font-weight:bold; margin-bottom:4px;"><span v-html="getIcon('infoCircle')" style="display:inline-flex;margin-right:4px;"></span> 当前上课安排信息：</div>
                  <div><strong>课程名称：</strong> {{ activeTimetableTarget.name }}</div>
                  <div><strong>原定时间：</strong> {{ activeTimetableTarget.date }} {{ activeTimetableTarget.time }}</div>
                  <div><strong>教学场地：</strong> {{ activeTimetableTarget.venue }}</div>
                </div>

                <a-form-item label="期望调整至新日期" required>
                  <a-date-picker v-model="adjForm.newDate" style="width:100%;" />
                </a-form-item>

                <a-form-item label="期望调整至新时段" required>
                  <a-select v-model="adjForm.newTime">
                    <a-option>08:30 - 11:30 (上午段)</a-option>
                    <a-option>14:00 - 16:30 (下午段)</a-option>
                    <a-option>17:30 - 19:45 (晚段)</a-option>
                  </a-select>
                </a-form-item>

                <a-form-item label="调课原因申请说明" required>
                  <a-textarea v-model="adjForm.reason" placeholder="请输入调课原因，如: 门诊/手术冲突、学术会议交流等..." :auto-size="{ minRows:3, maxRows:6 }" />
                </a-form-item>

                <a-form-item label="指定代理带教讲师 (选填)">
                  <a-input v-model="adjForm.altTeacher" placeholder="请输入代课老师的姓名及工号..." />
                </a-form-item>

                <div style="background:#fffbe6; color:#fa8c16; border:1px solid #ffe58f; font-size:12px; border-radius:6px; padding:12px; display:flex; align-items:flex-start; gap:8px;">
                  <span v-html="getIcon('alertCircle')" style="margin-top:2px; display:inline-flex;"></span>
                  <span>调课申请提交后，调课通知将即时流转至排课管理员进行冲突检索与二次调配，审批结果将通过企业微信及时推送。</span>
                </div>
              </a-form>
            </a-drawer>

            <!-- ================= Modal: Date Drill Down Details Modal ================= -->
            <a-modal v-model:visible="drillDownVisible" :title="drillDownTitle" width="620px" :footer="false">
              <div style="max-height:400px; overflow-y:auto;">
                <div style="font-size:12px; color:#86909c; margin-bottom:14px;">当天共排有 {{ drillDownClasses.length }} 场教学课程安排：</div>
                
                <div style="display:flex; flex-direction:column; gap:10px;">
                  <div v-for="c in drillDownClasses" :key="c.id" style="border:1px solid #e5e6eb; border-radius:6px; padding:12px 14px; background:#fafbfc; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                      <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
                        <strong style="font-size:14px; color:#1d2129;">{{ c.name }}</strong>
                        <a-tag size="small" color="arcoblue">{{ c.format }}</a-tag>
                        <a-tag size="small" color="green">{{ c.venue }}</a-tag>
                      </div>
                      <div style="font-size:12px; color:#86909c;">
                        <span><span v-html="getIcon('clock')" style="display:inline-flex;"></span> {{ c.time }}</span>
                        <span style="margin-left:14px;"><span v-html="getIcon('userTie')" style="display:inline-flex;"></span> 讲师：{{ c.lecturer }}</span>
                      </div>
                    </div>
                    
                    <a-button v-if="teacherRoleType === 'instructor' || activePage === '年度课表'" type="outline" size="small" @click="drillDownChange(c)">
                      申请调课
                    </a-button>
                  </div>
                </div>
              </div>
            </a-modal>
          </div>
        `,
        setup: function () {
          var activePage = Vue.ref(document.body.dataset.active);
          var searchKeyword = Vue.ref('');
          var teacherRoleType = Vue.ref('instructor'); // Testing switcher

          // View Switching State
          var currentView = Vue.ref('month'); // Defaults to 'month' for beautiful visual impact!
          var currentMonthText = Vue.ref('2026年11月');
          var filterYear = Vue.ref(null);
          var filterStatus = Vue.ref(null);
          var adminFilterDept = Vue.ref(null);

          // Drawers & Modals
          var adjustmentDrawerVisible = Vue.ref(false);
          var activeTimetableTarget = Vue.ref(null);
          var adjForm = Vue.reactive({ newDate: '', newTime: '14:00 - 16:30 (下午段)', reason: '', altTeacher: '' });

          var drillDownVisible = Vue.ref(false);
          var drillDownTitle = Vue.ref('');
          var drillDownClasses = Vue.ref([]);

          // KPI metrics
          var annualMetrics = [
            { label: '本年度累计排课频次', value: '1,428 次课', icon: 'calendarCheck' },
            { label: '已发布课次率', value: '92.4%', icon: 'tasks' },
            { label: '变更申请率', value: '3.6%', icon: 'exchange' },
            { label: '教室平均空闲率', value: '21.5%', icon: 'trendingUp' }
          ];

          // Timetables master mock list
          var timetablesList = Vue.ref([
            { id: '1', name: '儿童导尿术（男性）', type: '临床技术性技能课程', venue: '模拟病房 802', date: '2026-11-03', time: '14:00 - 16:30', classes: '住培一年级 · 普外班', lecturer: '刘国强', dept: '儿内科', hasPendingAdjustment: false, colorClass: 'monthly-class-blue' },
            { id: '2', name: '胃管置入', type: '临床技术性技能课程', venue: '模拟病房 801', date: '2026-11-06', time: '17:30 - 19:45', classes: '住培一年级', lecturer: '李芳', dept: '重症医学科', hasPendingAdjustment: false, colorClass: 'monthly-class-blue' },
            { id: '3', name: '骨髓穿刺术', type: '临床技术性技能课程', venue: 'PBL教室 204', date: '2026-11-11', time: '11:30 - 13:45', classes: '专培一年级', lecturer: '张明', dept: '重症医学科', hasPendingAdjustment: false, colorClass: 'monthly-class-green' },
            { id: '4', name: '换药拆线', type: '临床技术性技能课程', venue: 'OSCE考站 3', date: '2026-11-18', time: '11:30 - 13:45', classes: '住培二年级', lecturer: '陈敏', dept: '新生儿诊疗中心', hasPendingAdjustment: false, colorClass: 'monthly-class-purple' },
            { id: '5', name: '心肺复苏理论基础（PALS）', type: '临床技术性技能课程', venue: 'PBL教室 204', date: '2026-11-10', time: '09:00 - 11:30', classes: '专培一年级 · 急诊班', lecturer: '蔡小芳', dept: '重症医学科', hasPendingAdjustment: false, colorClass: 'monthly-class-blue' },
            { id: '6', name: '儿科AHA-PALS团队情境模拟训练', type: '情境模拟课程', venue: '模拟病房 801', date: '2026-11-18', time: '14:00 - 17:00', classes: '专培二年级 · 重症班', lecturer: '张盛鑫', dept: '重症医学科', hasPendingAdjustment: false, colorClass: 'monthly-class-purple' }
          ]);

          var filteredTimetables = Vue.computed(function () {
            return timetablesList.value.filter(function (t) {
              if (searchKeyword.value && t.name.toLowerCase().indexOf(searchKeyword.value.toLowerCase()) === -1) return false;
              return true;
            });
          });

          // Month cells builder for November 2026 (Starts on Sunday, 0 offsets, 30 days)
          var monthCells = Vue.computed(function () {
            var list = [];
            
            // Generate dates for November 2026
            for (var d = 1; d <= 30; d++) {
              var dateStr = '2026-11-' + (d < 10 ? '0' + d : d);
              var classes = timetablesList.value.filter(function (t) { return t.date === dateStr; });
              list.push({
                id: 'cell-' + d,
                day: d,
                isOther: false,
                classes: classes
              });
            }

            // Pad extra cells to make it exactly 35 cell grids
            for (var offset = 1; offset <= 5; offset++) {
              list.push({
                id: 'cell-pad-' + offset,
                day: offset,
                isOther: true,
                classes: []
              });
            }
            return list;
          });

          // Annual month blocks
          var monthsData = Vue.ref([]);

          function generateAnnualData() {
            var mNames = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
            var offsets = [3, 6, 6, 2, 4, 0, 2, 5, 1, 3, 6, 1];
            var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

            var list = [];
            for (var mIdx = 0; mIdx < 12; mIdx++) {
              var days = [];
              var daysCount = daysInMonth[mIdx];
              for (var d = 1; d <= daysCount; d++) {
                var classesCount = 0;
                var baseWeight = Math.random();
                if (baseWeight > 0.9) classesCount = Math.floor(Math.random() * 4) + 8;
                else if (baseWeight > 0.75) classesCount = Math.floor(Math.random() * 3) + 6;
                else if (baseWeight > 0.5) classesCount = Math.floor(Math.random() * 3) + 3;
                else if (baseWeight > 0.3) classesCount = Math.floor(Math.random() * 2) + 1;

                days.push({
                  num: d,
                  classesCount: classesCount
                });
              }

              list.push({
                name: mNames[mIdx],
                offset: offsets[mIdx],
                days: days
              });
            }
            monthsData.value = list;
          }

          function getHeatmapLevel(count) {
            if (count === 0) return 'empty';
            if (count <= 2) return '1';
            if (count <= 5) return '2';
            if (count <= 8) return '3';
            return '4';
          }

          function getMonthlyClassColor(c) {
            return c.colorClass || 'monthly-class-blue';
          }

          function handleClassBlockClick(c) {
            initiateAdjustment(c);
          }

          function initiateAdjustment(c) {
            activeTimetableTarget.value = c;
            adjForm.newDate = '';
            adjForm.newTime = '14:00 - 16:30 (下午段)';
            adjForm.reason = '';
            adjForm.altTeacher = '';
            adjustmentDrawerVisible.value = true;
          }

          function submitAdjustment() {
            if (!adjForm.newDate) { ArcoVue.Message.warning('请选择期望调整的新上课日期'); return; }
            if (!adjForm.reason) { ArcoVue.Message.warning('请填写调课变更原因申请说明'); return; }

            if (activeTimetableTarget.value) {
              activeTimetableTarget.value.hasPendingAdjustment = true;
            }
            adjustmentDrawerVisible.value = false;
            ArcoVue.Message.success('您的调课安排变更申请已成功流转排课专员，系统已更新课表状态！');
          }

          // Drill down month calendar days
          function drillDownDate(monthName, day) {
            if (day.classesCount === 0) {
              ArcoVue.Message.info(monthName + '月' + day.num + '日 当天无排课教学安排。');
              return;
            }

            drillDownTitle.value = '2026年' + monthName + '月' + day.num + '日 已排教学大纲';
            
            var mocked = [];
            var courseNames = ['儿童导尿术（男性）', '心肺复苏理论基础（PALS）', '儿科AHA-PALS团队情境模拟训练', '胃管置入术培训', '缝合打结实训', '骨穿操作技能实训'];
            var formats = ['理论授课', '技能实操', '线上训练', '随堂考核'];
            var lecturers = ['刘国强', '李芳', '张明', '陈敏', '陆国平', '蔡小芳'];
            var rooms = ['模拟病房 801', '模拟病房 802', 'PBL教室 204', 'OSCE考站 3', '腔镜实训室 401'];

            for (var i = 0; i < day.classesCount; i++) {
              mocked.push({
                id: 'mock-' + i,
                name: courseNames[i % courseNames.length],
                format: formats[i % formats.length],
                time: (9 + (i % 3) * 3) + ':00 - ' + (11 + (i % 3) * 3) + ':30',
                lecturer: lecturers[i % lecturers.length],
                venue: rooms[i % rooms.length],
                date: '2026-11-20'
              });
            }

            drillDownClasses.value = mocked;
            drillDownVisible.value = true;
          }

          function drillDownChange(c) {
            drillDownVisible.value = false;
            initiateAdjustment(c);
          }

          // Month navigation
          function prevMonth() {
            ArcoVue.Message.info('载入上月 (2026年10月) 个人课表大图...');
          }
          function nextMonth() {
            ArcoVue.Message.info('载入下月 (2026年12月) 个人课表大图...');
          }

          generateAnnualData();

          function getIcon(name) {
            return (window.RoleNav && window.RoleNav.icons && window.RoleNav.icons[name]) || '';
          }

          return {
            getIcon: getIcon,
            activePage: activePage,
            searchKeyword: searchKeyword,
            teacherRoleType: teacherRoleType,
            currentView: currentView,
            currentMonthText: currentMonthText,
            filterYear: filterYear,
            filterStatus: filterStatus,
            adminFilterDept: adminFilterDept,
            adjustmentDrawerVisible: adjustmentDrawerVisible,
            activeTimetableTarget: activeTimetableTarget,
            adjForm: adjForm,
            drillDownVisible: drillDownVisible,
            drillDownTitle: drillDownTitle,
            drillDownClasses: drillDownClasses,
            annualMetrics: annualMetrics,
            filteredTimetables: filteredTimetables,
            monthCells: monthCells,
            monthsData: monthsData,
            getHeatmapLevel: getHeatmapLevel,
            getMonthlyClassColor: getMonthlyClassColor,
            handleClassBlockClick: handleClassBlockClick,
            initiateAdjustment: initiateAdjustment,
            submitAdjustment: submitAdjustment,
            drillDownDate: drillDownDate,
            drillDownChange: drillDownChange,
            prevMonth: prevMonth,
            nextMonth: nextMonth
          };
        }
      });

      app.use(window.ArcoVue);
      vueApp = app;
      vueApp.mount('#timetable-app');
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
