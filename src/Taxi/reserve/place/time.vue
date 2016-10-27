<template>
  <cell  title ='出发时间' @click='show=true' is-link ><i class="theme-color-blue iconfont icon-time mr-05" slot='icon'></i>{{resultTime|toName}}</cell>
  <div class='m-taxi-timeslide'>
    <slide-picker :show.sync ='show' :data='timeshow' :value.sync = 'times' :column='3' @on-submit='confirm' @on-cancel='cancel'></slide-picker>
  </div>
</template>
<script>
  import SlidePicker from 'public/SlidePicker'
  import { PopupPicker, Group, Cell } from 'vux-c/'
  export default {
    components: {
      SlidePicker,
      PopupPicker,
      Group,
      Cell
    },
    props: {
      provideData: Object
    },
    data: function () {
      return 	{
        show: false,
        resultTime: ['now', 'now2', '现在'],
        times: [],
        timeshow: [{
          name: '现在',
          value: 'now',
          parent: 0
        }, {
          name: '',
          value: 'now2',
          parent: 'now'
        }, {
          name: '',
          value: '现在',
          parent: 'now2'
        }]
      }
    },
    ready () {
      this.setTimeList()
    },
    filters: {
      'toName' (val) {
        if (val[0] === this.timeshow[0].value) {
          return '现在'
        } else {
          return new Date(val[2]).Format('MM月dd日 hh:mm')
        }
      }
    },
    methods: {
      setTimeList () {
        this.timeshow[2].value = new Date().Format('yyyy/MM/dd hh:mm:ss')
        var todayDate = new Date(new Date().setTime(new Date().getTime() + 1000 * 60 * 60))
        var todayDay = todayDate.getDate()
        var todayHour = todayDate.getHours()
        var todayMinute = Math.ceil(todayDate.getMinutes() / 10)
        this.timeshow.push({name: todayDate.Format('MM月dd日 今天'), value: todayDay + '日', parent: 0})
        for (var i = 0; i < 24 - todayHour; i++) {
          if (todayMinute < 6) {
            this.timeshow.push({
              name: i + todayHour + '时',
              value: todayDay + '-' + (i + todayHour),
              parent: todayDay + '日'
            })
          } else {
            if (i > 0) {
              this.timeshow.push({
                name: i + todayHour + '时',
                value: todayDay + '-' + (i + todayHour),
                parent: todayDay + '日'
              })
            }
          }
          if (i === 0) {
            for (let j = 0; j < 6 - todayMinute; j++) {
              this.timeshow.push({
                name: (j + todayMinute) * 10 + '分',
                value: todayDate.Format('yyyy/MM/dd') + ' ' + (i + todayHour) + ':' + (j + todayMinute) * 10 + ':00',
                parent: todayDay + '-' + (i + todayHour)
              })
            }
          } else {
            for (let j = 0; j < 6; j++) {
              this.timeshow.push({
                name: j * 10 + '分',
                value: todayDate.Format('yyyy/MM/dd') + ' ' + (i + todayHour) + ':' + j * 10 + ':00',
                parent: todayDay + '-' + (i + todayHour)
              })
            }
          }
        }
        this.setFullDay(todayDate, 1) // 明天
        this.setFullDay(todayDate, 2) // 后天
        this.setProvideData()
      },
      setFullDay (today, val) {
        var fullDate = new Date(new Date().setTime(today.getTime() + (1000 * 60 * 60 * 24) * val))
        var fullDay = fullDate.getDate()
        this.timeshow.push({
          name: fullDate.Format('MM月dd日' + ' 周' + '日一二三四五六'.charAt(fullDate.getDay())),
          value: fullDay + '日',
          parent: 0
        })
        for (let i = 0; i < 24; i++) {
          this.timeshow.push({
            name: i + '时',
            value: fullDay + '-' + i,
            parent: fullDay + '日'
          })
          for (let j = 0; j < 6; j++) {
            this.timeshow.push({
              name: j * 10 + '分',
              value: fullDate.Format('yyyy/MM/dd') + ' ' + i + ':' + j * 10 + ':00',
              parent: fullDay + '-' + i
            })
          }
        }
      },
      mapTime (obj) {
        return obj
      },
      confirm () {
        this.resultTime = this.times.map(this.mapTime)
        this.setProvideData()
      },
      cancel () {
        this.times = this.resultTime.map(this.mapTime)
      },
      setProvideData () {
        switch (this.resultTime[0]) {
          case 'now': this.provideData.order_type = 1
            break
          default: this.provideData.order_type = 2
            break
        }
        this.provideData.order_time = new Date(this.resultTime[2])
        console.log(111)
        this.$dispatch('getFee')
      }
    }
  }
</script>
<style lang='less'>
  .m-taxi-timeslide .vux-flexbox .vux-flexbox-item:nth-child(1){
    flex:2;
  }
</style>