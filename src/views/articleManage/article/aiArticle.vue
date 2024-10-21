<!--
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-01-08 15:09:59
 * @LastEditTime: 2024-10-09 22:58:04
-->
<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import useClipboard from "vue-clipboard3";
import { ArrowRight, CopyDocument } from "@element-plus/icons-vue";
import {
  aiArticleListGo,
  addGo,
  delGo,
  aiTrainLGo,
  rewriteGo,
  aiArticleRecordingGo,
  wpInstideListGo,
  wpHomeListGo,
} from "./aiArticleJS.js";

const { toClipboard } = useClipboard();
// 初始化
const popBoxTit = ref("");

const currentPage = ref(1); // 当前页码
const pageSize = ref(10); // 每页显示的数据数量

const listDatas = ref<any[]>([]);
const aiTrainData = ref<any[]>([]);
const wpHomeDatas = ref<any[]>([]);
const wpInstideDatas = ref<any[]>([]);

// 状态
const isAdding = ref(true);
const dialogFormVisible = ref(false);
const linkprops = { multiple: true };
const infoRef = ref<any>({
  id: "",
  adsgroup: "",
  prompt: "",
  keyword: "",
  imgage_link: "",
  wichlinks: "0",
  sponsored_link: "",
  language: "",
  trainingid: "",
  trainName: "",
});

// 接口相关
const initData = async () => {
  listDatas.value = await aiArticleListGo();
  aiTrainData.value = await aiTrainLGo();
  const wpHomeListData = await wpHomeListGo();
  wpHomeDatas.value = await processAndFormatData(wpHomeListData);
  const wpInstideListData = await wpInstideListGo();
  wpInstideDatas.value = await processAndFormatData(wpInstideListData);
};

onMounted(async () => {
  await initData();
});
watch(
  () => infoRef.value.wichlinks,
  (_newVal, _oldVal) => {
    infoRef.value.sponsored_link = ""; // 重置为默认值
  }
);

const updateaiTrain = () => {
  const selectedItem = aiTrainData.value.find(
    (item) => item.name === infoRef.value.trainName
  );

  if (selectedItem) {
    infoRef.value.pcurl = selectedItem.address;
  }
};

const processAndFormatData = (rawListData) => {
  const combinedData = {};
  rawListData.forEach((item) => {
    const group = item.group;
    if (!combinedData[group]) {
      combinedData[group] = {
        value: group,
        label: group, // 这里可以改为你想显示的字段，例如 groupName
        children: [],
      };
    }
    combinedData[group].children.push({
      value: item.domain, // 这里可以改为你想用作唯一标识的字段，例如 id
      label: item.domain, // 这里可以改为你想显示的字段
    });
  });
  return Object.values(combinedData);
};

const delet = async (row) => {
  const data = {
    id: row.id,
  };
  await delGo(data);
  await initData();
};

const recording = async () => {
  await aiArticleRecordingGo();
  await initData();
};

const add = () => {
  dialogFormVisible.value = true;
  popBoxTit.value = "添加";
};
const look = (row) => {
  dialogFormVisible.value = true;
  popBoxTit.value = "查看详情";
  isAdding.value = false;

  infoRef.value = {
    id: row.id,
    adsgroup: row.adsgroup,
    prompt: row.prompt,
    keyword: row.keyword,
    imgage_link: row.imgage_link,
    wichlinks: row.wichlinks,
    sponsored_link: row.sponsored_link,
    language: row.language,
    trainingid: row.trainingid,
    trainName: row.trainName,
    title: row.title,
    content_html: row.content_html,
  };
};

const rewrite = async () => {
  const data = {
    id: infoRef.value.id,
    adsgroup: infoRef.value.adsgroup,
    prompt: infoRef.value.prompt,
    keyword: infoRef.value.keyword,
    imgage_link: infoRef.value.imgage_link,
    wichlinks: infoRef.value.wichlinks,
    sponsored_link: infoRef.value.sponsored_link,
    language: infoRef.value.language,
    trainingid: infoRef.value.trainingid,
  };
  await rewriteGo(data);
  await initdd();
};
const cancel = () => {
  initdd();
};

const getLinksString = (linksArray) => {
  if (!Array.isArray(linksArray)) {
    console.error("Invalid argument: an array is expected");
    return linksArray;
  }

  const links = linksArray.map((item) => item[1] || "");
  const linksString = links.join("^");
  return linksString;
};

const save = async () => {
  console.log("准提交数据：", infoRef.value);
  console.log("当前提交行为:", isAdding.value);
  const data = {
    adsgroup: infoRef.value.adsgroup,
    prompt: infoRef.value.prompt,
    keyword: infoRef.value.keyword,
    imgage_link: infoRef.value.imgage_link,
    wichlinks: infoRef.value.wichlinks,
    sponsored_link: getLinksString(infoRef.value.sponsored_link),
    language: infoRef.value.language,
    trainingid: infoRef.value.trainName,
  };
  console.log("data:", data);
  await addGo(data);
  await initdd();
};

