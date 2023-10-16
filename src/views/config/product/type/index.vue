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
      <el-table-column label="项目类型">
        <template slot-scope="scope">
          {{ scope.row.Name }}
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.Remark" class="edit-input" size="small" />
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
          <span v-else>{{ row.Remark }}</span>
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
        <el-form-item label="项目类型：" prop="name">
          <el-input
            v-model="temp.name"
            size="small"
            autocomplete="off"
            placeholder="请输入项目类型"
            required
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
import { getAll, createData, modifyData, deleteData } from '@/api/config/product/type'
// import { validAuth } from '@/utils/validate'

export default {
  filters: {
  },
  data() {
    const validateNameRequire = (rule, value, callback) => {
      if (value === '' || value === 0 || value === undefined) {
        this.$message({
          message: '项目类型为必传项',
          type: 'error'
        })
        callback(new Error('请输入项目类型'))
      } else {
        callback()
      }
    }
    return {
      textMap: {
        update: '编辑',
        create: '添加'
      },
      dialogStatus: '',
      dialogFormVisible: false,
      rules: {
        name: [{ validator: validateNameRequire }]
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
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getAll(this.listQuery).then(response => {
        // this.list = response.Data
        this.listLoading = false
        const items = response.Data
        this.list = items.map(v => {
          this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
          v.originalName = v.Name //  will be used when user click the cancel botton
          v.originalRemark = v.Remark //  will be used when user click the cancel botton
          return v
        })
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
    handleEdit(row) {
      this.$router.push({
        path: '/config/product/confirm/create',
        query: {
          id: row.employeeInfo.id
        }
      })
    },
    cancelEdit(row) {
      row.Name = row.originalName
      row.Remark = row.originalRemark
      row.edit = false
      this.$message({
        message: '开发系数未做变更',
        type: 'warning'
      })
    },
    confirmEdit(row) {
      row.edit = false
      row.factor = Number(row.Factor)
      row.id = row.Id
      row.remark = row.Remark
      row.name = row.Name
      modifyData(row).then(response => {
        this.$message({
          message: '开发系数变更',
          type: 'success'
        })
      })
    },
    handleDelete(row) {
      deleteData({ id: row.Id }).then(response => {
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

