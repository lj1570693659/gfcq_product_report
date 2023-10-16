<template>
  <div class="dashboard-editor-container">
    <panel-group @handleSetLineChartData="handleSetLineChartData" />
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>
    <el-row :gutter="32">
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 9}" :xl="{span: 9}" style="margin-bottom:30px;">
        <box-card />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 15}" :xl="{span: 15}" style="padding-right:8px;margin-bottom:30px;">
        <transaction-table />
      </el-col>

    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import TransactionTable from './components/TransactionTable'
import BoxCard from './components/BoxCard'
import { getProductStage } from '@/api/statistics/index'

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
    PanelGroup,
    LineChart,
    BoxCard,
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
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    fetchData() {
      getProductStage().then(response => {
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
