<!--
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-01-08 15:09:59
 * @LastEditTime: 2024-11-12 22:44:27
-->
<script setup lang="ts">
import { onMounted, onUnmounted, shallowRef, nextTick } from "vue";
import { hostsList, updateGo, disableGo, tasksInsertGo } from "../operationsJS";
import type {
  hostDisable,
  postTaskInsert,
  hostsResult,
} from "@/types/operations";

import JSONEditor from "jsoneditor";
import "jsoneditor/dist/jsoneditor.css";

import type { JSONEditorMode } from "jsoneditor";

import { useScriptTemplateHook } from "@/store/modules/scriptTemplate";

const scriptTemplateStore = useScriptTemplateHook();

const currentPage = ref(1); // 当前页码
const pageSize = ref(10); // 每页显示的数据数量

const listDatas = ref<any[]>([]);

const popBoxTit = ref("");

const socket = ref<WebSocket | null>(null);
const wsData = ref<any>(null);

const loading = ref(false);
const dialogFormVisible = ref(false);
const dialogShellVisible = ref(false);
const dialogWSVisible = ref(false);

// 添加定时器引用
const timer = ref<ReturnType<typeof setInterval> | null>(null);
const isAutoRefreshEnabled = ref(true); // 添加自动刷新开关状态

const infoRef = ref<any>({
  id: "",
  host_ip: "",
  host_group: "",
  is_disabled: "0",
  remark: "",
  ping_time: "",
  online: "",
});

const shellRef = ref<any>({
  id: "",
  host_ip: "",
  task_type: "software",
  script_type: "",
  script_name: "",
  script_content: {},
});

// 修改 scriptTemplate 的定义和处理
const scriptTemplate = computed(() => {
  return scriptTemplateStore.scriptTemplateList.map((item) => ({
    label: item.script_name,
    value: item.script_content,
  }));
});

