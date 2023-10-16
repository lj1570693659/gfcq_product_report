<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="项目类型" prop="tid">
        <el-select v-model="form.tid" :remote-method="getType" filterable default-first-option remote placeholder="请选择项目类型" @change="handleChangeType">
          <el-option v-for="(item,index) in typeOptions" :key="item+index" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="项目名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="项目简称" prop="subName">
        <el-input v-model="form.subName" />
      </el-form-item>
      <el-form-item label="项目编号" prop="proNumber">
        <el-input v-model="form.proNumber" />
      </el-form-item>
      <el-form-item label="优先级评分" prop="lcScore">
        <el-input v-model="form.lcScore" />
      </el-form-item>

      <el-form-item label="预算修正" prop="fixBudget">
        <el-row>
          <el-col :span="8">
            <el-form-item label-width="80px" label="修正类型:" class="postInfo-container-item">
              <el-select v-model="form.fixType" :remote-method="getFixType" filterable default-first-option remote placeholder="请选择项目类型">
                <el-option v-for="(item,index) in fixTypeOptions" :key="item+index" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="10">
            <el-form-item label-width="120px" label="修正金额:" prop="fixBudget" class="postInfo-container-item">
              <el-input v-model="form.fixBudget" placeholder="请输入修正金额（单位：元）" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="投资额度" prop="invest">
        <el-input v-model="form.invest" placeholder="请输入投资额度（单位：元）" />
      </el-form-item>
      <el-form-item label="首年净利润" prop="netProfit">
        <el-input v-model="form.netProfit" placeholder="请输入首年净利润（单位：元）" />
      </el-form-item>
      <el-form-item label="研发模式" prop="modeId">
        <el-select v-model="form.modeId" :remote-method="getMode" filterable default-first-option remote placeholder="请选择岗位信息">
          <el-option v-for="(item,index) in modeOptions" :key="item+index" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="项目经理" prop="pmId">
        <el-select v-model="form.pmId" :remote-method="getInstructor" filterable default-first-option remote placeholder="请选择项目经理">
          <el-option v-for="(item,index) in instructorOptions" :key="item+index" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="项目经理属性" prop="attribute">
        <el-select v-model="form.attribute" :remote-method="getAttribute" filterable default-first-option remote placeholder="请选择项目经理属性">
          <el-option v-for="(item,index) in attributeOptions" :key="item+index" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="项目总监" prop="pmlId">
        <el-select v-model="form.pmlId" :remote-method="getInstructor" filterable default-first-option remote placeholder="请选择项目总监">
          <el-option v-for="(item,index) in instructorOptions" :key="item+index" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="项目状态" prop="status">
        <el-select v-model="form.status" :remote-method="getStatus" filterable default-first-option remote placeholder="请选择项目状态">
          <el-option v-for="(item,index) in statusOptions" :key="item+index" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="项目类型" prop="tid">
        <el-select v-model="form.tid" :remote-method="getType" filterable default-first-option remote placeholder="请选择项目类型" @change="handleChangeType">
          <el-option v-for="(item,index) in typeOptions" :key="item+index" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item> -->
      <el-form-item label="当前阶段" prop="proTypeStageId">
        <el-select v-model="form.proTypeStageId" :remote-method="getStage" filterable default-first-option remote placeholder="请选择当前阶段">
          <el-option v-for="(k,v) in stageOptions" :key="k+v" :label="k.name" :value="k.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getAll } from '@/api/config/product/type'
import { getAll as getModeAll } from '@/api/config/product/mode'
import { getAll as getStageAll } from '@/api/config/product/stage'
import { createData, getInfo, modifyData } from '@/api/product/index'
import { getEmployeeAll } from '@/api/system/organize/employee'

const defaultForm = {
  id: 0,
  name: '',
  subName: '', // 文章题目
  lcScore: 0, // 文章内容
  tid: 0, // 文章摘要
  modeId: 0, // 文章外链
  pmId: 0, // 文章图片
  attribute: 0, // 前台展示时间
  pmlId: 0,
  status: 1,
  proTypeStageId: 0,
  fixType: 0,
  fixBudget: 0,
  invest: 0,
  netProfit: 0,
  remark: ''
}

