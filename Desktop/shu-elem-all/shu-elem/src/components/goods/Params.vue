<template>
    <el-card class="box-card">
        <span class="cate_span">请选择要添加参数的分类:</span>
        <el-cascader size="default" v-model="selectedIds" :options="categories" :props="props" @change="selectedIdChange" />
        <el-tabs v-model="activeName" type="card" class="demo-tabs" @tab-change="selectedIdChange">
            <el-tab-pane label="静态属性" name="many">
                <el-table :data="paramsTable">
                    <el-table-column type="expand" width="50px" aria-expanded>
                        <template #default="scope">
                            <el-row>
                                <el-tag class="mx-1" v-for="attr_val in scope.row.attr_vals" :key="attr_val" type="primary" closable @close="removeAttrVal(scope.row,attr_val)">{{ attr_val }}</el-tag>
                                <el-input 
                                    v-if="inputVisible"
                                    ref="InputRef"
                                    v-model="new_attr_val"
                                    class="ml-1 w-20"
                                    size="small"
                                    @keyup.enter="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)"
                                />
                                <el-button v-else class="button-new-tag ml-1" size="small" @click="inputVisible=true">
                                    + New Tag
                                </el-button>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column type="index" label="#"></el-table-column>
                    
                    <el-table-column align="center" prop="attr_name" label="参数名称"></el-table-column>
                    <el-table-column align="center" label="操作">
                        <template #default="scope">
                            <el-button class="btn" type="primary" @click="showEditDialog(scope.row)">修改</el-button> 
                            <el-button class="btn" type="danger" @click="removeAttr(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="动态参数" name="only">
                <el-table :data="paramsTable">
                    <el-table-column type="expand" width="50px" aria-expanded>
                        <template #default="scope">
                            <el-row>
                                <el-tag class="mx-1" v-for="attr_val in scope.row.attr_vals" :key="attr_val" type="primary" closable @close="removeAttrVal(scope.row,attr_val)">{{ attr_val }}</el-tag>
                                <el-input 
                                    v-if="inputVisible"
                                    ref="InputRef"
                                    v-model="new_attr_val"
                                    class="ml-1 w-20"
                                    size="small"
                                    @keyup.enter="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)"
                                />
                                <el-button v-else class="button-new-tag ml-1" size="small" @click="inputVisible=true">
                                    + New Tag
                                </el-button>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column type="index" label="#"></el-table-column>
                    <el-table-column align="center" prop="attr_name" label="参数名称"></el-table-column>
                    <el-table-column align="center" label="操作">
                        <template #default="scope">
                            
                            <el-button class="btn" type="primary" @click="showEditDialog(scope.row)">修改</el-button> 
                            <el-button class="btn" type="danger" @click="removeAttr(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
    </el-card>

    
    <el-dialog v-model="editDialogVisible" title="修改分类属性" >
        <el-form :model="editForm" :rules="editFormRules" label-width="120px">
            <el-form-item label="属性名称" prop="name">
                <el-input v-model="editForm.name"/>
            </el-form-item>
        </el-form>

        <template #footer>
            <span class="dialog-footer">
                <el-button type="info" @click="editDialogVisible=false" >
                    取消
                </el-button>
                <el-button type="primary" @click="editAttrName()" >
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
            selectedIds:[6],

            activeName:"many",
            paramsTable:[],

            inputVisible:false,
            new_attr_val:"",

            editDialogVisible:false,
            editedAttr:{},
            editForm:{
                name:""
            },
            editFormRules:{
                name:[
                    { required: true, message: '属性值不能为空', trigger: 'blur' },
                    { min: 1, max: 12, message: '属性值必须在12个字符以内', trigger: 'blur' }
                ],
            },
        }
    },
    methods:{
        async getCategories(){
            const res=await this.$http.get(`categories`)
            if(res.data.meta.status!=200){
                this.$message.error("获取分类列表失败")
            }else{
                this.categories=res.data.data;
            }
        },
        selectedIdChange(){
            this.getParams(Number(this.selectedIds[this.selectedIds.length-1]))         
        },
        async getParams(){
            const res=await this.$http.get(`categories/${this.selectedIds[this.selectedIds.length-1]}/attributes?sel=${this.activeName}`)
            console.log(res.data);
            if(res.data.meta.status!=200){
                this.$message.error("获取分类属性列表失败")
            }else{
                this.paramsTable=res.data.data;
            }
            for(let i=0;i<this.paramsTable.length;i++){
                this.paramsTable[i].attr_vals=String(this.paramsTable[i].attr_vals).split(",");
            }
        },
        async editAttr(attr){
            const res=await this.$http.put(`categories/${attr.cat_id}/attributes/${attr.attr_id}`,{
                attr_name:attr.attr_name,
                attr_sel:attr.attr_sel,
                attr_vals:attr.attr_vals.join(),
            })
            if(res.data.meta.status!=200){
                this.$message.error("分类属性修改失败")
                attr.attr_vals.pop();
            }else{
                this.$message.success("分类属性修改成功")
            }
            
            this.$router.go(0);
        },
        handleInputConfirm(attr){
            if (this.new_attr_val.trim()!="") {
                attr.attr_vals.push(this.new_attr_val);
                this.editAttr(attr);
            }
            this.inputVisible = false
            this.new_attr_val = ''
        },
        async removeAttrVal(attr,attr_val){
            const result=await this.$confirm(
                "是否删除该属性值，此操作不可挽回",
                "提示",
                {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            ).catch(err=>err);
            if(result=="confirm"){
                attr.attr_vals=attr.attr_vals.filter((val)=>val!=attr_val);
                this.editAttr(attr);
            }
        },
        async removeAttr(attr){
            const result= await this.$confirm(
                "是否删除该属性，此操作不可挽回",
                "提示",
                {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            ).catch(err=>err);
            if(result=="confirm"){
                const res=await this.$http.delete(`categories/${attr.cat_id}/attributes/${attr.attr_id}`)
                if(res.data.meta.status!=200){
                    this.$message.error("删除分类属性失败")
                }else{
                    this.$message.success("成功删除分类属性")
                }
                this.$router.go(0);
            }
        },
        showEditDialog(attr){
            this.editDialogVisible=true;
            this.editForm.name=attr.attr_name;
            this.editedAttr=attr;
        },
        async editAttrName(){
            if(this.editedAttr.attr_name==this.editForm.name){
                this.$alert('属性名称与原值相同', '提示').catch(()=>{});
            }else{
                this.editedAttr.attr_name=this.editForm.name;
                this.editAttr(this.editedAttr);
            }
        }
    },
    created(){
        this.getCategories();
        this.selectedIdChange();
    }
}
</script>

<style lang="less" scoped>
    .cate_span{
        font-size: 16px;
        display: block;
        margin-bottom: 10px;
    }
    :deep(.el-cascader){
        width: 300px;
    }

</style>