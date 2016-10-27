<template>
<div class='bg-gray of-h ' v-show = 'readyInit'>
  <!-- 航班详情 -->
  <info 
    v-ref:info 
    :info-data.sync = 'InfoData'
    ></info>

  <!-- 差旅政策 -->
  <corp-policy
    v-ref:policy
    :policy-data.sync = 'PolicyData' 
    ></corp-policy>

  <!-- 登机人 -->
  <customer 
    v-ref:customer
    :customer-data.sync='CustomerData'
    :approval-data.sync='ApprovalData'
    ></customer>

  <!-- 保险 -->
  <insurance 
    v-ref:insurance 
    :insurance-data.sync ='InsuranceData'
    :insurance-fee.sync = 'InsuranceFee'
    ></insurance>

  <!-- 联系人 -->
  <contact  
    v-ref:contact 
    :contact-data.sync = 'ContactData'
    ></contact>

  <!-- 配送信息 -->
  <delivery 
    v-ref:delivery
    :delivery-data.sync = 'DeliveryData'
    ></delivery>

  <!-- 出行目的 -->
  <travel-reason 
    v-ref:travelreason
    :travel-reason-data.sync='TravelReasonData' 
    ></travel-reason>
  <group>
    <x-input title='附加信息' :value.sync = 'Addition' placeholder='请输入附加信息'  :required= 'InputRequired'></x-input>
    <cell title='服务费'><span class="color-red"><small>¥</small> {{ServerFee}}</span><small>/人</small></cell>
    <cell title='订单总额'>
      <span class="color-red">
        <small>¥</small> {{PayFee}}
      </span>
    </cell>
  </group>
  <article class="pd-1">
    <x-button type='primary'  @click ='getResult'>{{ApprovalText?'提交审批':'提交订单'}}</x-button>
  </article>
  <tmc show class='mt-1'></tmc>