// 还原弹框输入
const initdd = async () => {
  // 还原初始化
  isAdding.value = true;

  infoRef.value = {
    id: "",
    adsgroup: "",
    prompt: "",
    keyword: "",
    imgage_link: "",
    wichlinks: "0",
    sponsored_link: "",
    language: "",
    trainingid: "",
  };
  dialogFormVisible.value = false;
  await initData();
};

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
      <el-breadcrumb-item>AI文章</el-breadcrumb-item>
    </el-breadcrumb>
  </el-row>
  <!--搜索  -->
  <el-row class="row-bg" :gutter="20">
    <el-col :span="1">
      <div class="grid-content ep-bg-purple"></div>
      <el-button type="primary" plain @click="add">添加</el-button>
    </el-col>
    <el-col :span="1">
      <div class="grid-content ep-bg-purple"></div>
      <el-button type="primary" plain @click="recording">补录</el-button>
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
            prop="adsgroup"
            label="ads组"
            align="center"
            width="80"
          />
          <el-table-column
            prop="prompt"
            label="主题"
            align="center"
            width="150"
          />
          <el-table-column
            prop="keyword"
            label="关键词"
            align="center"
            width="180"
          />
          <el-table-column
            prop="language"
            label="AI文语言"
            align="center"
            width="80"
          />

          <el-table-column
            prop="trainName"
            label="AI训练名称"
            align="center"
            width="100"
          />
          <el-table-column
            prop="sponsored_link"
            label="推广链接"
            align="center"
            width="200"
          >
            <template #default="{ row }">
              <el-tooltip placement="top">
                <template #content>{{ row.sponsored_link }}</template>
                <div>{{ formatContent(row.sponsored_link) }}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            prop="imgage_link"
            label="图片链接"
            align="center"
            width="200"
          >
            <template #default="{ row }">
              <el-tooltip placement="top">
                <template #content>{{ row.imgage_link }}</template>
                <div>{{ formatContent(row.imgage_link) }}</div>
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column prop="title" label="文章标题" align="center" />

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
    @close="initdd"
    width="1500px"
  >
    <el-form :model="infoRef" label-width="auto" style="max-width: 1200px">
      <el-row class="row-bg">
        <span>
          添加时主题，关键词，推广链接， 图片链接，AI文语言 输入框可使用
          英文[^]快速 批量生成 同一训练语同一组的多篇文章； 如主题：Travel
          Experiences,Adventure Travel
        </span>
      </el-row>
      <!-- id -->
      <el-row class="row-bg">
        <el-col :span="6">
          <el-form-item v-if="!isAdding" label="id" class="form_item">
            <span>{{ infoRef.id }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="row-bg">
        <el-col :span="8">
          <el-form-item label="ads组" class="form_item">
            <el-input v-model="infoRef.adsgroup" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="主题" class="form_item">
            <el-input
              v-model="infoRef.prompt"
              autocomplete="off"
              :rows="3"
              type="textarea"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="关键词" class="form_item">
            <el-input
              v-model="infoRef.keyword"
              autocomplete="off"
              :rows="3"
              type="textarea"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="row-bg">
        <el-col :span="8">
          <el-form-item label="图片链接" class="form_item">
            <el-input
              v-model="infoRef.imgage_link"
              autocomplete="off"
              :rows="3"
              type="textarea"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="推广链接" class="form_item">
            <div class="my-2 flex items-center text-sm">
              <el-radio-group class="ml-4" v-model="infoRef.wichlinks">
                <el-radio id="homge" label="0" size="large">首页</el-radio>
                <el-radio id="inside" label="1" size="large">内页</el-radio>
                <el-radio id="other" label="2" size="large">其他</el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-show="infoRef.wichlinks === '0'">
          <el-form-item label="首页链接" class="form_item">
            <el-cascader
              v-model="infoRef.sponsored_link"
              :props="linkprops"
              :options="wpHomeDatas"
              collapse-tags
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="8" v-show="infoRef.wichlinks === '1'">
          <el-form-item label="内页链接" class="form_item">
            <el-cascader
              v-model="infoRef.sponsored_link"
              :props="linkprops"
              :options="wpInstideDatas"
              collapse-tags
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="8" v-show="infoRef.wichlinks === '2'">
          <el-form-item label="其他推广链接" class="form_item">
            <el-input
              v-model="infoRef.sponsored_link"
              autocomplete="off"
              :rows="3"
              type="textarea"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="row-bg">
        <el-col :span="8">
          <el-form-item label="AI文语言" class="form_item">
            <el-input
              v-model="infoRef.language"
              autocomplete="off"
              :rows="3"
              type="textarea"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="aiTrainData" label="AI训练语">
            <el-select
              v-model="infoRef.trainName"
              @change="updateaiTrain"
              :placeholder="
                typeof infoRef.trainName === 'number'
                  ? infoRef.trainName.toString()
                  : infoRef.trainName || '请选择'
              "
              style="width: 240px"
            >
              <el-option
                v-for="(item, index) in aiTrainData"
                :key="index"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="row-bg">
        <el-col :span="20">
          <el-form-item
            v-if="!isAdding"
            label="标题"
            class="form_item"
            style="width: 1200px"
          >
            <el-button
              type="primary"
              :icon="CopyDocument"
              plain
              @click="copy(infoRef.title)"
            />
            <span style="margin: 10px">{{ infoRef.title }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="row-bg">
        <el-col :span="10">
          <el-form-item
            v-if="!isAdding"
            label="内容"
            class="form_item"
            style="width: 1400px"
          >
            <el-button
              type="primary"
              :icon="CopyDocument"
              plain
              @click="copy(infoRef.content_html)"
            />
            <el-input
              v-model="infoRef.content_html"
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
      <span class="dialog-footer" v-if="!isAdding">
        <el-button type="primary" @click="rewrite">重新生成</el-button>
      </span>
      <span class="dialog-footer" v-if="isAdding">
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
./googleOauthJS
