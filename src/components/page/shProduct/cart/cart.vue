<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 购物车管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <!-- 新增、删除、搜索 -->
            <div class="handle-box">
                <!-- <el-button
                    type="danger"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量删除</el-button> -->
                <!-- <el-button
                    type="success"
                    icon="el-icon-plus"
                    class="handle-del mr10"
                    @click="addDate"
                >新增数据</el-button> -->
          <el-tooltip content="删除单条数据、修改数据、查询全部数据" placement="top">
              <el-button
              type="info"
              icon="el-icon-info"
              class="handle-del mr10"
          >备注</el-button>
          </el-tooltip>
                <!-- 搜索 关键词-->
                <!-- <el-select v-model="query.queryName" placeholder="关键词" class="handle-select mr10">
                    <el-option key="1" label="商品序列号" value="pid"></el-option>
                    <el-option key="2" label="商品名称" value="pname"></el-option>
                    <el-option key="3" label="商品发布人" value="username"></el-option>
                    <el-option key="4" label="——全部——" value="0"></el-option>
                </el-select>
                <el-input v-model="query.queryContent" placeholder="输入搜索信息..." class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button> -->
            </div>
            <!-- 表格的表头：表内容通过prop绑定数据 -->
            <el-table
                :data="cartData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="商品ID" align="center"></el-table-column>
                <el-table-column prop="name" label="商品名称" align="center"></el-table-column>
                 <el-table-column prop="pimg" label="商品图片" align="center">
                    <template   slot-scope="scope">            
                        <img :src="scope.row.image" min-width="150" height="150"/><!-- min-width="70" height="70" -->
                    </template> 
                </el-table-column>
                <el-table-column prop="price" label="商品价格" align="center"></el-table-column>
                <el-table-column prop="productNum" label="商品数量" align="center"></el-table-column>
                <el-table-column prop="userName" label="用户名称" align="center"></el-table-column>
                  <el-table-column prop="pimg" label="用户头像" align="center">
                    <template   slot-scope="scope">            
                        <img :src="scope.row.userImg" min-width="70" height="70"/><!-- min-width="70" height="70" -->
                    </template> 
                </el-table-column>
                <el-table-column prop="comment" label="备注" width="180" align="center">
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
            <!-- 页码 -->
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 新增弹出框 -->
        <el-dialog title="新增" :visible.sync="addVisible" width="30%">
            <el-form ref="form" :model="add_form" label-width="70px">
                <el-form-item label="商品序号">
                    <el-input v-model="add_form.productId"></el-input>
                </el-form-item>
                <el-form-item label="商品名称">
                    <el-input v-model="add_form.name"></el-input>
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
                <el-form-item label="商品ID">
                    <el-input v-model="form.id" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="商品名称">
                    <el-input v-model="form.name" :disabled="true"></el-input>
                </el-form-item>
                <!-- <el-form-item label="商品图片">
                    <img :src="form.pimg" min-width="70" height="70"/>
                </el-form-item> -->
                <el-form-item label="商品价格">
                    <el-input v-model="form.price" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="商品数量">
                    <el-input v-model="form.productNum"></el-input>
                </el-form-item>
                <el-form-item label="用户名称">
                    <el-input v-model="form.userName" :disabled="true"></el-input>
                </el-form-item>
                <!-- <el-form-item label="用户头像">
                  <img :src="form.pimg" min-width="70" height="70"/>
                </el-form-item> -->
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {get,post,del,put} from '@/utils/request';
import {SH_API} from '@/api/index'
export default {
    name: 'cart',
    data() {
        return {
            query: {
                queryContent: '',
                queryName: '',
                pageIndex: 1,
                pageSize: 5,
            },
            //cartData: [],
            cartData:[],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            addVisible: false,
            //pageTotal: 0,
            form: {},
            add_form:{ //新增数据
              productId: "",
              productNum: "",
            }, 
            idx: -1,  //当前修改条目的id
            id: -1
        };
    },
    created() {
      this.getDate();
    },
    methods: {
        //获取roomType数据
        getDate(){
          get(SH_API+"/cart")
          .then( data =>{
            if(data.code === 200){
              if(data.data.length > 0){
                this.cartData = data.data;
              }
            }
          })
        },
        // 触发搜索按钮
        handleSearch() {
          let query_name = this.query.queryName;
          let query_content = this.query.queryContent;
          if(query_name === 0){query_content = ""}
          get(SH_API + `/address/? ${query_name}=${query_content}`)
          .then( data =>{
            if(data.code === 200){
              if(data.data.infoList.length > 0){
                 this.cartData = data.data.infoList;
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
          post(SH_API+"/address",{
            productId:this.add_form.productId,
            productNum: this.add_form.productNum
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
          let cur_id = this.cartData[index].id;
          del(SH_API+`/cart/${cur_id}`)
          .then(data =>{
            if(data.code === 200){
              this.$message.error(`删除1条数据`);
              this.cartData.splice(index, 1);
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
                  //str += this.multipleSelection[i].floor_name + ' ';
                  strIds += this.multipleSelection[i].id + ',';
              }
              //发送批量删除请求
              get(SH_API+`/cart/${strIds}`)
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
          put(SH_API+`/cart/updateProductNum?cartId=${curEdit_row.id}&productNum=${curEdit_row.productNum}`)
          .then( data =>{
            if(data.code === 200){
              this.editVisible = false;
              this.$message.success(`修改第 ${this.idx + 1} 行成功`);
              this.$set(this.cartData, this.idx, this.form);
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
</style>
