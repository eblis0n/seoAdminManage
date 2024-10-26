<!--
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-01-08 15:09:59
 * @LastEditTime: 2024-10-24 14:33:29
-->
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElLoading } from "element-plus";
import type { MenuVO } from "@/types/menu.d.ts";
import { menulist } from "./menuJS";

const currentPage = ref(1); // 当前页码
const pageSize = ref(10); // 每页显示的数据数量
const listDatas = ref<any[]>([]);
// 初始化
const popBoxTit = ref("");
const isAdding = ref(true);

const dialogFormVisible = ref(false);

// const infoRef = ref<any>({ id: "", name: "", address: "", state: "0" });
// 接口相关
const initData = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.8)",
  });

  try {
    await new Promise((resolve) => setTimeout(resolve, 3000)); // 模拟5秒延迟
    listDatas.value = await menulist();

    // console.log(listDatas.value); // 打印返回的数据
  } catch (error) {
    console.error("获取数据失败", error); // 捕获错误
  } finally {
    loading.close();
  }
};

onMounted(async () => {
  await initData();
});

// 还原弹框输入
const resetInfo = async () => {
  // 还原初始化
  isAdding.value = true;
  popBoxTit.value = "";
  // infoRef.value = { id: "", name: "", address: "", state: "0" };
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
  <div class="menu-container">
    <el-card shadow="never">
      <el-row class="row-bg"></el-row>
      <el-row class="row-bg">
        <el-col>
          <el-scrollbar>
            <el-table
              highlight-current-row
              row-key="id"
              :expand-row-keys="['1']"
              :tree-props="{
                children: 'children',
                hasChildren: 'hasChildren',
              }"
              height="600"
              style="width: 100%"
              :data="
                listDatas.slice(
                  (currentPage - 1) * pageSize,
                  currentPage * pageSize
                )
              "
            >
              <el-table-column label="菜单名称" min-width="200">
                <template #default="scope">
                  <template
                    v-if="
                      scope.row.icon && scope.row.icon.startsWith('el-icon')
                    "
                  >
                    <el-icon style="vertical-align: -0.15em">
                      <component :is="scope.row.icon.replace('el-icon-', '')" />
                    </el-icon>
                  </template>
                  <template v-else-if="scope.row.icon">
                    <svg-icon :icon-class="scope.row.icon" />
                  </template>
                  <template v-else>
                    <svg-icon icon-class="menu" />
                  </template>
                  {{ scope.row.name }}
                </template>
              </el-table-column>

              <el-table-column label="类型" align="center" width="80">
                <template #default="scope">
                  <el-tag
                    v-if="scope.row.type === MenuTypeEnum.CATALOG"
                    type="warning"
                  >
                    目录
                  </el-tag>
                  <el-tag
                    v-if="scope.row.type === MenuTypeEnum.MENU"
                    type="success"
                  >
                    菜单
                  </el-tag>
                  <el-tag
                    v-if="scope.row.type === MenuTypeEnum.BUTTON"
                    type="danger"
                  >
                    按钮
                  </el-tag>
                  <el-tag
                    v-if="scope.row.type === MenuTypeEnum.EXTLINK"
                    type="info"
                  >
                    外链
                  </el-tag>
                </template>
              </el-table-column>

              <el-table-column
                label="路由名称"
                align="left"
                width="150"
                prop="routeName"
              />

              <el-table-column
                label="路由路径"
                align="left"
                width="150"
                prop="routePath"
              />

              <el-table-column
                label="组件路径"
                align="left"
                width="250"
                prop="component"
              />

              <el-table-column
                label="权限标识"
                align="center"
                width="200"
                prop="perm"
              />

              <el-table-column label="状态" align="center" width="80">
                <template #default="scope">
                  <el-tag v-if="scope.row.visible === 1" type="success">
                    显示
                  </el-tag>
                  <el-tag v-else type="info">隐藏</el-tag>
                </template>
              </el-table-column>

              <el-table-column
                label="排序"
                align="center"
                width="80"
                prop="sort"
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
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.menu-container {
  position: relative;
  padding: 24px;
}

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
