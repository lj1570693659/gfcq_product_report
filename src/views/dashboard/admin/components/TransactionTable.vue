<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="TOP" min-width="50">
      <template slot-scope="scope">
        <i class="el-icon-wind-power" />
        {{ scope.$index+1 }}
      </template>
    </el-table-column>
    <el-table-column label="项目简称" min-width="100">
      <template slot-scope="scope">
        {{ scope.row.productSubName | orderNoFilter }}
      </template>
    </el-table-column>
    <el-table-column label="阀点" min-width="50">
      <template slot-scope="scope">
        {{ scope.row.stageName }}
      </template>
    </el-table-column>
    <el-table-column label="应发激励(万元)" min-width="150">
      <template slot-scope="scope">
        {{ scope.row.stageBudget/10000 }}
      </template>
    </el-table-column>
    <el-table-column label="实发激励(万元)" min-width="150">
      <template slot-scope="scope">
        {{ scope.row.stageQuota/10000 }}
      </template>
    </el-table-column>
    <el-table-column label="团队人数" min-width="100">
      <template slot-scope="scope">
        {{ scope.row.teamNumber }}
      </template>
    </el-table-column>
    <el-table-column label="实发比例" min-width="100">
      <template slot-scope="scope">
        {{ scope.row.shouldSentRadio*100 }}%
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { getProductTop } from '@/api/statistics/index'

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
      getProductTop().then(response => {
        this.list = response
        console.log('response---------', response)
      })
    }
  }
}
</script>
