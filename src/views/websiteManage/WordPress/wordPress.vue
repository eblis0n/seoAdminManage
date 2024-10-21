<!--
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-01-08 15:09:59
 * @LastEditTime: 2024-09-13 22:07:30
-->
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ArrowRight } from "@element-plus/icons-vue";
import {
  wpDirectoryListGo,
  postInsideArticleGo,
  postStocksArticleGo,
  batchPostInsideArticleGo,
  addWpDirectoryGo,
  delOautGo,
  updateOautGo,
  buildWebsiteGo,
  insertAuthorGo,
  pushYouTubeGo,
} from "./wordPressJS";

import functionsMD from "./functionsMD.vue";

// 初始化
const popBoxTit = ref("");
const currentPage = ref(1); // 当前页码
const pageSize = ref(10); // 每页显示的数据数量

const dialogFormVisible = ref(false);
const dialogFormBuild = ref(false);
const dialogFormFunctions = ref(false);
const dialogFormYoutube = ref(false);

const isAdding = ref("add");

const listDatas = ref<any[]>([]);

const aiArticleRef = ref<any>({
  table_category_mapping: "",
  limitNum: "1",
  group: "",
  domain: "",
  wp_user: "",
  wp_password: "",
  wp_email: "",
  id: "",
  prompt: "",
  strongPoints: "",
  isLocalpPwd: "1",
});

const youtubeArticleRef = ref<any>({
  domain: "",
  wp_user: "",
  wp_password: "",
  channelName: "",
  columnsName: "",
  wpcategory: "",
});

const buildWebsiteRef = ref<any>({
  domain: "",
  description: "",
  blog_title: "",
  isdesignation: "1",
  designationMenu: "",
  group: "",
});
// 接口相关
const initData = async () => {
  listDatas.value = await wpDirectoryListGo();
};

onMounted(async () => {
  await initData();
});

const buildWebsite = () => {
  dialogFormBuild.value = true;
  popBoxTit.value = "新建网站";
  isAdding.value = "build";
};

const add = () => {
  dialogFormVisible.value = true;
  popBoxTit.value = "补充wp目录配置";
  isAdding.value = "add";

  aiArticleRef.value = {
    table_category_mapping: "",
    domain: "",
    wp_user: "",
    wp_password: "",
    wp_email: "",
    group: "",
  };
};

const delet = async (row) => {
  const data = {
    id: row.id,
  };
  await delOautGo(data);
  await initData();
};

const revise = (row) => {
  dialogFormVisible.value = true;
  popBoxTit.value = "修改wp目录配置";
  isAdding.value = "revise";
  aiArticleRef.value = {
    id: row.id,
    isLocalpPwd: "1",
    group: row.group,
    table_category_mapping: row.table_category_mapping,
    domain: row.domain,
    wp_user: row.wp_user,
    wp_password: row.wp_password,
    wp_email: row.wp_email,
  };
};

const newAuthor = (row) => {
  dialogFormVisible.value = true;
  popBoxTit.value = "新增作者";
  isAdding.value = "author";
  aiArticleRef.value = {
    id: row.id,
    domain: row.domain,
    wp_user: "",
    wp_password: "",
    wp_email: "",
  };
};
const functionsShow = () => {
  dialogFormFunctions.value = true;
};
// 旅游文章
const postInsideArticle = async (row) => {
  const data = {
    table_category_mapping: row.table_category_mapping,
    limitNum: "1",
    domain: row.domain,
    wp_user: row.wp_user,
    wp_password: row.wp_password,
  };
  await postInsideArticleGo(data);
  await aiArticle_initdd();
  await initData();
};

// 批量发旅游文章
const batchPostsInsideArticle = () => {
  dialogFormVisible.value = true;
  isAdding.value = "batch";
  popBoxTit.value = "批量发旅游文章";
};

// 将文章推wp
const pushYoutubeArticle = (row) => {
  dialogFormYoutube.value = true;
  isAdding.value = "youtube";
  popBoxTit.value = "将youtube文章推wp";
  youtubeArticleRef.value = {
    domain: row.domain,
    wp_user: row.wp_user,
    wp_password: row.wp_password,
    wpcategory: "",
    channelName: "",
    columnsName: "",
  };
};

