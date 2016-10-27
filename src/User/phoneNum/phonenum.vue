<template>
  <flexbox orient="vertical" class="w-phonenum">
    <flexbox-item class="vux-1px-b">
      <flexbox>
        <flexbox-item :span="0.6">
          <x-input placeholder="校验码" :value.sync="secur"></x-input>
        </flexbox-item>
        <flexbox-item :span="0.4">
          <!--  <countdown slot="value" :time="time" :start="start" @on-finish="finish" v-show="show"></countdown>21 -->
          <x-button class="w-PNum-security" :disabled="isDisabled" 
          @click="getCode">
          获取验证码
          </x-button>
        </flexbox-item>
      </flexbox>
    </flexbox-item>
    <flexbox-item class="vux-1px-b">
      <x-input placeholder="新手机号" :value.sync="newNum" ></x-input>
    </flexbox-item>
    <flexbox-item class="vux-1px-b">
      <x-input placeholder="确认新手机号" :value.sync="renewNum" :equal-with="newNum" v-ref:input></x-input>
    </flexbox-item>
      <x-button class="w-phonenum-btn" @click="vaild">登录</x-button>
  </flexbox>
  <!-- err toast-->
  <toast :show.sync="showErr" :time="1000" type="warn">{{err}}</toast>
  <div class="w-cover" v-if="showErr"></div>
</template>
<script>
import {Flexbox, FlexboxItem, XInput, XButton, Countdown, Cell, Toast} from 'vux-c'
export default {
  components: {
    Flexbox,
    FlexboxItem,
    XInput,
    XButton,
    Countdown,
    Cell,
    Toast
  },
  data () {
    return {
      step: 0,
      secur: '',
      newNum: '',
      renewNum: '',
      isDisabled: false,
      time: 20,
      start: false,
      show: true,
      value: '',
      err: '',
      showErr: false
    }
  },
  methods: {
    finish () {
      this.start = false
      this.time = 20
      this.show = false
    },
    /* 获取验证码 */
    getCode () {
      this.isDisabled = true
      this.start = this.isDisabled
      this.$http({
        methods: 'GET',
        url: window.Miu.Data.ApiURL + '/User_1_0/GetCodeByLoginMobile',
        params: {token: window.Miu.Data.Token}
      }).then(function (response) {
        console.log(response.data)
      }, function (response) {
        console.log(response.data)
      })
    },
    UpdateMobileByOldNumber () {
      this.$http({
        methods: 'GET',
        url: window.Miu.Data.ApiURL + '/User_1_0/UpdateMobileByOldNumber',
        params: {
          token: window.Miu.Data.Token,
          code: this.secur,
          newMobilePhone: this.newNum
        }
      }).then(function (response) {
        if (response.data.errorCode === null && response.data.Success === true) {
          window.alert('修改成功')
        } else {
          window.alert(response.data.errorMessage)
        }
        console.log(response.data)
      }, function (response) {
        console.log(response.data)
      })
    },
    vaild () {
      var newNumStr = window.Miu.Trim(this.newNum)
      var renewNumStr = window.Miu.Trim(this.renewNum)
      var securStr = window.Miu.Trim(this.secur)
      if (securStr === '') {
        this.err = '请输入验证码'
        this.showErr = true
        return
      }
      if (newNumStr === '') {
        this.err = '请输入手机号'
        this.showErr = true
        return
      }
      if (renewNumStr === '') {
        this.err = '请再次输入手机号'
        this.showErr = true
        return
      }
      if (securStr.length !== 6) {
        this.err = '请输入6位验证码'
        this.showErr = true
        return
      }
      if (!window.Miu.Validators.phone.fn(this.newNum)) {
        this.err = '手机格式错误'
        this.showErr = true
        return
      }
      if (!(newNumStr === renewNumStr && newNumStr !== '')) {
        this.err = '两次输入手机号不一致'
        this.showErr = true
        console.log(this.newNum)
        console.log(this.$refs.input.valid)
        return
      } else {
        this.UpdateMobileByOldNumber()
      }
    }
  }
}
</script>
<style>
</style>