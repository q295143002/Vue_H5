<template>
  <div class='bg-gray of-h pos-r' style="z-index:1" >
    <div class="ta-c bg-white pt-2" v-for = 'DDshow in DDStatus'  v-if ='DDshow.status === OrderStatus' track-by ='$index'> 
      <icon :type="DDshow.type" class="m-icon_big" ></icon>
      <p class="mt-1 pb-1" >{{DDshow.show}}</p>
      <cell :title='decodeURIComponent(OrderInfo.StartAddr)' class='ta-l'>
        <i class='theme-color-green iconfont icon-yuanxingweixuanzhong mr-05' slot='icon'></i>
      </cell>
      <cell :title='decodeURIComponent(OrderInfo.DestAddr)'  class='ta-l'>
        <i class='theme-color-red iconfont icon-yuanxingweixuanzhong mr-05' slot='icon'></i>
      </cell>
      <cell class='m-driver ta-l' :title='OrderInfo.DriverName' :inline-desc="OrderInfo.CarPlateId"  v-if= 'OrderInfo.DriverStar > 0' >
        <rater :value.sync='OrderInfo.DriverStar'  disabled slot='value' :font-size='18' class='mr-3'></rater>
        <br>
        <a class="icon-tel iconfont" :href='"tel:" +    OrderInfo.DriverPhone'></a>
        <span style="font-size:13px;" class="mr-3 pr-05">{{OrderInfo.CarModel}}</span>
        <img  style="width:3rem;border-radius:50%;overflow:hidden;margin-right:10px" slot='icon' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGkAAABqCAIAAAAwdOjDAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTExIDc5LjE1ODMyNSwgMjAxNS8wOS8xMC0wMToxMDoyMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkI4Njc1RkY5Mjk2NTExRTY5OEM4RTYwRTc3ODUyMzAyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkI4Njc1RkZBMjk2NTExRTY5OEM4RTYwRTc3ODUyMzAyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Qjg2NzVGRjcyOTY1MTFFNjk4QzhFNjBFNzc4NTIzMDIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Qjg2NzVGRjgyOTY1MTFFNjk4QzhFNjBFNzc4NTIzMDIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7qtV3KAAAa30lEQVR42ux8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" alt="">
      </cell>
      <div class="pd-1">
        <x-button @click = 'pay' type='primary' v-if='OrderStatus === 43'>支付订单</x-button>
        <x-button @click = 'back'
        type='primary' 
          v-if='[51,30,113,99,65,61,311].indexOf(OrderStatus)!==-1'>返回首页</x-button>
        <x-button 
          @click='Confirm.cancelOrder=true' 
          type='cancel' 
          v-if='[55,35,37].indexOf(OrderStatus)!==-1'>取消订单</x-button>
      </div>
    </div>
    <group title='费用明细' v-if='[43,50,51].indexOf(OrderStatus)!==-1'>
      <cell :title='fee.AdjustValue' v-for='fee in OrderInfo.ZCAdjustFees' class='ta-l'>¥{{fee.AdjustNum}}</cell>
    </group>
    <group>
    	<timeline class='pd-1'>
        <timeline-item v-for='show in TimeLineShow' track-by='$index'>
          <h4>{{show.title}}</h4>
          <small style="color:#666">{{show.info}}</small>
        </timeline-item>
      </timeline>
    </group>
  </div>
  <confirm 
  :show.sync="Confirm.cancelOrder" 
  title="是否确定要取消订单"  
  @on-confirm='CancelOrder(false)'  
  :cancel-text = '"不取消"' 
  :confirm-text ='"取消订单"'
  >
  </confirm>
  <confirm 
  :show.sync="Confirm.cancelOrderForce" 
  title="是否强制取消订单"  
  @on-confirm='CancelOrder(true)'  
  :cancel-text = '"不取消"' 
  :confirm-text ='"强制取消"'
  >
  {{'该订单可能已经产生空乘费' + Confirm.cancelOrderForceFee + '元,您是否强制取消？'}}
  </confirm>
  <alert :show.sync ='Alert.Show'>
    {Alert.Text}
  </alert>
