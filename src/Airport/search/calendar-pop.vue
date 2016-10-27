<template>
  <popup :show.sync='pop' height='70%' @on-first-show="resetScroller">
    <x-header :left-options="{showBack: false}">{{title}}</x-header>
    <flexbox class='bg-white pt-05 pb-05 ta-c vux-1px-b' >
      <flexbox-item class='ta-c'><small>周日</small></flexbox-item>
      <flexbox-item class='ta-c'><small>周一</small></flexbox-item>
      <flexbox-item class='ta-c'><small>周二</small></flexbox-item>
      <flexbox-item class='ta-c'><small>周三</small></flexbox-item>
      <flexbox-item class='ta-c'><small>周四</small></flexbox-item>
      <flexbox-item class='ta-c'><small>周五</small></flexbox-item>
      <flexbox-item class='ta-c'><small>周六</small></flexbox-item>
    </flexbox>
    <scroller  height='100%' lock-x v-ref:scroller >
      <div>
        <div  v-for="i in 6" >
          <group>
            <div class='mt-1 mb-1 ta-c'>{{i|setDate}}
            </div>
            <inline-calendar
              :render-month="i|setCalendar"
              hide-header
              :return-six-rows=false
              :value.sync=date
              :show-last-month=false
              :show-next-month=false
              :disable-past=true
              :render-on-value-change=false
              :replace-text-list="replaceTextList"
              hide-week-list
              @click= 'pop=false'
            ></inline-calendar>
          </group>
        </div>
        <br>
        <br>
        <br>
        <br>
      </div>
    </scroller>
  </popup>
</template>
<script>
  import { Popup, InlineCalendar, Scroller, XHeader, Sticky, Flexbox, FlexboxItem, Divider, Cell, Group } from 'vux-c/'
  export default {
    components: {
      Group,
      Cell,
      Divider,
      Flexbox,
      FlexboxItem,
      Sticky,
      XHeader,
      Scroller,
      Popup,
      InlineCalendar
    },
    props: {
      title: String,
      pop: Boolean,
      date: String
    },
    filters: {
      'setCalendar' (e) {
        var a = new Date().getMonth() + 1 + e
        var b = new Date().getFullYear()
        if (a > 12) {
          a = a - 12
          b++
        }
        return [b, a]
      },
      'setDate' (e) {
        var a = new Date().getMonth() + 1 + e
        var b = new Date().getFullYear()
        if (a > 12) {
          a = a - 12
          b++
        }

        return a + '月' + b + '年'
      }
    },
    ready () {
      if (this.$route.params.FlightWay) {
        this.replaceTextList[this.$route.params.CacheDateTo] = '往'
        if (this.$route.params.FlightWay === 'D') {
          this.replaceTextList[this.$route.params.CacheDateBack] = '返'
        }
      }
    },
    data: function () {
      return {
        replaceTextList: {},
        timeShow: []
      }
    },
    methods: {
      resetScroller () {
        this.$refs.scroller.reset()
      }
    }
  }
</script>
<style>
  .m-date-icon{
    font-size: 1rem;
    height: 2rem;
    display: block;
    line-height: 2rem;
    text-align: center;
    color: #666;
    margin-right: 0.5rem;
    border-radius: 50%;
  }
</style>