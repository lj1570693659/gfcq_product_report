<template>
  <div class="app-container">
    <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" style="margin: 10px 0" @click="handleCreate">添加</el-button>
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
      <el-table-column label="职级">
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
      width="50%"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="120px"
        style="margin-left: 50px"
      >
        <el-form-item label="职级：" prop="name">
          <el-input
            v-model="temp.name"
            size="small"
            autocomplete="off"
            placeholder="请输入职级"
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
        <el-button type="primary" size="small" @click="dialogStatus === 'create' ? createLevelData() : updateData()"> 确认 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { getList } from '@/api/auth'
import { getLevelLists, createData, modifyData, deleteData } from '@/api/system/organize/level'
// import { validAuth } from '@/utils/validate'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      textMap: {
        update: '编辑',
        create: '添加'
      },
      dialogStatus: '',
      dialogFormVisible: false,
      rules: {},
      temp: {},
      list: null,
      listLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getLevelLists().then(response => {
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
    cancelEdit(row) {
      row.Name = row.originalName
      row.Remark = row.originalRemark
      row.edit = false
      this.$message({
        message: '信息未做变更',
        type: 'warning'
      })
    },
    confirmEdit(row) {
      row.edit = false
      row.id = row.Id
      row.remark = row.Remark
      row.name = row.Name
      modifyData(row).then(response => {
        this.$message({
          message: '信息变更成功',
          type: 'success'
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
    createLevelData() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          createData(this.temp).then(response => {
            location.reload()
          })
        }
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
    },
    edit(row = []) {
      console.log(row)
      console.log(this.$refs)
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

