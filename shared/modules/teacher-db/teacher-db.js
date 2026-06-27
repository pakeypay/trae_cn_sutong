(function () {
  var vueApp = null;
  var handledPages = ['师资库'];

  function waitForVue(callback) {
    if (window.Vue && window.Vue.createApp && window.ArcoVue) {
      callback();
    } else {
      setTimeout(function () { waitForVue(callback); }, 50);
    }
  }

  function shouldHandle() {
    var role = document.body.dataset.role;
    // Visible only under Super Admin (超级管理员) role
    return role === 'admin' && handledPages.indexOf(document.body.dataset.active) !== -1;
  }

  function injectCSS() {
    if (document.getElementById('tdb-module-css')) return;
    var script = document.currentScript || document.querySelector('script[src$="teacher-db.js"]');
    var basePath = script ? script.src.replace(/teacher-db\.js$/, '') : '../shared/modules/teacher-db/';
    var link = document.createElement('link');
    link.id = 'tdb-module-css';
    link.rel = 'stylesheet';
    link.href = basePath + 'teacher-db.css';
    document.head.appendChild(link);
  }

  function getTemplate() {
    return [
      '<div class="tdb-container">',
        '<!-- 1. Feishu Style Top Header bar -->',
        '<div class="tdb-header-bar">',
          '<div class="tdb-header-title">',
            '<h2>全院临床带教师资库 ({{ teachers.length }}人)</h2>',
            '<p>数字化统筹管理儿科培训中心执教导师资历、教学工时大盘及学员反馈质量评价档案。</p>',
          '</div>',
          '<div class="tdb-header-actions">',
            '<div class="tdb-search">',
              '<span v-html="getIcon(\'search\')" style="display:inline-flex;align-items:center;"></span>',
              '<input type="text" placeholder="搜索姓名、专业、工号..." v-model="searchKeyword" />',
            '</div>',
            '<a-button type="primary" size="medium" @click="openAddModal">',
              '<span v-html="getIcon(\'userPlus\')" style="margin-right:6px;display:inline-flex;align-items:center;"></span> 新增师资登记',
            '</a-button>',
          '</div>',
        '</div>',

        '<!-- 2. Feishu Split Layout -->',
        '<div class="tdb-split-layout">',
          '<!-- Left Category sidebar -->',
          '<div class="tdb-sidebar-card">',
            '<div v-for="dept in deptFilters" :key="dept.id" ',
                 'class="tdb-sidebar-item" ',
                 ':class="{ active: activeDept === dept.id }" ',
                 '@click="activeDept = dept.id">',
              '<span>{{ dept.label }}</span>',
              '<span class="count">{{ getDeptCount(dept.id) }}</span>',
            '</div>',
          '</div>',

          '<!-- Right Teachers Area -->',
          '<div class="tdb-main-area">',
            '<div class="tdb-teacher-grid">',
              '<div v-for="t in filteredTeachers" :key="t.id" class="tdb-teacher-card" @click="openProfile(t)">',
                '<div>',
                  '<!-- Card top -->',
                  '<div class="tdb-card-top">',
                    '<div class="tdb-avatar-bay" :class="getAvatarClass(t)">',
                      '{{ t.name[0] }}',
                    '</div>',
                    '<div class="tdb-info-block">',
                      '<div class="tdb-name-row">',
                        '<span class="tdb-name">{{ t.name }}</span>',
                        '<span class="tdb-rank-badge">{{ t.rank }}</span>',
                      '</div>',
                      '<div class="tdb-dept-specialty">{{ t.dept }} · {{ t.specialty }}</div>',
                    '</div>',
                  '</div>',

                  '<!-- Card metrics -->',
                  '<div class="tdb-card-metrics">',
                    '<div>',
                      '<div>主讲课程</div>',
                      '<div class="tdb-metric-num">{{ t.coursesCount }} 门</div>',
                    '</div>',
                    '<div>',
                      '<div>带教学时</div>',
                      '<div class="tdb-metric-num">{{ t.hoursCount }} h</div>',
                    '</div>',
                    '<div>',
                      '<div>带教评分</div>',
                      '<div class="tdb-metric-num" style="color:var(--warning)">{{ t.rating }} ★</div>',
                    '</div>',
                  '</div>',
                '</div>',

                '<!-- Card bottom -->',
                '<div class="tdb-card-bottom">',
                  '<span style="font-size:12px; color:#86909c;">规培身份: {{ t.tutorType }}</span>',
                  '<span class="tdb-status-tag" :class="t.status">{{ getStatusText(t.status) }}</span>',
                '</div>',
              '</div>',
            '</div>',
          '</div>',
        '</div>',

        '<!-- 3. Feishu Profile Side Drawer -->',
        '<a-drawer v-model:visible="profileVisible" title="带教师资教学资历档案" :width="450" :footer="false" unmount-on-close>',
          '<div v-if="activeTeacher" class="fs-profile-drawer">',
            '<div class="fs-profile-card">',
              '<div class="fs-profile-avatar" :class="getAvatarClass(activeTeacher)">',
                '{{ activeTeacher.name[0] }}',
              '</div>',
              '<div class="fs-profile-name">{{ activeTeacher.name }}</div>',
              '<div class="fs-profile-title">{{ activeTeacher.rank }} | {{ activeTeacher.dept }}</div>',
            '</div>',

            '<!-- Drawer tabs -->',
            '<div class="fs-profile-tabs">',
              '<div class="fs-profile-tab" :class="{ active: activeTab === \'bio\' }" @click="activeTab = \'bio\'">履历档案</div>',
              '<div class="fs-profile-tab" :class="{ active: activeTab === \'courses\' }" @click="activeTab = \'courses\'">主讲课程</div>',
              '<div class="fs-profile-tab" :class="{ active: activeTab === \'comments\' }" @click="activeTab = \'comments\'">带教评价</div>',
            '</div>',

            '<!-- Tab content: Bio -->',
            '<div v-if="activeTab === \'bio\'" class="fs-profile-details">',
              '<div class="fs-detail-row"><span class="fs-detail-label">导师级别</span><span class="fs-detail-val">{{ activeTeacher.tutorType }}</span></div>',
              '<div class="fs-detail-row"><span class="fs-detail-label">专业方向</span><span class="fs-detail-val">{{ activeTeacher.specialty }}</span></div>',
              '<div class="fs-detail-row"><span class="fs-detail-label">联系电话</span><span class="fs-detail-val">{{ activeTeacher.phone }}</span></div>',
              '<div class="fs-detail-row"><span class="fs-detail-label">电子邮箱</span><span class="fs-detail-val">{{ activeTeacher.email }}</span></div>',
              '<div class="fs-detail-row"><span class="fs-detail-label">主研领域</span><span class="fs-detail-val" style="font-size:12px; max-width:240px; text-align:right;">{{ activeTeacher.research }}</span></div>',
            '</div>',

            '<!-- Tab content: Courses -->',
            '<div v-if="activeTab === \'courses\'">',
              '<div v-for="c in activeTeacher.coursesList" :key="c" style="background:#f4f5f6; padding:10px 14px; border-radius:6px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">',
                '<div>',
                  '<strong style="font-size:13px; color:#1f2329;">{{ c }}</strong>',
                  '<div style="font-size:11px; color:#8f959e; margin-top:2px;">技能中心大纲课程</div>',
                '</div>',
                '<a-tag size="small" color="arcoblue">已授权</a-tag>',
              '</div>',
            '</div>',

            '<!-- Tab content: Comments -->',
            '<div v-if="activeTab === \'comments\'">',
              '<div v-for="comm in activeTeacher.commentsList" :key="comm.student" style="border-bottom:1px solid #f2f3f5; padding-bottom:10px; margin-bottom:10px;">',
                '<div style="display:flex; justify-content:space-between; font-size:11.5px; color:#8f959e; margin-bottom:4px;">',
                  '<span>规培生: {{ comm.student }}</span>',
                  '<span>评分: <strong style="color:var(--warning)">{{ comm.score }} ★</strong></span>',
                '</div>',
                '<p style="font-size:12.5px; color:#4e5969; line-height:1.6;">“{{ comm.content }}”</p>',
              '</div>',
            '</div>',
          '</div>',
        '</a-drawer>',

        '<!-- 4. Add Teacher Modal -->',
        '<a-modal v-model:visible="addVisible" title="登记新临床师资大纲" @ok="submitAddTeacher" @cancel="closeAddModal">',
          '<a-form layout="vertical">',
            '<a-row :gutter="16">',
              '<a-col :span="12">',
                '<a-form-item label="带教姓名" required>',
                  '<a-input v-model="addForm.name" placeholder="请输入姓名" />',
                '</a-form-item>',
              '</a-col>',
              '<a-col :span="12">',
                '<a-form-item label="职称级别" required>',
                  '<a-select v-model="addForm.rank">',
                    '<a-option>主任医师 / 教授</a-option>',
                    '<a-option>副主任医师 / 副教授</a-option>',
                    '<a-option>主治医师 / 讲师</a-option>',
                  '</a-select>',
                '</a-form-item>',
              '</a-col>',
            '</a-row>',
            '<a-row :gutter="16">',
              '<a-col :span="12">',
                '<a-form-item label="执教科室" required>',
                  '<a-select v-model="addForm.dept">',
                    '<a-option>新生儿科</a-option>',
                    '<a-option>儿内科</a-option>',
                    '<a-option>儿外科</a-option>',
                    '<a-option>儿急诊科</a-option>',
                  '</-select>',
                '</a-form-item>',
              '</a-col>',
              '<a-col :span="12">',
                '<a-form-item label="专业技术特长" required>',
                  '<a-input v-model="addForm.specialty" placeholder="如：极低早产儿、血管穿刺" />',
                '</a-form-item>',
              '</a-col>',
            '</a-row>',
            '<a-row :gutter="16">',
              '<a-col :span="24">',
                '<a-form-item label="手机号码" required>',
                  '<a-input v-model="addForm.phone" placeholder="请输入11位手机号" />',
                '</a-form-item>',
              '</-col>',
            '</a-row>',
          '</a-form>',
        '</a-modal>',
      '</div>'
    ].join('');
  }

  function initVueApp() {
    if (!shouldHandle()) return;
    injectCSS();

    var container = document.querySelector('.content');
    if (!container) return;

    container.innerHTML = '<div id="tdb-app"></div>';

    waitForVue(function () {
      if (vueApp) { try { vueApp.unmount(); } catch (e) {} vueApp = null; }

      var app = Vue.createApp({
        template: getTemplate(),
        setup: function () {
          var searchKeyword = Vue.ref('');
          var activeDept = Vue.ref('all');

          var profileVisible = Vue.ref(false);
          var activeTeacher = Vue.ref(null);
          var activeTab = Vue.ref('bio');

          var addVisible = Vue.ref(false);
          var addForm = Vue.reactive({
            name: '',
            rank: '主治医师 / 讲师',
            dept: '儿内科',
            specialty: '',
            phone: ''
          });

          // Left Feishu-style split list
          var deptFilters = [
            { id: 'all', label: '全院师资' },
            { id: '新生儿科', label: '新生儿科' },
            { id: '儿内科', label: '儿内科' },
            { id: '儿外科', label: '儿外科' },
            { id: '儿急诊科', label: '儿急诊科' }
          ];

          // Curated high-fidelity mock teachers database
          var teachers = Vue.ref([
            {
              id: 't1', name: '蔡教授', rank: '主任医师 / 教授', dept: '新生儿科', specialty: '极低体重儿管辖',
              coursesCount: 5, hoursCount: 142, rating: '4.98', tutorType: '博士生导师', phone: '13812345678',
              email: 'cai_prof@fudan.edu.cn', research: '新生儿缺氧缺血性脑病全方位临床监护与极低早产儿无创插管',
              status: 'active',
              coursesList: ['新生儿气管置管高级技能', '超早产儿温床急救实操', '静脉穿刺血管彩超快速锁位'],
              commentsList: [
                { student: '李同学', score: '5.0', content: '蔡教授授课极度严谨，插管手势细节非常受用！' },
                { student: '王同学', score: '4.9', content: '对于极超低体重儿的气道温控保护理念讲得非常深奥透彻。' }
              ]
            },
            {
              id: 't2', name: '张老师', rank: '副主任医师 / 副教授', dept: '儿内科', specialty: '心肺复苏急救',
              coursesCount: 4, hoursCount: 118, rating: '4.95', tutorType: '硕士生导师', phone: '13987654321',
              email: 'zhang_edu@fudan.edu.cn', research: '儿科危急重症PALS高级心肺复苏及气道紧急开放操作',
              status: 'free',
              coursesList: ['急救护理综合实训', '儿童男/女导尿术合格考核', '心肺按压大屏幕实时波形纠编'],
              commentsList: [
                { student: '陈同学', score: '5.0', content: '张老师带教非常有耐心，考前模拟实训极有针对性！' }
              ]
            },
            {
              id: 't3', name: '刘讲师', rank: '主治医师 / 讲师', dept: '儿外科', specialty: '儿科微创腔镜',
              coursesCount: 3, hoursCount: 86, rating: '4.88', tutorType: '规培导师', phone: '13611112222',
              email: 'liu_lecturer@fudan.edu.cn', research: '小儿腹腔镜基础打结、持针及剥离精细模型技能演习',
              status: 'active',
              coursesList: ['儿童穿刺模型操作大纲', '儿科微创腔镜基础模拟打结'],
              commentsList: [
                { student: '张同学', score: '4.8', content: '老师要求手写签名交接流程十分规范，实操评分极其抠细节，获益匪浅。' }
              ]
            },
            {
              id: 't4', name: '陈教授', rank: '主任医师 / 教授', dept: '儿急诊科', specialty: '儿童创伤抢救',
              coursesCount: 6, hoursCount: 168, rating: '4.97', tutorType: '博士生导师', phone: '13599998888',
              email: 'chen_trauma@fudan.edu.cn', research: '儿科大型灾难突发性大出血气道控制及骨髓腔输液通道锁定',
              status: 'busy',
              coursesList: ['小儿多发性创伤救治沙盘', '骨髓穿刺通道极速开辟实操'],
              commentsList: [
                { student: '刘同学', score: '5.0', content: '绝对是急诊大腕带教，骨髓腔插针的力度和听骨落感讲得太生动了。' }
              ]
            }
          ]);

          var filteredTeachers = Vue.computed(function () {
            var keyword = searchKeyword.value.trim().toLowerCase();
            return teachers.value.filter(function (t) {
              var matchesDept = activeDept.value === 'all' || t.dept === activeDept.value;
              var matchesKeyword = !keyword || t.name.toLowerCase().indexOf(keyword) !== -1 ||
                                   t.specialty.toLowerCase().indexOf(keyword) !== -1 ||
                                   t.rank.toLowerCase().indexOf(keyword) !== -1;
              return matchesDept && matchesKeyword;
            });
          });

          function getDeptCount(deptId) {
            if (deptId === 'all') return teachers.value.length;
            return teachers.value.filter(function (t) { return t.dept === deptId; }).length;
          }

          function getAvatarClass(t) {
            if (t.id === 't1') return 't1';
            if (t.id === 't2') return 't2';
            if (t.id === 't3') return 't3';
            return 't4';
          }

          function getStatusText(status) {
            switch (status) {
              case 'active': return '带教中';
              case 'free': return '空闲中';
              case 'busy': return '出诊中';
              default: return '离岗';
            }
          }

          function openProfile(t) {
            activeTeacher.value = t;
            activeTab.value = 'bio';
            profileVisible.value = true;
          }

          function openAddModal() {
            addForm.name = '';
            addForm.specialty = '';
            addForm.phone = '';
            addVisible.value = true;
          }

          function closeAddModal() {
            addVisible.value = false;
          }

          function submitAddTeacher() {
            if (!addForm.name || !addForm.specialty || !addForm.phone) {
              window.ArcoVue.Message.warning('请完整填写师资登记项');
              return;
            }
            // Add a new mock instructor in database
            teachers.value.unshift({
              id: 't' + (teachers.value.length + 1),
              name: addForm.name,
              rank: addForm.rank,
              dept: addForm.dept,
              specialty: addForm.specialty,
              coursesCount: 2,
              hoursCount: 16,
              rating: '4.90',
              tutorType: '规培导师',
              phone: addForm.phone,
              email: addForm.name.toLowerCase() + '@fudan.edu.cn',
              research: '新增带教师资主要研究方向 - 规划中',
              status: 'free',
              coursesList: ['常规临床技能训练科室带教'],
              commentsList: [
                { student: '新规培生', score: '5.0', content: '新入库老师在自主练习中指导非常耐心！' }
              ]
            });

            window.ArcoVue.Message.success({
              content: '【临床师资入库成功】导师 《' + addForm.name + '》 已加入师资库！',
              showIcon: true
            });
            addVisible.value = false;
          }

          function getIcon(name) {
            return window.RoleNav.icons[name] || '';
          }

          return {
            searchKeyword: searchKeyword,
            activeDept: activeDept,
            profileVisible: profileVisible,
            activeTeacher: activeTeacher,
            activeTab: activeTab,
            addVisible: addVisible,
            addForm: addForm,
            deptFilters: deptFilters,
            teachers: teachers,
            filteredTeachers: filteredTeachers,
            getDeptCount: getDeptCount,
            getAvatarClass: getAvatarClass,
            getStatusText: getStatusText,
            openProfile: openProfile,
            openAddModal: openAddModal,
            closeAddModal: closeAddModal,
            submitAddTeacher: submitAddTeacher,
            getIcon: getIcon
          };
        }
      });

      app.use(window.ArcoVue);
      vueApp = app;
      vueApp.mount('#tdb-app');
    });
  }

  function boot() {
    var observer = new MutationObserver(function () {
      if (shouldHandle()) {
        if (!document.getElementById('tdb-app')) {
          initVueApp();
        }
      }
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ['data-active', 'data-role'] });
    initVueApp();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
}());
