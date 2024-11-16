<!--
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-01-08 15:09:59
 * @LastEditTime: 2024-11-15 13:29:20
-->
<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { bloggerDel, bloggerUpdate } from "@/types/blogger.d.ts";
import { bloggerList, updateGo, delGo, addGo } from "./bloggerJS";

const currentPage = ref(1); // 当前页码
const pageSize = ref(10); // 每页显示的数据数量

const listDatas = ref<any[]>([]);

// 初始化
const popBoxTit = ref("");
const loading = ref(false);

const dialogFormVisible = ref(false);

const infoRef = ref<any>({
  id: "",
  group: "",
  adsNumber: "",
  adsID: "",
  proxy: '{"http":"154.212.253.218:5132","https":"154.212.253.218:5132"}',
  bloggerID: "",
});

// 接口相关
const initData = async () => {
  loading.value = true;
  try {
    const [listData] = await Promise.all([bloggerList()]);
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

// // 添加
const Add = () => {
  // console.log("新增", infoRef.value);
  popBoxTit.value = "新增";
  dialogFormVisible.value = true;
};

// // 修改
const revise = (row: bloggerUpdate) => {
  // console.log(parent);
  const data = {
    id: row.id,
    adsID: row.adsID,
    adsNumber: row.adsNumber,
    group: row.group,
    proxy: row.proxy,
    bloggerID: row.bloggerID,
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
        adsID: infoRef.value.adsID,
        adsNumber: infoRef.value.adsNumber,
        group: infoRef.value.group,
        proxy: infoRef.value.proxy,
        bloggerID: infoRef.value.bloggerID,
      };
      await updateGo(data);
    } else {
      //  新增
      const data = {
        adsID: infoRef.value.adsID,
        adsNumber: infoRef.value.adsNumber,
        group: infoRef.value.group,
        proxy: infoRef.value.proxy,
        bloggerID: infoRef.value.bloggerID,
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
const delet = async (row: bloggerDel) => {
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
const handleClose = () => {
  resetInfo();
};

// 还原弹框输入
const resetInfo = async () => {
  // 还原初始化
  popBoxTit.value = "";
  infoRef.value = {
    id: "",
    group: "",
    adsNumber: "",
    adsID: "",
    proxy: '{"http":"154.212.253.218:5132","https":"154.212.253.218:5132"}',
    bloggerID: "",
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
  <div class="web-container" v-loading="loading">
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
              <el-table-column prop="group" label="分组" align="center" />

              <el-table-column
                prop="adsNumber"
                label="ads编号"
                align="center"
              />
              <el-table-column prop="adsID" label="ads ID" align="center" />
              <el-table-column prop="proxy" label="代理" align="center" />
              <el-table-column
                prop="bloggerID"
                label="bloggerID"
                align="center"
              />
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
                  <el-button type="primary" link @click="delet(row)">
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
          </el-row>

          <el-row class="row-bg flex items-center" :gutter="20">
            <el-col :span="8">
              <el-form-item label="代理" class="form_item">
                <el-input
                  v-model="infoRef.proxy"
                  style="width: 225px"
                  :rows="3"
                  type="textarea"
                  placeholder="{'http':xxxxx:xxxx,'https':xxxxx:xxxx}"
                  autocomplete="off"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="bloggerID" class="form_item">
                <el-input v-model="infoRef.bloggerID" autocomplete="off" />
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
