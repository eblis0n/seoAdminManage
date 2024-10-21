<!--
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-01-08 15:09:59
 * @LastEditTime: 2024-10-11 14:20:14
-->
<script setup lang="ts">
import { ref, onMounted } from "vue";

import { pclist, updateGo, delGo, addGo } from "./PCclientJS";

const infoRef = ref<any>(source()); // template 里必须绑定的是 infoRef 不能是 info !!
let info = infoRef.value;
function source() {
  return {
    id: "",
    name: "",
    address: "",
    state: "0",
  };
}
const currentPage = ref(1); // 当前页码
const pageSize = ref(10); // 每页显示的数据数量
const listDatas = ref<any[]>([]);

const isAdding = ref(true);

const dialogFormVisible = ref(false);

let popBoxTit = "添加";

const initData = async () => {
  // 模拟异步请求数据
  await new Promise((resolve) => setTimeout(resolve, 0));

  listDatas.value = await pclist();
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
    name: row.name,
    address: row.address,
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
        name: infoRef.value.name,
        address: infoRef.value.address,
        state: infoRef.value.state,
      };
      await updateGo(data);
    } else {
      //  新增
      const data = {
        address: infoRef.value.address,
        name: infoRef.value.name,
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

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
};
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
};
</script>
<template>
  <el-row class="row-bg">
    <el-col :span="1">
      <div class="grid-content ep-bg-purple"></div>
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
          <el-table-column prop="name" label="pc名称" align="center" />
          <el-table-column prop="address" label="IP地址" align="center" />
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
    width="400px"
  >
    <el-form :model="infoRef">
      <el-form-item v-if="!isAdding" label="id" class="form_item">
        <span>{{ infoRef.id }}</span>
      </el-form-item>
      <el-form-item label="pc名称" class="form_item">
        <el-input v-model="infoRef.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="IP地址" class="form_item">
        <el-input v-model="infoRef.address" autocomplete="off" />
      </el-form-item>
      <el-form-item v-if="!isAdding" class="form_item" label="状态">
        <div class="my-2 flex items-center text-sm">
          <el-radio-group v-model="infoRef.state" class="ml-4">
            <el-radio label="0" size="large">可用</el-radio>
            <el-radio label="1" size="large">禁用</el-radio>
          </el-radio-group>
        </div>
      </el-form-item>
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
./PCclientJS
