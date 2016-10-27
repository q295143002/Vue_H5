<template>
  <!-- <div class="weui_tabbar">
    <a 
      v-link='item.link'  
      v-for ='item in tabitem' 
      class="weui_tabbar_item"  
      :class='$index === index?"active":""'
      track-by='$index'
    >
      <div class="weui_tabbar_icon">
        <i slot="icon" class='iconfont' :class='item.icon' style="font-size:25px"></i>
      </div>
      <p class="weui_tabbar_label">
        <div class="ta-c fsz-08">{{item.text}}</div>
      </p>
    </a>
  </div> -->
</template>
<script>
  import { Tabbar, TabbarItem } from 'vux-c/'
  export default {
    components: {
      Tabbar,
      TabbarItem
    },
    props: {
      index: Number
    },
    data () {
      return {
        tabitem: [{
          text: '出行',
          link: '/',
          icon: 'icon-foot1'
        }, {
          text: '行程',
          link: '/travel',
          icon: 'icon-foot2'
        }, {
          text: '我的',
          link: '/user',
          icon: 'icon-foot3'
        }]
      }
    }
  }
</script>
<style>
  .weui_tabbar_item.active {
    color: green;
  }
</style>