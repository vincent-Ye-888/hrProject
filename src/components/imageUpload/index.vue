<template>
  <div>
    <!--
      必填
      action 必填的图片上传地址, 后面要对接腾讯云, 只是放一个 # 敷衍一下
      file-list 是管理上传文件的数组

      影响显示
      list-type 决定文件列表的显示方式
      :class 动态类名可以控制有图片时隐藏上传图标

      各个阶段的钩子
      on-preview 指定点击放大镜后的处理, 有了这个函数放大镜才会出现
      on-remove 删除后触发
      on-change 图片数据改变(添加)后触发
      http-request 替代了默认 action 上传行为,为后续腾讯云连接座准备
     -->
    <el-upload
      action="#"
      list-type="picture-card"
      :file-list="fileList"
      :on-preview="preview"
      :on-remove="onRemove"
      :on-change="onChange"
      :http-request="upload"
      :before-upload="beforeUpload"
      :class="{disable:fileList.length > 0}"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <!-- 放大镜--弹窗 -->
    <el-dialog title="预览" :visible="showDialog" @close="showDialog = false">
      <el-row type="flex" justify="center">
        <img :src="previewURL" alt="">
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fileList: [
        {
          url: 'https://5b0988e595225.cdn.sohucs.com/images/20180104/ca6b0c5652b74a7780d9a5900f3df5de.jpeg'
        }
      ],
      showDialog: false,
      previewURL: ''
    }
  },
  methods: {
    preview(file) {
      this.showDialog = true
      console.log(file)
      this.previewURL = file.url
    },
    onRemove(file, fileList) {
      // 删除文件的钩子
      // 根据文档有两个参数
      // 1.被删除的文件本身
      // 2.删除后最新的文件列表
      this.fileList = [...fileList]
    },
    onChange(file, fileList) {
      // 跟 onRemove 一样
      // 饿了么会给我们回调当前最新的文件数组
      // 用来覆盖 原来的数据即可
      this.fileList = [...fileList]
    },
    upload(data) {
      // 拦截掉默认上传到 action 的动作
      // 后续应该连接腾讯云进行上传
      console.log(data)
    },
    beforeUpload(file) {
      // 文件上传前要对文件进行校验
      // 校验类型
      const types = ['image/jpeg', 'image/gif', 'image/png', 'image/bmp']
      if (!types.includes(file.type)) {
        this.$message.error('上传的图片只能是 jpeg/gif/png/bmp 格式')
        return false
      }
      // 校验文件大小
      const maxSize = 5 * 1024 * 1024
      if (maxSize < file.size) {
        this.$message.error('上传的图片大小不能超过5M')
        return false
      }

      return true
    }
  }
}
</script>

<style lang="scss" scoped>
// /deep/ .disable {
::v-deep .disable {
  .el-upload--picture-card {
    display: none;
  }
}
</style>
