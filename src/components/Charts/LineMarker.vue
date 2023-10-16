<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'
import { getProductMemberLevel } from '@/api/statistics/index'

const lineColor = [
  '137, 189, 27',
  '0, 136, 212',
  '219, 50, 51',
  '115, 50, 51',
  '56, 189, 51',
  '219, 0, 27',
  '219, 0, 27',
  '219, 0, 27',
  '219, 0, 27',
  '219, 0, 27'
]

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    },
    xAxisData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      chart: null,
      yAxis: [],
      seriesData: [],
      title: [],
      legend: [],
      list: []
    }
  },
  watch: {
    options: {
      handler(options) {
        this.chart.setOption(this.options)
      },
      deep: true
    }
  },
  mounted() {
    this.changeData()
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    changeData(data) {
      this.seriesData = data
      this.getLitsts()
    },
    getLitsts() {
      getProductMemberLevel().then(response => {
        this.title = response.title
        this.legend = response.legend
        response.legend.forEach((k, v) => {
          this.list.push({
            name: k,
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(' + lineColor[v] + ', 0.3)'
                }, {
                  offset: 0.8,
                  color: 'rgba(' + lineColor[v] + ', 0)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10
              }
            },
            itemStyle: {
              normal: {
                color: 'rgb(' + lineColor[v] + ')',
                borderColor: 'rgba(' + lineColor[v] + ',0.27)',
                borderWidth: 12

              }
            },
            data: response.yAxisData[k]
          })
        })
        console.log('--list----------', this.list)
        this.initChart()
      })
    },
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      this.chart.setOption({
        backgroundColor: '#394056',
        title: {
          top: 20,
          text: '绩效等级统计',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 16,
            color: '#F1F1F3'
          },
          left: '1%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#57617B'
            }
          }
        },
        legend: {
          top: 20,
          icon: 'rect',
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
          data: this.legend,
          right: '4%',
          textStyle: {
            fontSize: 12,
            color: '#F1F1F3'
          }
        },
        grid: {
          top: 100,
          left: '2%',
          right: '2%',
          bottom: '2%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#57617B'
            }
          },
          data: this.title
        }],
        yAxis: [{
          type: 'value',
          name: '(人数)',
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#57617B'
            }
          },
          axisLabel: {
            margin: 10,
            textStyle: {
              fontSize: 14
            }
          },
          splitLine: {
            lineStyle: {
              color: '#57617B'
            }
          }
        }],
        series: this.list
      })
    }
  }
}
</script>
