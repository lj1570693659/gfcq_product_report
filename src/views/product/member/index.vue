<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.proId" :placeholder="$t('table.product')" clearable style="width: 200px" class="filter-item">
        <el-option v-for="item in productAll" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-select v-model="listQuery.empId" :placeholder="$t('table.productMember')" clearable style="width: 200px" class="filter-item">
        <el-option v-for="item in employeeAll" :key="item.Id" :label="item.WorkNumber" :value="item.Id" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <!-- <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        {{ $t('table.add') }}
      </el-button> -->
    </div>
    <el-table
      v-loading="listLoading"
      :data="memberList"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="参与项目">
        <template slot-scope="scope">
          {{ scope.row.productInfo.subName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="项目角色">
        <template slot-scope="scope">
          {{ scope.row.productMemberInfo.prName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="工号">
        <template slot-scope="scope">
          {{ scope.row.productMemberInfo.workNumber }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名">
        <template slot-scope="scope">
          {{ scope.row.employeeInfo.UserName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="直接领导(部门/领导)">
        <template slot-scope="scope">
          <p v-for="(item,index) in scope.row.leaderInfo" :key="item+index" :label="item.name" :value="item.id" class="board-item">
            {{ index }}/{{ item }}
          </p>
        </template>
      </el-table-column>
      <el-table-column align="center" label="分类">
        <template slot-scope="scope">
          {{ scope.row.productMemberInfo.type }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="投入占比">
        <template slot-scope="scope">
          {{ scope.row.productMemberInfo.putInto.toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="责任系数">
        <template slot-scope="scope">
          {{ scope.row.productMemberInfo.dutyIndex }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="职级">
        <template slot-scope="scope">
          {{ scope.row.jobLevelInfo.Name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="责任和职务">
        <template slot-scope="scope">
          {{ scope.row.productMemberInfo.specificDuty }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="工作地">
        <template slot-scope="scope">
          {{ scope.row.productMemberInfo.workAddress }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="主导方">
        <template slot-scope="scope">
          <span v-if="scope.row.productMemberInfo.isGuide == 1">是</span>
          <span v-if="scope.row.productMemberInfo.isGuide == 0">否</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="支持方">
        <template slot-scope="scope">
          <span v-if="scope.row.productMemberInfo.isSupport == 1">是</span>
          <span v-if="scope.row.productMemberInfo.isSupport == 0">否</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注">
        <template slot-scope="scope">
          {{ scope.row.productMemberInfo.remark }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" width="200">
        <template slot-scope="scope">
          <span>
            <el-button type="text" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" size="small" icon="el-icon-edit" @click="handleDelete(scope.row)">删除</el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :size.sync="listQuery.size" @pagination="fetchData" />

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      width="50%"
    >
      <el-form
        ref="temp"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="120px"
        style="margin-left: 50px"
      >
        <el-form-item label="工作属性" prop="attributeName">
          <el-select v-model="temp.attribute" :remote-method="getAttribute" filterable default-first-option remote placeholder="请选择项目经理属性">
            <el-option v-for="(item,index) in attributeOptions" :key="item+index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="工作地点：" prop="workAddress">
          <el-input
            v-model="temp.workAddress"
            size="small"
            autocomplete="off"
            placeholder="请输入工作地点"
          />
        </el-form-item>
        <el-form-item label="职责和职务：" prop="specificDuty">
          <el-input
            v-model="temp.specificDuty"
            size="small"
            autocomplete="off"
            placeholder="请输入职责和职务"
          />
        </el-form-item>
        <el-form-item label="角色分类：" prop="type">
          <el-select v-model="temp.type" :remote-method="getAttribute" filterable default-first-option remote placeholder="请选择角色分类">
            <el-option v-for="(item,index) in typeOptions" :key="item+index" :label="item.name" :value="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="投入比例：" prop="putInto">
          <el-input
            v-model="temp.putInto"
            size="small"
            autocomplete="off"
            placeholder="请输入投入比例"
          />
        </el-form-item>
        <el-form-item label="是否主导：" prop="isGuide">
          <el-select v-model="temp.isGuide" :remote-method="getAttribute" filterable default-first-option remote placeholder="请选择是否主导">
            <el-option v-for="(item,index) in supportOptions" :key="item+index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否支持：" prop="isSupport">
          <el-select v-model="temp.isSupport" :remote-method="getAttribute" filterable default-first-option remote placeholder="请选择是否支持">
            <el-option v-for="(item,index) in supportOptions" :key="item+index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input
            v-model="temp.remark"
            size="small"
            autocomplete="off"
            placeholder="请输入备注信息"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" size="small" @click="dialogStatus === 'create' ? createData() : updateData()"> 确认 </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { getMemberLists, deleteProductMember, getAll, modifyMemberData } from '@/api/product/index'
import { getEmployeeAll } from '@/api/system//organize/employee'
// import { validAuth } from '@/utils/validate'

export default {
  components: { Pagination },
  filters: {
    SexFilter(status) {
      const sexMap = {
        0: '未知',
        1: '男',
        2: '女'
      }
      return sexMap[status]
    }
  },
  data() {
    const validatePutIntoRequire = (rule, value, callback) => {
      if (value === '' || value === 0 || value === undefined) {
        this.$message({
          message: '投入比例为必传',
          type: 'error'
        })
        callback(new Error('请输入投入比例'))
      } else {
        var numReg = /^\D*([0-9]\d*\.?\d{0,3})?.*$/
        var numRe = new RegExp(numReg)
        if (!numRe.test(value) || value > 1 || value < 0) {
          this.$message({
            message: '请输入正确的投入比例',
            type: 'error'
          })
          callback(new Error('请输入正确的投入比例'))
        }
        callback()
      }
    }
    return {
      list: null,
      memberList: [],
      productAll: [],
      employeeAll: [],
      attributeOptions: [],
      typeOptions: [],
      supportOptions: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 10
      },
      textMap: {
        update: '编辑',
        create: '录入阶段绩效'
      },
      dialogStatus: '',
      dialogFormVisible: false,
      temp: {},
      rules: {
        putInto: [{ validator: validatePutIntoRequire }]
      }
    }
  },
  created() {
    this.fetchData()
    this.getProductAll()
    this.getProductMembereAll()
    this.getAttribute()
    this.getTypeOption()
    this.getSupportOption()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getMemberLists(this.listQuery).then(response => {
        this.memberList = response.data
        this.total = response.totalSize
        this.size = response.size
        this.listLoading = false
      }).catch(err => {
        console.log(err)
      })
    },
    getProductAll() {
      getAll().then(response => {
        this.productAll = response
      })
    },
    getProductMembereAll() {
      getEmployeeAll().then(response => {
        this.employeeAll = response.Data
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchData()
    },
    handleDelete(row) {
      deleteProductMember({ id: row.productMemberInfo.id, proId: row.productMemberInfo.proId }).then(response => {
        this.$notify({
          title: '成功',
          message: '提交成功',
          type: 'success',
          duration: 2000
        })
        this.fetchData()
      })
    },
    getAttribute() {
      this.attributeOptions.push({ id: 0, name: '请选择' })
      this.attributeOptions.push({ id: 1, name: '全职' })
      this.attributeOptions.push({ id: 2, name: '兼职' })
    },
    getTypeOption() {
      this.typeOptions.push({ id: 0, name: '请选择' })
      this.typeOptions.push({ id: 1, name: '一环' })
      this.typeOptions.push({ id: 2, name: '二环' })
    },
    getSupportOption() {
      this.supportOptions.push({ id: 0, name: '否' })
      this.supportOptions.push({ id: 1, name: '是' })
    },
    handleCreate(row) {
      this.$router.push({
        path: '/product/create',
        query: {
          id: row.id,
          name: row.name
        }
      })
    },
    handleEdit(row) {
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
      this.temp = row.productMemberInfo
      this.$nextTick(() => {
        this.$refs['temp'].clearValidate()
      })
    },
    updateData() {
      if (Number(this.temp.putInto) === 1) {
        this.temp.attributeName = '全职'
      } else {
        this.temp.attributeName = '兼职'
      }

      this.$refs.temp.validate(valid => {
        if (valid) {
          modifyMemberData(this.temp).then(response => {
            location.reload()
          })
        }
      })
    },
    handleAchieve(row) {
      console.log(row)
      this.parentId = row.parent
      this.dialogStatus = 'create'
      this.temp.proId = row.productInfo.id
      this.dialogFormVisible = true
      this.getStage(row.productInfo.id)
      this.getKpi()
      this.$nextTick(() => {
        this.$refs['temp'].clearValidate()
      })
    },
    handleShowAchieve(row) {
      this.$router.push({
        path: '/achieve/index',
        query: {
          proId: row.id
        }
      })
    }
  }
}
</script>

