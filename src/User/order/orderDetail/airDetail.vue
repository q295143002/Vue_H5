<template>
  <div class="bgc-gray-light" style="width:100%;overflow:hidden;">
    <!-- head -->
    <flexbox orient="vertical" class="airDetail-top">
      <flexbox-item class="pb-1 pl-2 air_bs-b">
        <span class="fsz-1_5">{{new Date(+airdetail[0].Flts[0].TakeOffTime.slice(6,19)).Format('MM月dd日')}}</span>
      </flexbox-item>
      <flexbox-item class="pb-1">
        <!-- time --> 
        <ul class="top_time">
          <li>
            <p class="fsz-2">{{airdetail[0].Flts[0].TakeOffTimeStr.substr(11,7)}}</p>
            <p>{{airdetail[0].Flts[0].DCityName}}{{airdetail[0].Flts[0].DPortName}} {{airdetail[0].Flts[0].DepartAirportBuilding}}</p></li>
          <li><i class='iconfont icon-air fsz-2'></i></li>
          <li>
            <p class="fsz-2">{{airdetail[0].Flts[0].ArrivalTimeeStr.substr(11,7)}}</p>
            <p>{{airdetail[0].Flts[0].ACityName}}{{airdetail[0].Flts[0].APortName}} {{airdetail[0].Flts[0].ArriveAirportBuilding}}</p></li>
        </ul>
      </flexbox-item>
    </flexbox>
    <!-- body -->
    <!-- 1 机票信息-->
    <flexbox orient="vertical" class="bg-white pd-1 air_bs-b">
      <flexbox-item>
        <ul class="airDetail_body_list">
          <li>
            <p>{{airdetail[0].Flts[0].AirLineName}}</p>
            <p>{{airdetail[0].Flts[0].Flight}}</p></li>
          <li>
            <p>{{airdetail[0].Flts[0].ClassName}}/{{airdetail[0].Flts[0].SubClass}} <span class='w-airOrder-grayColor'>{{airdetail[0].Flts[0].PriceRate}}折</p>
            <p class="color-red"><b>¥{{airdetail[0].Flts[0].Price}}</b></p></li>
        </ul>
      </flexbox-item>
      <flexbox-item>
        <ul class="airDetail_body_list">
          <li v-show="airdetail[0].Tax>0">
            <p>机建</p>
            <p class='color-red'><b>¥{{airdetail[0].Tax}}</b></p></li>
          <li v-show="airdetail[0].ServerFee>0">
            <p>服务费</p>
            <p><b class='color-red'>¥{{airdetail[0].ServerFee}}</b></p>
          </li>
        </ul>
      </flexbox-item>
      <flexbox-item>
        <ul class="airDetail_body_list">
          <li v-if="airdetail[0].InsuranceFee>0">
            <p>保险费</p>
            <p class='color-red'>
            <b>¥{{airdetail[0].InsuranceFee}}</b></p>
          </li>
          <li>
            <p>订单总额</p>
            <p class='color-red' v-show="airdetail[0].Amount">
              <b>¥{{airdetail[0].Amount}}</b></p>
          </li>
        </ul>
      </flexbox-item>
      <flexbox-item>
        <p>退改签</p>
        <span>{{airdetail[0].Flts[0].Refund}}</span>
        <span>{{airdetail[0].Flts[0].CDate}}</span>
        <span>{{airdetail[0].Flts[0].Transfer}}</span>
      </flexbox-item>
    </flexbox>
    <!-- 2 订单信息-->
    <flexbox orient="vertical" class="bg-white mt-1 pd-1 air_bs-b">
      <flexbox-item>
        <ul class="airDetail_body_list">
          <li><p class="air_cgray">订单号</p><p>{{airdetail[0].ID}}</p></li>
          <li><p class="air_cgray">预订时间</p><p>{{new Date(+airdetail[0].CreateTime.slice(6,19)).Format('yyyy-MM-dd hh:mm')}}</p></li>
        </ul>
      </flexbox-item>
      <flexbox-item>
        <ul class="airDetail_body_list">
          <li>
            <p class="air_cgray">订单状态</p>
            <p>{{airdetail[0].StatusStr}}</p></li>
          <li v-show="airdetail[0].StatusStr==='待支付'">
            <x-button v-if="airdetail[0].ExpensesType==='PUB'"
             @click='this.userinfo.FCanUseCorpPay===1?$refs.pay.showItem(airdetail[0].PayString):showNoPermiss=true'
             mini style="background:red;color:#fff;">支付</x-button>
            <x-button v-else @click="showOwnPay=true" mini style="background:red;color:#fff;">支付</x-button>
          </li>
        </ul>
      </flexbox-item>
      <flexbox-item v-if="airdetail[0].ApprovalStatus!==-1">
        <ul class="airDetail_body_list">
          <li><p class="air_cgray">审批人</p><p>{{airdetail[0].ApprovalUserName}}</p></li>
          <li><p class="air_cgray">状态</p> 
          <p v-if="airdetail[0].ApprovalStatus===0">待审批</p>
          <p v-else>{{AplStatus[airdetail[0].ApprovalStatus]}}</p>
          </li>
        </ul>
      </flexbox-item>
      <flexbox-item>
        <ul class="airDetail_body_list">
          <li :style="{flex:(airdetail[0].OATravelApplyOrder!==''&&airdetail[0].OATravelApplyOrder!==null)?0.5:1}">
            <div v-show="airdetail[0].TravelReasonCode!==null && airdetail[0].TravelReasonCode!==''">
              <p class="air_cgray">出行目的</p>
              <p>{{airdetail[0].TravelReasonCode}}</p>
            </div>
            <div v-show="airdetail[0].TravelReasonRemark!==null && airdetail[0].TravelReasonRemark!==''">
              <p class="air_cgray">出行目的备注</p>
              <p>{{airdetail[0].TravelReasonRemark}}</p>
            </div>
          </li>
          <li v-show="airdetail[0].OATravelApplyOrder!==''&&airdetail[0].OATravelApplyOrder!==null">
            <p class="air_cgray">OA出差申请单</p>
            <p>{{airdetail[0].OATravelApplyOrder}}</p>
          </li>
        </ul>
      </flexbox-item>
    </flexbox>
    <!-- 3 登机人信息-->
    <flexbox orient="vertical" class="bg-white mt-1 pd-1 air_bs-b">
      <flexbox-item>
        <p class="air_cgray pb-05">登机人</p>
        <div v-for="item in airdetail[0].FltPassengers" class="air_cgray pb-05">
          <p style="color:#000;">{{item.PassengerName}}</p>
          <span>{{item.CardTypeName}}:</span>
          <span>{{item.CardTypeNumber}}</span>
          <p v-if="airdetail[0].ExpensesType==='PUB'">成本中心: {{item.CustomizeItem1}}{{item.CustomizeItem2}}{{item.CustomizeItem3}}{{item.CustomizeItem4}}
          <span v-show="item.CustomizeItem1===null">默认成本中心</span></p>
          <p>发送预定短信,手机号码: {{airdetail[0].FltDeliver.ContactMobile}}</p>
          <p v-if="airdetail[0].FltInsurances === null || airdetail[0].FltInsurances[0].InsurancPrice === 0">不购买保险</p>
          <p v-else>
          {{airdetail[0].FltInsurances[0].InsurancPrice>0?airdetail[0].FltInsurances[0].InsurancPrice+'元保险一份':''}}
          {{airdetail[0].FltInsurances[0].InsuranceNo===null?'暂无':airdetail[0].FltInsurances[0].InsuranceNo}}
          </p>
        </div>
      </flexbox-item>
    </flexbox>
    <!-- 4 违规信息 -->
    <flexbox class="bg-white mt-1 pd-1 air_bs-b" 
    v-show="(airdetail[0].Flts[0].RCofRate !== 0 && airdetail[0].Flts[0].RCofRate < airdetail[0].Flts[0].PriceRate||airdetail[0].Flts[0].Price !== 0 && airdetail[0].Flts[0].RCofPrice < airdetail[0].Flts[0].Price||airdetail[0].Flts[0].RCofDaysCode !== null && getActualDay < airdetail[0].Flts[0].RCofDays)&&airdetail[0].ExpensesType==='PUB'">
      <flexbox-item>
        <p class="air_cgray">政策违规</p>
        <div v-if="airdetail[0].Flts[0].RCofRate !== 0 && airdetail[0].Flts[0].RCofRate < airdetail[0].Flts[0].PriceRate">
          <p>违规类型: 折扣限制</p>
          <p>违规标准: {{airdetail[0].Flts[0].RCofRate}}折&nbsp;&nbsp;&nbsp;&nbsp;实际情况:{{airdetail[0].Flts[0].PriceRate}}折</p>
          <p>违规原因: {{airdetail[0].Flts[0].RCofRateCode}}{{airdetail[0].Flts[0].RCofRateRemark}}</p>
        </div>
        <div class="vux-1px-t mt-05 pt-05" v-if="airdetail[0].Flts[0].Price !== 0 && airdetail[0].Flts[0].RCofPrice < airdetail[0].Flts[0].Price">
          <p>违规类型: 低价提醒</p>
          <p>违规标准: {{airdetail[0].Flts[0].RCofPrice}}元&nbsp;&nbsp;&nbsp;&nbsp;实际情况:{{airdetail[0].Flts[0].Price}}元</p>
          <p>违规原因: {{airdetail[0].Flts[0].RCofPriceCode}}{{airdetail[0].Flts[0].RCofPriceRemark}}</p>
        </div>
        <div class="vux-1px-t mt-05 pt-05" v-if="getActualDay < airdetail[0].Flts[0].RCofDays">
          <p>违规类型: 提前预订</p>
          <p>违规标准: {{airdetail[0].Flts[0].RCofDays}}天&nbsp;&nbsp;&nbsp;&nbsp;实际情况: {{getActualDay}}天</p>
          <p>违规原因: {{airdetail[0].Flts[0].RCofDaysCode}}{{airdetail[0].Flts[0].RCofDaysRemark}}</p>
        </div>
      </flexbox-item>
    </flexbox>
    <!-- 5 联系人信息-->
    <flexbox orient="vertical" class="bg-white mt-1 pd-1 air_bs-b">
      <flexbox-item>
        <p class="air_cgray">联系人</p>
        <div v-for="item in airdetail[0].Contacts">
          <p>{{item.UserName}}&nbsp;&nbsp;{{item.Mobilephone}}</p>
        </div>
      </flexbox-item>
    </flexbox>
    <!-- 6 配送信息-->
    <flexbox class="bg-white mt-1 pd-1 air_bs-b">
      <flexbox-item class='w-airOrderDetai-item'>
        <div v-show="airdetail[0].Note!==null&&airdetail[0].Note!==''">
          <p class="air_cgray">附加信息</p>
          <p>{{airdetail[0].Note}}</p>
        </div>
        <p class="air_cgray">配送信息</p>
        
        <p>配送方式：{{airdetail[0].FltDeliver.DeliverTypeName}}</p>
        <div v-if="airdetail[0].FltDeliver.DeliverTypeName!=='无需配送'">
          <p>配送地址：{{airdetail[0].FltDeliver.ReciveInfo}}</p>
          <p>收件人：{{airdetail[0].FltDeliver.ReceiveName}}</p>
          <p>联系方式：{{airdetail[0].FltDeliver.ReceiveMobile}}</p>
          <p>配送状态：{{airdetail[0].FltDeliver.DeliveryStr}}</p>
        </div>
      </flexbox-item>
    </flexbox>
    <!-- 7 改签信息-->
    <flexbox class="bg-white mt-1 pd-1 air_bs-b" v-show="airdetail[0].Changes!==null">
      <flexbox-item>
        <p class="air_cgray">改签信息</p>
        <cell style="padding-left:0;" :title="new Date(+item.CreateTime.slice(6,19)).Format('yyyy-MM-dd hh:mm')" 
        v-for="item in airdetail[0].Changes"
        :inline-desc="'改签登机人：'+item.PassengerName">
          <span slot="after-title">
            申请改签
          </span>
          <span slot="value">
            {{item.ChangeStatusStr}}
          </span>
        </cell>
      </flexbox-item>
    </flexbox>
    <!-- 8 退票信息-->
    <flexbox class="bg-white mt-1 pd-1 air_bs-b" v-show="airdetail[0].Refunds!==null">
      <flexbox-item>
        <p class="air_cgray">退票信息</p>
        <cell style="padding-left:0;" :title="new Date(+item.CreateDate.slice(6,19)).Format('yyyy-MM-dd hh:mm')" 
        v-for="item in airdetail[0].Refunds"
        :inline-desc="'退票登机人：'+item.PName">
          <span slot="after-title">
            申请退票
          </span>
          <span slot="value">
            {{item.RefundStatusStr}}
          </span>
        </cell>
      </flexbox-item>
    </flexbox>
    <!-- 9 备注信息-->
    <flexbox class="mt-1 bg-white pd-1 air_bs-b" 
    v-show="airdetail[0].MoreRemarkOne!==''||airdetail[0].MoreRemarkTwo!==''||airdetail[0].MoreRemarkThree!==''">
      <flexbox-item>
        <div v-show="airdetail[0].MoreRemarkOne!==''&&airdetail[0].MoreRemarkOne!==null">
          <p class="air_cgray">{{airdetail[0].NoteTooLTipOne}}</p>
          <p>{{airdetail[0].MoreRemarkOne}}</p>
        </div>
        <div v-show="airdetail[0].MoreRemarkTwo!==''&&airdetail[0].MoreRemarkTwo!==null">
          <p class="air_cgray">{{airdetail[0].NoteTooLTipTwo}}</p>
          <p>{{airdetail[0].MoreRemarkTwo}}</p>
        </div>
        <div v-show="airdetail[0].MoreRemarkThree!==''&&airdetail[0].MoreRemarkThree!==null">
          <p class="air_cgray">{{airdetail[0].NoteTooLTipThree}}</p>
          <p>{{airdetail[0].MoreRemarkThree}}</p>
        </div>
      </flexbox-item>
    </flexbox>
    <flexbox class="bg-white mt-1 pd-1 air_bs-b" v-if="airdetail[0].StatusStr ==='已出票'">
      <flexbox-item>
        <x-button type="primary">申请退票</x-button>
      </flexbox-item>
      <flexbox-item>
        <x-button type="primary">申请改签</x-button>
      </flexbox-item>
    </flexbox>
    <tmc show class='mt-1'></tmc>
  </div>

  <!-- 因公支付 有权限 -->
	<!-- <air-pay :show.sync ='showPubPay' :pay-str= 'airdetail[0].PayString'></air-pay> -->
  <air-pay @pay-success = 'paySuccess' v-ref:pay></air-pay>
  <!-- 因私支付 -->
  <alert :show.sync="showOwnPay" title="" button-text="确定">
    <p style="text-align:center;">暂不支持微支付，请通过app或者网页端使用支付宝支付</p></alert>
  <!-- 因公支付，无权限 -->
  <confirm :show.sync="showNoPermiss" title="" cancel-text="取消" confirm-text="联系客服" @on-confirm="ContactService">
    <p style="text-align:center;">暂无公司账户支付权限,请联系管理员</p></confirm>
