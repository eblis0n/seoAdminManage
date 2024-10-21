<!--
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-01-08 15:09:59
 * @LastEditTime: 2024-08-23 13:56:52
-->
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ArrowRight } from "@element-plus/icons-vue";
import {
  industryListGo,
  addIndustryGo,
  updateIndustryGo,
  delIndustryGo,
} from "./industryGroupJS";

// 初始化
const popBoxTit = ref("");
const currentPage = ref(1); // 当前页码
const pageSize = ref(10); // 每页显示的数据数量

// let currentBreadcrumb = ref('');
// let childData = ref<any[]>([]);

const dialogFormKeyword = ref(false);
const dialogFormVisible = ref(false);
// const dialogFormFunctions = ref(false);

const isAdding = ref("industry");
const currentRow = ref("");

const listDatas = ref<any[]>([]);
const keywordList = ref<any[]>([]);

const infoRef = ref<any>({
  id: "",
  genre: "",
  name: "",
  level: "",
});

// 接口相关

const initData = async () => {
  const originalData = await industryListGo(); // 接口原始数据
  // 过滤出 level 为 0 的数据并添加 child 属性
  listDatas.value = originalData
    .filter((item: any) => item.level === 0)
    .map((parent: any) => {
      const child = originalData.filter(
        (child: any) => child.level === parent.id
      );
      return {
        id: parent.id,
        genre: parent.genre,
        name: parent.name,
        level: parent.level,
        create_at: parent.create_at,
        child: child,
      };
    });

  // console.log('listDatas', listDatas.value);
};

onMounted(async () => {
  await initData();
});

const delet = async (row) => {
  console.log("delet", row);
  const data = {
    id: row.id,
    level: row.id,
  };
  await delIndustryGo(data);
  await initData();
};

const clearAll = async (currentRow) => {
  console.log("currentRow", currentRow);
  const data = {
    level: currentRow,
  };
  await delIndustryGo(data);
  await initdd();
};

const delkey = async (row) => {
  console.log("delkey", row);
  const data = {
    id: row.id,
  };
  await delIndustryGo(data);
  await initdd();
};

const reviseIndustry = (row) => {
  dialogFormVisible.value = true;
  popBoxTit.value = "修改行业";
  isAdding.value = "revise";
  infoRef.value = {
    id: row.id,
    genre: row.genre,
    name: row.name,
    level: row.level,
  };
};

const addIndustry = () => {
  dialogFormVisible.value = true;
  popBoxTit.value = "添加行业";
  isAdding.value = "industry";
};

const addkey = (row) => {
  dialogFormVisible.value = true;
  popBoxTit.value = row.name + "添加关键词";
  isAdding.value = "keyword";
  infoRef.value = {
    genre: row.genre,
    name: "",
    level: row.id,
  };
};

const keyword = async (row) => {
  // console.log(row);
  dialogFormKeyword.value = true;
  popBoxTit.value = row.name + "  关键词列表";
  isAdding.value = "keyword";
  currentRow.value = row.id;
  keywordList.value = listDatas.value
    .filter((item) => item.id === row.id)
    .flatMap((item) => item.child);
};

const cancel = async () => {
  await initdd();
};
const save = async () => {
  console.log("当前提交行为:", isAdding.value);
  console.log("准提交数据：", infoRef.value);
  if (isAdding.value === "industry") {
    const data = {
      genre: infoRef.value.genre,
      name: infoRef.value.name,
      level: "0",
    };
    await addIndustryGo(data);
  } else {
    if (isAdding.value === "keyword") {
      const data = {
        genre: infoRef.value.genre,
        name: infoRef.value.name,
        level: infoRef.value.level,
      };
      await addIndustryGo(data);
    } else {
      const data = {
        id: infoRef.value.id,
        genre: infoRef.value.genre,
        name: infoRef.value.name,
        level: infoRef.value.level,
      };
      await updateIndustryGo(data);
    }
  }
  initdd();
};

