<!--
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-01-08 15:09:59
 * @LastEditTime: 2024-11-23 00:02:15
-->
<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { AiPromptDel, AiPromptUpdate } from "@/types/aiPrompt";
import { updateGo, delGo, addGo } from "./aiPromptJS";
import { useAiPromptHook } from "@/store/modules/aiPrompt";
import { useCategoryformsHook } from "@/store/modules/category";

const categoryFormsStore = useCategoryformsHook();

const AiPromptStore = useAiPromptHook();

const currentPage = ref(1); // 当前页码
const pageSize = ref(10); // 每页显示的数据数量

const listDatas = ref<any[]>([]);

// 初始化
const popBoxTit = ref("");
const loading = ref(false);

const dialogFormVisible = ref(false);

const sortgo = ref<any[]>([]);

const infoRef = ref<any>({
  id: "",
  sort: "",
  salesman: "",
  name: "",
  pronoun: "",
  prompt: "",
});

// 在 script setup 中添加
const promptList = ref<Array<{ type: string; promptdata: string }>>([
  { type: "0", promptdata: "" },
]); // 初始化为包含一个对象的数组

// 接口相关
const initData = async () => {
  loading.value = true;
  try {
    const [_, categoryData] = await Promise.all([
      AiPromptStore.fetchAiPromptList(),
      categoryFormsStore.fetchCategoryforms(),
    ]);
    listDatas.value = AiPromptStore.aiPromptList;
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

// // 添加
const Add = () => {
  // console.log("新增", infoRef.value);
  popBoxTit.value = "新增";
  dialogFormVisible.value = true;
};

// // 修改
const revise = (row: AiPromptUpdate) => {
  const data = {
    id: row.id,
    salesman: row.salesman,
    sort: row.sort,
    name: row.name,
    pronoun: row.pronoun,
    prompt: row.prompt,
  };
  infoRef.value = data;

  // 如果 prompt 是字符串，尝试解析为数组
  try {
    promptList.value = row.prompt
      ? JSON.parse(row.prompt)
      : [{ type: "0", promptdata: "" }];
  } catch (e) {
    // 如果解析失败，使用默认值
    promptList.value = [{ type: "0", promptdata: row.prompt || "" }];
  }

  popBoxTit.value = "修改";
  dialogFormVisible.value = true;
};

const save = async () => {
  console.log("准提交数据：", infoRef.value);
  console.log("当前提交行为:", popBoxTit.value);
  dialogFormVisible.value = false;
  loading.value = true;

  try {
    // 过滤掉空的 promptdata
    const validPrompts = promptList.value.filter(
      (p) => p.promptdata.trim() !== ""
    );

    // 将 validPrompts 转换为字符串
    const promptString = JSON.stringify(validPrompts);

    // 修改
    if (popBoxTit.value === "修改") {
      const data = {
        id: infoRef.value.id,
        salesman: infoRef.value.salesman,
        sort: infoRef.value.sort,
        name: infoRef.value.name,
        pronoun: infoRef.value.pronoun,
        prompt: promptString, // 转换为字符串
      };
      await updateGo(data);
    } else {
      //  新增
      const data = {
        salesman: infoRef.value.salesman,
        sort: infoRef.value.sort,
        name: infoRef.value.name,
        pronoun: infoRef.value.pronoun,
        prompt: promptString, // 转换为字符串
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

// // 删除
const delet = async (row: AiPromptDel) => {
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
    sort: "",
    salesman: "",
    name: "",
    pronoun: "",
    prompt: "",
  };
  promptList.value = [{ type: "0", promptdata: "" }]; // 重置为只有一个空对象
  dialogFormVisible.value = false;
  await initData();
};

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
};
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
};

// 添加新的 prompt 输入框
const addPromptInput = () => {
  promptList.value.push({ type: "0", promptdata: "" });
};

// 删除指定的 prompt 输入框
const removePromptInput = (index: number) => {
  promptList.value.splice(index, 1);
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

              <el-table-column prop="salesman" label="作者" align="center" />
              <el-table-column prop="sort" label="分类" align="center" />
              <el-table-column prop="pronoun" label="变量" align="center" />
              <el-table-column prop="name" label="prompt名称" align="center" />

              <el-table-column
                prop="prompt"
                label="prompt"
                align="center"
                width="240"
                show-overflow-tooltip
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
              <el-form-item label="使用说明：" class="form_item">
                <div>
                  <!-- <span>使用说明：</span> -->
                  <p>
                    1、prompt 变量协议：主题：{theme}, 关键词：{Keywords}
                    A标签链接：{Atab} 网图地址：{link} 语言：{language}
                    作用：生成文章的时候进行实际替换
                  </p>

                  <p>2、支持分段式prompt 生成文章段，再拼接为一篇文章发送；</p>
                  <p>3、prompt/自定义 中不能出现 双引号【"】</p>
                  <p>
                    4、可设置自定义内容，在生成文章的时候，根据整个prompt的 设定
                    顺序插入；如：01：prompt 02:“这是一条测试数据”03：prompt
                    生成的文章结果为：prompt“这是一条测试数据”prompt
                  </p>
                  <p style="color: red">
                    ps:如果 在 prompt 输入框中有使用 {theme}，{Keywords}，{Atab}
                    ，{link} ，{language} 就务必要将对应 变量 同步填写到
                    左侧变量输入框中，否则生成文章时会被识别为字符
                  </p>
                </div>
              </el-form-item>
              <el-form-item
                label="id"
                class="form_item"
                v-if="popBoxTit === '修改'"
              >
                <span>{{ infoRef.id }}</span>
              </el-form-item>
              <el-form-item label="作者" class="form_item">
                <el-input v-model="infoRef.salesman" autocomplete="off" />
              </el-form-item>
              <el-form-item label="prompt名称" class="form_item">
                <el-input v-model="infoRef.name" autocomplete="off" />
              </el-form-item>
              <el-form-item label="所属分类" class="form_item">
                <el-select
                  v-model="infoRef.sort"
                  placeholder="Select"
                  style="width: 240px"
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
              <el-form-item label="变量" class="form_item">
                <el-input
                  v-model="infoRef.pronoun"
                  autocomplete="off"
                  style="width: 80%"
                  :rows="4"
                  type="textarea"
                  placeholder="请填写 右侧 使用到的{theme},{Keywords},{Atab},{link},{language}"
                />
              </el-form-item>
            </el-form>
          </div>

          <!-- 右侧编辑器 -->
          <div class="right-editor">
            <el-form :model="infoRef">
              <el-form-item label="训练语" class="form_item">
                <div class="prompt-list">
                  <div
                    v-for="(prompt, index) in promptList"
                    :key="index"
                    class="prompt-input-container"
                  >
                    <div class="flex items-center">
                      <el-radio-group
                        v-model="promptList[index].type"
                        class="flex items-center"
                      >
                        <el-radio label="0" size="large">prompt</el-radio>
                        <el-radio label="1" size="large">自定义内容</el-radio>
                      </el-radio-group>
                    </div>
                    <el-input
                      v-model="promptList[index].promptdata"
                      autocomplete="off"
                      style="width: 100%"
                      :autosize="{ minRows: 4, maxRows: 10 }"
                      type="textarea"
                      placeholder="promptdata"
                    />
                    <div class="prompt-actions">
                      <el-button
                        v-if="index === 0"
                        type="primary"
                        circle
                        @click="addPromptInput"
                      >
                        +
                      </el-button>
                      <el-button
                        v-if="index !== 0"
                        type="danger"
                        circle
                        @click="removePromptInput(index)"
                      >
                        -
                      </el-button>
                    </div>
                  </div>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>

        <template #footer>
          <span class="dialog-footer">
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" @click="save">保存</el-button>
          </span>
        </template>
      </el-dialog>
      <!-- 弹框 end-->
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