</template>
<script>
import {Confirm, Alert, Flexbox, FlexboxItem, XButton, Cell} from 'vux-c'
import AirPay from '../../../Public/AirPay'
import Tmc from '../../../Public/TMC'
export default {
  components: {
    Confirm,
    Alert,
    Flexbox,
    FlexboxItem,
    Cell,
    XButton,
    AirPay,
    Tmc
  },
  data () {
    return {
      showPubPay: false,
      showOwnPay: false,
      showNoPermiss: false,
      userinfo: window.Miu.Data.UserInfo,
      token: window.Miu.Data.Token,
      actualDay: 0,
      isAdvance: false,
      TMC: {},
      tel: '4007286000',
      // 0 待审批 1 已通过 2 已驳回 3 已转审 4 已取消
      AplStatus: ['待审批', '已通过', '已驳回', '已转审', '已取消'],
      airdetail: [{
        CreateTime: '',
        Refunds: '',
        Changes: '',
        Flts: [{
          TakeOffTime: '',
          TakeOffTimeStr: '',
          ArrivalTimeeStr: '',
          APortName: '',
          ArrivalTime: ''

        }],
        FltPassengers: [{
          PassengerName: '',
          CardTypeName: '',
          CardTypeNumber: ''
        }],
        FltDeliver: {
          DeliverTypeName: '',
          ContactName: '',
          ContactMobile: ''
        },
        FltInsurances: [{
          InsOTAName: '',
          InsuranceIndex: ''
        }]
      }]
    }
  },
  computed: {
    getActualDay () {
      let ms = this.airdetail[0].Flts[0].TakeOffTime.slice(6, 19) - this.airdetail[0].CreateTime.slice(6, 19)
      let day = Math.floor(ms / 1000 / 60 / 60 / 24)
      if (day < this.airdetail[0].Flts[0].RCofDays) {
        this.isAdvance = true
        return day
      } else {
        return day
      }
    }
  },
  ready () {
    this.getAirOrderDetail()
    this.isOrder()
    this.getTMC()
  },
  methods: {
    isOrder () {
      if (this.$route.query.order) {
        window.sessionStorage.setItem('type', 'air')
      }
    },
    getAirOrderDetail () {
      this.$http.post(window.Miu.Data.ApiURL + '/Flight_1_0/GetOrderDetail',
        {
          CreateTime: '',
          OrderByDesc: [
            'CreateTime'
          ],
          OrderID: this.$route.params.id,
          CropID: this.userinfo.CorpID,
          NotTravel: false,
          PageSize: 20,
          PageNumber: 1,
          UID: this.userinfo.UID,
          authTkn: this.token
        }
      ).then(function (response) {
        console.log(response.data)
        if (response.data.errorMessage === null) {
          this.airdetail = response.data.orderLists.Items
        } else {
          console.log(response.data.errorMessage)
        }
      }, function (response) {
        console.log(response.data)
      })
    },
    /* 联系客服 */
    ContactService () {
      window.location.href = 'tel:' + this.tel
    },
    getTMC () {
      if (window.sessionStorage.getItem('TMC')) {
        this.setTMC()
      } else {
        this.GetSourceMode()
      }
    },
    setTMC () {
      this.TMC = JSON.parse(window.sessionStorage.getItem('TMC'))
      if (this.TMC.SourceTel) {
        this.tel = this.TMC.SourceTel
      } else {
        this.tel = '4007286000'
      }
    },
    GetSourceMode () {
      this.$http.post(window.Miu.Data.ApiURL + '/Account_1_0/GetSourceMode', {authTkn: window.Miu.Data.Token}).then(function (response) {
        if (response.data.errorMessage === null && response.data.errorCode === null) {
          window.sessionStorage.setItem('TMC', JSON.stringify(response.data.result))
          this.getTMC()
        }
      })
    }
  }
}
</script>
<style lang="less">
  @import '../../../styles/user/my-order/detail.less';
</style>