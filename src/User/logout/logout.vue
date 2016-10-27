<template>
  <div>
    <x-header :left-options="{showBack:true,backText:''}" class="w-xHeader">设置</x-header>
    <dl class="w-logout-logo">
      <dt>商旅</dt>
      <dd>无限商旅</dd>
      <dd>版本号：V.2.4</dd>
    </dl>
    <x-button class="w-logout-btn" @click="logou">退出登录</x-button>
  </div>
</template>

<script>
import {XHeader, XButton} from 'vux-c'
export default {
  components: {
    XHeader,
    XButton
  },
  data () {
    return {
    }
  },
  methods: {
    logou () {
      window.Miu.Logout()
    }
  }
}
</script>