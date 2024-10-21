<!--
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-01-08 15:09:59
 * @LastEditTime: 2024-07-30 21:44:04
-->
<script setup lang="ts">
import { ref, onMounted } from "vue";
import useClipboard from "vue-clipboard3";
import { ArrowRight, CopyDocument } from "@element-plus/icons-vue";
import { aiTrainListGo, updateGo, addGo, delGo } from "./aiTrainJS.ts";

const { toClipboard } = useClipboard();
// 初始化
const popBoxTit = ref("");

const currentPage = ref(1); // 当前页码
const pageSize = ref(10); // 每页显示的数据数量

const listDatas = ref<any[]>([]);

// 状态
const isAdding = ref(true);
const dialogFormVisible = ref(false);

const infoRef = ref<any>({
  id: "",
  name: "",
  training: "",
});

// 接口相关
const initData = async () => {
  listDatas.value = await aiTrainListGo();
};

onMounted(async () => {
  await initData();
});

const delet = async (row) => {
  const data = {
    id: row.id,
  };
  await delGo(data);
};

const add = () => {
  dialogFormVisible.value = true;
  popBoxTit.value = "添加";
};
const revise = (row) => {
  dialogFormVisible.value = true;
  popBoxTit.value = "修改";
  isAdding.value = false;

  infoRef.value = {
    id: row.id,
    name: row.name,
    training: row.training,
  };
};

const cancel = () => {
  initdd();
};

const save = async () => {
  console.log("准提交数据：", infoRef.value);
  console.log("当前提交行为:", isAdding.value);
  if (isAdding.value === true) {
    const data = {
      name: infoRef.value.name,
      training: infoRef.value.training,
    };
    await addGo(data);
  } else {
    const data = {
      id: infoRef.value.id,
      name: infoRef.value.name,
      training: infoRef.value.training,
    };
    await updateGo(data);
  }

  await initdd();
};

// 还原弹框输入
const initdd = async () => {
  // 还原初始化
  isAdding.value = true;

  infoRef.value = {
    id: "",
    name: "",
    training: "",
  };
  dialogFormVisible.value = false;
  await initData();
};

// 格式化列内容函数
const formatContent = (content: string) => {
  // 设置最大显示长度
  const maxLength = 80;
  // 如果内容为空，则返回空字符串
  if (!content) {
    return "";
  }

  // 如果内容长度超过最大长度，则使用省略号
  if (content.length > maxLength) {
    return content.slice(0, maxLength) + "...";
  }

  return content;
};

// 复制
const copy = async (textToCopy) => {
  try {
    await toClipboard(textToCopy);
    console.log("Copied to clipboard");
  } catch (e) {
    console.error(e);
  }
};

// 翻页

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
};
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
};
</script>
<template>
  <!-- 导航 -->
  <el-row class="row-bg">
    <el-breadcrumb :separator-icon="ArrowRight" class="breadcrumb-box">
      <el-breadcrumb-item>AI库</el-breadcrumb-item>
      <el-breadcrumb-item>AI训练语录</el-breadcrumb-item>
    </el-breadcrumb>
  </el-row>
  <!--搜索  -->
  <el-row class="row-bg">
    <el-col :span="3">
      <div class="grid-content ep-bg-purple" />
      <el-button type="primary" plain @click="add">添加</el-button>
    </el-col>
  </el-row>
  <!-- 列表 -->
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
          <el-table-column prop="id" label="ID" align="center" width="50" />
          <el-table-column
            prop="name"
            label="AI训练名称"
            align="center"
            width="150"
          />
          <el-table-column
            prop="training"
            label="训练语"
            align="center"
            width="1000"
          >
            <template #default="{ row }">
              <div>{{ formatContent(row.training) }}</div>
            </template>
          </el-table-column>

          <el-table-column prop="create_at" label="添加时间" align="center" />
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

  <!-- 弹框 添加/修改 -->
  <el-dialog
    v-model="dialogFormVisible"
    :show-close="false"
    :title="popBoxTit"
    width="1500px"
  >
    <el-form :model="infoRef" label-width="auto" style="max-width: 1200px">
      <!-- id -->
      <el-row class="row-bg">
        <el-col :span="6">
          <el-form-item v-if="!isAdding" label="id" class="form_item">
            <span>{{ infoRef.id }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="row-bg">
        <el-col :span="8">
          <el-form-item label="AI训练名称" class="form_item">
            <el-input v-model="infoRef.name" autocomplete="off" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="row-bg">
        <el-col :span="10">
          <el-form-item label="训练语" class="form_item" style="width: 1400px">
            <el-button
              type="primary"
              :icon="CopyDocument"
              plain
              @click="copy(infoRef.training)"
            ></el-button>
            <el-input
              v-model="infoRef.training"
              :rows="20"
              type="textarea"
              placeholder="Please input"
              style="margin: 10px"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </span>
    </template>
  </el-dialog>
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
.form_item {
  width: 300px;
}
</style>
./googleOauthJS
