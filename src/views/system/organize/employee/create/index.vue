<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="form.workNumber" />
      </el-form-item>
      <el-form-item label="姓名" prop="userName">
        <el-input v-model="form.userName" />
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="form.sex" :remote-method="getSex" filterable default-first-option remote placeholder="请选择性别信息">
          <el-option v-for="(item,index) in sexOptions" :key="item+index" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="form.phone" />
      </el-form-item>
      <el-form-item label="邮箱地址" prop="email">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item label="职级" prop="jobLevel">
        <el-select v-model="form.jobLevel" :remote-method="getJobLevel" filterable default-first-option remote placeholder="请选择职级信息" style="width: 100%;">
          <el-option v-for="(item,index) in jobLevelListOptions" :key="item+index" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="岗位" prop="jobId">
        <el-select v-model="temp.jobIds" :remote-method="getJob" multiple filterable default-first-option remote placeholder="请选择岗位信息" style="width: 100%;">
          <el-option v-for="(item,index) in jobListOptions" :key="item+index" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="指导老师" prop="instructorId">
        <el-select v-model="form.instructorId" :remote-method="getInstructor" filterable default-first-option remote placeholder="请选择指导老师" style="width: 100%;">
          <el-option v-for="(item,index) in instructorOptions" :key="item+index" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="在职状态" prop="status">
        <el-select v-model="form.status" :remote-method="getStatus" filterable default-first-option remote placeholder="请选择在职状态" style="width: 100%;">
          <el-option v-for="(item,index) in statusOptions" :key="item+index" :label="item.name" :value="item.id" />
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
import { getLevelAll } from '@/api/system/organize/level'
import { getDepartmentLists } from '@/api/system/organize/department'
import { getJobAll } from '@/api/system/organize/job'
import { getEmployeeAll, createData, modifyData, getInfo } from '@/api/system/organize/employee'

const defaultForm = {
  id: 0,
  userName: '',
  sex: 2, // 文章题目
  phone: '', // 文章内容
  email: '', // 文章摘要
  jobLevel: 0, // 文章外链
  departId: 0, // 文章图片
  jobId: 0, // 前台展示时间
  instructorId: 0,
  status: 1,
  remark: ''
}

