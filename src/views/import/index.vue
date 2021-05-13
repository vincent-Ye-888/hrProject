<template>
  <!-- 这个花裤衩的上传组件可以传入一个 onSuccess 属性, 是一个函数
  每当excel文件传入成功就会执行 -->
  <UploadExcel :on-success="upload" />
</template>

<script>
import { importEmpolyee } from '@/api/employees'
export default {
  methods: {
    async upload(data) {
      // 这里在excel数据传入成功后执行
    //   console.log(data.results)
      // 准备字典
      const dict = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName',
        '聘用形式': 'formOfEmployment'
      }
      // 现在我们的 data.results是一个数组,里面包裹着多个用户
      // 现在需要遍历这个数组,拿出每个用户单独处理  user 相当于item
      const userData = data.results.map(user => {
        return this.translate(user, dict)
      })
      //   console.log(userData)
      // 发送请求导入员工
      await importEmpolyee(userData)
      // 提示成功
      this.$message.success('上传成功')
      // 返回上一页
      this.$router.back()
    },
    translate(user, dict) {
    //   console.log(user)
      const newuser = {}
      // 如果人工进行翻译应该如下
      // newUser.username = '高大山'
      // 其中需要的数据一个是 英文的 key
      // 第二个是原来的 user 中的 value 值
      for (const key in user) {
        // console.log(key)
        // console.log(dict[key])
        // console.log(user[key])
        const enkey = dict[key]
        const value = user[key]
        // 如果是时间的数据不能直接放进对象,要进行对应的时间转换
        if (enkey === 'timeOfEntry' || enkey === 'correctionTime') {
          newuser[enkey] = new Date(this.formatDate(value, '/'))
        } else {
          newuser[enkey] = value
        }
      }
      //   console.log(newuser)
      return newuser
    },
    // 转换 excel 导入时 五位数的时间格式 format代表分隔符
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style>

</style>
