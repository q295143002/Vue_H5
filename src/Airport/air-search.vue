<template>
  <page-pop :pop-list='PagePop.list' :pop-show.sync ='PagePop.show'>
    <div slot ='main'>
      <button-tab  style='padding:20px;'>
        <button-tab-item  v-on:click='FlightWay="S"' selected>单程</button-tab-item>
        <button-tab-item  v-on:click='FlightWay="D"' >往返</button-tab-item>
      </button-tab>
      <div class="content-block">
        <flexbox>
          <flexbox-item :span="5">
            <x-input placeholder='出发地'  @click='chooseCity(0)' :value.sync='DepartCity.cityName' class='m-air-input'  :show-clear="false" readonly></x-input>
          </flexbox-item>
          <flexbox-item class='ta-c'>
            <i class="iconfont icon-change ts-02 m-air-toggle" @click='tradeCity' :class= '[toggle === 0?"active":""]'></i>
          </flexbox-item>
          <flexbox-item :span="5">
            <x-input placeholder='目的地' @click='chooseCity(1)' :value.sync='ArriveCity.cityName' class='m-air-input'  :show-clear="false"  readonly></x-input>
          </flexbox-item>
        </flexbox>
        <group>
          <cell :title="DepartDate" @click='chooseDate(DepartDate,0,FlightWay === "S"?"出行日期":"去程日期")' :value='"周"+"日一二三四五六".charAt(new Date(DepartDate).getDay())'>
            <i class="iconfont icon-airgo mr-05" slot='icon'></i>
          </cell>
          <cell :title="DepartDate2" @click='chooseDate(DepartDate2,1,"返程日期")' :value='"周"+"日一二三四五六".charAt(new Date(DepartDate2).getDay())' v-show = 'FlightWay==="D"'>
            <i class="iconfont icon-airgo mr-05 icon-trans"  slot='icon'></i>
          </cell>
        </group>
        <x-button type="primary" class='mt-3'  @click=submitSearch()>查询</x-button>
      </div>
      <div class="pos-a" style="bottom:0;left:0">
        <tmc show></tmc>
      </div>
    </div>
    <div slot ='child'>
      <city-choose :City.sync='popCityVal'></city-choose>
    </div>
  </page-pop>
  <toast :show.sync="toast.show" :type="toast.type" width='12rem'>{{toast.text}}</toast>
  <calendar-pop :date.sync='CalendarDate' :pop.sync='pop' :title='CalendarTitle'></calendar-pop>
