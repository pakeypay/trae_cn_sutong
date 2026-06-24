(function () {
  function waitForVue(callback) {
    if (window.Vue && window.Vue.createApp) {
      callback();
    } else {
      setTimeout(function () { waitForVue(callback); }, 50);
    }
  }

  const svgAttrs = 'xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
  const icon = (paths) => `<svg ${svgAttrs}>${paths}</svg>`;

  const icons = {
    home: icon('<path d="m3 11 9-8 9 8"></path><path d="M5 10v10h14V10"></path><path d="M9 20v-6h6v6"></path>'),
    grid: icon('<rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect>'),
    list: icon('<path d="M8 6h13"></path><path d="M8 12h13"></path><path d="M8 18h13"></path><path d="M3 6h.01"></path><path d="M3 12h.01"></path><path d="M3 18h.01"></path>'),
    book: icon('<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z"></path>'),
    chart: icon('<path d="M3 3v18h18"></path><path d="M7 16l4-4 3 3 5-7"></path>'),
    shield: icon('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>'),
    user: icon('<path d="M19 21a7 7 0 0 0-14 0"></path><circle cx="12" cy="7" r="4"></circle>'),
    info: icon('<circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path>'),
    chevron: icon('<path d="m6 9 6 6 6-6"></path>'),
    search: icon('<circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path>'),
    plus: icon('<path d="M5 12h14"></path><path d="M12 5v14"></path>'),
    minus: icon('<path d="M5 12h14"></path>'),
    clock: icon('<circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path>'),
    edit: icon('<path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"></path>'),
    copy: icon('<rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>'),
    trash: icon('<path d="M3 6h18"></path><path d="M8 6V4h8v2"></path><path d="M19 6l-1 14H6L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path>'),
    check: icon('<path d="M20 6 9 17l-5-5"></path>'),
    close: icon('<path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>'),
    settings: icon('<path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5z"></path><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.4-1.68 1.7 1.7 0 0 0-1.52.47l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H2.8a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 8a1.7 1.7 0 0 0-.47-1.52l-.06-.06A2 2 0 1 1 6.9 3.59l.06.06A1.7 1.7 0 0 0 8.8 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V2.8a2 2 0 1 1 4 0v.09A1.7 1.7 0 0 0 15.6 4.6a1.7 1.7 0 0 0 1.52-.47l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 8.8c.16.4.47.73.88.92.2.1.42.16.65.18H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1.1z"></path>'),
    menuFold: icon('<path d="M4 6h16"></path><path d="M4 12h10"></path><path d="M4 18h16"></path><path d="m18 9 3 3-3 3"></path>')
  };

  const chartColors = ['#0E42D2', '#165DFF', '#4080FF', '#6AA1FF', '#93BEFF', '#14C9C9', '#45DAD8', '#7EE7E2'];

  function buildMockCourses(count) {
    const names = ['胸腔穿刺术', '骨髓穿刺术', '心肺复苏', '腹部体格检查', '儿科急诊处置', '新生儿复苏', '腰椎穿刺术', '气道管理', '儿童镇静评估', '静脉通路建立', '儿科超声入门', '创伤初步处理'];
    const teachers = ['张敏', '王琳', '陈杰', '李倩', '赵明', '周宁', '孙瑶', '黄佳', '吴越', '钱晨'];
    const targets = ['1年级', '2年级', '规培医师', '专培'];
    const batches = ['10人/批 · 3批', '12人/批 · 4批', '15人/批 · 5批', '20人/批 · 2批', '18人', '12人'];
    const suggestions = ['5月周二下午', '复用去年规则', '5月周三上午', '复用模板', '新增急救车', '建议周二上午', '6月周一上午', '6月周四下午'];
    const resources = ['资源紧张', '可直接排课', '需确认设备', '导师已确认', '等待资源审核', '可复用排课'];

    return Array.from({ length: count }, (_, index) => {
      const courseIndex = index % names.length;
      const primaryTeacher = teachers[index % teachers.length];
      const secondaryTeacher = teachers[(index + 3) % teachers.length];
      return {
        id: `C${String(index + 1).padStart(3, '0')}`,
        name: `${names[courseIndex]} ${String.fromCharCode(65 + (index % 26))}`,
        teacher: `A ${primaryTeacher}教师`,
        teacherOptions: [
          { label: `A ${primaryTeacher}教师`, value: `A ${primaryTeacher}教师` },
          { label: `B ${secondaryTeacher}教师`, value: `B ${secondaryTeacher}教师` },
          { label: '其他教师', value: '其他教师' }
        ],
        target: targets[index % targets.length],
        batch: batches[index % batches.length],
        suggestion: suggestions[index % suggestions.length],
        resource: resources[index % resources.length]
      };
    });
  }

  const pendingMock = window.PendingCourseMockData || {
    studentGroups: [],
    teachers: [],
    courses: [],
    baseColors: {}
  };
  const PREFILL_STORAGE_KEY = 'pending-course-prefill-records-v1';

  const prefillSeedRecords = [
    ['住培第一年', '通识', '儿科坏消息告知', '柴毅明'],
    ['住培第一年', '通识', '儿科坏消息告知', '储晨'],
    ['住培第一年', '通识', '腰穿', '邱甜'],
    ['住培第一年', '通识', '腰穿', '龙莎莎'],
    ['住培第一年', '通识', '骨穿', '富洋'],
    ['住培第一年', '通识', '腹穿', '李军'],
    ['住培第一年', '通识', '胸穿', '陈伟呈'],
    ['住培第一年', '通识', '胃管洗胃', '朱雪梅'],
    ['住培第一年', '通识', '胃管洗胃', '周颖'],
    ['住培第一年', '通识', '导尿', '汤梁峰'],
    ['住培第一年', '通识', '导尿', '缪千帆'],
    ['住培第一年', '通识', '病史采集', '柴毅明'],
    ['住培第一年', '通识', '病史采集', '储晨'],
    ['住培第一年', '通识', '体格检查', '储晨'],
    ['住培第一年', '通识', '体格检查', '柴毅明'],
    ['住培第一年', '外科', '缝合打结', '诸壬卿'],
    ['住培第一年', '外科', '缝合打结', '景延辉'],
    ['住培第一年', '外科', '缝合打结', '张志强'],
    ['住培第一年', '外科', '扩肛灌肠', '姚伟'],
    ['住培第一年', '外科', '扩肛灌肠', '何炜婧'],
    ['住培第一年', '外科', '消毒铺巾', '钟海军'],
    ['住培第一年', '外科', '消毒铺巾', '郑超'],
    ['住培第一年', '外科', '外科换药', '宋君'],
    ['住培第一年', '外科', '外科换药', '吴春星'],
    ['住培第二年', '通识', '休克识别+液体复苏', '蔡小狄'],
    ['住培第二年', '通识', '休克识别+液体复苏', '赵璐'],
    ['住培第二年', '通识', '呼吸困难+上下气道梗阻', '陈伟明'],
    ['住培第二年', '通识', '呼吸困难+上下气道梗阻', '祁媛媛'],
    ['住培第二年', '通识', '血气分析+病例模拟', '张澜'],
    ['住培第二年', '通识', '血气分析+病例模拟', '陈艳'],
    ['住培第二年', '通识', '输液反应+过敏性休克', '葛艳玲'],
    ['住培第二年', '通识', '输液反应+过敏性休克', '王一雪'],
    ['住培第二年', '内科', '腹泻补液', '王玉环'],
    ['住培第二年', '内科', '腹泻补液', '朱志成'],
    ['住培第二年', '内科', '酮症酸中毒', '程若倩'],
    ['住培第二年', '内科', '酮症酸中毒', '朱雪梅'],
    ['住培第二年', '内科', '惊厥急诊处理', '马健'],
    ['住培第二年', '内科', '惊厥急诊处理', '邱甜'],
    ['住培第二年', '外科', '外科小手术', '吴春星'],
    ['住培第二年', '外科', '外科小手术', '景延辉'],
    ['住培第二年', '外科', '腔镜基础操作', '汤梁峰'],
    ['住培第二年', '外科', '腔镜基础操作', '李军'],
    ['住培第二年', '外科', '急腹症', '何炜婧'],
    ['住培第二年', '外科', '急腹症', '孙松'],
    ['住培第三年', '通识', '创伤系列/创伤休克评估处理', '郑继翠'],
    ['住培第三年', '通识', '创伤系列/创伤休克评估处理', '程晔'],
    ['住培第三年', '通识', '新生儿窒息复苏', '张澜'],
    ['住培第三年', '通识', '新生儿窒息复苏', '高瑞伟'],
    ['住培第三年', '内科', '严重心律失常', '赵趣鸣'],
    ['住培第三年', '内科', '严重心律失常', '陈扬'],
    ['住培第三年', '内科', '急腹症', '何炜婧'],
    ['住培第三年', '内科', '急腹症', '孙松'],
    ['住培第三年', '内科', '气管插管', '陶金好'],
    ['住培第三年', '内科', '气管插管', '朱丽'],
    ['住培第三年', '外科', '肠梗阻', '何炜婧'],
    ['住培第三年', '外科', '肠梗阻', '孙松'],
    ['住培第三年', '外科', '腔镜阑尾切除', '汤梁峰'],
    ['住培第三年', '外科', '腔镜阑尾切除', '李军']
  ].map(([grade, department, courseName, teacherName], index) => ({
    id: `PF${String(index + 1).padStart(3, '0')}`,
    grade,
    department,
    courseName,
    teacherName,
    availableTime: '',
    remark: ''
  }));

  function loadPrefillRecords(seedRecords) {
    try {
      const stored = JSON.parse(localStorage.getItem(PREFILL_STORAGE_KEY) || '[]');
      return Array.isArray(stored) && stored.length ? stored : seedRecords.map((record) => ({ ...record }));
    } catch (error) {
      return seedRecords.map((record) => ({ ...record }));
    }
  }

  const teacherById = (teachers, id) => teachers.find((teacher) => teacher.id === id);

  const AudienceTags = {
    props: ['audiences', 'studentGroups'],
    methods: {
      group(id) {
        return this.studentGroups.find((item) => item.id === id) || {};
      }
    },
    template: `
      <div class="audience-tags">
        <span v-for="item in audiences" :key="item.id" :class="['aud-tag', group(item.id).tone === 'minor' ? 'minor' : group(item.id).tone]">
          {{ group(item.id).short }} <b>{{ item.count }}人</b>
        </span>
      </div>
    `
  };

  const CourseListA = {
    components: { AudienceTags },
    props: [
      'courses',
      'teachers',
      'studentGroups',
      'baseColors',
      'icons',
      'filters',
      'audienceCascadeOptions',
      'audienceLevel2Options',
      'courseTagOptions',
      'departmentOptions',
      'hasActiveFilters',
      'selectedCourseIds'
    ],
    emits: ['teacher', 'detail', 'filter-clear', 'filters-clear', 'prefill', 'delete-course', 'start-schedule', 'update:selectedCourseIds'],
    data() {
      return {
        batchDelta: 0
      };
    },
    computed: {
      isAllSelected() {
        if (!this.courses || !this.courses.length) return false;
        return this.courses.every(c => this.selectedCourseIds.includes(c.id));
      }
    },
    methods: {
      teacherName(id) {
        return teacherById(this.teachers, id)?.name || id;
      },
      audienceLabel(id) {
        const group = this.studentGroups.find((g) => g.id === id);
        if (!group) return id;
        const l1 = this.audienceCascadeOptions.find((o) => o.key === group.level1Key);
        const l1Label = l1 ? l1.label : '';
        return l1Label + (group.subType ? ' · ' + group.subType : '');
      },
      courseTeacherNames(course) {
        const ids = course.teacherSelections?.all || Object.values(course.teacherSelections || {}).flat();
        return ids.map((id) => this.teacherName(id)).filter(Boolean).join('、') || '—';
      },
      teacherOptions(course) {
        return this.teachers.map((teacher) => ({
          label: `${teacher.name}${this.teacherRole(course, teacher.id) === 'A角' ? '[A角]' : ''}`,
          value: teacher.id
        }));
      },
      teacherRole(course, id) {
        if ((course.teacherSelections.A || []).includes(id)) return 'A角';
        if ((course.teacherSelections.B || []).includes(id)) return 'B角';
        return '';
      },
      selectedTeachers(course) {
        return course.teacherSelections.all || [];
      },
      audienceShort(id) {
        return this.studentGroups.find((group) => group.id === id)?.short || id;
      },
      formatAudienceText(course) {
        const names = course.audiences.map(a => this.audienceShort(a.id)).join('、');
        return names;
      },
      audienceBreakdown(course) {
        return (course.audiences || []).map((audience) => {
          const group = this.studentGroups.find((g) => g.id === audience.id);
          return {
            id: audience.id,
            label: audience.level || group?.name || this.audienceShort(audience.id),
            short: group?.short || this.audienceShort(audience.id),
            count: audience.count || 0,
            uncompleted: audience.uncompleted || 0
          };
        });
      },
      uncompletedCount(course) {
        if (typeof course.uncompleted === 'number') return course.uncompleted;
        return (course.audiences || []).reduce((sum, item) => sum + (item.uncompleted || 0), 0);
      },
      uncompletedTotal(course) {
        if (typeof course.total === 'number') return course.total;
        return (course.audiences || []).reduce((sum, item) => sum + (item.count || 0), 0);
      },
      toggleSelectAll(e) {
        const checked = typeof e === 'boolean' ? e : e?.target?.checked;
        let nextList = [...this.selectedCourseIds];
        if (checked) {
          this.courses.forEach(c => {
            if (!nextList.includes(c.id)) nextList.push(c.id);
          });
        } else {
          this.courses.forEach(c => {
            nextList = nextList.filter(id => id !== c.id);
          });
        }
        this.$emit('update:selectedCourseIds', nextList);
      },
      toggleSelect(courseId) {
        let nextList = [...this.selectedCourseIds];
        if (nextList.includes(courseId)) {
          nextList = nextList.filter(id => id !== courseId);
        } else {
          nextList.push(courseId);
        }
        this.$emit('update:selectedCourseIds', nextList);
      },
      inc(course) {
        course.sessions += 1;
      },
      dec(course) {
        course.sessions = Math.max(1, course.sessions - 1);
      },
      incBatch() {
        this.batchDelta += 1;
      },
      decBatch() {
        this.batchDelta -= 1;
      },
      applyBatchDelta() {
        if (!this.batchDelta || !this.selectedCourseIds.length) return;
        const delta = this.batchDelta;
        const targetCourses = this.courses.filter((c) => this.selectedCourseIds.includes(c.id));
        targetCourses.forEach((course) => {
          course.sessions = Math.max(1, (course.sessions || 0) + delta);
        });
        this.batchDelta = 0;
      }
    },
    template: `
      <section class="list-card compact-course-card">
        <div class="list-header compact-list-header">
          <div>
            <div class="card-title">待排课程列表</div>
          </div>
          <div class="head-buttons">
            <a-button size="small" @click="$emit('prefill')">教师可授课时间记录表</a-button>
            <a-button
              size="small"
              :type="selectedCourseIds.length > 0 ? 'primary' : 'default'"
              :disabled="selectedCourseIds.length === 0"
              @click="$emit('start-schedule')"
            >
              {{ selectedCourseIds.length > 0 ? '开始排课' : '选择课程去排课' }}
            </a-button>
          </div>
        </div>
        <section class="filter-strip in-list" aria-label="课程筛选">
          <button type="button" class="filter-all-btn" :class="{ active: !hasActiveFilters }" @click="$emit('filters-clear')">全部课程</button>
          <a-select v-model="filters.audienceLevel1" class="filter-dropdown" size="small" placeholder="授课对象" allow-clear @change="filters.audienceLevel2 = ''">
            <a-option v-for="option in audienceCascadeOptions" :key="option.key" :value="option.key">{{ option.label }}</a-option>
          </a-select>
          <a-select v-model="filters.audienceLevel2" class="filter-dropdown" size="small" placeholder="具体分类" allow-clear :disabled="!filters.audienceLevel1">
            <a-option v-for="option in audienceLevel2Options" :key="option" :value="option">{{ option }}</a-option>
          </a-select>
          <a-select v-model="filters.courseTag" class="filter-dropdown" size="small" placeholder="课程标签" allow-clear>
            <a-option v-for="option in courseTagOptions" :key="option.value" :value="option.value">{{ option.label }}</a-option>
          </a-select>
          <a-select v-model="filters.department" class="filter-dropdown wide" size="small" placeholder="科室" allow-clear>
            <a-option v-for="option in departmentOptions" :key="option.value" :value="option.value">{{ option.label }}</a-option>
          </a-select>
          <button v-if="hasActiveFilters" type="button" class="filter-clear-link" @click="$emit('filters-clear')">清空</button>
          <span class="filter-result-count">当前 {{ courses.length }} 门</span>
          <div v-if="selectedCourseIds.length > 0" class="batch-count-control">
            <span class="batch-count-label">批量+/-次数</span>
            <div class="batch-count-stepper">
              <button type="button" class="batch-count-btn" :disabled="selectedCourseIds.length === 0" @click="decBatch" aria-label="减少次数">−</button>
              <span class="batch-count-value" :class="{ zero: batchDelta === 0, positive: batchDelta > 0, negative: batchDelta < 0 }">{{ batchDelta > 0 ? '+' + batchDelta : batchDelta }}</span>
              <button type="button" class="batch-count-btn" :disabled="selectedCourseIds.length === 0" @click="incBatch" aria-label="增加次数">+</button>
            </div>
            <button
              type="button"
              class="batch-count-apply"
              :disabled="selectedCourseIds.length === 0 || batchDelta === 0"
              @click="applyBatchDelta"
            >应用</button>
          </div>
        </section>
        <div class="compact-head">
          <span class="name-col">
            <input class="compact-select-all" type="checkbox" :checked="isAllSelected" @change="toggleSelectAll">
            课程名称
          </span>
          <span class="teacher-col">授课师资</span>
          <span class="audience-col">授课对象</span>
          <span class="uncompleted-col">未修学员人数/总完成课程人数</span>
          <span class="capacity-col">单次课容量</span>
          <span class="sessions-col">开课次数</span>
        </div>
        <article v-for="course in courses" :key="course.id" class="compact-row" :class="{ 'pilot-course-row': course.entryGate }" @click="$emit('detail', course)">
          <div class="course-main">
            <input type="checkbox" :checked="selectedCourseIds.includes(course.id)" @change="toggleSelect(course.id)" @click.stop style="margin-right: 12px; flex-shrink: 0; width: 16px; height: 16px; cursor: pointer; accent-color: var(--color-primary);">
            <div class="course-title-line">
              <a-tag size="small" :color="course.tag === '通识' ? 'green' : course.tag === '内科' ? 'arcoblue' : 'orange'">{{ course.tag }}</a-tag>
              <strong>{{ course.name }}</strong>
              <span v-if="course.entryGate" class="upstream-gate-badge">开课计划待排 · {{ course.entryGate.completedChecks }}/{{ course.entryGate.totalChecks }}</span>
            </div>
          </div>
          <div class="teacher-cell">
            <span class="teacher-names">{{ courseTeacherNames(course) }}</span>
          </div>
          <div class="audience-cell">
            <span>{{ formatAudienceText(course) }}</span>
          </div>
          <div class="uncompleted-cell">
            <span class="uncompleted-text">{{ uncompletedCount(course) }} 人未修/共 {{ uncompletedTotal(course) }} 人</span>
            <span
              class="uncompleted-info"
              tabindex="0"
              aria-label="分年级未修详情"
              v-html="icons?.info || ''"
            ></span>
            <div class="uncompleted-tooltip" role="tooltip">
              <div
                v-for="row in audienceBreakdown(course)"
                :key="row.id"
                class="uncompleted-tooltip-row"
              >
                <span class="uncompleted-tooltip-label">{{ row.label }}</span>
                <span class="uncompleted-tooltip-value">{{ row.uncompleted }} 人未修/共 {{ row.count }} 人</span>
              </div>
            </div>
          </div>
          <div class="capacity-cell">
            <span>{{ course.capacity }}人/次</span>
          </div>
          <div class="session-cell" @click.stop>
            <a-input-number size="mini" mode="button" :min="1" v-model="course.sessions" style="width: 70px;" />
          </div>
        </article>
      </section>
    `
  };

  const App = {
    components: { CourseListA },
    data() {
      return {
        icons,
        keyword: '',
        tableKeyword: '',
        navItems: [
          { label: '首页', icon: icons.home },
          {
            label: '排课工作台',
            icon: icons.grid,
            active: true,
            children: ['待排课程清单', '可视化排课', '已排课程管理', '空间预约审核']
          },
          { label: '空间与资源', icon: icons.list, children: [] },
          { label: '通知发布', icon: icons.grid, children: [] },
          { label: '教学资源库', icon: icons.book, children: [] },
          { label: '数据与评估', icon: icons.chart, children: [] },
          { label: '用户与权限', icon: icons.info, children: [] },
          { label: '系统设置', icon: icons.user, children: [] }
        ],
        studentTypeChart: [
          { label: '住1', filterValue: 'zhu1', value: 47, display: '12门', color: '#0E42D2' },
          { label: '住2', filterValue: 'zhu2', value: 42, display: '10门', color: '#14C9C9' },
          { label: '住3', filterValue: 'zhu3', value: 39, display: '3门', color: '#4080FF' },
          { label: '本科', filterValue: 'undergrad', value: 12, display: '1门', color: '#6AA1FF' },
          { label: '外院', filterValue: 'outside', value: 8, display: '1门', color: '#93BEFF' }
        ],
        baseChart: [
          { label: '通识', value: 36, display: '14门', color: '#165DFF' },
          { label: '儿外', value: 24, display: '7门', color: '#14C9C9' },
          { label: '儿科', value: 40, display: '4门', color: '#6AA1FF' }
        ],
        pediatricsChart: [
          { label: '呼吸科', value: 8, display: '2门', color: '#0E42D2' },
          { label: '消化科', value: 10, display: '1门', color: '#165DFF' },
          { label: '神经内科', value: 11, display: '1门', color: '#4080FF' },
          { label: '心内科', value: 8, display: '0门', color: '#6AA1FF' },
          { label: '血液科', value: 9, display: '0门', color: '#93BEFF' },
          { label: '新生儿科', value: 7, display: '0门', color: '#14C9C9' },
          { label: '重症医学科', value: 6, display: '0门', color: '#45DAD8' },
          { label: '肾脏科', value: 5, display: '0门', color: '#7EE7E2' }
        ],
        surgeryChart: [
          { label: '普外科', value: 8, display: '1门', color: '#0E42D2' },
          { label: '骨科', value: 7, display: '1门', color: '#165DFF' },
          { label: '泌尿外科', value: 9, display: '1门', color: '#4080FF' },
          { label: '胸外科', value: 7, display: '2门', color: '#6AA1FF' },
          { label: '神经外科', value: 6, display: '1门', color: '#93BEFF' },
          { label: '麻醉科', value: 6, display: '1门', color: '#14C9C9' },
          { label: '耳鼻喉科', value: 7, display: '0门', color: '#45DAD8' },
          { label: '眼科', value: 7, display: '0门', color: '#7EE7E2' }
        ],
        teacherBarMode: 'hours',
        teacherTypeColors: {
          技能模拟课: '#165DFF',
          情景模拟课: '#14C9C9'
        },
        columns: [
          { title: '课程名称', key: 'name', width: 210 },
          { title: '授课教师', key: 'teacher', width: 210 },
          { title: '授课对象', key: 'target', width: 130 },
          { title: '批次/人数', key: 'batch', width: 170 },
          { title: '建议时间', key: 'suggestion', width: 170 },
          { title: '资源状态', key: 'resource', width: 172 },
          { title: '操作', key: 'action', width: 130 }
        ],
        studentGroups: pendingMock.studentGroups,
        teachers: pendingMock.teachers,
        courses: pendingMock.courses.map((course) => ({
          ...course,
          uncompleted: course.uncompleted ?? course.total,
          sessions: Math.max(1, Math.ceil((course.uncompleted ?? course.total) / Math.max(1, course.capacity || 10))),
          teacherSelections: {
            A: course.teachers.A ? [course.teachers.A] : [],
            B: course.teachers.B ? [course.teachers.B] : [],
            other: course.teachers.other ? [course.teachers.other] : [],
            all: [course.teachers.A, course.teachers.B, course.teachers.other].filter(Boolean)
          }
        })),
        baseColors: pendingMock.baseColors,
        studentDetails: pendingMock.studentDetails || {},
        filters: {
          audienceLevel1: '',
          audienceLevel2: '',
          courseTag: '',
          department: ''
        },
        audienceCascadeOptions: [
          { key: 'bk', label: '本科生', subOptions: ['见习', '实习', '全体'] },
          { key: 'yjs', label: '研究生', subOptions: ['一年级', '二年级', '三年级', '全体'] },
          { key: 'gp', label: '住培医师', subOptions: ['一年级', '二年级', '三年级', '全体'] },
          { key: 'zp', label: '专培医师', subOptions: ['内科', '外科', '其他', '医技科室', '全体'] },
          { key: 'jx', label: '进修医师', subOptions: ['内科', '外科', '其他', '医技科室', '全体'] },
          { key: 'jxhs', label: '进修护士', subOptions: ['内科', '外科', '其他', '医技科室', '全体'] },
          { key: 'doc', label: '医生（本院职工）', subOptions: ['内科', '外科', '其他', '医技科室', '全体'] },
          { key: 'nur', label: '护士（本院职工）', subOptions: ['内科', '外科', '其他', '医技科室', '全体'] },
          { key: 'she', label: '社会人员', subOptions: ['全体'] }
        ],
        courseTagOptions: [
          { label: '通识', value: '通识' },
          { label: '内科', value: '内科' },
          { label: '外科', value: '外科' }
        ],
        departmentOptions: [
          { label: '超声科', value: '超声科' },
          { label: '病理科', value: '病理科' },
          { label: '儿保科', value: '儿保科' },
          { label: '风湿科', value: '风湿科' },
          { label: '骨科', value: '骨科' },
          { label: '核医学科', value: '核医学科' },
          { label: '呼吸综合科', value: '呼吸综合科' },
          { label: '感染传染科', value: '感染传染科' },
          { label: '麻醉科', value: '麻醉科' },
          { label: '门急诊', value: '门急诊' },
          { label: '泌尿外科', value: '泌尿外科' },
          { label: '内分泌代谢科', value: '内分泌代谢科' },
          { label: '普外科', value: '普外科' },
          { label: '普外急诊', value: '普外急诊' },
          { label: '普外门诊', value: '普外门诊' },
          { label: '肾脏科', value: '肾脏科' },
          { label: '神经科', value: '神经科' },
          { label: '神经外科', value: '神经外科' },
          { label: '重症医学科', value: '重症医学科' },
          { label: '新生儿外科', value: '新生儿外科' },
          { label: '新生儿诊疗中心', value: '新生儿诊疗中心' },
          { label: '心电与心功能室', value: '心电与心功能室' },
          { label: '心内科', value: '心内科' },
          { label: '心胸外科', value: '心胸外科' },
          { label: '血液科', value: '血液科' },
          { label: '消化科', value: '消化科' },
          { label: '肿瘤外科', value: '肿瘤外科' },
          { label: '放射科', value: '放射科' }
        ],
        teacherDrawerVisible: false,
        currentTeacher: null,
        teacherTimeDraft: '',
        teacherTimeEditIndex: -1,
        courseDrawerVisible: false,
        currentCourse: null,
        prefillDrawerVisible: false,
        prefillKeyword: '',
        prefillRecords: loadPrefillRecords(prefillSeedRecords),
        prefillLastSyncedAt: '',
        teacherHoursModalVisible: false,
        teacherTypesModalVisible: false,

        filterButtons: [
          { key: 'type', label: '课程类型' },
          { key: 'target', label: '授课对象' },
          { key: 'resource', label: '资源状态' }
        ],
        typeOptions: ['课程类型', '技能操作', '理论强化', '病例讨论'].map((label) => ({ label, value: label })),
        targetOptions: ['授课对象', '1年级', '2年级', '规培医师', '专培'].map((label) => ({ label, value: label })),
        resourceOptions: ['资源状态', '可直接排课', '资源紧张', '需确认设备', '等待资源审核'].map((label) => ({ label, value: label })),
        selectedCourseIds: [],
        selectedCoursesDrawerVisible: false
      };
    },
    computed: {
      selectedCoursesList() {
        return this.courses.filter(course => this.selectedCourseIds.includes(course.id));
      },
      audienceLevel2Options() {
        const selected = this.audienceCascadeOptions.find((opt) => opt.key === this.filters.audienceLevel1);
        return selected ? selected.subOptions : [];
      },
      hasActiveFilters() {
        return Object.values(this.filters).some(Boolean);
      },

      teacherBarTitle() {
        return this.teacherBarMode === 'hours' ? '教师授课时长统计' : '教师授课次数按类型分布';
      },
      teacherMaxHours() {
        return Math.max(...this.teacherHourRows.map((row) => row.hours), 1);
      },
      teacherHourAxis() {
        const max = Math.ceil(this.teacherMaxHours);
        return [0, Math.ceil(max / 3), Math.ceil(max * 2 / 3), max];
      },
      teacherHourRows() {
        const randomHours = [18, 17.2, 14.3, 12.5, 10.8];
        const rows = this.teachers
          .filter((teacher) => this.teacherCourses(teacher.id).length > 0)
          .slice(0, 5)
          .map((teacher, index) => ({
            id: teacher.id,
            name: teacher.name,
            hours: randomHours[index] || 8,
            color: '#165DFF'
          }))
          .sort((a, b) => b.hours - a.hours);
        const max = Math.max(...rows.map((row) => row.hours), 1);
        return rows.map((row) => ({
          ...row,
          width: Math.max(6, Math.round((row.hours / max) * 100))
        }));
      },
      teacherTypeRows() {
        const rows = this.teachers.map((teacher) => {
          const typeCounts = {};
          this.teacherCourses(teacher.id).forEach((course) => {
            const type = this.courseType(course);
            typeCounts[type] = (typeCounts[type] || 0) + course.sessions;
          });
          const total = Object.values(typeCounts).reduce((sum, count) => sum + count, 0);
          return {
            id: teacher.id,
            name: teacher.name,
            typeCounts,
            total
          };
        })
          .filter((row) => row.total > 0)
          .sort((a, b) => b.total - a.total)
          .slice(0, 5);
        const max = Math.max(...rows.map((row) => row.total), 1);
        return rows.map((row) => ({
          ...row,
          segments: Object.entries(this.teacherTypeColors)
            .map(([type, color]) => ({
              type,
              color,
              count: row.typeCounts[type] || 0,
              width: ((row.typeCounts[type] || 0) / max) * 100
            }))
            .filter((segment) => segment.count > 0)
        }));
      },
      teacherTypeLegend() {
        return Object.entries(this.teacherTypeColors).map(([name, color]) => ({ name, color }));
      },
      allTeacherHourRows() {
        const randomHoursPool = [18, 17.2, 14.3, 12.5, 10.8, 9.5, 8.2, 7.6, 6.8, 5.5, 4.2, 3.8, 2.5, 1.8, 1.2];
        const rows = this.teachers
          .filter((teacher) => this.teacherCourses(teacher.id).length > 0)
          .map((teacher, index) => ({
            id: teacher.id,
            name: teacher.name,
            hours: randomHoursPool[index % randomHoursPool.length] || Math.round(Math.random() * 15 * 10) / 10,
            color: '#165DFF'
          }))
          .sort((a, b) => b.hours - a.hours);
        const max = Math.max(...rows.map((row) => row.hours), 1);
        return rows.map((row) => ({
          ...row,
          width: Math.max(6, Math.round((row.hours / max) * 100))
        }));
      },
      totalAllTeacherHours() {
        return this.allTeacherHourRows.reduce((sum, row) => sum + row.hours, 0);
      },
      allTeacherTypeRows() {
        const rows = this.teachers.map((teacher) => {
          const typeCounts = {};
          this.teacherCourses(teacher.id).forEach((course) => {
            const type = this.courseType(course);
            typeCounts[type] = (typeCounts[type] || 0) + course.sessions;
          });
          const total = Object.values(typeCounts).reduce((sum, count) => sum + count, 0);
          return {
            id: teacher.id,
            name: teacher.name,
            typeCounts,
            total
          };
        })
          .filter((row) => row.total > 0)
          .sort((a, b) => b.total - a.total);
        const max = Math.max(...rows.map((row) => row.total), 1);
        return rows.map((row) => ({
          ...row,
          segments: Object.entries(this.teacherTypeColors)
            .map(([type, color]) => ({
              type,
              color,
              count: row.typeCounts[type] || 0,
              width: ((row.typeCounts[type] || 0) / max) * 100
            }))
            .filter((segment) => segment.count > 0)
        }));
      },
      filteredCourses() {
        const keyword = this.tableKeyword.trim().toLowerCase();
        return this.courses.filter((course) => {
          const text = [
            course.name,
            course.base,
            course.department,
            ...course.audiences.map((audience) => this.groupShort(audience.id)),
            ...Object.values(course.teacherSelections || {}).flat().map((id) => this.teacherName(id))
          ].join(' ').toLowerCase();
          const matchedKeyword = !keyword || text.includes(keyword);
          const matchedAudienceLevel1 = !this.filters.audienceLevel1 || course.audiences.some((audience) => {
            const group = this.studentGroups.find((item) => item.id === audience.id);
            return group?.level1Key === this.filters.audienceLevel1;
          });
          const matchedAudienceLevel2 = !this.filters.audienceLevel2 || course.audiences.some((audience) => {
            const group = this.studentGroups.find((item) => item.id === audience.id);
            return group?.subType === this.filters.audienceLevel2;
          });
          const matchedCourseTag = !this.filters.courseTag || course.tag === this.filters.courseTag;
          const matchedDepartment = !this.filters.department || course.department === this.filters.department;
          return matchedKeyword && matchedAudienceLevel1 && matchedAudienceLevel2 && matchedCourseTag && matchedDepartment;
        });
      },
      filteredPrefillRecords() {
        const keyword = this.prefillKeyword.trim().toLowerCase();
        if (!keyword) return this.prefillRecords;
        return this.prefillRecords.filter((record) => {
          const text = [
            record.grade,
            record.department,
            record.courseName,
            record.teacherName,
            this.teacherInfoText(record),
            record.availableTime,
            record.remark
          ].join(' ').toLowerCase();
          return text.includes(keyword);
        });
      },
      filteredPrefillGroups() {
        const groups = new Map();
        this.filteredPrefillRecords.forEach((record) => {
          const courseName = record.courseName || '未命名课程';
          if (!groups.has(courseName)) {
            groups.set(courseName, {
              key: courseName,
              courseName,
              records: []
            });
          }
          groups.get(courseName).records.push(record);
        });
        return [...groups.values()];
      }
    },
    watch: {
      prefillRecords: {
        deep: true,
        handler(records) {
          try {
            localStorage.setItem(PREFILL_STORAGE_KEY, JSON.stringify(records));
          } catch (error) {
            window.ArcoVue?.Message?.warning?.('教师可授课时间记录暂未写入本地缓存');
          }
        }
      }
    },
    methods: {
      chartCourseTotal(segments) {
        return segments.reduce((sum, item) => sum + (parseInt(item.display, 10) || 0), 0);
      },
      formatHours(hours) {
        return Number.isInteger(hours) ? hours : hours.toFixed(1);
      },
      courseType(course) {
        if (/休克|复苏|急诊|窒息|呼吸困难|严重心律/.test(course.name)) return '情景模拟课';
        return '技能模拟课';
      },
      donutStyle(segments) {
        const total = segments.reduce((sum, item) => sum + item.value, 0);
        let current = 0;
        const stops = segments.map((item, index) => {
          const gap = segments.length > 4 ? 1.2 : 0.7;
          const start = (current / total) * 360;
          current += item.value;
          const end = (current / total) * 360 - gap;
          const color = item.color || chartColors[index % chartColors.length];
          return `${color} ${start.toFixed(2)}deg ${Math.max(start, end).toFixed(2)}deg, #ffffff ${Math.max(start, end).toFixed(2)}deg ${(current / total * 360).toFixed(2)}deg`;
        });
        return { background: `conic-gradient(${stops.join(', ')})` };
      },
      openDetail(course) {
        this.currentCourse = course;
        this.courseDrawerVisible = true;
      },
      startSchedule() {
        this.selectedCoursesDrawerVisible = true;
      },
      confirmStartSchedule() {
        this.selectedCoursesDrawerVisible = false;
        if (typeof window.navigateTo === 'function') {
          window.navigateTo('可视化排课');
        } else {
          document.body.dataset.active = '可视化排课';
        }
      },
      groupShort(id) {
        return this.studentGroups.find((group) => group.id === id)?.short || id;
      },
      audienceFullLabel(id) {
        const group = this.studentGroups.find((g) => g.id === id);
        if (!group) return id;
        return this.audienceDisplayName(group);
      },
      audienceDisplayName(group) {
        const level = this.audienceCascadeOptions.find((option) => option.key === group.level1Key);
        return [level?.label, group.subType].filter(Boolean).join(' · ') || group.name;
      },
      teacherName(id) {
        return this.teachers.find((teacher) => teacher.id === id)?.name || '';
      },
      teacherByName(name) {
        const normalized = String(name || '').trim();
        if (!normalized) return null;
        return this.teachers.find((teacher) => teacher.name === normalized) || null;
      },
      teacherInfoText(record) {
        const teacher = this.teacherByName(record.teacherName);
        if (!teacher) return '未匹配课程池师资信息';
        return [teacher.title, teacher.department, teacher.phone].filter(Boolean).join(' · ');
      },
      prefillCourseTag(group) {
        return group.records.find((record) => record.department)?.department || '未分类';
      },
      teacherRoleForCourse(course, id) {
        if ((course.teacherSelections?.A || []).includes(id)) return 'A角';
        if ((course.teacherSelections?.B || []).includes(id)) return 'B角';
        return '';
      },
      courseTeacherIds(course) {
        return course?.teacherSelections?.all || Object.values(course?.teacherSelections || {}).flat();
      },
      deleteCourse(course) {
        const index = this.courses.findIndex((item) => item.id === course.id);
        if (index < 0) return;
        this.courses.splice(index, 1);
        if (this.currentCourse?.id === course.id) {
          this.courseDrawerVisible = false;
          this.currentCourse = null;
        }
        window.ArcoVue.Message.success('已取消排课，课程退回课程池');
      },
      courseHasTeacherTitle(course, title) {
        const teacherIds = Object.values(course.teacherSelections || {}).flat();
        return teacherIds.some((id) => this.teachers.find((teacher) => teacher.id === id)?.title === title);
      },
      applyChartFilter(key, value, tagValue = '') {
        if (key === 'department') {
          this.filters.courseTag = tagValue || this.filters.courseTag;
          this.filters.department = this.filters.department === value ? '' : value;
          return;
        }
        this.filters[key] = this.filters[key] === value ? '' : value;
      },
      clearFilters() {
        this.tableKeyword = '';
        this.filters = {
          audienceLevel1: '',
          audienceLevel2: '',
          courseTag: '',
          department: ''
        };
      },
      openTeacherDrawer(teacher) {
        if (!Array.isArray(teacher.times)) {
          teacher.times = [];
        }
        this.currentTeacher = teacher;
        this.teacherTimeDraft = '';
        this.teacherTimeEditIndex = -1;
        this.teacherDrawerVisible = true;
      },
      openPrefillDrawer() {
        this.prefillDrawerVisible = true;
      },

      openTeacherHoursModal() {
        this.teacherHoursModalVisible = true;
      },
      openTeacherTypesModal() {
        this.teacherTypesModalVisible = true;
      },
      ensureTeacherByName(name, sourceRecord = {}) {
        const normalized = String(name || '').trim();
        if (!normalized) return null;
        const existing = this.teacherByName(normalized);
        if (existing) return existing;
        const teacher = {
          id: `t-custom-${Date.now()}-${this.teachers.length}`,
          name: normalized,
          title: '待补充职称',
          department: sourceRecord.department || '待补充科室',
          phone: '待补充电话',
          times: [],
          note: '由教师可授课时间记录表确认更新后生成'
        };
        this.teachers.push(teacher);
        return teacher;
      },
      applyPrefillUpdates() {
        const validRecords = this.prefillRecords
          .map((record) => ({
            ...record,
            courseName: String(record.courseName || '').trim(),
            teacherName: String(record.teacherName || '').trim(),
            availableTime: String(record.availableTime || '').trim()
          }))
          .filter((record) => record.courseName && record.teacherName);

        const byCourse = new Map();
        validRecords.forEach((record) => {
          if (!byCourse.has(record.courseName)) byCourse.set(record.courseName, []);
          byCourse.get(record.courseName).push(record);
        });

        let updatedCourses = 0;
        byCourse.forEach((records, courseName) => {
          const course = this.courses.find((item) => item.name === courseName);
          if (!course) return;
          const teacherIds = records
            .map((record) => this.ensureTeacherByName(record.teacherName, record)?.id)
            .filter(Boolean);
          course.teacherSelections = {
            A: teacherIds[0] ? [teacherIds[0]] : [],
            B: teacherIds[1] ? [teacherIds[1]] : [],
            other: teacherIds.slice(2),
            all: [...new Set(teacherIds)]
          };
          course.teachers = {
            A: teacherIds[0] || '',
            B: teacherIds[1] || '',
            other: teacherIds.slice(2).join(',')
          };
          updatedCourses++;
        });

        const timesByTeacher = new Map();
        validRecords.forEach((record) => {
          if (!record.availableTime) return;
          const teacher = this.ensureTeacherByName(record.teacherName, record);
          if (!teacher) return;
          if (!timesByTeacher.has(teacher.id)) timesByTeacher.set(teacher.id, new Set(teacher.times || []));
          timesByTeacher.get(teacher.id).add(`${record.courseName}：${record.availableTime}`);
        });
        timesByTeacher.forEach((times, teacherId) => {
          const teacher = this.teachers.find((item) => item.id === teacherId);
          if (teacher) teacher.times = [...times];
        });

        this.prefillLastSyncedAt = new Date().toLocaleString('zh-CN', { hour12: false });
        window.ArcoVue.Message.success(`已确认更新：同步 ${updatedCourses} 门课程与 ${timesByTeacher.size} 位教师可授课时间`);
      },
      savePrefillRecord() {
        this.prefillRecords.unshift({
          id: `PF${Date.now()}`,
          grade: '',
          department: '',
          courseName: '',
          teacherName: '',
          availableTime: '',
          remark: ''
        });
      },
      addPrefillTeacher(group) {
        const source = group.records[group.records.length - 1] || {};
        const record = {
          id: `PF${Date.now()}`,
          grade: source.grade || '',
          department: source.department || '',
          courseName: group.courseName === '未命名课程' ? '' : group.courseName,
          teacherName: '',
          availableTime: '',
          remark: ''
        };
        const sourceIndexes = group.records
          .map((item) => this.prefillRecords.findIndex((recordItem) => recordItem.id === item.id))
          .filter((index) => index >= 0);
        const insertIndex = sourceIndexes.length ? Math.max(...sourceIndexes) + 1 : this.prefillRecords.length;
        this.prefillRecords.splice(insertIndex, 0, record);
      },
      renamePrefillCourse(group, value) {
        const nextValue = typeof value === 'string' ? value : value?.target?.value ?? '';
        group.records.forEach((record) => {
          record.courseName = nextValue;
        });
      },
      removePrefillRecord(id) {
        const index = this.prefillRecords.findIndex((record) => record.id === id);
        if (index < 0) return;
        this.prefillRecords.splice(index, 1);
        window.ArcoVue.Message.success('教师记录已删除');
      },
      teacherRoleLabel(record) {
        const sameCourse = this.prefillRecords.filter((item) =>
          item.courseName === record.courseName
        );
        const index = sameCourse.findIndex((item) => item.id === record.id);
        if (index === 0) return 'A角';
        if (index === 1) return 'B角';
        return '';
      },
      teacherCourses(id) {
        return this.courses.filter((course) => Object.values(course.teacherSelections || {}).flat().includes(id));
      },
      courseRank(index) {
        return String(index + 1).padStart(2, '0');
      },
      courseAudienceText(course) {
        return course.audiences.map((audience) => `${this.groupShort(audience.id)} ${audience.count}人`).join('、');
      },
      startAddTeacherTime() {
        this.teacherTimeDraft = '';
        this.teacherTimeEditIndex = this.currentTeacher?.times?.length ?? 0;
      },
      startEditTeacherTime(index) {
        this.teacherTimeDraft = this.currentTeacher.times[index] || '';
        this.teacherTimeEditIndex = index;
      },
      saveTeacherTime() {
        const value = this.teacherTimeDraft.trim();
        if (!value || !this.currentTeacher) return;
        if (!Array.isArray(this.currentTeacher.times)) {
          this.currentTeacher.times = [];
        }
        if (this.teacherTimeEditIndex >= this.currentTeacher.times.length) {
          this.currentTeacher.times.push(value);
        } else if (this.teacherTimeEditIndex >= 0) {
          this.currentTeacher.times.splice(this.teacherTimeEditIndex, 1, value);
        }
        this.teacherTimeDraft = '';
        this.teacherTimeEditIndex = -1;
      },
      cancelTeacherTimeEdit() {
        this.teacherTimeDraft = '';
        this.teacherTimeEditIndex = -1;
      },
      removeTeacherTime(index) {
        if (!this.currentTeacher || !Array.isArray(this.currentTeacher.times)) return;
        this.currentTeacher.times.splice(index, 1);
        this.cancelTeacherTimeEdit();
      },
      studentGroupCourses(id) {
        return this.courses.filter((course) => course.audiences.some((audience) => audience.id === id));
      }
    }
  };

  waitForVue(function () {
    const vueApp = Vue.createApp(App);
    vueApp.use(window.ArcoVue);
    if (document.getElementById('scheduler-pending-app')) {
      vueApp.mount('#scheduler-pending-app');
    }
  });
}());
