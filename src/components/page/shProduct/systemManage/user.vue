<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 用户管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <!-- 搜索、修改 -->
            <div class="handle-box">
                <!-- 搜索 关键词 名称 价格 数量-->
                <el-select v-model="query.queryName" placeholder="关键词" class="handle-select mr10">
                    <el-option key="1" label="昵称" value="username"></el-option>
                    <el-option key="2" label="性别" value="gender"></el-option>
                    <el-option key="3" label="班级" value="clazz"></el-option>
                    <el-option key="4" label="学号" value="sno"></el-option>
                    <el-option key="5" label="——全部——" value="0"></el-option>
                </el-select>
                <el-input v-model="query.queryContent" placeholder="输入搜索信息..." class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <!-- 表格的表头：表内容通过prop绑定数据 -->
            <el-table
                :data="userData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header">
                <el-table-column prop="username" label="昵称" align="center"></el-table-column>
                <el-table-column prop="gender" label="性别" align="center"></el-table-column>
                <el-table-column prop="birth" label="出生日期" align="center"></el-table-column>
                <el-table-column prop="introduction" label="个人简介" align="center"></el-table-column>
                <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
                <el-table-column prop="dormitory" label="宿舍号" align="center"></el-table-column>
                <el-table-column prop="clazz" label="班级" align="center"></el-table-column>
                <el-table-column prop="sno" label="学号" align="center"></el-table-column>
            </el-table>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="昵称">
                    <el-input v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio v-model="form.gender" label="0">男</el-radio>
                    <el-radio v-model="form.gender" label="1">女</el-radio>
                </el-form-item>
                <el-form-item label="出生日期">
                    <el-input v-model="form.birth"></el-input>
                </el-form-item>
                <el-form-item label="个人简介">
                    <el-input v-model="form.introduction"></el-input>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="form.phone"></el-input>
                </el-form-item>
                <el-form-item label="宿舍号">
                    <el-input v-model="form.dormitory"></el-input>
                </el-form-item>
                <el-form-item label="班级">
                    <el-input v-model="form.clazz"></el-input>
                </el-form-item>
                <el-form-item label="学号">
                    <el-input v-model="form.sno"></el-input>
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
import {SH_API} from '@/api/index'
export default {
    name: 'order_info_report',
    data() {
        return {
            query: {
                queryContent: '',
                queryName: '',
                pageIndex: 1,
                pageSize: 5,
            },
            userData: [],
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
          get(SH_API+"/user")
          .then( data =>{
            if(data.code === 200){
              if(data.data.length > 0){
                this.userData = data.data;
              }
            }
          })
        },
       // 触发搜索按钮
        handleSearch() {
          let query_name = this.query.queryName;
          let query_content = this.query.queryContent;
          if(query_name === 0){query_content = ""}
          get(SH_API + `/user/? ${query_name}=${query_content}`)
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

        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;  //当前行
            this.editVisible = true;
        },

        // 保存编辑
        saveEdit() {
          let curEdit_row = this.form;
          put(SH_API+"/address",{
            username:curEdit_row.username,
            gender:curEdit_row.gender,
            birth: curEdit_row.birth,
            introduction: curEdit_row.introduction,
            phone: curEdit_row.phone,
            dormitory:curEdit_row.dormitory,
            clazz: curEdit_row.clazz,
            sno: curEdit_row.sno
          })
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
