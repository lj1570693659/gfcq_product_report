<template>
  <div class="app-container">
    <el-input v-model="listQuery.workNumber" :placeholder="$t('table.workNumber')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
    <el-input v-model="listQuery.phone" :placeholder="$t('table.phone')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
    <el-input v-model="listQuery.userName" :placeholder="$t('table.userName')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
    <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
      {{ $t('table.search') }}
    </el-button>
    <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
      {{ $t('table.add') }}
    </el-button>
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
      <el-table-column label="工号">
        <template slot-scope="scope">
          {{ scope.row.employeeInfo.workNumber }}
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.employeeInfo.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号码" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.employeeInfo.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.Sex | SexFilter">{{ scope.row.sexName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="部门" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.departmentName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="岗位" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.jobName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="职级" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.levelInfo.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="指导老师" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.instructorInfo.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="在职状态" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.statusName }}</span>
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
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :size.sync="listQuery.size" @pagination="fetchData" />
  </div>
</template>

<script>
// import { getList } from '@/api/auth'
import { getEmployeeLists } from '@/api/system/organize/employee'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
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
      getEmployeeLists(this.listQuery).then(response => {
        this.list = response.Data
        this.total = response.TotalSize
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchData()
    },
    handleCreate(row) {
      this.$router.push({
        path: '/system/organize/employee/create',
        query: {
          id: row.id,
          name: row.name
        }
      })
    },
    handleEdit(row) {
      this.$router.push({
        path: '/system/organize/employee/create',
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

