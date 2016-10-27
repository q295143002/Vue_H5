<template>
  <div v-show="showEmpty === true">
    <none-info-bg type="order">您目前暂无任何订单</none-info-bg>
  </div>
  <scroller height="100%" lock-x use-pullup use-pulldown v-ref:scroller
  @pullup:loading="loadMore"
  @pulldown:loading="refresh"
  :pulldown-status.sync="pulldownStatus"
  :pullup-status.sync="pullupStatus">
    <ul class="w-car">
      <li class="w-car-item mg-1 bg-white" v-for="(index,item) in carObj.list" v-show="index<n"
      @click = "jumpCarDetail(item.OrderId)">
        <cell title="用车">
         <span slot="value">{{STATUS[0][item.OrderStatus]}}</span>
         <i slot="icon" class="iconfont icon-caricon fsz-2 pr-05" style="color:#f8b551;"></i>
       </cell>
       <p style="border-top:1px solid #ccc;margin:0 20px 10px;"></p>
       <!-- time -->
        <cell title="" :inline-desc="new Date(+item.CreateTime.slice(6,19)).Format('MM月 dd日 hh:mm')">
          <!-- 预估 -->
          <span v-if="item.OrderStatus !== 51 && item.OrderStatus !== 43" slot="value" class="color-red">&yen; {{item.EstimateFee}}</span>
          <!-- 实际费用 -->
          <span v-else slot="value" class="color-red">&yen; {{item.PayFee}}</span>
        </cell>
        <!-- StartAddr -->
        <p class="w-places">
          <i slot="icon" class="iconfont icon-yuanxingweixuanzhong icon-color-green icon-size-s"></i>
          <span>{{decodeURIComponent(item.StartAddr).replace('+',' ')}}</span>
        </p>
        <!-- DestAddr -->
        <p class="w-places">
          <i slot="icon" class="iconfont icon-yuanxingweixuanzhong icon-color-red icon-size-s"></i>
          <span>{{decodeURIComponent(item.DestAddr).replace('+',' ')}}</span>
          <div class="pb-1"></div>
        </p>
      </li>
      <p  class="pb-1" v-show="carallbeenloaded===true" style="text-align:center">已加载所有数据</p>
    </ul>
    <solt :pdown-status="pulldownStatus" :pup-status="pullupStatus"></solt>
  </scroller>
</template>
<script>
import {Scroller, Group, Cell, Spinner} from 'vux-c'
import NoneInfoBg from '../../../Public/NoneInfoBg'
import Solt from './solt'
export default {
  components: {
    Scroller,
    NoneInfoBg,
    Group,
    Cell,
    Spinner,
    Solt
  },
  data () {
    return {
      userinfo: window.Miu.Data.UserInfo,
      token: window.Miu.Data.Token,
      STATUS: [window.Miu.Data.Taxi.DDStatus],
      showEmpty: false,
      carallbeenloaded: false,   /* 是否已加载所有数据 */
      n: 20,
      carObj: {
        list: [],
        page: 0,
        total: 0,
        count: 1
      },
      pulldownStatus: 'default',
      pullupStatus: 'default',
      pullupEnabled: true,
      decel: '',
      count: 0
    }
  },
  ready () {
    // this.getCarList(this.carObj, true)
    this.session()
  },
  props: {
    fre: Number
  },
  watch: {
    'carObj.list' (newVal, oldVal) {
      this.$refs.scroller.reset()
    },
    'fre' (newVal, oldVal) {
      this.getCarList(this.carObj, true)
      this.$refs.scroller.reset()
    },
    decel (newVal, oldVal) {
      if (newVal === 'decel') {
        console.log(newVal)
        this.countThree()
      }
    }
  },
  methods: {
    /* 如果状态改变两次刷新 */
    countThree () {
      var that = this
      if (that.count < 1) {
        that.count++
        console.log(that.count)
        window.setTimeout(function () {
          that.carObj.page = 0
          that.getCarList(that.carObj, false)
          that.countThree()
        }, 10000)
      }
    },
    session () {
      let s = window.sessionStorage.getItem('order')
      console.log(s)
      if (s === 'decel') {
        this.decel = s
        window.sessionStorage.removeItem('order')
      }
    },
    getCarList (obj, bool) {
      this.$root.Loading(bool)
      obj.page ++
      this.$http({
        method: 'GET',
        url: window.Miu.Data.ApiURL + '/TravelCar_1_0/CarOrderList',
        params: {
          mobile: this.userinfo.Mobilephone,
          pageIndex: obj.page,
          orderPayStatus: 0,
          token: this.token
        }, DisableLoading: true
      }).then(function (response) {
        this.$root.Loading(false)
        if (response.data.errorMessage === null && response.data.errorCode === null) {
          obj.total = response.data.carOrderList.TotalRecordCount
          const count = response.data.carOrderList.Pages
          const list = response.data.carOrderList.Items
          if (obj.page <= count) {
            for (var k in list) {
              if (k !== 'unique' && k !== 'removeRepeatAttr') {
                obj.list.push(list[k])
              }
            }
            if (obj.count === 1) {
              obj.count ++
              this.getCarList(obj)
            } else {
              obj.count = 1
            }
          }
          obj.list.length > 0 ? this.showEmpty = false : this.showEmpty = true
        }
      }, function (response) {
        this.$root.Loading(false)
        console.log(response.data)
      })
    },
    jumpCarDetail (id) {
      this.$router.go({
        name: '用车详情',
        params: {
          id: id
        },
        query: {
          order: true
        }
      })
    },
    loadMore (uuid) {
      if (this.carObj.total >= this.n) {
        this.n += 20
        this.getCarList(this.carObj, false)
      } else {
        this.$broadcast('pullup:done', uuid)
        this.carallbeenloaded = true
        console.log('No more data, Pullup disabled!')
      }
      setTimeout(() => {
        this.$nextTick(() => {
          this.$broadcast('pullup:reset', uuid)
        })
      }, 2000)
    },
    refresh (uuid) {
      this.n = 20
      this.carallbeenloaded = false
      ;[this.carObj.list, this.carObj.page, this.carObj.total, this.carObj.count] = [[], 0, 0, 1]
      this.getCarList(this.carObj, true)
      setTimeout(() => {
        this.$nextTick(() => {
          this.$broadcast('pulldown:reset', uuid)
        })
      }, 2000)
    }
  }
}
</script>
<style lang="less">
  .w-car-item{
    border-radius: 5px;
    .weui_cell{
      padding: 0px 15px;
      &:before{
        border:none;
      }
    }
    .vux-label-desc{
      font-size: 16px;
    }
  }
  .w-places{
    width:100%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    box-sizing: border-box;
    padding: 0 1rem;
  }
  ul li {
    list-style-type: none;
  }
</style>