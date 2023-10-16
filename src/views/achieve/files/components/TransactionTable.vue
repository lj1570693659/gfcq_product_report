<template>
  <el-table :data="list.productName" style="width: 100%;padding-top: 15px;">
    <el-table-column label="序号" min-width="50">
      <template slot-scope="scope">
        <i class="el-icon-wind-power" />
        {{ scope.$index+1 }}
      </template>
    </el-table-column>
    <el-table-column label="项目" min-width="120">
      <template slot-scope="scope">
        {{ scope.row }}
      </template>
    </el-table-column>
    <el-table-column label="应提交数量" min-width="150">
      <template slot-scope="scope">
        {{ list.shouldSubmitNumber[scope.$index] }}
      </template>
    </el-table-column>
    <el-table-column label="实际提交数量" min-width="150">
      <template slot-scope="scope">
        {{ list.realSubmitNumber[scope.$index] }}
      </template>
    </el-table-column>
    <el-table-column label="实际提交占比" min-width="100">
      <template slot-scope="scope">
        <el-progress :percentage="list.realSubmitNumber[scope.$index]/list.shouldSubmitNumber[scope.$index]*100 | timeFormatter" />
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { getProductStatistics } from '@/api/product/task'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    },
    orderNoFilter(str) {
      return str
    },
    timeFormatter(value) {
      return Number(Number(value).toFixed(2))
    }
  },
  data() {
    return {
      list: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getProductStatistics().then(response => {
        this.list = response
      })
    }
  }
}
</script>
