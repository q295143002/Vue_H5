<template>
  <!-- <div style="background:#eee;height:100%;width"> -->
    <div v-show='showEmpty===true'>
      <none-info-bg type="travel">您目前暂无任何行程</none-info-bg>
    </div>
    <div v-else style="padding:1rem;background:#eee;" :style="{'min-height':height +'px'}">
      <div v-show="carArr[0].OrderId!==''" v-for="item in carArr" class="pb-1">
        <carlist :list="item"></carlist>
      </div>
      <!-- 飞机 -->
      <div v-show="airArr[0].ID!==''" v-for="(index, airitem) in airArr" class="pb-1" 
      v-link="'/user/order/airDetail/'+airArr[index].ID">
        <airlist :list="airitem"></airlist>
      </div>
    </div>
  <!-- </div> -->
</template>
<script>
import { Flexbox, FlexboxItem, Cell, Popup, Loading } from 'vux-c'
import FootNav from '../Public/FootNav'
import NoneInfoBg from '../Public/NoneInfoBg'
import Airlist from './sub/airlist'
import Carlist from './sub/carlist'
export default {
  components: {
    FootNav,
    Flexbox,
    FlexboxItem,
    Cell,
    Popup,
    Airlist,
    Carlist,
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
      airArr: [{
        ID: '',
        Flts: [{
          ACityName: '',
          TakeOffTime: '',
          TakeOffTimeStr: '',
          ArrivalTime: ''
        }],
        FltPassengers: [{
          PassengerName: ''
        }]
      }],
      showEmpty: false,
      decel: '',
      count: 0
    }
  },
  ready () {
    this.NotTravelOrderList()
    this.session()
  },
  computed: {
    height () {
      let H = window.screen.height
      return H
    }
  },
  watch: {
    decel (newVal, oldVal) {
      if (newVal === 'decel') {
        this.countThree()
      }
    }
  },
  methods: {
    /* 如果状态改变两次刷新 */
    countThree () {
      var that = this
      if (that.count < 1) {
        that.count++
        console.log(that.count)
        window.setTimeout(function () {
          that.NotTravelOrderList()
          that.countThree()
        }, 3000)
      }
    },
    session () {
      let s = window.sessionStorage.getItem('order')
      if (s === 'decel') {
        this.decel = s
        window.sessionStorage.removeItem('order')
      }
    },
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
        if (response.data.errorMessage === null && response.data.errorCode === null) {
          let isEmpty = 0
          if (response.data.flight.Items.length > 0) {
            that.airArr = response.data.flight.Items
            isEmpty = 1
          }
          if (response.data.car.Items.length > 0) {
            that.carArr = response.data.car.Items
            isEmpty = 1
          }
          isEmpty === 0 ? this.showEmpty = true : this.showEmpty = false
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
  // @import '../styles/travel/travel.less';
</style>