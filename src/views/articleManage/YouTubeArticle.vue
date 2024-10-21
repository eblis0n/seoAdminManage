<!--
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-01-08 15:09:59
 * @LastEditTime: 2024-09-13 22:10:15
-->
<script setup lang="ts">
import { ref, onMounted } from "vue";
import useClipboard from "vue-clipboard3";
import { ArrowRight, CopyDocument } from "@element-plus/icons-vue";
import { articleListGo, articleDelGo } from "./YouTubeChannelJS";

const { toClipboard } = useClipboard();
// 初始化
const popBoxTit = ref("");

const currentPage = ref(1); // 当前页码
const pageSize = ref(10); // 每页显示的数据数量

const listDatas = ref<any[]>([]);

// 状态
const isAdding = ref("add");
const dialogFormVisible = ref(false);
// const dialogFormSubtitle = ref(false);

const infoRef = ref<any>({
  id: "",
  name: "",
  play_list_name: "",
  title: "",
  content: "",
  state: "",
});

// 接口相关
const initData = async () => {
  listDatas.value = await articleListGo();
};

onMounted(async () => {
  await initData();
});

// 复制
const copy = async (textToCopy) => {
  try {
    await toClipboard(textToCopy);
    console.log("Copied to clipboard");
  } catch (e) {
    console.error(e);
  }
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

const delet = async (row) => {
  const data = {
    id: row.id,
    name: row.name,
  };
  await articleDelGo(data);
  await initData();
};

// const subtitle = () => {
//   dialogFormSubtitle.value = true;
//   popBoxTit.value = '提取字幕';
//   isAdding.value = 'subtitle';
// };

// const add = () => {
//   dialogFormVisible.value = true;
//   popBoxTit.value = '添加';
//   isAdding.value = 'add';
// };

const look = (row) => {
  dialogFormVisible.value = true;
  popBoxTit.value = row.title + "详情";
  isAdding.value = "revise";
  infoRef.value = {
    id: row.id,
    name: row.name,
    play_list_name: row.play_list_name,
    title: row.title,
    content: row.content,
    state: row.state,
  };
};

const cancel = () => {
  initdd();
};

// const subtitlesave = async () => {
//   console.log('准提交数据：', subtitleRef.value);
//   console.log('当前提交行为:', isAdding.value);
//   const data = {
//     user: subtitleRef.value.user,
//     channel: subtitleRef.value.channel,
//     sort: subtitleRef.value.sort,
//   };

//   await subtitleGo(data);
// };

// const save = async () => {
//   console.log('准提交数据：', infoRef.value);
//   console.log('当前提交行为:', isAdding.value);
//   if (isAdding.value === 'add') {
//     const data = {
//       user: infoRef.value.user,
//       channel: infoRef.value.channel,
//       sort: infoRef.value.sort,
//     };

//     await addGo(data);
//   } else {
//     const data = {
//       id: infoRef.value.id,
//       user: infoRef.value.user,
//       channel: infoRef.value.channel,
//       sort: infoRef.value.sort,
//     };
//     await updateGo(data);
//   }

//   await initdd();
// };

// // 还原弹框输入
const initdd = async () => {
  // 还原初始化
  isAdding.value = "add";

  infoRef.value = {
    id: "",
    name: "",
    title: "",
    content: "",
    state: "",
  };
  dialogFormVisible.value = false;

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
      <el-breadcrumb-item>AI库</el-breadcrumb-item>
      <el-breadcrumb-item>YouTube文章</el-breadcrumb-item>
    </el-breadcrumb>
  </el-row>
  <!--搜索  -->
  <!-- <el-row class="row-bg" :gutter="20">
    <el-col :span="1">
      <div class="grid-content ep-bg-purple" />
      <el-button type="primary" plain @click="add">添加</el-button>
    </el-col>
    <el-col :span="2">
      <div class="grid-content ep-bg-purple" />
      <el-button type="primary" plain @click="subtitle">提取字幕</el-button>
    </el-col>
  </el-row> -->
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
            prop="name"
            label="频道"
            align="center"
            width="200"
          />
          <el-table-column
            prop="play_list_name"
            label="播放列表"
            align="center"
            width="200"
          />
          <el-table-column
            prop="title"
            label="文章名称"
            align="center"
            width="300"
          />
          <el-table-column prop="content" label="文章内容" align="center">
            <template #default="{ row }">
              <div>{{ formatContent(row.content) }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="state" label="是否已发布" align="center" />
          <el-table-column prop="create_at" label="添加时间" align="center" />

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
    width="1500px"
    top="10px"
    destroy-on-close
  >
    <el-form :model="infoRef" label-width="auto" style="max-width: 1200px">
      <!-- <el-row class="row-bg">
        <span>博主id，输入框可使用英文[^] 间隔，批量同步入库</span>
      </el-row> -->
      <!-- id -->
      <el-row class="row-bg" v-show="isAdding !== 'add'">
        <el-col :span="8">
          <el-form-item label="ID" class="form_item">
            <el-input v-model="infoRef.id" autocomplete="off" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="row-bg">
        <el-col :span="8">
          <el-form-item label="所属表名" class="form_item">
            <el-input v-model="infoRef.name" autocomplete="off" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="所属播放列表" class="form_item">
            <el-input
              v-model="infoRef.play_list_name"
              autocomplete="off"
              disabled
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="row-bg">
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
    <!-- <template #footer>
      <span class="dialog-footer" v-if="isAdding === 'add'">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </span>
    </template> -->
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
./YouTubeChannelJS
