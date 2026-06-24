(function () {
  'use strict';

  var vueApp = null;
  var pilotName = '儿科坏消息告知';
  var draftStorageKey = 'teaching-pilot-opening-plan-draft-v1';

  function shouldHandle() {
    return document.body.dataset.role === 'admin' && document.body.dataset.active === '开课计划';
  }

  function waitForDeps(callback) {
    if (window.Vue && window.Vue.createApp) callback();
    else setTimeout(function () { waitForDeps(callback); }, 50);
  }

  function injectCSS() {
    if (document.getElementById('opening-plan-css')) return;
    var script = document.querySelector('script[src$="opening-plan.js"]');
    var link = document.createElement('link');
    link.id = 'opening-plan-css';
    link.rel = 'stylesheet';
    link.href = script
      ? script.src.replace(/opening-plan\.js$/, 'opening-plan.css')
      : '../shared/modules/opening-plan/opening-plan.css';
    document.head.appendChild(link);
  }

  function defaultForm() {
    return {
      planName: '2026 年住培一年级沟通技能培训',
      audience: '住培第一年 · 通识',
      capacity: 12,
      plannedSessions: 1,
      dateStart: '2026-10-19',
      dateEnd: '2026-10-30',
      preferredTime: '工作日午间 12:30-13:30',
      schedulingPreference: '优先安排 PBL 教室；避免周五下午；如需更换场地，必须重新征得教师确认。',
      notes: '首次开课由课程负责人参与现场复盘。'
    };
  }

  function loadDraft() {
    try {
      var value = JSON.parse(window.localStorage.getItem(draftStorageKey) || 'null');
      return value && typeof value === 'object' ? Object.assign(defaultForm(), value) : defaultForm();
    } catch (_) {
      return defaultForm();
    }
  }

  function getTemplate() {
    return `
      <section class="op-page">
        <header class="op-page-head page-header">
          <div>
            <p>课程管理 / 课程标准转实施需求</p>
            <h1>创建开课计划</h1>
            <span>主要角色：教务管理员 · 核心任务：确定学员范围、开课次数与时间窗口 · 成功标准：形成可排课、可追溯的正式交接。</span>
          </div>
          <span :class="['op-save-state', 'p-status', dirty ? 'dirty' : 'saved']" :data-tone="dirty ? 'warning' : 'success'">{{ dirty ? '有未保存修改' : saveStateLabel }}</span>
        </header>

        <section class="op-flow">
          <div class="complete"><b>1</b><span><strong>课程标准已就绪</strong><small>8/8 项实施条件通过</small></span></div>
          <i></i>
          <div :class="{ complete: submitted }"><b>2</b><span><strong>创建开课计划</strong><small>明确本次培训实施需求</small></span></div>
          <i></i>
          <div :class="{ complete: submitted }"><b>3</b><span><strong>交接排课管理员</strong><small>{{ submitted ? '已进入待排课' : '尚未提交' }}</small></span></div>
        </section>

        <section class="op-source-card s-card">
          <div>
            <span>来源课程标准</span>
            <strong>{{ pilotName }} · 课程标准 v1.0</strong>
            <small>课程标准描述可重复实施的教学设计；本页面只定义本次面向特定学员的开课需求。</small>
          </div>
          <div class="op-source-gate"><strong>{{ readiness.completed }}/{{ readiness.total }}</strong><span>进入开课计划门禁</span></div>
        </section>

        <div class="op-main-grid">
          <form class="op-card op-form s-card" @submit.prevent="openReview" @input="markDirty" @change="markDirty">
            <header>
              <div><h2>本次开课需求</h2><p>这些信息将作为排课候选方案的输入，不会直接生成正式课表。</p></div>
              <span>PLAN-2026-0001</span>
            </header>

            <section class="op-form-section">
              <h3>计划对象</h3>
              <label class="wide"><span>计划名称 *</span><input v-model.trim="form.planName" type="text" :class="{ error: errors.planName }"><small class="field-error" v-if="errors.planName">{{ errors.planName }}</small></label>
              <div class="op-form-row">
                <label><span>学员范围 *</span><select v-model="form.audience" :class="{ error: errors.audience }"><option value="">请选择</option><option>住培第一年 · 通识</option><option>专培生 · 沟通技能</option><option>本院进修医生 · 沟通技能</option></select><small class="field-error" v-if="errors.audience">{{ errors.audience }}</small></label>
                <label><span>单次容量 *</span><input v-model.number="form.capacity" type="number" min="1" max="40" :class="{ error: errors.capacity }"><small class="field-error" v-if="errors.capacity">{{ errors.capacity }}</small></label>
                <label><span>计划课次数 *</span><input v-model.number="form.plannedSessions" type="number" min="1" max="20" :class="{ error: errors.plannedSessions }"><small class="field-error" v-if="errors.plannedSessions">{{ errors.plannedSessions }}</small></label>
              </div>
            </section>

            <section class="op-form-section">
              <h3>排课窗口</h3>
              <div class="op-form-row two">
                <label><span>最早日期 *</span><input v-model="form.dateStart" type="date" :class="{ error: errors.dateStart }"><small class="field-error" v-if="errors.dateStart">{{ errors.dateStart }}</small></label>
                <label><span>最晚日期 *</span><input v-model="form.dateEnd" type="date" :class="{ error: errors.dateEnd }"><small class="field-error" v-if="errors.dateEnd">{{ errors.dateEnd }}</small></label>
              </div>
              <label class="wide"><span>偏好时段 *</span><select v-model="form.preferredTime" :class="{ error: errors.preferredTime }"><option value="">请选择</option><option>工作日午间 12:30-13:30</option><option>工作日下午 14:00-17:00</option><option>周末上午 09:00-12:00</option></select><small class="field-error" v-if="errors.preferredTime">{{ errors.preferredTime }}</small></label>
              <label class="wide"><span>自然语言排课偏好</span><textarea v-model.trim="form.schedulingPreference" rows="4"></textarea><small>提交后仅作为待确认偏好，由排课管理员核对并转换为结构化规则；不会绕过硬性约束。</small></label>
              <label class="wide"><span>交接备注</span><textarea v-model.trim="form.notes" rows="3"></textarea></label>
            </section>

            <div class="op-form-actions">
              <button type="button" @click="resetForm">恢复默认</button>
              <button type="button" @click="saveDraft">保存草稿</button>
              <button type="submit" class="primary">检查并提交排课</button>
            </div>
          </form>

          <aside class="op-side">
            <section class="op-card op-evidence s-card">
              <h3>来源证据</h3>
              <div v-for="item in checks" :key="item.key"><b>✓</b><span><strong>{{ item.label }}</strong><small>{{ item.status === 'complete' ? '课程标准已完成' : item.status }}</small></span></div>
            </section>

            <section class="op-card op-impact s-card">
              <h3>提交后的变化</h3>
              <div><span>当前状态</span><strong>{{ submitted ? '待排课' : '开课计划待完善' }}</strong></div>
              <div><span>下一责任人</span><strong>排课与场地管理员</strong></div>
              <div><span>创建对象</span><strong>1 条开课计划交接</strong></div>
              <div><span>不会发生</span><strong>不会直接通知教师或学员</strong></div>
              <p>排课管理员将基于本计划收集教师时间、检查场地与容量，并生成多个可验证候选方案。</p>
            </section>

            <section class="op-card op-record s-card" v-if="handoff">
              <h3>最近交接</h3>
              <span>{{ handoff.openingPlanId }} · {{ handoff.openingPlanStatus }}</span>
              <strong>{{ handoff.enteredAt }}</strong>
              <p>当前责任人：{{ handoff.currentOwner }}<br>下一步：{{ handoff.nextAction }}</p>
              <button type="button" @click="goScheduling">进入排课工作台</button>
            </section>
          </aside>
        </div>

        <div v-if="result" :class="['op-result', 'p-result-summary', result.tone]"><div><strong>{{ result.title }}</strong><span>{{ result.text }}</span></div><button type="button" @click="result = null">关闭</button></div>

        <div class="op-modal-mask" v-if="reviewVisible" @click.self="reviewVisible = false">
          <section class="op-modal" role="dialog" aria-modal="true">
            <header><span>提交前检查</span><button type="button" @click="reviewVisible = false">×</button></header>
            <h2>将开课计划交接给排课管理员</h2>
            <div class="op-transition"><span>课程标准已就绪</span><b>→</b><strong>开课计划待排课</strong></div>
            <dl>
              <div><dt>计划对象</dt><dd>{{ form.planName }}</dd></div>
              <div><dt>学员与规模</dt><dd>{{ form.audience }} · 每次 {{ form.capacity }} 人 · {{ form.plannedSessions }} 次</dd></div>
              <div><dt>时间窗口</dt><dd>{{ form.dateStart }} 至 {{ form.dateEnd }} · {{ form.preferredTime }}</dd></div>
              <div><dt>排课偏好</dt><dd>{{ form.schedulingPreference || '未填写' }}</dd></div>
            </dl>
            <div class="op-modal-impact"><strong>影响范围</strong><p>将创建 1 条开课计划交接，并由排课管理员开始收集教师时间与生成候选方案；当前不会创建正式课次、资源任务或通知。</p></div>
            <footer><button type="button" @click="reviewVisible = false">返回修改</button><button type="button" class="primary" @click="submitPlan">确认提交排课管理员</button></footer>
          </section>
        </div>
      </section>
    `;
  }

  function renderShell() {
    injectCSS();
    var main = document.querySelector('.main');
    if (!main || !shouldHandle()) {
      if (vueApp) {
        try { vueApp.unmount(); } catch (_) {}
        vueApp = null;
      }
      return;
    }

    main.innerHTML = '<div id="opening-plan-app" v-cloak>' + getTemplate() + '</div>';
    waitForDeps(function () {
      if (vueApp) {
        try { vueApp.unmount(); } catch (_) {}
      }
      vueApp = window.Vue.createApp({
        data: function () {
          var business = window.TeachingBusiness;
          var handoff = business && business.getSchedulingHandoff ? business.getSchedulingHandoff(pilotName) : null;
          return {
            pilotName: pilotName,
            form: loadDraft(),
            errors: {},
            dirty: false,
            saveStateLabel: handoff ? '已提交排课' : '草稿已加载',
            reviewVisible: false,
            result: null,
            handoff: handoff,
            readiness: business && business.getReadiness ? business.getReadiness(pilotName) : { completed: 0, total: 8 },
            checks: business && business.getCourseChecks ? business.getCourseChecks(pilotName) : []
          };
        },
        computed: {
          submitted: function () {
            return !!this.handoff;
          }
        },
        methods: {
          markDirty: function () {
            this.dirty = true;
            this.saveStateLabel = '草稿有修改';
          },
          resetForm: function () {
            this.form = defaultForm();
            this.errors = {};
            this.dirty = true;
            this.result = { tone: 'info', title: '已恢复默认示例', text: '请检查学员范围、课次数和时间窗口后再保存或提交。' };
          },
          validate: function () {
            var errors = {};
            if (!this.form.planName) errors.planName = '请填写计划名称';
            if (!this.form.audience) errors.audience = '请选择学员范围';
            if (!this.form.capacity || this.form.capacity < 1) errors.capacity = '容量必须大于 0';
            if (!this.form.plannedSessions || this.form.plannedSessions < 1) errors.plannedSessions = '课次数必须大于 0';
            if (!this.form.dateStart) errors.dateStart = '请选择最早日期';
            if (!this.form.dateEnd) errors.dateEnd = '请选择最晚日期';
            if (this.form.dateStart && this.form.dateEnd && this.form.dateEnd < this.form.dateStart) errors.dateEnd = '最晚日期不能早于最早日期';
            if (!this.form.preferredTime) errors.preferredTime = '请选择偏好时段';
            this.errors = errors;
            return Object.keys(errors).length === 0;
          },
          saveDraft: function () {
            try {
              window.localStorage.setItem(draftStorageKey, JSON.stringify(this.form));
              this.dirty = false;
              this.saveStateLabel = '草稿已保存';
              this.result = { tone: 'success', title: '开课计划草稿已保存', text: '尚未交接排课管理员，可继续修改学员范围、课次数和时间窗口。' };
            } catch (_) {
              this.result = { tone: 'danger', title: '草稿保存失败', text: '本地存储不可用，请保留当前页面并稍后重试。' };
            }
          },
          openReview: function () {
            if (!this.validate()) {
              this.result = { tone: 'danger', title: '暂不能提交开课计划', text: '请先修正表单中标记的必填项或时间冲突。' };
              return;
            }
            this.reviewVisible = true;
            this.result = null;
          },
          submitPlan: function () {
            var business = window.TeachingBusiness;
            var requestedTimeWindow = this.form.dateStart + ' 至 ' + this.form.dateEnd + '，' + this.form.preferredTime;
            var response = business && business.recordSchedulingHandoff
              ? business.recordSchedulingHandoff(pilotName, {
                sourceVersion: '课程标准 v1.0',
                openingPlanId: 'PLAN-2026-0001',
                requestedTimeWindow: requestedTimeWindow,
                planName: this.form.planName,
                audience: this.form.audience,
                capacity: this.form.capacity,
                plannedSessions: this.form.plannedSessions,
                preferredTime: this.form.preferredTime,
                schedulingPreference: this.form.schedulingPreference,
                notes: this.form.notes,
                handedOffBy: '教务管理员'
              })
              : { ok: false, reason: '共享业务状态未加载' };

            this.reviewVisible = false;
            if (!response.ok) {
              this.result = { tone: 'danger', title: '开课计划未提交', text: response.reason || '请检查课程实施条件后重试。' };
              return;
            }
            this.handoff = response.handoff;
            this.dirty = false;
            this.saveStateLabel = '已提交排课';
            try { window.localStorage.setItem(draftStorageKey, JSON.stringify(this.form)); } catch (_) {}
            this.result = {
              tone: 'success',
              title: '开课计划已提交排课管理员',
              text: '当前状态：待排课。下一责任人：排课与场地管理员。尚未生成正式课次，也未通知教师或学员。'
            };
          },
          goScheduling: function () {
            if (typeof window.navigateTo === 'function') window.navigateTo('排课工作台');
          }
        }
      });
      vueApp.mount('#opening-plan-app');
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
