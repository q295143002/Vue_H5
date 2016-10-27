<template>
<dialog :show.sync='Show'>
  <div class="pos-r of-h radius-clip" style="border-radius:4px;">
    <x-header class='m-air-choosepolicy-header':left-options="{showBack: false}">选择差旅政策</x-header>
    <div class="m-air-choosepolicy  pos-r">
      <!-- 差旅政策 -->
      <div class="m-air-choosepolicy-policy of-y-s">
        <group class='ta-l'>
          <cell 
          v-for='item in PolicyCenter.listUnique' 
          :title='item.PolicyID===undefined?"无差旅政策":item.PolicyName' 
          track-by='$index' 
          @click='submitCorpPolicy(item,$index)'
          :inline-desc = 'item.People|toStr'
          >
            <icon slot='icon' type='success' v-if='PolicyCenter.choose===$index' class='mr-05'></icon>
            <icon slot='icon' type='circle' v-else class='mr-05'></icon>
          </cell>
        </group>
      </div>
      <div class="m-air-choosepolicy-btn ta-l">
          <cell :inline-desc = 'BreakPolicy.goSuccess?"请确认本订单中的出行人可使用相同的差旅政策，否则需分开预定":"该政策无法预定"' :is-link= '!BreakPolicy.goSuccess'>
            <small v-if= '!BreakPolicy.goSuccess' class="theme-color-blue" @click = 'BreakPolicy.Show = true'>查看原因</small>
            <icon v-if= '!BreakPolicy.goSuccess' type='warn' v-else class='mr-05' slot = 'icon'></icon>
          </cell>
        <div class="pb-05 pl-05 pr-05">
          <x-button :type='BreakPolicy.goSuccess?"primary": "cancel"' @click='goOther'>确定</x-button>
        </div>
      </div>
    </div>
    <policy-info :show.sync ='BreakPolicy.Show' :list = 'BreakPolicy.List' v-ref:policyinfo></policy-info>
  </div>
