<!--
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-01-08 15:09:59
 * @LastEditTime: 2024-09-13 21:34:15
-->
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ArrowRight } from "@element-plus/icons-vue";
import {
  listGo,
  addGo,
  delGo,
  updateGo,
  subtitleGo,
  channelArticelGo,
} from "./YouTubeChannelJS";

const languageprops = { multiple: true };

// 初始化
const popBoxTit = ref("");

const currentPage = ref(1); // 当前页码
const pageSize = ref(10); // 每页显示的数据数量

const listDatas = ref<any[]>([]);

// 状态
const isAdding = ref("add");
const dialogFormVisible = ref(false);
const dialogFormSubtitle = ref(false);
const dialogFormChannelArticel = ref(false);

const infoRef = ref<any>({
  id: "",
  user: "",
  aliases: "",
  channel: "",
  sort: "stock",
  filter: "",
  columns: "",
  language: "",
});

const subtitleRef = ref<any>({
  user: "",
  aliases: "",
  channel: "",
  columns: "",
  sort: "stock",
  ischannle: "0",
  isuser: "0",
  isArticel: "0",
});
const subtitleLanguage = ref<any[]>([
  {
    label: "阿布哈西亚语",
    value: "ab",
  },
  {
    label: "阿法尔语",
    value: "aa",
  },
  {
    label: "南非荷兰语",
    value: "af",
  },
  {
    label: "阿肯语",
    value: "ak",
  },
  {
    label: "阿尔巴尼亚语",
    value: "sq",
  },
  {
    label: "阿姆哈拉语",
    value: "am",
  },
  {
    label: "阿拉伯语",
    value: "ar",
  },
  {
    label: "亚美尼亚语",
    value: "hy",
  },
  {
    label: "阿萨姆语",
    value: "as",
  },
  {
    label: "艾马拉语",
    value: "ay",
  },
  {
    label: "阿塞拜疆语",
    value: "az",
  },
  {
    label: "孟加拉语",
    value: "bn",
  },
  {
    label: "巴什基尔语",
    value: "ba",
  },
  {
    label: "巴斯克语",
    value: "eu",
  },
  {
    label: "白俄罗斯语",
    value: "be",
  },
  {
    label: "博杰普尔语",
    value: "bho ",
  },
  {
    label: "波斯尼亚语",
    value: "bs",
  },
  {
    label: "布列塔尼语",
    value: "br",
  },
  {
    label: "保加利亚语",
    value: "bg",
  },
  {
    label: "缅甸语",
    value: "my",
  },
  {
    label: "加泰罗尼亚语",
    value: "ca",
  },
  {
    label: "宿务语",
    value: "ceb ",
  },
  {
    label: "简体中文",
    value: "zh-Hans ",
  },
  {
    label: "繁体中文",
    value: "zh-Hant ",
  },
  {
    label: "科西嘉语",
    value: "co",
  },
  {
    label: "克罗地亚语",
    value: "hr",
  },
  {
    label: "捷克语",
    value: "cs",
  },
  {
    label: "丹麦语",
    value: "da",
  },
  {
    label: "迪维希语",
    value: "dv",
  },
  {
    label: "荷兰语",
    value: "nl",
  },
  {
    label: "宗卡语",
    value: "dz",
  },
  {
    label: "英语",
    value: "en",
  },
  {
    label: "世界语",
    value: "eo",
  },
  {
    label: "爱沙尼亚语",
    value: "et",
  },
  {
    label: "埃维语",
    value: "ee",
  },
  {
    label: "法罗语",
    value: "fo",
  },
  {
    label: "斐济语",
    value: "fj",
  },
  {
    label: "菲律宾语",
    value: "fil ",
  },
  {
    label: "芬兰语",
    value: "fi",
  },
  {
    label: "法语",
    value: "fr",
  },
  {
    label: "加语",
    value: "gaa ",
  },
  {
    label: "加利西亚语",
    value: "gl",
  },
  {
    label: "卢干达语",
    value: "lg",
  },
  {
    label: "格鲁吉亚语",
    value: "ka",
  },
  {
    label: "德语",
    value: "de",
  },
  {
    label: "希腊语",
    value: "el",
  },
  {
    label: "瓜拉尼语",
    value: "gn",
  },
  {
    label: "古吉拉特语",
    value: "gu",
  },
  {
    label: "海地克里奥尔语",
    value: "ht",
  },
  {
    label: "豪萨语",
    value: "ha",
  },
  {
    label: "夏威夷语",
    value: "haw ",
  },
  {
    label: "希伯来语",
    value: "iw",
  },
  {
    label: "印地语",
    value: "hi",
  },
  {
    label: "苗语",
    value: "hmn ",
  },
  {
    label: "匈牙利语",
    value: "hu",
  },
  {
    label: "冰岛语",
    value: "is",
  },
  {
    label: "伊博语",
    value: "ig",
  },
  {
    label: "印度尼西亚语",
    value: "id",
  },
  {
    label: "爱尔兰语",
    value: "ga",
  },
  {
    label: "意大利语",
    value: "it",
  },
  {
    label: "日语",
    value: "ja",
  },
  {
    label: "爪哇语",
    value: "jv",
  },
  {
    label: "格陵兰语",
    value: "kl",
  },
  {
    label: "卡纳达语",
    value: "kn",
  },
  {
    label: "哈萨克语",
    value: "kk",
  },
  {
    label: "卡西语",
    value: "kha ",
  },
  {
    label: "高棉语",
    value: "km",
  },
  {
    label: "基尼亚万达语",
    value: "rw",
  },
  {
    label: "韩语",
    value: "ko",
  },
  {
    label: "克里奥尔语",
    value: "kri ",
  },
  {
    label: "库尔德语",
    value: "ku",
  },
  {
    label: "吉尔吉斯语",
    value: "ky",
  },
  {
    label: "老挝语",
    value: "lo",
  },
  {
    label: "拉丁语",
    value: "la",
  },
  {
    label: "拉脱维亚语",
    value: "lv",
  },
  {
    label: "林加拉语",
    value: "ln",
  },
  {
    label: "立陶宛语",
    value: "lt",
  },
  {
    label: "卢奥语",
    value: "luo ",
  },
  {
    label: "卢森堡语",
    value: "lb",
  },
  {
    label: "马其顿语",
    value: "mk",
  },
  {
    label: "马尔加什语",
    value: "mg",
  },
  {
    label: "马来语",
    value: "ms",
  },
  {
    label: "马拉雅拉姆语",
    value: "ml",
  },
  {
    label: "马耳他语",
    value: "mt",
  },
  {
    label: "曼岛语",
    value: "gv",
  },
  {
    label: "毛利语",
    value: "mi",
  },
  {
    label: "马拉地语",
    value: "mr",
  },
  {
    label: "蒙古语",
    value: "mn",
  },
  {
    label: "毛里求斯克里奥尔语",
    value: "mfe ",
  },
  {
    label: "尼泊尔语",
    value: "ne",
  },
  {
    label: "尼瓦尔语",
    value: "new ",
  },
  {
    label: "北索托语",
    value: "nso ",
  },
  {
    label: "挪威语",
    value: "no",
  },
  {
    label: "尼扬贾语",
    value: "ny",
  },
  {
    label: "奥克语",
    value: "oc",
  },
  {
    label: "奥里亚语",
    value: "or",
  },
  {
    label: "奥罗莫语",
    value: "om",
  },
  {
    label: "奥塞梯语",
    value: "os",
  },
  {
    label: "邦板牙语",
    value: "pam ",
  },
  {
    label: "普什图语",
    value: "ps",
  },
  {
    label: "波斯语",
    value: "fa",
  },
  {
    label: "波兰语",
    value: "pl",
  },
  {
    label: "葡萄牙语",
    value: "pt",
  },
  {
    label: "葡萄牙语1",
    value: "pt-PT ",
  },
  {
    label: "旁遮普语",
    value: "pa",
  },
  {
    label: "克丘亚语",
    value: "qu",
  },
  {
    label: "罗马尼亚语",
    value: "ro",
  },
  {
    label: "基隆迪语",
    value: "rn",
  },
  {
    label: "俄语",
    value: "ru",
  },
  {
    label: "萨摩亚语",
    value: "sm",
  },
  {
    label: "桑戈语",
    value: "sg",
  },
  {
    label: "梵语",
    value: "sa",
  },
  {
    label: "苏格兰盖尔语",
    value: "gd",
  },
  {
    label: "塞尔维亚语",
    value: "sr",
  },
  {
    label: "塞舌尔克里奥尔语",
    value: "crs ",
  },
  {
    label: "绍纳语",
    value: "sn",
  },
  {
    label: "信德语",
    value: "sd",
  },
  {
    label: "僧伽罗语",
    value: "si",
  },
  {
    label: "斯洛伐克语",
    value: "sk",
  },
  {
    label: "斯洛文尼亚语",
    value: "sl",
  },
  {
    label: "索马里语",
    value: "so",
  },
  {
    label: "南索托语",
    value: "st",
  },
  {
    label: "西班牙语",
    value: "es",
  },
  {
    label: "巽他语",
    value: "su",
  },
  {
    label: "斯瓦希里语",
    value: "sw",
  },
  {
    label: "斯瓦特语",
    value: "ss",
  },
  {
    label: "瑞典语",
    value: "sv",
  },
  {
    label: "塔吉克语",
    value: "tg",
  },
  {
    label: "泰米尔语",
    value: "ta",
  },
  {
    label: "塔塔尔语",
    value: "tt",
  },
  {
    label: "泰卢固语",
    value: "te",
  },
  {
    label: "泰语",
    value: "th",
  },
  {
    label: "藏语",
    value: "bo",
  },
  {
    label: "提格利尼亚语",
    value: "ti",
  },
  {
    label: "汤加语",
    value: "to",
  },
  {
    label: "宗加语",
    value: "ts",
  },
  {
    label: "茨瓦纳语",
    value: "tn",
  },
  {
    label: "通布卡语",
    value: "tum ",
  },
  {
    label: "土耳其语",
    value: "tr",
  },
  {
    label: "土库曼语",
    value: "tk",
  },
  {
    label: "乌克兰语",
    value: "uk",
  },
  {
    label: "乌尔都语",
    value: "ur",
  },
  {
    label: "维吾尔语",
    value: "ug",
  },
  {
    label: "乌兹别克语",
    value: "uz",
  },
  {
    label: "文达语",
    value: "ve",
  },
  {
    label: "越南语",
    value: "vi",
  },
  {
    label: "瓦瑞语",
    value: "war ",
  },
  {
    label: "威尔士语",
    value: "cy",
  },
  {
    label: "弗里斯兰语",
    value: "fy",
  },
  {
    label: "沃洛夫语",
    value: "wo",
  },
  {
    label: "科萨语",
    value: "xh",
  },
  {
    label: "意第绪语",
    value: "yi",
  },
  {
    label: "约鲁巴语",
    value: "yo",
  },
  {
    label: "祖鲁语",
    value: "zu",
  },
]);

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

