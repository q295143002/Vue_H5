<template>
  <group v-if='Go.isActive === true'>
    <cell  title= '政策违规'class='vux-1px-t'>{{$route.params.flightway === "D"?"去程":"单程"}}</cell>
    <!-- 折扣 -->
    <div v-if='Go.RateRule.show === true' class='vux-1px-t'>
      <cell :inline-desc='Go.RateRule.text'></cell>
      <popup-picker  :title='"违规原因"' :data="Go.RateRule.data"    :value.sync='Go.RateRule.result'></popup-picker>
    </div>
    <!-- 预定时间 -->
    <div v-if='Go.PreBookRule.show === true' class='vux-1px-t'>
      <cell :inline-desc='Go.PreBookRule.text'></cell>
      <popup-picker  :title='"违规原因"' :data="Go.PreBookRule.data"  :value.sync='Go.PreBookRule.result'></popup-picker>
    </div>
    <!-- 最低价 -->
    <div v-if='Go.PriceRule.show === true' class='vux-1px-t'>
      <cell :inline-desc='Go.PriceRule.text'></cell>
      <popup-picker  :title='"违规原因"' :data="Go.PriceRule.data"   :value.sync='Go.PriceRule.result'></popup-picker>
    </div>
  </group>
  <group v-if='Back.isActive === true'>
    <cell  title= '政策违规'  class='vux-1px-t'>返程</cell>
    <!-- 折扣 -->
    <div v-if='Back.RateRule.show === true' class='vux-1px-t'>
      <cell :inline-desc='Back.RateRule.text'></cell>
      <popup-picker  :title='"违规原因"' :data="Back.RateRule.data"    :value.sync='Back.RateRule.result'></popup-picker>
    </div>
    <!-- 预定时间 -->
    <div v-if='Back.PreBookRule.show === true' class='vux-1px-t'>
      <cell :inline-desc='Back.PreBookRule.text'></cell>
      <popup-picker  :title='"违规原因"' :data="Back.PreBookRule.data"  :value.sync='Back.PreBookRule.result'></popup-picker>
    </div>
    <!-- 最低价 -->
    <div v-if='Back.PriceRule.show === true' class='vux-1px-t'>
      <cell :inline-desc='Back.PriceRule.text'></cell>
      <popup-picker  :title='"违规原因"' :data="Back.PriceRule.data"   :value.sync='Back.PriceRule.result'></popup-picker>
    </div>
  </group>
