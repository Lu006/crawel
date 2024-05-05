<template>
    <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/home' }">home</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home/users' }">users</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row gutter="20">
        <el-col span=8>
            <el-input v-model="query">
                <template #append>
                    <el-button icon="Search" @click="getUsers" style="text-color:'#000000';background-color:#e0e0e0"/>
                </template>
            </el-input>
        </el-col>
        <el-col span=4>
            <template #default>
                <el-button type="primary" @click="addDialogVisible='true'">添加</el-button>
            </template>
        </el-col>
    </el-row>
    <el-card>
        <el-table :data="users" ref="users" stripe style="width: 100%">
            <el-table-column prop="username" label="用户名" width="120" />
            <el-table-column prop="email" label="邮箱" width="160" />
            <el-table-column prop="mobile" label="电话号码" width="160"/>
            <el-table-column prop="role_name" label="角色名" width="140" />
            <el-table-column label="可用状态" width="120">
                <template #default="scope">
                    <el-switch v-model="scope.row.mg_state"  @change="userStateChange(scope.row)" style="--el-switch-off-color:#abadb3"/>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template #default="scope">
                    <el-button type="primary"  @click="showEditDialog(scope.row.id)" size="small" icon="Edit"/>
                    <el-button type="danger" @click="removeUserById(scope.row.id)" size="small" icon="Delete" />
                    <el-button type="warning" size="small" icon="Edit" />
                </template>
            </el-table-column>
        </el-table>
    </el-card>

    <el-dialog v-model="addDialogVisible" title="新增用户表单" >
        <el-form :model="addForm" :rules="addFormRules" ref="addForm">
            <el-form-item label="用户名:" prop="username" :label-width="100">
                <el-input v-model="addForm.username" />
            </el-form-item>
            <el-form-item label="密码:" prop="password" :label-width="100">
                <el-input v-model="addForm.password" />
            </el-form-item>
            <el-form-item label="确认密码:" prop="_password" :label-width="100">
                <el-input v-model="addForm._password" />
            </el-form-item>
            <el-form-item label="邮 箱:" prop="email" :label-width="100">
                <el-input v-model="addForm.email" />
            </el-form-item>
            <el-form-item label="电话号码:" prop="mobile" :label-width="100">
                <el-input v-model="addForm.mobile" />
            </el-form-item>
        </el-form>
        <template #footer>
        <span class="dialog-footer">
            <el-button type="primary" @click="addUser">
                提交
            </el-button>
            <el-button @click="addDialogVisible = false">取消</el-button>
        </span>
        </template>
    </el-dialog>

    <el-dialog v-model="editDialogVisible" title="修改用户信息" >
        <el-form :model="editForm" :rules="editFormRules" ref="editForm">
            <el-form-item label="用户名:" prop="username" :label-width="100">
                <el-input v-model="editForm.username" disabled/>
            </el-form-item>
            <el-form-item label="邮 箱:" prop="email" :label-width="100">
                <el-input v-model="editForm.email" />
            </el-form-item>
            <el-form-item label="电话号码:" prop="mobile" :label-width="100">
                <el-input v-model="editForm.mobile" />
            </el-form-item>
        </el-form>
        <template #footer>
        <span class="dialog-footer">
            <el-button type="primary" @click="editUserInfo">
                提交
            </el-button>
            <el-button @click="editDialogVisible = false">取消</el-button>
        </span>
        </template>
    </el-dialog>
</template>

<script>

export default {
    data(){
        var checkemail=(rule,value,callback)=>{
            if(!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$/.test(value)){
                callback(new Error("不符合邮箱规则"));
            }else{
                callback();
            }
        };
        var checkmobile=(rule,value,callback)=>{
            if(!/^1\d{9}/.test(value)){
                callback(new Error("不符合电话号码"));
            }else{
                callback();
            }
        };
        var checkPass = (rule, value, callback) => {
            if (value !== this.addForm.password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };

        return{
            users:[],
            pageInfo:{
                "pagenum":1,
                "pagesize":5
            },
            query:'',
            
            addDialogVisible:false,
            addForm:{
                username:"shu006",
                password:"34069959",
                _password:"34069959",
                email:"1392213777@qq.com",
                mobile:"18675417814"
            },
            addFormRules:{
                username:[
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                ],
                password:[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, message: '密码长度不少于6个字符', trigger: 'blur' },
                ],
                _password:[
                    { required: true, message: '请再次输入密码', trigger: 'blur' },
                    { validator:checkPass,trigger:'blur'}
                ],
                email:[
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator:checkemail,trigger:'blur'}
                ],
                mobile:[
                    { required: true, message: '请输入电话号码', trigger: 'blur' },
                    { validator:checkmobile,trigger:'blur'}
                ]  
            },

            editDialogVisible:false,
            editForm:{
                username:"",
                mobile:"",
                email:""
            },
            editFormRules:{
                email:[
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator:checkemail,trigger:'blur'}
                ],
                mobile:[
                    { required: true, message: '请输入电话号码', trigger: 'blur' },
                    { validator:checkmobile,trigger:'blur'}
                ]  
            },
        }
    },
    methods:{
        async getUsers(){
            const res=await this.$http.get("users",{params:{
                "pagenum":this.pageInfo.pagenum,
                "pagesize":this.pageInfo.pagesize,
                "query":this.query
            }});
            this.users=res.data.data.users
            console.log(this.users);
        },
        async userStateChange(userInfo){
            const res=await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`);
            if(res.data.meta.status!=200){
                this.$message.error(res.data.meta.msg);
            }else{
                this.$message.success(res.data.meta.msg);
            }
        },
        addUser(){
            this.$refs.addForm.validate(async (valid)=>{
                if(valid){
                    const res= await this.$http.post("users",this.addForm);
                    console.log(res.data);
                    if(res.data.meta.status!=201){
                        this.$message.error(res.data.meta.msg);
                    }else{
                        this.$message.success(res.data.meta.msg);
                        this.$router.go(0);
                    }
                }else{
                    this.$message.warning("表单验证失败")
                }
            })
        },
        async showEditDialog(id){
            const res=await this.$http.get(`users/${id}`);
            console.log(res.data);
            this.editDialogVisible=true;
            if(res.data.meta.status!=200){
                this.$message.error("获取用户信息失败")
            }else{
                this.editForm=res.data.data
            }
        },
        editUserInfo(user){
            console.log(user);
            this.$refs.editForm.validate(async (valid)=>{
                if(valid){
                    console.log(this.editForm);
                    const res= await this.$http.put(`users/${this.editForm.id}`,{
                        mobile:this.editForm.mobile,
                        email:this.editForm.email
                    });
                    console.log(res.data);
                    if(res.data.meta.status!=200){
                        this.$message.error(res.data.meta.msg);
                    }else{
                        this.$message.success(res.data.meta.msg);
                        this.$router.go(0);
                    }
                }else{
                    this.$message.warning("表单验证失败")
                }
            })
        },
        async removeUserById(id){
            const result=await this.$confirm(
                "是否删除该管理员，此操作不可挽回",
                "提示",
                {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            ).catch(err=>err);
            if(result=="confirm"){
                const res=await this.$http.delete(`users/${id}`)
                if(res.data.meta.status!=200){
                    this.$message.error(res.data.meta.msg);
                }else{
                    this.$message.success(res.data.meta.msg);
                    this.$router.go(0);
                }
            }
        }
    },
    created(){
        this.getUsers();
    }
}
</script>

<style>

</style>