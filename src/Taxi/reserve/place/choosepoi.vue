<template>
<div :class='Pop?"active":""' class='pos-f cube ts-02 m-cityback'>
  <flexbox class='vux-1px bg-white'  :gutter="0">
    <flexbox-item :span='CityInput.main?CityInput.input = 10:CityInput.input = 3' @click = 'toggleCity' class='ts-02 vux-1px-r'>
      <cell class='m-taxi-choosecity' :title='Address.city' :class='CityInput.main?"active":""' is-link></cell>
    </flexbox-item>
    <flexbox-item :span='CityInput.main?PoiInput.input = 2:PoiInput.input = 1' class='ta-c' @click = 'toggleCity'>
      <i class="iconfont " :class='Address.type === 0?"theme-color-green icon-qi":"theme-color-red icon-zhong"'></i>
    </flexbox-item>
    <flexbox-item :span='CityInput.main?PoiInput.input = 0:PoiInput.input = 8'  class='ts-02'>
      <x-input type="text"  @click = 'closeCity' class= 'bg-white m-taxi-addrinput' :value.sync='Address.addr' placeholder='请输入地址' :required=false>
      </x-input>
    </flexbox-item>
  </flexbox>
  <div style="position:relative;height:100%" class="of-h">
    <div class='ts-02 m-box3 of-y-s' v-el:fl-area >
      <group v-for='(key, val) in ddcode' class=' vux-1px-t m-taxi-fl' track-by='$index' :title='key' :class='[FlIndex === $index?"active":""]'  @click ='activeFl($index)'>
        <div class="child of-h " v-if= 'FlIndex === $index'>
          <div class="pl-1 pt-05 pb-05 vux-1px-b" @click='chooseCity(city)' v-for = 'city in val' :class='Address.city === city.name?"active":""' >
            {{city.name}}
          </div>
        </div>
      </group>
    </div>
    <br> 
    <div :class="['m-poi','ts-02', { 'active': !CityInput.main }]">
      <div>
        <div class="m-box2 m-box3 of-y-s">
          <group title='搜索结果' >
            <cell  v-if='Address.type === 0' class ='of-h m-taxi-nowplace' :title='Now.addr' class='pb-05 bg-white vux-1px-b' readonly @click='chooseNow' inline-desc ='我的位置' :show-clear="false">
            <i class="iconfont icon-foot1 icon-color-blue mr-05" slot='icon'></i>
            </cell>
            <cell
              v-for='key in PoiResult' 
              v-if = 'key.location'
              @click='setPoiResult(key)'   
              :title='key.name'
              :inline-desc ='key.address.toString()'
              is-link>
            </cell>
          </group>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
  import { XButton, Scroller, XInput, Flexbox, FlexboxItem, Group, Cell, Popup, Icon } from 'vux-c/'
  export default {
    components: {
      Icon,
      Scroller,
      XInput,
      XButton,
      Flexbox,
      FlexboxItem,
      Group,
      Cell,
      Popup
    },
    props: {
      Pop: Boolean,
      Now: Object,
      Place: Object,
      ddcode: Object
    },
    data () {
      return {
        FlIndex: 0,
        Address: {},
        CityInput: {
          input: 4,
          main: false
        },
        PoiInput: {
          input: 8
        },
        PoiResult: []
      }
    },
    watch: {
      'Address.addr' () {
        this.getPoiResult(this.Address.addr)
      }
    },
    methods: {
      into (obj) {
        this.Address = this.clone(obj)
      },
      clone (myObj) {
        if (typeof (myObj) !== 'object' || myObj === null) {
          return myObj
        }
        var newObj = {}
        for (var i in myObj) {
          newObj[i] = this.clone(myObj[i])
        }
        return newObj
      },
      /* 获取搜索的poi内容 */
      getPoiResult (key) {
        this.$nextTick(() => {
          this.$http({
            method: 'GET',
            url: 'http://restapi.amap.com/v3/assistant/inputtips',
            params: {
              'key': window.Miu.Data.MapTkn,
              'keywords': key,
              'city': this.Address.district,
              'citylimit': true,
              'output': 'JSON'
            },
            DisableLoading: true
          }).then(function (response) {
            this.PoiResult = response.data.tips
          }, function (response) {
            console.log(response)
          })
        })
      },
      /* 重设当前poi */
      setPoiResult (result) {
        this.Address.addr = result.name
        this.Address.lng = +result.location.split(',')[0]
        this.Address.lat = +result.location.split(',')[1]
        if (this.Address.type === 0) {
          this.$parent.from = this.clone(this.Address)
          console.log(this.Address)
          console.log(this.$parent.from)
        } else {
          this.$parent.to = this.clone(this.Address)
        }
        this.$dispatch('getFee')
      },
      /* 选择首字母*/
      activeFl (index) {
        if (this.FlIndex === index) {
          this.FlIndex = null
          this.$els.flArea.scrollTop = 0
        } else {
          this.FlIndex = index
          this.$nextTick(function () {
            console.log(index)
            this.$els.flArea.scrollTop = 38 * index
          })
        }
      },
      /* 设置城市 */
      toggleCity () {
        this.CityInput.main = !this.CityInput.main
      },
      closeCity () {
        this.CityInput.main = false
      },
      chooseCity (val) {
        console.log(val)
        this.Address.addr = ''
        this.Address.citycode = val.area
        this.Address.district = val.district
        this.Address.city = val.name
        this.PoiResult = []
        this.toggleCity()
      },
      chooseNow () {
        this.Address = this.clone(this.Now)
        if (this.Address.type === 0) {
          this.$set(this.$parent.from, this.Address)
        } else {
          this.$set(this.$parent.to, this.Address)
        }
        this.$dispatch('getFee')
      }
    }
  }
