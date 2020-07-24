<!--  -->
<template>
 <div class="home">
     <el-button @click="loginOut">退出</el-button>
 </div>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
    }
  },
  methods: {
    loginOut () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang='less' scoped >

</style>
