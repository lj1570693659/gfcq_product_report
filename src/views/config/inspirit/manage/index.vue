<template>
  <div class="app-container">
    <el-button class="filter-item" style="margin-left: 10px;margin-bottom: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="角色" align="center">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-select v-model="row.crewManageInfo.productRoleId" placeholder="请选择层级" size="small">
              <el-option key="0" label="顶层标准" value="0" />
              <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </template>
          <span v-else>{{ row.productRoleName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="指数" align="center">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.crewManageInfo.scoreIndex" class="edit-input" size="small" />
          </template>
          <span v-else>{{ row.crewManageInfo.scoreIndex }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.crewManageInfo.remark" class="edit-input" size="small" />
            <el-button
              class="cancel-btn"
              size="small"
              icon="el-icon-refresh"
              type="warning"
              @click="cancelEdit(row)"
            >
              cancel
            </el-button>
          </template>
          <span v-else>{{ row.crewManageInfo.remark }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="created_at" label="操作" width="200">
        <template slot-scope="{row}">
          <el-button
            v-if="row.edit"
            type="success"
            size="small"
            icon="el-icon-circle-check-outline"
            @click="confirmEdit(row)"
          >
            Ok
          </el-button>
          <el-button
            v-else
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="row.edit=!row.edit"
          >
            Edit
          </el-button>
          <el-button
            type="danger"
            size="small"
            icon="el-icon-delete"
            @click="handleDelete(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      width="30%"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="120px"
        style="margin-left: 50px"
      >
        <el-form-item label="角色名称：" prop="productRoleId">
          <el-select v-model="temp.productRoleId" placeholder="请选择层级" size="small">
            <el-option key="0" label="顶层标准" value="0" />
            <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="管理指数" prop="scoreIndex">
          <el-input
            v-model="temp.scoreIndex"
            size="small"
            autocomplete="off"
            placeholder="请输入管理指数"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="temp.remark"
            size="small"
            autocomplete="off"
            placeholder="请输入备注"
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
// import { getList } from '@/api/auth'
import { getAll, createData, modifyData, deleteData } from '@/api/config/inspirit/manage'
import { getLists } from '@/api/config/product/roles'
// import { validAuth } from '@/utils/validate'

export default {
  filters: {
  },
  data() {
    const validateNameRequire = (rule, value, callback) => {
      if (value === '' || value === 0 || value === undefined) {
        this.$message({
          message: '研发模式为必传项',
          type: 'error'
        })
        callback(new Error('请输入研发模式'))
      } else {
        callback()
      }
    }
    const validateScoreRequire = (rule, value, callback) => {
      if (value === '' || value === 0 || value === undefined) {
        this.$message({
          message: '开发系数为必传项',
          type: 'error'
        })
        callback(new Error('请输入开发系数值'))
      } else {
        var numReg = /^\D*([0-9]\d*\.?\d{0,3})?.*$/
        var numRe = new RegExp(numReg)
        if (!numRe.test(value)) {
          this.$message({
            message: '请输入数字格式的开发系数值',
            type: 'error'
          })
          callback(new Error('请输入数字格式的开发系数值'))
        }
        callback()
      }
    }
    return {
      textMap: {
        update: '编辑',
        create: '添加'
      },
      dialogStatus: '',
      roles: [],
      dialogFormVisible: false,
      rules: {
        name: [{ validator: validateNameRequire }],
        factor: [{ validator: validateScoreRequire }]
      },
      list: null,
      total: 0,
      temp: {},
      dataForm: {},
      listLoading: true,
      listQuery: {
        page: 1,
        size: 10
      }
    }
  },
  created() {
    this.fetchData()
    this.getRolesList()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getAll(this.listQuery).then(response => {
        const items = response
        this.list = items.map(v => {
          this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
          v.originalproductRoleId = v.crewManageInfo.productRoleId //  will be used when user click the cancel botton
          v.originalremark = v.crewManageInfo.remark //  will be used when user click the cancel botton
          v.originalscoreIndex = v.crewManageInfo.scoreIndex //  will be used when user click the cancel botton
          return v
        })
        this.listLoading = false
      })
    },
    getRolesList() {
      getLists(this.listQuery).then(response => {
        this.roles = response
        this.listLoading = false
      })
    },
    handleCreate(row) {
      this.temp = {}
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          createData(this.temp).then(response => {
            location.reload()
          })
        }
      })
    },
    cancelEdit(row) {
      row.crewManageInfo.productRoleId = row.originalproductRoleId
      row.crewManageInfo.scoreIndex = row.originalscoreIndex
      row.crewManageInfo.remark = row.originalremark
      row.edit = false
      this.$message({
        message: '参数未做变更',
        type: 'warning'
      })
    },
    confirmEdit(row) {
      row.edit = false
      row.id = row.crewManageInfo.id
      row.productRoleId = row.crewManageInfo.productRoleId
      row.scoreIndex = row.crewManageInfo.scoreIndex
      row.remark = row.crewManageInfo.remark
      modifyData(row).then(response => {
        this.$message({
          message: '参数变更',
          type: 'success'
        })
      })
    },
    handleDelete(row) {
      deleteData({ id: row.crewManageInfo.id }).then(response => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.fetchData()
      })
    }
  }
}
</script>