export default {
  isEdit: false,
  data() {
    const validateUserNameRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: '姓名为必传项',
          type: 'error'
        })
        callback(new Error('姓名为必传项'))
      } else {
        callback()
      }
    }
    const validateSexRequire = (rule, value, callback) => {
      if (value !== 1 && value !== 2) {
        this.$message({
          message: '性别为必传项',
          type: 'error'
        })
        callback(new Error('请选择性别'))
      } else {
        callback()
      }
    }
    const validateJobLevel = (rule, value, callback) => {
      if (value === 0) {
        this.$message({
          message: '职级为必传项',
          type: 'error'
        })
        callback(new Error('请选择职级'))
      } else {
        callback()
      }
    }
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    const validateJobId = (rule, value, callback) => {
      if (value === 0) {
        this.$message({
          message: '岗位为必传项',
          type: 'error'
        })
        callback(new Error('请选择岗位'))
      } else {
        callback()
      }
      callback()
    }
    // const validateDepartId = (rule, value, callback) => {
    //   if (value === 0) {
    //     this.$message({
    //       message: '部门为必传项',
    //       type: 'error'
    //     })
    //     callback(new Error('请选择部门'))
    //   } else {
    //     callback()
    //   }
    // }
    const validateStatus = (rule, value, callback) => {
      if (value <= 0 || value > 4) {
        this.$message({
          message: '在职状态为必传项',
          type: 'error'
        })
        callback(new Error('请选择在职状态'))
      } else {
        callback()
      }
    }
    return {
      form: defaultForm,
      temp: {},
      jobLevelListOptions: [],
      departmentListOptions: [],
      jobListOptions: [],
      instructorOptions: [],
      sexOptions: [],
      statusOptions: [],
      rules: {
        userName: [{ validator: validateUserNameRequire }],
        sex: [{ validator: validateSexRequire }],
        phone: [{ validator: validateRequire }],
        jobLevel: [{ validator: validateJobLevel, trigger: 'blur' }],
        jobIds: [{ validator: validateJobId }],
        status: [{ validator: validateStatus }]
        // departId: [{ validator: validateDepartId }]
      }
    }
  },
  created() {
    // 初始化职级信息
    this.getJobLevel()
    this.getDepartment()
    this.getJob()
    this.getInstructor()
    this.getSex()
    this.getStatus()
    if (this.$route.query.id) {
      const id = this.$route.query && this.$route.query.id
      this.fetchData(id)
    }
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          var data = {
            id: this.form.id,
            userName: this.form.userName,
            sex: this.form.sex, // 文章题目
            phone: this.form.phone, // 文章内容
            email: this.form.email, // 文章摘要
            jobLevel: this.form.jobLevel, // 文章外链
            departId: this.temp.departIds, // 文章图片
            jobId: this.temp.jobIds, // 前台展示时间
            jobIds: this.temp.jobIds, // 前台展示时间
            instructorId: this.form.instructorId,
            status: this.form.status,
            remark: this.form.remark,
            workNumber: this.form.workNumber
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
                path: '/system/organize/employee'
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
                path: '/system/organize/employee'
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
    getSex(query) {
      this.sexOptions.push({ id: 0, name: '请选择' })
      this.sexOptions.push({ id: 1, name: '男' })
      this.sexOptions.push({ id: 2, name: '女' })
    },
    getStatus(query) {
      this.statusOptions.push({ id: 0, name: '请选择' })
      this.statusOptions.push({ id: 1, name: '在职' })
      this.statusOptions.push({ id: 2, name: '试用期' })
      this.statusOptions.push({ id: 3, name: '实习期' })
      this.statusOptions.push({ id: 4, name: '已离职' })
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
    getJobLevel(query) {
      getLevelAll(query).then(response => {
        if (!response.Data) return
        this.jobLevelListOptions.push({ id: 0, name: '请选择' })
        response.Data.forEach((k, v) => {
          this.jobLevelListOptions.push({ id: k.Id, name: k.Name })
        })
      })
    },
    getJob(query) {
      getJobAll(query).then(response => {
        if (!response.Data) return
        response.Data.forEach((k, v) => {
          this.jobListOptions.push({ id: k.Id, name: k.Name })
        })
      })
    },
    getDepartment(query) {
      getDepartmentLists(query).then(response => {
        if (!response) return
        this.departmentListOptions.push({ id: 0, name: '请选择' })
        response.forEach((k, v) => {
          if (k.pid === 0) {
            this.departmentListOptions.push({ id: k.id, name: k.name })
            k.childDepart.forEach((kc, vc) => {
              this.departmentListOptions.push({ id: kc.id, name: k.name + ' - ' + kc.name })
              kc.childDepart.forEach((skc, svc) => {
                this.departmentListOptions.push({ id: skc.id, name: k.name + ' - ' + kc.name + ' - ' + skc.name })
              })
            })
          }
        })
      })
    },
    setTagsViewTitle(id) {
      const title = this.lang === 'zh' ? '编辑员工信息' : 'Edit Employee'
      const route = Object.assign({}, this.tempRoute, { title: `${title}` })
      console.log('route---routeroute-----------', route)
    },
    fetchData(id) {
      getInfo({ id: id }).then(response => {
        this.isEdit = true
        this.form = response.employeeInfo
        this.temp.jobIds = response.jobIds
        this.temp.departIds = this.form.departId.split(',')
        const set = new Set(this.temp.departIds)
        this.temp.departIds = Array.from(set)
        this.temp.departIds = this.temp.departIds.map(Number)
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

