<template>
  <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/home' }">home</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home/goods' }">goods</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card  class="box-card">
    <el-row>
        <el-col :span=8>
            <el-input v-model="query">
                <template #append>
                    <el-button icon="Search" @click="getGoods" style="text-color:'#000000';background-color:#e0e0e0"/>
                </template>
            </el-input>
        </el-col>
        <el-col :span="4">
            <template #default>
                <el-button type="primary" @click="showAddVue">添加</el-button>
            </template>
        </el-col>
    </el-row>
      <el-table :data="goodslist" stripe border style="width: 100%" size="small">
          <el-table-column type="index" label="#" width="40px"></el-table-column>
          <el-table-column prop="goods_name" label="商品名称" width="400px"></el-table-column>
          <el-table-column prop="goods_price" label="商品价格(元)"  width="100px"></el-table-column>
          <el-table-column prop="goods_weight" label="商品重量" width="70px"></el-table-column>
          <el-table-column prop="add_time" label="创建时间"></el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="scope">
                <el-button type="primary"  @click="showEditDialog(scope.row)" size="small" icon="Edit"/>
                <el-button type="danger" @click="removeGoodsById(scope.row)" size="small" icon="Delete" />
                <el-button type="warning" size="small" icon="Edit" />
            </template>
          </el-table-column>
      </el-table>
      <div class="pagination-block">
            <el-pagination
                v-model:current-page="pagenum"
                v-model:page-size="pagesize"
                :total="total"
                :page-sizes="[5, 10, 20,50]"
                layout="sizes, prev, pager, next"
                @size-change="getGoods"
                @current-change="getGoods"
                />
        </div>
  </el-card>

  <el-dialog v-model="editDialogVisible" title="修改商品信息" >
    <el-form :model="editForm" :rules="editFormRules" label-width="120px">
      <el-form-item label="商品名称" prop="goods_name">
        <el-input v-model="editForm.goods_name" />
      </el-form-item>
      <el-form-item label="商品分类" prop="goods_cat">
        <el-cascader v-model="selectedIds" :options="categories" :props="props" @change="cateSelected" @focus="this.getCategories()"/>
      </el-form-item>
      <el-form-item label="商品价格" prop="goods_price">
        <el-input v-model="editForm.goods_price" />
      </el-form-item>
      <el-form-item label="商品数量" prop="goods_number">
        <el-input v-model="editForm.goods_number" />
      </el-form-item>
      <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="editForm.goods_weight" />
      </el-form-item>
      <el-form-item label="商品介绍" prop="goods_introduce">
        <el-input v-model="editForm.goods_introduce" />
      </el-form-item>   
      </el-form>
    </el-dialog>
</template>
    <script>
      // import {ArrowRight} from ""
      export default {
        data(){
          return{
            goodslist:[],
      query:"",
      pagenum:1,
      pagesize:10,
      total:100,

      categories:[],
      props:{
          value:'cat_id',
          label:"cat_name",
          children:"children",
          leaf:"cat_level>=2",
          checkStrictly:true,
      },
      selectedIds:[],


      editDialogVisible:false,
      editForm:{
          goods_name:"",
          goods_cat:"",
          goods_price:"",
          goods_number:"",
          goods_weight:"",
          goods_introduce:"",
          pics:{},
          attrs:[]
      },
      editFormRules:{
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
          goods_introduce:[
              { required: true, message: '不能为空', trigger: 'blur' },
          ],
          pics:[
              { required: true, message: '不能为空', trigger: 'blur' },
          ],
          attrs:[
              { required: true, message: '不能为空', trigger: 'blur' },
          ],
      },
    }
  },
  methods:{
    showAddVue(){
      this.$router.push("/home/add");
    },
    async getGoods(){
      const res=await this.$http.get(`goods?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
      if(res.data.meta.status!=200){
          this.$message.error("获取商品列表失败")
      }else{
          this.goodslist=res.data.data.goods;
          this.goodslist.map(item => {
            item.add_time=(new Date(item.add_time)).toLocaleString()
          });
      }
      // console.log(this.goodslist);
    },       
    showEditDialog(goods){
      console.log(goods);
      this.editDialogVisible=true;
      this.editForm.goods_name=goods.goods_name;
      this.selectedIds=[],
      // this.editForm.goods_cat=this.selectedIds;
      this.editForm.goods_price=goods.goods_price;
      this.editForm.goods_number=goods.goods_number;
      this.editForm.goods_weight=goods.goods_weight;
      this.editForm.goods_introduce=goods.goods_introduce;
      this.editForm.pics=goods.pics;
      this.editForm.attrs=goods.attrs;
     },
    //  async getCategories(){
    //     const res=await this.$http.get(`categories`)
    //     if(res.data.meta.status!=200){
    //         this.$message.error("请先选择商品分类")
    //     }else{
    //         this.categories=res.data.data;
    //     }
    //  },
     async editGoods(goods){
      const res=await this.$http.put(`goods/${goods.goods_id}`)
      if(res.data.meta.status!=200){
          this.$message.error("获取商品列表失败")
      }else{
          this.goodslist=res.data.data.goods;
          this.goodslist.map(item => {
            item.add_time=(new Date(item.add_time)).toLocaleString()
          });
      }
    },
  },
  created(){
      this.getGoods();
      // this.getCategories();
  }
}
</script>

<style lang="less" scoped>
    .el-pagination{
      justify-content: center ;
    }
    .el-cascader{
      width: "420px";
    }
</style>