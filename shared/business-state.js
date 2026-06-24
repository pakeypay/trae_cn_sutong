(function () {
  'use strict';

  var implementationChecks = [
    { key: 'objective', label: '教学目标与授课对象' },
    { key: 'content', label: '教学内容与实施流程' },
    { key: 'assessment', label: '评估方式与通过标准' },
    { key: 'teacher', label: '授课教师与人员准备' },
    { key: 'venue', label: '场地类型与环境要求' },
    { key: 'equipment', label: '设备、模型与耗材' },
    { key: 'materials', label: '课前资料与附件' },
    { key: 'approval', label: '课程审核与版本确认' }
  ];

  var courseStates = {
    '儿童导尿术（男性）': {
      scenario: 'draft-incomplete',
      stageCode: 'development',
      stageLabel: '开发中',
      tone: 'info',
      nextRole: 'teacher',
      ownerLabel: '课程负责人：刘国强',
      dueLabel: '建议在 6 月 12 日 17:00 前完成',
      nextAction: '补齐实施条件后提交审核',
      actionLabel: '继续完善',
      actionType: 'edit',
      downstream: '未满足提交审核条件，暂不会进入课程池和排课。',
      checks: {
        objective: 'complete',
        content: 'complete',
        assessment: 'missing',
        teacher: 'complete',
        venue: 'complete',
        equipment: 'missing',
        materials: 'missing',
        approval: 'pending'
      },
      blockers: [
        '尚未配置技能评估方式与通过标准',
        '关键耗材数量待确认',
        '课前学习资料尚未上传'
      ]
    },
    '心肺复苏理论基础（PALS）': {
      scenario: 'waiting-review',
      stageCode: 'review',
      stageLabel: '待审核',
      tone: 'waiting',
      nextRole: 'admin',
      ownerLabel: '下一责任人：教务管理员',
      dueLabel: '预计 2 个工作日内完成审核',
      nextAction: '等待教务管理员审核课程标准',
      actionLabel: '查看审核进度',
      actionType: 'view',
      downstream: '审核通过后才能进入课程池并创建开课计划。',
      checks: {
        objective: 'complete',
        content: 'complete',
        assessment: 'complete',
        teacher: 'complete',
        venue: 'complete',
        equipment: 'complete',
        materials: 'complete',
        approval: 'pending'
      },
      blockers: []
    },
    '儿科AHA-PALS团队情境模拟训练': {
      scenario: 'partial-resource',
      stageCode: 'resource-blocked',
      stageLabel: '资源存在缺口',
      tone: 'warning',
      nextRole: 'material',
      ownerLabel: '下一责任人：物资管理员',
      dueLabel: '需在 6 月 11 日 16:00 前确定方案',
      nextAction: '确认替代设备或调整开课规模',
      actionLabel: '查看资源缺口',
      actionType: 'resource',
      downstream: '课程已审核，但资源缺口解决前不能标记为具备开课条件。',
      checks: {
        objective: 'complete',
        content: 'complete',
        assessment: 'complete',
        teacher: 'complete',
        venue: 'complete',
        equipment: 'blocked',
        materials: 'complete',
        approval: 'complete'
      },
      blockers: [
        '婴儿模拟人当前可用 2 台，课程要求 4 台',
        '需确认替代设备，或将 32 名学员拆分为两个课次'
      ]
    },
    '儿科坏消息告知': {
      scenario: 'ready-for-plan',
      stageCode: 'ready-for-plan',
      stageLabel: '可创建开课计划',
      tone: 'success',
      nextRole: 'admin',
      ownerLabel: '下一责任人：教务管理员',
      dueLabel: '课程标准已具备实施条件',
      nextAction: '确定学员范围、开课次数与时间窗口',
      actionLabel: '创建开课计划',
      actionType: 'create-plan',
      downstream: '创建开课计划后，课程将进入排课与教师确认环节。',
      checks: {
        objective: 'complete',
        content: 'complete',
        assessment: 'complete',
        teacher: 'complete',
        venue: 'complete',
        equipment: 'complete',
        materials: 'complete',
        approval: 'complete'
      },
      blockers: []
    },
    '新生儿气管插管术': {
      scenario: 'course-revision',
      stageCode: 'revision',
      stageLabel: '审核返修',
      tone: 'danger',
      nextRole: 'teacher',
      ownerLabel: '下一责任人：课程负责人陆国平',
      dueLabel: '请在 6 月 13 日 12:00 前重新提交',
      nextAction: '根据审核意见补充课程目标与考核标准',
      actionLabel: '查看返修项',
      actionType: 'edit',
      downstream: '返修通过前不能创建开课计划，已有草稿安排不会被发布。',
      checks: {
        objective: 'blocked',
        content: 'complete',
        assessment: 'blocked',
        teacher: 'complete',
        venue: 'complete',
        equipment: 'complete',
        materials: 'complete',
        approval: 'blocked'
      },
      blockers: [
        '教学目标层级不清晰，无法判断适用年级',
        '缺少技能考核通过标准',
        '审核意见要求补充高风险操作的安全说明'
      ]
    }
  };

  var roleLabels = {
    teacher: '教师',
    admin: '教务管理员',
    scheduler: '排课与场地管理员',
    material: '物资管理员',
    student: '学员'
  };
  var schedulingHandoffStorageKey = 'teaching-pilot-scheduling-handoffs-v1';
  var teacherConfirmationStorageKey = 'teaching-pilot-teacher-confirmations-v1';
  var resourceAssuranceStorageKey = 'teaching-pilot-resource-assurance-v1';
  var resourceAssuranceSeed = {
    '儿科坏消息告知': {
      courseName: '儿科坏消息告知',
      sessionId: 'SESSION-PLAN-2026-0001-01',
      openingPlanId: 'PLAN-2026-0001',
      sourceStatus: 'teacher-confirmed',
      sourceLabel: '教师已确认课次草案',
      scheduledDate: '2026-10-26',
      scheduledDateLabel: '10 月 26 日（周一）',
      scheduledTime: '12:30 — 13:30',
      teacher: '刘国强',
      audience: '住培第一年 · 通识',
      overallStatus: 'partial',
      overallLabel: '资源部分满足',
      currentOwner: '排课与场地管理员 / 物资管理员',
      deadline: '2026-10-23 17:00',
      nextAction: '确认空间替代方案，并补齐或替代标准化病人角色卡',
      space: {
        status: 'partial',
        statusLabel: '需确认替代场地',
        owner: '排课与场地管理员',
        requested: '301 PBL 教室',
        issue: '301 PBL 教室录播系统在该时段安排维护，不能满足课程复盘要求。',
        alternative: '改用 302 PBL 教室，时间不变；场地变化后需教师重新确认。',
        requiresTeacherReconfirm: true
      },
      material: {
        status: 'partial',
        statusLabel: '角色卡部分满足',
        owner: '物资管理员',
        issue: '标准化病人角色卡需要 6 套，当前可用 4 套。',
        alternative: '保留 4 套纸质角色卡，另外 2 组使用电子角色卡。',
        requiresTeacherReconfirm: false,
        items: [
          { name: '录播与回看设备', need: 1, available: 1, status: 'ready' },
          { name: '标准化病人角色卡', need: 6, available: 4, status: 'partial' },
          { name: '沟通观察记录表', need: 20, available: 20, status: 'ready' }
        ]
      },
      records: [
        { time: '2026-06-10 10:35', text: '教师确认课次草案，系统生成空间与物资准备任务' },
        { time: '2026-06-10 10:36', text: '资源预检发现空间维护冲突与角色卡数量缺口' }
      ],
      businessVersion: 'pilot-course-to-first-session-v0.5'
    }
  };

  function getCourseState(name) {
    return courseStates[name] || {
      scenario: 'unmapped',
      stageCode: 'development',
      stageLabel: '待梳理',
      tone: 'neutral',
      nextRole: 'teacher',
      ownerLabel: '下一责任人待确认',
      dueLabel: '尚未设置处理时间',
      nextAction: '补充课程实施条件与流程状态',
      actionLabel: '查看详情',
      actionType: 'view',
      downstream: '当前课程尚未纳入首个端到端试点。',
      checks: {},
      blockers: []
    };
  }

  function getCourseChecks(name) {
    var state = getCourseState(name);
    return implementationChecks.map(function (item) {
      return {
        key: item.key,
        label: item.label,
        status: state.checks[item.key] || 'pending'
      };
    });
  }

  function getReadiness(name) {
    var checks = getCourseChecks(name);
    var completed = checks.filter(function (item) { return item.status === 'complete'; }).length;
    return {
      completed: completed,
      total: checks.length,
      percent: Math.round((completed / checks.length) * 100)
    };
  }

  function getSchedulingHandoffs() {
    try {
      var records = JSON.parse(window.localStorage.getItem(schedulingHandoffStorageKey) || '{}');
      return records && typeof records === 'object' ? records : {};
    } catch (_) {
      return {};
    }
  }

  function getSchedulingHandoff(name) {
    return getSchedulingHandoffs()[name] || null;
  }

  function recordSchedulingHandoff(name, detail) {
    var state = getCourseState(name);
    var readiness = getReadiness(name);
    if (state.stageCode !== 'ready-for-plan' || state.blockers.length || readiness.completed !== readiness.total) {
      return {
        ok: false,
        reason: state.blockers[0] || '课程尚未满足进入排课的全部条件'
      };
    }

    var records = getSchedulingHandoffs();
    var handoff = {
      courseName: name,
      sourceStage: state.stageLabel,
      sourceVersion: detail && detail.sourceVersion ? detail.sourceVersion : '课程标准 v1.0',
      openingPlanId: detail && detail.openingPlanId ? detail.openingPlanId : 'PLAN-2026-0001',
      openingPlanStatus: '待排课',
      requestedTimeWindow: detail && detail.requestedTimeWindow ? detail.requestedTimeWindow : '2026 年 7 月，工作日下午',
      planName: detail && detail.planName ? detail.planName : '2026 年住培一年级沟通技能培训',
      audience: detail && detail.audience ? detail.audience : '住培第一年 · 通识',
      capacity: detail && detail.capacity ? detail.capacity : 12,
      plannedSessions: detail && detail.plannedSessions ? detail.plannedSessions : 1,
      preferredTime: detail && detail.preferredTime ? detail.preferredTime : '工作日午间 12:30-13:30',
      schedulingPreference: detail && detail.schedulingPreference ? detail.schedulingPreference : '优先安排 PBL 教室，避开周五下午',
      notes: detail && detail.notes ? detail.notes : '',
      enteredAt: detail && detail.enteredAt ? detail.enteredAt : new Date().toLocaleString('zh-CN', { hour12: false }),
      handedOffBy: detail && detail.handedOffBy ? detail.handedOffBy : '教务管理员',
      currentStage: '待排课',
      currentOwner: '排课与场地管理员',
      nextAction: '收集教师可授课时间并生成候选方案',
      completedChecks: readiness.completed,
      totalChecks: readiness.total,
      businessVersion: 'pilot-course-to-first-session-v0.5'
    };

    records[name] = handoff;
    try {
      window.localStorage.setItem(schedulingHandoffStorageKey, JSON.stringify(records));
    } catch (_) {
      return { ok: true, handoff: handoff, persisted: false };
    }
    return { ok: true, handoff: handoff, persisted: true };
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function getResourceAssurances() {
    var records = clone(resourceAssuranceSeed);
    try {
      var stored = JSON.parse(window.localStorage.getItem(resourceAssuranceStorageKey) || '{}');
      Object.keys(stored || {}).forEach(function (name) {
        records[name] = stored[name];
      });
    } catch (_) {}
    return records;
  }

  function getResourceAssurance(name) {
    var confirmation = getTeacherConfirmation(name);
    if (!confirmation || confirmation.status !== 'teacher-confirmed') return null;
    return getResourceAssurances()[name] || null;
  }

  function updateResourceAssurance(name, area, patch) {
    if (area !== 'space' && area !== 'material') {
      return { ok: false, reason: '资源任务类型无效' };
    }
    var confirmation = getTeacherConfirmation(name);
    if (!confirmation || confirmation.status !== 'teacher-confirmed') {
      return { ok: false, reason: '教师尚未确认课次草案，不能生成或更新资源任务' };
    }
    var records = getResourceAssurances();
    var record = records[name];
    if (!record) {
      return { ok: false, reason: '未找到对应课次的资源保障任务' };
    }

    var areaPatch = Object.assign({}, patch || {});
    delete areaPatch.recordText;
    record[area] = Object.assign({}, record[area], areaPatch);
    var statuses = [record.space.status, record.material.status];
    if (statuses.indexOf('blocked') !== -1) {
      record.overallStatus = 'blocked';
      record.overallLabel = '资源阻塞';
      record.currentOwner = record.space.status === 'blocked' ? record.space.owner : record.material.owner;
      record.nextAction = '解决阻塞项后重新执行资源检查';
    } else if (statuses.every(function (status) { return status === 'ready'; })) {
      record.overallStatus = 'ready';
      record.overallLabel = '资源已就绪';
      record.currentOwner = '排课与场地管理员';
      record.nextAction = '锁定课次并发布正式课表';
    } else {
      record.overallStatus = 'partial';
      record.overallLabel = '资源部分满足';
      record.currentOwner = '排课与场地管理员 / 物资管理员';
      record.nextAction = '继续处理尚未满足的空间或物资任务';
    }
    record.records = record.records || [];
    record.records.unshift({
      time: new Date().toLocaleString('zh-CN', { hour12: false }),
      text: patch && patch.recordText ? patch.recordText : (area === 'space' ? '空间资源任务已更新' : '物资准备任务已更新')
    });

    try {
      window.localStorage.setItem(resourceAssuranceStorageKey, JSON.stringify(records));
    } catch (_) {
      return { ok: true, record: record, persisted: false };
    }
    return { ok: true, record: record, persisted: true };
  }

  function getTeacherConfirmations() {
    try {
      var records = JSON.parse(window.localStorage.getItem(teacherConfirmationStorageKey) || '{}');
      return records && typeof records === 'object' ? records : {};
    } catch (_) {
      return {};
    }
  }

  function getTeacherConfirmation(name) {
    return getTeacherConfirmations()[name] || null;
  }

  function recordTeacherConfirmation(name, detail) {
    var status = detail && detail.status;
    if (status !== 'teacher-confirmed' && status !== 'teacher-conflict') {
      return { ok: false, reason: '教师确认状态无效' };
    }
    var records = getTeacherConfirmations();
    var record = {
      courseName: name,
      openingPlanId: detail.openingPlanId || 'PLAN-2026-0001',
      sessionId: detail.sessionId || 'SESSION-PLAN-2026-0001-01',
      status: status,
      statusLabel: status === 'teacher-confirmed' ? '教师已确认' : '教师反馈冲突',
      conflictReason: detail.conflictReason || '',
      conflictNote: detail.conflictNote || '',
      handledAt: detail.handledAt || new Date().toLocaleString('zh-CN', { hour12: false }),
      nextOwner: '排课与场地管理员',
      nextAction: status === 'teacher-confirmed'
        ? '生成空间与物资准备任务'
        : '根据教师反馈调整候选课次',
      businessVersion: 'pilot-course-to-first-session-v0.5'
    };
    records[name] = record;
    try {
      window.localStorage.setItem(teacherConfirmationStorageKey, JSON.stringify(records));
    } catch (_) {
      return { ok: true, record: record, persisted: false };
    }
    return { ok: true, record: record, persisted: true };
  }

  window.TeachingBusiness = {
    version: 'pilot-course-to-first-session-v0.5',
    pilotName: '课程开发完成后，进入首次授课准备',
    implementationChecks: implementationChecks,
    courseStates: courseStates,
    roleLabels: roleLabels,
    schedulingHandoffStorageKey: schedulingHandoffStorageKey,
    teacherConfirmationStorageKey: teacherConfirmationStorageKey,
    resourceAssuranceStorageKey: resourceAssuranceStorageKey,
    getCourseState: getCourseState,
    getCourseChecks: getCourseChecks,
    getReadiness: getReadiness,
    getSchedulingHandoff: getSchedulingHandoff,
    recordSchedulingHandoff: recordSchedulingHandoff,
    getTeacherConfirmation: getTeacherConfirmation,
    recordTeacherConfirmation: recordTeacherConfirmation,
    getResourceAssurance: getResourceAssurance,
    updateResourceAssurance: updateResourceAssurance
  };
}());
