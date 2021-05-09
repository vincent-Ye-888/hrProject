<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height:60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="showDialog = true"
              >新增角色</el-button>
            </el-row>
            <!-- 表格 -->
            <el-table border="" :data="roleList">
              <el-table-column label="序号" type="index" width="80" />
              <el-table-column label="角色名称" width="120" prop="name" />
              <el-table-column label="描述" prop="description" />
              <el-table-column label="操作">
                <!-- 表格内容是动态渲染的,唯有通过作用域插槽来获取当前列的数据
                在饿了么组件内部会通过作用域插槽返回当前列的id -->
                <template #default="{row}">
                  <el-button size="small" type="success">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row type="flex" justify="center" align="middle" style="height: 60px">
              <!-- 分页组件 -->
              <el-pagination
                layout="prev,pager,next"
                :total="page.total"
                :page-size="page.pagesize"
                @current-change="currentChange"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-alert
              title="请勿擅自修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input
                  v-model="formData.name"
                  disabled
                  style="width:400px"
                />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input
                  v-model="formData.companyAddress"
                  disabled
                  style="width:400px"
                />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input
                  v-model="formData.mailbox"
                  disabled
                  style="width:400px"
                />
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  v-model="formData.remarks"
                  type="textarea"
                  :rows="3"
                  disabled
                  style="width:400px"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <el-dialog :title="titleText" :visible="showDialog" @close="btnCancel">
        <el-form v-if="showDialog" ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model.trim="roleForm.name" />
          </el-form-item>
          <el-form-item label="角色描述" prop="description">
            <el-input v-model.trim="roleForm.description" />
          </el-form-item>
        </el-form>
        <!-- 底部 -->
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="7">
            <el-button size="small" @click="btnCancel">取消</el-button>
            <el-button size="small" type="primary" @click="btnOK">确定</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getCompanyInfo, getRoleList, deleteRole, updateRole, getRoleDetail, addRole } from '@/api/setting'
export default {
  data() {
    const checkRepeatName = async(rule, value, callback) => {
      // 1.获取所有角色列表
      const { rows } = await getRoleList()
      // console.log(rows)
      // 当前用户输入的值 value
      const isRepeat = rows.some(item => item.name === value)
      // 后续判定提示
      isRepeat ? callback(new Error('角色名称已被占用')) : callback()
    }
    return {
      activeName: 'first',
      roleList: [], // 承接角色的数组
      formData: {
        name: '',
        companyAddress: '',
        mailbox: '',
        remarks: ''
      },
      // 翻页设定对象
      page: {
        page: 1,
        pagesize: 2,
        total: 0
      },
      showDialog: false,
      roleForm: {
        name: '',
        discription: ''
      },
      rules: {
        name: [
          { required: true, message: '该项不能为空', trigger: 'blur' },
          { trigger: 'blur', validator: checkRepeatName }
        ],
        discription: [
          { required: true, message: '该项不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    titleText() {
      return this.roleForm.id ? '编辑角色' : '新增角色'
    }
  },
  created() {
    this.getCompanyInfo()// 公司信息获取
    this.getRoleList()// 角色列表数据获取
  },
  methods: {
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(
        this.$store.state.user.userInfo.companyId
      )
    },
    async getRoleList() {
      const { rows, total } = await getRoleList(this.page)
      this.roleList = rows
      this.page.total = total
    },
    currentChange(newPage) {
      this.page.page = newPage
      this.getRoleList()
    },
    async deleteRole(id) {
      try {
        await this.$confirm('是否确认删除角色')// 二次校验
        // 只有点击了确认才会进入下面的操作
        await deleteRole(id)// 发请求调用接口
        if (this.list.length === 1 && this.list.length > 1) {
          this.page.page--
        }
        this.getRoleList()// 重新加载数据
        this.$message.success('删除角色成功')// 提示信息
      } catch (error) {
        console.log(error)
      }
    },
    async editRole(id) {
      // 1.回显数据
      this.roleForm = await getRoleDetail(id)
      // 2.弹窗
      this.showDialog = true
    },
    async btnOK() {
      try {
        // 验证
        await this.$refs.roleForm.validate()
        // 发送请求
        if (this.roleForm.id) {
          // 编辑
          await updateRole(this.roleForm)
        } else {
          // 新增
          await addRole(this.roleForm)
        }
        // 提示用户
        this.$message.success('操作成功')
        // 关闭弹窗
        this.showDialog = false
        // 重新加载数据
        this.getRoleList()
      } catch (error) {
        console.log(error)
      }
    },
    btnCancel() {
      // 清理表单
      this.roleForm = {
        name: '',
        discription: ''
      }
      // 清理验证
      this.$refs.roleForm.resetFields()
      // 关闭弹窗
      this.showDialog = false
    }
  }
}
</script>

<style scoped>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 480px;
  }
</style>
