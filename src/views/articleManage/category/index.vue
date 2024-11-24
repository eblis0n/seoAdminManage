<!--
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-01-08 15:09:59
 * @LastEditTime: 2024-11-23 00:07:43
-->
<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { categoryDel, categoryUpdate } from "@/types/category";
import { updateGo, delGo, addGo } from "./categoryJS";

import { useCategoryformsHook } from "@/store/modules/category";

const categoryFormsStore = useCategoryformsHook();

const currentPage = ref(1); // 当前页码
const pageSize = ref(10); // 每页显示的数据数量

const listDatas = ref<any[]>([]);
const parentOptions = ref<any[]>([]);

// 初始化
const popBoxTit = ref("");
const loading = ref(false);

const dialogFormVisible = ref(false);

const infoRef = ref<any>({
  id: "",
  name: "",
  level: "0",
});

// 接口相关
const initData = async () => {
  loading.value = true;
  try {
    const [_] = await Promise.all([categoryFormsStore.fetchCategoryforms()]);
    listDatas.value = categoryFormsStore.categoryforms;
    parentOptions.value = listDatas.value.filter((item) => item.level === 0);
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
const revise = (row: categoryUpdate) => {
  const data = {
    id: row.id,
    name: row.name,
    level: row.level,
  };
  infoRef.value = data;
  popBoxTit.value = "修改";
  dialogFormVisible.value = true;
};

const save = async () => {
  console.log("准提交数据：", infoRef.value);
  console.log("当前提交行为:", popBoxTit.value);
  dialogFormVisible.value = false;
  loading.value = true;

  try {
    // 修改
    if (popBoxTit.value === "修改") {
      const data = {
        id: infoRef.value.id,
        name: infoRef.value.name,
        level: Number(infoRef.value.level),
      };
      await updateGo(data);
    } else {
      //  新增
      const data = {
        name: infoRef.value.name,
        level: Number(infoRef.value.level),
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
const delet = async (row: categoryDel) => {
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
    name: "",
    level: "0",
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

// 添加一个检查是否有子分类的方法
const hasChildren = (id: string | number) => {
  return listDatas.value.some((item) => item.level === id);
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

              <el-table-column prop="name" label="名称" align="center" />
              <el-table-column prop="level" label="父级" align="center" />
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
                  <el-button
                    type="primary"
                    link
                    @click="delet(row)"
                    v-if="!hasChildren(row.id)"
                  >
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

      <!-- 弹框 -->

      <el-dialog
        v-model="dialogFormVisible"
        destroy-on-close
        center
        :title="popBoxTit"
        width="80%"
        @close="handleClose"
      >
        <el-form :model="infoRef">
          <el-row
            class="row-bg flex items-center"
            :gutter="20"
            v-show="popBoxTit === '修改'"
          >
            <el-col :span="4">
              <el-form-item label="id" class="form_item">
                <span>{{ infoRef.id }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="row-bg flex items-center" :gutter="20">
            <el-col :span="8">
              <el-form-item label="名称" class="form_item">
                <el-input v-model="infoRef.name" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="父级"
                class="form_item"
                v-show="!hasChildren(infoRef.id)"
              >
                <el-select
                  v-model="infoRef.level"
                  placeholder="Select"
                  style="width: 240px"
                >
                  <el-option
                    v-for="item in parentOptions"
                    :key="item.value"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
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
