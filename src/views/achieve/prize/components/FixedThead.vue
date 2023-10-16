<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleExport">
        {{ $t('table.export') }}
      </el-button>
      <el-checkbox-group v-model="checkboxVal">
        <el-checkbox label="序号">序号</el-checkbox>
        <el-checkbox label="项目角色">项目角色</el-checkbox>
        <el-checkbox label="工号">工号</el-checkbox>
        <el-checkbox label="姓名">姓名</el-checkbox>
        <el-checkbox label="属性">分类</el-checkbox>
        <el-checkbox label="部门">部门</el-checkbox>
        <el-checkbox label="投入占比">投入占比</el-checkbox>
        <el-checkbox label="责任系数">责任系数</el-checkbox>
        <el-checkbox label="职级">职级</el-checkbox>
        <el-checkbox label="职责和任务">职责和任务</el-checkbox>
        <el-checkbox label="工作地">工作地</el-checkbox>
        <el-checkbox label="主导方">主导方</el-checkbox>
        <el-checkbox label="支持方">支持方</el-checkbox>
        <el-checkbox label="工时占比">工时占比</el-checkbox>
        <el-checkbox label="绩效等级">绩效等级</el-checkbox>
        <el-checkbox label="浮动贡献">浮动贡献</el-checkbox>
        <el-checkbox label="工时指数">工时指数</el-checkbox>
        <el-checkbox label="责任指数">责任指数</el-checkbox>
        <el-checkbox label="管理指数">管理指数</el-checkbox>
        <el-checkbox label="权重基准">权重基准</el-checkbox>
        <el-checkbox label="发放基数">发放基数</el-checkbox>
        <el-checkbox label="绩效比例">绩效比例</el-checkbox>
        <el-checkbox label="实发额度">实发额度</el-checkbox>
        <!-- <el-checkbox label="备注">备注</el-checkbox> -->
        <!-- <el-checkbox label="操作">操作</el-checkbox> -->
      </el-checkbox-group>
    </div>

    <el-table :key="key" :data="tableData" border fit highlight-current-row style="width: 100%">
      <el-table-column v-for="fruit in formThead" :key="fruit" :label="fruit">
        <template slot-scope="scope">
          {{ scope.row[fruit] }}
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :size.sync="listQuery.size" @pagination="fetchData" />
  </div>
</template>

<script>
import { getProductPrizeLists, exportProductMemberPrize } from '@/api/achieve/product/prize'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
const defaultFormThead = ['序号', '项目角色', '工号', '姓名', '分类', '部门', '投入占比', '责任系数', '职级', '职责和任务', '工作地', '主导方', '支持方', '工时占比',
  '绩效等级', '浮动贡献', '工时指数', '责任指数', '管理指数', '权重基准', '发放基数', '绩效比例', '实发额度']
// const defaultFormThead = ['index', 'prName', 'workNumber', 'userName', 'type', 'departmentName', 'putInto', 'dutyIndex', 'jbName', 'specificDuty', 'workAddress', 'isGuide', 'isSupport', 'overtimeRadio', 'kpiLevel', 'floatRaio', 'remark']

export default {
  components: { Pagination },
  kpiId: 0,
  data() {
    return {
      total: 0,
      listQuery: {
        page: 1,
        size: 10
      },
      tableData: [],
      key: 1, // table key
      formTheadOptions: ['序号', '项目角色', '工号', '姓名', '分类', '部门', '投入占比', '责任系数', '职级', '职责和任务', '工作地', '主导方', '支持方', '工时占比', '绩效等级', '浮动贡献', '工时指数', '责任指数', '管理指数', '权重基准', '发放基数', '绩效比例', '实发额度'],
      checkboxVal: defaultFormThead, // checkboxVal
      formThead: defaultFormThead // 默认表头 Default header
    }
  },
  watch: {
    checkboxVal(valArr) {
      this.formThead = this.formTheadOptions.filter(i => valArr.indexOf(i) >= 0)
      this.key = this.key + 1// 为了保证table 每次都会重渲 In order to ensure the table will be re-rendered each time
    }
  },
  created() {
    this.stageId = this.$route.query.stageId
    this.fetchData()
  },
  methods: {
    fetchData() {
      getProductPrizeLists({ proStageId: this.stageId, page: this.listQuery.page, size: this.listQuery.size }).then(response => {
        this.total = response.totalSize
        this.tableData = []
        response.data.forEach((k, v) => {
          var isGuide = '否'
          var isSupport = '否'
          if (k.productMember.isGuide === 1) {
            isGuide = '是'
          }
          if (k.productMember.isSupport === 1) {
            isSupport = '是'
          }
          this.tableData.push({ 序号: v + 1,
            项目角色: k.productMemberKpi.prName,
            工号: k.productMember.workNumber,
            姓名: k.userName,
            分类: k.productMember.type,
            部门: k.departmentName,
            投入占比: k.productMember.putInto.toFixed(2),
            责任系数: k.productMember.dutyIndex,
            职级: k.productMember.jbName,
            职责和任务: k.productMember.specificDuty,
            工作地: k.productMember.workAddress,
            主导方: isGuide,
            支持方: isSupport,
            工时占比: k.productMemberKpi.overtimeRadio,
            绩效等级: k.productMemberKpi.kpiLevel,
            浮动贡献: k.productMemberKpi.floatRaio,
            工时指数: k.productMemberPrize.overtimeIndex,
            责任指数: k.productMemberPrize.dutyIndex,
            管理指数: k.productMemberPrize.manageIndex,
            权重基准: k.productMemberPrize.weightPmoRadio,
            发放基数: k.productMemberPrize.sentBase,
            绩效比例: k.productMemberPrize.kpiRadio,
            实发额度: k.productMemberPrize.sentQueto })
        })
      }).catch(err => {
        console.log(err)
      })
    },
    handleExport(row) {
      exportProductMemberPrize({ proStageId: this.stageId }).then(response => {
        // console.log('response----------------', response)
        // var path = 'http://10.24.12.84:8199' + response
        var path = 'http://10.80.42.65:8199' + response
        window.open(path, '_blank')
        this.fetchData()
      })
    }
  }
}
</script>

