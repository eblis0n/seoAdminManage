<!--
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-01-08 15:09:59
 * @LastEditTime: 2024-10-21 22:00:16
-->
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElLoading } from "element-plus";
import type { uploadFileParamsType } from "@/types/other.d.ts";
import { splicingList, uploadFile } from "./telegraJS";

const currentPage = ref(1); // 当前页码
const pageSize = ref(10); // 每页显示的数据数量
const listDatas = ref<any[]>([]);

const dialogUploadVisible = ref(false);

const initData = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: "加载中",
    background: "rgba(0, 0, 0, 0.8)",
  });

  try {
    listDatas.value = await splicingList();
  } catch (error) {
    console.error("获取数据失败", error);
  } finally {
    loading.close();
  }
};

onMounted(async () => {
  await initData();
});

function batchUpload() {
  dialogUploadVisible.value = true;
}

async function handleBeforeUpload(files: File[]) {
  const params = {
    formData: files, // 文件数组
    who: "file301", // 上传者的信息
  };

  await uploadFile(params); // 调用 uploadFile 并传递参数
  dialogUploadVisible.value = false;

  // 返回 false 阻止自动上传
  return false;
}

const handleSizeChange = (val: number) => {
  pageSize.value = val;
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
};
</script>
<template>
  <div class="pc-container">
    <el-card shadow="never">
      <el-row class="row-bg">
        <el-col :span="1">
          <div class="grid-content ep-bg-purple" />
          <el-button type="primary" plain @click="batchUpload">
            批量上传
          </el-button>
        </el-col>
      </el-row>
      <el-table
        :data="
          listDatas.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        "
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" align="center" />
        <el-table-column prop="url" label="URL" align="center" />
        <el-table-column prop="create_at" label="添加时间" align="center" />
      </el-table>
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="listDatas.length"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>

    <el-dialog v-model="dialogUploadVisible" title="上传文件" width="800px">
      <el-upload
        class="upload-demo"
        drag
        action="/"
        :before-upload="handleBeforeUpload"
        multiple
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          Drop file here or
          <em>click to upload</em>
        </div>
        <template #tip>
          <!-- <div class="el-upload__tip">
          只支持 UTF-8 的 xlsx、xls、csv 格式文件，文件最多一次5000条数据
        </div> -->
        </template>
      </el-upload>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.pc-container {
  padding: 24px;
}
</style>
