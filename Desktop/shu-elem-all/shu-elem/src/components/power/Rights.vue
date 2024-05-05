<template>
    <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/home' }">home</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home/rights' }">rights</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card  class="box-card">
        <el-table :data="rightsTable" align-header="center" stripe border style="width: 100%" >
            <el-table-column prop="authName" label="权限名称" width="280" align="center" />
            <el-table-column prop="path" label="路径" width="280" align="center" />
            <el-table-column prop="level" label="等级" width="280" align="center">
                <template #default="scope">
                    <el-tag v-if="scope.row.level==0" class="mx-1" effect="plain">一级</el-tag>
                    <el-tag v-if="scope.row.level==1" class="mx-1" effect="plain" type="success">二级</el-tag>
                    <el-tag v-if="scope.row.level==2" class="mx-1" effect="plain" type="warning">三级</el-tag>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>

<script>
import { ArrowRight } from '@element-plus/icons-vue'
export default {
    data(){
        return{
            rightsTable:[],
            ArrowRight
        }
    },
    methods:{
        async getRightsTable(){
            const res=await this.$http.get("rights/list")
            console.log(res.data);
            if(res.data.meta.status!=200){
                this.$message.error("获取权限列表失败")
            }else{
                this.rightsTable=res.data.data;
            }
        }
    },
    created(){
        this.getRightsTable();
    }
}
</script>

<style lang="less" scoped>
    
</style>