(function () {
  var script = document.querySelector('script[src*="scheduled-course-list.js"]');
  var basePath = script ? script.src.substring(0, script.src.lastIndexOf('/') + 1) : '../../shared/modules/scheduled-course-list/';

  function waitForVue(callback) {
    if (window.Vue && window.Vue.createApp) {
      callback();
    } else {
      setTimeout(function () { waitForVue(callback); }, 50);
    }
  }

  function loadModuleCss() {
    if (document.getElementById('scl-module-css')) return;
    var l = document.createElement('link');
    l.id = 'scl-module-css';
    l.rel = 'stylesheet';
    l.href = basePath + 'scheduled-course-list.css';
    document.head.appendChild(l);
  }

  var handledPages = ['已排课表', '已排课程管理'];

  function shouldHandle() {
    return ['admin', 'scheduler'].indexOf(document.body.dataset.role) !== -1 && handledPages.indexOf(document.body.dataset.active) !== -1;
  }

  var appInstance = null;

  var template = `
        <div class="breadcrumb-row">
          <a-breadcrumb class="breadcrumb">
            <a-breadcrumb-item>首页</a-breadcrumb-item>
            <a-breadcrumb-item>教务管理</a-breadcrumb-item>
            <a-breadcrumb-item>排课管理</a-breadcrumb-item>
            <a-breadcrumb-item>已排课程管理</a-breadcrumb-item>
          </a-breadcrumb>
          <div class="breadcrumb-actions">
            <a-button size="small" @click="openExport('leader')"><file-down :size="14"></file-down>导出 / 发送审核</a-button>
            <a-button size="small" type="primary" :disabled="yearConfirmed" @click="confirmYear"><check-circle-2 :size="14"></check-circle-2>{{ yearConfirmed ? '排课已确认' : '确认排课' }}</a-button>
          </div>
        </div>

        <section class="summary-strip p-status-summary">
          <article v-for="card in summaryCards" :key="card.label" :class="['summary-card', card.tone]">
            <span>{{ card.label }}</span>
            <strong>{{ card.value }}</strong>
            <small>{{ card.note }}</small>
          </article>
        </section>

        <section class="management-panel">
          <div class="management-toolbar">
            <div class="left-tools">
              <a-select v-model="selectedYear" size="small" class="year-select">
                <a-option v-for="year in yearOptions" :key="year" :value="year">{{ year }} 年</a-option>
              </a-select>
              <a-select v-model="teacherFilter" size="small" allow-clear placeholder="全部老师" class="teacher-select">
                <a-option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">{{ teacher.name }} · {{ teacher.department }}</a-option>
              </a-select>
              <a-select v-model="statusFilter" size="small" allow-clear placeholder="全部状态" class="status-select">
                <a-option v-for="status in statuses" :key="status" :value="status">{{ status }}</a-option>
              </a-select>
            </div>
            <div class="right-tools">
              <div class="period-control" v-if="viewMode !== '课表'">
                <button type="button" aria-label="上一个月" @click="jumpMonth(-1)">‹</button>
                <strong>{{ calendarTitle }}</strong>
                <button type="button" aria-label="下一个月" @click="jumpMonth(1)">›</button>
              </div>
              <div class="segmented-control" role="tablist" aria-label="视图切换">
                <button v-for="mode in ['课表', '月历', '年历']" :key="mode" type="button" :class="{ active: viewMode === mode }" @click="viewMode = mode">{{ mode }}</button>
              </div>
            </div>
          </div>

          <div class="schedule-table-wrap" v-if="viewMode === '课表'">
            <table class="schedule-table">
              <thead>
                <tr>
                  <th>日期</th>
                  <th>时间</th>
                  <th>课程</th>
                  <th>授课教师</th>
                  <th>教室</th>
                  <th>授课对象</th>
                  <th>确认状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="session in filteredSessions" :key="session.id" @click="openSession(session)">
                  <td><strong>{{ formatDate(session.date) }}</strong><span>{{ weekdayOf(session.date) }}</span></td>
                  <td>{{ session.time }}</td>
                  <td>
                    <div class="course-title-cell">
                      <i :class="['base-dot', session.baseType]"></i>
                      <strong>{{ session.courseName }}</strong>
                    </div>
                  </td>
                  <td>{{ session.teacherNames.join(' / ') }}</td>
                  <td>{{ session.room }}</td>
                  <td>{{ session.targetGroup }}</td>
                  <td><a-tag :color="statusColor(session.status)" size="small">{{ session.status }}</a-tag></td>
                  <td>
                    <button class="link-button" type="button" @click.stop="openSession(session)">修改</button>
                    <button class="link-button" type="button" @click.stop="teacherConfirm(session)">确认</button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-if="!filteredSessions.length" class="empty-state">暂无匹配的已排课程</div>
          </div>

          <div class="calendar-wrap month-calendar" v-else-if="viewMode === '月历'">
            <div class="month-week-head">
              <span v-for="day in calendarWeekdays" :key="day">{{ day }}</span>
            </div>
            <div class="month-grid">
              <div v-for="day in monthCells" :key="day.key" :class="['month-day-cell', { muted: !day.inMonth, today: day.isToday }]">
                <div class="day-number">{{ day.day }}</div>
                <div class="month-events">
                  <button v-for="event in sessionsForDate(day.dateKey).slice(0, 4)" :key="event.id" :class="courseCalendarClass(event)" type="button" @click="openSession(event)">
                    <span v-if="event.trainingYear" class="year-corner">{{ event.trainingYear }}</span>
                    <strong>{{ compactCourseName(event.courseName) }}</strong>
                    <span>{{ event.time }} · {{ event.teacherNames[0] }}</span>
                  </button>
                  <button v-if="sessionsForDate(day.dateKey).length > 4" class="more-event" type="button" @click.stop="jumpToDay(day.dateKey)">+{{ sessionsForDate(day.dateKey).length - 4 }} 更多</button>
                </div>
              </div>
            </div>
          </div>

          <div class="calendar-wrap year-calendar" v-else>
            <div class="year-calendar-months">
              <section v-for="month in yearMonths" :key="month.key" class="year-calendar-month">
                <div class="year-calendar-month-label">{{ month.month }}月（{{ month.count }}课次）</div>
                <div class="year-calendar-weekrow">
                  <span v-for="d in ['一','二','三','四','五','六','日']" :key="d">{{ d }}</span>
                </div>
                <div class="year-calendar-grid">
                  <div
                    v-for="day in month.days"
                    :key="day.key"
                    :class="['year-calendar-cell', { empty: day.empty, 'has-ev': day.count > 0 }]"
                  >
                    <span class="year-calendar-day-num" v-if="!day.empty">{{ day.day }}</span>
                    <template v-if="!day.empty && day.events && day.events.length">
                      <span
                        v-for="ev in day.events"
                        :key="ev.id"
                        :class="['year-calendar-chip', ev.baseType]"
                        @click="jumpToDay(day.key)"
                        :title="ev.courseName"
                      >{{ ev.courseName }}</span>
                    </template>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </section>

        <a-drawer v-model:visible="exportVisible" title="导出 / 发送排课确认" width="min(880px, 100vw)" :footer="false" unmount-on-close>
          <div class="export-drawer">
            <div class="export-toolbar">
              <div class="export-toolbar-left">
                <div class="segmented-control" role="tablist" aria-label="导出类型">
                  <button v-for="mode in ['领导审核版', '教师确认版']" :key="mode" type="button" :class="{ active: exportMode === mode }" @click="exportMode = mode">{{ mode }}</button>
                </div>
                <div class="segmented-control view-switch" role="tablist" aria-label="视图切换">
                  <button v-for="m in ['月历', '列表']" :key="m" type="button" :class="{ active: exportView === m }" @click="exportView = m">{{ m }}</button>
                </div>
              </div>
              <div class="export-actions">
                <a-button size="small" @click="printPreview"><printer :size="14"></printer>导出 PDF</a-button>
                <a-button size="small" type="primary" @click="sendPreview"><send :size="14"></send>{{ exportMode === '领导审核版' ? '发送领导审核' : '发送老师确认' }}</a-button>
              </div>
            </div>

            <div class="export-fields" v-if="exportMode === '教师确认版'">
              <label class="export-field">
                <span>确认教师（可多选）</span>
                <a-select v-model="exportTeacherIds" size="small" multiple placeholder="不选则仅作为上下文参考（灰度）" :max-tag-count="3">
                  <a-option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">{{ teacher.name }} · {{ teacher.department }}</a-option>
                </a-select>
              </label>
              <label class="export-field">
                <span>确认截止日期</span>
                <a-date-picker v-model="confirmDeadline" size="small"></a-date-picker>
              </label>
            </div>

            <div class="export-month-bar" v-if="exportView === '月历'">
              <button class="month-nav" type="button" @click="jumpExportMonth(-1)" aria-label="上个月">‹</button>
              <strong>{{ exportCurrentMonthTitle }}<span class="export-month-bar-range">· {{ exportAcademicRange }}</span></strong>
              <button class="month-nav" type="button" @click="jumpExportMonth(1)" aria-label="下个月">›</button>
            </div>

            <div class="preview-shell" :class="{ teacher: exportMode === '教师确认版' }" id="print-area">
              <div class="preview-head">
                <div>
                  <strong>{{ exportMode === '领导审核版' ? (selectedYear + ' 年度课程排课审核表 · ' + exportAcademicRange) : exportHeadTitle }}</strong>
                  <span>{{ exportMode === '领导审核版' ? '完整彩色版本，供领导审核年度课程安排' : exportHeadSubtitle }}</span>
                </div>
                <a-tag :color="exportMode === '领导审核版' ? 'arcoblue' : 'green'" size="small">{{ exportMode }}</a-tag>
              </div>
              <div class="preview-meta">
                <span>年度：{{ selectedYear }}</span>
                <span>课次：{{ exportYearSessions.length }}</span>
                <span v-if="exportMode === '教师确认版'">确认截止：{{ confirmDeadline }}</span>
                <span v-if="exportMode === '教师确认版' && exportTeacherIds.length">高亮教师：{{ selectedExportTeacherNames }}</span>
              </div>

              <div v-if="exportView === '月历'" class="export-academic-scroll" ref="exportScroll" @scroll="onExportScroll">
                <section
                  v-for="m in exportAcademicMonths"
                  :key="m.key"
                  :id="'export-month-' + m.key"
                  :class="['export-academic-month', { active: m.key === exportCurrentMonthKey }]"
                >
                  <header class="export-academic-month-head">
                    <strong>{{ m.label }}</strong>
                    <span>{{ m.count }} 课次</span>
                  </header>
                  <div class="export-month-weekhead">
                    <span v-for="d in exportWeekdays" :key="d">{{ d }}</span>
                  </div>
                  <div class="export-month-grid">
                    <div
                      v-for="cell in m.cells"
                      :key="cell.key"
                      :class="['export-month-cell', { muted: !cell.inMonth, today: cell.isToday }]"
                    >
                      <div class="export-month-day-num">{{ cell.day }}</div>
                      <div class="export-month-events">
                        <div
                          v-for="ev in cell.events"
                          :key="ev.id"
                          :class="['export-month-card', ev.baseType, { highlight: shouldHighlight(ev), changed: ev.status === '变更待确认' }]"
                        >
                          <div class="export-month-card-time">{{ ev.time }}</div>
                          <div class="export-month-card-name">{{ ev.courseName }}</div>
                          <div class="export-month-card-meta">{{ ev.room }} · {{ ev.teacherNames.join(' / ') }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              <div v-else class="preview-list">
                <article
                  v-for="session in exportYearSessions"
                  :key="session.id"
                  :class="['preview-row', session.baseType, { dimmed: shouldDim(session), highlight: shouldHighlight(session), changed: session.status === '变更待确认' }]"
                >
                  <div>
                    <strong>{{ formatDate(session.date) }} {{ weekdayOf(session.date) }} · {{ session.time }}</strong>
                    <span>{{ session.courseName }} · {{ session.room }} · {{ session.targetGroup }}</span>
                  </div>
                  <em>{{ session.teacherNames.join(' / ') }}</em>
                </article>
                <div v-if="!exportYearSessions.length" class="empty-state">该学年暂无已排课程</div>
              </div>
            </div>
          </div>
        </a-drawer>

        <a-drawer v-model:visible="sessionDrawerVisible" title="课次详情 / 发送老师确认" width="min(680px, 100vw)" :footer="false" unmount-on-close>
          <div class="session-confirm-drawer" v-if="editingSession">
            <div class="drawer-summary p-status-summary">
              <div>
                <a-tag :color="statusColor(editingSession.status)" size="small">{{ editingSession.status }}</a-tag>
                <h3>{{ editingSession.courseName }}</h3>
                <span>{{ editingSession.targetGroup }} · {{ editingSession.room }}</span>
              </div>
              <div class="drawer-summary-meta">
                <span>授课日期</span>
                <strong>{{ formatDate(editingSession.date) }}</strong>
                <em>{{ editingSession.time }}</em>
              </div>
            </div>
            <section class="drawer-section">
              <div class="drawer-section-head">
                <div>
                  <strong>课次安排</strong>
                  <span>修改后的安排将同步展示在老师确认单中</span>
                </div>
              </div>
              <a-form :model="editForm" layout="vertical" class="edit-form">
              <a-row :gutter="12">
                <a-col :span="12"><a-form-item label="日期"><a-date-picker v-model="editForm.date"></a-date-picker></a-form-item></a-col>
                <a-col :span="12"><a-form-item label="时间"><a-select v-model="editForm.time"><a-option v-for="slot in timeSlots" :key="slot" :value="slot">{{ slot }}</a-option></a-select></a-form-item></a-col>
                <a-col :span="12"><a-form-item label="授课老师"><a-select v-model="editForm.teacherIds" multiple><a-option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">{{ teacher.name }} · {{ teacher.department }}</a-option></a-select></a-form-item></a-col>
                <a-col :span="12"><a-form-item label="教室"><a-select v-model="editForm.room"><a-option v-for="room in rooms" :key="room" :value="room">{{ room }}</a-option></a-select></a-form-item></a-col>
                <a-col :span="24"><a-form-item label="修改备注"><a-textarea v-model="editForm.remark" placeholder="说明本次调整原因，发送给老师确认时会同步展示" :auto-size="{ minRows: 3, maxRows: 4 }"></a-textarea></a-form-item></a-col>
              </a-row>
              </a-form>
            </section>
            <div class="change-box" v-if="editingSession.changeLog?.length">
              <strong>最近修改记录</strong>
              <p v-for="item in editingSession.changeLog" :key="item.at">{{ item.at }}：{{ item.summary }}</p>
            </div>
            <div class="drawer-actions">
              <a-button @click="sessionDrawerVisible = false">关闭</a-button>
              <a-button @click="saveSessionChange">保存修改</a-button>
              <a-button type="primary" @click="openExport('teacher')">发送老师确认</a-button>
            </div>
          </div>
        </a-drawer>

        <a-drawer v-model:visible="confirmYearDrawerVisible" title="确认排课与开课参数配置" width="min(860px, 100vw)" :footer="false" unmount-on-close>
          <div class="confirm-year-drawer-content" style="padding: 16px; display: flex; flex-direction: column; box-sizing: border-box;">
            <!-- Batch Config Panel -->
            <div style="background: #f7f8fa; border-radius: 8px; padding: 16px; margin-bottom: 20px; border: 1px solid #e5e6eb;">
              <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #1d2129;">批量快速配置</h4>
              <div style="display: flex; flex-direction: column; gap: 12px;">
                <div style="display: flex; align-items: center; gap: 16px; flex-wrap: wrap;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 13px; color: #4e5969;">最低人数:</span>
                    <a-input-number v-model="batchMinEnroll" size="small" style="width: 80px" :min="1"></a-input-number>
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 13px; color: #4e5969;">最多人数:</span>
                    <a-input-number v-model="batchMaxEnroll" size="small" style="width: 80px" :min="1"></a-input-number>
                  </div>
                </div>
                <div style="display: flex; align-items: center; gap: 16px; flex-wrap: wrap; border-top: 1px dashed #e5e6eb; padding-top: 12px;">
                  <span style="font-size: 13px; color: #4e5969;">截止报名时间策略:</span>
                  <a-radio-group v-model="deadlineStrategy" type="button" size="small">
                    <a-radio value="unified">统一截止时间</a-radio>
                    <a-radio value="offset">按课前天数截止</a-radio>
                  </a-radio-group>
                  <div v-if="deadlineStrategy === 'unified'" style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 13px; color: #86909c;">统一截止时间:</span>
                    <a-date-picker v-model="batchDeadlineDate" size="small" show-time format="YYYY-MM-DD HH:mm" style="width: 170px" placeholder="选择截止时间"></a-date-picker>
                  </div>
                  <div v-else style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 13px; color: #86909c;">课前天数:</span>
                    <a-input-number v-model="batchDeadlineOffset" size="small" style="width: 70px" :min="0"></a-input-number>
                    <span style="font-size: 13px; color: #86909c;">天</span>
                  </div>
                  <a-button type="outline" size="small" style="margin-left: auto;" @click="applyBatchConfig">应用到所有课程</a-button>
                </div>
              </div>
            </div>

            <!-- Scrollable Courses Table -->
            <div style="max-height: 400px; overflow-y: auto; border: 1px solid #e5e6eb; border-radius: 8px;">
              <table style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: left;">
                <thead style="background: #f2f3f5; position: sticky; top: 0; z-index: 10;">
                  <tr>
                    <th style="padding: 10px 16px; color: #4e5969; font-weight: 500; border-bottom: 1px solid #e5e6eb;">课程信息</th>
                    <th style="padding: 10px 16px; color: #4e5969; font-weight: 500; border-bottom: 1px solid #e5e6eb;">授课教师与教室</th>
                    <th style="padding: 10px 16px; color: #4e5969; font-weight: 500; border-bottom: 1px solid #e5e6eb; width: 110px;">最低人数</th>
                    <th style="padding: 10px 16px; color: #4e5969; font-weight: 500; border-bottom: 1px solid #e5e6eb; width: 110px;">最多人数</th>
                    <th style="padding: 10px 16px; color: #4e5969; font-weight: 500; border-bottom: 1px solid #e5e6eb; width: 180px;">截止报名时间</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in confirmSessionsList" :key="item.id" style="border-bottom: 1px solid #e5e6eb;">
                    <td style="padding: 12px 16px;">
                      <div style="font-weight: 600; color: #1d2129;">{{ item.courseName }}</div>
                      <div style="font-size: 11px; color: #86909c; margin-top: 2px;">{{ item.date }} {{ item.time }}</div>
                    </td>
                    <td style="padding: 12px 16px; color: #4e5969;">
                      <div>{{ item.teacherNames.join(' / ') }}</div>
                      <div style="font-size: 11.5px; color: #86909c; margin-top: 2px;">{{ item.room }}</div>
                    </td>
                    <td style="padding: 12px 16px;">
                      <a-input-number v-model="item.minEnroll" size="small" :min="1" style="width: 90px"></a-input-number>
                    </td>
                    <td style="padding: 12px 16px;">
                      <a-input-number v-model="item.maxEnroll" size="small" :min="1" style="width: 90px"></a-input-number>
                    </td>
                    <td style="padding: 12px 16px;">
                      <a-date-picker v-model="item.deadline" size="small" show-time format="YYYY-MM-DD HH:mm" style="width: 170px" placeholder="选择截止时间"></a-date-picker>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Footer Actions -->
            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e6eb; display: flex; justify-content: flex-end; gap: 12px;">
              <a-button @click="confirmYearDrawerVisible = false">取消</a-button>
              <a-button type="primary" @click="submitConfirmYear"><check-circle-2 :size="14"></check-circle-2>发布课程并开课</a-button>
            </div>
          </div>
        </a-drawer>
  `;

  function mountApp() {
    waitForVue(function () {
      var Vue = window.Vue;
    var { createApp, h } = Vue;

    var iconDefaults = {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': 2,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'aria-hidden': 'true'
    };

    var icon = function (paths) {
      return {
        props: { size: { type: [Number, String], default: 16 } },
        render: function () {
          var children = paths.map(function (p) {
            var tag = p.tag || 'path';
            var attrs = Object.assign({}, p);
            delete attrs.tag;
            return h(tag, attrs);
          });
          return h('svg', Object.assign({ width: this.size, height: this.size }, iconDefaults), children);
        }
      };
    };

    var Bell = icon([{ d: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9' }, { d: 'M13.7 21a2 2 0 0 1-3.4 0' }]);
    var Settings = icon([{ tag: 'circle', cx: 12, cy: 12, r: 3 }, { d: 'M12 2v3' }, { d: 'M12 19v3' }, { d: 'm4.9 4.9 2.1 2.1' }, { d: 'm17 17 2.1 2.1' }, { d: 'M2 12h3' }, { d: 'M19 12h3' }, { d: 'm4.9 19.1 2.1-2.1' }, { d: 'm17 7 2.1-2.1' }]);
    var Home = icon([{ d: 'm3 11 9-8 9 8' }, { d: 'M5 10v10h14V10' }, { d: 'M9 20v-6h6v6' }]);
    var ChevronDown = icon([{ d: 'm6 9 6 6 6-6' }]);
    var Grid3X3 = icon([{ d: 'M3 3h18v18H3z' }, { d: 'M9 3v18' }, { d: 'M15 3v18' }, { d: 'M3 9h18' }, { d: 'M3 15h18' }]);
    var LayoutDashboard = icon([{ tag: 'rect', x: 3, y: 3, width: 7, height: 9, rx: 1 }, { tag: 'rect', x: 14, y: 3, width: 7, height: 5, rx: 1 }, { tag: 'rect', x: 14, y: 12, width: 7, height: 9, rx: 1 }, { tag: 'rect', x: 3, y: 16, width: 7, height: 5, rx: 1 }]);
    var Send = icon([{ d: 'm22 2-7 20-4-9-9-4Z' }, { d: 'M22 2 11 13' }]);
    var BookOpen = icon([{ d: 'M12 7v14' }, { d: 'M3 5a7 7 0 0 1 9 2 7 7 0 0 1 9-2v14a7 7 0 0 0-9 2 7 7 0 0 0-9-2z' }]);
    var BarChart3 = icon([{ d: 'M3 3v18h18' }, { d: 'M18 17V9' }, { d: 'M13 17V5' }, { d: 'M8 17v-3' }]);
    var Users = icon([{ d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' }, { tag: 'circle', cx: 9, cy: 7, r: 4 }, { d: 'M22 21v-2a4 4 0 0 0-3-3.9' }, { d: 'M16 3.1a4 4 0 0 1 0 7.8' }]);
    var SlidersHorizontal = icon([{ d: 'M21 4h-7' }, { d: 'M10 4H3' }, { tag: 'circle', cx: 12, cy: 4, r: 2 }, { d: 'M21 12h-9' }, { d: 'M8 12H3' }, { tag: 'circle', cx: 10, cy: 12, r: 2 }, { d: 'M21 20h-5' }, { d: 'M12 20H3' }, { tag: 'circle', cx: 14, cy: 20, r: 2 }]);
    var PanelLeftClose = icon([{ tag: 'rect', x: 3, y: 4, width: 18, height: 16, rx: 2 }, { d: 'M9 4v16' }, { d: 'm16 10-2 2 2 2' }]);
    var FileDown = icon([{ d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' }, { d: 'M14 2v6h6' }, { d: 'M12 18v-6' }, { d: 'm9 15 3 3 3-3' }]);
    var CheckCircle2 = icon([{ tag: 'circle', cx: 12, cy: 12, r: 9 }, { d: 'm9 12 2 2 4-5' }]);
    var Printer = icon([{ d: 'M6 9V2h12v7' }, { d: 'M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2' }, { d: 'M6 14h12v8H6z' }]);

    var teachers = [
      { id: 'T001', name: '张明', department: '内科', title: '主任医师' },
      { id: 'T002', name: '李芳', department: '内科', title: '副主任医师' },
      { id: 'T003', name: '王磊', department: '外科', title: '主治医师' },
      { id: 'T004', name: '陈敏', department: '外科', title: '副主任医师' },
      { id: 'T005', name: '赵敏', department: '儿科', title: '主任医师' },
      { id: 'T006', name: '孙强', department: '儿科', title: '主治医师' },
      { id: 'T007', name: '周丽', department: '急诊科', title: '副主任医师' },
      { id: 'T008', name: '吴刚', department: '急诊科', title: '主治医师' }
    ];

    var teacherName = function (id) {
      var found = teachers.find(function (t) { return t.id === id; });
      return found ? found.name : id;
    };

    var seedCourses = [
      ['2026-03-06', '17:30-19:45', '无菌术', 'general', ['T003'], 'R302 技能操作室', '住培第1年 · 12人次', '待领导审核', 1],
      ['2026-03-11', '11:30-13:45', '胸腔穿刺术', 'pediatric', ['T001', 'T002'], 'R301 技能操作室', '住培第2年 · 10人次', '待老师确认', 2],
      ['2026-04-08', '11:30-13:45', '心肺复苏', 'surgery', ['T004'], 'R401 模拟诊室', '住培第3年 · 8人次', '已确认', 3],
      ['2026-04-21', '17:30-19:45', '气管插管', 'general', ['T005'], 'R403 技能操作室', '专培 · 10人次', '待老师确认', null],
      ['2026-05-12', '11:30-13:45', '腰椎穿刺术', 'pediatric', ['T001'], 'R501 模拟ICU', '住培第1年 · 15人次', '已确认', 1],
      ['2026-05-19', '17:30-19:45', '外科缝合', 'surgery', ['T003', 'T004'], 'R502 普通教室', '住培第2年 · 18人次', '待老师确认', 2],
      ['2026-06-03', '11:30-13:45', '动脉血气分析', 'general', ['T007', 'T008'], 'R303 普通教室', '住培第3年 · 20人次', '变更待确认', 3],
      ['2026-06-18', '17:30-19:45', '儿科学基础', 'pediatric', ['T005', 'T006'], 'R402 PBL教室', '本科 · 24人次', '已确认', null],
      ['2026-09-09', '11:30-13:45', '急救技能训练', 'general', ['T007'], 'R501 模拟ICU', '住培第1年 · 12人次', '待领导审核', 1],
      ['2026-09-16', '17:30-19:45', '腹部体格检查', 'pediatric', ['T006'], 'R301 技能操作室', '住培第2年 · 10人次', '待老师确认', 2],
      ['2026-10-14', '11:30-13:45', '导尿术', 'surgery', ['T003'], 'R403 技能操作室', '住培第3年 · 8人次', '已确认', 3],
      ['2026-11-06', '17:30-19:45', '胃管置入', 'general', ['T002'], 'R302 技能操作室', '住培第1年 · 12人次', '待老师确认', 1],
      ['2026-11-11', '11:30-13:45', '骨髓穿刺术', 'pediatric', ['T001'], 'R301 技能操作室', '住培第2年 · 10人次', '已确认', 2],
      ['2026-11-18', '11:30-13:45', '换药拆线', 'surgery', ['T004'], 'R401 模拟诊室', '住培第3年 · 8人次', '已确认', 3],
      ['2026-12-08', '17:30-19:45', '新生儿复苏', 'pediatric', ['T005', 'T006'], 'R501 模拟ICU', '专培 · 15人次', '变更待确认', null],
      ['2026-12-15', '11:30-13:45', '超声引导穿刺', 'general', ['T008'], 'R502 普通教室', '住培第2年 · 18人次', '待老师确认', 2]
    ];

    var sessionsSeed = seedCourses.map(function (item, index) {
      return {
        id: 'S' + String(index + 1).padStart(3, '0'),
        date: item[0],
        time: item[1],
        courseName: item[2],
        baseType: item[3],
        teacherIds: item[4],
        teacherNames: item[4].map(teacherName),
        room: item[5],
        targetGroup: item[6],
        status: item[7],
        trainingYear: item[8],
        confirmations: item[4].map(function (teacherId) {
          return {
            teacherId: teacherId,
            confirmed: item[7] === '已确认',
            confirmedAt: item[7] === '已确认' ? '2026-02-20' : ''
          };
        }),
        changeLog: item[7] === '变更待确认'
          ? [{ at: '2026-02-23', summary: '根据老师门诊时间，将课次调整到晚间开放时段。' }]
          : []
      };
    });

    appInstance = createApp({
      components: {
        Bell: Bell,
        Settings: Settings,
        Home: Home,
        ChevronDown: ChevronDown,
        LayoutDashboard: LayoutDashboard,
        Send: Send,
        BookOpen: BookOpen,
        BarChart3: BarChart3,
        Users: Users,
        SlidersHorizontal: SlidersHorizontal,
        PanelLeftClose: PanelLeftClose,
        FileDown: FileDown,
        CheckCircle2: CheckCircle2,
        Printer: Printer
      },
      data: function () {
        return {
          searchText: '',
          selectedYear: 2026,
          selectedMonthDate: '2026-11-01',
          teacherFilter: '',
          statusFilter: '',
          viewMode: '月历',
          exportVisible: false,
          exportMode: '领导审核版',
          exportView: '月历',
          exportCurrentMonthKey: '2026-09',
          exportTeacherIds: ['T001'],
          confirmDeadline: '2026-03-01',
          sessionDrawerVisible: false,
          editingSession: null,
          editForm: {
            date: '',
            time: '',
            teacherIds: [],
            room: '',
            remark: ''
          },
          yearConfirmed: false,
          confirmYearDrawerVisible: false,
          confirmSessionsList: [],
          batchMinEnroll: 5,
          batchMaxEnroll: 15,
          deadlineStrategy: 'offset',
          batchDeadlineDate: '2026-03-01 10:00',
          batchDeadlineOffset: 3,
          teachers: teachers,
          sessions: sessionsSeed.map(function (session) {
            return Object.assign({}, session, {
              teacherIds: [].concat(session.teacherIds),
              teacherNames: [].concat(session.teacherNames),
              confirmations: session.confirmations.map(function (c) { return Object.assign({}, c); }),
              changeLog: session.changeLog.map(function (cl) { return Object.assign({}, cl); })
            });
          }),
          statuses: ['待领导审核', '待老师确认', '已确认', '变更待确认'],
          yearOptions: [2025, 2026, 2027],
          rooms: ['R301 技能操作室', 'R302 技能操作室', 'R303 普通教室', 'R401 模拟诊室', 'R402 PBL教室', 'R403 技能操作室', 'R501 模拟ICU', 'R502 普通教室'],
          timeSlots: ['09:00-11:30', '11:30-13:45', '13:45-17:30', '17:30-19:45'],
          calendarWeekdays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
        };
      },
      computed: {
        currentMonth: function () {
          return new Date(this.selectedMonthDate + 'T00:00:00');
        },
        calendarTitle: function () {
          if (this.viewMode === '年历') return this.selectedYear + '年';
          var date = this.currentMonth;
          return date.getFullYear() + '年' + (date.getMonth() + 1) + '月';
        },
        filteredSessions: function () {
          var self = this;
          var keyword = this.searchText.trim();
          return this.sessions
            .filter(function (session) {
              return new Date(session.date + 'T00:00:00').getFullYear() === self.selectedYear;
            })
            .filter(function (session) {
              return !self.teacherFilter || session.teacherIds.includes(self.teacherFilter);
            })
            .filter(function (session) {
              return !self.statusFilter || session.status === self.statusFilter;
            })
            .filter(function (session) {
              if (!keyword) return true;
              var matchFields = [session.courseName, session.room, session.targetGroup, session.status].concat(session.teacherNames);
              return matchFields.some(function (value) {
                return value.indexOf(keyword) !== -1;
              });
            })
            .sort(function (a, b) {
              return (a.date + ' ' + a.time).localeCompare(b.date + ' ' + b.time);
            });
        },
        monthCells: function () {
          var base = this.currentMonth;
          var year = base.getFullYear();
          var month = base.getMonth();
          var first = new Date(year, month, 1);
          var start = new Date(first);
          start.setDate(first.getDate() - first.getDay());
          var todayKey = this.dateKey(new Date());
          var self = this;
          return Array.from({ length: 42 }, function (_, index) {
            var date = new Date(start);
            date.setDate(start.getDate() + index);
            var key = self.dateKey(date);
            return {
              key: key,
              dateKey: key,
              day: date.getDate(),
              inMonth: date.getMonth() === month,
              isToday: key === todayKey
            };
          });
        },
        yearMonths: function () {
          var self = this;
          var todayKey = this.dateKey(new Date());
          return Array.from({ length: 12 }, function (_, index) {
            var month = index + 1;
            var daysInMonth = new Date(self.selectedYear, index + 1, 0).getDate();
            var firstDay = new Date(self.selectedYear, index, 1).getDay();
            var mondayOffset = firstDay === 0 ? 6 : firstDay - 1;
            var emptyLeading = Array.from({ length: mondayOffset }, function (_, i) {
              return {
                key: 'empty-' + month + '-' + i,
                empty: true
              };
            });
            var actualDays = Array.from({ length: daysInMonth }, function (_, dayIndex) {
              var key = self.dateKey(new Date(self.selectedYear, index, dayIndex + 1));
              var daySessions = self.sessionsForDate(key);
              return {
                key: key,
                day: dayIndex + 1,
                count: daySessions.length,
                isToday: key === todayKey,
                events: daySessions.map(function (s) {
                  return {
                    id: s.id,
                    courseName: self.compactCourseName(s.courseName),
                    baseType: s.baseType
                  };
                })
              };
            });
            return {
              key: self.selectedYear + '-' + month,
              month: month,
              count: actualDays.reduce(function (sum, day) { return sum + day.count; }, 0),
              days: emptyLeading.concat(actualDays)
            };
          });
        },
        summaryCards: function () {
          var self = this;
          var total = this.sessions.filter(function (session) {
            return new Date(session.date + 'T00:00:00').getFullYear() === self.selectedYear;
          }).length;
          var confirmed = this.sessions.filter(function (session) { return session.status === '已确认'; }).length;
          var teacherPending = this.sessions.filter(function (session) { return session.status === '待老师确认'; }).length;
          var changed = this.sessions.filter(function (session) { return session.status === '变更待确认'; }).length;
          return [
            { label: '年度课次', value: total, note: this.selectedYear + ' 年已排课程', tone: '' },
            { label: '已确认', value: confirmed, note: '可纳入最终课表', tone: 'success' },
            { label: '待老师确认', value: teacherPending, note: '需发送确认表', tone: 'warning' },
            { label: '变更待确认', value: changed, note: '修改后待复核', tone: changed ? 'danger' : '' }
          ];
        },
        canConfirmYear: function () {
          if (this.yearConfirmed) return false;
          return this.sessions.every(function (session) {
            return ['已确认', '待领导审核'].includes(session.status) || session.confirmations.every(function (item) {
              return item.confirmed;
            });
          });
        },
        exportSessions: function () {
          var self = this;
          return this.sessions
            .filter(function (session) {
              return new Date(session.date + 'T00:00:00').getFullYear() === self.selectedYear;
            })
            .sort(function (a, b) {
              return (a.date + ' ' + a.time).localeCompare(b.date + ' ' + b.time);
            });
        },
        exportYearSessions: function () {
          return this.exportSessions;
        },
        exportAcademicMonths: function () {
          var self = this;
          var year = this.selectedYear;
          var startYear = year;
          var months = [];
          for (var i = 0; i < 12; i++) {
            var m = 9 + i;
            var actualYear;
            if (m <= 12) {
              actualYear = startYear;
            } else {
              actualYear = startYear + 1;
              m = m - 12;
            }
            var first = new Date(actualYear, m - 1, 1);
            var start = new Date(first);
            start.setDate(first.getDate() - first.getDay());
            var todayKey = this.dateKey(new Date());
            var key = actualYear + '-' + String(m).padStart(2, '0');
            var count = 0;
            var cells = Array.from({ length: 42 }, function (_, index) {
              var date = new Date(start);
              date.setDate(start.getDate() + index);
              var dk = self.dateKey(date);
              var inMonth = date.getMonth() === (m - 1);
              var events = inMonth
                ? self.exportSessions.filter(function (s) { return s.date === dk; })
                : [];
              count += events.length;
              return {
                key: dk,
                day: date.getDate(),
                inMonth: inMonth,
                isToday: dk === todayKey,
                events: events
              };
            });
            months.push({
              key: key,
              label: actualYear + '年' + m + '月',
              count: count,
              cells: cells
            });
          }
          return months;
        },
        exportAcademicRange: function () {
          var first = this.exportAcademicMonths[0];
          var last = this.exportAcademicMonths[this.exportAcademicMonths.length - 1];
          return first.label + ' — ' + last.label;
        },
        exportCurrentMonthTitle: function () {
          if (!this.exportCurrentMonthKey) return '';
          var parts = this.exportCurrentMonthKey.split('-');
          return parts[0] + '年' + parseInt(parts[1], 10) + '月';
        },
        exportWeekdays: function () {
          return ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        },
        selectedExportTeacherNames: function () {
          var self = this;
          return this.exportTeacherIds
            .map(function (id) {
              var t = self.teachers.find(function (teacher) { return teacher.id === id; });
              return t ? t.name : id;
            })
            .join(' / ');
        },
        exportHeadTitle: function () {
          if (this.exportTeacherIds.length === 0) {
            return '课程确认表 · ' + this.exportAcademicRange;
          }
          if (this.exportTeacherIds.length === 1) {
            var id = this.exportTeacherIds[0];
            var t = this.teachers.find(function (teacher) { return teacher.id === id; });
            return (t ? t.name : '') + ' 老师课程确认表 · ' + this.exportAcademicRange;
          }
          return this.selectedExportTeacherNames + ' 老师课程确认表 · ' + this.exportAcademicRange;
        },
        exportHeadSubtitle: function () {
          if (this.exportTeacherIds.length === 0) {
            return '当前未指定老师，所有课程作为上下文参考（灰度）';
          }
          return '高亮 ' + this.selectedExportTeacherNames + ' 老师相关课程，其余课程作为上下文参考（灰度）';
        }
      },
      methods: {
        dateKey: function (date) {
          var target = date instanceof Date ? date : new Date(date + 'T00:00:00');
          var month = String(target.getMonth() + 1).padStart(2, '0');
          var day = String(target.getDate()).padStart(2, '0');
          return target.getFullYear() + '-' + month + '-' + day;
        },
        formatDate: function (date) {
          var target = new Date(date + 'T00:00:00');
          return (target.getMonth() + 1) + '月' + target.getDate() + '日';
        },
        weekdayOf: function (date) {
          return ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][new Date(date + 'T00:00:00').getDay()];
        },
        jumpMonth: function (offset) {
          if (this.viewMode === '年历') {
            this.selectedYear += offset;
            this.selectedMonthDate = this.selectedYear + '-01-01';
            return;
          }
          var next = new Date(this.currentMonth);
          next.setMonth(next.getMonth() + offset);
          this.selectedYear = next.getFullYear();
          this.selectedMonthDate = this.dateKey(new Date(next.getFullYear(), next.getMonth(), 1));
        },
        jumpToDay: function (key) {
          this.selectedMonthDate = key.slice(0, 7) + '-01';
          this.viewMode = '月历';
        },
        sessionsForDate: function (dateKey) {
          return this.filteredSessions.filter(function (session) { return session.date === dateKey; });
        },
        compactCourseName: function (name) {
          return name.length > 7 ? name.slice(0, 7) + '…' : name;
        },
        courseCalendarClass: function (session) {
          return ['month-course-card', session.baseType, { changed: session.status === '变更待确认' }];
        },
        statusColor: function (status) {
          return {
            '待领导审核': 'arcoblue',
            '待老师确认': 'orange',
            '已确认': 'green',
            '变更待确认': 'red'
          }[status] || 'gray';
        },
        openExport: function (mode) {
          this.exportMode = mode === 'teacher' ? '教师确认版' : '领导审核版';
          if (this.editingSession && this.editingSession.teacherIds && this.editingSession.teacherIds.length) {
            this.exportTeacherIds = [this.editingSession.teacherIds[0]];
          }
          var firstSession = this.exportSessions[0];
          if (firstSession) {
            var key = firstSession.date.slice(0, 7);
            this.exportCurrentMonthKey = key;
          } else {
            this.exportCurrentMonthKey = this.selectedYear + '-09';
          }
          this.sessionDrawerVisible = false;
          this.exportVisible = true;
          var initialKey = this.exportCurrentMonthKey;
          this.$nextTick(function () { this.scrollExportTo(initialKey); }.bind(this));
        },
        printPreview: function () {
          window.ArcoVue.Message.info('已打开浏览器打印窗口，可选择另存为 PDF。');
          setTimeout(function () { window.print(); }, 100);
        },
        sendPreview: function () {
          var self = this;
          if (this.exportMode === '教师确认版') {
            if (!this.exportTeacherIds.length) {
              window.ArcoVue.Message.warning('请先选择至少一位老师再发送。');
              return;
            }
            this.sessions
              .filter(function (session) {
                return session.teacherIds.some(function (id) { return self.exportTeacherIds.indexOf(id) !== -1; }) && session.status !== '已确认';
              })
              .forEach(function (session) {
                session.status = session.status === '待领导审核' ? '待老师确认' : session.status;
              });
            window.ArcoVue.Message.success('已模拟发送给 ' + this.selectedExportTeacherNames + ' 老师确认。');
          } else {
            window.ArcoVue.Message.success('已模拟发送给领导审核。');
          }
          this.exportVisible = false;
        },
        jumpExportMonth: function (offset) {
          var months = this.exportAcademicMonths;
          var idx = months.findIndex(function (m) { return m.key === this.exportCurrentMonthKey; }.bind(this));
          if (idx < 0) idx = 0;
          var next = idx + offset;
          if (next < 0) next = 0;
          if (next >= months.length) next = months.length - 1;
          this.scrollExportTo(months[next].key);
        },
        scrollExportTo: function (key) {
          var self = this;
          this.$nextTick(function () {
            var container = self.$refs.exportScroll;
            if (!container) return;
            var target = document.getElementById('export-month-' + key);
            if (target) {
              container.scrollTo({ top: target.offsetTop - 8, behavior: 'smooth' });
            }
          });
        },
        onExportScroll: function () {
          var container = this.$refs.exportScroll;
          if (!container) return;
          var scrollTop = container.scrollTop;
          var containerTop = container.getBoundingClientRect().top;
          var months = this.exportAcademicMonths;
          var current = months[0] ? months[0].key : '';
          for (var i = 0; i < months.length; i++) {
            var el = document.getElementById('export-month-' + months[i].key);
            if (!el) continue;
            var rect = el.getBoundingClientRect();
            if (rect.top - containerTop <= 60) {
              current = months[i].key;
            } else {
              break;
            }
          }
          this.exportCurrentMonthKey = current;
        },
        shouldHighlight: function (session) {
          if (this.exportMode !== '教师确认版') return true;
          if (!this.exportTeacherIds.length) return false;
          return session.teacherIds.some(function (id) { return this.exportTeacherIds.indexOf(id) !== -1; }.bind(this));
        },
        shouldDim: function (session) {
          return this.exportMode === '教师确认版' && !this.shouldHighlight(session);
        },
        openSession: function (session) {
          this.editingSession = session;
          this.editForm = {
            date: session.date,
            time: session.time,
            teacherIds: [].concat(session.teacherIds),
            room: session.room,
            remark: ''
          };
          this.sessionDrawerVisible = true;
        },
        saveSessionChange: function () {
          if (!this.editingSession) return;
          var self = this;
          var before = this.formatDate(this.editingSession.date) + ' ' + this.editingSession.time + ' · ' + this.editingSession.teacherNames.join(' / ') + ' · ' + this.editingSession.room;
          this.editingSession.date = this.editForm.date;
          this.editingSession.time = this.editForm.time;
          this.editingSession.teacherIds = [].concat(this.editForm.teacherIds);
          this.editingSession.teacherNames = this.editForm.teacherIds.map(teacherName);
          this.editingSession.room = this.editForm.room;
          this.editingSession.status = '变更待确认';
          this.editingSession.confirmations = this.editingSession.teacherIds.map(function (teacherId) {
            return { teacherId: teacherId, confirmed: false, confirmedAt: '' };
          });
          var after = this.formatDate(this.editingSession.date) + ' ' + this.editingSession.time + ' · ' + this.editingSession.teacherNames.join(' / ') + ' · ' + this.editingSession.room;
          this.editingSession.changeLog.unshift({
            at: this.dateKey(new Date()),
            summary: before + ' 调整为 ' + after + (this.editForm.remark ? '；' + this.editForm.remark : '')
          });
          this.exportTeacherIds = [this.editingSession.teacherIds[0]];
          window.ArcoVue.Message.success('已保存修改，状态更新为“变更待确认”。');
          this.sessionDrawerVisible = false;
        },
        teacherConfirm: function (session) {
          var self = this;
          session.confirmations.forEach(function (item) {
            item.confirmed = true;
            item.confirmedAt = self.dateKey(new Date());
          });
          session.status = '已确认';
          window.ArcoVue.Message.success(session.courseName + ' 已模拟完成老师确认。');
        },
        confirmYear: function () {
          if (this.yearConfirmed) {
            window.ArcoVue.Message.warning('当前排课已经发布开课，请前往“报名情况”管理。');
            return;
          }
          var self = this;
          var yearSessions = this.sessions.filter(function (session) {
            return new Date(session.date + 'T00:00:00').getFullYear() === self.selectedYear;
          });
          
          if (!yearSessions.length) {
            window.ArcoVue.Message.warning('当前暂无已排课程课次。');
            return;
          }

          this.confirmSessionsList = yearSessions.map(function (s) {
            var courseDate = new Date(s.date + 'T00:00:00');
            courseDate.setDate(courseDate.getDate() - 3);
            courseDate.setHours(10, 0, 0, 0);
            var m = String(courseDate.getMonth() + 1).padStart(2, '0');
            var d = String(courseDate.getDate()).padStart(2, '0');
            var hh = String(courseDate.getHours()).padStart(2, '0');
            var mm = String(courseDate.getMinutes()).padStart(2, '0');
            var deadlineStr = courseDate.getFullYear() + '-' + m + '-' + d + ' ' + hh + ':' + mm;

            return {
              id: s.id,
              courseName: s.courseName,
              date: s.date,
              time: s.time,
              teachers: s.teacherNames,
              teacherNames: s.teacherNames,
              room: s.room,
              targetGroup: s.targetGroup,
              baseType: s.baseType,
              minEnroll: 5,
              maxEnroll: 15,
              deadline: deadlineStr
            };
          });

          this.confirmYearDrawerVisible = true;
        },
        applyBatchConfig: function () {
          var self = this;
          this.confirmSessionsList.forEach(function (item) {
            item.minEnroll = self.batchMinEnroll;
            item.maxEnroll = self.batchMaxEnroll;
            
            if (self.deadlineStrategy === 'unified') {
              if (self.batchDeadlineDate) {
                item.deadline = self.batchDeadlineDate;
              }
            } else {
              var courseDate = new Date(item.date + 'T00:00:00');
              courseDate.setDate(courseDate.getDate() - self.batchDeadlineOffset);
              courseDate.setHours(10, 0, 0, 0);
              var m = String(courseDate.getMonth() + 1).padStart(2, '0');
              var d = String(courseDate.getDate()).padStart(2, '0');
              var hh = String(courseDate.getHours()).padStart(2, '0');
              var mm = String(courseDate.getMinutes()).padStart(2, '0');
              item.deadline = courseDate.getFullYear() + '-' + m + '-' + d + ' ' + hh + ':' + mm;
            }
          });
          window.ArcoVue.Message.success('已应用批量参数配置到所有课次。');
        },
        submitConfirmYear: function () {
          var self = this;
          
          if (!window.SharedRunBatches) {
            window.SharedRunBatches = [];
          }

          var todayStr = '2026-06-07';
          var studentPool = [
            { name: '陈志飞', dept: '新生儿科' },
            { name: '林立', dept: '重症医学科' },
            { name: '徐蕾', dept: '儿内科' },
            { name: '郭涛', dept: '儿内科' },
            { name: '马丽', dept: '儿保科' },
            { name: '梁晨', dept: '门急诊' },
            { name: '邓超', dept: '普外科' },
            { name: '张杰', dept: '重症医学科' },
            { name: '谢娜', dept: '儿内科' },
            { name: '黄晓明', dept: '儿外科' },
            { name: '杨颖', dept: '骨科' },
            { name: '冯绍峰', dept: '儿内科' },
            { name: '胡歌', dept: '普外科' },
            { name: '彭于晏', dept: '普外科' },
            { name: '刘亦菲', dept: '小儿外科' },
            { name: '杨幂', dept: '骨科' },
            { name: '唐嫣', dept: '泌尿外科' },
            { name: '刘诗诗', dept: '儿外科' },
            { name: '霍建华', dept: '脑外科' }
          ];

          this.confirmSessionsList.forEach(function (session, idx) {
            var mockEnroll = 0;
            if (idx % 4 === 0) {
              mockEnroll = 2;
            } else if (idx % 4 === 1) {
              mockEnroll = 8;
            } else if (idx % 4 === 2) {
              mockEnroll = session.maxEnroll;
            } else {
              mockEnroll = 1;
            }

            var status = 'register';
            if (mockEnroll >= session.maxEnroll) {
              status = 'auto_start';
            } else if (mockEnroll >= session.minEnroll) {
              status = 'ready_to_start';
            } else if (session.deadline < todayStr) {
              status = 'failed_to_start';
            } else {
              status = 'register';
            }

            var students = studentPool.slice(0, mockEnroll).map(function (s, i) {
              return {
                name: s.name,
                dept: s.dept,
                time: '06-01 10:' + (10 + i),
                status: 'normal'
              };
            });

            var category = '通识';
            if (session.baseType === 'pediatric') category = '内科';
            if (session.baseType === 'surgery') category = '外科';

            var targetClass = session.targetGroup.split(' · ')[0] || '住培生';

            var newBatch = {
              id: 'CN-' + session.id,
              name: session.courseName + ' - ' + targetClass,
              courseName: session.courseName,
              status: status,
              category: category,
              audience: targetClass,
              timeStr: session.date + ' ' + session.time,
              venue: session.room,
              instructors: session.teacherNames,
              enroll: mockEnroll,
              minEnroll: session.minEnroll,
              maxEnroll: session.maxEnroll,
              readiness: { teacher: 'ready', space: 'ready', materials: 'ready' },
              students: students
            };

            var exists = window.SharedRunBatches.some(function (b) { return b.id === newBatch.id; });
            if (!exists) {
              window.SharedRunBatches.unshift(newBatch);
            }
          });

          this.yearConfirmed = true;
          this.confirmYearDrawerVisible = false;
          window.ArcoVue.Message.success('排课已成功确认发布！共 ' + this.confirmSessionsList.length + ' 门课程已同步到报名情况中。');

          setTimeout(function () {
            if (window.navigateTo) {
              window.navigateTo('报名情况');
            }
          }, 1500);
        }
      }
    }).use(window.ArcoVue).mount('#scheduled-course-app');
    });
  }

  function renderShell() {
    var content = document.querySelector('.content');
    if (!content || !shouldHandle()) {
      if (appInstance) {
        try {
          appInstance.unmount();
        } catch (e) {}
        appInstance = null;
      }
      return;
    }

    loadModuleCss();
    content.innerHTML = '<div id="scheduled-course-app" class="scheduled-course-container" v-cloak>' + template + '</div>';
    mountApp();
  }

  function boot() {
    renderShell();
    var lastRole = document.body.dataset.role;
    var lastActive = document.body.dataset.active;
    var obs = new MutationObserver(function () {
      loadModuleCss();
      var curRole = document.body.dataset.role;
      var curActive = document.body.dataset.active;
      if (curRole === lastRole && curActive === lastActive) return;
      lastRole = curRole;
      lastActive = curActive;
      
      // If we navigated away from a scheduled-course page, clean up the mounted app.
      if (appInstance && !shouldHandle()) {
        try {
          appInstance.unmount();
        } catch (e) {}
        appInstance = null;
      }
      
      if (shouldHandle()) {
        renderShell();
      }
    });
    obs.observe(document.body, { attributes: true, attributeFilter: ['data-role', 'data-active'] });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
}());
