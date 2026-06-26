(function () {
  'use strict';

  var vueApp = null;
  var pilotName = '儿科坏消息告知';

  function waitForDeps(callback) {
    if (window.Vue && window.Vue.createApp) callback();
    else setTimeout(function () { waitForDeps(callback); }, 50);
  }

  function shouldHandle() {
    return ['admin', 'scheduler'].indexOf(document.body.dataset.role) !== -1 && document.body.dataset.active === '开课条件总览';
  }

  function injectCSS() {
    if (document.getElementById('launch-readiness-css')) return;
    var script = document.querySelector('script[src$="launch-readiness.js"]');
    var link = document.createElement('link');
    link.id = 'launch-readiness-css';
    link.rel = 'stylesheet';
    link.href = script
      ? script.src.replace(/launch-readiness\.js$/, 'launch-readiness.css')
      : '../shared/modules/launch-readiness/launch-readiness.css';
    document.head.appendChild(link);
  }

  function liveSnapshot() {
    var business = window.TeachingBusiness;
    var course = business && business.getCourseState ? business.getCourseState(pilotName) : null;
    var readiness = business && business.getReadiness ? business.getReadiness(pilotName) : { completed: 0, total: 8 };
    var handoff = business && business.getSchedulingHandoff ? business.getSchedulingHandoff(pilotName) : null;
    var teacher = business && business.getTeacherConfirmation ? business.getTeacherConfirmation(pilotName) : null;
    var resource = business && business.getResourceAssurance ? business.getResourceAssurance(pilotName) : null;
    var teacherConfirmed = teacher && teacher.status === 'teacher-confirmed';
    var teacherConflict = teacher && teacher.status === 'teacher-conflict';
    var spaceStatus = resource ? resource.space.status : 'not-generated';
    var materialStatus = resource ? resource.material.status : 'not-generated';

    var checks = [
      {
        key: 'course',
        label: '课程标准与实施条件',
        status: readiness.completed === readiness.total ? 'pass' : 'blocked',
        owner: '课程负责人 / 教务管理员',
        evidence: readiness.completed + '/' + readiness.total + ' 项实施条件完成 · ' + (course ? course.stageLabel : '状态未知'),
        next: readiness.completed === readiness.total ? '已完成' : '补齐课程实施条件'
      },
      {
        key: 'plan',
        label: '开课计划与排课交接',
        status: handoff ? 'pass' : 'blocked',
        owner: '教务管理员',
        evidence: handoff ? handoff.openingPlanId + ' · ' + handoff.sourceVersion : '尚未生成开课计划交接记录',
        next: handoff ? '已完成' : '创建开课计划并推送排课'
      },
      {
        key: 'draft',
        label: '课次草案与硬性约束',
        status: handoff ? 'pass' : 'blocked',
        owner: '排课与场地管理员',
        evidence: handoff ? 'AI 候选方案 1 · 4/4 项硬性约束通过' : '尚未进入候选排课',
        next: handoff ? '已生成待确认草案' : '生成可验证候选方案'
      },
      {
        key: 'teacher',
        label: '授课教师确认',
        status: teacherConfirmed ? 'pass' : teacherConflict ? 'blocked' : 'pending',
        owner: teacherConfirmed ? '排课与场地管理员' : '授课教师',
        evidence: teacherConfirmed ? '教师已确认课次草案' : teacherConflict ? '教师反馈冲突：' + teacher.conflictReason : '等待教师确认',
        next: teacherConfirmed ? '生成资源保障任务' : teacherConflict ? '调整候选课次并重新发起确认' : '教师确认或反馈冲突'
      },
      {
        key: 'space',
        label: '空间保障',
        status: spaceStatus === 'ready' ? 'pass' : spaceStatus === 'blocked' ? 'blocked' : spaceStatus === 'not-generated' ? 'pending' : 'partial',
        owner: resource ? resource.space.owner : '排课与场地管理员',
        evidence: resource ? resource.space.statusLabel + ' · ' + resource.space.issue : '教师确认后才生成空间任务',
        next: resource ? resource.space.alternative : '等待教师确认'
      },
      {
        key: 'material',
        label: '物资与耗材保障',
        status: materialStatus === 'ready' ? 'pass' : materialStatus === 'blocked' ? 'blocked' : materialStatus === 'not-generated' ? 'pending' : 'partial',
        owner: resource ? resource.material.owner : '物资管理员',
        evidence: resource ? resource.material.statusLabel + ' · ' + resource.material.issue : '教师确认后才生成物资任务',
        next: resource ? resource.material.alternative : '等待教师确认'
      },
      {
        key: 'audience',
        label: '学员范围与容量',
        status: 'pass',
        owner: '教务管理员',
        evidence: '住培第一年 · 通识 · 12 人 · 场地容量需不少于 12 人',
        next: '已完成'
      },
      {
        key: 'notice',
        label: '正式通知内容',
        status: 'pass',
        owner: '教务管理员',
        evidence: '通知对象、时间、地点、教师和课前要求已生成草稿',
        next: '满足开课条件后正式发送'
      }
    ];

    return finalizeSnapshot({
      scenario: 'live',
      scenarioLabel: '实时共享状态',
      overallStatus: 'blocked',
      overallLabel: '尚不具备正式开课条件',
      currentOwner: teacherConflict ? '排课与场地管理员' : teacherConfirmed ? (resource ? resource.currentOwner : '排课与场地管理员') : '授课教师',
      nextAction: teacherConflict ? '处理教师冲突并重新生成课次草案' : teacherConfirmed ? (resource ? resource.nextAction : '生成资源保障任务') : '等待教师确认课次草案',
      checks: checks,
      records: resource ? resource.records : [],
      sourceVersion: handoff ? handoff.sourceVersion : '课程标准 v1.0'
    });
  }

  function finalizeSnapshot(snapshot) {
    var passes = snapshot.checks.filter(function (item) { return item.status === 'pass'; }).length;
    snapshot.completed = passes;
    snapshot.total = snapshot.checks.length;
    snapshot.canPublish = snapshot.scenario !== 'cancelled' && snapshot.scenario !== 'change' && passes === snapshot.checks.length;
    if (snapshot.canPublish) {
      snapshot.overallStatus = 'ready';
      snapshot.overallLabel = '具备正式开课条件';
      snapshot.currentOwner = '教务管理员';
      snapshot.nextAction = '执行最终确认后发布正式课表并通知学员';
    }
    return snapshot;
  }

  function scenarioSnapshot(kind) {
    var snapshot = liveSnapshot();
    if (kind === 'ready') {
      snapshot.scenario = 'ready';
      snapshot.scenarioLabel = '试点场景：全部就绪';
      snapshot.checks.forEach(function (item) {
        item.status = 'pass';
        if (item.key === 'space') item.evidence = '302 PBL 教室已锁定，教师已重新确认场地变化';
        if (item.key === 'material') item.evidence = '纸质角色卡 4 套 + 电子角色卡 2 组，物资已备妥';
      });
      snapshot.records = [
        { time: '刚刚', text: '教师重新确认替代场地' },
        { time: '刚刚', text: '空间与物资任务全部就绪' }
      ].concat(snapshot.records || []);
      return finalizeSnapshot(snapshot);
    }
    if (kind === 'change') {
      snapshot.scenario = 'change';
      snapshot.scenarioLabel = '试点场景：确认后变更';
      snapshot.overallStatus = 'change';
      snapshot.overallLabel = '变更处理中，原确认已失效';
      snapshot.currentOwner = '排课与场地管理员';
      snapshot.nextAction = '确认替代场地影响，并重新发送教师确认';
      snapshot.checks.forEach(function (item) {
        if (['teacher', 'space', 'material', 'notice'].indexOf(item.key) !== -1) {
          item.status = 'invalidated';
          item.next = item.key === 'teacher' ? '重新发起教师确认' : item.key === 'notice' ? '等待变更完成后重建通知' : '根据新场地重新核对';
        }
      });
      snapshot.records = [
        { time: '场景记录', text: '301 PBL 教室改为 302 PBL 教室，原教师确认、空间任务、物资摆放与通知草稿失效' }
      ];
      return finalizeSnapshot(snapshot);
    }
    if (kind === 'cancelled') {
      snapshot.scenario = 'cancelled';
      snapshot.scenarioLabel = '试点场景：课次已取消';
      snapshot.overallStatus = 'cancelled';
      snapshot.overallLabel = '课次已取消，下游任务已关闭';
      snapshot.currentOwner = '教务管理员';
      snapshot.nextAction = '保留取消记录，不再通知学员';
      snapshot.checks.forEach(function (item) {
        item.status = item.key === 'course' || item.key === 'plan' ? 'history' : 'closed';
        item.next = item.key === 'course' || item.key === 'plan' ? '保留历史' : '任务已关闭';
      });
      snapshot.records = [
        { time: '场景记录', text: '课次取消；教师确认、空间任务、物资任务和通知任务均已关闭' }
      ];
      return finalizeSnapshot(snapshot);
    }
    return snapshot;
  }

  function getTemplate() {
    return `
      <section class="lr-page">
        <header class="lr-page-head page-header">
          <div>
            <p>课程实施 / 首次授课准备</p>
            <h1>开课条件总览</h1>
            <span>教务管理员在正式通知学员前，统一检查课程、排课、教师确认与资源保障。</span>
          </div>
          <button type="button" class="lr-refresh" @click="refreshLive">刷新共享状态</button>
        </header>

        <section class="lr-scenario-bar" aria-label="试点场景验证">
          <div><strong>试点场景验证</strong><span>用于验证正常、变更和取消恢复流程，不代表真实业务规则。</span></div>
          <div class="lr-scenario-actions">
            <button v-for="item in scenarios" :key="item.key" type="button" :class="{ active: scenario === item.key }" @click="selectScenario(item.key)">{{ item.label }}</button>
          </div>
        </section>

        <section :class="['lr-status-hero', 'p-result-summary', snapshot.overallStatus]">
          <div>
            <span>{{ snapshot.scenarioLabel }}</span>
            <h2>{{ snapshot.overallLabel }}</h2>
            <p>当前责任人：<strong>{{ snapshot.currentOwner }}</strong> · 下一步：{{ snapshot.nextAction }}</p>
          </div>
          <div class="lr-progress"><strong>{{ snapshot.completed }}/{{ snapshot.total }}</strong><span>门禁通过</span></div>
        </section>

        <section class="lr-object-strip">
          <div><span>课程标准</span><strong>{{ pilotName }} · {{ snapshot.sourceVersion }}</strong></div>
          <div><span>开课计划</span><strong>PLAN-2026-0001</strong></div>
          <div><span>课次草案</span><strong>SESSION-PLAN-2026-0001-01</strong></div>
          <div><span>计划时间</span><strong>2026-10-26 12:30-13:30</strong></div>
        </section>

        <div class="lr-main-grid">
          <section class="lr-card lr-check-card">
            <header><div><h3>最终开课门禁</h3><p>每一项均需有证据、责任人和明确下一步。</p></div><span>{{ snapshot.completed }}/{{ snapshot.total }}</span></header>
            <div class="lr-check-list">
              <article v-for="item in snapshot.checks" :key="item.key" :class="['lr-check-row', item.status]">
                <span class="lr-check-state">{{ statusLabel(item.status) }}</span>
                <div><strong>{{ item.label }}</strong><p>{{ item.evidence }}</p><small>责任人：{{ item.owner }} · 下一步：{{ item.next }}</small></div>
              </article>
            </div>
          </section>

          <aside class="lr-side">
            <section class="lr-card lr-impact-card">
              <h3>正式发布影响范围</h3>
              <div><span>学员</span><strong>12 人</strong></div>
              <div><span>授课教师</span><strong>1 人</strong></div>
              <div><span>空间任务</span><strong>1 条</strong></div>
              <div><span>物资任务</span><strong>1 条</strong></div>
              <div><span>正式通知</span><strong>14 条</strong></div>
              <p>发布后将形成正式课表并通知相关人员；确认后变更需要重新检查受影响任务。</p>
            </section>

            <section class="lr-card lr-action-card">
              <h3>教务操作</h3>
              <button type="button" class="primary" :disabled="!snapshot.canPublish" @click="openPublish">{{ snapshot.scenario === 'published' ? '正式课表已发布' : '发布正式课表并通知学员' }}</button>
              <button type="button" @click="selectScenario('change')">模拟确认后变更</button>
              <button type="button" class="danger" :disabled="snapshot.scenario === 'cancelled'" @click="openCancel">取消课次</button>
              <p v-if="!snapshot.canPublish && snapshot.scenario !== 'cancelled' && snapshot.scenario !== 'published'">仍有未通过或已失效门禁，系统已阻止正式发布。</p>
              <p v-if="snapshot.scenario === 'published'">正式课表与通知任务已生成；后续变更必须重新执行受影响门禁。</p>
            </section>

            <section class="lr-card lr-record-card">
              <h3>最近记录</h3>
              <div v-for="record in snapshot.records.slice(0, 5)" :key="record.time + record.text"><span>{{ record.time }}</span><strong>{{ record.text }}</strong></div>
              <p v-if="!snapshot.records.length">暂无下游操作记录。</p>
            </section>
          </aside>
        </div>

        <div class="lr-result" v-if="actionResult" :class="actionResult.tone">
          <div><strong>{{ actionResult.title }}</strong><span>{{ actionResult.text }}</span></div>
          <button type="button" @click="actionResult = null">关闭</button>
        </div>

        <div class="lr-modal-mask" v-if="modalType" @click.self="closeModal">
          <section class="lr-modal" role="dialog" aria-modal="true">
            <header><span>{{ modalType === 'publish' ? '高风险操作 · 正式发布' : '高风险操作 · 取消课次' }}</span><button type="button" @click="closeModal">×</button></header>
            <h2>{{ modalType === 'publish' ? '发布正式课表并通知学员' : '取消儿科坏消息告知课次' }}</h2>
            <div class="lr-transition"><span>当前状态</span><strong>{{ snapshot.overallLabel }}</strong><b>→</b><span>目标状态</span><strong>{{ modalType === 'publish' ? '正式课表已发布' : '课次已取消' }}</strong></div>
            <div class="lr-modal-impact">
              <strong>影响范围</strong>
              <p>{{ modalType === 'publish' ? '将通知 12 名学员、1 名教师，并锁定 1 条空间任务和 1 条物资任务。' : '将关闭教师确认、空间准备、物资准备和通知任务，并保留取消记录。' }}</p>
              <p>{{ modalType === 'publish' ? '发布后如需改期、换场或更换教师，必须重新执行受影响门禁。' : '取消后不能继续授课；如需恢复，必须重新创建课次草案。' }}</p>
            </div>
            <label><span>操作原因 / 备注 *</span><textarea v-model.trim="actionReason" rows="4" :placeholder="modalType === 'publish' ? '例如：全部门禁已复核，同意正式发布' : '请填写取消原因'"></textarea></label>
            <footer><button type="button" @click="closeModal">返回检查</button><button type="button" :class="{ danger: modalType === 'cancel' }" :disabled="!actionReason" @click="confirmHighRisk">{{ modalType === 'publish' ? '确认发布并发送通知' : '确认取消并关闭下游任务' }}</button></footer>
          </section>
        </div>
      </section>
    `;
  }

  function renderShell() {
    injectCSS();
    var content = document.querySelector('.content');
    if (!content || !shouldHandle()) {
      if (vueApp) {
        try { vueApp.unmount(); } catch (_) {}
        vueApp = null;
      }
      return;
    }
    content.innerHTML = '<div id="launch-readiness-app" v-cloak>' + getTemplate() + '</div>';
    waitForDeps(function () {
      if (vueApp) {
        try { vueApp.unmount(); } catch (_) {}
      }
      vueApp = window.Vue.createApp({
        data: function () {
          return {
            pilotName: pilotName,
            scenario: 'live',
            scenarios: [
              { key: 'live', label: '实时状态' },
              { key: 'ready', label: '全部就绪' },
              { key: 'change', label: '确认后变更' },
              { key: 'cancelled', label: '已取消' }
            ],
            snapshot: scenarioSnapshot('live'),
            modalType: '',
            actionReason: '',
            actionResult: null
          };
        },
        methods: {
          statusLabel: function (status) {
            return window.TeachingStatus
              ? window.TeachingStatus.label(status, 'readinessCheck')
              : status;
          },
          selectScenario: function (kind) {
            this.scenario = kind;
            this.snapshot = scenarioSnapshot(kind);
            this.actionResult = null;
          },
          refreshLive: function () {
            this.scenario = 'live';
            this.snapshot = scenarioSnapshot('live');
            this.actionResult = { tone: 'info', title: '共享状态已刷新', text: '已重新读取教师确认、空间与物资任务状态。' };
          },
          openPublish: function () {
            if (!this.snapshot.canPublish) return;
            this.modalType = 'publish';
            this.actionReason = '';
          },
          openCancel: function () {
            this.modalType = 'cancel';
            this.actionReason = '';
          },
          closeModal: function () {
            this.modalType = '';
            this.actionReason = '';
          },
          confirmHighRisk: function () {
            if (!this.actionReason) return;
            if (this.modalType === 'publish') {
              this.snapshot.scenario = 'published';
              this.snapshot.scenarioLabel = '正式发布结果';
              this.snapshot.overallStatus = 'published';
              this.snapshot.overallLabel = '正式课表已发布';
              this.snapshot.currentOwner = '教务管理员';
              this.snapshot.nextAction = '跟踪通知送达与课前准备；如有变更，重新执行受影响门禁';
              this.snapshot.canPublish = false;
              this.snapshot.records = this.snapshot.records || [];
              this.snapshot.records.unshift({ time: '刚刚', text: '教务管理员完成最终复核并发布正式课表与通知任务' });
              this.actionResult = {
                tone: 'success',
                title: '正式课表已发布，通知任务已生成',
                text: '12 名学员和 1 名教师将收到正式通知；后续变更必须重新执行受影响门禁。'
              };
            } else {
              this.selectScenario('cancelled');
              this.actionResult = {
                tone: 'warning',
                title: '课次已取消，下游任务已关闭',
                text: '教师确认、空间准备、物资准备和通知任务均已关闭，取消原因已记录。'
              };
            }
            this.closeModal();
          }
        }
      });
      vueApp.mount('#launch-readiness-app');
    });
  }

  function boot() {
    renderShell();
    var lastRole = document.body.dataset.role;
    var lastActive = document.body.dataset.active;
    var observer = new MutationObserver(function () {
      var role = document.body.dataset.role;
      var active = document.body.dataset.active;
      if (role === lastRole && active === lastActive) return;
      lastRole = role;
      lastActive = active;
      renderShell();
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-role', 'data-active'] });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
}());
