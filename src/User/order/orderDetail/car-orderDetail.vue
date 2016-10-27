<template>
<!-- <loading :show.sync="page.showLoading"></loading> -->
<div>
  <div v-if="isServerErr === true">
    <div class="w-serverErr">
      <span>获取数据失败，</span>
      <span class="reTry" @click="reload">请刷新页面重试</span>
    </div>
  </div>
  <div v-else style="height:100%;width:100%;" class="bgc-gray-light">
    <!-- header >>>>-->
    <flexbox orient="vertical">
      <flexbox-item class="w-car-bg">
        <flexbox orient="vertical">
          <flexbox-item class="w-carDetail-one">
            <!-- <span class="w-detail-cityname">{{$route.params.id}}</span> -->
          </flexbox-item>
          <flexbox-item class="pl-1 w-carDetail-two">
            <i class="iconfont icon-zuobiao"></i>
            <span >{{decodeURIComponent(detail.StartAddr)}}</span>
          </flexbox-item>
          <flexbox-item class="pr-1 ta-r w-carDetail-three"> 
            <span style="100%;">{{decodeURIComponent(detail.DestAddr)}}</span>
            <i class="iconfont icon-zuobiao"></i>
          </flexbox-item>
        </flexbox>
      </flexbox-item>
    </flexbox>
    <!-- header <<<<-->
    <!-- 1 -->
    <flexbox class="w-detail">
      <flexbox-item class="ml" :span="0.4">
        <div class="w-car-logo">
        </div>
      </flexbox-item>
      <flexbox-item class="ml" :span="0.5">
        <p>{{detail.ZCProducts[0].Name}}</p>
        <p><span>预估&nbsp;</span><span class="color-red">¥ {{detail.CorpEstimateFee}}</span></p>
        <!-- <p v-if="detail.OrderStatus !== 43 && detail.OrderStatus !== 51"><span>预估</span> <span class="w-pre-color">¥ {{detail.CorpEstimateFee}}</span></p>
        <p v-else>¥ {{detail.PayFee}}</p> -->
      </flexbox-item>
      <flexbox-item>
      </flexbox-item>
    </flexbox>
    <!-- 1 -->
    <!-- 2 -->
    <flexbox class="w-detail" orient="vertical" v-if="detail.DriverName!==null">
      <flexbox-item>
        <flexbox>
          <flexbox-item :span="0.3">
            <div class="w-car-driverlogo">
              <img :src="detail.DriverPhoto" title="logo" alt="" v-if="!onerror"/>
            </div>
          </flexbox-item>
          <flexbox-item :span="0.65">
            <p v-text="detail.DriverName"></p>
            <span class="w-star-yellow" v-for='x in detail.DriverStar'>★</span>
            <span class="w-star-gray" v-for=' x in 5-detail.DriverStar'>★</span>
          </flexbox-item>
        </flexbox>
      </flexbox-item>
      <flexbox-item>
        <flexbox>
          <flexbox-item>
            <p class="w-static-font">车牌号</p>
            <p class="pl-1">{{detail.CarPlateId}}</p>
          </flexbox-item>
          <flexbox-item>
            <flexbox-item>
              <p class="w-static-font">车型</p>
              <p class="pl-1">{{detail.CarModel}}</p>
            </flexbox-item>
          </flexbox-item>
        </flexbox>
      </flexbox-item>
      <flexbox-item>
        <flexbox>
          <flexbox-item>
            <p class="w-static-font">手机号码</p>
            <p class="pl-1">{{detail.DriverPhone}}</p>
          </flexbox-item>
        </flexbox>
      </flexbox-item>
    </flexbox>
    <!-- 2 -->
    <!-- 3 -->
    <flexbox class="w-detail" orient="vertical">
      <flexbox-item>
        <flexbox>
          <flexbox-item>
            <p class="w-static-font">订单号</p>
            <p class="pl-1">{{detail.OrderId}}</p> 
          </flexbox-item>
          <flexbox-item>
            <p class="w-static-font">下单时间</p>
            <p class="pl-1">{{new Date(+detail.CreateTime.slice(6,19)).Format('MM月dd日 hh:mm')}}</p>
          </flexbox-item>
        </flexbox>
      </flexbox-item>
      <flexbox-item v-if="detail.OrderType===1">
        <flexbox>
          <flexbox-item v-if="detail.ActualStartTime!==null">
            <p class="w-static-font">实际开始时间</p>
            <p class="pl-1">{{new Date(+detail.ActualStartTime.slice(6,19)).Format('MM月dd日 hh:mm')}}</p>
          </flexbox-item>
          <flexbox-item v-if="detail.ActualStartTime!==null">
            <p class="w-static-font">实际结束时间</p>
            <p class="pl-1">{{new Date(+detail.ActualEndTime.slice(6,19)).Format('MM月dd日 hh:mm')}}</p>
          </flexbox-item>
        </flexbox>
      </flexbox-item>
      <flexbox-item>
        <flexbox>
          <flexbox-item>
            <p class="w-static-font">订单状态</p>
            <p class="pl-1">{{STATUS[0][detail.OrderStatus]}}</p>
          </flexbox-item>
          <flexbox-item></flexbox-item>
        </flexbox>
      </flexbox-item>
    </flexbox>
    <!-- 3 -->
    <!-- 4 -->
    <flexbox class="w-detail">
      <flexbox-item >
        <flexbox orient="vertical">
          <flexbox-item>
            <p class="w-static-font">乘客</p>
            <p class="pl-1">{{detail.ActualUserName}}</p>
          </flexbox-item>
          <flexbox-item style="height:3rem">
            <p class="w-static-font">成本中心</p>
            <p class="pl-1">{{detail.CostCenterName}}</p>
          </flexbox-item>
        </flexbox>     
      </flexbox-item>
      <flexbox-item v-if="detail.OrderType===2">
        <flexbox orient="vertical">
          <flexbox-item>
            <p class="w-static-font">预约用车时间</p>
            <p class="pl-1">{{new Date(+detail.OrderTime.slice(6,19)).Format('MM月dd日 hh:mm')}}</p>
          </flexbox-item>
          <flexbox-item style="height:2.8rem;"></flexbox-item>
        </flexbox>
      </flexbox-item>
    </flexbox>
    <!-- 4 -->
    <!-- 5 -->
    <flexbox class="w-detail" orient="vertical" v-if="detail.ZCAdjustFees.length>0">
      <flexbox-item>
        <p class="w-static-font">费用明细</p>
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
    <!-- 5 -->
    <!-- 6 是否需要支付-->
    <flexbox class="w-detail" orient="vertical" v-if="detail.OrderStatus===30">
      <flexbox-item>
        <p>
          <span  class="w-static-font">预估总额：</span>
          <span class="color-red">¥ {{detail.CorpEstimateFee}}</span>
        </p>
      </flexbox-item>
    </flexbox>
    <!-- 7 取消订单 订单超时-->
    <flexbox v-if="disCancel.indexOf(detail.OrderStatus) === -1">
      <flexbox-item @click="CancelConfirm">
        <div class="pd-05">
          <x-button type="warn">取消订单</x-button>
        </div>
      </flexbox-item>
    </flexbox>
    <tmc show class='mt-1'></tmc>
    <!-- 7 -->
    <toast :show.sync="showToast" :time="500" type="text">取消成功</toast>
  </div>
  <air-pay :show.sync ='show' :pay-str = 'detail.PayString'></air-pay>
  <confirm title="" :show.sync="showConfirm" confirm-text="确定" cancel-text="取消"
  @on-confirm="CancelOrderTimely($route.params.id)">
    <p class="ta-c" v-if="detail.OrderStatus!==35&&detail.OrderStatus!==37">确认或取消订单</p>
    <p class="ta-c" v-else>需要5元空程费，确认或取消订单</p>
  </confirm> 
