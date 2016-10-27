<template>
  <search @result-click="resultClick" placeholder='输入城市名称或拼音进行搜索' :cancel-text='"取消"' :results="FlightCities|filterBy CityKwd in 'cityName''cityEnName'" :value.sync="CityKwd" class='search'></search>
  <div id ='air-city'>
    <group title='热门城市'>
      <div v-for ='FC in FlightCities' style="width:25%;display:inline-block" v-if='FC.isHot === 1'>
        <div class="pd-05">
          <x-button  @click='chooseCity(FC)'>
            {{FC.cityName}}
          </x-button>
        </div>
      </div>
    </group>
    <group v-for = 'fl in CityFl' :title="fl" track-by='$index' id='#{{fl}}' @click ='cityShow($index)' class=' ts-02 vux-1px-b m-air-place-fl' :class='[CityShow === $index? "active":""]'>
      <div  class="of-h m-air-place-show" v-if = 'CityShow === $index'>
        <cell v-for ='FC in FlightCities |filterBy fl in "FirstLetter"' :title="FC.cityName" @click='chooseCity(FC)' track-by='$index'></cell>
      </div>
    </group>
    <br>
  </div>
</template>
<script>
import { Popup, Group, Cell, Scroller, Search, XButton } from 'vux-c/'
export default {
  components: {
    XButton,
    Search,
    Popup,
    Group,
    Cell,
    Scroller
  },
  props: {
    pop: Boolean,
    City: Object
  },
  ready () {
    this.getFlightCities()
  },
  data: function () {
    return {
      CityShow: 0,
      CityFl: [],
      CityKwd: '',
      CityResult: [],
      FlightCities: []
    }
  },
  methods: {
    getFlightCities () {
      console.log(1)
      this.$http.get(
        window.Miu.Data.Store + '/FlightCities.js'
      ).then(function (response) {
        var that = this
        var blob = new window.Blob([response.data], {type: 'text/plain'})
        window.Miu.readBlobAsText(blob, function (dataText) {
          console.log(dataText)
          that.FlightCities = JSON.parse(dataText)
          that.setCities()
        })
      })
    },
    setCities () {
      for (var i = 0; i < this.FlightCities.length; i++) {
        this.FlightCities[i].title = this.FlightCities[i].cityName
        this.FlightCities[i].FirstLetter = this.CityFl[i] = this.FlightCities[i].cityEnName.slice(0, 1).toUpperCase()
      }
      this.CityFl = this.CityFl.unique()
    },
    resetScroller () {
      this.$refs.scroller.reset()
    },
    chooseCity (val) {
      this.City = val
      document.getElementById('air-city').parentNode.parentNode.scrollTop = 0
      if (this.$parent.popShow === 'child') {
        window.history.back()
      }
    },
    resultClick (item) {
      this.CityKwd = ''
      this.chooseCity(item)
    },
    cityShow (index) {
      if (this.CityShow === index) {
        this.CityShow = null
      } else {
        this.CityShow = index
      }
    }
  }
}
</script>
<style lang ='less'>
  .search{
    z-index: 15;
  }
  .m-air-place-fl{
    position: relative;
    &:before{
      transition: all .2s;
      -moz-transition: all .2s;
      -webkit-transition: all .2s;
      -o-transition: all .2s;
      content: " ";
      display: inline-block;
      transform: rotate(45deg);
      height: 6px;
      width: 6px;
      right: 15px;
      border-width: 2px 2px 0 0;
      border-color: #C8C8CD;
      border-style: solid;
      position:absolute;
      top: 5px;
    }
    .m-air-place-show{
      height: 0;
    }
    &.active {
      &:before {
        transform: rotate(135deg);
      }
      .m-air-place-show{
        height: 100%;
      }
    }
  }
  .m-flnav div{
    height: 1.3rem;
    line-height: 1.3rem;
    font-size: 0.8rem;
    width: 2rem;
    text-align: center;
    font-weight: bold;
  }
  .flnav div:active{
    color: green;
  }
</style>