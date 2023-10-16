<template>
  <div class="app-container">
    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
    </el-table>
    <el-button type="primary" @click="onSubmit">提交</el-button>
  </div>
</template>

<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import { importMemberList } from '@/api/achieve/product/stage'
import { getDate } from '@/utils'

export default {
  name: 'UploadExcel',
  components: { UploadExcelComponent },

  proId: 0,
  stageId: 0,
  productMemberList: null,

  data() {
    return {
      tableData: [],
      tableHeader: [],
      rawFile: Object
    }
  },
  methods: {
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true
      }

      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    handleSuccess({ results, header, rawFile }) {
      results = this.formatJson(header, results)
      this.tableData = results
      this.tableHeader = header
      this.rawFile = rawFile
    },
    formatJson(filterVal, jsonData) {
      jsonData.map(v => filterVal.map(j => {
        if (j === '发生时间') {
          v[j] = getDate(v[j])
          return v
        } else {
          return v
        }
      }))
      return jsonData
    },
    onSubmit() {
      var subData = {
        proId: this.$route.query.proId,
        stageId: this.$route.query.stageId,
        tableData: this.tableData,
        tableHeader: this.tableHeader
      }
      importMemberList(subData).then(response => {
        this.$notify({
          title: '成功',
          message: '提交成功',
          type: 'success',
          duration: 2000
        })
        this.loading = false
        this.$router.push({
          path: '/achieve/index'
        })
      })
    }
  }
}
</script>

