<template>
  <popup :show.sync='show' height='100%'>
    <div style="height: 130px;" class="bg-air-more-content color-white">
      <flexbox v-if='AirCheck.TakeOffTime' class='pt-2'>
        <flexbox-item class='ta-c' >
          <h2>{{AirCheck.TakeOffTime}}</h2>
          <small>{{AirCheck.DAirport.replace('机场','').replace('国际','')}}{{AirCheck.DPortBuilding}}</small>
        </flexbox-item>
        <flexbox-item class='ta-c'>
          <div>{{AirCheck.FlyTime}}</div>
          <div class="m-air-line white"></div>
        </flexbox-item>
        <flexbox-item class='ta-c'>
          <h2>{{AirCheck.ArriveTime}}</h2>
          <small v-if='AirCheck.AAirport'>{{AirCheck.AAirport.replace('机场','').replace('国际','')}}{{AirCheck.APortBuilding}}</small>
        </flexbox-item>
      </flexbox>
    </div>
    <div class="m-list-info of-s pos-a">
      <flexbox  v-for='more in airmore' class='pt-05 pb-05 vux-1px-t' track-by='$index'>
        <flexbox-item @click='getApplyChangeRule(more, true)' :span='4/12'>
          <div class="pl-05">
            <div>{{more.Class}}/{{more.SubClass}}</div><em class="fst-n fsz-08">退改签</em>
          </div>
        </flexbox-item>
        <flexbox-item class='ta-c' :span='2/12'>
          <div  v-if='more.AirType === 1'>
            <badge text="直减"></badge><br>
          </div>
          <small class='color-red'>{{more.Quantity>=10?'':'约剩'+more.Quantity+'张'}}</small>
        </flexbox-item>
        <flexbox-item class='ta-r' :span='2/12'>{{more.Rate>=10?'全价': more.Rate+'折'}}</flexbox-item>
        <flexbox-item  :span='3/12'>
          <x-button type='warn' class='w-90p' mini @click='checkPriceTicket(more)'>¥{{more.AdultPrice}}</x-button>
        </flexbox-item>
      </flexbox>
      <div v-if = 'ApplyChangeRule.RuleOneShow' class="fsz-08 vux-1px-t pd-05 color-gray-middle">
        <p><b>退票规定:</b> {{ApplyChangeRule.info.refund}}</p>
        <p><b>改期规定:</b> {{ApplyChangeRule.info.cDate}}</p>
        <p><b>转签规定:</b> {{ApplyChangeRule.info.transfer}}</p>
      </div>
      <div class="mt-1"></div>
    </div>
    <dialog :show.sync="ApplyChangeRule.show">
      <h3 class="pt-1 theme-color-blue">退改签</h3>
      <group class= 'ta-l'>
         <cell title= '退票规定' :inline-desc ='ApplyChangeRule.info.refund'></cell>
         <cell title= '改期规定' :inline-desc ='ApplyChangeRule.info.cDate'></cell>
         <cell title= '转签规定' :inline-desc ='ApplyChangeRule.info.transfer'></cell>
      </group>
    </dialog>
    <reserve-order :air-order.sync ='AirOrder' v-ref:reserveorder></reserve-order> <!-- 选择为谁订票 -->
  </popup>
