<template>
  <div class="login-container">
    <div class="login-box">
      <div class="avater_box">
        <img src="./assets/logo1.jpg">
      </div>
      <div class="form-box">
        <el-form :model="loginForm" ref=loginForm label-width="80px" >
          <el-form-item label="用户名" >
            <el-input v-model="loginForm.username" />
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="loginForm.password" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="large" @click="login">登录</el-button>
            <el-button type="primary" size="large">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue'
import { ElStep } from 'element-plus'
export default {
  data(){
    return{
      loginForm:{
        username:"admin",
        password:"123456"
      },
      rules:{
        username:[
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 3, max: 12, message: '用户名长度必须在3到12个字符之间', trigger: 'blur' }
        ],
        password:[
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, message: '密码长度至少为6个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods:{
    login(){
      this.$refs.loginForm.validate(async valid=>{
        if(!valid){
          this.$message.error("数据校验失败，无法提交")
        }else{
          const res=await this.$http.post("login",this.loginForm);
          if(res.data.meta.status!=200){
            this.$message.error("登录失败");
          }else{
            const token=res.data.data.token;
            window.sessionStorage.setItem("token",token);
            this.$router.push("home")
          }
        }
      });
    }
  }
}
</script>

<style lang="less" scoped>
    .login-container{
        height:100%;
        background-color: #2b4b6b;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        background-image: url(./assets/bgc2.png);

        .login-box{
            height:300px;
            width:450px;
            margin:auto;
            border-radius: 20px;
            justify-content: center;

            // margin-left: auto;
            margin-right: 20px;

            // background-color: #fff;
            background-color: rgba(240, 255, 255, 0.25);

            .avater_box{
              position: relative;;
              left:50%;
              width: 100px;
              height: 100px;
              transform: translate(-50%,-50%);
              background-color: #fff;
              // box-shadow: 0 0 30px #eee;
              border-radius: 50%;
              padding: 5px;

              border: 1px solid #eee;

              img{
                width: 100px;
                height: 100px;
                border-radius: 50%;
              }
            }

            // .el-form-item{
            //   height: 60px !important;
            //   line-height: 20px !important;
            // }
            // .el-form-item__label{
            //   height: 32px;
            //   line-height: 32px;
            //   font-size: 18px;
            //   // width: 80px !important;
            //   justify-content: center;
            // }
            // .el-input__wrapper{
            //   height: 32px;
            //   margin-right: 20px;
            // }
            // .el-form-item__content{
            //   justify-content: center;
            // }

            
        }
        
    }
</style>