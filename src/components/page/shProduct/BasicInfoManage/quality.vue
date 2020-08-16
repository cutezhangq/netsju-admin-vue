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
            <!-- <div class="handle-box">
             搜索 关键词
                <el-select v-model="query.queryName" placeholder="关键词" class="handle-select mr10">
                    <el-option key="1" label="商品序列号" value="pid"></el-option>
                    <el-option key="2" label="商品名称" value="pname"></el-option>
                    <el-option key="3" label="商品发布人" value="username"></el-option>
                    <el-option key="4" label="——全部——" value="0"></el-option>
                </el-select>
                <el-input v-model="query.queryContent" placeholder="输入搜索信息..." class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div> -->
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
                        <img :src="scope.row.pimg" min-width="50" height="50"/><!-- min-width="70" height="70" -->
                    </template> 
                </el-table-column>
                <el-table-column prop="pname" label="商品名称" align="center"></el-table-column>
                <el-table-column prop="price" label="单价" align="center"></el-table-column>
                <el-table-column prop="username" label="商品发布人" align="center"></el-table-column>
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
    name: 'floor_info',
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
              }
            }
          })
        },
        // 触发搜索按钮
        // handleSearch() {
        //   let query_name = this.query.queryName;
        //   let query_content = this.query.queryContent;
        //   if(query_name === 0){query_content = ""}
        //   get(SH_API + `/shProduct/? ${query_name}=${query_content}`)
        //   .then( data =>{
        //     if(data.code === 200){
        //       if(data.data.length > 0){
        //          this.cartData = data.data;
        //       }else{
        //          this.$message.error(`数据库没有相关数据`);
        //       }
        //     }
        //   })
        //   //更新视图
        //   this.$set(this.query, 'pageIndex', 1);
        // },
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
