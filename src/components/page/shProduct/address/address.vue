<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 地址管理
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
          <el-tooltip content="新增数据、删除单条数据、修改数据、查询全部数据" placement="top">
              <el-button
              type="info"
              icon="el-icon-info"
              class="handle-del mr10"
          >备注</el-button>
          </el-tooltip>
             <!-- 搜索 关键词 -->
                <!-- <el-select v-model="query.queryName" placeholder="关键词" class="handle-select mr10">
                    <el-option key="1" label="城市" value="address"></el-option>
                    <el-option key="2" label="学校" value="university"></el-option>
                    <el-option key="3" label="楼号" value="dormitory"></el-option>
                    <el-option key="4" label="宿舍号" value="room"></el-option>
                    <el-option key="5" label="——全部——" value="0"></el-option>
                </el-select>
                <el-input v-model="query.queryContent" placeholder="输入搜索信息..." class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
             -->
            </div>
            <!-- 表格的表头：表内容通过prop绑定数据 -->
            <el-table
                :data="addressData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                 <el-table-column prop="id" label="地址ID" align="center"></el-table-column>
                <el-table-column prop="nickname" label="姓名" align="center"></el-table-column>
                <el-table-column prop="phone" label="电话号码" align="center"></el-table-column>
                <el-table-column prop="province,city,area" label="收货地址" align="center">
                    <template slot-scope="scope">
                        {{scope.row.province}}{{scope.row.city}}{{scope.row.area}}
                    </template>
                </el-table-column>
                <el-table-column prop="university,campus+dormitory,room" label="详细地址" align="center">
                    <template slot-scope="scope">
                        {{scope.row.university}}{{scope.row.dormitory}}{{scope.row.room}}
                    </template>
                </el-table-column>
                 <el-table-column prop="comment" label="备注" align="center"></el-table-column>
                <!-- <el-table-column prop="university" label="学校" align="center"></el-table-column>
                <el-table-column prop="campus" label="校区" align="center"></el-table-column>
                <el-table-column prop="dormitory" label="楼号" align="center"></el-table-column>
                <el-table-column prop="room" label="宿舍号" align="center"></el-table-column> -->
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

        <!-- 新增弹出框 -->
        <el-dialog title="新增" :visible.sync="addVisible" width="30%">
            <el-form ref="form" :model="add_form" label-width="70px">
                <el-form-item label="姓名">
                    <el-input v-model="add_form.nickname"></el-input>
                </el-form-item>
                <el-form-item label="电话号码">
                    <el-input v-model="add_form.phone"></el-input>
                </el-form-item>
                <el-form-item label="省市区">
                    <el-cascader
                        size="large"
                        :options="options"
                        v-model="selectedOptions"
                        @change="addressChange">
                    </el-cascader>
                 </el-form-item>
                <el-form-item label="学校">
                    <el-input v-model="add_form.university"></el-input>
                </el-form-item>
                <el-form-item label="校区">
                    <el-input v-model="add_form.campus"></el-input>
                </el-form-item>
                <el-form-item label="楼号">
                    <el-input v-model="add_form.dormitory"></el-input>
                </el-form-item>
                <el-form-item label="宿舍号">
                    <el-input v-model="add_form.room"></el-input>
                </el-form-item>
                 <el-form-item label="备注">
                    <el-input v-model="add_form.comment"></el-input>
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
              <el-form-item label="地址ID">
                    <el-input v-model="form.id" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="form.nickname"></el-input>
                </el-form-item>
                <el-form-item label="电话号码">
                    <el-input v-model="form.phone"></el-input>
                </el-form-item>
                <el-form-item label="省市区">
                    <el-cascader
                        size="large"
                        :options="options"
                        v-model="selectedOptions"
                        @change="addressChange">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="详细地址">
                    <el-input v-model="add_form.detailAddress"></el-input>
                 </el-form-item>
                <!-- <el-form-item label="学校">
                    <el-input v-model="form.university"></el-input>
                </el-form-item>
                <el-form-item label="校区">
                    <el-input v-model="form.campus"></el-input>
                </el-form-item>
                <el-form-item label="楼号">
                    <el-input v-model="form.dormitory"></el-input>
                </el-form-item>
                <el-form-item label="宿舍号">
                    <el-input v-model="form.room"></el-input>
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
import {SH_API} from '@/api/index';
import { provinceAndCityData, regionData, provinceAndCityDataPlus, regionDataPlus, CodeToText, TextToCode } from 'element-china-area-data'
export default {
    name: 'address',
    data() {
        return {
            query: {
                queryContent: '',
                queryName: '',
                pageIndex: 1,
                pageSize: 5,
            },
            addressData:[],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            addVisible: false,
            pageTotal: 0,
            form: {},
            add_form:{ //新增数据
              nickname: "",
              phone: "",
              detailAddress:""
            },
            idx: -1,  //当前修改条目的id
            id: -1,
            options: regionData,
            selectedOptions: []
        };
    },
    created() {
      this.getDate();
    },
    methods: {
        //获取roomType数据
        getDate(){
           get(SH_API + `/address`)
          .then( data =>{
            if(data.code === 200){
              if(data.data.length > 0){
                this.addressData = data.data;
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
          get(SH_API + `/address/? ${query_name}=${query_content}`)
          .then( data =>{
            if(data.code === 200){
              if(data.data.infoList.length > 0){
                 this.addressData = data.data.infoList;
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
        //地址 省市区
        addressChange(arr) {
          console.log(arr);
          console.log(CodeToText[arr[0]], CodeToText[arr[1]], CodeToText[arr[2]]);
        },
        //保存新增
        saveAdd(){
          post(SH_API+"/address",{
            nickname:this.add_form.nickname,
            phone:this.add_form.phone,
            province:"江苏省",
            city:"南京市",
            area:"雨花台区",
            // selectedOptions:this.selectedOptions,//省市区
            // detailAddress:this.add_form.detailAddress,//详细地址
            university: this.add_form.university,
            campus: this.add_form.campus,
            dormitory: this.add_form.dormitory,
            room: this.add_form.room,
            comment: this.add_form.comment,
            isDefault: 1,

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
          let cur_id = this.addressData[index].id;
          del(SH_API+`/address/${cur_id}`)
          .then(data =>{
            if(data.code === 200){
              this.$message.error(`删除了1条数据`);
              this.addressData.splice(index, 1);
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
                //   str += this.multipleSelection[i].name + ' ';
                  strIds += this.multipleSelection[i].id + ',';
              }
              //发送批量删除请求
              del(SH_API+`/address/${strIds}`)
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
          put(SH_API+"/address",{
            id:curEdit_row.id,
            nickname:curEdit_row.nickname,
            phone:curEdit_row.phone,
            // selectedOptions:this.selectedOptions,
            // detailAddress:curEdit_row.detailAddress,
            // university: curEdit_row.university,
            // campus: curEdit_row.campus,
            // dormitory: curEdit_row.dormitory,
            // room: curEdit_row.room,
            area: "江宁区",
            campus: "江宁区",
            city: "南京市",
            dormitory: "8号楼",
            isDefault: 0,
            province: "江苏省",
            room: "303",
            university: "中国药科大学",
            comment: curEdit_row.comment
          })
          .then( data =>{
            if(data.code === 200){
              this.editVisible = false;
              this.$message.success(`修改第 ${this.idx + 1} 行成功`);
              this.$set(this.addressData, this.idx, this.form);
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
