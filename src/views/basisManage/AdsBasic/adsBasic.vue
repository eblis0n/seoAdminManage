<!--
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-01-08 15:09:59
 * @LastEditTime: 2024-07-30 21:43:07
-->
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ArrowRight } from "@element-plus/icons-vue";
import {
  adsListGo,
  updateGo,
  delGo,
  addGo,
  selectGo,
  groupGo,
} from "./adsBasicJS";

const infoRef = ref<any>(source()); // template 里必须绑定的是 infoRef 不能是 info !!
let info = infoRef.value;
function source() {
  return {
    id: "",
    adsgroupid: "",
    groupName: "",
    adsid: "",
    adsuser: "",
    twuser: "",
    twpassword: "",
    token: "",
    twmail: "",
    emailpwd: "",
    auth_token: "",
    twcookie: "",
    state: "0",
  };
}
const selectData = ref<any>({
  adsID: "",
  adsuser: "",
  adsgroupid: "",
});
const currentPage = ref(1); // 当前页码
const pageSize = ref(10); // 每页显示的数据数量
const listDatas = ref<any[]>([]);
const grounpLD = ref<any[]>([]);

const isAdding = ref(true);

const dialogFormVisible = ref(false);

let popBoxTit = "添加";

const initData = async () => {
  // 模拟异步请求数据
  await new Promise((resolve) => setTimeout(resolve, 0));

  listDatas.value = await adsListGo();

  grounpLD.value = await groupGo();
  console.log("grounpLD.value", grounpLD.value);
};

onMounted(async () => {
  await initData();
});

// 添加
function Add() {
  console.log("新增", infoRef.value);
  dialogFormVisible.value = true;
}

// 修改
function revise(row) {
  // console.log(parent);
  const data = {
    id: row.id,
    adsgroupid: row.adsgroupid,
    groupName: row.groupName,
    adsid: row.adsid,
    adsuser: row.adsuser,
    twuser: row.twuser,
    twpassword: row.twpassword,
    token: row.token,
    twmail: row.twmail,
    emailpwd: row.emailpwd,
    auth_token: row.auth_token,
    twcookie: row.twcookie,
    state: row.state.toString(),
  };
  isAdding.value = false;
  infoRef.value = data;
  popBoxTit = "修改";
  dialogFormVisible.value = true;
}

function Cancel() {
  isAdding.value = true;
  popBoxTit = "添加";
  // 这样需要重置整个响应式对象就不需要 Object.assign和考虑深拷贝问题了
  infoRef.value = source();
  // 重新初始化整个响应式对象时，用来数据操作的实际变量也需要重新赋值！
  info = infoRef.value;
  dialogFormVisible.value = false;
}

async function save() {
  console.log("准提交数据：", infoRef.value);
  console.log("当前提交行为:", isAdding.value);
  try {
    // 修改
    if (isAdding.value === false) {
      const data = {
        id: infoRef.value.id,
        adsgroupid: infoRef.value.adsgroupid,
        groupName: infoRef.value.groupName,
        adsid: infoRef.value.adsid,
        adsuser: infoRef.value.adsuser,
        twuser: infoRef.value.twuser,
        twpassword: infoRef.value.twpassword,
        token: infoRef.value.token,
        twmail: infoRef.value.twmail,
        emailpwd: infoRef.value.emailpwd,
        auth_token: infoRef.value.auth_token,
        twcookie: infoRef.value.twcookie,
        state: infoRef.value.state,
      };
      await updateGo(data);
    } else {
      //  新增
      const data = {
        adsgroupid: infoRef.value.adsgroupid,
        groupName: infoRef.value.groupName,
        adsid: infoRef.value.adsid,
        adsuser: infoRef.value.adsuser,
        twuser: infoRef.value.twuser,
        twpassword: infoRef.value.twpassword,
        token: infoRef.value.token,
        twmail: infoRef.value.twmail,
        emailpwd: infoRef.value.emailpwd,
        auth_token: infoRef.value.auth_token,
        twcookie: infoRef.value.twcookie,
        state: infoRef.value.state,
      };
      await addGo(data);
    }
  } catch (error) {
    console.log("出现异常:", error);
  }

  // 还原初始值
  isAdding.value = true;
  popBoxTit = "添加";
  infoRef.value = source();
  info = infoRef.value;
  dialogFormVisible.value = false;
  await initData();
}

// 删除
async function delet(id) {
  try {
    const data = {
      id: id,
    };
    await delGo(data);
  } catch (error) {
    console.log("出现异常:", error);
  }
  await initData();
  dialogFormVisible.value = false;
}