</template>
<script>
import { XInput, ButtonTab, ButtonTabItem, Group, Calendar, XButton, Flexbox, FlexboxItem, Icon, Cell, Toast } from 'vux-c'
import CityChoose from './choose/city-choose'
import CalendarPop from './search/calendar-pop'
import PagePop from '../Public/PagePop'
import Tmc from '../Public/TMC'
export default {
  components: {
    PagePop,
    Tmc,
    XInput,
    Toast,
    Cell,
    CalendarPop,
    Icon,
    Flexbox,
    FlexboxItem,
    XButton,
    ButtonTab,
    ButtonTabItem,
    CityChoose,
    Group,
    Calendar
  },
  init () {
    this.$router.replace('/air/index')
  },
  ready () {
    this.init()
    window.Miu.SetTitle('机票')
    console.log(`history${window.history.length}`)
    /* 设定路由锚点 */
    if (!window.sessionStorage.getItem('AirHistoryIndex')) {
      window.sessionStorage.setItem('AirHistoryIndex', window.history.length)
    }
    if (window.sessionStorage.getItem('AirHistorySuccess')) {
      window.sessionStorage.removeItem('AirHistorySuccess')
    }
  },
  data: function () {
    return {
      PagePop: {
        show: 'index',
        list: [{name: 'child'}]
      },
      TMC: {},
      // 往返情况
      FlightWay: 'S',
      ClassNo: '',
      // pop日历开关
      pop: false,
      DaterPicker: 0,
      CalendarTitle: '',
      CalendarDate: '',
      // pop城市列表开关
      popCity: false,
      popCityPicker: 0,
      popCityVal: {},
      // 出发日期
      DepartDate: '',
      DepartDate2: '',
      // 出发城市
      DepartCity: {},
      // 到达城市
      ArriveCity: {},
      // 输入检测
      toast: {
        show: false,
        text: 'text'
      },
      toggle: 0,
      SearchCity: [{}, {}]
    }
  },
  watch: {
    '$route.params.status' () {
      this.PagePop.show = this.$route.params.status
      if (this.$route.params.status === 'index') {
        window.Miu.SetTitle('机票')
      }
    },
    'DepartCity' () {
      this.SearchCity[0] = this.DepartCity
      window.sessionStorage.setItem('SearchCity', JSON.stringify(this.SearchCity))
    },
    'ArriveCity' () {
      this.SearchCity[1] = this.ArriveCity
      window.sessionStorage.setItem('SearchCity', JSON.stringify(this.SearchCity))
    },
    'popCity' () {
      switch (this.popCity) {
        case false: if (this.$route.params.status === '1') {
          window.history.back()
        }
          break
      }
    },
    'CalendarDate' () {
      switch (this.DaterPicker) {
        case 0: this.DepartDate = this.CalendarDate
          break
        case 1: this.DepartDate2 = this.CalendarDate
          break
      }
    },
    'DepartDate': function () {
      if ((new Date(this.DepartDate2).getTime() - new Date(this.DepartDate).getTime()) < 3600 * 1000 * 24) {
        this.DepartDate2 = new Date(new Date(this.DepartDate).getTime() + 3600 * 1000 * 24).Format('yyyy-MM-dd')
      }
    },
    'DepartDate2': function () {
      if ((new Date(this.DepartDate2).getTime() < new Date(this.DepartDate).getTime())) {
        this.DepartDate = this.DepartDate2
      }
    },
    'popCityVal': function () {
      switch (this.popCityPicker) {
        case 0: this.DepartCity = this.popCityVal
          break
        case 1: this.ArriveCity = this.popCityVal
          break
        default: break
      }
    }
  },
  methods: {
    init () {
      this.DepartDate = new Date().Format('yyyy-MM-dd')
      this.DepartDate2 = new Date(new Date().getTime() + 3600 * 1000 * 24).Format('yyyy-MM-dd')
      if (window.sessionStorage.getItem('SearchCity')) {
        let obj = JSON.parse(window.sessionStorage.getItem('SearchCity'))
        this.DepartCity = obj[0]
        this.ArriveCity = obj[1]
      }
    },
    chooseDate (time, picker, title) {
      this.CalendarTitle = title
      this.CalendarDate = time
      this.DaterPicker = picker
      this.pop = true
    },
    chooseCity (val) {
      this.$router.go('/air/child')
      this.popCityPicker = val
      switch (this.popCityPicker) {
        case 0: this.popCityVal = this.DepartCity
          window.Miu.SetTitle('选择出发城市')
          break
        case 1: this.popCityVal = this.ArriveCity
          window.Miu.SetTitle('选择目的地城市')
          break
        default: break
      }
    },
    toastText (text) {
      this.toast = {
        show: true,
        type: 'text',
        text: text
      }
    },
    tradeCity () {
      switch (this.toggle) {
        case 0: this.toggle = 1
          break
        case 1: this.toggle = 0
          break
      }
      let cityCache = this.DepartCity
      this.DepartCity = this.ArriveCity
      this.ArriveCity = cityCache
    },
    submitSearch () {
      if (!this.DepartCity.cityCode) {
        this.toastText('请选择出发地')
      } else if (!this.ArriveCity.cityCode) {
        this.toastText('请选择目的地')
      } else if (this.ArriveCity.cityCode === this.DepartCity.cityCode) {
        this.toastText('出发城市和到达城市相同')
      } else {
        window.sessionStorage.setItem('AirOrder', '[]')
        this.$router.go(`/air/search/${this.DepartCity.cityCode}/${this.ArriveCity.cityCode}/${this.FlightWay}/${this.DepartDate}/${this.DepartDate}/${this.DepartDate2}/0/0`)
      }
    }
  }
}
</script>
<style lang ='less'>
  .content-block{
    padding: 1rem;
  }
  .icon-trans:before{
    transform: scaleX(-1);
    display: inline-block;
  }
  .m-air-input input{
    text-align: center;
  }
  .m-air-toggle{
    &:active{
      color: #1885fc
    }
    display: block;
    &.active{
      transform:rotate(180deg);
      -webkit-transform:rotate(180deg); /* Safari 和 Chrome */
      -o-transform:rotate(180deg); 
    }
  }
</style>