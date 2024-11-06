<!--
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-01-08 15:09:59
 * @LastEditTime: 2024-11-05 16:54:00
-->
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { hostsList, delGo, updateGo } from "../operationsJS";
import type { hostsDel, hostsUpdate } from "@/types/operations";

const currentPage = ref(1); // 当前页码
const pageSize = ref(10); // 每页显示的数据数量

const listDatas = ref<any[]>([]);

const popBoxTit = ref("");

const loading = ref(false);
const dialogFormVisible = ref(false);

const infoRef = ref<any>({
  id: "",
  host_ip: "",
  host_group: "",
  is_disabled: "0",
  remark: "",
  ping_time: "",
  online: "",
});

type online = "0" | "1";
const onlineMap: Record<online, string> = {
  "0": "在线",
  "1": "离线",
};

type is_disabled = "0" | "1";

const disabledMap: Record<is_disabled, string> = {
  "0": "上架",
  "1": "下架",
};

// 接口相关
const initData = async () => {
  loading.value = true;
  try {
    const [listData] = await Promise.all([hostsList()]);
    listDatas.value = listData;
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

const formatOnline = (row: { online: online }): string => {
  return onlineMap[row.online] || "未知";
};

const formatdisabledMap = (row: { is_disabled: is_disabled }): string => {
  return disabledMap[row.is_disabled] || "未知";
};

// 修改
const revise = (row: hostsUpdate) => {
  // console.log(parent);
  const data = {
    id: row.id,
    host_group: row.host_group,
    remark: row.remark,
  };
  infoRef.value = data;
  popBoxTit.value = "修改";
  dialogFormVisible.value = true;
};

const Cancel = () => {
  resetInfo();
};

const save = async () => {
  console.log("准提交数据：", infoRef.value);
  console.log("当前提交行为:", popBoxTit.value);
  dialogFormVisible.value = false;
  loading.value = true;

  try {
    // 修改
    const data = {
      id: infoRef.value.id,
      host_group: infoRef.value.host_group,
      remark: infoRef.value.remark,
    };
    await updateGo(data);
  } catch (error) {
    console.log("出现异常:", error);
  } finally {
    loading.value = false;
    resetInfo();
  }
};
const refresh = () => {
  loading.value = true;
  initData();
};

// // 删除
const delet = async (row: hostsDel) => {
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
    host_ip: "",
    host_group: "",
    status: "0",
    remark: "",
    ping_time: "",
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
</script>
<template>
  <div class="telegra-container" v-loading="loading">
    <el-card shadow="never">
      <el-row class="row-bg" :gutter="20">
        <el-col :span="2">
          <div class="grid-content ep-bg-purple" />
          <el-button type="primary" plain @click="refresh">手动刷新</el-button>
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
              <el-table-column prop="host_ip" label="IP地址" align="center" />
              <el-table-column prop="host_group" label="分组" align="center" />
              <el-table-column prop="remark" label="备注" align="center" />
              <el-table-column
                prop="ping_time"
                label="最后在线时间"
                align="center"
              />

              <el-table-column
                prop="online"
                label="是否上线"
                align="center"
                :formatter="formatOnline"
              />

              <el-table-column
                prop="is_disabled"
                label="状态"
                align="center"
                :formatter="formatdisabledMap"
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
.telegra-container {
  position: relative;
  padding: 24px;
}

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
