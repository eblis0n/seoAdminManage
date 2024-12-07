<!--
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-01-08 15:09:59
 * @LastEditTime: 2024-12-08 00:14:12
-->
<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import type { articleResult, articleDel } from "@/types/article";
import { articleList, delGo, addGo, aiAddGo } from "./articleJS";
import { formatisAI, formatCommission } from "@/utils/Formatter/index";
import { useAiPromptHook } from "@/store/modules/aiPrompt";
import { useCategoryformsHook } from "@/store/modules/category";
import { sourceData, articleType, naturalLanguages } from "@/utils/constants";

const categoryFormsStore = useCategoryformsHook();

const AiPromptStore = useAiPromptHook();

const currentPage = ref(1); // 当前页码
const pageSize = ref(10); // 每页显示的数据数量

const listDatas = ref<any[]>([]);
const sortgo = ref<any[]>([]);
const promptDatas = ref<any[]>([]);

// 初始化
const popBoxTit = ref("");
const loading = ref(false);

const dialogFormVisible = ref(false);

const infoRef = ref<any>({
  id: "",
  isAI: "0",
  promptID: "",
  sortID: "",
  source: "",
  title: "",
  content: "",
  type: "",
  user: "",
  commission: "1",
  theme: "",
  Keywords: "",
  ATag: "",
  link: "",
  language: "",
  spoken: "",
});

