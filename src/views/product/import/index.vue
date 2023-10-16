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
import { importMember } from '@/api/product/index'

export default {
  name: 'UploadExcel',
  components: { UploadExcelComponent },
  mutipartFile: {
    proId: 0,
    productMemberList: null
  },
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
      // this.tableData = results
      this.tableHeader = header
      this.rawFile = rawFile
      const items = results
      this.tableData = items.map(v => {
        if (v.投入占比 === undefined || v.投入占比 === null) {
          v.投入占比 = 0.0
        }
        v.投入占比 = v.投入占比.toFixed(2)
        return v
      })
      console.log('this.tabledata-------------------', this.tableData)
    },
    onSubmit() {
      var subData = {
        proId: this.$route.query.id,
        tableData: this.tableData,
        tableHeader: this.tableHeader
      }
      console.log('subData-----------------', subData)
      importMember(subData).then(response => {
        this.$notify({
          title: '成功',
          message: '提交成功',
          type: 'success',
          duration: 2000
        })
        this.loading = false
        this.$router.push({
          path: '/product/index'
        })
      })
    }
  }
}
</script>

