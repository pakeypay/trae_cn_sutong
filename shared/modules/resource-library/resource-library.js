(function () {
  const script = document.querySelector('script[src*="resource-library.js"]');
  const basePath = script ? script.src.substring(0, script.src.lastIndexOf('/') + 1) : '../../shared/modules/resource-library/';

  // 1. 动态载入 CSS 文件
  function loadCSS() {
    if (document.getElementById('rl-module-css')) return;
    var link = document.createElement('link');
    link.id = 'rl-module-css';
    link.rel = 'stylesheet';
    link.href = basePath + 'resource-library.css';
    document.head.appendChild(link);
  }
  loadCSS();

  const handledPages = ['教学资源库'];
  var vueApp = null;
  const mountId = 'rl-vue-mount';

  function renderPage() {
    var main = document.querySelector('.main');
    if (!main || handledPages.indexOf(document.body.dataset.active) === -1) {
      return;
    }

    if (vueApp) {
      vueApp.unmount();
      vueApp = null;
    }

    // 预留 Vue 挂载容器
    main.innerHTML = '<div id="' + mountId + '" style="width:100%;height:100%;"></div>';

    // 2. Vue 3 App 实例定义
    vueApp = Vue.createApp({
      template: `
        <div class="resource-library-page">
          <!-- 1. 左侧 Quark 网盘风格侧边栏 -->
          <aside class="sidebar-nested">
            <!-- 网盘分类目录 -->
            <div class="menu-section-title" style="margin-top: 0;">资源类型</div>
            <div class="menu-item-nested" :class="{active: activeCategory === 'all'}" @click="selectCategory('all')">
              <icon-folder-open /> 全部文件
            </div>
            
            <!-- 如果是超级管理员，显示院级公共资源 -->
            <template v-if="isAdmin">
              <div class="menu-item-nested" :class="{active: activeCategory === 'hospital'}" @click="selectCategory('hospital')">
                <icon-home style="color: #1677ff;" /> 院级公共资源
              </div>
            </template>
            
            <!-- 如果是授课老师助教，独立显示两个只读库 -->
            <template v-else>
              <div class="menu-item-nested" :class="{active: activeCategory === 'hospital-dev'}" @click="selectCategory('hospital-dev')">
                <icon-book style="color: #1677ff;" /> 课程开发示范库
              </div>
              <div class="menu-item-nested" :class="{active: activeCategory === 'hospital-equip'}" @click="selectCategory('hospital-equip')">
                <icon-desktop style="color: #52c41a;" /> 教学设备使用教程库
              </div>
            </template>

            <div class="menu-item-nested" :class="{active: activeCategory === 'dept'}" @click="selectCategory('dept')">
              <icon-apps style="color: #fa8c16;" /> 科室资源库 (PICU)
            </div>
            <div class="menu-item-nested" :class="{active: activeCategory === 'personal'}" @click="selectCategory('personal')">
              <icon-user style="color: #fa541c;" /> 个人资料库
            </div>

            <!-- 快捷格式筛选 -->
            <div class="menu-section-title">快捷文件筛选</div>
            <div class="menu-item-nested" :class="{active: formatFilter === 'video'}" @click="toggleFormatFilter('video')">
              <icon-play-circle-fill style="color: #ff4d4f;" /> 视频
            </div>
            <div class="menu-item-nested" :class="{active: formatFilter === 'doc'}" @click="toggleFormatFilter('doc')">
              <icon-file style="color: #1890ff;" /> 文档
            </div>
            <div class="menu-item-nested" :class="{active: formatFilter === 'image'}" @click="toggleFormatFilter('image')">
              <icon-image style="color: #52c41a;" /> 图片
            </div>
          </aside>

          <!-- 2. 右侧主内容区 -->
          <main class="main-content-nested">
            <!-- 顶部操作栏 -->
            <div class="top-action-bar" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
              <div class="action-left" style="display: flex; align-items: center; gap: 12px;" v-if="!isReadOnlyView">
                <button class="btn-quark-primary" @click="handleUploadClick">
                  <icon-plus /> 上传文件
                </button>
                <button class="btn-quark-secondary" @click="handleNewFolderClick">
                  <icon-folder-add /> 新建文件夹
                </button>
                <button class="btn-quark-secondary" v-if="isAdmin && activeCategory === 'hospital' && currentPath.length === 0" @click="openEditFramework">
                  <icon-branches /> 分类框架
                </button>
              </div>
              <div class="action-left" style="display: flex; align-items: center; gap: 12px;" v-else>
                <span style="font-size: 13px; color: var(--text-muted); font-weight: 500; display: flex; align-items: center; gap: 6px;">
                  <icon-info-circle style="color: var(--quark-blue);" /> 公共参考资源库，由系统统一维护管理，不支持上传和新建文件夹
                </span>
              </div>

              <!-- 批量操作按钮 -->
              <transition name="fade">
                <div class="batch-action-capsule" v-if="hasSelected && !isReadOnlyView" style="display: flex; align-items: center; gap: 8px; animation: fadeIn 0.2s ease-in-out;">
                  <button class="btn-quark-secondary" style="border-radius: 4px; padding: 6px 14px; font-weight: normal; font-size: 13px;" @click="handleBatchDownload">下载</button>
                  <button class="btn-quark-secondary" style="border-radius: 4px; padding: 6px 14px; font-weight: normal; font-size: 13px;" @click="handleBatchShare">分享</button>
                  <button class="btn-quark-secondary" style="border-radius: 4px; padding: 6px 14px; font-weight: normal; font-size: 13px;" @click="handleBatchDelete">删除</button>
                  <button class="btn-quark-secondary" v-if="selectedItems.length === 1" style="border-radius: 4px; padding: 6px 14px; font-weight: normal; font-size: 13px;" @click="handleBatchRename">重命名</button>
                  <button class="btn-quark-secondary" style="border-radius: 4px; padding: 6px 14px; font-weight: normal; font-size: 13px;" @click="handleBatchMove">移动到...</button>
                  <span style="font-size: 13px; color: var(--text-muted); margin-left: 8px;">已选择 {{ selectedItems.length }} 个文件</span>
                </div>
              </transition>
            </div>

            <!-- 面包屑路径 / 标题 -->
            <div class="path-filter-bar" style="margin-bottom: 12px;">
              <div class="path-title">
                <span v-if="currentPath.length === 0">{{ getCategoryTitle(activeCategory) }}</span>
                <span class="path-breadcrumbs" v-else>
                  <span class="path-link" @click="backToCategoryRoot">{{ getCategoryTitle(activeCategory) }}</span>
                  <template v-for="(crumb, idx) in currentPath">
                    <icon-right style="font-size: 10px; color: var(--text-muted); margin: 0 4px;" />
                    <span :class="{'path-link': idx < currentPath.length - 1}" @click="goToCrumb(idx)">{{ crumb.name }}</span>
                  </template>
                </span>
                <span class="count" style="margin-left: 6px;" v-if="currentPath.length > 0 || !isDevOrEquipRoot">
                  {{ filteredList.length }}
                </span>
              </div>
            </div>

            <!-- 扁平胶囊 pill 格式筛选器 + 搜索框在一行 -->
            <div class="pill-filters" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; width: 100%;">
              <!-- 课程开发示范库三类技能子分类筛选 -->
              <div style="display: flex; gap: 8px; align-items: center;" v-if="isDevCategory && currentPath.length > 0">
                <div class="pill-filter" :class="{active: devTypeFilter === 'all'}" @click="setDevTypeFilter('all')">全部</div>
                <div class="pill-filter" :class="{active: devTypeFilter === 'skill'}" @click="setDevTypeFilter('skill')">技能课程</div>
                <div class="pill-filter" :class="{active: devTypeFilter === 'nonskill'}" @click="setDevTypeFilter('nonskill')">非技能课程</div>
                <div class="pill-filter" :class="{active: devTypeFilter === 'sim'}" @click="setDevTypeFilter('sim')">情境模拟</div>
              </div>
              <div style="display: flex; gap: 8px; align-items: center;" v-else-if="activeCategory === 'hospital-equip' && currentPath.length > 0">
                <div class="pill-filter" :class="{active: equipTypeFilter === 'all'}" @click="setEquipTypeFilter('all')">全部</div>
                <div class="pill-filter" :class="{active: equipTypeFilter === 'record'}" @click="setEquipTypeFilter('record')">录播教室</div>
                <div class="pill-filter" :class="{active: equipTypeFilter === 'simulation'}" @click="setEquipTypeFilter('simulation')">高仿真模拟人</div>
                <div class="pill-filter" :class="{active: equipTypeFilter === 'osce'}" @click="setEquipTypeFilter('osce')">OSCE考站设备</div>
              </div>
              <div style="display: flex; gap: 8px; align-items: center;" v-else-if="!isDevOrEquipRoot">
                <div class="pill-filter" :class="{active: formatFilter === 'all'}" @click="setFormatFilter('all')">全部</div>
                <div class="pill-filter" :class="{active: formatFilter === 'video'}" @click="setFormatFilter('video')">视频</div>
                <div class="pill-filter" :class="{active: formatFilter === 'doc'}" @click="setFormatFilter('doc')">文档</div>
                <div class="pill-filter" :class="{active: formatFilter === 'image'}" @click="setFormatFilter('image')">图片</div>
              </div>
              <div v-else style="width: 10px;"></div>
              
              <div class="search-box" style="margin-left: auto;">
                <icon-search />
                <input type="text" v-model="searchQuery" placeholder="搜索文件名、标签..." @input="handleSearch">
              </div>
            </div>

            <!-- 列表与卡片显示区域 -->
            <div class="list-wrap" style="border: none; background: transparent;">
              <!-- 1. 课程开发示范库根路径下的三类大卡片展示 -->
              <div v-if="!isAdmin && activeCategory === 'hospital-dev' && currentPath.length === 0" class="quark-card-grid" style="grid-template-columns: repeat(3, 1fr); margin-top: 10px;">
                <div class="quark-category-card cat-skill" @click="enterSubCategory('f-dev-undergrad', '课程开发示范库 - 技能课程')">
                  <div class="cat-icon-wrap">
                    <icon-thunderbolt />
                  </div>
                  <div class="cat-info">
                    <div class="cat-title">技能课程</div>
                    <div class="cat-desc">儿童导尿、心肺复苏等实操技能规范</div>
                  </div>
                </div>
                <div class="quark-category-card cat-nonskill" @click="enterSubCategory('f-dev-resident', '课程开发示范库 - 非技能课程')">
                  <div class="cat-icon-wrap">
                    <icon-message />
                  </div>
                  <div class="cat-info">
                    <div class="cat-title">非技能课程</div>
                    <div class="cat-desc">沟通技巧、人文与职业素养示范</div>
                  </div>
                </div>
                <div class="quark-category-card cat-sim" @click="enterSubCategory('f-dev-fellow', '课程开发示范库 - 情境模拟')">
                  <div class="cat-icon-wrap">
                    <icon-interaction />
                  </div>
                  <div class="cat-info">
                    <div class="cat-title">情境模拟</div>
                    <div class="cat-desc">高仿真团队协作与多学科急救示范</div>
                  </div>
                </div>
              </div>

              <!-- 2. 教学设备教程库根路径下的三类大卡片展示 -->
              <div v-else-if="!isAdmin && activeCategory === 'hospital-equip' && currentPath.length === 0" class="quark-card-grid" style="grid-template-columns: repeat(3, 1fr); margin-top: 10px;">
                <div class="quark-category-card cat-skill" @click="enterSubCategory('f-equip-room', '教学设备使用教程库 - 录播教室')">
                  <div class="cat-icon-wrap">
                    <icon-camera />
                  </div>
                  <div class="cat-info">
                    <div class="cat-title">录播教室</div>
                    <div class="cat-desc">查看控制面板与高清摄像头调节方法</div>
                  </div>
                </div>
                <div class="quark-category-card cat-nonskill" @click="enterSubCategory('f-equip-sim', '教学设备使用教程库 - 高仿真模拟人')">
                  <div class="cat-icon-wrap">
                    <icon-dashboard />
                  </div>
                  <div class="cat-info">
                    <div class="cat-title">高仿真模拟人</div>
                    <div class="cat-desc">查看参数调试与病例导入说明</div>
                  </div>
                </div>
                <div class="quark-category-card cat-sim" @click="enterSubCategory('f-equip-osce', '教学设备使用教程库 - OSCE考站设备')">
                  <div class="cat-icon-wrap">
                    <icon-experiment />
                  </div>
                  <div class="cat-info">
                    <div class="cat-title">OSCE考站设备</div>
                    <div class="cat-desc">考站音视频与打分终端联调方法</div>
                  </div>
                </div>
              </div>

              <!-- 3. 公共库卡片展示网格 -->
              <div v-else-if="isReadOnlyView" class="quark-card-grid">
                <!-- 空状态 -->
                <div v-if="filteredList.length === 0" style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 80px 0;">
                  <icon-empty style="font-size: 40px; opacity: 0.3; margin-bottom: 12px; display: block; margin-left: auto; margin-right: auto;" />
                  暂无匹配的卡片资源
                </div>
                
                <!-- 卡片项 -->
                <div v-for="item in filteredList" :key="item.id" class="quark-file-card" @dblclick="handleRowDblClick(item)">
                  <div class="card-thumb-wrap">
                    <component :is="getFileIconComponent(item.type)" :class="['card-thumb-icon', 'icon-' + item.type]" />
                  </div>
                  <div class="card-info-wrap">
                    <div class="card-title" :title="item.name">{{ item.name }}</div>
                    <div class="card-meta">
                      <span>{{ item.size }}</span>
                      <span>{{ item.date.slice(0,10) }}</span>
                    </div>
                  </div>
                  <!-- 悬浮安静操作区 -->
                  <div class="row-action-inline-group">
                    <a-button type="text" size="mini" title="下载" @click.stop="handleDownload(item)">
                      <icon-download />
                    </a-button>
                    <a-button type="text" size="mini" title="分享" @click.stop="handleShare(item)">
                      <icon-share-internal />
                    </a-button>
                    <a-dropdown trigger="click" @popup-visible-change="">
                      <a-button type="text" size="mini" title="更多" @click.stop>
                        <icon-more />
                      </a-button>
                      <template #content>
                        <a-doption v-if="item.type === 'video'" @click="openQuizModal(item)">
                          <icon-play-circle /> 视频弹题
                        </a-doption>
                        <a-doption @click="handleDownload(item)">
                          <icon-download /> 下载到本地
                        </a-doption>
                      </template>
                    </a-dropdown>
                  </div>
                </div>
              </div>

              <!-- 4. 传统列表表格视图 -->
              <table v-else class="quark-table">
                <!-- 显式控制表格列宽 -->
                <colgroup>
                  <col class="col-check">
                  <col class="col-name">
                  <col class="col-tags">
                  <col class="col-size">
                  <col class="col-perm">
                  <col class="col-uploader">
                  <col class="col-date">
                </colgroup>
                <thead>
                  <tr>
                    <th class="row-checkbox"><input type="checkbox" @change="toggleSelectAll($event)"></th>
                    <th>文件名称</th>
                    <th>标签</th>
                    <th>大小</th>
                    <th>权限</th>
                    <th>上传者</th>
                    <th>上传时间</th>
                  </tr>
                </thead>
                <tbody>
                  <!-- 空状态 -->
                  <tr v-if="filteredList.length === 0">
                    <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 80px 0;">
                      <icon-empty style="font-size: 40px; opacity: 0.3; margin-bottom: 12px; display: block; margin-left: auto; margin-right: auto;" />
                      暂无文件，点击「上传文件」添加资源
                    </td>
                  </tr>
                  
                  <!-- 列表行 -->
                  <tr v-for="item in filteredList" :key="item.id" @dblclick="handleRowDblClick(item)">
                    <td><input type="checkbox" v-model="item.selected" @click.stop></td>
                    <td>
                      <div class="file-name-cell">
                        <component :is="getFileIconComponent(item.type)" :class="['file-icon', 'icon-' + item.type]" />
                        <div class="file-title-wrap">
                          <div class="file-name-text" style="display: flex; align-items: center; width: 100%;">
                            <span class="file-name-span">{{ item.name }}</span>
                            <span v-if="item.published" class="badge-publish" style="margin-left: 6px;">已发布</span>
                            <span v-else-if="item.published === false" class="badge-draft" style="margin-left: 6px;">草稿</span>
                            
                            <!-- Inline hover actions behind the file name -->
                            <div class="row-action-inline-group">
                              <a-button type="text" size="mini" title="下载" @click.stop="handleDownload(item)">
                                <icon-download />
                              </a-button>
                              <a-button type="text" size="mini" title="分享" @click.stop="handleShare(item)">
                                <icon-share-internal />
                              </a-button>
                              <a-button type="text" size="mini" title="移动到" @click.stop="handleMoveResource(item)">
                                <icon-import />
                              </a-button>
                              <a-dropdown trigger="click" @popup-visible-change="">
                                <a-button type="text" size="mini" title="更多" @click.stop>
                                  <icon-more />
                                </a-button>
                                <template #content>
                                  <a-doption v-if="item.type === 'video'" @click="openQuizModal(item)">
                                    <icon-play-circle /> 视频弹题
                                  </a-doption>
                                  <a-doption @click="handleEditResource(item)">
                                    <icon-edit /> 重命名
                                  </a-doption>
                                  <a-doption style="color: #ff4d4f;" @click="handleDeleteResource(item)">
                                    <icon-delete /> 删除
                                  </a-doption>
                                </template>
                              </a-dropdown>
                            </div>
                          </div>
                          <div class="file-desc-text" v-if="item.desc">{{ item.desc }}</div>
                        </div>
                      </div>
                    </td>
                    <!-- 标签 -->
                    <td>
                      <div style="display: flex; gap: 4px; flex-wrap: wrap;">
                        <span v-for="tag in item.tags" :key="tag" class="arco-tag arco-tag-size-small arco-tag-blue" style="border-radius: 12px; padding: 0 8px; font-size: 11px;">
                          {{ tag }}
                        </span>
                        <span v-if="!item.tags || item.tags.length === 0" style="color: var(--text-muted);">-</span>
                      </div>
                    </td>
                    <!-- 大小 -->
                    <td style="color: var(--text-muted);">{{ item.size || '-' }}</td>
                    <!-- 权限 -->
                    <td>
                      <span v-if="item.perm" class="arco-tag arco-tag-size-small" :class="item.perm === '仅自己' ? 'arco-tag-gray' : item.perm === '科室可见' ? 'arco-tag-green' : 'arco-tag-blue'">
                        {{ item.perm }}
                      </span>
                      <span v-else style="color: var(--text-muted);">-</span>
                    </td>
                    <!-- 上传者 -->
                    <td style="color: var(--text-muted);">{{ item.uploader || '本人' }}</td>
                    <!-- 上传时间 -->
                    <td style="color: var(--text-muted);">{{ item.date.slice(0, 10) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </main>

          <!-- 弹题设置 Modal -->
          <a-modal v-model:visible="quizModalVisible" title="视频弹题设置" width="1000px" @ok="saveQuizSettings" ok-text="保存全部设置">
            <div style="display: flex; flex-direction: column; gap: 16px;">
              <div style="background: #111; padding: 24px; border-radius: 8px; position: relative;">
                <div style="color: #888; font-size: 12px; margin-bottom: 8px; text-align: center;">点击时间轴任意位置可放置弹题点</div>
                <div style="height: 12px; background: #333; border-radius: 6px; position: relative; cursor: pointer;" @click="handleTimelineClick($event)">
                  <div style="height: 100%; background: var(--quark-blue); border-radius: 6px;" :style="{width: quizProgress + '%'}"></div>
                  <!-- 弹题标记点 -->
                  <div v-for="(marker, idx) in quizList" :key="idx" class="quiz-marker" 
                       :class="{selected: selectedQuizIdx === idx}" :style="{left: marker.percentage + '%'}" @click.stop="selectQuiz(idx)">
                  </div>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 11px; color: #888; margin-top: 6px;">
                  <span>00:00</span>
                  <span>{{ selectedVideoDuration }}</span>
                </div>
              </div>

              <!-- 题目编辑器 -->
              <div style="display: flex; border: 1px solid #e5e6eb; border-radius: 8px; overflow: hidden; min-height: 300px;">
                <div style="width: 200px; background: var(--bg-gray); border-right: 1px solid #e5e6eb; padding: 12px;">
                  <div style="font-weight: bold; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
                    <span>弹题列表</span>
                    <a-button size="mini" type="primary" shape="round" @click="addNewQuizPoint"><icon-plus /></a-button>
                  </div>
                  <div v-for="(marker, idx) in quizList" :key="idx" @click="selectQuiz(idx)"
                       style="padding: 8px; cursor: pointer; border-radius: 6px; margin-bottom: 6px;"
                       :style="{background: selectedQuizIdx === idx ? 'var(--quark-blue-light)' : 'transparent', color: selectedQuizIdx === idx ? 'var(--quark-blue)' : 'inherit'}">
                    <icon-clock-circle /> {{ marker.time }} ({{ marker.type === 'single' ? '单选' : '多选' }})
                  </div>
                </div>
                <div style="flex: 1; padding: 16px;" v-if="selectedQuizIdx !== null && quizList[selectedQuizIdx]">
                  <a-form :model="quizList[selectedQuizIdx]" layout="vertical">
                    <a-form-item label="弹出时间点">
                      <a-input v-model="quizList[selectedQuizIdx].time" style="width: 120px;"></a-input>
                    </a-form-item>
                    <a-form-item label="题目类型">
                      <a-radio-group v-model="quizList[selectedQuizIdx].type">
                        <a-radio value="single">单选题</a-radio>
                        <a-radio value="multi">多选题</a-radio>
                        <a-radio value="judge">判断题</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item label="题干">
                      <a-textarea v-model="quizList[selectedQuizIdx].stem"></a-textarea>
                    </a-form-item>
                    <a-form-item label="选项（点击选项字母设为正确答案）">
                      <div style="display: flex; flex-direction: column; gap: 8px;">
                        <div v-for="(opt, oIdx) in quizList[selectedQuizIdx].options" :key="oIdx" style="display: flex; gap: 8px; align-items: center;">
                          <a-button size="small" :type="opt.isCorrect ? 'primary' : 'secondary'" shape="circle" @click="toggleOptionCorrect(oIdx)">
                            {{ String.fromCharCode(65 + oIdx) }}
                          </a-button>
                          <a-input v-model="opt.text" style="flex: 1;"></a-input>
                          <a-button type="text" status="danger" @click="removeQuizOption(oIdx)"><icon-delete /></a-button>
                        </div>
                        <a-button type="outline" size="small" @click="addQuizOption"><icon-plus /> 添加选项</a-button>
                      </div>
                    </a-form-item>
                    <a-form-item label="解析（学员答错后展示）">
                      <a-textarea v-model="quizList[selectedQuizIdx].explanation"></a-textarea>
                    </a-form-item>
                  </a-form>
                </div>
              </div>
            </div>
          </a-modal>

          <!-- 编辑资源信息 Modal -->
          <a-modal v-model:visible="editModalVisible" title="编辑资源信息" @ok="saveResourceEdit">
            <a-form :model="editingItem" layout="vertical" v-if="editingItem">
              <a-form-item label="文件名称">
                <a-input v-model="editingItem.name"></a-input>
              </a-form-item>
              <a-form-item label="资源描述">
                <a-textarea v-model="editingItem.desc" placeholder="简要描述资源用途..."></a-textarea>
              </a-form-item>
              <a-form-item label="权限设置">
                <a-select v-model="editingItem.perm">
                  <a-option value="公开">全员公开</a-option>
                  <a-option value="科室可见">科室可见</a-option>
                  <a-option value="仅自己">仅自己可见</a-option>
                </a-select>
              </a-form-item>
            </a-form>
          </a-modal>
        </div>
      `,
      data: function () {
        return {
          activeCategory: 'all',
          formatFilter: 'all',
          searchQuery: '',
          currentPath: [], // 面包屑路径
          resources: [
            // === 院级公共固定文件夹 (超级管理员端可见) ===
            { id: 'f-dev', name: '课程开发示范库', type: 'folder', category: 'hospital', size: '-', date: '2026-05-15 09:00', isFixed: true, uploader: '系统', perm: '公开' },
            { id: 'f-equip', name: '教学设备使用教程库', type: 'folder', category: 'hospital', size: '-', date: '2026-05-15 09:00', isFixed: true, uploader: '系统', perm: '公开' },
            
            // === 超级管理员端院级公共普通文件 ===
            { id: 1, name: '急救复苏操作说明.pdf', type: 'pdf', category: 'hospital', size: '1.2MB', date: '2026-04-20 14:15', desc: '院级公共急救流程图', tags: ['规范', '操作说明'], format: 'PDF', perm: '公开', uploader: '系统' },
            { id: 2, name: '儿科临床规范宣讲.mp4', type: 'video', category: 'hospital', size: '145MB', date: '2026-05-01 10:30', desc: '刘主任宣讲视频', tags: ['规范', '宣讲'], format: 'MP4', perm: '公开', uploader: '系统', published: true },

            // === 课程开发示范库子项 (教师端 - 课程开发示范库) ===
            // 技能课程 (f-dev-undergrad)
            { id: 101, name: '儿童导尿术（男性）_示范教案.pdf', type: 'pdf', category: 'hospital-dev', parentFolder: 'f-dev-undergrad', size: '1.5MB', date: '2026-01-15 09:00', desc: '规范化技术实操示范教案', tags: ['示范教案', '本科生', '技术技能'], format: 'PDF', perm: '公开', uploader: '系统' },
            { id: 102, name: '儿童导尿术（男性）_空白模板.docx', type: 'doc', category: 'hospital-dev', parentFolder: 'f-dev-undergrad', size: '450KB', date: '2026-01-15 09:00', desc: '课程开发空白模板', tags: ['空白模板', '技术技能'], format: 'DOCX', perm: '公开', uploader: '系统' },
            { id: 103, name: '儿童导尿术（男性）_示范视频.mp4', type: 'video', category: 'hospital-dev', parentFolder: 'f-dev-undergrad', size: '120MB', date: '2026-01-15 09:00', desc: '标准儿童导尿术实操视频', tags: ['示范视频', '实操录像'], format: 'MP4', perm: '公开', uploader: '系统', published: true },
            { id: 104, name: '心肺复苏CPR实操要领.mp4', type: 'video', category: 'hospital-dev', parentFolder: 'f-dev-undergrad', size: '85MB', date: '2026-02-10 14:30', desc: '心肺复苏胸外按压与人工呼吸标准规范', tags: ['心肺复苏', '实操视频'], format: 'MP4', perm: '公开', uploader: '系统', published: true },
            { id: 105, name: '无菌伤口换药规范.pdf', type: 'pdf', category: 'hospital-dev', parentFolder: 'f-dev-undergrad', size: '2.3MB', date: '2026-03-01 10:15', desc: '标准化伤口处理与换药步骤', tags: ['无菌操作', '规范指南'], format: 'PDF', perm: '公开', uploader: '系统' },

            // 非技能课程 (f-dev-resident)
            { id: 111, name: '沟通技巧：坏消息告知教案.pdf', type: 'pdf', category: 'hospital-dev', parentFolder: 'f-dev-resident', size: '1.1MB', date: '2026-01-15 09:00', desc: '医患沟通与坏消息告知教案', tags: ['示范教案', '沟通技巧'], format: 'PDF', perm: '公开', uploader: '系统' },
            { id: 112, name: '坏消息告知_实操演练.mp4', type: 'video', category: 'hospital-dev', parentFolder: 'f-dev-resident', size: '98MB', date: '2026-01-15 09:00', desc: '标准化病人SP情境演练录像', tags: ['示范视频', 'SP演练'], format: 'MP4', perm: '公开', uploader: '系统', published: true },
            { id: 113, name: '儿科接诊沟通艺术.pptx', type: 'ppt', category: 'hospital-dev', parentFolder: 'f-dev-resident', size: '14.2MB', date: '2026-04-12 16:00', desc: '如何与患儿及家属建立信任信任关系', tags: ['沟通技巧', '医患关系'], format: 'PPTX', perm: '公开', uploader: '系统' },

            // 情境模拟 (f-dev-fellow)
            { id: 121, name: '梗阻性休克识别与处理_示范教案.pdf', type: 'pdf', category: 'hospital-dev', parentFolder: 'f-dev-fellow', size: '2.1MB', date: '2026-01-15 09:00', desc: '休克情境模拟教学设计', tags: ['示范教案', '情境模拟'], format: 'PDF', perm: '公开', uploader: '系统' },
            { id: 122, name: '梗阻性休克的识别与处理_课件.pptx', type: 'ppt', category: 'hospital-dev', parentFolder: 'f-dev-fellow', size: '18.5MB', date: '2026-01-15 09:00', desc: '情境导入与知识串讲PPT', tags: ['课件', '休克识别'], format: 'PPTX', perm: '公开', uploader: '系统' },
            { id: 123, name: '过敏性休克抢救情境模拟.mp4', type: 'video', category: 'hospital-dev', parentFolder: 'f-dev-fellow', size: '142MB', date: '2026-05-18 11:20', desc: '多学科联合过敏性休克应急抢救演练视频', tags: ['情境模拟', '急救演练'], format: 'MP4', perm: '公开', uploader: '系统', published: true },

            // === 教学设备教程库子项 (f-equip-room/f-equip-sim/f-equip-osce) ===
            // 录播教室
            { id: 201, name: '录播教室快速上手指南.pdf', type: 'pdf', category: 'hospital-equip', parentFolder: 'f-equip-room', size: '850KB', date: '2025-11-01 10:00', desc: '极速上手指南', tags: ['快速上手', '系统配置'], format: 'PDF', perm: '公开', uploader: '系统' },
            { id: 202, name: '录播教室快速上手.mp4', type: 'video', category: 'hospital-equip', parentFolder: 'f-equip-room', size: '45MB', date: '2025-11-01 10:00', desc: '控制面板与高清摄像头调节方法', tags: ['视频教程', '录播设备'], format: 'MP4', perm: '公开', uploader: '系统', published: true },

            // 模拟人
            { id: 203, name: '高仿真模拟人基础操作.mp4', type: 'video', category: 'hospital-equip', parentFolder: 'f-equip-sim', size: '185MB', date: '2025-11-01 10:00', desc: '模拟病人参数调试与病例导入', tags: ['视频教程', '基础操作'], format: 'MP4', perm: '公开', uploader: '系统', published: true },
            { id: 204, name: '高仿真模拟人高级病例设计.pptx', type: 'ppt', category: 'hospital-equip', parentFolder: 'f-equip-sim', size: '11.8MB', date: '2025-11-05 14:00', desc: '模拟人硬件维护与病例软件说明', tags: ['使用说明', '模拟人'], format: 'PPTX', perm: '公开', uploader: '系统' },

            // OSCE
            { id: 205, name: 'OSCE打分终端及监控使用.mp4', type: 'video', category: 'hospital-equip', parentFolder: 'f-equip-osce', size: '128MB', date: '2025-11-01 10:00', desc: '考站音视频与打分终端联调方法', tags: ['视频教程', '考站配置'], format: 'MP4', perm: '公开', uploader: '系统', published: true },
            { id: 206, name: 'OSCE排考系统操作手册.pdf', type: 'pdf', category: 'hospital-equip', parentFolder: 'f-equip-osce', size: '1.2MB', date: '2025-11-01 10:00', desc: '排考终端及考机联调技术文档', tags: ['技术手册', 'OSCE'], format: 'PDF', perm: '公开', uploader: '系统' },

            // === 4. 科室资源库 dept ===
            { id: 'f-dept-vid', name: '视频资源', type: 'folder', category: 'dept', size: '-', date: '2026-05-02 11:00', uploader: '科室', perm: '科室可见' },
            { id: 'f-dept-doc', name: '课件与教学文档', type: 'folder', category: 'dept', size: '-', date: '2026-05-03 14:00', uploader: '科室', perm: '科室可见' },
            { id: 3, name: 'PICU急救操作示范_2026版.mp4', type: 'video', category: 'dept', parentFolder: 'f-dept-vid', size: '1.8GB', date: '2026-03-20 16:45', desc: 'PICU标准化紧急救治指导', tags: ['急救', '操作示范'], format: 'MP4', perm: '科室可见', uploader: '科室', published: true },
            { id: 4, name: 'PICU常见危急症处理_教学PPT.pptx', type: 'ppt', category: 'dept', parentFolder: 'f-dept-doc', size: '24.5MB', date: '2026-02-15 11:20', tags: ['危急症', '教学'], format: 'PPTX', perm: '科室可见', uploader: '科室' },
            
            // === 5. 个人资料库 personal ===
            { id: 'f-p-vid', name: '我的视频', type: 'folder', category: 'personal', size: '-', date: '2026-05-05 10:00', uploader: '本人', perm: '仅自己' },
            { id: 5, name: '我的教学录像_2026春.mp4', type: 'video', category: 'personal', parentFolder: 'f-p-vid', size: '890MB', date: '2026-04-01 09:15', desc: '2026年春季教学录像', tags: ['教学录像', '春季'], format: 'MP4', perm: '仅自己', uploader: '本人', published: true },
            { id: 6, name: '教学课件_循环系统疾病.pptx', type: 'ppt', category: 'personal', size: '18.3MB', date: '2026-03-12 10:00', tags: ['课件', '循环系统'], format: 'PPTX', perm: '科室可见', uploader: '本人' },
            { id: 7, name: '护理操作考核评分表.docx', type: 'doc', category: 'personal', size: '1.2MB', date: '2026-02-28 14:00', tags: ['考核', '评分表'], format: 'DOCX', perm: '仅自己', uploader: '本人' }
          ],

          devTypeFilter: 'all',
          equipTypeFilter: 'all',

          // 弹窗与表单
          editModalVisible: false,
          editingItem: null,

          // 弹题设置
          quizModalVisible: false,
          selectedVideoDuration: '46:12',
          quizProgress: 38,
          selectedQuizIdx: null,
          quizList: [
            { percentage: 38, time: '18:30', type: 'single', stem: '关于新生儿Apgar评分以下说法错误的是？', options: [
                { text: '1分钟评分≥7分为正常', isCorrect: true },
                { text: '评分4~6分需立即气管插管', isCorrect: false },
                { text: '5分钟评分更能预测远期神经预后', isCorrect: false }
            ], explanation: 'Apgar评分4~6分为轻度窒息，应给予清理气道、刺激等处理；评分≤3分才需气管插管。' }
          ]
        };
      },
      computed: {
        role: function () {
          return document.body.dataset.role || 'teacher';
        },
        isAdmin: function () {
          return this.role === 'admin';
        },
        // 课程开发库标签映射
        isDevCategory: function () {
          return this.activeCategory === 'hospital-dev';
        },
        // 是设备使用库
        isEquipCategory: function () {
          return this.activeCategory === 'hospital-equip';
        },
        // 只读状态：当非管理员且访问医院级固定只读库时为真
        isReadOnlyView: function () {
          if (this.isAdmin) return false;
          return this.activeCategory === 'hospital-dev' || this.activeCategory === 'hospital-equip';
        },
        // 是否在示范库或者教程库的根路径
        isDevOrEquipRoot: function () {
          if (this.isAdmin) return false;
          return (this.activeCategory === 'hospital-dev' || this.activeCategory === 'hospital-equip') && this.currentPath.length === 0;
        },
        filteredList: function () {
          return this.resources.filter(item => {
            // 1. 角色与分类过滤映射
            // 教师端：把 hospital 重定向为 hospital-dev / hospital-equip 独立库展示
            if (this.activeCategory !== 'all') {
              if (item.category !== this.activeCategory) return false;
            } else {
              // 全部文件：如果是普通教师，过滤掉内部专属文件夹
              if (!this.isAdmin && (item.category === 'hospital')) return false;
            }

            // 2. 文件夹层级筛选
            const currentFolder = this.currentPath[this.currentPath.length - 1];
            if (currentFolder) {
              if (item.parentFolder !== currentFolder.id) return false;
            } else {
              // 根路径下
              if (item.parentFolder) return false;
              // 普通教师在“全部文件”根路径下不显示 hospital-dev/hospital-equip 的子项本身，只在对应库显示
              if (!this.isAdmin && ['hospital-dev', 'hospital-equip'].includes(item.category) && this.activeCategory === 'all') {
                return false;
              }
            }

            // 3. 课程开发示范库三类技能子分类筛选 (按照标签过滤)
            if (this.activeCategory === 'hospital-dev') {
              if (this.devTypeFilter !== 'all') {
                const tags = item.tags || [];
                if (this.devTypeFilter === 'skill' && !tags.includes('技术技能')) return false;
                if (this.devTypeFilter === 'nonskill' && !tags.includes('沟通技巧')) return false;
                if (this.devTypeFilter === 'sim' && !tags.includes('情境模拟')) return false;
              }
            }

            // 4. 教学设备教程库子设备筛选 (按 parentFolder 过滤)
            if (this.activeCategory === 'hospital-equip') {
              if (this.equipTypeFilter !== 'all') {
                if (this.equipTypeFilter === 'record' && item.parentFolder !== 'f-equip-room') return false;
                if (this.equipTypeFilter === 'simulation' && item.parentFolder !== 'f-equip-sim') return false;
                if (this.equipTypeFilter === 'osce' && item.parentFolder !== 'f-equip-osce') return false;
              }
            }

            // 5. 格式筛选 pills
            if (this.formatFilter !== 'all') {
              if (this.formatFilter === 'video' && item.type !== 'video') return false;
              if (this.formatFilter === 'doc' && !['pdf', 'ppt', 'doc', 'docx', 'pptx'].includes(item.type)) return false;
              if (this.formatFilter === 'image' && item.type !== 'img') return false;
            }

            // 6. 搜索查询
            if (this.searchQuery) {
              const query = this.searchQuery.toLowerCase();
              const matchName = item.name.toLowerCase().includes(query);
              const matchDesc = item.desc && item.desc.toLowerCase().includes(query);
              const matchTags = item.tags && item.tags.some(tag => tag.toLowerCase().includes(query));
              if (!matchName && !matchDesc && !matchTags) return false;
            }

            return true;
          });
        },
        selectedItems: function () {
          return this.resources.filter(item => item.selected);
        },
        hasSelected: function () {
          return this.selectedItems.length > 0;
        }
      },
      methods: {
        selectCategory: function (cat) {
          this.activeCategory = cat;
          this.currentPath = [];
          this.formatFilter = 'all';
          this.devTypeFilter = 'all';
          this.equipTypeFilter = 'all';
        },
        enterSubCategory: function (folderId, folderName) {
          this.currentPath = [{ id: folderId, name: folderName }];
        },
        toggleFormatFilter: function (fmt) {
          this.formatFilter = this.formatFilter === fmt ? 'all' : fmt;
        },
        setFormatFilter: function (fmt) {
          this.formatFilter = fmt;
        },
        setDevTypeFilter: function (type) {
          this.devTypeFilter = type;
        },
        setEquipTypeFilter: function (type) {
          this.equipTypeFilter = type;
        },
        getCategoryTitle: function (cat) {
          const titles = { 
            all: '全部文件', 
            hospital: '院级公共资源', 
            'hospital-dev': '课程开发示范库', 
            'hospital-equip': '教学设备使用教程库',
            dept: '科室资源库 (PICU)', 
            personal: '个人资料库' 
          };
          return titles[cat] || '教学资源库';
        },
        handleRowDblClick: function (item) {
          if (item.type === 'folder') {
            this.currentPath.push({ id: item.id, name: item.name });
          }
        },
        backToCategoryRoot: function () {
          this.currentPath = [];
        },
        goToCrumb: function (idx) {
          this.currentPath = this.currentPath.slice(0, idx + 1);
        },
        getFileIconComponent: function (type) {
          if (type === 'folder') return 'icon-folder';
          if (type === 'video') return 'icon-play-circle-fill';
          if (type === 'pdf') return 'icon-file-pdf';
          if (type === 'ppt' || type === 'pptx') return 'icon-file';
          if (type === 'doc' || type === 'docx') return 'icon-file';
          if (type === 'img') return 'icon-image';
          return 'icon-file';
        },
        handleNewFolderClick: function () {
          const name = prompt('请输入新文件夹名称:', '新建文件夹');
          if (!name || !name.trim()) return;

          const parent = this.currentPath[this.currentPath.length - 1];
          const newFolder = {
            id: 'f-' + Date.now(),
            name: name.trim(),
            type: 'folder',
            category: this.activeCategory === 'all' ? 'personal' : this.activeCategory,
            parentFolder: parent ? parent.id : undefined,
            size: '-',
            date: new Date().toISOString().slice(0, 16).replace('T', ' ')
          };
          this.resources.push(newFolder);
          this.persistResources();
          this.$message.success('新建文件夹成功');
        },
        handleUploadClick: function () {
          const name = prompt('请输入上传的文件名称（演示）：', '操作演示视频.mp4');
          if (!name || !name.trim()) return;

          const parent = this.currentPath[this.currentPath.length - 1];
          const suffix = name.split('.').pop().toLowerCase();
          let type = 'doc';
          if (['mp4', 'avi', 'mov'].includes(suffix)) type = 'video';
          else if (['png', 'jpg', 'jpeg'].includes(suffix)) type = 'img';
          else if (['pdf'].includes(suffix)) type = 'pdf';

          const newFile = {
            id: Date.now(),
            name: name.trim(),
            type: type,
            category: this.activeCategory === 'all' ? 'personal' : this.activeCategory,
            parentFolder: parent ? parent.id : undefined,
            size: '12.4MB',
            date: new Date().toISOString().slice(0, 16).replace('T', ' '),
            desc: '新上传 of 资源说明'
          };
          this.resources.push(newFile);
          this.persistResources();
          this.$message.success('上传资源成功');
        },
        handleEditResource: function (item) {
          this.editingItem = { ...item };
          this.editModalVisible = true;
        },
        saveResourceEdit: function () {
          const idx = this.resources.findIndex(r => r.id === this.editingItem.id);
          if (idx !== -1) {
            this.resources[idx] = { ...this.editingItem };
            this.persistResources();
            this.$message.success('保存成功');
          }
          this.editModalVisible = false;
        },
        handleDeleteResource: function (item) {
          if (!confirm(`确认删除「${item.name}」吗？此操作不可撤销。`)) return;
          this.resources = this.resources.filter(r => r.id !== item.id);
          this.persistResources();
          this.$message.success('已成功删除');
        },
        handleMoveResource: function (item) {
          const targetFolderId = prompt('请输入目标文件夹ID（演示用）:');
          if (targetFolderId === null) return;
          
          const idx = this.resources.findIndex(r => r.id === item.id);
          if (idx !== -1) {
            this.resources[idx].parentFolder = targetFolderId ? targetFolderId : undefined;
            this.persistResources();
            this.$message.success('移动文件成功');
          }
        },
        openQuizModal: function (item) {
          this.selectedQuizIdx = 0;
          this.quizModalVisible = true;
        },
        handleTimelineClick: function (e) {
          const rect = e.currentTarget.getBoundingClientRect();
          const pct = ((e.clientX - rect.left) / rect.width) * 100;
          this.quizProgress = Math.round(pct);
          
          const minutes = Math.floor((pct / 100) * 45);
          const seconds = Math.floor((pct % 1) * 60);
          const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
          
          this.quizList.push({
            percentage: Math.round(pct),
            time: timeString,
            type: 'single',
            stem: '请输入新问题...',
            options: [
              { text: '选项 A', isCorrect: true },
              { text: '选项 B', isCorrect: false }
            ],
            explanation: '填写正确解析。'
          });
          this.selectedQuizIdx = this.quizList.length - 1;
        },
        selectQuiz: function (idx) {
          this.selectedQuizIdx = idx;
          this.quizProgress = this.quizList[idx].percentage;
        },
        addNewQuizPoint: function () {
          this.quizList.push({
            percentage: 50,
            time: '22:30',
            type: 'single',
            stem: '新添加题干...',
            options: [{ text: '新选项', isCorrect: true }],
            explanation: ''
          });
          this.selectedQuizIdx = this.quizList.length - 1;
        },
        toggleOptionCorrect: function (oIdx) {
          const quiz = this.quizList[this.selectedQuizIdx];
          if (quiz.type === 'single') {
            quiz.options.forEach((opt, idx) => opt.isCorrect = idx === oIdx);
          } else {
            quiz.options[oIdx].isCorrect = !quiz.options[oIdx].isCorrect;
          }
        },
        addQuizOption: function () {
          this.quizList[this.selectedQuizIdx].options.push({ text: '新增选项', isCorrect: false });
        },
        removeQuizOption: function (oIdx) {
          this.quizList[this.selectedQuizIdx].options.splice(oIdx, 1);
        },
        saveQuizSettings: function () {
          this.$message.success('已保存当前全部弹题设置');
          this.quizModalVisible = false;
        },
        toggleSelectAll: function (e) {
          const checked = e.target.checked;
          this.filteredList.forEach(item => item.selected = checked);
        },
        refreshData: function () {
          this.$message.info('数据刷新中...');
        },
        persistResources: function () {
          localStorage.setItem('quark_resources', JSON.stringify(this.resources));
        },
        openEditFramework: function () {
          this.$message.info('分类框架修改功能（管理端专属）已启动');
        },
        handleBatchDownload: function () {
          this.$message.success('已启动批量下载：' + this.selectedItems.map(i => i.name).join(', '));
        },
        handleBatchShare: function () {
          this.$message.success('已复制批量分享链接到剪贴板');
        },
        handleBatchDelete: function () {
          if (confirm('确认批量删除选中的 ' + this.selectedItems.length + ' 项吗？')) {
            const ids = this.selectedItems.map(i => i.id);
            this.resources = this.resources.filter(r => !ids.includes(r.id));
            this.persistResources();
            this.$message.success('批量删除成功');
          }
        },
        handleBatchRename: function () {
          if (this.selectedItems.length === 1) {
            this.handleEditResource(this.selectedItems[0]);
          }
        },
        handleBatchMove: function () {
          const folderId = prompt('请输入目标文件夹ID:');
          if (folderId !== null) {
            const ids = this.selectedItems.map(i => i.id);
            this.resources.forEach(r => {
              if (ids.includes(r.id)) {
                r.parentFolder = folderId ? folderId : undefined;
              }
            });
            this.persistResources();
            this.$message.success('批量移动成功');
          }
        },
        handleDownload: function (item) {
          this.$message.success('已开始下载：' + item.name);
        },
        handleShare: function (item) {
          this.$message.success('分享链接已复制到剪贴板：' + item.name);
        },
        handleSearch: function () {}
      },
      mounted: function () {
        const saved = localStorage.getItem('quark_resources');
        if (saved) {
          try {
            this.resources = JSON.parse(saved);
          } catch (e) {}
        }
      }
    });

    // 3. 挂载 Arco Design 原生图标与组件
    function mountApp() {
      vueApp.use(window.ArcoVue);
      vueApp.use(window.ArcoVueIcon);
      vueApp.mount('#' + mountId);
    }

    if (window.ArcoVueIcon) {
      mountApp();
    } else {
      var iconScript = document.createElement('script');
      iconScript.src = 'https://unpkg.com/@arco-design/web-vue@2.58.0/dist/arco-vue-icon.min.js';
      iconScript.onload = mountApp;
      document.body.appendChild(iconScript);
    }
  }

  // 4. 监听 data-active 的状态实现无缝生命周期管理
  function boot() {
    renderPage();
    var lastActive = document.body.dataset.active;
    var obs = new MutationObserver(function () {
      var cur = document.body.dataset.active;
      if (cur !== lastActive) {
        lastActive = cur;
        renderPage();
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
