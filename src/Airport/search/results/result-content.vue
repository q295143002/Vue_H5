<template>
<div v-el:content style="position:absolute; top:56px; bottom:49px;width:100%;" class="of-y-s">
  <div v-if = 'airlist[0] === "errresult"' class="vux-center" style="height:100%" >
      <div class="ta-c"><icon type="cancel" class='icon_big icon_color_blue'></icon><br>出现错误<br>请重试<br>
      <x-button type='primary' mini @click = '$parent.getFlights()'>重新加载</x-button>
      </div>
  </div>
  <div v-else style="height:100%">
    <div class="vux-center" 
      v-if='airlist[0] === "noresult"'
      style="height:100%" 
    >
      <div class="ta-c">
        <icon type="info_circle" class='icon_big icon_color_blue'></icon>
        <br>暂未找到符合条件的航班
        <br>请修改搜索条件重新搜索
      </div>
    </div>
    <flexbox 
      v-else
      class="vux-1px-b pt-05 pb-05"
      :gutter='0' 
      v-for = 'air in airlist|orderBy "StandardPrice" sortkey|filterBy filterobj.company in "AirlineCode"' 
      trackby=$index  
      @click='priceCheck(air, $index)' >
      <flexbox-item :span='3/12' class='ta-c'>
        <h2 style="line-height:2rem">{{air.TakeOffTime}}</h2>
        <small  class="color-gray-middle fw-b">{{air.DAirport.replace('机场','').replace('国际','')}}{{air.DPortBuilding}}</small>
      </flexbox-item>
      <flexbox-item :span='5/24' class='ta-c color-gray-middle'>
        <small class="fsz-08">{{air.FlyTime}}</small>
        <div class="m-air-line"></div>
        <div class="fsz-05">&nbsp;</div>
      </flexbox-item>
      <flexbox-item :span='3/12' class='ta-c'>
        <h2 style="line-height:2rem">{{air.ArriveTime}}</h2>
        <small  class="color-gray-middle fw-b">{{air.AAirport.replace('机场','').replace('国际','')}}{{air.APortBuilding}}</small>
      </flexbox-item>
      <flexbox-item :span='7/24' class='ta-r'>
        <div class = "pr-1 fsz-08">
          <div>{{air.CompanyName}}<small>{{air.AirShortName}}{{air.Flight}}</small></div>
          <div class="color-red"><span>¥ </span><span style='line-height:1.5rem' class='fw-b fsz-1_5'>{{air.AdultPrice}}</span></div>
        </div>
      </flexbox-item>
    </flexbox>
  </div>
</div>
<confirm :show.sync="Confirm.show" title="预定提示" @on-confirm="setAirMore" confirm-text='确定' cancel-text='取消' v-ref:confirm>
  <p style="text-align:center;">{{Confirm.value}}</p>
