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
      <el-table-column label="贡献维度" align="center">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-select v-model="row.Demand" placeholder="请选择贡献维度" size="small">
              <el-option v-for="item in arith" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </template>
          <span v-else>
            <span v-if="row.Demand == 1">有突出贡献</span>
            <span v-if="row.Demand == 2">有重要贡献</span>
            <span v-if="row.Demand == 3">较低/无贡献</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="浮动比例" align="center">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.Redio" class="edit-input" size="small" />
          </template>
          <span v-else>{{ row.Redio }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.Remark" class="edit-input" size="small" />
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
          <span v-else>{{ row.Remark }}</span>
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
        <el-form-item label="贡献维度：" prop="demand">
          <el-select v-model="temp.demand" placeholder="请选择贡献维度" size="small">
            <el-option v-for="item in arith" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="浮动比例：" prop="redio">
          <el-input
            v-model="temp.redio"
            size="small"
            autocomplete="off"
            placeholder="请输入浮动比例"
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
import { getAll, createData as createDutyData, modifyData, deleteData } from '@/api/config/inspirit/solve'

const defaultArith = [
  { id: 1, name: '有突出贡献' },
  { id: 2, name: '有重要贡献' },
  { id: 3, name: '较低/无贡献' }
]

export default {
  filters: {
  },
  data() {
    const validateRadioRequire = (rule, value, callback) => {
      if (value === '' || value === 0 || value === undefined) {
        this.$message({
          message: '浮动比例为必传项',
          type: 'error'
        })
        callback(new Error('请输入浮动比例值'))
      } else {
        var numReg = /^\D*([0-9]\d*\.?\d{0,3})?.*$/
        var numRe = new RegExp(numReg)
        if (!numRe.test(value)) {
          this.$message({
            message: '请输入数字格式的浮动比例值',
            type: 'error'
          })
          callback(new Error('请输入数字格式的浮动比例值'))
        }
        if (value > 10) {
          callback(new Error('浮动比例值不能不能大于10'))
        }
      }
      callback()
    }
    const validateArithRequire = (rule, value, callback) => {
      if (value === '' || value === 0 || value === undefined) {
        this.$message({
          message: '贡献维度为必传项',
          type: 'error'
        })
        callback(new Error('请选择贡献维度'))
      } else {
        const aa = this.arith.find(c => c.id === value)
        if (aa === undefined) {
          callback(new Error('请选择贡献维度'))
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
        demand: [{ validator: validateArithRequire }],
        radio: [{ validator: validateRadioRequire }]
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
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getAll(this.listQuery).then(response => {
        const items = response.Data
        this.list = items.map(v => {
          this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
          v.originalDemand = v.Demand //  will be used when user click the cancel botton
          v.originalRedio = v.Redio //  will be used when user click the cancel botton
          v.originalRemark = v.Remark //  will be used when user click the cancel botton
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
          createDutyData(this.temp).then(response => {
            location.reload()
          })
        }
      })
    },
    cancelEdit(row) {
      row.Demand = row.originalDemand
      row.Redio = row.originalRedio
      row.Remark = row.originalRemark
      row.edit = false
      this.$message({
        message: '参数未做变更',
        type: 'warning'
      })
    },
    confirmEdit(row) {
      row.edit = false
      row.id = row.Id
      row.demand = row.Demand
      row.redio = row.Redio
      row.remark = row.Remark
      console.log('modify--------', row)
      // jobLevelName
      if (row.demand !== row.originalDemand) {
        const aa = this.arith.find(c => c.Id === row.demand)
        if (aa !== undefined) {
          row.Demand = aa.Name
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

