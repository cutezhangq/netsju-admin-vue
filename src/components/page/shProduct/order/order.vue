<template>
    <div>
        <div class="crumbs">
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="全部订单" name="allOrder">
                    <div class="container">
            <!-- 新增、删除、搜索 -->
            <div class="handle-box">
                <el-button
                    type="danger"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量删除</el-button>
                <el-button
                    type="success"
                    icon="el-icon-plus"
                    class="handle-del mr10"
                    @click="addDate"
                >新增数据</el-button>
          <el-tooltip content="询全部数据" placement="top">
              <el-button
              type="info"
              icon="el-icon-info"
              class="handle-del mr10"
          >备注</el-button>
          </el-tooltip>
                <!-- 搜索 关键词 -->
                <el-select v-model="query.queryName" placeholder="关键词" class="handle-select mr10">
                    <el-option key="1" label="商品名称" value="productName"></el-option>
                    <el-option key="2" label="——全部——" value="0"></el-option>
                </el-select>
                <el-input v-model="query.queryContent" placeholder="输入搜索信息..." class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <!-- 表格的表头：表内容通过prop绑定数据 -->
            <div v-for="(item ,index) in orderData" :key="index">
               <div class="orderTop">
                <span class="orderInfoTop">
                  订单号:{{item.orderId}}
                </span>
                <span class="orderInfoTop">
                  商品总价:{{item.realPayment}}
                </span>
                 <span class="orderInfoTop">
                  收货人编号:{{item.sellerId}}
                </span>
               </div>
                <el-table
                  :data="item.orderItemDtoList"
                  border
                  class="table"
                  ref="multipleTable"
                  header-cell-class-name="table-header"
                  @selection-change="handleSelectionChange"
                  style="margin-bottom: 40px;">
                  <el-table-column type="selection" width="55" align="center"></el-table-column>
                  <el-table-column prop="productImg" label="商品图片" align="center"></el-table-column>
                  <el-table-column prop="productName" label="商品名称" align="center"></el-table-column>
                  <el-table-column prop="price" label="商品价格" align="center"></el-table-column>
                  <el-table-column prop="num" label="商品数量" align="center"></el-table-column>
                  <!-- <el-table-column prop="phone" label="收货人电话" align="center"></el-table-column> -->
                  <!-- <el-table-column prop="receiverProvince,receiverCity,receiverArea,receiverUniversity,receiverCampus,receiverDormitory,receiverRoom"
                  label="收货地址" align="center">
                    <template slot-scope="scope">
                          {{scope.row.receiverProvince}}{{scope.row.receiverCity}}{{scope.row.receiverArea}}
                          {{scope.row.receiverUniversity}}{{scope.row.receiverCampus}}{{scope.row.receiverDormitory}}{{scope.row.receiverRoom}}
                      </template>
                  </el-table-column> -->
                  <el-table-column label="操作" width="180" align="center">
                      <template slot-scope="scope">
                          <el-button
                              type="text"
                              icon="el-icon-edit"
                              @click="handleEdit(scope.$index, scope.row)"
                          >编辑</el-button>
                          <el-button
                              type="text"
                              icon="el-icon-delete"
                              class="red"
                              @click="handleDelete(scope.$index, scope.row)"
                          >删除</el-button>
                      </template>
                  </el-table-column>
              </el-table>
            </div>
        </div>

        <!-- 新增弹出框 -->
        <el-dialog title="新增" :visible.sync="addVisible" width="30%">
            <el-form ref="form" :model="add_form" label-width="70px">
                <el-form-item label="商品数量">
                    <el-input v-model="add_form.num"></el-input>
                </el-form-item>
                <el-form-item label="商品Id">
                    <el-input v-model="add_form.productId"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="收货人">
                    <el-input v-model="form.receiverName"></el-input>
                </el-form-item>
                <el-form-item label="收货人电话">
                    <el-input v-model="form.phone"></el-input>
                </el-form-item>
                <el-form-item label="收货地址">
                    <el-input v-model="form.detailAddress"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

              </el-tab-pane>
              <el-tab-pane label="待支付" name="PayOrder">
              待支付
              </el-tab-pane>
              <el-tab-pane label="待收货" name="ReceiptOrder">
              待收货
              </el-tab-pane>
            </el-tabs>
        </div>
    
    </div>
