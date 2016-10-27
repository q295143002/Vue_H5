<template>
<popup height="100%" :show.sync="showpop">
  <div class="bg-white" style="overflow:auto;height:100%;">
  <flexbox orient="vertical" class="w-newadd">
    <flexbox-item :class='{addErr:errStyle.isaddErr0}' :errData.sync="errData.errData0">
      <x-input placeholder="收件人"
      @change="RecipientName!==''?errStyle.isaddErr0=false:''"
      :value.sync="RecipientName" >
      </x-input>
    </flexbox-item>
    <flexbox-item :class='{addErr:errStyle.isaddErr1}' :errData.sync="errData.errData1">
      <x-input placeholder="联系方式"
      @change="phone_num!==''?errStyle.isaddErr1=false:''"  
      :value.sync="phone_num">
      </x-input>
    </flexbox-item>
    <flexbox-item>
      <flexbox @click="showPCC = true">
        <flexbox-item class="pos-r">
          <x-input placeholder="省" v-ref:input4
          :readonly="true"
          :value.sync="ProvinceName">
          </x-input>
          <i v-if="showProerr===true&&$refs.input4.valid===false" 
          class="iconfont icon-tishifill w-newadd-tip"></i>
        <!-- </group> -->
        </flexbox-item>
        <flexbox-item class="pos-r">
          <x-input placeholder="市" v-ref:input5
          :readonly="true"
          :value.sync="CityName">
          </x-input>
          <i v-if="showProerr===true&&$refs.input5.valid===false"
          class="iconfont icon-tishifill w-newadd-tip"></i>
        </flexbox-item>
        <flexbox-item class="pos-r">
          <x-input placeholder="区" v-ref:input6
          :readonly="true"
          :value.sync="CantonName">
          </x-input>
          <i v-if="showProerr===true&&$refs.input6.valid===false"
          class="iconfont icon-tishifill w-newadd-tip"></i>
        </flexbox-item>
      </flexbox>
    </flexbox-item>
    <flexbox-item :class='{addErr:errStyle.isaddErr2}' :errData.sync="errData.errData2">
      <x-input placeholder="详细地址"
      @change="Detail_add!==''?errStyle.isaddErr2=false:''" 
      :required="true" 
      :value.sync="Detail_add">
      </x-input>
    </flexbox-item>
    <flexbox-item :class='{addErr:errStyle.isaddErr3}' :errData.sync="errData.errData3">
      <x-input placeholder="邮编"
      @change="ZipCode!==''?errStyle.isaddErr3=false:''" 
      :required="true"
      :value.sync="ZipCode">
      </x-input>
    </flexbox-item>
    <flexbox-item class="noBottom">
      <div class="pd-05">
      <x-button type="primary" @click="beforeSaveVaild">确定</x-button>
      </div>
    </flexbox-item>
  </flexbox>
  </flexbox>
  <slide-picker @on-submit="savePCC"
  :show.sync="showPCC" :data='listPCC' :column ="3" :value.sync="value4">
  </slide-picker>
  <!-- Toast -->
  <toast :show.sync="Toast.success" type="text">保存成功</toast>
  <loading :show="showLoad"></loading>
  </div>
