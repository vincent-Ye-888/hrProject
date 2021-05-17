<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 引入封装的 通用工具栏-->
      <page-tools :show-before="true">
        <!-- 通过插槽表达式呈现 -->
        <span slot="before">共{{ page.total }}条记录</span>
        <template slot="after">
          <el-button size="small" type="warning" @click="$router.push('/import')">导入</el-button>
          <el-button size="small" type="danger" @click="exportEmployee">导出</el-button>
          <el-button v-if="checkPermission('addEmployee')" size="small" type="primary" @click="showDialog= true">新增员工</el-button>
        </template>
      </page-tools>
      <!-- 放置表格和分页 -->
      <el-card v-loading="loading">
        <el-table border :data="list">
          <el-table-column label="序号" sortable="">
            <template slot-scope="scope">
              <!-- 如果想要得出真正当前页员工的在全部数据的索引
              应该先算出上一页的最后一行
              再次基础上, 当前页再 +1 +2 以此类推 -->
              <!-- 或者可以这么想, 前面所有的总条数基础上 +1 +2 .... -->
              {{ ((page.page - 1) * page.size) + (scope.$index + 1) }}
            </template>
          </el-table-column>
          <el-table-column label="头像" align="center" width="200">
            <template slot-scope="{row}">
              <img v-imgerr="require('@/assets/common/head.jpg')" class="avatar" :src="row.staffPhoto" @click="showQRcode(row.staffPhoto)">
            </template>
          </el-table-column>
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column label="聘用形式" width="110" sortable="" prop="formOfEmployment" :formatter="formOfEmployment" />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <el-table-column label="入职时间" sortable prop="timeOfEntry">
            <!-- slot-scope=scope.row  代表当前行的 数据 -->
            <template slot-scope="{row}">
              <!-- {{ scope.row.timeOfEntry.split('T')[0] }} -->
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" width="110" sortable="" prop="enableState">
            <template slot-scope="{row}">
              <!-- 根据当前状态来确定 是否打开开关 -->
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template slot-scope="{row}">
              <el-button type="text" size="small" @click="$router.push('/employees/detail/' + row.id)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="assignRole(row.id)">角色</el-button>
              <el-button type="text" size="small" @click="deleteEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination
            layout="prev, pager, next"
            :page-size="page.size"
            :current-page="page.page"
            :total="page.total"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
      <!-- 放置新增按钮的组件 -->
      <AddDempolyee :show-dialog="showDialog" />

      <el-dialog title="头像预览" :visible="isShowQRcode" @close="isShowQRcode = false">
        <el-row type="flex" justify="center">
          <canvas ref="mycanvas" />
        </el-row>
      </el-dialog>
      <!-- 角色弹窗 :user-id / :show-role-dialog 均对应子组件的props -->
      <AssignRole ref="assignRole" :user-id="userId" :show-role-dialog.sync="showRoleDialog" />
    </div>
  </div>
</template>

<script>
import { getEmployeeList, delEmpolyee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import { formatDate } from '@/filters'
// 对于一个不常用的库, 每次都默认引入, 技术上没问题
// 可以进行优化
// import { export_json_to_excel } from '@/vendor/Export2Excel'
import AddDempolyee from './components/add-employee'
import AssignRole from './components/assign-role'
import QRcode from 'qrcode'
export default {
  components: { AddDempolyee, AssignRole },
  data() {
    return {
      isShowQRcode: false,
      showDialog: false,
      showRoleDialog: false,
      userId: '',
      loading: false,
      list: [], // 用于 接收数据并渲染
      page: {
        page: 1, // 当前页码
        size: 5, // 每页显示的条数
        total: 0// 总数
      }
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    checkPermission(pointName) {
      // 这里是判断当前用户是否有权限的函数
      // 如果这个权限点名称存在于用户数据的points 权限数组中就可以点击
      // 否则则不能
      return this.$store.getters.roles && this.$store.getters.roles.points.includes(pointName)
    },
    async assignRole(id) {
      // console.log(id)
      this.userId = id
      await this.$refs.assignRole.getUserDetailById(id)
      this.showRoleDialog = true
    },
    showQRcode(url) {
      if (url) {
        this.isShowQRcode = true
        this.$nextTick(() => {
          QRcode.toCanvas(this.$refs.mycanvas, url, {
            width: 300,
            color: {
              dark: 'blue'
            }
          })
        })
      }
    },

    async exportEmployee() {
      // 这里是按钮被点击, 可以就在这里单独引入需要的库
      const { export_json_to_excel } = await import('@/vendor/Export2Excel')
      // 加载所有员工列表
      const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
      const dict = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // console.log(Object.keys(dict))// 将一个对象的所有属性都调出来存到一个新数组中
      const userData = rows.map(user => {
        return this.object2Arrayy(user, dict)
      })
      // console.log(Object.keys(dict))
      // console.log(userData)
      export_json_to_excel({
        header: Object.keys(dict),
        data: userData
      })
    },
    object2Arrayy(user, dict) {
      const newUser = []
      for (const key in dict) {
        const enkey = dict[key]
        const value = user[enkey]
        if (enkey === 'timeOfEntry' || enkey === 'correctionTime') {
          newUser.push(new Date(formatDate(value)))
        } else if (enkey === 'formOfEmployment') {
          const obj = EmployeeEnum.hireType.find(item => item.id === value)
          newUser.push(obj ? obj.value : '未知')
          // console.log(newUser)
        } else {
          newUser.push(value)
        }
      }
      return newUser
    },
    // 格式化聘用形式
    formOfEmployment(row, column, cellValue, index) {
      // console.log(EmployeeEnum, cellValue)
      // 找到1所对应的值
      const obj = EmployeeEnum.hireType.find(item => item.id === Number(cellValue))
      return obj ? obj.value : '实习'
    },
    async getEmployeeList() {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
      this.loading = false
    },
    changePage(newPage) {
      this.getEmployeeList()
      this.page.page = newPage
    },
    // 删除员工
    async deleteEmployee(id) {
      try {
        // 1.二次确认
        await this.$confirm('是否确认删除该员工')
        // 2.发请求
        await delEmpolyee(id)
        // 3.提示成功信息
        this.$message.success('操作成功')
        // 4.重新加载数据
        this.getEmployeeList()
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .avatar{
    width: 200px;
    height: 200px;
    object-fit: cover;
  }
</style>
