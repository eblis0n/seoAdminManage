<!--
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-01-08 15:09:59
 * @LastEditTime: 2024-07-30 21:45:25
-->
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { groupBy } from "lodash";
import { ArrowRight } from "@element-plus/icons-vue";
import {
  oauthListGo,
  addOautGo,
  updateOautGo,
  delOautGo,
  uploadFile,
  oauthGetTokenGo,
  oauthGetBatchTokenGo,
  oauthRefreshTokenGo,
  oauthRefreshBatchTokenGo,
  bloggerPostsGo,
  bloggerBatchPostsGo,
  aiArticleLGo,
} from "./googleOauthJS";

// 初始化
const popBoxTit = ref("");

const currentPage = ref(1); // 当前页码
const pageSize = ref(10); // 每页显示的数据数量

const listDatas = ref<any[]>([]);
const aiArticleDatas = ref<any[]>([]);

// 状态
const isAdding = ref("add");
const isBatch = ref(true);

const dialogFormVisible = ref(false);
const dialogUploadVisible = ref(false);
const dialogBloggerVisible = ref(false);

const infoRef = ref<any>({
  id: "",
  gerent: "",
  adsid: "",
  adsgroup: "",
  adsuser: "",
  client_id: "",
  client_secret: "",
  googleAccount: "",
  email_pwd: "",
  email_verify: "",
  blogger_id: "",
  access_token: "",
  refresh_token: "",
  validity_at: "",
});

const aiArticleRef = ref<any>({
  id: "",
  blogger_id: "",
  access_token: "",
  article_id: "",
  sponsored_link: "",
  title: "",
  content_html: "",
  bloggroup: "",
  articlegroup: "",
});

// 接口相关
const initData = async () => {
  listDatas.value = await oauthListGo();
};

onMounted(async () => {
  await initData();
});

const getToken = async (row) => {
  const data = {
    adsuser: row.adsuser,
    client_id: row.client_id,
    client_secret: row.client_secret,
  };
  await oauthGetTokenGo(data);
  await initData();
};

const refreshToken = async (row) => {
  const data = {
    adsuser: row.adsuser,
    client_id: row.client_id,
    client_secret: row.client_secret,
    refresh_token: row.refresh_token,
  };
  await oauthRefreshTokenGo(data);
  await initData();
};
const delet = async (row) => {
  const data = {
    id: row.id,
  };
  await delOautGo(data);
};

const add = () => {
  dialogFormVisible.value = true;
  popBoxTit.value = "添加";
};

const bloggerBatchPosts = () => {
  dialogBloggerVisible.value = true;
  popBoxTit.value = "批量发帖";
  isBatch.value = true;
};

const bloggerPosts = async (row) => {
  const aiArticleListData = await aiArticleLGo();
  // console.log('aiArticleListData.value', aiArticleListData);

  aiArticleDatas.value = await processAndFormatData(aiArticleListData);
  console.log("aiArticleDatas.value", aiArticleDatas.value);

  dialogBloggerVisible.value = true;
  isBatch.value = false;
  popBoxTit.value = "普通发帖";
  aiArticleRef.value = {
    id: row.id,
    blogger_id: row.blogger_id,
    access_token: row.access_token,
  };
};

const processAndFormatData = (rawListData) => {
  const combinedData = {};
  rawListData.forEach((item) => {
    const adsgroup = item.adsgroup;
    if (!combinedData[adsgroup]) {
      combinedData[adsgroup] = {
        value: adsgroup,
        label: adsgroup, // 这里可以改为你想显示的字段，例如 groupName
        children: [],
      };
    }
    combinedData[adsgroup].children.push({
      value: item, // 这里可以改为你想用作唯一标识的字段，例如 id
      label: item.title, // 这里可以改为你想显示的字段
    });
  });
  return Object.values(combinedData);
};

const post = async () => {
  console.log("是否为批量？", isBatch.value);
  console.log("准提交数据：", aiArticleRef.value);
  console.log("当前提交行为:", aiArticleRef.value);
  if (isBatch.value === true) {
    const data = {
      bloggroup: aiArticleRef.value.bloggroup,
      articlegroup: aiArticleRef.value.articlegroup,
    };
    await bloggerBatchPostsGo(data);
  } else {
    const data = {
      blogger_id: aiArticleRef.value.blogger_id,
      access_token: aiArticleRef.value.access_token,
      sponsored_link: aiArticleRef.value.sponsored_link,
      article_id: aiArticleRef.value.article_id,
      title: aiArticleRef.value.title,
      content_html: aiArticleRef.value.content_html,
    };
    await bloggerPostsGo(data);
  }

  await initdd("blog");
};

