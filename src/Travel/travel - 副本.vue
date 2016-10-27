<template>
  <div v-if='showEmpty===true'>
    <none-info-bg type="travel">您目前暂无任何行程</none-info-bg>
  </div>
  <div v-if="showEmpty===false" class="w-travel" style="height:100%;background:#eee;padding:1rem;">
  <!-- 用车 -->
  <div class="pos-r" v-if="carArr[0].OrderId!==''">
    <flexbox v-link="'/user/order/carDetail/'+carArr[0].OrderId" orient="vertical" style="background:#fff;" class="mb-1" 
     >
      <flexbox-item class="w-travel-bg">
        <p class="mb-05 pl-1">
        {{new Date(+ carArr[0].OrderTime.slice(6,19)).Format('MM月dd日')}}
        </p>
        <p class="mb-05 pl-1 w-travelplace-d"><i class="iconfont icon-zuobiao"></i>&nbsp;{{carArr[0].StartAddr}}</p>
        <p class="pr-2 w-travelplace-a">{{carArr[0].DestAddr}}&nbsp;<i class="iconfont icon-zuobiao"></i></p>
      </flexbox-item>
      <flexbox-item>
        <cell :title="carArr[0].OrderId!==''">
          <span slot="after-title">&nbsp;{{carArr[0].CarPlateId}}</span>
          <span slot="value"><b style="color:#000;">预估:</b><b style="color:red;"> &yen;{{carArr[0].EstimateFee}}</b></span>
        </cell>
        <cell :title="carArr[0].DriverName" class="w-no-border">
          <span slot="after-title">&nbsp;{{carArr[0].DriverPhone}}</span>
        </cell>
      </flexbox-item>
    </flexbox>
    <a class="w-travel-tel pos-a" style="bottom:5px;right:10px;" :href="'tel:'+carArr[0].DriverPhone">联系司机</a>
  </div>  
  <!-- 飞机 -->
    <flexbox v-if="airArr.length>0" orient="vertical" style="background:#fff;" v-link="'/user/order/airDetail/'+airArr[0].ID">
      <flexbox-item class="w-travel-bg2">
         <p>{{new Date(+ airArr[0].Flts[0].TakeOffTime.slice(6,19)).Format('MM月dd日')}}</p>
        <flexbox>
          <flexbox-item :span="0.4">
            <div class="w-traveltime-d">
              <p>{{new Date(+ airArr[0].Flts[0].TakeOffTime.slice(6,19)).Format('hh:dd')}}</p>
              <p>{{airArr[0].Flts[0].DCityName}}{{airArr[0].Flts[0].DPortName}}</p>
            </div>
          </flexbox-item>
          <flexbox-item :span="0.2" class="w-air-padding">
            <i class="iconfont icon-icon_air w-travel-air"></i>
            <!-- <div style="height:2rem;"></div> -->
          </flexbox-item>
          <flexbox-item :span="0.4">
            <div class="w-traveltime-a">
              <p>{{new Date(+ airArr[0].Flts[0].ArrivalTime.slice(6,19)).Format('hh:dd')}}</p>
              <p>{{airArr[0].Flts[0].ACityName}}{{airArr[0].Flts[0].APortName}}</p>
            </div>
          </flexbox-item>
        </flexbox>
      </flexbox-item>
      <flexbox-item>
        <cell :title="airArr[0].Flts[0].AirLineName">
          <span slot="after-title">&nbsp;{{airArr[0].Flts[0].ClassName}}/{{airArr[0].Flts[0].Class}}</span>
          <!-- <span slot="value"><b style="color:#000;">预估:</b><b style="color:red;"> &yen;120</b></span> -->
        </cell>
        <cell title="乘客" class="w-no-border">
          <span slot="after-title">{{airArr[0].FltPassengers[0].PassengerName}}</span>
        </cell>
      </flexbox-item>
    </flexbox>
  </div>
</template>
<script>
import { Flexbox, FlexboxItem, Cell, Popup, Loading } from 'vux-c'
import FootNav from '../Public/FootNav'
// import AirOrderDetail from '../User/order/orderDetail/air-orderDetail'
// import CarOrderDetail from '../User/order/orderDetail/car-orderDetail'
import NoneInfoBg from '../Public/NoneInfoBg'
export default {
  components: {
    FootNav,
    Flexbox,
    FlexboxItem,
    Cell,
    Popup,
    // AirOrderDetail,
    // CarOrderDetail,
    Loading,
    NoneInfoBg
  },
  data () {
    return {
      userinfo: window.Miu.Data.UserInfo,
      popup: {
        showAir: false,
        showCar: false
      },
      carArr: [{
        'OrderId': '',
        'OrderTime': '',
        'StartAddr': '',
        'DestAddr': ''
      }],
      page: {
        showLoading: true
      },
      airArr: [],
      showEmpty: true,
      showtell: true,
      tels: '12345'
    }
  },
  ready () {
    this.NotTravelOrderList()
    console.log(this.carArr[0].OrderId)
  },
  methods: {
    NotTravelOrderList () {
      let that = this
      this.$http.post(window.Miu.Data.ApiURL + '/Common_1_0/NotTravelOrderList',
        {
          UID: this.userinfo.UID,
          CorpID: this.userinfo.CorpID,
          NotTravel: true,
          OrderByDesc: '',
          CreateTime: '',
          mobile: this.userinfo.Mobilephone,
          authTkn: window.Miu.Data.Token
        }
      ).then(function (response) {
        this.page.showLoading = false
        if (response.data.errorMessage === null && response.data.errorCode === null) {
          if (response.data.flight.Items.length > 0) {
            that.airArr = response.data.flight.Items
            that.showEmpty = false
          } else if (response.data.car.Items.length > 0) {
            that.carArr = response.data.car.Items
            that.showEmpty = false
          } else {
            that.showEmpty = true
          }
        }
        console.log(response.data)
      }, function (response) {
        console.log(response.data)
      })
    }
  }
}
</script>
<style lang="less">
  @import '../styles/travel/travel.less';
</style>