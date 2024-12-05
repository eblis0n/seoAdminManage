<!--
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-01-08 15:09:59
 * @LastEditTime: 2024-12-05 17:04:55
-->
<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { tasksList, tasksImplementLogs } from "../operationsJS";
import type { taskResult, taskImplementLogs } from "@/types/operations";

import JSONEditor from "jsoneditor";
import "jsoneditor/dist/jsoneditor.css";

import type { JSONEditorMode } from "jsoneditor";

const currentPage = ref(1); // 当前页码
const pageSize = ref(10); // 每页显示的数据数量

const listDatas = ref<any[]>([]);
const logsDatas = ref<any[]>([]);

const popBoxTit = ref("");

const loading = ref(false);
const dialogFormVisible = ref(false);
const dialogLogVisible = ref(false);

// 添加定时器引用
const timer = ref<ReturnType<typeof setInterval> | null>(null);
const isAutoRefreshEnabled = ref(true); // 添加自动刷新开关状态

const infoRef = ref<any>({
  task_id: "",
  host_ip: "",
  script_name: "",
  script_content: "",
  status: "",
  task_type: "",
  result: "",
});

//  ########################### JSONEditor #####################################

// 添加 JSONEditor 相关的 ref
const jsonEditorContainer = ref<HTMLElement | null>(null);
let jsonEditorInstance: JSONEditor | null = null;

// 添加 JSONEditor 配置选项
const jsonEditorOptions = {
  mode: "code" as JSONEditorMode,
  modes: ["code"] as JSONEditorMode[],
  onModeChange: function (newMode: JSONEditorMode, oldMode: JSONEditorMode) {
    console.log("Mode switched from", oldMode, "to", newMode);
  },
  onChangeText: function (jsonString: string) {
    try {
      infoRef.value.script_content = JSON.parse(jsonString);
    } catch (err) {
      console.error("JSON parse error:", err);
    }
  },
};

