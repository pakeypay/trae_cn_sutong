(function () {
  // Rooms / spaces
  var ROOMS = [
    { id: 'r301', name: '301 普通教室', floor: 'f3', floorLabel: '三楼', type: '普通教室', capacity: 30, desc: '标准多媒体教室，适合小班授课', equipment: ['投影', '音响', '黑板'], status: 'open', openForBook: true },
    { id: 'r302', name: '302 PBL教室', floor: 'f3', floorLabel: '三楼', type: 'PBL教室', capacity: 15, desc: '小组讨论式教室，圆形桌椅布局', equipment: ['投影', '白板'], status: 'open', openForBook: true },
    { id: 'r305', name: '305 阶梯教室', floor: 'f3', floorLabel: '三楼', type: '阶梯教室', capacity: 200, desc: '大型阶梯教室，适合讲座、动员大会', equipment: ['投影', '音响', '录播'], status: 'open', openForBook: true },
    { id: 'r401', name: '401 模拟病房', floor: 'f4', floorLabel: '四楼', type: '模拟病房', capacity: 20, desc: '模拟病房环境，适合病例示教、床旁演示', equipment: ['模拟病床', '心电监护', '投影'], status: 'open', openForBook: true },
    { id: 'r402', name: '402 模拟病房', floor: 'f4', floorLabel: '四楼', type: '模拟病房', capacity: 20, desc: '模拟病房环境，配置与401相同', equipment: ['模拟病床', '心电监护', '投影'], status: 'open', openForBook: true },
    { id: 'r410', name: '410 多功能教室', floor: 'f4', floorLabel: '四楼', type: '多功能教室', capacity: 40, desc: '多功能培训教室，移动桌椅可灵活布局', equipment: ['投影', '音响', '移动桌椅', '录播'], status: 'open', openForBook: true },
    { id: 'r415', name: '415 模拟手术室', floor: 'f4', floorLabel: '四楼', type: '模拟手术室', capacity: 30, desc: '高仿真模拟手术室，配备全套手术设备', equipment: ['手术灯', '麻醉机', '监护仪', '手术器械'], status: 'open', openForBook: true },
    { id: 'r420', name: '420 腔镜实训室', floor: 'f4', floorLabel: '四楼', type: '腔镜实训室', capacity: 16, desc: '腔镜技能训练室，配备模拟箱和VR系统', equipment: ['腔镜模拟箱', 'VR系统', '显示器'], status: 'open', openForBook: false },
    { id: 'r421', name: '虚拟仿真实验室', floor: 'f4', floorLabel: '四楼', type: '虚拟仿真室', capacity: 10, desc: 'VR/AR虚拟仿真教学实验室', equipment: ['VR头显', 'AR设备', '触控大屏'], status: 'maintenance', openForBook: false },
    { id: 'r422', name: '422 录播教室', floor: 'f4', floorLabel: '四楼', type: '录播教室', capacity: 40, desc: '专业录播教室，支持课程录制和直播', equipment: ['录播系统', '提词器', '导播台'], status: 'open', openForBook: true },
    { id: 'r505', name: '505-511 OSCE考站', floor: 'f5', floorLabel: '五楼', type: 'OSCE考站', capacity: 60, desc: '多站式OSCE考核场地，含12个考站', equipment: ['监控系统', '叫号系统', '标准化病人准备间'], status: 'open', openForBook: true },
    { id: 'r517', name: '517 OSCE考站', floor: 'f5', floorLabel: '五楼', type: 'OSCE考站', capacity: 30, desc: '小型OSCE考站，6个考站', equipment: ['监控系统', '叫号系统'], status: 'open', openForBook: true },
    { id: 'fo1', name: '教学门诊', floor: 'fo', floorLabel: '其他', type: '其他', capacity: 10, desc: '教学门诊室，适合一对一示教', equipment: ['检查床', '电脑', '洗手池'], status: 'open', openForBook: true },
    { id: 'fo2', name: '教学病房', floor: 'fo', floorLabel: '其他', type: '其他', capacity: 12, desc: '教学病房，适合床边教学', equipment: ['病床', '监护仪', '教学白板'], status: 'open', openForBook: true }
  ];

  // Material database (equipment, models, consumables)
  var MATERIALS = [
    { id: 'M001', name: '便携式彩色超声诊断仪', category: '设备', sub: '超声设备', code: 'F2004770', returns: true, avail: 'ok' },
    { id: 'M002', name: '除颤监护仪', category: '设备', sub: '急救设备', code: 'MED-20240105', returns: true, avail: 'ok' },
    { id: 'M003', name: '无创呼吸机', category: '设备', sub: '呼吸支持', code: 'VM-2023-001', returns: true, avail: 'confirm' },
    { id: 'M004', name: '高级摄像评估系统', category: '设备', sub: '多媒体设备', code: '20241131', returns: true, avail: 'ok' },
    { id: 'M005', name: '电子听诊器', category: '设备', sub: '诊断设备', code: 'ES-2022-003', returns: true, avail: 'ok' },
    { id: 'M010', name: '儿童CPR模型', category: '模型', sub: '急救/CPR', code: '20140455', returns: true, avail: 'ok' },
    { id: 'M011', name: '高仿真成人模拟人', category: '模型', sub: '综合模拟', code: 'SIM-A-001', returns: true, avail: 'ok' },
    { id: 'M012', name: '腹部触诊训练模型', category: '模型', sub: '体格检查', code: 'ABD-001', returns: true, avail: 'ok' },
    { id: 'M013', name: '心肺听诊模型', category: '模型', sub: '诊断训练', code: 'HRT-001', returns: true, avail: 'confirm' },
    { id: 'M014', name: '新生儿护理模型', category: '模型', sub: '护理操作', code: 'NEO-002', returns: true, avail: 'ok' },
    { id: 'M020', name: '血压计袖带组', category: '耗材', sub: '可重复使用', code: 'BP-CUFF-SET', returns: true, avail: 'ok' },
    { id: 'M021', name: '心电导联线（12导联）', category: '耗材', sub: '可重复使用', code: 'ECG-LEAD-12', returns: true, avail: 'ok' },
    { id: 'M030', name: '一次性检查手套', category: '耗材', sub: '一次性耗材', code: 'GLOVE-M', returns: false, avail: 'ok' },
    { id: 'M031', name: '无菌纱布包', category: '耗材', sub: '一次性耗材', code: 'GAUZE-001', returns: false, avail: 'ok' },
    { id: 'M032', name: '一次性注射器（5ml）', category: '耗材', sub: '一次性耗材', code: 'SYR-5ML', returns: false, avail: 'ok' },
    { id: 'M033', name: '消毒棉签', category: '耗材', sub: '一次性耗材', code: 'COTTON-001', returns: false, avail: 'ok' }
  ];

  window.SpaceData = { ROOMS: ROOMS, MATERIALS: MATERIALS };
}());
