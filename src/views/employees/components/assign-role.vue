<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="btnCancel">
    <!-- el-checkbox-group选中的是 当前用户所拥有的角色  需要绑定 当前用户拥有的角色-->
    <el-checkbox-group v-model="checkList">
      <!-- 选项 -->
      <!-- 对于多选框来说
      1. 供计算机查看和记录的叫 label
      2. 供用户查看的放在开闭标签vine -->
      <el-checkbox
        v-for="item in allRoles"
        :key="item.id"
        :label="item.id"
      >
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    // 用户的id 用来查询当前用户的角色信息
    userId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      checkList: [],
      allRoles: []
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { rows } = await getRoleList()
      this.allRoles = rows
    },
    async getUserDetailById(id) {
      const { roleIds } = await getUserDetailById(id)
      this.checkList = roleIds
    },
    btnCancel() {
      this.checkList = []
      this.$emit('update:showRoleDialog', false)
    },
    async btnOK() {
      // 发请求
      const roleIds = this.checkList
      const id = this.userId
      await assignRoles({
        roleIds,
        id
      })
      // 提示用户
      this.$message.success('操作成功')
      // 关闭弹窗
      this.$emit('update:showRoleDialog', false)
    }
  }
}
</script>

<style>

</style>
