<!--
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-11-12 22:17:11
 * @LastEditTime: 2024-11-23 15:46:48
-->
<!--
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-01-08 15:09:59
 * @LastEditTime: 2024-11-14 15:32:30
-->

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { upshotList, totalGo, exportToExcelWrapper } from "../upshotJS";
import { formatGenre } from "@/utils/Formatter/index";
const currentPage = ref(1); // 当前页码
const pageSize = ref(10); // 每页显示的数据数量
const totalVal = ref<number>(0);
const listDatas = ref<any[]>([]);

const loading = ref(false);

// 接口相关
const initData = async () => {
  loading.value = true;

  try {
    const [listData, totalData] = await Promise.all([
      upshotList({ platform: "blogger" }),
      totalGo({ platform: "blogger" }),
    ]);
    listDatas.value = listData;
    totalVal.value = totalData;
  } catch (error) {
    console.error("获取数据失败", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  initData();
});

const total = async () => {
  loading.value = true;
  try {
    totalVal.value = await totalGo({ platform: "blogger" });
    ElMessage.success("刷新成功");
  } catch (error) {
    console.error("获取总数失败", error);
    ElMessage.error("获取总数失败");
  } finally {
    initData();
    loading.value = false;
  }
};

// 导出
const exportData = async () => {
  if (listDatas.value.length === 0) {
    ElMessage.warning("没有可导出的数据");
    return;
  }
  loading.value = true;
  try {
    const data = {
      title: "blogger",
      exportD: listDatas.value,
    };
    const success = await exportToExcelWrapper(data); // 修改为调用包装函数
    if (success) {
      // 导出成功后重新加载数据
      await initData();
    }
  } finally {
    loading.value = false;
  }
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
        <el-col :span="3">
          <div class="grid-content ep-bg-purple" />
          <el-button type="primary" plain @click="total">
            总数 {{ totalVal }} 条，刷新
          </el-button>
        </el-col>
        <el-col :span="2">
          <div class="grid-content ep-bg-purple" />
          <el-button type="primary" plain @click="exportData">导出</el-button>
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
              <el-table-column prop="url" label="url" align="center" />
              <el-table-column
                prop="platform"
                label="投放平台"
                align="center"
              />
              <el-table-column
                prop="genre"
                label="类型"
                align="center"
                :formatter="formatGenre"
              />
              <el-table-column
                prop="created_at"
                label="添加时间"
                align="center"
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
</style>
