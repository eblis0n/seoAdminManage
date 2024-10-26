<!--
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-01-08 15:09:59
 * @LastEditTime: 2024-10-25 22:50:59
-->
<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { pcDel, pcUpdate } from "@/types/pc.d.ts";
import { pclist, updateGo, delGo, addGo } from "./PCclientJS";

import { useSupportedPlatformsHook } from "@/store/modules/public";
const supportedPlatformsStore = useSupportedPlatformsHook();

const currentPage = ref(1); // 当前页码
const pageSize = ref(10); // 每页显示的数据数量

const listDatas = ref<any[]>([]);
const platforOptions = ref<any[]>([]);

// 初始化
const popBoxTit = ref("");
const loading = ref(false);

const dialogFormVisible = ref(false);

const infoRef = ref<any>({
  id: "",
  group: "0",
  name: "",
  address: "",
  account: "",
  password: "",
  platform: "",
  state: "0",
  remark: "",
});

// 定义一个类型来表示可能的 genre 值
type Group = "0" | "1";

// 定义 genreMap 的类型
const groupMap: Record<Group, string> = {
  "0": "本地",
  "1": "服务器",
};

// 接口相关
const initData = async () => {
  loading.value = true;
  try {
    const [listData, _] = await Promise.all([
      pclist(),
      supportedPlatformsStore.fetchSupportedPlatforms(),
    ]);
    listDatas.value = listData;
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

const formatGroup = (row: { group: Group }): string => {
  return groupMap[row.group] || "未知";
};

// // 添加
const Add = () => {
  // console.log("新增", infoRef.value);
  popBoxTit.value = "新增";
  dialogFormVisible.value = true;
};

// // 修改
const revise = (row: pcUpdate) => {
  // console.log(parent);
  const data = {
    id: row.id,
    group: row.group.toString(),
    name: row.name,
    address: row.address,
    account: row.account,
    password: row.password,
    platform: row.platform,
    state: row.state.toString(),
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
    if (popBoxTit.value === "修改") {
      const data = {
        id: infoRef.value.id,
        group: infoRef.value.group,
        name: infoRef.value.name,
        address: infoRef.value.address,
        account: infoRef.value.account,
        password: infoRef.value.password,
        platform: infoRef.value.platform,
        state: infoRef.value.state,
        remark: infoRef.value.remark,
      };
      await updateGo(data);
    } else {
      //  新增
      const data = {
        group: infoRef.value.group,
        name: infoRef.value.name,
        address: infoRef.value.address,
        account: infoRef.value.account,
        password: infoRef.value.password,
        platform: infoRef.value.platform,
        remark: infoRef.value.remark,
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
const delet = async (id: pcDel) => {
  loading.value = true;
  try {
    await delGo(id);
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
    group: "0",
    name: "",
    address: "",
    account: "",
    password: "",
    platform: "",
    state: "0",
    remark: "",
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
  <div class="pc-container" v-loading="loading">
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
              <el-table-column
                prop="group"
                label="分组"
                align="center"
                :formatter="formatGroup"
              />
              <el-table-column prop="name" label="pc名称" align="center" />
              <el-table-column prop="address" label="IP地址" align="center" />
              <el-table-column prop="account" label="账号" align="center" />
              <el-table-column prop="password" label="密码" align="center" />
              <el-table-column prop="platform" label="用途" align="center" />
              <el-table-column prop="state" label="状态" align="center" />
              <el-table-column prop="remark" label="备注" align="center" />
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
                  <el-button type="primary" link @click="delet(row.id)">
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
        width="1400px"
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
            <el-col :span="8">
              <el-form-item
                class="form_item"
                v-if="popBoxTit === '修改'"
                label="状态"
              >
                <div class="flex items-center">
                  <el-radio-group v-model="infoRef.state" class="ml-4">
                    <el-radio label="0" size="large">可用</el-radio>
                    <el-radio label="1" size="large">禁用</el-radio>
                  </el-radio-group>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="row-bg flex items-center" :gutter="20">
            <el-col :span="5">
              <el-form-item class="form_item flex items-center" label="分组">
                <div class="flex items-center">
                  <el-radio-group v-model="infoRef.group" class="ml-4">
                    <el-radio label="0" size="large">本地</el-radio>
                    <el-radio label="1" size="large">服务器</el-radio>
                  </el-radio-group>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="pc名称" class="form_item">
                <el-input v-model="infoRef.name" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="IP地址" class="form_item">
                <el-input v-model="infoRef.address" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="row-bg flex items-center" :gutter="20">
            <el-col :span="8">
              <el-form-item label="账号" class="form_item">
                <el-input v-model="infoRef.account" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="密码" class="form_item">
                <el-input v-model="infoRef.password" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item class="form_item" label="投放平台">
                <div class="my-2 flex items-center text-sm">
                  <el-select
                    v-model="infoRef.platform"
                    placeholder="用途"
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
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.pc-container {
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
./PCclientJS
