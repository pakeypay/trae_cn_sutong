(function () {
  var expandedNavGroups = {};

  function escapeHtml(value) {
    return String(value).replace(/[&<>"]/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char];
    });
  }

  function getRole() {
    var key = document.body.dataset.role || 'teacher';
    return window.RoleNav.roles[key] || window.RoleNav.roles.teacher;
  }

  function childLabel(child) {
    return typeof child === 'string' ? child : child.label;
  }

  function childChildren(child) {
    return child && typeof child === 'object' && Array.isArray(child.children) ? child.children : null;
  }

  function isActive(item, active) {
    if (item.label === active) return true;
    if (!Array.isArray(item.children)) return false;
    return item.children.some(function (child) {
      if (childLabel(child) === active) return true;
      var sub = childChildren(child);
      return Array.isArray(sub) && sub.indexOf(active) !== -1;
    });
  }

  function assetUrl(name) {
    var script = document.currentScript || document.querySelector('script[src*="nav-render.js"]');
    return new URL('assets/' + name, script.src).href;
  }

  function renderSidebarHtml(role, active) {
    var icons = window.RoleNav.icons;
    var logoUrl = assetUrl('logo55.png');
    var avatarUrl = assetUrl('doctor-avatar-middle-aged.png');
    var items = role.navItems.map(function (item) {
      var activeItem = isActive(item, active);
      var hasChildren = Array.isArray(item.children) && item.children.length > 0;
      var expanded = hasChildren && (activeItem || expandedNavGroups[item.label]);
      var childHtml = '';
      if (hasChildren) {
        childHtml = '<div class="submenu">' + item.children.map(function (child, index) {
          var label = childLabel(child);
          var sub = childChildren(child);
          var hasSub = Array.isArray(sub) && sub.length > 0;
          var selected = active === item.label ? index === 0 : label === active;
          var subExpanded = hasSub && (active === label || expandedNavGroups[item.label + '::' + label]);
          var thirdHtml = hasSub ? '<div class="third-submenu' + (subExpanded ? ' expanded' : '') + '">' + sub.map(function (leaf) {
            var leafSelected = leaf === active;
            return '<div class="submenu-item third-leaf' + (leafSelected ? ' selected' : '') + '">' + escapeHtml(leaf) + '</div>';
          }).join('') + '</div>' : '';
          return '<div class="submenu-group' + (hasSub && subExpanded ? ' active' : '') + '">' +
            '<div class="submenu-item' + (selected ? ' selected' : '') + '" data-parent="' + escapeHtml(item.label) + '">' +
              escapeHtml(label) +
              (hasSub ? '<span class="submenu-caret">' + icons.chevron + '</span>' : '') +
            '</div>' + thirdHtml + '</div>';
        }).join('') + '</div>';
      }

      return '<div class="nav-group' + (expanded ? ' expanded' : '') + '">' +
        '<div class="nav-item' + (activeItem ? ' active' : '') + '">' +
          '<span class="nav-icon">' + item.icon + '</span>' +
          '<span>' + escapeHtml(item.label) + '</span>' +
          (hasChildren ? '<span class="nav-caret">' + icons.chevron + '</span>' : '') +
        '</div>' + childHtml + '</div>';
    }).join('');

    return '<aside class="sidebar">' +
      '<div class="brand"><div class="brand-logo"><img src="' + logoUrl + '" alt="医院标识"></div><div class="brand-copy"><strong>国家儿童医学中心</strong><span>复旦儿科</span></div><button class="collapse-btn" aria-label="收起侧边栏">' + icons.menuFold + '</button></div>' +
      '<nav class="nav">' + items + '</nav>' +
      '<div class="user-card"><div class="avatar"><img src="' + avatarUrl + '" alt="' + escapeHtml(role.userName) + '头像"></div><div class="user-copy"><strong>' + escapeHtml(role.userName) + '</strong><span>' + escapeHtml(role.userRole) + '</span></div><button class="settings-btn" aria-label="设置">' + icons.settings + '</button></div>' +
    '</aside>';
  }

  function renderPreviewCard(role, active) {
    var rows = role.navItems.map(function (item) {
      var entrances = role.moduleEntrances && role.moduleEntrances[item.label];
      var text = entrances ? entrances.join(' / ') : '首页、数据、待办或模块总览';
      return '<div class="summary-row"><strong>' + escapeHtml(item.label) + '</strong><span>' + escapeHtml(text) + '</span></div>';
    }).join('');

    var notes = role.notes.map(function (note) {
      return '<li>' + escapeHtml(note) + '</li>';
    }).join('');

    return '<section class="preview-card">' +
      '<div class="preview-head"><div><p class="eyebrow">角色导航原型</p><h1>' + escapeHtml(active) + '</h1><p>当前角色：' + escapeHtml(role.roleName) + '。本页面只用于确认左侧导航结构与选中态，不承载完整业务功能。</p></div><span class="role-pill">' + escapeHtml(role.userRole) + '</span></div>' +
      '<div style="background:linear-gradient(135deg, rgba(22,93,255,0.06) 0%, rgba(114,46,209,0.06) 100%); border:1px solid rgba(22,93,255,0.15); border-radius:12px; padding:16px; margin: 0 24px 20px 24px; display:flex; justify-content:space-between; align-items:center; box-shadow:0 4px 14px rgba(0,0,0,0.02);">' +
        '<div><strong style="font-size:14px; color:#1d2129; display:block; margin-bottom:4px;"><span style="margin-right:6px; color:#165dff; display:inline-flex; vertical-align:middle;">' + icons.smartphone + '</span> 全新打磨的 100% 移动端 WebView 适配</strong>' +
        '<span style="font-size:12px; color:#4e5969;">已根据移动端使用习惯重构了所有菜单模块，支持磨砂玻璃、数字手写签名、热力避碰与防伪令牌。</span></div>' +
        '<a href="mobile_index.html" target="_blank" style="display:inline-flex; align-items:center; gap:8px; padding:10px 20px; background:linear-gradient(135deg, #165dff 0%, #0052ff 100%); color:#fff; border-radius:8px; text-decoration:none; font-weight:700; font-size:13.5px; box-shadow:0 4px 12px rgba(22,93,255,0.25); transition:transform 0.15s ease;">进入手机版 ➔</a>' +
      '</div>' +
      '<div class="preview-body"><section class="panel"><header><h2>左侧模块与页面内入口</h2></header><div class="nav-summary">' + rows + '</div></section>' +
      '<section class="panel"><header><h2>入口放置原则</h2></header><ul class="note-list">' + notes + '<li>左侧导航只放稳定业务域；状态、任务、筛选、快捷动作放到首页、模块页或详情页。</li><li>消息通知、数据看板、今日待办、冲突检查、确认进度不放入左侧导航。</li></ul></section></div>' +
    '</section>';
  }

  function serviceIcon(index) {
    // Fallback icon list for unmatched names
    var fallbackIcons = ['calendar', 'book', 'check', 'edit', 'folder', 'users', 'chart', 'space', 'package', 'award', 'settings', 'stethoscope'];
    return window.RoleNav.icons[fallbackIcons[index % fallbackIcons.length]] || window.RoleNav.icons.grid;
  }

  function iconForLabel(label) {
    var icons = window.RoleNav.icons;
    var map = {
      '今日待办': icons.clipboardList,
      '重点工作': icons.star,
      '工作推进': icons.target,
      '师资情况': icons.users,
      '学员情况': icons.user,
      '课程情况': icons.book,
      '评估情况': icons.check,
      '物资情况': icons.package,
      '空间情况': icons.building,
      '轮转安排': icons.calendar,
      '教学活动': icons.presentation,
      '课程开发': icons.edit,
      '课程池': icons.database,
      '课程实施': icons.list,
      '排课工作台': icons.calendar,
      '开课条件总览': icons.table,
      '已排课表': icons.list,
      '报名情况': icons.userPlus,
      '空间预约审批': icons.building,
      '空间资产管理': icons.box,
      '班牌和大屏管理': icons.presentation,
      '物资工作台': icons.package,
      '物资档案': icons.folder,
      '维修管理': icons.refresh,
      '盘点管理': icons.clipboard,
      '课程使用和临时借用': icons.box,
      '归还签收': icons.check,
      '个人云盘': icons.folder,
      '科室云盘': icons.folder,
      '公共库': icons.folder,
      '师资管理': icons.users,
      '学员管理': icons.user,
      '科研成果': icons.award,
      '教学奖励': icons.trophy,
      '学员评价体系配置': icons.target,
      '教师评价体系配置': icons.target,
      '评估工具库': icons.clipboard,
      '评估任务中心': icons.list,
      '评估结果与分析': icons.chart,
      '可视化排课': icons.calendar,
      '冲突检查': icons.check,
      '教师确认': icons.user,
      '通知发送': icons.edit,
      '调课 / 改课记录': icons.refresh,
      '占用日历': icons.calendar,
      '空间冲突': icons.check,
      '临时场地调整': icons.edit,
      '使用记录': icons.list,
      '空间利用率': icons.chart,
      '场地预约（含物资）': icons.building,
      '我的申请': icons.list,
      '待排课程': icons.calendar,
      '已排课程管理': icons.list,
      '物资申请（不包含场地）': icons.package,
      '校外开放课程': icons.book,
      '我的报名': icons.list,
      '候补状态': icons.clock,
      '已报名': icons.calendar,
      '进行中': icons.refresh,
      '已完成': icons.check,
      '课次详情': icons.book,
      '我的证书': icons.award,
      '证书查询': icons.check,
      '证书下载': icons.edit,
      '基础标签': icons.folder,
      '业务标签': icons.folder,
      '系统规则标签': icons.settings,
      '模型配置': icons.settings,
      'API Key 授权': icons.settings,
      '调用日志': icons.list,
      '用户管理': icons.users,
      '角色权限': icons.user,
      '内容发布': icons.edit,
      '公告配置': icons.edit,
      '流量统计': icons.chart,
      '安全加固': icons.settings,
      '备份恢复': icons.refresh,
      '第三方集成': icons.settings,
      '我的授课': icons.calendar,
      '课程草稿': icons.edit,
      '已提交课程': icons.check,
      '已发布课程': icons.book,
      '新建课程': icons.edit,
      '上传 / 生成教案': icons.edit,
      '教学示范库': icons.folder,
      '院级公共库': icons.folder,
      '成绩录入': icons.edit,
      '学生评价': icons.check,
      '课程反馈': icons.list,
      '作业批改': icons.edit,
      '成果申报': icons.award,
      '我的学员画像': icons.user,
      '我的画像': icons.user,
      '待完成任务': icons.clipboardList,
      '学习进度': icons.chart,
      '今日日程': icons.calendar,
      '快捷应用': icons.grid,
      '我的轮转': icons.calendar,
      '我的课程': icons.book,
      '自适应学习 ⚡': icons.star,
      '可选课程': icons.book,
      '报名审核状态': icons.list,
      '自主训练': icons.refresh,
      'OSCE': icons.check,
      '作业考试': icons.clipboard,
      '成绩评价': icons.check,
      '课程评价': icons.list,
      '老师评价': icons.user,
      '胜任力框架配置': icons.target,
      'EPA 评价框架': icons.target,
      '培训目标管理': icons.target,
      '评估表单': icons.clipboard,
      '理论题库': icons.database,
      '实操录评': icons.check,
      '评估学员': icons.user,
      '评估教师': icons.user,
      '评估教学活动': icons.presentation,
      '评估课程': icons.book,
      '综合数据看板': icons.chart,
      '学员画像': icons.user,
      '教师画像': icons.user,
      '教学质量分析': icons.chart,
    };
    return map[label] || null;
  }

  function getServices(role) {
    var services = [];
    Object.keys(role.moduleEntrances || {}).forEach(function (category) {
      var entrances = role.moduleEntrances[category] || [];
      entrances.forEach(function (label) {
        services.push({
          label: label,
          category: category,
          description: '进入' + category + '，办理或查看“' + label + '”相关业务。'
        });
      });
    });
    return services;
  }

  function renderServiceHall(role) {
    var services = getServices(role);
    var categories = ['全部'].concat(Object.keys(role.moduleEntrances || {}));
    var common = services.slice(0, 3);

    // Group services by category
    var servicesByCategory = {};
    services.forEach(function (item) {
      if (!servicesByCategory[item.category]) {
        servicesByCategory[item.category] = [];
      }
      servicesByCategory[item.category].push(item);
    });

    var groupsHtml = Object.keys(servicesByCategory).map(function (category, groupIdx) {
      var catServices = servicesByCategory[category];
      var cardsHtml = catServices.map(function (item, index) {
        var svcIcon = iconForLabel(item.label) || serviceIcon(index);
        return '<button class="service-card" data-category="' + escapeHtml(item.category) + '" data-search="' + escapeHtml(item.label + ' ' + item.category) + '" data-service="' + escapeHtml(item.label) + '">' +
          '<span class="service-icon tone-' + (index % 6) + '">' + svcIcon + '</span><span class="service-copy"><strong>' + escapeHtml(item.label) + '</strong><small>' + escapeHtml(item.description) + '</small></span>' +
        '</button>';
      }).join('');

      return '<div class="service-group" data-category="' + escapeHtml(category) + '">' +
        '<hr class="service-group-divider" style="display: none;">' +
        '<div class="service-group-header">' +
          '<span class="service-group-title">' + escapeHtml(category) + '</span>' +
        '</div>' +
        '<div class="service-grid">' + cardsHtml + '</div>' +
      '</div>';
    }).join('');

    return '<section class="service-hall">' +
      '<div class="service-top-bar">' +
        '<div class="service-title">' +
          '<strong>工作台</strong>' +
          '<span>全部服务</span>' +
        '</div>' +
        '<label class="service-search">' + window.RoleNav.icons.grid + '<input type="search" placeholder="搜索应用、服务及自助办理事项..." aria-label="搜索服务"></label>' +
      '</div>' +
      '<div class="service-content">' +
        '<section class="common-section"><h2>常用服务</h2><div class="common-grid">' +
          common.map(function (item, index) {
            var svcIcon = iconForLabel(item.label) || serviceIcon(index);
            return '<button class="common-card" data-service="' + escapeHtml(item.label) + '"><span class="service-icon tone-' + (index % 6) + '">' + svcIcon + '</span><strong>' + escapeHtml(item.label) + '</strong></button>';
          }).join('') +
          '<button class="common-card add-common"><span class="add-icon">＋</span><strong>添加常用</strong></button>' +
        '</div></section>' +
        '<section class="all-section"><h2>全部服务</h2><div class="service-tabs">' +
          categories.map(function (category, index) { return '<button class="' + (index === 0 ? 'active' : '') + '" data-category="' + escapeHtml(category) + '">' + escapeHtml(category) + '</button>'; }).join('') +
        '</div>' +
        '<div class="service-groups-container">' + groupsHtml + '</div>' +
        '<div class="service-empty">未找到匹配的服务</div></section>' +
      '</div>' +
    '</section>';
  }

  function isHome(active) {
    return active === '工作台' || active === '首页';
  }

  function fillMain(role, active) {
    var content = document.querySelector('.content');
    if (!content) return;

    var roleKey = document.body.dataset.role || 'teacher';

    if (isHome(active) && roleKey !== 'admin') {
      content.innerHTML = renderServiceHall(role);
      updateGroupDividers();
      return;
    }

    var hasModule = window.ModuleLoader && moduleCanLoad(active);
    if (active === '首页' || !hasModule) {
      content.innerHTML = renderPreviewCard(role, active);
    } else {
      content.innerHTML = '';
      window.ModuleLoader.loadModule(active).then(function (loaded) {
        if (!loaded) {
          content.innerHTML = renderPreviewCard(role, active);
        }
      }).catch(function () {
        content.innerHTML = renderPreviewCard(role, active);
      });
    }
  }

  function moduleCanLoad(active) {
    var role = document.body.dataset.role;
    if (active === '工作台' || active === '首页') {
      return role === 'teacher' || role === 'student' || role === 'admin';
    }
    return true;
  }

  function updateGroupDividers() {
    var firstVisible = true;
    document.querySelectorAll('.service-group').forEach(function (group) {
      var isGroupVisible = group.style.display !== 'none';
      var divider = group.querySelector('.service-group-divider');
      if (divider) {
        if (isGroupVisible) {
          if (firstVisible) {
            divider.style.display = 'none';
            firstVisible = false;
          } else {
            divider.style.display = 'block';
          }
        } else {
          divider.style.display = 'none';
        }
      }
    });
  }


  var _navigating = false;
  function navigateTo(label) {
    if (_navigating) return;
    _navigating = true;

    rememberExpandedGroups();

    document.body.dataset.active = label;
    document.title = getRole().roleName + ' - ' + label;

    // Rebuild shell and re-inject AI panel
    init(function() {
      _navigating = false;
    });
  }
  window.navigateTo = navigateTo;

  function init(cb) {
    var role = getRole();
    var active = document.body.dataset.active || role.defaultActive || '首页';
    var hasHome = role.navItems.some(function (item) { return item.label === '首页'; });
    if (active === '首页' && !hasHome) {
      active = role.defaultActive || (role.navItems[0] && role.navItems[0].label) || '首页';
    }
    var app = document.getElementById('app');

    // Build shell once
    if (!app.querySelector('.app-shell')) {
      app.innerHTML = '<div class="app-shell">'
        + renderSidebarHtml(role, active)
        + '<div class="main"><div class="main-inner"><div class="content"></div></div></div>'
        + '</div>';
    } else {
      var main = app.querySelector('.main');
      if (main && !main.querySelector('.content')) {
        main.innerHTML = '<div class="main-inner"><div class="content"></div></div>';
      }
    }

    document.title = role.roleName + ' - ' + active;
    updateSidebarState(role, active);
    fillMain(role, active);

    if (cb) setTimeout(cb, 0);
  }

  function updateSidebarState(role, active) {
    var groups = document.querySelectorAll('.nav-group');
    groups.forEach(function (group) {
      var item = group.querySelector('.nav-item');
      var hasSubmenu = !!group.querySelector('.submenu');
      var label = item && item.querySelectorAll('span')[1] &&
        item.querySelectorAll('span')[1].textContent.trim();

      var isItemActive = label === active;
      var isChildActive = hasSubmenu && Array.prototype.slice.call(group.querySelectorAll('.submenu-item'))
        .some(function (si) { return si.textContent.trim() === active; });

      if (item) item.classList.toggle('active', isItemActive || isChildActive);
      if (label && hasSubmenu && (isItemActive || isChildActive)) {
        expandedNavGroups[label] = true;
      }
      group.classList.toggle('expanded', !!(label && hasSubmenu && expandedNavGroups[label]));
    });

    document.querySelectorAll('.submenu-group').forEach(function (sg) {
      var subItem = sg.querySelector(':scope > .submenu-item');
      if (!subItem) return;
      var subLabel = subItem.textContent.trim();
      var third = sg.querySelector(':scope > .third-submenu');
      var hasThird = !!third;
      var anyLeafActive = hasThird && Array.prototype.slice.call(third.querySelectorAll('.submenu-item'))
        .some(function (li) { return li.textContent.trim() === active; });
      var subActive = subLabel === active || anyLeafActive;
      if (subActive && hasThird) {
        var parentGroup = sg.closest('.nav-group');
        var parentLabelEl = parentGroup && parentGroup.querySelector('.nav-item span:nth-child(2)');
        var parentKey = parentLabelEl ? parentLabelEl.textContent.trim() : '';
        if (parentKey) expandedNavGroups[parentKey + '::' + subLabel] = true;
      }
      sg.classList.toggle('active', subActive);
      if (hasThird) {
        third.classList.toggle('expanded', subActive);
      }
    });

    document.querySelectorAll('.submenu-item').forEach(function (si) {
      si.classList.toggle('selected', si.textContent.trim() === active);
    });
  }

  function rememberExpandedGroups() {
    document.querySelectorAll('.nav-group').forEach(function (group) {
      var item = group.querySelector('.nav-item');
      var hasSubmenu = !!group.querySelector('.submenu');
      if (!item || !hasSubmenu) return;

      var label = item.querySelectorAll('span')[1] &&
        item.querySelectorAll('span')[1].textContent.trim();
      if (label) expandedNavGroups[label] = group.classList.contains('expanded');
    });

    document.querySelectorAll('.submenu-group').forEach(function (sg) {
      var subItem = sg.querySelector(':scope > .submenu-item');
      var third = sg.querySelector(':scope > .third-submenu');
      if (!subItem || !third) return;
      var parentGroup = sg.closest('.nav-group');
      var parentLabel = parentGroup && parentGroup.querySelector('.nav-item span:nth-child(2)');
      var parentKey = parentLabel ? parentLabel.textContent.trim() : '';
      var subLabel = subItem.textContent.trim();
      if (parentKey) {
        expandedNavGroups[parentKey + '::' + subLabel] = sg.classList.contains('active') || third.classList.contains('expanded');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { init(); });
  } else {
    init();
  }

  document.addEventListener('click', function (e) {
    var categoryButton = e.target.closest('.service-tabs button');
    if (categoryButton) {
      document.querySelectorAll('.service-tabs button').forEach(function (button) { button.classList.toggle('active', button === categoryButton); });
      var category = categoryButton.dataset.category;
      
      var visibleGroupsCount = 0;
      document.querySelectorAll('.service-group').forEach(function (group) {
        var groupCategory = group.dataset.category;
        var isMatch = category === '全部' || groupCategory === category;
        
        if (isMatch) {
          group.style.display = 'block';
          group.querySelectorAll('.service-card').forEach(function (card) {
            card.hidden = false;
          });
          visibleGroupsCount += 1;
        } else {
          group.style.display = 'none';
        }
      });
      
      updateGroupDividers();
      document.querySelector('.service-empty').classList.toggle('visible', visibleGroupsCount === 0);
      return;
    }

    var serviceCard = e.target.closest('[data-service]');
    if (serviceCard) {
      navigateTo(serviceCard.dataset.service);
      return;
    }

    var sidebar = document.querySelector('.sidebar');
    if (!sidebar || !sidebar.contains(e.target)) return;

    var navItem = e.target.closest('.nav-item');
    if (navItem) {
      var group = navItem.closest('.nav-group');
      var hasSubmenu = group && group.querySelector('.submenu');
      if (hasSubmenu) {
        group.classList.toggle('expanded');
        rememberExpandedGroups();
      } else {
        var spans = navItem.querySelectorAll('span');
        var label = spans[1] && spans[1].textContent.trim();
        if (label) navigateTo(label);
      }
      return;
    }

    var subItem = e.target.closest('.submenu-item');
    if (subItem) {
      var subGroup = subItem.closest('.submenu-group');
      if (subGroup && subGroup.querySelector(':scope > .third-submenu')) {
        if (e.target.closest('.submenu-caret') || e.target === subItem) {
          subGroup.classList.toggle('active');
          var third = subGroup.querySelector(':scope > .third-submenu');
          if (third) third.classList.toggle('expanded', subGroup.classList.contains('active'));
          rememberExpandedGroups();
          return;
        }
      }
      navigateTo(subItem.textContent.trim());
    }
  });

  document.addEventListener('input', function (e) {
    if (!e.target.matches('.service-search input')) return;
    var query = e.target.value.trim().toLowerCase();
    
    document.querySelectorAll('.service-tabs button').forEach(function (button, index) {
      button.classList.toggle('active', index === 0);
    });

    var totalVisibleCards = 0;
    document.querySelectorAll('.service-group').forEach(function (group) {
      var groupVisibleCards = 0;
      group.querySelectorAll('.service-card').forEach(function (card) {
        var match = !query || card.dataset.search.toLowerCase().indexOf(query) !== -1;
        card.hidden = !match;
        if (match) {
          groupVisibleCards += 1;
        }
      });
      
      if (groupVisibleCards > 0) {
        group.style.display = 'block';
        totalVisibleCards += groupVisibleCards;
      } else {
        group.style.display = 'none';
      }
    });

    updateGroupDividers();
    document.querySelector('.service-empty').classList.toggle('visible', totalVisibleCards === 0);
  });
}());
