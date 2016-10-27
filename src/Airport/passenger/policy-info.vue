<template>
  <div class="pos-a m-air-choosepolicy-info ta-l ts-02" :class= 'Show?"active":""'>
    <x-header class='m-air-choosepolicy-header' :left-options="{showBack: false}"><a class="vux-header-back theme-color-blue" slot="left" @click ='Show = false'>返回</a></x-header>
    <div class="m-air-choosepolicy-info-show of-y-s" v-if ='Show'>
      <group >
        <cell title = '当前政策' :inline-desc = 'PolicyText'></cell>
      </group>
      <group :title='$index === 0?"去程":"返程"' v-for ='list in Rule' track-by="$index" class='m-passenger-breakrule'>
        <small v-for ='item in list' track-by="$index">{{item}}</small>
      </group>
    </div>
  </div>
</template>
<script>
  import {XHeader, Group, Cell} from 'vux-c'
  export default {
    components: {
      XHeader,
      Group,
      Cell
    },
    data () {
      return {
        PolicyText: '',
        Go: '',
        Back: '',
        AirOrder: JSON.parse(window.sessionStorage.getItem('AirOrder')),
        Rule: [],
        CorpPolicy: {}
      }
    },
    props: {
      List: Array,
      Show: Boolean
    },
    methods: {
      setCorpPolicy (policy) {
        this.CorpPolicy = policy
        this.Rule = []
        let PreBook = this.CorpPolicy.FltPreBookDays > 0 && this.CorpPolicy.FltPreBookRC === 'T' ? `提前${this.CorpPolicy.FltPreBookDays}天预定` : '不限制预定天数'
        let IsNeeedRc = this.CorpPolicy.IsFltBooking === 'T' ? '违规可预定' : '不可违规预定'
        let PreMinute = this.CorpPolicy.IsNeedRC_FltN === 'T' ? `出发时间前后${this.CorpPolicy.PreMinute}分钟内最低价航班` : '不限制航班价格'
        let Discount = this.CorpPolicy.IsFltDiscountRC === 'T' ? `${this.CorpPolicy.FltDiscountRC}折及以下航班` : '无折扣限制'
        let Insurance = this.CorpPolicy.Insurance === 'T' ? '允许买保险' : '不允许买保险'
        /* 设置规则 */
        if ((this.CorpPolicy.OrderRange & 1) > 0) {
          this.PolicyText = this.CorpPolicy.IsNeedFltRC === 'F' ? '无差旅规则' : `${PreBook}，${PreMinute}，${Discount}，${Insurance}，${IsNeeedRc}。`
          if (this.CorpPolicy.IsFltBooking === 'F') {
            this.setOutofLine()
          }
        } else {
          this.PolicyText = '无预定国内机票的权限'
        }
      },
      /* 设置违规 */
      setOutofLine () {
        this.AirOrder.forEach((item, index) => {
          /* 日期违规 */
          this.Rule[index] = []
          this.Rule[index].push((new Date(item.TakeOffDate).getTime() - new Date().getTime()) / (3600 * 24 * 1000) < this.CorpPolicy.FltPreBookDays && this.CorpPolicy.FltPreBookRC === 'T' ? '预定日期早于规定最低时间' : '')
          /* 折扣违规 */
          this.Rule[index].push(this.CorpPolicy.IsFltDiscountRC === 'T' && item.Rate >= this.CorpPolicy.FltDiscountRC ? '机票折扣超过规定折扣' : '')
          /* 最低价违规 */
          this.Rule[index].push(this.CorpPolicy.IsNeedRC_FltN === 'T' && (item.LowPrice < item.Price) ? '非时段最低价' : '')
        })
      }
    }
  }
</script>
<style lang="less" scope>
  .m-air-choosepolicy-info{
    left:100%;
    height: 100%;
    top: 0;
    background: #fff;
    width: 100%;
    &.active{
      left:0
    }
  }
  .m-air-choosepolicy-info-show{
    position: absolute;
    top:43px;
    bottom: 0;
    width: 100%;
    overflow-x: hidden;
  }
  .vux-header .vux-header-back.theme-color-blue{
    color:#1885fc;
    &:before{
      border-color: #1885fc;
    };
  }
  .m-passenger-breakrule{
    small{
      color: red;
      display: block;
      padding: 0 1rem;
      line-height: 1.5rem;
      font-size: 0.8rem
    }
  }
</style>