</popup>
</template>
<script>
import {Flexbox, FlexboxItem, XInput, XButton, XHeader, Group, Cell, Radio, Alert, Badge, Toast, PopupPicker, Picker, Loading, Popup, Address} from 'vux-c'
import SlidePicker from '../../../Public/SlidePicker'
import showPCCName from '../showPCCName.js'
// import {add} from '../address.js'
export default {
  components: {
    Flexbox,
    FlexboxItem,
    XInput,
    XButton,
    XHeader,
    Group,
    Cell,
    Radio,
    Alert,
    Badge,
    Toast,
    PopupPicker,
    Picker,
    SlidePicker,
    Loading,
    Popup,
    Address
  },
  ready () {
    this.showpop = true
    // this.init()
    console.log(this.$route.name)
    // console.log(window.sessionStorage.getItem('PCC'))
    if (this.$route.name === '编辑地址') {
      this.editInit()
    }
  },
  filters: {
    showPCCName
  },
  data () {
    return {
      showpop: false,
      userinfo: window.Miu.Data.UserInfo,
      edit: JSON.parse(window.sessionStorage.getItem('Editaddd')),
      showProerr: false,
      Toast: {
        success: false,
        showLoad: false
      },
      errStyle: {
        isaddErr0: false,
        isaddErr1: false,
        isaddErr2: false,
        isaddErr3: false
      },
      errData: {
        errData0: '',
        errData1: '',
        errData2: '',
        errData3: ''
      },
      errStr: ['请输入收件人', '请输入收件人手机号码', '请输入详细地址', '请输入邮编'],
      AddID: '',
      ProvinceID: '',
      CityID: '',
      CantonID: '',
      ProvinceName: '',
      CityName: '',
      CantonName: '',
      RecipientName: '',  /* 收件人 */
      phone_num: '',  /* 联系方式 */
      Detail_add: '',  /* 详细地址 */
      ZipCode: '',  /* 邮编 */
      showPCC: false,
      listPCC: JSON.parse(window.sessionStorage.getItem('PCC')),
      value4: [],
      data: []
      /* JSON.parse(window.sessionStorage.getItem('PCC')) */
    }
  },
  watch: {
    '$route.path' (newVal, oldVal) {
      if (this.$route.path === '/user/address/newadd') {
        this.clear()
        console.log('2')
      }
    }
  },
  methods: {
    savePCC () {
      console.log(this.value4, 'q')
      this.ProvinceID = this.value4[0].replace(/P/, '')
      this.CityID = this.value4[1].replace(/C/, '')
      this.CantonID = this.value4[2].replace(/X/, '')
      if (this.CantonID.indexOf('--') !== -1) {
        this.CantonID = 0
      }
      console.log(arr)
      let arr = showPCCName(this.value4, this.listPCC)
      ;[this.ProvinceName, this.CityName, this.CantonName] = arr.split(' ')
      this.CantonName === '' ? this.CantonName = ' ' : ''
      console.log(this.ProvinceName, this.CityName, this.CantonName)
      console.log(this.ProvinceID, this.CityID, this.CantonID)
    },
    /* 编辑页初始化设置 */
    editInit () {
      [
        this.AddID, this.RecipientName, this.phone_num,
        this.ProvinceName, this.CityName, this.CantonName,
        this.Detail_add, this.ZipCode, this.ProvinceID,
        this.CityID, this.CantonID
      ] = [
        this.edit.AddID, this.edit.RecipientName, this.edit.Mobile,
        this.edit.ProvinceName, this.edit.CityName, this.edit.Canton_Name,
        this.edit.Address, this.edit.ZipCode, this.edit.Province,
        this.edit.City, this.edit.Canton
      ]
      this.CantonName === null ? this.CantonName = ' ' : ''
    },
    /* 添加页初始化设置 */
    clear () {
      [
        this.RecipientName, this.phone_num, this.ProvinceName,
        this.CityName, this.CantonName, this.Detail_add,
        this.ZipCode, this.ProvinceID, this.CityID,
        this.CantonID
      ] = [''];
      [
        this.showProerr, this.showCityerr, this.showCantonerr,
        this.errStyle.isaddErr0, this.errStyle.isaddErr1,
        this.errStyle.isaddErr2, this.errStyle.isaddErr3
      ] = [false]
    },
    isEmpty (i) {
      // console.log('empty' + i)
      // console.log(this.$refs.input4.valid)
      if (i < 4) {
        this.errStyle['isaddErr' + i] = true
        this.errData['errData' + i] = this.errStr[i]
      } else {
        this.showProerr = true
      }
    },
    beforeSaveVaild () {
      let valueArr = [this.RecipientName, this.phone_num, this.Detail_add,
      this.ZipCode, this.ProvinceName, this.CityName, this.CantonName]
      let that = this
      /**
       * 验证规则
       * 中文2到5个字
       * 英文1到20个字符
       */
      const nameREG = /(^[\u4E00-\u9FA5]{2,5}(?:·[\u4E00-\u9FA5]{2,5})*$)|(^[a-zA-Z ]{1,20}$)/
      for (var k in valueArr) {
        // console.log(k, v)
        if (valueArr[k] === '' || valueArr[k] === undefined) {
          that.isEmpty(k)
          // console.log(v)
          return
        } else if (k !== 'unique' && k !== 'removeRepeatAttr') {
          switch (k) {
            case 0 :
              if (!valueArr[k].match(nameREG)) {
                this.errStyle.isaddErr0 = true
                this.errData.errData0 = '姓名格式不正确'
                return
              } else if (valueArr[k].length > 26) {
                this.errStyle.isaddErr0 = true
                this.errData.errData0 = '姓名长度最多为26个字符'
              }
              break
            case 1 :
              if (!(/^1[3|4|5|7|8]\d{9}$/.test(valueArr[k]))) {
                this.errStyle.isaddErr1 = true
                this.errData.errData1 = '手机格式不正确'
                return
              }
              break
            case 2:
              break
            case 3 :
              if (!/^[1-9]\d{5}(?!\d)$/.test(valueArr[k])) {
                this.errStyle.isaddErr3 = true
                this.errData.errData3 = '邮编格式不正确'
                return
              }
              break
            default :
              break
          }
          console.log(typeof k)
          k === '6' ? this.SaveMemberDeliver() : console.log('no')
        }
      }
    },
    /**
     * 保存编辑配送地址
     * AddID 为0时为添加新地址
     */
    SaveMemberDeliver () {
      this.$http.post(window.Miu.Data.ApiURL + '/User_1_0/SaveMemberDeliver', {
        'AddID': this.$route.path === '/user/address/newadd' ? 0 : this.AddID,
        'UID': this.userinfo.UID,
        'RecipientName': this.RecipientName,
        'Province': this.ProvinceID,
        'City': this.CityID,
        'Canton': this.CantonID,
        'Address': this.Detail_add,
        'ZipCode': this.ZipCode,
        'Tel': null,
        'Mobile': this.phone_num,
        'CityName': this.CityName,
        'ProvinceName': this.ProvinceName,
        'Canton_Name': this.CantonName,
        'authTkn': window.Miu.Data.Token
      }).then((response) => {
        console.log(response.data)
        // window.history.back()
      }, (response) => {
        console.log(response.data)
        if (response.data.errorMessage === '成功' && response.data.errorCode === '0') {
          window.history.back()
        }
      })
    }
  }
}
</script>
<style lang="less">
  // @import '../../../styles/user/address/newadd.less';
  .w-newadd.vux-flexbox{
    padding: 0 15px;
    box-sizing: border-box;
    .vux-flexbox-item{
      border-bottom: 1px solid #ccc;
      height:3.5rem;
      .weui_cell{
        padding: 5px 0;
        line-height: 4.5rem;
      }
      &.noBottom:last-child{
        padding-top: 2rem;
        border-bottom: none;
      }
      .weui_cell_ft{
        display:none;
      }
    } 
  }
  .w-newadd.vux-flexbox .vux-flexbox-item.addErr{
    border-bottom-color:red;
    position: relative;
    &:after{
      content:attr(errData);
      position:absolute;
      bottom:-1.4rem;
      font-size: 80%;
      color:red;
    }
  }
  .w-newadd-tip{
    display:block;
    width:1rem;
    height: 1rem;
    position: absolute;
    color:red;
    right:10px;
    bottom:15px;
  }
</style>