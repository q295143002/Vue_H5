<template>
  <dialog :show.sync="show" class='m-reserveorder'>
    <h3 class="pt-1 theme-color-blue">选择预定类型</h3>
    <group class= 'ta-l' >
      <cell 
      title="因公，为本人预定" 
      @click='toSelf()' 
      :inline-desc = 'CorpPolicy.PolicyName + "," + PolicySelf.text' 
      is-link></cell>
      <cell 
      title="因公，为他人/多人预定" 
      @click='toOther()' 
      :inline-desc.sync= 'PolicyOther.text'
      is-link></cell>
    </group>
  </dialog>
</template>
<script>
  import { Cell, Group, Dialog } from 'vux-c'
  export default {
    components: {
      Cell, Group, Dialog
    },
    props: {
      AirOrder: Array
    },
    data () {
      return {
        show: false,
        CorpPolicy: {},
        PolicySelf: {
          text: '',
          active: true,
          list: [],
          toast: '无法预定,请联系管理员修改您的权限'
        },
        PolicyOther: {
          toast: '',
          text: '',
          active: true
        },
        List: [],
        selfData: window.Miu.Data.UserInfo
      }
    },
    methods: {
      open () {
        this.$root.GetUserInfo(() => {
          this.getCorpPolicy(this.selfData.PolicyID)
        })
      },
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
          this.show = true
          this.setCorpPolicy()
        })
      },
      /* 设置差旅文案 */
      setCorpPolicy () {
        /* 参数初始化 */
        this.PolicySelf = {
          text: '',
          active: true,
          toast: '无法预定,请联系管理员修改您的权限',
          title: '',
          list: []
        }
        this.PolicyOther = {
          toast: '',
          text: '',
          active: true
        }
        /* 文本显示 */
        var that = this
        var PreBook = function () {
          if (that.CorpPolicy.FltPreBookDays > 0 && that.CorpPolicy.FltPreBookRC === 'T') {
            return '提前' + that.CorpPolicy.FltPreBookDays + '天预定'
          } else {
            return '不限制预定天数'
          }
        }
        var IsNeeedRc = function () {
          if (that.CorpPolicy.IsFltBooking === 'T') {
            return '违规可预定'
          } else {
            return '不可违规预定'
          }
        }
        var PreMinute = function () {
          if (that.CorpPolicy.PreMinute === 60) {
            return '出发时间前后' + that.CorpPolicy.PreMinute + '分钟内最低价航班'
          } else {
            return ''
          }
        }
        var Discount = function () {
          if (that.CorpPolicy.IsFltDiscountRC === 'T') {
            return that.CorpPolicy.FltDiscountRC + '折及以下航班'
          } else {
            return '无折扣限制'
          }
        }
        var Insurance = function () {
          if (that.CorpPolicy.Insurance === 'T') {
            return '允许买保险'
          } else {
            return '不允许买保险'
          }
        }
        /* 设置规则 */
        if ((this.CorpPolicy.OrderRange & 1) > 0) {
          /* 为自己 */
          if (this.CorpPolicy.IsNeedFltRC === 'F') {
            this.PolicySelf.text = '无差旅规则'
            console.log('1x')
          } else {
            /* 违规预定 */
            this.PolicySelf.text = PreBook() + '，' + PreMinute() + '，' + Discount() + '，' + Insurance() + '，' + IsNeeedRc() + '。'
            if (this.CorpPolicy.IsFltBooking === 'F') {
              this.setPolicySelfRule()
            }
            console.log('2x')
          }
          /* 为他人 */
          if (this.CorpPolicy.PID === 0 || this.selfData.OrderForSelf === 0) {
            this.PolicyOther.text = '请选择出行人'
            console.log('4x')
          } else {
            this.PolicyOther = {
              text: '您无为他人预定国内机票的权限，请通知管理员修改您的差旅政策',
              active: false
            }
            console.log('5x')
          }
        } else {
          /* 无机票权限 */
          this.PolicySelf = {
            text: '请通知管理员修改您的差旅政策',
            toast: '无法预定，请联系管理员修改您的权限',
            list: [],
            title: '无预定国内机票权限',
            active: false
          }
          this.PolicyOther = {
            text: '您无为他人预定国内机票的权限，请通知管理员修改您的差旅政策',
            toast: '无法预定，请联系管理员修改您的权限',
            active: false
          }
        }
      },
      toOther () {
        switch (this.PolicyOther.active) {
          case true: this.$router.go('/air/passenger/' + this.$route.params.FlightWay + '/other/index')
            break
          case false: this.$root.Alert('当前差旅政策不允许为他人预定', '请联系管理员修改您的权限')
            break
        }
      },
      toSelf () {
        switch (this.PolicySelf.active) {
          case true: this.selfData.CorpUID = this.selfData.UID
            this.GetCostCenterList(this.selfData)
            break
          case false : this.$root.Alert(this.PolicySelf.title, this.PolicySelf.toast, '确定', this.PolicySelf.list)
            break
        }
      },
      goSelf () {
        this.List[0] = this.selfData
        window.sessionStorage.setItem('AirCorpPolicy', JSON.stringify(this.CorpPolicy))
        window.sessionStorage.setItem('AirPeople', JSON.stringify(this.List))
        this.$router.go('/air/reserve/' + this.$route.params.FlightWay + '/self/index')
      },
      GetCostCenterList (obj) {
        this.$http.post(window.Miu.Data.ApiURL + '/Approval_1_0/GetCostCenterList', {
          'corpId': window.Miu.Data.UserInfo.CorpID,
          'uid': window.Miu.Data.UserInfo.UID,
          'authTkn': window.Miu.Data.Token
        }).then(function (response) {
          obj.costList = response.data.result
          obj.costList.forEach((item) => {
            if (item.CostCenterListApprovalList === null) {
              item.CostCenterListApprovalList = []
            }
          })
          this.setCorpCost()
        }, function (response) {
          console.log(response.data)
        })
      },
      setCorpCost () {
        /* 中文名预设 */
        this.selfData.ChooseName = 0
        this.selfData.CName = this.selfData.UserName
        this.selfData.EName = this.selfData.EName = `${this.selfData.LastName ? this.selfData.LastName : ''} ${this.selfData.FirstName ? this.selfData.FirstName : ''}`
        if (this.selfData.EName === ' ') {
          this.selfData.EName = ''
        }
        if (this.selfData.CName === '') {
          this.selfData.UserName = this.selfData.EName
          this.selfData.ChooseName = 1
        }
        /* 证件预设 */
        this.selfData.IDcard = {}
        if (this.selfData.IDCardList[0]) {
          this.selfData.IDcard.CardNumber = this.selfData.IDCardList[0].CardNumber
          this.selfData.IDcard.CardType = this.selfData.IDCardList[0].CardType
        } else {
          this.selfData.IDcard.CardNumber = ''
          this.selfData.IDcard.CardType = null
        }
        /* 发送短信预设 */
        this.selfData.IsSendSMS = 1
        /* 费用归属预设 */
        this.selfData.CostChoose = {
          CostCenterListType: null,
          CostCenterListId: null,
          CostCenterListName: '',
          CostCenterGradeId: null,
          CostCenterGradeName: null,
          CorpCostCenterLevel: null,
          CostCenterListApprovalList: []
        }
        this.selfData.IsNeedFltRC = this.CorpPolicy.IsNeedFltRC
        for (let j = 0; j < this.selfData.costList.length; j++) {
          if (this.selfData.DefaultCostCenter === this.selfData.costList[j].CostCenterListId && this.selfData.costList[j].CostCenterListApprovalList !== null) {
            this.selfData.CostChoose = this.selfData.costList[j]
            if (this.selfData.CostChoose.CostCenterListApprovalList === null) {
              this.selfData.CostChoose.CostCenterListApprovalList = []
            }
          }
        }
        this.goSelf()
      },

      /*  不允许违规预定 */
      setPolicySelfRule () {
        // 预定日期违规
        this.PolicySelf.title = '不可违规预定'
        this.PolicySelf.toast = '您的差旅政策不支持违规预订:'
        if ((new Date(this.AirOrder[0].TakeOffDate).getTime() - new Date().getTime()) / (3600 * 24 * 1000) < this.CorpPolicy.FltPreBookDays && this.CorpPolicy.FltPreBookRC === 'T') {
          console.log(' 预定日期早于规定最低时间 ')
          this.PolicySelf.list.push('预定日期早于规定最低时间')
          this.PolicySelf.active = false
        }
        // 预定折扣违规
        if (this.CorpPolicy.IsFltDiscountRC === 'T') {
          this.AirOrder.every((i) => {
            if (i.Rate >= this.CorpPolicy.FltDiscountRC) {
              console.log('机票价格超过规定折扣')
              this.PolicySelf.list.push('机票价格超过规定折扣')
              this.PolicySelf.active = false
              return false
            }
          })
        }
        // 最低价航班
        if (this.CorpPolicy.PreMinute === 60) {
          this.AirOrder.every((a) => {
            if (a.LowPrice < a.Price) {
              console.log('非当前时段最低价航班')
              this.PolicySelf.list.push('非当前时段最低价航班')
              this.PolicySelf.active = false
              return false
            }
          })
        }
      }
    }
  }
</script>