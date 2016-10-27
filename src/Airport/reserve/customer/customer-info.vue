<template>
<popup height='100%' :show.sync='ItemShow' style='overflow-y:scroll'>
  <div v-if='CustomerItem'>
    <group>
      <x-input 
        :show-clear="false"
        :placeholder='placeholder'
        :required=false
        :value.sync='CustomerItem.UserName'
      >
      <div  slot="right">
        <icon type ='info' class='fl-l mr-05 ml-05' style='line-height:32px' @click ='alert = true'></icon>
          <button-tab>
            <button-tab-item 
              @click= 'CustomerItem.ChooseName = 0'
              :selected = 'CustomerItem.ChooseName === 0'>
              <span class='pd-05'>中文</span>
            </button-tab-item>
            <button-tab-item @click= 'CustomerItem.ChooseName = 1'
              :selected = 'CustomerItem.ChooseName === 1'>
              <span class='pd-05'>英文</span>
            </button-tab-item>
        </button-tab>
        </div>
      </x-input>
      <x-input 
        type ='number'
        placeholder='手机号码' 
        :required=false 
        :value.sync='CustomerItem.Mobilephone'
      ></x-input>
      <switch title='发送预定短信' :value.sync='SendSMS'></switch>
    </group>
    <group>
      <datetime 
        :value.sync='CustomerItem.Birthday' 
        title='出生日期' 
        :min-year=1950 
        :max-year=2003 
        confirm-text='确定' 
        cancel-text='取消'
      ></datetime>
    </group>
    <group>
      <cell 
        v-for='card in CustomerItem.IDCardList' 
        @click='chooseIDcard($index, card)' 
        :title='card.CardType|IDshow' 
        :inline-desc='card.CardNumber' 
        track-by ='$index'>
        <icon type='success' slot='icon' v-if='chooseCard === $index' class='mr-05'></icon>
        <icon type='circle' slot='icon' v-else class='mr-05'></icon>
      </cell>
      <cell title='点击添加证件' is-link @click='addCard.show=true'>
        <icon class='m-add mr-05' type='cancel' slot='icon'></icon>
      </cell>
    </group>
    <group>
      <cell 
        title='费用归属'  
        @click ='costShow = true' 
        v-if='CustomerItem.CostChoose' 
        :value.sync= 'CustomerItem.CostChoose.CostCenterListName' 
        is-link>
        {{CustomerItem.CostChoose.CostCenterListName?"":"请选择"}}
      </cell>
    </group>
    <div class='pd-1'>
      <x-button type='primary' @click='vailEdit'>保存</x-button>
    </div>
  </div>
  <add-card :show.sync ='addCard.show'></add-card>
  <dialog :show.sync= 'costShow'>
    <div class="pd-05 ta-l">
      <div style="height:300px;overflow-y:scroll">
        <group>
          <cell 
          v-if = 'CustomerItem.costList'
          v-for='costItem in CustomerItem.costList' 
          :title='costItem.CostCenterListName' 
          @click='setCost(costItem)'>
            <icon  class='mr-05' :type='costItem.CostCenterListId === CustomerItem.CostChoose.CostCenterListId?"success":"circle"'></icon>
          </cell>
        </group>
      </div>
      <x-button type='primary' class='mt-05'  @click ='costShow = false'>确定</x-button>
    </div>
  </dialog>
  <alert :show.sync="alert" button-text='确定' title="输入提示">
    <div class="ta-l" style="max-height:300px;overflow-y: scroll">
      1.请确保姓名与证件上的一致<br>
      2.若用护照登机，请确保护照上有中文姓名<br>
      3.中文姓名中的生僻字可用拼音代替，拼音之后不可再输入汉字，拼音后面的汉字都用拼音代替。如:"张燊林"可输入为:"张shenlin"<br>
      4.姓名中如有".-"等特殊字符，不用输入。如"沙塔尔·买买提"可输入为"沙塔尔买买提"<br>
      5.英文姓名总长度为55个字符，若过长请使用缩写。<br>
      6.英文名填写说明:请按照lastname(姓),middleName(中间名),firstname(名)格式填写,之间用空格区分。如果姓名中有特殊字符".-()"等，可不用输入。<br>
      如"steve p.(aul) jobs"输入为"jobs steve paul"。<br>
      7.姓名过长时请使用缩写,如：Sheikn khalifa bin Zayed Alyle Nahyan 简写为Sheikh khalifa b Z A N;"买买提不拉多娜萨日娜阿诺凡"简写为"买买提不拉多娜萨日娜阿"<br>
    </div>
  </alert>
</popup>

