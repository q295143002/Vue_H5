<template>
  <div class="bgc-gray-light" style="width:100%;overflow:hidden;">
    <!-- head -->
    <flexbox class="carDetail-top pd-1 car_bs_b">
      <flexbox-item>
        <p class="pb-2"><i class="iconfont icon-zuobiao"></i>&nbsp;{{decodeURIComponent(detail.StartAddr)}}</p>
        <p class="ta-r">{{decodeURIComponent(detail.DestAddr)}}&nbsp;<i class="iconfont icon-zuobiao"></i></p>
      </flexbox-item>
    </flexbox>
    <!-- body -->
    <!-- 1 用车信息-->
    <flexbox class="bg-white pd-1 car_bs_b">
      <flexbox-item>
        <ul class="carDetail_body_list">
          <li class="carLogo"></li>
          <li>
            <p class="pt-1">{{detail.ZCProducts[0].Name}}</p>
            <p><span>预估&nbsp;</span><span class="color-red">¥ {{detail.CorpEstimateFee}}</span></p>
          </li>
        </ul>
      </flexbox-item>
    </flexbox>
    <!-- 2 司机信息-->
    <flexbox orient="vertical" class="bg-white pd-1 car_bs_b mt-1" v-show="detail.DriverName !==null">
      <flexbox-item>
        <ul class="carDetail_body_list">
          <li>
            <div class="driverDiv">
              <p v-if="detail.DriverPhoto===null" class="driverLogo"></p>
              <img v-else :src="detail.DriverPhoto" title="logo" alt="" v-if="!onerror"/>
            </div>
          </li>
          <li class="pt-05"><p>{{detail.DriverName}}</p><p><span style="color:orange;" v-for='x in detail.DriverStar'>★</span></p></li>
        </ul>
      </flexbox-item>
      <flexbox-item>
        <ul class="carDetail_body_list">
          <li><p class="car_cgray">车牌号</p><p>{{detail.CarPlateId}}</p></li>
          <li><p class="car_cgray">车型</p><p>{{detail.CarModel}}</p></li>
        </ul>
      </flexbox-item>
      <flexbox-item>
        <p class="car_cgray">手机号码</p>
        <p>{{detail.DriverPhone}}</p>
      </flexbox-item>
    </flexbox>
    <!-- 3 订单信息-->
    <flexbox orient="vertical" class="bg-white pd-1 car_bs_b mt-1">
      <flexbox-item>
        <ul class="carDetail_body_list">
          <li><p class="car_cgray">订单号</p><p>{{detail.OrderId}}</p></li>
          <li><p class="car_cgray">下单时间</p><p>{{new Date(+detail.CreateTime.slice(6,19)).Format('MM月dd日 hh:mm')}}</p></li>
        </ul>
      </flexbox-item>
      <flexbox-item v-if="detail.OrderType===1">
        <ul class="carDetail_body_list">
          <li v-if="detail.ActualStartTime!==null">
            <p class="car_cgray">实际开始时间</p>
            <p>{{new Date(+detail.ActualStartTime.slice(6,19)).Format('MM月dd日 hh:mm')}}</p>
          </li>
          <li v-if="detail.ActualStartTime!==null">
            <p class="car_cgray">实际结束时间</p>
            <p>{{new Date(+detail.ActualEndTime.slice(6,19)).Format('MM月dd日 hh:mm')}}</p>
          </li>
        </ul>
      </flexbox-item>
      <flexbox-item>
        <ul class="carDetail_body_list">
          <li><p class="car_cgray">订单状态</p><p>{{STATUS[0][detail.OrderStatus]}}</p></li>
          <li v-show="detail.OrderStatus===43" @click='$refs.pay.showItem(detail.PayString)'