// 在 shellRef 的 watch 中添加模板内容的处理
watch(
  () => shellRef.value.script_type,
  (newValue) => {
    if (newValue && jsonEditorInstance) {
      // 当选择模板时，更新编辑器内容
      jsonEditorInstance.set(JSON.parse(newValue.replace(/'/g, '"')));
      // shellRef.value.script_content = newValue;
    }
  }
);

const taskTypeOptions = [
  {
    value: "software",
    label: "软件",
  },
  {
    value: "other",
    label: "其他",
  },
];

type online = "0" | "1";
const onlineMap: Record<online, string> = {
  "0": "在线",
  "1": "离线",
};

type is_disabled = "0" | "1";

const disabledMap: Record<is_disabled, string> = {
  "0": "上架",
  "1": "下架",
};

// 添加 JSONEditor 相关的 ref
const jsonEditorContainer = ref<HTMLElement | null>(null);
let jsonEditorInstance: JSONEditor | null = null;

// 添加 JSONEditor 配置选项
const jsonEditorOptions = {
  mode: "code" as JSONEditorMode,
  modes: ["tree", "view", "form", "code", "text"] as JSONEditorMode[],
  onModeChange: function (newMode: JSONEditorMode, oldMode: JSONEditorMode) {
    console.log("Mode switched from", oldMode, "to", newMode);
  },
  onChangeText: function (jsonString: string) {
    try {
      shellRef.value.script_content = JSON.parse(jsonString);
    } catch (err) {
      console.error("JSON parse error:", err);
    }
  },
};

// 初始化 JSONEditor
const initJsonEditor = () => {
  if (jsonEditorContainer.value) {
    try {
      if (jsonEditorInstance) {
        jsonEditorInstance.destroy();
      }
      jsonEditorInstance = new JSONEditor(
        jsonEditorContainer.value,
        jsonEditorOptions,
        shellRef.value.script_content || {}
      );
    } catch (error) {
      console.error("JSONEditor initialization error:", error);
      ElMessage.error("初始化编辑器失败");
    }
  }
};

// 在组件卸载时销毁编辑器
onUnmounted(() => {
  if (jsonEditorInstance) {
    jsonEditorInstance.destroy();
    jsonEditorInstance = null;
  }
});

// 接口相关
const initData = async () => {
  loading.value = true;
  try {
    const [listData, _] = await Promise.all([
      hostsList(),
      scriptTemplateStore.fetchScriptTemplateList(),
    ]);
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

// 在组件卸载时确保关闭 WebSocket
onUnmounted(() => {
  closeWebSocket();
});

const formatOnline = (row: { online: online }): string => {
  return onlineMap[row.online] || "未知";
};

const formatdisabledMap = (row: { is_disabled: is_disabled }): string => {
  return disabledMap[row.is_disabled] || "未知";
};

const disable = async (row: hostDisable) => {
  loading.value = true;
  try {
    const data = {
      id: row.id,
      is_disabled: row.is_disabled === "0" ? "1" : "0", // 切换状态
    };
    await disableGo(data);
  } catch (error) {
    console.log("出现异常:", error);
  } finally {
    await initData();
    loading.value = false;
  }
};

// 初始化 WebSocket
const initWebSocket = (hostIp: string) => {
  // const fallbackIp = "127.0.0.1";
  const wsPort = "8080";
  let wsUrl = `ws://${hostIp}:${wsPort}/ws`;
  socket.value = new WebSocket(wsUrl);

  socket.value.onopen = () => {
    console.log("WebSocket 连接已建立", socket.value);
    // 可以在这里初始化图表
  };

  socket.value.onmessage = (event) => {
    try {
      const sysInfo = JSON.parse(event.data);
      wsData.value = sysInfo; // 更新 WebSocket 数据
      // 在这里更新图表
    } catch (error) {
      console.error("解析 WebSocket 数据失败:", error);
    }
  };

  socket.value.onclose = (event) => {
    if (event.wasClean) {
      console.log(
        `WebSocket 连接正常关闭, code=${event.code}, reason=${event.reason}`
      );
    } else {
      console.error("WebSocket 连接意外关闭");
    }
  };
};

// 查看 - 建立 WebSocket 连接
const check = (row: hostsResult) => {
  dialogWSVisible.value = true;
  popBoxTit.value = `查看 ${row.host_ip} 信息`;
  // wsUrl = `ws://${row.host_ip}:${wsPort}/ws`; // 更新 WebSocket URL
  initWebSocket(row.host_ip); // 初始化 WebSocket
};

// 关闭 WebSocket 连接
const closeWebSocket = () => {
  if (socket.value) {
    socket.value.close();
    socket.value = null;
    wsData.value = null;
  }
};

const handleCloseForm = () => {
  resetInfo();
};

const handleCloseWS = () => {
  // 关闭 WebSocket 连接
  closeWebSocket();
  dialogWSVisible.value = false;
};

const handleCloseShell = () => {
  // 销毁 JSONEditor 实例
  if (jsonEditorInstance) {
    jsonEditorInstance.destroy();
    jsonEditorInstance = null;
  }

  // 重置表单数据
  shellRef.value = {
    host_ip: "",
    task_type: "software",
    script_name: "",
    script_content: {},
  };

  // 关闭弹窗
  dialogShellVisible.value = false;
};

// 修改
const revise = (row: hostsResult) => {
  // console.log(parent);
  const data = {
    id: row.id,
    host_ip: row.host_ip,
    is_disabled: row.is_disabled,
    host_group: row.host_group,
    remark: row.remark,
  };
  infoRef.value = data;
  popBoxTit.value = "修改";
  dialogFormVisible.value = true;
};

// 弹框

const Cancel = () => {
  resetInfo();
};

const save = async () => {
  console.log("准提交数据：", infoRef.value);
  console.log("当前提交行为:", popBoxTit.value);
  dialogFormVisible.value = false;
  loading.value = true;

  try {
    // 修改
    const data = {
      id: infoRef.value.id,
      is_disabled: infoRef.value.is_disabled,
      host_group: infoRef.value.host_group,
      remark: infoRef.value.remark,
    };
    await updateGo(data);
  } catch (error) {
    console.log("出现异常:", error);
  } finally {
    loading.value = false;
    resetInfo();
  }
};

// 添加自动刷新控制函数
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
  initData();
};

const shellScript = async (row: postTaskInsert) => {
  shellRef.value = {
    host_ip: row.host_ip,
    task_type: "software",
    script_name: "",
    script_content: {},
  };

  popBoxTit.value = "执行任务";
  dialogShellVisible.value = true;

  // 等待 DOM 更新后初始化编辑器
  await nextTick();
  initJsonEditor();
};

// 添加保存脚本的函数
const saveScript = async () => {
  console.log("准提交数据：", infoRef.value);
  console.log("当前提交行为:", popBoxTit.value);
  dialogShellVisible.value = false;
  loading.value = true;
  if (!jsonEditorInstance) return;

  try {
    const content = jsonEditorInstance.get();
    const data = {
      host_ip: shellRef.value.host_ip,
      task_type: shellRef.value.task_type,
      script_type: shellRef.value.script_type,
      script_name: shellRef.value.script_name,
      script_content: content,
    };
    await tasksInsertGo(data);

    // 这里添加发送到后端的逻辑
    console.log("准备保存的脚本内容:", content);
  } catch (error) {
    console.error("保存脚本失败:", error);
  } finally {
    loading.value = false;
    handleCloseShell();
    await initData();
  }
};

// 还原弹框输入
const resetInfo = async () => {
  // 还原初始化
  popBoxTit.value = "";
  infoRef.value = {
    id: "",
    host_ip: "",
    host_group: "",
    status: "0",
    remark: "",
    ping_time: "",
    online: "",
  };
  dialogFormVisible.value = false;
  await initData();
};

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
};
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
};
</script>
<template>
  <div class="container" v-loading="loading">
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
              <el-table-column prop="id" label="ID" align="center" />
              <el-table-column prop="host_ip" label="IP地址" align="center" />
              <el-table-column prop="host_group" label="分组" align="center" />
              <el-table-column prop="remark" label="备注" align="center" />
              <el-table-column
                prop="ping_time"
                label="最后在线时间"
                align="center"
              />

              <
              <el-table-column prop="online" label="是否在线" align="center">
                <template #default="{ row }">
                  <span
                    :class="row.online === '0' ? 'online-cell' : 'offline-cell'"
                  >
                    {{ formatOnline(row) }}
                  </span>
                </template>
              </el-table-column>

              <el-table-column
                prop="is_disabled"
                label="状态"
                align="center"
                :formatter="formatdisabledMap"
              />

              <el-table-column prop="operate" label="操作" align="center">
                <template #default="{ row }">
                  <el-button type="primary" link @click="check(row)">
                    查看
                  </el-button>
                  <el-button
                    type="primary"
                    link
                    @click="disable(row)"
                    v-if="row.is_disabled === '0'"
                  >
                    下架
                  </el-button>
                  <el-button
                    type="primary"
                    link
                    @click="disable(row)"
                    v-if="row.is_disabled === '1'"
                  >
                    上架
                  </el-button>
                  <el-button type="primary" link @click="revise(row)">
                    修改
                  </el-button>
                  <el-button
                    type="primary"
                    link
                    @click="shellScript(row)"
                    v-if="row.online === '0' && row.is_disabled === '0'"
                  >
                    发布任务
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

      <!-- 弹框 -->
      <el-dialog
        v-model="dialogFormVisible"
        destroy-on-close
        center
        :title="popBoxTit"
        width="80%"
        @close="handleCloseForm"
      >
        <el-form :model="infoRef">
          <el-row class="row-bg flex items-center" :gutter="20">
            <el-col :span="4">
              <el-form-item label="id" class="form_item">
                <span>{{ infoRef.id }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="IP地址" class="form_item">
                <span>{{ infoRef.host_ip }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="row-bg flex items-center" :gutter="20">
            <el-col :span="8">
              <el-form-item label="分组" class="form_item">
                <el-input v-model="infoRef.host_group" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item class="form_item flex items-center" label="状态">
                <div class="flex items-center">
                  <el-radio-group v-model="infoRef.is_disabled" class="ml-4">
                    <el-radio label="0" size="large">上架</el-radio>
                    <el-radio label="1" size="large">下架</el-radio>
                  </el-radio-group>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="row-bg flex items-center" :gutter="20">
            <el-col :span="8">
              <el-form-item label="备注" class="form_item flex items-center">
                <el-input
                  v-model="infoRef.remark"
                  style="width: 400px"
                  :autosize="{ minRows: 4, maxRows: 10 }"
                  type="textarea"
                  placeholder="Please input"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="Cancel">取消</el-button>
            <el-button type="primary" @click="save">保存</el-button>
          </span>
        </template>
      </el-dialog>
      <!-- 弹框end -->

      <!-- 查看-->
      <el-dialog
        v-model="dialogWSVisible"
        destroy-on-close
        center
        :title="popBoxTit"
        width="80%"
        @close="handleCloseWS"
      >
        <div class="ws-content">
          <pre v-if="wsData" class="json-content">{{
            JSON.stringify(wsData, null, 2)
          }}</pre>
          <div v-else class="loading-content">等待数据...</div>
        </div>
      </el-dialog>
      <!-- 查看end -->

      <!-- shell脚本 -->
      <el-dialog
        v-model="dialogShellVisible"
        destroy-on-close
        center
        :title="popBoxTit"
        width="80%"
        @close="handleCloseShell"
      >
        <div class="shell-content-container">
          <!-- 左侧表单 -->
          <div class="left-form">
            <el-form :model="shellRef" label-position="top">
              <el-form-item label="IP地址" class="form_item">
                <span>{{ shellRef.host_ip }}</span>
              </el-form-item>
              <el-form-item label="任务名称" class="form_item">
                <el-input v-model="shellRef.script_name" autocomplete="off" />
              </el-form-item>

              <el-form-item class="form_item" label="任务类型">
                <el-select
                  v-model="shellRef.task_type"
                  placeholder="任务类型"
                  size="large"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in taskTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>

              <el-form-item class="form_item" label="选用模板">
                <el-select
                  v-model="shellRef.script_type"
                  placeholder="选用模板"
                  size="large"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in scriptTemplate"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-form>
          </div>

          <!-- 右侧编辑器 -->
          <div class="right-editor">
            <div class="editor-label">任务内容</div>
            <div ref="jsonEditorContainer" class="json-editor-container"></div>
          </div>
        </div>

        <template #footer>
          <span class="dialog-footer">
            <el-button @click="handleCloseShell">取消</el-button>
            <el-button type="primary" @click="saveScript">保存</el-button>
          </span>
        </template>
      </el-dialog>
      <!-- shell脚本 end-->
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.container {
  position: relative;
  padding: 24px;
}

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
