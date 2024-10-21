<!--
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-01-08 15:09:59
 * @LastEditTime: 2024-08-27 16:17:04
-->
<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { ArrowRight } from "@element-plus/icons-vue";
import {
  listGo,
  addGo,
  delGo,
  updateGo,
  batchPostGo,
  postGo,
  batchUpdateCookieGo,
  updateCookieGo,
} from "./noteUserInfoJS";

// 初始化
const popBoxTit = ref("");

const currentPage = ref(1); // 当前页码
const pageSize = ref(10); // 每页显示的数据数量

const listDatas = ref<any[]>([]);

// 状态
const isAdding = ref("add");
const dialogFormVisible = ref(false);
const dialogFormPost = ref(false);

const infoRef = ref<any>({
  id: "",
  group: "",
  adsid: "",
  adsuser: "",
  username: "",
  email: "",
  password: "",
  proxies: "",
  cookie: "",
  type: "basis",
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
  if (!infoRef.value.username) {
    initData(); // 初始化列表数据
    return listDatas.value;
  }
  // 如果输入了用户名，过滤数据
  return listDatas.value.filter((item) =>
    item.username.includes(infoRef.value.username)
  );
});

const select = () => {
  console.log("infoRef.value.username", infoRef.value.username);
  listDatas.value = filteredListDatas.value;
};

const add = () => {
  dialogFormVisible.value = true;
  isAdding.value = "add";
  popBoxTit.value = "添加";
};
const revise = (row) => {
  dialogFormVisible.value = true;
  popBoxTit.value = "修改基础信息";
  isAdding.value = "revise";

  infoRef.value = {
    id: row.id,
    group: row.group,
    adsid: row.adsid,
    adsuser: row.adsuser,
    username: row.username,
    email: row.email,
    password: row.password,
    proxies: row.proxies,
    cookie: row.cookie,
    type: "basis",
  };
};

const post = (row) => {
  dialogFormPost.value = true;
  popBoxTit.value = row.username + "发帖";
  isAdding.value = "post";

  infoRef.value = {
    username: row.username,
    cookie: row.cookie,
    proxies: row.proxies,
  };
};

const newcookie = (row) => {
  dialogFormVisible.value = true;
  popBoxTit.value = "更新cookie";
  isAdding.value = "cookie";

  infoRef.value = {
    id: row.id,
    adsuser: row.adsuser,
  };
};

const getCookie = () => {
  dialogFormPost.value = true;
  popBoxTit.value = "批量更新cookie";
  isAdding.value = "batchcookie";
};

const batchPost = () => {
  dialogFormPost.value = true;
  popBoxTit.value = "批量发帖";
  isAdding.value = "batch";
};

const cancel = () => {
  initdd();
};

const save = async () => {
  console.log("当前提交行为:", isAdding.value);
  console.log("准提交数据：", infoRef.value);

  if (isAdding.value == "add") {
    const data = {
      group: infoRef.value.group,
      username: infoRef.value.username,
      adsid: infoRef.value.adsid,
      adsuser: infoRef.value.adsuser,
      email: infoRef.value.email,
      password: infoRef.value.password,
      proxies: infoRef.value.proxies,
      cookie: infoRef.value.cookie,
    };
    // console.log('data:', data);
    await addGo(data);
  } else {
    if (isAdding.value == "revise") {
      const data = {
        id: infoRef.value.id,
        group: infoRef.value.group,
        username: infoRef.value.username,
        adsid: infoRef.value.adsid,
        adsuser: infoRef.value.adsuser,
        email: infoRef.value.email,
        password: infoRef.value.password,
        proxies: infoRef.value.proxies,
        cookie: infoRef.value.cookie,
        type: infoRef.value.type,
      };
      await updateGo(data);
    } else {
      const data = {
        adsuser: infoRef.value.adsuser,
      };
      await updateCookieGo(data);
    }
  }
  await initdd();
};

const postsave = async () => {
  console.log("当前提交行为:", isAdding.value);
  console.log("准提交数据：", infoRef.value);

  if (isAdding.value == "post") {
    const data = {
      username: infoRef.value.username,
      cookie: infoRef.value.cookie,
      proxies: infoRef.value.proxies,
    };
    // console.log('data:', data);
    await postGo(data);
    await initdd();
  } else {
    if (isAdding.value == "batch") {
      const data = {
        group: infoRef.value.group,
      };
      await batchPostGo(data);
      await initdd();
    } else {
      const data = {
        group: infoRef.value.group,
      };
      await batchUpdateCookieGo(data);
      await initdd();
    }
  }
};

