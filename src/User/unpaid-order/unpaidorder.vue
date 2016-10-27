<template>
<div v-show="showEmpty===true">
  <none-info-bg type="unpaid">您目前无任何待支付订单</none-info-bg>
</div>
<div class="pt-1" v-if="allList.length>0" style="height:100%;background:#eee;" :style="{'min-height':height +'px'}">
  <div v-for="(index,item) in allList | orderBy item.time">
    <!-- car -->
    <div v-if="!item.ACityName">
      <car :list="item"></car>
    </div>
    <!-- air -->
    <div v-else>
      <air :list="item"></air>
    </div>
  </div>
</div>
</template>
<script>
  import NoneInfoBg from '../../Public/NoneInfoBg'
  import Car from './list/car'
  import Air from './list/air'
  export default {
    components: {
      NoneInfoBg,
      Car,
      Air
    },
    data () {
      return {
        userinfo: window.Miu.Data.UserInfo,
        allList: [], /* 所有订单 */
        showEmpty: false
      }
    },
    ready () {
      this.getCarOrder()
      this.getAirOrder()
    },
    computed: {
      height () {
        let H = window.screen.height
        return H
      }
    },
    methods: {
      /* 获取用车列表 */
      getCarOrder () {
        this.$http({
          methods: 'GET',
          url: window.Miu.Data.ApiURL + '/TravelCar_1_0/CarOrderList',
          params: {
            mobile: this.userinfo.Mobilephone,
            orderPayStatus: 3,
            pageSize: 20,
            token: window.Miu.Data.Token
          }
        }).then(function (response) {
          console.log(response.data.carOrderList.Items)
          if (response.data.errorMessage === null && response.data.errorCode === null) {
            let list = response.data.carOrderList.Items
            this.listFilter(list, 'e')
          }
        }, function (response) {
          console.log(response.data)
        })
      },
      /* 获取机票列表 */
      getAirOrder () {
        this.$http.post(window.Miu.Data.ApiURL + '/Flight_1_0/GetOrderList',
          {
            CropID: this.userinfo.CorpID,
            NotTravel: true,  /* false:所有订单 true:未出行订单 */
            PageSize: 999,
            PageNumber: 1,
            UID: this.userinfo.UID,
            authTkn: window.Miu.Data.Token
          }
        ).then(function (response) {
          if (response.data.errorMessage === null && response.data.errorCode === null) {
            let list = response.data.orderLists.Items
            this.listFilter(list, '')
            if (this.allList.length === 0) {
              this.showEmpty = true
            }
          }
        })
      },
      /* 列表筛选 */
      listFilter (list, e) {
        for (var k in list) {
          if (k !== 'unique' && k !== 'removeRepeatAttr') {
            const time = list[k][`Creat${e}Time`].slice(6, 19)
            list[k].time = time
          }
        }
        this.allList.push.apply(this.allList, list)
      }
    }
  }
</script>
<style lang="less">
</style>