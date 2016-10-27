<template>
<div class="pd-05">
  <divider v-if ='show'><small @click = 'call' class="m-tmc">客服电话：{{tel}}</small></divider>
</div>
</template>
<script>
import {Divider} from 'vux-c/'
export default {
  components: {
    Divider
  },
  props: {
    show: Boolean
  },
  data () {
    return {
      TMC: {},
      tel: '4007286000'
    }
  },
  ready () {
    this.getTMC()
  },
  methods: {
    getTMC () {
      if (window.sessionStorage.getItem('TMC')) {
        this.setTMC()
      } else {
        this.GetSourceMode()
      }
    },
    setTMC () {
      this.TMC = JSON.parse(window.sessionStorage.getItem('TMC'))
      if (this.TMC.SourceTel) {
        this.tel = this.TMC.SourceTel
      } else {
        this.tel = '4007286000'
      }
    },
    GetSourceMode () {
      this.$http.post(window.Miu.Data.ApiURL + '/Account_1_0/GetSourceMode', {authTkn: window.Miu.Data.Token}).then(function (response) {
        if (response.data.errorMessage === null && response.data.errorCode === null) {
          window.sessionStorage.setItem('TMC', JSON.stringify(response.data.result))
          this.getTMC()
        }
      })
    },
    call () {
      window.location.href = 'tel:' + this.tel // SourceTel
    }
  }
}
</script>
<style scope>
  .m-tmc{
    color:#666!important;
  }
</style>