<template>
  <div class="app-container">
    <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" style="margin-bottom: 5px;" @click="handleCreate">添加</el-button>
    <el-table
      ref="lendontable"
      :data="renderDynamic"
      border
      default-expand-all
      row-key="id"
      :row-class-name="rowClassNameFun"
      :header-row-class-name="headerRowClassName"
      style="width: 100%"
      :header-cell-style="{ background: '#fafafa' }"
      @select="selectFun"
      @select-all="selectAllFun"
    >
      <el-table-column prop="name" label="部门名称" sortable />
      <!-- <el-table-column prop="employeeCount" label="员工数量" sortable /> -->
      <el-table-column label="操作" :align="alignDir" width="180">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="deleteDepartData(scope.row)">删除</el-button>
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
        <el-form-item v-if="dialogStatus !== 'update'" label="层级：" prop="location">
          <el-select v-model="temp.location" placeholder="请选择层级" size="small">
            <el-option
              v-for="item in locationData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item
          v-if="sonStatus && dialogStatus !== 'update'"
          label="子位置："
          prop="children"
        >
          <el-cascader
            :key="isResouceShow"
            v-model="temp.children"
            size="small"
            placeholder="请选择子位置"
            :label="'label'"
            :value="'value'"
            :options="tableData"
            :props="{ checkStrictly: true }"
            clearable
            @change="getCasVal"
          />
        </el-form-item> -->
        <el-form-item label="部门名称：" prop="name">
          <el-input
            v-model="temp.name"
            size="small"
            autocomplete="off"
            placeholder="请输入部门名称"
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
// import Vue from 'vue'
import { getDepartmentLists, createData, modifyData, deleteData } from '@/api/system/organize/department'
export default {
  name: 'App',

  data() {
    return {
      renderDynamic: [],
      selectArr: [],
      locationData: [],
      alignDir: 'center',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      dialogStatus: '',
      dialogFormVisible: false,
      temp: {},
      rules: {}
    }
  },
  created() {
    getDepartmentLists().then(response => {
      this.renderDynamic = response
      this.locationData.push({ id: 0 + '-' + '0', name: '顶层目录' })
      this.initData(this.renderDynamic, 1)
    })
  },
  methods: {
    getSelectId(data) {
      data.forEach((item) => {
        if (item.isSelect === true) {
          // 父级选中，只获取父级的值
          this.selectArr.push(item.id)
          // 父级选中，获取父级和子级的值，只获取父级的值，将下面代码注释
          if (item.children && item.children.length) {
            this.getSelectId(item.children)
          }
        } else if (item.isSelect === '') {
          this.getSelectId(item.children)
        }
      })
    },
    initData(data, level) {
      data.forEach((item) => {
        item.isSelect = false // 默认为不选中
        item.level = level
        if (item.children && item.children.length) {
          this.initData(item.children, level + 1)
        }
        this.locationData.push({ id: item.id + '-' + item.level, name: item.name })
      })
    },
    selectFun(selection, row) {
      this.setRowIsSelect(row)
    },
    checkIsAllSelect() {
      this.oneProductIsSelect = []
      this.renderDynamic.forEach((item) => {
        this.oneProductIsSelect.push(item.isSelect)
      })
      // 判断一级产品是否是全选.如果一级产品全为true，则设置为取消全选，否则全选
      const isAllSelect = this.oneProductIsSelect.every((selectStatusItem) => {
        return selectStatusItem == true
      })
      return isAllSelect
    },
    selectAllFun(selection) {
      // this.renderDynamic.forEach((item) => {
      //   this.$refs.lendontable.toggleRowSelection(item, !item.isSelect);
      //   this.selectFun(selection, item);
      // });

      // 设置禁止选中时，取消禁止的选中状态
      this.renderDynamic.forEach((item) => {
        if (item.id === 11) {
          this.$refs.lendontable.toggleRowSelection(item, false)
        } else {
          this.$refs.lendontable.toggleRowSelection(item, !item.isSelect)
          this.selectFun(selection, item)
        }
      })
    },
    rowClassNameFun({ row }) {
      if (row.isSelect === '') {
        return 'indeterminate'
      }
    },
    headerRowClassName({ row }) {
      console.log('row: ', row)
      const oneProductIsSelect = []
      this.renderDynamic.forEach((item) => {
        oneProductIsSelect.push(item.isSelect)
      })
      if (oneProductIsSelect.includes('')) {
        return 'indeterminate'
      }
      return ''
    },
    // 打开添加
    handleCreate() {
      // this.resetTemp()
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          var pidInfo = this.temp.location.split('-')
          createData({ id: 0, name: this.temp.name, pid: pidInfo[0], level: Number(pidInfo[1]) + 1 }).then(response => {
            location.reload()
          })
        } else {
          return false
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      if (row.childKey) {
        this.childKey = row.childKey
        this.idx = row.childKey[row.childKey.length - 1]
      } else {
        this.idx = row.value
      }
      console.log(this.idx)

      this.parentId = row.parent
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      console.log('this.temp-------------', this.temp)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          modifyData({ id: this.temp.id, name: this.temp.name, pid: this.temp.parentId, level: this.temp.level }).then(response => {
            location.reload()
          })
        } else {
          return false
        }
      })
    },
    deleteDepartData(row) {
      console.log('deleteDepartData-------------', row)
      deleteData({ id: row.id }).then(response => {
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        location.reload()
      })
    },
    setRowIsSelect(row) {
      // 当点击父级点复选框时，当前的状态可能为未知状态，所以当前行状态设为false并选中，即可实现子级点全选效果
      if (row.isSelect === '') {
        row.isSelect = false
        this.$refs.lendontable.toggleRowSelection(row, true)
      }
      row.isSelect = !row.isSelect
      const that = this

      function selectAllChildrens(data) {
        data.forEach((item) => {
          item.isSelect = row.isSelect
          that.$refs.lendontable.toggleRowSelection(item, row.isSelect)
          if (item.children && item.children.length) {
            selectAllChildrens(item.children)
          }
        })
      }

      function getSelectStatus(selectStatuaArr, data) {
        data.forEach((childrenItem) => {
          selectStatuaArr.push(childrenItem.isSelect)
          if (childrenItem.children && childrenItem.children.length) {
            getSelectStatus(selectStatuaArr, childrenItem.children)
          }
        })
        return selectStatuaArr
      }
      function getLevelStatus(row) {
        // 如果当前节点的parantId =0 并且有子节点，则为1
        // 如果当前节点的parantId !=0 并且子节点没有子节点 则为3
        if (row.parentId == 0) {
          if (row.children && row.children.length) {
            return 1
          } else {
            return 4
          }
        } else {
          if (!row.children || !row.children.length) {
            return 3
          } else {
            return 2
          }
        }
      }
      let result = {}
      // 获取明确的节点
      function getExplicitNode(data, parentId) {
        data.forEach((item) => {
          if (item.id == parentId) {
            result = item
          }
          if (item.children && item.children.length) {
            getExplicitNode(item.children, parentId)
          }
        })
        return result
      }
      function operateLastLeve(row) {
        // 操作的是子节点  1、获取父节点  2、判断子节点选中个数，如果全部选中则父节点设为选中状态，如果都不选中，则为不选中状态，如果部分选择，则设为不明确状态
        let selectStatuaArr = []
        const item = getExplicitNode(that.renderDynamic, row.parentId)
        selectStatuaArr = getSelectStatus(selectStatuaArr, item.children)
        if (
          selectStatuaArr.every((selectItem) => {
            return selectItem == true
          })
        ) {
          item.isSelect = true
          that.$refs.lendontable.toggleRowSelection(item, true)
        } else if (
          selectStatuaArr.every((selectItem) => {
            return selectItem == false
          })
        ) {
          item.isSelect = false
          that.$refs.lendontable.toggleRowSelection(item, false)
        } else {
          item.isSelect = ''
        }
        // 则还有父级
        if (item.parentId != 0) {
          operateLastLeve(item)
        }
      }
      // 判断操作的是子级点复选框还是父级点复选框，如果是父级点，则控制子级点的全选和不全选

      // 1、只是父级 2、既是子集，又是父级 3、只是子级
      const levelSataus = getLevelStatus(row)
      if (levelSataus == 1) {
        selectAllChildrens(row.children)
      } else if (levelSataus == 2) {
        selectAllChildrens(row.children)
        operateLastLeve(row)
      } else if (levelSataus == 3) {
        operateLastLeve(row)
      }
    }
  }
}
</script>

<style>
.indeterminate .el-checkbox__input .el-checkbox__inner {
  background-color: #409eff !important;
  border-color: #409eff !important;
  color: #fff !important;
}

.indeterminate .el-checkbox__input.is-checked .el-checkbox__inner::after {
  transform: scale(0.5);
}

.indeterminate .el-checkbox__input .el-checkbox__inner {
  background-color: #f2f6fc;
  border-color: #dcdfe6;
}
.indeterminate .el-checkbox__input .el-checkbox__inner::after {
  border-color: #c0c4cc !important;
  background-color: #c0c4cc;
}
.product-show th .el-checkbox__inner {
  display: none !important;
}

.indeterminate .el-checkbox__input .el-checkbox__inner::after {
  content: '';
  position: absolute;
  display: block;
  background-color: #fff;
  height: 2px;
  transform: scale(0.5);
  left: 0;
  right: 0;
  top: 5px;
  width: auto !important;
}
.product-show .el-checkbox__inner {
  display: block !important;
}

.product-show .el-checkbox {
  display: block !important;
}
</style>

