<template>
      <el-container class="home">
        <el-header>
            <div class="avater-box">
                <img src="./assets/logo1.jpg">
                <span>大学生兼职管理系统</span>
                <el-button type="info" class="logout" @click="logout">退出</el-button>
            </div>
        </el-header>
        <el-container>
          <el-aside :width="isCollapse?'56px':'200px'">
            <div class="collapse" @click="toggleCollapse">|||</div>
            <el-menu
                background-color="#545c64"
                text-color="#fff"
                active-text-color="blue"
                class="el-menu-vertical-demo"
                :collapse="isCollapse"
                :collapse-transition="false"
                :router="true"
            >
                <el-sub-menu :index="'/'+item.path" v-for="item in menuList" :key="item.id">
                    <template #title>
                        <el-icon>
                            <component :is="iconObj[item.id]"></component>
                            <!-- <User/> -->
                        </el-icon>
                        <span>{{item.authName}}</span>
                    </template>
                    <el-menu-item :index="'/home/'+subItem.path" v-for="subItem in item.children" :key="subItem.id">
                        <template #title>

                            <span>{{subItem.authName}}</span>
                        </template>
                    </el-menu-item>
                </el-sub-menu>
            </el-menu>
          </el-aside>
          <el-main><router-view/></el-main>
        </el-container>
      </el-container>
  </template>
  

<script>
export default {
    data(){
        return{
            menuList:[],
            active:1,
            isCollapse:false,
            iconObj:{
                "125":"User",
                "103":"Key",
                "101":"Shop",
                "102":"Tickets",
                "145":"TrendCharts",
            }
        }
    },
    methods:{
        async getMenuList(){
            const res=await this.$http.get("menus");
            this.menuList=res.data.data;
            console.log(this.menuList);
        },
        toggleCollapse(){
            this.isCollapse=!this.isCollapse;
        },
        logout(){
            window.sessionStorage.removeItem("token");
            this.$router.push("/login")
        }
    },
    created(){
        this.getMenuList();
    }
}
</script>

<style lang="less" scoped>
    .home{
        height: 100%;
        .el-header{
            background: #373d41;
            .avater-box{
                display: flex;
                align-items: center;
                > img{
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                }
                > span{
                    padding-left: 10px
                };
            }
            .logout{
                position: absolute !important;
                top:15px;
                right: 20px;
                border-radius: 15px;
            }
            .el-icon{
                justify-content: center;
            }
            
        }
        .el-container{
            .el-aside{
                background-color: #333744;
                .collapse{
                    background-color: #545c64;
                    display: flex;
                    justify-content: center;
                    height: 24px;
                    font-size: 10px;
                    line-height: 24px;
                    letter-spacing: 0.2em;
                    cursor:pointer;
                }
                .el-menu{
                    height: 100%;
                    background-color: #545c64;
                    .el-menu-item{
                        background-color: #545c64;
                        color: #fff;
                    }
                    .el-sub-menu__title{
                        padding:10px;
                    }
                    span{
                        padding-left: 20px;
                    }
                    .el-menu-item{
                        padding-left: 30px;
                        > span{
                            padding-left: 10px;
                        }
                    }
                }
            }
            
        }
    }
</style>