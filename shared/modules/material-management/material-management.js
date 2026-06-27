(function () {
  var handledPages = ['首页', '物资工作台', '物资档案', '维修管理', '盘点管理', '课程使用和临时借用', '归还签收'];
  var vueApp = null;
  var mountId = 'material-mount';

  var templateHtml = "        <a-breadcrumb v-if=\"activePage !== 'usage'\" class=\"breadcrumb\">\r\n          <a-breadcrumb-item>首页</a-breadcrumb-item>\r\n          <a-breadcrumb-item>物资管理</a-breadcrumb-item>\r\n          <a-breadcrumb-item>{{ currentPage.title }}</a-breadcrumb-item>\r\n        </a-breadcrumb>\r\n\r\n        <div\r\n          v-if=\"activePage === 'workbench'\"\r\n          :class=\"['workbench-search-entry', { active: showWorkbenchSearchPanel, 'has-value': workbenchSearch.keyword.trim() }]\"\r\n          ref=\"workbenchSearchPanel\"\r\n          @click.stop\r\n        >\r\n          <div class=\"workbench-search-bar\">\r\n            <scan-line :size=\"21\" class=\"workbench-search-icon\"></scan-line>\r\n<a-input\r\n              ref=\"workbenchSearchInput\"\r\n              v-model=\"workbenchSearch.keyword\"\r\n              placeholder=\"搜索物资名称 / 编码\"\r\n              size=\"large\"\r\n              class=\"workbench-search-input\"\r\n              @focus=\"showWorkbenchSearchPanel = true\"\r\n              @press-enter=\"showWorkbenchSearchPanel = true\"\r\n              @input=\"showWorkbenchSearchPanel = true\"\r\n            ></a-input>\r\n            <button v-if=\"workbenchSearch.keyword.trim()\" type=\"button\" class=\"workbench-search-clear\" aria-label=\"清除\" @click=\"resetWorkbenchKeyword\">\r\n              <x :size=\"22\"></x>\r\n            </button>\r\n            <span v-if=\"workbenchSearch.keyword.trim()\" class=\"workbench-search-divider\"></span>\r\n            <button type=\"button\" class=\"workbench-search-action\" aria-label=\"搜索\" @click=\"showWorkbenchSearchPanel = true\">\r\n              <scan-line :size=\"22\"></scan-line>\r\n            </button>\r\n          </div>\r\n          <transition name=\"search-panel\">\r\n            <div v-if=\"showWorkbenchSearchPanel\" class=\"workbench-search-popover\">\r\n              <div class=\"search-popover-filter-row\">\r\n                <a-select v-model=\"workbenchSearch.category\" placeholder=\"物资类型\" size=\"large\" allow-clear>\r\n                  <a-option value=\"\">全部类型</a-option><a-option>模型</a-option><a-option>耗材</a-option><a-option>医疗设备</a-option><a-option>多媒体设备</a-option><a-option>其他设备</a-option>\r\n                </a-select>\r\n                <a-select v-model=\"workbenchSearch.property\" placeholder=\"资产性质\" size=\"large\" allow-clear>\r\n                  <a-option value=\"\">全部性质</a-option><a-option v-for=\"item in fundingSourceOptions\" :key=\"item\">{{ item }}</a-option>\r\n                </a-select>\r\n                <a-select v-model=\"workbenchSearch.status\" placeholder=\"状态\" size=\"large\" allow-clear>\r\n                  <a-option value=\"\">全部状态</a-option><a-option v-for=\"item in materialStatusOptions\" :key=\"item\">{{ item }}</a-option>\r\n                </a-select>\r\n                <a-button size=\"large\" @click=\"resetWorkbenchSearch\"><template #icon><repeat-2 :size=\"15\"></repeat-2></template>重置</a-button>\r\n</div>\r\n              <div class=\"search-popover-summary\">\r\n                <template v-if=\"filteredWorkbenchSearchResults.length > 0\">\r\n                  <template v-if=\"!workbenchSearch.keyword && !workbenchSearch.category && !workbenchSearch.property && !workbenchSearch.status\">\r\n                    <span>热门物资推荐</span>\r\n                  </template>\r\n                  <template v-else>\r\n                    <span>找到 {{ filteredWorkbenchSearchResults.length }} 条结果，当前显示 {{ displayedWorkbenchSearchResults.length }} 条</span>\r\n                  </template>\r\n                  <button v-if=\"hasMoreWorkbenchSearchResults\" type=\"button\" class=\"search-more-button\" @click=\"goArchiveSearchResults\">查看更多</button>\r\n                </template>\r\n                <template v-else>\r\n                  <div class=\"search-empty-state\">\r\n                    <scan-line :size=\"48\"></scan-line>\r\n                    <p>未找到匹配的物资</p>\r\n                    <span>请尝试调整搜索关键词或筛选条件</span>\r\n                  </div>\r\n                </template>\r\n              </div>\r\n              <div class=\"search-result-list\">\r\n                <div class=\"result-list-header\">\r\n                  <span class=\"col-img\"></span>\r\n                  <span class=\"col-name\">物资名称 / 型号</span>\r\n                  <span class=\"col-location\">存放地点</span>\r\n                  <span class=\"col-status\">状态</span>\r\n                  <span class=\"col-action\">操作</span>\r\n                </div>\r\n                <div class=\"result-list-body\">\r\n                  <div v-for=\"(record, index) in displayedWorkbenchSearchResults\" :key=\"index\" class=\"result-row\">\r\n                    <div class=\"col-img\">\r\n                      <a-avatar shape=\"square\" :size=\"36\" class=\"table-thumb-avatar\">\r\n                        <img v-if=\"record.image\" :src=\"record.image\" alt=\"product\"/>\r\n                        <component v-else :is=\"record.icon\" :size=\"18\"></component>\r\n                      </a-avatar>\r\n                    </div>\r\n                    <div class=\"col-name\">\r\n                      <div class=\"asset-name-cell\">\r\n                        <strong>{{ record.name }}</strong>\r\n                        <span class=\"asset-code-pill\">{{ record.code }}</span>\r\n                      </div>\r\n                    </div>\r\n                    <div class=\"col-location\">{{ record.location }}</div>\r\n                    <div class=\"col-status\"><a-tag :color=\"record.color\" size=\"small\">{{ record.status }}</a-tag></div>\r\n                    <div class=\"col-action\"><a-button type=\"text\" size=\"small\" @click=\"openWorkbenchSearchRecord(record)\">查看</a-button></div>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n            </div>\r\n          </transition>\r\n        </div>\r\n\r\n        <div v-if=\"activePage === 'archive'\" class=\"app-page-toolbar material-archive-toolbar\">\r\n          <div class=\"app-page-toolbar-left\">\r\n            <strong class=\"app-page-title\">物资档案</strong>\r\n          </div>\r\n          <div class=\"app-page-toolbar-right\">\r\n            <a-input-search\r\n              v-model=\"archiveKeyword\"\r\n              placeholder=\"搜索物资名称 / 编码\"\r\n              allow-clear\r\n              class=\"app-toolbar-search app-page-search\"\r\n            ></a-input-search>\r\n          </div>\r\n        </div>\r\n\r\n        <section v-if=\"activePage !== 'usage'\" class=\"page-header\" :class=\"{ 'archive-page-header': activePage === 'archive' }\">\r\n          <template v-if=\"activePage === 'archive'\">\r\n            <div class=\"archive-filter-toolbar\">\r\n              <a-select v-model=\"archiveFilters.property\" placeholder=\"资产性质\" size=\"small\" allow-clear class=\"archive-filter-select\">\r\n                <a-option value=\"\">全部性质</a-option>\r\n                <a-option v-for=\"item in fundingSourceOptions\" :key=\"item\">{{ item }}</a-option>\r\n              </a-select>\r\n              <a-select v-model=\"archiveFilters.location\" placeholder=\"存放地点\" size=\"small\" allow-clear class=\"archive-filter-select\">\r\n                <a-option value=\"\">全部地点</a-option>\r\n                <a-option>技能中心A</a-option>\r\n                <a-option>技能中心B</a-option>\r\n                <a-option>3F·仓库</a-option>\r\n                <a-option>3F·302教室</a-option>\r\n                <a-option>4F·模拟手术室A</a-option>\r\n                <a-option>5F·腔镜训练室</a-option>\r\n                <a-option>机房中控室</a-option>\r\n              </a-select>\r\n              <a-select v-model=\"archiveFilters.status\" placeholder=\"状态\" size=\"small\" allow-clear class=\"archive-filter-select\">\r\n                <a-option value=\"\">全部状态</a-option>\r\n                <a-option v-for=\"item in materialStatusOptions\" :key=\"item\">{{ item }}</a-option>\r\n              </a-select>\r\n              <a-select v-model=\"archiveFilters.subCategory\" placeholder=\"二级分类\" size=\"small\" allow-clear class=\"archive-filter-select\">\r\n                <a-option value=\"\">全部分类</a-option>\r\n                <a-option v-for=\"item in Object.values(categorySubOptions).flat()\" :key=\"item\">{{ item }}</a-option>\r\n              </a-select>\r\n              <div class=\"archive-filter-actions\">\r\n                <a-button type=\"primary\" size=\"small\" @click=\"handleAction('inbound')\">\r\n                  <package-plus :size=\"14\"></package-plus>入库\r\n                </a-button>\r\n              </div>\r\n            </div>\r\n\r\n          </template>\r\n          <template v-else>\r\n          <div>\r\n            <h1>{{ currentPage.title }}</h1>\r\n            <p>{{ currentPage.desc }}</p>\r\n          </div>\r\n          <div class=\"header-actions\" v-if=\"currentPage.actions.length\">\r\n            <a-button v-for=\"action in currentPage.actions\" :key=\"action.label\" :type=\"action.primary ? 'primary' : 'secondary'\" size=\"small\" @click=\"handleAction(action.key)\">\r\n              <component :is=\"action.icon\" :size=\"14\"></component>{{ action.label }}\r\n            </a-button>\r\n          </div>\r\n          <div class=\"preheader-cards\" v-if=\"activePage === 'workbench'\">\r\n            <div class=\"preheader-assets\">\r\n              <div v-for=\"item in inventoryMix\" :key=\"item.name\" class=\"asset-card\" @click=\"activePage='archive'\">\r\n                <div class=\"asset-card-header\">\r\n                  <span class=\"asset-card-name\">{{ item.name }}</span>\r\n                  <strong class=\"asset-card-count\">{{ item.count }}</strong>\r\n                </div>\r\n                <div class=\"asset-card-chart\" :ref=\"el => setChartRef(el, item.type)\"></div>\r\n              </div>\r\n            </div>\r\n            <div class=\"preheader-work\">\r\n              <button v-for=\"item in workQueueSummary\" :key=\"item.label\" type=\"button\" :class=\"item.tone\" @click=\"handleWorkQueueClick(item)\">\r\n                <div class=\"wq-card-inner\">\r\n                  <div class=\"wq-card-main\">\r\n                    <strong>{{ item.value }}</strong>\r\n                    <span class=\"wq-label\">{{ item.label }}</span>\r\n                  </div>\r\n                  <div class=\"wq-card-hint\">\r\n                    <component :is=\"item.icon\" :size=\"14\"></component>\r\n                    <em>{{ item.hint }}</em>\r\n                  </div>\r\n                </div>\r\n              </button>\r\n            </div>\r\n          </div>\r\n          </template>\r\n        </section>\r\n        <section v-if=\"activePage === 'archive'\" class=\"section-card archive-main full-span-card\">\r\n          <div v-if=\"selectedArchiveIds.length\" class=\"archive-batch-actions\">\r\n            <span>已选 {{ selectedArchiveIds.length }} 项</span>\r\n            <a-button size=\"small\" @click=\"batchLockArchive\"><lock :size=\"14\"></lock>批量锁定</a-button>\r\n            <a-button size=\"small\" status=\"danger\" @click=\"showBatchDeleteConfirm = true\"><trash-2 :size=\"14\"></trash-2>批量删除</a-button>\r\n          </div>\r\n          <a-tabs v-model:active-key=\"inboundTab\" class=\"modern-tabs\">\r\n            <a-tab-pane key=\"model\" :title=\"`模型 (${filteredModels.length})`\">\r\n              <div class=\"archive-tab-filter\">\r\n                <a-select v-model=\"archiveFilters.subCategory\" placeholder=\"二级分类\" size=\"small\" allow-clear>\r\n                  <a-option value=\"\">全部二级分类</a-option>\r\n                  <a-option v-for=\"item in categorySubOptions['模型']\" :key=\"item\" :value=\"item\">{{ item }}</a-option>\r\n                </a-select>\r\n              </div>\r\n              <a-table :data=\"filteredModels\" :pagination=\"{ pageSize: 12, showTotal: true }\" :bordered=\"false\" size=\"medium\" :row-class=\"rowClass\" @row-click=\"handleRowClick\">\r\n                <template #columns>\r\n                  <a-table-column :width=\"30\" align=\"center\" class-name=\"archive-select-col\">\r\n                    <template #title>\r\n                      <a-checkbox class=\"archive-head-checkbox\" :model-value=\"isArchiveAllSelected(filteredModels)\" :indeterminate=\"isArchivePartSelected(filteredModels)\" @click.stop @change=\"toggleSelectAllArchive(filteredModels)\"></a-checkbox>\r\n                    </template>\r\n                    <template #cell=\"{ record }\">\r\n                      <a-checkbox class=\"archive-row-checkbox\" :model-value=\"isArchiveSelected(record)\" @click.stop @change=\"toggleArchiveSelect(record.id)\"></a-checkbox>\r\n                    </template>\r\n                  </a-table-column>\r\n                  <a-table-column title=\"产品图\" :width=\"80\" align=\"center\">\r\n                    <template #cell=\"{ record }\">\r\n                      <a-avatar shape=\"square\" :size=\"36\" class=\"table-thumb-avatar\">\r\n                        <img :src=\"record.image\" class=\"table-thumb-img\" alt=\"product\"/>\r\n                      </a-avatar>\r\n                    </template>\r\n                  </a-table-column>\r\n                  <a-table-column title=\"模型名称\" :width=\"240\">\r\n                    <template #cell=\"{ record }\">\r\n                      <div class=\"asset-name-cell\">\r\n                        <strong>{{ record.name }}</strong>\r\n                        <span class=\"asset-code-pill\">{{ record.code }}</span>\r\n                      </div>\r\n                    </template>\r\n                  </a-table-column>\r\n                  <a-table-column title=\"存放地点\" data-index=\"homeLocation\" :width=\"130\"></a-table-column>\r\n                  <a-table-column title=\"二级分类\" data-index=\"subCategory\" :width=\"110\"></a-table-column>\r\n                  <a-table-column title=\"当前位置\" :width=\"130\">\r\n                    <template #cell=\"{ record }\">\r\n                      <span :class=\"{ 'text-success strong-text': record.currentLocation !== record.homeLocation }\">{{ record.currentLocation }}</span>\r\n                    </template>\r\n                  </a-table-column>\r\n                  <a-table-column title=\"使用次数\" data-index=\"usageCount\" :width=\"100\" align=\"center\"></a-table-column>\r\n                  <a-table-column title=\"状态\" :width=\"90\">\r\n                    <template #cell=\"{ record }\">\r\n                      <a-tag :color=\"getStatusColor(record.status)\" size=\"small\">{{ record.status }}</a-tag>\r\n                    </template>\r\n                  </a-table-column>\r\n                  <a-table-column title=\"操作\" align=\"right\" :width=\"132\">\r\n                    <template #cell=\"{ record }\">\r\n                      <a-space size=\"mini\" class=\"table-row-actions\" @click.stop>\r\n                        <a-button type=\"text\" size=\"mini\">查看</a-button>\r\n                        <a-dropdown trigger=\"click\">\r\n                          <a-button type=\"text\" size=\"mini\">更多</a-button>\r\n                          <template #content>\r\n                            <a-doption @click=\"lockArchiveRecord(record)\">锁定</a-doption>\r\n                            <a-doption @click=\"deleteArchiveRecord(record)\"><span class=\"danger-menu-action\">删除</span></a-doption>\r\n                          </template>\r\n                        </a-dropdown>\r\n                      </a-space>\r\n                    </template>\r\n                  </a-table-column>\r\n                </template>\r\n              </a-table>\r\n            </a-tab-pane>\r\n\r\n            <a-tab-pane key=\"medical\" :title=\"`医疗设备 (${filteredMedical.length})`\">\r\n              <div class=\"archive-tab-filter\">\r\n                <a-select v-model=\"archiveFilters.subCategory\" placeholder=\"二级分类\" size=\"small\" allow-clear>\r\n                  <a-option value=\"\">全部二级分类</a-option>\r\n                  <a-option v-for=\"item in categorySubOptions['医疗设备']\" :key=\"item\" :value=\"item\">{{ item }}</a-option>\r\n                </a-select>\r\n              </div>\r\n              <a-table :data=\"filteredMedical\" :pagination=\"{ pageSize: 12, showTotal: true }\" :bordered=\"false\" size=\"medium\" :row-class=\"rowClass\" @row-click=\"handleRowClick\">\r\n                <template #columns>\r\n                  <a-table-column :width=\"30\" align=\"center\" class-name=\"archive-select-col\">\r\n                    <template #title>\r\n                      <a-checkbox class=\"archive-head-checkbox\" :model-value=\"isArchiveAllSelected(filteredMedical)\" :indeterminate=\"isArchivePartSelected(filteredMedical)\" @click.stop @change=\"toggleSelectAllArchive(filteredMedical)\"></a-checkbox>\r\n                    </template>\r\n                    <template #cell=\"{ record }\">\r\n                      <a-checkbox class=\"archive-row-checkbox\" :model-value=\"isArchiveSelected(record)\" @click.stop @change=\"toggleArchiveSelect(record.id)\"></a-checkbox>\r\n                    </template>\r\n                  </a-table-column>\r\n                  <a-table-column title=\"产品图\" :width=\"80\" align=\"center\">\r\n                    <template #cell=\"{ record }\">\r\n                      <a-avatar shape=\"square\" :size=\"36\" class=\"table-thumb-avatar\">\r\n                        <img :src=\"record.image\" class=\"table-thumb-img\" alt=\"product\"/>\r\n                      </a-avatar>\r\n                    </template>\r\n                  </a-table-column>\r\n                  <a-table-column title=\"设备名称\" :width=\"240\">\r\n                    <template #cell=\"{ record }\">\r\n                      <div class=\"asset-name-cell\">\r\n                        <strong>{{ record.name }}</strong>\r\n                        <span class=\"asset-code-pill\">{{ record.code }}</span>\r\n                      </div>\r\n                    </template>\r\n                  </a-table-column>\r\n                  <a-table-column title=\"存放地点\" data-index=\"homeLocation\" :width=\"130\"></a-table-column>\r\n                  <a-table-column title=\"二级分类\" data-index=\"subCategory\" :width=\"110\"></a-table-column>\r\n                  <a-table-column title=\"当前位置\" :width=\"130\">\r\n                    <template #cell=\"{ record }\">\r\n                      <span :class=\"{ 'text-success strong-text': record.currentLocation !== record.homeLocation }\">{{ record.currentLocation }}</span>\r\n                    </template>\r\n                  </a-table-column>\r\n                  <a-table-column title=\"使用次数\" data-index=\"usageCount\" :width=\"100\" align=\"center\"></a-table-column>\r\n                  <a-table-column title=\"状态\" :width=\"90\">\r\n                    <template #cell=\"{ record }\">\r\n                      <a-tag :color=\"getStatusColor(record.status)\" size=\"small\">{{ record.status }}</a-tag>\r\n                    </template>\r\n                  </a-table-column>\r\n                  <a-table-column title=\"操作\" align=\"right\" :width=\"132\">\r\n                    <template #cell=\"{ record }\">\r\n                      <a-space size=\"mini\" class=\"table-row-actions\" @click.stop>\r\n                        <a-button type=\"text\" size=\"mini\">查看</a-button>\r\n                        <a-dropdown trigger=\"click\">\r\n                          <a-button type=\"text\" size=\"mini\">更多</a-button>\r\n                          <template #content>\r\n                            <a-doption @click=\"lockArchiveRecord(record)\">锁定</a-doption>\r\n                            <a-doption @click=\"deleteArchiveRecord(record)\"><span class=\"danger-menu-action\">删除</span></a-doption>\r\n                          </template>\r\n                        </a-dropdown>\r\n                      </a-space>\r\n                    </template>\r\n                  </a-table-column>\r\n                </template>\r\n              </a-table>\r\n            </a-tab-pane>\r\n\r\n            <a-tab-pane key=\"consumable\" :title=\"`耗材 (${filteredConsData.length})`\">\r\n              <div class=\"archive-tab-filter\">\r\n                <a-select v-model=\"archiveFilters.subCategory\" placeholder=\"二级分类\" size=\"small\" allow-clear>\r\n                  <a-option value=\"\">全部二级分类</a-option>\r\n                  <a-option v-for=\"item in categorySubOptions['耗材']\" :key=\"item\" :value=\"item\">{{ item }}</a-option>\r\n                </a-select>\r\n              </div>\r\n              <a-table :data=\"filteredConsData\" :bordered=\"false\" :pagination=\"{pageSize:12, showTotal:true}\" size=\"medium\" :row-class=\"rowClass\" @row-click=\"handleRowClick\">\r\n                <template #columns>\r\n                  <a-table-column :width=\"30\" align=\"center\" class-name=\"archive-select-col\">\r\n                    <template #title>\r\n                      <a-checkbox class=\"archive-head-checkbox\" :model-value=\"isArchiveAllSelected(filteredConsData)\" :indeterminate=\"isArchivePartSelected(filteredConsData)\" @click.stop @change=\"toggleSelectAllArchive(filteredConsData)\"></a-checkbox>\r\n                    </template>\r\n                    <template #cell=\"{ record }\">\r\n                      <a-checkbox class=\"archive-row-checkbox\" :model-value=\"isArchiveSelected(record)\" @click.stop @change=\"toggleArchiveSelect(record.id)\"></a-checkbox>\r\n                    </template>\r\n                  </a-table-column>\r\n                  <a-table-column title=\"耗材名称\" data-index=\"name\"></a-table-column>\r\n                  <a-table-column title=\"规格\" data-index=\"spec\" :width=\"120\"></a-table-column>\r\n                  <a-table-column title=\"分类\" data-index=\"category\" :width=\"120\"></a-table-column>\r\n                  <a-table-column title=\"当前库存\" :width=\"100\">\r\n                    <template #cell=\"{ record }\">\r\n                      <span :class=\"{ 'text-danger strong-text': record.status === 'warn' }\">{{record.stock}}</span>\r\n                    </template>\r\n                  </a-table-column>\r\n                  <a-table-column title=\"安全库存\" data-index=\"min\" :width=\"100\"></a-table-column>\r\n                  <a-table-column title=\"单位\" data-index=\"unit\" :width=\"80\"></a-table-column>\r\n                  <a-table-column title=\"状态\" :width=\"100\">\r\n                    <template #cell=\"{ record }\">\r\n                      <a-tag :color=\"record.statusClass\" size=\"small\">{{record.statusLabel}}</a-tag>\r\n                    </template>\r\n                  </a-table-column>\r\n                  <a-table-column title=\"操作\" :width=\"160\" align=\"right\">\r\n                    <template #cell=\"{ record }\">\r\n                      <a-space size=\"mini\" class=\"table-row-actions\" @click.stop>\r\n                        <a-button type=\"text\" size=\"mini\">查看</a-button>\r\n                        <a-dropdown trigger=\"click\">\r\n                          <a-button type=\"text\" size=\"mini\">更多</a-button>\r\n                          <template #content>\r\n                            <a-doption @click=\"lockArchiveRecord(record)\">锁定</a-doption>\r\n                            <a-doption @click=\"deleteArchiveRecord(record)\"><span class=\"danger-menu-action\">删除</span></a-doption>\r\n                          </template>\r\n                        </a-dropdown>\r\n                      </a-space>\r\n                    </template>\r\n                  </a-table-column>\r\n                </template>\r\n              </a-table>\r\n            </a-tab-pane>\r\n\r\n            <a-tab-pane key=\"device\" :title=\"`多媒体仪器 (${filteredDevices.length})`\">\r\n              <div class=\"archive-tab-filter\">\r\n                <a-select v-model=\"archiveFilters.subCategory\" placeholder=\"二级分类\" size=\"small\" allow-clear>\r\n                  <a-option value=\"\">全部二级分类</a-option>\r\n                  <a-option v-for=\"item in categorySubOptions['多媒体设备']\" :key=\"item\" :value=\"item\">{{ item }}</a-option>\r\n                </a-select>\r\n              </div>\r\n              <a-table :data=\"filteredDevices\" :pagination=\"{ pageSize: 12, showTotal: true }\" :bordered=\"false\" size=\"medium\" :row-class=\"rowClass\" @row-click=\"handleRowClick\">\r\n                <template #columns>\r\n                  <a-table-column :width=\"30\" align=\"center\" class-name=\"archive-select-col\">\r\n                    <template #title>\r\n                      <a-checkbox class=\"archive-head-checkbox\" :model-value=\"isArchiveAllSelected(filteredDevices)\" :indeterminate=\"isArchivePartSelected(filteredDevices)\" @click.stop @change=\"toggleSelectAllArchive(filteredDevices)\"></a-checkbox>\r\n                    </template>\r\n                    <template #cell=\"{ record }\">\r\n                      <a-checkbox class=\"archive-row-checkbox\" :model-value=\"isArchiveSelected(record)\" @click.stop @change=\"toggleArchiveSelect(record.id)\"></a-checkbox>\r\n                    </template>\r\n                  </a-table-column>\r\n                  <a-table-column title=\"产品图\" :width=\"80\" align=\"center\">\r\n                    <template #cell=\"{ record }\">\r\n                      <a-avatar shape=\"square\" :size=\"36\" class=\"table-thumb-avatar\">\r\n                        <img :src=\"record.image\" class=\"table-thumb-img\" alt=\"product\"/>\r\n                      </a-avatar>\r\n                    </template>\r\n                  </a-table-column>\r\n                  <a-table-column title=\"仪器名称\" :width=\"240\">\r\n                    <template #cell=\"{ record }\">\r\n                      <div class=\"asset-name-cell\">\r\n                        <strong>{{ record.name }}</strong>\r\n                        <span class=\"asset-code-pill\">{{ record.code }}</span>\r\n                      </div>\r\n                    </template>\r\n                  </a-table-column>\r\n                  <a-table-column title=\"存放地点\" data-index=\"homeLocation\" :width=\"130\"></a-table-column>\r\n                  <a-table-column title=\"二级分类\" data-index=\"subCategory\" :width=\"110\"></a-table-column>\r\n                  <a-table-column title=\"当前位置\" :width=\"130\">\r\n                    <template #cell=\"{ record }\">\r\n                      <span :class=\"{ 'text-success strong-text': record.currentLocation !== record.homeLocation }\">{{ record.currentLocation }}</span>\r\n                    </template>\r\n                  </a-table-column>\r\n                  <a-table-column title=\"使用次数\" data-index=\"usageCount\" :width=\"100\" align=\"center\"></a-table-column>\r\n                  <a-table-column title=\"状态\" :width=\"90\">\r\n                    <template #cell=\"{ record }\">\r\n                      <a-tag :color=\"getStatusColor(record.status)\" size=\"small\">{{ record.status }}</a-tag>\r\n                    </template>\r\n                  </a-table-column>\r\n                  <a-table-column title=\"操作\" align=\"right\" :width=\"132\">\r\n                    <template #cell=\"{ record }\">\r\n                      <a-space size=\"mini\" class=\"table-row-actions\" @click.stop>\r\n                        <a-button type=\"text\" size=\"mini\">查看</a-button>\r\n                        <a-dropdown trigger=\"click\">\r\n                          <a-button type=\"text\" size=\"mini\">更多</a-button>\r\n                          <template #content>\r\n                            <a-doption @click=\"lockArchiveRecord(record)\">锁定</a-doption>\r\n                            <a-doption @click=\"deleteArchiveRecord(record)\"><span class=\"danger-menu-action\">删除</span></a-doption>\r\n                          </template>\r\n                        </a-dropdown>\r\n                      </a-space>\r\n                    </template>\r\n                  </a-table-column>\r\n                </template>\r\n              </a-table>\r\n            </a-tab-pane>\r\n\r\n            <a-tab-pane key=\"other\" :title=\"`其他设备 (${filteredOtherDevices.length})`\">\r\n              <div class=\"archive-tab-filter\">\r\n                <a-select v-model=\"archiveFilters.subCategory\" placeholder=\"二级分类\" size=\"small\" allow-clear>\r\n                  <a-option value=\"\">全部二级分类</a-option>\r\n                  <a-option v-for=\"item in categorySubOptions['其他设备']\" :key=\"item\" :value=\"item\">{{ item }}</a-option>\r\n                </a-select>\r\n              </div>\r\n              <a-table :data=\"filteredOtherDevices\" :pagination=\"{ pageSize: 12, showTotal: true }\" :bordered=\"false\" size=\"medium\" :row-class=\"rowClass\" @row-click=\"handleRowClick\">\r\n                <template #columns>\r\n                  <a-table-column :width=\"30\" align=\"center\" class-name=\"archive-select-col\">\r\n                    <template #title>\r\n                      <a-checkbox class=\"archive-head-checkbox\" :model-value=\"isArchiveAllSelected(filteredOtherDevices)\" :indeterminate=\"isArchivePartSelected(filteredOtherDevices)\" @click.stop @change=\"toggleSelectAllArchive(filteredOtherDevices)\"></a-checkbox>\r\n                    </template>\r\n                    <template #cell=\"{ record }\">\r\n                      <a-checkbox class=\"archive-row-checkbox\" :model-value=\"isArchiveSelected(record)\" @click.stop @change=\"toggleArchiveSelect(record.id)\"></a-checkbox>\r\n                    </template>\r\n                  </a-table-column>\r\n                  <a-table-column title=\"产品图\" :width=\"80\" align=\"center\">\r\n                    <template #cell=\"{ record }\">\r\n                      <a-avatar shape=\"square\" :size=\"36\" class=\"table-thumb-avatar\">\r\n                        <img :src=\"record.image\" class=\"table-thumb-img\" alt=\"product\"/>\r\n                      </a-avatar>\r\n                    </template>\r\n                  </a-table-column>\r\n                  <a-table-column title=\"设备名称\" :width=\"240\">\r\n                    <template #cell=\"{ record }\">\r\n                      <div class=\"asset-name-cell\">\r\n                        <strong>{{ record.name }}</strong>\r\n                        <span class=\"asset-code-pill\">{{ record.code }}</span>\r\n                      </div>\r\n                    </template>\r\n                  </a-table-column>\r\n                  <a-table-column title=\"存放地点\" data-index=\"homeLocation\" :width=\"130\"></a-table-column>\r\n                  <a-table-column title=\"二级分类\" data-index=\"subCategory\" :width=\"110\"></a-table-column>\r\n                  <a-table-column title=\"当前位置\" :width=\"130\">\r\n                    <template #cell=\"{ record }\">\r\n                      <span :class=\"{ 'text-success strong-text': record.currentLocation !== record.homeLocation }\">{{ record.currentLocation }}</span>\r\n                    </template>\r\n                  </a-table-column>\r\n                  <a-table-column title=\"使用次数\" data-index=\"usageCount\" :width=\"100\" align=\"center\"></a-table-column>\r\n                  <a-table-column title=\"状态\" :width=\"90\">\r\n                    <template #cell=\"{ record }\">\r\n                      <a-tag :color=\"getStatusColor(record.status)\" size=\"small\">{{ record.status }}</a-tag>\r\n                    </template>\r\n                  </a-table-column>\r\n                  <a-table-column title=\"操作\" align=\"right\" :width=\"132\">\r\n                    <template #cell=\"{ record }\">\r\n                      <a-space size=\"mini\" class=\"table-row-actions\" @click.stop>\r\n                        <a-button type=\"text\" size=\"mini\">查看</a-button>\r\n                        <a-dropdown trigger=\"click\">\r\n                          <a-button type=\"text\" size=\"mini\">更多</a-button>\r\n                          <template #content>\r\n                            <a-doption @click=\"lockArchiveRecord(record)\">锁定</a-doption>\r\n                            <a-doption @click=\"deleteArchiveRecord(record)\"><span class=\"danger-menu-action\">删除</span></a-doption>\r\n                          </template>\r\n                        </a-dropdown>\r\n                      </a-space>\r\n                    </template>\r\n                  </a-table-column>\r\n                </template>\r\n              </a-table>\r\n            </a-tab-pane>\r\n          </a-tabs>\r\n        </section>\r\n        <template v-if=\"activePage === 'workbench'\">\r\n          <section class=\"usage-trend-grid\">\r\n            <section class=\"section-card usage-trend-card\">\r\n              <div class=\"card-head\">\r\n                <div>\r\n                  <h2><bar-chart-3 :size=\"16\" class=\"card-icon\"></bar-chart-3>近 8 个月使用走势</h2>\r\n                  <p>按物资类型堆叠展示使用次数，并叠加总量走势。</p>\r\n                </div>\r\n                <a-tag color=\"blue\" size=\"small\">月度统计</a-tag>\r\n              </div>\r\n              <div class=\"trend-legend\">\r\n                <label v-for=\"item in usageTrendTypes\" :key=\"item.key\" :class=\"{ muted: !visibleUsageTrendTypes.includes(item.key) }\">\r\n                  <input type=\"checkbox\" :value=\"item.key\" v-model=\"visibleUsageTrendTypes\" :style=\"{ accentColor: item.color }\">\r\n                  <i :style=\"{ background: item.color }\"></i>{{ item.label }}\r\n                </label>\r\n                <span class=\"trend-line-legend\"><i></i>总使用次数</span>\r\n              </div>\r\n              <div class=\"trend-chart\">\r\n                <div class=\"trend-y-axis\">\r\n                  <span v-for=\"tick in usageTrendTicks\" :key=\"tick\">{{ tick }}</span>\r\n                </div>\r\n                <div class=\"trend-plot\">\r\n                  <div class=\"trend-gridline\" v-for=\"tick in usageTrendTicks\" :key=\"`line-${tick}`\"></div>\r\n                  <svg class=\"trend-line-layer\" viewBox=\"0 0 1000 260\" preserveAspectRatio=\"none\" aria-hidden=\"true\">\r\n                    <path :d=\"usageTrendLinePath\" fill=\"none\" stroke=\"#3C9EF2\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path>\r\n                  </svg>\r\n                  <div class=\"trend-point-layer\" aria-hidden=\"true\">\r\n                    <span\r\n                      v-for=\"point in usageTrendPointList\"\r\n                      :key=\"point.month\"\r\n                      class=\"trend-line-point\"\r\n                      :style=\"{ left: point.left + '%', top: point.top + '%' }\"\r\n                    ></span>\r\n                  </div>\r\n                  <button\r\n                    v-for=\"month in usageTrendWithTotals\"\r\n                    :key=\"month.month\"\r\n                    type=\"button\"\r\n                    :class=\"['trend-month', { active: activeUsageTrendMonth === month.month }]\"\r\n                    @click=\"activeUsageTrendMonth = month.month\"\r\n                  >\r\n                    <span class=\"trend-stack\" :style=\"{ height: month.totalPercent + '%' }\">\r\n                      <i v-for=\"segment in month.segments\" :key=\"segment.key\" :style=\"{ height: segment.percent + '%', background: segment.color }\"></i>\r\n                    </span>\r\n                    <strong>{{ month.month }}</strong>\r\n                  </button>\r\n                </div>\r\n              </div>\r\n            </section>\r\n            <aside class=\"section-card usage-trend-detail\">\r\n              <div class=\"detail-kicker\">当前月份</div>\r\n              <h2>{{ activeUsageTrend.month }} 使用明细</h2>\r\n              <strong class=\"detail-total\">{{ activeUsageTrend.total }} 次</strong>\r\n              <div class=\"detail-breakdown\">\r\n                <article v-for=\"segment in activeUsageTrend.segments\" :key=\"segment.key\">\r\n                  <span><i :style=\"{ background: segment.color }\"></i>{{ segment.label }}</span>\r\n                  <strong>{{ segment.value }} 次</strong>\r\n                </article>\r\n              </div>\r\n              <div class=\"detail-note\">\r\n                <circle-check :size=\"15\"></circle-check>\r\n                <span>{{ activeUsageTrend.note }}</span>\r\n              </div>\r\n            </aside>\r\n          </section>\r\n          <section class=\"section-card priority-card\">\r\n              <div class=\"card-head\"><div><h2><list-checks :size=\"16\" class=\"card-icon\"></list-checks>待办事项</h2><p>需要人工立即处理的事项，包括报修、课程准备、逾期未还和盘点异常。</p></div><a-tag color=\"orange\" size=\"small\">{{ todos.length }} 项</a-tag></div>\r\n              <div class=\"action-list\">\r\n                <article v-for=\"todo in todos\" :key=\"todo.title\" :class=\"{danger: todo.danger}\">\r\n                  <div class=\"action-rank\">{{ todo.rank }}</div><div class=\"task-main\"><strong>{{ todo.title }}</strong><span>{{ todo.desc }}</span></div><a-tag :color=\"todo.sourceColor\" size=\"small\">{{ todo.source }}</a-tag><span class=\"muted\">{{ todo.time }}</span><a-button size=\"mini\" type=\"outline\" @click=\"handleTodoAction(todo)\">{{ todo.action }}</a-button>\r\n                </article>\r\n              </div>\r\n            </section>\r\n        </template>\r\n\r\n        <template v-if=\"activePage === 'usage'\">\r\n          <div class=\"custom-tabs-container\">\r\n            <!-- Minimal Custom Tab Header Buttons -->\r\n            <div class=\"custom-tabs-header\">\r\n              <button type=\"button\" :class=\"{ active: usageTab === 'teaching' }\" @click=\"usageTab = 'teaching'\">{{ teachingTabTitle }}</button>\r\n              <button type=\"button\" :class=\"{ active: usageTab === 'borrow' }\" @click=\"usageTab = 'borrow'\">{{ borrowTabTitle }}</button>\r\n            </div>\r\n\r\n            <!-- Sub-tab Action Bar containing the relocated primary action buttons -->\r\n            <div class=\"custom-tabs-action-bar\">\r\n              <!-- Case 1: '课程使用和临时借用' (activeMenu === '课程使用和临时借用') -->\r\n              <template v-if=\"activeMenu === '课程使用和临时借用'\">\r\n                <a-button type=\"primary\" size=\"medium\" @click=\"showBorrowModal = true\">\r\n                  <hand-coins :size=\"16\"></hand-coins>&nbsp;临时借用\r\n                </a-button>\r\n              </template>\r\n              <!-- Case 2: '归还签收' (activeMenu === '归还签收') -->\r\n              <template v-else-if=\"activeMenu === '归还签收'\">\r\n                <a-button type=\"primary\" size=\"medium\" @click=\"showReturnDrawer = true\">\r\n                  <clipboard-check :size=\"16\"></clipboard-check>&nbsp;归还\r\n                </a-button>\r\n              </template>\r\n            </div>\r\n\r\n            <!-- Content Area dynamically toggled by usageTab -->\r\n            <div class=\"custom-tabs-content\">\r\n              <!-- Tab Pane: Teaching Use (教学使用准备 / 教学使用核对) -->\r\n              <div v-show=\"usageTab === 'teaching'\">\r\n                <!-- Toolbar filters -->\r\n                <div class=\"toolbar toolbar-spaced\" style=\"margin-bottom: 16px;\">\r\n                  <a-input-search v-model=\"usageFilters.keyword\" placeholder=\"课程名称/领用人\" size=\"small\" allow-clear class=\"toolbar-search\"></a-input-search>\r\n                  <a-select v-model=\"usageFilters.department\" size=\"small\" allow-clear class=\"toolbar-select\">\r\n                    <a-option value=\"\">全部科室</a-option><a-option>急诊培训中心</a-option><a-option>外科</a-option><a-option>教培新生儿</a-option>\r\n                  </a-select>\r\n                  <a-date-picker v-model=\"usageFilters.date\" placeholder=\"使用日期\" size=\"small\" class=\"toolbar-date\"></a-date-picker>\r\n                  <a-select v-model=\"usageFilters.status\" size=\"small\" allow-clear class=\"toolbar-select\">\r\n                    <a-option value=\"\">全部状态</a-option><a-option>待准备</a-option><a-option>准备完成</a-option><a-option>待核对</a-option><a-option>已核对</a-option>\r\n                  </a-select>\r\n                  <div class=\"toolbar-actions\">\r\n                    <a-button size=\"small\" @click=\"usageFilters = { keyword: '', department: '', date: '', status: '' }\">重置</a-button>\r\n                  </div>\r\n                </div>\r\n                \r\n                <!-- Teaching Use Cards List -->\r\n                <div class=\"usage-card-list\">\r\n                  <article v-for=\"item in displayTeachingUseData\" :key=\"item.id\" class=\"usage-card teaching-card\">\r\n                    <div class=\"usage-card-time\">\r\n                      <strong>{{ item.dateLabel }}</strong>\r\n                      <span>{{ item.timeLabel }}</span>\r\n                    </div>\r\n                    <div class=\"usage-card-body\">\r\n                      <div class=\"usage-card-headline\">\r\n                        <h4>{{ item.course }}</h4>\r\n                        <a-tag :color=\"item.statusColor\" size=\"small\">{{ item.status }}</a-tag>\r\n                      </div>\r\n                      <p class=\"usage-card-meta\">{{ item.classroom }} · {{ item.teacher }} · {{ item.studentCount }} 人</p>\r\n                      <div class=\"usage-card-tags\">\r\n                        <span v-for=\"tag in item.materialTags\" :key=\"tag\" class=\"material-pill\">{{ tag }}</span>\r\n                      </div>\r\n                    </div>\r\n                    <div class=\"usage-card-action\">\r\n                      <a-button v-if=\"item.status === '待准备'\" type=\"primary\" size=\"small\" @click=\"openTeachingPrepare(item)\">去准备</a-button>\r\n                      <a-button v-else-if=\"item.status === '已备妥'\" type=\"primary\" size=\"small\" status=\"success\" @click=\"openTeachingPrepare(item)\">去核对</a-button>\r\n                      <a-button v-else size=\"small\" @click=\"openTeachingDetail(item)\">查看</a-button>\r\n                    </div>\r\n                  </article>\r\n                </div>\r\n              </div>\r\n\r\n              <!-- Tab Pane: Borrow / Return (临时借用准备 / 临时归还管理) -->\r\n              <div v-show=\"usageTab === 'borrow'\">\r\n                <!-- Toolbar filters -->\r\n                <div class=\"toolbar toolbar-spaced\" style=\"margin-bottom: 16px;\">\r\n                  <a-input-search v-model=\"borrowFilters.keyword\" placeholder=\"课程名称/领用人\" size=\"small\" allow-clear class=\"toolbar-search\"></a-input-search>\r\n                  <a-select v-model=\"borrowFilters.department\" size=\"small\" allow-clear class=\"toolbar-select\">\r\n                    <a-option value=\"\">全部科室</a-option><a-option>外科</a-option><a-option>超声</a-option><a-option>急诊培训中心</a-option>\r\n                  </a-select>\r\n                  <a-date-picker v-model=\"borrowFilters.date\" placeholder=\"使用日期\" size=\"small\" class=\"toolbar-date\"></a-date-picker>\r\n                  <a-select v-model=\"borrowFilters.status\" size=\"small\" allow-clear class=\"toolbar-select\">\r\n                    <a-option value=\"\">全部状态</a-option><a-option>待准备</a-option><a-option>准备完成</a-option><a-option>已借出</a-option><a-option>已归还</a-option>\r\n                  </a-select>\r\n                  <div class=\"toolbar-actions\">\r\n                    <a-button size=\"small\" @click=\"borrowFilters = { keyword: '', department: '', date: '', status: '' }\">重置</a-button>\r\n                  </div>\r\n                </div>\r\n\r\n                <!-- Borrow Cards List -->\r\n                <div class=\"usage-card-list\">\r\n                  <article v-for=\"item in displayBorrowUseData\" :key=\"item.id\" class=\"usage-card borrow-card\" :class=\"{'is-overdue': item.status === '超期未还'}\">\r\n                    <div class=\"usage-card-time\">\r\n                      <strong :class=\"{ 'text-danger': item.status === '超期未还' }\">{{ item.dateLabel }}</strong>\r\n                      <span>{{ item.typeLabel }}</span>\r\n                    </div>\r\n                    <div class=\"usage-card-body\">\r\n                      <h4>{{ item.device }}</h4>\r\n                      <p class=\"usage-card-desc\">{{ item.desc }}</p>\r\n                    </div>\r\n                    <a-tag :color=\"item.statusColor\" size=\"small\">{{ item.status }}</a-tag>\r\n                    <div class=\"usage-card-action\">\r\n                      <a-button v-if=\"item.status === '待准备'\" type=\"primary\" size=\"small\" @click=\"showBorrowModal = true\">准备</a-button>\r\n                      <a-button v-else-if=\"item.status === '超期未还'\" type=\"primary\" size=\"small\" status=\"danger\" @click=\"showReturnDrawer = true\">催还</a-button>\r\n                      <a-button v-else-if=\"item.status === '已借出'\" type=\"primary\" size=\"small\" status=\"success\" @click=\"showReturnDrawer = true\">办理归还</a-button>\r\n                      <a-button v-else size=\"small\" @click=\"openTeachingDetail(item)\">查看</a-button>\r\n                    </div>\r\n                  </article>\r\n                </div>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </template>\r\n\r\n        <template v-if=\"activePage === 'repair'\">\r\n          <section class=\"section-card\">\r\n            <div class=\"card-head\"><div><h2><wrench :size=\"16\" class=\"card-icon\"></wrench>维修处理</h2><p>维修管理不做概况卡片，直接按“待报修、维修中、待完成、无法修复”显示列表。</p></div></div>\r\n            <div class=\"toolbar toolbar-spaced\">\r\n              <a-radio-group v-model=\"repairFilters.status\" type=\"button\" size=\"small\" class=\"status-segmented\">\r\n                <a-radio value=\"\">全部</a-radio>\r\n                <a-radio value=\"待维修\">待报修</a-radio>\r\n                <a-radio value=\"维修中\">维修中</a-radio>\r\n                <a-radio value=\"维修成功\">待完成</a-radio>\r\n                <a-radio value=\"维修失败\">无法修复</a-radio>\r\n              </a-radio-group>\r\n              <a-input-search v-model=\"repairFilters.keyword\" placeholder=\"设备名称/维修单号\" size=\"small\" allow-clear class=\"toolbar-search\"></a-input-search>\r\n            </div>\r\n            <div class=\"usage-queue\">\r\n              <article v-for=\"item in filteredRepairWorkQueue\" :key=\"item.title\" :class=\"{ 'is-urgent': item.urgent }\">\r\n                <div class=\"usage-queue-meta\"><span>{{ item.time }}</span><em>{{ item.kind }}</em></div>\r\n                <div class=\"usage-queue-main\"><strong>{{ item.title }}</strong><p>{{ item.desc }}</p></div>\r\n                <a-tag :color=\"item.color\" size=\"small\">{{ item.status }}</a-tag>\r\n                <a-button size=\"mini\" :type=\"item.primary ? 'primary' : 'outline'\" @click=\"item.actionKey === 'create' ? showCreateRepair = true : item.actionKey === 'finish' ? showFinishRepair = true : openRepairQueueDetail(item)\">{{ item.action }}</a-button>\r\n              </article>\r\n            </div>\r\n          </section>\r\n        </template>\r\n\r\n        <template v-if=\"activePage === 'inventory'\">\r\n          <section :class=\"['inventory-layout', { 'has-history': inventoryHistoryExpanded }]\">\r\n            <!-- 左侧：历史盘点列表 (1/4) -->\r\n            <aside class=\"inventory-history\" :class=\"{ visible: inventoryHistoryExpanded }\">\r\n              <div class=\"inventory-card\">\r\n                <div class=\"inventory-card-header\">\r\n                  <div class=\"inventory-card-title\">\r\n                    <scan-line :size=\"14\"></scan-line>\r\n                    <span>历史盘点</span>\r\n                  </div>\r\n                </div>\r\n                <div class=\"inventory-card-body\">\r\n                  <div\r\n                    v-for=\"record in inventoryHistoryList\"\r\n                    :key=\"record.id\"\r\n                    :class=\"['inventory-list-item', { active: activeInventoryRecord && activeInventoryRecord.id === record.id }]\"\r\n                    @click=\"switchInventoryRecord(record)\"\r\n                  >\r\n                    <div class=\"inventory-list-item-main\">\r\n                      <strong>{{ record.name }}</strong>\r\n                      <span>{{ record.dateRange }}</span>\r\n                      <em>{{ record.property }}</em>\r\n                    </div>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n            </aside>\r\n\r\n            <!-- 右侧：盘点结果 -->\r\n            <section class=\"inventory-result\">\r\n              <div class=\"inventory-card\">\r\n                <div class=\"inventory-card-header\">\r\n                  <div class=\"inventory-card-title\">\r\n                    <scan-line :size=\"14\"></scan-line>\r\n                    <span>{{ activeInventoryRecord ? activeInventoryRecord.name : '盘点结果' }}</span>\r\n                  </div>\r\n                  <a-button v-if=\"!inventoryHistoryExpanded\" size=\"small\" type=\"text\" @click=\"inventoryHistoryExpanded = true\">\r\n                    <chevron-right :size=\"14\"></chevron-right>展开历史盘点\r\n                  </a-button>\r\n                  <a-button v-else size=\"small\" type=\"text\" @click=\"inventoryHistoryExpanded = false\">\r\n                    <chevron-left :size=\"14\"></chevron-left>收起历史盘点\r\n                  </a-button>\r\n                </div>\r\n                <template v-if=\"activeInventoryRecord\">\r\n                  <div class=\"inventory-card-body\">\r\n                    <!-- 统计摘要 -->\r\n                    <div class=\"inventory-summary\">\r\n                      应盘 <strong>{{ activeInventoryRecord.total }}</strong> 件，\r\n                      已盘到 <strong>{{ inventoryCheckedCount }}</strong> 件，\r\n                      未盘到 <strong class=\"text-danger\">{{ inventoryMissingCount }}</strong> 件\r\n                    </div>\r\n\r\n                    <!-- 筛选项 -->\r\n                    <div class=\"toolbar toolbar-spaced\">\r\n                      <a-radio-group v-model=\"inventoryResultFilter\" type=\"button\" size=\"small\" class=\"status-segmented\">\r\n                        <a-radio value=\"all\">全部</a-radio>\r\n                        <a-radio value=\"checked\">已盘到</a-radio>\r\n                        <a-radio value=\"missing\">未盘到</a-radio>\r\n                      </a-radio-group>\r\n                    </div>\r\n\r\n                    <!-- 物资列表 -->\r\n                    <div class=\"usage-queue\">\r\n                      <article\r\n                        v-for=\"item in filteredInventoryResultItems\"\r\n                        :key=\"item.code\"\r\n                        :class=\"['inventory-material-row', { 'is-missing': item.inventoryStatus === '未盘到' }]\"\r\n                        @click=\"openInventoryDetail(item)\"\r\n                      >\r\n                        <div class=\"inventory-material-main\">\r\n                          <strong>{{ item.name }}</strong>\r\n                          <span>{{ item.code }}</span>\r\n                        </div>\r\n                        <div class=\"inventory-material-asset\">\r\n                          <span>资产性质</span>\r\n                          <strong>{{ item.assetNature }}</strong>\r\n                        </div>\r\n                        <div class=\"inventory-material-location\">\r\n                          <map-pin :size=\"13\"></map-pin>\r\n                          <span>{{ item.storageLocation }}</span>\r\n                        </div>\r\n                        <a-tag :color=\"inventoryMaterialStatusColor(item.materialStatus)\" size=\"small\">{{ item.materialStatus }}</a-tag>\r\n                        <a-tag :color=\"item.inventoryStatus === '已盘到' ? 'green' : 'red'\" size=\"small\">{{ item.inventoryStatus }}</a-tag>\r\n                      </article>\r\n                    </div>\r\n                  </div>\r\n                </template>\r\n                <template v-else>\r\n                  <div class=\"inventory-empty\">\r\n                    <scan-line :size=\"40\"></scan-line>\r\n                    <p>暂无盘点记录</p>\r\n                    <span>请在手持 APP 创建盘点任务并完成扫码</span>\r\n                  </div>\r\n                </template>\r\n              </div>\r\n            </section>\r\n          </section>\r\n        </template>\r\n\r\n      </main>\r\n\r\n      <a-drawer v-model:visible=\"showSingleInbound\" title=\"单个入库\" :width=\"860\" :footer=\"false\" unmount-on-close>\r\n        <div class=\"drawer-form\">\r\n          <div class=\"drawer-section\">\r\n            <h3>基础信息</h3>\r\n            <div class=\"form-grid\">\r\n              <label><span>物资名称 *</span><a-input v-model=\"singleForm.name\" placeholder=\"例如：儿童 CPR 模型\"></a-input></label>\r\n              <label><span>分类 *</span><category-cascade v-model=\"singleForm.categoryPath\" v-model:input-value=\"newSingleSubCategory\" :options=\"categoryOptions\" :sub-options=\"categorySubOptions\" placeholder=\"选择一级 / 二级分类\" @add=\"addSubCategory(singleForm.categoryPath, newSingleSubCategory, 'newSingleSubCategory', $event)\"></category-cascade></label>\r\n              <label><span>型号 / 规格</span><a-input v-model=\"singleForm.model\" placeholder=\"型号、规格或版本\"></a-input></label>\r\n              <label><span>品牌 / 厂商</span><a-input v-model=\"singleForm.brand\" placeholder=\"例如：Laerdal / Mindray\"></a-input></label>\r\n            </div>\r\n          </div>\r\n          <div class=\"drawer-section\">\r\n            <h3>资产标识</h3>\r\n            <div class=\"form-grid\">\r\n              <label><span>SN 码 *</span><a-input v-model=\"singleForm.sn\" placeholder=\"扫码或手动录入\"></a-input></label>\r\n              <label><span>资产编号</span><a-input v-model=\"singleForm.assetNo\" placeholder=\"系统生成或手动录入\"></a-input></label>\r\n              <label><span>条码 / RFID</span><a-input v-model=\"singleForm.rfid\" placeholder=\"绑定标签编号\"></a-input></label>\r\n              <label><span>是否高价值</span><a-select v-model=\"singleForm.highValue\" :options=\"yesNoOptions\" placeholder=\"选择\"></a-select></label>\r\n            </div>\r\n          </div>\r\n          <div class=\"drawer-section\">\r\n            <h3>存放与责任</h3>\r\n            <div class=\"form-grid\">\r\n              <label><span>库位 *</span><a-select v-model=\"singleForm.location\" :options=\"periodLocationOptions\" placeholder=\"选择库位\"></a-select></label>\r\n              <label><span>责任人 *</span><a-input v-model=\"singleForm.owner\" placeholder=\"经办人或责任老师\"></a-input></label>\r\n              <label><span>所属项目</span><a-input v-model=\"singleForm.project\" placeholder=\"项目采购时填写\"></a-input></label>\r\n              <label><span>可借用</span><a-select v-model=\"singleForm.borrowable\" :options=\"yesNoOptions\" placeholder=\"选择\"></a-select></label>\r\n            </div>\r\n          </div>\r\n          <div class=\"drawer-section\">\r\n            <h3>采购信息</h3>\r\n            <div class=\"form-grid\">\r\n              <label><span>采购日期</span><a-date-picker v-model=\"singleForm.purchaseDate\" placeholder=\"请选择日期\" class=\"full-input\"></a-date-picker></label>\r\n              <label><span>采购金额</span><a-input-number v-model=\"singleForm.price\" :min=\"0\" :precision=\"2\" placeholder=\"0.00\" class=\"full-input\"></a-input-number></label>\r\n              <label><span>供应商</span><a-input v-model=\"singleForm.vendor\" placeholder=\"供应商名称\"></a-input></label>\r\n              <label><span>验收状态</span><a-select v-model=\"singleForm.acceptance\" :options=\"acceptanceOptions\" placeholder=\"选择状态\"></a-select></label>\r\n            </div>\r\n          </div>\r\n          <div class=\"drawer-section\">\r\n            <h3>照片与附件</h3>\r\n            <div class=\"upload-zone\">\r\n              <camera :size=\"30\"></camera>\r\n              <strong>上传资产照片</strong>\r\n              <p>建议入库时拍摄正面、铭牌、附件；后续使用、维修、盘点都能复用。</p>\r\n              <a-button type=\"primary\" size=\"small\">上传照片</a-button>\r\n            </div>\r\n          </div>\r\n          <label class=\"full-field\"><span>备注</span><a-textarea v-model=\"singleForm.note\" placeholder=\"补充验收说明、附件情况或使用限制\" :auto-size=\"{minRows:3,maxRows:4}\"></a-textarea></label>\r\n          <div class=\"modal-hint\"><package-plus :size=\"18\"></package-plus><div><strong>保存后生成物资档案</strong><p>入库只是新增档案动作，保存后该物资会进入使用、维修和盘点流程。</p></div></div>\r\n          <div class=\"drawer-footer\"><a-button @click=\"showSingleInbound = false\">取消</a-button><a-button type=\"primary\" @click=\"showSingleInbound = false\">保存档案</a-button></div>\r\n        </div>\r\n      </a-drawer>\r\n      <a-drawer v-model:visible=\"showBatchInbound\" title=\"批量入库\" :width=\"760\" :footer=\"false\" unmount-on-close>\r\n        <div class=\"drawer-form\">\r\n          <div class=\"drawer-section\">\r\n            <div class=\"card-head\">\r\n              <div>\r\n                <h3>导入模板</h3>\r\n                <p>请先使用标准模板填写物资名称、分类、SN、库位、责任人等字段。</p>\r\n              </div>\r\n              <a-button type=\"outline\" size=\"small\"><file-spreadsheet :size=\"15\"></file-spreadsheet>下载模板</a-button>\r\n            </div>\r\n          </div>\r\n          <div class=\"drawer-section\">\r\n            <h3>上传入库清单</h3>\r\n            <div class=\"upload-zone\">\r\n              <file-spreadsheet :size=\"30\"></file-spreadsheet>\r\n              <strong>上传 Excel / CSV 清单</strong>\r\n              <p>上传后先校验 SN、分类、库位、责任人和必填字段。校验通过后再确认导入。</p>\r\n              <a-button type=\"primary\" size=\"small\">选择文件</a-button>\r\n            </div>\r\n          </div>\r\n          <div class=\"drawer-section\">\r\n            <h3>校验结果</h3>\r\n            <div class=\"upload-result\">\r\n              <article v-for=\"item in batchChecks\" :key=\"item.label\">\r\n                <clipboard-check :size=\"16\"></clipboard-check>\r\n                <div><strong>{{ item.label }}</strong><p>{{ item.desc }}</p></div>\r\n                <a-tag :color=\"item.color\" size=\"small\">{{ item.status }}</a-tag>\r\n              </article>\r\n            </div>\r\n          </div>\r\n          <div class=\"modal-hint\"><file-spreadsheet :size=\"18\"></file-spreadsheet><div><strong>批量导入会生成物资档案</strong><p>适合耗材、同型号设备、项目采购批次。异常数据需修正后再导入。</p></div></div>\r\n          <div class=\"drawer-footer\"><a-button @click=\"showBatchInbound = false\">取消</a-button><a-button type=\"primary\" @click=\"showBatchInbound = false\">确认导入</a-button></div>\r\n        </div>\r\n      </a-drawer>\r\n      <a-drawer v-model:visible=\"showBorrowModal\" title=\"准备借用申请\" :width=\"760\" :footer=\"false\">\r\n        <div class=\"drawer-form\">\r\n          <div class=\"drawer-section\"><h3>申请信息</h3><div class=\"form-grid\"><label><span>借用人</span><a-input v-model=\"borrowForm.person\" placeholder=\"老师 / 科室 / 学员\"></a-input></label><label><span>用途</span><a-select v-model=\"borrowForm.purpose\" :options=\"purposeOptions\" placeholder=\"选择用途\"></a-select></label><label><span>预计领取</span><a-input v-model=\"borrowForm.pickup\" placeholder=\"例如：今日 14:00\"></a-input></label><label><span>预计归还</span><a-input v-model=\"borrowForm.due\" placeholder=\"例如：明日 08:30 前\"></a-input></label></div></div>\r\n          <div class=\"drawer-section\"><h3>准备清单</h3><div class=\"object-list\"><article v-for=\"item in prepareItems\" :key=\"item.name\"><a-checkbox v-model=\"item.checked\"></a-checkbox><div><strong>{{ item.name }}</strong><p>{{ item.desc }}</p></div><a-tag :color=\"item.color\" size=\"small\">{{ item.status }}</a-tag></article></div></div>\r\n          <div class=\"drawer-section\"><h3>图片入口（可选）</h3><div class=\"upload-zone\"><camera :size=\"30\"></camera><strong>上传准备现场或设备状态照片</strong><p>非必填。用于记录设备领取前状态。</p><a-button size=\"small\">上传图片</a-button></div></div>\r\n          <div class=\"modal-hint\"><hand-coins :size=\"18\"></hand-coins><div><strong>准备完成后等待借用人手机签收</strong><p>借用人签字确认领取后，回执单自动进入后台。</p></div></div>\r\n          <div class=\"drawer-footer\"><a-button @click=\"showBorrowModal = false\">取消准备</a-button><a-button type=\"primary\" @click=\"showBorrowModal = false\">准备完成，待签收</a-button></div>\r\n        </div>\r\n      </a-drawer>\r\n      <a-drawer v-model:visible=\"showPrepareDrawer\" title=\"准备课程物资\" :width=\"760\" :footer=\"false\">\r\n        <div class=\"drawer-form\">\r\n          <div class=\"drawer-section\"><h3>课程信息</h3><div class=\"form-grid\"><label><span>课程</span><a-input value=\"急救护理综合实训\" readonly></a-input></label><label><span>上课时间</span><a-input value=\"今天 14:00\" readonly></a-input></label><label><span>教室</span><a-input value=\"3F·302 教室\" readonly></a-input></label><label><span>老师</span><a-input value=\"王芳\" readonly></a-input></label></div></div>\r\n          <div class=\"drawer-section\"><h3>课程备物清单</h3><div class=\"object-list\"><article v-for=\"item in coursePrepareItems\" :key=\"item.name\"><a-checkbox v-model=\"item.checked\"></a-checkbox><div><strong>{{ item.name }}</strong><p>{{ item.desc }}</p></div><a-tag :color=\"item.color\" size=\"small\">{{ item.status }}</a-tag></article></div></div>\r\n          <div class=\"drawer-section\"><h3>图片入口（可选）</h3><div class=\"upload-zone\"><camera :size=\"30\"></camera><strong>上传备物照片</strong><p>非必填。可记录备物状态或替代物资说明。</p><a-button size=\"small\">上传图片</a-button></div></div>\r\n          <div class=\"modal-hint\"><calendar-days :size=\"18\"></calendar-days><div><strong>课程物资由系统自动推送</strong><p>准备完成后等待老师签收，老师签字后进入后台回执。</p></div></div>\r\n          <div class=\"drawer-footer\"><a-button @click=\"showPrepareDrawer = false\">取消</a-button><a-button type=\"primary\" @click=\"showPrepareDrawer = false\">准备完成，待老师签字</a-button></div>\r\n        </div>\r\n      </a-drawer>\r\n      <a-drawer v-model:visible=\"showReturnDrawer\" title=\"归还核对与报损/报修\" :width=\"760\" :footer=\"false\">\r\n        <div class=\"drawer-form\">\r\n          <div class=\"drawer-section\"><h3>归还清点</h3><div class=\"object-list\"><article v-for=\"item in returnCheckItems\" :key=\"item.name\"><a-checkbox v-model=\"item.checked\"></a-checkbox><div><strong>{{ item.name }}</strong><p>{{ item.desc }}</p></div><a-select v-model=\"item.result\" :options=\"returnResultOptions\" size=\"small\" class=\"return-result-select\"></a-select></article></div></div>\r\n          <div class=\"drawer-section\"><h3>图片入口（可选）</h3><div class=\"upload-zone\"><camera :size=\"30\"></camera><strong>上传损坏或缺失照片</strong><p>非必填。损坏、未找到时建议上传，便于转报损或报修。</p><a-button size=\"small\">上传图片</a-button></div></div>\r\n          <div class=\"drawer-section\"><h3>后续处理</h3><div class=\"form-grid\"><label><span>异常处理</span><a-select v-model=\"returnForm.action\" :options=\"returnActionOptions\" placeholder=\"选择处理方式\"></a-select></label><label><span>签字人</span><a-input v-model=\"returnForm.signer\" placeholder=\"借用人 / 老师\"></a-input></label></div></div>\r\n          <div class=\"modal-hint\"><repeat-2 :size=\"18\"></repeat-2><div><strong>手机端签字后生成归还回执</strong><p>损坏可转报修，未找到可进入报损/追踪流程，回执进入后台。</p></div></div>\r\n          <div class=\"drawer-footer\"><a-button @click=\"showReturnDrawer = false\">取消</a-button><a-button type=\"primary\" @click=\"showReturnDrawer = false\">确认归还并归档</a-button></div>\r\n        </div>\r\n      </a-drawer>\r\n      <a-drawer v-model:visible=\"showCreateRepair\" title=\"新建维修单\" :width=\"760\" :footer=\"false\">\r\n        <div class=\"drawer-form\"><div class=\"form-grid\"><label><span>维修单号</span><a-input v-model=\"repairForm.no\" disabled></a-input></label><label><span>经办人</span><a-input v-model=\"repairForm.owner\" disabled></a-input></label><label><span>设备类型 *</span><a-select v-model=\"repairForm.type\" :options=\"typeOptions\" placeholder=\"选择设备类型\"></a-select></label><label><span>维修设备 *</span><a-select v-model=\"repairForm.asset\" :options=\"assetOptions\" placeholder=\"选择设备\"></a-select></label></div><label class=\"full-field\"><span>故障描述 *</span><a-textarea v-model=\"repairForm.desc\" placeholder=\"请描述故障现象、出现时间和是否影响课程\" :auto-size=\"{minRows:3,maxRows:4}\"></a-textarea></label><div class=\"form-grid\"><label><span>紧急程度</span><a-select v-model=\"repairForm.urgent\" :options=\"urgentOptions\" placeholder=\"选择紧急程度\"></a-select></label><label><span>故障照片</span><button type=\"button\" class=\"photo-box\"><upload :size=\"15\"></upload>点击上传</button></label></div><div class=\"drawer-footer\"><a-button @click=\"showCreateRepair = false\">取消</a-button><a-button type=\"primary\" @click=\"showCreateRepair = false\">提交维修单</a-button></div></div>\r\n      </a-drawer>\r\n      <a-drawer v-model:visible=\"showRepairDetail\" title=\"维修单详情\" :width=\"720\" :footer=\"false\">\r\n        <div class=\"detail-grid\" v-if=\"activeOrder\"><span>维修单号</span><strong>{{ activeOrder.no }}</strong><span>经办人</span><strong>{{ activeOrder.owner }}</strong><span>设备类型</span><strong>{{ activeOrder.type }}</strong><span>设备名称</span><strong>{{ activeOrder.asset }}</strong><span>故障描述</span><strong>{{ activeOrder.desc }}</strong><span>紧急程度</span><strong>{{ activeOrder.urgent }}</strong><span>维修状态</span><strong><a-tag :color=\"activeOrder.color\">{{ activeOrder.status }}</a-tag></strong><span>报修时间</span><strong>{{ activeOrder.reportedAt }}</strong><span>来源</span><strong>{{ activeOrder.source }}</strong></div><div class=\"drawer-footer\"><a-button @click=\"showRepairDetail = false\">关闭</a-button><a-button type=\"primary\" @click=\"showRepairDetail = false; showFinishRepair = true\">完成维修</a-button></div>\r\n      </a-drawer>\r\n      <a-drawer v-model:visible=\"showFinishRepair\" title=\"完成维修\" :width=\"720\" :footer=\"false\">\r\n        <div class=\"drawer-form\"><div class=\"form-grid\"><label><span>维修结果 *</span><a-select v-model=\"finishForm.result\" :options=\"resultOptions\" placeholder=\"选择维修结果\"></a-select></label><label><span>维修费用</span><a-input-number v-model=\"finishForm.cost\" :min=\"0\" :precision=\"2\" placeholder=\"0.00\" class=\"full-input\"></a-input-number></label><label><span>维修时间</span><a-date-picker v-model=\"finishForm.date\" placeholder=\"请选择日期\" class=\"full-input\"></a-date-picker></label><label><span>附件上传</span><button type=\"button\" class=\"photo-box\"><upload :size=\"15\"></upload>点击上传</button></label></div><label class=\"full-field\"><span>备注</span><a-textarea v-model=\"finishForm.note\" placeholder=\"记录维修说明、失败原因或后续处理建议\" :auto-size=\"{minRows:3,maxRows:4}\"></a-textarea></label><div class=\"drawer-footer\"><a-button @click=\"showFinishRepair = false\">取消</a-button><a-button type=\"primary\" @click=\"showFinishRepair = false\">提交</a-button></div></div>\r\n      </a-drawer>\r\n      <a-drawer v-model:visible=\"showPeriodDrawer\" title=\"新建周期盘点\" :width=\"860\" :footer=\"false\" unmount-on-close>\r\n        <div class=\"drawer-form\">\r\n          <div class=\"drawer-section\">\r\n            <h3>任务信息</h3>\r\n            <div class=\"form-grid\">\r\n              <label><span>任务名称</span><a-input v-model=\"taskForm.name\" placeholder=\"例如：2026 年 5 月月末盘点\"></a-input></label>\r\n              <label><span>负责人</span><a-input v-model=\"taskForm.owner\" placeholder=\"盘点负责人\"></a-input></label>\r\n              <label><span>完成期限</span><a-date-picker v-model=\"taskForm.deadline\" placeholder=\"请选择日期\" class=\"full-input\"></a-date-picker></label>\r\n              <label><span>下发到</span><a-select v-model=\"taskForm.device\" :options=\"deviceOptions\" placeholder=\"选择手持 APP\"></a-select></label>\r\n            </div>\r\n          </div>\r\n          <div class=\"drawer-section\">\r\n            <h3>筛选盘点对象</h3>\r\n            <div class=\"filter-grid\">\r\n              <a-select v-model=\"periodFilters.categories\" :options=\"categoryOptions\" placeholder=\"物资分类（可多选）\" multiple allow-clear></a-select>\r\n              <a-select v-model=\"periodFilters.locations\" :options=\"periodLocationOptions\" placeholder=\"库位 / 教室（可多选）\" multiple allow-clear></a-select>\r\n              <a-select v-model=\"periodFilters.statuses\" :options=\"periodStatusOptions\" placeholder=\"物资状态（可多选）\" multiple allow-clear></a-select>\r\n              <a-range-picker v-model=\"periodFilters.purchaseRange\" class=\"full-input\"></a-range-picker>\r\n              <a-input-search v-model=\"periodFilters.keyword\" placeholder=\"名称 / SN / 责任人\" allow-clear></a-input-search>\r\n            </div>\r\n            <div class=\"filter-actions\">\r\n              <span class=\"muted\">当前筛选命中 {{ filteredInventoryObjects.length }} 件，可勾选后下发。</span>\r\n              <a-space>\r\n                <a-button size=\"small\" @click=\"savePeriodFilter\">保存筛选项</a-button>\r\n                <a-button size=\"small\" type=\"primary\" @click=\"selectAllInventoryObjects\">选择当前结果</a-button>\r\n              </a-space>\r\n            </div>\r\n          </div>\r\n          <div class=\"drawer-section\" v-if=\"savedPeriodFilters.length\">\r\n            <h3>已保存筛选项</h3>\r\n            <div class=\"saved-filter-list\">\r\n              <button v-for=\"item in savedPeriodFilters\" :key=\"item.name\" type=\"button\" @click=\"applyPeriodFilter(item)\">\r\n                <scan-line :size=\"16\"></scan-line>\r\n                <div><strong>{{ item.name }}</strong><p>{{ item.desc }}</p></div>\r\n                <a-tag color=\"blue\" size=\"small\">套用</a-tag>\r\n              </button>\r\n            </div>\r\n          </div>\r\n          <div class=\"drawer-section\">\r\n            <h3>选择对象</h3>\r\n            <div class=\"object-list\">\r\n              <article v-for=\"item in filteredInventoryObjects.slice(0, 8)\" :key=\"item.sn\">\r\n                <a-checkbox v-model=\"item.checked\"></a-checkbox>\r\n                <div><strong>{{ item.name }}</strong><p>{{ item.sn }} · {{ item.category }} · {{ item.location }} · {{ item.owner }} · 采购 {{ item.purchaseDate }}</p></div>\r\n                <a-tag :color=\"item.color\" size=\"small\">{{ item.status }}</a-tag>\r\n              </article>\r\n            </div>\r\n          </div>\r\n          <div class=\"modal-hint\"><smartphone :size=\"18\"></smartphone><div><strong>创建后下发到手持 APP</strong><p>现场通过扫码逐个核验物资是否在库、位置是否正确、状态是否正常。</p></div></div>\r\n          <div class=\"drawer-footer\"><a-button @click=\"showPeriodDrawer = false\">取消</a-button><a-button type=\"primary\" @click=\"showPeriodDrawer = false\">创建并下发</a-button></div>\r\n        </div>\r\n      </a-drawer>\r\n\r\n      <a-drawer v-model:visible=\"showProjectModal\" title=\"新建项目盘点\" :width=\"760\" :footer=\"false\">\r\n        <div class=\"modal-form\">\r\n          <div class=\"form-grid\">\r\n            <label><span>任务名称</span><a-input v-model=\"taskForm.name\" placeholder=\"例如：国家基金项目中期检查\"></a-input></label>\r\n            <label><span>负责人</span><a-input v-model=\"taskForm.owner\" placeholder=\"盘点负责人\"></a-input></label>\r\n            <label><span>项目类型</span><a-select v-model=\"taskForm.projectType\" :options=\"projectTypeOptions\" placeholder=\"选择项目类型\"></a-select></label>\r\n            <label><span>完成期限</span><a-date-picker v-model=\"taskForm.deadline\" placeholder=\"请选择日期\" class=\"full-input\"></a-date-picker></label>\r\n          </div>\r\n          <div class=\"upload-zone\">\r\n            <file-spreadsheet :size=\"30\"></file-spreadsheet>\r\n            <strong>上传固定清单</strong>\r\n            <p>支持 Excel / CSV。上传后清单会保存到服务器，后续项目中期、结题检查可复用。</p>\r\n            <a-button type=\"primary\" size=\"small\">选择清单文件</a-button>\r\n          </div>\r\n          <div class=\"upload-result\">\r\n            <article v-for=\"item in projectUploadChecks\" :key=\"item.label\">\r\n              <clipboard-check :size=\"16\"></clipboard-check>\r\n              <div><strong>{{ item.label }}</strong><p>{{ item.desc }}</p></div>\r\n              <a-tag :color=\"item.color\" size=\"small\">{{ item.status }}</a-tag>\r\n            </article>\r\n          </div>\r\n          <div class=\"modal-hint\"><smartphone :size=\"18\"></smartphone><div><strong>固定清单下发</strong><p>APP 只核验清单内物资，不扫描全中心库存。上传清单保存后会生成项目盘点范围。</p></div></div>\r\n          <div class=\"modal-actions\"><a-button @click=\"showProjectModal = false\">取消</a-button><a-button type=\"primary\" @click=\"showProjectModal = false\">保存清单并下发</a-button></div>\r\n        </div>\r\n      </a-drawer>\r\n    </div>\r\n\r\n      <!-- Teaching Use Detail Modal -->\r\n      <a-drawer v-model:visible=\"showTeachingDetail\" title=\"教学使用详情\" :width=\"720\" :footer=\"false\">\r\n        <div class=\"drawer-form\" v-if=\"activeTeachingRecord\">\r\n          <div class=\"drawer-section\"><h3 class=\"drawer-section-title-primary\">课程信息</h3>\r\n            <div class=\"detail-grid\"><span>课程名称</span><strong>{{ activeTeachingRecord.course }}</strong><span>科室</span><strong>{{ activeTeachingRecord.department }}</strong><span>领用人</span><strong>{{ activeTeachingRecord.teacher }}</strong><span>上课教室</span><strong>{{ activeTeachingRecord.classroom }}</strong><span>上课时间</span><strong>{{ activeTeachingRecord.classTime }}</strong><span>状态</span><strong><a-tag :color=\"activeTeachingRecord.statusColor\" size=\"small\">{{ activeTeachingRecord.status }}</a-tag></strong></div>\r\n          </div>\r\n          <div class=\"drawer-section\"><h3 class=\"drawer-section-title-primary\">物资需求明细</h3>\r\n            <a-table :data=\"[{type:'模型',name:'儿童CPR模型（20140455）',qty:'1台'},{type:'设备',name:'按压反馈系统（20240591）',qty:'1台'},{type:'耗材',name:'无菌手套（L）',qty:'20个'},{type:'耗材',name:'注射器（10ml）',qty:'10支'}]\" :bordered=\"false\" :pagination=\"false\" size=\"small\">\r\n              <template #columns>\r\n                <a-table-column title=\"类型\" :width=\"80\"><template #cell=\"{ record }\"><a-tag color=\"blue\" size=\"small\">{{ record.type }}</a-tag></template></a-table-column>\r\n                <a-table-column title=\"物资名称\" data-index=\"name\"></a-table-column>\r\n                <a-table-column title=\"数量\" data-index=\"qty\" :width=\"80\" align=\"center\"></a-table-column>\r\n              </template>\r\n            </a-table>\r\n          </div>\r\n          <div class=\"drawer-footer\"><a-button @click=\"showTeachingDetail = false\">关闭</a-button></div>\r\n        </div>\r\n      </a-drawer>\r\n\r\n      <!-- Teaching Prepare Modal -->\r\n      <a-drawer v-model:visible=\"showTeachingPrepare\" title=\"去准备 - 教学使用\" :width=\"960\" placement=\"right\" :footer=\"false\">\r\n        <div class=\"drawer-form\" v-if=\"activeTeachingRecord\">\r\n          <div class=\"drawer-section\"><h3 class=\"drawer-section-title-primary\">基础信息</h3>\r\n            <div class=\"detail-grid\"><span>教学使用编号</span><strong>TU-2604210001</strong><span>课程名称</span><strong>{{ activeTeachingRecord.course }}</strong><span>领用人</span><strong>{{ activeTeachingRecord.teacher }}</strong><span>科室</span><strong>{{ activeTeachingRecord.department }}</strong><span>上课教室</span><strong>{{ activeTeachingRecord.classroom }}</strong><span>上课时间</span><strong>{{ activeTeachingRecord.classTime }}</strong></div>\r\n          </div>\r\n          <div class=\"drawer-section prepare-section\">\r\n            <div class=\"prepare-section-head\">\r\n              <h3 class=\"drawer-section-title-primary\">申领物资清单 — 设备/模型</h3>\r\n              <a-button size=\"small\" type=\"outline\" @click=\"addTeachingPrepareDevice\"><template #icon><package-plus :size=\"14\"></package-plus></template>增加设备</a-button>\r\n            </div>\r\n            <div class=\"prepare-editor device-editor\">\r\n              <div class=\"prepare-editor-head\">\r\n                <span>设备类型</span>\r\n                <span>设备名称</span>\r\n                <span>数量</span>\r\n                <span>当前状态</span>\r\n                <span>是否可用</span>\r\n                <span>操作</span>\r\n              </div>\r\n              <div v-for=\"(item, index) in teachingPrepareDevices\" :key=\"item.id\" class=\"prepare-editor-row\">\r\n                <a-select v-model=\"item.type\" size=\"small\" :options=\"prepareDeviceTypeOptions\" placeholder=\"选择/新增类型\" allow-search allow-create></a-select>\r\n                <a-input v-model=\"item.name\" size=\"small\" placeholder=\"请输入设备名称 / 编码\"></a-input>\r\n                <a-input-number v-model=\"item.qty\" size=\"small\" :min=\"1\" :max=\"99\" class=\"prepare-qty-input\"></a-input-number>\r\n                <a-tag :color=\"item.state === '正常' ? 'green' : 'orange'\" size=\"small\">{{ item.state }}</a-tag>\r\n                <span :class=\"item.avail.includes('可用') ? 'text-success' : 'text-warning'\">{{ item.avail }}</span>\r\n                <a-button type=\"text\" status=\"danger\" size=\"mini\" :disabled=\"teachingPrepareDevices.length === 1\" @click=\"removeTeachingPrepareDevice(index)\">\r\n                  <trash-2 :size=\"14\"></trash-2>\r\n                </a-button>\r\n              </div>\r\n            </div>\r\n          </div>\r\n          <div class=\"drawer-section prepare-section\">\r\n            <div class=\"prepare-section-head\">\r\n              <h3 class=\"drawer-section-title-primary\">申领物资清单 — 耗材</h3>\r\n              <a-button size=\"small\" type=\"outline\" @click=\"addTeachingPrepareConsumable\"><template #icon><package-plus :size=\"14\"></package-plus></template>增加耗材</a-button>\r\n            </div>\r\n            <div class=\"prepare-editor consumable-editor\">\r\n              <div class=\"prepare-editor-head\">\r\n                <span>耗材分类</span>\r\n                <span>耗材名称</span>\r\n                <span>数量需求</span>\r\n                <span>当前库存</span>\r\n                <span>是否可用</span>\r\n                <span>操作</span>\r\n              </div>\r\n              <div v-for=\"(item, index) in teachingPrepareConsumables\" :key=\"item.id\" class=\"prepare-editor-row\">\r\n                <a-select v-model=\"item.cat\" size=\"small\" :options=\"prepareConsumableTypeOptions\" placeholder=\"选择/新增分类\" allow-search allow-create></a-select>\r\n                <a-input v-model=\"item.name\" size=\"small\" placeholder=\"请输入耗材名称 / 规格\"></a-input>\r\n                <a-input-number v-model=\"item.need\" size=\"small\" :min=\"1\" :max=\"999\" class=\"prepare-qty-input\"></a-input-number>\r\n                <span :class=\"{ 'text-warning': item.stock < item.need * 3 }\">{{ item.stock }}<alert-triangle v-if=\"item.stock < item.need * 3\" :size=\"13\"></alert-triangle></span>\r\n                <span :class=\"item.stock >= item.need ? 'text-success' : 'text-danger'\">{{ item.stock >= item.need ? '可用' : '不足' }}</span>\r\n                <a-button type=\"text\" status=\"danger\" size=\"mini\" :disabled=\"teachingPrepareConsumables.length === 1\" @click=\"removeTeachingPrepareConsumable(index)\">\r\n                  <trash-2 :size=\"14\"></trash-2>\r\n                </a-button>\r\n              </div>\r\n            </div>\r\n          </div>\r\n          <div class=\"drawer-section\"><h3 class=\"drawer-section-title-primary\">图片上传入口</h3>\r\n            <div class=\"upload-zone\"><camera :size=\"30\"></camera><strong>上传备物照片</strong><p>可上传准备现场、设备状态或耗材摆放照片，便于任课老师提前确认。</p><a-button size=\"small\">上传图片</a-button></div>\r\n          </div>\r\n          <div class=\"modal-hint\"><bell :size=\"18\"></bell><div><strong>确认准备会通知任课老师</strong><p>提交后系统会提醒任课老师查看备物情况，并等待老师到场签收。</p></div></div>\r\n          <div class=\"drawer-footer\"><a-button @click=\"showTeachingPrepare = false\">取消</a-button><a-button type=\"primary\" status=\"success\" @click=\"showTeachingPrepare = false\"><circle-check :size=\"14\"></circle-check> 确认准备并通知老师</a-button></div>\r\n        </div>\r\n      </a-drawer>\r\n\r\n      <!-- Teaching Check Modal -->\r\n      <a-drawer v-model:visible=\"showTeachingCheck\" title=\"去核对 - 教学使用\" :width=\"720\" :footer=\"false\">\r\n        <div class=\"drawer-form\" v-if=\"activeTeachingRecord\">\r\n          <div class=\"modal-hint warning-hint\"><alert-triangle :size=\"16\" class=\"text-warning\"></alert-triangle><div><p class=\"hint-text\">物资管理员可直接勾选设备/模型是否正常。勾选\"正常\"后设备完成入库并保持原状态；勾选\"不正常\"后设备完成入库，系统自动将设备状态更新为\"待维修\"。</p></div></div>\r\n          <div class=\"drawer-section\"><h3 class=\"drawer-section-title-primary\">设备/模型核对</h3>\r\n            <a-table :data=\"[{name:'腹腔镜训练系统（20180424）',state:'正常',normal:true}]\" :bordered=\"false\" :pagination=\"false\" size=\"small\">\r\n              <template #columns>\r\n                <a-table-column title=\"设备名称\" data-index=\"name\"></a-table-column>\r\n                <a-table-column title=\"原状态\" :width=\"80\"><template #cell=\"{ record }\"><a-tag color=\"green\" size=\"small\">{{ record.state }}</a-tag></template></a-table-column>\r\n                <a-table-column title=\"使用是否正常\" :width=\"160\"><template #cell><a-radio-group default-value=\"normal\"><a-radio value=\"normal\">正常</a-radio><a-radio value=\"abnormal\">不正常</a-radio></a-radio-group></template></a-table-column>\r\n              </template>\r\n            </a-table>\r\n          </div>\r\n          <div class=\"drawer-section\"><h3 class=\"drawer-section-title-primary\">耗材用量核对</h3>\r\n            <a-table :data=\"[{name:'模拟血管套件',need:5,actual:5}]\" :bordered=\"false\" :pagination=\"false\" size=\"small\">\r\n              <template #columns>\r\n                <a-table-column title=\"耗材名称\" data-index=\"name\"></a-table-column>\r\n                <a-table-column title=\"需求数量\" data-index=\"need\" :width=\"100\" align=\"center\"></a-table-column>\r\n                <a-table-column title=\"实际用量\" :width=\"160\"><template #cell=\"{ record }\"><a-input-number :default-value=\"record.actual\" :min=\"0\" size=\"small\" class=\"usage-number-input\"></a-input-number></template></a-table-column>\r\n              </template>\r\n            </a-table>\r\n          </div>\r\n          <div class=\"drawer-footer\"><a-button @click=\"showTeachingCheck = false\">取消</a-button><a-button type=\"primary\" status=\"success\" @click=\"showTeachingCheck = false\"><circle-check :size=\"14\"></circle-check> 确认核对</a-button></div>\r\n        </div>\r\n      </a-drawer>\r\n\r\n      <!-- Inbound Drawer (设备/耗材) -->\r\n      <a-drawer v-model:visible=\"showInboundDrawer\" :width=\"860\" :footer=\"false\" unmount-on-close>\r\n        <template #title>\r\n          <div class=\"drawer-title-row\">\r\n            <div class=\"drawer-title-main\">\r\n              <a-button v-if=\"inboundBatchMode\" type=\"text\" size=\"mini\" @click=\"backInboundForm\"><chevron-left :size=\"14\"></chevron-left></a-button>\r\n              <span>{{ inboundBatchMode ? '批量上传入库' : '入库' }}</span>\r\n            </div>\r\n          </div>\r\n        </template>\r\n        <div class=\"drawer-form\">\r\n          <template v-if=\"inboundBatchMode\">\r\n            <div class=\"drawer-section batch-step-section\">\r\n              <h3>上传设备/耗材清单</h3>\r\n              <div class=\"upload-zone batch-upload-zone\" :class=\"{ ready: inboundBatchRows.length }\" @click=\"triggerInboundBatchFile\">\r\n                <upload-cloud :size=\"30\"></upload-cloud>\r\n                <strong>{{ inboundBatchFileName || 'AI 自动解析 Excel / CSV 文件' }}</strong>\r\n                <p>{{ inboundBatchParsing ? 'AI 正在解析字段并匹配系统结构...' : '支持 .xlsx、.xls、.csv，系统会自动识别名称、编码、分类、库位、数量等字段。' }}</p>\r\n                <div class=\"upload-actions\">\r\n                  <a-button type=\"primary\" size=\"small\" :loading=\"inboundBatchParsing\"><upload :size=\"14\"></upload> 选择文件</a-button>\r\n                </div>\r\n                <input ref=\"inboundBatchInput\" class=\"hidden-file-input\" type=\"file\" accept=\".xlsx,.xls,.csv\" @change=\"handleInboundBatchFile\">\r\n              </div>\r\n            </div>\r\n            <div class=\"drawer-section\" v-if=\"inboundBatchRows.length || inboundBatchErrors.length\">\r\n              <div class=\"batch-result-head\">\r\n                <div>\r\n                  <h3>AI 解析结果</h3>\r\n                  <p>共识别 {{ inboundBatchRows.length }} 条可导入数据，{{ inboundBatchErrors.length }} 条需要修正。</p>\r\n                </div>\r\n                <a-space>\r\n                  <a-tag color=\"green\">可导入 {{ inboundBatchRows.length }}</a-tag>\r\n                  <a-tag v-if=\"inboundBatchErrors.length\" color=\"orange\">待修正 {{ inboundBatchErrors.length }}</a-tag>\r\n                </a-space>\r\n              </div>\r\n              <a-table :data=\"inboundBatchRows\" :bordered=\"false\" :pagination=\"{ pageSize: 6 }\" size=\"small\" row-key=\"previewId\">\r\n                <template #columns>\r\n                  <a-table-column title=\"名称\" data-index=\"name\"></a-table-column>\r\n                  <a-table-column title=\"编码/批次\" :width=\"120\"><template #cell=\"{ record }\">{{ record.code || record.id }}</template></a-table-column>\r\n                  <a-table-column title=\"分类\" :width=\"100\"><template #cell=\"{ record }\">{{ record.category || record.subCategory }}</template></a-table-column>\r\n                  <a-table-column title=\"规格/型号\" :width=\"120\"><template #cell=\"{ record }\">{{ record.spec || record.brandModel }}</template></a-table-column>\r\n                  <a-table-column title=\"数量/库存\" :width=\"100\" align=\"center\"><template #cell=\"{ record }\">{{ record.stock || record.quantity || 1 }}{{ record.unit || '' }}</template></a-table-column>\r\n                  <a-table-column title=\"库位\" :width=\"120\"><template #cell=\"{ record }\">{{ record.location || record.homeLocation }}</template></a-table-column>\r\n                </template>\r\n              </a-table>\r\n              <div class=\"batch-error-list\" v-if=\"inboundBatchErrors.length\">\r\n                <strong>需要修正的数据</strong>\r\n                <p v-for=\"item in inboundBatchErrors\" :key=\"item.row\">第 {{ item.row }} 行：{{ item.reason }}</p>\r\n              </div>\r\n            </div>\r\n            <div class=\"drawer-footer\">\r\n              <a-button @click=\"backInboundForm\">返回</a-button>\r\n              <a-button type=\"primary\" :disabled=\"!inboundBatchRows.length\" @click=\"confirmInboundBatchImport\">确认导入</a-button>\r\n            </div>\r\n          </template>\r\n          <template v-else>\r\n          <div class=\"inbound-tabs-head\">\r\n            <a-tabs v-model:active-key=\"inboundType\" class=\"modern-tabs inbound-type-tabs\">\r\n            <a-tab-pane key=\"device\" title=\"设备（模型/医疗设备/多媒体设备/其他设备）\">\r\n              <div class=\"drawer-section\"><h3>入库信息</h3>\r\n                <div class=\"form-grid\">\r\n                  <label><span>设备名称 *</span><a-input placeholder=\"请输入模型名称\"></a-input></label>\r\n                  <label><span>设备编码 *（唯一一物一码）</span><a-input placeholder=\"请输入设备编码\"></a-input></label>\r\n                  <label><span>设备S/N码</span><a-input placeholder=\"请输入SN码\"></a-input></label>\r\n                  <label><span>品牌/型号</span><a-input placeholder=\"请输入品牌/型号\"></a-input></label>\r\n                  <label><span>供应商 / 联系电话</span><a-input placeholder=\"供应商名称 / 电话\"></a-input></label>\r\n                  <label><span>单价</span><a-input-number :min=\"0\" :precision=\"2\" placeholder=\"0.00\" class=\"full-input\"></a-input-number></label>\r\n                  <label><span>采购日期</span><a-date-picker placeholder=\"yyyy/mm/dd\" class=\"full-input\"></a-date-picker></label>\r\n                  <label><span>质保到期时间</span><a-date-picker placeholder=\"yyyy/mm/dd\" class=\"full-input\"></a-date-picker></label>\r\n                  <label><span>报废年限</span><a-input placeholder=\"如：10年\"></a-input></label>\r\n                </div>\r\n              </div>\r\n              <div class=\"drawer-section\"><h3>保管信息/扩展信息</h3>\r\n                <div class=\"form-grid\">\r\n                  <label><span>分类</span><category-cascade v-model=\"inboundDeviceCategoryPath\" v-model:input-value=\"newInboundDeviceSubCategory\" :options=\"categoryOptions\" :sub-options=\"categorySubOptions\" placeholder=\"选择一级 / 二级分类\" @add=\"addSubCategory(inboundDeviceCategoryPath, newInboundDeviceSubCategory, 'newInboundDeviceSubCategory', $event)\"></category-cascade></label>\r\n                  <label><span>存放地点</span><a-select placeholder=\"教培\" :options=\"periodLocationOptions\"></a-select></label>\r\n                  <label><span>使用科室</span><a-input placeholder=\"请输入使用科室\"></a-input></label>\r\n                  <label><span>状态</span><a-select :options=\"materialStatusOptions\" placeholder=\"空闲可用\"></a-select></label>\r\n                  <label><span>图片上传</span><button type=\"button\" class=\"photo-box\"><upload :size=\"15\"></upload>选择文件</button></label>\r\n                  <label><span>备注</span><a-input placeholder=\"请输入用途说明\"></a-input></label>\r\n                </div>\r\n              </div>\r\n            </a-tab-pane>\r\n            <a-tab-pane key=\"consumable\" title=\"耗材\">\r\n              <div class=\"drawer-section\"><h3>耗材基本信息</h3>\r\n                <div class=\"form-grid\">\r\n                  <label><span>耗材名称 *</span><a-input placeholder=\"请输入耗材名称\"></a-input></label>\r\n                  <label><span>品牌/型号</span><a-input placeholder=\"请输入品牌/型号\"></a-input></label>\r\n                  <label><span>供应商 / 联系电话</span><a-input placeholder=\"供应商名称 / 电话\"></a-input></label>\r\n                  <label><span>单价</span><a-input-number :min=\"0\" :precision=\"2\" placeholder=\"0.00\" class=\"full-input\"></a-input-number></label>\r\n                  <label><span>入库数量 *</span><a-input placeholder=\"请输入入库数量\"></a-input></label>\r\n                  <label><span>采购日期</span><a-date-picker placeholder=\"yyyy/mm/dd\" class=\"full-input\"></a-date-picker></label>\r\n                  <label><span>备注说明</span><a-input placeholder=\"请输入备注\"></a-input></label>\r\n                </div>\r\n              </div>\r\n              <div class=\"drawer-section\"><h3>扩展信息 / 保管信息（非必填）</h3>\r\n                <div class=\"form-grid\">\r\n                <label><span>耗材分类</span><category-cascade v-model=\"inboundConsumableCategoryPath\" v-model:input-value=\"newInboundConsumableSubCategory\" :options=\"categoryOptions\" :sub-options=\"categorySubOptions\" placeholder=\"耗材 / 二级分类\" @add=\"addSubCategory(inboundConsumableCategoryPath, newInboundConsumableSubCategory, 'newInboundConsumableSubCategory', $event)\"></category-cascade></label>\r\n                  <label><span>仓库/存放地点</span><a-select :options=\"periodLocationOptions\" placeholder=\"仓库A\"></a-select></label>\r\n                  <label><span>领用负责科室</span><a-input placeholder=\"请输入科室\"></a-input></label>\r\n                  <label><span>物料用途</span><a-input placeholder=\"请输入用途\"></a-input></label>\r\n                  <label><span>耗材类型</span><a-select :options=\"['一次性耗材','可回收耗材']\" placeholder=\"一次性耗材\"></a-select></label>\r\n                  <label><span>安全库存阈值（库存预警）</span><a-input-number :min=\"0\" placeholder=\"100\" class=\"full-input\"></a-input-number></label>\r\n                  <label><span>图片上传</span><button type=\"button\" class=\"photo-box\"><upload :size=\"15\"></upload>选择文件</button></label>\r\n                </div>\r\n              </div>\r\n            </a-tab-pane>\r\n            </a-tabs>\r\n            <a-button class=\"inbound-tabs-upload\" type=\"primary\" size=\"small\" @click.stop=\"openInboundBatchPage\"><upload-cloud :size=\"14\"></upload-cloud> 批量上传</a-button>\r\n          </div>\r\n          <div class=\"drawer-footer\"><a-button @click=\"showInboundDrawer = false\">取消</a-button><a-button type=\"primary\" @click=\"showInboundDrawer = false\">确认入库</a-button></div>\r\n          </template>\r\n        </div>\r\n      </a-drawer>\r\n\r\n      <!-- Inventory Task Detail Modal -->\r\n      <a-drawer v-model:visible=\"showInventoryDetail\" title=\"盘点任务详情\" :width=\"760\" :footer=\"false\">\r\n        <div class=\"drawer-form\" v-if=\"activeInventoryTask\">\r\n          <div class=\"drawer-section\"><h3>任务信息</h3>\r\n            <div class=\"detail-grid\"><span>任务名称</span><strong>{{ activeInventoryTask.title }}</strong><span>类型</span><strong>{{ activeInventoryTask.kind }}</strong><span>进度</span><strong>{{ activeInventoryTask.progress }}</strong><span>状态</span><strong><a-tag :color=\"activeInventoryTask.color\" size=\"small\">{{ activeInventoryTask.status }}</a-tag></strong></div>\r\n          </div>\r\n          <div class=\"drawer-section\"><h3>盘点清单</h3>\r\n            <a-table :data=\"inventoryObjects.slice(0,5)\" :bordered=\"false\" :pagination=\"false\" size=\"small\">\r\n              <template #columns>\r\n                <a-table-column title=\"物资名称\" data-index=\"name\"></a-table-column>\r\n                <a-table-column title=\"SN\" data-index=\"sn\" :width=\"100\"></a-table-column>\r\n                <a-table-column title=\"分类\" data-index=\"category\" :width=\"80\"></a-table-column>\r\n                <a-table-column title=\"位置\" data-index=\"location\" :width=\"100\"></a-table-column>\r\n                <a-table-column title=\"状态\" :width=\"80\"><template #cell=\"{ record }\"><a-tag :color=\"record.color\" size=\"small\">{{ record.status }}</a-tag></template></a-table-column>\r\n              </template>\r\n            </a-table>\r\n          </div>\r\n          <div class=\"drawer-footer\"><a-button @click=\"showInventoryDetail = false\">关闭</a-button></div>\r\n        </div>\r\n      </a-drawer>\r\n\r\n      <a-drawer v-model:visible=\"showConsumableStockDrawer\" title=\"库存变动记录\" :width=\"720\" :footer=\"false\">\r\n        <div class=\"drawer-form\" v-if=\"activeConsumableRecord\">\r\n          <div class=\"modal-hint\"><bar-chart-3 :size=\"18\"></bar-chart-3><div><strong>记录每一次入库、领用、损耗、盘点变更，确保库存数据全程可追溯。</strong></div></div>\r\n          <div class=\"drawer-section\">\r\n            <a-table :data=\"activeConsumableStockRecords\" :bordered=\"false\" :pagination=\"false\" size=\"small\">\r\n              <template #columns>\r\n                <a-table-column title=\"时间\" data-index=\"time\" :width=\"150\"></a-table-column>\r\n                <a-table-column title=\"变动类型\" :width=\"110\"><template #cell=\"{ record }\"><a-tag :color=\"record.color\" size=\"small\">{{ record.type }}</a-tag></template></a-table-column>\r\n                <a-table-column title=\"变动数量\" :width=\"100\" align=\"center\"><template #cell=\"{ record }\"><span :class=\"{ 'text-success': record.qty > 0, 'text-danger': record.qty < 0 }\">{{ record.qty > 0 ? '+' : '' }}{{ record.qty }}</span></template></a-table-column>\r\n                <a-table-column title=\"变动后库存\" data-index=\"after\" :width=\"110\" align=\"center\"></a-table-column>\r\n                <a-table-column title=\"操作人\" data-index=\"operator\" :width=\"90\"></a-table-column>\r\n                <a-table-column title=\"备注\" data-index=\"remark\"></a-table-column>\r\n              </template>\r\n            </a-table>\r\n          </div>\r\n        </div>\r\n      </a-drawer>\r\n\r\n      <!-- Archive Detail Drawer (no mask) -->\r\n      <a-drawer v-model:visible=\"showArchiveDetail\" :title=\"activeRecord ? activeRecord.name : '物资详情'\" :width=\"860\" :footer=\"false\">\r\n        <div class=\"drawer-form\" v-if=\"activeRecord\">\r\n          \r\n          <template v-if=\"inboundTab !== 'consumable'\">\r\n            <div class=\"drawer-section\"><h3>档案信息</h3>\r\n              <div class=\"form-grid\">\r\n                <label><span>设备名称 *</span><a-input v-model=\"activeRecord.name\" placeholder=\"请输入模型名称\"></a-input></label>\r\n                <label><span>设备编码 *（唯一一物一码）</span><a-input v-model=\"activeRecord.code\" placeholder=\"请输入设备编码\"></a-input></label>\r\n                <label><span>设备S/N码</span><a-input v-model=\"activeRecord.sn\" placeholder=\"请输入SN码\"></a-input></label>\r\n                <label><span>品牌/型号</span><a-input v-model=\"activeRecord.brandModel\" placeholder=\"请输入品牌/型号\"></a-input></label>\r\n                <label><span>供应商 / 联系电话</span><a-input v-model=\"activeRecord.vendor\" placeholder=\"供应商名称 / 电话\"></a-input></label>\r\n                <label><span>单价</span><a-input-number v-model=\"activeRecord.price\" :min=\"0\" :precision=\"2\" placeholder=\"0.00\" class=\"full-input\"></a-input-number></label>\r\n                <label><span>采购日期</span><a-date-picker v-model=\"activeRecord.purchaseDate\" placeholder=\"yyyy/mm/dd\" class=\"full-input\"></a-date-picker></label>\r\n                <label><span>质保到期时间</span><a-date-picker v-model=\"activeRecord.warrantyEnd\" placeholder=\"yyyy/mm/dd\" class=\"full-input\"></a-date-picker></label>\r\n                <label><span>报废年限</span><a-input v-model=\"activeRecord.scrapYears\" placeholder=\"如：10年\"></a-input></label>\r\n              </div>\r\n            </div>\r\n            <div class=\"drawer-section\"><h3>保管信息/扩展信息</h3>\r\n              <div class=\"form-grid\">\r\n                <label><span>分类</span><category-cascade v-model=\"activeRecord.categoryPath\" v-model:input-value=\"newArchiveSubCategory\" :options=\"categoryOptions\" :sub-options=\"categorySubOptions\" placeholder=\"选择一级 / 二级分类\" @change=\"handleActiveRecordCategoryChange\" @add=\"addSubCategory(activeRecord.categoryPath, newArchiveSubCategory, 'newArchiveSubCategory', $event)\"></category-cascade></label>\r\n                <label><span>存放地点</span><a-select v-model=\"activeRecord.homeLocation\" placeholder=\"存放地点\" :options=\"['技能中心A','技能中心B','3F·仓库','3F·302教室','4F·模拟手术室A','5F·腔镜训练室','机房中控室']\"></a-select></label>\r\n                <label><span>当前位置</span><a-input v-model=\"activeRecord.currentLocation\" placeholder=\"当前位置\"></a-input></label>\r\n                <label><span>使用次数</span><a-input-number v-model=\"activeRecord.usageCount\" :min=\"0\" placeholder=\"0\" class=\"full-input\"></a-input-number></label>\r\n                <label><span>使用科室</span><a-input v-model=\"activeRecord.department\" placeholder=\"请输入使用科室\"></a-input></label>\r\n                <label><span>状态</span><a-select v-model=\"activeRecord.status\" :options=\"materialStatusOptions\" placeholder=\"状态\"></a-select></label>\r\n                <label class=\"full-field\"><span>图片</span>\r\n                  <div class=\"detail-photo-row\">\r\n                    <img v-if=\"activeRecord.image\" :src=\"activeRecord.image\" class=\"detail-photo-preview\" />\r\n                    <button type=\"button\" class=\"photo-box detail-photo-upload\"><upload :size=\"15\"></upload><span>上传/更换图片</span></button>\r\n                  </div>\r\n                </label>\r\n                <label class=\"full-field\"><span>备注</span><a-input v-model=\"activeRecord.note\" placeholder=\"请输入用途说明\"></a-input></label>\r\n              </div>\r\n            </div>\r\n          </template>\r\n\r\n          <template v-else>\r\n            <div class=\"drawer-section\"><h3>耗材基本信息</h3>\r\n              <div class=\"form-grid\">\r\n                <label><span>耗材名称 *</span><a-input v-model=\"activeRecord.name\" placeholder=\"请输入耗材名称\"></a-input></label>\r\n                <label><span>品牌/型号</span><a-input v-model=\"activeRecord.spec\" placeholder=\"请输入品牌/型号\"></a-input></label>\r\n                <label><span>供应商 / 联系电话</span><a-input v-model=\"activeRecord.vendor\" placeholder=\"供应商名称 / 电话\"></a-input></label>\r\n                <label><span>单价</span><a-input-number v-model=\"activeRecord.price\" :min=\"0\" :precision=\"2\" placeholder=\"0.00\" class=\"full-input\"></a-input-number></label>\r\n                <label><span>当前库存 *</span><a-input v-model=\"activeRecord.stock\" placeholder=\"请输入当前库存\"></a-input></label>\r\n                <label><span>采购日期</span><a-date-picker v-model=\"activeRecord.purchaseDate\" placeholder=\"yyyy/mm/dd\" class=\"full-input\"></a-date-picker></label>\r\n                <label><span>安全库存</span><a-input-number v-model=\"activeRecord.min\" :min=\"0\" placeholder=\"0\" class=\"full-input\"></a-input-number></label>\r\n                <label><span>备注说明</span><a-input v-model=\"activeRecord.note\" placeholder=\"请输入备注\"></a-input></label>\r\n              </div>\r\n            </div>\r\n            <div class=\"drawer-section\"><h3>扩展信息 / 保管信息（非必填）</h3>\r\n              <div class=\"form-grid\">\r\n                <label><span>耗材分类</span><category-cascade v-model=\"activeRecord.categoryPath\" v-model:input-value=\"newArchiveSubCategory\" :options=\"categoryOptions\" :sub-options=\"categorySubOptions\" placeholder=\"耗材 / 二级分类\" @change=\"handleActiveRecordCategoryChange\" @add=\"addSubCategory(activeRecord.categoryPath, newArchiveSubCategory, 'newArchiveSubCategory', $event)\"></category-cascade></label>\r\n                <label><span>仓库/存放地点</span><a-select v-model=\"activeRecord.location\" :options=\"['仓库A','技能中心A']\" placeholder=\"仓库A\"></a-select></label>\r\n                <label><span>领用负责科室</span><a-input v-model=\"activeRecord.department\" placeholder=\"请输入科室\"></a-input></label>\r\n                <label><span>使用次数</span><a-input-number v-model=\"activeRecord.usageCount\" :min=\"0\" placeholder=\"0\" class=\"full-input\"></a-input-number></label>\r\n                <label><span>物料用途</span><a-input v-model=\"activeRecord.purpose\" placeholder=\"请输入用途\"></a-input></label>\r\n                <label><span>耗材类型</span><a-select v-model=\"activeRecord.reusable\" :options=\"['一次性耗材','可回收耗材']\" placeholder=\"一次性耗材\"></a-select></label>\r\n                <label><span>单位</span><a-input v-model=\"activeRecord.unit\" placeholder=\"如：盒/包/件\"></a-input></label>\r\n                <label><span>状态</span><a-select v-model=\"activeRecord.statusLabel\" :options=\"materialStatusOptions\" placeholder=\"状态\"></a-select></label>\r\n                <label class=\"full-field\"><span>图片</span>\r\n                  <div class=\"detail-photo-row\">\r\n                    <img v-if=\"activeRecord.image\" :src=\"activeRecord.image\" class=\"detail-photo-preview\" />\r\n                    <button type=\"button\" class=\"photo-box detail-photo-upload\"><upload :size=\"15\"></upload><span>上传/更换图片</span></button>\r\n                  </div>\r\n                </label>\r\n              </div>\r\n            </div>\r\n          </template>\r\n\r\n          <div class=\"drawer-footer\">\r\n            <a-button size=\"small\" @click=\"showArchiveDetail = false\">取消</a-button>\r\n            <a-button size=\"small\" type=\"primary\" @click=\"showArchiveDetail = false\">保存修改</a-button>\r\n            <a-popconfirm content=\"确认删除该物资？\" type=\"warning\"><a-button size=\"small\" status=\"danger\">删除</a-button></a-popconfirm>\r\n          </div>\r\n        </div>\r\n      </a-drawer>\r\n\r\n      <a-drawer v-model:visible=\"showBatchDeleteConfirm\" title=\"确认批量删除\" :width=\"420\" @ok=\"batchDeleteArchive\" @cancel=\"showBatchDeleteConfirm = false\">\r\n        <p class=\"batch-confirm-text\">将删除已选的 {{ selectedArchiveIds.length }} 项物资档案，删除后不可恢复。确认继续？</p>\r\n      </a-drawer>\r\n";

  templateHtml = templateHtml
    .replace("item.status === '待准备'", "['待准备','部分满足'].includes(item.status)")
    .replace(
      '<div class="drawer-section prepare-section">',
      '<div v-if="activeTeachingRecord.resourceIssue" class="material-resource-assurance p-risk-notice" data-severity="blocked">' +
        '<div><strong>{{ activeTeachingRecord.resourceStatusLabel }}</strong><span>{{ activeTeachingRecord.sourceLabel }} · {{ activeTeachingRecord.openingPlanId }}</span></div>' +
        '<p>{{ activeTeachingRecord.resourceIssue }}</p>' +
        '<section><span>建议替代方案</span><strong>{{ activeTeachingRecord.alternative }}</strong></section>' +
        '<section><span>处理截止</span><strong>{{ activeTeachingRecord.deadline }}</strong></section>' +
        '<a-button v-if="activeTeachingRecord.resourceStatus === \'partial\'" type="outline" status="warning" @click="acceptMaterialAlternative">采用替代方案</a-button>' +
      '</div>' +
      '<div class="drawer-section prepare-section">'
    )
    .replace(
      '<a-button type="primary" status="success" @click="showTeachingPrepare = false"><circle-check :size="14"></circle-check> 确认准备并通知老师</a-button>',
      '<a-button type="primary" status="success" :disabled="activeTeachingRecord && activeTeachingRecord.resourceStatus === \'partial\'" @click="finishTeachingPrepare"><circle-check :size="14"></circle-check> {{ activeTeachingRecord && activeTeachingRecord.resourceStatus === \'partial\' ? \'请先处理资源缺口\' : \'确认准备并通知老师\' }}</a-button>'
    );

  function getPageState(active) {
    switch (active) {
      case '首页':
        return { activePage: 'workbench', usageTab: 'teaching' };
      case '物资工作台':
        return { activePage: 'workbench', usageTab: 'teaching' };
      case '物资档案':
        return { activePage: 'archive', usageTab: 'teaching' };
      case '维修管理':
        return { activePage: 'repair', usageTab: 'teaching' };
      case '盘点管理':
        return { activePage: 'inventory', usageTab: 'teaching' };
      case '课程使用和临时借用':
        return { activePage: 'usage', usageTab: 'teaching' };
      case '归还签收':
        return { activePage: 'usage', usageTab: 'teaching' };
      default:
        return null;
    }
  }

  function shouldHandle() {
    var role = document.body.dataset.role;
    var active = document.body.dataset.active;
    return (role === 'material' && handledPages.indexOf(active) !== -1) ||
      (role === 'admin' && active !== '首页' && handledPages.indexOf(active) !== -1);
  }

  function renderShell() {
    var content = document.querySelector('.content');
    if (!content || !shouldHandle()) {
      if (vueApp) {
        try { vueApp.unmount(); } catch(e) {}
        vueApp = null;
      }
      return;
    }

    var active = document.body.dataset.active;
    var pageState = getPageState(active);

    if (vueApp) {
      try { vueApp.unmount(); } catch (e) { console.error(e); }
      vueApp = null;
    }

    content.innerHTML = '<div id="' + mountId + '" class="material-page-content">' + templateHtml + '</div>';

﻿    const iconFallback = { template: '<span class="material-icon-fallback" aria-hidden="true"></span>' };
    const iconLibrary = window.LucideVueNext || new Proxy({}, {
      get: function () { return iconFallback; }
    });
    const {
      AlertTriangle, Archive, ArrowRight, BarChart3, Bell, BookOpen, CalendarCheck,
      CalendarDays, Camera, ChevronDown, ChevronLeft, ChevronRight, CircleCheck, ClipboardCheck, Clock,
      FilePlus2, FileSpreadsheet, HandCoins, History, Home, Images, LayoutDashboard, ListChecks, Lock, MapPin,
      Package, PackagePlus, PieChart, Repeat2, ScanLine, Settings, ShieldAlert, SlidersHorizontal,
      Smartphone, Sparkles, Trash2, TriangleAlert, Upload, UploadCloud, Wrench, X
    } = iconLibrary;

    const { createApp } = Vue;
    const iconMap = {
      workbench: 'layout-dashboard',
      archive: 'package-plus',
      usage: 'hand-coins',
      repair: 'wrench',
      inventory: 'scan-line',
    };

    const CategoryCascade = {
      props: {
        modelValue: { type: Array, default: () => [] },
        inputValue: { type: String, default: '' },
        options: { type: Array, default: () => [] },
        subOptions: { type: Object, default: () => ({}) },
        placeholder: { type: String, default: '选择分类' },
      },
      emits: ['update:modelValue', 'update:inputValue', 'change', 'add'],
      data() {
        return {
          open: false,
          activeParent: '',
        };
      },
      computed: {
        currentParent() {
          return this.activeParent || this.modelValue[0] || this.options[0] || '';
        },
        currentChildren() {
          return this.subOptions[this.currentParent] || [];
        },
        displayValue() {
          return this.modelValue.filter(Boolean).join(' / ');
        },
      },
      mounted() {
        document.addEventListener('click', this.handleOutsideClick);
      },
      beforeUnmount() {
        document.removeEventListener('click', this.handleOutsideClick);
      },
      methods: {
        toggle() {
          this.activeParent = this.modelValue[0] || this.options[0] || '';
          this.open = !this.open;
        },
        handleOutsideClick(event) {
          if (!this.$el.contains(event.target)) this.open = false;
        },
        selectParent(parent) {
          this.activeParent = parent;
          this.$emit('update:modelValue', [parent]);
          this.$emit('change', [parent]);
        },
        selectChild(child) {
          const value = [this.currentParent, child];
          this.$emit('update:modelValue', value);
          this.$emit('change', value);
          this.open = false;
        },
        updateInput(event) {
          this.$emit('update:inputValue', event.target.value);
        },
        addChild() {
          if (!String(this.inputValue || '').trim()) return;
          const value = [this.currentParent, String(this.inputValue || '').trim()];
          this.$emit('update:modelValue', value);
          this.$emit('change', value);
          this.$emit('add', this.currentParent);
        },
      },
      template: `
        <div class="category-cascade" :class="{ open }">
          <button type="button" class="category-cascade-trigger" @click="toggle">
            <span :class="{ placeholder: !displayValue }">{{ displayValue || placeholder }}</span>
            <i></i>
          </button>
          <div v-if="open" class="category-cascade-panel">
            <div class="category-cascade-parents">
              <button v-for="parent in options" :key="parent" type="button" :class="{ active: parent === currentParent }" @click="selectParent(parent)">
                <span>{{ parent }}</span><strong>›</strong>
              </button>
            </div>
            <div class="category-cascade-children">
              <div class="category-cascade-add">
                <input :value="inputValue" placeholder="新增二级分类" @input="updateInput" @keydown.enter.prevent="addChild">
                <button type="button" aria-label="新增二级分类" @click="addChild">+</button>
              </div>
              <button v-for="child in currentChildren" :key="child" type="button" :class="{ active: modelValue[0] === currentParent && modelValue[1] === child }" @click="selectChild(child)">
                {{ child }}
              </button>
            </div>
          </div>
        </div>
      `,
    };

    const App = {
      components: {
        CategoryCascade,
        AlertTriangle, Archive, ArrowRight, BarChart3, Bell, BookOpen, CalendarCheck,
        CalendarDays, Camera, ChevronDown, ChevronLeft, CircleCheck, ClipboardCheck, Clock,
        FilePlus2, FileSpreadsheet, HandCoins, History, Home, Images, LayoutDashboard, ListChecks, Lock, MapPin,
        Package, PackagePlus, PieChart, Repeat2, ScanLine, Settings, ShieldAlert, SlidersHorizontal,
        Smartphone, Sparkles, Trash2, TriangleAlert, Upload, UploadCloud, Wrench, X,
        'alert-triangle': AlertTriangle, archive: Archive, 'arrow-right': ArrowRight,
        'bar-chart-3': BarChart3, 'calendar-check': CalendarCheck, 'calendar-days': CalendarDays,
        camera: Camera, 'circle-check': CircleCheck, 'clipboard-check': ClipboardCheck,
        'file-plus-2': FilePlus2, 'file-spreadsheet': FileSpreadsheet, 'hand-coins': HandCoins,
        images: Images, 'layout-dashboard': LayoutDashboard, 'list-checks': ListChecks,
        package: Package, 'package-plus': PackagePlus, 'pie-chart': PieChart, 'repeat-2': Repeat2,
        'scan-line': ScanLine, 'shield-alert': ShieldAlert, 'sliders-horizontal': SlidersHorizontal,
        smartphone: Smartphone, 'triangle-alert': TriangleAlert, upload: Upload, 'upload-cloud': UploadCloud,
        wrench: Wrench, bell: Bell, sparkles: Sparkles, settings: Settings, home: Home, 'book-open': BookOpen,
        'chevron-down': ChevronDown, 'chevron-left': ChevronLeft, 'chevron-right': ChevronRight, x: X, clock: Clock,
        'map-pin': MapPin, history: History, lock: Lock, 'trash-2': Trash2,
      },
      data() {
        const pilotResource = window.TeachingBusiness && window.TeachingBusiness.getResourceAssurance
          ? window.TeachingBusiness.getResourceAssurance('儿科坏消息告知')
          : null;
        const pilotTeachingUse = pilotResource ? [{
          id: 'pilot-material-1',
          seq: 0,
          course: pilotResource.courseName,
          department: '医学人文教研室',
          teacher: pilotResource.teacher,
          studentCount: 12,
          materialTags: ['标准化病人角色卡 4/6', '沟通观察记录表 20/20', '替代：电子角色卡 ×2'],
          classroom: pilotResource.space.statusLabel,
          dateLabel: '10/26',
          timeLabel: '12:30',
          classTime: pilotResource.scheduledDate + ' ' + pilotResource.scheduledTime.replace(' — ', '-'),
          status: pilotResource.material.status === 'ready' ? '已备妥' : '部分满足',
          statusColor: pilotResource.material.status === 'ready' ? 'green' : 'orange',
          sourceLabel: pilotResource.sourceLabel,
          openingPlanId: pilotResource.openingPlanId,
          resourceStatus: pilotResource.material.status,
          resourceStatusLabel: pilotResource.material.statusLabel,
          resourceIssue: pilotResource.material.issue,
          alternative: pilotResource.material.alternative,
          deadline: pilotResource.deadline,
          pilot: true
        }] : [];
        const pilotCourseUse = pilotResource ? [{
          day: '10/26',
          time: '12:30',
          course: pilotResource.courseName,
          room: pilotResource.space.statusLabel,
          teacher: pilotResource.teacher,
          status: pilotResource.material.status === 'ready' ? '已备妥' : '部分满足',
          color: pilotResource.material.status === 'ready' ? 'green' : 'orange',
          action: pilotResource.material.status === 'ready' ? '查看' : '处理缺口',
          primary: pilotResource.material.status !== 'ready'
        }] : [];
        const pilotUsageQueue = pilotResource ? [{
          kind: '课程准备',
          time: '10/26 12:30',
          title: pilotResource.courseName,
          desc: pilotResource.sourceLabel + '；' + pilotResource.material.issue,
          status: pilotResource.material.status === 'ready' ? '已备妥' : '部分满足',
          color: pilotResource.material.status === 'ready' ? 'green' : 'orange',
          action: pilotResource.material.status === 'ready' ? '查看' : '处理缺口',
          actionKey: 'course',
          primary: pilotResource.material.status !== 'ready'
        }] : [];
        return {
          activePage: 'workbench',
          searchText: '',
          showSingleInbound: false,
          showBatchInbound: false,
          showBorrowModal: false,
          showPrepareDrawer: false,
          showReturnDrawer: false,
          showCreateRepair: false,
          showRepairDetail: false,
          showFinishRepair: false,
          showWorkbenchSearchPanel: false,
          showTaskModal: false,
          showPeriodDrawer: false,
          showProjectModal: false,
          showInboundDrawer: false,
          showArchiveDetail: false,
          showConsumableStockDrawer: false,
          showBatchDeleteConfirm: false,
          activeOrder: null,
          chartRefs: {},
          chartColors: {
            model: ['#165dff', '#7bc0ff'],
            medical: ['#00b42a', '#8ee3a2'],
            consumable: ['#ff7d00', '#ffd18a'],
            device: ['#722ed1', '#c9a7ff'],
            other: ['#86909c', '#c9cdd4'],
          },
          // 盘点管理新结构
          inventoryHistoryExpanded: true,
          inventoryResultFilter: 'all',
          activeInventoryRecord: null,
          inventoryHistoryList: [
            { id: 1, name: '2026 年 5 月月末盘点', date: '05-28', dateRange: '2026-05-01 至 2026-05-28', property: '全量物资', total: 142, abnormalCount: 5, status: '已完成', statusColor: 'green' },
            { id: 2, name: '2026 年 4 月月末盘点', date: '04-30', dateRange: '2026-04-01 至 2026-04-30', property: '全量物资', total: 138, abnormalCount: 2, status: '已完成', statusColor: 'green' },
            { id: 3, name: '2026 春季学期末盘点', date: '04-28', dateRange: '2026-04-01 至 2026-04-28', property: '教学模型', total: 68, abnormalCount: 1, status: '已完成', statusColor: 'green' },
            { id: 4, name: '国家基金项目中期检查', date: '04-15', dateRange: '2026-04-10 至 2026-04-15', property: '项目物资', total: 36, abnormalCount: 0, status: '已完成', statusColor: 'green' },
            { id: 5, name: '2026 年 3 月月末盘点', date: '03-31', dateRange: '2026-03-01 至 2026-03-31', property: '全量物资', total: 135, abnormalCount: 3, status: '已完成', statusColor: 'green' },
          ],
          inventoryResultItems: [
            { name: '儿童 CPR 模型', code: 'CPR-MODEL-0001', assetNature: '复旦医学院出资', storageLocation: '技能中心 A', materialStatus: '空闲可用', inventoryStatus: '已盘到', category: '急救/CPR 模型', department: '技能培训中心', lastUsed: '2026-05-20 儿科急救技能课', checkedAt: '2026-05-28 10:16', remark: '设备外观完整，扫码核验一致' },
            { name: '婴儿心肺复苏模型', code: '20211046', assetNature: '医院自筹', storageLocation: '仓库 A', materialStatus: '已借出', inventoryStatus: '未盘到', category: '急救/CPR 模型', department: '技能培训中心', lastUsed: '2026-05-26 新生儿复苏培训', checkedAt: '', remark: '借出中，归还后复核' },
            { name: '便携式彩色超声诊断仪', code: 'US-PORT-0003', assetNature: '教学专项经费', storageLocation: '超声训练室', materialStatus: '盘点锁定', inventoryStatus: '未盘到', category: '仪器设备', department: '超声训练室', lastUsed: '2026-05-18 POCUS 教学', checkedAt: '', remark: '未在库位发现，已锁定等待复查' },
            { name: '腹部检查训练器', code: 'ABD-TRAIN-0012', assetNature: '复旦医学院出资', storageLocation: '技能中心 B', materialStatus: '空闲可用', inventoryStatus: '已盘到', category: '查体模型', department: '技能培训中心', lastUsed: '2026-05-21 体格检查训练', checkedAt: '2026-05-28 10:28', remark: '实际存放在仓库 A，建议后续同步库位' },
            { name: '高级综合模拟人', code: 'SIM-0015', assetNature: '国家级教学项目', storageLocation: '技能中心 A', materialStatus: '待维修', inventoryStatus: '已盘到', category: '高仿真模拟人', department: '模拟教学中心', lastUsed: '2026-05-19 情景模拟课程', checkedAt: '2026-05-28 10:35', remark: '左侧气道模块待检修' },
            { name: '腹腔镜训练系统', code: 'LAP-TRAIN-0002', assetNature: '医院自筹', storageLocation: '技能中心 B', materialStatus: '教学使用', inventoryStatus: '已盘到', category: '训练系统', department: '技能培训中心', lastUsed: '2026-05-27 腔镜训练', checkedAt: '2026-05-28 10:42', remark: '课程结束后归位' },
            { name: '按压反馈系统', code: '20240591', assetNature: '教学专项经费', storageLocation: '技能中心 A', materialStatus: '空闲可用', inventoryStatus: '已盘到', category: '急救设备', department: '技能培训中心', lastUsed: '2026-05-20 儿科急救技能课', checkedAt: '2026-05-28 10:45', remark: '' },
            { name: '高级摄像评估系统', code: '20241131', assetNature: '医院自筹', storageLocation: '技能中心 B', materialStatus: '维修中', inventoryStatus: '已盘到', category: '多媒体设备', department: '教学信息中心', lastUsed: '2026-05-15 OSCE 考站', checkedAt: '2026-05-28 10:52', remark: '镜头云台维修中' },
            { name: '多参数监护仪', code: 'MON-0018', assetNature: '复旦医学院出资', storageLocation: '技能中心 A', materialStatus: '空闲可用', inventoryStatus: '已盘到', category: '仪器设备', department: '技能培训中心', lastUsed: '2026-05-22 危重症模拟', checkedAt: '2026-05-28 11:03', remark: '' },
            { name: '心电图机', code: 'ECG-0020', assetNature: '医院自筹', storageLocation: '急救训练室', materialStatus: '已报废', inventoryStatus: '未盘到', category: '仪器设备', department: '急救训练室', lastUsed: '2026-04-18 心电教学', checkedAt: '', remark: '已进入报废流程，待资产处确认' },
            { name: '除颤监护仪', code: 'DEF-0021', location: '急救训练室', isNormal: true, abnormalType: null, abnormalNote: '', tagColor: 'green', tagText: '正常' },
            { name: '微量注射泵', code: 'INF-0022', location: '技能中心 A', isNormal: true, abnormalType: null, abnormalNote: '', tagColor: 'green', tagText: '正常' },
            { name: '便携式可视喉镜', code: 'VID-0023', location: '急救训练室', isNormal: true, abnormalType: null, abnormalNote: '', tagColor: 'green', tagText: '正常' },
            { name: '气管插管模型', code: 'INT-0030', location: '技能中心 A', isNormal: true, abnormalType: null, abnormalNote: '', tagColor: 'green', tagText: '正常' },
            { name: '儿童静脉穿刺模型', code: 'VEN-0031', location: '技能中心 B', isNormal: true, abnormalType: null, abnormalNote: '', tagColor: 'green', tagText: '正常' },
            { name: '新生儿模拟人', code: 'NEO-0032', location: '技能中心 A', isNormal: true, abnormalType: null, abnormalNote: '', tagColor: 'green', tagText: '正常' },
            { name: '超早产儿安妮', code: 'PREM-0033', location: '技能中心 A', isNormal: true, abnormalType: null, abnormalNote: '', tagColor: 'green', tagText: '正常' },
            { name: '模拟血管套件', code: 'VES-0040', location: '仓库 A', isNormal: true, abnormalType: null, abnormalNote: '', tagColor: 'green', tagText: '正常' },
            { name: '缝合练习模型', code: 'SUT-0041', location: '技能中心 B', isNormal: true, abnormalType: null, abnormalNote: '', tagColor: 'green', tagText: '正常' },
            { name: '导尿模型', code: 'CAT-0042', location: '技能中心 A', isNormal: true, abnormalType: null, abnormalNote: '', tagColor: 'green', tagText: '正常' },
            { name: '腰椎穿刺模型', code: 'LUM-0043', location: '技能中心 B', isNormal: true, abnormalType: null, abnormalNote: '', tagColor: 'green', tagText: '正常' },
            { name: '骨髓穿刺模型', code: 'BON-0044', location: '技能中心 A', isNormal: true, abnormalType: null, abnormalNote: '', tagColor: 'green', tagText: '正常' },
            { name: '智能录播主机', code: 'REC-0050', location: '机房中控室', isNormal: true, abnormalType: null, abnormalNote: '', tagColor: 'green', tagText: '正常' },
            { name: '摄像采集系统', code: 'CAM-0051', location: '机房中控室', isNormal: true, abnormalType: null, abnormalNote: '', tagColor: 'green', tagText: '正常' },
            { name: '高清示教摄像机', code: 'HDC-0052', location: '5F·腔镜训练室', isNormal: true, abnormalType: null, abnormalNote: '', tagColor: 'green', tagText: '正常' },
            { name: '移动推车中控屏', code: 'CTR-0053', location: '技能中心 B', isNormal: true, abnormalType: null, abnormalNote: '', tagColor: 'green', tagText: '正常' },
            { name: '临床虚拟病人系统', code: 'VIR-0054', location: '机房中控室', isNormal: true, abnormalType: null, abnormalNote: '', tagColor: 'green', tagText: '正常' },
            { name: '重症呼吸思维学习系统', code: 'RESP-0055', location: '技能中心 A', isNormal: true, abnormalType: null, abnormalNote: '', tagColor: 'green', tagText: '正常' },
            { name: '护理模拟人', code: 'NUR-0060', location: '技能中心 B', isNormal: true, abnormalType: null, abnormalNote: '', tagColor: 'green', tagText: '正常' },
            { name: '基础护理模型', code: 'BAS-0061', location: '技能中心 A', isNormal: true, abnormalType: null, abnormalNote: '', tagColor: 'green', tagText: '正常' },
            { name: '妇科检查模型', code: 'GYN-0062', location: '技能中心 B', isNormal: true, abnormalType: null, abnormalNote: '', tagColor: 'green', tagText: '正常' },
            { name: '分娩模拟人', code: 'DEL-0063', location: '技能中心 A', isNormal: true, abnormalType: null, abnormalNote: '', tagColor: 'green', tagText: '正常' },
            { name: '高级生命支持模型', code: 'ALS-0064', location: '急救训练室', isNormal: true, abnormalType: null, abnormalNote: '', tagColor: 'green', tagText: '正常' },
            { name: '自动心肺复苏模拟器', code: 'ACPR-0065', location: '急救训练室', isNormal: true, abnormalType: null, abnormalNote: '', tagColor: 'green', tagText: '正常' },
            { name: '除颤仪训练机', code: 'AED-0066', location: '急救训练室', isNormal: true, abnormalType: null, abnormalNote: '', tagColor: 'green', tagText: '正常' },
            { name: '急救包', code: 'FKIT-0070', location: '仓库 A', isNormal: true, abnormalType: null, abnormalNote: '', tagColor: 'green', tagText: '正常' },
            { name: '氧气面罩', code: 'OXY-0071', location: '仓库 A', isNormal: true, abnormalType: null, abnormalNote: '', tagColor: 'green', tagText: '正常' },
            { name: '简易呼吸器', code: 'AMBU-0072', location: '仓库 A', isNormal: true, abnormalType: null, abnormalNote: '', tagColor: 'green', tagText: '正常' },
            { name: '喉罩', code: 'LMA-0073', location: '仓库 A', isNormal: true, abnormalType: null, abnormalNote: '', tagColor: 'green', tagText: '正常' },
            { name: '气管插管导管套装', code: 'ETT-0074', location: '仓库 A', isNormal: true, abnormalType: null, abnormalNote: '', tagColor: 'green', tagText: '正常' },
            { name: '无菌手套 L', code: 'GLOVE-L-0080', location: '仓库 A', isNormal: true, abnormalType: null, abnormalNote: '', tagColor: 'green', tagText: '正常' },
            { name: '无菌手套 M', code: 'GLOVE-M-0081', location: '仓库 A', isNormal: true, abnormalType: null, abnormalNote: '', tagColor: 'green', tagText: '正常' },
            { name: '注射器 10ml', code: 'SYR-10-0082', location: '仓库 A', isNormal: true, abnormalType: null, abnormalNote: '', tagColor: 'green', tagText: '正常' },
            { name: '注射器 5ml', code: 'SYR-5-0083', location: '仓库 A', isNormal: true, abnormalType: null, abnormalNote: '', tagColor: 'green', tagText: '正常' },
            { name: '静脉留置针', code: 'IVC-0084', location: '仓库 A', isNormal: true, abnormalType: null, abnormalNote: '', tagColor: 'green', tagText: '正常' },
            { name: '输液泵', code: 'INFP-0085', location: '技能中心 A', isNormal: true, abnormalType: null, abnormalNote: '', tagColor: 'green', tagText: '正常' },
            { name: '负压吸引器', code: 'SUC-0086', location: '技能中心 A', isNormal: true, abnormalType: null, abnormalNote: '', tagColor: 'green', tagText: '正常' },
            { name: '电动吸引器', code: 'ELEC-0087', location: '急救训练室', isNormal: true, abnormalType: null, abnormalNote: '', tagColor: 'green', tagText: '正常' },
            { name: '血压计', code: 'BP-0088', location: '技能中心 A', isNormal: true, abnormalType: null, abnormalNote: '', tagColor: 'green', tagText: '正常' },
            { name: '听诊器', code: 'STET-0089', location: '技能中心 B', isNormal: true, abnormalType: null, abnormalNote: '', tagColor: 'green', tagText: '正常' },
            { name: '叩诊锤', code: 'REF-0090', location: '技能中心 A', isNormal: true, abnormalType: null, abnormalNote: '', tagColor: 'green', tagText: '正常' },
            { name: '瞳孔笔', code: 'PEN-0091', location: '急救训练室', isNormal: true, abnormalType: null, abnormalNote: '', tagColor: 'green', tagText: '正常' },
            { name: '手电筒', code: 'FLASH-0092', location: '技能中心 A', isNormal: true, abnormalType: null, abnormalNote: '', tagColor: 'green', tagText: '正常' },
            { name: '体温计', code: 'TEMP-0093', location: '仓库 A', isNormal: true, abnormalType: null, abnormalNote: '', tagColor: 'green', tagText: '正常' },
            { name: '血糖仪', code: 'GLU-0094', location: '技能中心 B', isNormal: true, abnormalType: null, abnormalNote: '', tagColor: 'green', tagText: '正常' },
          ],
          pages: [
            { key: 'workbench', title: '物资工作台', count: 7, icon: iconMap.workbench, quick: '先处理会影响上课的事项', button: '查看队列', search: '搜索课程、物资、SN码、借用人', desc: '首页只处理物资管理员今天要判断和行动的事情；档案、使用、维修、盘点在左侧二级菜单中切换。', actions: [{ key: 'inbound', label: '入库', icon: 'package-plus', primary: true }] },
            { key: 'archive', title: '物资档案', count: 142, icon: iconMap.archive, quick: '在库物资管理，入库只是动作', button: '入库', search: '搜索物资、SN码、批次、经办人', desc: '这里管理已经在库的物资档案；入库只是新增档案的动作。', actions: [{ key: 'inbound', label: '入库', icon: 'package-plus', primary: true }] },
            { key: 'usage', title: '使用管理', count: 9, icon: iconMap.usage, quick: '课程准备、核对；临时借、还', button: '新建借用', search: '搜索课程、物资、SN码、借用人', desc: '使用管理只做两件事：课程准备/核对，临时借用/归还。先把当天的动作处理清楚。', actions: [{ key: 'borrow', label: '临时借用', icon: 'hand-coins', primary: true }, { key: 'return', label: '归还', icon: 'repeat-2' }] },
            { key: 'repair', title: '维修管理', count: 4, icon: iconMap.repair, quick: '报修、处理、完成记录', button: '新建维修单', search: '搜索设备、维修单、SN码', desc: '维修管理不做概况卡片，直接按"待报修、维修中、待完成、无法修复"显示列表。', actions: [{ key: 'createRepair', label: '新建维修单', icon: 'file-plus-2', primary: true }] },
            { key: 'inventory', title: '盘点管理', count: 8, icon: iconMap.inventory, quick: '历史盘点结果与异常处理', button: '新建盘点', search: '搜索盘点任务、项目、物资清单', desc: '盘点管理只展示历史盘点结果和异常处理。', actions: [] },
          ],
          inventoryMix: [
            { name: '模型', count: 62, percent: 44, type: 'model', breakdown: [{ name: '基础模型', value: 30 }, { name: '高端模型', value: 32 }] },
            { name: '医疗设备', count: 28, percent: 20, type: 'medical', breakdown: [{ name: '小型医疗器械', value: 16 }, { name: '大型医疗设备', value: 12 }] },
            { name: '耗材', count: 34, percent: 24, type: 'consumable', breakdown: [{ name: '可回收耗材', value: 14 }, { name: '一次性耗材', value: 20 }] },
            { name: '其他设备', count: 18, percent: 12, type: 'device', breakdown: [{ name: '多媒体设备', value: 10 }, { name: '其他设备', value: 8 }] },
          ],
          usageMetrics: [
            { label: '本月使用', value: '286 次' },
            { label: '课程使用', value: '214 次' },
            { label: '临时借用', value: '72 次' },
            { label: '30 天未用', value: '12 件' },
          ],
          usageRanking: [
            { name: '儿童 CPR 模型', desc: '课程训练高频物资', count: 46, percent: 100 },
            { name: '便携式彩色超声诊断仪', desc: '课程 + 临时借用', count: 31, percent: 67 },
            { name: '无菌手套', desc: '耗材消耗统计', count: 28, percent: 61 },
          ],
          activeUsageTrendMonth: '5月',
          visibleUsageTrendTypes: ['medical', 'media', 'consumable', 'model'],
          usageTrendTypes: [
            { key: 'medical', label: '医疗设备', color: '#00b42a' },
            { key: 'media', label: '其他设备', color: '#722ed1' },
            { key: 'consumable', label: '耗材', color: '#ff7d00' },
            { key: 'model', label: '模型', color: '#165dff' },
          ],
          usageTrendData: [
            { month: '11月', medical: 84, media: 46, consumable: 52, model: 42, note: '课程稳定，医疗设备与耗材仍是主要贡献。' },
            { month: '12月', medical: 74, media: 42, consumable: 44, model: 34, note: '期末前设备借用减少。' },
            { month: '1月', medical: 52, media: 28, consumable: 26, model: 20, note: '寒假影响明显，整体使用量降低。' },
            { month: '2月', medical: 48, media: 26, consumable: 22, model: 18, note: '低频月份，适合安排维护和盘点。' },
            { month: '3月', medical: 78, media: 42, consumable: 48, model: 36, note: '春季开课后快速恢复。' },
            { month: '4月', medical: 88, media: 48, consumable: 58, model: 46, note: '模拟训练增加，模型和耗材使用同步走高。' },
            { month: '5月', medical: 188, media: 108, consumable: 98, model: 82, note: '本月使用强度接近峰值，建议提前确认高频物资状态。' },
            { month: '6月', medical: 195, media: 115, consumable: 105, model: 88, note: '暑期课程前集中使用，模型训练达到年度峰值。' },
            { month: '7月', medical: 68, media: 40, consumable: 36, model: 28, note: '假期课程减少，耗材使用下降。' },
            { month: '8月', medical: 72, media: 42, consumable: 38, model: 30, note: '新学期准备开始，多媒体设备使用回升。' },
            { month: '9月', medical: 86, media: 48, consumable: 50, model: 40, note: '开课后模型和耗材同步上涨。' },
            { month: '10月', medical: 92, media: 52, consumable: 56, model: 44, note: '实训周带动整体使用次数。' },
          ],
          workQueueSummary: [
            { label: '课程准备', value: 6, hint: '今天和明天', tone: 'primary', icon: 'calendar-check', actionKey: 'prepare' },
            { label: '超期借用', value: 2, hint: '影响排课', tone: 'danger', icon: 'hand-coins', actionKey: 'overdue' },
            { label: '待维修', value: 4, hint: '1 件影响课程', tone: 'warning', icon: 'wrench', actionKey: 'repair' },
            { label: '盘点异常', value: 5, hint: '待确认', tone: 'success', icon: 'scan-line', actionKey: 'inventory' },
          ],
          todos: [
            { rank: 1, title: '婴儿 CPR 模型等待报修', desc: '归还核对发现胸廓回弹异常，需要登记维修单。', source: '等待报修', sourceColor: 'orange', time: '10:40', action: '建单', actionKey: 'repair' },
            { rank: 2, title: '急救护理综合实训课程准备', desc: '3F·302 教室，需核对 CPR 模型、按压反馈系统、无菌手套。', source: '课程准备', sourceColor: 'blue', time: '今天 14:00', action: '准备', actionKey: 'prepare' },
            { rank: 3, title: '腹腔镜训练系统逾期未还', desc: '张明借用，已逾期 1 天，影响明天课程使用。', source: '逾期未还', sourceColor: 'red', time: '逾期 1 天', action: '查看', actionKey: 'overdue', danger: true },
            { rank: 4, title: '月度盘点出现位置异常', desc: '便携式超声扫码位置与档案库位不一致。', source: '盘点异常', sourceColor: 'purple', time: '待确认', action: '查看', actionKey: 'inventory' },
          ],
          archiveKeyword: '',
          archiveFilters: { category: '', subCategory: '', status: '', property: '', location: '' },
          workbenchSearch: { keyword: '', category: '', property: '', status: '', location: '' },
          materialStatusOptions: ['空闲可用', '教学使用', '已借出', '待维修', '维修中', '已报废', '盘点锁定'],
          fundingSourceOptions: ['复旦医学院', '国家自然基金', '医院自筹', '教学专项经费', '科室经费', '横向课题经费', '捐赠/合作项目'],
          workbenchSearchChips: [
            { label: '空闲可用', status: '空闲可用' },
            { label: '待维修', status: '待维修' },
            { label: '已借出', status: '已借出' },
            { label: '维修中', status: '维修中' },
            { label: '盘点锁定', status: '盘点锁定' },
          ],
          workbenchSearchResults: [
            { name: '儿童 CPR 模型', code: 'CPR-MODEL-0001', category: '模型', property: '复旦医学院', status: '待维修', color: 'orange', location: '技能中心A', note: '负责人：李老师', action: '查看', targetPage: 'archive', icon: 'package', image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=200&auto=format&fit=crop' },
            { name: '腹腔镜训练系统', code: 'LAP-TRAIN-0002', category: '模型', property: '国家自然基金', status: '已借出', color: 'blue', location: '4F·402教室', note: '张医生借用', action: '查看', targetPage: 'usage', icon: 'package', image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=200&auto=format&fit=crop' },
            { name: '便携式彩色超声诊断仪', code: 'US-PORT-0003', category: '医疗设备', property: '教学专项经费', status: '教学使用', color: 'cyan', location: '门诊楼 2F 超声科', note: '使用中', action: '查看', targetPage: 'archive', icon: 'smartphone', image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=200&auto=format&fit=crop' },
            { name: '无菌手套（中号）', code: 'GLOVE-M-0004', category: '耗材', property: '科室经费', status: '空闲可用', color: 'green', location: '仓库A', note: '库存：120 盒', action: '查看', targetPage: 'archive', icon: 'archive', image: '' },
            { name: '婴儿心肺复苏模型', code: 'MOD-0002', category: '模型', property: '复旦医学院', status: '空闲可用', color: 'green', location: '技能中心A', note: '使用 89 次', action: '查看', targetPage: 'archive', icon: 'package', image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=200&auto=format&fit=crop' },
            { name: '气管插管模型', code: 'MOD-0003', category: '模型', property: '医院自筹', status: '已借出', color: 'blue', location: '4F·402教室', note: '课程使用中', action: '查看', targetPage: 'archive', icon: 'package', image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=200&auto=format&fit=crop' },
            { name: '多参数监护仪', code: 'MED-0001', category: '医疗设备', property: '复旦医学院', status: '空闲可用', color: 'green', location: '急救训练室', note: '使用 156 次', action: '查看', targetPage: 'archive', icon: 'smartphone', image: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=200&auto=format&fit=crop' },
            { name: '除颤监护仪', code: 'MED-0002', category: '医疗设备', property: '医院自筹', status: '维修中', color: 'orange', location: '维修室', note: '电极板损坏', action: '查看', targetPage: 'archive', icon: 'smartphone', image: 'https://images.unsplash.com/photo-1582719478250-c89405d58d9f?w=200&auto=format&fit=crop' },
            { name: '智能录播与评估系统', code: 'MMI-0001', category: '多媒体设备', property: '教学专项经费', status: '空闲可用', color: 'green', location: '技能中心B', note: '使用 234 次', action: '查看', targetPage: 'archive', icon: 'images', image: 'https://images.unsplash.com/photo-1516542076529-1ea3854896f2?w=200&auto=format&fit=crop' },
            { name: '按压反馈系统', code: 'MMI-0002', category: '多媒体设备', property: '横向课题经费', status: '已借出', color: 'blue', location: '3F·302教室', note: '课程使用中', action: '查看', targetPage: 'archive', icon: 'images', image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=200&auto=format&fit=crop' },
            { name: '高清示教摄像机', code: 'MMI-0003', category: '多媒体设备', property: '捐赠/合作项目', status: '空闲可用', color: 'green', location: '5F·腔镜训练室', note: '使用 78 次', action: '查看', targetPage: 'archive', icon: 'images', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&auto=format&fit=crop' },
            { name: '注射器（10ml）', code: 'CONS-0001', category: '耗材', property: '科室经费', status: '空闲可用', color: 'green', location: '仓库A', note: '库存：500 支', action: '查看', targetPage: 'archive', icon: 'archive', image: '' },
          ],
          archiveSummary: [{ label: '全部档案', value: '142', active: true }, { label: '空闲可用', value: '118' }, { label: '教学使用', value: '12' }, { label: '待维修', value: '6' }, { label: '盘点锁定', value: '5' }],
          inboundTab: 'model',
          inboundType: 'device',
          inboundBatchMode: false,
          inboundBatchParsing: false,
          inboundBatchFileName: '',
          inboundBatchRows: [],
          inboundBatchErrors: [],
          activeRecord: null,
          activeConsumableRecord: null,
          selectedArchiveIds: [],
          archivePages: { model: 1, medical: 1, consumable: 1, device: 1, other: 1 },
          usageTab: 'teaching',
          usageFilters: { keyword: '', department: '', status: '', date: '' },
          borrowFilters: { keyword: '', department: '', status: '', date: '' },
          repairFilters: { keyword: '', status: '' },
          inventoryFilters: { keyword: '', dateRange: [] },
          showTeachingDetail: false,
          showTeachingPrepare: false,
          showTeachingCheck: false,
          showBorrowDetail: false,
          showInventoryDetail: false,
          activeTeachingRecord: null,
          activeBorrowRecord: null,
          activeInventoryTask: null,
          prepareDeviceTypeOptions: ['模型', '医疗设备', '多媒体设备', '其他设备'],
          prepareConsumableTypeOptions: ['防护类', '注射类', '敷料类', '管路类', '训练耗材'],
          teachingPrepareDevices: [
            { id: 1, type: '模型', name: '儿童CPR模型（20140455）', qty: 1, state: '正常', avail: '可用' },
            { id: 2, type: '多媒体设备', name: '按压反馈系统（20240591）', qty: 1, state: '正常', avail: '可用' },
          ],
          teachingPrepareConsumables: [
            { id: 1, cat: '防护类', name: '无菌手套（L）', need: 20, stock: 48 },
            { id: 2, cat: '注射类', name: '注射器（10ml）', need: 10, stock: 32 },
          ],
          assetSearch: { model: '', medical: '', device: '', consumable: '', other: '' },
          modelFilters: { category: '', location: '', status: '' },
          medicalFilters: { category: '', location: '', status: '' },
          deviceFilters: { category: '', location: '', status: '' },
          otherFilters: { category: '', location: '', status: '' },
          consFilterStatus: '',
          consFilterCategory: '',
          consFilterLocation: '',
          consFilterStatus: '',
          teachingUseData: [
            ...pilotTeachingUse,
            { id: 1, seq: 1, course: '急救护理综合实训', department: '急诊培训中心', teacher: '王芳', studentCount: 36, materialTags: ['儿童CPR模型 x1', '按压反馈系统 x1', '无菌手套 x20'], classroom: '3F·302教室', dateLabel: '今天', timeLabel: '14:00', classTime: '2026-04-21 14:00', status: '待准备', statusColor: 'orange' },
            { id: 2, seq: 2, course: '外科基础操作技能', department: '外科', teacher: '李明', studentCount: 28, materialTags: ['腹腔镜训练系统 x1', '模拟血管套件 x5'], classroom: '4F·402教室', dateLabel: '今天', timeLabel: '16:00', classTime: '2026-04-21 16:00', status: '已备妥', statusColor: 'green' },
            { id: 3, seq: 3, course: '新生儿急救模拟', department: '教培新生儿', teacher: '陈丽', studentCount: 24, materialTags: ['超早产儿安妮 x1', '新生儿模拟人 x1', '气管插管导管 x3'], classroom: '3F·301教室', dateLabel: '今天', timeLabel: '18:30', classTime: '2026-04-20 10:00', status: '已完成', statusColor: 'blue' },
          ],
          borrowUseData: [
            { id: 1, seq: 1, device: '腹腔镜训练系统（20180424）', department: '外科', borrower: '张明', borrowTime: '2026-04-19 10:00', expectedReturn: '2026-04-21', returnNote: '已超期 2 天，影响排课', status: '超期未还', statusColor: 'red', dateLabel: '04-19', typeLabel: '临时借用', desc: '张明借用用于科室内部技能培训，预计一周归还。' },
            { id: 2, seq: 2, device: '便携式彩色超声诊断仪', department: '超声', borrower: '赵教授', borrowTime: '2026-04-20 08:30', expectedReturn: '2026-04-23', returnNote: '', status: '待准备', statusColor: 'orange', dateLabel: '09:20', typeLabel: '借用准备', desc: '赵教授已提交申请，管理员开始线下准备。' },
            { id: 3, seq: 3, device: '按压反馈系统（20240591）', department: '急诊培训中心', borrower: '赵护士', borrowTime: '2026-04-15 09:00', expectedReturn: '2026-04-18 16:00', returnNote: '', status: '已归还', statusColor: 'green', dateLabel: '04-15', typeLabel: '临时借用', desc: '按压反馈系统已按时归还，设备状态正常。' },
          ],
          assetList: [
            ...Array.from({ length: 126 }, (_, i) => ({
              id: `MOD-${i + 1}`, name: ['儿童CPR模型', '婴儿心肺复苏模型', '气管插管模型', '腹腔镜模拟训练箱', '高级综合模拟人', '儿童模拟人'][i % 6],
              code: `MOD-${String(i + 1).padStart(4, '0')}`, category: '模型', 
              subCategory: ['模拟人', '模拟人', '插管模型', '训练箱', '模拟人', '模拟人'][i % 6],
              property: ['复旦医学院', '国家自然基金', '医院自筹', '教学专项经费'][i % 4],
              homeLocation: ['技能中心A', '技能中心B', '3F·仓库'][i % 3],
              currentLocation: i % 5 === 0 ? '301教室' : (i % 3 === 0 ? '技能中心A' : '技能中心B'),
              usageCount: Math.floor(Math.random() * 200),
              status: ['空闲可用', '教学使用', '已借出', '待维修', '维修中', '已报废', '盘点锁定'][i % 7],
              image: [
                'https://images.unsplash.com/photo-1584362917165-526a968579e8?q=80&w=200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=200&auto=format&fit=crop'
              ][i % 3]
            })),
            ...Array.from({ length: 74 }, (_, i) => ({
              id: `MED-${i + 1}`, name: ['便携式彩色超声诊断仪', '多参数监护仪', '除颤监护仪', '微量注射泵', '便携式可视喉镜', '心电图机'][i % 6],
              code: `MED-${String(i + 1).padStart(4, '0')}`, category: '医疗设备', 
              subCategory: ['超声', '监护仪', '急救设备', '输注设备', '检查设备', '检查设备'][i % 6],
              property: ['复旦医学院', '国家自然基金', '教学专项经费', '科室经费'][i % 4],
              homeLocation: ['技能中心A', '3F·302教室', '4F·模拟手术室A'][i % 3],
              currentLocation: i % 4 === 0 ? '正在使用' : (i % 3 === 0 ? '技能中心A' : '4F·模拟手术室A'),
              usageCount: Math.floor(Math.random() * 150),
              status: ['空闲可用', '教学使用', '已借出', '待维修', '维修中', '已报废', '盘点锁定'][i % 7],
              image: [
                'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?q=80&w=200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1582719478250-c89405d58d9f?q=80&w=200&auto=format&fit=crop'
              ][i % 3]
            })),
            ...Array.from({ length: 68 }, (_, i) => ({
              id: `MMI-${i + 1}`, name: ['智能录播与评估系统主机', '摄像采集系统', '按压反馈系统', '临床虚拟病人诊断系统', '高清示教摄像机', '移动推车中控屏'][i % 6],
              code: `MMI-${String(i + 1).padStart(4, '0')}`, category: '多媒体设备', 
              subCategory: ['录播系统', '摄像采集', '反馈系统', '虚拟系统', '示教摄像', '中控设备'][i % 6],
              property: ['教学专项经费', '横向课题经费', '医院自筹', '捐赠/合作项目'][i % 4],
              homeLocation: ['技能中心B', '5F·腔镜训练室', '机房中控室'][i % 3],
              currentLocation: i % 6 === 0 ? '校外演示' : '技能中心B',
              usageCount: Math.floor(Math.random() * 300),
              status: ['空闲可用', '教学使用', '已借出', '待维修', '维修中', '已报废', '盘点锁定'][i % 7],
              image: [
                'https://images.unsplash.com/photo-1516542076529-1ea3854896f2?q=80&w=200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?q=80&w=200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=200&auto=format&fit=crop'
              ][i % 3]
            })),
            ...Array.from({ length: 36 }, (_, i) => ({
              id: `OTH-${i + 1}`, name: ['实训桌椅套装', '移动治疗车', '储物柜', '器械转运推车', '折叠检查床', '教学白板'][i % 6],
              code: `OTH-${String(i + 1).padStart(4, '0')}`, category: '其他设备',
              subCategory: ['家具', '推车', '储物设备', '转运设备', '床具', '教学辅助'][i % 6],
              property: ['医院自筹', '科室经费', '复旦医学院', '捐赠/合作项目'][i % 4],
              homeLocation: ['技能中心A', '技能中心B', '仓库A'][i % 3],
              currentLocation: i % 5 === 0 ? '临时教室' : (i % 3 === 0 ? '技能中心A' : '技能中心B'),
              usageCount: Math.floor(Math.random() * 120),
              status: ['空闲可用', '教学使用', '已借出', '待维修', '维修中', '已报废', '盘点锁定'][i % 7],
              image: [
                'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=200&auto=format&fit=crop'
              ][i % 3]
            }))
          ],
          inbConsData: Array.from({ length: 86 }, (_, i) => {
            const min = [30, 50, 80, 100, 120][i % 5];
            const stock = i % 9 === 0 ? Math.max(8, min - 25) : min + 20 + (i % 17) * 6;
            const warn = stock < min;
            return {
              id: `CONS-${i + 1}`, name: ['无菌手套', '注射器', '辅助包', '消毒棉签', '气管插管导管', '模拟血管套件'][i % 6],
              spec: ['L号', 'M号', '10ml', '5ml', '8Fr', '12Fr'][i % 6], category: ['防护类', '注射类', '敷料类', '管路类'][i % 4],
              stock, min, unit: ['个', '支', '包', '盒'][i % 4], status: warn ? 'warn' : 'ok', property: ['科室经费', '教学专项经费'][i % 2],
              statusLabel: warn ? '盘点锁定' : '空闲可用', statusClass: warn ? 'red' : 'green', location: ['仓库A', '技能中心A'][i % 2]
            };
          }),
          pendingTasks: [
            { type: '待贴码', count: '2', title: '便携式彩色超声诊断仪', desc: '已到货，需贴 SN 码并拍摄资产照片', status: '待贴码', color: 'orange', action: '处理' },
            { type: '待验收', count: '4', title: '婴儿 CPR 模型', desc: '项目采购到货，需分配库位和责任人', status: '待验收', color: 'blue', action: '验收' },
            { type: '缺照片', count: '1', title: '高级摄像评估系统', desc: '照片缺失，使用和盘点时不易识别实物', status: '待拍照', color: 'purple', action: '拍照' },
            { type: '缺库位', count: '1', title: '模拟血管套件', desc: '批量导入后未分配库位', status: '待分配', color: 'orange', action: '分配' },
          ],
          categoryFilterOptions: ['模型', '耗材', '医疗设备', '多媒体设备', '其他设备'],
          statusFilterOptions: ['空闲可用', '教学使用', '已借出', '待维修', '维修中', '已报废', '盘点锁定'],
          locationFilterOptions: ['技能中心 A', '技能中心 B', '仓库 A', '超声训练室'],
          courseUse: [
            ...pilotCourseUse,
            { day: '今天', time: '14:00', course: '急救护理综合实训', room: '3F·302 教室', teacher: '王芳', status: '待准备', color: 'orange', action: '准备', primary: true },
            { day: '今天', time: '16:00', course: '外科基础操作技能', room: '4F·402 教室', teacher: '李明', status: '待老师签字', color: 'blue', action: '签收' },
            { day: '明天', time: '09:00', course: '儿科超声引导穿刺', room: '技能中心 B', teacher: '赵教授', status: '待准备', color: 'orange', action: '准备' },
          ],
          borrowUse: [
            { type: '申请', time: '09:20', asset: '便携式彩色超声诊断仪', person: '赵教授', note: '借用人已提交申请', status: '待准备', color: 'orange', action: '准备' },
            { type: '领取', time: '13:30', asset: '儿童 CPR 模型', person: '王芳', note: '已备齐，等待手机签字', status: '待签收', color: 'blue', action: '查看' },
            { type: '归还', time: '逾期', asset: '腹腔镜训练系统', person: '张明', note: '昨日应还', status: '超期', color: 'red', action: '催还' },
          ],
          usageWorkQueue: [
            ...pilotUsageQueue,
            { kind: '借用准备', time: '09:20', title: '便携式彩色超声诊断仪', desc: '赵教授已提交申请，管理员开始线下准备。', status: '待准备', color: 'orange', action: '准备', actionKey: 'borrow', primary: true },
            { kind: '课程准备', time: '14:00', title: '急救护理综合实训', desc: '3F·302 教室，儿童 CPR 模型、按压反馈系统、无菌手套。', status: '待准备', color: 'orange', action: '准备', actionKey: 'course' },
            { kind: '借用签收', time: '13:30', title: '儿童 CPR 模型', desc: '物资已备齐，等待借用人在手机端确认领取并签字。', status: '待签收', color: 'blue', action: '查看', actionKey: 'borrow' },
            { kind: '课程签收', time: '16:00', title: '外科基础操作技能', desc: '课程物资已准备，等待老师到场签收后归档。', status: '待老师签字', color: 'blue', action: '签收', actionKey: 'course' },
            { kind: '归还异常', time: '逾期', title: '腹腔镜训练系统', desc: '昨日应还；归还时如损坏或未找到，借用人需手机端确认并签字。', status: '超期', color: 'red', action: '处理', actionKey: 'return', urgent: true },
            { kind: '归还报修', time: '待处理', title: '模拟血管套件', desc: '清点缺少 1 组，需借用人确认“未找到”后进入追踪或报损。', status: '待签字', color: 'red', action: '处理', actionKey: 'return', urgent: true },
          ],
          coursePrepareItems: [
            { name: '儿童 CPR 模型', desc: '1 套 · 技能中心 A', status: '可用', color: 'green', checked: true },
            { name: '按压反馈系统', desc: '1 套 · 技能中心 A', status: '可用', color: 'green', checked: true },
            { name: '无菌手套', desc: '20 个 · 仓库 A', status: '待补齐', color: 'orange', checked: false },
          ],
          prepareItems: [
            { name: '便携式彩色超声诊断仪', desc: '赵教授申请 · 明日 08:30 前归还', status: '待准备', color: 'orange', checked: true },
            { name: '探头保护套', desc: '附件 1 套', status: '待准备', color: 'orange', checked: true },
          ],
          returnCheckItems: [
            { name: '腹腔镜训练系统', desc: '张明归还 · 外观需确认', result: '损坏', checked: true },
            { name: '模拟血管套件', desc: '附件 1 组', result: '未找到', checked: false },
            { name: '儿童 CPR 模型', desc: '王芳归还 · 课程后核对', result: '正常', checked: true },
          ],
          returnExceptions: [
            { type: '损坏', title: '腹腔镜训练系统', desc: '归还时发现接口松动，需拍照并转维修', status: '待报修', color: 'orange' },
            { type: '未找到', title: '模拟血管套件', desc: '清点缺少 1 组，借用人需手机端确认', status: '待签字', color: 'red' },
            { type: '课程核对', title: '儿童 CPR 模型', desc: '老师课后清点完成，等待签字归档', status: '待签字', color: 'blue' },
          ],
          repairSources: [
            { time: '09:20', source: '课程核对', asset: '重症呼吸思维学习系统', reason: '参数调节模块异常，无法正常模拟', impact: '影响课程', color: 'red' },
            { time: '10:40', source: '临时归还', asset: '婴儿CPR模型', reason: '胸腔按压反馈无响应', impact: '普通维修', color: 'orange' },
            { time: '15:10', source: '盘点扫码', asset: '腹部检查训练器', reason: '主板损坏，暂不能开机', impact: '普通维修', color: 'orange' },
          ],
          repairOrders: [
            { no: 'REP-2604230003', noShort: '0003', date: '04-23', owner: '刘国强', type: '多媒体设备', asset: '模拟摄像系统（20240590）', desc: '摄像采集模块校准偏移', urgent: '一般', status: '维修中', color: 'blue', reportedAt: '2026-04-23 10:00', source: '借用归还异常' },
            { no: 'REP-2604200001', noShort: '0001', date: '04-20', owner: '刘国强', type: '多媒体设备', asset: '重症呼吸思维学习系统', desc: '参数调节模块异常', urgent: '影响课程', status: '维修中', color: 'blue', reportedAt: '2026-04-20 09:00', source: '课程核对异常' },
            { no: 'REP-2603180004', noShort: '0004', date: '03-18', owner: '刘国强', type: '多媒体设备', asset: '高级摄像评估系统（20241131）', desc: '摄像采集模块已完成更换', urgent: '一般', status: '已修复', color: 'green', reportedAt: '2026-03-15 14:00', source: '人工发现' },
          ],
          periodTasks: [
            { type: '月末', progress: '0/142', title: '2026 年 5 月月末盘点', desc: '全中心在库物资，检查遗漏、丢失和状态异常', status: '待下发', color: 'orange', action: '下发', primary: true },
            { type: '学期末', progress: '96/142', title: '2026 春季学期末盘点', desc: 'APP 已扫码 96 件，剩余仓库 A 和技能中心 B', status: '进行中', color: 'blue', action: '查看' },
          ],
          projectTasks: [
            { type: '中期', progress: '0/36', title: '国家基金项目中期检查', desc: '固定清单 36 件，只核验项目购置物资', status: '待下发', color: 'orange', action: '下发', primary: true },
            { type: '结题', progress: '18/22', title: '儿科模拟教学项目结题盘点', desc: '清单内 22 件，4 件待现场扫码', status: '进行中', color: 'blue', action: '查看' },
          ],
          inventoryWorkQueue: [
            { kind: '周期盘点', progress: '0/142', title: '2026 年 5 月月末盘点', desc: '全中心在库物资，检查遗漏、丢失和状态异常。', status: '待下发', color: 'orange', action: '下发', actionKey: 'period', primary: true },
            { kind: '项目盘点', progress: '0/36', title: '国家基金项目中期检查', desc: '固定清单 36 件，只核验项目购置物资。', status: '待下发', color: 'orange', action: '下发', actionKey: 'project' },
            { kind: '周期盘点', progress: '96/142', title: '2026 春季学期末盘点', desc: 'APP 已扫码 96 件，剩余仓库 A 和技能中心 B。', status: '进行中', color: 'blue', action: '查看', actionKey: 'view' },
            { kind: '项目盘点', progress: '18/22', title: '儿科模拟教学项目结题盘点', desc: '清单内 22 件，4 件待现场扫码。', status: '进行中', color: 'blue', action: '查看', actionKey: 'view' },
            { kind: '异常确认', progress: '3 条', title: '扫码异常待确认', desc: '缺失、位置不符、状态异常需要人工确认处理结论。', status: '待确认', color: 'red', action: '处理', actionKey: 'view', urgent: true },
            { kind: '已完成', progress: '142/142', title: '2026 年 4 月月末盘点', desc: '已完成扫码核验和异常归档，可查看盘点记录。', status: '已完成', color: 'green', action: '查看', actionKey: 'view' },
          ],
          scanResults: [
            { type: '缺失', title: '模拟血管套件 1 组', desc: '项目清单内应在仓库 A，APP 未扫码到', status: '待确认', color: 'red' },
            { type: '位置不符', title: '便携式超声 F2004770', desc: '档案库位为超声训练室，扫码位置为技能中心 B', status: '待修正', color: 'orange' },
            { type: '状态异常', title: '婴儿 CPR 模型 20211046', desc: '现场标记胸廓回弹异常，建议转维修', status: '待处理', color: 'purple' },
          ],
          usageRecords: [
            { type: '课程准备', title: '急救护理综合实训', desc: '儿童CPR模型、按压反馈系统、无菌手套', status: '待准备', color: 'orange' },
            { type: '临时借用', title: '便携式彩色超声诊断仪', desc: '赵教授借用，明日 08:30 前归还', status: '已借出', color: 'blue' },
          ],
          archiveRecords: [
            { type: '单个入库', title: '儿童 CPR 模型', desc: 'SN 20140455 · 技能中心 A · 刘老师', status: '已入库', color: 'green' },
            { type: '缺照片', title: '高级摄像评估系统', desc: '照片缺失，使用统计中无法快速识别实物', status: '待拍照', color: 'purple' },
          ],
          repairRecords: [
            { type: '报修来源', title: '重症呼吸思维学习系统', desc: '课程核对发现异常，需新建维修单', status: '待报修', color: 'orange' },
            { type: '维修中', title: '模拟摄像系统', desc: '已联系维修，等待校准结果', status: '维修中', color: 'blue' },
          ],
          repairWorkQueue: [
            { kind: '待报修', time: '04-25', title: '重症呼吸思维学习系统', desc: '课程核对发现参数调节模块异常，影响明日课程，需新建维修单。', status: '影响课程', color: 'red', action: '建单', actionKey: 'create', primary: true, urgent: true },
            { kind: '待报修', time: '04-25', title: '婴儿 CPR 模型', desc: '临时归还时发现胸腔按压反馈无响应，需要拍照并登记故障。', status: '待报修', color: 'orange', action: '建单', actionKey: 'create' },
            { kind: '维修中', time: '04-23', title: '模拟摄像系统（20240590）', desc: 'REP-2604230003，摄像采集模块校准偏移，等待维修结果。', status: '维修中', color: 'blue', action: '详情', actionKey: 'detail', no: 'REP-2604230003' },
            { kind: '维修中', time: '04-20', title: '重症呼吸思维学习系统', desc: 'REP-2604200001，参数调节模块异常，课程影响优先跟进。', status: '维修中', color: 'blue', action: '详情', actionKey: 'detail', no: 'REP-2604200001', urgent: true },
            { kind: '待完成', time: '03-18', title: '高级摄像评估系统（20241131）', desc: '摄像采集模块已更换，需记录维修结果、费用和附件。', status: '待记录', color: 'green', action: '完成', actionKey: 'finish' },
            { kind: '无法修复', time: '03-17', title: '腹部检查训练器', desc: '主板损坏且停产，需记录失败原因并转报损或采购替换。', status: '待结论', color: 'red', action: '完成', actionKey: 'finish' },
          ],
          singleForm: {
            name: '',
            category: '',
            categoryPath: [],
            model: '',
            brand: '',
            sn: '',
            assetNo: '',
            rfid: '',
            highValue: '',
            location: '',
            owner: '',
            project: '',
            borrowable: '',
            purchaseDate: '',
            price: 0,
            vendor: '',
            acceptance: '',
            note: '',
          },
          borrowForm: { asset: '', person: '', pickup: '', due: '', purpose: '', note: '' },
          returnForm: { action: '', signer: '' },
          repairForm: { no: 'REP-2605040001', owner: '刘国强', type: '', asset: '', desc: '', urgent: '' },
          finishForm: { result: '', cost: 0, date: '', note: '' },
          taskForm: { type: 'period', name: '', owner: '', scope: '', deadline: '', device: '', projectType: '' },
          periodFilters: { categories: [], locations: [], statuses: [], purchaseRange: [], keyword: '' },
          savedPeriodFilters: [
            { name: '全中心空闲物资', desc: '全部分类 · 全部库位 · 空闲可用', categories: [], locations: [], statuses: ['空闲可用'], purchaseRange: [], keyword: '' },
            { name: '仓库 A 教学模型', desc: '模型 · 仓库 A · 空闲可用与维修中', categories: ['模型'], locations: ['仓库 A'], statuses: ['空闲可用', '维修中'], purchaseRange: [], keyword: '' },
          ],
          inventoryObjects: [
            { name: '儿童 CPR 模型', sn: '20140455', category: '模型', location: '技能中心 A', owner: '刘老师', status: '空闲可用', purchaseDate: '2021-03-15', color: 'green', checked: true },
            { name: '婴儿心肺复苏模型', sn: '20211046', category: '模型', location: '仓库 A', owner: '刘老师', status: '待维修', purchaseDate: '2022-09-20', color: 'orange', checked: false },
            { name: '便携式彩色超声诊断仪', sn: 'F2004770', category: '医疗设备', location: '超声训练室', owner: '赵教授', status: '教学使用', purchaseDate: '2020-05-12', color: 'cyan', checked: true },
            { name: '高级摄像评估系统', sn: '20241131', category: '多媒体设备', location: '技能中心 B', owner: '刘老师', status: '盘点锁定', purchaseDate: '2024-11-30', color: 'purple', checked: false },
            { name: '腹腔镜训练系统', sn: 'S2308685', category: '模型', location: '仓库 A', owner: '刘老师', status: '维修中', purchaseDate: '2019-12-08', color: 'orange', checked: false },
            { name: '无菌手套 L 号', sn: 'CONS-0012', category: '耗材', location: '仓库 A', owner: '耗材库', status: '盘点锁定', purchaseDate: '2026-01-16', color: 'purple', checked: false },
            { name: '按压反馈系统', sn: '20240591', category: '多媒体设备', location: '技能中心 A', owner: '刘老师', status: '空闲可用', purchaseDate: '2024-05-02', color: 'green', checked: true },
            { name: '除颤监护仪', sn: 'MED-20240105', category: '医疗设备', location: '急救训练室', owner: '刘老师', status: '空闲可用', purchaseDate: '2024-01-05', color: 'green', checked: false },
            { name: '实训桌椅套装', sn: 'OTH-20260501', category: '其他设备', location: '技能中心 B', owner: '刘老师', status: '空闲可用', purchaseDate: '2026-05-01', color: 'green', checked: false },
          ],
          categoryOptions: ['模型', '耗材', '医疗设备', '多媒体设备', '其他设备'],
          categorySubOptions: {
            '模型': ['模拟人', '训练箱', '插管模型', '查体模型', '穿刺模型'],
            '耗材': ['防护类', '注射类', '敷料类', '管路类'],
            '医疗设备': ['监护仪', '超声', '急救设备', '输注设备', '检查设备'],
            '多媒体设备': ['录播系统', '摄像采集', '反馈系统', '虚拟系统', '中控设备'],
            '其他设备': ['家具', '推车', '储物设备', '床具', '教学辅助'],
          },
          newSingleSubCategory: '',
          newInboundDeviceSubCategory: '',
          newInboundConsumableSubCategory: '',
          newArchiveSubCategory: '',
          inboundDeviceCategoryPath: ['模型', '模拟人'],
          inboundConsumableCategoryPath: ['耗材', '防护类'],
          yesNoOptions: ['是', '否'],
          acceptanceOptions: ['待验收', '已验收', '需补资料', '退回供应商'],
          purposeOptions: ['课程临时使用', '科室借用', '教学演示', '维修替换'],
          returnResultOptions: ['正常', '损坏', '未找到'],
          returnActionOptions: ['正常入库', '转维修', '报损/追踪', '补充说明后归档'],
          typeOptions: ['多媒体设备', '其他设备', '模型', '医疗设备', '耗材配套设备'],
          assetOptions: ['模拟摄像系统（20240590）', '婴儿CPR模型（20160127）', '高级摄像评估系统（20241131）', '腹部检查训练器（S2308685）'],
          urgentOptions: ['一般', '紧急', '影响课程'],
          resultOptions: ['已修复（成功）', '已维修（失败）', '无法修复，建议报废', '需继续外送维修'],
          scopeOptions: ['全中心在库物资', '仓库 A', '技能中心 A', '国家基金项目清单', '中期检查清单'],
          periodLocationOptions: ['仓库 A', '技能中心 A', '技能中心 B', '超声训练室', '急救训练室'],
          periodStatusOptions: ['空闲可用', '教学使用', '已借出', '待维修', '维修中', '已报废', '盘点锁定'],
          deviceOptions: ['刘国强的手持 APP', '仓库 A 手持终端', '技能中心 A 手持终端'],
          projectTypeOptions: ['国家基金中期检查', '项目申报检查', '结题检查', '院内教学项目'],
          projectUploadChecks: [
            { label: '清单上传', desc: '国家基金项目中期检查清单.xlsx', status: '待上传', color: 'orange' },
            { label: '字段校验', desc: '需包含物资名称、SN、项目编号、责任人', status: '待校验', color: 'blue' },
            { label: '服务器保存', desc: '上传成功后保存为固定清单版本，可重复下发', status: '待保存', color: 'purple' },
          ],
          batchChecks: [
            { label: '清单总数', value: '188', desc: '共读取 188 条待入库记录', status: '已读取', color: 'blue' },
            { label: 'SN 重复', value: '2', desc: '2 条记录与现有档案或清单内 SN 重复', status: '需修正', color: 'red' },
            { label: '缺少库位', value: '1', desc: '1 条记录缺少库位，需补充后才能导入', status: '需补充', color: 'orange' },
          ],
        };
      },
      computed: {
        currentPage() {
          return this.pages.find((item) => item.key === this.activePage);
        },
        currentRecords() {
          if (this.activePage === 'archive') return this.archiveRecords;
          if (this.activePage === 'usage') return this.usageRecords;
          if (this.activePage === 'repair') return this.repairRecords;
          return [];
        },
        recordTitle() {
          return this.activePage === 'archive' ? '今日入库与待完善' : this.activePage === 'usage' ? '今日处理记录' : '今日维修记录';
        },
        recordDesc() {
          return this.activePage === 'archive' ? '入库完成和档案待补充事项集中在这里。' : this.activePage === 'usage' ? '只记录今天已经做过或马上要做的课程准备、核对、借出、归还。' : '只记录今天已发生的报修、建单、维修完成和无法修复结论。';
        },
        filteredModels() {
          return this.filterAssetRows('模型');
        },
        filteredMedical() {
          return this.filterAssetRows('医疗设备');
        },
        filteredDevices() {
          return this.filterAssetRows('多媒体设备');
        },
        filteredOtherDevices() {
          return this.filterAssetRows('其他设备');
        },
        categoryCascaderOptions() {
          return this.categoryOptions.map((category) => ({
            value: category,
            label: category,
            children: (this.categorySubOptions[category] || []).map((subCategory) => ({
              value: subCategory,
              label: subCategory,
            })),
          }));
        },
        inboundTabCategory() {
          const map = { model: '模型', medical: '医疗设备', consumable: '耗材', device: '多媒体设备', other: '其他设备' };
          return map[this.inboundTab] || '模型';
        },
        activeArchiveSubCategoryOptions() {
          return this.categorySubOptions[this.inboundTabCategory] || [];
        },
        filteredConsData() {
          return this.inbConsData.filter(i => {
            const statusLabel = i.statusLabel || (i.status === 'warn' ? '盘点锁定' : '空闲可用');
            const archiveKeyword = (this.archiveKeyword || '').trim().toLowerCase();
            const archiveProperty = this.archiveFilters.property;
            const archiveSubCategory = this.archiveFilters.subCategory;
            const archiveLocation = this.archiveFilters.location;
            const archiveStatus = this.archiveFilters.status;
            const searchableText = [i.name, i.spec, i.category, i.id, i.property, statusLabel];
            const matchArchiveKeyword = !archiveKeyword || searchableText.some((value) => String(value || '').toLowerCase().includes(archiveKeyword));
            const matchArchiveProperty = !archiveProperty || i.property === archiveProperty;
            const matchArchiveSubCategory = !archiveSubCategory || i.category === archiveSubCategory || i.subCategory === archiveSubCategory;
            const matchArchiveLocation = !archiveLocation || i.location === archiveLocation;
            const matchArchiveStatus = !archiveStatus || statusLabel === archiveStatus;
            return matchArchiveKeyword && matchArchiveProperty && matchArchiveSubCategory && matchArchiveLocation && matchArchiveStatus;
          });
        },
        activeConsumableStockRecords() {
          const stock = Number(this.activeConsumableRecord?.stock || 48);
          const afterReceive = stock + 50;
          const baseRecords = [
            { time: '2026-04-21 14:00', type: '领用', qty: -20, after: stock, operator: '王芳', remark: '急救护理综合实训', color: 'red' },
            { time: '2026-04-18 09:00', type: '领用', qty: -30, after: afterReceive, operator: '赵丽华', remark: '护理操作综合培训', color: 'red' },
            { time: '2026-03-15 10:00', type: '入库', qty: 500, after: afterReceive + 30, operator: '刘国强', remark: '采购入库', color: 'green' },
            { time: '2026-03-01 16:00', type: '盘点调整', qty: -2, after: afterReceive - 470, operator: '刘国强', remark: '盘点盘亏', color: 'orange' },
          ];
          return baseRecords;
        },
        archiveFilteredTotal() {
          return this.filteredModels.length + this.filteredMedical.length + this.filteredDevices.length + this.filteredOtherDevices.length + this.filteredConsData.length;
        },
        archiveQuickResults() {
          const search = (this.archiveKeyword || '').trim();
          if (!search) return [];
          const assets = this.assetList.map((item) => ({
            ...item,
            statusLabel: item.status,
            statusColor: this.getStatusColor(item.status),
          }));
          const consumables = this.inbConsData.map((item) => ({
            ...item,
            code: item.id,
            category: '耗材',
            statusLabel: item.statusLabel || (item.status === 'warn' ? '盘点锁定' : '空闲可用'),
            statusColor: item.status === 'warn' ? 'red' : 'green',
          }));
          return [...assets, ...consumables]
            .filter((item) => `${item.name}${item.code}${item.category}${item.statusLabel}`.includes(search))
            .slice(0, 8);
        },
filteredWorkbenchSearchResults() {
          const keyword = (this.workbenchSearch.keyword || '').trim();
          const category = this.workbenchSearch.category;
          const status = this.workbenchSearch.status;
          const property = this.workbenchSearch.property;
          
          if (!keyword && !category && !property && !status) {
            return this.workbenchSearchResults.slice(0, 12);
          }
          
          return this.workbenchArchiveSearchResults.filter((item) => {
            const text = `${item.name}${item.code}${item.location}${item.note}`;
            const matchKeyword = !keyword || text.toLowerCase().includes(keyword.toLowerCase());
            const matchCategory = !category || category === '' || item.category === category;
            const matchProperty = !property || property === '' || item.property === property;
            const matchStatus = !status || status === '' || item.status === status;
            return matchKeyword && matchCategory && matchProperty && matchStatus;
          });
        },
        workbenchArchiveSearchResults() {
          const assets = this.assetList.map((item) => ({
            ...item,
            location: item.currentLocation || item.homeLocation,
            note: `库位：${item.homeLocation} · 使用 ${item.usageCount || 0} 次`,
            color: this.getStatusColor(item.status),
            action: '查看档案',
            targetPage: 'archive',
            icon: item.category === '医疗设备' ? 'smartphone' : (item.category === '多媒体设备' ? 'images' : 'package'),
          }));
          const consumables = this.inbConsData.map((item) => {
            const statusLabel = item.statusLabel || (item.status === 'warn' ? '盘点锁定' : item.status === 'out' ? '盘点锁定' : '空闲可用');
            return {
              ...item,
              code: item.id,
              category: '耗材',
              property: item.property || '科室经费',
              status: statusLabel,
              color: item.status === 'warn' ? 'red' : item.status === 'out' ? 'red' : 'green',
              location: item.location || '仓库A',
              note: `库存：${item.stock}${item.unit || ''} · 安全库存：${item.min || 0}${item.unit || ''}`,
              action: '查看档案',
              targetPage: 'archive',
              icon: 'archive',
            };
          });
          return [...assets, ...consumables];
        },
        displayedWorkbenchSearchResults() {
          return this.filteredWorkbenchSearchResults.slice(0, 12);
        },
        hasMoreWorkbenchSearchResults() {
          const keyword = (this.workbenchSearch.keyword || '').trim();
          const hasFilters = this.workbenchSearch.category || this.workbenchSearch.property || this.workbenchSearch.status;
          if (!keyword && !hasFilters) {
            return this.workbenchSearchResults.length > 12;
          }
          return this.filteredWorkbenchSearchResults.length > this.displayedWorkbenchSearchResults.length;
        },
        filteredTeachingUseData() {
          const keyword = (this.usageFilters.keyword || '').trim();
          return this.teachingUseData.filter((item) => {
            const text = `${item.course}${item.teacher}${item.classroom}${item.materialTags.join('')}`;
            return (!keyword || text.includes(keyword))
              && (!this.usageFilters.department || item.department === this.usageFilters.department)
              && (!this.usageFilters.status || item.status === this.usageFilters.status);
          });
        },
        filteredBorrowUseData() {
          const keyword = (this.borrowFilters.keyword || '').trim();
          return this.borrowUseData.filter((item) => {
            const text = `${item.device}${item.borrower}${item.department}${item.desc}`;
            return (!keyword || text.includes(keyword))
              && (!this.borrowFilters.department || item.department === this.borrowFilters.department)
              && (!this.borrowFilters.status || item.status === this.borrowFilters.status);
          });
        },
        activeUsageTrendTypes() {
          const selected = this.usageTrendTypes.filter((type) => this.visibleUsageTrendTypes.includes(type.key));
          return selected.length ? selected : this.usageTrendTypes;
        },
        displayedUsageTrendData() {
          return this.usageTrendData.slice(-8);
        },
        usageTrendWithTotals() {
          const maxTotal = Math.max(...this.displayedUsageTrendData.map((item) => this.getUsageTrendTotal(item)));
          return this.displayedUsageTrendData.map((item) => {
            const total = this.getUsageTrendTotal(item);
            return {
              ...item,
              total,
              totalPercent: Math.max(8, (total / maxTotal) * 100),
              segments: this.activeUsageTrendTypes.map((type) => ({
                ...type,
                value: item[type.key],
                percent: total ? (item[type.key] / total) * 100 : 0,
              })),
            };
          });
        },
        usageTrendTicks() {
          const maxTotal = Math.max(...this.displayedUsageTrendData.map((item) => this.getUsageTrendTotal(item)));
          const top = Math.ceil(maxTotal / 50) * 50;
          return [top, Math.round(top * 0.75), Math.round(top * 0.5), Math.round(top * 0.25), 0];
        },
        usageTrendPointList() {
          const maxTotal = this.usageTrendTicks[0] || 1;
          const count = Math.max(this.usageTrendWithTotals.length, 1);
          return this.usageTrendWithTotals.map((item, index) => ({
            month: item.month,
            x: ((index + 0.5) / count) * 1000,
            y: 260 - (item.total / maxTotal) * 260,
            left: ((index + 0.5) / count) * 100,
            top: 100 - (item.total / maxTotal) * 100,
          }));
        },
        usageTrendLinePath() {
          const points = this.usageTrendPointList;
          if (!points.length) return '';
          if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
          return points.reduce((path, point, index) => {
            if (index === 0) return `M ${point.x} ${point.y}`;
            const prev = points[index - 1];
            const cpOffset = (point.x - prev.x) / 2;
            return `${path} C ${prev.x + cpOffset} ${prev.y}, ${point.x - cpOffset} ${point.y}, ${point.x} ${point.y}`;
          }, '');
        },
        activeUsageTrend() {
          return this.usageTrendWithTotals.find((item) => item.month === this.activeUsageTrendMonth) || this.usageTrendWithTotals[this.usageTrendWithTotals.length - 1];
        },
        filteredInventoryObjects() {
          return this.inventoryObjects.filter((item) => {
            const keyword = this.periodFilters.keyword.trim();
            const text = `${item.name}${item.sn}${item.owner}${item.location}`;
            const categories = this.periodFilters.categories || [];
            const locations = this.periodFilters.locations || [];
            const statuses = this.periodFilters.statuses || [];
            const range = this.periodFilters.purchaseRange || [];
            const itemDate = new Date(item.purchaseDate).getTime();
            const start = range[0] ? new Date(range[0]).getTime() : null;
            const end = range[1] ? new Date(range[1]).getTime() : null;
            return (!categories.length || categories.includes(item.category))
              && (!locations.length || locations.includes(item.location))
              && (!statuses.length || statuses.includes(item.status))
              && (!start || itemDate >= start)
              && (!end || itemDate <= end)
              && (!keyword || text.includes(keyword));
          });
        },
        filteredRepairWorkQueue() {
          const keyword = (this.repairFilters.keyword || '').trim();
          const status = this.repairFilters.status;
          const statusKindMap = {
            '待维修': '待报修',
            '维修中': '维修中',
            '维修成功': '待完成',
            '维修失败': '无法修复',
          };
          return this.repairWorkQueue.filter((item) => {
            const text = `${item.title}${item.desc}${item.status}${item.no || ''}`;
            const matchKeyword = !keyword || text.includes(keyword);
            const matchStatus = !status || item.kind === statusKindMap[status];
            return matchKeyword && matchStatus;
          });
        },
        filteredInventoryResultItems() {
          if (!this.activeInventoryRecord) return [];
          const filter = this.inventoryResultFilter;
          return this.inventoryResultItems.map(this.normalizeInventoryItem).filter(item => {
            if (filter === 'all') return true;
            if (filter === 'checked') return item.inventoryStatus === '已盘到';
            if (filter === 'missing') return item.inventoryStatus === '未盘到';
            return true;
          });
        },
        inventoryCheckedCount() {
          return this.inventoryResultItems.map(this.normalizeInventoryItem).filter((item) => item.inventoryStatus === '已盘到').length;
        },
        inventoryMissingCount() {
          return this.inventoryResultItems.map(this.normalizeInventoryItem).filter((item) => item.inventoryStatus === '未盘到').length;
        },

      },
      mounted() {
        document.addEventListener('click', this.handleWorkbenchSearchOutside);
        // 默认选中第一个盘点记录
        if (this.inventoryHistoryList && this.inventoryHistoryList.length > 0) {
          this.activeInventoryRecord = this.inventoryHistoryList[0];
        }
        // 初始化资产卡片环形图
        this.$nextTick(() => {
          this.initAssetCharts();
        });
      },
      beforeUnmount() {
        document.removeEventListener('click', this.handleWorkbenchSearchOutside);
      },
      watch: {
        inboundTab() {
          this.archiveFilters.subCategory = '';
        },
        showWorkbenchSearchPanel(visible) {
          if (!visible) return;
          this.$nextTick(() => {
            setTimeout(() => {
              const input = document.querySelector('.workbench-search-entry .workbench-search-input input');
              if (input) input.focus();
            }, 80);
          });
        },
      },
      methods: {
        setChartRef(el, type) {
          if (el) this.chartRefs[type] = el;
        },
        initAssetCharts() {
          if (!window.echarts) return;
          this.inventoryMix.forEach(item => {
            const container = this.chartRefs[item.type];
            if (!container) return;
            const chart = echarts.init(container, null, { renderer: 'canvas', width: container.clientWidth, height: container.clientHeight });
            const option = {
              color: this.chartColors[item.type],
              tooltip: {
                trigger: 'item',
                appendToBody: true,
                backgroundColor: '#fff',
                borderColor: '#e3e5e8',
                borderWidth: 1,
                textStyle: { color: '#4e5969', fontSize: 12 },
                formatter: '{b}: {c} 件'
              },
              series: [{
                type: 'pie',
                radius: ['58%', '88%'],
                center: ['50%', '50%'],
                data: item.breakdown,
                label: { show: false },
                itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
                emphasis: { scale: true, scaleSize: 6 }
              }]
            };
            chart.setOption(option);
          });
        },
        filterAssetRows(category) {
          const archiveKeyword = (this.archiveKeyword || '').trim().toLowerCase();
          const archiveProperty = this.archiveFilters.property;
          const archiveSubCategory = this.archiveFilters.subCategory;
          const archiveLocation = this.archiveFilters.location;
          const archiveStatus = this.archiveFilters.status;
          return this.assetList.filter((item) => {
            const matchCategory = item.category === category;
            const matchArchiveKeyword = !archiveKeyword || [item.name, item.code, item.category, item.subCategory, item.property, item.status, item.homeLocation, item.currentLocation].some((value) => String(value || '').toLowerCase().includes(archiveKeyword));
            const matchArchiveProperty = !archiveProperty || item.property === archiveProperty;
            const matchArchiveSubCategory = !archiveSubCategory || item.subCategory === archiveSubCategory;
            const matchArchiveLocation = !archiveLocation || item.homeLocation === archiveLocation || item.currentLocation === archiveLocation;
            const matchArchiveStatus = !archiveStatus || item.status === archiveStatus;
            return matchCategory && matchArchiveKeyword && matchArchiveProperty && matchArchiveSubCategory && matchArchiveLocation && matchArchiveStatus;
          });
        },
        syncArchiveTab(category) {
          const tabMap = { '模型': 'model', '医疗设备': 'medical', '耗材': 'consumable', '多媒体设备': 'device', '其他设备': 'other' };
          if (tabMap[category]) this.inboundTab = tabMap[category];
        },
        openArchiveSearchResult(item) {
          const tabMap = { '模型': 'model', '医疗设备': 'medical', '耗材': 'consumable', '多媒体设备': 'device', '其他设备': 'other' };
          if (tabMap[item.category]) this.inboundTab = tabMap[item.category];
          this.activeRecord = item;
          this.ensureRecordCategoryPath(this.activeRecord);
          this.showArchiveDetail = true;
        },
        openConsumableStockRecords(record) {
          this.activeConsumableRecord = record;
          this.showConsumableStockDrawer = true;
        },
        addSubCategory(categoryPath, value, inputKey, parentOverride) {
          const [pathParent] = categoryPath || [];
          const parent = parentOverride || pathParent;
          const name = String(value || '').trim();
          if (!parent || !this.categoryOptions.includes(parent) || !name) return;
          if (!this.categorySubOptions[parent]) this.categorySubOptions[parent] = [];
          if (!this.categorySubOptions[parent].includes(name)) this.categorySubOptions[parent].push(name);
          if (Array.isArray(categoryPath)) categoryPath.splice(0, categoryPath.length, parent, name);
          if (this.activeRecord && this.activeRecord.categoryPath === categoryPath) {
            this.activeRecord.category = parent;
            this.activeRecord.subCategory = name;
          }
          if (inputKey) this[inputKey] = '';
        },
        ensureRecordCategoryPath(record) {
          if (!record) return;
          const parent = this.categoryOptions.includes(record.category) ? record.category : this.inboundTabCategory;
          const child = record.subCategory || '';
          record.categoryPath = child ? [parent, child] : [parent];
        },
        handleActiveRecordCategoryChange(value) {
          if (!this.activeRecord || !Array.isArray(value)) return;
          const [category, subCategory] = value;
          this.activeRecord.category = category || this.activeRecord.category;
          this.activeRecord.subCategory = subCategory || '';
        },
        getCategoryPathLabel(path) {
          return Array.isArray(path) ? path.filter(Boolean).join(' / ') : '';
        },
        resetWorkbenchSearch() {
          this.workbenchSearch = { keyword: '', category: '', property: '', status: '' };
        },
        resetWorkbenchKeyword() {
          this.workbenchSearch.keyword = '';
          this.showWorkbenchSearchPanel = true;
          this.$nextTick(() => {
            const input = document.querySelector('.workbench-search-entry .workbench-search-input input');
            if (input) input.focus();
          });
        },
        setWorkbenchKeyword(keyword) {
          this.workbenchSearch.keyword = keyword;
          this.showWorkbenchSearchPanel = true;
          this.$nextTick(() => {
            const input = document.querySelector('.workbench-search-entry .workbench-search-input input');
            if (input) input.focus();
          });
        },
        applyWorkbenchSearchChip(chip) {
          this.workbenchSearch.status = chip.status;
        },
applyWorkbenchSearchToArchive() {
          const keyword = (this.workbenchSearch.keyword || '').trim();
          this.archiveKeyword = keyword;
          this.assetSearch.model = keyword;
          this.assetSearch.medical = keyword;
          this.assetSearch.device = keyword;
          this.assetSearch.other = keyword;
          this.assetSearch.consumable = keyword;
          this.modelFilters.status = this.workbenchSearch.status;
          this.medicalFilters.status = this.workbenchSearch.status;
          this.deviceFilters.status = this.workbenchSearch.status;
          this.otherFilters.status = this.workbenchSearch.status;
          this.consFilterStatus = this.workbenchSearch.status;
          this.archiveFilters.category = this.workbenchSearch.category;
          this.archiveFilters.property = this.workbenchSearch.property;
          this.archiveFilters.location = this.workbenchSearch.location;
          this.archiveFilters.status = this.workbenchSearch.status;
          if (this.workbenchSearch.category) this.syncArchiveTab(this.workbenchSearch.category);
        },
        goArchiveSearchResults() {
          this.applyWorkbenchSearchToArchive();
          this.activePage = 'archive';
          this.showWorkbenchSearchPanel = false;
        },
        openWorkbenchSearchRecord(record) {
          const recordWithImage = {
            ...record,
            homeLocation: record.location,
            currentLocation: record.location,
            image: record.image || 'https://images.unsplash.com/photo-1584362917165-526a968579e8?q=80&w=200&auto=format&fit=crop',
          };
          this.activeRecord = recordWithImage;
          this.ensureRecordCategoryPath(this.activeRecord);
          this.showArchiveDetail = true;
        },
        handleWorkbenchSearchOutside(event) {
          if (event.target.closest && event.target.closest('.arco-trigger-popup')) return;
          const panel = this.$refs.workbenchSearchPanel;
          if (!panel || panel.contains(event.target)) return;
          this.showWorkbenchSearchPanel = false;
        },
        getUsageTrendTotal(item) {
          return this.activeUsageTrendTypes.reduce((sum, type) => sum + (Number(item[type.key]) || 0), 0);
        },
        openInboundBatchPage() {
          this.inboundBatchMode = true;
          this.inboundBatchFileName = '';
          this.inboundBatchRows = [];
          this.inboundBatchErrors = [];
        },
        backInboundForm() {
          this.inboundBatchMode = false;
        },
        triggerInboundBatchFile() {
          if (this.$refs.inboundBatchInput) this.$refs.inboundBatchInput.click();
        },
        handleInboundBatchFile(event) {
          const file = event.target.files && event.target.files[0];
          if (!file) return;
          this.inboundBatchFileName = file.name;
          this.inboundBatchParsing = true;
          const reader = new FileReader();
          reader.onload = (loadEvent) => {
            try {
              const rows = this.readInboundBatchRows(file, loadEvent.target.result);
              this.applyInboundBatchParse(rows);
              this.notifyInbound(`${this.inboundBatchFileName} 解析完成，识别 ${this.inboundBatchRows.length} 条可导入数据。`, 'success');
            } catch (error) {
              this.inboundBatchRows = [];
              this.inboundBatchErrors = [{ row: '-', reason: error.message || '文件解析失败，请检查文件格式' }];
              this.notifyInbound('文件解析失败，请使用标准 Excel 或 CSV 模板。', 'error');
            } finally {
              this.inboundBatchParsing = false;
              event.target.value = '';
            }
          };
          reader.onerror = () => {
            this.inboundBatchParsing = false;
            this.notifyInbound('文件读取失败，请重新选择文件。', 'error');
          };
          if (/\.csv$/i.test(file.name)) reader.readAsText(file, 'utf-8');
          else reader.readAsArrayBuffer(file);
        },
        readInboundBatchRows(file, result) {
          if (/\.csv$/i.test(file.name)) return this.parseCsvRows(result);
          if (!window.XLSX) throw new Error('缺少 Excel 解析库');
          const workbook = XLSX.read(result, { type: 'array' });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          return XLSX.utils.sheet_to_json(sheet, { defval: '' });
        },
        parseCsvRows(text) {
          const rows = String(text || '').replace(/^\ufeff/, '').split(/\r?\n/).filter((line) => line.trim());
          if (rows.length < 2) return [];
          const headers = this.splitCsvLine(rows[0]).map((item) => item.trim());
          return rows.slice(1).map((line) => {
            const values = this.splitCsvLine(line);
            return headers.reduce((row, header, index) => {
              row[header] = values[index] || '';
              return row;
            }, {});
          });
        },
        splitCsvLine(line) {
          const result = [];
          let current = '';
          let quoted = false;
          for (let i = 0; i < line.length; i += 1) {
            const char = line[i];
            if (char === '"' && line[i + 1] === '"') {
              current += '"';
              i += 1;
            } else if (char === '"') {
              quoted = !quoted;
            } else if (char === ',' && !quoted) {
              result.push(current);
              current = '';
            } else {
              current += char;
            }
          }
          result.push(current);
          return result;
        },
        pickInboundValue(row, keys) {
          const entries = Object.entries(row || {});
          const matched = entries.find(([key]) => keys.some((name) => String(key).trim().toLowerCase() === name.toLowerCase()));
          if (matched) return matched[1];
          const fuzzy = entries.find(([key]) => keys.some((name) => String(key).toLowerCase().includes(name.toLowerCase())));
          return fuzzy ? fuzzy[1] : '';
        },
        applyInboundBatchParse(rawRows) {
          const parsed = [];
          const errors = [];
          (rawRows || []).forEach((row, index) => {
            const item = this.inboundType === 'consumable'
              ? this.normalizeInboundConsumable(row, index)
              : this.normalizeInboundDevice(row, index);
            if (item.error) errors.push({ row: index + 2, reason: item.error });
            else parsed.push(item);
          });
          this.inboundBatchRows = parsed;
          this.inboundBatchErrors = errors;
        },
        normalizeInboundConsumable(row, index) {
          const name = String(this.pickInboundValue(row, ['耗材名称', '名称', '物资名称', 'name']) || '').trim();
          const stock = Number(this.pickInboundValue(row, ['库存数量', '入库数量', '数量', 'stock', 'quantity']) || 0);
          if (!name) return { error: '缺少耗材名称' };
          if (!stock || stock < 0) return { error: '缺少有效入库数量' };
          const min = Number(this.pickInboundValue(row, ['最低库存', '安全库存', '库存阈值', 'min']) || 20);
          const category = String(this.pickInboundValue(row, ['分类', '耗材分类', '二级分类', 'category']) || '防护类').trim();
          const id = String(this.pickInboundValue(row, ['编码/批次', '耗材编码', '编码', '批次', 'id', 'code']) || `CONS-IMP-${Date.now()}-${index + 1}`).trim();
          return {
            previewId: `cons-${index}`,
            id,
            name,
            spec: String(this.pickInboundValue(row, ['规格', '型号', '规格型号', 'spec']) || '').trim(),
            category,
            subCategory: category,
            stock,
            min,
            unit: String(this.pickInboundValue(row, ['单位', 'unit']) || '个').trim(),
            status: stock < min ? 'warn' : 'ok',
            property: String(this.pickInboundValue(row, ['资产性质', '资金来源', 'property']) || '科室经费').trim(),
            statusLabel: stock < min ? '盘点锁定' : '空闲可用',
            statusClass: stock < min ? 'red' : 'green',
            location: String(this.pickInboundValue(row, ['库位', '仓库/存放地点', '存放地点', 'location']) || '仓库A').trim(),
            vendor: String(this.pickInboundValue(row, ['供应商', '供应商 / 联系电话', 'vendor']) || '').trim(),
            price: Number(this.pickInboundValue(row, ['单价', 'price']) || 0),
          };
        },
        normalizeInboundDevice(row, index) {
          const name = String(this.pickInboundValue(row, ['设备名称', '名称', '物资名称', 'name']) || '').trim();
          if (!name) return { error: '缺少设备名称' };
          const category = String(this.pickInboundValue(row, ['分类', '设备类型', 'category']) || '模型').trim();
          const code = String(this.pickInboundValue(row, ['设备编码', '编码', '资产编号', 'code']) || `DEV-IMP-${Date.now()}-${index + 1}`).trim();
          const location = String(this.pickInboundValue(row, ['存放地点', '库位', '仓库/存放地点', 'location']) || '技能中心A').trim();
          return {
            previewId: `dev-${index}`,
            id: code,
            name,
            code,
            sn: String(this.pickInboundValue(row, ['SN码', '设备S/N码', 'SN', 'sn']) || '').trim(),
            brandModel: String(this.pickInboundValue(row, ['品牌/型号', '品牌型号', '型号', 'brandModel']) || '').trim(),
            vendor: String(this.pickInboundValue(row, ['供应商', '供应商 / 联系电话', 'vendor']) || '').trim(),
            price: Number(this.pickInboundValue(row, ['单价', 'price']) || 0),
            purchaseDate: String(this.pickInboundValue(row, ['采购日期', 'purchaseDate']) || '').trim(),
            category: this.categoryOptions.includes(category) ? category : '模型',
            subCategory: String(this.pickInboundValue(row, ['二级分类', 'subCategory']) || '').trim(),
            property: String(this.pickInboundValue(row, ['资产性质', '资金来源', 'property']) || '复旦医学院').trim(),
            homeLocation: location,
            currentLocation: location,
            quantity: Number(this.pickInboundValue(row, ['数量', '入库数量', 'quantity']) || 1),
            usageCount: 0,
            status: String(this.pickInboundValue(row, ['状态', 'status']) || '空闲可用').trim(),
            image: '',
          };
        },
        confirmInboundBatchImport() {
          if (!this.inboundBatchRows.length) return;
          const count = this.inboundBatchRows.length;
          if (this.inboundType === 'consumable') {
            this.inbConsData.unshift(...this.inboundBatchRows.map(({ previewId, ...item }) => item));
          } else {
            this.assetList.unshift(...this.inboundBatchRows.map(({ previewId, quantity, ...item }) => item));
          }
          this.archiveRecords.unshift({
            type: '批量入库',
            title: `${this.inboundType === 'consumable' ? '耗材' : '设备'}清单导入`,
            desc: `${this.inboundBatchFileName || '上传文件'} · 成功导入 ${count} 条`,
            status: '已入库',
            color: 'green',
          });
          this.refreshArchiveCounters();
          this.notifyInbound(`已导入 ${count} 条数据，前端列表已更新。`, 'success');
          this.inboundBatchMode = false;
          this.showInboundDrawer = false;
          if (this.inboundType === 'consumable') this.inboundTab = 'consumable';
        },
        refreshArchiveCounters() {
          const total = this.assetList.length + this.inbConsData.length;
          const page = this.pages.find((item) => item.key === 'archive');
          if (page) page.count = total;
          const summary = this.archiveSummary.find((item) => item.label === '全部档案');
          if (summary) summary.value = String(total);
          const consumableMix = this.inventoryMix.find((item) => item.type === 'consumable');
          if (consumableMix) consumableMix.count = this.inbConsData.length;
        },
        notifyInbound(message, type = 'info') {
          if (this.$message && this.$message[type]) this.$message[type](message);
        },
        handleAction(key) {
          if (key === 'inbound') {
            this.inboundBatchMode = false;
            this.showInboundDrawer = true;
          }
          if (key === 'singleInbound') this.showSingleInbound = true;
          if (key === 'batchInbound') this.showBatchInbound = true;
          if (key === 'borrow') this.showBorrowModal = true;
          if (key === 'coursePrep') this.showPrepareDrawer = true;
          if (key === 'courseCheck') this.showReturnDrawer = true;
          if (key === 'return') this.showReturnDrawer = true;
          if (key === 'createRepair') this.showCreateRepair = true;
          if (key === 'finishRepair') this.showFinishRepair = true;
          if (key === 'periodTask') this.openTaskModal('period');
          if (key === 'projectTask' || key === 'inventoryTask') this.openTaskModal('project');
        },
        handleWorkQueueClick(item) {
          if (item.actionKey === 'prepare') {
            this.usageTab = 'teaching';
            this.activePage = 'usage';
          }
          if (item.actionKey === 'overdue') { this.usageTab = 'borrow'; this.activePage = 'usage'; }
          if (item.actionKey === 'repair') this.activePage = 'repair';
          if (item.actionKey === 'inventory') this.activePage = 'inventory';
        },
        handleTodoAction(todo) {
          if (todo.actionKey === 'repair') this.showCreateRepair = true;
          if (todo.actionKey === 'prepare') this.showPrepareDrawer = true;
          if (todo.actionKey === 'overdue') { this.usageTab = 'borrow'; this.activePage = 'usage'; }
          if (todo.actionKey === 'inventory') this.activePage = 'inventory';
        },
        isArchiveSelected(record) {
          return this.selectedArchiveIds.includes(record.id);
        },
        isArchiveAllSelected(list) {
          return list.length > 0 && list.every((record) => this.selectedArchiveIds.includes(record.id));
        },
        isArchivePartSelected(list) {
          return list.some((record) => this.selectedArchiveIds.includes(record.id)) && !this.isArchiveAllSelected(list);
        },
        toggleArchiveSelect(id) {
          const idx = this.selectedArchiveIds.indexOf(id);
          if (idx === -1) this.selectedArchiveIds.push(id);
          else this.selectedArchiveIds.splice(idx, 1);
        },
        deleteArchiveRecord(record) {
          if (!window.confirm(`确认删除「${record.name}」？`)) return;
          this.removeArchiveRecords([record.id]);
        },
        lockArchiveRecord(record) {
          this.lockArchiveRecords([record.id]);
        },
        batchDeleteArchive() {
          this.removeArchiveRecords([...this.selectedArchiveIds]);
          this.showBatchDeleteConfirm = false;
        },
        batchLockArchive() {
          this.lockArchiveRecords([...this.selectedArchiveIds]);
          this.selectedArchiveIds = [];
        },
        removeArchiveRecords(ids) {
          if (!ids.length) return;
          const idSet = new Set(ids);
          this.assetList = this.assetList.filter((item) => !idSet.has(item.id));
          this.inbConsData = this.inbConsData.filter((item) => !idSet.has(item.id));
          this.selectedArchiveIds = this.selectedArchiveIds.filter((id) => !idSet.has(id));
          if (this.activeRecord && idSet.has(this.activeRecord.id)) {
            this.activeRecord = null;
            this.showArchiveDetail = false;
          }
          this.refreshArchiveCounters();
        },
        lockArchiveRecords(ids) {
          if (!ids.length) return;
          const idSet = new Set(ids);
          this.assetList.forEach((item) => {
            if (idSet.has(item.id)) item.status = '盘点锁定';
          });
          this.inbConsData.forEach((item) => {
            if (idSet.has(item.id)) {
              item.status = 'locked';
              item.statusLabel = '盘点锁定';
              item.statusClass = 'gray';
            }
          });
        },
        toggleSelectAllArchive(list) {
          const allIds = list.map(r => r.id);
          if (!allIds.length) return;
          const allSelected = allIds.every(id => this.selectedArchiveIds.includes(id));
          if (allSelected) this.selectedArchiveIds = this.selectedArchiveIds.filter(id => !allIds.includes(id));
          else allIds.forEach(id => { if (!this.selectedArchiveIds.includes(id)) this.selectedArchiveIds.push(id); });
        },
        openTeachingDetail(record) { this.activeTeachingRecord = record; this.showTeachingDetail = true; },
        openTeachingPrepare(record) {
          this.activeTeachingRecord = record;
          if (record && record.pilot) {
            this.teachingPrepareDevices = [
              { id: 'pilot-device-1', type: '多媒体设备', name: '录播与回看设备', qty: 1, state: '正常', avail: '依赖替代场地确认' },
            ];
            this.teachingPrepareConsumables = [
              { id: 'pilot-consumable-1', cat: '训练耗材', name: '标准化病人角色卡', need: 6, stock: 4 },
              { id: 'pilot-consumable-2', cat: '训练耗材', name: '沟通观察记录表', need: 20, stock: 20 },
            ];
          }
          this.showTeachingPrepare = true;
        },
        acceptMaterialAlternative() {
          if (!this.activeTeachingRecord || !this.activeTeachingRecord.pilot) return;
          this.activeTeachingRecord.resourceStatus = 'ready';
          this.activeTeachingRecord.resourceStatusLabel = '替代方案已确认';
          this.activeTeachingRecord.status = '已备妥';
          this.activeTeachingRecord.statusColor = 'green';
          this.activeTeachingRecord.materialTags = ['标准化病人角色卡 4 套', '电子角色卡 2 组', '沟通观察记录表 20 份'];
          this.teachingPrepareConsumables[0].stock = 6;
          if (window.TeachingBusiness && window.TeachingBusiness.updateResourceAssurance) {
            window.TeachingBusiness.updateResourceAssurance(this.activeTeachingRecord.course, 'material', {
              status: 'ready',
              statusLabel: '物资已备妥（含替代方案）',
              selectedAlternative: this.activeTeachingRecord.alternative,
              recordText: '物资管理员采用电子角色卡替代方案，物资任务已就绪'
            });
          }
          window.ArcoVue.Message.success('替代方案已采用，物资任务标记为已备妥');
        },
        finishTeachingPrepare() {
          if (!this.activeTeachingRecord) return;
          if (this.activeTeachingRecord.resourceStatus === 'partial') {
            window.ArcoVue.Message.warning('仍有资源缺口，请先补齐物资或采用替代方案');
            return;
          }
          this.activeTeachingRecord.status = '已备妥';
          this.activeTeachingRecord.statusColor = 'green';
          this.showTeachingPrepare = false;
          window.ArcoVue.Message.success('课程物资已准备完成，等待后续确认');
        },
        addTeachingPrepareDevice() {
          this.teachingPrepareDevices.push({
            id: Date.now() + Math.random(),
            type: '模型',
            name: '',
            qty: 1,
            state: '正常',
            avail: '可用',
          });
        },
        removeTeachingPrepareDevice(index) {
          if (this.teachingPrepareDevices.length > 1) this.teachingPrepareDevices.splice(index, 1);
        },
        addTeachingPrepareConsumable() {
          this.teachingPrepareConsumables.push({
            id: Date.now() + Math.random(),
            cat: '防护类',
            name: '',
            need: 1,
            stock: 0,
          });
        },
        removeTeachingPrepareConsumable(index) {
          if (this.teachingPrepareConsumables.length > 1) this.teachingPrepareConsumables.splice(index, 1);
        },
        openTeachingCheck(record) { this.activeTeachingRecord = record; this.showTeachingCheck = true; },
        openBorrowDetail(record) { this.activeBorrowRecord = record; this.showBorrowDetail = true; },
        openInventoryTaskDetail(task) { this.activeInventoryTask = task; this.showInventoryDetail = true; },
        runPrimaryAction() {
          const firstAction = this.currentPage.actions.find((item) => item.primary) || this.currentPage.actions[0];
          this.handleAction(firstAction.key);
        },
        openRepairDetail(order) {
          this.activeOrder = order;
          this.showRepairDetail = true;
        },
        openRepairQueueDetail(item) {
          const matched = this.repairOrders.find((order) => order.no === item.no) || this.repairOrders[0];
          this.openRepairDetail(matched);
        },
        openTaskModal(type) {
          this.taskForm.type = type;
          if (type === 'period') {
            this.showPeriodDrawer = true;
          } else {
            this.showProjectModal = true;
          }
        },
        selectAllInventoryObjects() {
          this.filteredInventoryObjects.forEach((item) => { item.checked = true; });
        },
        savePeriodFilter() {
          const category = this.periodFilters.categories.length ? this.periodFilters.categories.join('、') : '全部分类';
          const location = this.periodFilters.locations.length ? this.periodFilters.locations.join('、') : '全部库位';
          const status = this.periodFilters.statuses.length ? this.periodFilters.statuses.join('、') : '全部状态';
          const purchase = this.periodFilters.purchaseRange.length ? `${this.periodFilters.purchaseRange[0]} 至 ${this.periodFilters.purchaseRange[1]}` : '全部采购时间';
          this.savedPeriodFilters.unshift({
            name: `${category} / ${location}`,
            desc: `${category} · ${location} · ${status} · ${purchase}`,
            categories: [...this.periodFilters.categories],
            locations: [...this.periodFilters.locations],
            statuses: [...this.periodFilters.statuses],
            purchaseRange: [...this.periodFilters.purchaseRange],
            keyword: this.periodFilters.keyword,
          });
        },
        applyPeriodFilter(item) {
          this.periodFilters = {
            categories: [...(item.categories || [])],
            locations: [...(item.locations || [])],
            statuses: [...(item.statuses || [])],
            purchaseRange: [...(item.purchaseRange || [])],
            keyword: item.keyword || '',
          };
        },
        handleRowClick(record) { this.activeRecord = record; this.ensureRecordCategoryPath(this.activeRecord); this.showArchiveDetail = true; },
        closeDetail() { this.activeRecord = null; },
        rowClass(record) {
          const classes = [];
          if (this.activeRecord && this.activeRecord.id === record.id) classes.push('row-active');
          if (this.selectedArchiveIds.includes(record.id)) classes.push('row-selected');
          return classes.join(' ');
        },
        getStatusColor(status) {
          const map = { '空闲可用': 'green', '教学使用': 'cyan', '已借出': 'blue', '待维修': 'orangered', '维修中': 'orange', '已报废': 'gray', '盘点锁定': 'purple' };
          return map[status] || 'gray';
        },
        normalizeInventoryItem(item) {
          const statusByAbnormal = {
            missing: item.isBorrowed ? '已借出' : '盘点锁定',
            status: '待维修',
            position: '空闲可用',
          };
          return {
            ...item,
            assetNature: item.assetNature || '复旦医学院出资',
            storageLocation: item.storageLocation || item.location || '技能中心 A',
            materialStatus: item.materialStatus || statusByAbnormal[item.abnormalType] || '空闲可用',
            inventoryStatus: item.inventoryStatus || (item.isNormal === false && item.abnormalType === 'missing' ? '未盘到' : '已盘到'),
            category: item.category || '教学物资',
            department: item.department || '技能培训中心',
            lastUsed: item.lastUsed || '2026-05 教学使用记录',
            checkedAt: item.checkedAt || (item.isNormal === false && item.abnormalType === 'missing' ? '' : '2026-05-28'),
            remark: item.remark || item.abnormalNote || '',
          };
        },
        inventoryMaterialStatusColor(status) {
          const map = {
            '空闲可用': 'green',
            '教学使用': 'arcoblue',
            '已借出': 'blue',
            '待维修': 'orangered',
            '维修中': 'orange',
            '已报废': 'gray',
            '盘点锁定': 'purple',
          };
          return map[status] || 'gray';
        },
        switchInventoryRecord(record) {
          this.activeInventoryRecord = record;
        },
        openInventoryDetail(record) {
          const item = this.normalizeInventoryItem(record);
          const archiveRecord = this.findArchiveRecordByInventoryItem(item) || this.buildArchiveRecordFromInventoryItem(item);
          this.activeRecord = archiveRecord;
          this.ensureRecordCategoryPath(this.activeRecord);
          this.showArchiveDetail = true;
        },
        findArchiveRecordByInventoryItem(item) {
          const pools = [
            ...(this.assetList || []),
            ...(this.inbConsData || []).map((record) => ({ ...record, code: record.id, category: '耗材' })),
          ];
          return pools.find((record) => record.code === item.code || record.sn === item.code || record.name === item.name);
        },
        buildArchiveRecordFromInventoryItem(item) {
          const statusMap = {
            '空闲可用': '空闲可用',
            '教学使用': '教学使用',
            '已借出': '已借出',
            '待维修': '待维修',
            '维修中': '维修中',
            '已报废': '已报废',
            '盘点锁定': '盘点锁定',
          };
          return {
            id: `inventory-${item.code}`,
            type: 'model',
            name: item.name,
            code: item.code,
            sn: '',
            brandModel: '',
            vendor: '',
            price: 0,
            purchaseDate: '',
            warrantyEnd: '',
            scrapYears: '',
            category: '模型',
            subCategory: item.category || '教学物资',
            categoryPath: ['模型', item.category || '教学物资'],
            homeLocation: item.storageLocation,
            currentLocation: item.storageLocation,
            usageCount: item.usageCount || 0,
            department: item.department || '技能培训中心',
            status: statusMap[item.materialStatus] || '空闲可用',
            note: item.remark || `资产性质：${item.assetNature}`,
            image: item.image || '',
          };
        },
        openPositionFix(record) {
          // 修改位置逻辑
          console.log('修改位置', record);
        },
        confirmReportLoss(record) {
          // 挂失逻辑
          console.log('挂失', record);
        },

      },
    };

    // Now, we customize the App before creation
    const localApp = Object.assign({}, App, {
      data: function () {
        var baseData = App.data ? App.data.call(this) : {};
        if (pageState) {
          baseData.activePage = pageState.activePage;
          baseData.usageTab = pageState.usageTab;
        }
        return baseData;
      },
      computed: Object.assign({}, App.computed, {
        activeMenu() {
          return document.body.dataset.active;
        },
        // Dynamic tab title mapping based on data-active
        teachingTabTitle() {
          const active = document.body.dataset.active;
          return active === '课程使用和临时借用' ? '教学使用准备' : '教学使用核对';
        },
        borrowTabTitle() {
          const active = document.body.dataset.active;
          return active === '课程使用和临时借用' ? '临时借用准备' : '临时归还管理';
        },
        // Filter teachingUseData based on active tab workflow
        displayTeachingUseData() {
          const active = document.body.dataset.active;
          const filtered = this.filteredTeachingUseData || [];
          if (active === '课程使用和临时借用') {
            return filtered.filter(item => item.status === '待准备' || item.status === '部分满足');
          } else if (active === '归还签收') {
            return filtered.filter(item => item.status !== '待准备');
          }
          return filtered;
        },
        // Filter borrowUseData based on active tab workflow
        displayBorrowUseData() {
          const active = document.body.dataset.active;
          const filtered = this.filteredBorrowUseData || [];
          if (active === '课程使用和临时借用') {
            return filtered.filter(item => item.status === '待准备' || item.status === '借用准备');
          } else if (active === '归还签收') {
            return filtered.filter(item => item.status !== '待准备' && item.status !== '借用准备');
          }
          return filtered;
        }
      })
    });

    vueApp = Vue.createApp(localApp);
    vueApp.use(window.ArcoVue);
    vueApp.mount('#' + mountId);
  }

  function boot() {
    renderShell();
    var lastActive = document.body.dataset.active;
    var lastRole = document.body.dataset.role;
    var obs = new MutationObserver(function () {
      var curActive = document.body.dataset.active;
      var curRole = document.body.dataset.role;
      if (curActive !== lastActive || curRole !== lastRole) {
        lastActive = curActive;
        lastRole = curRole;
        renderShell();
      }
    });
    obs.observe(document.body, { attributes: true, attributeFilter: ['data-active', 'data-role'] });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
