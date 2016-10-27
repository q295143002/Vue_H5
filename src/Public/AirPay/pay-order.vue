<template>
  <h3 class="ta-c theme-color-blue mb-2">公司账户支付</h3>
  <group>
    <x-input placeholder='验证码' type='text' :value.sync='pay.code'>
      <x-button @click="GetPayActiveCode" :type='wait.show?"cancel":"primary"' mini><span>{{'获取验证码' + wait.text}}</span></x-button>
    </x-input>
    <x-input placeholder='支付密码' type='password' :value.sync='pay.pwd'></x-input>
  </group>
  <flexbox>
    <flexbox-item>
      <x-button type='primary' class='mt-1 mb-1' @click ='VailCorpAccount'>确认</x-button>
    </flexbox-item>
    <flexbox-item>
      <x-button type='cancel' class='mt-1 mb-1' @click= 'close()'>取消</x-button>
    </flexbox-item>
  </flexbox>
  <small class="theme-color-blue ta-c mt-05" @click = 'forgot'>忘记密码？</small>
</template>
<script>
  import {XButton, Group, Flexbox, FlexboxItem, XInput} from 'vux-c'
  export default {
    components: {XButton, Group, Flexbox, FlexboxItem, XInput},
    data () {
      return {
        wait: {
          show: false,
          val: 60,
          text: ''
        },
        pay: {
          code: '',
          pwd: ''
        },
        toast: {
          show: false,
          text: ''
        },
        loading: {
          show: false,
          text: '加载中'
        },
        pAYSTR: ''
      }
    },
    props: {
      payStr: String
    },
    methods: {
      forgot () {
        this.$emit('forgot')
      },
      close () {
        console.log('close')
        this.pay = {
          code: '',
          pwd: ''
        }
        this.$emit('close')
      },
      /* 发送验证码 */
      GetPayActiveCode () {
        if (!this.wait.show) {
          this.$http.post(window.Miu.Data.ApiURL + '/Account_1_0/GetPayActiveCode', {authTkn: window.Miu.Data.Token}).then((response) => {
            this.$root.Toast('验证码发送成功')
            this.countDown()
          }, () => {
          })
        }
      },
      countDown () {
        let that = this
        that.wait.val = 60
        this.wait.show = true
        that.wait.text = `(${that.wait.val})`
        window.xx = setInterval(function () {
          if (that.wait.val > 0) {
            that.wait.val--
            that.wait.text = `(${that.wait.val})`
          } else {
            clearInterval(window.xx)
            that.wait.text = ''
            that.wait.val = 60
            that.wait.show = false
          }
        }, 1000)
      },
      /* 表单验证*/
      VailCorpAccount () {
        if (new RegExp(/\D/g).test(this.pay.code)) {
          /* 匹配验证码 */
          this.$root.Toast('验证码错误')
        } else if (this.pay.code === '') {
          this.$root.Toast('请输入验证码')
        } else if (this.pay.pwd === '') {
          this.$root.Toast('请输入支付密码')
        } else {
          this.ApplyCorpAccount()
        }
      },
      /* 支付订单 */
      ApplyCorpAccount () {
        let key = window.CryptoJS.enc.Utf8.parse('12345678901234567890123456789012')
        let pwd = window.CryptoJS.AES.encrypt(this.pay.pwd, key, {
          mode: window.CryptoJS.mode.ECB,
          padding: window.CryptoJS.pad.Pkcs7
        })
        this.$http.post(window.Miu.Data.ApiURL + '/Account_1_0/ApplyCorpAccount', {
          authTkn: window.Miu.Data.Token,
          pAYSTR: this.payStr,
          code: this.pay.code,
          pwd: pwd.toString()
        }).then((response) => {
          if (response.data.process_status === '0') {
            this.pay = {
              code: '',
              pwd: ''
            }
            this.$root.Toast('支付成功')
            this.$emit('pay-success')
          } else {
            this.$root.Toast('支付失败')
          }
          console.log(response.data)
        }, (response) => {
          switch (response.data.errorCode) {
            case 'NONEPAYWD': this.$root.Toast('支付失败：尚未设置支付密码')
              break
            case 'ERRORPAYPWD': this.$root.Toast('支付失败：支付密码不正确')
              break
            case 'NOTENOUGHCORPACCOUNT': this.$root.Toast('支付失败：公司账户余额不足，请联系管理员')
              break
            case 'NOSUPPORTCORPPAY': this.$root.Toast('支付失败：不支持公司账户支付')
              break
            case 'ORDERPAIED': this.$root.Toast('订单已经支付过了,请勿重复支付')
              break
            case 'CHECKCODEEXPIRE': this.$root.Toast('支付失败：校验码失效')
              break
            case 'CHECKCODERROR': this.$root.Toast('支付失败：校验码不正确')
              break
            case 'UNSETMOBILE': this.$root.Toast('支付失败：尚未设置手机号')
              break
            case 'CORPOVERDRAFT': this.$root.Toast('支付失败：超过了公司透支额度')
              break
            case 'WITHOUTCORPPAY': this.$root.Toast('支付失败：没有公司账户支付权限')
              break
            case 'PayCodeNotNull': this.$root.Toast('支付失败：支付验证码不能为空')
              break
            default: this.$root.Toast('支付失败：未知原因')
              break
          }
        })
        /*
          /// <summary>
          /// 公司支付
          /// </summary>
          CORPPAY = 70001,

          /// <summary>
          /// 尚未设置支付密码
          /// </summary>
          NONEPAYWD = 70002,

          /// <summary>
          /// 支付密码不正确
          /// </summary>
          ERRORPAYPWD = 70003,

          /// <summary>
          /// 公司账户余额不足
          /// </summary>
          NOTENOUGHCORPACCOUNT = 70004,

          /// <summary>
          /// 不支持公司账户支付
          /// </summary>
          NOSUPPORTCORPPAY = 70005,

          /// <summary>
          /// 订单已经支付过了
          /// </summary>
          ORDERPAIED = 70006,

          /// <summary>
          ///校验码失效
          /// </summary>
          CHECKCODEEXPIRE = 70007,

          /// <summary>
          ///校验码不正确
          /// </summary>
          CHECKCODERROR = 70008,

          /// <summary>
          /// 尚未设置手机号
          /// </summary>
          UNSETMOBILE = 70009,

          /// <summary>
          /// 超过了公司透支额度
          /// </summary>
          CORPOVERDRAFT = 70010,

          /// <summary>
          /// 没有公司账户支付权限
          /// </summary>
          WITHOUTCORPPAY = 70011,

          /// <summary>
          /// 新手机号不能与原手机号相同
          /// </summary>
          MOBILESAME = 71000,

          /// <summary>
          /// 手机号已填写过了
          /// </summary>
          MOBILESETED = 71001,

          /// <summary>
          /// 已经设置过了支付密码
          /// </summary>
          CORPPAYPWDSETED = 71002,

          /// <summary>
          /// 已存在批次中
          /// </summary>
          ARBATCHIsExists = 71007,

          /// <summary>
          /// 支付验证码不能为空
          /// </summary>
          PayCodeNotNull=71004,
         */
      }
    }
  }
</script>