(function () {
  var vueApp = null;

  function waitForVue(callback) {
    if (window.Vue && window.Vue.createApp) {
      callback();
    } else {
      setTimeout(function () { waitForVue(callback); }, 50);
    }
  }

  function injectCSS() {
    if (document.getElementById('as-module-css')) return;
    var link = document.createElement('link');
    link.id = 'as-module-css';
    link.rel = 'stylesheet';
    link.href = (document.querySelector('script[src$="assessment.js"]') || {}).src
      .replace(/assessment\.js$/, 'assessment.css');
    document.head.appendChild(link);
  }

  function shouldHandle() {
    var role = document.body.dataset.role;
    var active = document.body.dataset.active;
    return role === 'teacher' && (active === '作业考试' || active === '成绩评价' || active === '评估任务');
  }

  function renderShell() {
    injectCSS();
    var content = document.querySelector('.content');
    if (!content || !shouldHandle()) {
      if (vueApp) { try { vueApp.unmount(); } catch (e) {} vueApp = null; }
      return;
    }

    content.innerHTML = '<div id="assessment-app"></div>';

    waitForVue(function () {
      var app = Vue.createApp({
        template: `
          <div class="assessment-wrapper">
            <div class="assessment-top-toolbar">
              <div class="assessment-toolbar-title">
                <strong>评估任务</strong>
                <a-radio-group v-model="activePage" type="button" size="medium" @change="handlePageSwitch">
                  <a-radio value="作业考试">作业考试</a-radio>
                  <a-radio value="成绩评价">成绩评价</a-radio>
                </a-radio-group>
              </div>
              <label class="assessment-toolbar-search">
                <i class="fas fa-search"></i>
                <input v-model="filterHwName" type="search" :placeholder="activePage === '作业考试' ? '搜索作业、试卷...' : '搜索学员姓名...'">
              </label>
            </div>

            <!-- ================= VIEW 1: HOMEWORK & EXAMS (作业考试) ================= -->
            <div v-if="activePage === '作业考试'">
              <!-- Metrics Cards -->
              <a-row :gutter="16" class="assessment-metrics-row">
                <a-col :span="6" v-for="m in hwMetrics" :key="m.label">
                  <div class="assessment-kpi-card primary">
                    <div>
                      <div class="assessment-kpi-label">{{ m.label }}</div>
                      <div class="assessment-kpi-value">{{ m.value }}</div>
                    </div>
                    <div class="assessment-kpi-icon primary">
                      <i :class="m.icon + ' fa-lg'"></i>
                    </div>
                  </div>
                </a-col>
              </a-row>

              <!-- Main Card Container -->
              <div class="assessment-main-card">
                <!-- Filter Bar -->
                <div class="assessment-filter-bar">
                  <a-space>
                    <a-select v-model="filterCourse" placeholder="全部课程" class="assessment-filter-select" size="small">
                      <a-option>全部课程</a-option>
                      <a-option>新生儿插管术操作示教</a-option>
                      <a-option>急救护理综合实训</a-option>
                    </a-select>
                  </a-space>
                  <a-button type="primary" size="small" @click="showToast('批量提醒已发送！')">
                    <template #icon><i class="fas fa-bell"></i></template>一键催缴未交作业
                  </a-button>
                </div>

                <!-- Assignment Table -->
                <a-table :data="filteredAssignments" :pagination="false" :bordered="false">
                  <template #columns>
                    <a-table-column title="作业 / 考试名称" data-index="name">
                      <template #cell="{ record }">
                        <strong class="assessment-name-strong">{{ record.name }}</strong>
                      </template>
                    </a-table-column>
                    <a-table-column title="关联课程" data-index="course"></a-table-column>
                    <a-table-column title="提交进度">
                      <template #cell="{ record }">
                        <span>{{ record.submitCount }} / {{ record.totalCount }} ({{ record.submitRate }}%)</span>
                      </template>
                    </a-table-column>
                    <a-table-column title="待批改份数">
                      <template #cell="{ record }">
                        <strong :class="record.pendingGrading > 0 ? 'assessment-pending-warning' : 'assessment-pending-normal'">{{ record.pendingGrading }} 份</strong>
                      </template>
                    </a-table-column>
                    <a-table-column title="状态" data-index="status">
                      <template #cell="{ record }">
                        <a-tag :color="record.status === '已归档' ? 'green' : record.status === '批改中' ? 'orange' : 'arcoblue'">{{ record.status }}</a-tag>
                      </template>
                    </a-table-column>
                    <a-table-column title="操作" align="right">
                      <template #cell="{ record }">
                        <a-space>
                          <a-button v-if="record.status === '待发布'" type="outline" size="small" @click="showToast('测验试卷发布成功！已推送到所有学员')">去发布</a-button>
                          <a-button v-else-if="record.pendingGrading > 0" type="primary" size="small" @click="openGradingDrawer(record)">批改作业</a-button>
                          <a-button v-else type="text" size="small" @click="openGradingDrawer(record)">查看记录</a-button>
                        </a-space>
                      </template>
                    </a-table-column>
                  </template>
                </a-table>
              </div>
            </div>

            <!-- ================= VIEW 2: GRADES & EVALUATION (成绩评价) ================= -->
            <div v-if="activePage === '成绩评价'">
              <!-- Metrics Cards -->
              <a-row :gutter="16" class="assessment-metrics-row">
                <a-col :span="6" v-for="m in evalMetrics" :key="m.label">
                  <div class="assessment-kpi-card success">
                    <div>
                      <div class="assessment-kpi-label">{{ m.label }}</div>
                      <div class="assessment-kpi-value">{{ m.value }}</div>
                    </div>
                    <div class="assessment-kpi-icon success">
                      <i :class="m.icon + ' fa-lg'"></i>
                    </div>
                  </div>
                </a-col>
              </a-row>

              <!-- Main Table Grid -->
              <a-row :gutter="20">
                <a-col :span="16">
                  <a-card title="学员综合考评成绩单 (PICU规培班)" :bordered="false" class="assessment-feedback-card">
                    <a-table :data="filteredGradeBook" :pagination="false" :bordered="false">
                      <template #columns>
                        <a-table-column title="学员姓名" data-index="name">
                          <template #cell="{ record }">
                            <strong class="assessment-name-strong">{{ record.name }}</strong>
                            <a-tag v-if="record.riskFlag" color="red" size="mini" class="assessment-risk-tag"><i class="fas fa-exclamation-triangle"></i> 预警</a-tag>
                          </template>
                        </a-table-column>
                        <a-table-column title="理论考核 (分)" data-index="theory"></a-table-column>
                        <a-table-column title="技术操作 (分)" data-index="skill"></a-table-column>
                        <a-table-column title="OSCE站分 (分)" data-index="osce"></a-table-column>
                        <a-table-column title="沟通能力" data-index="comm">
                          <template #cell="{ record }">
                            <span :class="record.comm === '待提高' ? 'assessment-comm-warning' : ''">{{ record.comm }}</span>
                          </template>
                        </a-table-column>
                        <a-table-column title="综合评分" data-index="totalScore">
                          <template #cell="{ record }">
                            <strong class="assessment-score-primary">{{ record.totalScore }}</strong>
                          </template>
                        </a-table-column>
                        <a-table-column title="操作" align="right">
                          <template #cell="{ record }">
                            <a-button type="outline" size="small" @click="openPortraitDrawer(record)">
                              <template #icon><i class="fas fa-user-chart"></i></template>学员画像
                            </a-button>
                          </template>
                        </a-table-column>
                      </template>
                    </a-table>
                  </a-card>
                </a-col>

                <!-- Right Column: Course Student Feedback -->
                <a-col :span="8">
                  <a-card title="匿名学生课后评价反馈" :bordered="false" class="assessment-feedback-card">
                    <div class="assessment-feedback-list">
                      <div v-for="fb in anonymousFeedback" :key="fb.id" class="assessment-feedback-item">
                        <div class="assessment-feedback-header">
                          <span class="assessment-feedback-course">{{ fb.course }}</span>
                          <a-rate :model-value="fb.rating" readonly size="mini" />
                        </div>
                        <p class="assessment-feedback-content">"{{ fb.content }}"</p>
                        <div class="assessment-feedback-tags">
                          <a-tag size="mini" v-for="tag in fb.tags" :key="tag" color="gray">{{ tag }}</a-tag>
                        </div>
                      </div>
                    </div>
                  </a-card>
                </a-col>
              </a-row>
            </div>

            <!-- ================= Drawer 1: Homework Grading Drawer ================= -->
            <a-drawer v-model:visible="drawers.grading" title="随堂作业与临床病例批改" width="760px" unmount-on-close @ok="submitGrading">
              <div v-if="activeHw" class="assessment-drawer-content">
                <!-- Left pane: Student List -->
                <div class="assessment-student-sidebar">
                  <div class="assessment-sidebar-title">本班级提交列表</div>
                  <div v-for="stu in activeHwStudents" :key="stu.name" class="grading-stu-sidebar-card"
                       :class="{ active: currentHwStudent.name === stu.name }" @click="selectHwStudent(stu)">
                    <div class="assessment-student-item-inner">
                      <strong>{{ stu.name }}</strong>
                      <a-tag size="mini" :color="stu.graded ? 'green' : 'orange'">{{ stu.graded ? '已阅' : '待阅' }}</a-tag>
                    </div>
                    <small class="assessment-student-score" v-if="stu.score">得分: {{ stu.score }}分</small>
                  </div>
                </div>

                <!-- Right pane: Answer Content & Grading Form -->
                <div class="assessment-grading-content">
                  <!-- Student Submission Details -->
                  <div class="assessment-submission-card">
                    <div class="assessment-submission-header">
                      <strong class="assessment-submission-title">【{{ currentHwStudent.name }}】的作业答卷</strong>
                      <span class="assessment-submission-time">提交于: 2026-05-28 15:40</span>
                    </div>
                    
                    <div class="assessment-submission-text">
                      {{ currentHwStudent.submissionText || '暂无文字答案提交。已上传临床技能操作录屏视频与报告，点击可预览。' }}
                    </div>
                    
                    <!-- mock attachment -->
                    <div class="assessment-attachment" @click="showToast('播放操作示教视频...')">
                      <div class="assessment-attachment-icon"><i class="far fa-file-video"></i></div>
                      <div class="assessment-attachment-info">
                        <div class="assessment-attachment-name">儿童插管技能实操录制.mp4</div>
                        <div class="assessment-attachment-meta">18.5 MB · 点击在线播放</div>
                      </div>
                    </div>
                  </div>

                  <!-- Grading Panel -->
                  <div class="assessment-grading-panel">
                    <div class="assessment-panel-title">
                      <span class="assessment-panel-title-bar"></span> 形成性量表评估打分
                    </div>
                    
                    <a-form :model="gradingForm" layout="vertical">
                      <a-form-item label="操作规范度评分 (满分 40分)">
                        <a-slider v-model="gradingForm.part1" :max="40" show-input size="small" />
                      </a-form-item>
                      <a-form-item label="操作熟练程度评分 (满分 30分)">
                        <a-slider v-model="gradingForm.part2" :max="30" show-input size="small" />
                      </a-form-item>
                      <a-form-item label="理论与临床思维评分 (满分 30分)">
                        <a-slider v-model="gradingForm.part3" :max="30" show-input size="small" />
                      </a-form-item>
                      
                      <div class="assessment-score-summary">
                        <span class="assessment-score-label">最终综合得分：</span>
                        <strong class="assessment-score-total">{{ gradingFormTotal }} 分</strong>
                      </div>

                      <a-form-item label="评语与带教指导意见">
                        <a-textarea v-model="gradingForm.comment" placeholder="请输入带教寄语、细节需要提高的地方..." :auto-size="{ minRows:3, maxRows:5 }" />
                      </a-form-item>
                    </a-form>
                  </div>
                </div>
              </div>
            </a-drawer>

            <!-- ================= Drawer 2: Student Portrait Drawer ================= -->
            <a-drawer v-model:visible="drawers.portrait" title="数字化学员综合画像与能力雷达" width="580px" :footer="false" unmount-on-close>
              <div v-if="activeStudent" class="assessment-portrait-content">
                <!-- Student Summary Card -->
                <div class="assessment-portrait-summary">
                  <a-avatar class="assessment-portrait-avatar" :size="48">{{ activeStudent.name.charAt(0) }}</a-avatar>
                  <div>
                    <h3 class="assessment-portrait-name">
                      {{ activeStudent.name }}
                      <a-tag size="small" color="arcoblue">PICU规培班</a-tag>
                    </h3>
                    <p class="assessment-portrait-meta">2024级住培医师 · 当前学年绩点 3.65 (前15%)</p>
                  </div>
                </div>

                <!-- Radar Competency Chart -->
                <div class="assessment-radar-container">
                  <div class="assessment-radar-title">
                    <i class="fas fa-chart-pie me-1"></i> 临床胜任力雷达大图 (OSCE 5维能力评估)
                  </div>
                  
                  <!-- Responsive SVG Radar Chart -->
                  <svg width="260" height="260" viewBox="0 0 300 300" class="assessment-radar-svg">
                    <!-- background grid pentagons -->
                    <polygon points="150,30 264,113 221,247 79,247 36,113" fill="none" stroke="var(--color-border)" stroke-width="1" />
                    <polygon points="150,60 236,122 203,220 97,220 64,122" fill="none" stroke="var(--color-border)" stroke-width="1" />
                    <polygon points="150,90 207,132 185,193 115,193 93,132" fill="none" stroke="var(--color-border)" stroke-width="1" />
                    <polygon points="150,120 179,141 168,167 132,167 121,141" fill="none" stroke="var(--color-border)" stroke-width="1" />
                    
                    <!-- grid axis lines -->
                    <line x1="150" y1="150" x2="150" y2="30" stroke="var(--color-border)" stroke-width="1" />
                    <line x1="150" y1="150" x2="264" y2="113" stroke="var(--color-border)" stroke-width="1" />
                    <line x1="150" y1="150" x2="221" y2="247" stroke="var(--color-border)" stroke-width="1" />
                    <line x1="150" y1="150" x2="79" y2="247" stroke="var(--color-border)" stroke-width="1" />
                    <line x1="150" y1="150" x2="36" y2="113" stroke="var(--color-border)" stroke-width="1" />
                    
                    <!-- labels -->
                    <text x="150" y="20" font-size="12" font-weight="600" text-anchor="middle" fill="var(--color-text-2)">理论知识</text>
                    <text x="274" y="117" font-size="12" font-weight="600" text-anchor="start" fill="var(--color-text-2)">操作技能</text>
                    <text x="231" y="262" font-size="12" font-weight="600" text-anchor="start" fill="var(--color-text-2)">团队协作</text>
                    <text x="69" y="262" font-size="12" font-weight="600" text-anchor="end" fill="var(--color-text-2)">医患沟通</text>
                    <text x="26" y="117" font-size="12" font-weight="600" text-anchor="end" fill="var(--color-text-2)">应急能力</text>
                    
                    <!-- actual student polygon -->
                    <polygon :points="radarPoints" fill="var(--color-primary-light-bg)" stroke="var(--color-primary)" stroke-width="2.5" />
                    
                    <!-- active nodes dots -->
                    <circle v-for="node in radarNodes" :key="node.x" :cx="node.x" :cy="node.y" r="4.5" fill="var(--color-primary)" />
                  </svg>
                </div>

                <!-- Portrait details assessment -->
                <div style="background:#fff; border:1px solid #e5e6eb; border-radius:8px; padding:16px; margin-bottom:16px;">
                  <div style="font-weight:700; font-size:13px; color:#1d2129; margin-bottom:10px;"><i class="fas fa-graduation-cap me-1" style="color:#00b42a;"></i> 数字化诊断建议（形成性反馈）：</div>
                  <ul style="padding-left:18px; margin:0; font-size:12.5px; color:#4e5969; line-height:1.6;">
                    <li><strong>优势项：</strong> 医患沟通分值（{{ activeStudent.points[3] }}/100）及团队协作能力非常出色，临床PBL讨论发言踊跃，具有优秀的职业素养。</li>
                    <li><strong>提升项：</strong> 操作技能熟练度（{{ activeStudent.points[1] }}/100）属于正常波动区间，但在儿童导尿、骨髓穿刺等复杂技术性实操中操作时间略微偏长。</li>
                    <li style="color:#ff7d00; font-weight:600;"><i class="fas fa-lightbulb"></i> <strong>智能教学辅导建议：</strong> 建议课后引导其利用“场地与物资申请”自主租借模拟器人，在8楼技能中心自主刷卡练习，以提高无菌熟练度。</li>
                  </ul>
                </div>

                <!-- Academic Warn alert v-if -->
                <div v-if="activeStudent.riskFlag" style="background:#fff3f3; color:#f53f3f; border:1px solid #ffd8d8; border-radius:8px; padding:16px; display:flex; gap:10px; align-items:flex-start;">
                  <i class="fas fa-exclamation-triangle" style="margin-top:2px;"></i>
                  <div>
                    <strong style="font-size:13px; display:block; margin-bottom:4px;">综合表现黄色预警标志</strong>
                    <span style="font-size:12px; line-height:1.4; display:block;">该学生在操作技能考核中连续两次课时及格线徘徊。建议主讲讲师对其增加课后一对一模型带教，并在下次《儿童插管》考核中进行重点关注。</span>
                  </div>
                </div>
              </div>
            </a-drawer>

          </div>
        `,
        data() {
          return {
            activePage: document.body.dataset.active === '评估任务' ? '作业考试' : (document.body.dataset.active || '作业考试'),
            filterCourse: '全部课程',
            filterHwName: '',
            drawers: {
              grading: false,
              portrait: false
            },
            hwMetrics: [
              { label: '待批改作业', value: '3 份', icon: 'fas fa-edit' },
              { label: '本周已阅结案', value: '42 份', icon: 'fas fa-check-circle' },
              { label: '学员及时提交率', value: '94.5 %', icon: 'fas fa-hourglass-half' },
              { label: '所带规培班平均分', value: '86.5 分', icon: 'fas fa-graduation-cap' }
            ],
            evalMetrics: [
              { label: '班级考核合格率', value: '100 %', icon: 'fas fa-user-check' },
              { label: '学生互评平均分', value: '9.2 分/10', icon: 'fas fa-heart' },
              { label: '预警学员预警数', value: '1 人', icon: 'fas fa-exclamation-triangle' },
              { label: '评教反馈参与度', value: '96.2 %', icon: 'fas fa-poll' }
            ],
            assignments: [
              { id: 1, name: '新生儿插管操作课后作业', course: '新生儿插管术操作示教', submitCount: 22, totalCount: 24, submitRate: 91.6, pendingGrading: 3, status: '批改中' },
              { id: 2, name: '儿科重症心肺复苏随堂测试', course: '急救护理综合实训', submitCount: 32, totalCount: 32, submitRate: 100, pendingGrading: 0, status: '已归档' },
              { id: 3, name: '梗阻性休克识别与应急考核', course: '梗阻性休克识别与处理', submitCount: 0, totalCount: 20, submitRate: 0, pendingGrading: 0, status: '待发布' }
            ],
            gradeBook: [
              { name: '林小明', theory: 88, skill: 92, osce: 90, comm: '优秀', totalScore: 89.6, points: [88, 92, 90, 95, 84], riskFlag: false },
              { name: '王雪', theory: 82, skill: 88, osce: 85, comm: '优秀', totalScore: 84.8, points: [82, 88, 85, 90, 80], riskFlag: false },
              { name: '张伟', theory: 72, skill: 64, osce: 68, comm: '待提高', totalScore: 67.2, points: [72, 64, 68, 70, 60], riskFlag: true }
            ],
            anonymousFeedback: [
              { id: 1, course: '急救护理综合实训', rating: 5, content: '老师讲授得极其生动，PALS团队协作情境太棒了！唯一建议是心肺复苏模拟机器以后能多准备几套，练习时间就更充裕了。', tags: ['互动极佳', '情境逼真'] },
              { id: 2, course: '新生儿插管术操作示教', rating: 4.5, content: '老师的手法非常娴熟，无菌观念强调得特别好。希望后面能有录屏回放，让我们温习时能跟着视频反复练习细节。', tags: ['讲解细致', '教具充足'] }
            ],

            // Active sheet grading details state
            activeHw: null,
            activeHwStudents: [
              { name: '林小明', graded: false, submissionText: '1. 新生儿插管首选气管导管尺寸是多少？\n答：新生儿气管插管的管径大小选择需要结合婴儿的胎龄与体重。一般常规体重足月儿常首选3.0mm或3.5mm内径的导管。对于极低出生体重儿（<1000g）则需要首选2.5mm的内径管件。\n\n2. 气管插管在气管内的深度位置如何判定？\n答：常规定位法为端-唇距离公式即“体重（kg）+6”厘米，在此深度通过听诊双肺呼吸音对称性来最终验证导管深度是否合适。' },
              { name: '王雪', graded: true, score: 92, submissionText: '1. 气管导管尺寸：一般建议常规体重足月儿选用3.0mm-3.5mm内径；小于1000克选用2.5mm。\n2. 深度判定：可通过体重计算公式判定，或者看呼吸音对称性来确定。' },
              { name: '张伟', graded: false, submissionText: '答：气管插管的内径常规大小用3.0。插管深度一般插进去10厘米左右。听诊如果对称就说明没插进单侧支气管。' }
            ],
            currentHwStudent: null,
	            gradingForm: {
	              part1: 36,
	              part2: 26,
	              part3: 25,
	              comment: '答卷思路比较清晰，公式和管径选择记忆得扎实。操作视频中抓管手势很标准，但是喉镜暴露声门的时机上可以进一步缩短1-2秒。加油！'
	            },

            // Active portrait details state
            activeStudent: null
          };
        },
        computed: {
          filteredAssignments() {
            var q = this.filterHwName.trim().toLowerCase();
            return this.assignments.filter(a => {
              if (this.filterCourse !== '全部课程' && a.course !== this.filterCourse) return false;
              if (q && a.name.toLowerCase().indexOf(q) === -1) return false;
              return true;
            });
          },
          filteredGradeBook() {
            var q = this.filterHwName.trim().toLowerCase();
            if (!q) return this.gradeBook;
            return this.gradeBook.filter(function (student) {
              return student.name.toLowerCase().indexOf(q) !== -1;
            });
          },
          gradingFormTotal() {
            return this.gradingForm.part1 + this.gradingForm.part2 + this.gradingForm.part3;
          },
          radarPoints() {
            if (!this.activeStudent) return '';
            var center = 150;
            var radius = 120; // max length
            var angles = [-Math.PI/2, -Math.PI/2 + (2*Math.PI/5), -Math.PI/2 + (4*Math.PI/5), -Math.PI/2 + (6*Math.PI/5), -Math.PI/2 + (8*Math.PI/5)];
            var points = [];
            for (var i = 0; i < 5; i++) {
              var val = this.activeStudent.points[i] / 100; // score weight
              var x = center + radius * val * Math.cos(angles[i]);
              var y = center + radius * val * Math.sin(angles[i]);
              points.push(x.toFixed(1) + ',' + y.toFixed(1));
            }
            return points.join(' ');
          },
          radarNodes() {
            if (!this.activeStudent) return [];
            var center = 150;
            var radius = 120;
            var angles = [-Math.PI/2, -Math.PI/2 + (2*Math.PI/5), -Math.PI/2 + (4*Math.PI/5), -Math.PI/2 + (6*Math.PI/5), -Math.PI/2 + (8*Math.PI/5)];
            var list = [];
            for (var i = 0; i < 5; i++) {
              var val = this.activeStudent.points[i] / 100;
              var x = center + radius * val * Math.cos(angles[i]);
              var y = center + radius * val * Math.sin(angles[i]);
              list.push({ x: x.toFixed(1), y: y.toFixed(1) });
            }
            return list;
          }
        },
        methods: {
          showToast(msg) {
            if (window.ArcoVue && window.ArcoVue.Message) {
              window.ArcoVue.Message.info(msg);
            } else {
              alert(msg);
            }
          },
          handlePageSwitch(value) {
            var originalActive = document.body.dataset.active;
            if (originalActive !== '评估任务') {
              document.body.dataset.active = value;
            }
            document.title = '授课老师 / 助教老师 - ' + value;
          },
          openGradingDrawer(record) {
            this.activeHw = record;
            this.currentHwStudent = this.activeHwStudents[0];
            this.drawers.grading = true;
          },
          selectHwStudent(stu) {
            this.currentHwStudent = stu;
            if (stu.graded) {
              this.gradingForm.part1 = Math.floor(stu.score * 0.4);
              this.gradingForm.part2 = Math.floor(stu.score * 0.3);
              this.gradingForm.part3 = Math.floor(stu.score * 0.3);
              this.gradingForm.comment = '已批阅，得分较好。技术点细节熟练。';
            } else {
              this.gradingForm.part1 = 36;
              this.gradingForm.part2 = 26;
              this.gradingForm.part3 = 25;
              this.gradingForm.comment = '答卷思路比较清晰，公式和管径选择记忆得扎实。操作视频中抓管手势很标准，但是暴露声门的时机上可以进一步缩短1-2秒。加油！';
            }
          },
          submitGrading() {
            var score = this.gradingFormTotal;
            this.currentHwStudent.graded = true;
            this.currentHwStudent.score = score;
            this.showToast('已批阅保存学员【' + this.currentHwStudent.name + '】的作业成绩：' + score + '分！');
            
            // Check if all graded
            var nextUnread = this.activeHwStudents.find(s => !s.graded);
            if (nextUnread) {
              this.currentHwStudent = nextUnread;
              this.selectHwStudent(nextUnread);
            } else {
              this.showToast('全班作业已批阅完成！批改状态已同步。');
              if (this.activeHw) {
                this.activeHw.pendingGrading = 0;
                this.activeHw.status = '已归档';
              }
              this.drawers.grading = false;
            }
          },
          openPortraitDrawer(record) {
            this.activeStudent = record;
            this.drawers.portrait = true;
          }
        }
      });

      app.use(window.ArcoVue);
      vueApp = app;
      vueApp.mount('#assessment-app');
    });
  }

  function boot() {
    renderShell();
    var lastActive = document.body.dataset.active;
    var obs = new MutationObserver(function () {
      var cur = document.body.dataset.active;
      if (cur === '作业考试' || cur === '成绩评价' || cur === '评估任务') {
        renderShell();
      }
    });
    obs.observe(document.body, { attributes: true, attributeFilter: ['data-active'] });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
}());
