(function () {
  /**
   * 课程开发示范库统一数据源
   * 供 course-dev.js 与 resource-library.js 共同读取，避免重复维护。
   *
   * 数据结构说明：
   *   courses[] 中每条课程包含完整元信息（audience/category/teacher/department）
   *   以及关联资源（lessonPlan/videos/templates）
   *   resource-library.js 通过 getFlatResources() 派生扁平文件列表
   *   course-dev.js 通过 getNestedLibrary() 派生嵌套结构
   *
   * 使用规范：
   *   创建课程时必须使用 deepClone(template) 进行深拷贝
   *   禁止直接修改 window.CourseDemoData 中的对象
   */

  var AUDIENCES = ['学员培训', '师资培训'];

  var CATEGORIES = [
    { id: 'skill', label: '临床技术性技能课程', folderId: 'f-dev-undergrad' },
    { id: 'nonskill', label: '临床非技术性技能课程', folderId: 'f-dev-resident' },
    { id: 'simulation', label: '情境模拟课程', folderId: 'f-dev-fellow' }
  ];

  var COURSES = [
    // === 学员培训 > 临床技术性技能课程 (f-dev-undergrad) ===
    {
      id: 'demo-001',
      audience: '学员培训',
      category: '临床技术性技能课程',
      folderId: 'f-dev-undergrad',
      courseName: '儿童导尿术（男性）',
      teacher: '李文静',
      department: 'NICU',
      addedAt: '2026-01-15',
      lessonPlan: {
        id: 101,
        name: '儿童导尿术（男性）_示范教案.pdf',
        type: 'pdf',
        size: '1.5MB',
        date: '2026-01-15 09:00',
        desc: '规范化技术实操示范教案',
        tags: ['示范教案', '本科生', '技术技能'],
        format: 'PDF',
        perm: '公开',
        uploader: '系统'
      },
      videos: [
        {
          id: 103,
          name: '儿童导尿术（男性）_示范视频.mp4',
          displayName: '儿童导尿术（男性）操作示范录像',
          type: 'video',
          size: '120MB',
          duration: '45',
          date: '2026-01-15 09:00',
          addedAt: '2026-01-15',
          desc: '标准儿童导尿术实操视频',
          tags: ['示范视频', '实操录像'],
          format: 'MP4',
          perm: '公开',
          uploader: '系统',
          published: true
        }
      ],
      templates: [
        {
          id: 102,
          name: '儿童导尿术（男性）_空白模板.docx',
          type: 'doc',
          size: '450KB',
          date: '2026-01-15 09:00',
          desc: '课程开发空白模板',
          tags: ['空白模板', '技术技能'],
          format: 'DOCX',
          perm: '公开',
          uploader: '系统'
        }
      ]
    },
    {
      id: 'demo-002',
      audience: '学员培训',
      category: '临床技术性技能课程',
      folderId: 'f-dev-undergrad',
      courseName: '腰椎穿刺术',
      teacher: '王晓明',
      department: 'PICU',
      addedAt: '2026-02-20',
      lessonPlan: null,
      videos: [
        {
          id: 106,
          name: '腰椎穿刺术_示范视频.mp4',
          displayName: '腰椎穿刺术操作示范录像',
          type: 'video',
          size: '95MB',
          duration: '38',
          date: '2026-02-20 09:00',
          addedAt: '2026-02-20',
          desc: '标准腰椎穿刺术操作视频',
          tags: ['示范视频', '实操录像'],
          format: 'MP4',
          perm: '公开',
          uploader: '系统',
          published: true
        }
      ],
      templates: []
    },
    {
      id: 'demo-003',
      audience: '学员培训',
      category: '临床技术性技能课程',
      folderId: 'f-dev-undergrad',
      courseName: '心肺复苏CPR实操',
      teacher: '张国强',
      department: '急诊科',
      addedAt: '2026-02-10',
      lessonPlan: null,
      videos: [
        {
          id: 104,
          name: '心肺复苏CPR实操要领.mp4',
          displayName: '心肺复苏CPR实操要领',
          type: 'video',
          size: '85MB',
          duration: '30',
          date: '2026-02-10 14:30',
          addedAt: '2026-02-10',
          desc: '心肺复苏胸外按压与人工呼吸标准规范',
          tags: ['心肺复苏', '实操视频'],
          format: 'MP4',
          perm: '公开',
          uploader: '系统',
          published: true
        }
      ],
      templates: []
    },
    {
      id: 'demo-004',
      audience: '学员培训',
      category: '临床技术性技能课程',
      folderId: 'f-dev-undergrad',
      courseName: '无菌伤口换药',
      teacher: '李娜',
      department: '普外科',
      addedAt: '2026-03-01',
      lessonPlan: {
        id: 105,
        name: '无菌伤口换药规范.pdf',
        type: 'pdf',
        size: '2.3MB',
        date: '2026-03-01 10:15',
        desc: '标准化伤口处理与换药步骤',
        tags: ['无菌操作', '规范指南'],
        format: 'PDF',
        perm: '公开',
        uploader: '系统'
      },
      videos: [],
      templates: []
    },

    // === 学员培训 > 临床非技术性技能课程 (f-dev-resident) ===
    {
      id: 'demo-011',
      audience: '学员培训',
      category: '临床非技术性技能课程',
      folderId: 'f-dev-resident',
      courseName: '坏消息告知',
      teacher: '张盛鑫',
      department: 'PICU',
      addedAt: '2026-01-15',
      lessonPlan: {
        id: 111,
        name: '沟通技巧：坏消息告知教案.pdf',
        type: 'pdf',
        size: '1.1MB',
        date: '2026-01-15 09:00',
        desc: '医患沟通与坏消息告知教案',
        tags: ['示范教案', '沟通技巧'],
        format: 'PDF',
        perm: '公开',
        uploader: '系统'
      },
      videos: [
        {
          id: 112,
          name: '坏消息告知_实操演练.mp4',
          displayName: '坏消息告知角色扮演示范录像',
          type: 'video',
          size: '98MB',
          duration: '55',
          date: '2026-01-15 09:00',
          addedAt: '2026-01-15',
          desc: '标准化病人SP情境演练录像',
          tags: ['示范视频', 'SP演练'],
          format: 'MP4',
          perm: '公开',
          uploader: '系统',
          published: true
        }
      ],
      templates: []
    },
    {
      id: 'demo-012',
      audience: '学员培训',
      category: '临床非技术性技能课程',
      folderId: 'f-dev-resident',
      courseName: '儿科接诊沟通艺术',
      teacher: '王丽华',
      department: '儿内科',
      addedAt: '2026-04-12',
      lessonPlan: null,
      videos: [],
      templates: [
        {
          id: 113,
          name: '儿科接诊沟通艺术.pptx',
          type: 'ppt',
          size: '14.2MB',
          date: '2026-04-12 16:00',
          desc: '如何与患儿及家属建立信任关系',
          tags: ['沟通技巧', '医患关系'],
          format: 'PPTX',
          perm: '公开',
          uploader: '系统'
        }
      ]
    },

    // === 学员培训 > 情境模拟课程 (f-dev-fellow) ===
    {
      id: 'demo-021',
      audience: '学员培训',
      category: '情境模拟课程',
      folderId: 'f-dev-fellow',
      courseName: '梗阻性休克的识别与处理',
      teacher: '王晓明',
      department: 'PICU',
      addedAt: '2026-01-15',
      lessonPlan: {
        id: 121,
        name: '梗阻性休克识别与处理_示范教案.pdf',
        type: 'pdf',
        size: '2.1MB',
        date: '2026-01-15 09:00',
        desc: '休克情境模拟教学设计',
        tags: ['示范教案', '情境模拟'],
        format: 'PDF',
        perm: '公开',
        uploader: '系统'
      },
      videos: [
        {
          id: 124,
          name: '梗阻性休克情境模拟示范录像.mp4',
          displayName: '梗阻性休克情境模拟示范录像',
          type: 'video',
          size: '142MB',
          duration: '65',
          date: '2026-05-18 11:20',
          addedAt: '2026-01-15',
          desc: '梗阻性休克多学科联合情境模拟示范',
          tags: ['情境模拟', '休克识别'],
          format: 'MP4',
          perm: '公开',
          uploader: '系统',
          published: true
        }
      ],
      templates: [
        {
          id: 122,
          name: '梗阻性休克的识别与处理_课件.pptx',
          type: 'ppt',
          size: '18.5MB',
          date: '2026-01-15 09:00',
          desc: '情境导入与知识串讲PPT',
          tags: ['课件', '休克识别'],
          format: 'PPTX',
          perm: '公开',
          uploader: '系统'
        }
      ]
    },
    {
      id: 'demo-022',
      audience: '学员培训',
      category: '情境模拟课程',
      folderId: 'f-dev-fellow',
      courseName: '过敏性休克抢救',
      teacher: '陈志强',
      department: '急诊科',
      addedAt: '2026-05-18',
      lessonPlan: null,
      videos: [
        {
          id: 123,
          name: '过敏性休克抢救情境模拟.mp4',
          displayName: '过敏性休克抢救情境模拟',
          type: 'video',
          size: '142MB',
          duration: '50',
          date: '2026-05-18 11:20',
          addedAt: '2026-05-18',
          desc: '多学科联合过敏性休克应急抢救演练视频',
          tags: ['情境模拟', '急救演练'],
          format: 'MP4',
          perm: '公开',
          uploader: '系统',
          published: true
        }
      ],
      templates: []
    }

    // 师资培训 暂无示范课程（保持与原数据一致）
  ];

  /**
   * 深拷贝工具（避免外部修改公共模板对象）
   */
  function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) {
      return obj.map(function (item) { return deepClone(item); });
    }
    var result = {};
    Object.keys(obj).forEach(function (key) {
      result[key] = deepClone(obj[key]);
    });
    return result;
  }

  /**
   * 派生嵌套结构（供 course-dev.js demoLibrary 使用）
   * 返回结构与原 demoLibrary 一致：
   *   [{ audience, tabs: [{ label, lessons: [{courseName, teacher, dept, addedAt, video}], videos: [{name, duration, addedAt}] }] }]
   */
  function getNestedLibrary() {
    return AUDIENCES.map(function (audience) {
      return {
        audience: audience,
        tabs: CATEGORIES.map(function (cat) {
          var matched = COURSES.filter(function (c) {
            return c.audience === audience && c.category === cat.label;
          });
          var lessons = matched.map(function (c) {
            var firstVideo = c.videos[0];
            return {
              courseName: c.courseName,
              teacher: c.teacher,
              dept: c.department,
              addedAt: c.addedAt,
              video: firstVideo
                ? { name: firstVideo.displayName, duration: firstVideo.duration }
                : null
            };
          });
          var videos = [];
          matched.forEach(function (c) {
            c.videos.forEach(function (v) {
              videos.push({ name: v.displayName, duration: v.duration, addedAt: v.addedAt });
            });
          });
          return { label: cat.label, lessons: lessons, videos: videos };
        })
      };
    });
  }

  /**
   * 派生扁平资源列表（供 resource-library.js resources 使用）
   * 返回结构与原 resources 中 hospital-dev 子项一致：
   *   [{ id, name, type, category:'hospital-dev', parentFolder, size, date, desc, tags, format, perm, uploader, published? }]
   */
  function getFlatResources() {
    var flat = [];
    COURSES.forEach(function (c) {
      if (c.lessonPlan) {
        flat.push(buildFlatFile(c.lessonPlan, c.folderId));
      }
      c.videos.forEach(function (v) {
        flat.push(buildFlatFile(v, c.folderId));
      });
      c.templates.forEach(function (t) {
        flat.push(buildFlatFile(t, c.folderId));
      });
    });
    return flat;
  }

  function buildFlatFile(src, parentFolder) {
    var file = {
      id: src.id,
      name: src.name,
      type: src.type,
      category: 'hospital-dev',
      parentFolder: parentFolder,
      size: src.size,
      date: src.date,
      desc: src.desc,
      tags: src.tags,
      format: src.format,
      perm: src.perm || '公开',
      uploader: src.uploader || '系统'
    };
    if (src.published) file.published = true;
    return file;
  }

  window.CourseDemoData = {
    audiences: AUDIENCES,
    categories: CATEGORIES,
    courses: COURSES,
    getNestedLibrary: getNestedLibrary,
    getFlatResources: getFlatResources,
    deepClone: deepClone
  };
}());
