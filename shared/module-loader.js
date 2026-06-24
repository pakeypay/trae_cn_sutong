(function () {
  var loaded = {};

  // Maps data-active page names to module resources (relative to shared/)
  var moduleMap = {
    // course-center module handles course pool and course audit
    '课程中心': { css: ['modules/course-center/course-center.css'], js: ['modules/course-center/course-center.js'] },
    '课程池': { css: ['modules/course-center/course-center.css'], js: ['modules/course-center/course-center.js'] },
    '课程审核': { css: ['modules/course-center/course-center.css'], js: ['modules/course-center/course-center.js'] },
    '开课计划': { css: ['modules/opening-plan/opening-plan.css'], js: ['modules/opening-plan/opening-plan.js'] },
    '报名情况': { css: ['modules/course-run/course-run.css'], js: ['modules/course-run/course-run.js'] },

    // scheduler-workbench
    '排课工作台': { css: ['modules/scheduler-workbench/scheduler-workbench.css', 'modules/scheduler-workbench/visual-scheduler.css'], js: ['modules/scheduler-workbench/scheduler-workbench.js'] },
    '排课管理': { css: ['modules/scheduler-workbench/scheduler-workbench.css', 'modules/scheduler-workbench/visual-scheduler.css'], js: ['modules/scheduler-workbench/scheduler-workbench.js'] },
    '可视化排课': { css: ['modules/scheduler-workbench/scheduler-workbench.css', 'modules/scheduler-workbench/visual-scheduler.css'], js: ['modules/scheduler-workbench/scheduler-workbench.js'] },
    '开课条件总览': { css: ['modules/launch-readiness/launch-readiness.css'], js: ['modules/launch-readiness/launch-readiness.js'] },

    // scheduled-course-list
    '已排课表': { css: ['modules/scheduled-course-list/scheduled-course-list.css'], js: ['modules/scheduled-course-list/scheduled-course-list.js'] },
    '已排课程管理': { css: ['modules/scheduled-course-list/scheduled-course-list.css'], js: ['modules/scheduled-course-list/scheduled-course-list.js'] },

    // material-management
    '物资工作台': { css: ['modules/material-management/material-management.css'], js: ['modules/material-management/material-management.js'] },
    '物资档案': { css: ['modules/material-management/material-management.css'], js: ['modules/material-management/material-management.js'] },
    '维修管理': { css: ['modules/material-management/material-management.css'], js: ['modules/material-management/material-management.js'] },
    '盘点管理': { css: ['modules/material-management/material-management.css'], js: ['modules/material-management/material-management.js'] },
    '课程使用和临时借用': { css: ['modules/material-management/material-management.css'], js: ['modules/material-management/material-management.js'] },
    '归还签收': { css: ['modules/material-management/material-management.css'], js: ['modules/material-management/material-management.js'] },

    // course-dev (extracted from admin course-center.html inline content)
    '课程开发': { css: ['modules/course-dev/course-dev.css'], js: ['modules/course-dev/course-dev.js'] },

    // space-reservation (teacher: venue + material requests)
    '场地和物资申请': { css: ['modules/space-reservation/space-reservation.css'], js: ['modules/space-data.js', 'modules/space-reservation/space-reservation.js'] },
    '场地与物资申请': { css: ['modules/space-reservation/space-reservation.css'], js: ['modules/space-data.js', 'modules/space-reservation/space-reservation.js'] },

    // service-hall
    '服务大厅': { css: ['modules/service-hall/service-hall.css'], js: ['modules/service-hall/service-hall.js'] },

    // space-approval (admin/scheduler: approve/reject room bookings)
    '空间预约审批': { css: ['modules/space-approval/space-approval.css'], js: ['modules/space-approval/space-approval.js'] },

    // space-assets (admin/scheduler: room inventory CRUD)
    '空间资产管理': { css: ['modules/space-assets/space-assets.css'], js: ['modules/space-assets/space-assets.js'] },

    // brand-display-management (admin/scheduler: class signs, large screens, notices)
    '班牌和大屏管理': { css: ['modules/brand-display-management/brand-display-management.css'], js: ['modules/brand-display-management/brand-display-management.js'] },

    // resource-library (unified cloud drive explorer)
    '教学资源库': { css: ['modules/resource-library/resource-library.css'], js: ['modules/resource-library/resource-library.js'] },

    // course-selection (student: choose courses and view timetable/cart)
    '可选课程': { css: ['modules/course-selection/course-selection.css'], js: ['modules/course-selection/course-selection.js'] },
    '我的选课': { css: ['modules/course-selection/course-selection.css'], js: ['modules/course-selection/course-selection.js'] },
    '选课报名': { css: ['modules/course-selection/course-selection.css'], js: ['modules/course-selection/course-selection.js'] },

    // timetable modules
    '我的课表': { css: ['modules/timetable/timetable.css'], js: ['modules/timetable/timetable.js'] },
    '年度课表': { css: ['modules/timetable/timetable.css'], js: ['modules/timetable/timetable.js'] },

    // my-teaching module
    '我的课程': { css: ['modules/my-teaching/my-teaching.css'], js: ['modules/my-teaching/my-teaching.js'] },
    '我的教学': { css: ['modules/my-teaching/my-teaching.css'], js: ['modules/my-teaching/my-teaching.js'] },
    '临床带教': { css: ['modules/my-teaching/my-teaching.css'], js: ['modules/my-teaching/my-teaching.js'] },
    '我的授课': { css: ['modules/my-teaching/my-teaching.css', 'modules/my-teaching/my-teaching-content.css'], js: ['modules/my-teaching/my-teaching.js'] },

    // teacher-db (Teacher Database for Super Admin)
    '师资库': { css: ['modules/teacher-db/teacher-db.css'], js: ['modules/teacher-db/teacher-db.js'] },

    // teacher homepage dashboard module
    '首页': { css: ['modules/dashboard/dashboard.css'], js: ['modules/dashboard/dashboard.js'] },
    '工作台': { css: ['modules/dashboard/dashboard.css'], js: ['modules/dashboard/dashboard.js'] },
    '数据大屏': { css: ['modules/dashboard-screen/dashboard-screen.css'], js: ['modules/space-data.js', 'modules/scheduler-workbench/pending-course-list.mock.js', 'modules/dashboard-screen/dashboard-screen.js'] },

    // assessment and evaluation module
    '作业考试': { css: ['modules/assessment/assessment.css'], js: ['modules/assessment/assessment.js'] },
    '成绩评价': { css: ['modules/assessment/assessment.css'], js: ['modules/assessment/assessment.js'] },
    '评估任务': { css: ['modules/assessment/assessment.css'], js: ['modules/assessment/assessment.js'] }
  };

  function getBasePath() {
    var script = document.querySelector('script[src$="module-loader.js"]');
    return script ? script.src.replace(/module-loader\.js$/, '') : '../shared/';
  }

  function loadCSS(url) {
    if (loaded[url]) return Promise.resolve();
    return new Promise(function (resolve, reject) {
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      link.onload = function () { loaded[url] = true; resolve(); };
      link.onerror = reject;
      document.head.appendChild(link);
    });
  }

  function loadJS(url) {
    if (loaded[url]) return Promise.resolve();
    return new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = url;
      script.onload = function () { loaded[url] = true; resolve(); };
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }

  function loadModule(pageName) {
    var config = moduleMap[pageName];
    if (!config) return Promise.resolve(false);

    var basePath = getBasePath();
    var promises = [];

    (config.css || []).forEach(function (path) {
      promises.push(loadCSS(basePath + path));
    });
    (config.js || []).forEach(function (path) {
      promises.push(loadJS(basePath + path));
    });

    return Promise.all(promises).then(function () { return true; });
  }

  window.ModuleLoader = { loadModule: loadModule };
}());
