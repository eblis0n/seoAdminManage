<!--
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-01-08 15:09:59
 * @LastEditTime: 2024-09-02 14:41:29
-->
<script setup lang="ts">
import { ref, onMounted } from "vue";
import useClipboard from "vue-clipboard3";
import { ArrowRight, CopyDocument } from "@element-plus/icons-vue";
import { listGo, addGo, delGo } from "./noteArticleJS";

const { toClipboard } = useClipboard();
// 初始化
const popBoxTit = ref("");

const currentPage = ref(1); // 当前页码
const pageSize = ref(10); // 每页显示的数据数量

const listDatas = ref<any[]>([]);

// 状态
const isAdding = ref("add");
const dialogFormVisible = ref(false);

const infoRef = ref<any>({
  id: "",
  noteuser: "",
  title: "",
  content: "",
  url: "",
  cookie: "",
  quantity: 1,
  trade: "note",
});

// 接口相关
const initData = async () => {
  listDatas.value = await listGo();
};

onMounted(async () => {
  await initData();
});

const delet = async (row) => {
  const data = {
    id: row.id,
  };
  await delGo(data);
  await initData();
};

const filteredListDatas = computed(() => {
  if (!infoRef.value.noteuser) {
    initData(); // 初始化列表数据
    return listDatas.value;
  }
  // 如果输入了用户名，过滤数据
  return listDatas.value.filter((item) =>
    item.noteuser.includes(infoRef.value.noteuser)
  );
});

const select = () => {
  console.log("infoRef.value.noteuser", infoRef.value.noteuser);
  listDatas.value = filteredListDatas.value;
};

const add = () => {
  dialogFormVisible.value = true;
  isAdding.value = "add";
  popBoxTit.value = "添加";
  infoRef.value = {
    noteuser: "",
    quantity: 1,
    trade: "note",
  };
};
const look = (row) => {
  dialogFormVisible.value = true;
  popBoxTit.value = "查看详情";
  isAdding.value = "look";

  infoRef.value = {
    id: row.id,
    noteuser: row.noteuser,
    title: row.title,
    content: row.content,
    url: row.url,
  };
};

const cancel = () => {
  initdd();
};

const save = async () => {
  console.log("准提交数据：", infoRef.value);
  console.log("当前提交行为:", isAdding.value);
  const data = {
    noteuser: infoRef.value.noteuser,
    quantity: infoRef.value.quantity,
    trade: infoRef.value.trade,
  };
  // console.log('data:', data);
  await addGo(data);

  await initdd();
};

// 还原弹框输入
const initdd = async () => {
  // 还原初始化
  isAdding.value = "add";
  infoRef.value = {
    id: "",
    noteuser: "",
    title: "",
    content: "",
    url: "",
    quantity: 1,
    trade: "note",
  };
  dialogFormVisible.value = false;
  await initData();
};

// 格式化列内容函数
const formatContent = (content: string) => {
  // 设置最大显示长度
  const maxLength = 100;
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

// 复制
const copy = async (textToCopy) => {
  try {
    await toClipboard(textToCopy);
    console.log("Copied to clipboard");
  } catch (e) {
    console.error(e);
  }
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
      <el-breadcrumb-item>AI库</el-breadcrumb-item>
      <el-breadcrumb-item>Note文章</el-breadcrumb-item>
    </el-breadcrumb>
  </el-row>
  <!--搜索  -->
  <el-row class="row-bg" :gutter="20">
    <el-col :span="6">
      <div class="grid-content ep-bg-purple" />
      <div style="display: flex; align-items: center">
        <span style="margin-right: 10px">用户名:</span>
        <el-input
          v-model="infoRef.noteuser"
          placeholder="请输入用户名"
          clearable
        />
      </div>
    </el-col>
    <el-col :span="1">
      <div class="grid-content ep-bg-purple" />
      <el-button type="primary" plain @click="select">查询</el-button>
    </el-col>
    <el-col :span="1">
      <div class="grid-content ep-bg-purple" />
      <el-button type="primary" plain @click="add">添加</el-button>
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
            prop="noteuser"
            label="Note用户名"
            align="center"
            width="120"
          />
          <el-table-column
            prop="keyword"
            label="关键词"
            align="center"
            width="120"
          />

          <el-table-column
            prop="title"
            label="文章标题"
            width="500"
            align="center"
          />
          <el-table-column
            prop="content"
            label="文章内容"
            width="300"
            align="center"
          >
            <template #default="{ row }">
              <div>{{ formatContent(row.content) }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="url" label="Note帖子链接" align="center">
            <template #default="{ row }">
              <el-tooltip placement="top">
                <template #content>{{ row.url }}</template>
                <div>{{ formatContent(row.url) }}</div>
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column prop="create_at" label="添加时间" align="center" />
          <el-table-column prop="update_at" label="更新时间" align="center" />
          <el-table-column prop="operate" label="操作" align="center">
            <template #default="{ row }">
              <el-button type="primary" link @click="look(row)">查看</el-button>
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

  <!-- 弹框 添加/修改 -->
  <el-dialog
    v-model="dialogFormVisible"
    :title="popBoxTit"
    destroy-on-close
    width="1500px"
  >
    <el-form :model="infoRef" label-width="auto" style="max-width: 1200px">
      <el-row class="row-bg">
        <span>note用户名输入框可使用 英文[^]，批量生成 随机的用户帖子文章</span>
      </el-row>
      <!-- id -->
      <el-row class="row-bg">
        <el-col :span="6">
          <el-form-item v-if="isAdding !== 'add'" label="id" class="form_item">
            <span>{{ infoRef.id }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="row-bg">
        <el-col :span="8">
          <el-form-item label="note用户名" class="form_item">
            <el-input
              v-model="infoRef.noteuser"
              autocomplete="off"
              :rows="3"
              type="textarea"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="关键词分组" class="form_item">
            <el-input v-model="infoRef.trade" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="生成文章数量"
            class="form_item"
            v-if="isAdding === 'add'"
          >
            <el-input v-model="infoRef.quantity" autocomplete="off" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="row-bg" v-show="isAdding !== 'add'">
        <el-col :span="8">
          <el-form-item
            label="Note帖子链接"
            class="form_item"
            style="width: 400"
            v-if="isAdding !== 'add'"
          >
            <el-input v-model="infoRef.url" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item
            v-if="isAdding !== 'add'"
            label="标题"
            class="form_item"
            style="width: 1200px"
          >
            <el-button
              type="primary"
              :icon="CopyDocument"
              plain
              @click="copy(infoRef.title)"
            ></el-button>
            <!-- <span style="margin: 10px">{{ infoRef.title }}</span> -->
            <el-input
              style="margin: 10px; width: 80%"
              v-model="infoRef.title"
              autocomplete="off"
              disabled
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="row-bg">
        <el-col :span="10">
          <el-form-item
            v-if="isAdding !== 'add'"
            label="内容"
            class="form_item"
            style="width: 1400px"
          >
            <el-button
              type="primary"
              :icon="CopyDocument"
              plain
              @click="copy(infoRef.content)"
            ></el-button>
            <el-input
              v-model="infoRef.content"
              :rows="20"
              type="textarea"
              placeholder="Please input"
              disabled
              style="margin: 10px"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer" v-if="isAdding === 'add'">
        <el-button @click="cancel">取消</el-button>
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