async function Select() {
  try {
    const data = {
      adsid: selectData.value.adsID,
      adsuser: selectData.value.adsuser,
      groupid: selectData.value.adsgroupid,
    };
    listDatas.value = await selectGo(data);
  } catch (error) {
    console.log("出现异常:", error);
    await initData();
  }
}
// 格式化列内容函数
const formatContent = (content: string) => {
  // 设置最大显示长度
  const maxLength = 30;
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

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
};
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
};
</script>
<template>
  <el-row class="row-bg">
    <el-breadcrumb :separator-icon="ArrowRight" class="breadcrumb-box">
      <el-breadcrumb-item>ADS管理</el-breadcrumb-item>
      <el-breadcrumb-item>账号管理</el-breadcrumb-item>
    </el-breadcrumb>
  </el-row>
  <el-row class="row-bg">
    <el-col :span="6">
      <div class="grid-content ep-bg-purple" />
      <div style="display: flex; align-items: center">
        <span style="margin-right: 10px">adsID:</span>
        <el-input
          v-model="selectData.adsID"
          placeholder="请输入adsid"
          clearable
        />
      </div>
    </el-col>
    <el-col :span="6">
      <div class="grid-content ep-bg-purple" />
      <div style="display: flex; align-items: center">
        <span style="margin-right: 10px">ads账号:</span>
        <el-input
          v-model="selectData.adsuser"
          placeholder="请输入ads账号"
          clearable
        />
      </div>
    </el-col>
    <el-col :span="6">
      <div class="grid-content ep-bg-purple" />
      <div style="display: flex; align-items: center">
        <span>分组：</span>
        <el-select
          v-model="selectData.adsgroupid"
          clearable
          placeholder="Select"
          style="width: 240px"
        >
          <el-option
            v-for="(item, index) in grounpLD"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </div>
    </el-col>

    <el-col :span="1">
      <div class="grid-content ep-bg-purple" />
      <el-button type="primary" plain @click="Select">查询</el-button>
    </el-col>
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
          <el-table-column prop="groupName" label="分组" align="center" />
          <el-table-column prop="adsid" label="adsID" align="center" />
          <el-table-column prop="adsuser" label="ads账号" align="center" />
          <el-table-column prop="twuser" label="推特账号" align="center" />
          <el-table-column prop="twpassword" label="推特密码" align="center" />
          <el-table-column prop="token" label="token" align="center">
            <template #default="{ row }">
              <el-tooltip placement="top">
                <template #content>{{ row.token }}</template>
                <div>{{ formatContent(row.token) }}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="twmail" label="推特email" align="center" />
          <el-table-column
            prop="emailpwd"
            label="推特邮箱密码"
            align="center"
          />
          <el-table-column prop="auth_token" label="auth_token" align="center">
            <template #default="{ row }">
              <el-tooltip placement="top">
                <template #content>{{ row.auth_token }}</template>
                <div>{{ formatContent(row.auth_token) }}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="twcookie" label="推特cookie" align="center">
            <template #default="{ row }">
              <el-tooltip placement="top">
                <template #content>{{ row.twcookie }}</template>
                <div>{{ formatContent(row.twcookie) }}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="state" label="状态" align="center" />
          <el-table-column prop="create_at" label="添加时间" align="center" />
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
    :show-close="false"
    :title="popBoxTit"
    width="1500px"
  >
    <el-form :model="infoRef">
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item v-if="!isAdding" label="id" class="form_item">
            <span>{{ infoRef.id }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="分组">
            <el-select
              v-model="infoRef.adsgroupid"
              clearable
              :placeholder="infoRef.adsgroupid"
              style="width: 240px"
            >
              <el-option
                v-for="(item, index) in grounpLD"
                :key="index"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="adsID" class="form_item">
            <el-input v-model="infoRef.adsid" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="ads账号" class="form_item">
            <el-input v-model="infoRef.adsuser" autocomplete="off" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="推特账号" class="form_item">
            <el-input v-model="infoRef.twuser" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="推特密码" class="form_item">
            <el-input v-model="infoRef.twpassword" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="推特email" class="form_item">
            <el-input v-model="infoRef.twmail" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="email密码" class="form_item">
            <el-input v-model="infoRef.emailpwd" autocomplete="off" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="token" class="form_item">
            <el-input v-model="infoRef.token" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="auth_token" class="form_item">
            <el-input v-model="infoRef.auth_token" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="cookie" class="form_item">
            <el-input
              v-model="infoRef.twcookie"
              autocomplete="off"
              :autosize="{ minRows: 2, maxRows: 10 }"
              type="textarea"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item v-if="!isAdding" class="form_item" label="状态">
            <div class="my-2 flex items-center text-sm">
              <el-radio-group v-model="infoRef.state" class="ml-4">
                <el-radio label="0" size="large">可用</el-radio>
                <el-radio label="1" size="large">禁用</el-radio>
              </el-radio-group>
            </div>
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