</script>
<style lang="less" scope>
  .m-taxi-nowplace {
    p{
      color:#1885fc;font-weight: bold;
    }
  }
  .m-cityback{
    overflow:hidden;
    width:100%;
    top:0;
    left:100%;
    bottom:0;
    z-index:10;
    background:#f4f4f4;
    &.active{
      left:0;
    }
  }
  .m-taxi-addrinput{
    padding-left: 0;
  }
  .m-box{
    padding: 5px 0 300px 0;
    overflow: hidden;
  }
  .m-box2{
    position: absolute;
    z-index: 0;
    top: 46px;
    left: 0;
    bottom:0px;
    width: 100%;
  }
  .m-box3{
    position: absolute;
    top: 0px;
    left: 0;
    bottom: 45px;
    width: 100%;
  }
  .m-box4 {
    top: 56px;
    bottom:40px;
  }
  .m-poi{
    background: #f1f1f1;
    left: 100%;
    width: 100%;
    height: 100%;
    top:0;
    position:absolute;
    float: left;
    overflow: hidden;
    &.active{
      left: 0;
    }
  }
  .m-taxi-choosecity{
    background: #fff;
    p{
      text-align: center;
    }
    &.active{
      .weui_cell_ft.with_arrow:after{
      transform:rotate(225deg)
      }
    }
  }
  .staggered-transition {
      transition: all .1s ease;
      margin: 0;
      height: 100%;
      overflow: hidden;
  }
  .staggered-enter, .staggered-leave {  
      height: 0;
  }
  .m-taxi-fl{
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
      top: 15px;
    }
    .child{height: 0;}
    &.active{
      .weui_cells_title{
        color: #1885fc
      }
      &:before{
        transform: rotate(135deg);
        border-color: #1885fc;
      }
      .child{height: auto;}
    }
  }
  .weui_cell_bd.weui_cell_primary{
    overflow: hidden;
    text-overflow:ellipsis;
    p {
      white-space: nowrap;
    }
  }
  .weui_input{
    margin: -11px 0;
    padding: 11px 0
  }
</style>