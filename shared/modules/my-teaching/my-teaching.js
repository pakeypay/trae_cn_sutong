(function () {
  var app;
  function active() { return document.body.dataset.role === 'teacher' && document.body.dataset.active === '我的授课'; }
  function render() {
    var root = document.querySelector('.content');
    if (!root || !active()) return;
    if (app) try { app.unmount(); } catch (e) {}
    root.innerHTML = '<div id="my-teaching-app"></div>';
    app = Vue.createApp({
      template: `
        <div class="mt-page">
          <a-breadcrumb v-if="view==='list'" class="mt-breadcrumb"><a-breadcrumb-item>首页</a-breadcrumb-item><a-breadcrumb-item>我的教学</a-breadcrumb-item><a-breadcrumb-item>我的授课</a-breadcrumb-item></a-breadcrumb>
          <template v-if="view==='list'">
            <main class="mt-shell">
              <a-tabs v-model:active-key="status" class="mt-global-tabs">
                <a-tab-pane key="upcoming" title="待开课"></a-tab-pane><a-tab-pane key="ongoing" title="进行中"></a-tab-pane><a-tab-pane key="ended" title="已结课"></a-tab-pane>
              </a-tabs>
              <div class="mt-toolbar">
                <div class="mt-scopes"><button v-for="x in scopes" :key="x.key" :class="['mt-scope',{active:scope===x.key}]" @click="scope=x.key">{{x.label}}</button>
                  <a-popover trigger="click" position="br"><button class="mt-scope">更多筛选⌄</button><template #content><div class="mt-more"><label>课程类型</label><a-select v-model="type" :options="types"/><label>授课对象</label><a-select v-model="audience" :options="audiences"/></div></template></a-popover>
                </div>
                <a-input-search v-model="query" allow-clear placeholder="搜索课程名称、对象或地点" class="mt-search"/>
              </div>
              <section v-for="group in groups" :key="group.title" v-show="group.items.length" class="mt-group">
                <header class="mt-group-header"><h2>{{group.title}}</h2><span>{{group.items.length}} 门课程</span></header>
                <div class="mt-grid">
                  <article v-for="c in group.items" :key="c.id" class="mt-course-card" @click="open(c)">
                    <div class="mt-cover">
                      <img :src="cover" alt="">
                      <div class="mt-cover-shade"></div>
                      <div class="mt-cover-badges"><span :class="['mt-cover-badge',statusClass(c.status)]">{{statusName(c.status)}}</span><span v-if="c.focus" class="mt-cover-badge focus">本月重点</span><span v-if="c.special" class="mt-cover-badge special">专项课程</span></div>
                      <span class="mt-cover-role">{{c.role}}</span>
                    </div>
                    <div class="mt-card-body">
                      <div class="mt-card-kicker">{{c.type}} · {{c.audienceType}}</div><h3>{{c.name}}</h3>
                      <div class="mt-card-facts"><p><b>时间</b>{{c.time}}</p><p><b>地点</b>{{c.place}}</p><p><b>对象</b>{{c.audience}}</p></div>
                      <div class="mt-next"><span></span><p>{{c.tip}}</p></div>
                    </div>
                    <footer><span>{{c.status==='ongoing'?'课堂进行中':c.status==='upcoming'?'查看课前安排':'查看课程回顾'}}</span><a-button :type="c.status==='ongoing'?'primary':'outline'" @click.stop="open(c)">{{c.status==='ongoing'?'进入课程':'查看详情'}}</a-button></footer>
                  </article>
                </div>
              </section>
              <div v-if="!filtered.length" class="mt-empty">当前筛选下暂无课程</div>
            </main>
          </template>
          <template v-else>
            <main class="mt-detail-shell">
              <div class="mt-detail-toolbar">
                <div class="mt-detail-toolbar-left">
                  <button class="mt-back" @click="view='list'">返回</button>
                  <strong>{{selected.name}}</strong>
                </div>
              </div>
              <div class="mt-detail-layout">
                <section class="mt-detail-main">
                  <section class="mt-hero">
                    <div class="mt-hero-cover"><img :src="cover" alt=""><span :class="['mt-cover-badge',statusClass(selected.status)]">{{statusName(selected.status)}}</span></div>
                    <div class="mt-hero-info"><div class="mt-card-kicker">{{selected.type}} · {{selected.audienceType}} · {{selected.role}}</div><h1>{{selected.name}}</h1><p class="mt-hero-desc">以真实临床情境为基础，通过规范示教、分组练习和即时反馈完成教学。</p>
                      <div class="mt-hero-facts"><span><b>授课时间</b>{{selected.time}}</span><span><b>地点 / 平台</b>{{selected.place}}</span><span><b>授课对象</b>{{selected.audience}}</span></div>
                      <div class="mt-actions"><a-button v-for="x in actions(selected.status)" :key="x" :type="x===primary(selected.status)?'primary':'outline'" @click="toast(x)">{{x}}</a-button></div>
                    </div>
                  </section>
                  <a-tabs v-model:active-key="detailTab" class="mt-global-tabs mt-detail-tabs"><a-tab-pane key="info" title="课程详情"/><a-tab-pane key="schedule" title="课程安排"/><a-tab-pane key="discussion" title="讨论区"/><a-tab-pane key="learning" title="学情分析"/><a-tab-pane key="teaching" title="教情分析"/></a-tabs>
                  <section class="mt-detail-content">
                    <course-info v-if="detailTab==='info'" :course="selected"/><course-schedule v-if="detailTab==='schedule'"/><discussion v-if="detailTab==='discussion'"/><course-review v-if="detailTab==='learning'" :status="selected.status"/><teaching-analysis v-if="detailTab==='teaching'" :status="selected.status"/>
                  </section>
                </section>
                <aside class="mt-task-card"><section class="mt-prep-section"><div class="mt-panel-heading"><small>课前准备</small><h2>授课准备情况</h2></div><button class="mt-prep-entry" @click="toast('人员和物资准备')"><span class="mt-prep-icon">人</span><div><b>人员和物资准备</b><small>教师 6人 · 协调员 1人 · 6类物资</small></div><i>›</i></button><button class="mt-prep-entry" @click="toast('课前信')"><span class="mt-prep-icon letter">信</span><div><b>课前信</b><small>已发布 · 含3个附件</small></div><i>›</i></button></section><section class="mt-progress-section"><div class="mt-task-title"><span class="mt-status-dot ongoing"></span><div><small>当前任务 / 进度</small><h2>{{pendingTaskCount}} 项待处理</h2></div></div><p class="mt-task-rule">任务根据课程安排自动生成：实践类任务需评价，理论测验由系统自动评分。</p><div class="mt-teacher-tasks"><div v-for="x in teacherTasks" :key="x.name" :class="['mt-teacher-task',{disabled:x.disabled}]"><span class="mt-task-icon">◎</span><div><b>{{x.name}}</b><span>{{x.meta}}</span></div><span :class="['mt-task-state',{pending:!x.disabled}]">{{x.disabled?'未开放':'待处理'}}</span><a-button size="mini" type="outline" :disabled="x.disabled" @click="toast(x.action)">{{x.action}}</a-button></div></div></section></aside>
              </div>
            </main>
          </template>
        </div>`,
      data: function () { return { view:'list',status:'ongoing',scope:'all',query:'',type:'全部',audience:'全部',selected:null,detailTab:'info',cover:'../anesthesilogy.jpg',scopes:[{key:'all',label:'全部课程'},{key:'normal',label:'我的课程'},{key:'special',label:'专项课程'}],types:['全部','临床技术性技能课程','临床非技术性技能课程','情境模拟课程','通识课程'],audiences:['全部','住培教育','专培教育','护理教育','师资培训'],courses:[
        {id:1,name:'儿童导尿术（男性）',type:'临床技术性技能课程',audienceType:'住培教育',role:'课程负责人',time:'今天 14:00 — 17:00',place:'410 多功能教室',audience:'2026级住培医师 · 6人',status:'ongoing',month:true,focus:true,tip:'确认技能站物资与导师分工，进入课堂签到。'},
        {id:6,name:'儿童气道管理与插管',type:'临床技术性技能课程',audienceType:'住培教育',role:'参与授课',time:'今天 09:00 — 12:00',place:'技能中心 308',audience:'2025级住培医师 · 18人',status:'ongoing',month:true,tip:'技能考核进行中，2项导师评价待完成。'},
        {id:7,name:'儿科急救团队协作模拟',type:'情境模拟课程',audienceType:'专培教育',role:'课程负责人',time:'今天 13:30 — 16:30',place:'模拟病房',audience:'专培一年级 · 12人',status:'ongoing',month:true,focus:true,tip:'情境二进行中，课后复盘将在16:10开始。'},
        {id:8,name:'新生儿复苏技能训练',type:'临床技术性技能课程',audienceType:'护理教育',role:'参与授课',time:'06月13日 — 06月15日',place:'临床技能中心 210',audience:'护理骨干 · 20人',status:'ongoing',month:true,tip:'第一阶段已完成，明日继续开展分组训练。'},
        {id:9,name:'儿科临床沟通工作坊',type:'临床非技术性技能课程',audienceType:'住培教育',role:'参与授课',time:'06月10日 — 06月18日',place:'PBL 教室 3',audience:'住培医师 · 16人',status:'ongoing',month:true,tip:'角色扮演记录待点评，讨论区有3条新留言。'},
        {id:2,name:'坏消息告知',type:'临床非技术性技能课程',audienceType:'住培教育',role:'参与授课',time:'06月20日 14:00 — 16:00',place:'PBL 教室',audience:'2026级住培医师 · 24人',status:'upcoming',month:true,tip:'课前沟通案例与学习单已开放。'},
        {id:3,name:'儿童静脉输液实训',type:'临床技术性技能课程',audienceType:'护理教育',role:'课程负责人',time:'06月28日 09:00 — 11:30',place:'临床技能中心 302',audience:'护理实习生 · 32人',status:'upcoming',month:true,focus:true,tip:'物资准备待确认，课前信已发布。'},
        {id:4,name:'梗阻性休克的识别与处理',type:'情境模拟课程',audienceType:'专培教育',role:'参与授课',time:'03月01日 — 04月12日',place:'模拟病房',audience:'专培一年级 · 18人',status:'ended',month:false,tip:'复盘报告已生成，可查看学员表现。'},
        {id:5,name:'中国儿童医学模拟导师通识课程项目',type:'通识课程',audienceType:'师资培训',role:'专项课程负责人',time:'05月01日 — 06月01日',place:'线上直播 / 技能中心',audience:'本院医生 · 80人',status:'ended',month:false,special:true,tip:'11/11 课次已完成，可查看整体复盘。'}]}; },
      computed:{filtered:function(){var q=this.query.trim();return this.courses.filter(c=>c.status===this.status&&(this.scope==='all'||(this.scope==='special')===!!c.special)&&(this.type==='全部'||c.type===this.type)&&(this.audience==='全部'||c.audienceType===this.audience)&&(!q||[c.name,c.place,c.audience].join(' ').includes(q)))},groups:function(){return[{title:'本月授课',items:this.filtered.filter(c=>c.month)},{title:'其他课程',items:this.filtered.filter(c=>!c.month)}]},teacherTasks:function(){return[{name:'技能站一：操作前准备',meta:'课中阶段 · 模块4：技能站练习（Practice） · 核查表',action:'开始评价'},{name:'技能站二：清洁消毒局麻',meta:'课中阶段 · 模块4：技能站练习（Practice） · 导师评价表',action:'开始评价'},{name:'技能站三：插入导尿管',meta:'课中阶段 · 模块4：技能站练习（Practice） · 导师评价表',action:'开始评价'},{name:'技能站四：固定与术后护理',meta:'课中阶段 · 模块4：技能站练习（Practice） · 导师评价表',action:'开始评价'},{name:'随堂考核：案例导尿术操作',meta:'课中阶段 · 模块5：考核及反馈（Prove） · OSCE评分表',action:'开始评价',disabled:true},{name:'随堂技能考核',meta:'课中阶段 · 模块5：考核及反馈（Prove） · 课堂后段',action:'开始评价',disabled:true},{name:'临床观察记录',meta:'课后阶段 · 模块6：课后延伸（Do） · 截止：课后开放',action:'批阅',disabled:true}]},pendingTaskCount:function(){return this.teacherTasks.filter(function(x){return !x.disabled}).length}},
      methods:{open:function(c){this.selected=c;this.detailTab=c.status==='ended'?'review':'info';this.view='detail'},statusName:s=>({upcoming:'待开课',ongoing:'进行中',ended:'已结课'})[s],statusClass:s=>'status-'+s,primary:s=>({upcoming:'课前准备',ongoing:'发起签到',ended:'查看评价'})[s],actions:s=>({upcoming:['课前准备','学员名单','发布通知'],ongoing:['发起签到','学员名单','发布通知','发起评价'],ended:['查看评价','导出记录','课程证书']})[s],taskTitle:s=>({upcoming:'准备下一次授课',ongoing:'处理当前课堂',ended:'查看课后成果'})[s],tasks:s=>({upcoming:['人员与物资待确认','课前资料已开放','课前信已发送'],ongoing:['签到状态：5/6','课堂评价待发起','当前无异常事项'],ended:['复盘报告已生成','评价已完成','课程记录可导出']})[s],toast:function(x){ArcoVue.Message.success(x+'操作已打开')}}});
    app.component('course-info',{props:['course'],template:`<div><h2 class="mt-section-title">课程介绍</h2><p class="mt-copy">本课程采用真实临床情境与标准化操作流程，帮助学员完成从理论理解到规范操作的能力迁移。</p><div class="mt-info-list"><div><span>课程类型</span><b>{{course.type}}</b></div><div><span>课程来源</span><b>原创课程</b></div><div><span>课程负责人</span><b>张盛鑫</b></div><div><span>开发团队</span><b>儿科模拟中心教学组</b></div></div><h2 class="mt-section-title">学习目标</h2><div class="mt-goals"><div><b>知识</b><p>掌握适应症、禁忌症与操作规范</p></div><div><b>技能</b><p>独立完成标准化临床操作</p></div><div><b>态度</b><p>建立患者安全与团队协作意识</p></div></div></div>`});
    app.component('course-schedule',{data:function(){return{phases:[{name:'课前',content:'完成操作视频、学员手册与课前测学习。',resources:['操作示范视频','学员手册.pdf'],assessments:[],exams:['课前知识测验']},{name:'课中',content:'规范示教后开展分组技能站练习与即时反馈。',resources:['授课课件','技能操作流程卡'],assessments:['四站导师评价表'],exams:['随堂技能考核']},{name:'课后',content:'完成课程评价、临床观察记录与反思反馈。',resources:['课程回放','延伸阅读'],assessments:['课程满意度评价'],exams:['临床观察记录批阅']}]}},template:`<div class="mt-timeline"><section v-for="(p,i) in phases" :key="p.name" class="mt-phase"><div class="mt-phase-marker"><span>{{i+1}}</span><i></i></div><div class="mt-phase-content"><h2>{{p.name}}</h2><p>{{p.content}}</p><div class="mt-phase-secondary"><div><b>课程资源</b><span v-for="x in p.resources" :key="x">{{x}}</span></div><div><b>评价工具</b><span v-for="x in p.assessments" :key="x">{{x}}</span><em v-if="!p.assessments.length">暂无</em></div><div><b>考核 / 测验</b><span v-for="x in p.exams" :key="x">{{x}}</span></div></div></div></section></div>`});
    app.component('discussion',{data:function(){return{message:''}},template:`<div><div class="mt-message-compose"><a-textarea v-model="message" placeholder="分享课程问题、教学观察或复盘建议…"/><a-button type="primary">发布留言</a-button></div><div class="mt-message"><b>刘国强</b><span>今天 13:42</span><p>技能站三的操作流程卡已更新，请各位导师使用最新版本。</p></div><div class="mt-message"><b>张盛鑫</b><span>昨天 18:10</span><p>建议课后复盘重点关注无菌操作和沟通解释两个环节。</p></div></div>`});
    app.component('course-review',{props:['status'],template:`<div><div v-if="status==='upcoming'" class="mt-history-note">当前课程尚未开课，以下展示同课程历史学情数据作为备课参考。</div><div class="mt-review"><div><b>18/20</b><span>签到均值</span></div><div><b>87%</b><span>课前测完成</span></div><div><b>92%</b><span>学习完成率</span></div><div><b>86</b><span>平均考核成绩</span></div></div><h2 class="mt-section-title">学员表现摘要</h2><p class="mt-copy">多数学员能够完成规范流程，薄弱环节集中在无菌操作细节和术前沟通解释。</p></div>`});
    app.component('teaching-analysis',{props:['status'],template:`<div><div v-if="status==='upcoming'" class="mt-history-note">当前课程尚未开课，以下展示同课程历史教情反馈作为备课参考。</div><div class="mt-review"><div><b>4.9</b><span>整体满意度</span></div><div><b>4.8</b><span>教学内容</span></div><div><b>4.7</b><span>教学组织</span></div><div><b>96%</b><span>推荐意愿</span></div></div><h2 class="mt-section-title">高频反馈</h2><div class="mt-feedback"><span>即时反馈清晰 <b>18人提及</b></span><span>希望增加练习时间 <b>7人提及</b></span><span>操作流程实用 <b>15人提及</b></span><span>课前资料有帮助 <b>13人提及</b></span></div></div>`});
    app.use(ArcoVue); app.mount('#my-teaching-app');
  }
  function boot(){render();new MutationObserver(render).observe(document.body,{attributes:true,attributeFilter:['data-active']})}
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',boot):boot();
}());