// 初始化 JSONEditor
const initJsonEditor = () => {
  if (jsonEditorContainer.value) {
    try {
      // 解析 script_content 为 JSON 对象
      const scriptContent = JSON.parse(
        infoRef.value.script_content.replace(/'/g, '"')
      );

      // 如果已经存在 jsonEditor 实例，则销毁旧实例
      if (jsonEditorInstance) {
        jsonEditorInstance.destroy();
      }

      // 创建新的 JSONEditor 实例
      jsonEditorInstance = new JSONEditor(
        jsonEditorContainer.value,
        jsonEditorOptions,
        scriptContent || {}
      );
    } catch (error) {
      console.error("JSONEditor initialization error:", error);
      ElMessage.error("初始化编辑器失败");
    }
  }
};

//  ########################### JSONEditor  end #####################################

// 接口相关
const initData = async () => {
  loading.value = true;
  try {
    const [listData] = await Promise.all([tasksList()]);
    listDatas.value = listData;
  } catch (error) {
    console.error("获取数据失败", error);
    ElMessage.error("获取数据失败");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  initData();
});

// 在组件卸载时销毁编辑器
onUnmounted(() => {
  if (jsonEditorInstance) {
    jsonEditorInstance.destroy();
    jsonEditorInstance = null;
  }
});

// ############## 操作 ######################################

const check = async (row: taskResult) => {
  const data = {
    task_id: row.task_id,
    host_ip: row.host_ip,
    task_type: row.task_type,
    script_name: row.script_name,
    script_content: row.script_content,
    status: row.status,
  };
  infoRef.value = data;

  dialogFormVisible.value = true;
  popBoxTit.value = `查看  ${row.task_id} 任务详情`;

  // 等待 DOM 更新后初始化编辑器
  await nextTick();
  initJsonEditor();
};

const checkLog = async (row: taskImplementLogs) => {
  dialogLogVisible.value = true;
  popBoxTit.value = `${row.task_id} 任务日志`;
  loading.value = true;
  try {
    const data = {
      task_id: row.task_id,
    };
    const [logsData] = await Promise.all([tasksImplementLogs(data)]);
    logsDatas.value = logsData;
  } catch (error) {
    console.log("出现异常:", error);
  } finally {
    loading.value = false;
  }
};

// ############# 操作end ############################################
// ############# 弹框 ############################################

const handleCloseShell = async () => {
  // 销毁 JSONEditor 实例
  if (jsonEditorInstance) {
    jsonEditorInstance.destroy();
    jsonEditorInstance = null;
  }

  popBoxTit.value = "";
  infoRef.value = {
    id: "",
    task_id: "",
    task_type: "",
    log_content: "",
    log_time: "",
    status: "",
  };
  dialogFormVisible.value = false;
  await initData();
};

const handleCloseLog = async () => {
  popBoxTit.value = "";
  dialogLogVisible.value = false;
  await initData();
};

// ############# 弹框end ############################################

// ############## 刷新 ##############################################

const startAutoRefresh = () => {
  if (timer.value) {
    clearInterval(timer.value);
  }
  timer.value = setInterval(() => {
    if (isAutoRefreshEnabled.value) {
      initData();
    }
  }, 60000); // 60秒刷新一次
};

// 切换自动刷新状态
const toggleAutoRefresh = () => {
  isAutoRefreshEnabled.value = !isAutoRefreshEnabled.value;
  if (isAutoRefreshEnabled.value) {
    startAutoRefresh();
    ElMessage.success("自动刷新已开启");
  } else {
    if (timer.value) {
      clearInterval(timer.value);
      timer.value = null;
    }
    ElMessage.warning("自动刷新已关闭");
  }
};

// 手动刷新
const refresh = () => {
  loading.value = true;
  initData();
};

// ############## 刷新 end ############################################

// ########################## 翻页 ################################
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
};
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
};
// ########################## 翻页 end################################
</script>
<template>
  <div class="web-container" v-loading="loading">
    <el-card shadow="never">
      <el-row class="row-bg" :gutter="20">
        <el-col :span="2">
          <div class="grid-content ep-bg-purple" />
          <el-button type="primary" plain @click="refresh">手动刷新</el-button>
        </el-col>
        <el-col :span="2">
          <el-button
            :type="isAutoRefreshEnabled ? 'success' : 'warning'"
            plain
            @click="toggleAutoRefresh"
          >
            {{ isAutoRefreshEnabled ? "自动刷新：开" : "自动刷新：关" }}
          </el-button>
        </el-col>
      </el-row>
      <el-row class="row-bg">
        <el-col>
          <el-scrollbar>
            <el-table
              height="600"
              style="width: 100%"
              :data="
                listDatas.slice(
                  (currentPage - 1) * pageSize,
                  currentPage * pageSize
                )
              "
            >
              <el-table-column prop="task_id" label="任务ID" align="center" />
              <el-table-column prop="host_ip" label="IP地址" align="center" />
              <el-table-column
                prop="script_name"
                label="任务名称"
                align="center"
              />
              <el-table-column
                prop="task_type"
                label="任务类型"
                align="center"
              />
              <el-table-column prop="status" label="任务状态" align="center" />
              <el-table-column
                prop="create_at"
                label="任务发布时间"
                align="center"
              />
              <el-table-column prop="result" label="简述" align="center" />
              <el-table-column
                prop="completed_at"
                label="完成时间"
                align="center"
              />

              <el-table-column prop="operate" label="操作" align="center">
                <template #default="{ row }">
                  <el-button type="primary" link @click="check(row)">
                    详情
                  </el-button>

                  <el-button type="primary" link @click="checkLog(row)">
                    日志
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-scrollbar>
        </el-col>
      </el-row>
      <el-row class="row-bg">
        <el-pagination
          background
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="listDatas.length"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </el-row>

      <!-- 任务详情 -->
      <el-dialog
        v-model="dialogFormVisible"
        destroy-on-close
        center
        :title="popBoxTit"
        width="80%"
        @close="handleCloseShell"
      >
        <div class="shell-content-container">
          <!-- 左侧表单 -->
          <div class="left-form">
            <el-form :model="infoRef" label-position="top">
              <el-form-item label="任务ID" class="form_item">
                <span>{{ infoRef.task_id }}</span>
              </el-form-item>
              <el-form-item label="IP地址" class="form_item">
                <span>{{ infoRef.host_ip }}</span>
              </el-form-item>
              <el-form-item label="脚本名称" class="form_item">
                <span>{{ infoRef.script_name }}</span>
              </el-form-item>
              <el-form-item label="任务类型" class="form_item">
                <span>{{ infoRef.task_type }}</span>
              </el-form-item>
              <el-form-item label="任务状态" class="form_item">
                <span>{{ infoRef.status }}</span>
              </el-form-item>
            </el-form>
          </div>

          <!-- 右侧编辑器 -->
          <div class="right-editor">
            <div class="editor-label">脚本内容</div>
            <div ref="jsonEditorContainer" class="json-editor-container"></div>
          </div>
        </div>
      </el-dialog>
      <!-- 任务详情 end-->

      <!-- 查看 任务执行log-->
      <el-dialog
        v-model="dialogLogVisible"
        destroy-on-close
        center
        :title="popBoxTit"
        width="80%"
        @close="handleCloseLog"
      >
        <div class="telegra-container" v-loading="loading">
          <el-card shadow="never">
            <el-row class="row-bg">
              <el-col>
                <el-scrollbar>
                  <el-table
                    height="500"
                    style="width: 100%"
                    :data="
                      logsDatas.slice(
                        (currentPage - 1) * pageSize,
                        currentPage * pageSize
                      )
                    "
                  >
                    <el-table-column prop="id" label="ID" align="center" />
                    <el-table-column
                      prop="task_id"
                      label="任务ID"
                      align="center"
                    />
                    <el-table-column
                      prop="task_type"
                      label="任务类型"
                      align="center"
                    />
                    <el-table-column
                      prop="log_content"
                      label="log内容"
                      align="center"
                    />
                    <el-table-column
                      prop="log_time"
                      label="执行时间"
                      align="center"
                    />
                    <el-table-column
                      prop="status"
                      label="任务状态"
                      align="center"
                    />
                  </el-table>
                </el-scrollbar>
              </el-col>
            </el-row>
            <el-row class="row-bg">
              <el-pagination
                background
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :page-sizes="[10, 20, 50, 100]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="listDatas.length"
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
              />
            </el-row>
          </el-card>
        </div>
      </el-dialog>
      <!-- 查看任务执行log end -->
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;
}

