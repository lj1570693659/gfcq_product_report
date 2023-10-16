<template>
  <div class="app-container">
    <div style="margin:0 0 5px 20px">
      {{ $t('table.dynamicTips1') }}
    </div>
    <fixed-thead />
  </div>
</template>

<script>
import FixedThead from './components/FixedThead'

export default {
  name: 'DynamicTable',
  components: { FixedThead }
}
</script>

