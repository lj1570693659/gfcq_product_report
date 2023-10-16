<template>
  <div class="app-container">
    <div class="filter-container">
      <el-checkbox-group v-model="checkboxVal">
        <el-checkbox label="序号">序号</el-checkbox>
        <el-checkbox label="项目角色">项目角色</el-checkbox>
        <el-checkbox label="工号">工号</el-checkbox>
        <el-checkbox label="姓名">姓名</el-checkbox>
        <!-- <el-checkbox label="属性">分类</el-checkbox> -->
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
        <el-checkbox label="备注">备注</el-checkbox>
      </el-checkbox-group>
    </div>

    <el-table :key="key" :data="tableData" border fit highlight-current-row style="width: 100%">
      <el-table-column v-for="fruit in formThead" :key="fruit" :label="fruit">
        <template slot-scope="scope">
          {{ scope.row[fruit] }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" width="200">
        <template slot-scope="scope">
          <span>
            <el-button type="text" size="small" icon="el-icon-edit" @click="handleCreateKeyData(scope.row)">录入关键事件</el-button>
            <el-button type="text" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :size.sync="listQuery.size" @pagination="fetchData" />
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      width="50%"
    >
      <el-form
        ref="temp"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="120px"
        style="margin-left: 50px"
      >
        <el-form-item label="工号：" prop="workNumber">
          <el-input v-model="temp.workNumber" size="small" autocomplete="off" :readonly="true" />
        </el-form-item>
        <el-form-item label="项目角色：" prop="stageScore">
          <el-input v-model="temp.prName" size="small" autocomplete="off" :readonly="true" />
        </el-form-item>
        <el-form-item label="工时占比：" prop="overtimeRadio">
          <el-input
            v-model="temp.overtimeRadio"
            size="small"
            autocomplete="off"
            placeholder="请输入工时占比"
          />
        </el-form-item>
        <el-form-item label="浮动贡献：" prop="floatRaio">
          <el-input
            v-model="temp.floatRaio"
            size="small"
            autocomplete="off"
            placeholder="请输入浮动比例"
          />
        </el-form-item>
        <el-form-item label="绩效等级：" prop="kpiLevel">
          <el-select v-model="temp.kpiLevel" :remote-method="getKpi" filterable default-first-option remote placeholder="请选择绩效等级">
            <el-option v-for="(item,index) in kpiOptions" :key="item+index" :label="item.name" :value="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input
            v-model="temp.remark"
            size="small"
            autocomplete="off"
            placeholder="请输入备注信息"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" size="small" @click="updateMemberKpiData"> 确认 </el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="录入关键事件"
      :visible.sync="dialogKeyFormVisible"
      width="50%"
    >
      <el-form
        ref="keyTemp"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="120px"
        style="margin-left: 50px"
      >
        <el-form-item label="事件分类" prop="type">
          <el-select v-model="keyTemp.type" filterable default-first-option remote placeholder="请选择事件分类">
            <el-option v-for="(item,index) in keyTypeOptions" :key="item+index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="事件性质" prop="property">
          <el-select v-model="keyTemp.property" filterable default-first-option remote placeholder="请选择事件性质">
            <el-option v-for="(item,index) in propertyOptions" :key="item+index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键事件：" prop="keyName">
          <el-input
            v-model="keyTemp.keyName"
            size="small"
            autocomplete="off"
            placeholder="请输入关键事件"
          />
        </el-form-item>
        <el-form-item label="处理结果：" prop="result">
          <el-input
            v-model="keyTemp.result"
            size="small"
            autocomplete="off"
            placeholder="请输入事件处理结果"
          />
        </el-form-item>
        <el-form-item label="发生时间：" prop="happenTime">
          <el-date-picker v-model="keyTemp.happenTime" type="date" placeholder="请选择事件发生时间" />
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input
            v-model="keyTemp.remark"
            size="small"
            autocomplete="off"
            placeholder="请输入备注信息"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" size="small" @click="createKeyData()"> 确认 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getProductMemberKpiLists, modifyProductMemberKpi } from '@/api/achieve/product/stage'
import { createProductMemberKey } from '@/api/achieve/product/prize'
import { getAll as getKpiAll } from '@/api/config/inspirit/kpi'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
const defaultFormThead = ['序号', '项目角色', '工号', '姓名', '分类', '部门', '投入占比', '责任系数', '职级', '职责和任务', '工作地', '主导方', '支持方', '工时占比', '绩效等级', '浮动贡献', '备注']
const defaultKeyTypeOptions = [
  { id: 1, name: '加班贡献' },
  { id: 2, name: '解决问题贡献' },
  { id: 3, name: '其他事件贡献' }
]
// 1：正向激励 2：有待提高
const defaultPropertyOptions = [
  { id: 1, name: '正向激励' },
  { id: 2, name: '有待提高' }
]

export default {
  components: { Pagination },
  kpiId: 0,
  data() {
    return {
      textMap: {
        update: '编辑',
        create: '录入阶段绩效'
      },
      keyTypeOptions: defaultKeyTypeOptions,
      propertyOptions: defaultPropertyOptions,
      dialogStatus: '',
      rules: {
      },
      temp: {},
      keyTemp: {},
      kpiOptions: [],
      dialogKeyFormVisible: false,
      dialogFormVisible: false,
      total: 0,
      listQuery: {
        page: 1,
        size: 10
      },
      tableData: [],
      key: 1, // table key
      formTheadOptions: ['序号', '项目角色', '工号', '姓名', '分类', '部门', '投入占比', '责任系数', '职级', '职责和任务', '工作地', '主导方', '支持方', '工时占比', '绩效等级', '浮动贡献', '备注'],
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
    this.proId = this.$route.query.proId
    this.fetchData()
  },
  methods: {
    fetchData() {
      getProductMemberKpiLists({ proStageId: this.stageId, page: this.listQuery.page, size: this.listQuery.size, proId: this.proId }).then(response => {
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
            备注: k.productMemberKpi.remark,
            主键: k.productMemberKpi.id
          })
        })
      }).catch(err => {
        console.log(err)
      })
    },
    getKpi() {
      getKpiAll().then(response => {
        if (!response.Data) return
        this.kpiOptions = []
        response.Data.forEach((k, v) => {
          this.kpiOptions.push({ id: k.Id, name: k.LevelName })
        })
      })
    },
    handleEdit(row) {
      if (row.项目角色 === '项目经理') {
        this.$message({
          message: '不能修改项目经理绩效',
          type: 'warning',
          duration: 2000
        })
        this.loading = false
      } else {
        this.temp = {
          workNumber: row.工号,
          prName: row.项目角色,
          overtimeRadio: row.工时占比,
          floatRaio: row.浮动贡献,
          kpiLevel: row.绩效等级,
          remark: row.备注
        }
        this.dialogFormVisible = true
        this.dialogStatus = 'modify'
        this.getKpi()
        this.$nextTick(() => {
          this.$refs['temp'].clearValidate()
        })
      }
    },
    updateMemberKpiData() {
      this.temp.proId = this.$route.query.proId
      this.temp.proStageId = this.$route.query.id
      this.$refs.temp.validate(valid => {
        if (valid) {
          modifyProductMemberKpi(this.temp).then(response => {
            this.$notify({
              title: '成功',
              message: '提交成功',
              type: 'success',
              duration: 2000
            })
            this.dialogFormVisible = false
            this.loading = false
            this.fetchData()
          })
        }
      })
    },
    handleCreateKeyData(row) {
      console.log('row-----create---handleCreateKeyData-------', row)
      this.dialogKeyFormVisible = true
      this.$nextTick(() => {
        this.$refs['keyTemp'].clearValidate()
        this.$refs['keyTemp'].kpiInfo = row
      })
    },
    createKeyData() {
      this.keyTemp.stageKpiId = this.$refs['keyTemp'].kpiInfo.主键 // TODO
      this.keyTemp.workNumber = this.$refs['keyTemp'].kpiInfo.工号 // TODO
      this.keyTemp.username = this.$refs['keyTemp'].kpiInfo.姓名 // TODO
      this.keyTemp.proId = this.$route.query.proId
      this.keyTemp.proStageId = this.$route.query.id
      createProductMemberKey(this.keyTemp).then(response => {
        this.$notify({
          title: '成功',
          message: '提交成功',
          type: 'success',
          duration: 2000
        })
        this.dialogKeyFormVisible = false
        this.fetchData()
      })
    }
  }
}
</script>

