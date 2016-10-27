<template>
	<ul class="unpaid_car pl-1 pr-1 ">
    <li class="unpaid_car-item mb-1 bg-white"
    @click = "jumpCarDetail(list.OrderId)">
      <cell title="用车">
       <span slot="value">{{STATUS[0][list.OrderStatus]}}</span>
       <i slot="icon" class="iconfont icon-caricon fsz-2 pr-05" style="color:#f8b551;"></i>
     </cell>
     <p style="border-top:1px solid #ccc;margin:0 20px 10px;"></p>
     <!-- time -->
      <cell title="" :inline-desc="new Date(+list.CreateTime.slice(6,19)).Format('MM月 dd日 hh:mm')">
        <span slot="value" class="color-red">&yen; {{list.EstimateFee}}</span>
      </cell>
      <!-- StartAddr -->
      <p class="unpaid_places">
        <i slot="icon" class="iconfont icon-yuanxingweixuanzhong icon-color-green icon-size-s"></i>
        <span>{{decodeURIComponent(list.StartAddr).replace('+',' ')}}</span>
      </p>
      <!-- DestAddr -->
      <p class="unpaid_places">
        <i slot="icon" class="iconfont icon-yuanxingweixuanzhong icon-color-red icon-size-s"></i>
        <span>{{decodeURIComponent(list.DestAddr).replace('+',' ')}}</span>
        <div class="pb-1"></div>
      </p>
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
    return {
      STATUS: [window.Miu.Data.Taxi.DDStatus]
    }
  },
  ready () {},
  props: {
    list: Object
  },
  methods: {
    jumpCarDetail (id) {
      this.$router.go({
        name: '用车详情',
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
<style lang="less">
   .unpaid_car-item{
    // border:1px solid #ccc;
    border-radius: 5px;
    .weui_cell{
      padding: 0px 15px;
      &:before{
        border:none;
      }
    }
    .vux-label-desc{
      font-size: 16px;
    }
  }
  .unpaid_places{
    width:100%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    box-sizing: border-box;
    padding: 0 1rem;
  }
  ul li {
    list-style-type: none;
  }
</style>