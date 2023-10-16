<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.cname" :placeholder="$t('table.productName')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="项目名称">
        <template slot-scope="scope">
          {{ scope.row.CNAME }}
        </template>
      </el-table-column>
      <el-table-column label="版本号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.CVERSION }}</span>
        </template>
      </el-table-column>
      <el-table-column label="计划开始时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.CPLANBEGINTIME }}</span>
        </template>
      </el-table-column>
      <el-table-column label="计划结束时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.CPLANENDTIME }}</span>
        </template>
      </el-table-column>
      <el-table-column label="计划工时" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.CPLANWORKHOURS }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实际开始时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.CREALBEGINTIME }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实际结束时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.CREALENDTIME }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实际工时" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.CREALWORKLOAD }}</span>
        </template>
      </el-table-column>

      <el-table-column label="完成百分比" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.CPERCENTCOMPLETE }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" width="200">
        <template slot-scope="scope">
          <span>
            <!-- <el-button type="text" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button> -->
            <el-button type="text" size="small" icon="el-icon-edit" @click="handleDetail(scope.row)">任务详情</el-button>
            <el-button type="text" size="small" icon="el-icon-edit" @click="handleTaskFile(scope.row)">交付物统计</el-button>
            <!-- <el-button type="text" size="small" icon="el-icon-edit" @click="handleImport(scope.row)">导入成员</el-button>
            <el-button type="text" size="small" icon="el-icon-edit" @click="handleAchieve(scope.row)">录入绩效</el-button>
            <el-button type="text" size="small" icon="el-icon-edit" @click="handleShowAchieve(scope.row)">绩效</el-button>
            <el-button type="text" size="small" icon="el-icon-edit" @click="handleDelete(scope.row)">删除</el-button> -->
          </span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :size.sync="listQuery.size" @pagination="fetchData" />

    <!-- <el-dialog
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
        <el-form-item label="当前阶段" prop="stageId">
          <el-select v-model="temp.stageId" :remote-method="getStage" filterable default-first-option remote placeholder="请选择当前阶段">
            <el-option v-for="(item,index) in stageOptions" :key="item+index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="阶段评分：" prop="stageScore">
          <el-input
            v-model="temp.stageScore"
            size="small"
            autocomplete="off"
            placeholder="请输入标签名称"
          />
        </el-form-item>
        <el-form-item label="PM分配比例：" prop="pmRadio">
          <el-input
            v-model="temp.pmRadio"
            size="small"
            autocomplete="off"
            placeholder="请输入项目经理分配比例"
          />
        </el-form-item>
        <el-form-item label="PM浮动比例：" prop="pmFloatRadio">
          <el-input
            v-model="temp.pmFloatRadio"
            size="small"
            autocomplete="off"
            placeholder="请输入项目经理浮动比例"
          />
        </el-form-item>
        <el-form-item label="PM绩效得分：" prop="pmKpiLevelScore">
          <el-input
            v-model="temp.pmKpiLevelScore"
            size="small"
            autocomplete="off"
            placeholder="请输入备注信息"
          />
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
        <el-button type="primary" size="small" @click="dialogStatus === 'create' ? createStageKpiData() : updateStageKpiData()"> 确认 </el-button>
      </div>
    </el-dialog> -->

  </div>
</template>

<script>
import { getLists, deleteData } from '@/api/product/index'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
// import { getAll as getStageAll } from '@/api/product/stage'
import { createData } from '@/api/achieve/product/stage'
import { getAll as getKpiAll } from '@/api/config/inspirit/kpi'
// import { validAuth } from '@/utils/validate'

