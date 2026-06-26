(function () {
  var vueApp = null;

  function waitForDeps(callback) {
    if (window.Vue && window.Vue.createApp && window.ArcoVue) {
      callback();
    } else {
      setTimeout(function () { waitForDeps(callback); }, 50);
    }
  }

  function shouldHandle() {
    var role = document.body.dataset.role;
    return ['admin', 'scheduler'].indexOf(role) !== -1 && document.body.dataset.active === '空间预约审批';
  }

  function injectCSS() {
    if (document.getElementById('sa-module-css')) return;
    var script = document.querySelector('script[src$="space-approval.js"]');
    var link = document.createElement('link');
    link.id = 'sa-module-css';
    link.rel = 'stylesheet';
    link.href = script
      ? script.src.replace(/space-approval\.js$/, 'space-approval.css')
      : '../shared/modules/space-approval/space-approval.css';
    document.head.appendChild(link);
  }

  var approvalRows = [
    {
      id: 'a001',
      applicant: '陈瑾',
      dept: '儿内科',
      avatar: '陈',
      avatarColor: '#165dff',
      topic: 'PICU护理技能集训',
      reason: 'ICU护士晋升考核前模拟训练，需要全天使用模拟病房，共6组轮转',
      date: '6月15日（周日）',
      timeRange: '08:00 — 18:00（全天）',
      venueType: '模拟病房',
      department: '儿内科',
      submitDate: '2025-06-01',
      submitTime: '09:15',
      status: 'pending',
      conflict: true,
      conflictInfo: '6月15日 14:00—16:00 与护理学院「模拟急救综合演练」申请存在模拟病房时段重叠。'
    },
    {
      id: 'a002',
      applicant: '王海波',
      dept: '外科学教研室',
      avatar: '王',
      avatarColor: '#16a34a',
      topic: '腹腔镜技能强化课',
      reason: '住院医师规范操作技能强化，需腔镜实训室全套设备',
      date: '6月16日（周一）',
      timeRange: '14:00 — 17:00',
      venueType: '腔镜实训室',
      department: '外科学教研室',
      submitDate: '2025-06-02',
      submitTime: '11:30',
      status: 'pending',
      conflict: false
    },
    {
      id: 'a003',
      applicant: '刘芳',
      dept: '护理学院',
      avatar: '刘',
      avatarColor: '#e67e00',
      topic: '模拟急救综合演练',
      reason: '护理本科生急救技能综合演练，6个小组分批轮转使用',
      date: '6月20日（周五）',
      timeRange: '08:00 — 12:00',
      venueType: '模拟病房',
      department: '护理学院',
      submitDate: '2025-06-03',
      submitTime: '14:55',
      status: 'pending',
      conflict: false
    },
    {
      id: 'a004',
      applicant: '张明辉',
      dept: '麻醉科',
      avatar: '张',
      avatarColor: '#7c3aed',
      topic: '气道管理实操培训',
      reason: '新入职住院医气道操作规范化培训，需模拟气道设备',
      date: '6月12日（周二）',
      timeRange: '09:00 — 11:30',
      venueType: '模拟病房',
      department: '麻醉科',
      submitDate: '2025-05-28',
      submitTime: '16:20',
      status: 'approved',
      conflict: false,
      approver: '刘国强',
      approveTime: '2025-05-29 10:05',
      comment: '场地空闲，无冲突，已通过。'
    },
    {
      id: 'a005',
      applicant: '孙晓静',
      dept: '教务处',
      avatar: '孙',
      avatarColor: '#c2175b',
      topic: '临床技能考核动员大会',
      reason: '全院住院医师技能考核赛前动员，需可容纳 200 人的场地',
      date: '6月10日（周六）',
      timeRange: '14:00 — 16:00',
      venueType: '阶梯教室',
      department: '教务处',
      submitDate: '2025-05-25',
      submitTime: '08:40',
      status: 'approved',
      conflict: false,
      approver: '刘国强',
      approveTime: '2025-05-26 09:30',
      comment: '场地容量满足，已通过。'
    },
    {
      id: 'a006',
      applicant: '赵大勇',
      dept: '儿外科',
      avatar: '赵',
      avatarColor: '#0891b2',
      topic: '腹腔镜国际大师班',
      reason: '国际腹腔镜外科大师班演示课，需模拟手术室与转播设备',
      date: '6月8日（周日）',
      timeRange: '09:00 — 17:00',
      venueType: '模拟手术室',
      department: '儿外科',
      submitDate: '2025-05-22',
      submitTime: '15:00',
      status: 'approved',
      conflict: false,
      approver: '刘国强',
      approveTime: '2025-05-23 14:20',
      comment: '活动规格高，已协调模拟手术室。'
    },
    {
      id: 'a007',
      applicant: '李建国',
      dept: '儿科研究所',
      avatar: '李',
      avatarColor: '#64748b',
      topic: 'OSCE考前联合演练',
      reason: '第二轮次OSCE联合演练，需同时使用多个考站',
      date: '6月5日（周四）',
      timeRange: '全天',
      venueType: 'OSCE考站',
      department: '儿科研究所',
      submitDate: '2025-05-20',
      submitTime: '10:00',
      status: 'rejected',
      conflict: false,
      approver: '刘国强',
      approveTime: '2025-05-21 09:00',
      comment: '该日期 OSCE 考站已安排正式考核，请改期。'
    }
  ];

  var pilotResourceAssurance = window.TeachingBusiness && window.TeachingBusiness.getResourceAssurance
    ? window.TeachingBusiness.getResourceAssurance('儿科坏消息告知')
    : null;
  if (pilotResourceAssurance) {
    approvalRows.unshift({
      id: 'pilot-space-' + pilotResourceAssurance.sessionId,
      applicant: '系统任务',
      dept: '排课工作台',
      avatar: '课',
      avatarColor: '#165dff',
      topic: pilotResourceAssurance.courseName,
      reason: pilotResourceAssurance.space.issue,
      date: pilotResourceAssurance.scheduledDateLabel,
      timeRange: pilotResourceAssurance.scheduledTime,
      venueType: 'PBL教室',
      department: '医学人文教研室',
      submitDate: '2026-06-10',
      submitTime: '10:35',
      status: pilotResourceAssurance.space.status === 'awaiting-teacher-reconfirm' ? 'coordinating' : 'pending',
      conflict: pilotResourceAssurance.space.status !== 'ready',
      conflictInfo: pilotResourceAssurance.space.issue,
      sourceLabel: pilotResourceAssurance.sourceLabel,
      openingPlanId: pilotResourceAssurance.openingPlanId,
      sessionId: pilotResourceAssurance.sessionId,
      resourceStatusLabel: pilotResourceAssurance.space.statusLabel,
      alternative: pilotResourceAssurance.space.alternative,
      requiresTeacherReconfirm: pilotResourceAssurance.space.requiresTeacherReconfirm,
      deadline: pilotResourceAssurance.deadline,
      nextOwner: pilotResourceAssurance.space.owner,
      downstream: '替代场地被采用后，必须重新发送教师确认，不能直接发布正式课表。'
    });
  }

  var statusTabs = [
    { key: 'all', label: '全部', tone: 'blue' },
    { key: 'pending', label: statusText('pending'), tone: 'orange' },
    { key: 'coordinating', label: statusText('coordinating'), tone: 'blue' },
    { key: 'approved', label: statusText('approved'), tone: 'green' },
    { key: 'rejected', label: statusText('rejected'), tone: 'red' }
  ];

  function statusText(status) {
    return window.TeachingStatus
      ? window.TeachingStatus.label(status, 'spaceApproval')
      : status;
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

    content.innerHTML = '<div id="sa-app" v-cloak>' + getTemplate() + '</div>';

    waitForDeps(function () {
      if (vueApp) {
        try { vueApp.unmount(); } catch (e) {}
        vueApp = null;
      }

      var app = Vue.createApp({
        setup: function () {
          var rows = Vue.ref(approvalRows);
          var activeTab = Vue.ref('all');
          var keyword = Vue.ref('');
          var venueFilter = Vue.ref('');
          var deptFilter = Vue.ref('');
          var approvalVisible = Vue.ref(false);
          var detailVisible = Vue.ref(false);
          var currentRow = Vue.ref(null);
          var approvalComment = Vue.ref('');
          var recommendPlan = Vue.ref('changeRoom');

          var stats = Vue.computed(function () {
            return {
              all: rows.value.length,
              pending: rows.value.filter(function (item) { return item.status === 'pending'; }).length,
              coordinating: rows.value.filter(function (item) { return item.status === 'coordinating'; }).length,
              approved: rows.value.filter(function (item) { return item.status === 'approved'; }).length,
              rejected: rows.value.filter(function (item) { return item.status === 'rejected'; }).length
            };
          });

          var venueOptions = Vue.computed(function () {
            return Array.from(new Set(rows.value.map(function (item) { return item.venueType; })));
          });

          var deptOptions = Vue.computed(function () {
            return Array.from(new Set(rows.value.map(function (item) { return item.department; })));
          });

          var filteredRows = Vue.computed(function () {
            var kw = keyword.value.trim().toLowerCase();
            return rows.value.filter(function (item) {
              if (activeTab.value !== 'all' && item.status !== activeTab.value) return false;
              if (venueFilter.value && item.venueType !== venueFilter.value) return false;
              if (deptFilter.value && item.department !== deptFilter.value) return false;
              if (!kw) return true;
              return [item.applicant, item.dept, item.topic, item.reason, item.venueType]
                .some(function (value) { return String(value).toLowerCase().indexOf(kw) !== -1; });
            });
          });

          var conflictCount = Vue.computed(function () {
            return filteredRows.value.filter(function (item) { return item.conflict; }).length;
          });

          function setTab(tab) {
            activeTab.value = tab;
          }

          function openApproval(row) {
            currentRow.value = row;
            approvalComment.value = row.alternative
              ? row.alternative
              : row.conflict
              ? '建议先协调冲突场地，可改用 402 模拟病房后通过。'
              : '';
            recommendPlan.value = row.conflict ? 'changeRoom' : 'approve';
            approvalVisible.value = true;
          }

          function openDetail(row) {
            currentRow.value = row;
            detailVisible.value = true;
          }

          function approveCurrent() {
            if (!currentRow.value) return;
            if (currentRow.value.openingPlanId && currentRow.value.conflict) {
              currentRow.value.status = 'coordinating';
              currentRow.value.conflict = false;
              currentRow.value.resourceStatusLabel = '替代方案待教师复核';
              currentRow.value.approver = '刘国强';
              currentRow.value.approveTime = new Date().toLocaleString('zh-CN');
              currentRow.value.comment = approvalComment.value || currentRow.value.alternative;
              if (window.TeachingBusiness && window.TeachingBusiness.updateResourceAssurance) {
                window.TeachingBusiness.updateResourceAssurance(currentRow.value.topic, 'space', {
                  status: 'awaiting-teacher-reconfirm',
                  statusLabel: '替代方案待教师复核',
                  selectedAlternative: currentRow.value.comment,
                  recordText: '空间管理员选择替代场地，等待教师重新确认'
                });
              }
              approvalVisible.value = false;
              window.ArcoVue.Message.info('替代场地方案已记录，需教师重新确认后才能锁定');
              return;
            }
            currentRow.value.status = 'approved';
            currentRow.value.conflict = false;
            currentRow.value.approver = '刘国强';
            currentRow.value.approveTime = new Date().toLocaleString('zh-CN');
            currentRow.value.comment = approvalComment.value || '场地资源已确认，审批通过。';
            approvalVisible.value = false;
            window.ArcoVue.Message.success('已通过「' + currentRow.value.topic + '」');
          }

          function rejectCurrent() {
            if (!currentRow.value) return;
            if (!approvalComment.value.trim()) {
              window.ArcoVue.Message.warning('驳回时请填写审批意见');
              return;
            }
            currentRow.value.status = 'rejected';
            currentRow.value.approver = '刘国强';
            currentRow.value.approveTime = new Date().toLocaleString('zh-CN');
            currentRow.value.comment = approvalComment.value;
            if (currentRow.value.openingPlanId && window.TeachingBusiness && window.TeachingBusiness.updateResourceAssurance) {
              window.TeachingBusiness.updateResourceAssurance(currentRow.value.topic, 'space', {
                status: 'blocked',
                statusLabel: '空间方案被驳回',
                recordText: '空间保障任务被驳回，需要重新排课'
              });
            }
            approvalVisible.value = false;
            window.ArcoVue.Message.success('已驳回「' + currentRow.value.topic + '」');
          }

          function scrollToConflict() {
            Vue.nextTick(function () {
              var el = document.querySelector('.sa-row.conflict');
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
          }

          function refreshList() {
            window.ArcoVue.Message.success('列表已刷新');
          }

          function exportList() {
            window.ArcoVue.Message.success('已生成当前筛选列表导出任务');
          }

          function detailItems(row) {
            if (!row) return [];
            var items = [
              { label: '申请人', value: row.applicant + ' / ' + row.dept },
              { label: '申请主题', value: row.topic },
              { label: '预约时间', value: row.date + ' ' + row.timeRange },
              { label: '场地类型', value: row.venueType },
              { label: '申请时间', value: row.submitDate + ' ' + row.submitTime },
              { label: '状态', value: statusText(row.status) },
              { label: '申请事由', value: row.reason, wide: true },
              { label: '审批意见', value: row.comment || '暂无', wide: true }
            ];
            if (row.openingPlanId) {
              items.splice(2, 0,
                { label: '来源状态', value: row.sourceLabel },
                { label: '开课计划', value: row.openingPlanId },
                { label: '资源状态', value: row.resourceStatusLabel },
                { label: '处理截止', value: row.deadline },
                { label: '下游影响', value: row.downstream, wide: true }
              );
            }
            return items;
          }

          return {
            statusTabs: statusTabs,
            activeTab: activeTab,
            keyword: keyword,
            venueFilter: venueFilter,
            deptFilter: deptFilter,
            approvalVisible: approvalVisible,
            detailVisible: detailVisible,
            currentRow: currentRow,
            approvalComment: approvalComment,
            recommendPlan: recommendPlan,
            stats: stats,
            venueOptions: venueOptions,
            deptOptions: deptOptions,
            filteredRows: filteredRows,
            conflictCount: conflictCount,
            setTab: setTab,
            openApproval: openApproval,
            openDetail: openDetail,
            approveCurrent: approveCurrent,
            rejectCurrent: rejectCurrent,
            scrollToConflict: scrollToConflict,
            refreshList: refreshList,
            exportList: exportList,
            statusText: statusText,
            detailItems: detailItems
          };
        }
      });

      app.use(window.ArcoVue);
      vueApp = app;
      vueApp.mount('#sa-app');
    });
  }

  function getTemplate() {
    return [
      '<section class="sa-page">',
        '<div class="sa-card">',
          '<div class="sa-tabs">',
            '<button v-for="tab in statusTabs" :key="tab.key" type="button" :class="[\'sa-tab\', tab.tone, { active: activeTab === tab.key }]" @click="setTab(tab.key)">',
              '<span>{{ tab.label }}</span><b>{{ stats[tab.key] }}</b>',
            '</button>',
          '</div>',

          '<div class="sa-toolbar">',
            '<a-input-search v-model="keyword" size="large" allow-clear class="sa-search" placeholder="搜索申请人姓名或申请主题..."></a-input-search>',
            '<a-select v-model="venueFilter" size="large" allow-clear class="sa-filter" placeholder="全部场地类型">',
              '<a-option v-for="item in venueOptions" :key="item" :value="item">{{ item }}</a-option>',
            '</a-select>',
            '<a-select v-model="deptFilter" size="large" allow-clear class="sa-filter" placeholder="全部科室/部门">',
              '<a-option v-for="item in deptOptions" :key="item" :value="item">{{ item }}</a-option>',
            '</a-select>',
            '<div class="sa-actions">',
              '<a-button size="large" @click="exportList">导出</a-button>',
              '<a-button size="large" @click="refreshList">刷新</a-button>',
            '</div>',
          '</div>',

          '<button v-if="conflictCount" type="button" class="sa-conflict-banner" @click="scrollToConflict">',
            '<span class="sa-alert-icon">!</span>',
            '<strong>当前列表中存在 {{ conflictCount }} 条申请检测到场地时段冲突，请在审批前先处理排期重合问题。</strong>',
            '<em>立即查看冲突申请 →</em>',
          '</button>',

          '<div class="sa-table">',
            '<div class="sa-head">',
              '<span>申请人 / 部门</span>',
              '<span>申请主题 & 事由</span>',
              '<span>预约时间</span>',
              '<span>场地类型</span>',
              '<span>申请时间</span>',
              '<span>状态</span>',
              '<span>操作</span>',
            '</div>',

            '<div v-for="row in filteredRows" :key="row.id" :class="[\'sa-row\', { conflict: row.conflict }]">',
              '<div class="sa-applicant">',
                '<span class="sa-avatar" :style="{ background: row.avatarColor }">{{ row.avatar }}</span>',
                '<div><strong>{{ row.applicant }}</strong><small>{{ row.dept }}</small></div>',
              '</div>',
              '<div class="sa-topic">',
                '<strong>{{ row.topic }}</strong>',
                '<p>{{ row.reason }}</p>',
                '<span v-if="row.sourceLabel" class="sa-source-chip">{{ row.sourceLabel }} · {{ row.openingPlanId }}</span>',
                '<span v-if="row.resourceStatusLabel" class="sa-resource-chip">{{ row.resourceStatusLabel }}</span>',
                '<span v-if="row.conflict" class="sa-conflict-chip">有场地冲突</span>',
              '</div>',
              '<div class="sa-time"><strong>{{ row.date }}</strong><span>{{ row.timeRange }}</span></div>',
              '<div><span :class="[\'sa-venue\', row.venueType === \'阶梯教室\' ? \'warning\' : \'blue\']">{{ row.venueType }}</span></div>',
              '<div class="sa-submit"><strong>{{ row.submitDate }}</strong><span>{{ row.submitTime }}</span></div>',
              '<div><span :class="[\'sa-status\', row.status]"><i></i>{{ statusText(row.status) }}</span></div>',
              '<div class="sa-op">',
                '<button v-if="row.status === \'pending\'" type="button" class="sa-primary-btn" @click="openApproval(row)">审批/协调</button>',
                '<button v-else type="button" class="sa-light-btn" @click="openDetail(row)">查看详情</button>',
              '</div>',
            '</div>',

            '<div v-if="!filteredRows.length" class="sa-empty">暂无符合条件的空间预约申请</div>',
          '</div>',
        '</div>',

        '<a-modal v-model:visible="approvalVisible" title="审批 / 协调" :width="820" :footer="false">',
          '<div v-if="currentRow" class="sa-modal-body">',
            '<div v-if="currentRow.conflict" class="sa-conflict-panel">',
              '<strong>智能冲突诊断</strong>',
              '<p>{{ currentRow.conflictInfo }}</p>',
              '<div class="sa-rec-panel">',
                '<span>推荐处理方案</span>',
                '<a-radio-group v-model="recommendPlan" direction="vertical">',
                  '<a-radio value="changeRoom">改用 402 模拟病房，原预约时间不变</a-radio>',
                  '<a-radio value="changeTime">保留模拟病房，改至 6月15日 18:30—20:30</a-radio>',
                  '<a-radio value="manual">进入人工协调，由管理员线下确认</a-radio>',
                '</a-radio-group>',
              '</div>',
            '</div>',
            '<div class="sa-detail-grid">',
              '<div v-for="item in detailItems(currentRow)" :key="item.label" :class="{ wide: item.wide }">',
                '<span>{{ item.label }}</span><strong>{{ item.value }}</strong>',
              '</div>',
            '</div>',
            '<label class="sa-comment"><span>审批意见</span><a-textarea v-model="approvalComment" placeholder="填写审批意见、协调建议或驳回原因" :auto-size="{ minRows: 3, maxRows: 5 }"></a-textarea></label>',
            '<div class="sa-modal-actions">',
              '<a-button @click="approvalVisible = false">取消</a-button>',
              '<a-button status="danger" @click="rejectCurrent">驳回申请</a-button>',
              '<a-button type="primary" @click="approveCurrent">{{ currentRow.openingPlanId && currentRow.conflict ? \'采用方案并发起复核\' : \'通过审批\' }}</a-button>',
            '</div>',
          '</div>',
        '</a-modal>',

        '<a-modal v-model:visible="detailVisible" title="申请详情" :width="720" :footer="false">',
          '<div v-if="currentRow" class="sa-modal-body">',
            '<div class="sa-detail-grid">',
              '<div v-for="item in detailItems(currentRow)" :key="item.label" :class="{ wide: item.wide }">',
                '<span>{{ item.label }}</span><strong>{{ item.value }}</strong>',
              '</div>',
            '</div>',
            '<div class="sa-timeline">',
              '<div><i class="done"></i><strong>提交申请</strong><span>{{ currentRow.submitDate }} {{ currentRow.submitTime }}</span></div>',
              '<div><i :class="currentRow.status === \'rejected\' ? \'reject\' : \'done\'"></i><strong>{{ currentRow.status === \'rejected\' ? \'管理员驳回\' : currentRow.status === \'coordinating\' ? \'替代方案待教师复核\' : \'审核通过\' }}</strong><span>{{ currentRow.approveTime || \'待处理\' }}</span></div>',
            '</div>',
            '<div class="sa-modal-actions"><a-button type="primary" @click="detailVisible = false">关闭</a-button></div>',
          '</div>',
        '</a-modal>',
      '</section>'
    ].join('');
  }

  function boot() {
    renderShell();
    var lastRole = document.body.dataset.role;
    var lastActive = document.body.dataset.active;
    var obs = new MutationObserver(function () {
      var curRole = document.body.dataset.role;
      var curActive = document.body.dataset.active;
      if (curRole === lastRole && curActive === lastActive) return;
      lastRole = curRole;
      lastActive = curActive;
      renderShell();
    });
    obs.observe(document.body, { attributes: true, attributeFilter: ['data-role', 'data-active'] });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
}());