// 单发股票
const postStocksArticle = (row) => {
  dialogFormVisible.value = true;
  isAdding.value = "stock";
  popBoxTit.value = "发送股票类文章";
  aiArticleRef.value = {
    table_category_mapping: row.table_category_mapping,
    domain: row.domain,
    wp_user: row.wp_user,
    wp_password: row.wp_password,
    prompt: "",
    strongPoints: "",
  };
};

const cancel = async () => {
  await aiArticle_initdd();
  await build_initdd();
  await youtube_initdd();
  await initData();
};
// 保存基础数据
const saveBase = async () => {
  console.log("当前提交行为:", isAdding.value);
  console.log("准提交数据：", aiArticleRef.value);
  if (isAdding.value === "add") {
    const data = {
      table_category_mapping: aiArticleRef.value.table_category_mapping,
      domain: aiArticleRef.value.domain,
      wp_user: aiArticleRef.value.wp_user,
      wp_password: aiArticleRef.value.wp_password,
      wp_email: aiArticleRef.value.wp_email,
      group: aiArticleRef.value.group,
    };
    await addWpDirectoryGo(data);
  } else {
    if (aiArticleRef.value.isLocalpPwd === "0") {
      const data = {
        isLocalpPwd: aiArticleRef.value.isLocalpPwd,
        id: aiArticleRef.value.id,
        wp_user: aiArticleRef.value.wp_user,
        wp_password: aiArticleRef.value.wp_password,
        table_category_mapping: aiArticleRef.value.table_category_mapping,
        group: aiArticleRef.value.group,
      };
      await updateOautGo(data);
    } else {
      const data = {
        id: aiArticleRef.value.id,
        isLocalpPwd: aiArticleRef.value.isLocalpPwd,
        table_category_mapping: aiArticleRef.value.table_category_mapping,
        group: aiArticleRef.value.group,
      };
      await updateOautGo(data);
    }
  }
  await aiArticle_initdd();
  await initData();
};
const insertAuthor = async () => {
  console.log("当前提交行为:", isAdding.value);
  console.log("准提交数据：", aiArticleRef.value);
  const data = {
    id: aiArticleRef.value.id,
    domain: aiArticleRef.value.domain,
    wp_user: aiArticleRef.value.wp_user,
    wp_password: aiArticleRef.value.wp_password,
    wp_email: aiArticleRef.value.wp_email,
  };
  await insertAuthorGo(data);
  await aiArticle_initdd();
  await initData();
};

// 建站
const buildSave = async () => {
  console.log("当前提交行为:", isAdding.value);
  console.log("准提交数据：", buildWebsiteRef.value);
  const data = {
    domain: buildWebsiteRef.value.domain,
    group: buildWebsiteRef.value.group,
    blog_title: buildWebsiteRef.value.blog_title,
    description: buildWebsiteRef.value.description,
    isdesignation: buildWebsiteRef.value.isdesignation,
    designationMenu: buildWebsiteRef.value.designationMenu,
  };
  await buildWebsiteGo(data);
  await build_initdd();
  await initData();
};
// 发单条的 股票文章
const postStock = async () => {
  console.log("当前提交行为:", isAdding.value);
  console.log("准提交数据：", aiArticleRef.value);
  const data = {
    table_category_mapping: aiArticleRef.value.table_category_mapping,
    domain: aiArticleRef.value.domain,
    wp_user: aiArticleRef.value.wp_user,
    wp_password: aiArticleRef.value.wp_password,
    prompt: aiArticleRef.value.prompt,
    strongPoints: aiArticleRef.value.strongPoints,
  };
  await postStocksArticleGo(data);
  await aiArticle_initdd();
  await initData();
};
// 批量旅游文章
const batchPostsInside = async () => {
  console.log("当前提交行为:", isAdding.value);
  console.log("准提交数据：", aiArticleRef.value);
  const data = {
    limitNum: aiArticleRef.value.limitNum,
    group: aiArticleRef.value.group,
  };
  await batchPostInsideArticleGo(data);
  await aiArticle_initdd();
  await initData();
};