export default {
  isEdit: false,
  data() {
    // 项目类型
    const validateTidRequire = (rule, value, callback) => {
      if (value === '' || value === 0 || value === undefined) {
        this.$message({
          message: '项目类型为必选项',
          type: 'error'
        })
        callback(new Error('请选择项目类型'))
      } else {
        callback()
      }
    }
    const validateNameRequire = (rule, value, callback) => {
      if (value === '' || value === 0 || value === undefined) {
        this.$message({
          message: '项目名称为必传项',
          type: 'error'
        })
        callback(new Error('请输入项目名称'))
      } else {
        callback()
      }
    }
    const validateSubNameRequire = (rule, value, callback) => {
      if (value === '' || value === 0 || value === undefined) {
        this.$message({
          message: '项目简称为必传项',
          type: 'error'
        })
        callback(new Error('请输入项目简称'))
      } else {
        callback()
      }
    }
    const validateLcScoreRequire = (rule, value, callback) => {
      if (value === '' || value === 0 || value === undefined) {
        this.$message({
          message: '优先级评分为必传项',
          type: 'error'
        })
        callback(new Error('请输入优先级评分'))
      } else {
        var numReg = /^[0-9]*$/
        var numRe = new RegExp(numReg)
        if (!numRe.test(value)) {
          this.$message({
            message: '请输入数字格式的优先级评分',
            type: 'error'
          })
          callback(new Error('请输入数字格式的优先级评分'))
        }
        callback()
      }
    }
    const validateFixTypeLevel = (rule, value, callback) => {
      if (value !== 0 && value !== 1 && value !== 2) {
        this.$message({
          message: '修正类型选择错误',
          type: 'error'
        })
        callback(new Error('修正类型选择错误'))
      } else {
        callback()
      }
    }
    const validateInvestRequire = (rule, value, callback) => {
      if (value === '' || value === 0 || value === undefined) {
        this.$message({
          message: '投资额度为必传项',
          type: 'error'
        })
        callback(new Error('请输入投资额度'))
      } else {
        var numReg = /^[0-9]*$/
        var numRe = new RegExp(numReg)
        if (!numRe.test(value)) {
          this.$message({
            message: '请输入数字格式的投资额度',
            type: 'error'
          })
          callback(new Error('请输入数字格式的投资额度'))
        }
        callback()
      }
    }
    const validateNetProfitRequire = (rule, value, callback) => {
      if (value === '' || value === 0 || value === undefined) {
        this.$message({
          message: '首年净利润为必传项',
          type: 'error'
        })
        callback(new Error('请输入首年净利润'))
      } else {
        var numReg = /^[0-9]*$/
        var numRe = new RegExp(numReg)
        if (!numRe.test(value)) {
          this.$message({
            message: '请输入数字格式的首年净利润',
            type: 'error'
          })
          callback(new Error('请输入数字格式的首年净利润'))
        }
        callback()
      }
    }
    const validateModeId = (rule, value, callback) => {
      if (value === '' || value === 0 || value === undefined) {
        this.$message({
          message: '研发模式为必传项',
          type: 'error'
        })
        callback(new Error('请选择研发模式'))
      } else {
        callback()
      }
    }
    const validateStage = (rule, value, callback) => {
      console.log('value---------', value)
      if (value === '' || value === 0 || value === undefined) {
        this.$message({
          message: '当前阶段为必传项',
          type: 'error'
        })
        callback(new Error('请选择项目当前所处阶段'))
      } else {
        callback()
      }
    }
    const validateAttribute = (rule, value, callback) => {
      if (value !== 0 && value !== 1 && value !== 2) {
        this.$message({
          message: '项目经理属性选择错误',
          type: 'error'
        })
        callback(new Error('项目经理属性选择错误'))
      } else {
        callback()
      }
    }
    const validateStatus = (rule, value, callback) => {
      if (value <= 0 || value > 10) {
        this.$message({
          message: '项目状态为必传项',
          type: 'error'
        })
        callback(new Error('请选择项目状态'))
      } else {
        callback()
      }
    }
    return {
      form: defaultForm,
      typeOptions: [],
      fixTypeOptions: [],
      stageOptions: [],
      instructorOptions: [],
      modeOptions: [],
      attributeOptions: [],
      statusOptions: [],
      rules: {
        tid: [{ validator: validateTidRequire }],
        name: [{ validator: validateNameRequire }],
        subName: [{ validator: validateSubNameRequire }],
        proNumber: [{ validator: validateSubNameRequire }],
        lcScore: [{ validator: validateLcScoreRequire }],
        invest: [{ validator: validateInvestRequire }],
        fixType: [{ validator: validateFixTypeLevel, trigger: 'blur' }],
        netProfit: [{ validator: validateNetProfitRequire }],
        modeId: [{ validator: validateModeId }],
        status: [{ validator: validateStatus }],
        attribute: [{ validator: validateAttribute }],
        proTypeStageId: [{ validator: validateStage }]
      }
    }
  },
  created() {
    // 初始化职级信息
    this.getType()
    this.getFixType()
    this.getMode()
    this.getInstructor()
    this.getStage()
    this.getStatus()
    this.getAttribute()
    console.log('this.$route.query.id----------------', this.$route.query.id)
    if (this.$route.query.id) {
      const id = this.$route.query && this.$route.query.id
      this.fetchData(id)
    }
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    onSubmit() {
      console.log('this.form---------', this.form)
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          var data = {
            id: this.form.id,
            name: this.form.name,
            subName: this.form.subName,
            proNumber: this.form.proNumber,
            lcScore: this.form.lcScore,
            tid: this.form.tid, // 文章题目
            modeId: this.form.modeId, // 文章内容
            pmId: this.form.pmId, // 文章摘要
            attribute: this.form.attribute, // 文章外链
            pmlId: this.form.pmlId, // 文章图片
            status: this.form.status, // 前台展示时间
            proTypeStageId: this.form.proTypeStageId,
            fixType: this.form.fixType,
            fixBudget: this.form.fixBudget,
            invest: this.form.invest,
            netProfit: this.form.netProfit,
            remark: this.form.remark
          }
          if (this.isEdit) {
            modifyData(data).then(response => {
              this.$notify({
                title: '成功',
                message: '提交成功',
                type: 'success',
                duration: 2000
              })
              this.loading = false
              this.$router.push({
                path: '/product/index'
              })
            })
          } else {
            createData(data).then(response => {
              this.$notify({
                title: '成功',
                message: '提交成功',
                type: 'success',
                duration: 2000
              })
              this.loading = false
              this.$router.push({
                path: '/product/index'
              })
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
      // this.$message('submit!')
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    },
    getType(query) {
      getAll(query).then(response => {
        if (!response.Data) return
        this.typeOptions.push({ id: 0, name: '请选择' })
        response.Data.forEach((k, v) => {
          this.typeOptions.push({ id: k.Id, name: k.Name })
        })
      })
    },
    getFixType(query) {
      this.fixTypeOptions.push({ id: 0, name: '请选择' })
      this.fixTypeOptions.push({ id: 1, name: '增加' })
      this.fixTypeOptions.push({ id: 2, name: '减少' })
    },
    getAttribute() {
      this.attributeOptions.push({ id: 0, name: '请选择' })
      this.attributeOptions.push({ id: 1, name: '全职' })
      this.attributeOptions.push({ id: 2, name: '兼职' })
    },
    getMode(query) {
      getModeAll(query).then(response => {
        if (!response.Data) return
        this.modeOptions.push({ id: 0, name: '请选择' })
        response.Data.forEach((k, v) => {
          this.modeOptions.push({ id: k.Id, name: k.Name })
        })
      })
    },
    getInstructor(query) {
      getEmployeeAll(query).then(response => {
        if (!response.Data) return
        this.instructorOptions.push({ id: 0, name: '请选择' })
        response.Data.forEach((k, v) => {
          this.instructorOptions.push({ id: k.Id, name: k.WorkNumber + ' - ' + k.UserName })
        })
      })
    },
    getStatus(query) {
      this.statusOptions.push({ id: 0, name: '请选择' })
      this.statusOptions.push({ id: 1, name: '未开始' })
      this.statusOptions.push({ id: 2, name: '未立项' })
      this.statusOptions.push({ id: 3, name: '进行中' })
      this.statusOptions.push({ id: 4, name: '暂停' })
      this.statusOptions.push({ id: 5, name: '已取消' })
      this.statusOptions.push({ id: 6, name: '延迟' })
      this.statusOptions.push({ id: 7, name: '异常' })
      this.statusOptions.push({ id: 8, name: '已完成未验收' })
      this.statusOptions.push({ id: 9, name: '客户已验收' })
      this.statusOptions.push({ id: 10, name: '结项' })
    },
    getStage(query) {
      getStageAll(query).then(response => {
        console.log('response------------', response)
        this.stageOptions = []
        this.stageOptions.push({ id: 0, name: '请选择' })
        response.forEach((k, v) => {
          this.stageOptions.push({ id: k.productModeStage.id, name: k.productModeStage.name })
        })
      })
    },
    handleChangeType(e) {
      this.getStage(e)
    },
    fetchData(id) {
      getInfo({ id: id }).then(response => {
        this.isEdit = true
        this.form = response
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

