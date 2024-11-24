<!--
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-01-08 15:09:59
 * @LastEditTime: 2024-11-23 23:32:39
-->
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { excelList } from "./googleExcelJS";
const loading = ref(false);
const listDatas = ref<any[]>([]);
const iframeUrl = ref("");

const initData = async () => {
  loading.value = true;
  try {
    const [listData] = await Promise.all([excelList()]);

    listDatas.value = listData;

    if (listDatas.value?.length > 0) {
      console.log("listDatas.value", listDatas.value);

      const url = listDatas.value[0].url;
      iframeUrl.value = url.replace(/['"]/g, "");
    }
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
// 手动刷新
const refresh = () => {
  initData();
};
</script>

<template>
  <div class="web-container" v-loading="loading">
    <el-card shadow="never">
      <el-row class="row-bg" :gutter="20">
        <el-col :span="2">
          <div class="grid-content ep-bg-purple" />
          <el-button type="primary" plain @click="refresh">手动刷新</el-button>
        </el-col>
      </el-row>
      <el-row class="row-bg" :gutter="20">
        <span>Google表格预览</span>
        <iframe
          :src="iframeUrl"
          width="100%"
          height="600"
          style="border: none"
          title="Google Sheet"
        ></iframe>
      </el-row>
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

.excel-card {
  height: calc(100vh - 120px);

  .google-excel-frame {
    width: 100%;
    height: 100%;
    border: none;
  }

  .no-data {
    padding: 20px;
    color: #909399;
    text-align: center;
  }
}
</style>
