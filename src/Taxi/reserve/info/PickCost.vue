<template>
  <group>
    <cell 
      v-for='item in List' 
      track-by='$index' 
      @click ='checkItem(item,$index)'
      :title ='item.CostCenterListName' 
      >
      <icon type='success' slot='icon' class='mr-05' v-if ='$index === ChooseIndex'></icon>
      <icon type='circle' slot='icon' class='mr-05' v-else></icon>
    </cell>
  </group>
  <toast  type="text" :show.sync = 'toast.show'  width="18rem">{{toast.text}}</toast>
</template>
<script>
  import { Flexbox, FlexboxItem, Group, Icon, Popup, Cell, XButton, Toast } from 'vux-c/'
  export default {
    components: {
      Toast,
      FlexboxItem,
      Flexbox,
      XButton,
      Group,
      Icon,
      Popup,
      Cell
    },
    props: {
      result: Object
    },
    data () {
      return {
        List: [],
        ChooseIndex: null,
        toast: {
          show: false,
          text: ''
        }
      }
    },
    ready () {
      this.getCostCenterList()
    },
    methods: {
      getCostCenterList () {
        this.$http({
          method: 'GET',
          url: window.Miu.Data.ApiURL + '/Approval_1_0/GetCostCenterList',
          params: {
            token: window.Miu.Data.Token,
            corpId: window.Miu.Data.UserInfo.CorpID,
            uId: window.Miu.Data.UserInfo.UID
          }
        }).then(function (response) {
          this.List = response.data.result
          for (var i = 0; i < this.List.length; i++) {
            if (window.Miu.Data.UserInfo.DefaultCostCenter === this.List[i].CostCenterListId) {
              this.ChooseIndex = i
              this.result = this.List[i]
              break
            }
          }
        }, function (response) {
          console.log(response)
        })
      },
      checkItem (item, index) {
        this.ChooseIndex = index
        this.result = item
        this.$emit('on-close')
      }
    }
  }

</script>