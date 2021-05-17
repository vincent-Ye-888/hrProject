<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <br>
    <ImageUpload />
    <canvas id="mycanvas" ref="canvas" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import QRcode from 'qrcode'
// 二维码就是一个字符串的信息进行编码压缩的结果
// 我们会将这个二维码生成在一个 canvas 标签当中
// 使用方法
// QRCode.toCanvas(dom, str)
export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  // 生命周期钩子函数
  mounted() {
    QRcode.toCanvas(this.$refs.canvas, '我肯定,在一百年前,就曾爱过你', {
      width: 300,
      color: {
        dark: '#666',
        light: 'pink'
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
