<template>
  <div class="app-container">
    <el-button class="filter-item" style="margin-left: 10px;margin-bottom: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
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
      <el-table-column label="判断规则" align="center">
        <template slot-scope="{row}">
          <!-- <template v-if="row.edit">
            <el-select v-model="row.crewDutyInfo.arith" placeholder="请选择判断规则" size="small">
              <el-option v-for="item in arith" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </template> -->
          <span>
            <span v-if="row.crewDutyInfo.arith == 'gt'">大于</span>
            <span v-if="row.crewDutyInfo.arith == 'lt'">小于</span>
            <span v-if="row.crewDutyInfo.arith == 'egt'">大于等于</span>
            <span v-if="row.crewDutyInfo.arith == 'elt'">小于等于</span>
            <span v-if="row.crewDutyInfo.arith == 'eq'">等于</span>
            <span v-if="row.crewDutyInfo.arith == 'neq'">不等于</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="职级" align="center">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-select v-model="row.crewDutyInfo.jobLevelId" placeholder="请选择判断规则" size="small">
              <el-option v-for="item in levelOptions" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </template>
          <span v-else>{{ row.jobLevelName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="指数" align="center">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.crewDutyInfo.scoreIndex" class="edit-input" size="small" />
          </template>
          <span v-else>{{ row.crewDutyInfo.scoreIndex }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.crewDutyInfo.remark" class="edit-input" size="small" />
            <el-button
              class="cancel-btn"
              size="small"
              icon="el-icon-refresh"
              type="warning"
              @click="cancelEdit(row)"
            >
              cancel
            </el-button>
          </template>
          <span v-else>{{ row.crewDutyInfo.remark }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="created_at" label="操作" width="200">
        <template slot-scope="{row}">
          <el-button
            v-if="row.edit"
            type="success"
            size="small"
            icon="el-icon-circle-check-outline"
            @click="confirmEdit(row)"
          >
            Ok
          </el-button>
          <el-button
            v-else
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="row.edit=!row.edit"
          >
            Edit
          </el-button>
          <el-button
            type="danger"
            size="small"
            icon="el-icon-delete"
            @click="handleDelete(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      width="50%"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="120px"
        style="margin-left: 50px"
      >
        <!-- <el-form-item label="判断规则：" prop="arith">
          <el-select v-model="temp.arith" placeholder="请选择判断规则" size="small">
            <el-option v-for="item in arith" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item> -->
        <el-form-item label="职级：" prop="jobLevelId">
          <el-select v-model="temp.jobLevelId" placeholder="请选择职级" size="small">
            <el-option v-for="item in levelOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="指数" prop="scoreIndex">
          <el-input
            v-model="temp.scoreIndex"
            size="small"
            autocomplete="off"
            placeholder="请输入管理指数"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="temp.remark"
            size="small"
            autocomplete="off"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" size="small" @click="dialogStatus === 'create' ? createData() : updateData()"> 确认 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { getList } from '@/api/auth'
import { getAll, createData as createDutyData, modifyData, deleteData } from '@/api/config/inspirit/duty'
import { getLevelAll } from '@/api/system/organize/level'
// import { validAuth } from '@/utils/validate'

const defaultArith = [
  { id: 'eq', name: '等于' },
  { id: 'lt', name: '小于' },
  { id: 'egt', name: '大于等于' },
  { id: 'elt', name: '小于等于' },
  { id: 'gt', name: '大于' },
  { id: 'neq', name: '不等于' }
]

export default {
  filters: {
  },
  data() {
    const validateIndexRequire = (rule, value, callback) => {
      if (value === '' || value === 0 || value === undefined) {
        this.$message({
          message: '指数为必传项',
          type: 'error'
        })
        callback(new Error('请输入指数值'))
      } else {
        var numReg = /^[0-9]*$/
        var numRe = new RegExp(numReg)
        if (!numRe.test(value)) {
          this.$message({
            message: '请输入数字格式的指数值',
            type: 'error'
          })
          callback(new Error('请输入数字格式的指数值'))
        }
        if (value > 10) {
          callback(new Error('指数值不能不能大于10'))
        }
      }
      callback()
    }
    // const validateArithRequire = (rule, value, callback) => {
    //   if (value === '' || value === 0 || value === undefined) {
    //     this.$message({
    //       message: '判断规则为必传项',
    //       type: 'error'
    //     })
    //     callback(new Error('请选择判断规则'))
    //   } else {
    //     const aa = this.arith.find(c => c.id === value)
    //     if (aa === undefined) {
    //       callback(new Error('请选择判断规则'))
    //     }
    //   }
    //   callback()
    // }
    const validateJobLevelRequire = (rule, value, callback) => {
      if (value === '' || value === 0 || value === undefined) {
        this.$message({
          message: '职级为必传项',
          type: 'error'
        })
        callback(new Error('请选择职级'))
      } else {
        const aa = this.levelOptions.find(c => c.Id === value)
        if (aa === undefined) {
          callback(new Error('请选择职级'))
        }
      }
      callback()
    }
    return {
      textMap: {
        update: '编辑',
        create: '添加'
      },
      dialogStatus: '',
      levelOptions: [],
      arith: defaultArith,
      dialogFormVisible: false,
      rules: {
        // arith: [{ validator: validateArithRequire }],
        scoreIndex: [{ validator: validateIndexRequire }],
        jobLevelId: [{ validator: validateJobLevelRequire }]
      },
      list: null,
      total: 0,
      temp: {},
      dataForm: {},
      listLoading: true,
      listQuery: {
        page: 1,
        size: 10
      }
    }
  },
  created() {
    this.fetchData()
    this.getLevelList()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getAll(this.listQuery).then(response => {
        const items = response
        this.list = items.map(v => {
          this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
          v.originalarith = v.crewDutyInfo.arith //  will be used when user click the cancel botton
          v.originaljobLevelId = v.crewDutyInfo.jobLevelId //  will be used when user click the cancel botton
          v.originalremark = v.crewDutyInfo.remark //  will be used when user click the cancel botton
          v.originalscoreIndex = v.crewDutyInfo.scoreIndex //  will be used when user click the cancel botton
          return v
        })
        this.listLoading = false
      })
    },
    getLevelList() {
      getLevelAll().then(response => {
        const items = response.Data
        this.levelOptions = items.map(v => {
          v.id = v.Id
          v.name = v.Name
          return v
        })
        this.listLoading = false
      })
    },
    handleCreate(row) {
      this.temp = {}
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.temp.arith = 'eq'
          createDutyData(this.temp).then(response => {
            location.reload()
          })
        }
      })
    },
    cancelEdit(row) {
      row.crewDutyInfo.arith = row.originalarith
      row.crewDutyInfo.jobLevelId = row.originaljobLevelId
      row.crewDutyInfo.scoreIndex = row.originalscoreIndex
      row.crewDutyInfo.remark = row.originalremark
      row.edit = false
      this.$message({
        message: '参数未做变更',
        type: 'warning'
      })
    },
    confirmEdit(row) {
      row.edit = false
      row.id = row.crewDutyInfo.id
      row.arith = row.crewDutyInfo.arith
      row.scoreIndex = row.crewDutyInfo.scoreIndex
      row.jobLevelId = row.crewDutyInfo.jobLevelId
      row.remark = row.crewDutyInfo.remark
      // jobLevelName
      if (row.jobLevelId !== row.originaljobLevelId) {
        const aa = this.levelOptions.find(c => c.Id === row.jobLevelId)
        if (aa !== undefined) {
          row.jobLevelName = aa.Name
        }
      }
      modifyData(row).then(response => {
        this.$message({
          message: '参数变更',
          type: 'success'
        })
      })
    },
    handleDelete(row) {
      deleteData({ id: row.crewDutyInfo.id }).then(response => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.fetchData()
      })
    }
  }
}
</script>

