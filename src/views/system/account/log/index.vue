<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="工号">
        <template slot-scope="scope">
          {{ scope.row.workNumber }}
        </template>
      </el-table-column>
      <el-table-column label="请求行为" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.changeTypeName }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="原始数据" align="center">
        <template slot-scope="scope">
          {{ scope.row.requestBody }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="请求时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :size.sync="listQuery.size" @pagination="fetchData" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { getLogList } from '@/api/user'

export default {
  components: { Pagination },
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
      list: [],
      listLoading: true,
      total: 0,
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
      getLogList().then(response => {
        this.list = response.data
        this.total = response.totalSize
        this.listLoading = false
      })
    }
  }
}
</script>
