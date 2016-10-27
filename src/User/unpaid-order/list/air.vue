<template>
	<ul class="pl-1 pr-1">
    <li class="w-air-item mb-1 bg-white" @click="jumpAirDetail(list.OrderId)">
      <!-- title -->
      <cell title="机票">
        <span slot="value">{{list.StatuStr}}</span>
        <i slot="icon" class="iconfont icon-airicon fsz-2 pr-05 icon-color-blue"></i>
      </cell>
      <p style="border-top:1px solid #ccc;margin:0 20px 10px;"></p>
      <!-- 航站楼 -->
      <p class="pl-1">{{list.DPortName}} {{list.DepartAirportBuilding}} - {{list.APortName}} {{list.ArriveAirportBuilding}}</p>
      <!-- time -->
      <cell title="" :inline-desc="new Date(+list.TakeOffTime.slice(6,19)).Format('MM月dd日 hh:mm')+'-'
        +new Date(+list.ArrivalTime.slice(6,19)).Format('hh:mm')">
        <span slot="value" class="color-red">&yen; {{list.ParPrice}}</span>
      </cell>
      <!-- 航仓 -->
      <p class="pl-1 pb-1" style="color:#666;">{{list.AirLineName+list.ClassName}}</p>
    </li>
  </ul>
</template>
<script>
import {Cell} from 'vux-c'
export default {
  components: {
    Cell
  },
  data () {
    return {}
  },
  props: {
    list: Object
  },
  methods: {
    jumpAirDetail (id) {
      this.$router.go({
        name: '机票详情',
        params: {
          id: id
        },
        query: {
          order: true
        }
      })
    }
  }
}
</script>