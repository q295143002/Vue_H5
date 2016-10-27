<template>
	<group>
    <cell title='登机人' class='vux-1px-b'></cell>
    <flexbox v-for ='item in List' @click='EditListItem(item, $index)' class='vux-1px-b pt-05 pb-05'>
      <flexbox-item :span='2'>
        <span class="m-customerhead mg-center">{{item.UserName.slice(0, 1)}}</span>
      </flexbox-item>
      <flexbox-item :span='10' >
        <b>{{item.UserName}}</b><br>
        <div class='color-gray-middle'>
          <small v-if='item.IDcard.CardNumber===""' class="theme-color-red">请添加身份信息</small>
          <small v-else>{{item.IDcard.CardType|IDshow}}:{{item.IDcard.CardNumber}}</small>
        </div>
        <div class='color-gray-middle'> 
          <small v-if='item.CostChoose.CostCenterListName===""' class="theme-color-red">请选择费用归属</small>
          <small v-else>费用归属：{{item.CostChoose.CostCenterListName}}</small>
        </div>
        <div class='color-gray-middle'>
          <small>{{item.IsSendSMS===0?"不发送预定短信":"发送预定短信"}}</small>
        </div>
      </flexbox-item>
    </flexbox>
  </group>
  <customer-info v-ref:listitem :info-item.sync='ListItem'></customer-info>
</template>
<script>
import CustomerInfo from './customer-info'
import { Icon, Group, Cell, FlexboxItem, Flexbox, Popup, ButtonTab, ButtonTabItem, Selector, Dialog, XButton } from 'vux-c/'
export default {
  components: {
    CustomerInfo,
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
    FlexboxItem
  },
  props: {
    List: Array
  },
  filters: {
    'IDshow' (obj) {
      switch (obj) {
        case 0: return '身份证'
        case 1: return '护照'
        case 2: return '军官证'
        case 3: return '回乡证'
        case 4: return '港澳通行证'
        case 5: return '台湾通行证'
        case 9: return '其他'
      }
    }
  },
  data () {
    return {
      LiseIndex: null,
      ListItem: {},
      ListClone: []
    }
  },
  methods: {
    EditListItem (item, index) {
      this.ListItem = item
      this.ListIndex = index
      this.$parent.$parent.pageRoute('Customer')
    },
    SubmitItem (obj) {
      console.log(JSON.stringify(obj))
      this.List.$set(this.ListIndex, obj)
      this.$parent.setApprovalUnique(true)
      this.$parent.$parent.pageRoute()
    }
  }
}
</script>