<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <TreeTools :tree-node="company" :is-root="true" />
        <!-- 上面是头部的公司信息,下面是树形的部门结构 -->
        <el-tree :data="departs" :default-expand-all="true" :props="defaultProps">
          <!-- 传入内容 插槽内容 会循环多次 有多少节点 就循环多少次 -->
          <!-- 作用域插槽 slot-scope="obj" 接收传递给插槽的数据
          data 每个节点的数据对象-->
          <template #default="scoped">
            <TreeTools :tree-node="scoped.data" :is-root="false" />
          </template>
        </el-tree>
      </el-card>
    </div>
  </div>
</template>

<script>
import TreeTools from './components/tree-tools'
import { getDepartments } from '@/api/departments'
export default {
  components: {
    TreeTools
  },
  data() {
    return {
      company: { },
      defaultProps: {
        label: 'name'
      },
      departs: []
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
      this.company = { name: res.companyName, manager: '负责人' }
      this.departs = res.depts
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
