<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <TreeTools :tree-node="company" :is-root="true" @addDepartment="addDepartment" />
        <!-- 上面是头部的公司信息,下面是树形的部门结构 -->
        <!-- expand-on-click-node属性为true的话，点击按钮会同步触发节点的展开收缩事件 -->
        <el-tree :expand-on-click-node="false" :data="departs" :default-expand-all="true" :props="defaultProps">
          <!-- 传入内容 插槽内容 会循环多次 有多少节点 就循环多少次 -->
          <!-- 作用域插槽 slot-scope="obj" 接收传递给插槽的数据
          data 每个节点的数据对象-->
          <template #default="scoped">
            <TreeTools
              :tree-node="scoped.data"
              :is-root="false"
              @addDepartment="addDepartment"
              @delDepartment="getDepartment"
              @editDepartment="editDepartment"
            />
          </template>
        </el-tree>
      </el-card>
      <!-- 放置新增弹层组件  -->
      <!-- addDepartment 监听来自子组件的确认完成操作并触发下面的 getDepartments函数-->
      <AddDept
        ref="addDept"
        :show-dialog.sync="showDialog"
        :tree-node="treeNode"
        @addDepartment="getDepartment"
      />
    </div>
  </div>
</template>

<script>
import TreeTools from './components/tree-tools'
import AddDept from './components/add-dpt'
import { getDepartments } from '@/api/departments'
import { listToTreeData } from '@/utils'
export default {
  components: {
    TreeTools,
    AddDept
  },
  data() {
    return {
      showDialog: false,
      company: { },
      defaultProps: {
        label: 'name'
      },
      departs: [], // 渲染树形结构的数据
      treeNode: {}
    }
  },
  // 生命周期钩子函数
  mounted() {
    this.getDepartment()
  },
  methods: {
    async getDepartment() {
      const res = await getDepartments()
      console.log(res)
      this.company = { name: res.companyName, manager: '负责人', id: '' }
      // 第二个参数 '' , 表示顶级部门的参数 = 空
      this.departs = listToTreeData(res.depts, '')
    },
    addDepartment(treeNode) {
      this.showDialog = true
      this.treeNode = treeNode
    },
    editDepartment(treeNode) {
      this.showDialog = true
      this.treeNode = treeNode
      this.$refs.addDept.getDepartmentDetail(treeNode.id)
    }
  }
}
</script>

<style  scoped>
.tree-card {
  padding: 30px 40px;
  font-size:18px;
}
</style>