const subtitle = () => {
  dialogFormSubtitle.value = true;
  popBoxTit.value = "提取字幕";
  isAdding.value = "subtitle";
};

const channelArticel = () => {
  dialogFormChannelArticel.value = true;
  popBoxTit.value = "字幕转文章";
  isAdding.value = "articel";
};

const add = () => {
  dialogFormVisible.value = true;
  popBoxTit.value = "添加";
  isAdding.value = "add";
};

const revise = (row) => {
  dialogFormVisible.value = true;
  popBoxTit.value = "修改";
  isAdding.value = "revise";
  console.log(typeof row.language);
  console.log("transformData", transformData(row.language));
  infoRef.value = {
    id: row.id,
    user: row.user,
    channel: row.channel,
    sort: row.sort,
    filter: row.filter,
    columns: row.columns,
    language: transformData(row.language),
  };
};

const cancel = () => {
  initdd();
};

const channelSave = async () => {
  console.log("准提交数据：", subtitleRef.value);
  console.log("当前提交行为:", isAdding.value);
  const data = {
    aliases: subtitleRef.value.aliases,
    columns: subtitleRef.value.columns,
  };

  await channelArticelGo(data);
  await initdd();
};
const subtitleSave = async () => {
  console.log("准提交数据：", subtitleRef.value);
  console.log("当前提交行为:", isAdding.value);
  const data = {
    user: subtitleRef.value.user,
    aliases: subtitleRef.value.aliases,
    sort: subtitleRef.value.sort,
  };

  await subtitleGo(data);
  await initdd();
};

