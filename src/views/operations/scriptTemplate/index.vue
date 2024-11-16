<!--
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-01-08 15:09:59
 * @LastEditTime: 2024-11-14 15:33:11
-->
<script setup lang="ts">
import { onMounted, onUnmounted, shallowRef, nextTick } from "vue";
import type {
  scriptTemplateDel,
  scriptTemplateUpdate,
} from "@/types/scriptTemplate";

import { updateGo, delGo, addGo } from "./scriptTemplateJS";

import JSONEditor from "jsoneditor";
import "jsoneditor/dist/jsoneditor.css";

import type { JSONEditorMode } from "jsoneditor";

import { useScriptTemplateHook } from "@/store/modules/scriptTemplate";

const scriptTemplateStore = useScriptTemplateHook();

const currentPage = ref(1); // 当前页码
const pageSize = ref(10); // 每页显示的数据数量

const listDatas = ref<any[]>([]);

const popBoxTit = ref("");

const loading = ref(false);

const dialogShellVisible = ref(false);

const infoRef = ref<any>({
  id: "",
  script_type: "",
  script_name: "",
  script_content: "",
});

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

//  ########################### JSONEditor #####################################
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
      let scriptContent = {};

      if (popBoxTit.value === "修改") {
        // 修改时，确保 script_content 是有效的 JSON
        scriptContent = JSON.parse(
          infoRef.value.script_content.replace(/'/g, '"') // 替换单引号为双引号
        );
      } else {
        // 新增时，直接使用 infoRef.value.script_content（默认为空对象）
        scriptContent = infoRef.value.script_content || {};
      }

      // 销毁旧的 JSONEditor 实例
      if (jsonEditorInstance) {
        jsonEditorInstance.destroy();
      }

      // 初始化新的 JSONEditor 实例
      jsonEditorInstance = new JSONEditor(
        jsonEditorContainer.value,
        jsonEditorOptions,
        scriptContent
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

//  ########################### JSONEditor  end #####################################

// 接口相关
const initData = async () => {
  loading.value = true;
  try {
    const [_] = await Promise.all([
      scriptTemplateStore.fetchScriptTemplateList(),
    ]);
    listDatas.value = scriptTemplateStore.scriptTemplateList;
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

const handleCloseShell = () => {
  // 销毁 JSONEditor 实例
  if (jsonEditorInstance) {
    jsonEditorInstance.destroy();
    jsonEditorInstance = null;
  }

  // 重置表单数据
  infoRef.value = {
    id: "",
    script_type: "",
    script_name: "",
    script_content: "",
  };

  // 关闭弹窗
  dialogShellVisible.value = false;
};

// 修改
const revise = async (row: scriptTemplateUpdate) => {
  // console.log(parent);
  const data = {
    id: row.id,
    script_type: row.script_type,
    script_name: row.script_name,
    script_content: row.script_content,
  };
  infoRef.value = data;
  popBoxTit.value = "修改";
  dialogShellVisible.value = true;
  // 等待 DOM 更新后初始化编辑器
  await nextTick();
  initJsonEditor();
};

const Add = async () => {
  popBoxTit.value = "添加";
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
    if (popBoxTit.value === "修改") {
      const data = {
        id: infoRef.value.id,
        script_type: infoRef.value.script_type,
        script_name: infoRef.value.script_name,
        script_content: content,
      };
      await updateGo(data);
    } else {
      const data = {
        script_type: infoRef.value.script_type,
        script_name: infoRef.value.script_name,
        script_content: content,
      };
      await addGo(data);
    }
  } catch (error) {
    console.error("保存脚本失败:", error);
  } finally {
    loading.value = false;
    handleCloseShell();
    await initData();
  }
};

const delet = async (row: scriptTemplateDel) => {
  loading.value = true;
  try {
    const data = {
      id: row.id,
    };
    await delGo(data);
  } catch (error) {
    console.log("出现异常:", error);
  } finally {
    loading.value = false;
    resetInfo();
  }
};

// 还原弹框输入
const resetInfo = async () => {
  // 还原初始化
  popBoxTit.value = "";
  infoRef.value = {
    id: "",
    script_type: "",
    script_name: "",
    script_content: "",
  };
  dialogShellVisible.value = false;
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
  <div class="web-container" v-loading="loading">
    <el-card shadow="never">
      <el-row class="row-bg">
        <el-col :span="1">
          <div class="grid-content ep-bg-purple" />
          <el-button type="primary" plain @click="Add">添加</el-button>
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
              <el-table-column
                prop="script_type"
                label="模板类型"
                align="center"
              />
              <el-table-column
                prop="script_name"
                label="模板名称"
                align="center"
              />

              <el-table-column
                prop="create_at"
                label="添加时间"
                align="center"
              />
              <el-table-column prop="operate" label="操作" align="center">
                <template #default="{ row }">
                  <el-button type="primary" link @click="revise(row)">
                    修改
                  </el-button>
                  <el-button type="primary" link @click="delet(row)">
                    删除
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
            <el-form :model="infoRef" label-position="top">
              <el-form-item
                label="ID"
                class="form_item"
                v-if="popBoxTit === '修改'"
              >
                <span>{{ infoRef.id }}</span>
              </el-form-item>
              <el-form-item label="任务名称" class="form_item">
                <el-input v-model="infoRef.script_name" autocomplete="off" />
              </el-form-item>

              <el-form-item class="form_item" label="模板类型">
                <el-select
                  v-model="infoRef.script_type"
                  placeholder="模板类型"
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
