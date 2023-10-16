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
      <el-table-column label="优先级">
        <template slot-scope="scope">
          {{ scope.row.Name }}
        </template>
      </el-table-column>
      <el-table-column label="评分" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ScoreMin }} ~ {{ scope.row.ScoreMax }}<span v-if="scope.row.ScoreRange == 1">(包含{{ scope.row.ScoreMin }})</span>
            <span v-if="scope.row.ScoreRange == 2">(包含{{ scope.row.ScoreMax }})</span>
            <span v-if="scope.row.ScoreRange == 3">(包含{{ scope.row.ScoreMin }}和{{ scope.row.ScoreMax }})</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="要求等级" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.PmDemand }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否委派项目经理" align="center">
        <template #default="scope">
          <span v-if="scope.row.IsNeedPm == 2">否</span>
          <span v-if="scope.row.IsNeedPm == 1">是</span>
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
      width="30%"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="120px"
        style="margin-left: 50px"
      >
        <el-form-item label="优先级：" prop="name">
          <el-input
            v-model="temp.name"
            size="small"
            autocomplete="off"
            placeholder="请输入优先级名称"
            required
          />
        </el-form-item>
        <el-form-item label="评分下限" prop="scoreMin">
          <el-input
            v-model="temp.scoreMin"
            size="small"
            autocomplete="off"
            placeholder="请输入评分下限"
          />
        </el-form-item>
        <el-form-item label="评分上限" prop="scoreMax">
          <el-input
            v-model="temp.scoreMax"
            size="small"
            autocomplete="off"
            placeholder="请输入评分上限"
          />
        </el-form-item>
        <el-form-item label="评分关系" prop="scoreRange">
          <el-select v-model="temp.scoreRange" filterable default-first-option remote placeholder="请选择评分关系">
            <el-option v-for="(item,index) in scoreRangeOptions" :key="item+index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否委派PM" prop="isNeedPm">
          <el-select v-model="temp.isNeedPm" filterable default-first-option remote placeholder="请选择是否委派项目经理">
            <el-option v-for="(item,index) in isNeedPmOptions" :key="item+index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="PM要求" prop="pmDemand">
          <el-input
            v-model="temp.pmDemand"
            size="small"
            autocomplete="off"
            placeholder="请输入对项目经理的要求"
          />
        </el-form-item>
        <el-form-item label="项目管理要求" prop="productDemand">
          <el-input
            v-model="temp.productDemand"
            size="small"
            autocomplete="off"
            placeholder="请输入项目管理上的要求"
          />
        </el-form-item>
        <el-form-item label="监管要求" prop="monitDemand">
          <el-input
            v-model="temp.monitDemand"
            size="small"
            autocomplete="off"
            placeholder="请输入项目监控要求"
          />
        </el-form-item>
        <el-form-item label="项目总监" prop="isNeedPml">
          <el-select v-model="temp.isNeedPml" filterable default-first-option remote placeholder="请选择是否委派项目总监">
            <el-option v-for="(item,index) in isNeedPmOptions" :key="item+index" :label="item.name" :value="item.id" />
          </el-select>
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
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :size.sync="listQuery.size" @pagination="fetchData" />
  </div>
</template>

<script>
// import { getList } from '@/api/auth'
import { getLists, createData, modifyData, deleteData } from '@/api/config/product/confirm'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
// import { validAuth } from '@/utils/validate'

const defaultScoreRangeOptions = [
  { id: 0, name: '请选择' },
  { id: 1, name: '包含评分下限' },
  { id: 2, name: '包含评分上限' },
  { id: 3, name: '包含评分上限和评分下限' }
]
const defaultisNeedPmOptions = [
  { id: 0, name: '请选择' },
  { id: 1, name: '是' },
  { id: 2, name: '否' }
]
export default {
  components: { Pagination },
  filters: {
  },
  data() {
    const validateNameRequire = (rule, value, callback) => {
      if (value === '' || value === 0 || value === undefined) {
        this.$message({
          message: '优先级名称为必传项',
          type: 'error'
        })
        callback(new Error('请输入优先级名称'))
      } else {
        callback()
      }
    }
    const validateScoreRequire = (rule, value, callback) => {
      if (value === '' || value === 0 || value === undefined) {
        this.$message({
          message: '评分下限为必传项',
          type: 'error'
        })
        callback(new Error('请输入评分下限值'))
      } else {
        var numReg = /^[0-9]*$/
        var numRe = new RegExp(numReg)
        if (!numRe.test(value)) {
          this.$message({
            message: '请输入数字格式的评分下限值',
            type: 'error'
          })
          callback(new Error('请输入数字格式的评分下限值'))
        }
        callback()
      }
    }
    const validateScoreRangeRequire = (rule, value, callback) => {
      if (value !== 0 && value !== 1 && value !== 2 && value !== 3) {
        this.$message({
          message: '评分关系选择错误',
          type: 'error'
        })
        callback(new Error('评分关系选择错误'))
      } else {
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
      isNeedPmOptions: defaultisNeedPmOptions,
      dialogStatus: '',
      dialogFormVisible: false,
      rules: {
        name: [{ validator: validateNameRequire }],
        scoreMin: [{ validator: validateScoreRequire }],
        scoreMax: [{ validator: validateScoreRequire }],
        scoreRange: [{ validator: validateScoreRangeRequire }]
      },
      list: null,
      total: 0,
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
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getLists(this.listQuery).then(response => {
        this.list = response.Data
        this.total = response.TotalSize
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
        name: row.Name,
        scoreMin: row.ScoreMin,
        scoreMax: row.ScoreMax,
        scoreRange: row.ScoreRange,
        isNeedPm: row.IsNeedPm,
        pmDemand: row.PmDemand,
        productDemand: row.ProductDemand,
        monitDemand: row.MonitDemand,
        isNeedPml: row.IsNeedPml,
        remark: row.Remark
      }
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
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

