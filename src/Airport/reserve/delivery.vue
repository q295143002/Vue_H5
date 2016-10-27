<template>
<group>
  <switch title="报销凭证" :value.sync='show'></switch>
  <cell 
    v-show='show' 
    :title='Address.value.RecipientName + " " + Address.value.Mobile' 
    is-link 
    :inline-desc ='
    Address.value.ProvinceName + " "+
    Address.value.CityName + " " +
    Address.value.CantonName + " " +
    Address.value.Address'
    @click='showDelivery'>
  </cell>
</group>
<dialog :show.sync='Address.show' >
  <tab>
    <tab-item v-for ='option in Address.list.Methods' @click = 'Address.ChooseDeliveryType = option.DeliveryType' :selected='Address.ChooseDeliveryType === option.DeliveryType'>{{option.DeliveryName}}</tab-item>
  </tab>
  <div class="pb-05">
      <div style="height:200px; overflow-x:hidden; overflow-y: scroll" class="ta-l">
        <group title='请选择配送地址'>
          <!-- 即时配送 -->
          <div v-if='Address.ChooseDeliveryType===0'>
            <cell 
              @click='chooseDispatch(show,0)'
              is-link
              :title='show.RecipientName + " " + show.Mobile' 
              v-for='show in Address.list.JsAddressList' 
              :inline-desc="show.ProvinceName + ' ' + show.CityName + ' ' + show.CantonName + ' ' + show.Address">
            </cell>
           </div>
           <!-- 定期配送 -->
           <div v-if='Address.ChooseDeliveryType===1'>
             <cell 
             is-link
             @click='chooseDispatch(show,1)'
             :title='show.RecipientName + " " + show.Mobile' 
             v-for='show in Address.list.CorpAddressList' 
             :inline-desc="show.ProvinceName + ' ' + show.CityName + ' ' + show.CantonName + ' ' + show.Address"></cell>
           </div>
           <!-- 自取 -->
           <div v-if='Address.ChooseDeliveryType===2'>
             <cell 
             is-link
             @click='chooseDispatch(show,2)'
             :title='show.Address' 
             v-for='show in Address.list.ZqAddress' 
             :inline-desc="show.Phone"></cell>
           </div>
        </group>
      </div>
    </div>
</dialog>
<toast type='toast.type' show.sync='toast.show'>{{toast.text}}</toast>
</template>
<script>
import { Radio, Toast, Group, Popup, Switch, Cell, XButton, Flexbox, FlexboxItem, Icon, Dialog, Tab, TabItem } from 'vux-c'
export default {
  components: {
    Tab,
    TabItem,
    Dialog,
    Icon,
    Flexbox,
    FlexboxItem,
    XButton,
    Cell,
    Switch,
    Group,
    Popup,
    Radio,
    Toast
  },
  data () {
    return {
      step: 0,
      /* 配送 */
      show: false,
      Address: {
        list: {},
        show: false,
        /* 选择配送方式 */
        ChooseDeliveryType: '0',
        options: [],
        value: {
          RecipientName: '请选择地址'
        }
      },
      toast: {
        text: '',
        show: false,
        type: 'cancel'
      },
      Add: {
        show: false
      }
    }
  },
  props: {
    DeliveryData: Object
  },
  ready () {
    this.getDeliveryTypes()
  },
  methods: {
    showDelivery () {
      this.Address.show = true
    },
    changeChooseDeliveryType () {
      console.log(this.Address.ChooseDeliveryType)
    },
    /* 配送地址 */
    getDeliveryTypes () {
      this.$http({
        method: 'GET',
        url: window.Miu.Data.ApiURL + '/User_1_0/GetDeliveryTypes',
        params: {
          token: window.Miu.Data.Token
        }
      }).then(function (response) {
        this.Address.list = response.data
        this.$set('Address.ChooseDeliveryType', response.data.Methods[0].DeliveryType)
        for (var i = 0; i < this.Address.list.CorpAddressList.length; i++) {
          if (this.Address.list.CorpAddressList[i].IsDefault) {
            this.Address.value = this.Address.list.CorpAddressList[i]
          }
        }
        this.getMemberDeliverList()
      }, function (response) {
        console.log(response)
      })
    },
    /* 即时配送列表 */
    getMemberDeliverList () {
      this.$http({
        method: 'GET',
        url: window.Miu.Data.ApiURL + '/User_1_0/GetMemberDeliverList',
        params: {
          token: window.Miu.Data.Token
        }
      }).then(function (response) {
        for (var i = 0; i < response.data.delivers.length; i++) {
          response.data.delivers[i].CantonName = response.data.delivers[i].Canton_Name
        }
        this.$set('Address.list.JsAddressList', response.data.delivers)
      }, function (response) {
        console.log(response)
      })
    },
    /* 选取地址 */
    chooseDispatch (obj, from) {
      console.log(from)
      this.Address.value = obj
      this.Address.show = false
      // this.$parent.pageRoute()
    },
    getDeliveryData () {
      switch (this.show) {
        case true:
          if (this.Address.value.RecipientName === '请选择地址') {
            this.$parent.ToastText('请选择配送地址')
            return
          }
          this.DeliveryData = {
            DeliverType: +this.Address.ChooseDeliveryType,
            RecipientName: this.Address.value.RecipientName,
            Province: this.Address.value.ProvinceId,
            Address: this.Address.value.Address,
            City: this.Address.value.CityId,
            Canton: this.Address.value.CantonId,
            Mobile: this.Address.value.Mobile,
            ZipCode: this.Address.value.ZipCode,
            AddID: this.Address.value.AddID,
            Phone: this.Address.value.Phone,
            IsNeed: 1
          }
          break
        case false:
          this.DeliveryData = {
            Address: '',
            RecipientName: '',
            Tel: '',
            ZipCode: '',
            AddID: 0,
            Canton: 0,
            City: 0,
            DeliverType: -1,
            IsNeed: -1,
            Province: 0
          }
          break
      }
    }
  }
}
</script>
