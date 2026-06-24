(function () {
  'use strict';

  var semanticStates = {
    neutral: { label: '普通', tone: 'neutral', phase: 'stable', canContinue: true },
    draft: { label: '草稿', tone: 'info', phase: 'active', canContinue: true },
    pending: { label: '待处理', tone: 'waiting', phase: 'waiting', canContinue: false },
    coordinating: { label: '协调中', tone: 'info', phase: 'active', canContinue: false },
    partial: { label: '部分满足', tone: 'warning', phase: 'active', canContinue: false },
    ready: { label: '已就绪', tone: 'success', phase: 'ready', canContinue: true },
    pass: { label: '通过', tone: 'success', phase: 'complete', canContinue: true },
    approved: { label: '已通过', tone: 'success', phase: 'complete', canContinue: true },
    published: { label: '已发布', tone: 'success', phase: 'complete', canContinue: true },
    complete: { label: '已完成', tone: 'success', phase: 'complete', canContinue: true },
    blocked: { label: '阻塞', tone: 'danger', phase: 'blocked', canContinue: false },
    conflict: { label: '存在冲突', tone: 'danger', phase: 'blocked', canContinue: false },
    rejected: { label: '已驳回', tone: 'danger', phase: 'blocked', canContinue: false },
    invalidated: { label: '已失效', tone: 'warning', phase: 'closed', canContinue: false },
    cancelled: { label: '已取消', tone: 'neutral', phase: 'closed', canContinue: false },
    closed: { label: '已关闭', tone: 'neutral', phase: 'closed', canContinue: false },
    history: { label: '保留历史', tone: 'neutral', phase: 'closed', canContinue: false },
    'not-generated': { label: '尚未生成', tone: 'neutral', phase: 'waiting', canContinue: false },
    'awaiting-teacher-reconfirm': { label: '待教师复核', tone: 'waiting', phase: 'waiting', canContinue: false },
    'teacher-confirmed': { label: '教师已确认', tone: 'success', phase: 'complete', canContinue: true },
    'teacher-conflict': { label: '教师反馈冲突', tone: 'danger', phase: 'blocked', canContinue: false },
    'ready-for-plan': { label: '可创建开课计划', tone: 'success', phase: 'ready', canContinue: true },
    'resource-blocked': { label: '资源存在缺口', tone: 'warning', phase: 'blocked', canContinue: false },
    development: { label: '开发中', tone: 'info', phase: 'active', canContinue: true },
    review: { label: '待审核', tone: 'waiting', phase: 'waiting', canContinue: false },
    revision: { label: '审核返修', tone: 'danger', phase: 'blocked', canContinue: false }
  };

  var domainAliases = {
    readinessCheck: {
      pass: 'pass',
      pending: 'pending',
      partial: 'partial',
      blocked: 'blocked',
      invalidated: 'invalidated',
      closed: 'closed',
      history: 'history'
    },
    spaceApproval: {
      pending: 'pending',
      coordinating: 'coordinating',
      approved: 'approved',
      rejected: 'rejected'
    },
    resourceAssurance: {
      'not-generated': 'not-generated',
      partial: 'partial',
      ready: 'ready',
      blocked: 'blocked',
      'awaiting-teacher-reconfirm': 'awaiting-teacher-reconfirm'
    },
    teacherConfirmation: {
      'teacher-confirmed': 'teacher-confirmed',
      'teacher-conflict': 'teacher-conflict'
    },
    courseLifecycle: {
      development: 'development',
      review: 'review',
      revision: 'revision',
      'resource-blocked': 'resource-blocked',
      'ready-for-plan': 'ready-for-plan'
    }
  };

  function resolve(code, domain) {
    var canonical = domain && domainAliases[domain] && domainAliases[domain][code]
      ? domainAliases[domain][code]
      : code;
    var state = semanticStates[canonical] || semanticStates.neutral;
    return Object.assign({ code: code, canonical: canonical }, state);
  }

  function label(code, domain) {
    return resolve(code, domain).label;
  }

  function tone(code, domain) {
    return resolve(code, domain).tone;
  }

  window.TeachingStatus = {
    version: 'status-dictionary-v1',
    states: semanticStates,
    domains: domainAliases,
    resolve: resolve,
    label: label,
    tone: tone
  };
}());
