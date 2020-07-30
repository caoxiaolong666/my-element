<!--  -->
<template>
 <div class="params">
   <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 警告区 -->
      <el-alert
        show-icon
        title="警告提示的文案"
        type="warning" :closable="false">
      </el-alert>
      <el-row class="rowOpt">
        <el-col>
          <span>选择商品分类:</span>
          <el-cascader
            v-model="selectkeys"
            :options="paramsList"
            :props="paramsProps"
            @change="paramsChange">
          </el-cascader>
        </el-col>
      </el-row>
      <!--tab页面  -->
      <el-tabs v-model="activeName" @tab-click="TabsClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisable" @click="showParamsDialog = true">添加动态</el-button>
          <el-table :data="manyDate" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i,scope.row)">{{item}}</el-tag>
                <!-- 动态添加的tag -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope = "scope">
               <el-button type="primary" size="mini" icon="el-icon-edit" @click="editParamsClick(scope.row.attr_id)">编辑</el-button>
               <el-button type="danger"  size="mini" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisable" @click="showParamsDialog= true">静态属性</el-button>
          <el-table :data="onlyDate" border stripe>
            <el-table-column type="expand"></el-table-column>

            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope = "scope">
               <el-button type="primary" size="mini" icon="el-icon-edit" @click="editParamsClick(scope.row.attr_id)" >编辑</el-button>
               <el-button type="danger"  size="mini" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 动态的提框 -->
    <el-dialog
      :title="titleTxt"
      :visible.sync="showParamsDialog"
      width="50%"
      @close="addparamsClose"
      >
      <el-form :model="addParamsForm" :rules="addparmsFormRules" ref="addparamsFormRef" label-width="100px">
        <el-form-item :label="titleTxt" prop="attr_name">
            <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showParamsDialog = false">取 消</el-button>
        <el-button type="primary" @click="addparams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改提示框 -->
    <el-dialog
      :title="titleTxt"
      :visible.sync="editDialogParams"
      width="50%"
      @close="editparamsClose"
      >
      <el-form :model="editParamsForm" :rules="editparmsFormRules" ref="editparamsFormRef" label-width="100px">
        <el-form-item :label="titleTxt" prop="attr_name">
            <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogParams = false">取 消</el-button>
        <el-button type="primary" @click="editparams">确 定</el-button>
      </span>
    </el-dialog>
 </div>
</template>

<script>
export default {
  name: 'parmas',
  data () {
    return {
      paramsProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      paramsList: [],
      selectkeys: [],
      // 被激活的tabs项
      activeName: 'many',

      manyDate: [],
      onlyDate: [],
      // 添加
      showParamsDialog: false,
      addParamsForm: {
        attr_name: ''
      },
      addparmsFormRules: {
        attr_name: [
          { required: true, message: '请输入动态名称', trigger: 'blur' }
        ]
      },
      // 修改
      editDialogParams: false,
      editParamsForm: {
      },
      editparmsFormRules: {
        attr_name: [
          { required: true, message: '请输入动态名称', trigger: 'blur' }
        ]
      }

    }
  },
  created () {
    this.getParamsList()
  },
  methods: {
    async getParamsList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('失败')
      this.paramsList = res.data
    },
    paramsChange () {
      this.getParamsDate()
    },
    // 获取参数列表数据
    async getParamsDate () {
      if (this.selectkeys.length !== 3) {
        this.selectkeys = []
        this.manyDate = []
        this.onlyDate = []
      }
      //  //// 根据所选的id,和当前所处的数据
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
      // console.log(res.data, 1213)
      if (res.meta.status !== 200) return this.$message.error('获取失败!!')

      res.data.forEach(item => {
        item.attr_vals = (item.attr_vals || '').split(' ')
        // 控制为本框显示隐藏
        item.inputVisible = false
        // 文本框输入文字
        item.inputValue = ''
      })
      if (this.activeName === 'many') {
        this.manyDate = res.data
      } else {
        this.onlyDate = res.data
      }
    },
    TabsClick () {
      this.getParamsDate()
    },
    addparamsClose () {
      this.$refs.addparamsFormRef.resetFields()
    },
    addparams () {
      this.$refs.addparamsFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addParamsForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) return this.$message.error('提交失败')
        this.$message.success('添加参数成功')
        this.getParamsDate()
        this.showParamsDialog = false
      })
    },
    // 点击编辑按钮
    async editParamsClick (id) {
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${id}`)
      if (res.meta.status !== 200) return this.$message.error('失败了')
      this.editParamsForm = res.data
      this.editDialogParams = true
    },
    editparamsClose () {
      this.$refs.editparamsFormRef.resetFields()
    },
    editparams () {
      this.$refs.editparamsFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editParamsForm.attr_id}`, { attr_name: this.editParamsForm.attr_name, attr_sel: this.activeName })
        if (res.meta.status !== 200) return this.$message.error('修改失败')
        this.$message.success('修改成功')
        this.getParamsDate()
        this.editDialogParams = false
      })
    },
    // 删除操作
    async removeParams (attrid) {
      const ParamsConfirm = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (ParamsConfirm !== 'confirm') {
        this.$message.info('用户取消了删除')
      } else {
        const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${attrid}`)
        if (res.meta.status !== 200) return this.$message.error('删除失败')
        this.$message.success('删除成功')
        this.getParamsDate()
      }
    },
    // tag
    handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
      } else {
        row.attr_vals.push(row.inputValue.trim())
        row.inputValue = ''
        row.inputVisible = false
        // attr_vals的请求数据
        this.saveAttrValue(row)
      }
    },
    showInput (row) {
      row.inputVisible = true
      // 文本自动获取焦点
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleClose (i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrValue(row)
    },
    // 抽离方法
    async saveAttrValue (row) {
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) return this.$message.error('失败')
      this.$message.success('修改成功')
    }
  },
  computed: {
    isBtnDisable () {
      if (this.selectkeys.length !== 3) {
        return true
      }
      return false
    },
    // 选中的三级id
    cateId () {
      if (this.selectkeys.length === 3) {
        return this.selectkeys[2]
      }
      return null
    },
    titleTxt () {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态参数'
      }
    }
  }
}
</script>

<style lang='less' scoped >
  .rowOpt{
    margin-top: 15px;
  }
  .input-new-tag{
    width: 120px;
  }
</style>