>
            <x-button class="fl-l" style="width:50%;" type="warn">支付</x-button></li>
        </ul>
      </flexbox-item>
    </flexbox>
    <!-- 4 乘客信息-->
    <flexbox orient="vertical" class="bg-white pd-1 car_bs_b mt-1">
      <flexbox-item>
        <ul class="carDetail_body_list">
          <li><p class="car_cgray">乘客</p><p>{{detail.ActualUserName}}</p></li>
          <li v-show="detail.OrderType===2"><p class="car_cgray">预约用车时间</p><p>{{new Date(+detail.OrderTime.slice(6,19)).Format('MM月dd日 hh:mm')}}</p></li>
        </ul>
      </flexbox-item>
      <flexbox-item v-show="detail.CostCenterName!==null">
        <p class="car_cgray">成本中心</p>
        <p>{{detail.CostCenterName}}</p>
      </flexbox-item>
    </flexbox>
    <!-- 5 费用明细 -->
    <flexbox orient="vertical" class="bg-white car_bs_b mt-1 pt-1" v-if="detail.ZCAdjustFees.length>0">
      <flexbox-item>
        <p class="pl-1 car_cgray">费用明细</p>
      </flexbox-item>
      <flexbox-item class="w-nopadding">
        <cell inline-desc="服务费">¥ {{detail.ServiceFee}}</cell>
      </flexbox-item>
      <flexbox-item class="w-nopadding" v-for="fees in detail.ZCAdjustFees">
        <cell :inline-desc="fees.AdjustValue"
        v-if="fees.AdjustValue==='总费用'">¥ {{fees.AdjustNum + detail.ServiceFee}}</cell>
        <cell :inline-desc="fees.AdjustValue" v-else>¥ {{fees.AdjustNum}}</cell>
      </flexbox-item>
    </flexbox>
    <!-- 6 备注信息-->
    <flexbox class="mt-1 bg-white pd-1 car_bs_b" v-show="detail.MoreRemarkOne!==''||detail.MoreRemarkTwo!==''||detail.MoreRemarkThree!==''">
      <flexbox-item>
        <div v-show="detail.MoreRemarkOne!==''&&detail.MoreRemarkOne!==null">
          <p>{{detail.NoteToolTipOne}}</p>
          <p>{{detail.MoreRemarkOne}}</p>
        </div>
        <div v-show="detail.MoreRemarkTwo!==''&&detail.MoreRemarkTwo!==null">
          <p>{{detail.NoteToolTipTwo}}</p>
          <p>{{detail.MoreRemarkTwo}}</p>
        </div>
        <div v-show="detail.MoreRemarkThree!==''&&detail.MoreRemarkThree!==null">
          <p>{{detail.NoteToolTipThree}}</p>
          <p>{{detail.MoreRemarkThree}}</p>
        </div>
      </flexbox-item>
    </flexbox>
    <!-- 7 是否需要支付 -->
    <flexbox class="w-detail pl-1 pt-1 bg-white" orient="vertical" v-if="detail.OrderStatus===43||detail.OrderStatus===51">
      <flexbox-item>
        <p>
          <span class="w-static-font">订单总额：</span>
          <span class="color-red">¥ {{detail.PayFee + detail.ServiceFee}}</span>
        </p>
      </flexbox-item>
    </flexbox>
    <!-- 8 是否需要取消订单-->
    <flexbox v-if="disCancel.indexOf(detail.OrderStatus) === -1">
      <flexbox-item @click="CancelConfirm">
        <div class="pd-05">
          <x-button type="warn">取消订单</x-button>
        </div>
      </flexbox-item>
    </flexbox>
    <tmc show class='mt-1'></tmc>
  </div>
  <toast :show.sync="showToast" :time="500" type="text">取消成功</toast>
  <!-- <air-pay :show.sync ='show' :pay-str = 'detail.PayString'></air-pay> -->
  <air-pay @pay-success = 'paySuccess' v-ref:pay></air-pay>
  <!-- 取消订单二次确认 -->
  <confirm title="" :show.sync="showConfirm1" confirm-text="确定" cancel-text="取消"
  @on-confirm="CancelOrderTimely($route.params.id, false)">
    <p class="ta-c">确认或取消订单</p>
  </confirm>
  <!-- 取消订单强制取消 -->
  <confirm title="" :show.sync="showConfirm2" confirm-text="确定" cancel-text="取消"
  @on-confirm="CancelOrderTimely($route.params.id, true)">
    <p class="ta-c">需要{{addCost}}元空程费，确认或取消订单</p>
  </confirm>
  <!-- 支付 -->
  <alert :show.sync="showPay" title="" button-text="确定">
    <p style="text-align:center;">暂不支持微支付，请通过app或者网页端使用支付宝支付</p>
  </alert>
