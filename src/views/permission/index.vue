<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右的按钮 -->
      <page-tools>
        <template v-slot:after>
          <el-button type="primary" size="small" @click="addPermission(1,'0')">添加权限</el-button>
        </template>
      </page-tools>
      <!-- 表格 -->
      <el-card>
        <el-table border :data="list" row-key="id" :default-expand-all="true">
          <el-table-column align="center" label="名称" prop=" name" />
          <el-table-column align="center" label="标识" prop="code" />
          <el-table-column align="center" label="描述" prop="description" />
          <el-table-column align="center" label="操作">
            <template slot-scope="{row}">
              <el-button v-if="row.type === 1" type="text" @click="addPermission(2,row.id)">添加</el-button>
              <el-button type="text" @click="editPermission(row.id)">编辑</el-button>
              <el-button type="text" @click="delPermission(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!-- 放置一个弹层 用来编辑新增节点 -->
      <el-dialog :title="`${showText}权限点`" :visible="showDialog" @close="btnCancel">
        <!-- 表单 -->
        <el-form ref="perForm" :model="formData" :rules="rules" label-width="120px">
          <el-form-item label="权限名称" prop="name">
            <el-input v-model="formData.name" style="width:90%" />
          </el-form-item>
          <el-form-item label="权限标识" prop="code">
            <el-input v-model="formData.code" style="width:90%" />
          </el-form-item>
          <el-form-item label="权限描述" prop="description">
            <el-input v-model="formData.description" style="width:90%" />
          </el-form-item>
          <el-form-item label="开启">
            <el-switch
              v-model="formData.enVisible"
              active-value="1"
              inactive-value="0"
            />
          </el-form-item>
        </el-form>
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" type="primary" @click="btnOK">确定</el-button>
            <el-button size="small" @click="btnCancel">取消</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getPermissionList, delPermission, addPermission, getPermissionDetail, updatePermission } from '@/api/permission'
import { listToTreeData } from '@/utils'
export default {
  data() {
    return {
      list: [],
      showDialog: false,
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      rules: {
        name: [
          { required: true, message: '该项不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '该项不能为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '该项不能为空', trigger: 'blur' }
        ],
        enVisible: [
          { required: true, message: '该项不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    showText() {
      return this.formData.id ? '编辑' : '新增'
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async getPermissionList() {
      this.list = listToTreeData(await getPermissionList(), '0')
      console.log(this.list)
    },
    async delPermission(id) {
      // 二次校验
      await this.$confirm('是否确认删除')
      // 发送请求
      await delPermission(id)
      // 提示用户
      this.$message.success('删除成功')
      // 重新加载数据
      this.getPermissionList()
    },
    addPermission(type, pid) {
      this.formData.type = type
      this.formData.pid = pid
      this.showDialog = true
    },
    async editPermission(id) {
      // 1.回显数据
      this.formData = await getPermissionDetail(id)
      // 2.弹窗
      this.showDialog = true
    },
    async btnOK() {
      // 表单校验
      await this.$refs.perForm.validate()
      // 发请求
      // console.log(this.formData.id)
      if (this.formData.id) {
        // 编辑
        await updatePermission(this.formData)
      } else {
        // 新增
        await addPermission(this.formData)
      }
      // 提示用户
      this.$message.success('添加成功')
      // 重新加载数据
      this.getPermissionList()
      // 关闭弹窗
      this.showDialog = false
    },
    btnCancel() {
      // 清理数据
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
      // 清空校验
      this.$refs.perForm.resetFields()
      // 关闭弹窗
      this.showDialog = false
    }
  }
}
</script>

<style lang="less" scoped>

</style>
