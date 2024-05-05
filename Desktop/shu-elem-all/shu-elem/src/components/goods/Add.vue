<template>
    <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/home' }">home</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home/goods' }">goods</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home/add' }">add</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
        <div class="title">    
            <el-tag class="mx-1" effect="plain" type="info" round>
                <el-icon><Warning /></el-icon>
                请添加商品信息
            </el-tag>
        </div>
        <el-steps :active="Number(active-1)" align-center process-status="process" finish-status="success" >
            <el-step :title="step.title" v-for="step in steps" />
        </el-steps>
        <el-tabs v-model="active" type="border-card" tab-position='left' stretch @tab-change="tabChange" :before-leave="beforeLeave">
            <el-tab-pane label="基本信息" name="1">
            <template  #default>
                <el-form ref="addForm" :model="addForm" :rules="addFormRules" label-width="80px">
                    <el-form-item label="商品名称" prop="goods_name">
                        <el-input v-model="addForm.goods_name" />
                    </el-form-item>
                    <el-form-item label="商品价格" prop="goods_price">
                        <el-input v-model="addForm.goods_price" />
                    </el-form-item>
                    <el-form-item label="商品数量" prop="goods_number">
                        <el-input v-model="addForm.goods_number" />
                    </el-form-item>
                    <el-form-item label="商品重量" prop="goods_weight">
                        <el-input v-model="addForm.goods_weight" />
                    </el-form-item>
                    <el-form-item label="商品分类" prop="goods_cat">
                        <el-cascader v-model="selectedIds" :options="categories" :props="props" @change="cateSelected" @focus="this.getCategories()"/>
                    </el-form-item>
                </el-form>
            </template>
            </el-tab-pane>
            <el-tab-pane label="商品参数" name="2">
                <el-form :model="manyTableData"  label-position="top" label-width="200px">
                    <el-form-item v-for="param in manyTableData" :key="param.attr_id" :label="param.attr_name">
                            <el-checkbox-group v-model="paramsList">
                                <el-checkbox :label="attr_val" v-for="attr_val in param.attr_vals" :key="attr_val" border/>
                            </el-checkbox-group>
                    </el-form-item>              
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="商品属性" name="3">
                <el-form :model="onlyTableData">
                    <el-form-item v-for="param in onlyTableData" :label="param.attr_name" >
                        <el-input v-model="param.attr_vals"/>
                    </el-form-item>              
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="商品图片" name="4">
                <el-upload
                    class="upload-demo"
                    :action="uploadUrl"
                    :headers="headerObj"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-success="handleSuccess"
                    list-type="picture"
                >
                    <el-button type="primary">上传图片</el-button>
                    <template #tip>
                    </template>
                </el-upload>
            </el-tab-pane>
            <el-tab-pane label="商品描述" name="5">
                <!-- <div style="border: 1px solid #ccc;height:500px" > -->
                    <Editor style="height:300px"/>
                <!-- </div> -->
            </el-tab-pane>
        </el-tabs>



        <div class="next">
            <el-button style="margin-top: 12px;justify-content:'right'" type="primary" @click="addGoods">提交商品</el-button>
        </div>
        <el-dialog v-model="previewVisible" title="预览图片">
            <img :src="previewUrl" alt=''>
        </el-dialog>
        
    </el-card>
</template>

<script>
import { ArrowRight } from '@element-plus/icons-vue'
import Editor from '@/components/Editor.vue';

