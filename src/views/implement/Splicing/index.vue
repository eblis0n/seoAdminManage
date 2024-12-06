<!--
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-01-08 15:09:59
 * @LastEditTime: 2024-11-28 19:56:24
-->
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { splicingList, addGo, publishGo, clearGo, totalGo } from "./splicingJS";
import type { splicingTotal } from "@/types/splicing.d.ts";
import { useSupportedPlatformsHook } from "@/store/modules/public";
import { formatGenre, formatSort } from "@/utils/Formatter/index";
const supportedPlatformsStore = useSupportedPlatformsHook();

const currentPage = ref(1); // 当前页码
const pageSize = ref(10); // 每页显示的数据数量

const listDatas = ref<any[]>([]);
const platforOptions = ref<any[]>([]);

const popBoxTit = ref("");

const loading = ref(false);
const dialogFormVisible = ref(false);

// 使用明确类型
const totalDatas = ref<any[]>([]);

const infoRef = ref<any>({
  zyurl: "",
  url: "",
  alt_text: "",
  title_alt: "",
  stacking_min: "250",
  stacking_max: "290",
  platform: "",
  genre: "0",
  sort: "0",
  postingStyle: "0",
  isarts: "1",
  group: "all",
});

// 接口相关
const initData = async () => {
  loading.value = true;
  try {
    const [listData, totalData, _] = await Promise.all([
      splicingList(),
      totalGo(),
      supportedPlatformsStore.fetchSupportedPlatforms(),
    ]);
    listDatas.value = listData;

    console.log("totalData", totalData);
    // 转换为数组格式
    const convertedData: splicingTotal[] = Object.entries(totalData).map(
      ([key, value]) => ({
        platform: key.replace("_total", ""),
        total: value,
      })
    );
    totalDatas.value = convertedData;

    platforOptions.value = supportedPlatformsStore.supportedPlatforms;
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

const refresh = () => {
  initData();
};

const Add = () => {
  // console.log("新增", infoRef.value);
  popBoxTit.value = "新增";
  dialogFormVisible.value = true;
};

const Publish = () => {
  // console.log("新增", infoRef.value);
  popBoxTit.value = "发布";
  dialogFormVisible.value = true;
};

const Clear = async () => {
  loading.value = true;
  try {
    await clearGo();
    ElMessage.error("清空成功");
  } catch (error) {
    console.error("清空失败", error);
    ElMessage.error("清空失败");
  } finally {
    resetInfo();
    loading.value = false;
  }
};

const save = async () => {
  console.log("准提交数据：", infoRef.value);
  console.log("当前提交行为:", popBoxTit.value);

  dialogFormVisible.value = false;
  loading.value = true;

  try {
    if (popBoxTit.value === "新增") {
      const data = {
        zyurl: infoRef.value.zyurl,
        url: infoRef.value.url,
        platform: infoRef.value.platform,
        genre: infoRef.value.genre,
        sort: infoRef.value.sort,
      };
      await addGo(data);
    } else {
      const data = {
        title_alt: infoRef.value.title_alt,
        alt_text: infoRef.value.alt_text,
        stacking_min: infoRef.value.stacking_min,
        stacking_max: infoRef.value.stacking_max,
        platform: infoRef.value.platform,
        genre: infoRef.value.genre,
        group: infoRef.value.group,
        sort: infoRef.value.sort,
        postingStyle: infoRef.value.postingStyle,
        isarts: infoRef.value.isarts,
      };
      await publishGo(data);
    }
  } catch (error) {
    console.log("出现异常:", error);
  } finally {
    loading.value = false;
    resetInfo();
  }
};

const Cancel = () => {
  resetInfo();
};

// 还原弹框输入
const resetInfo = async () => {
  // 还原初始化

  popBoxTit.value = "";
  dialogFormVisible.value = false;
  infoRef.value = {
    zyurl: "",
    url: "",
    alt_text: "",
    title_alt: "",
    stacking_min: "250",
    stacking_max: "290",
    platform: "",
    genre: "0",
    sort: "0",
    postingStyle: "0",
    isarts: "1",
    group: "all",
  };

  await initData();
};
const handleClose = () => {
  resetInfo();
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
      <el-row class="row-bg" :gutter="20">
        <el-col :span="4">
          <span>
            blogger 总:
            {{
              totalDatas.find((item) => item.platform === "blogger")?.total || 0
            }}
            条
          </span>
        </el-col>
        <el-col :span="4">
          <span>
            telegra 总:
            {{
              totalDatas.find((item) => item.platform === "telegra")?.total || 0
            }}
            条
          </span>
        </el-col>
        <el-col :span="4">
          <span>
            note 总:
            {{
              totalDatas.find((item) => item.platform === "note")?.total || 0
            }}
            条
          </span>
        </el-col>
      </el-row>
      <el-row class="row-bg">
        <el-col :span="2">
          <div class="grid-content ep-bg-purple" />
          <el-button type="primary" plain @click="refresh">手动刷新</el-button>
        </el-col>
        <el-col :span="2">
          <div class="grid-content ep-bg-purple" />
          <el-button type="primary" plain @click="Add">添加</el-button>
        </el-col>
        <el-col :span="2">
          <div class="grid-content ep-bg-purple" />
          <el-button type="primary" plain @click="Publish">发布</el-button>
        </el-col>
        <el-col :span="2">
          <div class="grid-content ep-bg-purple" />
          <el-button type="primary" plain @click="Clear">清空</el-button>
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
              <el-table-column prop="url" label="url" align="center" />
              <el-table-column
                prop="platform"
                label="投放平台"
                align="center"
              />
              <el-table-column
                prop="sort"
                label="分类"
                align="center"
                :formatter="formatSort"
              />
              <el-table-column
                prop="genre"
                label="类型"
                align="center"
                :formatter="formatGenre"
              />
              <el-table-column
                prop="create_at"
                label="添加时间"
                align="center"
              />
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
          <el-row class="row-bg" :gutter="20">
            <span>发 NOTE 之前，记得先检查 cookie 是否已经更新过哦！！！</span>
          </el-row>
          <el-row class="row-bg" :gutter="20">
            <el-col :span="6">
              <el-form-item
                class="form_item flex items-center"
                label="投放平台"
              >
                <div class="flex items-center">
                  <el-select
                    v-model="infoRef.platform"
                    placeholder="投放平台"
                    size="large"
                    style="width: 240px"
                  >
                    <el-option
                      v-for="item in platforOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item class="form_item flex items-center" label="类型">
                <div class="flex items-center">
                  <el-radio-group
                    v-model="infoRef.genre"
                    class="flex items-center"
                  >
                    <el-radio label="0" size="large">重定向</el-radio>
                    <el-radio label="1" size="large">镜像</el-radio>
                    <el-radio label="2" size="large">留痕</el-radio>
                  </el-radio-group>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item class="form_item flex items-center" label="分类">
                <div class="flex items-center">
                  <el-radio-group
                    v-model="infoRef.sort"
                    class="flex items-center"
                  >
                    <el-radio label="0" size="large">拼接</el-radio>
                    <el-radio label="1" size="large">不拼接</el-radio>
                  </el-radio-group>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="row-bg" :gutter="20">
            <el-col :span="6">
              <el-form-item
                class="form_item flex items-center"
                label="是否贴文"
                v-if="popBoxTit === '发布'"
              >
                <div class="flex items-center">
                  <el-radio-group
                    v-model="infoRef.isarts"
                    class="flex items-center"
                  >
                    <el-radio label="0" size="large">贴文</el-radio>
                    <el-radio label="1" size="large">不帖文</el-radio>
                  </el-radio-group>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item
                class="form_item flex items-center"
                label="文章展示"
                v-if="popBoxTit === '发布'"
              >
                <div class="flex items-center">
                  <el-radio-group
                    v-model="infoRef.postingStyle"
                    class="flex items-center"
                  >
                    <el-radio label="0" size="large">A标签文案</el-radio>
                    <el-radio label="1" size="large">A链接</el-radio>
                    <el-radio label="2" size="large">末尾链接</el-radio>
                  </el-radio-group>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="row-bg" :gutter="20" v-show="popBoxTit === '新增'">
            <el-col :span="8">
              <el-form-item
                label="目标URL"
                class="form_item"
                v-if="popBoxTit === '新增'"
              >
                <el-input
                  v-model="infoRef.url"
                  style="width: 240px"
                  :autosize="{ minRows: 10, maxRows: 20 }"
                  type="textarea"
                  placeholder="输入 URL"
                  autocomplete="off"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="资源URL"
                class="form_item"
                v-if="popBoxTit === '新增' && infoRef.sort === '0'"
              >
                <el-input
                  v-model="infoRef.zyurl"
                  style="width: 240px"
                  :autosize="{ minRows: 10, maxRows: 20 }"
                  type="textarea"
                  placeholder="输入 资源URL"
                  autocomplete="off"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="row-bg" :gutter="20" v-show="popBoxTit === '发布'">
            <el-col :span="6">
              <el-form-item
                label="标题"
                class="form_item"
                v-if="popBoxTit === '发布'"
              >
                <el-input v-model="infoRef.title_alt" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="A标签展示文案"
                class="form_item"
                v-if="popBoxTit === '发布' && infoRef.postingStyle === '0'"
              >
                <el-input v-model="infoRef.alt_text" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="row-bg" :gutter="20" v-show="popBoxTit === '发布'">
            <el-col :span="6">
              <el-form-item
                label="最少堆叠"
                class="form_item"
                v-if="popBoxTit === '发布'"
              >
                <el-input v-model="infoRef.stacking_min" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="最多堆叠"
                class="form_item"
                v-if="popBoxTit === '发布'"
              >
                <el-input v-model="infoRef.stacking_max" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="分组"
                class="form_item"
                v-if="popBoxTit === '发布' && infoRef.platform !== 'telegra'"
              >
                <el-input v-model="infoRef.group" autocomplete="off" />
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
      <!-- 弹框 end -->
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
</style>