</template>

<script>
import {get,post,del,put} from '@/utils/request';
import {SH_API} from '@/api/index'
export default {
    name: 'order',
    data() {
        return {
            query: {
                queryContent: '',
                queryName: '',
                pageIndex: 1,
                pageSize: 5,
            },
            activeName: 'allOrder',
            orderData:[],
            orderItemDtoList:[],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            addVisible: false,
            form: {},
            add_form:{ //新增数据
              num:"",
              productId:""
            }, 
            idx: -1,  //当前修改条目的id
            id: -1
        };
    },
    created() {
      this.getDate();
    },
    methods: {
      //切换导航栏
      handleClick(tab, event) {
        console.log(tab, event);
      },
        //获取roomType数据
        getDate(){
           post(SH_API + `/order/search/0`,{})
          .then( data =>{
            if(data.code === 200){
              if(data.data.length > 0){
                this.orderData = data.data;
                this.orderItemDtoList =  data.data.orderItemDtoList;
              }
            }
          })
        },
        // 触发搜索按钮
        handleSearch() {
          let query_name = this.query.queryName;
          let query_content = this.query.queryContent;
          if(query_name === 0){query_content = ""}
          get(SH_API + `/order/? ${query_name}=${query_content}`)
          .then( data =>{
            if(data.code === 200){
              if(data.data.length > 0){
                 this.orderData = data.data;
              }else{
                 this.$message.error(`数据库没有相关数据`);
              }
            }
          })
          //更新视图
          this.$set(this.query, 'pageIndex', 1);
        },
        //添加数据
        addDate(){
          this.addVisible = true;
        },
        //保存新增
        saveAdd(){
          post(SH_API+"/order",{
            num:this.add_form.num,
            productId:this.add_form.productId,
          })
          .then( data =>{
            if(data.code === 200){
              this.addVisible =  false;
              this.$message.success(`新增一条数据成功`);
              this.getDate();
            }
          })
        },

        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },

        //删除一条数据
        delOneDate(index){
          let cur_id = this.orderData[index].orderId;
          del(SH_API+`/order/${cur_id}`)
          .then(data =>{
            if(data.code === 200){
              this.$message.error(`删除了${this.orderData[index].sellerName},1条数据`);
              this.orderData.splice(index, 1);
              this.getDate();
            }
          })
        },

        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
            .then(() => {
              this.delOneDate(index);
            })
            .catch(() => {});
        },

        //批量删除
        delAllSelection() {
            const length = this.multipleSelection.length;
            //let str = '';
            let strIds = '';
            this.delList = this.delList.concat(this.multipleSelection);
            if(length > 0){
              for (let i = 0; i < length; i++) {
                  //str += this.multipleSelection[i].orderId + ' ';
                  strIds += this.multipleSelection[i].orderId + ',';
              }
              //发送批量删除请求
              get(SH_API+`/order/${strIds}`)
              .then(data =>{
                if(data.code === 200){
                  let delDateNum = strIds.match(/,/g).length;
                  this.$message.error(`批量删除了${delDateNum}条数据`);
                  this.multipleSelection = [];
                  this.getDate();
                }
              })

            }else{
              this.$message.error(`请选择要删除的条目`);
            }
        },

        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;  //当前行
            this.editVisible = true;
        },

        // 保存编辑
        saveEdit() {
          let curEdit_row = this.form;
          put(SH_API+"/order",{
            receiverName:curEdit_row.receiverName,
            detailAddress: curEdit_row.detailAddress,
            phone: curEdit_row.phone,
          })
          .then( data =>{
            if(data.code === 200){
              this.editVisible = false;
              this.$message.success(`修改第 ${this.idx + 1} 行成功`);
              this.$set(this.orderData, this.idx, this.form);
              this.getDate();
            }
          })
        },
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
.orderTop{
  margin-bottom: 10px;
  color: #676767;
}
.orderInfoTop{
  margin-right: 60px;
  
}
</style>
