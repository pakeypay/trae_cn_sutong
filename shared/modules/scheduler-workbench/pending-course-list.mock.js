(function () {
  const rawRows = [
    ['住培第一年', '通识', '儿科坏消息告知', ['柴毅明', '储晨']],
    ['住培第一年', '通识', '腰穿', ['邱甜', '龙莎莎']],
    ['住培第一年', '通识', '骨穿', ['富洋']],
    ['住培第一年', '通识', '腹穿', ['李军']],
    ['住培第一年', '通识', '胸穿', ['陈伟呈']],
    ['住培第一年', '通识', '胃管洗胃', ['朱雪梅', '周颖']],
    ['住培第一年', '通识', '导尿', ['汤梁峰', '缪千帆']],
    ['住培第一年', '通识', '病史采集', ['柴毅明', '储晨']],
    ['住培第一年', '通识', '体格检查', ['储晨', '柴毅明']],
    ['住培第一年', '外科', '缝合打结', ['诸壬卿', '景延辉', '张志强']],
    ['住培第一年', '外科', '扩肛灌肠', ['姚伟', '何炜婧']],
    ['住培第一年', '外科', '消毒铺巾', ['钟海军', '郑超']],
    ['住培第一年', '外科', '外科换药', ['宋君', '吴春星']],
    ['住培第二年', '通识', '休克识别+液体复苏', ['蔡小狄', '赵璐']],
    ['住培第二年', '通识', '呼吸困难+上下气道梗阻', ['陈伟明', '祁媛媛']],
    ['住培第二年', '通识', '血气分析+病例模拟', ['张澜', '陈艳']],
    ['住培第二年', '通识', '输液反应+过敏性休克', ['葛艳玲', '王一雪']],
    ['住培第二年', '内科', '腹泻补液', ['王玉环', '朱志成']],
    ['住培第二年', '内科', '酮症酸中毒', ['程若倩', '朱雪梅']],
    ['住培第二年', '内科', '惊厥急诊处理', ['马健', '邱甜']],
    ['住培第二年', '外科', '外科小手术', ['吴春星', '景延辉']],
    ['住培第二年', '外科', '腔镜基础操作', ['汤梁峰', '李军']],
    ['住培第二年', '外科', '急腹症', ['何炜婧', '孙松']],
    ['住培第三年', '通识', '创伤系列/创伤休克评估处理', ['郑继翠', '程晔']],
    ['住培第三年', '通识', '新生儿窒息复苏', ['张澜', '高瑞伟']],
    ['住培第三年', '内科', '严重心律失常', ['赵趣鸣', '陈扬']],
    ['住培第三年', '内科', '急腹症', ['何炜婧', '孙松']],
    ['住培第三年', '内科', '气管插管', ['陶金好', '朱丽']],
    ['住培第三年', '外科', '肠梗阻', ['何炜婧', '孙松']],
    ['住培第三年', '外科', '腔镜阑尾切除', ['汤梁峰', '李军']]
  ];

  const yearMap = {
    住培第一年: { id: 'zhu1', short: '住1', name: '规范化培训第一年', total: 47, plan: 12, done: 6, undone: 6, tone: 'primary', courseCount: 47 },
    住培第二年: { id: 'zhu2', short: '住2', name: '规范化培训第二年', total: 42, plan: 27, done: 21, undone: 6, tone: 'cyan', courseCount: 42 },
    住培第三年: { id: 'zhu3', short: '住3', name: '规范化培训第三年', total: 39, plan: 28, done: 22, undone: 6, tone: 'purple', courseCount: 39 }
  };

  const baseMap = {
    通识: '通识',
    内科: '儿科',
    外科: '儿外'
  };

  const baseColors = {
    通识: 'green',
    儿科: 'arcoblue',
    儿外: 'orange'
  };

  const studentGroups = [
    { ...yearMap.住培第一年, level1Key: 'gp', subType: '一年级' },
    { ...yearMap.住培第二年, level1Key: 'gp', subType: '二年级' },
    { ...yearMap.住培第三年, level1Key: 'gp', subType: '三年级' },
    { id: 'undergrad', short: '本科', name: '本科生', total: 12, plan: 4, done: 1, undone: 3, tone: 'minor', level1Key: 'bk', subType: '全体' },
    { id: 'outside', short: '外院', name: '外院医师', total: 8, plan: 3, done: 1, undone: 2, tone: 'minor', level1Key: 'jx', subType: '全体' }
  ].map(({ courseCount, ...item }) => item);

  const teacherNames = [...new Set(rawRows.flatMap((row) => row[3]))];
  const departments = ['儿内科', '新生儿科', '急诊科', '儿外科', '护理技能中心', '消化科', '普外科', '重症医学科'];
  const titles = ['主任医师', '副主任医师', '主治医师', '主管护师'];
  const weekdays = ['一', '二', '三', '四', '五'];
  const timeSlots = ['09:00-11:00', '10:00-12:00', '13:30-15:30', '14:00-16:00', '15:00-17:00'];

  const teachers = teacherNames.map((name, index) => ({
    id: `t${index + 1}`,
    name,
    title: titles[index % titles.length],
    department: departments[index % departments.length],
    phone: `13${6 + (index % 4)}-${String(2100 + index * 37).slice(-4)}-${String(5600 + index * 53).slice(-4)}`,
    times: [
      `6月 周${weekdays[index % weekdays.length]} ${timeSlots[index % timeSlots.length]}`,
      `7月 周${weekdays[(index + 1) % weekdays.length]} ${timeSlots[(index + 3) % timeSlots.length]}`
    ],
    note: '根据《住培课程教师授课信息表》生成的示例老师；可授课时间为前端演示数据。'
  }));

  const teacherIdByName = Object.fromEntries(teachers.map((teacher) => [teacher.name, teacher.id]));
  const statusCycle = ['待核实', '可排课', '老师待确认', '模型待确认'];
  const departmentByBase = {
    通识: ['急诊技能中心', '临床技能中心', '医学人文教研室', '护理技能中心'],
    儿科: ['呼吸科', '消化科', '神经内科', '心内科', '血液科', '新生儿科', '重症医学科', '肾脏科'],
    儿外: ['普外科', '骨科', '泌尿外科', '胸外科', '神经外科', '麻醉科', '耳鼻喉科', '眼科']
  };

  // ── 课程类型池（对应课程开发"课程类型"字段）
  const courseTypePool = {
    通识: '实践·技能模拟课程',
    外科: '实践·技能模拟课程',
    内科: '理论+实践综合课程'
  };

  // ── 场地类型池（对应课程开发"形式/场地 → 具体教室"字段；技能实训中心为默认前提，不在此列出）
  const venuePool = {
    通识: [['模拟病房'], ['PBL教室'], ['普通教室']],
    外科: [['模拟病房'], ['多功能教室']],
    内科: [['普通教室', 'PBL教室'], ['多功能教室', 'PBL教室']]
  };

  // ── 人员准备池（对应课程开发"人员准备"字段）
  const staffPrepPool = [
    [{ role: '主讲教师', count: 1 }, { role: '助教', count: 2 }, { role: '标准化病人', count: 2 }],
    [{ role: '主讲教师', count: 1 }, { role: '助教', count: 1 }, { role: '设备操作员', count: 1 }],
    [{ role: '主讲教师', count: 1 }, { role: '助教', count: 2 }],
    [{ role: '主讲教师', count: 1 }, { role: '助教', count: 1 }, { role: '标准化病人', count: 1 }],
    [{ role: '主讲教师', count: 1 }, { role: '助教', count: 2 }, { role: '技术支持', count: 1 }]
  ];

  // ── 物资准备池（对应课程开发"物资准备"字段）
  const materialPrepPool = [
    [{ name: '操作技能模拟训练器', unit: '台', count: 6 }, { name: '无菌手套', unit: '双', count: 30 }, { name: '操作评分表', unit: '份', count: 20 }],
    [{ name: '模拟人', unit: '具', count: 4 }, { name: '一次性耗材套包', unit: '套', count: 20 }, { name: '消毒液', unit: '瓶', count: 6 }, { name: '评分记录表', unit: '份', count: 20 }],
    [{ name: '技能操作模具', unit: '套', count: 8 }, { name: '无菌包', unit: '个', count: 20 }, { name: '投影仪', unit: '台', count: 1 }, { name: '签到表', unit: '份', count: 1 }],
    [{ name: '模拟训练器', unit: '台', count: 6 }, { name: '手术器械包', unit: '套', count: 6 }, { name: '手术衣', unit: '件', count: 12 }, { name: '操作评分表', unit: '份', count: 20 }],
    [{ name: 'PPT课件', unit: '份', count: 1 }, { name: '案例讨论材料', unit: '套', count: 15 }, { name: '音响系统', unit: '套', count: 1 }, { name: '签到表', unit: '份', count: 1 }]
  ];

  // ── 附件池（对应课程开发"附件"字段；仅保留场地布置示意图）
  const attachmentPool = [
    [{ name: '场地布置示意图.png', type: 'image' }]
  ];

  // ── 师生比池
  const ratioPool = {
    通识: ['1∶5~8', '1∶4~6', '1∶6~10'],
    外科: ['1∶2~4', '1∶3~5', '1∶2~6'],
    内科: ['1∶8~12', '1∶6~10', '1∶10~15']
  };

  // ── 时长池（分钟）
  const durationPool = {
    通识: [55, 60, 90],
    外科: [90, 120, 60],
    内科: [45, 60, 90]
  };

  // 每个学生群体在每门课上的"未修人数"生成器
  // 住培学员按年级维度展示，让数字看起来更真实
  const uncompleteByGroup = {
    zhu1: [20, 20, 20, 20, 20, 20, 19, 20, 20, 20, 20, 19, 20, 20], // 住1 大多全员未修
    zhu2: [7, 7, 7, 7, 6, 5, 4, 4, 7, 7, 7, 5, 6, 7],            // 住2 部分已修
    zhu3: [3, 2, 4, 3, 3, 2, 4, 3, 2, 3, 3, 2, 4, 3],            // 住3 大多已修
    undergrad: [4, 3, 2, 1, 2],
    outside: [3, 2, 2, 1]
  };

  const buildAudience = (group, indexInGroup) => {
    const list = uncompleteByGroup[group.id] || [];
    const fallback = Math.max(0, Math.round(group.total * 0.4));
    return {
      id: group.id,
      level: group.subType ? group.name.replace('规范化培训', '住培第') : null,
      count: group.total,
      uncompleted: list[indexInGroup] != null ? list[indexInGroup] : fallback
    };
  };

  const allCourses = rawRows.map(([year, sourceBase, name, teacherList], index) => {
    const group = yearMap[year];
    const base = baseMap[sourceBase] || sourceBase;
    const capacity = base === '儿外' ? 8 : base === '儿科' ? 12 : 10;
    const businessState = window.TeachingBusiness?.getCourseState(name);
    const readiness = window.TeachingBusiness?.getReadiness(name);
    const storedHandoff = window.TeachingBusiness?.getSchedulingHandoff(name);
    const isPilotReady = businessState?.stageCode === 'ready-for-plan'
      && !businessState.blockers.length
      && readiness?.completed === readiness?.total;

    // 同一个年级群体可能在多门课中出现，使用 index 在同群体中的顺序来分配未修人数
    const groupIndexTracker = {};
    const audiences = [{ id: group.id, count: group.total }];
    groupIndexTracker[group.id] = (groupIndexTracker[group.id] || 0) + 1;
    audiences[0] = buildAudience(group, groupIndexTracker[group.id] - 1);
    audiences[0].count = group.total;
    audiences[0].level = group.subType ? `住培第${group.subType.replace('年级', '')}年` : group.short;

    const total = audiences.reduce((sum, item) => sum + item.count, 0);
    const uncompletedTotal = audiences.reduce((sum, item) => sum + (item.uncompleted || 0), 0);
    const teacherIds = teacherList.map((teacherName) => teacherIdByName[teacherName]).filter(Boolean);

    const venueList = venuePool[sourceBase] || venuePool['通识'];
    const ratioList = ratioPool[sourceBase] || ratioPool['通识'];
    const durationList = durationPool[sourceBase] || durationPool['通识'];

    return {
      id: `c${index + 1}`,
      name,
      tag: sourceBase,
      base,
      department: name === '儿科坏消息告知'
        ? '医学人文教研室'
        : (departmentByBase[base] || [sourceBase])[index % (departmentByBase[base] || [sourceBase]).length],
      status: statusCycle[(index + 1) % statusCycle.length],
      audiences,
      total,
      uncompleted: uncompletedTotal,
      capacity,
      sessions: Math.max(1, Math.ceil(total / capacity)),
      teachers: {
        A: teacherIds[0] || '',
        B: teacherIds[1] || '',
        other: teacherIds[2] || ''
      },
      entryGate: isPilotReady ? {
        decision: '已通过',
        sourceStage: businessState.stageLabel,
        sourceVersion: storedHandoff?.sourceVersion || '课程标准 v1.0',
        openingPlanId: storedHandoff?.openingPlanId || 'PLAN-2026-0001',
        openingPlanStatus: storedHandoff?.openingPlanStatus || '待排课',
        requestedTimeWindow: storedHandoff?.requestedTimeWindow || '2026 年 7 月，工作日下午',
        enteredAt: storedHandoff?.enteredAt || '2026-06-10 10:20',
        handedOffBy: storedHandoff?.handedOffBy || '教务管理员',
        currentStage: storedHandoff?.currentStage || '待排课',
        currentOwner: storedHandoff?.currentOwner || '排课与场地管理员',
        nextAction: storedHandoff?.nextAction || '收集教师可授课时间并生成候选方案',
        completedChecks: readiness.completed,
        totalChecks: readiness.total,
        downstream: '候选方案确认后进入教师确认，不直接发布为正式课表。',
        businessVersion: storedHandoff?.businessVersion || window.TeachingBusiness.version
      } : null,
      // ── 以下字段来自「课程开发」上游，用于抽屉只读展示 ──
      courseId: name === '儿科坏消息告知' ? 'COURSE-HUM-COMM-001' : `AUTO-2026-${String(index + 1).padStart(4, '0')}`,
      courseType: name === '儿科坏消息告知' ? '沟通与人文情境模拟课程' : (courseTypePool[sourceBase] || '实践·技能模拟课程'),
      duration: name === '儿科坏消息告知' ? 90 : durationList[index % durationList.length],
      teacherStudentRatio: name === '儿科坏消息告知' ? '1∶6~8' : ratioList[index % ratioList.length],
      venueTypes: name === '儿科坏消息告知' ? ['PBL教室', '情境模拟室'] : venueList[index % venueList.length],
      staffPrep: name === '儿科坏消息告知'
        ? [{ role: '主讲教师', count: 1 }, { role: '助教', count: 1 }, { role: '标准化家属', count: 2 }]
        : staffPrepPool[index % staffPrepPool.length],
      materialPrep: name === '儿科坏消息告知'
        ? [{ name: '情境案例卡', unit: '套', count: 8 }, { name: '沟通评估表', unit: '份', count: 24 }, { name: '录播设备', unit: '套', count: 1 }]
        : materialPrepPool[index % materialPrepPool.length],
      attachments: attachmentPool[index % attachmentPool.length]
    };
  });

  // 少量非住培对象混合展示，约占首屏的 1/10，用于验证视觉权重。
  allCourses[5].audiences.push({ id: 'undergrad', level: '本科生', count: 6, uncompleted: 4 });
  allCourses[5].total += 6;
  allCourses[5].uncompleted += 4;
  allCourses[5].sessions = Math.ceil(allCourses[5].total / allCourses[5].capacity);
  allCourses[6].audiences.push({ id: 'outside', level: '外院医师', count: 4, uncompleted: 3 });
  allCourses[6].total += 4;
  allCourses[6].uncompleted += 3;
  allCourses[6].sessions = Math.ceil(allCourses[6].total / allCourses[6].capacity);

  const poolCourses = allCourses.slice(-4).map((course, index) => ({
    ...JSON.parse(JSON.stringify(course)),
    id: `p${index + 1}`,
    name: `${course.name}（补充）`
  }));

  const studentNamePool = [
    '陈昱安', '林嘉禾', '周雨辰', '沈思远', '许若宁', '黄子涵', '吴晨曦', '赵亦然',
    '顾清扬', '马若曦', '高一鸣', '陆知夏', '蒋承宇', '邵雨桐', '唐明轩', '钱思睿',
    '宋佳宁', '韩予安', '傅清和', '曹沐阳', '程可欣', '袁景行', '彭语涵', '薛子墨',
    '罗星澄', '丁以沫', '方知遥', '何清越', '梁予初', '叶明澈', '郑书宁', '邓嘉言',
    '熊若川', '白奕辰', '冯以安', '谢云舒', '曾沐宸', '苏念初', '石景然', '夏语乔',
    '严星河', '杜若溪', '潘子昂', '余青禾', '贺承泽', '黎安然', '钟亦凡', '田舒窈',
    '江予墨', '段思衡', '赖知微', '任嘉树', '秦沐白', '尹若竹', '孟星野', '乔清宁',
    '常以恒', '龚雨笙', '路明庭', '温子衿', '付南星', '邹景宁', '莫予澄', '盛知远'
  ];

  const buildStudents = (groupId, total, completed, courseTotal, offset = 0) =>
    Array.from({ length: total }, (_, index) => ({
      id: `${groupId}-s${index + 1}`,
      name: studentNamePool[(offset + index) % studentNamePool.length],
      completed,
      total: courseTotal
    }));

  const buildCourseDetails = (groupId, studentTotal, completeCount) =>
    allCourses
      .filter((course) => course.audiences.some((audience) => audience.id === groupId))
      .map((course, index) => ({
        id: course.id,
        name: course.name,
        base: course.base,
        completed: index < completeCount ? studentTotal : Math.max(0, studentTotal - index - 4),
        total: studentTotal
      }));

  const studentDetails = {
    zhu1: {
      title: '规范化培训第一年',
      total: 47,
      baseStats: [
        { label: '儿内', count: 31 },
        { label: '儿外', count: 16 }
      ],
      courseTotal: 12,
      courseDone: 6,
      courseUndone: 6,
      courses: buildCourseDetails('zhu1', 47, 6),
      students: buildStudents('zhu1', 47, 6, 12, 0)
    },
    zhu2: {
      title: '规范化培训第二年',
      total: 42,
      baseStats: [
        { label: '儿内', count: 34 },
        { label: '儿外', count: 8 }
      ],
      courseTotal: 27,
      courseDone: 21,
      courseUndone: 6,
      courses: buildCourseDetails('zhu2', 42, 6),
      students: buildStudents('zhu2', 42, 21, 27, 8)
    },
    zhu3: {
      title: '规范化培训第三年',
      total: 39,
      baseStats: [
        { label: '儿内', count: 28 },
        { label: '儿外', count: 11 }
      ],
      courseTotal: 28,
      courseDone: 22,
      courseUndone: 6,
      courses: buildCourseDetails('zhu3', 39, 6),
      students: buildStudents('zhu3', 39, 22, 28, 16)
    }
  };

  window.PendingCourseMockData = {
    source: '住培课程教师授课信息表.xlsx / 课程授课信息表',
    studentGroups,
    studentDetails,
    teachers,
    courses: allCourses.slice(0, -4),
    poolCourses,
    baseColors
  };
}());