const save = async () => {
  console.log("准提交数据：", infoRef.value);
  console.log("当前提交行为:", isAdding.value);
  if (isAdding.value === "add") {
    const data = {
      user: infoRef.value.user,
      aliases: infoRef.value.aliases,
      channel: infoRef.value.channel,
      sort: infoRef.value.sort,
      columns: infoRef.value.columns,
      filter: infoRef.value.filter,
      language: infoRef.value.language,
    };

    await addGo(data);
  } else {
    const data = {
      id: infoRef.value.id,
      user: infoRef.value.user,
      channel: infoRef.value.channel,
      sort: infoRef.value.sort,
      filter: infoRef.value.filter,
      columns: infoRef.value.columns,
      language: infoRef.value.language,
    };
    await updateGo(data);
  }
  await initdd();
};

// 还原弹框输入
const initdd = async () => {
  // 还原初始化
  isAdding.value = "add";

  infoRef.value = {
    id: "",
    user: "",
    aliases: "",
    channel: "",
    sort: "stock",
    filter: "",
    columns: "",
    language: "",
  };
  subtitleRef.value = {
    user: "",
    aliases: "",
    channel: "",
    sort: "stock",
    ischannle: "0",
    isuser: "0",
    isArticel: "0",
  };
  dialogFormVisible.value = false;
  dialogFormSubtitle.value = false;
  dialogFormChannelArticel.value = false;
  await initData();
};

