<template>
  <canvas :height="height"  v-el:chart-line ></canvas>
</template>
<script>
  var Chart = require('chart.js')
  export default {
    props: {
      value: Object,
      height: String
    },
    data () {
      return {
        Main: {},
        Step: 0
      }
    },
    watch: {
      'value' () {
        this.ChartInit()
      }
    },
    methods: {
      ChartInit () {
        console.log(1)
        if (this.Step > 0) {
          this.Main.destroy()
        }
        let ctx = this.$els.chartLine.getContext('2d')
        this.Main = new Chart(ctx, this.value)
        this.Step = 1
      }
    }
  }
</script>