</template>
<script>
import { Alert, Card, Cell, Timeline, TimelineItem, Confirm, Group, XButton, Rater, Icon } from 'vux-c/'
export default {
  components: {
    Alert,
    Card,
    Icon,
    Rater,
    XButton,
    Cell,
    Group,
    Confirm,
    Timeline,
    TimelineItem
  },
  data () {
    return {
      Confirm: {
        cancelOrder: false,
        cancelOrderForce: false,
        cancelOrderForceFee: 0
      },
      Alert: {
        Show: false,
        Text: ''
      },
      OrderInfo: {},
      OrderStatus: 1,
      DDStatus: [
        {status: 1, title: '等待接单', info: '', show: '等待司机接单', type: 'waiting'},
        {status: 30, title: '已取消', info: '', show: '订单已取消', type: 'clear'},
        {status: 35, title: '司机已接单', info: '', show: '司机已接单', type: 'waiting'},
        {status: 37, title: '司机已到达', info: '', show: '司机已到达', type: 'success'},
        {status: 39, title: '计费中', info: '', show: '计费中', type: 'waiting'},
        {status: 43, title: '待支付', info: '', show: '等待支付', type: 'waiting'},
        {status: 45, title: '结算中', info: '', show: '费用结算中', type: 'waiting'},
        {status: 50, title: '等待付款/未全部支付', info: '', show: '等待付款', type: 'waiting'},
        {status: 51, title: '已完成支付', info: '感谢您的使用', show: '订单已完成支付', type: 'success'},
        {status: 54, title: '没有司机可发单', info: '', show: '附近没有司机可发单', type: 'warn'},
        {status: 55, title: '没有司机接单', info: '', show: '等待司机接单', type: 'waiting'},
        {status: 60, title: '重新改派', info: '', show: '重新改派订单', type: 'waiting'},
        {status: 61, title: '另派订单没有司机', info: '', show: '没有找到司机', type: 'info'},
        {status: 65, title: '订单过期', info: '', show: '订单已过期', type: 'clear'},
        {status: 99, title: '订单失败未知异常', info: '', show: '订单失败', type: 'warn'},
        {status: 113, title: '下单失败', info: '', show: '下单失败', type: 'warn'},
        {status: 311, title: '订单超时', info: '', show: '订单超时', type: 'info'},
        {status: 610, title: '行程异常结束', info: '', show: '行程异常结束', type: 'clear'}
      ],
      TimeLineList: [],
      TimeLineShow: []
    }
  },
  watch: {
    'OrderStatus': function () {
      switch (this.OrderStatus) {
        case 1: this.TimeLineList = [1]
          break
        case 30: this.TimeLineList = [1, 30]
          this.stopOrderStatus(30)
          break
        case 35: this.TimeLineList = [1, 35]
          this.getOrderInfo()
          break
        case 37: this.TimeLineList = [1, 35, 37]
          break
        case 39: this.TimeLineList = [1, 35, 37, 39]
          break
        case 43: this.TimeLineList = [1, 35, 37, 39, 43]
          this.getOrderInfo()
          this.stopOrderStatus(43)
          break
        case 45: this.TimeLineList = [1, 35, 37, 39, 43, 45]
          break
        case 50: this.TimeLineList = [1, 35, 37, 39, 43, 50]
          this.getOrderInfo()
          this.stopOrderStatus(50)
          break
        case 51: this.TimeLineList = [1, 35, 37, 39, 43, 51]
          this.getOrderInfo()
          this.stopOrderStatus(51)
          break
        case 54: this.TimeLineList = [1, 54]
          break
        case 55: this.TimeLineList = [1, 55]
          break
        case 60: this.TimeLineList = [1, 60]
          break
        case 61: this.TimeLineList = [1, 60, 61]
          break
        case 65: this.TimeLineList = [65]
          break
        case 113: this.TimeLineList = [113]
          break
        case 610: this.TimeLineList = [610]
          this.stopOrderStatus(610)
          break
        case 311:
          this.TimeLineList = [1, 55, 311]
          break
      }
    },
    'TimeLineList' () {
      this.TimeLineShow = []
      for (let i = 0; i < this.TimeLineList.length; i++) {
        console.log(i)
        for (let j = 0; j < this.DDStatus.length; j++) {
          if (this.TimeLineList[i] === this.DDStatus[j].status) {
            this.TimeLineShow.unshift(this.DDStatus[j])
            console.log(this.TimeLineShow)
            window.Miu.SetTitle(this.DDStatus[j].show)
          }
        }
      }
    }
  },
  ready () {
    this.getOrderInfo()
    this.getOrderStatus()
    this.setOrderStatus(5000)
  },
  methods: {
    AlertText (str) {
      this.Alert.show = true
      this.Alert.Text = str
    },
    pay () {
      this.setOrderStatus(60000)
      window.alert('跳转付款页面')
    },
    /* 获取订单信息 */
    getOrderInfo () {
      this.$http({
        method: 'GET',
        url: window.Miu.Data.ApiURL + '/TravelCar_1_0/CarOrderDetail',
        params: {
          token: window.Miu.Data.Token,
          orderId: this.$route.params.OrderID
        }
      }).then(function (response) {
        if (response.data.oldCarOrderList) {
          this.OrderInfo = response.data.oldCarOrderList.Items[0]
          console.log(JSON.stringify(this.OrderInfo))
          this.DDStatus[0].info = new Date(+this.OrderInfo.OrderTime.slice(6, 19)).Format('MM-dd hh:mm:ss') // 出发时间
          this.DDStatus[2].info = this.OrderInfo.DriverName + ',' + this.OrderInfo.CarModel + ':' + this.OrderInfo.CarPlateId  // 司机信息
          this.DDStatus[5].info = '本次费用' + this.OrderInfo.PayFee + '元'// 费用
        }
      },
      function (response) {
        window.alert('请求出错，请刷新页面')
        console.log(response)
      })
    },
    /* 停止发送订单状态请求 */
    stopOrderStatus (num) {
      clearInterval(window.xx)
      if (num) {
        this.OrderStatus = num
      }
      console.log('stop')
    },
    /* 发送订单状态请求 */
    setOrderStatus (time) {
      var that = this
      this.stopOrderStatus()
      window.xx = setInterval(function () {
        that.getOrderStatus()
      }, time)
    },
    getOrderStatus () {
      this.$http({
        method: 'GET',
        url: window.Miu.Data.ApiURL + '/TravelCar_1_0/GetStatusByOrderId',
        params: {
          token: window.Miu.Data.Token,
          orderId: this.$route.params.OrderID
        }, DisableLoading: true
      }).then(function (response) {
        this.OrderStatus = response.data.status
      },
      function (response) {
        console.log(response)
      })
    },
    back () {
      window.history.back()
    },
    /* 重新叫单 */
    /* ReCreateOrder () {
      console.log(this.OrderInfo.SpecialId)
      this.$http({
        method: 'GET',
        url: window.Miu.Data.ApiURL + '/TravelCar_1_0/DiReCreateOrderId',
        params: {
          token: window.Miu.Data.Token,
          zcOrderId: this.OrderInfo.SpecialId
        }
      }).then(function (response) {
        switch (response.data.errno) {
          case 20020: this.$root.Alert('重新叫车失败')
            break
        }
      },
      function (response) {
        this.$root.Toast(response.data.errorMessage)
      })
    },*/
    /* 取消订单 */
    CancelOrder (force) {
      this.$http.post(window.Miu.Data.ApiURL + '/TravelCar_1_0/CancelOrderTimely', {
        authTkn: window.Miu.Data.Token,
        zc_order_id: this.OrderInfo.SpecialId,
        tp_customer_phone: +this.OrderInfo.CustomerPhone,
        order_provider: 19,
        force: force
      }).then(function (response) {
        switch (response.data.code) {
          case 24:
            this.Confirm.cancelOrderForceFee = response.data.cost
            this.Confirm.cancelOrderForce = true
            break
          case 0: this.stopOrderStatus(30)
            break
          case 20023: this.AlertText('该订单已取消，请不要重复取消')
            this.stopOrderStatus(30)
            break
        }
      },
      function (response) {
        console.log(response)
      })
    }
  }
}
</script>
<style>
  .m-icon-red:before{
    color:red;
  }
  .m-icon-green:before{
    color:green;
  }
  .m-icon_big:before{
    font-size: 60px;
  }
  .m-driver .iconfont {
    font-size: 40px;
    color: rgb(255, 204, 102);
    right:20px;
    position: absolute;
    top:0px;
  }
</style>