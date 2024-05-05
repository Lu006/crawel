<template>
    <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/home' }">home</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home/roles' }">roles</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
        <el-table :data="rolesTable">
            <el-table-column type="expand">
                <template #default="scope">
                    <el-row :class="['bd_bottom',i0===0?'bd_top':'','vcenter']" v-for="(item0,i0) in scope.row.children" >
                        <el-col :span="6">
                            <el-tag effect="plain" closable @close="removeTag(scope.row.id,item0.id)">{{item0.authName}}</el-tag>
                        </el-col>
                        <el-col :span="18">
                            <el-row :class="[i1===0?'':'bd_top','vcenter']" v-for="(item1,i1) in item0.children">
                                <el-col :span="8">
                                    <el-tag type="success" effect="plain" closable @close="removeTag(scope.row.id,item1.id)">{{item1.authName}}</el-tag>
                                </el-col>
                                <el-col :span="16">
                                    <el-row :class="[i2===0?'':'bd_top','vcenter']" v-for="(item2,i2) in item1.children">
                                        <el-tag type="warning" effect="plain" closable @close="removeTag(scope.row.id,item2.id)">{{item2.authName}}</el-tag>
                                    </el-row>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column type="index" label="#" width="60"/>
            <el-table-column prop="roleName" label="角色名" width="200" align="left" />
            <el-table-column prop="roleDesc" label="角色描述" width="200" align="left" />
            <el-table-column label="操作" width="320" align="left">
                <template #default="scope">
                    <el-button type="primary"  @click="showRoleRightsDialog(scope.row)" size="small" icon="Edit">编辑</el-button>
                    <el-button type="danger" @click="removeRoleById(scope.row.id)" size="small" icon="Delete">删除</el-button>
                    <el-button type="warning" size="small" icon="Setting">修改权限</el-button>
                </template>
            </el-table-column>
           
        </el-table>
    </el-card>

    <el-dialog v-model="grantDialogVisible" title="为角色分配权限" >
        <template #default>
            <el-tree
                ref="roleRightsTree"
                :data="roleRightsTree"
                show-checkbox
                default-expand-all
                node-key="id"
                highlight-current
                :props="roleRightsProps"
                :default-checked-keys="checkedKeys"
            />
        </template>
        <template #footer>
        <span class="dialog-footer">
            <el-button type="primary" @click="grantForRole()">
                提交
            </el-button>
            <el-button @click="grantDialogVisible = false">取消</el-button>
        </span>
        </template>
    </el-dialog>
    
</template>

<script>
export default {
    data(){
        return{
            rolesTable:[],

            grantDialogVisible:false,
            roleRightsTree:[],
            roleRightsProps:{
                children:'children',
                label:'authName'
            },
            checkedKeys:[],
            treeRef:[],
            grantRoleId:''
        }
    },
    methods:{
        async getRolesTable(){
            const res=await this.$http.get("/roles");
            if(res.data.meta.status!=200){
                this.$message.error("获取角色列表失败")
            }else{
                this.rolesTable=res.data.data
            }
            console.log(this.rolesTable);
        },
        async removeTag(roleId,tagId){
            const result=await this.$confirm(
                "是否删除该角色此权限，此操作不可挽回",
                "提示",
                {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            ).catch(err=>err);
            if(result=="confirm"){
                const res=await this.$http.delete(`roles/${roleId}/rights/${tagId}`)
                if(res.data.meta.status!=200){
                    this.$message.error("删除角色权限失败");
                }else{
                    this.$message.success("成功删除角色权限");
                    this.$router.go(0);
                }
            }
        },
        async showRoleRightsDialog(role){
            const res=await this.$http.get("rights/tree")
            if(res.data.meta.status!=200){
                this.$message.error("获取权限列表失败")
            }else{
                this.roleRightsTree=res.data.data;
            }
            console.log(role);
            this.grantRoleId=role.id;
            this.grantDialogVisible=true;
            this.checkedKeys=this.getLeafKeys(role);
        },
        getLeafKeys(current){
            let keys=[];
            let child;
            if(current.hasOwnProperty("children")){
                for(let index in current.children){
                    child=current.children[index];
                    keys=keys.concat(this.getLeafKeys(child));
                }
            }else{
                keys.push(current.id);
            }
            return keys;
        },
        async grantForRole(){
            const keys=[...this.$refs.roleRightsTree.getCheckedKeys(),...this.$refs.roleRightsTree.getHalfCheckedKeys()]

            const res=await this.$http.post(`roles/${this.grantRoleId}/rights`,{
                rids:keys.toString()
            })
            if(res.data.meta.status!=200){
                this.$message.error("为角色分配权限失败");
            }else{
                this.roleRightsTree=res.data.data;
                this.$message.success("成功为角色分配权限");
            }
            console.log(res.data);
            this.$router.go(0);
        },
        async removeRoleById(id){
            console.log(id);
            const result=await this.$confirm(
                "是否删除该角色此权限，此操作不可挽回",
                "提示",
                {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            ).catch(err=>err);
            if(result=="confirm"){
                const res=await this.$http.delete(`roles/`+id)
                if(res.data.meta.status!=200){
                    this.$message.error("删除角色失败，请重试");
                }else{
                    this.roleRightsTree=res.data.data;
                    this.$message.success("成功删除该角色");
                }
                this.$router.go(0);
            }
        }
    },
    created(){
        this.getRolesTable();
        // this.showRoleRightsDialog();
    }
}
</script>

<style scoped>
    .el-tag{
        margin:8px;
    }

</style>