const bloggerHandleChange = (selectedItem) => {
  // console.log('selectedItem', selectedItem[1]);
  aiArticleRef.value.article_id = selectedItem[1].id;
  aiArticleRef.value.sponsored_link = selectedItem[1].sponsored_link;
  aiArticleRef.value.title = selectedItem[1].title;
  aiArticleRef.value.content_html = selectedItem[1].content_html;
};

const getBatchToken = () => {
  dialogFormVisible.value = true;
  popBoxTit.value = "批量获取token";
  isAdding.value = "batch";
};

const refreshBatchToken = () => {
  dialogFormVisible.value = true;
  popBoxTit.value = "批量Refresh";
  isAdding.value = "refreshBatch";
};

const revise = (row) => {
  dialogFormVisible.value = true;
  isAdding.value = "revise";
  popBoxTit.value = "修改";

  infoRef.value = {
    id: row.id,
    gerent: row.gerent,
    adsid: row.adsid,
    adsgroup: row.adsgroup,
    adsuser: row.adsuser,
    client_id: row.client_id,
    client_secret: row.client_secret,
    googleAccount: row.googleAccount,
    email_pwd: row.email_pwd,
    email_verify: row.email_verify,
    blogger_id: row.blogger_id,
    access_token: row.access_token,
    refresh_token: row.refresh_token,
    validity_at: row.validity_at,
  };
};

const cancel = (who) => {
  initdd(who);
};

const save = async () => {
  console.log("准提交数据：", infoRef.value);
  console.log("当前提交行为:", isAdding.value);

  if (isAdding.value === "add") {
    const data = {
      gerent: infoRef.value.gerent,
      adsid: infoRef.value.adsid,
      adsgroup: infoRef.value.adsgroup,
      adsuser: infoRef.value.adsuser,
      client_id: infoRef.value.client_id,
      client_secret: infoRef.value.client_secret,
      googleAccount: infoRef.value.googleAccount,
      email_pwd: infoRef.value.email_pwd,
      email_verify: infoRef.value.email_verify,
      blogger_id: infoRef.value.blogger_id,
    };
    await addOautGo(data);
  } else {
    if (isAdding.value === "revise") {
      const data = {
        id: infoRef.value.id,
        gerent: infoRef.value.gerent,
        adsid: infoRef.value.adsid,
        adsgroup: infoRef.value.adsgroup,
        adsuser: infoRef.value.adsuser,
        client_id: infoRef.value.client_id,
        client_secret: infoRef.value.client_secret,
        googleAccount: infoRef.value.googleAccount,
        email_pwd: infoRef.value.email_pwd,
        email_verify: infoRef.value.email_verify,
        blogger_id: infoRef.value.blogger_id,
      };
      await updateOautGo(data);
    } else {
      const data = {
        adsgroup: infoRef.value.adsgroup,
      };
      if (isAdding.value === "batch") {
        await oauthGetBatchTokenGo(data);
      } else {
        await oauthRefreshBatchTokenGo(data);
      }
    }
  }
  await initdd("info");
};

// 还原弹框输入
const initdd = async (who) => {
  if (who === "blog") {
    aiArticleRef.value = {
      id: "",
      blogger_id: "",
      access_token: "",
      title: "",
      content_html: "",
      bloggroup: "",
      articlegroup: "",
    };

    isBatch.value = false;
    dialogBloggerVisible.value = false;
  } else {
    // 还原初始化
    isAdding.value = "add";

    infoRef.value = {
      id: "",
      gerent: "",
      adsid: "",
      adsgroup: "",
      adsuser: "",
      client_id: "",
      client_secret: "",
      googleAccount: "",
      email_pwd: "",
      email_verify: "",
      access_token: "",
      refresh_token: "",
      validity_at: "",
      blogger_id: "",
    };
    dialogFormVisible.value = false;
  }
  await initData();
};