</div>
<toast type = 'text' :show.sync='Toast.show'>{{Toast.text}}</toast>
</template>
<script>
import { Popup, Flexbox, FlexboxItem, PopupPicker, Group, XInput, Cell, XButton, Icon, Toast } from 'vux-c/'
import contact from './reserve/contact'
import delivery from './reserve/delivery'
import CorpPolicy from './reserve/corp-policy'
import Info from './reserve/info'
import Customer from './reserve/customer'
import TravelReason from './reserve/travel-reason'
import Insurance from './reserve/Insurance'
import Tmc from '../Public/TMC'
export default {
  components: {
    Tmc,
    Toast,
    Insurance,
    TravelReason,
    Info,
    CorpPolicy,
    Popup,
    XButton,
    Cell,
    XInput,
    Group,
    Icon,
    PopupPicker,
    Flexbox,
    FlexboxItem,
    contact,
    delivery,
    Customer
  },
  init () {
    if (window.sessionStorage.getItem('AirHistoryIndex') && window.sessionStorage.getItem('AirHistorySuccess')) {
      window.history.go(window.sessionStorage.getItem('AirHistoryIndex') - window.sessionStorage.getItem('AirHistorySuccess') + 1)
    }
  },
  data () {
    return {
      readyInit: false,
      Addition: '',  // 附加描述
      ListLen: 1,
      InputRequired: false,
      AirPeople: JSON.parse(window.sessionStorage.getItem('AirPeople')),
      AirOrder: JSON.parse(window.sessionStorage.getItem('AirOrder')),
      InsuranceFee: 0,
      ServerFee: 0,
      PayFee: 0,
      InfoData: {},
      ContactData: [],
      CustomerData: [],
      ApprovalData: {},
      DeliveryData: {},
      TravelReasonData: {},
      PolicyData: {},
      CorpPolicy: {},
      InsuranceData: {},
      Result: {},
      Toast: {
        show: false,
        text: ''
      },
      ApprovalText: false,
      /* 数据最终验证 */
      vail: true
    }
  },
  ready () {
    console.log()
    this.$router.replace('/air/reserve/' + this.$route.params.flightway + '/' + this.$route.params.from + '/index')
    this.readyInit = true
  },
  watch: {
    '$route.params.open' () {
      window.Miu.SetTitle(this.$route.name)
      this.$refs.contact.addContact.show = false
      this.$refs.delivery.Address.show = false
      this.$refs.customer.$refs.list.$refs.listitem.ItemShow = false
      switch (this.$route.params.open) {
        case 'contact': this.$refs.contact.addContact.show = true
          window.Miu.SetTitle('选择联系人')
          break
        case 'delivery': this.$refs.delivery.Address.show = true
          window.Miu.SetTitle('选择配送地址')
          break
        case 'customer': this.$refs.customer.$refs.list.$refs.listitem.ItemShow = true
          window.Miu.SetTitle('修改登机人')
          break
      }
    },
    'List' () {
      this.setFee()
    }
  },
  methods: {
    pageRoute (Route) {
      let to = (obj) => {
        this.$router.go('/air/reserve/' + this.$route.params.flightway + '/' + this.$route.params.from + obj)
      }
      switch (Route) {
        case 'Customer': to('/customer')
          break
        case 'Contact': to('/contact')
          break
        case 'Delivery': to('/delivery')
          break
        default: if (this.$refs.contact.addContact.show || this.$refs.delivery.Address.show || this.$refs.customer.$refs.list.$refs.listitem.ItemShow) {
          window.history.back()
        }
      }
    },
    ToastText (text) {
      this.Toast = {
        show: true,
        text: text
      }
      this.vail = false
    },
    setFee () {
      var setPersonFee = (len) => {
        let PersonFee = 0
        let ServerFee = 0
        for (var i = 0; i < len; i++) {
          PersonFee = PersonFee + this.AirOrder[i].Price + +this.AirOrder[i].ServerFee + this.AirOrder[i].AdultOilFee + this.AirOrder[i].AdultTax + this.InsuranceFee
          ServerFee = ServerFee + +this.AirOrder[i].ServerFee
        }
        this.ServerFee = ServerFee
        return PersonFee
      }
      switch (this.$route.params.flightway) {
        case 'S': this.PayFee = setPersonFee(1) * this.AirPeople.length
          break
        case 'D': this.PayFee = setPersonFee(2) * this.AirPeople.length
          break
      }
    },
    getCorpPolicy (id) {
      this.$http({
        method: 'GET',
        url: window.Miu.Data.ApiURL + '/User_1_0/GetCorpPolicy',
        params: {
          token: window.Miu.Data.Token,
          policyId: id
        }
      }).then(function (response) {
        this.CorpPolicy = response.data
        this.setCorpPolicy()
      })
    },
    setCorpPolicy () {
      this.$refs.policy.setCorpPolicy(this.CorpPolicy)
    },
    getResult () {
      this.vail = true
      this.$refs.customer.getCustomerData()
      this.$refs.customer.getApprovalData()
      this.$refs.info.getInfoData()
      this.$refs.contact.getContactData()
      this.$refs.delivery.getDeliveryData()
      this.$refs.travelreason.getTravelReasonData()
      this.$refs.insurance.getInsuranceData()
      this.$refs.policy.getPolicyData()
      this.vailInput()
    },
    vailInput () {
      var that = this
      function vailLen (str, num, toast) {
        if (str.length > num) {
          that.$root.Toast(`${toast}超过字数限制`)
          return false
        } else {
          return true
        }
      }
      function vailLenChs (str, num, toast) {
        let len = 0
        for (var i = 0; i < str.length; i++) {
          let a = str.charCodeAt(i)
          if (a >= 0 && a <= 128) {
            len += 2
          } else {
            len += 1
          }
        }
        if (len > num) {
          that.$root.Toast(`${toast}超过字数限制`)
          return false
        } else {
          return true
        }
      }
      let remark1 = vailLen(this.TravelReasonData.MoreRemark.MoreRemarkOne, 24, this.TravelReasonData.MoreRemark.NoteTooLTipOne)
      let remark2 = vailLen(this.TravelReasonData.MoreRemark.MoreRemarkTwo, 24, this.TravelReasonData.MoreRemark.NoteTooLTipTwo)
      let remark3 = vailLen(this.TravelReasonData.MoreRemark.MoreRemarkThree, 24, this.TravelReasonData.MoreRemark.NoteTooLTipThree)
      let oa = vailLenChs(this.TravelReasonData.OATravelApplyOrder, 50, 'OA出差申请单')
      let reason = vailLenChs(this.TravelReasonData.TravelReasonRemark, 200, '出行目的')
      let Addition = vailLen(this.Addition, 100, '附加信息')
      if (remark1 && remark2 && remark3 && oa && reason && Addition) {
        this.vailResult()
      }
    },
    vailResult () {
      if (this.vail) {
        console.log('开始下单')
        this.setResult()
      } else {
        console.log('无法下单')
      }
    },
    setResult () {
      console.log('setResult')
      function extend (destination, source) {
        for (var property in source) {
          destination[property] = source[property]
        }
        return destination
      }
      this.Result = {
        ApprovalCostID: this.ApprovalData.Success ? this.ApprovalData.costCenterId : 0,
        CostCenterType: this.ApprovalData.costCenterType,
        OrderType: 3,
        CorpID: window.Miu.Data.UserInfo.CorpID,
        CostCenterId: this.ApprovalData.costCenterId,
        UID: window.Miu.Data.UserInfo.UID,
        PayType: '第三方支付',
        IsApproval: this.ApprovalData.Success,
        MailCode: 0,
        FeeType: 'PUB', // 因公：'PUB', 因私：'OWN'
        PassengerQuantity: this.CustomerData.length,
        PassengerType: 'ADU',
        SearchType: this.$route.params.flightway,
        Passengers: this.CustomerData,
        DeliveryType: this.DeliveryData,
        Contacts: this.ContactData,
        BoardingCheck: '0',
        PolicyUID: window.Miu.Data.UserInfo.UID,
        PolicyID: +this.PolicyData.PolicyID,
        BookingType: this.$route.params.from,
        DepartDate1: this.InfoData.DepartDate1,
        DepartCity1: this.InfoData.DepartCity1,
        ArriveCity1: this.InfoData.ArriveCity1,
        DepartDate2: this.InfoData.DepartDate2,
        DepartCity2: this.InfoData.DepartCity2,
        ArriveCity2: this.InfoData.ArriveCity2,
        FirstRoute: extend(this.InfoData.FirstRoute, this.PolicyData.FirstRoute),
        SecRoute: extend(this.InfoData.SecRoute, this.PolicyData.SecRoute),
        MoreRemarkOne: this.TravelReasonData.MoreRemark.MoreRemarkOne,
        MoreRemarkTwo: this.TravelReasonData.MoreRemark.MoreRemarkTwo,
        MoreRemarkThree: this.TravelReasonData.MoreRemark.MoreRemarkThree,
        NoteTooLTipOne: this.TravelReasonData.MoreRemark.NoteTooLTipOne,
        NoteTooLTipTwo: this.TravelReasonData.MoreRemark.NoteTooLTipTwo,
        NoteTooLTipThree: this.TravelReasonData.MoreRemark.NoteTooLTipThree,
        OATravelApplyOrder: this.TravelReasonData.OATravelApplyOrder,
        TravelReasonCode: this.TravelReasonData.TravelReason,
        TravelReasonRemark: this.TravelReasonData.TravelReasonRemark,
        ApprovalCustomers: this.ApprovalData.Tag,
        Addition: this.Addition,
        authTkn: window.Miu.Data.Token
      }
      if (this.InsuranceData.RouteIndex) {
        for (let i = 0; i < this.Result.Passengers.length; i++) {
          this.Result.Passengers[i].OrderInsurances[0] = {
            InsuranceType: this.InsuranceData.InsurancePId,
            InsuranceNum: this.InsuranceData.InsuranceNumber,
            InsuranceUnitPrice: this.InsuranceData.InsOnePrice,
            RouteIndex: this.InsuranceData.RouteIndex
          }
        }
      }
      this.submitAirOrder()
    },
    submitAirOrder () {
      console.log(JSON.stringify(this.Result))
      console.log(JSON.stringify(this.ApprovalData))
      console.log(this.Result.ApprovalCostID)
      this.$http.post(window.Miu.Data.ApiURL + '/Flight_1_0/SaveOnlineOrder', this.Result).then(function (response) {
        if (response.data.IsSuccess) {
          window.sessionStorage.setItem('AirOnlineOrder', JSON.stringify(response.data))
          this.$router.go('/air/success')
        }
      }, function (response) {
        if (!response.status === 408) {
          this.$root.Toast('订单提交失败:' + response.data.errorMessage)
          console.log(response)
        }
      })
    }
  }
}

</script>
<style>
  .m-add:before{
    color: green;
    transform:rotate(45deg);
    -ms-transform:rotate(45deg);   /* IE 9 */
    -moz-transform:rotate(45deg);  /* Firefox */
    -webkit-transform:rotate(45deg); /* Safari 和 Chrome */
    -o-transform:rotate(45deg);  /* Opera */
  }
  .bg-gray{
    background: #cbcbcb;
  }
</style>
<!-- 
OATravelApplyOrder=出差申请单
MoreRemarkTwo=备注
Addition=附加信息
TravelReasonRemar=出行目的

MoreRemarkTwo  24,
TravelReasonRemark 200,
Note 1000,
OATravelApplyOrder 50
MoreRemarkTwo   Addition 长度不超过该数字，无论是数字还是字母还是汉字，都可以输入这个长度；其他的两个是一个汉字算2个字符，也即是当前数字折半 -->