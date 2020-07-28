<!--  -->
<template>
 <div class="roles">
       <!-- 面包屑导航 -->
     <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
        <el-row>
            <el-col>
                <el-button type="primary">添加角色</el-button>
            </el-col>
        </el-row>
        <el-table :data="rolesList" border stripe >
            <!-- 展开列 -->
            <el-table-column type="expand">
                 <template slot-scope="scope">
                    <el-row :class="['bBottom', index === 0? 'bTop' : '','vcenter']" v-for="(item ,index) in scope.row.children" :key="item.id">
                        <el-col :span="5">
                            <el-tag  closable @close ="closeList(scope.row,item.id)">
                                {{item.authName}}
                            </el-tag>
                            <i class="el-icon-caret-right"></i>
                        </el-col>
                        <el-col :span="19">
                            <el-row v-for="(subItem, index) in item.children" :key="subItem.id" :class="[index === 0 ? '': 'bTop','vcenter']">
                                <el-col :span="6">
                                    <el-tag type="success" closable @close ="closeList(scope.row,subItem.id)">{{subItem.authName}}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>
                                <el-col :span="18">
                                    <el-tag type="warning" v-for="item3 in subItem.children" :key="item3.id" closable @close ="closeList(scope.row,item3.id)">
                                       {{item3.authName}}
                                    </el-tag>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="角色名称" prop="roleName"></el-table-column>
            <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
            <el-table-column label="操作" width="300">
               <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRoles(scope.row.id)">删除</el-button>
                <el-button type="warning" icon="el-icon-setting" size="mini" @click="showRolesDialog(scope.row)">分配权限</el-button>
               </template>
            </el-table-column>
        </el-table>
    </el-card>
      <!-- 分配权限弹框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="showDialogRoles"
      width="50%"
      @close="setRolesClose"
      >
      <!-- 树形控件 -->
      <el-tree ref="treeRef" :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="showDefault">

      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialogRoles = false">取 消</el-button>
        <el-button type="primary" @click="allRights">确 定</el-button>
      </span>
    </el-dialog>
     <!-- 修改角色弹出框 -->
     <!-- <el-dialog
      title="修改角色"
      :visible.sync="editDialogRoles"
      width="50%"
      @close="editFormClose"
      >
      <el-form :model="editRolesForm" ref="editRolesForm" label-width="70px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogRoles = false">取 消</el-button>
        <el-button type="primary" @click="editFormRoles">确 定</el-button>
      </span>
    </el-dialog> -->
 </div>
</template>

<script>
export default {
  name: 'roles',
  data () {
    return {
      rolesList: [],
      showDialogRoles: false,
      rightsList: [],
      // 树控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的id
      showDefault: [],
      // tree的添加id
      roleId: ''
    //   editDialogRoles: false,
    //   editRolesForm: {}
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.console.error('获取失败')
      this.rolesList = res.data
    },
    // 根据Id删除对应的操作
    async closeList (role, id) {
      const closeConfirm = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (closeConfirm !== 'confirm') return this.$message.info('取消了删除')
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${id}`)
      if (res.meta.status !== 200) return this.$message.info('删除失败')
      this.$message.success('删除成功')
      // this.getRolesList()
      role.children = res.data
    },
    // 编辑角色操作
    // async editRoles (id) {
    //   const { data: res } = await this.$http.get('roles/' + id)
    //   if (res.meta.status !== 200) return this.$message.error('查询失败')
    //   this.editRolesForm = res.data
    //   this.editDialogRoles = true
    // },
    // editFormRoles() {
    //     this.$refs.editRolesForm.validate(async valid => {
    //         if(!vaild) return
    //         const {data: res} = await this.$http.put('roles/')
    //     })
    // },
    // editFormClose () {
    //   this.$refs.editRolesForm.resetFields()
    // },
    // 删除角色操作
    async deleteRoles (id) {
      const RolesConfirm = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      if (RolesConfirm !== confirm) {
        return this.$message.info('已经取消删除')
      }
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getRolesList()
    },
    // 分配权限
    async showRolesDialog (role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error('获取失败')
      this.rightsList = res.data
      // 获取三节列表
      this.getLeafKeys(role, this.showDefault)
      this.showDialogRoles = true
    },
    // 递归形式获取角色权限的选中状态
    getLeafKeys (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    setRolesClose () {
      this.showDefault = []
    },
    // 确定的角色
    async allRights () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) return this.$message.error('添加失败')

      this.$message.success('添加成功')
      this.getRolesList()
      this.showDialogRoles = false
    }
  }
}
</script>

<style lang='less' scoped >
    .el-tag{
        margin-top: 15px;
    }
    .bTop{
        border-top: 1px solid #cccccc;
    }
    .bBottom{
        border-bottom: 1px solid #cccccc;
    }
    .vcenter{
      display: flex;
      align-items: center;
    }
</style>
