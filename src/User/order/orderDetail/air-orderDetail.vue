<template>
  <flexbox class="w-airOrderDetail bgc-gray-light" orient="vertical">
    <!-- header -->
    <flexbox-item class='w-airOrder-header mb-1'>
      <flexbox>
        <flexbox-item>
          <span class="w-air-title">{{new Date(+airdetail[0].Flts[0].TakeOffTime.slice(6,19)).Format('MM月dd日')}}</span>
        </flexbox-item> 
      </flexbox>
      <flexbox class="pt-1">
        <flexbox-item :span="0.4">
          <div class="w-air-d">
            <p>{{airdetail[0].Flts[0].TakeOffTimeStr.substr(11,7)}}</p>
            <p>{{airdetail[0].Flts[0].DCityName}}{{airdetail[0].Flts[0].DPortName}}</p>
          </div>
        </flexbox-item>
        <flexbox-item :span="0.15" class="pb-2">
          <i class='iconfont icon-air color-white fsz-2'></i>
        </flexbox-item>
        <flexbox-item :span="0.4">
          <div class="w-air-a">
            <p>{{airdetail[0].Flts[0].ArrivalTimeeStr.substr(11,7)}}</p>
            <p>{{airdetail[0].Flts[0].ACityName}}{{airdetail[0].Flts[0].APortName}}</p>
          </div>
        </flexbox-item>
      </flexbox>
    </flexbox-item>
    <!-- header -->
    <!-- 1 -->
    <flexbox-item class='w-airOrderDetai-item'>
      <flexbox>
        <flexbox-item>
          <p>{{airdetail[0].Flts[0].AirLineName}}</p>
          <p><b>{{airdetail[0].Flts[0].Flight}}</b></p>
          <p>机建</p>
          <p class='w-airOrder-price' v-show="airdetail[0].Tax">
            <b>¥{{airdetail[0].Tax}}</b></p>
          <p>保险费</p>
          <p class='w-airOrder-price' v-show="airdetail[0].InsuranceFee">
            <b>¥{{airdetail[0].InsuranceFee}}</b></p>
        </flexbox-item>
        <flexbox-item>
          <p>{{airdetail[0].Flts[0].ClassName}}/{{airdetail[0].Flts[0].SubClass}} <span class='w-airOrder-grayColor'>{{airdetail[0].Flts[0].PriceRate}}折</span></p>
          <p class='w-airOrder-price' v-show="airdetail[0].Flts[0].Price">
            <b>¥{{airdetail[0].Flts[0].Price}}</b></p>
          <div v-show="airdetail[0].ServerFee!==0">
            <p>服务费</p>
            <b class='w-airOrder-price'>¥{{airdetail[0].ServerFee}}</b></div>
          <p>订单总额</p>
          <p class='w-airOrder-price' v-show="airdetail[0].Amount">
            <b>¥{{airdetail[0].Amount}}</b></p>
        </flexbox-item>
      </flexbox>
      <flexbox>
        <flexbox-item>
          <p>退改签</p>
          <span>{{airdetail[0].Flts[0].Refund}}</span>
          <span>{{airdetail[0].Flts[0].CDate}}</span>
          <span>{{airdetail[0].Flts[0].Transfer}}</span>
          <!-- <p>航班起飞前2小时之前，退票手续费为237.00元；航班起飞2小时之后，退票手续费为412.00元；不得签转，航班起飞2小时之前，改期手续费为165.00元；航班起飞2小时之后，改期手续费为247.00元。</p> -->
        </flexbox-item>
      </flexbox>
    </flexbox-item>
    <!-- 1 -->
    <!-- 2 -->
    <flexbox-item class='w-airOrderDetai-item'>
      <flexbox orient="vertical">
        <flexbox-item>
          <flexbox>
            <flexbox-item>
              <p class='w-airOrder-grayColor'>订单号</p>
              <p>{{airdetail[0].ID}}</p>
            </flexbox-item>
            <flexbox-item>
              <p class='w-airOrder-grayColor'>预订时间</p>
              <p>{{new Date(+airdetail[0].CreateTime.slice(6,19)).Format('yyyy-MM-dd hh:mm')}}</p>
             <!--  <p class='w-airOrder-grayColor'>订单状态</p>
              <p class='w-airOrder-blueColor'>{{airdetail[0].StatusStr}}</p> -->
            </flexbox-item>
          </flexbox>
        </flexbox-item>
        <flexbox-item>
          <flexbox>
            <flexbox-item>
              <p class='w-airOrder-grayColor'>订单状态</p>
              <p class='w-airOrder-blueColor'>{{airdetail[0].StatusStr}}</p>
            </flexbox-item>
            <flexbox-item v-show="airdetail[0].OATravelApplyOrder!==''&&airdetail[0].OATravelApplyOrder!==null">
              <p>OA出差申请单</p>
              <p>{{airdetail[0].OATravelApplyOrder}}</p>
            </flexbox-item>
            <!-- <flexbox-item v-show="airdetail[0].StatusStr==='待支付'">
              <x-button @click="show=true" mini style="background:red;color:#fff;">支付</x-button>
            </flexbox-item> -->
          </flexbox>
          
        </flexbox-item>
        <!-- 出行目的 -->
        <flexbox-item>
          <p class='w-airOrder-grayColor'>出行目的</p>
          <p>{{airdetail[0].TravelReasonCode}}</p>
          <p style="height:10px;"></p>
          <p class='w-airOrder-grayColor'>出行目的备注</p>
          <p v-if="airdetail[0].TravelReasonRemark === null">无</p>
          <p v-else>{{airdetail[0].TravelReasonRemark}}</p>
        </flexbox-item>
      </flexbox>
    </flexbox-item>
    <!-- 2 -->
    <!-- 3 登机人信息-->
    <flexbox-item class='w-airOrderDetai-item'>
      <flexbox orient="vertical">
        <flexbox-item >
          <p class='w-airOrder-grayColor'>登机人</p>
        </flexbox-item>
        <flexbox-item>
          <span>{{airdetail[0].FltPassengers[0].PassengerName}}</span>
        </flexbox-item>
        <flexbox-item class='color-gray-middle'>
          <span>{{airdetail[0].FltPassengers[0].CardTypeName}}:</span>
          <span>{{airdetail[0].FltPassengers[0].CardTypeNumber}}</span>
          <p>成本中心: {{airdetail[0].FltPassengers[0].CustomizeItem1}}{{airdetail[0].FltPassengers[0].CustomizeItem2}}{{airdetail[0].FltPassengers[0].CustomizeItem3}}{{airdetail[0].FltPassengers[0].CustomizeItem4}}
          <span v-show="airdetail[0].FltPassengers[0].CustomizeItem1===null">默认成本中心</span></p>
          <p>发送预定短信,手机号码: {{airdetail[0].FltDeliver.ContactMobile}}</p>
          <p v-if="airdetail[0].FltInsurances === null">不购买保险</p>
          <p v-else>
          {{airdetail[0].FltInsurances[0].InsOTAName}}{{airdetail[0].FltInsurances[0].InsurancPrice>0?airdetail[0].FltInsurances[0].InsurancPrice+'元保险':''}}
          {{airdetail[0].FltInsurances[0].InsuranceNo===null?'暂无':airdetail[0].FltInsurances[0].InsuranceNo}}
          </p>
          <!-- <p>审批类型：{{airdetail.ApprovalType}}</p> -->
        </flexbox-item>
      </flexbox>
      <!-- <flexbox>
        <flexbox-item>
          <p class='color-gray-middle'>审批人</p>
          <p>{{airdetail.ApprovalUserName}}</p>
        </flexbox-item>
        <flexbox-item>
          <p class='w-airOrder-grayColor'>状态</p>
          <p class='w-airOrder-blueColor'>{{airdetail.ApprovalStatus}}</p>
        </flexbox-item>
      </flexbox> -->
    </flexbox-item>
    <!-- 3 -->
    <!-- 4 联系人信息-->
    <flexbox-item class='w-airOrderDetai-item'>
      <p class='w-airOrder-grayColor'>联系人</p>
      <p>{{airdetail[0].FltDeliver.ContactName}}&nbsp;&nbsp;{{airdetail[0].FltDeliver.ContactMobile}}</p>
    </flexbox-item>
    <!-- 4 -->
    <!-- 5 -->
   <!--  <flexbox-item class='w-airOrderDetai-item'>
      <flexbox orient='vertical'>
        <flexbox-item class='w-airOrder-grayColor'>政策违规</flexbox-item>
        <flexbox-item>违规类型：提前预订</flexbox-item>
        <flexbox-item>违规标准：3天</flexbox-item>
        <flexbox-item>违规原因：计划外的紧急出差任务</flexbox-item>
        <flexbox-item>违规类型：低价提醒</flexbox-item>
        <flexbox-item>违规标准：926元  实际情况：1220元</flexbox-item>
        <flexbox-item>违规原因：改签或退票原因</flexbox-item>
      </flexbox>
    </flexbox-item> -->
    <!-- 5 -->
    <!-- 6 配送信息-->
    <flexbox-item class='w-airOrderDetai-item'>
      <p class='w-airOrder-grayColor'>附加信息</p>
      <p>{{airdetail[0].Note}}</p>
      <p v-show="airdetail[0].Note===null||airdetail[0].Note===''">无</p>
      <p class='w-airOrder-grayColor'>配送信息</p>
      
      <p>配送方式：{{airdetail[0].FltDeliver.DeliverTypeName}}</p>
      <div v-if="airdetail[0].FltDeliver.DeliverTypeName!=='无需配送'">
        <p>配送地址：{{airdetail[0].FltDeliver.ReciveInfo}}</p>
        <p>收件人：{{airdetail[0].FltDeliver.ReceiveName}}</p>
        <p>联系方式：{{airdetail[0].FltDeliver.ReceiveMobile}}</p>
        <p>配送状态：{{airdetail[0].FltDeliver.DeliveryStr}}</p>
      </div>
    </flexbox-item>
    <!-- 6 -->
    <!-- 7 改签信息-->
    <flexbox-item v-show="airdetail[0].Changes!==null" class='w-airOrderDetai-item w-cell'>
      <p class='w-airOrder-grayColor'>改签信息</p>
      <cell :title="new Date(+item.CreateTime.slice(6,19)).Format('yyyy-MM-dd hh:mm')" 
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
    <!-- 8 退票信息-->
    <flexbox-item v-show="airdetail[0].Refunds!==null" class='w-airOrderDetai-item w-cell'>
      <p class='w-airOrder-grayColor'>退票信息</p>
      <cell :title="new Date(+item.CreateDate.slice(6,19)).Format('yyyy-MM-dd hh:mm')" 
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
    <!-- 9 备注 -->
    <flexbox-item >
      <p>{{airdetail[0].NoteTooLTipOne}}</p>
      <p>{{airdetail[0].MoreRemarkOne}}</p>
      <p>{{airdetail[0].NoteTooLTipTwo}}</p>
      <p>{{airdetail[0].MoreRemarkTwo}}</p>
      <p>{{airdetail[0].NoteTooLTipThree}}</p>
      <p>{{airdetail[0].MoreRemarkThree}}</p>
    </flexbox-item>
    <tmc show class='mt-1'></tmc>
  </flexbox>
    <air-pay :show.sync ='show' :pay-str= 'airdetail[0].PayString'></air-pay>
</template>
<script>
import {Flexbox, FlexboxItem, XButton, Dialog, Cell} from 'vux-c'
import AirPay from '../../../Public/AirPay'
import Tmc from '../../../Public/TMC'
export default {
  components: {
    Flexbox,
    FlexboxItem,
    XButton,
    Dialog,
    AirPay,
    Cell,
    Tmc
  },
  data () {
    return {
      show: false,
      userinfo: window.Miu.Data.UserInfo,
      token: window.Miu.Data.Token,
      airdetail: [{
        CreateTime: '',
        Flts: [{
          TakeOffTime: '',
          TakeOffTimeStr: '',
          ArrivalTimeeStr: '',
          APortName: ''
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
  ready () {
    this.getAirOrderDetail()
    this.isOrder()
    console.log(this.$route.params.id)
  },
  // props: ['airdetail'],
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
    }
  }
}
</script>
<style lang="less">
  @import '../../../styles/user/my-order/air-orderdetail.less';
  .w-cell{
    .weui_cell{
      padding:0;
    }
  }
</style>