// 将YouTube文章发布到wp
const pushYouTube = async () => {
  console.log("当前提交行为:", isAdding.value);
  console.log("准提交数据：", youtubeArticleRef.value);
  const data = {
    domain: youtubeArticleRef.value.domain,
    wp_user: youtubeArticleRef.value.wp_user,
    wp_password: youtubeArticleRef.value.wp_password,
    wpcategory: youtubeArticleRef.value.wpcategory,
    channelName: youtubeArticleRef.value.channelName,
    columnsName: youtubeArticleRef.value.columnsName,
  };
  await pushYouTubeGo(data);
  await youtube_initdd();
  await initData();
};

// 还原弹框输入
const youtube_initdd = async () => {
  youtubeArticleRef.value = {
    domain: "",
    wp_user: "",
    wp_password: "",
    channelName: "",
    columnsName: "",
    wpcategory: "",
  };

  dialogFormYoutube.value = false;
  isAdding.value = "add";
};

const build_initdd = async () => {
  buildWebsiteRef.value = {
    domain: "",
    description: "",
    blog_title: "",
    isdesignation: "1",
    designationMenu: "",
    group: "",
  };

  dialogFormBuild.value = false;
  isAdding.value = "add";
};

const aiArticle_initdd = async () => {
  aiArticleRef.value = {
    table_category_mapping: "",
    limitNum: "1",
    domain: "",
    wp_user: "",
    wp_password: "",
    wp_email: "",
    group: "",
    id: "",
  };

  dialogFormVisible.value = false;
  isAdding.value = "add";
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
      <el-breadcrumb-item>建站管理</el-breadcrumb-item>
    </el-breadcrumb>
  </el-row>
  <!--搜索  -->
  <el-row class="row-bg" :gutter="20">
    <el-col :span="2">
      <div class="grid-content ep-bg-purple" />
      <el-button type="warning" plain @click="functionsShow">
        建站说明
      </el-button>
    </el-col>
    <el-col :span="1">
      <div class="grid-content ep-bg-purple" />
      <el-button type="primary" plain @click="buildWebsite">建站</el-button>
    </el-col>
    <el-col :span="2">
      <div class="grid-content ep-bg-purple" />
      <el-button type="primary" plain @click="add">补充wp目录配置</el-button>
    </el-col>
    <el-col :span="2">
      <div class="grid-content ep-bg-purple" />
      <el-button type="primary" plain @click="batchPostsInsideArticle">
        批量旅游文章
      </el-button>
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
            prop="group"
            label="分组"
            align="center"
            width="80"
          />
          <el-table-column prop="domain" label="域名" align="center" />
          <el-table-column prop="wp_user" label="账号" align="center" />
          <el-table-column prop="wp_password" label="密码" align="center" />
          <el-table-column prop="wp_email" label="email" align="center" />
          <el-table-column
            prop="table_category_mapping"
            label="目录配置"
            align="center"
          />
          <el-table-column
            prop="create_at"
            label="添加时间"
            align="center"
            width="200"
          />
          <el-table-column prop="operate" label="操作" align="center">
            <template #default="{ row }">
              <el-button type="primary" link @click="postInsideArticle(row)">
                发旅游文章
              </el-button>
              <el-button type="primary" link @click="postStocksArticle(row)">
                发股票文章
              </el-button>
              <el-button type="primary" link @click="pushYoutubeArticle(row)">
                发YouTube文章
              </el-button>
              <el-button type="primary" link @click="newAuthor(row)">
                新增作者
              </el-button>
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

  <!-- 建站 -->
  <el-dialog
    v-model="dialogFormBuild"
    :title="popBoxTit"
    width="1500px"
    :show-close="false"
    align-center
  >
    <el-form
      :model="buildWebsiteRef"
      label-width="auto"
      style="max-width: 1200px"
    >
      <el-row class="row-bg">
        <span>
          需要批量建站的情况下，使用英文[^]为间隔,如果为「指定目录」使用英文[^]为间隔目录。如：Adventure
          Travel^Hiking 意思是 这些站下有2个目录
        </span>
      </el-row>
      <el-row class="row-bg">
        <el-col :span="8">
          <el-form-item label="建站域名" class="form_item" style="width: 400px">
            <el-input
              v-model="buildWebsiteRef.domain"
              :rows="10"
              type="textarea"
              placeholder="Please input"
              style="margin: 10px"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="网站名称" class="form_item" style="width: 400px">
            <el-input
              v-model="buildWebsiteRef.blog_title"
              :rows="10"
              type="textarea"
              placeholder="Please input"
              style="margin: 10px"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="网站简介" class="form_item" style="width: 400px">
            <el-input
              v-model="buildWebsiteRef.description"
              :rows="10"
              type="textarea"
              placeholder="Please input"
              style="margin: 10px"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="网站目录" class="form_item">
            <div class="my-2 flex items-center text-sm">
              <el-radio-group
                class="ml-4"
                v-model="buildWebsiteRef.isdesignation"
              >
                <el-radio id="builddebug" label="0" size="large">指定</el-radio>
                <el-radio id="buildqueue" label="1" size="large">随机</el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
        </el-col>

        <el-col :span="8" v-show="buildWebsiteRef.isdesignation === '0'">
          <el-form-item label="指定目录" class="form_item" style="width: 400px">
            <el-input
              v-model="buildWebsiteRef.designationMenu"
              :rows="10"
              type="textarea"
              placeholder="Please input"
              style="margin: 10px"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="分组" class="form_item">
            <el-input v-model="buildWebsiteRef.group" autocomplete="off" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="buildSave">建站</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 基础信息/发文 -->
  <el-dialog
    v-model="dialogFormVisible"
    :title="popBoxTit"
    width="1500px"
    :show-close="false"
    align-center
  >
    <el-form :model="aiArticleRef" label-width="auto" style="max-width: 1200px">
      <el-row class="row-bg">
        <span v-if="isAdding === 'add' || isAdding === 'revise'">
          例子：wp目录分类栏输入样式：{ "Leisure_Travel": "Leisure
          Travel","Cultural_Travel": "Cultural Travel",
          "Travel_Photography":"Travel Photography" } 有 _
          的是匹配数据库目录使用的; 账号/密码/email 仅仅 保存至本地
          服务器，不同步wp
        </span>
        <span v-if="isAdding === 'batch'">
          输入[None] 时 会将所有的账号都执行遍
        </span>
        <span v-if="isAdding === 'author'">
          新增作者功能，只适用于
          新2024年8月14日以后新建的站使用，历史站需要手动再wp后台添加后再补充
        </span>
      </el-row>
      <el-row class="row-bg" :gutter="20">
        <el-col :span="6">
          <el-form-item
            label="ID"
            class="form_item"
            v-if="isAdding === 'revise' || isAdding === 'author'"
          >
            <el-input v-model="aiArticleRef.id" autocomplete="off" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="row-bg" :gutter="20">
        <el-col :span="6">
          <el-form-item
            label="域名"
            class="form_item"
            v-if="
              isAdding === 'add' ||
              isAdding === 'revise' ||
              isAdding === 'author'
            "
          >
            <el-input
              v-model="aiArticleRef.domain"
              autocomplete="off"
              v-if="isAdding === 'add'"
            />
            <el-input
              v-model="aiArticleRef.domain"
              autocomplete="off"
              disabled
              v-if="isAdding === 'revise' || isAdding === 'author'"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="row-bg" :gutter="20">
        <el-col :span="6" v-if="isAdding === 'revise'">
          <el-form-item label="是否修改本地账号/密码" class="form_item">
            <div class="my-2 flex items-center text-sm">
              <el-radio-group class="ml-4" v-model="aiArticleRef.isLocalpPwd">
                <el-radio id="yeschange" label="0" size="large">修改</el-radio>
                <el-radio id="nochange" label="1" size="large">不修改</el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="10" v-if="isAdding === 'revise'">
          <span>
            只修改本服务记录的账号/密码！！ 修改前，请先自行修改wp上的
          </span>
        </el-col>
      </el-row>
      <el-row class="row-bg" :gutter="20">
        <el-col :span="6">
          <el-form-item
            label="wp账号"
            class="form_item"
            v-if="
              isAdding === 'add' ||
              isAdding === 'author' ||
              (isAdding === 'revise' && aiArticleRef.isLocalpPwd == '0')
            "
          >
            <el-input v-model="aiArticleRef.wp_user" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="wp密码"
            class="form_item"
            v-if="
              isAdding === 'add' ||
              isAdding === 'author' ||
              (isAdding === 'revise' && aiArticleRef.isLocalpPwd == '0')
            "
          >
            <el-input v-model="aiArticleRef.wp_password" autocomplete="off" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="row-bg" :gutter="20">
        <el-col :span="6">
          <el-form-item
            label="email"
            class="form_item"
            v-if="isAdding === 'add' || isAdding === 'author'"
          >
            <el-input v-model="aiArticleRef.wp_email" autocomplete="off" />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 批量发旅游文章 -->
      <el-row class="row-bg" :gutter="20">
        <el-col :span="6">
          <el-form-item
            label="分组"
            class="form_item"
            v-if="isAdding !== 'stock' && isAdding !== 'author'"
          >
            <el-input v-model="aiArticleRef.group" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="发帖数量"
            class="form_item"
            v-if="isAdding === 'batch'"
          >
            <el-input v-model="aiArticleRef.limitNum" autocomplete="off" />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 发股票文章 -->
      <el-row class="row-bg" :gutter="20" v-show="isAdding === 'stock'">
        <el-col :span="24">
          <span v-if="isAdding === 'stock'">
            固定词 一般用于 文章固定标题类 如：関連株 本命株・出遅れ株 一覧
          </span>
        </el-col>
      </el-row>
      <el-row class="row-bg" :gutter="20" v-show="isAdding === 'stock'">
        <el-col :span="6">
          <el-form-item
            label="固定词"
            class="form_item"
            v-if="isAdding === 'stock'"
          >
            <el-input v-model="aiArticleRef.prompt" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="加粗"
            class="form_item"
            v-if="isAdding === 'stock'"
          >
            <el-input
              v-model="aiArticleRef.strongPoints"
              autocomplete="off"
              placeholder="用逗号分隔"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <span v-if="isAdding === 'stock'">
            文章中 加粗展示；用英文[,]间隔，如：関連株,本命株,出遅れ株
          </span>
        </el-col>
      </el-row>
      <el-row class="row-bg">
        <el-col :span="10">
          <el-form-item
            label="wp目录分类"
            class="form_item"
            style="width: 1400px"
            v-if="isAdding === 'add' || isAdding === 'revise'"
          >
            <el-input
              v-model="aiArticleRef.table_category_mapping"
              :rows="20"
              type="textarea"
              placeholder="Please input"
              style="margin: 10px"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button
          type="primary"
          @click="saveBase"
          v-if="isAdding === 'add' || isAdding === 'revise'"
        >
          保存基础信息
        </el-button>
        <el-button
          type="primary"
          @click="insertAuthor"
          v-if="isAdding === 'author'"
        >
          新增作者
        </el-button>
        <el-button
          type="primary"
          @click="batchPostsInside"
          v-if="isAdding === 'batch'"
        >
          批量发旅游文章
        </el-button>
        <el-button
          type="primary"
          @click="postStock"
          v-if="isAdding === 'stock'"
        >
          发布股票文章
        </el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 推YouTube文章 -->
  <el-dialog
    v-model="dialogFormYoutube"
    :title="popBoxTit"
    width="1400px"
    top="10px"
    destroy-on-close
    align-center
  >
    <el-form
      :model="youtubeArticleRef"
      label-width="auto"
      style="max-width: 1200px"
    >
      <el-row class="row-bg" :gutter="20">
        <el-col :span="10">
          <el-form-item label="域名" class="form_item">
            <el-input
              v-model="youtubeArticleRef.domain"
              autocomplete="off"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="wp目录名称" class="form_item">
            <el-input
              v-model="youtubeArticleRef.wpcategory"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="row-bg" :gutter="20">
        <el-col :span="10">
          <el-form-item label="频道(数据库表)名称" class="form_item">
            <el-input
              v-model="youtubeArticleRef.channelName"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="播放列表名称" class="form_item">
            <el-input
              v-model="youtubeArticleRef.columnsName"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="pushYouTube">发YouTube文章</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 建站说明 -->
  <el-dialog
    v-model="dialogFormFunctions"
    title="建站特别说明(更换主题都要重新执行)"
    width="1400px"
    top="10px"
    destroy-on-close
  >
    <functionsMD />
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
