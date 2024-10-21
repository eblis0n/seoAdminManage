<!--
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-01-08 15:09:59
 * @LastEditTime: 2024-10-10 22:00:01
-->
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ArrowRight } from "@element-plus/icons-vue";
import {
  bloggerPostsListGo,
  bloggerPostsRecordingGo,
  selectGo,
} from "./bloggerJS.js";
import { saveAs } from "file-saver";

// 获取昨天的日期

const currentPage = ref(1); // 当前页码
const pageSize = ref(10); // 每页显示的数据数量

const listDatas = ref<any[]>([]);
const defaultTime = ref<[Date, Date]>([new Date(""), new Date("")]);
// 接口相关
const initData = async () => {
  listDatas.value = await bloggerPostsListGo();
};
console.log(listDatas.value);

onMounted(async () => {
  await initData();
});

const recording = async () => {
  await bloggerPostsRecordingGo();
  await initData();
};

const select = async () => {
  try {
    const data = {
      startday: formatDate(defaultTime.value[0]),
      endday: formatDate(defaultTime.value[1]),
    };
    listDatas.value = await selectGo(data);
    // console.log('listDatas.value:', listDatas.value);
  } catch (error) {
    console.log("出现异常:", error);
    await initData();
  }
};

const formatDate = (dateString) => {
  const dateObj = new Date(dateString);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const exportCsv = () => {
  let csvContent = "\uFEFF"; // Add UTF-8 BOM at the start of the text
  csvContent += "ID,bloggerID,文章ID,推荐链接,文章标题,帖子链接,发帖时间\n";
  listDatas.value.forEach((rowItem) => {
    csvContent += `${rowItem.id},${rowItem.blogger_id},${rowItem.article_id},${rowItem.sponsored_link},"${rowItem.article_title}", "${rowItem.posts_url}",${rowItem.create_at}\n`;
  });
  const now = new Date();
  const timestamp =
    now.getFullYear() +
    "_" +
    (now.getMonth() + 1) +
    "_" +
    now.getDate() +
    "_" +
    now.getHours() +
    "_" +
    now.getMinutes() +
    "_" +
    now.getSeconds();
  const filename = `blogger_posts_${timestamp}.csv`;

  var blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, filename);
  ElMessage.success("Export successful!");
};

// 格式化列内容函数
const formatContent = (content: string) => {
  // 设置最大显示长度
  const maxLength = 150;
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
      <el-breadcrumb-item>Blogger</el-breadcrumb-item>
      <el-breadcrumb-item>发帖记录</el-breadcrumb-item>
    </el-breadcrumb>
  </el-row>
  <!--搜索  -->
  <el-row class="row-bg" :gutter="20">
    <el-col :span="6">
      <div class="block">
        <el-date-picker
          v-model="defaultTime"
          type="daterange"
          range-separator="To"
          start-placeholder="Start date"
          end-placeholder="End date"
        />
      </div>
    </el-col>
    <el-col :span="1">
      <div class="grid-content ep-bg-purple"></div>
      <el-button type="primary" plain @click="select">查询</el-button>
    </el-col>
    <el-col :span="1">
      <div class="grid-content ep-bg-purple"></div>
      <el-button type="primary" plain @click="exportCsv">导出</el-button>
    </el-col>
    <el-col :span="1">
      <div class="grid-content ep-bg-purple"></div>
      <el-button type="primary" plain @click="recording">补录</el-button>
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
            prop="blogger_id"
            label="bloggerID"
            align="center"
            width="200"
          />
          <el-table-column
            prop="article_id"
            label="文章ID"
            align="center"
            width="80"
          />
          <el-table-column
            prop="sponsored_link"
            label="推广链接"
            align="center"
            width="200"
          />
          <el-table-column
            prop="article_title"
            label="文章标题"
            align="center"
            width="300"
          />
          <el-table-column
            prop="article_content"
            label="文章内容"
            align="center"
          >
            <template #default="{ row }">
              <div>{{ formatContent(row.article_content) }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="posts_url"
            label="帖子链接"
            align="center"
            width="300"
          />
          <el-table-column
            prop="create_at"
            label="添加时间"
            align="center"
            width="200"
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
./bloggerJS.ts
