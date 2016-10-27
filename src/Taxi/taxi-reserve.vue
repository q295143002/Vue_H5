<template>
  <div class="pos-a" v-show= 'ReadyShow' style="top:0;left:0;right:0;bottom:0;overflow-x:hidden;overflow-y:scroll" >
    <place :place-data.sync='place' v-ref:place></place>
    <div v-show='InfoShow'>
      <info :info-data.sync='info'v-ref:info ></info>
    </div>
    <div class='pd-1'>
      <x-button v-on:click='submitTaxi' type='primary'>呼叫专车</x-button>
    </div>
    <div class= 'pt-0'>
      <tmc show v-ref:tmc></tmc>
    </div>
  </div>
  <toast :show.sync="toast.show" type='text'>{{toast.text}}</toast>
  <confirm 
  :show.sync="confirmFail.show" 
  :title='confirmFail.title' 
  @on-confirm="ConfirmFail"
  :confirm-text= 'confirmFail.confirmText'
  :cancel-text = 'confirmFail.cancelText'
  ></confirm>
  <confirm 
  :show.sync="confirmPrice.show" 
  :title='confirmPrice.title' 
  @on-confirm="ConfirmPrice"
  :confirm-text= 'confirmPrice.confirmText'
  :cancel-text = 'confirmPrice.cancelText'
  ></confirm>
</template>
<script>
import { XButton, Toast, Confirm, Icon, Dialog } from 'vux-c/'
import place from './reserve/place'
import info from './reserve/info'
import Tmc from 'public/TMC'
export default {
  components: {
    Tmc,
    Dialog,
    Icon,
    Confirm,
    Toast,
    XButton,
    place,
    info
  },
  watch: {
    '$route.params.open' () {
      switch (this.$route.params.open) {
        case 'place': this.$refs.place.Pop = true
          break
        case 'index': this.$refs.place.Pop = false
          this.$refs.place.$refs.choosep.CityInput.main = false
          break
        default: this.$refs.place.Pop = false
          break
      }
    }
  },
  ready () {
    this.ReadyShow = true
    if (this.$route.params.open !== 'index') {
      this.$router.replace('/taxi/index')
    }
    window.Miu.SetTitle('用车')
  },
  data () {
    return {
      ReadyShow: false,
      InfoShow: false,
      toast: {
        show: false,
        text: '',
        type: ''
      },
      /* 公司余额不足 10010*/
      confirm: {
        title: '公司账户代扣失败，是否使用支付宝支付',
        show: false,
        confirmText: '确定',
        cancelText: '取消'
      },
      /* 觅优余额不足 20007 */
      confirmFail: {
        title: '呼叫专车失败,叫车失败（企业余额不足）请重试或联系客服',
        show: false,
        confirmText: '联系客服',
        cancelText: '确定'
      },
      /* 动调溢价失败 */
      confirmPrice: {
        title: '呼叫专车失败，动态调价变化，请重新获取',
        show: false,
        confirmText: '重新获取',
        cancelText: '知道了'
      },
      place: {},
      time: {},
      info: {}
    }
  },
  methods: {
    submitTaxi () {
      this.$refs.place.setPlaceData()
      // this.$refs.provide.setProvideData()
      this.$refs.info.setInfoData()
      var pushData = {
        'dynamic_md5': this.place.dynamic_md5,
        'actual_user_phone': window.Miu.Data.UserInfo.Mobilephone, // 用户号码
        'order_provider': 19, // 订单提供商 一号专车：15 滴滴专车19
        'OrderSource': 1,
        'rule': 201,
        'ServerFrom': '',
        'authTkn': window.Miu.Data.Token,
        'processTime': new Date(), // 下单时间
        'appId': 1,
        'start_loc': this.place.start_loc, // 出发点
        'dest_loc': this.place.dest_loc, // 目的地
        'Products': this.place.Products,
        'require_level': this.place.require_level, // 车型类别
        'city_name': this.place.city_name,
        'city_id': this.place.city_id, // 出发城市ID
        'dest_city_id': this.place.dest_city_id, // 到达城市ID
        'order_time': this.place.order_time,
        'order_type': this.place.order_type, // 下单类型
        'expense_type': this.info.expense_type, // 因公：1 因私：2
        'pay_type': this.info.pay_type, // 支付方式 公司账户：1 | 支付宝：2
        'actual_user_name': this.info.actual_user_name, // 乘客姓名
        'tp_customer_phone': this.info.actual_user_phone, // 乘客电话
        'cost_center_id': this.info.cost_center_id, // 成本中心ID
        'cost_center_name': this.info.cost_center_name, // 成本中心名称
        'more_remark_one': this.info.more_remark_one,
        'more_remark_two': this.info.more_remark_two,
        'more_remark_three': this.info.more_remark_three,
        'NoteToolTipOne': this.info.NoteToolTipOne,
        'NoteToolTipTwo': this.info.NoteToolTipTwo,
        'NoteToolTipThree': this.info.NoteToolTipThree
      }
      // console.log(JSON.stringify(pushData))
      this.vailOrder(pushData)
    },
    vailOrder (pushData) {
      function len (str) {
        if (str.length > 24) {
          return false
        } else {
          return true
        }
      }
      len('pushData.MoreRemarkOne')
      if (pushData.tp_customer_phone === null) {
        this.$root.Toast('请选择联系人号码')
      } else if (this.$refs.place.from.addr === '') {
        this.$root.Toast('请选择出发点')
      } else if (this.$refs.place.to.addr === '') {
        this.$root.Toast('请选择目的地')
      } else if (!pushData.cost_center_id) {
        this.$root.Toast('请设置成本中心')
      } else if (!len(pushData.more_remark_one) || !len(pushData.more_remark_two) || !len(pushData.more_remark_three)) {
        this.$root.Toast('备注字数超出限制')
      } else {
        this.submitOrder(pushData)
      }
    },
    ConfirmAliPay () {
      this.$refs.info.payType = 2
      if (this.InfoShow) {
        this.submitTaxi()
      }
    },
    ConfirmFail () {
      this.$refs.tmc.call()
    },
    ConfirmPrice () {
      this.$refs.place.getFees()
    },
    submitOrder (pushData) {
      this.$http.post(window.Miu.Data.ApiURL + '/TravelCar_1_0/PlaceOrder', pushData).then(function (response) {
        if (response.data.errorMessage === null && response.data.msg === 'SUCCESS') {
          this.$route.router.go('/taxi/wait/' + response.data.tpOrderId)
        } else if (response.data.code === 10010) {
          this.confirmFail.show = true // 微信支付暂时没办法用
        } else if (response.data.code === 20007) {
          this.confirmFail.show = true
        } else if (response.data.code === 20028) {
          this.confirmPrice.show = true
        } else if (response.data.msg === '没有开通支付权限') {
          this.$root.Alert('下单失败', '您的差旅政策没有用车权限，请联系管理员。')
        } else {
          this.$root.Toast(response.data.msg)
        }
      },
      function (response) {
        console.log(response)
      })
    }
  }
}
</script>