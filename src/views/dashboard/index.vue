<template>
  <div class="dashboard-container">
    <el-card shadow="never">
      <el-row justify="space-between">
        <el-col :span="18" :xs="24">
          <div class="flex h-full items-center">
            <img :src="logo" class="rounded-full mr-10px w24px h24px" />
            <div>
              <p>{{ greetings }}</p>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "Dashboard",
  inheritAttrs: false,
});

// import WebSocketManager from "@/utils/websocket";
import router from "@/router";
import logo from "@/assets/logo.png";
import { useUserStore } from "@/store/modules/user";

const userStore = useUserStore();
const date: Date = new Date();
const greetings = computed(() => {
  const hours = date.getHours();
  if (hours >= 6 && hours < 8) {
    return "晨起披衣出草堂，轩窗已自喜微凉🌅！";
  } else if (hours >= 8 && hours < 12) {
    return "上午好，" + userStore.user.username + "！";
  } else if (hours >= 12 && hours < 18) {
    return "下午好，" + userStore.user.username + "！";
  } else if (hours >= 18 && hours < 24) {
    return "晚上好，" + userStore.user.username + "！";
  } else {
    return "偷偷向银河要了一把碎星，只等你闭上眼睛撒入你的梦中，晚安🌛！";
  }
});

onMounted(() => {
  // loadVisitStatsData();
});
</script>

<style lang="scss" scoped>
.dashboard-container {
  position: relative;
  padding: 24px;
}
</style>
