<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-tickets"></i> 商品留言评论管理
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
            </div>
            <!-- 表格的表头：表内容通过prop绑定数据 -->
            <el-table :data="commentData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
                @selection-change="handleSelectionChange">
                <el-table-column prop="productId" label="商品序号" align="center"></el-table-column>
                <el-table-column prop="username" label="发表人" align="center"></el-table-column>
                <el-table-column prop="createTime" label="发表时间" align="center"></el-table-column>
                <el-table-column prop="replayCommentId" label="回复数" align="center"></el-table-column>
                <el-table-column prop="content" label="评论详情" align="center"></el-table-column>
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
                <el-form-item label="评论内容">
                    <el-input v-model="add_form.content"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {get,post} from '@/utils/request';
import {SH_API} from '@/api/index';
export default {
    name: 'checkin_info_report',
    data() {
        return {
            query: {
                queryContent: '',
                queryName: '',
                pageIndex: 1,
                pageSize: 5,
            },
            add_form:{ //新增数据
              productId: "",
              content: "",
            }, 
            commentData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            addVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,  //当前修改条目的id
            id: -1
        };
    },
    created() {
      this.getDate();
    },
    methods: {
        getDate(){
          get(SH_API+`/comment/productId`)
          .then( data =>{
            if(data.code === 200){
              if(data.data.infoList.length > 0){
                this.commentData = data.data.infoList;
                this.pageTotal = data.data.count || 0;  //总条数
                this.query.pageIndex = data.data.index;  //当前页号
                this.query.pageSize = data.data.pageSize  //限制每页数据条数
              }
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
          del(SH_API+`/comment/${cur_id}`)
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

        //添加数据
        addDate(){
          this.addVisible = true;
        },
        //保存新增
        saveAdd(){
          post(SH_API+"/comment",{
            productId:this.add_form.productId,
            content: this.add_form.content
          })
          .then( data =>{
            if(data.code === 200){
              this.addVisible =  false;
              this.$message.success(`新增一条数据成功`);
              this.getDate();
            }
          })
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
