<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-setting"></i> 系统管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
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
         <el-tooltip content="1:超级管理员、2:平台工作人员、3:商铺主" placement="top">
           <el-button
                  type="primary"
                  icon="el-icon-lock"
                  class="handle-del mr10"
          >权限说明</el-button>
        </el-tooltip>
        <!-- 搜索 关键词 -->
        <el-select v-model="query.queryName" placeholder="关键词" class="handle-select mr10">
          <el-option key="1" label="用户编号" value="user_id"></el-option>
          <el-option key="2" label="用户名" value="username"></el-option>
          <el-option key="3" label="密码" value="password"></el-option>
          <el-option key="4" label="权限" value="authority"></el-option>
          <el-option key="5" label="备注" value="details"></el-option>
          <el-option key="6" label="——全部——" value="0"></el-option>
        </el-select>
        <el-input v-model="query.queryContent" placeholder="输入搜索信息..." class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      </div>
      <!-- 表格的表头：表内容通过prop绑定数据 -->
      <el-table
              :data="tableData"
              border
              class="table"
              ref="multipleTable"
              header-cell-class-name="table-header"
              @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="user_id" label="用户编号" width="130" align="center"></el-table-column>
        <el-table-column prop="username" label="用户名" align="center"></el-table-column>
        <el-table-column prop="password" label="密码" align="center"></el-table-column>
        <el-table-column prop="authority" label="权限" align="center"></el-table-column>
        <el-table-column prop="details" label="备注" align="center"></el-table-column>
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

    <!-- 新增弹出框 -->
    <el-dialog title="新增" :visible.sync="addVisible" width="30%">
      <el-form ref="form" :model="add_form" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="add_form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="add_form.password"></el-input>
        </el-form-item>
        <el-form-item label="权限">
          <el-input v-model="add_form.authority"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="add_form.details"></el-input>
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
        <el-form-item label=用户编号>
          <el-input v-model="form.user_id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="权限">
          <el-input v-model="form.authority"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.details"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
    </el-dialog>
  </div>
</template>

<script>
import {get,post} from '@/utils/request';
export default {
  name:'user_info',
  data() {
    return {
      query: {
        queryContent: '',
        queryName: '',
        pageIndex: 1,
        pageSize: 5,
      },
      tableData: [],
      multipleSelection: [],
      delList: [],
      editVisible: false,
      addVisible: false,
      pageTotal: 0,
      form: {},
      add_form:{ //新增数据
        user_name: "",
        password: "",
        authority: "",
        details: "",
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
      get(`/dao.show_userInfo?index=${this.query.pageIndex}&${this.query.queryName}=${this.query.queryContent}`)
              .then( data =>{
                if(data.code === 200){
                  if(data.data.infoList.length > 0){
                    this.tableData = data.data.infoList;
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
      get(`/dao.show_userInfo?${query_name}=${query_content}`)
              .then( data =>{
                if(data.code === 200){
                  if(data.data.infoList.length > 0){
                    this.tableData = data.data.infoList;
                    this.pageTotal = data.data.count || 0;
                    this.query.pageIndex = data.data.index;
                    this.query.pageSize = data.data.pageSize
                  }else{
                    this.$message.error(`数据库没有相关数据`);
                  }
                }
              })
      //更新视图
      // this.$set(this.query, 'pageIndex', 1);
    },
    //添加数据
    addDate(){
      this.addVisible = true;
    },
    //保存新增
    saveAdd(){
      post(`/dao.add_userInfo?username=${this.add_form.username}`+
              `&password=${this.add_form.password}`+
              `&authority=${this.add_form.authority}`+
              `&details=${this.add_form.details}
                `
      )
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
      let cur_id = this.tableData[index].user_id;
      get(`/dao.del_userInfo?user_id=${cur_id}`)
              .then(data =>{
                if(data.code === 200){
                  this.$message.error(`删除了${this.tableData[index].username},1条数据`);
                  this.tableData.splice(index, 1);
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
      let str = '';
      let strIds = '';
      this.delList = this.delList.concat(this.multipleSelection);
      if(length > 0){
        for (let i = 0; i < length; i++) {
          str += this.multipleSelection[i].username + ' ';
          strIds += this.multipleSelection[i].user_id + ',';
        }
        //发送批量删除请求
        get(`/dao.del_userInfo?user_id=${strIds}`)
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
      post(`/dao.update_userInfo?user_id=${curEdit_row.user_id}`+
              `&username=${curEdit_row.username}`+
              `&password=${curEdit_row.password}`+
              `&authority=${curEdit_row.authority}`+
              `&details=${curEdit_row.details}
                `
      )
              .then( data =>{
                if(data.code === 200){
                  this.editVisible = false;
                  this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                  this.$set(this.tableData, this.idx, this.form);
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
}
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
