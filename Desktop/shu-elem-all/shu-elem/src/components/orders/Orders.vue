<template>
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/home' }">home</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home/roles' }">roles</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
        <el-table :data="orderList">
            <el-table-column type="index" label="#" width="50"/>
            <el-table-column prop="order_number" label="订单号" width="240"  />
            <el-table-column prop="order_price" label="订单价格" width="80" />
            <el-table-column prop="pay_status" label="是否付款" width="80" />
            <el-table-column prop="is_send" label="是否发货"  width="80" />
            <el-table-column prop="update_time" label="下单时间" width="200"  />
            <el-table-column label="操作"  >
                <template #default="scope">
                    <el-button type="primary"  @click="showEditDialog(scope.row)" size="small" icon="Edit"></el-button>
                    <el-button type="success" @click="showCurrLocation(scope.row.id)" size="small" icon="Location"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="example-pagination-block">
            <el-pagination
                v-model:current-page="pagenum"
                v-model:page-size="pagesize"
                :total="total"
                :page-sizes="[5, 10, 20,50]"
                layout="sizes, prev, pager, next"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                />
        </div>
    </el-card>

    <el-dialog v-model="editDialogVisible" title="修改商品信息" >
      <el-form :model="editForm" :rules="editFormRules" label-width="80px">
        <el-form-item label="省市区">
            <el-cascader
              :options="cityOptions"
              v-model="editForm.city"
              @change="changeProvince"
              change-on-select
            >
          </el-cascader>     
        </el-form-item>   
        <el-form-item label="收获地址" prop="concrete_addr">
          <el-input v-model="editForm.concrete_addr" />
        </el-form-item>
      </el-form>

      <template #footer>
          <span class="dialog-footer">
              <el-button type="info" @click="editDialogVisible=false" >
                  取消
              </el-button>
              <el-button type="primary" @click="updateConsigneeAddr" >
                  提交
              </el-button>
          </span>
      </template>
    </el-dialog>

    <el-dialog v-model="locationDialogVisible" title="查看物流信息" >
      <el-timeline>
        <el-timeline-item
          v-for="event in locationEvents"
          :key="index"
          :timestamp="activity.timestamp"
        >
          {{ event.content }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
</template>

<script>
import { ArrowRight } from '@element-plus/icons-vue'
import cityOptions from '@/js/city_data2017_element.js'

export default {
  components:{
    ArrowRight,
    cityOptions
  },
  data(){
    return{
      query:"",
      pagenum:1,
      pagesize:10,
      total:100,
      user_id:"",
      pay_status:"",
      is_send:"",
      order_fapiao_title:"",
      order_fapiao_company:"",
      order_fapiao_content:"",
      consignee_addr:"",

      orderList:[],

      editDialogVisible:false,
      editForm:{
        city:[],
        concrete_addr:"",
      },
      editFormRules:{
        concrete_addr:[
              { required: true, message: '不能为空', trigger: 'blur' },
          ],
      },
      cityOptions: cityOptions,

      locationDialogVisible:false,
      locationEvents:[]

        
    }
  },
  methods:{
    async getOrders(){
      console.log(this);
      const res=await this.$http.get(`orders?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
      if(res.data.meta.status!=200){
          this.$message.error("获取商品列表失败")
      }else{
          this.orderList=res.data.data.goods;
          this.orderList.map(item => {
            item.update_time=(new Date(item.update_time)).toLocaleString()
          });
      }
    },
    handleSizeChange(size){
        this.pageSize=size;
        this.getOrders();
    },
    handleCurrentChange(page){
        this.currentPage=page;
        this.getOrders();
    },
    showEditDialog(goods){
      this.editDialogVisible=true;
      this.editForm.consignee_addr=goods.consignee_addr;
    },
    changeProvince(city){
    },
    updateConsigneeAddr(){
      if(this.editForm.city.length==0){
        this.$message("请先选择省市区");
        return;
      }
      const city=this.editForm.city.join("");
      const consignee_addr=city+this.editForm.concrete_addr;
      console.log(consignee_addr);
    },
    async showCurrLocation(){
      const id="1106975712662";
      this.locationDialogVisible=true;
      const res=await this.$http.get(`kuaidi/${id}`)
      if(res.data.meta.status!=200){
          this.$message.error("获取物流信息失败")
      }else{
          console.log(res.data);;
      }
    },

  },
  created(){
    this.getOrders();
  }
}
</script>

<style lang="less" scoped>
  .example-pagination-block{
    display: flex;
    justify-content: center;
  }
</style>