<template>
  <div class="w-travel-bg2">
    <ul class="air-title">
      <li>{{new Date(+ list.Flts[0].TakeOffTime.slice(6,19)).Format('MM月dd日')}}</li>
      <li>{{list.StatusStr}}</li>
    </ul>
    <ul class="air-time">
      <li>
        <!-- <p class="fsz-1_5">{{new Date(+ list.Flts[0].TakeOffTime.slice(6,19)).Format('hh:dd')}}</p> -->
        <p class="fsz-1_5">{{list.Flts[0].TakeOffTimeStr.split(' ')[1]}}</p>
        <p>{{list.Flts[0].DCityName}}{{list.Flts[0].DPortName}} {{list.Flts[0].DepartAirportBuilding}}</p>
      </li>
      <li>
        <i class="iconfont icon-air w-travel-air"></i>
      </li>
      <li>
        <p class="fsz-1_5">{{new Date(+ list.Flts[0].ArrivalTime.slice(6,19)).Format('hh:dd')}}</p>
        <p>{{list.Flts[0].ACityName}}{{list.Flts[0].APortName}} {{list.Flts[0].DepartAirportBuilding}}</p>
      </li>
    </ul>
  </div>
  <div class="w-travel-white">
    <ul class="air-bottom">
      <li>
        <p>{{list.Flts[0].AirLineName}}{{list.Flts[0].Flight}}&nbsp;&nbsp;{{list.Flts[0].ClassName}}/{{list.Flts[0].SubClass}}</p>
        <p>乘客: {{list.FltPassengers[0].PassengerName}}</p>
      </li>
      <li>
        <p>订单总额</p>
        <p class="color-red">&yen; {{list.Amount}}</p>
      </li>
    </ul>
  </div>
</template>
<script>
// import {Group, Cell} from 'vux-c'
export default {
  components: {},
  data () {
    return {}
  },
  props: {
    list: Object
  },
  ready () {
    // console.log(this.list.Flts[0].TakeOffTimeStr.split(' ')[1])
  },
  methods: {}
}
</script>
<style lang="less">
  .w-travel-bg2{
    background:url(../../assets/travel.png) no-repeat left top;
    background-size:100% 100%;
    padding:1rem;
    box-sizing: border-box;
  }
  .w-travel-white{
    background-color: #fff;
    padding:1rem;
  }
  .air-title,.air-time,.air-bottom{
    display:flex;
    -webkit-flex-direction:row;
    flex-direction:row;
    color:#fff;
  }
  .air-title{
    -webkit-justify-content:space-between;
    justify-content:space-between;
  }
  .air-time{
    -webkit-justify-content:space-around;
    justify-content:space-around;
    text-align: center;
  }
  .air-bottom{
    color:#000;
    -webkit-justify-content:space-between;
    justify-content:space-between;
  }
</style>