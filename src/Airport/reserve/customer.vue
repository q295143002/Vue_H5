<template>
  <!-- 乘客列表 -->
  <customer-list :list.sync = 'List' v-ref:list></customer-list>
  <!-- 选择审批列表 -->
  <customer-approval 
  :show.sync ='Approval.show' 
  :result.sync = 'Approval.result' 
  :approval-list = 'Approval.list' 
  :list.sync ='List' 
  v-ref:approval>
  </customer-approval>
  <!-- 选择出行政策 -->
</template>
<script>
  import { Icon, Group, Cell, FlexboxItem, Flexbox, Popup, ButtonTab, ButtonTabItem, Selector, Dialog, XButton } from 'vux-c/'
  import CustomerApproval from './customer/customer-approval'
  import CustomerList from './customer/customer-list'
  export default {
    components: {
      CustomerList,
      XButton,
      Icon,
      Dialog,
      Selector,
      ButtonTab,
      ButtonTabItem,
      Popup,
      Group,
      Cell,
      Flexbox,
      FlexboxItem,
      CustomerApproval
    },
    props: {
      CustomerData: Array,
      ApprovalData: Object
    },
    data () {
      return {
        /* 乘客列表 */
        List: JSON.parse(window.sessionStorage.getItem('AirPeople')),
        /* 费用中心 */
        CorpCost: {
          show: false,
          list: [],
          Selector: []
        },
        /* 公司差旅政策 */
        CorpPolicy: {},
        /* 差旅政策 */
        PolicyCenter: {
          choose: 0,
          show: false,
          PolicyID: null,
          listUnique: []
        },
        /* 审批中心 */
        Approval: {
          type: ['免审', '出行审批', '违规审批'],
          show: false,
          list: [],
          result: {}
        }
      }
    },
    events: {
      'getCustomer' () {
        this.setCorpCostData()
      }
    },
    methods: {
      /* 复制乘客信息 */
      setCustomerData (obj) {
        let cardType = null
        let cardNumber = ''
        var costID = null
        var CcValue = ''
        if (obj.CostChoose) {
          CcValue = obj.CostChoose.CostCenterListName
          costID = obj.CostChoose.CostCenterListId
        }
        if (obj.IDcard) {
          cardType = obj.IDcard.CardType
          cardNumber = obj.IDcard.CardNumber
        }
        return {
          BirthDate: obj.Birthday,
          Name: obj.UserName,
          Mobile: obj.Mobilephone,
          IsSendSMS: obj.IsSendSMS,
          PassengerID: obj.PassengerID,
          AgeType: 1,
          OrderInsurances: [],
          CardNumber: cardNumber,
          CardType: cardType,
          CorpUID: obj.UID,
          CostCenterItems: [{
            CcIndex: 1,
            costID: costID,
            CcValue: CcValue
          }],
          NationalityCode: 'CN',
          NationalityName: '中国大陆'
        }
      },
      /* 设置政策 */
      setCorpPolicy (plc) {
        this.CorpPolicy = plc
      },
      /* 审批列表去重 */
      setApprovalUnique (bool, num) {
        let ApprovalList = []
        let ApprovalId = []
        this.Approval.list = []
        for (let i = 0; i < this.List.length; i++) {
          if (this.List[i].CostChoose.CostCenterListId != null) {
            ApprovalList.push(this.List[i].CostChoose)
            ApprovalId.push(this.List[i].CostChoose.CostCenterListId)
          }
        }
        ApprovalId = ApprovalId.unique()
        let ListTemp = []
        for (let j = 0; j < ApprovalId.length; j++) {
          for (let i = 0; i < ApprovalList.length; i++) {
            if (ApprovalId[j] === ApprovalList[i].CostCenterListId) {
              ListTemp.push(ApprovalList[i])
              break
            }
          }
        }
        this.$set('Approval.list', ListTemp)
        console.log('init')
        this.$refs.approval.reachApproval(ListTemp, num)
      },
      returnFalse (text) {
        this.$parent.ToastText(text)
        return
      },
      /* 刷新数据 */
      getCustomerData () {
        this.setCustomerShow()
      },
      /* 设置customerdata */
      setCustomerShow () {
        this.CustomerData = this.List.map(this.setCustomerData)
        this.vailCustomerData()
      },
      /* 验证customerdata */
      vailCustomerData () {
        if (this.CustomerData.length < 1) {
          this.returnFalse('乘客列表为空，请刷新页面重新选择')
        } else {
          console.log(JSON.stringify(this.CustomerData))
          for (let i = 0; i < this.CustomerData.length; i++) {
            if (this.CustomerData[i].Name === '' || !this.CustomerData[i].Name) {
              this.returnFalse('请设置乘客' + (i + 1) + '的姓名')
            } else if (this.CustomerData[i].Mobile === '' || !this.CustomerData[i].Mobile) {
              if (this.CustomerData[i].IsSendSMS === 1) {
                this.returnFalse('请设置' + this.CustomerData[i].Name + '的联系电话')
              }
            } else if (this.CustomerData[i].CardNumber === '') {
              this.returnFalse('请设置' + this.CustomerData[i].Name + '的身份信息')
            }
          }
        }
      },
      getApprovalData () {
        console.log('getApprovalData')
        console.log(this.Approval.result)
        this.ApprovalData = this.Approval.result
        this.vailApprovalData()
      },
      vailApprovalData () {
        console.log(this.ApprovalData)
        if (!this.ApprovalData.hasOwnProperty('Success')) {
          this.returnFalse('请设置成本中心')
        }
      }
    }
  }
</script>
<style>
  .m-customerhead{
    width: 2.8rem;
    height: 2.8rem;
    font-weight: bold;
    display: block;
    background: #1885fc;
    text-align: center;
    color: #fff;
    line-height: 2.8rem;
    font-size: 1.2rem;
    border-radius: 50%;
  }
</style>