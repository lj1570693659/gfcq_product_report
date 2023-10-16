<template>
  <div class="app-container">
    <el-table
      ref="lendontable"
      :data="renderDynamic"
      border
      default-expand-all
      row-key="id"
      :row-class-name="rowClassNameFun"
      style="width: 100%"
      :header-cell-style="{ background: '#fafafa' }"
      @select="selectFun"
    >
      <el-table-column prop="name" label="二级计划" />
      <el-table-column prop="duration" label="周期" />
      <el-table-column prop="startTime" label="计划开始时间" sortable />
      <el-table-column prop="endTime" label="计划结束时间" sortable />
    </el-table>
  </div>
</template>

<script>
// import Vue from 'vue'
import { getProductTask } from '@/api/product/task'
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
    var cid = this.$route.query.cid
    getProductTask({ cid: cid }).then(response => {
      this.renderDynamic = response
      this.locationData.push({ CID: 0 + '-' + '0', CNAME: '顶层目录' })
      this.initData(this.renderDynamic)
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
    initData(data) {
      data.forEach((item) => {
        item.isSelect = false // 默认为不选中
        if (item.children && item.children.length) {
          this.initData(item.children)
        }
        this.locationData.push({ CID: item.CID, CNAME: item.CNAME })
      })
    },
    selectFun(selection, row) {
      this.setRowIsSelect(row)
    },
    rowClassNameFun({ row }) {
      if (row.isSelect === '') {
        return 'indeterminate'
      }
    },
    headerRowClassName({ row }) {
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
    handleUpdate(row) {
      this.$router.push({
        path: '/achieve/product',
        query: {
          cid: row.cid
        }
      })
    },
    handleTask(row) {
      this.$router.push({
        path: '/achieve/task',
        query: {
          cid: row.cid
        }
      })
    },
    handleAggre(row) {
      this.$router.push({
        path: '/achieve/statistics',
        query: {
          cid: row.cid
        }
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