// 批量上传
const batchUpload = async () => {
  dialogUploadVisible.value = true;
};
const handleBeforeUpload = async (file: File) => {
  const formData = new FormData();
  formData.append("who", "oauth"); // 上传者信息
  formData.append("file", file);

  await uploadFile(formData);
  dialogUploadVisible.value = false;
  await initData();
  // 返回 false 阻止自动上传
  return false;
};
// 其他方法

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
      <el-breadcrumb-item>googleAPI</el-breadcrumb-item>
      <el-breadcrumb-item>Oauth2.0</el-breadcrumb-item>
    </el-breadcrumb>
  </el-row>
  <!--搜索  -->
  <el-row class="row-bg" :gutter="20">
    <el-col :span="1">
      <div class="grid-content ep-bg-purple" />
      <el-button type="primary" plain @click="add">添加</el-button>
    </el-col>
    <el-col :span="2">
      <div class="grid-content ep-bg-purple" />
      <el-button type="primary" plain @click="batchUpload">批量上传</el-button>
    </el-col>
    <el-col :span="2">
      <div class="grid-content ep-bg-purple" />
      <el-button type="primary" plain @click="getBatchToken">
        批量获取token
      </el-button>
    </el-col>
    <el-col :span="2">
      <div class="grid-content ep-bg-purple" />
      <el-button type="primary" plain @click="refreshBatchToken">
        批量Refresh
      </el-button>
    </el-col>
    <el-col :span="2">
      <div class="grid-content ep-bg-purple" />
      <el-button type="primary" plain @click="bloggerBatchPosts">
        批量发帖
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
            prop="gerent"
            label="管理员"
            align="center"
            width="80"
          />
          <el-table-column
            prop="adsid"
            label="adsID"
            align="center"
            width="80"
          />
          <el-table-column
            prop="adsuser"
            label="ads账号"
            align="center"
            width="80"
          />
          <el-table-column
            prop="adsgroup"
            label="ads分组"
            align="center"
            width="80"
          />
          <el-table-column prop="client_id" label="客户端ID" align="center">
            <template #default="{ row }">
              <el-tooltip placement="top">
                <template #content>{{ row.client_id }}</template>
                <div>{{ formatContent(row.client_id) }}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            prop="client_secret"
            label="客户端密钥"
            align="center"
          >
            <template #default="{ row }">
              <el-tooltip placement="top">
                <template #content>{{ row.client_secret }}</template>
                <div>{{ formatContent(row.client_secret) }}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            prop="googleAccount"
            label="Google邮箱"
            align="center"
          />
          <el-table-column
            prop="googleAccount"
            label="Google邮箱"
            align="center"
          />
          <el-table-column prop="blogger_id" label="bloggerID" align="center" />

          <el-table-column
            prop="access_token,"
            label="access_token"
            align="center"
          >
            <template #default="{ row }">
              <el-tooltip placement="top">
                <template #content>{{ row.access_token }}</template>
                <div>{{ formatContent(row.access_token) }}</div>
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column
            prop="validity_at"
            label="token失效时间"
            align="center"
          />
          <el-table-column prop="create_at" label="添加时间" align="center" />
          <el-table-column prop="operate" label="操作" align="center">
            <template #default="{ row }">
              <el-button type="primary" link @click="revise(row)">
                查看/修改
              </el-button>
              <el-button type="primary" link @click="delet(row)">
                删除
              </el-button>
              <el-button type="primary" link @click="getToken(row)">
                获取token
              </el-button>
              <el-button type="primary" link @click="refreshToken(row)">
                Refresh token
              </el-button>
              <el-button type="primary" link @click="bloggerPosts(row)">
                blogger发帖
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

  <!-- 上传文件 -->
  <el-dialog v-model="dialogUploadVisible" title="上传文件" width="800px">
    <el-upload
      class="upload-demo"
      drag
      action="/"
      :before-upload="handleBeforeUpload"
      multiple
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        Drop file here or
        <em>click to upload</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          只支持 UTF-8 的 xlsx、xls、csv 格式文件，文件最多一次5000条数据
        </div>
      </template>
    </el-upload>
  </el-dialog>

  <!-- blog发帖 -->
  <el-dialog
    v-model="dialogBloggerVisible"
    :title="popBoxTit"
    width="1500px"
    :show-close="false"
  >
    <el-form :model="aiArticleRef" label-width="auto" style="max-width: 1200px">
      <el-row class="row-bg">
        <el-col :span="6">
          <el-form-item class="form_item">
            <span>输入[None] 时 会将所有的账号都执行遍</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="row-bg" :gutter="20">
        <el-col :span="6">
          <el-form-item label="blogger组" class="form_item" v-if="isBatch">
            <el-input v-model="aiArticleRef.bloggroup" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="文章组" class="form_item" v-if="isBatch">
            <el-input v-model="aiArticleRef.articlegroup" autocomplete="off" />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- id -->
      <el-row class="row-bg" :gutter="20">
        <el-col :span="6">
          <el-form-item label="id" class="form_item" v-if="!isBatch">
            <span>{{ aiArticleRef.id }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="bloggerID" class="form_item" v-if="!isBatch">
            <span>{{ aiArticleRef.blogger_id }}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row class="row-bg">
        <el-col :span="6">
          <el-form-item label="access_token" class="form_item" v-if="!isBatch">
            <span>{{ aiArticleRef.access_token }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="row-bg">
        <el-col :span="10">
          <!-- <span>{{ aiArticleGroup }}</span> -->
          <el-form-item label="AI文章" v-if="!isBatch">
            <el-cascader
              v-model="aiArticleRef.title"
              @change="bloggerHandleChange"
              :options="aiArticleDatas"
              :show-all-levels="false"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel('blog')">取消</el-button>
        <el-button type="primary" @click="post">发帖</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 弹框 添加/修改 -->
  <el-dialog
    v-model="dialogFormVisible"
    :show-close="false"
    :title="popBoxTit"
    width="1500px"
  >
    <el-form :model="infoRef" label-width="auto" style="max-width: 1200px">
      <el-row class="row-bg">
        <el-col :span="6">
          <el-form-item
            v-if="isAdding === 'batch' || isAdding === 'refreshBatch'"
            class="form_item"
          >
            <span>输入[None] 时 会将所有的账号都执行遍</span>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- id -->
      <el-row class="row-bg">
        <el-col :span="6">
          <el-form-item
            v-if="isAdding === 'revise'"
            label="id"
            class="form_item"
          >
            <span>{{ infoRef.id }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="row-bg">
        <el-col :span="6">
          <el-form-item
            label="管理员"
            class="form_item"
            v-if="isAdding !== 'batch' && isAdding !== 'refreshBatch'"
          >
            <el-input v-model="infoRef.gerent" autocomplete="off" />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- ads相关 -->
      <el-row class="row-bg">
        <el-col :span="6">
          <el-form-item
            label="adsID"
            class="form_item"
            v-if="isAdding !== 'batch' && isAdding !== 'refreshBatch'"
          >
            <el-input v-model="infoRef.adsid" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="ads账号"
            class="form_item"
            v-if="isAdding !== 'batch' && isAdding !== 'refreshBatch'"
          >
            <el-input v-model="infoRef.adsuser" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="ads分组" class="form_item">
            <el-input v-model="infoRef.adsgroup" autocomplete="off" />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- https://console.cloud.google.com/相关 -->
      <el-row class="row-bg">
        <el-col :span="6">
          <el-form-item
            label="客户端 ID"
            class="form_item"
            v-if="isAdding !== 'batch' && isAdding !== 'refreshBatch'"
          >
            <el-input v-model="infoRef.client_id" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="客户端密钥"
            class="form_item"
            v-if="isAdding !== 'batch' && isAdding !== 'refreshBatch'"
          >
            <el-input v-model="infoRef.client_secret" autocomplete="off" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="row-bg">
        <el-col :span="6">
          <el-form-item
            label="Google邮箱"
            class="form_item"
            v-if="isAdding !== 'batch' && isAdding !== 'refreshBatch'"
          >
            <el-input v-model="infoRef.googleAccount" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="邮箱密码"
            class="form_item"
            v-if="isAdding !== 'batch' && isAdding !== 'refreshBatch'"
          >
            <el-input v-model="infoRef.email_pwd" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="验证邮箱"
            class="form_item"
            v-if="isAdding !== 'batch' && isAdding !== 'refreshBatch'"
          >
            <el-input v-model="infoRef.email_verify" autocomplete="off" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="row-bg">
        <el-col :span="6">
          <el-form-item
            label="bloggerid"
            class="form_item"
            v-if="isAdding !== 'batch' && isAdding !== 'refreshBatch'"
          >
            <el-input v-model="infoRef.blogger_id" autocomplete="off" />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- token相关 -->
      <el-row class="row-bg">
        <el-col :span="20">
          <el-form-item
            v-if="isAdding === 'revise'"
            label="access_token"
            class="form_item"
          >
            <span>{{ infoRef.access_token }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item
            v-if="isAdding === 'revise'"
            label="refresh_token"
            class="form_item"
          >
            <span>{{ infoRef.refresh_token }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            v-if="isAdding === 'revise'"
            label="token失效时间"
            class="form_item"
          >
            <span>{{ infoRef.validity_at }}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel('info')">取消</el-button>
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