// 还原弹框输入
const initdd = async () => {
  // 还原初始化
  isAdding.value = "add";
  infoRef.value = {
    id: "",
    group: "",
    adsid: "",
    adsuser: "",
    username: "",
    email: "",
    password: "",
    proxies: "",
    cookie: "",
    type: "basis",
  };
  dialogFormVisible.value = false;
  dialogFormPost.value = false;
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
      <el-breadcrumb-item>Note</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
  </el-row>
  <!--搜索  -->
  <el-row class="row-bg" :gutter="20">
    <el-col :span="6">
      <div class="grid-content ep-bg-purple" />
      <div style="display: flex; align-items: center">
        <span style="margin-right: 10px">用户名:</span>
        <el-input
          v-model="infoRef.username"
          placeholder="请输入用户名"
          clearable
        />
      </div>
    </el-col>
    <el-col :span="1">
      <div class="grid-content ep-bg-purple" />
      <el-button type="primary" plain @click="select">查询</el-button>
    </el-col>
    <el-col :span="2">
      <div class="grid-content ep-bg-purple" />
      <el-button type="primary" plain @click="add">添加基础信息</el-button>
    </el-col>
    <el-col :span="4">
      <div class="grid-content ep-bg-purple" />
      <el-button type="primary" plain @click="batchPost">批量发文章</el-button>
    </el-col>
    <el-col :span="3">
      <div class="grid-content ep-bg-purple" />
      <el-button type="primary" plain @click="getCookie">
        批量获取用户cookie
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
          <el-table-column
            prop="adsid"
            label="ads环境编号"
            align="center"
            width="80"
          />
          <el-table-column
            prop="adsuser"
            label="ads环境ID"
            align="center"
            width="80"
          />
          <el-table-column prop="username" label="用户名" align="center" />
          <el-table-column prop="email" label="登录账号(note)" align="center" />
          <el-table-column
            prop="password"
            label="登录密码(note)"
            align="center"
          />
          <el-table-column prop="proxies" label="ads代理" align="center">
            <template #default="{ row }">
              <el-tooltip placement="top">
                <template #content>{{ row.proxies }}</template>
                <div>{{ formatContent(row.proxies) }}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="cookie" label="cookie" align="center">
            <template #default="{ row }">
              <el-tooltip placement="top">
                <template #content>{{ row.cookie }}</template>
                <div>{{ formatContent(row.cookie) }}</div>
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column prop="create_at" label="添加时间" align="center" />
          <el-table-column prop="operate" label="操作" align="center">
            <template #default="{ row }">
              <el-button type="primary" link @click="post(row)">
                发文章
              </el-button>
              <el-button type="primary" link @click="revise(row)">
                修改
              </el-button>
              <el-button type="primary" link @click="delet(row)">
                删除
              </el-button>
              <el-button type="primary" link @click="newcookie(row)">
                更新cookie
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
          <el-form-item
            label="ADS环境编号"
            class="form_item"
            v-if="isAdding !== 'cookie'"
          >
            <el-input v-model="infoRef.adsid" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="ADS环境ID" class="form_item">
            <el-input v-model="infoRef.adsuser" autocomplete="off" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="row-bg">
        <el-col :span="8">
          <el-form-item
            label="所属分组"
            class="form_item"
            v-if="isAdding !== 'cookie'"
          >
            <el-input v-model="infoRef.group" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="用户名(发文章用)"
            class="form_item"
            v-if="isAdding !== 'cookie'"
          >
            <el-input v-model="infoRef.username" autocomplete="off" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="row-bg">
        <el-col :span="8">
          <el-form-item
            label="登录账号(note)"
            class="form_item"
            style="width: 400px"
            v-if="isAdding !== 'cookie'"
          >
            <el-input v-model="infoRef.email" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="登录密码(note)"
            class="form_item"
            style="width: 400px"
            v-if="isAdding !== 'cookie'"
          >
            <el-input v-model="infoRef.password" autocomplete="off" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="row-bg">
        <el-col :span="9">
          <el-form-item
            label="ADS 代理ip"
            class="form_item"
            style="width: 400px"
            v-if="isAdding !== 'cookie'"
          >
            <el-input
              v-model="infoRef.proxies"
              autocomplete="off"
              :rows="4"
              type="textarea"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="isAdding !== 'cookie'">
          <span>
            录入格式如下：{"http": "38.174.192.114:45123", "https":
            "38.174.192.114:45123"}
          </span>
        </el-col>
      </el-row>
      <el-row class="row-bg">
        <el-col :span="8">
          <el-form-item
            label="cookie(note)"
            class="form_item"
            style="width: 800px"
            v-if="isAdding !== 'cookie'"
          >
            <el-input
              v-model="infoRef.cookie"
              autocomplete="off"
              :rows="6"
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

  <!-- 发帖 -->
  <el-dialog
    v-model="dialogFormPost"
    :title="popBoxTit"
    destroy-on-close
    width="1500px"
  >
    <el-form :model="infoRef" label-width="auto" style="max-width: 1200px">
      <el-row
        class="row-bg"
        v-show="isAdding === 'batch' || isAdding === 'batchcookie'"
      >
        <span>输入[None] 表示 所有账号都发帖</span>
      </el-row>
      <el-row class="row-bg">
        <el-col :span="8">
          <el-form-item
            label="所属分组"
            class="form_item"
            v-if="isAdding !== 'post'"
          >
            <el-input v-model="infoRef.group" autocomplete="off" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="row-bg">
        <el-col :span="6">
          <el-form-item
            label="用户名(发文章用)"
            class="form_item"
            v-if="isAdding === 'post'"
          >
            <el-input v-model="infoRef.username" autocomplete="off" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="ADS 代理ip"
            class="form_item"
            style="width: 350px"
            v-if="isAdding === 'post'"
          >
            <el-input
              v-model="infoRef.proxies"
              autocomplete="off"
              :rows="6"
              type="textarea"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            v-if="isAdding === 'post'"
            label="cookie(note)"
            class="form_item"
            style="width: 650px"
          >
            <el-input
              v-model="infoRef.cookie"
              autocomplete="off"
              :rows="10"
              type="textarea"
              disabled
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="postsave">发帖</el-button>
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
