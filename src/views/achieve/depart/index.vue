<template>
  <div class="icons-container">
    <el-tabs type="border-card">
      <el-tab-pane v-for="(item, index) in form" ref="form" :key="index" :label="item.stepName">
        <el-table :data="item.countDetail" style="width: 100%;padding-top: 15px;">
          <el-table-column label="TOP" min-width="50">
            <template slot-scope="scope">
              <i class="el-icon-wind-power" />
              {{ scope.$index+1 }}
            </template>
          </el-table-column>
          <el-table-column label="部门名称" min-width="120">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column label="提交数量" min-width="150">
            <template slot-scope="scope">
              {{ scope.row.value }}
            </template>
          </el-table-column>
        </el-table>
        <bing-chart :chart-data="item.countDetail" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import clipboard from '@/utils/clipboard'
import { getDepartStatistics } from '@/api/product/task'
import BingChart from './components/BingChart'

export default {
  name: 'Icons',
  components: {
    BingChart
  },
  kpiId: 0,
  stageId: 0,
  data() {
    return {
      rules: {},
      dialogStatus: '',
      temp: {},
      dialogFormVisible: false,
      form: {},
      list: [],
      listLoading: true,
      option: {}
    }
  },
  created() {
    this.kpiId = this.$route.query.id
    this.stageId = this.$route.query.stageId
    this.fetchData()
    this.option = {
      legend: {
        top: 'bottom'
      },
      toolbox: {
        show: true,
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      series: [
        {
          name: 'Nightingale Chart',
          type: 'pie',
          radius: [50, 250],
          center: ['50%', '50%'],
          roseType: 'area',
          itemStyle: {
            borderRadius: 8
          },
          data: [
            { value: 40, name: 'rose 1' },
            { value: 38, name: 'rose 2' },
            { value: 32, name: 'rose 3' },
            { value: 30, name: 'rose 4' },
            { value: 28, name: 'rose 5' },
            { value: 26, name: 'rose 6' },
            { value: 22, name: 'rose 7' },
            { value: 18, name: 'rose 8' }
          ]
        }
      ]
    }
  },
  methods: {
    fetchData() {
      getDepartStatistics({ cid: this.$route.query.cid }).then(response => {
        this.form = response
      }).catch(err => {
        console.log(err)
      })
      this.listLoading = false
    },
    generateElementIconCode(symbol) {
      return `<i class="el-icon-${symbol}" />`
    },
    handleClipboard(text, event) {
      clipboard(text, event)
    }
  }
}
</script>

    <style lang="scss" scoped>
    .icons-container {
      margin: 10px 20px 0;
      overflow: hidden;

      .grid {
        position: relative;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      }

      .icon-item {
        margin: 20px;
        height: 85px;
        text-align: center;
        width: 100px;
        float: left;
        font-size: 30px;
        color: #24292e;
        cursor: pointer;
      }

      span {
        display: block;
        font-size: 16px;
        margin-top: 10px;
      }

      .disabled {
        pointer-events: none;
      }

        .isSubmit /deep/ .el-input__inner{
          background: #0a8b5b;
        }
    }
    </style>

