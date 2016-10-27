<template>
  <div class="pos-r" >
    <div v-link="'/user/order/carDetail/'+list.OrderId">
    	<div class="w-travel-bg">
       <p>{{new Date(+ list.OrderTime.slice(6,19)).Format('MM月dd日')}}</p>
       <p class="travel-start">
       <i class="iconfont icon-zuobiao"></i><span>&nbsp;{{list.StartAddr}}</span></p>
       <p class="travel-end">{{list.DestAddr}}<i class="iconfont icon-zuobiao"></i></p>
      </div>
      <div class="w-travel-white">
        <ul class="car-bottom">
          <li>
            <p>{{list.CarPlateId}}</p>
            <p>{{list.DriverName}} {{list.DriverPhone}}</p>
          </li>
          <li v-if="list.OrderStatus!==43&&list.OrderStatus!==51"><b>预估: </b><span class="color-red">&yen; {{list.EstimateFee}}</span></li>
          <li v-else><span class="color-red">&yen; {{list.PayFee}}</span></li>
        </ul>
      </div>
    </div>
    <a class="pos-a travel-phone" :href="'tel:'+list.DriverPhone">联系司机</a>
  </div>
</template>
<script>
export default {
  components: {},
  data () {
    return {}
  },
  props: {
    list: Object
  },
  methods: {}
}
</script>
<style lang="less">
  .w-travel-bg{
    background:url(../../assets/order.png) no-repeat left top;
    background-size:100% 100%;
    padding:1rem;
    box-sizing: border-box;
    color:#fff;
  }
  .travel-start{
    position: relative;
    width:100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .travel-end{
    text-align: right;
  }
  .car-bottom{
    display:flex;
    -webkit-flex-direction:row;
    flex-direction:row;
    -webkit-justify-content:space-between;
    justify-content:space-between;
  }
  .travel-phone{
    bottom:8px;
    right:1rem;
    display:block;
    color:red;
    border:1px solid #f00;
    padding:0.1rem 0.3rem;
    border-radius: 5px;
  }
</style>