</template>
<script>
import {Flexbox, FlexboxItem, XButton, Cell, Toast, Confirm, Alert} from 'vux-c'
import AirPay from '../../../Public/AirPay'
import Tmc from '../../../Public/TMC'
export default {
  components: {
    Flexbox,
    FlexboxItem,
    XButton,
    Cell,
    Toast,
    Confirm,
    Alert,
    AirPay,
    Tmc
  },
  data () {
    return {
      show: false,
      showConfirm1: false,
      showConfirm2: false,
      showPay: false,
      page: {
        showLoading: true
      },
      showToast: false,
      isServerErr: false,
      userinfo: window.Miu.Data.UserInfo,
      STATUS: [window.Miu.Data.Taxi.DDStatus],
      /* 30: 已取消 39: 计费中 43: 待支付 45:结算中 50:等待付款/未全部支付 51:已支付 311: 订单超时 */
      disCancel: [30, 39, 43, 45, 50, 51, 311],
      addCost: 0, /* 空乘费 */
      detail: {
        CityName: '',
        DestAddr: '',
        DriverName: '',
        OrderStatus: '',
        CreateTime: '',
        OrderTime: '',
        SpecialId: '',
        ZCAdjustFees: [],
        ZCProducts: [{
          Name: ''
        }]
      }
    }
  },
  ready () {
    this.CarOrderDetail()
    this.isOrder()
  },
  watch: {
    '$route.params.id' (newVal, oldVal) {
      if (this.$route.name === 'car_detail') {
        this.CarOrderDetail()
      }
    }
  },
  methods: {
    isOrder () {
      if (this.$route.query.order) {
        window.sessionStorage.setItem('type', 'car')
      }
    },
    CancelConfirm () {
      if (this.addCost > 0) {
        this.showConfirm2 = true
      } else {
        this.showConfirm1 = true
      }
    },
    /* 订单详情 */
    CarOrderDetail () {
      this.$http({
        methods: 'GET',
        url: window.Miu.Data.ApiURL + '/TravelCar_1_0/CarOrderDetail',
        params: {
          token: window.Miu.Data.Token,
          orderId: this.$route.params.id
        }
      }).then(function (response) {
        // console.log(response.data)
        if (response.status !== 411) {
          this.detail = response.data.oldCarOrderList.Items[0]
        }
      })
    },
    /* 取消订单 */
    CancelOrderTimely (id, bool) {
      this.$http.post(window.Miu.Data.ApiURL + '/TravelCar_1_0/CancelOrderTimely', {
        authTkn: window.Miu.Data.Token,
        zc_order_id: this.detail.SpecialId,
        tp_customer_phone: this.userinfo.Mobilephone,
        order_provider: 19,
        force: bool
      }, {DisableLoading: true}).then(function (response) {
        console.log(response.data)
        if (response.status !== 411) {
          if (response.data.code === 24) {
            this.addCost = response.data.cost
            this.showConfirm2 = true
          } else if (response.data.code === 20023) {
            this.$root.Toast(response.data.msg)
            this.CarOrderDetail()
          } else {
            window.sessionStorage.setItem('order', 'decel')
            this.showToast = true
            setTimeout(function () {
              window.history.back()
            }, 500)
          }
        }
      }, function (response) {
        console.log(response.data)
        // this.$root.Toast(response.data)
      })
    }
  }
}
</script>
<style lang="less">
  @import '../../../styles/user/my-order/detail.less';
  .w-nopadding {
    .weui_cell{
      padding:0 15px;
    }
  }
</style>