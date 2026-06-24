const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(__dirname, 'pending-course-list.js');
let content = fs.readFileSync(targetFile, 'utf8');

// The replacement content for CourseListA with correct multiline layout and merged columns
const replacement = `  const CourseListA = {
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
    emits: ['teacher', 'detail', 'filter-clear', 'filters-clear', 'prefill', 'calc-sessions', 'delete-course', 'start-schedule', 'update:selectedCourseIds'],
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
          label: \`\${teacher.name}\${this.teacherRole(course, teacher.id) === 'A角' ? '[A角]' : ''}\`,
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
        return \`\${names}（共 \${course.total} 人）\`;
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
      }
    },
    template: \`
      <section class="list-card compact-course-card">
        <div class="list-header compact-list-header">
          <div>
            <div class="card-title">待排课程列表</div>
          </div>
          <div class="head-buttons">
            <a-button size="small" @click="$emit('calc-sessions')">计算开课次数</a-button>
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
        </section>
        <div class="compact-head">
          <span class="name-col">
            <input type="checkbox" :checked="isAllSelected" @change="toggleSelectAll" style="margin-right: 8px; vertical-align: middle;">
            课程名称
          </span>
          <span class="teacher-col">授课师资</span>
          <span class="audience-col">授课对象</span>
          <span class="uncompleted-col">未修学员人数</span>
          <span class="capacity-col">单次课容量</span>
          <span class="sessions-col">开课次数</span>
        </div>
        <article v-for="course in courses" :key="course.id" class="compact-row" @click="$emit('detail', course)">
          <div class="course-main">
            <input type="checkbox" :checked="selectedCourseIds.includes(course.id)" @change="toggleSelect(course.id)" @click.stop style="margin-right: 12px; flex-shrink: 0; width: 16px; height: 16px; cursor: pointer; accent-color: var(--color-primary);">
            <div class="course-title-line">
              <a-tag size="small" :color="course.tag === '通识' ? 'green' : course.tag === '内科' ? 'arcoblue' : 'orange'">{{ course.tag }}</a-tag>
              <strong>{{ course.name }}</strong>
            </div>
          </div>
          <div class="teacher-cell">
            <span class="teacher-names">{{ courseTeacherNames(course) }}</span>
          </div>
          <div class="audience-cell">
            <span>{{ formatAudienceText(course) }}</span>
          </div>
          <div class="uncompleted-cell">
            <span>{{ course.total }}人（<span style="color:var(--color-danger);font-weight:600;">{{ course.uncompleted || Math.max(1, Math.round(course.total * 0.8)) }}人未修</span>）</span>
          </div>
          <div class="capacity-cell">
            <span>每次{{ course.capacity }}人</span>
          </div>
          <div class="session-cell" @click.stop>
            <a-input-number size="mini" mode="button" :min="1" v-model="course.sessions" style="width: 70px;" />
          </div>
        </article>
      </section>
    \`
  };`;

// Split by newlines (we must match real newlines in the read content)
const lines = content.split('\n');
let targetIndex = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('const CourseListA = {') || lines[i].includes('components: { AudienceTags }')) {
    targetIndex = i;
    break;
  }
}

if (targetIndex !== -1) {
  lines[targetIndex] = replacement;
  fs.writeFileSync(targetFile, lines.join('\n'), 'utf8');
  console.log('Successfully fixed pending-course-list.js!');
} else {
  console.error('Could not find CourseListA line!');
}