export default {
  components: { Pagination },
  filters: {
    SexFilter(status) {
      const sexMap = {
        0: '未知',
        1: '男',
        2: '女'
      }
      return sexMap[status]
    }
  },
  data() {
    const validateStageIdRequire = (rule, value, callback) => {
      if (value === '' || value === 0 || value === undefined) {
        this.$message({
          message: '项目阶段为必选项',
          type: 'error'
        })
        callback(new Error('请选择项目阶段'))
      } else {
        var numReg = /^[0-9]*$/
        var numRe = new RegExp(numReg)
        if (!numRe.test(value)) {
          this.$message({
            message: '请选择正确的项目阶段',
            type: 'error'
          })
          callback(new Error('请选择正确的项目阶段'))
        }
        callback()
      }
    }
    const validateStageScoreRequire = (rule, value, callback) => {
      if (value === '' || value === 0 || value === undefined) {
        this.$message({
          message: '阶段评分为必选项',
          type: 'error'
        })
        callback(new Error('请输入阶段评分'))
      } else {
        var numReg = /^[0-9]*$/
        var numRe = new RegExp(numReg)
        if (!numRe.test(value)) {
          this.$message({
            message: '请输入正确的阶段评分',
            type: 'error'
          })
          callback(new Error('请输入正确的阶段评分'))
        }
        callback()
      }
    }
    const validatePmRadioRequire = (rule, value, callback) => {
      if (value === '' || value === 0 || value === undefined) {
        this.$message({
          message: 'PM分配比例为必选项',
          type: 'error'
        })
        callback(new Error('请输入PM分配比例'))
      } else {
        callback()
      }
    }
    const validatePmFloatRadioRequire = (rule, value, callback) => {
      if (value === '' || value === 0 || value === undefined) {
        this.$message({
          message: 'PM浮动比例为必选项',
          type: 'error'
        })
        callback(new Error('请输入PM浮动比例'))
      } else {
        callback()
      }
    }
    const validatePmKpiLevelIdRequire = (rule, value, callback) => {
      if (value === '' || value === 0 || value === undefined) {
        this.$message({
          message: 'PM绩效等级为必选项',
          type: 'error'
        })
        callback(new Error('请选择PM绩效等级'))
      } else {
        var numReg = /^[0-9]*$/
        var numRe = new RegExp(numReg)
        if (!numRe.test(value)) {
          this.$message({
            message: '请选择正确的PM绩效等级',
            type: 'error'
          })
          callback(new Error('请选择正确的PM绩效等级'))
        }
        callback()
      }
    }
    return {
      list: null,
      stageOptions: [],
      kpiOptions: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 10
      },
      textMap: {
        update: '编辑',
        create: '录入阶段绩效'
      },
      dialogStatus: '',
      dialogFormVisible: false,
      temp: {},
      rules: {
        stageId: [{ validator: validateStageIdRequire }],
        stageScore: [{ validator: validateStageScoreRequire }],
        pmRadio: [{ validator: validatePmRadioRequire }],
        pmFloatRadio: [{ validator: validatePmFloatRadioRequire }],
        pmKpiLevelId: [{ validator: validatePmKpiLevelIdRequire }]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getLists(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.totalSize
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchData()
    },
    handleDetail(row) {
      this.$router.push({
        path: '/product/info',
        query: {
          cid: row.CID
        }
      })
    },
    // 交付物统计
    handleTaskFile(row) {
      this.$router.push({
        path: '/product/deliverable',
        query: {
          cid: row.CID
        }
      })
    },
    edit(row = []) {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // getStage(id) {
    //   getStageAll({ proId: id }).then(response => {
    //     if (!response) return
    //     this.stageOptions = []
    //     this.stageOptions.push({ id: 0, name: '请选择' })
    //     response.forEach((k, v) => {
    //       this.stageOptions.push({ id: k.id, name: k.name })
    //     })
    //   })
    // },
    getKpi() {
      getKpiAll().then(response => {
        if (!response.Data) return
        this.kpiOptions = []
        this.kpiOptions.push({ id: 0, name: '请选择' })
        response.Data.forEach((k, v) => {
          this.kpiOptions.push({ id: k.Id, name: k.LevelName })
        })
      })
    },
    handleAchieve(row) {
      console.log(row)
      this.parentId = row.parent
      this.dialogStatus = 'create'
      this.temp.proId = row.productInfo.id
      this.dialogFormVisible = true
      this.getStage(row.productInfo.id)
      this.getKpi()
      this.$nextTick(() => {
        this.$refs['temp'].clearValidate()
      })
    },
    handleShowAchieve(row) {
      this.$router.push({
        path: '/achieve/index',
        query: {
          proId: row.id
        }
      })
    },
    createStageKpiData() {
      this.$refs.temp.validate(valid => {
        if (valid) {
          createData(this.temp).then(response => {
            this.$notify({
              title: '成功',
              message: '提交成功',
              type: 'success',
              duration: 2000
            })
            this.dialogFormVisible = false
            this.loading = false
            this.$router.push({
              path: '/product/index'
            })
          })
        }
      })
    }
  }
}
</script>
