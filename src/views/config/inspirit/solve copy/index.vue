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
      <el-table-column label="贡献维度" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.Demand == 1">有突出贡献</span>
          <span v-if="scope.row.Demand == 2">有重要贡献</span>
          <span v-if="scope.row.Demand == 3">较低/无贡献</span>
        </template>
      </el-table-column>
      <el-table-column label="浮动比例" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.Redio }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.Remark }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="created_at" label="操作" width="200">
        <template slot-scope="scope">
          <span>
            <el-button type="text" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// import { getList } from '@/api/auth'
import { getAll } from '@/api/config/inspirit/solve'
// import { validAuth } from '@/utils/validate'

export default {
  filters: {
    IsNeedPmFilter(status) {
      const sexMap = {
        0: '未知',
        1: '是',
        2: '否'
      }
      return sexMap[status]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
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
        this.list = response.Data
        this.listLoading = false
      })
    },
    handleCreate(row) {
      this.$router.push({
        path: '/config/product/confirm/create',
        query: {
          id: row.id,
          name: row.name
        }
      })
    },
    handleEdit(row) {
      console.log('row---------------', row)
      this.$router.push({
        path: '/config/product/confirm/create',
        query: {
          id: row.employeeInfo.id
        }
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

