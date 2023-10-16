<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="3" :sm="4" :lg="4" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="list" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            项目总量
          </div>
          <count-to :start-val="0" :end-val="inspire.productCount" :duration="2600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="5" :sm="5" :lg="4" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('messages')">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="money" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            预算(万)
          </div>
          <count-to :start-val="1" :end-val="inspire.incentiveBudget" :duration="3000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="5" :sm="5" :lg="4" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="money" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            应发(万)
          </div>
          <count-to :start-val="2" :end-val="inspire.stageBudget" :duration="3200" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="5" :sm="5" :lg="4" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="money" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            实发(万)
          </div>
          <count-to :start-val="3" :end-val="inspire.stageQuota" :duration="3600" class="card-panel-num" />
        </div>
      </div>
    </el-col>

    <el-col v-for="(stag,index) in stage" :key="index" :xs="5" :sm="5" :lg="4" class="card-panel-col" :label="stag">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <!-- <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="clipboard" class-name="card-panel-icon" />
        </div> -->
        <div class="card-panel-description">
          <div class="card-panel-text">
            {{ stag.stageName }}阀点
            <div>
              应发激励：{{ stag.stageBudget }}
            </div>
            实发激励：{{ stag.stageQuota }}
          </div>
        </div>
      </div>
    </el-col>

  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import { getInspire, getStage } from '@/api/statistics/index'

export default {
  components: {
    CountTo
  },
  data() {
    return {
      inspire: {},
      stage: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    },
    fetchData() {
      this.listLoading = true
      getInspire().then(response => {
        this.inspire = response
        console.log('getInspire--------', response)
      })
      getStage().then(response => {
        this.stage = response
        console.log('getStage--------', response)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }
  .all-budget{
    margin-left: -13px;
  }
  .card-panel {
    height: 83px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      width: 10%;
      float: left;
      margin: 16px 0 0 -3px;
      padding: 3px;
      transition: all 0.18s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 20px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 16px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 13px;
        margin: 15px,0,0,-4px;
      }

      .card-panel-num {
        font-size: 14px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 8px auto !important;
      float: none !important;
    }
  }
}
</style>
