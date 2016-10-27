<template>
  <div class="w-policy">
    <h2 class="w-policy-title">我的差旅政策</h2>
    <p>差旅政策: {{policy.PolicyName}}</p>
    <div v-if="(policy.OrderRange & 1)>0" >
      <article class="w-policy-info1" v-show="policy.IsNeedFltRC==='T'">
        <h3 class="mb-05"><i class="iconfont icon-airport1"></i><span>机票</span></h3>
        <span v-show="policy.FltPreBookDays>0 && policy.FltPreBookRC === 'T'">可以提前{{policy.FltPreBookDays}}天预定，</span>
        <span v-else>不限制预定天数,</span>
        <span v-show="policy.PreMinute===60">出发时间前后{{policy.PreMinute}}分钟内最低价航班，</span>
        <span v-show="policy.IsFltDiscountRC==='T'">{{policy.FltDiscountRC}}折以下航班，</span>
        <span v-else>不打折，</span>
        <span v-show="policy.Insurance==='T'">允许买保险，</span>
        <span v-else>不允许买保险，</span>
        <span v-show="policy.IsFltBooking==='T'">违规可预定。</span>
        <span v-else>不允许违规预订。</span>
      </article>
      <article class="w-policy-info1" v-show="policy.IsNeedFltRC==='F'">
        <span>无差旅政策</span>
      </article>
    </div>
    <div v-else class="w-policy-info1">
      <article>无预定国内机票权限</article>
    </div>
    
   <!--  <article class="w-policy-info2">
      <h3><i class="iconfont icon-train"></i><span>酒店</span></h3>
      <div>一级城市标准500元/间夜，二级城市标准300元/间夜，其他城市标准130元/间夜，违规可预定</div>
    </article>
    <article class="w-policy-info3">
      <h3><i class="iconfont icon-hotel1"></i><span>火车票</span></h3>
      <div>高铁可预订:二等座。动车可预订:二等座，软卧。其他可预订:硬座，无座，违规可预定</div>
    </article> -->
  </div>
</template>
<script>
  export default {
    ready () {
      this.Getuserinfo()
      this.GetCorpPolicy()
    },
    data () {
      return {
        policy: ''
        // userinfo: ''
      }
    },
    methods: {
      Getuserinfo () {
        this.userinfo = window.Miu.Data.UserInfo
      },
      GetCorpPolicy () {
        this.$http({
          method: 'GET',
          url: window.Miu.Data.ApiURL + '/User_1_0/GetCorpPolicy',
          params: {
            isNeedCache: false,
            token: window.Miu.Data.Token,
            policyId: this.userinfo.PolicyID
          }
        }).then(function (response) {
          console.log(response.data)
          this.policy = response.data
        }, function (response) {
          console.log(response.data)
        })
      }
    }
  }
</script>