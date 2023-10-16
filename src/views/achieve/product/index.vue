<template>
  <div class="icons-container">
    <el-tabs type="border-card">
      <el-tab-pane v-for="(item, index) in form" ref="form" :key="index" :label="item.name">
        <el-form ref="form" label-width="10px">
          <el-form-item label="" prop="fixBudget">
            <el-row>
              <el-col :span="8">
                <el-form-item label-width="120px" label="应提交交付物:" prop="fixBudget" class="postInfo-container-item">
                  <el-input v-model="item.shouldSubmitNumber" :readonly="true" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label-width="120px" label="实际提交交付物:" prop="fixBudget" class="postInfo-container-item">
                  <el-input v-model="item.realSubmitNumber" :readonly="true" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>

          <el-form-item label="" prop="fixBudget">
            <el-row>
              <el-col :span="24">
                <el-form-item label-width="120px" label="交付物清单:" prop="attribute" class="postInfo-container-item" />
              </el-col>
              <el-col v-for="(nitem,nindex) in item.normAndRealDiffInfo" :key="nindex" :span="8">
                <el-form-item label-width="120px" prop="attribute" class="postInfo-container-item ">
                  <el-input v-if="nitem.isSubmit" v-model="nitem.normFileInfo.name" :readonly="true" class="isSubmit" />
                  <el-input v-if="!nitem.isSubmit" v-model="nitem.normFileInfo.name" :readonly="true" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>

        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import clipboard from '@/utils/clipboard'
import { getDocCompute } from '@/api/product/task'

export default {
  name: 'Icons',
  kpiId: 0,
  stageId: 0,
  data() {
    return {
      textMap: {
        update: '编辑',
        create: '录入阶段绩效'
      },
      rules: {},
      dialogStatus: '',
      temp: {},
      dialogFormVisible: false,
      form: {},
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
    this.kpiId = this.$route.query.id
    this.stageId = this.$route.query.stageId
    this.fetchData()
  },
  methods: {
    fetchData() {
      getDocCompute({ cid: this.$route.query.cid }).then(response => {
        this.form = response
        console.log('this.form=============', this.form)
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
        color: #fff;
      }
  }
  </style>

