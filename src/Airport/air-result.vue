<template>
  <time-choose :time-show.sync="FlightTime" :rest-time.sync='RestTime'  v-ref:time></time-choose>
  <results v-ref:result :pass-way.sync ='PassWay' :order-step.sync='OrderStep'></results>
  <toast :show.sync='toast.show' type= 'text'>{{toast.text}}</toast>
</template>
<script>
import { Toast } from 'vux-c/'
import TimeChoose from './search/time-choose'
import results from './search/results'
export default {
  components: {
    Toast,
    TimeChoose,
    results
  },
  data: function () {
    return {
      toast: {
        text: '',
        show: false
      },
      key: {},
      FlightTime: this.$route.params.DepartDateTo,
      Flights: {},
      FlightShow: [],
      RestTime: '',
      PassWay: {
        DepartCity: '',
        ArriveCity: ''
      },
      /* 往返程状态控制 0：无状态 1：需要继续选择返程 2：完成选择可以开始填单 */
      OrderStep: 0
    }
  },
  ready () {
    this.$refs.result.getFlights(this.$route.params.DepartDateTo)
  },
  watch: {
    '$route.params.DepartDateTo' () {
      this.$refs.result.getFlights(this.$route.params.DepartDateTo)
    }
  },
  methods: {
  }
}
</script>