</dialog>
</template>
<script>
  import { Popup, Group, Cell, Icon, Flexbox, FlexboxItem, XButton, Dialog, XHeader } from 'vux-c'
  import PolicyInfo from './policy-info'
  export default {
    components: {
      PolicyInfo,
      XHeader,
      Dialog,
      XButton,
      Popup,
      Group,
      Cell,
      Icon,
      Flexbox,
      FlexboxItem
    },
    data () {
      return {
        AirOrder: JSON.parse(window.sessionStorage.getItem('AirOrder')),
        PolicyCenter: {
          choose: 0,
          listUnique: []
        },
        List: [],
        CorpPolicy: {},
        BreakPolicy: {
          List: [],
          Show: false,
          goSuccess: true
        }
      }
    },
    filters: {
      toStr (obj) {
        let str = ''
        for (let i = 0; i < obj.length; i++) {
          str = str + obj[i] + ' '
        }
        return ('( ' + str + ')')
      }
    },
    props: {
      Show: Boolean
    },
    methods: {
      /* 初始化 */
      init () {
        this.setPolicyListUnique()
        this.BreakPolicy.Show = false
        this.Show = true
      },
      /* 选择政策 */
      submitCorpPolicy (item, index) {
        this.PolicyCenter.choose = index
        this.getCorpPolicy(item.PolicyID)
      },
      /* 加载差旅政策 */
      getCorpPolicy (id) {
        this.$http({
          method: 'GET',
          url: window.Miu.Data.ApiURL + '/User_1_0/GetCorpPolicy',
          params: {
            token: window.Miu.Data.Token,
            policyId: id
          }
        }).then(function (response) {
          this.CorpPolicy = response.data
          this.vailRule()
        })
      },
      /* 验证差旅政策是否违规 */
      vailRule () {
        this.BreakPolicy.goSuccess = true
        this.BreakPolicy.List = [{
          time: null,
          price: null,
          rate: null
        }, {
          time: null,
          price: null,
          rate: null
        }]
        if ((this.CorpPolicy.OrderRange & 1) > 0) {
          // 有机票权限
          if (this.CorpPolicy.IsNeedFltRC === 'F' || this.CorpPolicy.IsFltBooking === 'T') {
            // 无差旅政策  或者违规可预定
          } else {
            // 有差旅政策
            this.AirOrder.forEach((item, i) => {
              // 预定时间
              if ((new Date(item.TakeOffDate.replace('-', '/')).getTime() - new Date().getTime()) / (3600 * 24 * 1000) < this.CorpPolicy.FltPreBookDays) {
                console.log(' 预定日期早于规定最低时间 ')
                this.BreakPolicy.goSuccess = false
                this.BreakPolicy.List[i].time = '预定日期早于规定最低时间'
              }
              // 预定折扣
              if (this.CorpPolicy.IsFltDiscountRC === 'T' && item.Rate > this.CorpPolicy.FltDiscountRC) {
                console.log('机票价格超过规定折扣')
                this.BreakPolicy.goSuccess = false
                this.BreakPolicy.List[i].rate = '机票价格超过规定折扣'
              }
              // 最低价航班
              if (this.CorpPolicy.PreMinute === 60 && item.LowPrice < item.Price) {
                console.log('非当前时段最低价航班')
                this.BreakPolicy.goSuccess = false
                this.BreakPolicy.List[i].price = '非当前时段最低价航班'
              }
            })
          }
        } else {
          // 无预定权限
          this.BreakPolicy.goSuccess = false
        }
        this.$refs.policyinfo.setCorpPolicy(this.CorpPolicy)
      },
      /* 页面跳转 */
      goOther () {
        if (this.BreakPolicy.goSuccess) {
          window.sessionStorage.setItem('AirCorpPolicy', JSON.stringify(this.CorpPolicy))
          window.sessionStorage.setItem('AirPeople', JSON.stringify(this.List))
          this.$router.go('/air/reserve/' + this.$route.params.flightway + '/' + this.$route.params.from + '/index')
        }
      },
      setCard (obj) {
        obj.IDcard = {
          CardType: null,
          CardNumber: ''
        }
        if (obj.IDCardList.length > 0) {
          for (let i = 0; i < obj.IDCardList.length; i++) {
            if (obj.IDCardList[i].IsDefault === 'T') {
              obj.IDcard.CardNumber = obj.IDCardList[i].CardNumber
              obj.IDcard.CardType = obj.IDCardList[i].CardType
            }
          }
          if (obj.IDcard.CardType === null) {
            obj.IDcard.CardNumber = obj.IDCardList[0].CardNumber
            obj.IDcard.CardType = obj.IDCardList[0].CardType
          }
        }
      },
      /* 数据预设 */
      setCorpCost (item) {
        /* 中英文姓名预设 */
        item.ChooseName = 0
        item.CName = item.UserName
        item.EName = `${item.LastName ? item.LastName : ''} ${item.FirstName ? item.FirstName : ''}`
        if (item.EName === ' ') {
          item.EName = ''
        }
        if (item.CName === '') {
          item.UserName = item.EName
          item.ChooseName = 1
        }
        /* 证件预设 */
        this.setCard(item)
        /* 发送短信预设 */
        item.IsSendSMS = 1
        /* 费用归属预设 */
        item.CostChoose = {
          CostCenterListType: null,
          CostCenterListId: null,
          CostCenterListName: '',
          CostCenterGradeId: null,
          CostCenterGradeName: null,
          CorpCostCenterLevel: null,
          CostCenterListApprovalList: []
        }
        item.costList.forEach((obj) => {
          if (obj.CostCenterListApprovalList === null) {
            obj.CostCenterListApprovalList = []
          }
          if (item.DefaultCostCenter === obj.CostCenterListId) {
            item.CostChoose = obj
          }
        })
      },
      /* 政策列表去重 */
      setPolicyListUnique () {
        let PolicyList = []
        let PolicyIDlist = []
        for (let i = 0; i < this.List.length; i++) {
          PolicyIDlist.push(this.List[i].PolicyID)
          /* 参数预设 */
          this.setCorpCost(this.List[i])
        }
        PolicyIDlist = PolicyIDlist.unique()
        for (var j = 0; j < PolicyIDlist.length; j++) {
          for (var i = 0; i < this.List.length; i++) {
            if (this.List[i].PolicyID === PolicyIDlist[j]) {
              PolicyList.push({PolicyName: this.List[i].PolicyName, PolicyID: this.List[i].PolicyID, People: []})
              break
            }
          }
        }
        this.PolicyCenter.listUnique = PolicyList
        this.setPolicyPeople()
      },
      /* 设置每个政策列表人的姓名 */
      setPolicyPeople () {
        for (var i = 0; i < this.PolicyCenter.listUnique.length; i++) {
          for (var j = 0; j < this.List.length; j++) {
            if (this.List[j].PolicyID === this.PolicyCenter.listUnique[i].PolicyID) {
              console.log(this.List[j].UserName)
              this.PolicyCenter.listUnique[i].People.push(this.List[j].UserName)
            }
          }
        }
        /* 初始化差旅政策 */
        this.submitCorpPolicy(this.PolicyCenter.listUnique[0], 0)
      }
    }
  }
</script>
<style lang='less'>
  .m-air-choosepolicy{
    .vux-no-group-title{
      margin-top: 0;
    }
    width: 100%;
    border-radius: 3px;
  }
  .m-air-choosepolicy-policy{
    max-height:205px;
  }
  .m-air-choosepolicy-btn {
    border-top: 1px solid #f7f7f7;
    width: 100%;
    bottom: 0;
    background: #f7f7f7;
  }
  div.m-air-choosepolicy-header{
    background: #f7f7f7;
  }
</style>