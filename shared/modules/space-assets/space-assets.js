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
    return ['admin', 'scheduler'].indexOf(role) !== -1 && document.body.dataset.active === '空间资产管理';
  }

  function injectCSS() {
    if (document.getElementById('sast-module-css')) return;
    var script = document.querySelector('script[src$="space-assets.js"]');
    var link = document.createElement('link');
    link.id = 'sast-module-css';
    link.rel = 'stylesheet';
    link.href = script
      ? script.src.replace(/space-assets\.js$/, 'space-assets.css')
      : '../shared/modules/space-assets/space-assets.css';
    document.head.appendChild(link);
  }

  var roomTypes = ['普通教室', 'PBL教室', '模拟病房', '腔镜实训室', 'OSCE考站', '阶梯教室', '模拟手术室'];
  var floors = [
    { value: '三楼', label: '三楼' },
    { value: '四楼', label: '四楼' },
    { value: '五楼', label: '五楼' },
    { value: '其他', label: '其他' }
  ];
  var equipmentOptions = [
    '激光投影仪',
    '无线麦克风系统',
    '360全景录播',
    '触控屏',
    '专业扩声音响',
    '监护仪',
    '4K全景录播',
    '腔镜训练台',
    'AI评分系统'
  ];

  var roomsSeed = [
    {
      id: 'r1',
      code: '教B301',
      name: '教B301 普通教室',
      type: '普通教室',
      floor: '三楼',
      capacity: 100,
      desc: '三楼普通教室，配有激光投影仪、无线麦克风系统。适合大班教学。',
      open: true,
      locked: false,
      bookedThisWeek: true,
      equipment: ['激光投影仪', '无线麦克风系统']
    },
    {
      id: 'r2',
      code: '301',
      name: '301 PBL教室(录播)',
      type: 'PBL教室',
      floor: '三楼',
      capacity: 15,
      desc: '360全景录播，PBL圆桌×3，84寸触控屏，适合小组讨论与案例教学。',
      open: true,
      locked: false,
      bookedThisWeek: true,
      equipment: ['360全景录播', '触控屏']
    },
    {
      id: 'r3',
      code: '305',
      name: '305 阶梯教室(录播)',
      type: '阶梯教室',
      floor: '三楼',
      capacity: 200,
      desc: '专业录播系统，大屏×2，扩声音响，主席台，适合全院大课及公开课。',
      open: true,
      locked: false,
      bookedThisWeek: true,
      equipment: ['专业扩声音响', '360全景录播']
    },
    {
      id: 'r4',
      code: '401',
      name: '401 模拟病房',
      type: '模拟病房',
      floor: '四楼',
      capacity: 20,
      desc: '高保真模拟人×4，查房推车，监护仪，4K全景录播。',
      open: false,
      locked: true,
      bookedThisWeek: false,
      lockReason: '设备检修：监护仪固件升级',
      equipment: ['监护仪', '4K全景录播']
    },
    {
      id: 'r5',
      code: '415',
      name: '415 模拟手术室',
      type: '模拟手术室',
      floor: '四楼',
      capacity: 30,
      desc: '麻醉模拟人、手术台、腔镜训练台、4K全景录播。全功能模拟手术培训场地。',
      open: true,
      locked: false,
      bookedThisWeek: true,
      equipment: ['腔镜训练台', '4K全景录播']
    },
    {
      id: 'r6',
      code: '420',
      name: '420 腔镜实训室',
      type: '腔镜实训室',
      floor: '四楼',
      capacity: 16,
      desc: '腔镜训练台×6，影像采集系统，教学屏×2，专为腔镜技能培训设计。',
      open: true,
      locked: false,
      bookedThisWeek: true,
      equipment: ['腔镜训练台', '触控屏']
    },
    {
      id: 'r7',
      code: '505-511',
      name: '505-511 OSCE考站',
      type: 'OSCE考站',
      floor: '五楼',
      capacity: 30,
      desc: '7个标准化考站，考官屏，AI评分系统，全程录像。适合OSCE综合考核。',
      open: false,
      locked: false,
      bookedThisWeek: false,
      equipment: ['AI评分系统', '360全景录播']
    }
  ];

  var equipmentsSeed = [
    { id: 'eq1', code: 'EQ-09381', name: '高保真麻醉模拟人', type: '医学模型', room: '415 模拟手术室', status: '正常运行', lastCalib: '2026-04-10' },
    { id: 'eq2', code: 'EQ-04821', name: '腔镜技能训练箱', type: '技能训练', room: '420 腔镜实训室', status: '正常运行', lastCalib: '2026-05-15' },
    { id: 'eq3', code: 'EQ-08291', name: '360°全景高清录播球机', type: '多媒体设备', room: '301 PBL教室(录播)', status: '正常运行', lastCalib: '2026-03-20' },
    { id: 'eq4', code: 'EQ-01923', name: '多参数生命体征监护仪', type: '临床监护', room: '401 模拟病房', status: '维护中', lastCalib: '2026-05-28' },
    { id: 'eq5', code: 'EQ-02381', name: 'AI智能化考核评分终端', type: '考核设备', room: '505 OSCE考站', status: '正常运行', lastCalib: '2026-05-01' }
  ];

  function createEmptyForm() {
    return {
      id: '',
      code: '',
      name: '',
      type: '普通教室',
      floor: '三楼',
      capacity: 30,
      desc: '',
      open: true,
      locked: false,
      lockReason: '',
      equipment: []
    };
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

    content.innerHTML = '<div id="sast-app" v-cloak>' + getTemplate() + '</div>';

    waitForDeps(function () {
      if (vueApp) {
        try { vueApp.unmount(); } catch (e) {}
        vueApp = null;
      }

      var app = Vue.createApp({
        setup: function () {
          var currentTab = Vue.ref('rooms'); // 'rooms' | 'rules' | 'equipments'
          var rooms = Vue.ref(roomsSeed);
          var equipments = Vue.ref(equipmentsSeed);

          // Rules Form State
          var rules = Vue.reactive({
            studentOpenOnly5th: true,
            studentMaxHours: 2,
            teacherApprovalRequired: true,
            autoApproveStudent: false,
            blackoutStart: '22:00',
            blackoutEnd: '07:00',
            maxAdvBookingDays: 30
          });

          var keyword = Vue.ref('');
          var typeFilter = Vue.ref('');
          var floorFilter = Vue.ref('');
          var drawerVisible = Vue.ref(false);
          var drawerMode = Vue.ref('create');
          var form = Vue.reactive(createEmptyForm());

          // Equipment Ledger Dialog
          var eqDialogVisible = Vue.ref(false);
          var eqForm = Vue.reactive({
            id: '',
            code: '',
            name: '',
            type: '医学模型',
            room: '401 模拟病房',
            status: '正常运行',
            lastCalib: ''
          });

          var stats = Vue.computed(function () {
            var total = rooms.value.length;
            var open = rooms.value.filter(function (room) { return room.open && !room.locked; }).length;
            var locked = rooms.value.filter(function (room) { return room.locked; }).length;
            var booked = rooms.value.filter(function (room) { return room.bookedThisWeek; }).length;
            var utilizationRate = Math.round((booked / (total || 1)) * 100);
            var openPercent = Math.round((open / (total || 1)) * 100);

            return {
              total: total,
              open: open,
              locked: locked,
              booked: booked,
              utilizationRate: utilizationRate,
              openPercent: openPercent
            };
          });

          var typeSummary = Vue.computed(function () {
            var colors = ['#175898', '#16a34a', '#8b5cf6', '#fa8c16', '#00b374', '#d97706', '#2563eb'];
            return roomTypes.map(function (type, index) {
              return {
                type: type,
                color: colors[index % colors.length],
                count: rooms.value.filter(function (room) { return room.type === type; }).length
              };
            }).filter(function (item) { return item.count > 0; });
          });

          var donutStyle = Vue.computed(function () {
            var total = stats.value.total || 1;
            var cursor = 0;
            var parts = typeSummary.value.map(function (item) {
              var start = cursor;
              var end = cursor + item.count / total * 100;
              cursor = end;
              return item.color + ' ' + start + '% ' + end + '%';
            });
            return { background: 'conic-gradient(' + parts.join(', ') + ')' };
          });

          var filteredRooms = Vue.computed(function () {
            var q = keyword.value.trim().toLowerCase();
            return rooms.value.filter(function (room) {
              if (typeFilter.value && room.type !== typeFilter.value) return false;
              if (floorFilter.value && room.floor !== floorFilter.value) return false;
              if (!q) return true;
              return [room.code, room.name, room.type, room.desc]
                .some(function (value) { return String(value).toLowerCase().indexOf(q) !== -1; });
            });
          });

          var filteredEquipments = Vue.computed(function () {
            var q = keyword.value.trim().toLowerCase();
            return equipments.value.filter(function (eq) {
              if (!q) return true;
              return [eq.code, eq.name, eq.type, eq.room, eq.status]
                .some(function (value) { return String(value).toLowerCase().indexOf(q) !== -1; });
            });
          });

          function switchTab(tab) {
            currentTab.value = tab;
            keyword.value = '';
          }

          function resetForm(next) {
            var fresh = createEmptyForm();
            Object.keys(fresh).forEach(function (key) {
              form[key] = next && Object.prototype.hasOwnProperty.call(next, key) ? next[key] : fresh[key];
            });
          }

          function openCreateDrawer() {
            drawerMode.value = 'create';
            resetForm();
            drawerVisible.value = true;
          }

          function openEditDrawer(room) {
            drawerMode.value = 'edit';
            resetForm({
              id: room.id,
              code: room.code,
              name: room.name,
              type: room.type,
              floor: room.floor,
              capacity: room.capacity,
              desc: room.desc,
              open: room.open,
              locked: room.locked,
              lockReason: room.lockReason || '',
              equipment: room.equipment.slice()
            });
            drawerVisible.value = true;
          }

          function saveRoom() {
            if (!form.name.trim()) {
              window.ArcoVue.Message.warning('请填写场地名称');
              return;
            }
            if (!form.code.trim()) {
              window.ArcoVue.Message.warning('请填写场地编号');
              return;
            }

            if (drawerMode.value === 'edit') {
              var current = rooms.value.find(function (room) { return room.id === form.id; });
              if (current) {
                Object.assign(current, {
                  code: form.code,
                  name: form.name,
                  type: form.type,
                  floor: form.floor,
                  capacity: Number(form.capacity) || 0,
                  desc: form.desc,
                  open: !!form.open && !form.locked,
                  locked: !!form.locked,
                  lockReason: form.lockReason,
                  equipment: form.equipment.slice()
                });
              }
            } else {
              rooms.value.unshift({
                id: 'r' + Date.now(),
                code: form.code,
                name: form.name,
                type: form.type,
                floor: form.floor,
                capacity: Number(form.capacity) || 0,
                desc: form.desc,
                open: !!form.open && !form.locked,
                locked: !!form.locked,
                lockReason: form.lockReason,
                bookedThisWeek: false,
                equipment: form.equipment.slice()
              });
            }

            drawerVisible.value = false;
            window.ArcoVue.Message.success('场地已保存');
          }

          function toggleOpen(room, value) {
            if (room.locked) return;
            room.open = value;
            window.ArcoVue.Message.success(value ? '已开放预订' : '已暂停预订');
          }

          function viewRoom(room) {
            window.ArcoVue.Message.info('查看「' + room.name + '」详情');
          }

          function floorClass(floor) {
            return floor === '三楼' ? 'f3' : floor === '四楼' ? 'f4' : floor === '五楼' ? 'f5' : 'fo';
          }

          function saveRules() {
            window.ArcoVue.Message.success('开放规则与审批配置已保存并生效');
          }

          function resetRules() {
            rules.studentOpenOnly5th = true;
            rules.studentMaxHours = 2;
            rules.teacherApprovalRequired = true;
            rules.autoApproveStudent = false;
            rules.blackoutStart = '22:00';
            rules.blackoutEnd = '07:00';
            rules.maxAdvBookingDays = 30;
            window.ArcoVue.Message.info('配置已恢复默认设置');
          }

          function openAddEq() {
            eqForm.id = '';
            eqForm.code = 'EQ-' + Math.floor(10000 + Math.random() * 90000);
            eqForm.name = '';
            eqForm.type = '医学模型';
            eqForm.room = rooms.value[0] ? rooms.value[0].name : '';
            eqForm.status = '正常运行';
            eqForm.lastCalib = new Date().toISOString().split('T')[0];
            eqDialogVisible.value = true;
          }

          function saveEq() {
            if (!eqForm.name.trim()) {
              window.ArcoVue.Message.warning('请输入设备名称');
              return;
            }
            if (eqForm.id) {
              var current = equipments.value.find(function (eq) { return eq.id === eqForm.id; });
              if (current) {
                Object.assign(current, {
                  code: eqForm.code,
                  name: eqForm.name,
                  type: eqForm.type,
                  room: eqForm.room,
                  status: eqForm.status,
                  lastCalib: eqForm.lastCalib
                });
              }
            } else {
              equipments.value.unshift({
                id: 'eq' + Date.now(),
                code: eqForm.code,
                name: eqForm.name,
                type: eqForm.type,
                room: eqForm.room,
                status: eqForm.status,
                lastCalib: eqForm.lastCalib
              });
            }
            eqDialogVisible.value = false;
            window.ArcoVue.Message.success('设备台账已保存');
          }

          function editEq(eq) {
            Object.assign(eqForm, eq);
            eqDialogVisible.value = true;
          }

          function deleteEq(eqId) {
            equipments.value = equipments.value.filter(function (eq) { return eq.id !== eqId; });
            window.ArcoVue.Message.success('已移出设备台账');
          }

          return {
            currentTab: currentTab,
            roomTypes: roomTypes,
            floors: floors,
            equipmentOptions: equipmentOptions,
            rooms: rooms,
            equipments: equipments,
            rules: rules,
            keyword: keyword,
            typeFilter: typeFilter,
            floorFilter: floorFilter,
            drawerVisible: drawerVisible,
            drawerMode: drawerMode,
            form: form,
            stats: stats,
            typeSummary: typeSummary,
            donutStyle: donutStyle,
            filteredRooms: filteredRooms,
            filteredEquipments: filteredEquipments,
            openCreateDrawer: openCreateDrawer,
            openEditDrawer: openEditDrawer,
            saveRoom: saveRoom,
            toggleOpen: toggleOpen,
            viewRoom: viewRoom,
            floorClass: floorClass,
            switchTab: switchTab,
            saveRules: saveRules,
            resetRules: resetRules,
            eqDialogVisible: eqDialogVisible,
            eqForm: eqForm,
            openAddEq: openAddEq,
            saveEq: saveEq,
            editEq: editEq,
            deleteEq: deleteEq,
            getIcon: function(name) {
              return window.RoleNav.icons[name] || '';
            }
          };
        }
      });

      app.use(window.ArcoVue);
      vueApp = app;
      vueApp.mount('#sast-app');
    });
  }

  function getTemplate() {
    return [
      '<section class="sast-page">',
        // Top-Level Unified Page Toolbar
        '<div class="app-page-toolbar sast-top-toolbar">',
          '<div class="app-page-toolbar-left">',
            '<strong class="app-page-title">空间资产管理</strong>',
            '<div class="sast-tab-actions app-page-tabs" role="tablist">',
              '<button type="button" :class="{ active: currentTab === \'rooms\' }" @click="switchTab(\'rooms\')">场地档案管理</button>',
              '<button type="button" :class="{ active: currentTab === \'rules\' }" @click="switchTab(\'rules\')">开放规则设置</button>',
              '<button type="button" :class="{ active: currentTab === \'equipments\' }" @click="switchTab(\'equipments\')">设备物资台账</button>',
            '</div>',
          '</div>',
          '<div class="app-page-toolbar-right">',
            '<a-input-search v-model="keyword" size="large" allow-clear class="sast-search app-page-search" placeholder="输入编号 / 名称 / 设备关键字搜索..."></a-input-search>',
          '</div>',
        '</div>',

        // Row 1: The 4 statistics cards (takes exactly ONE row, 4 columns, full width)
        '<div class="sast-stats-row">',
          '<div class="sast-stat-card blue">',
            '<div class="sast-stat-header">',
              '<span class="sast-stat-icon-wrap"><span v-html="getIcon(\'building\')"></span></span>',
              '<div>',
                '<em>场地总数 (间)</em>',
                '<strong>{{ stats.total }}</strong>',
              '</div>',
            '</div>',
            '<div class="sast-stat-footer">',
              '<div class="sast-progress-label"><span>空间档案健全率</span><strong>100%</strong></div>',
              '<div class="sast-progress-track"><div class="sast-progress-bar" style="width: 100%"></div></div>',
            '</div>',
          '</div>',

          '<div class="sast-stat-card green">',
            '<div class="sast-stat-header">',
              '<span class="sast-stat-icon-wrap"><span v-html="getIcon(\'doorOpen\')"></span></span>',
              '<div>',
                '<em>开放预订中 (间)</em>',
                '<strong>{{ stats.open }}</strong>',
              '</div>',
            '</div>',
            '<div class="sast-stat-footer">',
              '<div class="sast-progress-label"><span>场地开放比例</span><strong>{{ stats.openPercent }}%</strong></div>',
              '<div class="sast-progress-track"><div class="sast-progress-bar" :style="{ width: stats.openPercent + \'%\' }"></div></div>',
            '</div>',
          '</div>',

          '<div class="sast-stat-card orange">',
            '<div class="sast-stat-header">',
              '<span class="sast-stat-icon-wrap"><span v-html="getIcon(\'wrench\')"></span></span>',
              '<div>',
                '<em>维护锁定中 (间)</em>',
                '<strong>{{ stats.locked }}</strong>',
              '</div>',
            '</div>',
            '<div class="sast-stat-footer">',
              '<div class="sast-progress-label"><span>锁定/异常率</span><strong>{{ Math.round(stats.locked / stats.total * 100) }}%</strong></div>',
              '<div class="sast-progress-track bg-orange"><div class="sast-progress-bar warning" :style="{ width: (stats.locked / stats.total * 100) + \'%\' }"></div></div>',
            '</div>',
          '</div>',

          '<div class="sast-stat-card indigo">',
            '<div class="sast-stat-header">',
              '<span class="sast-stat-icon-wrap"><span v-html="getIcon(\'calendarCheck\')"></span></span>',
              '<div>',
                '<em>本周已排课 (间)</em>',
                '<strong>{{ stats.booked }}</strong>',
              '</div>',
            '</div>',
            '<div class="sast-stat-footer">',
              '<div class="sast-progress-label"><span>本周场地排课率</span><strong>{{ stats.utilizationRate }}%</strong></div>',
              '<div class="sast-progress-track bg-indigo"><div class="sast-progress-bar info" :style="{ width: stats.utilizationRate + \'%\' }"></div></div>',
            '</div>',
          '</div>',
        '</div>',

        // Row 2: Content side-by-side with Donut Card on the right
        '<div class="sast-content-layout">',
          // Left Column: Main Active Tab Content
          '<div class="sast-main-content">',
            // TAB 1: 场地档案管理
            '<div v-if="currentTab === \'rooms\'" class="sast-card animation-fadeIn">',
              '<div class="sast-toolbar">',
                '<a-select v-model="typeFilter" size="large" allow-clear class="sast-filter" placeholder="全部类型">',
                  '<a-option v-for="type in roomTypes" :key="type" :value="type">{{ type }}</a-option>',
                '</a-select>',
                '<a-select v-model="floorFilter" size="large" allow-clear class="sast-filter" placeholder="全部楼层">',
                  '<a-option v-for="floor in floors" :key="floor.value" :value="floor.value">{{ floor.label }}</a-option>',
                '</a-select>',
                '<button type="button" class="sast-new-btn" @click="openCreateDrawer">+ 新建场地</button>',
              '</div>',

              '<div class="sast-table">',
                '<div class="sast-head">',
                  '<span>场地名称（编号 + 类型）</span>',
                  '<span>楼层</span>',
                  '<span>容量</span>',
                  '<span>配置硬件/设备</span>',
                  '<span>开放状态</span>',
                  '<span>开放预订</span>',
                  '<span>操作</span>',
                '</div>',
                '<div v-for="(room, index) in filteredRooms" :key="room.id" class="sast-row">',
                  '<div class="sast-name">',
                    '<b :class="floorClass(room.floor)">{{ index + 1 }}</b>',
                    '<div>',
                      '<strong>{{ room.name }}</strong>',
                      '<small>{{ room.code }} · {{ room.type }}</small>',
                    '</div>',
                  '</div>',
                  '<div><span :class="[\'sast-floor\', floorClass(room.floor)]">{{ room.floor }}</span></div>',
                  '<div class="sast-capacity"><strong>{{ room.capacity }}</strong> 人</div>',
                  '<div class="sast-equip-tags">',
                    '<span v-for="eq in room.equipment" :key="eq" class="sast-equip-tag">{{ eq }}</span>',
                    '<span v-if="!room.equipment.length" class="text-muted text-xs">-</span>',
                  '</div>',
                  '<div>',
                    '<span v-if="room.locked" class="sast-status locked" :title="room.lockReason"><i></i>维护锁定</span>',
                    '<span v-else-if="room.open" class="sast-status open"><i></i>开放中</span>',
                    '<span v-else class="sast-status closed"><i></i>暂停开放</span>',
                  '</div>',
                  '<div><a-switch :model-value="room.open && !room.locked" :disabled="room.locked" @change="toggleOpen(room, $event)"></a-switch></div>',
                  '<div class="sast-actions">',
                    '<button type="button" class="sast-view" @click="viewRoom(room)">查看</button>',
                    '<button type="button" class="sast-edit" @click="openEditDrawer(room)">编辑</button>',
                  '</div>',
                '</div>',
                '<div v-if="!filteredRooms.length" class="sast-empty">暂无符合条件的场地档案</div>',
              '</div>',
            '</div>',

            // TAB 2: 开放规则设置
            '<div v-if="currentTab === \'rules\'" class="sast-rules-panel animation-fadeIn">',
              '<div class="sast-rules-card">',
                '<h3><span v-html="getIcon(\'userGraduate\')"></span> 学生自主预约规则</h3>',
                '<div class="sast-rules-body">',
                  '<div class="sast-control-row">',
                    '<div>',
                      '<strong>仅允许学生预约五楼房间</strong>',
                      '<span>开启后，学生端只可见五楼普通和OSCE考站，三、四楼模拟手术室等高精尖室不对学生个人开放。</span>',
                    '</div>',
                    '<a-switch v-model="rules.studentOpenOnly5th"></a-switch>',
                  '</div>',
                  '<div class="sast-control-row">',
                    '<div>',
                      '<strong>单次预约最大时长限制</strong>',
                      '<span>限制学生单次自主模拟训练预约的最大时长，防止过度占用公共教学资源。</span>',
                    '</div>',
                    '<div class="sast-control-input-wrap">',
                      '<a-input-number v-model="rules.studentMaxHours" :min="1" :max="8" style="width: 100px"></a-input-number>',
                      '<span>小时</span>',
                    '</div>',
                  '</div>',
                  '<div class="sast-control-row">',
                    '<div>',
                      '<strong>学生预约自动审批放行</strong>',
                      '<span>开启后，学生提交的预约直接生效，无需场地管理员进行二次人工审核。</span>',
                    '</div>',
                    '<a-switch v-model="rules.autoApproveStudent"></a-switch>',
                  '</div>',
                '</div>',
              '</div>',

              '<div class="sast-rules-card">',
                '<h3><span v-html="getIcon(\'chalkboardTeacher\')"></span> 教师预约与审批控制</h3>',
                '<div class="sast-rules-body">',
                  '<div class="sast-control-row">',
                    '<div>',
                      '<strong>项目制外院授课必须人工审批</strong>',
                      '<span>非中心常驻教师发起的项目制教学空间预约，强制进入空间预约审批池。</span>',
                    '</div>',
                    '<a-switch v-model="rules.teacherApprovalRequired"></a-switch>',
                  '</div>',
                  '<div class="sast-control-row">',
                    '<div>',
                      '<strong>最大允许提前预约天数</strong>',
                      '<span>限制教学秘书或教师能预约的最远日期。</span>',
                    '</div>',
                    '<div class="sast-control-input-wrap">',
                      '<a-input-number v-model="rules.maxAdvBookingDays" :min="7" :max="180" style="width: 100px"></a-input-number>',
                      '<span>天</span>',
                    '</div>',
                  '</div>',
                  '<div class="sast-control-row">',
                    '<div>',
                      '<strong>静默夜间预约锁定</strong>',
                      '<span>夜间静默时段不可预约使用场地，保障大楼运行安全。</span>',
                    '</div>',
                    '<div class="sast-control-input-wrap">',
                      '<a-input v-model="rules.blackoutStart" style="width: 80px; text-align: center" placeholder="22:00"></a-input>',
                      '<span>至</span>',
                      '<a-input v-model="rules.blackoutEnd" style="width: 80px; text-align: center" placeholder="07:00"></a-input>',
                    '</div>',
                  '</div>',
                '</div>',
              '</div>',

              '<div class="sast-rules-footer">',
                '<a-button size="large" @click="resetRules">恢复默认</a-button>',
                '<a-button type="primary" size="large" @click="saveRules">保存配置并生效</a-button>',
              '</div>',
            '</div>',

            // TAB 3: 设备物资台账
            '<div v-if="currentTab === \'equipments\'" class="sast-card animation-fadeIn">',
              '<div class="sast-toolbar">',
                '<button type="button" class="sast-new-btn" @click="openAddEq">+ 新增设备资产</button>',
              '</div>',

              '<div class="sast-table sast-eq-table">',
                '<div class="sast-eq-head">',
                  '<span>资产编号</span>',
                  '<span>设备名称</span>',
                  '<span>设备大类</span>',
                  '<span>当前存放房间</span>',
                  '<span>运行状态</span>',
                  '<span>上次校准/维护日期</span>',
                  '<span>操作</span>',
                '</div>',
                '<div v-for="eq in filteredEquipments" :key="eq.id" class="sast-eq-row">',
                  '<div class="eq-code"><code>{{ eq.code }}</code></div>',
                  '<div class="eq-name"><strong>{{ eq.name }}</strong></div>',
                  '<div><span class="eq-type-badge">{{ eq.type }}</span></div>',
                  '<div class="eq-room"><span v-html="getIcon(\'mapMarkerALT\')"></span> {{ eq.room }}</div>',
                  '<div>',
                    '<span v-if="eq.status === \'维护中\'" class="sast-status locked"><i></i>维护中</span>',
                    '<span v-else class="sast-status open"><i></i>运行正常</span>',
                  '</div>',
                  '<div class="eq-calib">{{ eq.lastCalib || \'-\' }}</div>',
                  '<div class="sast-actions">',
                    '<button type="button" class="sast-view" @click="editEq(eq)">编辑</button>',
                    '<button type="button" class="sast-edit-danger" @click="deleteEq(eq.id)">移出</button>',
                  '</div>',
                '</div>',
                '<div v-if="!filteredEquipments.length" class="sast-empty">暂无相关资产记录</div>',
              '</div>',
            '</div>',
          '</div>',

          // Right Column: Donut Card distribution chart panel (sticky float)
          '<div class="sast-donut-card">',
            '<h3>场地按类型分布</h3>',
            '<div class="sast-donut-body">',
              '<div class="sast-donut" :style="donutStyle">',
                '<div class="sast-donut-center">',
                  '<strong>{{ stats.total }}</strong>',
                  '<span>间场地</span>',
                '</div>',
              '</div>',
              '<div class="sast-legend">',
                '<div v-for="item in typeSummary" :key="item.type" class="sast-legend-item">',
                  '<i :style="{ background: item.color }"></i>',
                  '<span class="type-name">{{ item.type }}</span>',
                  '<strong class="type-count">{{ item.count }}间</strong>',
                '</div>',
              '</div>',
            '</div>',
          '</div>',
        '</div>',

        // Room Edit / Create Drawer
        '<a-drawer v-model:visible="drawerVisible" :title="drawerMode === \'create\' ? \'新建场地\' : \'编辑场地\'" :width="620" :mask="true" :footer="false" unmount-on-close>',
          '<div class="sast-drawer">',
            '<section>',
              '<h3>基础信息</h3>',
              '<div class="sast-form-grid">',
                '<label><span>场地名称 *</span><a-input v-model="form.name" placeholder="如：415 模拟手术室"></a-input></label>',
                '<label><span>场地编号 *</span><a-input v-model="form.code" placeholder="如：415"></a-input></label>',
                '<label><span>场地类型</span><a-select v-model="form.type"><a-option v-for="type in roomTypes" :key="type" :value="type">{{ type }}</a-option></a-select></label>',
                '<label><span>楼层</span><a-select v-model="form.floor"><a-option v-for="floor in floors" :key="floor.value" :value="floor.value">{{ floor.label }}</a-option></a-select></label>',
                '<label><span>容量</span><a-input-number v-model="form.capacity" :min="1" class="full-input"></a-input-number></label>',
                '<label><span>开放预订</span><a-switch v-model="form.open" :disabled="form.locked"></a-switch></label>',
                '<label class="wide"><span>场地说明</span><a-textarea v-model="form.desc" placeholder="说明场地设备、适用教学场景与使用限制" :auto-size="{ minRows: 3, maxRows: 5 }"></a-textarea></label>',
              '</div>',
            '</section>',
            '<section>',
              '<h3>设备配置</h3>',
              '<div class="sast-check-grid">',
                '<a-checkbox v-for="item in equipmentOptions" :key="item" v-model="form.equipment" :value="item">{{ item }}</a-checkbox>',
              '</div>',
            '</section>',
            '<section>',
              '<h3>维护锁定</h3>',
              '<div class="sast-lock-card">',
                '<div><strong>设为维护锁定</strong><span>锁定后暂停开放预订，列表中显示维护原因。</span></div>',
                '<a-switch v-model="form.locked"></a-switch>',
              '</div>',
              '<label v-if="form.locked" class="sast-lock-reason"><span>锁定原因</span><a-input v-model="form.lockReason" placeholder="如：设备检修、年度盘点、消防检查"></a-input></label>',
            '</section>',
            '<div class="sast-drawer-actions">',
              '<a-button @click="drawerVisible = false">取消</a-button>',
              '<a-button type="primary" @click="saveRoom">保存场地</a-button>',
            '</div>',
          '</div>',
        '</a-drawer>',

        // Equipment Modal Form
        '<a-modal v-model:visible="eqDialogVisible" :title="eqForm.id ? \'编辑设备资产\' : \'新增设备资产\'" @ok="saveEq" unmount-on-close>',
          '<div class="eq-modal-form" style="display: flex; flex-direction: column; gap: 14px;">',
            '<label style="display: flex; flex-direction: column; gap: 6px;"><span>资产编号</span><a-input v-model="eqForm.code" placeholder="如: EQ-0921" :disabled="true"></a-input></label>',
            '<label style="display: flex; flex-direction: column; gap: 6px;"><span>设备名称 *</span><a-input v-model="eqForm.name" placeholder="请输入核心教学设备名称"></a-input></label>',
            '<label style="display: flex; flex-direction: column; gap: 6px;"><span>存放房间</span>',
              '<a-select v-model="eqForm.room">',
                '<a-option v-for="room in rooms" :key="room.id" :value="room.name">{{ room.name }}</a-option>',
              '</a-select>',
            '</label>',
            '<label style="display: flex; flex-direction: column; gap: 6px;"><span>设备分类</span>',
              '<a-select v-model="eqForm.type">',
                '<a-option value="医学模型">医学模型</a-option>',
                '<a-option value="技能训练">技能训练</a-option>',
                '<a-option value="多媒体设备">多媒体设备</a-option>',
                '<a-option value="临床监护">临床监护</a-option>',
                '<a-option value="考核设备">考核设备</a-option>',
              '</a-select>',
            '</label>',
            '<label style="display: flex; flex-direction: column; gap: 6px;"><span>资产运行状态</span>',
              '<a-select v-model="eqForm.status">',
                '<a-option value="正常运行">正常运行</a-option>',
                '<a-option value="维护中">维护中</a-option>',
              '</a-select>',
            '</label>',
            '<label style="display: flex; flex-direction: column; gap: 6px;"><span>上次校验日期</span><a-input v-model="eqForm.lastCalib" placeholder="YYYY-MM-DD"></a-input></label>',
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
