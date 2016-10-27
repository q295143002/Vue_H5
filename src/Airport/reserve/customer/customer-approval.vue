<template>
    <group>
      <cell title='选择成本中心'></cell>
      <cell 
        v-for = 'item in ApprovalList' 
        :title='item.CostCenterListName' 
        track-by='$index'
        @click ='CheckApproval(item, true)'>
        <icon slot='icon' class='mr-05' type='success' v-if ='item.CostCenterListId === chooseItem.CostCenterListId'></icon>
        <icon slot='icon' class='mr-05' type='circle' v-else></icon>
      </cell>
      <cell v-if='result.Success !== undefined' :title ='result.Success?"该订单需要审批":"该订单不需要审批"' :inline-desc="result.Success?'审批人:' + result.Message:''"></cell>
    </group>
</template>
<script>
  import { Popup, Cell, Icon, Group, Flexbox, FlexboxItem, XButton } from 'vux-c'
  export default {
    components: {
      Flexbox,
      FlexboxItem,
      XButton,
      Group,
      Popup,
      Cell,
      Icon
    },
    props: {
      show: Boolean,
      List: Array,
      ApprovalList: Array,
      result: Object
    },
    data () {
      return {
        chooseItem: {},
        IsOutOfLine: 0
      }
    },
    methods: {
      init (Arr) {
        console.log('havent')
        if (Arr.length > 0) {
          this.choose(Arr[0])
        }
      },
      reachApproval (Arr) {
        let has = false
        this.ApprovalList.forEach((item, index) => {
          if (item === this.chooseItem) {
            has = true
            console.log('has')
            this.choose(Arr[index])
          }
        })
        if (!has) {
          this.$set('result', {})
          this.init(Arr)
        }
      },
      choose (item) {
        this.CheckApproval(item)
      },
      CheckApproval (item, bool) {
        let dataItem = {
          passengersList: [],
          corpId: window.Miu.Data.UserInfo.CorpID,
          costCenterType: item.CostCenterListType,
          creatUID: window.Miu.Data.UserInfo.UID,
          appId: 0,
          authTkn: window.Miu.Data.Token,
          feetype: 0,
          costCenterId: item.CostCenterListId
        }
        for (let i = 0; i < this.List.length; i++) {
          dataItem.passengersList.push({
            CostCenterType: this.List[i].CostChoose.CostCenterListType,
            CustomerName: this.List[i].UserName,
            IsOutOfLine: this.IsOutOfLine,
            CustomerUID: this.List[i].CorpUID,
            CostCenter: this.List[i].CostChoose.CostCenterListName,
            CostCenterId: this.List[i].CostChoose.CostCenterListId,
            DepartmentName: this.List[i].CostChoose.CostCenterListApprovalList[0] ? this.List[i].CostChoose.CostCenterListApprovalList[0].DeptName : null
          })
        }
        for (let i = 0; i < dataItem.passengersList.length; i++) {
          if (dataItem.passengersList[i].CostCenterId === null) {
            if (bool) {
              this.$parent.$parent.ToastText('请选择' + dataItem.passengersList[i].CustomerName + '的费用归属')
            }
            return false
          }
        }
        this.httpApproval(dataItem, item)
      },
      httpApproval (dataItem, item) {
        this.$http.post(window.Miu.Data.ApiURL + '/Approval_1_0/CheckApproval', dataItem).then(function (response) {
          response.data.result.costCenterId = dataItem.costCenterId
          response.data.result.costCenterType = dataItem.costCenterType
          response.data.result.creatUID = dataItem.createUID
          this.$set('result', response.data.result)
          this.$parent.$parent.ApprovalText = response.data.result.Success
          this.chooseItem = item
        }, function (response) {
          this.$parent.$parent.ToastText('出现错误，无法设置审批中心,请重试')
        })
      }
    }
  }
</script>