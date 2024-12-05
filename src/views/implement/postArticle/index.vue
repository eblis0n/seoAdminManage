<!--
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-01-08 15:09:59
 * @LastEditTime: 2024-12-05 21:41:52
-->
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { postInSqlGo } from "./postArticleJS";
import { articleType, naturalLanguages } from "@/utils/constants";
import { useCategoryformsHook } from "@/store/modules/category";
import { useSupportedPlatformsHook } from "@/store/modules/public";
const supportedPlatformsStore = useSupportedPlatformsHook();
const categoryFormsStore = useCategoryformsHook();

const popBoxTit = ref("");

const loading = ref(false);
const dialogFormVisible = ref(false);

const platforOptions = ref<any[]>([]);

const sortgo = ref<any[]>([]);

const infoRef = ref<any>({
  post_max: "",
  group: "all",
  platform: "",
  isSecondary: "1",
});

const articleRef = ref<any>({
  isAI: "0",
  sortID: "",
  type: "",
  commission: "1",
  user: "",
  spoken: "",
});

// 接口相关
const initData = async () => {
  loading.value = true;
  try {
    const [_, Platforms] = await Promise.all([
      categoryFormsStore.fetchCategoryforms(),
      supportedPlatformsStore.fetchSupportedPlatforms(),
    ]);

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

    platforOptions.value = supportedPlatformsStore.supportedPlatforms;
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

const prefabrication = () => {
  popBoxTit.value = "从预制中选择";
  dialogFormVisible.value = true;
};

// const readyMade = () => {
//   popBoxTit.value = "AI生成";
//   dialogFormVisible.value = true;
// };
// const custom = () => {
//   // console.log("新增", infoRef.value);
//   popBoxTit.value = "自定义";
//   dialogFormVisible.value = true;
// };

const handleClose = () => {
  resetInfo();
};

const prefabricationGO = () => {
  console.log("准提交数据：", infoRef.value, articleRef.value);
  console.log("当前提交行为:", popBoxTit.value);

  dialogFormVisible.value = false;
  loading.value = true;
  try {
    const data = {
      post_max: infoRef.value.post_max,
      group: infoRef.value.group,
      platform: infoRef.value.platform,
      isSecondary: infoRef.value.isSecondary,
      isAI: articleRef.value.isAI,
      sortID: articleRef.value.sortID,
      type: articleRef.value.type,
      commission: articleRef.value.commission,
      user: articleRef.value.user,
      spoken: articleRef.value.spoken,
    };
    postInSqlGo(data);
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
  dialogFormVisible.value = false;

  infoRef.value = {
    post_max: "",
    group: "",
    platform: "",
    isSecondary: "1",
  };

  articleRef.value = {
    isAI: "0",
    sortID: "",
    type: "",
    commission: "1",
    user: "",
    spoken: "",
  };

  await initData();
};

const handleSortChange = (value: string | number) => {
  infoRef.value.sortID = value;
};
</script>
<template>
  <div class="web-container" v-loading="loading">
    <el-card shadow="never">
      <el-row class="row-bg">
        <el-col :span="4">
          <div class="grid-content ep-bg-purple" />
          <el-button type="primary" plain @click="prefabrication">
            预制
          </el-button>
        </el-col>
        <!-- <el-col :span="4">
          <div class="grid-content ep-bg-purple" />
          <el-button type="primary" plain @click="readyMade">AI现成</el-button>
        </el-col>
        <el-col :span="4">
          <div class="grid-content ep-bg-purple" />
          <el-button type="primary" plain @click="custom">自定义</el-button>
        </el-col> -->
      </el-row>

      <!-- 发帖弹框 -->
      <el-dialog
        v-model="dialogFormVisible"
        destroy-on-close
        center
        :title="popBoxTit"
        width="80%"
        @close="handleClose"
      >
        <div class="shell-content-container">
          <!-- 左侧发帖对象表单 -->
          <div class="left-form">
            <el-form :model="infoRef">
              <span>
                发 NOTE 之前，记得先检查 cookie 是否已经更新过哦！！！
              </span>
              <el-form-item
                class="form_item flex items-center"
                label="投放平台"
              >
                <div class="flex items-center">
                  <el-select
                    v-model="infoRef.platform"
                    placeholder="投放平台"
                    size="large"
                    style="width: 240px"
                  >
                    <el-option
                      v-for="item in platforOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </div>
              </el-form-item>

              <el-form-item
                label="分组"
                class="form_item"
                v-show="infoRef.platform !== 'telegra'"
              >
                <el-input v-model="infoRef.group" autocomplete="off" />
              </el-form-item>

              <el-form-item
                label="发帖数量"
                class="form_item"
                v-show="infoRef.platform === 'telegra'"
              >
                <el-input v-model="infoRef.post_max" autocomplete="off" />
              </el-form-item>
              <el-form-item label="是否二次AI" class="form_item">
                <div class="flex items-center">
                  <el-radio-group
                    v-model="infoRef.isSecondary"
                    class="flex items-center"
                  >
                    <el-radio label="0" size="large">是</el-radio>
                    <el-radio label="1" size="large">否</el-radio>
                  </el-radio-group>
                </div>
              </el-form-item>
            </el-form>
          </div>

          <!-- 右侧编辑器 -->
          <div class="right-editor">
            <el-form :model="articleRef">
              <el-row class="row-bg" :gutter="20">
                <el-col :span="6" v-show="popBoxTit === '从预制中选择'">
                  <el-form-item label="是否为AI文章" class="form_item">
                    <div class="flex items-center">
                      <el-radio-group
                        v-model="articleRef.isAI"
                        class="flex items-center"
                      >
                        <el-radio label="0" size="large">是</el-radio>
                        <el-radio label="1" size="large">否</el-radio>
                      </el-radio-group>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="所属分类" class="form_item">
                    <el-select
                      v-model="articleRef.sortID"
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
                </el-col>
                <el-col :span="8">
                  <el-form-item label="文章类型" class="form_item">
                    <!-- <el-input v-model="infoRef.type" autocomplete="off" /> -->
                    <el-select
                      v-model="articleRef.type"
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
                </el-col>
              </el-row>

              <el-row class="row-bg" :gutter="20">
                <el-col :span="6">
                  <el-form-item label="是否专属" class="form_item">
                    <div class="flex items-center">
                      <el-radio-group
                        v-model="articleRef.commission"
                        class="flex items-center"
                      >
                        <el-radio label="0" size="large">是</el-radio>
                        <el-radio label="1" size="large">否</el-radio>
                      </el-radio-group>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item
                    label="用户名称"
                    class="form_item"
                    v-if="articleRef.commission === '0'"
                  >
                    <el-input v-model="articleRef.user" autocomplete="off" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="row-bg" :gutter="20">
                <el-col :span="8" v-show="popBoxTit !== 'AI现成'">
                  <el-form-item label="语言" class="form_item">
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
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>

        <template #footer>
          <span class="dialog-footer" v-show="popBoxTit !== '查看'">
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" @click="prefabricationGO">保存</el-button>
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
  // flex-direction: column;
  width: 50%;
}
</style>
