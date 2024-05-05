<template> 
    <el-card class="box-card">
        <el-button class="btn" type="primary" @click="addDialogVisible=true">添加分类</el-button>
        <el-button class="btn rt" type="danger" @click="removeCategory">删除分类</el-button>
        <el-button class="btn rt" type="warning" @click="showEditDialog">修改分类</el-button>
        <el-cascader-panel v-model="selectIds" :options="categories" :props="props" />
        <div class="example-pagination-block">
            <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :total="total"
                :page-sizes="[5, 10, 20,50]"
                layout="sizes, prev, pager, next"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                />
        </div>
    </el-card>

    <el-dialog v-model="addDialogVisible" title="添加分类" >
        <el-form :model="addForm" :rules="addFormRules" label-width="120px">
            <el-form-item label="分类名称" prop="name">
                <el-input v-model="addForm.name" />
            </el-form-item>
            <el-form-item label="父级分类" prop="parentId" >
                <el-cascader ref="cascAddRef" :options="categories" :props="props" clearable style="width:450px"/>
            </el-form-item>
        </el-form>

        <template #footer>
            <span class="dialog-footer">
                <el-button type="info" @click="addDialogVisible=false" >
                    取消
                </el-button>
                <el-button type="primary" @click="addCategory" >
                    提交
                </el-button>
            </span>
            </template>
    </el-dialog>

    <el-dialog v-model="editDialogVisible" title="修改分类" >
        <el-form :model="editForm" :rules="editFormRules" label-width="120px">
            <el-form-item label="分类名称" prop="name">
                <el-input v-model="editForm.name" />
            </el-form-item>
            <el-form-item label="分类id" prop="id">
                <el-input v-model="editForm.id" />
            </el-form-item>
        </el-form>

        <template #footer>
            <span class="dialog-footer">
                <el-button type="info" @click="editDialogVisible=false" >
                    取消
                </el-button>
                <el-button type="primary" @click="editCategory" >
                    提交
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script>
export default {
    data(){
        return{
            categories:[],
            props:{
                value:'cat_id',
                label:"cat_name",
                children:"children",
                checkStrictly:true,
            },
            selectIds:[],

            addDialogVisible:false,
            addForm:{
                name:"",
                parentId:""
            },
            addFormRules:{
                name:[
                    { required: true, message: '分类名称不能为空', trigger: 'blur' },
                    { min: 1, max: 12, message: '分类名称必须在12个字符以内', trigger: 'blur' }
                ],
                parentId:[
                    { required: true, message: '请选择父级分类', trigger: 'blur' },
                ]
            },

            editDialogVisible:false,
            editForm:{
                name:"",
                id:""
            },
            editFormRules:{
                name:[
                    { required: true, message: '分类名称不能为空', trigger: 'blur' },
                    { min: 1, max: 12, message: '分类名称必须在12个字符以内', trigger: 'blur' }
                ],
                id:[
                    { required: true, message: '请选择分类id', trigger: 'blur' },
                ]
            },

            currentPage:1,
            pageSize:10,
            total:100,

        }
    },
    methods:{
        async getCategories(){
            const res=await this.$http.get(`categories?type=&pagenum=${this.currentPage}&pagesize=${this.pageSize}`)
            console.log(res.data);
            if(res.data.meta.status!=200){
                this.$message.error("获取分类列表失败")
            }else{
                this.categories=res.data.data.result;
                this.total=res.data.data.total;
            }
            console.log(this.categories);
            // this.currentPage=res.data.
        },
        showAddDialog(){
            this.addDialogVisible=true;
            console.log(this.addDialogVisible);
        },
        async addCategory(){
            const node=this.$refs.cascAddRef.getCheckedNodes()[0]['data'];
            console.log(node.cat_level+1);
            const res=await this.$http.post("categories",{
                "cat_pid":node.cat_id,
                "cat_name":this.addForm.name,
                "cat_level":node.cat_level+1
            })
            console.log(res.data);
            if(res.data.meta.status!=201){
                this.$message.error("添加商品分类失败")
            }else{
                this.$message.success("添加商品分类成功")
                this.$router.go(0);
            }
        },
        handleSizeChange(size){
            this.pageSize=size;
            this.getCategories();
        },
        handleCurrentChange(page){
            this.currentPage=page;
            this.getCategories();
        },
        async removeCategory(){
            console.log(this.selectIds);
            const selectId=this.selectIds.pop();
            const res=await this.$http.delete(`categories/${selectId}`)
            if(res.data.meta.status!=200){
                this.$message.error("删除商品分类失败")
            }else{
                this.$message.success("删除商品分类成功")
                this.$router.go(0);
            }
            console.log(res.data);
        },
        showEditDialog(){
            console.log(this.selectIds);
            if(this.selectIds.length!=0){
                this.editForm.id=this.selectIds.pop()
                this.editDialogVisible=true;
            }else{
                this.$alert('请选择至少一个商品分类', '提示').catch(()=>{});
            }
        },
        async editCategory(){
            const res=await this.$http.put(`categories/${this.editForm.id}`,{
                "cat_name":this.editForm.name,
            })
            console.log(res.data);
            if(res.data.meta.status!=200){
                this.$message.error("修改商品分类失败")
            }else{
                this.$message.success("修改商品分类成功")
                this.$router.go(0);
            }
        },
    },
    created(){
        this.getCategories();
    },


}
</script>

<style lang="less" scoped>
    .el-tree{
        padding-left: 120px;
    }
    .btn{
        margin-bottom: 15px;
    }
    .rt{
        float: right;
    }
    :deep(.el-cascader-menu__wrap){
        height: 380px !important;
    }
    .el-pagination{
        width: 500px;
        margin:30px auto;
    }
</style>