</div>
</template>
<script>
import {Flexbox, FlexboxItem, Group, Switch, XHeader, XButton, Cell, Dialog, Toast, Confirm} from 'vux-c'
// import EditPaycode from '../../../Public/EditPaycode'
import AirPay from '../../../Public/AirPay'
import Tmc from '../../../Public/TMC'
export default {
  components: {
    Flexbox,
    FlexboxItem,
    Group,
    Switch,
    XHeader,
    XButton,
    Cell,
    Dialog,
    AirPay,
    Toast,
    Confirm,
    Tmc
  },
  data () {
    return {
      show: false,
      showConfirm: false,
      page: {
        showLoading: true
      },
      showToast: false,
      isServerErr: false,
      userinfo: window.Miu.Data.UserInfo,
      STATUS: [window.Miu.Data.Taxi.DDStatus],
      /* 30: 已取消 39: 计费中 43: 待支付 45:结算中 50:等待付款/未全部支付 51:已支付 311: 订单超时 */
      disCancel: [30, 39, 43, 45, 50, 51, 311],
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
  props: {
    id: String,
    refresh: Boolean
  },
  watch: {
    '$route.params.id' (newVal, oldVal) {
      if (this.$route.name === 'car_detail') {
        this.CarOrderDetail()
      }
    }
  },
  methods: {
    reload () {
      window.location.reload()
    },
    isOrder () {
      if (this.$route.query.order) {
        window.sessionStorage.setItem('type', 'car')
      }
    },
    CancelConfirm () {
      this.showConfirm = true
    },
    /* 取消订单 */
    CancelOrderTimely (id) {
      this.$http.post(window.Miu.Data.ApiURL + '/TravelCar_1_0/CancelOrderTimely', {
        authTkn: window.Miu.Data.Token,
        zc_order_id: this.detail.SpecialId,
        tp_customer_phone: this.userinfo.Mobilephone,
        order_provider: 19,
        force: true
      }, {DisableLoading: true}).then(function (response) {
        if (response.data.errorMessage === null && response.data.errorCode === null) {
          const that = this
          window.sessionStorage.setItem('order', 'decel')
          that.showToast = true
          setTimeout(function () {
            window.history.back()
          }, 500)
        } else {
          this.$root.Toast(response.data.msg)
        }
      }, function (response) {
        console.log(response.data)
        this.$root.Toast(response.data)
      })
    },
    /* 获取订单详情 */
    CarOrderDetail () {
      this.$http({
        method: 'GET',
        url: window.Miu.Data.ApiURL + '/TravelCar_1_0/CarOrderDetail',
        params: {
          token: window.Miu.Data.Token,
          orderId: this.$route.params.id
        }
      }).then(function (response) {
        console.log(response.data)
        // this.page.showLoading = false
        if (response.data.errorMessage === null && response.data.errorCode === null) {
          this.detail = response.data.oldCarOrderList.Items[0]
          this.isServerErr = false
        } else if (response.data.errorMessage !== null && response.data.errorCode === '0') {
          this.isServerErr = true
        } else {
          console.log(response.data.errorMessage)
        }
      }, function (response) {
        console.log(response.data)
      })
    }
  }
}
</script>
<style lang="less">
  @import '../../../styles/user/my-order/myorder.less';
  .w-detail{
    background:#fff;
    margin-bottom:1rem;
    padding:1rem 0;
    border-bottom: 1px solid #ccc;
    // box-shadow: 0 1px 2px #666;
  }
  .w-nopadding {
    .weui_cell{
      padding:0 15px;
    }
  }
</style>