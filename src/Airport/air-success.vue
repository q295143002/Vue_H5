<template>
<div class="mt-2" >
  <div class="ta-c">
    <icon type='success' class='icon_big'></icon>
  </div>
  <div class="ta-c mt-1">
    <b class="theme-color-blue" >您的订单已经提交成功！</b>
  </div>
  <div class="pd-1">
    <div class="ta-c color-red" v-if='AirOrder.IsApproval'>
      您的审批申请已经提交，请在审批通过后尽快完成支付，以免影响您的出行
      <br>
    </div>
    <div class="ta-c mt-05">订单保留至<br>{{new Date(+AirOrder.OrderList[0].ADTK.slice(6, -2)).Format('yyyy年MM月dd日 hh:mm')}}</div>
    <group class='mt-2'>
      <cell title='订单总额'><b class="color-red">¥{{AirOrder.Amount}}</b></cell>
    </group>
  </div>
  <div class="pd-05 mt-1">
    <x-button type='primary' @click = '$router.go("/user/order")' >查看订单</x-button>
  </div>
  <div class="pd-05" v-if='!AirOrder.IsApproval'>
    <x-button
    type='primary'
    @click='$refs.pay.showItem(AirOrder.PayString)'
    >支付订单</x-button>
  </div>
  <!-- 支付窗口 -->
  <air-pay @pay-success = 'paySuccess' v-ref:pay></air-pay>
</div>
</template>
<script>
import { Cell, Icon, XButton, Group } from 'vux-c/'
import AirPay from 'public/AirPay'
export default {
  components: {
    AirPay,
    Group,
    Cell,
    Icon,
    XButton
  },
  ready () {
    if (!window.sessionStorage.getItem('AirHistorySuccess')) {
      window.sessionStorage.setItem('AirHistorySuccess', window.history.length)
    }
    window.Miu.SetTitle('提交成功')
  },
  data () {
    return {
      pay: {
        show: false
      },
      AirOrder: JSON.parse(window.sessionStorage.getItem('AirOnlineOrder'))
    }
  },
  methods: {
    paySuccess () {
      this.$router.replace('/user/order')
    }
  }
}
</script>