<!--  -->
<template>
 <el-container style="height: 100%">
  <el-header>
      <div>
          <img src="" alt="">
          <span>嘻哈哈后台管理系统</span>
      </div>
      <el-button @click="loginOut" type="info">退出</el-button>
  </el-header>
  <el-container>
    <el-aside :width="isToggleCollpse ? '64px' : '200px'">
        <div class="toggle" @click="toggleCollapse"> ||| </div>
        <el-menu
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409eff"
            unique-opened
            :collapse="isToggleCollpse"
            :collapse-transition= "false"
            router
            :default-active="activePath">
            <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
                <template slot="title">
                    <i :class="icons[item.id]"></i>
                    <span>{{item.authName}}</span>
                </template>
                <!-- 二级菜单项 -->
                <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavstate('/'+subItem.path)">
                    <template slot="title">
                        <i class="el-icon-menu"></i>
                        <span>{{subItem.authName}}</span>
                    </template>
                </el-menu-item>
            </el-submenu>
        </el-menu>
    </el-aside>
    <el-main>
        <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      menuList: [],
      icons: {
        125: 'iconfont icon-iconfonticon-nengha',
        103: 'iconfont icon-kehutuihuodan3x',
        101: 'iconfont icon-kehutuihuodan3x',
        102: 'iconfont icon-kehuyouhui3x',
        145: 'iconfont icon-cuxiaopindingdan3x'
      },
      isToggleCollpse: false,
      //   保持激活连接地址
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    loginOut () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
      // console.log(this.menuList, 123)
    },
    toggleCollapse () {
      this.isToggleCollpse = !this.isToggleCollpse
    },
    // 保持激活
    saveNavstate (pathActive) {
      window.sessionStorage.setItem('activePath', pathActive)
      this.activePath = pathActive
    }
  }
}
</script>

<style lang='less' scoped >
    .el-header{
        background-color: #373d41;
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding-left: 0;
        color: #fff;
        font-size: 20px;
        >div{
            display: flex;
            align-items: center;
            img{
                width: 40px;
                height: 40px;
                background-color: pink;
            }
            span{
                margin-left: 15px;
            }
        }
    }
    .el-aside{
        background-color: #333744;
        .el-menu{
            border-right: none;
        }
        .toggle{
            font-size:10px;
            background-color: #4a5064;
            line-height: 24px;
            color: #fff;
            text-align: center;
            letter-spacing: 0.2px;
            cursor: pointer;
        }
    }
    .el-main{
        background-color: #eaedf1;
    }
</style>
