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
    <el-progress v-if="showPercent" :percentage="percentage" style="width: 146px" :show-text="false" />
    <!-- 放大镜--弹窗 -->
    <el-dialog title="预览" :visible="showDialog" @close="showDialog = false">
      <el-row type="flex" justify="center">
        <img :src="previewURL" alt="">
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKIDGORJxNZU8XgphIcfRwB9qGPHsCF3arqa',
  SecretKey: 'UhdJlxsWt1rRknZ4JHyOinhOuOibQ7f6'
})
export default {
  data() {
    return {
      fileList: [],
      showDialog: false,
      previewURL: '',
      currentFileUid: '',
      percentage: 0,
      showPercent: false
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
    beforeUpload(file) {
      // 文件上传前要对文件进行校验
      // 校验类型
      const types = ['image/jpeg', 'image/gif', 'image/png', 'image/bmp']
      if (!types.includes(file.type)) {
        this.$message.error('上传的图片只能是 jpeg/gif/png/bmp 格式')
        return false
      }
      // 校验文件大小
      const maxSize = 50 * 1024 * 1024
      if (maxSize < file.size) {
        this.$message.error('上传的图片大小不能超过50M')
        return false
      }
      // 已经确定当前上传的就是当前的这个file了
      // this.currentFileUid = file.uid
      // console.log(this.currentFileUid)
      this.showPercent = true
      return true
    },
    upload(params) {
      // 拦截掉默认上传到 action 的动作
      // 后续应该连接腾讯云进行上传
      // console.log(params.file)
      // 执行上传操作
      cos.putObject({
        Bucket: 'vue-project-1305902240', // 存储桶名称
        Region: 'ap-guangzhou', // 地区代码
        Key: params.file.size + params.file.name, // 上传后的文件名,在前面加上图片的大小,能够防止同名图片的覆盖
        Body: params.file, // 要上传的文件对象
        StorageClass: 'STANDARD', // 上传的模式类型 直接默认 标准模式即可
        // 上传到腾讯云 =》 哪个存储桶 哪个地域的存储桶 文件  格式  名称 回调
        onProgress: (progressData) => {
          // console.log(progressData)
          this.percentage = progressData.percent * 100
        }
      }, (err, data) => {
        // data是上传完毕后的回调,返回数据之后 应该如何处理
        console.log(err || data)
        // data中有一个statusCode === 200 的时候说明上传成功
        if (!err && data.statusCode === 200) {
          // 此时说明文件上传成功  要获取成功的返回地址
          // fileList才能显示到上传组件上 此时我们要将fileList中的数据的url地址变成 现在上传成功的地址
          // 目前虽然是一张图片 但是请注意 我们的fileList是一个数组
          // 需要知道当前上传成功的是哪一张图片
          this.fileList[0].url = 'http://' + data.Location
          this.fileList[0].status = 'success'
        }
        setTimeout(() => {
          this.showPercent = false
        }, 800)
      })
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
