<template>
  <div class="app-container">
    <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" style="margin: 10px 0" @click="handleCreate">添加</el-button>
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
      <el-table-column label="绩效等级" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.LevelName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="绩效比例" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.Redio }}</span>
        </template>
      </el-table-column>
      <el-table-column label="得分" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ScoreMin }} ~ {{ scope.row.ScoreMax }}
            <span v-if="scope.row.ScoreRange == 1">(包含{{ scope.row.ScoreMin }})</span>
            <span v-if="scope.row.ScoreRange == 2">(包含{{ scope.row.ScoreMax }})</span>
            <span v-if="scope.row.ScoreRange == 3">(包含{{ scope.row.ScoreMin }}和{{ scope.row.ScoreMax }})</span>
            <span v-if="scope.row.ScoreRange == 4">(不包含{{ scope.row.ScoreMin }}和{{ scope.row.ScoreMax }})</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.Remark }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="created_at" label="操作" width="200">
        <template slot-scope="scope">
          <span>
            <el-button type="text" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" size="small" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
          </span>
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
        <el-form-item label="得分下限" prop="scoreMin">
          <el-input
            v-model="temp.scoreMin"
            size="small"
            autocomplete="off"
            placeholder="请输入得分下限"
          />
        </el-form-item>
        <el-form-item label="得分上限" prop="scoreMax">
          <el-input
            v-model="temp.scoreMax"
            size="small"
            autocomplete="off"
            placeholder="请输入得分上限"
          />
        </el-form-item>
        <el-form-item label="得分关系" prop="scoreRange">
          <el-select v-model="temp.scoreRange" filterable default-first-option remote placeholder="请选择得分关系">
            <el-option v-for="(item,index) in scoreRangeOptions" :key="item+index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="绩效名称" prop="levelName">
          <el-input
            v-model="temp.levelName"
            size="small"
            autocomplete="off"
            placeholder="请输入绩效名称"
          />
        </el-form-item>
        <el-form-item label="绩效比例" prop="redio">
          <el-input
            v-model="temp.redio"
            size="small"
            autocomplete="off"
            placeholder="请输入绩效比例"
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
import { getAll, createData, modifyData, deleteData } from '@/api/config/inspirit/kpi'
// import { validAuth } from '@/utils/validate'

const defaultScoreRangeOptions = [
  { id: 0, name: '请选择' },
  { id: 1, name: '包含得分下限' },
  { id: 2, name: '包含得分上限' },
  { id: 3, name: '包含得分上限和得分下限' },
  { id: 4, name: '不包含得分上限和得分下限' }
]

export default {
  filters: {
  },
  data() {
    const validateNameRequire = (rule, value, callback) => {
      if (value === '' || value === 0 || value === undefined) {
        this.$message({
          message: '绩效等级为必传项',
          type: 'error'
        })
        callback(new Error('请输入绩效等级'))
      } else {
        callback()
      }
    }
    const validateScoreRequire = (rule, value, callback) => {
      if (value === '' || value === 0 || value === undefined) {
        this.$message({
          message: '得分上下限为必传项',
          type: 'error'
        })
        callback(new Error('请输入得分上下限值'))
      } else {
        var numReg = /^[0-9]*$/
        var numRe = new RegExp(numReg)
        if (!numRe.test(value)) {
          this.$message({
            message: '请输入数字格式的得分上下限值',
            type: 'error'
          })
          callback(new Error('请输入数字格式的得分上下限值'))
        }
        callback()
      }
    }
    const validateScoreRangeRequire = (rule, value, callback) => {
      if (value !== 0 && value !== 1 && value !== 2 && value !== 3 && value !== 4) {
        this.$message({
          message: '得分关系选择错误',
          type: 'error'
        })
        callback(new Error('得分关系选择错误'))
      } else {
        callback()
      }
    }
    const validateRadioRequire = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        this.$message({
          message: '绩效比例为必传项',
          type: 'error'
        })
        callback(new Error('请输入分配比例'))
      } else {
        var numReg = /^\D*([0-9]\d*\.?\d{0,3})?.*$/
        var numRe = new RegExp(numReg)
        if (!numRe.test(value)) {
          this.$message({
            message: '请输入数字格式的绩效比例值',
            type: 'error'
          })
          callback(new Error('请输入数字格式的绩效比例值'))
        }
        callback()
      }
    }
    return {
      textMap: {
        update: '编辑',
        create: '添加'
      },
      temp: {},
      scoreRangeOptions: defaultScoreRangeOptions,
      dialogStatus: '',
      dialogFormVisible: false,
      rules: {
        levelName: [{ validator: validateNameRequire }],
        scoreMin: [{ validator: validateScoreRequire }],
        scoreMax: [{ validator: validateScoreRequire }],
        scoreRange: [{ validator: validateScoreRangeRequire }],
        redio: [{ validator: validateRadioRequire }]
      },
      list: null,
      dataForm: {},
      listLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getAll().then(response => {
        const items = response.Data
        this.list = items.map(v => {
          if (v.ScoreMin === undefined) {
            v.ScoreMin = 0
          }
          if (v.ScoreMax === undefined) {
            v.ScoreMax = 0
          }
          if (v.Redio === undefined) {
            v.Redio = 0
          }
          return v
        })
        this.listLoading = false
      })
    },
    handleCreate(row) {
      this.temp = {}
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          createData(this.temp).then(response => {
            location.reload()
          })
        }
      })
    },
    handleEdit(row) {
      this.temp = {
        id: row.Id,
        levelName: row.LevelName,
        scoreMin: row.ScoreMin,
        scoreMax: row.ScoreMax,
        scoreRange: row.ScoreRange,
        redio: row.Redio,
        remark: row.Remark
      }
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      console.log('this.temp---------', this.temp)
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          modifyData(this.temp).then(response => {
            location.reload()
          })
        }
      })
    },
    handleDelete(row) {
      deleteData({ id: row.Id }).then(response => {
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