.el-button--text {
  margin-right: 15px;
}

.newselect {
  width: 300px;
}

.el-input {
  width: 300px;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-start;
}

.online-cell {
  padding: 20px;
  background-color: #03f803;
  border: 1px solid #fff;
}

.offline-cell {
  padding: 20px;
  background-color: #f40303;
  border: 1px solid #fff;
}

.ws-content {
  min-height: 200px;
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 4px;

  .json-content {
    margin: 0;
    font-family: monospace;
    word-wrap: break-word;
    white-space: pre-wrap;
  }

  .loading-content {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    color: #909399;
  }
}

.json-editor-container {
  width: 100%;
  height: 600px;
  margin: 20px 0;
  overflow: hidden;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

:deep(.jsoneditor) {
  width: 100%;
  height: 100%;
  border: none;

  .jsoneditor-menu {
    background-color: #409eff;
    border-bottom: 1px solid #dcdfe6;
  }

  .jsoneditor-outer {
    height: calc(100% - 40px);
    padding: 10px;
  }

  .ace-jsoneditor {
    min-height: 550px;
  }
}

.form_item {
  width: 100%;
  margin-bottom: 20px;
}

:deep(.el-dialog__body) {
  padding: 20px 30px;
}

:deep(.el-form-item__label) {
  font-weight: bold;
}

.shell-content-container {
  display: flex;
  gap: 20px;
  min-height: 600px;
}

.left-form {
  width: 300px;
  padding: 20px;
  // background-color: #f8f9fa;
  border-radius: 4px;

  .form_item {
    margin-bottom: 20px;

    :deep(.el-form-item__label) {
      padding-bottom: 8px;
      font-weight: bold;
    }
  }
}

.right-editor {
  display: flex;
  flex: 1;
  flex-direction: column;

  .editor-label {
    margin-bottom: 8px;
    font-weight: bold;
    color: #606266;
  }

  .json-editor-container {
    flex: 1;
    height: 100%;
    min-height: 550px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
  }
}
</style>
