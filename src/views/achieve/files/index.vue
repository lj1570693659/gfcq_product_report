<template>
  <div class="dashboard-editor-container">
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <pictorial-bar :chart-data="lineChartData" />
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="{span: 32}" :sm="{span: 32}" :md="{span: 32}" :lg="{span: 32}" :xl="{span: 32}" style="padding-right:8px;margin-bottom:30px;">
        <transaction-table />
      </el-col>

    </el-row>
  </div>

</template>

<script>
require('echarts/theme/macarons') // echarts theme

import PictorialBar from './components/PictorialBar'
import TransactionTable from './components/TransactionTable'
import { getProductStatistics } from '@/api/product/task'

const lineChartData = {
  newVisitis: {
    yAxisData: [],
    seriesData: {
      inside: [],
      total: [],
      left: []
    }
  }
}

export default {
  name: 'DashboardAdmin',
  components: {
    PictorialBar,
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
      getProductStatistics().then(response => {
        this.lineChartData.yAxisData = response.productName
        this.lineChartData.seriesData.total = response.shouldSubmitNumber
        this.lineChartData.seriesData.inside = response.realSubmitNumber
        this.lineChartData.seriesData.left = response.lackSubmitNumber
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