// 接口相关
const initData = async () => {
  loading.value = true;
  try {
    const [listData, _, categoryData] = await Promise.all([
      articleList(),
      AiPromptStore.fetchAiPromptList(),
      categoryFormsStore.fetchCategoryforms(),
    ]);
    listDatas.value = listData;
    promptDatas.value = AiPromptStore.aiPromptList;
    // console.log("listDatas.value", listDatas.value);
    const categoryGroups = new Map();
    const categoryD = categoryFormsStore.categoryforms;
    categoryD.forEach((item) => {
      if (item.level === 0) {
        categoryGroups.set(item.id, {
          label: item.name,
          options: [],
        });
      }
    });

    categoryD.forEach((item) => {
      if (item.level !== 0 && categoryGroups.has(item.level)) {
        const group = categoryGroups.get(item.level);
        group.options.push({
          value: item.id,
          label: item.name,
        });
      }
    });

    sortgo.value = Array.from(categoryGroups.values());
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

// 当前选中的 promptID 和其对应的 pronoun
const selectedPromptID = ref<string | number>("");

const selectedPronoun = computed(() => {
  const selected = promptDatas.value.find(
    (item) => String(item.id) === String(selectedPromptID.value)
  );

  return selected ? selected.pronoun : "";
});

// 解析 pronoun 中的占位符
const inputFields = computed(() => {
  if (!selectedPronoun.value) return [];
  return (
    selectedPronoun.value
      .match(/{(.*?)}/g)
      ?.map((v: string) => v.slice(1, -1)) || []
  );
});

// 存储用户填写的输入框数据
const inputValues = ref<{ [key: string]: string }>({});

const updateInputFields = () => {
  // 将 selectedPromptID 赋值给 infoRef.promptID
  infoRef.value.promptID = selectedPromptID.value;
  // 更新 `inputValues` 的数据，重置旧的字段值
  inputValues.value = {};
};

watchEffect(() => {
  console.log("selectedPromptID:", selectedPromptID.value);
  console.log("selectedPronoun:", selectedPronoun.value);
  console.log("inputFields:", inputFields.value);
});

// // 添加
const Add = () => {
  // console.log("新增", infoRef.value);
  popBoxTit.value = "新增";
  dialogFormVisible.value = true;
};

const save = async () => {
  console.log("准提交数据：", infoRef.value);
  console.log("当前提交行为:", popBoxTit.value);
  console.log("当前动态字段值：", inputValues.value);
  dialogFormVisible.value = false;
  loading.value = true;
  // 将动态生成的 inputValues[field] 数据赋值给 infoRef
  Object.keys(inputValues.value).forEach((key) => {
    infoRef.value[key] = inputValues.value[key];
  });
  console.log("合并后的数据：", infoRef.value);

  try {
    if (infoRef.value.isAI === "0") {
      const data = {
        isAI: infoRef.value.isAI,
        promptID: infoRef.value.promptID,
        sortID: infoRef.value.sortID,
        source: infoRef.value.source,
        type: infoRef.value.type,
        user: infoRef.value.user,
        commission: infoRef.value.commission,
        theme: infoRef.value.theme,
        Keywords: infoRef.value.Keywords,
        ATag: infoRef.value.ATag,
        link: infoRef.value.tylinkpe,
        language: infoRef.value.language,
      };
      console.log("data", data);

      await aiAddGo(data);
    } else {
      const data = {
        isAI: infoRef.value.isAI,
        sortID: infoRef.value.sortID,
        source: infoRef.value.source,
        title: infoRef.value.title,
        content: infoRef.value.content,
        spoken: infoRef.value.spoken,
        type: infoRef.value.type,
        user: infoRef.value.user,
        commission: infoRef.value.commission,
      };

      await addGo(data);
    }
  } catch (error) {
    console.log("出现异常:", error);
  } finally {
    loading.value = false;
    resetInfo();
  }
};
const look = (row: articleResult) => {
  const data = {
    id: row.id,
    isAI: String(row.isAI),
    promptID: row.promptID,
    sortID: row.sortID,
    source: row.source,
    title: row.title,
    content: row.content,
    spoken: row.spoken,
    type: row.type,
    user: row.user,
    commission: String(row.commission),
  };
  infoRef.value = data;

  popBoxTit.value = "查看";
  dialogFormVisible.value = true;
};

// // 删除
const delet = async (row: articleDel) => {
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
const handleClose = () => {
  resetInfo();
};

// 还原弹框输入
const resetInfo = async () => {
  // 还原初始化
  popBoxTit.value = "";
  infoRef.value = {
    id: "",
    isAI: "0",
    promptID: "",
    sortID: "",
    source: "",
    title: "",
    content: "",
    type: "",
    user: "",
    commission: "1",
    theme: "",
    Keywords: "",
    ATag: "",
    link: "",
    language: "",
    spoken: "",
  };
  selectedPromptID.value = "";

  dialogFormVisible.value = false;
  await initData();
};

const handleSortChange = (value: string | number) => {
  console.log("value", value);
  infoRef.value.sortID = value;
};

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
};
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
};

// 添加一个计算属性来获取 promptID 对应的 name
const getPromptName = (promptID: string | number) => {
  const prompt = promptDatas.value.find(
    (item) => String(item.id) === String(promptID)
  );
  return prompt ? prompt.name : promptID;
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
                prop="isAI"
                label="AI"
                align="center"
                :formatter="formatisAI"
              />

              <el-table-column
                prop="promptID"
                label="prompt名称"
                align="center"
              >
                <template #default="{ row }">
                  {{ getPromptName(row.promptID) }}
                </template>
              </el-table-column>
              <el-table-column prop="sortID" label="分类" align="center" />
              <el-table-column prop="source" label="来源" align="center" />
              <el-table-column prop="title" label="标题" align="center" />
              <el-table-column prop="type" label="文章类型" align="center" />
              <el-table-column label="语言" align="center">
                <template #default="{ row }">
                  <!-- 动态判断优先显示 spoken 或 language -->
                  <span v-if="row.spoken">{{ row.spoken }}</span>
                  <span v-else="row.language">{{ row.language }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="user" label="用户" align="center" />
              <el-table-column
                prop="commission"
                label="是否专属"
                align="center"
                :formatter="formatCommission"
              />

              <el-table-column
                prop="create_at"
                label="添加时间"
                align="center"
              />
              <el-table-column prop="operate" label="操作" align="center">
                <template #default="{ row }">
                  <el-button type="primary" link @click="look(row)">
                    查看
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

      <!-- 非ai -->
      <el-dialog
        v-model="dialogFormVisible"
        destroy-on-close
        center
        :title="popBoxTit"
        width="80%"
        @close="handleClose"
      >
        <div class="shell-content-container">
          <!-- 左侧表单 -->
          <div class="left-form">
            <el-form :model="infoRef">
              <el-form-item
                label="id"
                class="form_item"
                v-show="popBoxTit === '查看'"
              >
                <span>{{ infoRef.id }}</span>
              </el-form-item>
              <el-form-item label="是否为AI文章" class="form_item">
                <div class="flex items-center">
                  <el-radio-group
                    v-model="infoRef.isAI"
                    class="flex items-center"
                  >
                    <el-radio label="0" size="large">是</el-radio>
                    <el-radio label="1" size="large">否</el-radio>
                  </el-radio-group>
                </div>
              </el-form-item>
              <el-form-item
                label="标题"
                class="form_item"
                v-show="popBoxTit === '查看'"
              >
                <el-input v-model="infoRef.title" autocomplete="off" />
              </el-form-item>
              <el-form-item label="来源" class="form_item">
                <!-- 当 infoRef.isAI === "1" 时，显示输入框 -->
                <el-input
                  v-if="infoRef.isAI === '1'"
                  v-model="infoRef.source"
                  autocomplete="off"
                />
                <!-- 当 infoRef.isAI === "0" 时，显示下拉框 -->
                <el-select
                  v-else
                  v-model="infoRef.source"
                  placeholder="Select"
                  style="width: 240px"
                >
                  <el-option
                    v-for="item in sourceData"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                label="语言"
                class="form_item"
                v-show="infoRef.isAI === '1'"
              >
                <!-- <el-input v-model="infoRef.spoken" autocomplete="off" /> -->
                <el-select
                  v-model="infoRef.spoken"
                  placeholder="Select"
                  style="width: 240px"
                >
                  <el-option
                    v-for="item in naturalLanguages"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>

              <el-form-item label="文章类型" class="form_item">
                <el-select
                  v-model="infoRef.type"
                  placeholder="Select"
                  style="width: 240px"
                >
                  <el-option
                    v-for="item in articleType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="所属分类" class="form_item">
                <el-select
                  v-model="infoRef.sortID"
                  placeholder="Select"
                  style="width: 240px"
                  @change="handleSortChange"
                >
                  <el-option-group
                    v-for="group in sortgo"
                    :key="group.label"
                    :label="group.label"
                  >
                    <el-option
                      v-for="item in group.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-option-group>
                </el-select>
              </el-form-item>

              <el-form-item label="是否专属" class="form_item">
                <div class="flex items-center">
                  <el-radio-group
                    v-model="infoRef.commission"
                    class="flex items-center"
                  >
                    <el-radio label="0" size="large">是</el-radio>
                    <el-radio label="1" size="large">否</el-radio>
                  </el-radio-group>
                </div>
              </el-form-item>
              <el-form-item
                label="用户名称"
                class="form_item"
                v-if="infoRef.commission === '0'"
              >
                <el-input v-model="infoRef.user" autocomplete="off" />
              </el-form-item>
            </el-form>
          </div>

          <!-- 右侧编辑器 -->
          <div class="right-editor">
            <el-form
              :model="infoRef"
              v-show="infoRef.isAI === '1' || popBoxTit === '查看'"
            >
              <el-form-item label="正文" class="form_item">
                <el-input
                  v-model="infoRef.content"
                  autocomplete="off"
                  style="width: 100%"
                  :autosize="{ minRows: 20, maxRows: 30 }"
                  type="textarea"
                  placeholder="promptdata"
                />
              </el-form-item>
            </el-form>

            <!-- AI -->
            <el-form
              :model="infoRef"
              v-show="infoRef.isAI === '0' && popBoxTit !== '查看'"
            >
              <el-form-item class="form_item">
                <span>使用说明：</span>
                <p>
                  1、使文章生成 根据 prompt 变量 不同 动态要求不同的 资料填写
                </p>
                <p>
                  2、使用 [^] 间隔 可以 使用 同一个 prompt 生成多个不同的
                  theme，Keywords，ATag，link，language 的文章
                </p>
                <p>
                  例： prompt：[{"type":"0","promptdata":"根据 {theme} 写一段
                  {language}
                  的煽情短文"},{"type":"1","promptdata":"https://baidu.com"}]
                  theme 输入"爱情"^"忧伤"language 输入"中文"^"英语" 就会生成 1篇
                  中文爱情，1篇 英语忧伤 的 文章
                </p>
              </el-form-item>
              <el-form-item label="prompt" class="form_item">
                <el-select
                  v-model="selectedPromptID"
                  placeholder="Select"
                  style="width: 240px"
                  @change="updateInputFields"
                  clearable
                >
                  <el-option
                    v-for="item in promptDatas"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>

              <el-form-item
                v-for="field in inputFields"
                :key="field"
                :label="field"
              >
                <!-- <el-input
                  v-model="inputValues[field]"
                  :placeholder="'请输入 ' + field"
                /> -->

                <!-- 判断是否是 'language' 字段，动态渲染不同的输入控件 -->
                <template v-if="field === 'language'">
                  <el-select
                    v-model="inputValues[field]"
                    placeholder="请选择语言"
                    style="width: 240px"
                  >
                    <el-option
                      v-for="item in naturalLanguages"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </template>
                <template v-else>
                  <el-input
                    v-model="inputValues[field]"
                    :placeholder="'请输入 ' + field"
                  />
                </template>
              </el-form-item>

              <!-- AI -->
            </el-form>
          </div>
        </div>

        <template #footer>
          <span class="dialog-footer" v-show="popBoxTit !== '查看'">
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" @click="save">保存</el-button>
          </span>
        </template>
      </el-dialog>
      <!--  end-->
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

.m-2 {
  width: 300px;
}

.prompt-list {
  // display: flex;
  flex-direction: column;
  gap: 10px;
  width: 80%;
  padding: 10px;
  margin-left: 15px;
  border: 1px dashed #dcdfe6;
}

.prompt-input-container {
  display: flex;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 10px;

  .el-input {
    flex: 1;
  }

  .prompt-actions {
    display: flex;
    align-items: center;
    min-width: 40px;
    margin-left: 10px;

    .el-button {
      padding: 8px;
    }
  }
}

.shell-content-container {
  display: flex;
  gap: 20px;
  min-height: 600px;
}

.left-form {
  width: 40%;
  padding: 20px;
  margin-right: 20px;
  background-color: #f7f5f5;
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
  width: 50%;
}
</style>
