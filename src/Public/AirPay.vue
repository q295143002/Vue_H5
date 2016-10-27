<template>
  <dialog :show.sync ='showPay'>
    <div class="pd-1" v-if = 'payInfo.hasPayPwd'>
      <pay-order @forgot = 'payInfo.hasPayPwd = false' :pay-str= 'payStr' @close = 'close()' @pay-success= 'paySuccess()'></pay-order>
    </div>
    <div class="pd-1" v-else>
      <edit-paycode
        @close = 'payInfo.hasPayPwd = true'
        @edit-success= 'payInfo.hasPayPwd = true'
      ></edit-paycode>
    </div>
  </dialog>
</template>
<script>
  import {Dialog, Toast, Loading} from 'vux-c'
  import PayOrder from './AirPay/pay-order'
  import EditPaycode from './EditPaycode.vue'
  export default {
    components: {Dialog, PayOrder, EditPaycode, Toast, Loading},
    data () {
      return {
        payStr: '',
        showPay: false,
        canUseCorpPay: false,
        payInfo: {
          hasMobile: false,
          hasPayPwd: false
        }
      }
    },
    methods: {
      showItem (payStr) {
        this.payStr = payStr
        this.NewCheckOrderForPay()
      },
      NewCheckOrderForPay () {
        this.$http.post(window.Miu.Data.ApiURL + '/Account_1_0/NewCheckOrderForPay', {
          authTkn: window.Miu.Data.Token,
          paystr: this.payStr
        }).then((response) => {
          /* 订单能否支付 */
          if (response.data.IsSuccess) {
            /* 因公支付 */
            if (response.data.ExpensesType === 'PUB') {
              /* 机票支付权限 */
              if (window.Miu.Data.UserInfo.FCanUseCorpPay > 0 && window.Miu.Data.UserInfo.CanUseCorpPay > 0) {
                this.GetCorpPayInfo()
              } else {
                this.$root.Alert('无支付权限', '当前账户无公司支付权限，请联系管理员开通')
              }
            } else {
              this.$root.Alert('无法支付', '当前订单暂不支持微支付，请于客户端内支付')
            }
          } else {
            this.$root.Alert('无法支付', response.data.MsgErr)
          }
        })
      },
      paySuccess () {
        this.showPay = false
        this.$emit('pay-success')
      },
      GetCorpPayInfo () {
        this.$http.post(window.Miu.Data.ApiURL + '/Account_1_0/GetCorpPayInfo', {authTkn: window.Miu.Data.Token}, {DisableLoading: true}).then((response) => {
          this.showPay = true
          this.payInfo = response.data
        }, () => {
        })
      },
      close () {
        console.log('close')
        this.showPay = false
        this.$emit('on-close')
      }
    }
  }
  /*
{
  "ReturnID": "|F161021000153T",
  "IsSuccess": true,
  "ErrorMsg": "",
  "Amount": 684,
  "OrderList": [
    {
      "OrderId": "F161021000153T",
      "OrderType": 1,
      "FlightDesc": "北京-上海",
      "Amount": 684,
      "ADTK": "/Date(1477044087865)/"
    }
  ],
  "PaySerialId": "",
  "PayString": "W3siQW1vdW50IjowLCJDb3Vwb25GbGFnIjowLCJDb3Vwb25MaW1pdEFtb3VudCI6MCwiQ291cG9uVXNpbmciOjAsIkNyZWF0ZVRpbWUiOm51bGwsIkVDYXNoVXNpbmciOjAsIkd1ZXN0SW5mbyI6bnVsbCwiR3Vlc3RUaXRsZSI6bnVsbCwiSGFvQmFpUGF5V2F5IjpudWxsLCJQcm9kdWN0SW5mbyI6bnVsbCwiUHJvZHVjdFRpdGxlIjpudWxsLCJvcmRJZCI6IkYxNjEwMjEwMDAxNTNUIiwib3JkVHlwZSI6MX1d",
  "OTAType": 21,
  "IsApproval": false,
  "processTime": "2016-10-21 04:01:32",
  "process_status": null,
  "errorMessage": null,
  "errorCode": null
}
 */
</script>