</template>
<script>
  import { Group, Cell, PopupPicker } from 'vux-c/'
  export default {
    components: {
      Group,
      Cell,
      PopupPicker
    },
    props: {
      PolicyData: Object
    },
    ready () {
      this.init()
    },
    data () {
      return {
        isOutOfLine: 0,
        AirPeople: JSON.parse(window.sessionStorage.getItem('AirPeople')),
        CorpPolicy: JSON.parse(window.sessionStorage.getItem('AirCorpPolicy')),
        AirInfo: JSON.parse(window.sessionStorage.getItem('AirOrder')),
        NeedFltRc: 'F',
        Go: {
          isActive: false,
          Info: {},
          /* 折扣 */
          RateRule: {
            show: false,
            text: '',
            result: [],
            data: [[]]
          },
          /* 预定时间 */
          PreBookRule: {
            show: false,
            text: '',
            result: [],
            data: [[]]
          },
          /* 最低价 */
          PriceRule: {
            show: false,
            text: '',
            result: [],
            data: [[]]
          }
        },
        Back: {
          isActive: false,
          Info: {},
          /* 折扣 */
          RateRule: {
            show: false,
            text: '',
            result: [],
            data: [[]]
          },
          /* 预定时间 */
          PreBookRule: {
            show: false,
            text: '',
            result: [],
            data: [[]]
          },
          /* 最低价 */
          PriceRule: {
            show: false,
            text: '',
            result: [],
            data: [[]]
          }
        }
      }
    },
    methods: {
      init () {
        if (this.CorpPolicy.IsNeedFltRC === 'T') {
          this.setOrderShow()
        }
      },
      setOrderShow () {
        switch (this.$route.params.flightway) {
          case 'S':
            this.Go.isActive = true
            this.Go.Info = this.AirInfo[0]
            this.setRule(this.Go)
            this.$parent.$refs.customer.$refs.approval.IsOutOfLine = this.isOutOfLine
            this.$parent.$refs.customer.setApprovalUnique(this.isOutOfLine)
            break
          case 'D':
            this.Go.isActive = true
            this.Back.isActive = true
            this.Go.Info = this.AirInfo[0]
            this.Back.Info = this.AirInfo[1]
            this.setRule(this.Go)
            this.setRule(this.Back)
            this.$parent.$refs.customer.$refs.approval.IsOutOfLine = this.isOutOfLine
            this.$parent.$refs.customer.setApprovalUnique(this.isOutOfLine)
            break
        }
      },
      setRule (obj) {
        this.setRateRule(obj)
        this.setPreBookRule(obj)
        this.setPriceRule(obj)
        if (obj.PreBookRule.show === false && obj.PriceRule.show === false && obj.RateRule.show === false) {
          obj.isActive = false
        } else {
          this.isOutOfLine = 1
        }
      },
      setRateRule (obj) {
        if (obj.Info.Rate > this.CorpPolicy.FltDiscountRC) {
          obj.RateRule.text = '您预定的航班折扣为' + obj.Info.Rate + '折，违反了' + this.CorpPolicy.PolicyName + '需预定' + this.CorpPolicy.FltDiscountRC + '折机票的规定，请选择原因：'
          for (let i = 0; i < this.CorpPolicy.FltRateReasonCodeN.length; i++) {
            obj.RateRule.data[0].push(this.CorpPolicy.FltRateReasonCodeN[i].ReasonCode)
          }
          obj.RateRule.show = true
          console.log('rate')
        }
      },
      setPreBookRule (obj) {
        let NowDate = new Date().getTime()
        let PreDate = new Date(obj.Info.TakeOffDate).getTime()
        let PreTime = Math.ceil((PreDate - NowDate) / (3600 * 1000 * 24))
        console.log(PreTime)
        if (PreTime < this.CorpPolicy.FltPreBookDays) {
          obj.PreBookRule.text = '您提前预定天数为' + PreTime + '天，违反了' + this.CorpPolicy.PolicyName + '须提前' + this.CorpPolicy.FltDiscountRC + '天预定的规定，请选择原因：'
          for (let i = 0; i < this.CorpPolicy.PreBookReasonCodeN.length; i++) {
            obj.PreBookRule.data[0].push(this.CorpPolicy.PreBookReasonCodeN[i].ReasonCode)
          }
          obj.PreBookRule.show = true
        }
      },
      setPriceRule (obj) {
        if (this.CorpPolicy.PreMinute > 0) {
          if (obj.Info.Price > obj.Info.LowPrice) {
            obj.PriceRule.text = '您预定的航班价格为' + obj.Info.Price + '元，违反了' + this.CorpPolicy.PolicyName + '须预定所选时段内最低价（' + obj.Info.LowPrice + '元）航班的规定，请选择原因：'
            for (let i = 0; i < this.CorpPolicy.FltPricelReasonCodeN.length; i++) {
              obj.PriceRule.data[0].push(this.CorpPolicy.FltPricelReasonCodeN[i].ReasonCode)
            }
            obj.PriceRule.show = true
          }
        }
      },
      getPolicyData () {
        this.PolicyData.PolicyID = this.CorpPolicy.PID.toString()
        this.PolicyData.PolicyUID = this.CorpPolicy.CorpID.toString()
        this.PolicyData.FirstRoute = {
          LargestPrice: this.AirInfo[0].Price,
          RCofPrice: this.AirInfo[0].LowPrice,
          IsLowestPrice: !this.Go.PriceRule.show,
          RCofDaysCode: this.Go.PreBookRule.show ? this.Go.PreBookRule.result[0] : '',
          RCofRateCode: this.Go.RateRule.show ? this.Go.RateRule.result[0] : '',
          RCofPriceCode: this.Go.PriceRule.show ? this.Go.PriceRule.result[0] : '',
          RCofDays: this.CorpPolicy.FltPreBookDays,
          RCofRate: this.CorpPolicy.FltDiscountRC
        }
        if (this.$route.params.flightway === 'D') {
          this.PolicyData.SecRoute = {
            LargestPrice: this.AirInfo[1].Price,
            RCofPrice: this.AirInfo[1].LowPrice,
            IsLowestPrice: !this.Back.PriceRule.show,
            RCofDaysCode: this.Back.PreBookRule.show ? this.Back.PreBookRule.result[0] : '',
            RCofRateCode: this.Back.RateRule.show ? this.Back.RateRule.result[0] : '',
            RCofPriceCode: this.Back.PriceRule.show ? this.Back.PriceRule.result[0] : '',
            RCofDays: this.CorpPolicy.FltPreBookDays,
            RCofRate: this.CorpPolicy.FltDiscountRC
          }
        }
        console.log(this.PolicyData)
      }
    }
  }
</script>