const transformData = (languageInput) => {
  languageInput = languageInput.replace(/'/g, '"'); // 替换所有的单引号为双引号
  let arr = JSON.parse(languageInput); // 解析字符串为数组
  let newData = arr.map((item) => [item]);
  return newData;
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
      <el-breadcrumb-item>YouTube字幕转文章</el-breadcrumb-item>
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
      <el-button type="primary" plain @click="subtitle">提取字幕</el-button>
    </el-col>

    <el-col :span="2">
      <div class="grid-content ep-bg-purple" />
      <el-button type="primary" plain @click="channelArticel">
        字幕转文章
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
          <el-table-column prop="sort" label="分类" align="center" width="80" />
          <el-table-column
            prop="channel"
            label="频道"
            align="center"
            width="150"
          />
          <el-table-column prop="aliases" label="数据表名" align="center" />
          <el-table-column prop="user" label="播主ID" align="center" />
          <el-table-column prop="columns" label="播放列表" align="center" />
          <el-table-column prop="filter" label="过滤关键字" align="center" />
          <el-table-column prop="language" label="字幕语言" align="center" />
          <el-table-column prop="create_at" label="添加时间" align="center" />
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

  <!-- 弹框 添加/修改 -->
  <el-dialog
    v-model="dialogFormVisible"
    :title="popBoxTit"
    width="1400px"
    top="10px"
    destroy-on-close
  >
    <el-form :model="infoRef" label-width="auto" style="max-width: 1200px">
      <el-row class="row-bg">
        <span style="color: red; margin-bottom: 10px">
          数据库表命名，用于建表使用，只能用小写英文字母，数字，「-」或者「_ 」
        </span>
        <span>
          博主id、播放列表，输入框可使用英文[^]
          间隔，批量同步入库：批量录入博主的时候，要播放列表页要有同等数量！！！播放列表录入规则：["楽天市場購入品紹介","家計簿公開"]^["楽しく賢く資産運用する主婦りり","主婦の投資話"]！！标题过滤关键字规则：["の勉強草食系投資家LoK","草食系投資家LoK"]^["の勉強草食系","投資家LoK"]
        </span>
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
          <el-form-item label="字幕语言" class="form_item">
            <el-cascader
              v-model="infoRef.language"
              :options="subtitleLanguage"
              :props="languageprops"
              collapse-tags
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="分类" class="form_item">
            <el-input v-model="infoRef.sort" autocomplete="off" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="row-bg">
        <el-col :span="8">
          <el-form-item label="频道" class="form_item">
            <el-input v-model="infoRef.channel" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="数据表名"
            class="form_item"
            v-if="isAdding === 'add'"
          >
            <el-input v-model="infoRef.aliases" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="播主ID" class="form_item">
            <el-input
              v-model="infoRef.user"
              autocomplete="off"
              :rows="3"
              type="textarea"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="播放列表" class="form_item">
            <el-input
              v-model="infoRef.columns"
              autocomplete="off"
              :rows="3"
              type="textarea"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="过滤关键字" class="form_item">
            <el-input
              v-model="infoRef.filter"
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

  <!-- 提取字幕 -->
  <el-dialog
    v-model="dialogFormSubtitle"
    :title="popBoxTit"
    width="1400px"
    top="10px"
    destroy-on-close
  >
    <el-form :model="subtitleRef" label-width="auto" style="max-width: 1200px">
      <el-row class="row-bg">
        <span>谨慎选仅分类，数量较大情况下会很耗资源</span>
      </el-row>

      <el-row class="row-bg">
        <el-col :span="8">
          <el-form-item label="分类" class="form_item">
            <el-input v-model="subtitleRef.sort" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="是否选频道" class="form_item">
            <div class="my-2 flex items-center text-sm">
              <el-radio-group class="ml-4" v-model="subtitleRef.ischannle">
                <el-radio id="sortyes" label="0" size="large">是</el-radio>
                <el-radio id="sortnot" label="1" size="large">
                  提取这分类下所有播主
                </el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="row-bg" v-show="subtitleRef.ischannle == '0'">
        <el-col :span="8">
          <el-form-item label="频道(数据库表名)" class="form_item">
            <el-input v-model="subtitleRef.aliases" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="是否选播主" class="form_item">
            <div class="my-2 flex items-center text-sm">
              <el-radio-group class="ml-4" v-model="subtitleRef.isuser">
                <el-radio id="channelyes" label="0" size="large">是</el-radio>
                <el-radio id="channelnot" label="1" size="large">
                  提取这分类下所有播主
                </el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row
        class="row-bg"
        v-show="subtitleRef.isuser == '0' && subtitleRef.ischannle == '0'"
      >
        <el-col :span="8">
          <el-form-item label="播主ID" class="form_item">
            <el-input
              v-model="subtitleRef.user"
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
        <el-button type="primary" @click="subtitleSave">保存</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 字幕转 文章 -->
  <el-dialog
    v-model="dialogFormChannelArticel"
    :title="popBoxTit"
    width="1400px"
    top="10px"
    destroy-on-close
  >
    <el-form :model="subtitleRef" label-width="auto" style="max-width: 1200px">
      <el-row class="row-bg">
        <span>输入[None] 时 会将所有频道的字幕txt文件都执行转文章</span>
      </el-row>
      <el-row class="row-bg">
        <el-col :span="6">
          <el-form-item label="谁？转文章" class="form_item">
            <div class="my-2 flex items-center text-sm">
              <el-radio-group class="ml-4" v-model="subtitleRef.isArticel">
                <el-radio id="channelnone" label="0" size="large">
                  所有频道
                </el-radio>
                <el-radio id="channeluser" label="1" size="large">
                  仅此频道(数据库表名)
                </el-radio>
                <el-radio id="channelcolumns" label="2" size="large">
                  仅此频道的此播放列表
                </el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="row-bg">
        <el-col :span="8" v-show="subtitleRef.isArticel == '0'">
          <el-form-item label="所有频道的字幕" class="form_item">
            <el-input
              v-model="subtitleRef.aliases"
              autocomplete="off"
              placeholder="请输入 None"
            />
          </el-form-item>
        </el-col>
        <el-col :span="10" v-show="subtitleRef.isArticel != '0'">
          <el-form-item label="仅此频道(数据库表名)" class="form_item">
            <el-input
              v-model="subtitleRef.aliases"
              autocomplete="off"
              placeholder="请输入具体频道（数据库名）"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8" v-show="subtitleRef.isArticel == '2'">
          <el-form-item label="此播放目录" class="form_item">
            <el-input
              v-model="subtitleRef.columns"
              autocomplete="off"
              placeholder="请输入具体播放列表名称"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="channelSave">转文章</el-button>
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
./YouTubeChannelJS
