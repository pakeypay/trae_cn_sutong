(function () {
    const { createApp, h } = Vue;

    const iconDefaults = {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': 2,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'aria-hidden': 'true'
    };

    const icon = (paths) => ({
      props: { size: { type: [Number, String], default: 16 } },
      render() {
        return h('svg', { ...iconDefaults, width: this.size, height: this.size }, paths.map(({ tag = 'path', ...attrs }) => h(tag, attrs)));
      }
    });

    const Home = icon([{ d: 'm3 11 9-8 9 8' }, { d: 'M5 10v10h14V10' }, { d: 'M9 20v-6h6v6' }]);
    const Settings = icon([{ tag: 'circle', cx: 12, cy: 12, r: 3 }, { d: 'M12 2v3' }, { d: 'M12 19v3' }, { d: 'm4.9 4.9 2.1 2.1' }, { d: 'm17 17 2.1 2.1' }, { d: 'M2 12h3' }, { d: 'M19 12h3' }, { d: 'm4.9 19.1 2.1-2.1' }, { d: 'm17 7 2.1-2.1' }]);
    const Bell = icon([{ d: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9' }, { d: 'M13.7 21a2 2 0 0 1-3.4 0' }]);
    const BookOpen = icon([{ d: 'M12 7v14' }, { d: 'M3 5a7 7 0 0 1 9 2 7 7 0 0 1 9-2v14a7 7 0 0 0-9 2 7 7 0 0 0-9-2z' }]);
    const CheckCircle2 = icon([{ tag: 'circle', cx: 12, cy: 12, r: 9 }, { d: 'm9 12 2 2 4-5' }]);
    const Cpu = icon([{ tag: 'rect', x: 7, y: 7, width: 10, height: 10, rx: 1 }, { d: 'M9 1v3' }, { d: 'M15 1v3' }, { d: 'M9 20v3' }, { d: 'M15 20v3' }, { d: 'M20 9h3' }, { d: 'M20 14h3' }, { d: 'M1 9h3' }, { d: 'M1 14h3' }]);
    const Users = icon([{ d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' }, { tag: 'circle', cx: 9, cy: 7, r: 4 }, { d: 'M22 21v-2a4 4 0 0 0-3-3.9' }, { d: 'M16 3.1a4 4 0 0 1 0 7.8' }]);
    const Globe2 = icon([{ tag: 'circle', cx: 12, cy: 12, r: 10 }, { d: 'M2 12h20' }, { d: 'M12 2a15 15 0 0 1 0 20' }, { d: 'M12 2a15 15 0 0 0 0 20' }]);
    const SlidersHorizontal = icon([{ d: 'M21 4h-7' }, { d: 'M10 4H3' }, { tag: 'circle', cx: 12, cy: 4, r: 2 }, { d: 'M21 12h-9' }, { d: 'M8 12H3' }, { tag: 'circle', cx: 10, cy: 12, r: 2 }, { d: 'M21 20h-5' }, { d: 'M12 20H3' }, { tag: 'circle', cx: 14, cy: 20, r: 2 }]);
    const ChevronDown = icon([{ d: 'm6 9 6 6 6-6' }]);
    const PanelLeftClose = icon([{ tag: 'rect', x: 3, y: 4, width: 18, height: 16, rx: 2 }, { d: 'M9 4v16' }, { d: 'm16 10-2 2 2 2' }]);
    const Grid3X3 = icon([{ d: 'M3 3h18v18H3z' }, { d: 'M9 3v18' }, { d: 'M15 3v18' }, { d: 'M3 9h18' }, { d: 'M3 15h18' }]);
    const LayoutDashboard = icon([{ tag: 'rect', x: 3, y: 3, width: 7, height: 9, rx: 1 }, { tag: 'rect', x: 14, y: 3, width: 7, height: 5, rx: 1 }, { tag: 'rect', x: 14, y: 12, width: 7, height: 9, rx: 1 }, { tag: 'rect', x: 3, y: 16, width: 7, height: 5, rx: 1 }]);
    const FilePlus2 = icon([{ d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' }, { d: 'M14 2v6h6' }, { d: 'M12 18v-6' }, { d: 'M9 15h6' }]);
    const ClipboardCheck = icon([{ tag: 'rect', x: 8, y: 2, width: 8, height: 4, rx: 1 }, { d: 'M9 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3' }, { d: 'm9 14 2 2 4-5' }]);
    const DoorOpen = icon([{ d: 'M13 4h5v16h-5' }, { d: 'M13 20H6V4h7' }, { d: 'M13 4v16' }, { d: 'M10 12h.01' }]);
    const CalendarDays = icon([{ tag: 'rect', x: 3, y: 4, width: 18, height: 18, rx: 2 }, { d: 'M16 2v4' }, { d: 'M8 2v4' }, { d: 'M3 10h18' }, { d: 'M8 14h.01' }, { d: 'M12 14h.01' }, { d: 'M16 14h.01' }, { d: 'M8 18h.01' }, { d: 'M12 18h.01' }, { d: 'M16 18h.01' }]);
    const ArrowRight = icon([{ d: 'M5 12h14' }, { d: 'm12 5 7 7-7 7' }]);
    const ShieldCheck = icon([{ d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10' }, { d: 'm9 12 2 2 4-5' }]);
    const Sparkles = icon([{ d: 'm12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z' }, { d: 'M5 3v4' }, { d: 'M3 5h4' }, { d: 'M19 17v4' }, { d: 'M17 19h4' }]);
    const CircleCheckBig = icon([{ tag: 'circle', cx: 12, cy: 12, r: 10 }, { d: 'm8 12 3 3 5-6' }]);
    const LoaderCircle = icon([{ d: 'M21 12a9 9 0 1 1-6.2-8.6' }]);
    const Circle = icon([{ tag: 'circle', cx: 12, cy: 12, r: 10 }]);
    const Maximize2 = icon([{ d: 'M15 3h6v6' }, { d: 'm21 3-7 7' }, { d: 'M9 21H3v-6' }, { d: 'm3 21 7-7' }]);
    const Minimize2 = icon([{ d: 'm14 10 7-7' }, { d: 'M20 10h-6V4' }, { d: 'm3 21 7-7' }, { d: 'M4 14h6v6' }]);

    const categoryMeta = {
      "通识": { key: "general", label: "通识", color: "blue" },
      "内科": { key: "internal", label: "内科", color: "green" },
      "外科": { key: "surgery", label: "外科", color: "purple" }
    };

    const courseCatalog = [
      { grade: "住培第一年", category: "通识", course: "腰穿", teachers: ["邱甜", "龙莎莎"] },
      { grade: "住培第一年", category: "通识", course: "骨穿", teachers: ["富洋"] },
      { grade: "住培第一年", category: "通识", course: "腹穿", teachers: ["李军"] },
      { grade: "住培第一年", category: "通识", course: "胸穿", teachers: ["陈伟呈"] },
      { grade: "住培第一年", category: "通识", course: "胃管洗胃", teachers: ["朱雪梅", "周颖"] },
      { grade: "住培第一年", category: "通识", course: "导尿", teachers: ["汤梁峰", "缪千帆"] },
      { grade: "住培第一年", category: "通识", course: "病史采集", teachers: ["柴毅明", "储晨"] },
      { grade: "住培第一年", category: "通识", course: "体格检查", teachers: ["储晨", "柴毅明"] },
      { grade: "住培第一年", category: "外科", course: "缝合打结", teachers: ["诸壬卿", "景延辉", "张志强"] },
      { grade: "住培第一年", category: "外科", course: "扩肛灌肠", teachers: ["姚伟", "何炜婧"] },
      { grade: "住培第一年", category: "外科", course: "消毒铺巾", teachers: ["钟海军", "郑超"] },
      { grade: "住培第一年", category: "外科", course: "外科换药", teachers: ["宋君", "吴春星"] },
      { grade: "住培第二年", category: "通识", course: "休克识别+液体复苏", teachers: ["蔡小狄", "赵璐"] },
      { grade: "住培第二年", category: "通识", course: "呼吸困难+上下气道梗阻", teachers: ["陈伟明", "祁媛媛"] },
      { grade: "住培第二年", category: "通识", course: "血气分析+病例模拟", teachers: ["张澜", "陈艳"] },
      { grade: "住培第二年", category: "通识", course: "输液反应+过敏性休克", teachers: ["葛艳玲", "王一雪"] },
      { grade: "住培第二年", category: "内科", course: "腹泻补液", teachers: ["王玉环", "朱志成"] },
      { grade: "住培第二年", category: "内科", course: "酮症酸中毒", teachers: ["程若倩", "朱雪梅"] },
      { grade: "住培第二年", category: "内科", course: "惊厥急诊处理", teachers: ["马健", "邱甜"] },
      { grade: "住培第二年", category: "外科", course: "外科小手术", teachers: ["吴春星", "景延辉"] },
      { grade: "住培第二年", category: "外科", course: "腔镜基础操作", teachers: ["汤梁峰", "李军"] },
      { grade: "住培第二年", category: "外科", course: "急腹症", teachers: ["何炜婧", "孙松"] },
      { grade: "住培第三年", category: "通识", course: "创伤系列/创伤休克评估处理", teachers: ["郑继翠", "程晔"] },
      { grade: "住培第三年", category: "通识", course: "新生儿窒息复苏", teachers: ["张澜", "高瑞伟"] },
      { grade: "住培第三年", category: "内科", course: "严重心律失常", teachers: ["赵趣鸣", "陈扬"] },
      { grade: "住培第三年", category: "内科", course: "急腹症", teachers: ["何炜婧", "孙松"] },
      { grade: "住培第三年", category: "内科", course: "气管插管", teachers: ["陶金好", "朱丽"] },
      { grade: "住培第三年", category: "外科", course: "肠梗阻", teachers: ["何炜婧", "孙松"] },
      { grade: "住培第三年", category: "外科", course: "腔镜阑尾切除", teachers: ["汤梁峰", "李军"] }
    ];

    const gradeYear = (grade) => ({ "住培第一年": 1, "住培第二年": 2, "住培第三年": 3 }[grade] || 1);
    const audienceByYear = {
      1: { level1Key: "gp", level1Label: "住培医师", subType: "一年级" },
      2: { level1Key: "gp", level1Label: "住培医师", subType: "二年级" },
      3: { level1Key: "gp", level1Label: "住培医师", subType: "三年级" }
    };
    const audienceForYear = (year) => audienceByYear[Number(year)] || { level1Key: "gp", level1Label: "住培医师", subType: `${year || 1}年级` };
    const audienceLabelForYear = (year) => {
      const item = audienceForYear(year);
      return `${item.level1Label} · ${item.subType}`;
    };
    const audienceClassLabelForCourse = (course) => {
      if (course?.isTeacherTraining) return "师资培训";
      const audience = audienceForYear(course?.raw?.target_year || course?.trainingYear || 1);
      return `${audience.subType}(${Math.max(1, Math.ceil((course?.people || course?.raw?.target_student_count || 0) / 10))})班`;
    };
    const teacherCategory = new Map();
    courseCatalog.forEach((course) => {
      course.teachers.forEach((teacher) => {
        if (!teacherCategory.has(teacher)) teacherCategory.set(teacher, course.category);
      });
    });

    const teachersRaw = Array.from(teacherCategory.entries()).map(([name, department], index) => ({
      teacher_id: `T${String(index + 1).padStart(3, "0")}`,
      name,
      title: "授课教师",
      department,
      preferred_weekdays: [[1, 3, 5], [2, 4], [1, 2, 4], [3, 5]][index % 4],
      unavailable_slots: [],
      max_weekly_hours: [8, 10, 8, 6][index % 4],
      is_flexible: index % 3 !== 1,
      role: index % 2 === 0 ? "A" : "B"
    }));

    const extraTeacherPool = [
      { name: "闫钢风", department: "重症医学科" },
      { name: "宁波", department: "神经外科" },
      { name: "李志华", department: "麻醉科" }
    ];

    extraTeacherPool.forEach((teacher) => {
      if (teachersRaw.some((item) => item.name === teacher.name)) return;
      const index = teachersRaw.length;
      teachersRaw.push({
        teacher_id: `T${String(index + 1).padStart(3, "0")}`,
        name: teacher.name,
        title: "授课教师",
        department: teacher.department,
        preferred_weekdays: [[1, 3, 5], [2, 4], [1, 2, 4], [3, 5]][index % 4],
        unavailable_slots: [],
        max_weekly_hours: [8, 10, 8, 6][index % 4],
        is_flexible: index % 3 !== 1,
        role: index % 2 === 0 ? "A" : "B"
      });
    });

    const roomProfileByType = {
      "PBL教室": {
        title: "PBL教室（录播）",
        capacityText: "8–16人/间",
        equipmentText: "环形讨论桌、录播摄像、显示屏、白板",
        tags: ["PBL/TBL小组讨论", "案例研讨"],
        description: "支持全程录制小组讨论过程，便于教学反馈与研究分析。"
      },
      "阶梯教室": {
        title: "阶梯教室",
        capacityText: "40–60人/间",
        equipmentText: "固定桌椅、扩声系统、投影幕、录播设备",
        tags: ["理论授课", "集中培训"],
        description: "适合较大规模理论课和集中宣讲，视线层次清晰，便于统一授课。"
      },
      "普通教室": {
        title: "普通教室",
        capacityText: "25–35人/间",
        equipmentText: "移动桌椅、显示屏、白板、多媒体终端",
        tags: ["常规授课", "分组讨论"],
        description: "适合常规课程、小班教学和灵活分组，可按课程需要调整桌椅布局。"
      },
      "模拟病房": {
        title: "模拟病房",
        capacityText: "12–20人/间",
        equipmentText: "病床、床旁设备、监护模拟器、操作台",
        tags: ["床旁教学", "情景模拟"],
        description: "还原临床病房环境，适合病史采集、查体、处置流程和团队协作训练。"
      },
      "多功能教室": {
        title: "多功能教室",
        capacityText: "30–50人/间",
        equipmentText: "移动桌椅、扩声系统、双屏显示、白板",
        tags: ["综合培训", "工作坊"],
        description: "支持讲授、讨论和展示等多种教学形态，可快速切换课堂布局。"
      },
      "模拟手术室": {
        title: "模拟手术室",
        capacityText: "10–20人/间",
        equipmentText: "手术床、无影灯、器械台、麻醉设备模型",
        tags: ["外科技能", "手术流程"],
        description: "用于手术场景演练、无菌操作训练和团队配合流程教学。"
      },
      "腔镜实训室": {
        title: "腔镜实训室",
        capacityText: "8–18人/间",
        equipmentText: "腔镜训练箱、显示系统、操作器械、录像设备",
        tags: ["腔镜训练", "精细操作"],
        description: "适合腹腔镜基础技能训练、手眼协调训练和操作过程回放。"
      },
      "虚拟仿真实验室": {
        title: "虚拟仿真实验室",
        capacityText: "20–30人/间",
        equipmentText: "VR终端、仿真平台、教师控制台、显示屏",
        tags: ["虚拟仿真", "交互训练"],
        description: "支持虚拟病例、流程演练和沉浸式训练，适合高风险场景预演。"
      }
    };

    const createClassroom = (roomNo, floor, roomType, capacity, options = {}) => ({
      room_id: `R${roomNo}`,
      room_name: `${roomNo}${roomType === "PBL教室" ? " " : ""}${roomType}`,
      floor,
      floor_label: floor === 3 ? "三楼" : "四楼",
      capacity_max: capacity,
      fixed_equipment: options.fixed_equipment || [],
      has_multimedia: options.has_multimedia ?? true,
      room_type: roomType,
      priority_score: options.priority_score || 0.8,
      unavailable_slots: options.unavailable_slots || [],
      profile: { ...(roomProfileByType[roomType] || roomProfileByType["普通教室"]), ...(options.profile || {}) }
    });

    const classroomsRaw = [
      createClassroom(301, 3, "PBL教室", 24, { fixed_equipment: ["M01"], priority_score: 0.9 }),
      createClassroom(302, 3, "PBL教室", 24, { fixed_equipment: ["M02"], priority_score: 0.88 }),
      createClassroom(305, 3, "阶梯教室", 60, { fixed_equipment: ["M03"], priority_score: 0.8, unavailable_slots: [{ weekday: 3, start_hour: 14, end_hour: 17, reason: "设备维护" }] }),
      createClassroom(308, 3, "普通教室", 35, { priority_score: 0.72 }),
      createClassroom(312, 3, "普通教室", 35, { priority_score: 0.7 }),
      createClassroom(315, 3, "普通教室", 35, { priority_score: 0.7 }),
      createClassroom(401, 4, "模拟病房", 20, { fixed_equipment: ["M04", "M05"], priority_score: 0.95, unavailable_slots: [{ weekday: 1, start_hour: 8, end_hour: 12, reason: "医院活动" }] }),
      createClassroom(402, 4, "模拟病房", 20, { priority_score: 0.94 }),
      createClassroom(403, 4, "模拟病房", 20, { priority_score: 0.93 }),
      createClassroom(404, 4, "模拟病房", 20, { priority_score: 0.92 }),
      createClassroom(405, 4, "模拟病房", 20, { priority_score: 0.91 }),
      createClassroom(406, 4, "模拟病房", 20, { priority_score: 0.9 }),
      createClassroom(407, 4, "模拟病房", 20, { priority_score: 0.89 }),
      createClassroom(408, 4, "模拟病房", 20, { priority_score: 0.88 }),
      createClassroom(410, 4, "多功能教室", 50, { priority_score: 0.85 }),
      createClassroom(415, 4, "模拟手术室", 20, { fixed_equipment: ["M06"], priority_score: 0.9 }),
      createClassroom(420, 4, "腔镜实训室", 18, { fixed_equipment: ["M07", "M08"], priority_score: 0.92, unavailable_slots: [{ weekday: 4, start_hour: 9, end_hour: 11, reason: "科研使用" }] }),
      createClassroom(421, 4, "虚拟仿真实验室", 30, { fixed_equipment: ["M09"], priority_score: 0.88 })
    ];

    const equipmentsRaw = Array.from({ length: 50 }, (_, index) => {
      const i = index + 1;
      const isMovable = i % 5 !== 0;
      const fixedRoom = isMovable ? null : classroomsRaw[i % classroomsRaw.length].room_id;
      return {
        equipment_id: `M${String(i).padStart(2, "0")}`,
        name: ["婴儿模拟人", "成人模拟人", "高级心肺复苏模型", "腰椎穿刺模型", "胸腔穿刺模型", "骨髓穿刺模型", "气管插管模型", "超声模拟器", "心电监护模拟器", "静脉穿刺手臂", "动脉穿刺手臂", "导尿模型", "胃管模型", "缝合模型", "骨折固定模型", "腹腔镜模拟器", "关节镜模拟器", "新生儿复苏模型", "产妇模拟人", "创伤模拟人"][(i - 1) % 20] + (Math.floor((i - 1) / 20) + 1),
        is_movable: isMovable,
        fixed_room_id: fixedRoom
      };
    });

    equipmentsRaw.forEach((item) => {
      if (!item.fixed_room_id) return;
      const room = classroomsRaw.find((target) => target.room_id === item.fixed_room_id);
      if (room && !room.fixed_equipment.includes(item.equipment_id)) room.fixed_equipment.push(item.equipment_id);
    });

    const durationCycle = [60, 90, 120];
    const studentCountByYear = { 1: 30, 2: 24, 3: 20 };
    const teacherIdByName = Object.fromEntries(teachersRaw.map((teacher) => [teacher.name, teacher.teacher_id]));
    const coursesRaw = courseCatalog.map((item, index) => {
      const i = index + 1;
      const targetYear = gradeYear(item.grade);
      return {
        course_id: `C${String(i).padStart(3, "0")}`,
        course_name: item.course,
        course_category: item.category,
        target_year: targetYear,
        target_student_count: studentCountByYear[targetYear] || 20,
        total_batches: Math.max(1, item.teachers.length),
        duration_minutes: durationCycle[(i - 1) % durationCycle.length],
        required_equipment_ids: [`M${String((i % 10) + 1).padStart(2, "0")}`, `M${String((i % 7) + 11).padStart(2, "0")}`],
        teacher_ids: item.teachers.map((name) => teacherIdByName[name]).filter(Boolean),
        semester_week_range: [1, 16],
        priority_level: index < 8 ? 1 : index < 22 ? 2 : 3
      };
    });

    coursesRaw[0].priority_level = 1;
    coursesRaw[0].target_year = 1;
    coursesRaw[1].priority_level = 1;
    coursesRaw[1].target_year = 1;
    coursesRaw[2].priority_level = 2;
    coursesRaw[2].required_equipment_ids = ["M01"];
    coursesRaw[3].priority_level = 2;
    coursesRaw[3].required_equipment_ids = ["M04", "M05"];

    const teacherCourseMap = teachersRaw.reduce((map, teacher) => ({ ...map, [teacher.teacher_id]: [] }), {});
    coursesRaw.forEach((course) => {
      course.teacher_ids.forEach((teacherId) => {
        if (teacherCourseMap[teacherId]) teacherCourseMap[teacherId].push(course.course_id);
      });
    });

    const teachers = teachersRaw.map((teacher) => ({
      ...teacher,
      course_ids: teacherCourseMap[teacher.teacher_id] || []
    }));

    const teacherById = Object.fromEntries(teachers.map((teacher) => [teacher.teacher_id, teacher]));
    const equipmentById = Object.fromEntries(equipmentsRaw.map((equipment) => [equipment.equipment_id, equipment]));
    const durationToHours = (minutes) => Math.max(1, Math.round(minutes / 45));
    const equipmentNames = (ids) => ids.map((id) => equipmentById[id]?.name || id);
    const roomTypeCycleByCategory = {
      "通识": ["PBL教室", "阶梯教室", "多功能教室"],
      "内科": ["模拟病房", "普通教室", "虚拟仿真实验室"],
      "外科": ["模拟手术室", "腔镜实训室", "普通教室"]
    };
    const roomTypeForCourse = (course, index) => {
      const options = roomTypeCycleByCategory[course.course_category] || ["普通教室"];
      return options[index % options.length];
    };

    const trainingProjectSessions = [
      { sid: "s01", phase: "一阶段", name: "七期学员一阶段理论（一）", format: "直播", teachers: ["程晔", "蔡小狄"] },
      { sid: "s02", phase: "一阶段", name: "七期学员一阶段理论（二）", format: "直播", teachers: ["马健", "陶金好"] },
      { sid: "s03", phase: "一阶段", name: "七期学员一阶段理论（三）", format: "直播", teachers: ["陈扬", "陈艳"] },
      { sid: "s04", phase: "一阶段", name: "七期学员一阶段理论（四）", format: "直播", teachers: ["陈伟明", "张澜"] },
      { sid: "s05", phase: "一阶段", name: "七期学员一阶段理论（五）", format: "直播", teachers: ["王一雪", "陶金好"] },
      { sid: "s06", phase: "一阶段", name: "七期学员一阶段理论（六）", format: "直播", teachers: ["闫钢风", "程晔"] },
      { sid: "s07", phase: "一阶段", name: "七期学员一阶段理论（七）", format: "直播", teachers: ["宁波", "马健"] },
      { sid: "s08", phase: "一阶段", name: "七期学员一阶段理论（八）", format: "直播", teachers: ["李志华", "富洋"] },
      { sid: "s09", phase: "一阶段", name: "七期学员一阶段理论（九）", format: "直播", teachers: [] },
      { sid: "s10", phase: "一阶段", name: "七期学员一阶段理论（十）", format: "直播", teachers: [] },
      { sid: "s11", phase: "一阶段", name: "七期学员一阶段理论（十一）", format: "直播", teachers: [] },
      { sid: "s12", phase: "一阶段", name: "七期学员一阶段实践", format: "线下", teachers: ["闫钢风", "蔡小狄", "程晔"] },
      { sid: "s13", phase: "二阶段", name: "七期学员二阶段理论（一）", format: "直播", teachers: ["王一雪", "陈扬"] },
      { sid: "s14", phase: "二阶段", name: "七期学员二阶段理论（二）", format: "直播", teachers: ["蔡小狄", "陶金好"] },
      { sid: "s15", phase: "二阶段", name: "七期学员二阶段理论（三）", format: "直播", teachers: ["马健", "陈艳"] },
      { sid: "s16", phase: "二阶段", name: "七期学员二阶段理论（四）", format: "直播", teachers: [] },
      { sid: "s17", phase: "二阶段", name: "七期学员二阶段理论（五）", format: "直播", teachers: [] },
      { sid: "s18", phase: "二阶段", name: "七期学员二阶段理论（六）", format: "直播", teachers: [] },
      { sid: "s19", phase: "二阶段", name: "七期学员二阶段理论（七）", format: "直播", teachers: [] },
      { sid: "s20", phase: "二阶段", name: "七期学员二阶段实践", format: "线下", teachers: ["闫钢风", "蔡小狄"] },
      { sid: "s21", phase: "三阶段", name: "七期学员三阶段理论（一）", format: "直播", teachers: ["马健", "宁波"] },
      { sid: "s22", phase: "三阶段", name: "七期学员三阶段理论（二）", format: "直播", teachers: [] },
      { sid: "s23", phase: "三阶段", name: "七期学员三阶段理论（三）", format: "直播", teachers: [] },
      { sid: "s24", phase: "三阶段", name: "七期学员三阶段理论（四）", format: "直播", teachers: [] },
      { sid: "s25", phase: "三阶段", name: "七期学员三阶段实践", format: "线下", teachers: [] }
    ];

    const teacherTrainingSessions = trainingProjectSessions.map((session, index) => {
      const teacherIds = session.teachers.map((name) => teacherIdByName[name]).filter(Boolean);
      const isLiveSession = session.format === "直播";
      return {
        id: `TC102-${session.sid}`,
        parentId: "TC102",
        parentName: "中国儿童医学模拟导师通识课程项目",
        sessionId: session.sid,
        sessionPhase: session.phase,
        deliveryMode: session.format,
        isLiveSession,
        requiresRoom: !isLiveSession,
        name: session.name,
        target: `师资培训 · ${session.phase} · ${session.format}`,
        teacher: session.teachers.length ? session.teachers.join(" / ") : "待配置",
        teacherPrimary: session.teachers[0] || "待配置",
        teacherIds,
        teacherNames: [...session.teachers],
        hours: durationToHours(isLiveSession ? 90 : 120),
        durationMinutes: isLiveSession ? 90 : 120,
        roomType: isLiveSession ? "直播会议链接" : "多功能教室",
        courseType: "通识",
        baseType: "general",
        baseLabel: "通识",
        baseColor: "blue",
        isResidency: false,
        isTeacherTraining: true,
        trainingYear: null,
        classLabel: "师培",
        people: 40,
        resourceTight: false,
        equipment: isLiveSession ? [] : ["多媒体", "模拟培训空间"],
        totalSessions: 1,
        scheduledSessions: 0,
        status: "pending",
        liveApplyScope: "single",
        meetingLink: "",
        meetingUrl: "",
        meetingDate: "",
        meetingTime: "",
        meetingRecognized: "",
        calendarEventId: "",
        raw: {
          target_year: 0,
          target_student_count: 40,
          required_equipment_ids: [],
          course_category: "通识"
        }
      };
    });

    const teacherTrainingCourse = {
      id: "TC102",
      name: "中国儿童医学模拟导师通识课程项目",
      target: "师资培训 · 七期学员 · 25课次",
      teacher: "按课次配置",
      teacherPrimary: "按课次配置",
      teacherIds: [],
      hours: teacherTrainingSessions.reduce((sum, session) => sum + session.hours, 0),
      durationMinutes: teacherTrainingSessions.reduce((sum, session) => sum + session.durationMinutes, 0),
      roomType: "按课次确定",
      courseType: "通识",
      baseType: "general",
      baseLabel: "通识",
      baseColor: "blue",
      isResidency: false,
      isTeacherTraining: true,
      isCompound: true,
      trainingYear: null,
      people: 40,
      resourceTight: false,
      equipment: [],
      totalSessions: teacherTrainingSessions.length,
      scheduledSessions: 0,
      status: "pending",
      sessions: teacherTrainingSessions,
      availableTime: "按课次确定",
      teacherRemark: "",
      scheduledDates: [],
      raw: {
        target_year: 0,
        target_student_count: 40,
        required_equipment_ids: [],
        course_category: "通识"
      }
    };

    // ── 可授课时间与备注（来自「教师可授课时间记录表」）
    const availableTimeMock = [
      "5月周二下午",
      "5月周三上午",
      "6月周一下午",
      "5月周四上午",
      "5月周五上午",
      "6月周二全天",
      "5月周三下午",
      "6月周四上午"
    ];
    const teacherRemarkMock = [
      "",
      "",
      "偏好上午场次",
      "",
      "需提前1周通知",
      "",
      "仅限周二下午",
      "",
      "避开节假日",
      ""
    ];

    // 与 data().events 初始值严格对应：key = coursesRaw 中的 index
    const preScheduledMap = {
      0:  { index: 1, date: '2026-11-06', day: '周五', week: 9,  room: '301 PBL教室',        eventId: 'E001' },
      4:  { index: 1, date: '2026-11-11', day: '周三', week: 10, room: '305阶梯教室',        eventId: 'E002' },
      8:  { index: 1, date: '2026-11-18', day: '周三', week: 11, room: '401模拟病房',        eventId: 'E003' },
      16: { index: 1, date: '2026-11-24', day: '周二', week: 12, room: '410多功能教室',      eventId: 'E004' },
    };

    const residencyCourses = coursesRaw.map((course, index) => {
      const base = categoryMeta[course.course_category] || categoryMeta["通识"];
      const isResidency = true;
      return {
        id: course.course_id,
        name: course.course_name,
        target: `${audienceLabelForYear(course.target_year)} · ${course.target_student_count}人/次 · ${course.total_batches}次`,
        teacher: course.teacher_ids.map((id) => teacherById[id]?.name || id).join(" / "),
        teacherPrimary: teacherById[course.teacher_ids[0]]?.name || course.teacher_ids[0],
        teacherIds: course.teacher_ids,
        hours: durationToHours(course.duration_minutes),
        durationMinutes: course.duration_minutes,
        roomType: roomTypeForCourse(course, index),
        courseType: base.label,
        baseType: base.key,
        baseLabel: base.label,
        baseColor: base.color,
        isResidency,
        trainingYear: isResidency ? course.target_year : null,
        people: course.target_student_count,
        resourceTight: course.priority_level === 1,
        equipment: equipmentNames(course.required_equipment_ids),
        totalSessions: course.total_batches,
        scheduledSessions: preScheduledMap[index] ? 1 : 0,
        status: preScheduledMap[index] ? 'scheduled' : 'pending',
        scheduledDates: preScheduledMap[index] ? [preScheduledMap[index]] : [],
        availableTime: availableTimeMock[index % availableTimeMock.length],
        teacherRemark: teacherRemarkMock[index % teacherRemarkMock.length],
        raw: course
      };
    });

    const courses = [teacherTrainingCourse, ...residencyCourses];

    const teachingTargets = [...new Map(coursesRaw.map((course) => {
      const id = `Y${course.target_year}-P${course.target_student_count}`;
      return [id, {
        id,
        year: course.target_year,
        studentCount: course.target_student_count,
        audienceLabel: audienceLabelForYear(course.target_year),
        label: `${audienceLabelForYear(course.target_year)} · ${course.target_student_count}人/次`
      }];
    })).values()];

    const rooms = classroomsRaw.map((room) => ({
      id: room.room_id,
      name: room.room_name || `${room.room_id} ${room.room_type}`,
      floor: room.floor_label || `${room.floor}楼`,
      floorNumber: room.floor,
      floorTone: room.floor === 3 ? "floor-green" : "floor-blue",
      capacity: room.capacity_max,
      type: room.room_type,
      profile: room.profile,
      equipment: [...equipmentNames(room.fixed_equipment), ...(room.has_multimedia ? ["多媒体"] : [])],
      recommended: room.priority_score >= 0.85,
      priorityScore: room.priority_score,
      raw: room
    }));

    const buildAutoPlans = () => {
      // AI 自动排课仅适用于住培课程，项目制课程（isTeacherTraining）不参与
      const residencyOnly = courses.filter(c => c.isResidency);
      const pending = residencyOnly.flatMap((course) => course.isCompound ? course.sessions : [course]).filter((course) => course.status === "pending");
      const courseAt = (index) => pending[index % pending.length] || residencyOnly[index % residencyOnly.length];
      const targetFor = (course) => course.isTeacherTraining ? course.target : `${audienceLabelForYear(course.raw.target_year)} · ${course.people}人/次`;
      const roomAt = (index) => rooms[index % rooms.length];
      const weekDays = ["一", "二", "三", "四", "五"];
      const timeByPlan = [
        ["12:30-13:30"],
        ["12:30-13:30"],
        ["12:30-13:30"]
      ];
      const noteCycle = ["已确认", "教室已锁定", "教师偏好时段", "设备已预约", "需人工确认"];
      const toneCycle = ["success", "info", "success", "info", "warning"];
      // 学期第1周周一 = 2026-09-07
      const semesterStart = new Date('2026-09-07T00:00:00');
      const wdToOffset = { '一': 0, '二': 1, '三': 2, '四': 3, '五': 4 };
      // 每套方案的周次起点 & 每周内的授课日分布（规则：避免连续占用同一教室）
      const weekBases = [8, 9, 8];
      const dayPatterns = [
        ['一', '三', '五'],  // 方案1：周一/三/五，分散最佳
        ['二', '四', '五'],  // 方案2：周二/四/五，教师负荷分散
        ['一', '二', '四'],  // 方案3：周一/二/四，场地连续利用
      ];
      const makeSchedule = (planIndex, start, count) => Array.from({ length: count }, (_, index) => {
        const course = courseAt(start + index);
        const teacherName = course.teacherPrimary || course.teacher.split(" / ")[0];
        const room = roomAt(start + index + planIndex);
        const rowWeek = weekBases[planIndex] + Math.floor(index / 3);
        const rowWeekday = dayPatterns[planIndex][index % 3];
        const dayOffset = (rowWeek - 1) * 7 + wdToOffset[rowWeekday];
        const rowDate = new Date(semesterStart.getTime() + dayOffset * 86400000);
        const dateStr = `${rowDate.getFullYear()}-${String(rowDate.getMonth()+1).padStart(2,'0')}-${String(rowDate.getDate()).padStart(2,'0')}`;
        return {
          id: `plan-${planIndex + 1}-row-${index}`,
          week: rowWeek,
          weekday: rowWeekday,
          date: dateStr,
          time: timeByPlan[planIndex][index % timeByPlan[planIndex].length],
          course: course.name.replace(/\d+$/, ""),
          room: room.name,
          teacher: teacherName,
          target: targetFor(course),
          classLabel: audienceClassLabelForCourse(course),
          baseType: course.baseType,
          baseLabel: course.baseLabel,
          trainingYear: course.trainingYear,
          hours: `${course.durationMinutes} min`,
          note: noteCycle[(index + planIndex) % noteCycle.length],
          tone: toneCycle[(index + planIndex) % toneCycle.length]
        };
      });

      return [
        {
          id: "plan-1",
          name: "方案 1",
          badge: "默认推荐",
          strategy: "教师时间优先",
          score: 94,
          summary: "严格执行规则1-4：优先保障教师可授课时段，排除节假日，模拟病房/PBL教室等资源紧张场地优先落位，默认午间 12:30-13:30 时间段。",
          applicable: true,
          applicabilityLabel: "硬性约束已通过，可生成确认草案",
          hardChecks: [
            { label: "停课日与法定节假日", status: "pass", evidence: "候选日期均不在演示停课日清单中" },
            { label: "教师已登记不可用时段", status: "pass", evidence: "未发现与门诊、手术和值班时段重叠" },
            { label: "场地容量与必需设备", status: "pass", evidence: "候选房间均满足最低容量与设备要求" },
            { label: "住培三年级月份范围", status: "pass", evidence: "相关课次均位于允许月份内" }
          ],
          preferenceChecks: [
            { label: "教师时间优先", status: "pass", evidence: "优先使用教师已确认的可授课窗口" },
            { label: "资源紧张课程优先", status: "pass", evidence: "特殊场地课程先于普通课程落位" },
            { label: "教师负荷均衡", status: "partial", evidence: "仍有少量月份负荷接近建议上限" }
          ],
          impact: { drafts: 18, courses: 18, teachers: 15, rooms: 6, unresolved: 0, nextState: "待教师确认" },
          metrics: [
            { label: "已安排", value: "42课次" },
            { label: "教师冲突", value: "0处" },
            { label: "教室匹配", value: "86%" }
          ],
          report: [
            { label: "课程覆盖", value: "42/45", note: "核心课次全部完成", tone: "success" },
            { label: "教师时间", value: "96%", note: "门诊/手术时段已全部避开", tone: "success" },
            { label: "教室匹配", value: "86%", note: "设备和容量双重匹配", tone: "success" },
            { label: "冲突处理", value: "0处", note: "无教师冲突，节假日已排除", tone: "success" }
          ],
          schedule: makeSchedule(0, 0, 18),
          conflicts: ["节假日及医院停课日已全部排除（规则3）", "教师门诊/手术/值班时段已识别并跳过（规则4）", "住培三年级课程已限定在7-12月内（规则6）"]
        },
        {
          id: "plan-2",
          name: "方案 2",
          badge: "备选方案",
          strategy: "教师负荷均衡",
          score: 89,
          summary: "重点执行规则5（每月≤2次）和规则7（避开月底月初）：严格均衡每位教师的月度授课负荷，牺牲少量排课密度，换取最低连续授课压力。",
          applicable: false,
          applicabilityLabel: "存在 2 项待核实硬性约束，暂不可应用",
          hardChecks: [
            { label: "停课日与法定节假日", status: "pass", evidence: "候选日期均不在演示停课日清单中" },
            { label: "教师已登记不可用时段", status: "review", evidence: "2 处跨月临界时段需人工核实" },
            { label: "场地容量与必需设备", status: "pass", evidence: "候选房间满足最低容量与设备要求" },
            { label: "住培三年级月份范围", status: "pass", evidence: "相关课次均位于允许月份内" }
          ],
          preferenceChecks: [
            { label: "教师月度负荷均衡", status: "pass", evidence: "每位教师每月不超过 2 次" },
            { label: "避开月底月初", status: "pass", evidence: "已保留月首与月末缓冲" },
            { label: "课程覆盖率", status: "partial", evidence: "5 个课次因负荷限制尚未落位" }
          ],
          impact: { drafts: 16, courses: 16, teachers: 14, rooms: 5, unresolved: 2, nextState: "待人工核实" },
          metrics: [
            { label: "已安排", value: "40课次" },
            { label: "教师冲突", value: "2处" },
            { label: "月均负荷", value: "≤2次" }
          ],
          report: [
            { label: "课程覆盖", value: "40/45", note: "5课次因负荷限制延后", tone: "warning" },
            { label: "教师负荷", value: "每月≤2次", note: "严格执行月度上限规则", tone: "success" },
            { label: "月底月初", value: "已避开", note: "3天缓冲已生效（规则7）", tone: "success" },
            { label: "冲突处理", value: "2处", note: "需人工确认时段", tone: "info" }
          ],
          schedule: makeSchedule(1, 6, 16),
          conflicts: ["每位教师月授课次数已严格限制在≤2次（规则5）", "所有课程已避开月底/月初3天时段（规则7）", "剩余2处冲突为跨月临界，建议人工核查"]
        },
        {
          id: "plan-3",
          name: "方案 3",
          badge: "场地高效",
          strategy: "教室利用率优先",
          score: 87,
          summary: "重点执行规则2（资源紧张课程优先）：先锁定模拟病房、PBL教室等特殊场地，同类课程集中在相邻时段，教室利用率最高，但部分教师连续授课需复核。",
          applicable: false,
          applicabilityLabel: "存在 5 项教师时段风险，暂不可应用",
          hardChecks: [
            { label: "停课日与法定节假日", status: "pass", evidence: "候选日期均不在演示停课日清单中" },
            { label: "教师已登记不可用时段", status: "review", evidence: "5 处连续授课与临界时段需教师确认" },
            { label: "场地容量与必需设备", status: "pass", evidence: "特殊场地与设备需求均已匹配" },
            { label: "住培三年级月份范围", status: "pass", evidence: "相关课次均位于允许月份内" }
          ],
          preferenceChecks: [
            { label: "教室利用率", status: "pass", evidence: "同类课程集中落位，减少空置" },
            { label: "资源紧张课程优先", status: "pass", evidence: "特殊场地课程已优先锁定" },
            { label: "教师负荷均衡", status: "partial", evidence: "部分教师连续授课，负荷偏高" }
          ],
          impact: { drafts: 20, courses: 20, teachers: 17, rooms: 7, unresolved: 5, nextState: "待人工核实" },
          metrics: [
            { label: "已安排", value: "44课次" },
            { label: "教室利用率", value: "92%" },
            { label: "冲突", value: "5处" }
          ],
          report: [
            { label: "课程覆盖", value: "44/45", note: "资源紧张课程优先全部落位", tone: "success" },
            { label: "教室利用", value: "92%", note: "同类课程集中排布，减少空置", tone: "success" },
            { label: "教师负荷", value: "部分偏高", note: "连续授课超过月度建议（规则5）", tone: "warning" },
            { label: "冲突处理", value: "5处", note: "需人工复核，主要为教师连续场景", tone: "warning" }
          ],
          schedule: makeSchedule(2, 12, 20),
          conflicts: ["模拟病房/PBL教室等特殊场地已优先锁定（规则2）", "5处冲突集中在月底相邻日期，建议人工复核（规则7）", "适合教室资源紧张周快速批量落位"]
        }
      ];
    };

    const app = createApp({
      components: {
        Home, Settings, Bell, BookOpen, CheckCircle2, Cpu, Users, Globe2, SlidersHorizontal,
        ChevronDown, PanelLeftClose, LayoutDashboard, FilePlus2, ClipboardCheck, DoorOpen, CalendarDays, ArrowRight, ShieldCheck, Sparkles, CircleCheckBig, LoaderCircle, Circle, Maximize2, Minimize2,
        'icon-grid': Grid3X3
      },
      data() {
        return {
          searchText: '',
          resourceKeyword: '',
          resourceView: 'course',
          scheduleStatus: 'pending',
          isWorkbenchFullscreen: false,
          teachers,
          teachingTargets,
          courses,
          rooms,
          selectedCourse: courses.find((course) => !course.isCompound) || courses[0],
          expandedCompoundCourseId: '',
          expandedScheduledCardId: '',
          rescheduleMode: false,
          rescheduleItem: null,
          rescheduleSession: null,
          calendarMode: '月历',
          currentMonthDate: '2026-11-01',
          currentWeek: 12,
          semesterStartDate: '2026-09-07',
          semesterWeeks: Array.from({ length: 15 }, (_, index) => index + 1),
          showWeekend: true,
          scheduleDay: '周一',
          floorFilter: 'recommended',
          capacity: '0',
          equipment: 'all',
          viewMode: '按房间',
          weekdays: ['周一', '周二', '周三', '周四', '周五'],
          weekendDays: ['周六', '周日'],
          slots: [
            { name: '固定午间', short: '午', time: '12:30-13:30' }
          ],
          weekSlots: [
            { name: '上午', short: '09', time: '09:00-11:30', available: false },
            { name: '固定午间', short: '午', time: '12:30-13:30', available: true },
            { name: '下午', short: '14', time: '13:30-17:00', available: false }
          ],
          events: [
            { id: 'E001', date: '2026-11-06', week: 9, roomId: 'R301', day: '周五', slot: '固定午间', startSlotIndex: 0, slotCount: 1, title: '腰穿', desc: '12:30-13:30 · 301 PBL教室', type: 'new', baseType: 'general', baseLabel: '通识', trainingYear: 1, isResidency: true, classLabel: '1(1)班', teacher: '邱甜' },
            { id: 'E002', date: '2026-11-11', week: 10, roomId: 'R305', day: '周三', slot: '固定午间', startSlotIndex: 0, slotCount: 1, title: '胃管洗胃', desc: '12:30-13:30 · 305阶梯教室', type: 'recommend', baseType: 'general', baseLabel: '通识', trainingYear: 1, isResidency: true, classLabel: '1(1)班', teacher: '朱雪梅' },
            { id: 'E003', date: '2026-11-18', week: 11, roomId: 'R401', day: '周三', slot: '固定午间', startSlotIndex: 0, slotCount: 1, title: '缝合打结', desc: '12:30-13:30 · 401模拟病房', type: 'room', baseType: 'surgery', baseLabel: '外科', trainingYear: 1, isResidency: true, classLabel: '1(1)班', teacher: '诸壬卿' },
            { id: 'E004', date: '2026-11-24', week: 12, roomId: 'R410', day: '周二', slot: '固定午间', startSlotIndex: 0, slotCount: 1, title: '腹泻补液', desc: '12:30-13:30 · 410多功能教室', type: 'new', baseType: 'internal', baseLabel: '内科', trainingYear: 2, isResidency: true, classLabel: '2(1)班', teacher: '王玉环' }
          ],
          placementPreview: null,
          scheduleModal: false,
          courseDetailVisible: false,
          detailCourse: null,
          pendingWeek: 12,
          pendingDate: '',
          pendingDay: '',
          pendingRoom: null,
          pendingSlot: null,
          pendingEventId: '',
          draggingEventId: '',
          cancelPlacementMode: false,
          scheduleDrawerTimer: null,
          relinkModal: false,
          ruleForm: { teacher: [teachers[0].name], room: [rooms[0].name], slot: '固定午间', timeMode: 'fixed', customStart: '08:00', customEnd: '08:30', meetingLink: '', _originalMeetingLink: '', drawerRecognized: '' },
          rulesModal: false,
          schedulingRules: {
            priorities: [
              {
                id: 'p-teacher', order: 1, enabled: true,
                kind: 'preference',
                label: '可授课时间紧的教师优先',
                detail: '优先为可排时间窗口较少的教师安排课程，防止其时间被其他课程抢占后无法排课。'
              },
              {
                id: 'p-resource', order: 2, enabled: true,
                kind: 'preference',
                label: '资源紧张课程（特殊场地/设备）优先',
                detail: '有特殊场地或设备需求的课程优先落位，避免普通课程提前占用稀缺资源。'
              },
              {
                id: 'p-remaining', order: 3, enabled: true,
                kind: 'preference',
                label: '剩余普通课程按教师负荷均衡排列',
                detail: '无特殊资源需求、教师时间充裕的课程最后安排，各教师间课程负荷尽量均衡。'
              },
            ],
            timeRules: [
              {
                id: 't-holiday', enabled: true, type: 'toggle',
                kind: 'hard',
                label: '排除法定节假日',
                detail: '自动跳过国家规定的法定节假日，不在节假日排课。'
              },
              {
                id: 't-grade3', enabled: true, type: 'monthRange',
                kind: 'hard',
                label: '住培三年级课程仅排在指定月份内',
                detail: '住培三年级学员的课程只安排在设定的月份区间内，超出范围的日期不予排课。',
                params: { monthStart: 7, monthEnd: 12 }
              },
              {
                id: 't-boundary', enabled: true, type: 'avoidDays',
                kind: 'preference',
                label: '尽量避开月底/月初',
                detail: '避免在每月首尾若干天内排课，为月末结算和月初准备留出缓冲期。',
                params: { days: 3 }
              },
            ],
            limits: [
              {
                id: 'l-monthly', enabled: true, type: 'count',
                kind: 'hard',
                label: '每位教师每月最多授课次数',
                detail: '限制同一教师在同一自然月内的最大授课次数，防止教师课程负荷过重。',
                params: { max: 2 }
              },
              {
                id: 'l-timeslot', enabled: true, type: 'timeRange',
                kind: 'preference',
                label: '住培课程默认时间段',
                detail: '住培课程优先使用此固定时间段，无冲突时由系统自动选入，无需手动指定。',
                params: { start: '12:30', end: '13:30' }
              },
            ],
          },
          autoModal: false,
          aiDrawerVisible: false,
          aiDrawerStep: 'rules',
          customRuleEnabled: true,
          customRuleText: '',
          aiIndex: 0,
          aiTimer: null,
          aiShowResult: false,
          aiResultTimer: null,
          selectedAiPlanId: 'plan-1',
          autoPlanAppliedMessage: '',
          aiSteps: [
            '读取排课规则配置（教师时间优先 · 资源紧张课程优先 · 负荷均衡…）',
            '筛选待排课程，标记特殊场地 / 特殊设备需求的资源紧张课程',
            '排除法定节假日及医院停课日，锁定可用排课日期范围',
            '检查教师可授课时段，跳过门诊 / 手术 / 值班不可用时间段',
            '按每月最多授课次数（≤ 2 次）分配课程，均衡教师负荷',
            '住培三年级课程限定在 7–12 月内排布，避开月底 / 月初 3 天',
            '优先落位资源紧张课程（模拟病房 / PBL教室 / 特殊设备），再安排普通课程',
            '全局冲突检测：发现 3 处冲突，智能调整至最优备选日期…',
          ],
          aiPlans: buildAutoPlans(),
          aiCalendarMode: 'month',
          aiCalMonthOffset: 0,
          aiPreviewVisible: false,
          lastAiDraftBatch: null,
          pilotTeacherConfirmation: window.TeachingBusiness?.getTeacherConfirmation?.('儿科坏消息告知') || null,
          teacherConfirmationStorageHandler: null,
        };
      },
      computed: {
        pendingCourses() {
          return this.courses.filter((course) => {
            // compound 课程（如项目制课程）：以「仍有子课次未排完」为准
            if (course.isCompound) {
              return (course.sessions || []).some(s => s.status !== 'scheduled');
            }
            return course.scheduledSessions < course.totalSessions;
          });
        },
        scheduledCourses() {
          return this.courses.filter((course) => course.scheduledSessions > 0);
        },
        statusCourses() {
          return this.scheduleStatus === 'pending' ? this.pendingCourses : this.scheduledCourses;
        },
        floorOptions() {
          return [...new Set(this.rooms.map((room) => room.floor))].sort();
        },
        equipmentOptions() {
          return [...new Set(this.rooms.flatMap((room) => room.equipment))].sort();
        },
        daysForSchedule() {
          return this.showWeekend ? [...this.weekdays, ...this.weekendDays] : this.weekdays;
        },
        calendarWeekdays() {
          return this.showWeekend ? ['周日', '周一', '周二', '周三', '周四', '周五', '周六'] : this.weekdays;
        },
        currentMonth() {
          return new Date(`${this.currentMonthDate}T00:00:00`);
        },
        calendarTitle() {
          const date = this.currentMonth;
          return this.calendarMode === '年历' ? `${date.getFullYear()}年` : `${date.getFullYear()}年${date.getMonth() + 1}月`;
        },
        monthCells() {
          const base = this.currentMonth;
          const year = base.getFullYear();
          const month = base.getMonth();
          const first = new Date(year, month, 1);
          const start = new Date(first);
          const startOffset = this.showWeekend ? first.getDay() : Math.max(0, first.getDay() - 1);
          start.setDate(first.getDate() - startOffset);
          const cells = [];
          const total = this.showWeekend ? 42 : 35;
          const todayKey = this.dateKey(new Date());
          for (let index = 0; cells.length < total; index += 1) {
            const date = new Date(start);
            date.setDate(start.getDate() + index);
            if (!this.showWeekend && [0, 6].includes(date.getDay())) continue;
            const key = this.dateKey(date);
            cells.push({
              key,
              dateKey: key,
              day: date.getDate(),
              inMonth: date.getMonth() === month,
              isToday: key === todayKey
            });
          }
          return cells;
        },
        yearMonths() {
          const year = this.currentMonth.getFullYear();
          return Array.from({ length: 12 }, (_, index) => {
            const month = index + 1;
            const date = new Date(year, index, 1);
            const daysInMonth = new Date(year, index + 1, 0).getDate();
            const days = Array.from({ length: daysInMonth }, (_, dayIndex) => {
              const key = this.dateKey(new Date(year, index, dayIndex + 1));
              return { key, day: dayIndex + 1, count: this.eventsForDate(key).length, isToday: key === this.dateKey(new Date()) };
            });
            return { key: `${year}-${month}`, month, count: days.reduce((sum, day) => sum + day.count, 0), days };
          });
        },
        filteredCourses() {
          const text = this.resourceKeyword.trim();
          const source = this.statusCourses;
          if (!text) return source;
          return source.filter((item) => {
            const sessionText = item.sessions ? item.sessions.map((session) => `${session.name} ${session.teacher} ${session.deliveryMode}`).join(' ') : '';
            return [item.name, item.target, item.teacher, item.roomType, item.courseType, sessionText].some(value => String(value || '').includes(text));
          });
        },
        resourceGroups() {
          const courses = this.filteredCourses;
          if (this.resourceView === 'course') return courses;
          if (this.resourceView === 'teacher') {
            return this.teachers
              .map((teacher) => {
                const children = courses.filter((course) => course.teacherIds.includes(teacher.teacher_id));
                return {
                  id: teacher.teacher_id,
                  title: teacher.name,
                  desc: `${teacher.department} · 本周可排${teacher.max_weekly_hours * 45} min`,
                  meta: [teacher.title, teacher.is_flexible ? '可排' : '周内受限', `已排${children.filter((course) => course.status === 'scheduled').length}节`],
                  status: children.some((course) => course.status === 'pending') ? 'pending' : 'scheduled',
                  children
                };
              })
              .filter((group) => group.children.length);
          }
          return this.teachingTargets
            .map((target) => {
              const children = courses.filter((course) => course.raw.target_year === target.year && course.raw.target_student_count === target.studentCount);
              return {
                id: target.id,
                title: target.audienceLabel,
                desc: `${target.studentCount}人 · 本周需求${children.reduce((sum, course) => sum + course.durationMinutes, 0)} min`,
                meta: [`${target.studentCount}人/次`, '待排课程'],
                status: children.some((course) => course.status === 'pending') ? 'pending' : 'scheduled',
                children
              };
            })
            .filter((group) => group.children.length);
        },
        visibleRooms() {
          const baseRooms = this.rooms.filter(room => {
            const floorOk = ['all', 'recommended'].includes(this.floorFilter) || room.floor === this.floorFilter;
            const capacityOk = room.capacity >= Number(this.capacity || 0);
            const equipmentOk = this.equipment === 'all' || room.equipment.includes(this.equipment);
            return floorOk && capacityOk && equipmentOk;
          });
          if (this.floorFilter !== 'recommended') return baseRooms;
          return this.recommendedRoomsForCourse(baseRooms, this.selectedCourse);
        },
        matchedRooms() {
          return this.visibleRooms
            .filter(room => this.roomMatchesCourse(room, this.selectedCourse))
            .sort((a, b) => this.roomScore(b) - this.roomScore(a));
        },
        drawerRecommendedRooms() {
          if (this.selectedCourse.isLiveSession) return [];
          const recommended = this.recommendedRoomsForCourse(this.rooms, this.selectedCourse);
          return (recommended.length ? recommended : this.rooms)
            .filter(room => this.roomMatchesCourse(room, this.selectedCourse))
            .sort((a, b) => this.roomScore(b, this.selectedCourse) - this.roomScore(a, this.selectedCourse))
            .slice(0, 4);
        },
        groupedRooms() {
          return this.floorOptions
            .map(floor => ({ floor, rooms: this.visibleRooms.filter(room => room.floor === floor) }))
            .filter(group => group.rooms.length);
        },
        conflictCount() {
          return this.events.filter(item => ['busy', 'room'].includes(item.type)).length;
        },
        bestScore() {
          return this.matchedRooms.length ? Math.max(...this.matchedRooms.map(room => this.roomScore(room))) : 0;
        },
        scheduleRows() {
          return this.semesterWeeks.flatMap((week) => this.daysForSchedule.flatMap((day, dayIndex) => this.slots.map((slot, slotIndex) => ({
            week,
            day,
            slot,
            id: `${week}-${day}-${slot.name}`,
            isWeekStart: dayIndex === 0 && slotIndex === 0,
            isDayStart: slotIndex === 0
          }))));
        },
        pendingLabel() {
          const isLive = this.selectedCourse?.isLiveSession;
          const roomText = this.selectedRoomNames().join('、') || '待选择房间';
          if (this.pendingDate) {
            return `${this.pendingDate} · ${this.scheduleTimeDisplay()} · ${isLive ? '直播链接待粘贴' : roomText}`;
          }
          if (isLive && this.pendingSlot) return `第${this.pendingWeek}周 ${this.pendingDay} ${this.scheduleTimeDisplay()} · 直播链接待粘贴`;
          return this.pendingRoom && this.pendingSlot ? `第${this.pendingWeek}周 ${this.pendingDay} ${this.scheduleTimeDisplay()} · ${roomText}` : '待选择房间';
        },
        currentWeekDateRange() {
          const start = new Date(`${this.semesterStartDate}T00:00:00`);
          start.setDate(start.getDate() + (this.currentWeek - 1) * 7);
          const end = new Date(start);
          end.setDate(start.getDate() + (this.showWeekend ? 6 : 4));
          const format = (date, includeYear = false) => {
            const month = date.getMonth() + 1;
            const day = date.getDate();
            return includeYear ? `${date.getFullYear()}年${month}月${day}日` : `${month}月${day}日`;
          };
          return `${format(start, true)}-${format(end)}`;
        },
        aiPercent() {
          return Math.min(1, this.aiIndex / this.aiSteps.length);
        },
        aiCompleted() {
          return this.aiShowResult;
        },
        currentAiPrompt() {
          if (this.aiIndex >= this.aiSteps.length) return '排课完成，正在生成方案...';
          const step = this.aiSteps[this.aiIndex];
          return step || '正在准备排课数据...';
        },
        selectedAiPlan() {
          return this.aiPlans.find((plan) => plan.id === this.selectedAiPlanId) || this.aiPlans[0];
        },
        aiCalCurrentMonthDate() {
          if (!this.selectedAiPlan) return null;
          const dates = this.selectedAiPlan.schedule.map(r => r.date).filter(Boolean).sort();
          if (!dates.length) return null;
          const firstDate = new Date(dates[0] + 'T00:00:00');
          firstDate.setDate(1);
          firstDate.setMonth(firstDate.getMonth() + this.aiCalMonthOffset);
          return firstDate;
        },
        aiCalLabel() {
          const d = this.aiCalCurrentMonthDate;
          if (!d) return '';
          return `${d.getFullYear()}年${d.getMonth() + 1}月`;
        },
        aiCalDays() {
          const d = this.aiCalCurrentMonthDate;
          if (!d) return [];
          const year = d.getFullYear(), month = d.getMonth();
          const daysInMonth = new Date(year, month + 1, 0).getDate();
          const evMap = {};
          (this.selectedAiPlan?.schedule || []).forEach(row => {
            if (!row.date) return;
            const rd = new Date(row.date + 'T00:00:00');
            if (rd.getFullYear() === year && rd.getMonth() === month) {
              if (!evMap[row.date]) evMap[row.date] = [];
              evMap[row.date].push(row);
            }
          });
          let firstDow = new Date(year, month, 1).getDay();
          firstDow = (firstDow + 6) % 7; // Mon=0, Sun=6
          const days = [];
          for (let i = 0; i < firstDow; i++) days.push({ type: 'empty' });
          for (let d2 = 1; d2 <= daysInMonth; d2++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d2).padStart(2, '0')}`;
            days.push({ type: 'day', date: d2, dateStr, events: evMap[dateStr] || [] });
          }
          return days;
        },
        aiYearMonths() {
          if (!this.selectedAiPlan) return [];
          const dates = this.selectedAiPlan.schedule.map(r => r.date).filter(Boolean).sort();
          if (!dates.length) return [];
          const year = new Date(dates[0] + 'T00:00:00').getFullYear();
          const evMap = {};
          (this.selectedAiPlan?.schedule || []).forEach(row => {
            if (!row.date) return;
            if (!evMap[row.date]) evMap[row.date] = [];
            evMap[row.date].push(row);
          });
          return Array.from({ length: 12 }, (_, mi) => {
            const daysInMonth = new Date(year, mi + 1, 0).getDate();
            let firstDow = new Date(year, mi, 1).getDay();
            firstDow = (firstDow + 6) % 7;
            const cells = [];
            for (let i = 0; i < firstDow; i++) cells.push({ empty: true });
            for (let d2 = 1; d2 <= daysInMonth; d2++) {
              const dateStr = `${year}-${String(mi + 1).padStart(2, '0')}-${String(d2).padStart(2, '0')}`;
              cells.push({ day: d2, dateStr, count: (evMap[dateStr] || []).length, events: evMap[dateStr] || [] });
            }
            return { year, month: mi + 1, label: `${mi + 1}月`, cells };
          });
        },
        timePoints() {
          return Array.from({ length: 19 }, (_, index) => {
            const totalMinutes = 8 * 60 + index * 30;
            const hour = Math.floor(totalMinutes / 60);
            const minute = totalMinutes % 60;
            return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
          });
        },
        customEndOptions() {
          const startIndex = this.timePoints.indexOf(this.ruleForm.customStart);
          return this.timePoints.filter((_, index) => index > startIndex);
        }
      },
      methods: {
        refreshPilotTeacherConfirmation() {
          this.pilotTeacherConfirmation = window.TeachingBusiness?.getTeacherConfirmation?.('儿科坏消息告知') || null;
        },
        goBackToWorkbench() {
          if (typeof window.navigateTo === 'function') {
            window.navigateTo('排课工作台');
          } else {
            document.body.dataset.active = '排课工作台';
          }
        },
        dateKey(date) {
          const target = date instanceof Date ? date : new Date(`${date}T00:00:00`);
          const month = String(target.getMonth() + 1).padStart(2, '0');
          const day = String(target.getDate()).padStart(2, '0');
          return `${target.getFullYear()}-${month}-${day}`;
        },
        dateDayName(dateKey) {
          const names = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
          return names[new Date(`${dateKey}T00:00:00`).getDay()];
        },
        weekForDate(dateKey) {
          if (!dateKey) return 0;
          const start = new Date(`${this.semesterStartDate}T00:00:00`);
          const d = new Date(`${dateKey}T00:00:00`);
          return Math.max(1, Math.floor((d - start) / (7 * 24 * 60 * 60 * 1000)) + 1);
        },
        dateFromWeekDay(week, day) {
          const dayIndexMap = { '周日': 0, '周一': 1, '周二': 2, '周三': 3, '周四': 4, '周五': 5, '周六': 6, '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '日': 0 };
          const start = new Date(`${this.semesterStartDate}T00:00:00`);
          const normalized = String(day || '').replace('星期', '周');
          const index = dayIndexMap[normalized] ?? dayIndexMap[normalized.replace('周', '')] ?? 1;
          start.setDate(start.getDate() + (Number(week) - 1) * 7 + (index - 1));
          return this.dateKey(start);
        },
        jumpMonth(offset) {
          const date = new Date(`${this.currentMonthDate}T00:00:00`);
          if (this.calendarMode === '年历') date.setFullYear(date.getFullYear() + offset);
          else date.setMonth(date.getMonth() + offset);
          date.setDate(1);
          this.currentMonthDate = this.dateKey(date);
        },
        eventsForDate(dateKey) {
          return this.events.filter((event) => event.date === dateKey);
        },
        previewDatePlacement(day) {
          this.placementPreview = { date: day.dateKey };
        },
        courseCalendarClass(event) {
          return [
            'month-course-card',
            `base-${event.baseType || 'general'}`,
            event.isResidency === false ? 'non-residency' : 'residency',
            event.pendingConfirm ? 'pending' : ''
          ];
        },
        courseTypeColor(type) {
          return ({ 通识: 'blue', 内科: 'green', 外科: 'purple' }[type] || 'blue');
        },
        courseTypeHex(type) {
          return ({ 通识: '#165dff', 内科: '#00b42a', 外科: '#722ed1' }[type] || '#165dff');
        },
        formatTimeOption(time) {
          return String(time || '').replace(/^0/, '').replace(':', '：');
        },
        selectedTeacherList(course = this.selectedCourse) {
          if (Array.isArray(course?.teacherNames)) return course.teacherNames;
          const names = String(course?.teacher || '')
            .split(/\s*\/\s*/)
            .map((name) => name.trim())
            .filter(Boolean);
          return names.includes('待配置') ? [] : names;
        },
        selectedTeacherText() {
          const list = Array.isArray(this.ruleForm.teacher) ? this.ruleForm.teacher : [this.ruleForm.teacher].filter(Boolean);
          return list.length ? list.join(' / ') : '待配置';
        },
        selectedRoomNames() {
          return Array.isArray(this.ruleForm.room) ? this.ruleForm.room.filter(Boolean) : [this.ruleForm.room].filter(Boolean);
        },
        primaryRoomName() {
          return this.selectedRoomNames()[0] || '';
        },
        selectedRooms() {
          return this.selectedRoomNames()
            .map((name) => this.rooms.find((room) => room.name === name || room.id === name))
            .filter(Boolean);
        },
        selectedRoomText() {
          return this.selectedRoomNames().join('、');
        },
        isRoomSelected(roomName) {
          return this.selectedRoomNames().includes(roomName);
        },
        toggleDrawerRoom(roomName) {
          this.ruleForm.room = [roomName];
        },
        roomImage(room) {
          const images = {
            'PBL教室': 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=480&q=80',
            '阶梯教室': 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=480&q=80',
            '模拟病房': 'https://images.unsplash.com/photo-1516841273335-e39b37888115?auto=format&fit=crop&w=480&q=80',
            '模拟手术室': 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=480&q=80',
            '普通教室': 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=480&q=80'
          };
          return images[room.type] || images['普通教室'];
        },
        scheduleTimeText() {
          if (this.ruleForm.timeMode === 'custom') {
            return `${this.ruleForm.customStart}-${this.ruleForm.customEnd}`;
          }
          return '12:30-13:30';
        },
        scheduleTimeDisplay() {
          return this.scheduleTimeText().replace(/(^|-)0/g, '$1').replaceAll(':', '：');
        },
        setFixedTime() {
          this.ruleForm.timeMode = 'fixed';
          this.ruleForm.slot = '固定午间';
        },
        setCustomTime() {
          this.ruleForm.timeMode = 'custom';
          if (this.ruleForm.customEnd <= this.ruleForm.customStart) {
            const startIndex = this.timePoints.indexOf(this.ruleForm.customStart);
            this.ruleForm.customEnd = this.timePoints[Math.min(startIndex + 1, this.timePoints.length - 1)] || '08:30';
          }
        },
        normalizeCustomEndTime() {
          if (this.ruleForm.customEnd <= this.ruleForm.customStart) {
            const startIndex = this.timePoints.indexOf(this.ruleForm.customStart);
            this.ruleForm.customEnd = this.timePoints[Math.min(startIndex + 1, this.timePoints.length - 1)] || '17:00';
          }
        },
        addDays(dateKey, offset) {
          const date = new Date(`${dateKey}T00:00:00`);
          date.setDate(date.getDate() + offset);
          return this.dateKey(date);
        },
        weekFromDate(dateKey) {
          const date = new Date(`${dateKey}T00:00:00`);
          const start = new Date(`${this.semesterStartDate}T00:00:00`);
          return Math.max(1, Math.floor((date - start) / (7 * 24 * 60 * 60 * 1000)) + 1);
        },
        liveSessionIndex(session) {
          const parent = this.courses.find((course) => course.id === session.parentId);
          return Math.max(0, (parent?.sessions || []).filter((item) => item.isLiveSession).findIndex((item) => item.id === session.id));
        },
        parseMeetingInfo(text, session, offset = 0) {
          const source = String(text || '').trim();
          const normalized = source.replaceAll('：', ':');
          const url = normalized.match(/https?:\/\/[^\s，,。；;]+/)?.[0] || source;
          const currentYear = this.currentMonth.getFullYear();
          let dateKey = '';
          const fullDate = normalized.match(/(20\d{2})[年/.-]\s*(\d{1,2})[月/.-]\s*(\d{1,2})/);
          const shortDate = normalized.match(/(?:^|[^\d])(\d{1,2})[月/.-]\s*(\d{1,2})(?:日)?/);
          if (fullDate) {
            dateKey = `${fullDate[1]}-${String(fullDate[2]).padStart(2, '0')}-${String(fullDate[3]).padStart(2, '0')}`;
          } else if (shortDate) {
            dateKey = `${currentYear}-${String(shortDate[1]).padStart(2, '0')}-${String(shortDate[2]).padStart(2, '0')}`;
          } else {
            dateKey = this.addDays(this.currentMonthDate, this.liveSessionIndex(session) + offset);
          }
          const timeRange = normalized.match(/(\d{1,2}):(\d{2})\s*(?:-|~|至|到)\s*(\d{1,2}):(\d{2})/);
          const startOnly = normalized.match(/(\d{1,2}):(\d{2})/);
          let time = '12:30-13:30';
          if (timeRange) {
            time = `${String(timeRange[1]).padStart(2, '0')}:${timeRange[2]}-${String(timeRange[3]).padStart(2, '0')}:${timeRange[4]}`;
          } else if (startOnly) {
            const startHour = Number(startOnly[1]);
            const startMinute = Number(startOnly[2]);
            const end = new Date(2000, 0, 1, startHour, startMinute + 60);
            time = `${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}-${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}`;
          }
          return { url, dateKey, time };
        },
        handleMeetingPaste(session) {
          setTimeout(() => this.scheduleLiveFromLink(session), 0);
        },
        onDrawerLinkInput() {
          const val = String(this.ruleForm.meetingLink || '').trim();
          if (!val) { this.ruleForm.drawerRecognized = ''; return; }
          const info = this.parseMeetingInfo(val, this.selectedCourse);
          this.ruleForm.drawerRecognized = `已识别：${info.dateKey} ${info.time.replaceAll(':', '：')}`;
        },
        scheduleLiveFromLink(session) {
          if (!session?.isLiveSession || !String(session.meetingLink || '').trim()) return;
          this.selectedCourse = session;
          this.ruleForm.teacher = this.selectedTeacherList(session);
          this.ruleForm.meetingLink = session.meetingLink;
          this.ruleForm._originalMeetingLink = session.meetingLink;
          this.ruleForm.drawerRecognized = session.meetingRecognized || '';
          if (this.pendingEventId) {
            const previousIndex = this.events.findIndex(item => item.id === this.pendingEventId && item.pendingConfirm);
            if (previousIndex >= 0) this.events.splice(previousIndex, 1);
          }
          const info = this.parseMeetingInfo(session.meetingLink, session);
          session.meetingUrl = info.url;
          session.meetingDate = info.dateKey;
          session.meetingTime = info.time;
          session.meetingRecognized = `已识别：${info.dateKey} ${info.time.replaceAll(':', '：')}`;
          const eventId = `pending-live-${session.id}`;
          this.pendingEventId = eventId;
          this.pendingDate = info.dateKey;
          this.pendingDay = this.dateDayName(info.dateKey);
          this.pendingWeek = this.weekFromDate(info.dateKey);
          this.pendingRoom = null;
          this.pendingSlot = { name: '直播', time: info.time };
          const existingIndex = this.events.findIndex((event) => event.id === eventId || (event.id === session.calendarEventId && event.pendingConfirm));
          const event = this.buildLiveEvent(session, info, this.selectedTeacherText(), true, eventId);
          if (existingIndex >= 0) this.events.splice(existingIndex, 1, event);
          else this.events.push(event);
          this.scheduleModal = true;
        },
        buildLiveEvent(session, info, teacherText, pendingConfirm, eventId = `live-${session.id}`) {
          return {
            id: eventId,
            date: info.dateKey,
            week: this.weekFromDate(info.dateKey),
            roomId: '',
            day: this.dateDayName(info.dateKey),
            slot: '直播',
            startSlotIndex: 0,
            slotCount: 1,
            title: session.name,
            desc: `${info.time} · 直播 · ${teacherText} · ${info.url}`,
            classLabel: '师培',
            teacher: teacherText,
            type: pendingConfirm ? 'new pending' : 'new',
            baseType: session.baseType,
            baseLabel: session.baseLabel,
            trainingYear: null,
            isResidency: false,
            isLiveSession: true,
            meetingLink: info.url,
            pendingConfirm
          };
        },
        confirmLivePlace() {
          const session = this.selectedCourse;
          const newLink = String(this.ruleForm.meetingLink || '').trim();
          if (!session?.isLiveSession || !newLink) return;
          const linkChanged = newLink !== this.ruleForm._originalMeetingLink;
          if (linkChanged) session.meetingLink = newLink;
          session.teacherNames = [...(this.ruleForm.teacher || [])];
          const info = this.parseMeetingInfo(session.meetingLink, session);
          const teacherText = session.teacherNames.length ? session.teacherNames.join(' / ') : '待配置';
          session.teacher = teacherText;
          session.teacherPrimary = session.teacherNames[0] || '待配置';
          session.meetingUrl = info.url;
          session.meetingDate = info.dateKey;
          session.meetingTime = info.time;
          session.meetingRecognized = `已识别：${info.dateKey} ${info.time.replaceAll(':', '：')}`;
          session.status = 'scheduled';
          session.scheduledSessions = 1;
          const eventId = `live-${session.id}`;
          session.calendarEventId = eventId;
          const existingIndex = this.events.findIndex((event) => event.id === eventId || event.id === `pending-live-${session.id}`);
          const event = this.buildLiveEvent(session, info, teacherText, false, eventId);
          if (existingIndex >= 0) this.events.splice(existingIndex, 1, event);
          else this.events.push(event);
          const parent = this.courses.find((course) => course.id === session.parentId);
          if (parent) {
            parent.scheduledSessions = parent.sessions.filter((item) => item.status === 'scheduled').length;
            parent.status = parent.scheduledSessions >= parent.totalSessions ? 'scheduled' : 'pending';
            // 同步已排日期记录到父课程，供「已排」下拉行展示
            if (!parent.scheduledDates) parent.scheduledDates = [];
            parent.scheduledDates.push({
              index: parent.scheduledSessions,
              date: session.meetingDate || '',
              day: session.meetingDate ? this.dateDayName(session.meetingDate) : '',
              week: session.meetingDate ? this.weekForDate(session.meetingDate) : 0,
              room: '直播会议',
              eventId: session.calendarEventId || '',
              sessionName: session.name,
            });
          }
          this.scheduleModal = false;
          this.pendingEventId = '';
          this.pendingDate = '';
          this.pendingDay = '';
          this.pendingRoom = null;
          this.pendingSlot = null;
          this.ruleForm.meetingLink = '';
          this.ruleForm._originalMeetingLink = '';
          this.ruleForm.drawerRecognized = '';
          if (linkChanged) this.relinkModal = true;
        },
        dropCourseToDate(day) {
          if (!day?.dateKey) return;
          if (this.selectedCourse.isLiveSession) return;
          if (this.draggingEventId) {
            const event = this.events.find((item) => item.id === this.draggingEventId);
            if (!event) return;
            this.openPlacedEvent(event);
            this.pendingDate = day.dateKey;
            this.pendingDay = this.dateDayName(day.dateKey);
            this.pendingWeek = this.weekForDate(day.dateKey);
            this.cancelPlacementMode = false;
            this.draggingEventId = '';
            return;
          }
          clearTimeout(this.scheduleDrawerTimer);
          if (this.pendingEventId) {
            const previousIndex = this.events.findIndex(item => item.id === this.pendingEventId && item.pendingConfirm);
            if (previousIndex >= 0) this.events.splice(previousIndex, 1);
          }
          const isLive = this.selectedCourse.isLiveSession;
          const recommendedRoom = isLive ? null : (this.drawerRecommendedRooms[0] || this.rooms[0]);
          const slot = this.slots[0];
          this.pendingDate = day.dateKey;
          this.pendingDay = this.dateDayName(day.dateKey);
          this.pendingSlot = slot;
          this.pendingRoom = recommendedRoom;
          this.pendingWeek = this.currentWeek;
          this.ruleForm.room = isLive ? [] : [recommendedRoom?.name || this.rooms[0]?.name || ''].filter(Boolean);
          this.ruleForm.teacher = this.selectedTeacherList(this.selectedCourse);
          this.ruleForm.slot = slot.name;
          this.ruleForm.timeMode = 'fixed';
          this.ruleForm.meetingLink = '';
          this.pendingEventId = `pending-${Date.now()}`;
          this.events.push({
            id: this.pendingEventId,
            date: day.dateKey,
            week: this.currentWeek,
            roomId: isLive ? '' : (recommendedRoom?.id || ''),
            day: this.pendingDay,
            slot: slot.name,
            startSlotIndex: 0,
            slotCount: 1,
            title: this.selectedCourse.name,
            desc: isLive ? `${this.scheduleTimeText()} · 直播链接待粘贴` : `${this.scheduleTimeText()} · 推荐房间待确认`,
            classLabel: this.classLabelForCourse(this.selectedCourse),
            teacher: this.selectedTeacherText(),
            type: 'new pending',
            baseType: this.selectedCourse.baseType,
            baseLabel: this.selectedCourse.baseLabel,
            trainingYear: this.selectedCourse.trainingYear,
            isResidency: this.selectedCourse.isResidency,
            isLiveSession: isLive,
            pendingConfirm: true
          });
          this.clearPlacementPreview();
          this.scheduleDrawerTimer = setTimeout(() => {
            this.scheduleModal = true;
          }, 300);
        },
        selectCourse(item) {
          if (item.isCompound) {
            this.toggleCompoundCourse(item);
            return;
          }
          this.selectedCourse = item;
        },
        openCourseDetail(item) {
          if (item.isCompound) {
            this.toggleCompoundCourse(item);
            return;
          }
          this.detailCourse = item;
          this.selectedCourse = item;
          this.courseDetailVisible = true;
        },
        toggleCompoundCourse(item) {
          this.expandedCompoundCourseId = this.expandedCompoundCourseId === item.id ? '' : item.id;
        },
        isCourseCardActive(item) {
          return this.selectedCourse.id === item.id || this.selectedCourse.parentId === item.id;
        },
        sessionTagColor(session) {
          return session.isLiveSession ? 'blue' : 'green';
        },
        dayShort(day) {
          return String(day || '').replace('周', '');
        },
        jumpWeek(week) {
          const targetWeek = Math.min(Math.max(Number(week) || 1, 1), 15);
          this.currentWeek = targetWeek;
          this.$nextTick(() => {
            const wrap = this.$refs.courseCalendar;
            const marker = wrap?.querySelector(`tr.week-start-row[data-week="${targetWeek}"]`);
            if (wrap && marker) wrap.scrollTo({ top: Math.max(0, marker.offsetTop), behavior: 'smooth' });
          });
        },
        syncCurrentWeek() {
          const wrap = this.$refs.courseCalendar;
          if (!wrap) return;
          const markers = [...wrap.querySelectorAll('tr.week-start-row')];
          const current = markers.reduce((active, marker) => {
            return marker.offsetTop <= wrap.scrollTop + 56 ? marker : active;
          }, markers[0]);
          const week = Number(current?.dataset.week);
          if (week && week !== this.currentWeek) this.currentWeek = week;
        },
        selectResourceGroup(group) {
          if (group.children && group.children.length) this.selectCourse(group.children[0]);
        },
        remainingSessions(course) {
          return Math.max(course.totalSessions - course.scheduledSessions, 0);
        },
        fullScheduledDates(course) {
          return (course.scheduledDates || []).slice().sort((a, b) => a.index - b.index);
        },
        toggleScheduledCard(item) {
          // 待排 tab 下，compound 课程展开子课次列表
          if (item.isCompound && this.scheduleStatus === 'pending') {
            this.toggleCompoundCourse(item);
            return;
          }
          // 已排 tab 下（含 compound 课程）展开已排日期下拉
          this.expandedScheduledCardId = this.expandedScheduledCardId === item.id ? '' : item.id;
        },
        jumpToSession(item, session) {
          // 跳转日历至该次课对应的周
          if (session.week) this.jumpWeek(session.week);
          if (session.date) {
            const d = new Date(session.date + 'T00:00:00');
            this.currentMonthDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
          }
          // 复用排课落位抽屉来改期
          this.openReschedule(item, session);
        },
        openReschedule(item, session) {
          this.rescheduleMode = true;
          this.rescheduleItem = item;
          this.rescheduleSession = session;
          this.selectedCourse = item;
          this.pendingDate = session.date || '';
          this.pendingDay = session.day || '';
          this.pendingWeek = session.week || this.currentWeek;
          this.pendingEventId = session.eventId || '';
          this.pendingSlot = this.slots[0] || null;
          const room = this.rooms.find((r) => r.name === session.room) || this.rooms[0];
          this.pendingRoom = room || null;
          this.ruleForm.room = [room?.name || this.rooms[0]?.name || ''].filter(Boolean);
          this.ruleForm.teacher = [item.teacherPrimary];
          this.ruleForm.timeMode = 'fixed';
          this.ruleForm.slot = '固定午间';
          this.ruleForm.meetingLink = '';
          this.ruleForm.drawerRecognized = '';
          this.scheduleModal = true;
        },
        courseForEvent(event) {
          return this.courses.find((course) =>
            course.id === event.courseId ||
            (course.scheduledDates || []).some((session) => session.eventId === event.id) ||
            course.name === event.title
          ) || this.courses.find((course) => course.name === event.title) || this.selectedCourse;
        },
        sessionForEvent(course, event) {
          return (course.scheduledDates || []).find((session) => session.eventId === event.id) || {
            index: 1,
            date: event.date,
            day: event.day,
            week: event.week,
            room: event.rooms?.join('、') || this.rooms.find((room) => room.id === event.roomId)?.name || '',
            eventId: event.id
          };
        },
        openPlacedEvent(event) {
          if (!event || event.pendingConfirm) return;
          const course = this.courseForEvent(event);
          this.openReschedule(course, this.sessionForEvent(course, event));
          this.cancelPlacementMode = false;
        },
        startPlacedEventDrag(event) {
          if (!event || event.pendingConfirm) return;
          this.draggingEventId = event.id;
          this.selectedCourse = this.courseForEvent(event);
        },
        requestCancelPlacement(event) {
          if (!event || event.pendingConfirm) return;
          this.openPlacedEvent(event);
          this.cancelPlacementMode = true;
        },
        cancelScheduledPlacement() {
          const eventId = this.rescheduleSession?.eventId || this.pendingEventId;
          if (!eventId) return;
          const eventIndex = this.events.findIndex((event) => event.id === eventId);
          if (eventIndex >= 0) this.events.splice(eventIndex, 1);
          const course = this.rescheduleItem || this.selectedCourse;
          if (course?.scheduledDates) {
            course.scheduledDates = course.scheduledDates.filter((session) => session.eventId !== eventId);
            course.scheduledSessions = course.scheduledDates.length;
            course.status = course.scheduledSessions >= course.totalSessions ? 'scheduled' : 'pending';
          }
          this.cancelPlacementMode = false;
          this.cancelPlace();
        },
        dropPlacedEventToList() {
          if (!this.draggingEventId) return;
          const event = this.events.find((item) => item.id === this.draggingEventId);
          this.draggingEventId = '';
          this.requestCancelPlacement(event);
        },
        compactCourseName(name) {
          return String(name || '').replace(/\d+$/, '').slice(0, 6);
        },
        classLabelForCourse(course) {
          if (course?.classLabel) return course.classLabel;
          return audienceClassLabelForCourse(course);
        },
        eventClassLabel(event) {
          return event?.classLabel || this.classLabelForCourse(this.selectedCourse);
        },
        eventTeacherShort(event) {
          const teacher = event?.teacher || this.selectedCourse.teacherPrimary || '';
          return teacher ? teacher.slice(0, 1) : '';
        },
        courseSlotCount(course) {
          return 1;
        },
        slotIndex(slot) {
          const name = typeof slot === 'string' ? slot : slot.name;
          return this.slots.findIndex((item) => item.name === name);
        },
        eventSlotCount(event) {
          return Math.max(1, event?.slotCount || 1);
        },
        eventStartIndex(event) {
          if (Number.isInteger(event?.startSlotIndex)) return event.startSlotIndex;
          return this.slots.findIndex((slot) => slot.name === event?.slot);
        },
        slotRangeText(startIndex, count) {
          const endIndex = Math.min(this.slots.length - 1, startIndex + count - 1);
          return startIndex === endIndex ? this.slots[startIndex].name : `${this.slots[startIndex].name}-${this.slots[endIndex].name}`;
        },
        hasEnoughSlots(slot, course) {
          const startIndex = this.slotIndex(slot.slot || slot);
          return startIndex >= 0 && startIndex + this.courseSlotCount(course) <= this.slots.length;
        },
        eventFor(roomId, slot) {
          if (typeof slot === 'object' && slot.day && slot.slot) {
            return this.events.find(item => item.roomId === roomId && item.week === slot.week && item.day === slot.day && item.slot === slot.slot.name);
          }
          return this.events.find(item => item.roomId === roomId && item.week === this.currentWeek && item.slot === slot && (!item.day || item.day === this.scheduleDay));
        },
        weekEventFor(day, slot) {
          return this.events.find(item => item.week === this.currentWeek && item.day === day && item.slot === slot.name);
        },
        coveredByPreviousDay(day, slot) {
          const index = this.slotIndex(slot);
          return this.events.some((event) => {
            if (event.day !== day) return false;
            const startIndex = this.eventStartIndex(event);
            const endIndex = startIndex + this.eventSlotCount(event) - 1;
            return index > startIndex && index <= endIndex;
          });
        },
        coveredByPrevious(roomId, slot) {
          const index = this.slotIndex(slot.slot || slot);
          const day = slot.day || this.scheduleDay;
          const week = slot.week || this.currentWeek;
          return this.events.some((event) => {
            if (event.roomId !== roomId) return false;
            if (event.week !== week) return false;
            if (event.day && event.day !== day) return false;
            const startIndex = this.eventStartIndex(event);
            const endIndex = startIndex + this.eventSlotCount(event) - 1;
            return index > startIndex && index <= endIndex;
          });
        },
        isPreviewCell(roomId, slot) {
          if (!this.placementPreview || this.placementPreview.roomId !== roomId) return false;
          const index = this.slotIndex(slot.slot || slot);
          if (slot.week && this.placementPreview.week !== slot.week) return false;
          if (slot.day && this.placementPreview.day !== slot.day) return false;
          return index >= this.placementPreview.startIndex && index < this.placementPreview.startIndex + this.placementPreview.slotCount;
        },
        isPreviewWeekCell(day, slot) {
          if (!this.placementPreview || this.placementPreview.day !== day) return false;
          const index = this.slotIndex(slot);
          return index >= this.placementPreview.startIndex && index < this.placementPreview.startIndex + this.placementPreview.slotCount;
        },
        previewPlacement(room, slot) {
          const targetSlot = slot.slot || slot;
          if (!this.hasEnoughSlots(targetSlot, this.selectedCourse)) {
            this.placementPreview = null;
            return;
          }
          this.placementPreview = {
            roomId: room.id,
            week: slot.week || this.currentWeek,
            day: slot.day || this.scheduleDay,
            startIndex: this.slotIndex(targetSlot),
            slotCount: this.courseSlotCount(this.selectedCourse)
          };
        },
        previewWeekPlacement(day, slot) {
          if (!slot.available) {
            this.placementPreview = null;
            return;
          }
          if (!this.hasEnoughSlots(slot, this.selectedCourse)) {
            this.placementPreview = null;
            return;
          }
          this.placementPreview = {
            day,
            startIndex: this.slotIndex(slot),
            slotCount: this.courseSlotCount(this.selectedCourse)
          };
        },
        clearPlacementPreview() {
          this.placementPreview = null;
        },
        fixedRequiredIds(course) {
          return (course.raw.required_equipment_ids || []).filter((id) => {
            const equipment = equipmentById[id];
            return equipment && !equipment.is_movable;
          });
        },
        roomMatchesCourse(room, course) {
          if (course?.isLiveSession) return false;
          if (room.capacity < course.people) return false;
          return this.fixedRequiredIds(course).every((id) => room.raw.fixed_equipment.includes(id));
        },
        recommendedRoomsForCourse(roomList, course) {
          if (course?.isLiveSession) return [];
          const matchedRooms = roomList
            .filter(room => this.roomMatchesCourse(room, course))
            .sort((a, b) => this.roomScore(b, course) - this.roomScore(a, course));
          if (!matchedRooms.length) return [];
          const bestScore = this.roomScore(matchedRooms[0], course);
          return matchedRooms.filter(room => this.roomScore(room, course) >= bestScore - 8);
        },
        roomScore(room, course = this.selectedCourse) {
          if (course?.isLiveSession) return 0;
          let score = 45;
          if (room.capacity >= course.people) score += 18;
          if (course.roomType && room.type === course.roomType) score += 12;
          const fixedRequiredIds = this.fixedRequiredIds(course);
          const fixedMatched = fixedRequiredIds.filter((id) => room.raw.fixed_equipment.includes(id)).length;
          if (!fixedRequiredIds.length || fixedMatched === fixedRequiredIds.length) score += 25;
          else if (fixedMatched > 0) score += 12;
          if (room.recommended) score += 8;
          return Math.min(99, score);
        },
        roomCellState(room, slot) {
          const event = this.eventFor(room.id, slot);
          if (event) return event.type;
          if (this.isPreviewCell(room.id, slot)) return 'preview';
          return this.roomScore(room) >= 90 ? 'best' : '';
        },
        weekCellState(day, slot) {
          const event = this.weekEventFor(day, slot);
          if (event) return event.type;
          if (this.isPreviewWeekCell(day, slot)) return 'preview';
          return slot.available ? 'open-window' : 'closed-window';
        },
        dropCourse(room, slot, day) {
          if (!room) return;
          if (this.selectedCourse.isLiveSession) return;
          if (slot.available === false) return;
          const targetSlot = slot.slot || slot;
          const targetDay = day || slot.day || this.scheduleDay;
          const targetWeek = slot.week || this.currentWeek;
          const isLive = this.selectedCourse.isLiveSession;
          if (!this.hasEnoughSlots(targetSlot, this.selectedCourse)) return;
          clearTimeout(this.scheduleDrawerTimer);
          if (this.pendingEventId) {
            const previousIndex = this.events.findIndex(item => item.id === this.pendingEventId && item.pendingConfirm);
            if (previousIndex >= 0) this.events.splice(previousIndex, 1);
          }
          this.pendingRoom = isLive ? null : room;
          this.pendingSlot = targetSlot;
          this.pendingWeek = targetWeek;
          this.pendingDay = targetDay;
          const startSlotIndex = this.slotIndex(targetSlot);
          const slotCount = this.courseSlotCount(this.selectedCourse);
          this.ruleForm.room = isLive ? [] : [room.name];
          this.ruleForm.teacher = this.selectedTeacherList(this.selectedCourse);
          this.ruleForm.slot = targetSlot.name;
          this.ruleForm.timeMode = targetSlot.name === '固定午间' ? 'fixed' : this.ruleForm.timeMode;
          this.ruleForm.meetingLink = '';
          this.pendingEventId = `pending-${Date.now()}`;
          this.events.push({
            id: this.pendingEventId,
            week: targetWeek,
            roomId: isLive ? '' : room.id,
            day: targetDay,
            slot: targetSlot.name,
            startSlotIndex,
            slotCount,
            title: this.selectedCourse.name,
            desc: isLive ? `${this.scheduleTimeText()} · 直播链接待粘贴` : `${this.scheduleTimeText()} · ${slotCount}段 · 待确认`,
            classLabel: this.classLabelForCourse(this.selectedCourse),
            teacher: this.selectedTeacherText(),
            baseType: this.selectedCourse.baseType,
            baseLabel: this.selectedCourse.baseLabel,
            trainingYear: this.selectedCourse.trainingYear,
            isResidency: this.selectedCourse.isResidency,
            isLiveSession: isLive,
            type: 'new pending',
            pendingConfirm: true
          });
          this.clearPlacementPreview();
          this.scheduleDrawerTimer = setTimeout(() => {
            this.scheduleModal = true;
          }, 300);
        },
        confirmPlace() {
          if (this.selectedCourse.isLiveSession) {
            this.confirmLivePlace();
            return;
          }
          const event = this.events.find(item => item.id === this.pendingEventId);
          if (event) {
            const room = this.rooms.find(item => item.name === this.primaryRoomName()) || this.rooms.find(item => item.id === this.primaryRoomName()) || this.pendingRoom;
            const slot = this.slots.find(item => item.name === this.ruleForm.slot) || this.pendingSlot;
            event.title = this.selectedCourse.name;
            event.roomId = room?.id || event.roomId;
            event.roomIds = this.selectedRooms().map((item) => item.id);
            event.rooms = this.selectedRoomNames();
            event.slot = slot?.name || event.slot;
            event.teacher = this.selectedTeacherText();
            event.desc = `${this.scheduleTimeText()} · ${this.selectedRoomText() || room?.id || '待定'} · ${this.selectedTeacherText()}`;
            event.meetingLink = '';
            event.type = 'new';
            event.pendingConfirm = false;
          }
          if (this.selectedCourse.parentId) {
            this.selectedCourse.status = 'scheduled';
            this.selectedCourse.scheduledSessions = 1;
            const parent = this.courses.find((course) => course.id === this.selectedCourse.parentId);
            if (parent) {
              parent.scheduledSessions = parent.sessions.filter((session) => session.status === 'scheduled').length;
              if (parent.scheduledSessions >= parent.totalSessions) parent.status = 'scheduled';
              // 同步排课日期记录到父课程，供「已排」下拉行展示
              if (!parent.scheduledDates) parent.scheduledDates = [];
              const confirmedRoom = this.rooms.find((r) => r.name === this.primaryRoomName() || r.id === this.primaryRoomName()) || this.pendingRoom;
              parent.scheduledDates.push({
                index: parent.scheduledSessions,
                date: this.pendingDate,
                day: this.pendingDay,
                week: this.pendingWeek,
                room: this.selectedRoomText() || confirmedRoom?.name || '',
                eventId: this.pendingEventId,
                sessionName: this.selectedCourse.name,
              });
            }
          } else if (this.rescheduleMode) {
            // 改期模式：更新已有排课记录，不增加次数
            const session = this.rescheduleSession;
            if (session) {
              const confirmedRoom = this.rooms.find((r) => r.name === this.primaryRoomName() || r.id === this.primaryRoomName()) || this.pendingRoom;
              const weekNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
              if (this.pendingDate) {
                const d = new Date(this.pendingDate + 'T00:00:00');
                session.date = this.pendingDate;
                session.day = weekNames[d.getDay()];
              }
              session.week = this.pendingWeek;
              session.room = this.selectedRoomText() || confirmedRoom?.name || '';
              // 同步日历事件
              if (session.eventId) {
                const ev = this.events.find((e) => e.id === session.eventId);
                if (ev) {
                  ev.date = this.pendingDate;
                  ev.week = this.pendingWeek;
                  ev.day = session.day;
                  ev.roomId = confirmedRoom?.id || ev.roomId;
                  ev.roomIds = this.selectedRooms().map((item) => item.id);
                  ev.rooms = this.selectedRoomNames();
                  ev.desc = `${this.pendingDate} · ${this.selectedRoomText() || confirmedRoom?.name || '待定'} · ${this.selectedTeacherText()}`;
                }
              }
            }
            this.rescheduleMode = false;
            this.rescheduleItem = null;
            this.rescheduleSession = null;
          } else {
            // 普通课程：每次排课后增加已排次数并记录日期
            this.selectedCourse.scheduledSessions += 1;
            if (!this.selectedCourse.scheduledDates) this.selectedCourse.scheduledDates = [];
            const confirmedRoom = this.rooms.find((r) => r.name === this.primaryRoomName() || r.id === this.primaryRoomName()) || this.pendingRoom;
            this.selectedCourse.scheduledDates.push({
              index: this.selectedCourse.scheduledSessions,
              date: this.pendingDate,
              day: this.pendingDay,
              week: this.pendingWeek,
              room: this.selectedRoomText() || confirmedRoom?.name || '',
              eventId: this.pendingEventId
            });
            if (this.selectedCourse.scheduledSessions >= this.selectedCourse.totalSessions) {
              this.selectedCourse.status = 'scheduled';
            } else {
              this.selectedCourse.status = 'pending';
            }
          }
          this.scheduleModal = false;
          this.pendingEventId = '';
          this.pendingRoom = null;
          this.pendingSlot = null;
          this.pendingDate = '';
          this.pendingDay = '';
          this.ruleForm.meetingLink = '';
          this.ruleForm._originalMeetingLink = '';
          this.ruleForm.drawerRecognized = '';
        },
        cancelPlace() {
          clearTimeout(this.scheduleDrawerTimer);
          if (!this.rescheduleMode && this.pendingEventId) {
            const index = this.events.findIndex(item => item.id === this.pendingEventId && item.pendingConfirm);
            if (index >= 0) this.events.splice(index, 1);
          }
          this.rescheduleMode = false;
          this.rescheduleItem = null;
          this.rescheduleSession = null;
          this.pendingEventId = '';
          this.pendingRoom = null;
          this.pendingSlot = null;
          this.pendingDate = '';
          this.pendingDay = '';
          this.ruleForm.meetingLink = '';
          this.ruleForm._originalMeetingLink = '';
          this.ruleForm.drawerRecognized = '';
          this.scheduleModal = false;
          this.draggingEventId = '';
          this.cancelPlacementMode = false;
        },
        openAutoSchedule() {
          this.aiDrawerVisible = true;
          this.aiDrawerStep = 'rules';
          this.customRuleEnabled = true;
          this.customRuleText = '';
        },
        runAiScheduling() {
          this.aiDrawerStep = 'running';
          this.startAutoSchedule();
        },
        saveRulesAndNotify() {
          this.$nextTick(() => {
            window.ArcoVue?.Message?.success('排课规则与自定义约束已保存');
          });
        },
        openYearPreview() {
          if (!this.selectedAiPlanId) this.selectedAiPlanId = 'plan-1';
          this.aiCalendarMode = 'year';
          this.aiPreviewVisible = true;
        },
        startAutoSchedule() {
          this.aiIndex = 0;
          this.aiShowResult = false;
          this.selectedAiPlanId = 'plan-1';
          this.autoPlanAppliedMessage = '';
          this.aiCalendarMode = 'month';
          this.aiCalMonthOffset = 0;
          clearInterval(this.aiTimer);
          clearTimeout(this.aiResultTimer);
          this.aiTimer = setInterval(() => {
            this.aiIndex += 1;
            if (this.aiIndex >= this.aiSteps.length) {
              this.aiIndex = this.aiSteps.length;
              clearInterval(this.aiTimer);
              this.aiTimer = null;
              this.aiResultTimer = setTimeout(() => {
                this.aiShowResult = true;
                this.aiDrawerStep = 'result';
              }, 500);
            }
          }, 850);
        },
        selectAiPlan(plan) {
          this.selectedAiPlanId = plan.id;
          this.autoPlanAppliedMessage = '';
          this.aiCalMonthOffset = 0;
        },
        aiCalPrevMonth() { this.aiCalMonthOffset--; },
        aiCalNextMonth() { this.aiCalMonthOffset++; },
        applyAiPlan() {
          const plan = this.selectedAiPlan;
          if (!plan) return;
          if (!plan.applicable) {
            window.ArcoVue?.Message?.warning(plan.applicabilityLabel);
            return;
          }
          const batchId = `ai-draft-${Date.now()}`;
          this.events = this.events.filter((event) => !event.aiPlanId);
          const aiEvents = plan.schedule.map((row, index) => this.scheduleRowToEvent(row, plan, index, batchId)).filter(Boolean);
          this.events.push(...aiEvents);
          const firstWeek = aiEvents[0]?.week || this.currentWeek;
          this.currentWeek = firstWeek;
          this.lastAiDraftBatch = {
            id: batchId,
            planName: plan.name,
            draftCount: aiEvents.length,
            affectedTeachers: plan.impact.teachers,
            affectedRooms: plan.impact.rooms,
            nextRole: '授课教师',
            nextAction: '确认、拒绝或反馈时间冲突',
            eventIds: aiEvents.map((event) => event.id)
          };
          this.aiDrawerVisible = false;
          this.autoPlanAppliedMessage = `已生成 ${aiEvents.length} 个待教师确认课次草案。`;
          window.ArcoVue?.Message?.success(`已生成 ${aiEvents.length} 个待教师确认课次草案，尚未发布正式课表`);
          this.$nextTick(() => this.jumpWeek(firstWeek));
        },
        undoAiDraft() {
          if (!this.lastAiDraftBatch) return;
          const eventIds = new Set(this.lastAiDraftBatch.eventIds || []);
          this.events = this.events.filter((event) => !eventIds.has(event.id));
          this.autoPlanAppliedMessage = `已撤销 ${this.lastAiDraftBatch.planName} 的待确认草案。`;
          this.lastAiDraftBatch = null;
          window.ArcoVue?.Message?.info('已撤销待教师确认课次草案');
        },
        scheduleRowToEvent(row, plan, index, batchId) {
          const room = this.rooms.find((item) => item.id === row.room || item.name === row.room) || this.rooms[index % this.rooms.length];
          const day = row.weekday.startsWith('周') ? row.weekday : `周${row.weekday}`;
          const slot = this.slots.find((item) => item.time === row.time) || this.slots[index % this.slots.length];
          if (!room || !slot) return null;
          return {
            id: `ai-${plan.id}-${row.id}`,
            aiPlanId: plan.id,
            draftBatchId: batchId,
            confirmationStatus: 'pending-teacher',
            pendingConfirm: true,
            date: this.dateFromWeekDay(row.week, row.weekday),
            week: row.week,
            roomId: room.id,
            day,
            slot: slot.name,
            startSlotIndex: this.slotIndex(slot),
            slotCount: 1,
            title: row.course,
            desc: `${row.time} · 待教师确认 · ${row.note}`,
            classLabel: row.classLabel || row.target,
            teacher: row.teacher,
            type: row.tone === 'warning' ? 'room' : 'new',
            baseType: row.baseType || 'general',
            baseLabel: row.baseLabel || '通识',
            trainingYear: row.trainingYear || 1,
            isResidency: true
          };
        },
        toggleWorkbenchFullscreen() {
          this.isWorkbenchFullscreen = !this.isWorkbenchFullscreen;
        },

        // ── 排课规则 ──────────────────────────────────────
        openRulesModal() {
          this.rulesModal = true;
        },
        movePriority(index, direction) {
          const list = this.schedulingRules.priorities;
          const target = index + direction;
          if (target < 0 || target >= list.length) return;
          const tmp = list.splice(index, 1)[0];
          list.splice(target, 0, tmp);
          list.forEach((item, i) => { item.order = i + 1; });
        },
        saveRules() {
          this.rulesModal = false;
          this.$nextTick(() => {
            window.ArcoVue?.Message?.success('排课规则已保存');
          });
        },
        resetRules() {
          const r = this.schedulingRules;
          r.priorities.forEach((p, i) => { p.enabled = true; p.order = i + 1; });
          // 按默认顺序还原
          const defaultOrder = ['p-teacher', 'p-resource', 'p-remaining'];
          r.priorities.sort((a, b) => defaultOrder.indexOf(a.id) - defaultOrder.indexOf(b.id));
          r.priorities.forEach((p, i) => { p.order = i + 1; });
          r.timeRules.forEach((rule) => { rule.enabled = true; });
          const g3 = r.timeRules.find((rule) => rule.id === 't-grade3');
          if (g3) { g3.params.monthStart = 7; g3.params.monthEnd = 12; }
          const bd = r.timeRules.find((rule) => rule.id === 't-boundary');
          if (bd) { bd.params.days = 3; }
          r.limits.forEach((rule) => { rule.enabled = true; });
          const ml = r.limits.find((rule) => rule.id === 'l-monthly');
          if (ml) { ml.params.max = 2; }
          const ts = r.limits.find((rule) => rule.id === 'l-timeslot');
          if (ts) { ts.params.start = '12:30'; ts.params.end = '13:30'; }
        },
        ruleTimeOpts() {
          const opts = [];
          for (let h = 7; h <= 21; h++) {
            opts.push(`${String(h).padStart(2, '0')}:00`);
            opts.push(`${String(h).padStart(2, '0')}:30`);
          }
          return opts;
        },
      },
      beforeUnmount() {
        clearInterval(this.aiTimer);
        clearTimeout(this.aiResultTimer);
        if (this.teacherConfirmationStorageHandler) {
          window.removeEventListener('storage', this.teacherConfirmationStorageHandler);
        }
      },
      mounted() {
        this.teacherConfirmationStorageHandler = (event) => {
          if (!event || event.key === window.TeachingBusiness?.teacherConfirmationStorageKey) {
            this.refreshPilotTeacherConfirmation();
          }
        };
        window.addEventListener('storage', this.teacherConfirmationStorageHandler);
        this.$nextTick(() => this.jumpWeek(this.currentWeek));
      }
    });

    app.use(window.ArcoVue);
    if (document.getElementById('scheduler-visual-app')) {
      app.mount('#scheduler-visual-app');
    }

}());
