<!--  -->
<template>
 <div class="categories">
     <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
        <el-row>
            <el-col>
                <el-button type="primary" @click="showGoods">添加分类</el-button>
            </el-col>
        </el-row>
        <tree-table class="Treetable" :data="cateList" stripe :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" border :show-row-hover="false">
            <!-- 展开列 -->
            <template slot="isok" slot-scope="scope">
                <i class="el-icon-success" style="color: lightgreen;" v-if="scope.row.cat_deleted === false"></i>
                <i class="el-icon-error" style="color: red;" v-else></i>
            </template>
             <template slot="order" slot-scope="scope">
                 <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                 <el-tag size="mini" v-else-if="scope.row.cat_level === 1" type="success">二级</el-tag>
                 <el-tag size="mini" v-else type="warning">三级</el-tag>
            </template>
             <template slot="opt" slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="editCateList(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
            </template>
        </tree-table>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[3, 5, 10, 15]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </el-card>
    <!-- 添加分类弹框 -->
      <el-dialog
      title="添加分类"
      :visible.sync="showDialogGoods"
      width="50%"
      @close="addCateClose"
      >
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父类分类" prop="cat_pid">
            <el-cascader
                v-model="selectList"
                :options="parentCateList"
                :props="cascaderProps"
                @change="parentChange" clearable change-on-select>
            </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialogGoods = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
 </div>
</template>

<script>
export default {
  name: 'categories',
  data () {
    return {
      cateList: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      //   table指定的表头内容
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
          width: '400px'
        },
        {
          label: '是否有效',
          type: 'template',
          //   表示当前这列的显示
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          //   表示当前这列的显示
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          //   表示当前这列的显示
          template: 'opt'
        }
      ],
      showDialogGoods: false,
      addCateForm: {
        cat_name: '',
        cat_level: 0,
        cat_pid: 0
      },
      //   验证规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      },
      parentCateList: [],
      // 指定级联机选择器配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectList: []
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('商品获取失败')
      //   console.log(res.data, 123)
      this.cateList = res.data.result
      this.total = res.data.total
    },
    handleSizeChange (newsize) {
      this.queryInfo.pagesize = newsize
      this.getCateList()
    },
    // 监听pagesize的变化
    handleCurrentChange (newnum) {
      this.queryInfo.pagenum = newnum
      this.getCateList()
    },
    showGoods () {
      this.getParentList()
      this.showDialogGoods = true
    },
    // 展示父类的列表数据
    async getParentList () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) return this.$message.error('获取失败')
      this.parentCateList = res.data
    },
    parentChange () {
      if (this.selectList.length > 0) {
        // 父级的Id
        this.addCateForm.cat_pid = this.selectList[this.selectList.length - 1]
        // 当前分类的等级赋值
        this.addCateForm.cat_level = this.selectList.length
      } else {
        // 父级的Id
        this.addCateForm.cat_pid = 0
        // 当前分类的等级赋值
        this.addCateForm.cat_level = 0
      }
    },
    addCate () {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) return this.$message.error('失败')
        this.$message.success('添加分类成功!')
        this.getCateList()
        this.showDialogGoods = false
      })
    },
    addCateClose () {
      this.$refs.addCateFormRef.resetFields()
      this.selectList = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
      this.showDialogGoods = false
    },
    // 编辑事件
    editCateList () {

    }
  }
}
</script>

<style lang='less' scoped >
    .Treetable{
        margin-top: 15px;
    }
    .el-cascader{
        width: 100%;
    }
</style>
