<template>
  <view>
    <up-input placeholder="请输入内容" border="surround" shape="circle" v-model="value" @change="change"
      clearable></up-input>
  </view>
</template>

<script setup lang="ts">
const value = ref('');
const change = (e: any) => {
  console.log('change', e);
};

</script>

<style></style>