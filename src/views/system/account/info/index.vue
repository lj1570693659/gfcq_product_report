<template>
  <div class="icons-container">
    <el-tabs type="border-card">
      <el-tab-pane label="基本信息">
        <el-form ref="form" :model="form" label-width="120px">
          <el-form-item label="" prop="fixBudget">
            <el-row>
              <el-col :span="10">
                <el-form-item label-width="90px" label="工号:" class="postInfo-container-item">
                  <el-input v-model="form.employeeInfo.workNumber" :readonly="true" />
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label-width="120px" label="姓名:" prop="fixBudget" class="postInfo-container-item">
                  <el-input v-model="form.employeeInfo.userName" :readonly="true" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="" prop="fixBudget">
            <el-row>
              <el-col :span="10">
                <el-form-item label-width="90px" label="手机号码:" class="postInfo-container-item">
                  <el-input v-model="form.employeeInfo.phone" :readonly="true" />
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label-width="120px" label="所属部门:" prop="fixBudget" class="postInfo-container-item">
                  <el-input v-model="form.departmentName" :readonly="true" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="" prop="fixBudget">
            <el-row>
              <el-col :span="10">
                <el-form-item label-width="90px" label="邮箱:" class="postInfo-container-item">
                  <el-input v-model="form.employeeInfo.email" :readonly="true" />
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label-width="120px" label="岗位:" prop="fixBudget" class="postInfo-container-item">
                  <el-input v-model="form.jobName" :readonly="true" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="" prop="fixBudget">
            <el-row>
              <el-col :span="10">
                <el-form-item label-width="90px" label="状态:" class="postInfo-container-item">
                  <el-input v-if="form.employeeInfo.status == 1" value="在职" :readonly="true" />
                  <el-input v-if="form.employeeInfo.status == 2" value="试用期" :readonly="true" />
                  <el-input v-if="form.employeeInfo.status == 3" value="实习期" :readonly="true" />
                  <el-input v-if="form.employeeInfo.status == 4" value="已离职" :readonly="true" />
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label-width="120px" label="职级:" prop="fixBudget" class="postInfo-container-item">
                  <el-input v-model="form.levelInfo.name" :readonly="true" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="" prop="fixBudget">
            <el-row>
              <el-col :span="10">
                <el-form-item label-width="90px" label="创建时间:" class="postInfo-container-item">
                  <el-input v-model="form.employeeInfo.createTime" :readonly="true" />
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label-width="120px" label="更新时间:" prop="fixBudget" class="postInfo-container-item">
                  <el-input v-model="form.employeeInfo.updateTime" :readonly="true" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="修改密码">
        <el-form ref="changeForm" :model="form" label-width="120px">

          <el-form-item label-width="120px" label="工号:" class="postInfo-container-item">
            <el-input v-model="changeForm.workNumber" :readonly="true" />
          </el-form-item>
          <el-form-item label-width="120px" label="姓名:" prop="fixBudget" class="postInfo-container-item">
            <el-input v-model="changeForm.userName" :readonly="true" />
          </el-form-item>
          <el-form-item label-width="120px" label="新密码:" prop="fixBudget" class="postInfo-container-item">
            <el-input v-model="changeForm.password" />
          </el-form-item>
          <el-form-item label-width="120px" label="确认密码:" prop="fixBudget" class="postInfo-container-item">
            <el-input v-model="changeForm.password2" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">提交</el-button>
            <el-button @click="onCancel">取消</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getDetail, changepwd } from '@/api/user'
import { getToken, removeToken } from '@/utils/auth'
// import { validAuth } from '@/utils/validate'

export default {
  filters: {
  },
  data() {
    return {
      form: { employeeInfo: {}, departmentName: '', jobName: '', levelInfo: {}},
      changeForm: {
        password: '',
        password2: ''
      },
      listLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getDetail({ workNumber: getToken() }).then(response => {
        this.form = response
        this.changeForm.workNumber = response.employeeInfo.workNumber
        this.changeForm.userName = response.employeeInfo.userName
        this.listLoading = false
      })
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          var data = {
            workNumber: this.changeForm.workNumber,
            password: this.changeForm.password,
            password2: this.changeForm.password2
          }
          changepwd(data).then(response => {
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
            this.loading = false
            removeToken()
            this.$router.push({
              path: '/login'
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    }
    // edit(row = []) {
    //   console.log(row)
    //   console.log(this.$refs)
    //   this.$refs.loginForm.validate(valid => {
    //     if (valid) {
    //       this.loading = true
    //       this.$store.dispatch('user/login', this.loginForm).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //         this.loading = false
    //       }).catch(() => {
    //         this.loading = false
    //       })
    //     } else {
    //       console.log('error submit!!')
    //       return false
    //     }
    //   })
    // }
  }
}
</script>

