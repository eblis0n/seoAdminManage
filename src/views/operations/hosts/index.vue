<!--
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-01-08 15:09:59
 * @LastEditTime: 2024-11-07 20:38:26
-->
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { hostsList, updateGo, disableGo } from "../operationsJS";
import type { hostDisable, hostsUpdate, hostsResult } from "@/types/operations";

const currentPage = ref(1); // 当前页码
const pageSize = ref(10); // 每页显示的数据数量

const listDatas = ref<any[]>([]);

const popBoxTit = ref("");

const loading = ref(false);
const dialogFormVisible = ref(false);
const dialogShellVisible = ref(false);

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

// 添加定时器引用
const timer = ref<ReturnType<typeof setInterval> | null>(null);

const lastUpdateTime = ref(""); // 添加最后更新时间
const isAutoRefreshEnabled = ref(true); // 添加自动刷新开关状态

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

const disable = async (row: hostDisable) => {
  loading.value = true;
  try {
    const data = {
      id: row.id,
      is_disabled: row.is_disabled === "0" ? "1" : "0", // 切换状态
    };
    await disableGo(data);
  } catch (error) {
    console.log("出现异常:", error);
  } finally {
    await initData();
    loading.value = false;
  }
};

// 修改
const revise = (row: hostsResult) => {
  // console.log(parent);
  const data = {
    id: row.id,
    host_ip: row.host_ip,
    is_disabled: row.is_disabled,
    host_group: row.host_group,
    remark: row.remark,
  };
  infoRef.value = data;
  popBoxTit.value = "修改";
  dialogFormVisible.value = true;
};

// 弹框

const handleClose = () => {
  resetInfo();
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
      is_disabled: infoRef.value.is_disabled,
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
//

// 自动刷新
// // 更新最后刷新时间
// const updateLastUpdateTime = () => {
//   lastUpdateTime.value = new Date().toLocaleTimeString();
// };

// 添加自动刷新控制函数
const startAutoRefresh = () => {
  if (timer.value) {
    clearInterval(timer.value);
  }
  timer.value = setInterval(() => {
    if (isAutoRefreshEnabled.value) {
      initData();
    }
  }, 60000); // 60秒刷新一次
};

// 切换自动刷新状态
const toggleAutoRefresh = () => {
  isAutoRefreshEnabled.value = !isAutoRefreshEnabled.value;
  if (isAutoRefreshEnabled.value) {
    startAutoRefresh();
    ElMessage.success("自动刷新已开启");
  } else {
    if (timer.value) {
      clearInterval(timer.value);
      timer.value = null;
    }
    ElMessage.warning("自动刷新已关闭");
  }
};

// 手动刷新
const refresh = () => {
  loading.value = true;
  initData();
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
    online: "",
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
        <el-col :span="2">
          <el-button
            :type="isAutoRefreshEnabled ? 'success' : 'warning'"
            plain
            @click="toggleAutoRefresh"
          >
            {{ isAutoRefreshEnabled ? "自动刷新：开" : "自动刷新：关" }}
          </el-button>
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

              <
              <el-table-column prop="online" label="是否在线" align="center">
                <template #default="{ row }">
                  <span
                    :class="row.online === '0' ? 'online-cell' : 'offline-cell'"
                  >
                    {{ formatOnline(row) }}
                  </span>
                </template>
              </el-table-column>

              <el-table-column
                prop="is_disabled"
                label="状态"
                align="center"
                :formatter="formatdisabledMap"
              />

              <el-table-column prop="operate" label="操作" align="center">
                <template #default="{ row }">
                  <el-button type="primary" link @click="check(row)">
                    查看
                  </el-button>
                  <el-button
                    type="primary"
                    link
                    @click="disable(row)"
                    v-if="row.is_disabled === '0'"
                  >
                    下架
                  </el-button>
                  <el-button
                    type="primary"
                    link
                    @click="disable(row)"
                    v-if="row.is_disabled === '1'"
                  >
                    上架
                  </el-button>
                  <el-button type="primary" link @click="revise(row)">
                    修改
                  </el-button>
                  <el-button type="primary" link @click="shellScript(row)">
                    任务发起
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
        width="1400px"
        @close="handleClose"
      >
        <el-form :model="infoRef">
          <el-row class="row-bg flex items-center" :gutter="20">
            <el-col :span="4">
              <el-form-item label="id" class="form_item">
                <span>{{ infoRef.id }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="IP地址" class="form_item">
                <span>{{ infoRef.host_ip }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="row-bg flex items-center" :gutter="20">
            <el-col :span="8">
              <el-form-item label="分组" class="form_item">
                <el-input v-model="infoRef.host_group" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item class="form_item flex items-center" label="状态">
                <div class="flex items-center">
                  <el-radio-group v-model="infoRef.is_disabled" class="ml-4">
                    <el-radio label="0" size="large">上架</el-radio>
                    <el-radio label="1" size="large">下架</el-radio>
                  </el-radio-group>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="row-bg flex items-center" :gutter="20">
            <el-col :span="8">
              <el-form-item label="备注" class="form_item flex items-center">
                <el-input
                  v-model="infoRef.remark"
                  style="width: 400px"
                  :autosize="{ minRows: 4, maxRows: 10 }"
                  type="textarea"
                  placeholder="Please input"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="Cancel">取消</el-button>
            <el-button type="primary" @click="save">保存</el-button>
          </span>
        </template>
      </el-dialog>
      <!-- 弹框end -->
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

.online-cell {
  padding: 20px;
  background-color: #03f803;
  border: 1px solid #4caf50;
}

.offline-cell {
  padding: 20px;
  background-color: #f40303;
  border: 1px solid #ef0202;
}
</style>
