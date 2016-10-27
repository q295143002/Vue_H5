<template>
<div v-if = 'CorpPolicy.Insurance === "T"'>
  <group v-if = 'useIns === true' >
    <switch 
      title='交通意外险' 
      :value.sync='show'  
      :disabled='disabled'  
      :inline-desc='disabled === true?"根据贵公司的要求您必须购买保险":""' 
      class='vux-1px-b'>
    </switch>
    <radio :options="menu" :value.sync="index" v-show = 'show'></radio>
  </group>
  </div>
</template>
<script>
import { Group, Cell, Radio, Switch } from 'vux-c/'
export default {
  components: {
    Group,
    Cell,
    Switch,
    Radio
  },
  data () {
    return {
      CorpPolicy: JSON.parse(window.sessionStorage.getItem('AirCorpPolicy')),
      disabled: true,
      show: true,
      menu: [],
      insurance: [],
      index: '0',
      useIns: true
    }
  },
  watch: {
    'show' () {
      this.getInsuranceData()
    },
    'index' () {
      this.getInsuranceData()
    }
  },
  props: {
    InsuranceFee: Number,
    InsuranceData: Object
  },
  ready () {
    this.getInsurance()
  },
  methods: {
    setInsuranceRule () {
      if (this.insurance[0].InsOnePrice === 0) {
        if (this.insurance.length === 1) {
          this.useIns = false
          this.InsuranceFee = 0
        } else {
          this.index = '1'
          this.show = false
          this.disabled = false
          for (let i = 1; i < this.insurance.length; i++) {
            this.menu.push({value: '￥' + this.insurance[i].InsOnePrice + '/份 保额' + this.insurance[i].InsuredAmount + '万', key: i + ''})
          }
        }
      } else {
        this.disabled = true
        for (let i = 0; i < this.insurance.length; i++) {
          this.menu.push({value: '￥' + this.insurance[i].InsOnePrice + '/份 保额' + this.insurance[i].InsuredAmount + '万', key: i + ''})
        }
      }
      this.getInsuranceData()
    },
    getInsurance () {
      this.$http({
        method: 'GET',
        url: window.Miu.Data.ApiURL + '/Insurance_1_0/GetInsurance',
        params: {
          token: window.Miu.Data.Token
        }
      }).then(function (response) {
        this.insurance = response.data.insurance
        this.setInsuranceRule()
      })
    },
    getInsuranceData () {
      this.InsuranceData = { RouteIndex: 0 }
      if (this.useIns === true && this.show === true && this.CorpPolicy.Insurance === 'T') {
        this.InsuranceFee = this.insurance[this.index].InsOnePrice
        this.InsuranceData = this.insurance[this.index]
        switch (this.$route.params.filghtway) {
          case 'S': this.InsuranceData.RouteIndex = 1
            break
          case 'D': this.InsuranceData.RouteIndex = 2
            break
        }
      }
      this.$parent.setFee()
    }
  }
}
</script>
