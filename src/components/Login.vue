<!--  -->
<template>
 <div class="login">
   <div class="login_container">
     <div class="avatar_box">
       <img src="../assets/logo.png" alt="">
     </div>
     <el-form :model="loginForm" :rules="rules" ref="form" label-width="0px" class="login_from">
       <!-- 用户名 -->
      <el-form-item prop="username">
        <el-input v-model="loginForm.username"  prefix-icon="iconfont icon-icons8-user1
"></el-input>
      </el-form-item>
      <!-- 密码 -->
      <el-form-item prop="password">
        <el-input v-model="loginForm.password"  prefix-icon="iconfont icon-icons8-password1" type="password"></el-input>
      </el-form-item>
      <!-- 按钮 -->
      <el-form-item class="btn">
        <el-button type="primary" @click="login">登录</el-button>
        <el-button type="info" @click="resetForm">重置</el-button>
      </el-form-item>
     </el-form>
   </div>
 </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置按钮
    resetForm () {
      this.$refs.form.resetFields()
    },
    login () {
      this.$refs.form.validate(async vdlid => {
        if (!vdlid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登录成功')
        // 将token保存客户端
        window.sessionStorage.setItem('token', res.data.token)
        // 出去有token其他页面跳转登录
        // token的过期时间
        // 跳转到home页面
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style scoped lang="less" scope>
  .login{
    background-color: #2b4b6b;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .login_container{
      width: 450px;
      height: 300px;
      background-color: #ffffff;
      border-radius: 3px;
      position: relative;
      .avatar_box{
        width: 130px;
        height: 130px;
        border: 1px solid #ccc;
        border-radius: 50%;
        padding: 10px;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;
        img{
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: #eee;
        }
      }
    }
  }
  .login_from{
    position: absolute;
    width: 100%;
    bottom: 0;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .btn{
    display: flex;
    flex-direction: row-reverse;

  }
</style>