</template>
<script>
  import { Radio, Selector, Datetime, XInput, Switch, XButton, ButtonTab, ButtonTabItem, Popup, Icon, Group, Cell, Flexbox, FlexboxItem, PopupPicker, Dialog, Toast, Alert } from 'vux-c/'
  import AddCard from './customer-info/AddCard'
  export default {
    components: { Radio, Selector, Datetime, XInput, Switch, XButton, ButtonTab, ButtonTabItem, Popup, Icon, Group, Cell, Flexbox, FlexboxItem, PopupPicker, Dialog, Toast, AddCard, Alert },
    data () {
      return {
        placeholder: '',
        ItemShow: false,
        addCard: {
          show: false
        },
        alert: false,
        index: null,
        SendSMS: true,
        CustomerItem: {},
        InfoSetting: {},
        costShow: false,
        chooseCard: null
      }
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
    watch: {
      'CustomerItem.ChooseName' (num) {
        switch (num) {
          case 0: this.placeholder = '中文姓名'
            this.CustomerItem.UserName = this.CustomerItem.CName
            break
          case 1: this.placeholder = '英文名'
            this.CustomerItem.UserName = this.CustomerItem.EName
            break
        }
      },
      'SendSMS' (bool) {
        switch (bool) {
          case true: this.CustomerItem.IsSendSMS = 1
            console.log(true)
            break
          case false: this.CustomerItem.IsSendSMS = 0
            return false
        }
      },
      'ItemShow' () {
        console.log('show.customer')
        if (this.ItemShow === true) {
          console.log('open')
          this.CustomerItem = this.cloneItem(this.InfoItem)
          this.chooseCard = null
          console.log(this.CustomerItem.IsSendSMS)
          switch (this.CustomerItem.IsSendSMS) {
            case 0: this.SendSMS = false
              break
            case 1: this.SendSMS = true
              break
          }
          for (var i = 0; i < this.CustomerItem.IDCardList.length; i++) {
            if (this.CustomerItem.IDCardList[i].CardNumber === this.CustomerItem.IDcard.CardNumber && this.CustomerItem.IDCardList[i].CardType === this.CustomerItem.IDcard.CardType) {
              this.chooseCard = i
            }
          }
        }
      }
    },
    props: {
      InfoItem: Object
    },
    methods: {
      cloneItem (obj) {
        var result = {}
        for (let key in obj) {
          result[key] = obj[key]
        }
        return result
      },
      /* 确认编辑个人信息 */
      submitEdit () {
        console.log(this.CustomerItem)
        if (this.CustomerItem.IDCardList.length === 1) {
          this.chooseIDcard(0, this.CustomerItem.IDCardList[0])
        }
        this.$parent.SubmitItem(this.CustomerItem)
      },
      /* 验证个人信息 */
      vailEdit () {
        console.log(/[^\w\s]+/ig.test(this.CustomerItem.UserName))
        if (this.CustomerItem.UserName === '') {
          this.$root.Toast('请输入用户名')
          return
        }
        /* 英文名检测 */
        if (this.CustomerItem.ChooseName === 1 && /[^\w\s]+/ig.test(this.CustomerItem.UserName) === true) {
          this.$root.Toast('乘客姓名不能包含特殊字符')
          return
        }
        /* 中文名检测 */
        if (this.CustomerItem.ChooseName === 0 && /[^\w\s\u4E00-\u9FA5]+/ig.test(this.CustomerItem.UserName) === true) {
          this.$root.Toast('乘客姓名不能包含特殊字符')
          return
        }
        if (!this.CustomerItem.Mobilephone && this.CustomerItem.IsSendSMS === 1) {
          console.log('vailnum')
          this.$root.Toast('请输入手机号码')
          return
        }
        if (this.CustomerItem.Birthday === null) {
          this.$root.Toast('请选择出生日期')
          return
        }
        if (this.CustomerItem.IDcard.CardNumber === '') {
          this.$root.Toast('请设置身份证件')
          return
        }
        if (this.CustomerItem.CostChoose.CostCenterListId === null) {
          this.$root.Toast('请设置费用归属')
          return
        }
        this.submitEdit()
      },
      chooseIDcard (index, item) {
        this.chooseCard = index
        this.CustomerItem.IDcard.CardType = item.CardType
        this.CustomerItem.IDcard.CardNumber = item.CardNumber
      },
      setCost (item) {
        this.CustomerItem.CostChoose = item
      }
    },
    events: {
      'push-idcard' (obj) {
        console.log(obj)
        this.CustomerItem.IDCardList.push({
          CardType: +obj.cardType,
          CardNumber: obj.cardNumber
        })
        this.chooseIDcard((this.CustomerItem.IDCardList.length - 1), this.CustomerItem.IDCardList[this.CustomerItem.IDCardList.length - 1])
      }
    }
  }

</script>
