<template>
    <div v-show="showEmpty === true">
      <none-info-bg type="order">您目前暂无任何订单</none-info-bg>
    </div>
    <scroller height="100%" lock-x use-pullup use-pulldown v-ref:scroller
    @pullup:loading="loadMore"
    @pulldown:loading="refresh"
    :pulldown-status.sync="pulldownStatus"
    :pullup-status.sync="pullupStatus">
      <ul>
        <li class="w-air-item mg-1 bg-white" v-for="(index,item) in airObj.list" v-show="index<n"
        @click="jumpAirDetail(item.OrderId)">
          <!-- title -->
          <cell title="机票">
            <span slot="value">{{item.StatuStr}}</span>
            <i slot="icon" class="iconfont icon-airicon fsz-2 pr-05 icon-color-blue"></i>
          </cell>
          <p style="border-top:1px solid #ccc;margin:0 20px 10px;"></p>
          <!-- 航站楼 -->
          <p class="pl-1">{{item.DPortName}} {{item.DepartAirportBuilding}} - {{item.APortName}} {{item.ArriveAirportBuilding}}</p>
          <!-- time -->
          <cell title="" :inline-desc="new Date(+item.TakeOffTime.slice(6,19)).Format('MM月dd日 hh:mm')+'-'
            +new Date(+item.ArrivalTime.slice(6,19)).Format('hh:mm')">
            <span slot="value" class="color-red">&yen; {{item.ParPrice}}</span>
          </cell>
          <!-- 航仓 -->
          <p class="pl-1 pb-1" style="color:#666;">{{item.AirLineName+item.ClassName}}</p>
        </li>
        <p class="pb-1" v-show="airallbeenloaded===true" style="text-align:center">已加载所有数据</p>
      </ul>
      <!-- 刷新加载slot -->
      <solt :pdown-status="pulldownStatus" :pup-status="pullupStatus"></solt>
    </scroller>
    <loading :show="showLoading" :text="loadingText"></loading>
</template>
<script>
import {Scroller, Group, Cell, Spinner, Loading} from 'vux-c'
import NoneInfoBg from '../../../Public/NoneInfoBg'
import Solt from './solt'
export default {
  components: {
    Scroller,
    NoneInfoBg,
    Group,
    Cell,
    Spinner,
    Loading,
    Solt
  },
  data () {
    return {
      userinfo: window.Miu.Data.UserInfo,
      token: window.Miu.Data.Token,
      showLoading: false,
      loadingText: '',
      showEmpty: false,
      airallbeenloaded: false,  /* 是否已加载所有数据 */
      airObj: {
        list: [],
        page: 0,
        total: 0
      },
      n: 20,
      pulldownStatus: 'default',
      pullupStatus: 'default',
      pullupEnabled: true
    }
  },
  watch: {
    'airObj.list' (newVal, oldVal) {
      this.$refs.scroller.reset()
    }
  },
  ready () {
    this.getAirList(this.airObj, true)
  },
  methods: {
    getAirList (obj, bool) {
      this.showLoading = bool
      obj.page++
      this.$http.post(window.Miu.Data.ApiURL + '/Flight_1_0/GetOrderList',
        {
          CreateTime: '',
          OrderByDesc: [
            'CreateTime'
          ],
          CropID: this.userinfo.CorpID,
          NotTravel: false,
          PageSize: 20,
          PageNumber: obj.page,
          UID: this.userinfo.UID,
          authTkn: this.token
        }, {DisableLoading: true}
      ).then(function (response) {
        this.showLoading = false
        if (response.data.errorMessage === null && response.data.errorCode === null) {
          obj.total = response.data.orderLists.TotalRecordCount
          const count = response.data.orderLists.Pages
          const list = response.data.orderLists.Items
          if (obj.page <= count) {
            for (var k in list) {
              if (k !== 'unique' && k !== 'removeRepeatAttr') {
                obj.list.push(list[k])
              }
            }
            // this.getAirList(obj)
          } else {
            obj.total = obj.list.length
          }
          obj.list.length > 0 ? this.showEmpty = false : this.showEmpty = true
        }
      }, function (response) {
        this.showLoading = false
        console.log(response.data)
      })
    },
    loadMore (uuid) {
      setTimeout(() => {
        console.log(this.airObj.total)
        if (this.airObj.total >= this.n) {
          this.n += 20
          this.getAirList(this.airObj, false)
        } else {
          this.airallbeenloaded = true
          this.$broadcast('pullup:done', uuid)
          console.log('No more data, Pullup disabled!')
        }
        this.$nextTick(() => {
          this.$broadcast('pullup:reset', uuid)
        })
      }, 500)
    },
    refresh (uuid) {
      setTimeout(() => {
        this.n = 20
        this.airallbeenloaded = false
        ;[this.airObj.list, this.airObj.page, this.airObj.total] = [[], 0, 0]
        this.getAirList(this.airObj, true)
        this.$nextTick(() => {
          this.$broadcast('pulldown:reset', uuid)
        })
      }, 2000)
    },
    jumpAirDetail (id) {
      this.$router.go({
        name: '机票详情',
        params: {
          id: id
        },
        query: {
          order: true
        }
      })
    }
  }
}
</script>
<style lang="less">
  .w-air-item{
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
  ul li {
    list-style-type: none;
  }
</style>