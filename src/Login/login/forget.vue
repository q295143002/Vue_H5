<template>
  <dialog :show.sync = 'show' >
    <div class= 'of-h m-forget-main'>
      <h3 class="ta-c mt-05 theme-color-blue">忘记密码</h3>
      <div class="pd-05">
        <group>
          <x-input placeholder= '手机号码'  type= 'number' :value.sync = 'phoneNum' :required = 'false'></x-input>
          <x-input placeholder= '验证码' :required = 'false'  type= 'number' :value.sync = 'vailCode'>
            <x-button mini :type='wait.show?"cancel":"primary"' class= 'ml-05' @click ='CheckVerificationCode'>{{'获取验证码' + wait.text}}</x-button>
          </x-input>
        </group>
      </div>
      <small class="color-gray-middle">验证码将以短信的形式发送到手机上，请注意查收</small>
      <div class="mg-05">
      <x-button type='primary' @click = 'CheckToFindPassword'>确定</x-button>
      </div>
      <div class="m-editpwd ts-02" :class='editPwd.show?"active":""'>
        <h3 class="ta-c mt-05 theme-color-blue">修改密码</h3>
        <div class="pd-05">
          <group>
            <x-input placeholder= '请输入新密码' :value.sync = 'editPwd.pwd' type = 'password' :required = 'false'></x-input>
            <x-input placeholder= '再次输入新密码' :required = 'false'  type= 'password' :value.sync = 'editPwd.repwd'></x-input>
          </group>
        </div>
        <div class="mg-05">
          <x-button type='primary' @click = 'CheckResetPassword'>确定</x-button>
        </div>
      </div>
    </div>
    
  </dialog>
</template>
<script>
  import { Dialog, Group, Cell, XInput, XButton } from 'vux-c'
  export default{
    components: {
      Dialog, Group, Cell, XButton, XInput
    },
    props: {
      show: Boolean
    },
    data () {
      return {
        wait: {
          show: false,
          val: 60,
          text: ''
        },
        phoneNum: '',
        vailCode: '',
        editPwd: {
          show: false,
          pwd: '',
          repwd: '',
          GUID: ''
        }
      }
    },
    watch: {
      'show' (bool) {
        if (bool === false) {
          this.editPwd.show = false
        }
      }
    },
    methods: {
      /* 验证方法 */
      vailPhoneNumber () {
        if (this.phoneNum === '') {
          this.$root.Toast('请输入手机号码')
          return false
        } else if (!/^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/i.test(this.phoneNum)) {
          this.$root.Toast('手机格式错误')
          return false
        } else {
          return true
        }
      },
      vailCodeInput () {
        if (this.vailCode === '') {
          this.$root.Toast('请输入验证码')
          return false
        } else {
          return true
        }
      },
      vailPassword () {
        if (this.editPwd.pwd === '') {
          this.$root.Toast('请输入密码')
          return
        } else if (this.editPwd.pwd !== this.editPwd.repwd) {
          this.$root.Toast('两次输入不一致')
          return false
        } else {
          return true
        }
      },
      /* 校验1 */
      CheckVerificationCode () {
        if (this.vailPhoneNumber()) {
          this.GetVerificationCode()
        }
      },
      /* 发送验证码 */
      GetVerificationCode () {
        if (!this.wait.show) {
          this.$http({
            method: 'GET',
            url: window.Miu.Data.ApiURL + '/User_1_0/GetVerificationCode',
            params: {
              LoginName: this.phoneNum
            }
          }).then(function (response) {
            if (response.data.Success) {
              this.$root.Toast('发送成功')
              this.countDown()
            }
          }, function (response) {
            this.$root.Toast(response.data.errorMessage)
          })
        }
      },
      /* 倒计时 */
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
      /* 校验2*/
      CheckToFindPassword () {
        if (this.vailPhoneNumber() && this.vailCodeInput()) {
          this.ToFindPassword()
        }
      },
      /* 验证码配置 */
      ToFindPassword () {
        this.$http({
          method: 'GET',
          url: window.Miu.Data.ApiURL + '/User_1_0/ToFindPassword',
          params: {
            phone: this.phoneNum,
            getCode: this.vailCode
          }
        }).then(function (response) {
          if (response.data.Success) {
            this.vailCode = ''
            this.editPwd = {
              show: true,
              pwd: '',
              repwd: '',
              GUID: response.data.GUID
            }
          }
        }, function (response) {
          this.$root.Toast(response.data.errorMessage)
        })
      },
      /* 校验3 */
      CheckResetPassword () {
        if (this.vailPassword()) {
          this.ResetPassword()
        }
      },
      /* 修改密码 */
      ResetPassword () {
        this.$http({
          method: 'GET',
          url: window.Miu.Data.ApiURL + '/User_1_0/ResetPassword',
          params: {
            GUID: this.editPwd.GUID,
            theNewPassword: this.editPwd.pwd
          }
        }).then(function (response) {
          if (response.data.Success) {
            this.$root.Toast('密码修改成功')
            this.show = false
            this.phoneNum = ''
          }
        }, function (response) {
          this.$root.Toast(response.data.errorMessage)
        })
      }
    }
  }
</script>
<style lang= 'less'>
  .m-editpwd{
    background: #fff;
    left: 100%;
    position: absolute;
    width: 100%;
    height: 100%;
    top:0;
    &.active{
      left: 0
    }
  }
  .m-forget-main {
    width: 100%;
    position: relative;
  }
</style>