<!--
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-01-08 15:09:59
 * @LastEditTime: 2024-10-18 21:51:41
-->
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElLoading } from "element-plus";
import type { pcDel, pcUpdate } from "@/types/pc.d.ts";
import { pclist, updateGo, delGo, addGo } from "./PCclientJS";

const currentPage = ref(1); // 当前页码
const pageSize = ref(10); // 每页显示的数据数量
const listDatas = ref<any[]>([]);
// 初始化
const popBoxTit = ref("");
const isAdding = ref(true);

const dialogFormVisible = ref(false);

const infoRef = ref<any>({ id: "", name: "", address: "", state: "0" });
// 接口相关
const initData = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.8)",
  });

  try {
    await new Promise((resolve) => setTimeout(resolve, 3000)); // 模拟5秒延迟
    listDatas.value = await pclist();

    // console.log(listDatas.value); // 打印返回的数据
  } catch (error) {
    console.error("获取数据失败", error); // 捕获错误
  } finally {
    loading.close();
  }
};

onMounted(async () => {
  await initData();
});

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
    name: row.name,
    address: row.address,
    state: row.state.toString(),
  };
  isAdding.value = false;
  infoRef.value = data;
  popBoxTit.value = "修改";
  dialogFormVisible.value = true;
};

const Cancel = () => {
  resetInfo();
};

const save = async () => {
  console.log("准提交数据：", infoRef.value);
  console.log("当前提交行为:", isAdding.value);
  dialogFormVisible.value = false;
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.8)",
  });

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
  } finally {
    loading.close();
    resetInfo();
  }
};

// // 删除
const delet = async (id: pcDel) => {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.8)",
  });
  try {
    await delGo(id);
  } catch (error) {
    console.log("出现异常:", error);
  } finally {
    loading.close();
    resetInfo();
  }
};

// 还原弹框输入
const resetInfo = async () => {
  // 还原初始化
  isAdding.value = true;
  popBoxTit.value = "";
  infoRef.value = { id: "", name: "", address: "", state: "0" };
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
  <div class="pc-container">
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
              <el-table-column prop="name" label="pc名称" align="center" />
              <el-table-column prop="address" label="IP地址" align="center" />
              <el-table-column prop="state" label="状态" align="center" />
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
        width="1200px"
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
