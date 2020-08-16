<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-tickets"></i> 商品管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
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
                 <!-- 搜索 关键词 -->
                <el-select v-model="query.queryName" placeholder="关键词" class="handle-select mr10">
                    <el-option key="1" label="商品序列号" value="pid"></el-option>
                    <el-option key="2" label="商品名称" value="pname"></el-option>
                    <el-option key="3" label="商品发布人" value="username"></el-option>
                    <el-option key="4" label="——全部——" value="0"></el-option>
                </el-select>
                <el-input v-model="query.queryContent" placeholder="输入搜索信息..." class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <!-- 表格的表头：表内容通过prop绑定数据 -->
            <el-table
                :data="productData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header">
                <el-table-column prop="pid" label="商品序列号" align="center"></el-table-column>
                <el-table-column prop="pimg" label="商品图片" align="center">
                    <template   slot-scope="scope">            
                        <img :src="scope.row.pimg" min-width="150" height="150"/><!-- min-width="70" height="70" -->
                    </template> 
                </el-table-column>
                <el-table-column prop="pname" label="商品名称" align="center"></el-table-column>
                <el-table-column prop="price" label="单价" align="center"></el-table-column>
                <el-table-column prop="username" label="商品发布人" align="center"></el-table-column>
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

    </div>
</template>

<script>
import {get,post,del,put} from '@/utils/request';
import {SH_API} from '@/api/index'
export default {
    name: 'quality',
    data() {
        return {
            query: {
                queryContent: '',
                queryName: '',
                pageIndex: 1,
                pageSize: 5
            },
            pageTotal: 0,
            page:0,
            productData:[],
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
          get(SH_API + `/shProduct/index?page=${this.page}`)
          .then( data =>{
            if(data.code === 200){
              if(data.data.length > 0){
                this.productData = data.data;
                this.pageTotal = data.data.count || 0;  //总条数
                this.query.pageIndex = data.data.index;  //当前页号
                this.query.pageSize = data.data.pageSize  //限制每页数据条数
              }
            }
          })
        },
        // 触发搜索按钮
        handleSearch() {
          let query_name = this.query.queryName;
          let query_content = this.query.queryContent;
          if(query_name === 0){query_content = ""}
          // get(SH_API + `/shProduct/? ${query_name}=${query_content}`)
          // .then( data =>{
          //   if(data.code === 200){
          //     if(data.data.length > 0){
          //        this.cartData = data.data;
          //     }else{
          //        this.$message.error(`数据库没有相关数据`);
          //     }
          //   }
          // })
          //更新视图
          this.$set(this.query, 'pageIndex', 1);
        },

        //添加数据
        addDate(){
          this.addVisible = true;
        },
        //删除一条数据
        delOneDate(index){
          let cur_id = this.tableData[index].goods_id;
          // get(`/dao.del_goodsInfo?goods_id=${cur_id}`)
          // .then(data =>{
          //   if(data.code === 200){
          //     this.$message.error(`删除了${this.tableData[index].goods_name},1条数据`);
          //     this.tableData.splice(index, 1);
          //     this.getDate();
          //   }
          // })
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
            let str = '';
            let strIds = '';
            this.delList = this.delList.concat(this.multipleSelection);
            if(length > 0){
              for (let i = 0; i < length; i++) {
                  str += this.multipleSelection[i].goods_name + ' ';
                  strIds += this.multipleSelection[i].goods_id + ',';
              }
              //发送批量删除请求
              // get(`/dao.del_goodsInfo?goods_id=${strIds}`)
              // .then(data =>{
              //   if(data.code === 200){
              //     let delDateNum = strIds.match(/,/g).length;
              //     this.$message.error(`批量删除了${delDateNum}条数据`);
              //     this.multipleSelection = [];
              //     this.getDate();
              //   }
              // })

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
          // post(`/dao.update_goodsInfo?goods_id=${curEdit_row.goods_id}`+
          //       `&goods_name=${curEdit_row.goods_name}`+
          //       `&type_id=${curEdit_row.type_id}`+
          //       `&price=${curEdit_row.price}`+
          //       `&discount=${curEdit_row.discount}`+
          //       `&unit=${curEdit_row.unit}`+
          //       `&details=${curEdit_row.details}
          //       `
          // )
          // .then( data =>{
          //   if(data.code === 200){
          //     this.editVisible = false;
          //     this.$message.success(`修改第 ${this.idx + 1} 行成功`);
          //     this.$set(this.tableData, this.idx, this.form);
          //     this.getDate();
          //   }
          // })
        },

        // 分页导航
        handlePageChange(val) {
          //更新视图
          // this.$set(this.query, 'pageIndex', val);
          this.query.pageIndex = val;
          this.getDate();
        }
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
