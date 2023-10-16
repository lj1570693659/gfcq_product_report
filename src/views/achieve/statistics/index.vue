<template>
  <div class="dashboard-editor-container">
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>
    <el-row :gutter="32">
      <el-col :xs="{span: 32}" :sm="{span: 32}" :md="{span: 32}" :lg="{span: 32}" :xl="{span: 32}" style="padding-right:8px;margin-bottom:30px;">
        <transaction-table />
      </el-col>

    </el-row>
  </div>
</template>

<script>
import LineChart from './components/LineChart'
import TransactionTable from './components/TransactionTable'
import { getProductStage } from '@/api/product/task'

const lineChartData = {
  newVisitis: {
    headerData: [],
    expectedData: [],
    actualData: []
  }
}

export default {
  name: 'DashboardAdmin',
  components: {
    LineChart,
    TransactionTable
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getProductStage({ cid: this.$route.query.cid }).then(response => {
        this.lineChartData.headerData = response.stageName
        this.lineChartData.expectedData = response.stageBudget
        this.lineChartData.actualData = response.stageQuota
      })
    }
  }
}
</script>

  <style lang="scss" scoped>
  .dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    position: relative;

    .github-corner {
      position: absolute;
      top: 0px;
      border: 0;
      right: 0;
    }

    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }

  @media (max-width:1024px) {
    .chart-wrapper {
      padding: 8px;
    }
  }
  </style>

