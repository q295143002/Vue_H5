<template>
  <div class='bgc-gray-light vux-1px-b'>
      <scroller  lock-y v-ref:scroller>
        <div class="pos-r" style ="width:300%;height:55px" v-el:timescroller>
          <flexbox :gutter='0'>
            <flexbox-item 
              v-for='(index, time) in SearchTimes' 
              v-on:click = 'Jump(time.time)'
              v-bind:class="[Focus===index?'theme-color-blue': '']">
              <section class='vux-center'><big class='fw-b'>{{time.time.slice(-2)}}</big></section>
              <section class='vux-center'><small>{{time.value}}</small></section>
            </flexbox-item>
            <flexbox-item>
              <section class='vux-center'>
                <i class="iconfont icon-daily fsz-1_5 theme-color-blue" @click='pop=true'></i>
              </section>
            </flexbox-item>
          </flexbox>
        </div>
      </scroller>
  </div>
  <calendar-pop :date.sync='TimePoint' :pop.sync='pop' title ='选择日期'></calendar-pop>
</template>
<script>
  import { Scroller, Swiper, SwiperItem, Flexbox, FlexboxItem, Icon } from 'vux-c/'
  import CalendarPop from './calendar-pop'
  export default {
    components: {
      Scroller,
      CalendarPop,
      Icon,
      Flexbox,
      FlexboxItem,
      Swiper,
      SwiperItem
    },
    data: function () {
      return {
        aspectRatio: 2,
        pop: false,
        // 时间点
        TimePoint: '',
        Focus: 0,
        SearchTimes: []
      }
    },
    ready: function () {
      this.getSearchTimes(this.$route.params.DepartDateTo)
    },
    props: {
      TimeShow: String,
      RestTime: String
    },
    watch: {
      'TimePoint' () {
        this.TimeShow = this.TimePoint
        this.setSearchTimes()
        this.Jump(this.TimePoint)
      },
      '$route.params.DepartDateTo' () {
        this.setFocus()
      }
    },
    methods: {
      onIndexChange (index) {
      },
      setFocus () {
        for (var i in this.SearchTimes) {
          if (this.SearchTimes[i].time === this.$route.params.DepartDateTo) {
            this.Focus = +i
            if (i < 2) {
              this.$els.timescroller.style.transform = 'translate(0px, 0px)  scale(1) translateZ(0px)'
            } else if (i > 13) {
              this.$els.timescroller.style.transform = 'translate(' + (-100 / 16) * 11 + '%, 0px) scale(1) translateZ(0px)'
            } else {
              this.$els.timescroller.style.transform = 'translate(' + (-100 / 16) * (i - 2) + '%, 0px) scale(1) translateZ(0px)'
            }
            return
          }
        }
      },
      getSearchTimes (time) {
        this.TimePoint = time
        console.log(JSON.stringify(this.TimePoint))
        this.setSearchTimes()
      },
      /* 设置日期列表 */
      setSearchTimes () {
        let times = new Date(this.TimePoint).getTime()
        let day = 24 * 3600 * 1000
        let dateNow = new Date(new Date().Format('yyyy/MM/dd')).getTime()
        let week = '日一二三四五六'
        this.SearchTimes = []
        if (Math.ceil((times - dateNow) / day > 7)) {
          let timeStart = day * 7
          for (let i = 0; i < 15; i++) {
            let timeNode = new Date(times - timeStart + i * day)
            let timeNodeWeek = '周' + week.charAt(timeNode.getDay())
            this.SearchTimes.push({time: timeNode.Format('yyyy-MM-dd'), value: timeNodeWeek})
          }
        } else {
          for (let i = 0; i < 15; i++) {
            let timeNode = new Date(dateNow + day * i)
            let timeNodeWeek
            switch (i) {
              case 0: timeNodeWeek = '今天'
                break
              case 1: timeNodeWeek = '明天'
                break
              default :timeNodeWeek = '周' + week.charAt(timeNode.getDay())
                break
            }
            this.SearchTimes.push({time: timeNode.Format('yyyy-MM-dd'), value: timeNodeWeek})
          }
        }
        this.setFocus()
      },
      Jump (obj) {
        this.$router.replace('/air/search' +
          '/' + this.$route.params.DepartCity +
          '/' + this.$route.params.ArriveCity +
          '/' + this.$route.params.FlightWay +
          '/' + obj +
          '/' + this.$route.params.CacheDateTo +
          '/' + this.$route.params.CacheDateBack +
          '/' + this.$route.params.Page +
          '/0'
        )
      }
    }
  }
</script>
