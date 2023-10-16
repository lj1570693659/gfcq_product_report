<template>
  <div class="app-container">
    <el-table
      ref="lendontable"
      :data="renderDynamic"
      default-expand-all
      row-key="CID"
      style="width: 100%"
      :header-cell-style="{ background: '#fafafa' }"
    >
      <el-table-column prop="CNAME" label="交付物" />
      <el-table-column prop="taskFileCount" label="交付物统计" sortable />
      <el-table-column label="工作对象">
        <template slot-scope="scope">
          {{ scope.row.CNAME }}
        </template>
      </el-table-column>
      <el-table-column label="交付物代号">
        <template slot-scope="scope">
          {{ scope.row.CSYMBOL }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// import Vue from 'vue'
import { getDeliverable } from '@/api/product/task'
export default {
  name: 'App',
  data() {
    return {
      renderDynamic: [],
      locationData: [],
      alignDir: 'center'
    }
  },
  created() {
    var cid = this.$route.query.cid
    getDeliverable({ cid: cid }).then(response => {
      this.renderDynamic = response
    })
  },
  methods: {
    handleComput(row) {
      console.log('row-----------------', row)
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