export default {
    components: {
        Editor
    },
    data(){
        return{
            ArrowRight,



            //0 步骤条和标签页
            active:1,
            steps:[
                { title:"基本信息" },
                { title:"商品参数" },
                { title:"商品属性" },
                { title:"商品图片" },
                { title:"商品描述" },
                { title:"完成" }
            ],

            //1 基本信息
            categories:[],
            props:{
                value:'cat_id',
                label:"cat_name",
                children:"children",
                leaf:"cat_level>=2",
                checkStrictly:true,
            },
            selectedIds:[1,3,6],
        
            addForm:{
                goods_name:"小米电视",
                goods_cat:["1","3","6"],
                goods_price:100,
                goods_number:1,
                goods_weight:200,
                goods_introduce:"",
                pics:[],
                attrs:[]
            },
            addFormRules:{
                goods_name:[
                    { required: true, message: '不能为空', trigger: 'blur' },
                ],
                goods_cat:[
                    { required: true, message: '不能为空', trigger: 'blur' },
                ],
                goods_price:[
                    { required: true, message: '不能为空', trigger: 'blur' },
                ],
                goods_number:[
                    { required: true, message: '不能为空', trigger: 'blur' },
                ],
                goods_weight:[
                    { required: true, message: '不能为空', trigger: 'blur' },
                ],
                attrs:[
                    { required: true, message: '不能为空', trigger: 'blur' },
                ],
            },

            // 2和3 商品属性和商品参数
            onlyTableData:[],
            manyTableData:[],
            paramsList:[],

            // 4 商品图片
            uploadUrl:"http://127.0.0.1:8888/api/private/v1/upload",
            headerObj:{
                Authorization:window.sessionStorage.getItem("token")
            },

            previewVisible:false,
            previewUrl:"",
            
        }
    },
    methods:{
        next(){
            this.active+=1;
        },
        beforeLeave(active,old){
            if(old==1 && this.selectedIds.length!=3){
                return false;
            }
            return true;
        }, 
        tabChange(tabName){
            if(tabName==2){
                this.getParams("many");
            }else if(tabName==3){
                this.getParams("only");
            }
            console.log(this.addForm);

        },
        async getCategories(){
            const res=await this.$http.get(`categories`)
            if(res.data.meta.status!=200){
                this.$message.error("请先选择商品分类")
            }else{
                this.categories=res.data.data;
            }
        },
        cateSelected(ids){
            if(ids.length<=2){
                this.selectedIds=[];
                this.$message.warning("只能选择三级分类商品分类");
            }
        },
        async getParams(sel){
            if(this.selectedIds.length==0){
                this.active="1";
            }
            const res=await this.$http.get(`categories/${this.selectedIds[this.selectedIds.length-1]}/attributes?sel=${sel}`)
            if(res.data.meta.status!=200){
                this.$message.error("获取分类属性列表失败")
            }else if(sel=="only"){
                this.onlyTableData=res.data.data;
                for(let i=0;i<this.onlyTableData.length;i++){
                    this.onlyTableData[i].attr_vals=String(this.onlyTableData[i].attr_vals).split(",");
                }
            }else{
                this.manyTableData=res.data.data;
                for(let i=0;i<this.manyTableData.length;i++){
                    this.manyTableData[i].attr_vals=String(this.manyTableData[i].attr_vals).split(",");
                }
            }

        },
        handleSuccess(picInfo){
            this.addForm.pics.push({pic:picInfo.data.tmp_path});
        },
        handlePreview(picObj){
            this.previewUrl=picObj.response.data.url;
            this.previewVisible=true;
        },
        handleRemove(pic){
            const index=this.addForm.pics.findIndex((p)=>{p==pic})
            this.addForm.pics.splice(index,1);
        },        
        async addGoods(){
            console.log("提交的商品  ",this.addForm);
            this.$refs.addForm.validate(async valid=>{
                if(!valid){
                    this.$message.error("数据校验失败，无法提交")
                }else{
                    const res=await this.$http.post(`goods`,{
                        "goods_name":this.addForm.goods_name,
                        "goods_cat": this.selectedIds.join(),
                        "goods_price":Number(this.addForm.goods_price),
                        "goods_number":this.addForm.goods_number,
                        "goods_weight":this.addForm.goods_weight,
                        "goods_introduce":this.addForm.goods_introduce,
                        "pics":[],
                        "attrs":[]
                    })
                    if(res.data.meta.status!=201){
                        this.$message.error("添加商品失败")
                    }else{
                        this.$message.success("添加商品成功")
                    }
                    console.log(res.data);
                }
            })
        }
    },
    created(){
        this.active=1
    },


}
</script>

<style lang="less" scoped>
    .title{
        display: flex;
        justify-content: center;
        margin-bottom: 15px;
    }
    .el-steps{
        margin:10px;
    }
    .next{
        display: flex;
        justify-content: right;
        margin-right: 20px;
    }
    .el-form{
        margin-left: 0px;
    }
    .el-checkbox{
        margin: 5px;
    }
    img{
        max-width: 560px;
    }
    .w-e-text-container{
        height: 300px;
        max-height: 300px;
    }
</style>