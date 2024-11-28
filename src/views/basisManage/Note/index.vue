<!--
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-01-08 15:09:59
 * @LastEditTime: 2024-11-28 21:31:16
-->
<script setup lang="ts">
import { ref, onMounted } from "vue";
import type {
  noteInfoDel,
  noteInfoUpdate,
  noteInfoRenewCookie,
} from "@/types/Note.d.ts";
import {
  noteInfoList,
  updateGo,
  delGo,
  addGo,
  renewCookieGo,
  branchCookieGo,
} from "./NoteJS";

const currentPage = ref(1); // 当前页码
const pageSize = ref(10); // 每页显示的数据数量

const listDatas = ref<any[]>([]);

// 初始化
const popBoxTit = ref("");
const loading = ref(false);

const dialogFormVisible = ref(false);

const infoRef = ref<any>({
  id: "",
  type: "basis",
  group: "all",
  adsNumber: "",
  adsID: "",
  username: "",
  email: "",
  password: "",
  proxies: "127.0.0.1:1234",
  useragent: "",
  cookie: "",
});

// ########################################### 接口 ###########################################

// 接口相关
const initData = async () => {
  loading.value = true;
  try {
    const [listData] = await Promise.all([noteInfoList()]);
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

// ########################################### 操作 ###########################################

const renewCookie = async (row: noteInfoRenewCookie) => {
  // console.log("新增", infoRef.value);
  const data = {
    id: row.id,
    adsID: row.adsID,
    type: "cookie",
  };
  await renewCookieGo(data);
  initData();
};

// 批量更新cookie
const batchCookie = () => {
  // console.log(parent);
  popBoxTit.value = "批量更新cookie";
  dialogFormVisible.value = true;
};

// // 添加
const Add = () => {
  // console.log("新增", infoRef.value);
  popBoxTit.value = "新增";
  dialogFormVisible.value = true;
};

// // 修改
const revise = (row: noteInfoUpdate) => {
  // console.log(parent);
  const data = {
    id: row.id,
    type: "basis",
    adsID: row.adsID,
    adsNumber: row.adsNumber,
    group: row.group,
    username: row.group,
    email: row.email,
    password: row.password,
    proxies: row.proxies,
    useragent: row.useragent,
    cookie: row.cookie,
  };
  infoRef.value = data;
  popBoxTit.value = "修改";
  dialogFormVisible.value = true;
};

// // 删除
const delet = async (row: noteInfoDel) => {
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

// ########################################### 操作 end ###########################################

// ########################################### 弹框 ###########################################

const handleClose = () => {
  resetInfo();
};

const save = async () => {
  console.log("准提交数据：", infoRef.value);
  console.log("当前提交行为:", popBoxTit.value);
  dialogFormVisible.value = false;
  loading.value = true;

  try {
    // 修改
    if (popBoxTit.value === "新增") {
      //  新增
      const data = {
        adsID: infoRef.value.adsID,
        adsNumber: infoRef.value.adsNumber,
        group: infoRef.value.group,
        username: infoRef.value.group,
        email: infoRef.value.email,
        password: infoRef.value.password,
        proxies: infoRef.value.proxies,
        useragent: infoRef.value.useragent,
        cookie: infoRef.value.cookie,
      };
      await addGo(data);
    } else {
      if (popBoxTit.value === "修改") {
        const data = {
          id: infoRef.value.id,
          type: "basis",
          adsID: infoRef.value.adsID,
          adsNumber: infoRef.value.adsNumber,
          group: infoRef.value.group,
          username: infoRef.value.group,
          email: infoRef.value.email,
          password: infoRef.value.password,
          proxies: infoRef.value.proxies,
          useragent: infoRef.value.useragent,
          cookie: infoRef.value.cookie,
        };
        await updateGo(data);
      } else {
        const data = {
          group: infoRef.value.group,
        };
        await branchCookieGo(data);
      }
    }
  } catch (error) {
    console.log("出现异常:", error);
  } finally {
    loading.value = false;
    resetInfo();
  }
};

// ########################################### 弹框 end ###########################################

// ########################################### 初始化###########################################
const resetInfo = async () => {
  // 还原初始化

  popBoxTit.value = "";
  dialogFormVisible.value = false;
  infoRef.value = {
    id: "",
    type: "basis",
    group: "all",
    adsNumber: "",
    adsID: "",
    username: "",
    email: "",
    password: "",
    proxies: "127.0.0.1:1234",
    useragent: "",
    cookie: "",
  };

  await initData();
};
// ########################################### 初始化 end ###########################################

// ########################################### 翻页 ###########################################

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
};
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
};
// ########################################### 翻页 end ###########################################
</script>
<template>
  <div class="web-container" v-loading="loading">
    <el-card shadow="never">
      <el-row class="row-bg">
        <el-col :span="2">
          <div class="grid-content ep-bg-purple" />
          <el-button type="primary" plain @click="Add">添加</el-button>
        </el-col>
        <el-col :span="4">
          <div class="grid-content ep-bg-purple" />
          <el-button type="primary" plain @click="batchCookie">
            批量更新cookie
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
              <el-table-column prop="group" label="分组" align="center" />

              <el-table-column
                prop="adsNumber"
                label="ads编号"
                align="center"
              />
              <el-table-column prop="adsID" label="ads ID" align="center" />
              <el-table-column
                prop="proxies"
                label="代理"
                align="center"
                width="200"
                show-overflow-tooltip
              />
              <el-table-column
                prop="username"
                label="note昵称"
                align="center"
              />
              <el-table-column prop="email" label="email" align="center" />
              <el-table-column
                prop="password"
                label="password"
                align="center"
              />
              <el-table-column
                prop="useragent"
                label="useragent"
                align="center"
                width="200"
                show-overflow-tooltip
              />
              <el-table-column
                prop="cookie"
                label="cookie"
                align="center"
                width="240"
                show-overflow-tooltip
              />
              <el-table-column
                prop="create_at"
                label="添加时间"
                align="center"
              />
              <el-table-column
                prop="update_at"
                label="更新时间"
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
                  <el-button type="primary" link @click="renewCookie(row)">
                    更新cookie
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

      <!-- 基础信息 -->
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
              <el-form-item
                v-if="popBoxTit === '修改'"
                label="id"
                class="form_item"
              >
                <span>{{ infoRef.id }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="row-bg flex items-center" :gutter="20">
            <el-col :span="8">
              <el-form-item label="分组" class="form_item">
                <el-input v-model="infoRef.group" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row
            class="row-bg flex items-center"
            :gutter="20"
            v-show="popBoxTit !== '批量更新cookie'"
          >
            <el-col :span="8">
              <el-form-item label="ads编号" class="form_item">
                <el-input v-model="infoRef.adsNumber" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="adsID" class="form_item">
                <el-input v-model="infoRef.adsID" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="代理" class="form_item">
                <el-input
                  v-model="infoRef.proxies"
                  style="width: 225px"
                  :rows="3"
                  type="textarea"
                  placeholder="127.0.0.1:1234"
                  autocomplete="off"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row
            class="row-bg flex items-center"
            :gutter="20"
            v-show="popBoxTit !== '批量更新cookie'"
          >
            <el-col :span="8">
              <el-form-item label="note昵称" class="form_item">
                <el-input v-model="infoRef.username" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="password" class="form_item">
                <el-input v-model="infoRef.password" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row
            class="row-bg flex items-center"
            :gutter="20"
            v-show="popBoxTit !== '批量更新cookie'"
          >
            <el-col :span="12">
              <el-form-item label="useragent" class="form_item">
                <el-input
                  v-model="infoRef.useragent"
                  autocomplete="off"
                  style="width: 80%"
                  :autosize="{ minRows: 4, maxRows: 10 }"
                  type="textarea"
                  placeholder="useragent"
                />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="cookie" class="form_item">
                <el-input
                  v-model="infoRef.cookie"
                  autocomplete="off"
                  style="width: 80%"
                  :autosize="{ minRows: 4, maxRows: 10 }"
                  type="textarea"
                  placeholder="cookie"
                />
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
      <!-- 基础信息 end -->
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
</style>
