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
      <el-table-column label="岗位名称">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.job.name" class="edit-input" size="small" />
          </template>
          <span v-else>{{ row.job.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属部门">
        <template slot-scope="scope">
          {{ scope.row.department.name }}
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.job.remark" class="edit-input" size="small" />
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
          <span v-else>{{ row.job.remark }}</span>
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
        <el-form-item label="所属部门" prop="departId">
          <el-select v-model="temp.departId" :remote-method="getDepartment" filterable default-first-option remote placeholder="请选择所属部门" style="width: 100%;">
            <el-option v-for="(item,index) in departmentListOptions" :key="item+index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="岗位名称：" prop="name">
          <el-input
            v-model="temp.name"
            size="small"
            autocomplete="off"
            placeholder="请输入岗位名称"
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
import { getJobLists, createJobData, modifyJobData, deleteJobData } from '@/api/system/organize/job'
import { getDepartmentLists } from '@/api/system/organize/department'
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
      departmentListOptions: [],
      list: null,
      listLoading: true
    }
  },
  created() {
    this.fetchData()
    this.getDepartment()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getJobLists().then(response => {
        this.listLoading = false
        const items = response.data
        this.list = items.map(v => {
          this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
          v.originalName = v.job.name //  will be used when user click the cancel botton
          v.originalRemark = v.job.remark //  will be used when user click the cancel botton
          v.originalDepartId = v.job.departId //  will be used when user click the cancel botton
          return v
        })
      })
    },
    getDepartment() {
      getDepartmentLists().then(response => {
        if (!response) return
        this.departmentListOptions.push({ id: 0, name: '请选择' })
        response.forEach((k, v) => {
          if (k.parentId === 0) {
            this.departmentListOptions.push({ id: k.id, name: k.name })
            k.children.forEach((kc, vc) => {
              this.departmentListOptions.push({ id: kc.id, name: k.name + ' - ' + kc.name })
              kc.children.forEach((skc, svc) => {
                this.departmentListOptions.push({ id: skc.id, name: k.name + ' - ' + kc.name + ' - ' + skc.name })
                console.log('this.departmentListOptions----skc--------------', skc)
                if (skc.children !== null) {
                  skc.children.forEach((skc2, svc2) => {
                    this.departmentListOptions.push({ id: skc2.id, name: k.name + ' - ' + kc.name + ' - ' + skc.name + ' - ' + skc2.name })
                  })
                }
              })
            })
          }
          console.log('this.departmentListOptions------------------', this.departmentListOptions)
        })
      })
    },
    cancelEdit(row) {
      row.job.name = row.originalName //  will be used when user click the cancel botton
      row.job.remark = row.originalRemark //  will be used when user click the cancel botton
      row.job.departId = row.originalDepartId //  will be used when user click the cancel botton
      row.edit = false
      this.$message({
        message: '信息未做变更',
        type: 'warning'
      })
    },
    confirmEdit(row) {
      row.edit = false
      row.id = row.job.id
      row.remark = row.job.remark
      row.departId = row.job.departId
      row.name = row.job.name
      modifyJobData(row).then(response => {
        this.$message({
          message: '信息变更成功',
          type: 'success'
        })
      })
    },
    handleCreate() {
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
          createJobData(this.temp).then(response => {
            location.reload()
          })
        }
      })
    },
    handleDelete(row) {
      deleteJobData({ id: row.job.id }).then(response => {
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