</confirm>
<toast :show.sync = 'Toast.show' type='text'>{{Toast.value}}</toast>
<content-show 
v-ref:content-show
:show.sync ='pop' 
:airmore.sync='AirMore' 
:airport.sync='Airport' 
:air-check = 'AirCheck' 
:order-step.sync='OrderStep'
></content-show>
</template>
<script>
  import ContentShow from './content-show'
  import { Cell, Flexbox, FlexboxItem, Scroller, Confirm, Toast, Icon, XButton } from 'vux-c/'
  export default {
    components: {
      XButton,
      Toast,
      Confirm,
      Scroller,
      ContentShow,
      Cell,
      Flexbox,
      FlexboxItem,
      Icon
    },
    props: {
      OrderStep: Number,
      filterobj: Object,
      orderobj: Number,
      airlist: Array,
      PassWay: Object,
      AirCompany: Array
    },
    watch: {
      '$route.params.Show' () {
        console.log(this.pop)
        switch (this.$route.params.Show) {
          case '0': this.pop = false
            this.$parent.setMainTitle()
            break
          case '1': this.pop = true
            this.$parent.setSubTitle()
            break
        }
      },
      'orderobj': function () {
        switch (this.orderobj) {
          /* 起飞时间 */
          case 0: this.orderByTime()
            break
          /* 价格降序 */
          case 1: this.orderByCost(-1)
            break
          /* 价格升序 */
          case 2: this.orderByCost(1)
            break
          /* 飞行时长 */
          case 3: this.orderByFlyTime()
            break
          default: break
        }
      }
    },
    data () {
      return {
        CorpPolicy: {},
        sortkey: 1,
        pop: false,
        Airport: [],
        AirCheck: {},
        AirMore: [],
        Confirm: {
          show: false,
          value: ''
        },
        Toast: {
          show: false,
          value: ''
        }
      }
    },
    ready () {
      this.getCorpPolicy()
    },
    methods: {
      getCorpPolicy () {
        this.$http({
          method: 'GET',
          url: window.Miu.Data.ApiURL + '/User_1_0/GetCorpPolicy',
          params: {
            token: window.Miu.Data.Token,
            policyId: window.Miu.Data.UserInfo.PolicyID
          }
        }).then(function (response) {
          this.CorpPolicy = response.data
        })
      },
      priceCheck (item, index) {
        this.AirCheck = item
        this.AirCheckIndex = index
        let TimeArea = new Date(this.AirCheck.TakeOffDate.replace(/-/g, '/') + ' ' + this.AirCheck.TakeOffTime).getTime()
        let PriceList = []
        for (let i = 0; i < this.airlist.length; i++) {
          let TimeRender = new Date(this.airlist[i].TakeOffDate.replace(/-/g, '/') + ' ' + this.airlist[i].TakeOffTime).getTime()
          if (TimeRender >= TimeArea - (1000 * 60 * 60) && TimeRender <= TimeArea + (1000 * 60 * 60)) {
            PriceList.push(this.airlist[i].Price)
          }
        }
        let LowPrice = PriceList[0]
        for (var i = 1; i < PriceList.length; i++) {
          if (PriceList[i] < LowPrice) {
            LowPrice = PriceList[i]
          }
        }
        this.AirCheck.LowPrice = LowPrice
        this.AirCheck.LowestPrice = LowPrice
        this.setPolicy(LowPrice, TimeArea)
      },
      setPolicy (LowPrice, Time) {
        /* 价格判定 */
        if (LowPrice < this.AirCheck.Price) {
          /* 是否允许违规预定 */
          this.Confirm.show = true
          this.Confirm.value = `您当前选择的航班的价格为 ${this.AirCheck.Price}元，在此时段内(${new Date(Time - 1000 * 60 * 60).Format('hh:mm')} - ${new Date(Time + 1000 * 60 * 60).Format('hh:mm')})的最低价航班为${LowPrice}元,是否确定当前选择？`
        } else {
          this.setAirMore()
        }
      },
      setAirMore () {
        let MoreData = {
          authTkn: window.Miu.Data.Token,
          Airline: '',
          DepartCity: this.$route.params.DepartCity,
          ArriveCity: this.$route.params.ArriveCity,
          DepartDate: this.$route.params.DepartDateTo,
          ClassNo: '',
          FlightWay: this.$route.params.FlightWay,
          Flight: this.AirCheck.Flight,
          ArriveTime: this.AirCheck.ArriveTime,
          ArriveDate: this.AirCheck.ArriveDate
        }
        this.AirMore = []
        this.$http.post(window.Miu.Data.ApiURL + '/Flight_1_0/GetMoreFlightList', MoreData).then(function (response) {
          if (response.data.flights.length > 0) {
            window.sessionStorage.setItem('MoreData', JSON.stringify(MoreData))
            this.$router.go('/air/search' +
              '/' + this.$route.params.DepartCity +
              '/' + this.$route.params.ArriveCity +
              '/' + this.$route.params.FlightWay +
              '/' + this.$route.params.DepartDateTo +
              '/' + this.$route.params.CacheDateTo +
              '/' + this.$route.params.CacheDateBack +
              '/' + this.$route.params.Page +
              '/1'
            )
            this.AirMore = response.data.flights
            if (this.AirCheck.Price === this.AirMore[0].Price) {
              if (this.AirCheck.AirType === 1 && this.AirMore[0].AirType === 0) {
                this.AirMore[0] = this.AirCheck
              }
            } else {
              this.AirMore.unshift(this.AirCheck)
            }
          } else {
            this.$root.Toast('该时段航班已无舱位，请选择其他时段航班')
            this.airlist.splice(this.AirCheckIndex, 1)
          }
          this.$refs.contentShow.SetRuleOne(this.AirMore)
        },
        function (response) {
          this.$root.Toast('该时段航班已无舱位，请选择其他时段航班')
          this.airlist.splice(this.AirCheckIndex, 1)
        })
      },
      /* -- 内容排序 -- */
      orderByTime () {
        for (var i in this.airlist) {
          this.airlist[i].StandardPrice = this.airlist[i].TakeOffTime
        }
        this.sortkey = 1
      },
      orderByFlyTime () {
        for (var i in this.airlist) {
          this.airlist[i].StandardPrice = this.airlist[i].FlyTime
        }
        this.sortkey = 1
      },
      orderByCost (stk) {
        for (var i in this.airlist) {
          this.airlist[i].StandardPrice = this.airlist[i].Price
        }
        this.sortkey = stk
      }
    }
  }
</script>
<style lang='less'>
  .m-air-line{
    width:90%;
    margin:0 auto;
    background: #666;
    position: relative;
    height: 1px;
    &:after{
      content:'';
      position: absolute; left: -1px;
      width: 3px;
      height: 3px;
      background: #fff;
      border-radius: 50%;
      top:-2px;
      border: 1px solid #333;
    }
    &:before{
      content:'';
      position: absolute; right: -1px;
      width: 3px;
      height: 3px;
      background: #fff;
      border-radius: 50%;
      top:-2px;
      border: 1px solid #333;
    }
    &.white {
      background: #fff;
      &:after,&:before{
        border: 1px solid #fff;
      }
    }
  }
</style>