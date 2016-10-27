<template>
<div style="width:100%;height:100%" class="of-y-s pos-a bg-gray">
<div class="pd-05">
  <group v-if = 'userinfo'>
    <cell title='当前用户'>{{userinfo}}</cell>
    <div class="pd-05">
      <x-button @click = '$root.GetUserInfo(this.$root.Toast("个人信息已更新"))' type='primary'>更新用户信息</x-button>
      <x-button  @click ='logOut' type='warn'>退出</x-button>
    </div>
  </group>
  <group v-else>
  	<x-input title='账号' :value.sync='username'></x-input>
  	<x-input title='密码' :value.sync='password'></x-input>
    <div class="pd-05">
    <x-button type='primary' @click ='logIn'>登陆</x-button>
    </div>
  </group>
  <group title='Build: 192.168.0.108 => wx.miutrip.com'>
    <cell title='生产环境'   @click='removeDev' :inline-desc = 'Env.build'>
      <icon type='success' class='mr-05' v-show='!EnvTest'></icon>
    </cell>
    <cell title='测试环境' @click='setDev' :inline-desc='Env.dev' >
      <icon type='success' class='mr-05' v-show='EnvTest'></icon>
    </cell>
  </group>
  <div class="pt-1 ">
    <flexbox>
      <flexbox-item>
        <x-button class='fsz-08' @click='$router.go("/taxi/index")'>用车</x-button>
      </flexbox-item>
      <flexbox-item>
        <x-button  class='fsz-08' @click='$router.go("/air/0")'>机票</x-button>
      </flexbox-item>
    </flexbox>
    <flexbox class='pt-05'>
      <flexbox-item>
        <x-button class='fsz-08' @click='$router.go("/travel")'>行程</x-button>
      </flexbox-item>
      <flexbox-item @click='$router.go("/user")'>
        <x-button class='fsz-08'>个人中心</x-button>
      </flexbox-item>
      <flexbox-item>
        <x-button class='fsz-08' @click='$router.go("/user/order")'>我的订单</x-button>
      </flexbox-item>
    </flexbox>
  </div>
  <divider>Dev: localhost => wxdev.miutrip.com</divider>
</div>
</div>
</template>
<script>
import { XInput, XButton, Flexbox, FlexboxItem, Loading, Group, Cell, Icon, Divider } from 'vux-c/'
export default {
  components: {
    XButton, XInput, Flexbox, FlexboxItem, Loading, Group, Cell, Icon, Divider
  },
  data () {
    return {
      username: '13017816296',
      password: '123456',
      userinfo: window.Miu.Data.UserInfo.UserName,
      Env: {
        dev: window.Miu.Data.ApiDATA[1],
        build: window.Miu.Data.ApiDATA[0]
      },
      EnvTest: false
    }
  },
  ready () {
    if (window.localStorage.getItem('isTest')) {
      this.EnvTest = true
    } else {
      this.EnvTest = false
    }
  },
  methods: {
    logOut () {
      window.localStorage.clear()
      this.userinfo = null
      window.sessionStorage.clear()
    },
    logIn () {
      let that = this
      this.$http({
        url: window.Miu.Data.ApiURL + '/Account_1_0/login',
        params: {
          loginName: that.username,
          password: that.password
        }
      }).then(function (response) {
        let that = this
        window.localStorage.setItem('MIUTKN', JSON.stringify(response.data))
        window.Miu.Data.Token = response.data.authTkn
        this.$root.GetUserInfo(function () { that.userinfo = window.Miu.Data.UserInfo.UserName }, true)
      }, function (response) {
        this.$root.Toast('登陆失败' + response.data.errorMessage)
      })
    },
    setDev () {
      window.localStorage.setItem('isTest', true)
      window.Miu.init()
      this.EnvTest = true
    },
    removeDev () {
      window.localStorage.removeItem('isTest')
      window.Miu.init()
      this.EnvTest = false
    }
  }
}
</script>