</template>
<script>
import ReserveOrder from './content-show/reserve-order'
import { Popup, XHeader, Flexbox, FlexboxItem, XButton, Dialog, Cell, Group, Badge, Icon } from 'vux-c/'
export default {
  components: {
    Icon,
    Badge,
    Group,
    Cell,
    Dialog,
    XButton,
    Flexbox,
    FlexboxItem,
    Popup,
    XHeader,
    ReserveOrder
  },
  props: {
    OrderStep: Number,
    show: Boolean,
    airmore: Array,
    airport: Array,
    AirCheck: Object
  },
  ready () {
    this.setAirOrder()
    this.getAirCraftType()
  },
  data () {
    return {
      ForWorkPolicyInfo: '',
      ApplyChangeRule: {
        RuleOneShow: false,
        show: false,
        info: {}
      }, // 当前航班退改签规则
      OrderCheck: {}, // 下单选中的航班
      AirCraftType: [], // 航司名称
      AirOrder: [],
      From: 0 // 0:为自己预定  1:为他人预定
    }
  },
  methods: {
    /* 订单预设 */
    setAirOrder () {
      if (window.sessionStorage.getItem('AirOrder')) {
        this.AirOrder = JSON.parse(window.sessionStorage.getItem('AirOrder'))
      } else {
        window.sessionStorage.setItem('AirOrder', '[]')
        this.setAirOrder()
      }
    },
    SetRuleOne (item) {
      this.ApplyChangeRule.RuleOneShow = false
      console.log(item.length)
      if (item.length === 1) {
        this.ApplyChangeRule.RuleOneShow = true
        this.getApplyChangeRule(item[0])
      }
    },
    /* 验证P价 */
    vailCheckPrice (res) {
      console.log(res)
      if (!res.IsVIBE) {
        // IsVIBE = false => success
        console.log(1)
        this.vailSuccess()
        return
      }
      if ((!res.ComparePrice) || res.NoBook) {
        // comparePrice: false ||noBook: true  => false
        console.log(2)
        this.getMoreReview()
        return
      }
      if (res.LowPrice) {
        // lowPrice = > true
        console.log(3)
        this.getMoreReview()
        return
      }
      this.vailSuccess()
    },
    vailSuccess () {
      console.log('p价成功')
      this.OrderCheck.LowPrice = this.AirCheck.LowPrice
      this.AirOrder[+this.$route.params.Page] = this.OrderCheck
      window.sessionStorage.setItem('AirOrder', JSON.stringify(this.AirOrder))
      if (this.$route.params.FlightWay === 'D' && this.$route.params.Page === '0') {
        this.show = false
        this.$route.params.CacheDateTo = this.$route.params.DepartDateTo
        this.$route.params.CacheDateBack = this.setBackDate()
        this.$router.replace(
          '/air/search' +
          '/' + this.$route.params.ArriveCity +
          '/' + this.$route.params.DepartCity +
          '/D/' + this.$route.params.CacheDateBack +
          '/' + this.$route.params.CacheDateTo +
          '/' + this.$route.params.CacheDateBack +
          '/1/0')
      } else {
        /* 选择为谁出行 */
        this.$refs.reserveorder.open()
      }
    },
    /* 设置*/
    setBackDate () {
      if (new Date(this.$route.params.CacheDateBack.replace('-', '/')).getTime() <= (new Date(this.$route.params.DepartDateTo.replace('-', '/')).getTime() + 24 * 1000 * 3600)) {
        return new Date(new Date(this.$route.params.DepartDateTo.replace('-', '/')).getTime() + 24 * 1000 * 3600).Format('yyyy-MM-dd')
      } else {
        return this.$route.params.CacheDateBack
      }
    },
    /* 刷新票数*/
    getMoreReview () {
      this.$http.post(window.Miu.Data.ApiURL + '/Flight_1_0/GetMoreFlightList', JSON.parse(window.sessionStorage.getItem('MoreData'))).then(function (response) {
        this.airmore = response.data.flights
        if (this.AirCheck.Price === this.AirMore[0].Price) {
          if (this.AirCheck.AirType === 1 && this.AirMore[0].AirType === 0) {
            this.AirMore[0] = this.AirCheck
          }
        } else {
          this.AirMore.unshift(this.AirCheck)
        }
        this.$root.Toast('下单失败，请重试')
      },
      function (response) {
        console.log(response)
      })
    },
    /* P价处理 */
    checkPriceTicket (item) {
      this.OrderCheck = item
      console.log(JSON.stringify(item))
      this.$http.post(window.Miu.Data.ApiURL + '/Flight_1_0/CanSellPriceTicket', {
        authTkn: window.Miu.Data.Token,
        miutripGuid: item.MiutripGuid,
        flight: item.Flight,
        subClass: item.SubClass,
        airport: item.DPortCode + item.APortCode,
        departDate: item.TakeOffDate
      }).then(function (response) {
        this.vailCheckPrice(response.data.priceRes)
      },
      function (response) {
        console.log(response)
      })
    },
    getAirCraftType () {
      this.$http(
        window.Miu.Data.Store + '/AirCraftType.js'
      ).then(function (response) {
        this.AirCraftType = response.data
      },
      function (response) {
        /* window.alert('error') */
        console.log(response)
      })
    },
    getApplyChangeRule (item, bool) {
      this.$http.post(window.Miu.Data.ApiURL + '/Flight_1_0/getApiChangeRule', {
        authTkn: window.Miu.Data.Token,
        guid: item.MiutripGuid,
        fNo: item.Flight,
        pType: 0,
        ServerFrom: '',
        room: item.SubClass,
        oTAType: item.OTAType,
        corpId: window.Miu.Data.UserInfo.CorpID,
        dstAirportCode: item.APortCode,
        orgAirportCode: item.DPortCode,
        flightDate: item.TakeOffDate
      }).then(function (response) {
        this.ApplyChangeRule.info = response.data.rule
        if (bool) {
          this.ApplyChangeRule.show = true
        }
      },
      function (response) {
        /* window.alert('error') */
        console.log(response)
      })
    }
  }
}
</script>

<style lang="less">
.bg-air-more-content {
  background: url(~assets/air-reserve-bg.png) center top no-repeat;
  background-size: cover;
}
.m-list-info{
  width: 100%;
  top:130px;
  bottom:0px;
  .w-90p{
    width: 90%;
  }
}
.m-reserveorder{
  .vux-label-desc {
    font-size:  0.6rem
  }
}
.vux-close {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  width: 24px;
  height: 24px;
  overflow: hidden;
  color: #ccc;
  &::before,
  &::after {
    content: '';
    position: absolute;
    height: 1px;
    width: 100%;
    top: 50%;
    left: 0;
    background: #98979d;
  }
  &::before {
    transform: rotate(45deg);
  }
  &::after {
    transform: rotate(-45deg);
  }
}
</style>