const initdd = async () => {
  // 还原初始化
  isAdding.value = "industry";

  infoRef.value = {
    id: "",
    genre: "",
    name: "",
    level: "",
  };
  dialogFormVisible.value = false;
  dialogFormKeyword.value = false;
  await initData();
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
      <el-breadcrumb-item>WordPress</el-breadcrumb-item>
      <el-breadcrumb-item>行业分类管理</el-breadcrumb-item>
    </el-breadcrumb>
  </el-row>
  <!--搜索  -->
  <el-row class="row-bg" :gutter="20">
    <el-col :span="2">
      <div class="grid-content ep-bg-purple" />
      <el-button type="primary" plain @click="addIndustry">添加行业</el-button>
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
            prop="genre"
            label="所属分类"
            align="center"
            width="80"
          />
          <el-table-column prop="name" label="行业名称" align="center" />
          <el-table-column prop="frequency" label="使用次数" align="center" />

          <el-table-column
            prop="create_at"
            label="添加时间"
            align="center"
            width="200"
          />
          <el-table-column prop="operate" label="操作" align="center">
            <template #default="{ row }">
              <el-button type="primary" link @click="keyword(row)">
                关键词列表
              </el-button>
              <el-button type="primary" link @click="addkey(row)">
                添加关键词
              </el-button>

              <el-button type="primary" link @click="reviseIndustry(row)">
                修改行业名
              </el-button>
              <el-popconfirm
                title="将会同步删除此行业的关键词"
                @confirm="delet(row)"
              >
                <template #reference>
                  <el-button type="primary" link>删除行业</el-button>
                </template>
              </el-popconfirm>
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
  <!-- 添加行业及关键词 -->
  <el-dialog
    v-model="dialogFormVisible"
    :title="popBoxTit"
    width="1400px"
    top="10px"
    destroy-on-close
  >
    <el-form :model="infoRef" label-width="auto" style="max-width: 1200px">
      <el-row class="row-bg" v-if="isAdding === 'industry'">
        <span>行业，输入框可使用英文[^] 间隔，批量同步入库</span>
      </el-row>
      <!-- id -->
      <el-row class="row-bg" v-show="isAdding === 'revise'">
        <el-col :span="8">
          <el-form-item label="ID" class="form_item">
            <el-input v-model="infoRef.id" autocomplete="off" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="row-bg">
        <el-col :span="8">
          <el-form-item
            label="所属分类"
            class="form_item"
            v-if="isAdding === 'industry' || isAdding === 'revise'"
          >
            <el-input v-model="infoRef.genre" autocomplete="off" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="row-bg">
        <el-col :span="8">
          <el-form-item
            label="行业"
            class="form_item"
            v-if="isAdding === 'industry' || isAdding === 'revise'"
          >
            <!-- <el-input v-model="infoRef.name" autocomplete="off" /> -->
            <el-input
              v-model="infoRef.name"
              autocomplete="off"
              :rows="3"
              type="textarea"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="关键词"
            class="form_item"
            v-if="isAdding === 'keyword'"
          >
            <el-input
              v-model="infoRef.name"
              autocomplete="off"
              :rows="3"
              type="textarea"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 显示关键词列表 -->
  <el-dialog
    v-model="dialogFormKeyword"
    :title="popBoxTit"
    width="1400px"
    top="10px"
    destroy-on-close
  >
    <el-row class="row-bg" :gutter="20">
      <el-col :span="2">
        <div class="grid-content ep-bg-purple" />
        <el-button type="primary" plain @click="clearAll(currentRow)">
          清空all
        </el-button>
      </el-col>
    </el-row>
    <el-row class="row-bg">
      <el-col>
        <el-scrollbar>
          <el-table style="width: 100%" :data="keywordList">
            <el-table-column prop="id" label="ID" align="center" width="50" />
            <el-table-column prop="level" label="所属分组" align="center" />
            <el-table-column prop="name" label="关键词" align="center" />

            <el-table-column
              prop="create_at"
              label="添加时间"
              align="center"
              width="200"
            />
            <el-table-column prop="operate" label="操作" align="center">
              <template #default="{ row }">
                <el-button type="primary" link @click="delkey(row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-scrollbar>
      </el-col>
    </el-row>
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
./wordPressJS.ts
