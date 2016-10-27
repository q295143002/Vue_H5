<template>
  <div >
    <flexbox orient='vertical' class='w-userinfo' style='width:100%;background:#eee;'>
      <flexbox-item class='w-info-head'>
        <flexbox orient='vertical'>
          <!-- <flexbox-item><i class='iconfont arrow-left'></i>修改个人信息</flexbox-item> -->
          <x-header class="w-userinfo-back" :left-options="{showBack: true,backText:'&nbsp;&nbsp;修改个人信息'}"></x-header>
          <flexbox-item>
            <div class='w-info-logo'>
              <!-- <span style='border-radius:50%;background:#fff;width:4rem;height:4rem;display:block'> -->
                <img style='border-radius:50%;background:#fff;width:4rem;height:4rem;display:block' :src="'data:image/png;base64,'+logo"/>
              <!-- </span> -->
            </div>
          </flexbox-item>
          <flexbox-item class='w-info-name' ><div v-text='UserName'></div></flexbox-item>
        </flexbox>
      </flexbox-item>
      <flexbox-item class='w-userinfo-shadow w-userinfo-item'>
        <x-input placeholder='中文姓名' :value.sync='CHname'></x-input>
        <x-input placeholder='英文姓名' :value.sync='ENname'></x-input>
        <x-input placeholder='邮箱' :value.sync='myemail'></x-input>
      </flexbox-item>
      <flexbox-item class='w-userinfo-shadow'>
        <flexbox orient='vertical'>
          <flexbox-item class='vux-1px-b'>
            <group>
              <datetime title='出生日期' class='w-userinfo-datetime' :value.sync='mybirth' :min-year='1900' ></datetime>
              <p class='w-info-top'>{{mybirth}}</p>
            </group>
          </flexbox-item>
          <flexbox-item @click='showFree=true'>
            <p class='w-info-top-title'>默认费用</p>
            <p class='w-info-top'>{{free}}</p>
          </flexbox-item>
        </flexbox>
      </flexbox-item>
      <!-- 证件icon -->
      <flexbox-item>
        <flexbox>
          <!-- 添加icon -->
          <flexbox-item class='w-credent-add-icon' style=''>
            <i class='iconfont icon-jiahao2fill w-info-credentT' @click='showCredent=true'></i>
          </flexbox-item>
        </flexbox>
        <flexbox class='w-info-addCredent' orient='vertical' v-for ='(index,item) in credentArr'>
          
          <flexbox-item class='w-info-addCredent-item' v-if ='item.length!==0'> 
            <flexbox class='w-userinfo-shadow' >
              <!-- 删除证件 -->
              <flexbox-item :span='2'>
                <i class='iconfont icon-guanbi2fill w-info-credentF' @click='del(index)'></i>
              </flexbox-item>
              <flexbox-item :span='8'>
                <p>{{credentList[item.CardType]}}</p>
                <p>{{item.CardNumber}}</p>
              </flexbox-item>
            </flexbox>
          </flexbox-item>
        </flexbox>
      </flexbox-item>
      <flexbox-item @click='save'>
        <x-button plain class='w-info-btn'>保存</x-button>
      </flexbox-item>
    </flexbox>
    <!-- 默认费用 -->
    <div v-if='showFree'>
      <dialog :show.sync='showFree'>
      <flexbox class='w-info-free' orient='vertical'>
        <flexbox-item class='w-info-title'>费用归属</flexbox-item>
        <flexbox-item v-for='item in freeArr' @click='free = item.ItemValue' track-by='ID'>
          <div @click='showFree=false' class='w-info-item'>{{item.ItemValue}}</div>
        </flexbox-item>
      </flexbox>
      </dialog >
    </div>
    <!-- 添加证件 -->
    <div class='w-add-Crendent'>
      <confirm  :show.sync='showCredent' title='添加证件' confirm-text='' cancel-text='' 
      @on-confirm='add'>
        <group>
          <selector :options='credentList' :value.sync='credentName'></selector>
        </group>
        <x-input :class='{credentErr:isCredentErr}' :errData.sync="errdata" type='text' placeholder='证件号码' :value.sync='credentNum'></x-input>
        <br>
        <x-button @click = "showCredent = false">取消</x-button>
        <x-button @click="addCredentVaild">正确</x-button>
      </confirm>
    </div>
    <!-- err toast-->
    <alert :show.sync='showErr' title='' button-text='确定'>
      <p style='text-align:center;'>{{err}}</p>
    </alert>
    <div class='w-cover' v-if='showErr'></div>
  </div>
</template>
<script>
import {XHeader, Flexbox, FlexboxItem, XInput, Group, Datetime, XButton, Popup, Confirm, Selector, Toast, Cell, Alert, Dialog} from 'vux-c'
export default {
  components: {
    XHeader,
    Flexbox,
    FlexboxItem,
    XInput,
    Group,
    Datetime,
    XButton,
    Popup,
    Confirm,
    Selector,
    Toast,
    Cell,
    Alert,
    Dialog
  },
  data () {
    return {
      free: '默认成本中心',
      showFree: false,
      showCredent: false,
      showErr: false,
      emailCheck: false,
      err: '',
      userinfo: window.Miu.Data.UserInfo,
      logo: '',
      UserName: '',
      isCredentErr: false,   /* 是否显示证件错误样式 */
      errdata: '1213',       /* 显示证件错误文字 */
      credentNum: '',
      CHname: '',
      ENname: '',
      mybirth: '1981-01-01',
      myemail: '',
      freeArr: '',
      credentList: ['身份证', '护照', '军官证', '回乡证', '港澳通行证', '台湾通行证', '其他'],
      credentName: '身份证',
      credentArr: [],
      credentArrNum: []
    }
  },
  ready () {
    this.GetCorpCost()
    this.init()
  },
  methods: {
    init () {
      var str = JSON.parse(window.localStorage.getItem('USERINFO'))
      this.UserName = str.UserName
      this.logo = str.Logo
      this.CHname = str.UserName
      this.ENname = str.FirstName + str.MiddleName + str.LastName + ''
      this.mybirth = str.Birthday
      this.myemail = str.Email
      str.IDCardList !== null ? this.credentArr = str.IDCardList : ''
    },
    /**
     * 添加证件时验证
     * (if empty验证, else 证件格式验证)
     */
    addCredentVaild () {
      var CardType = this.credentList.indexOf(this.credentName)   /* 获取数字编号 */
      if (window.Miu.Trim(this.credentNum) === '') {
        this.isCredentErr = true
        this.errdata = '请填入' + this.credentList[CardType] + '号码'
      } else {
        this.isCredentErr = false
        this.isrepeatCredent(CardType)
      }
    },
     /* 判断是否重复添加证件 */
    isrepeatCredent (CardType) {
      if (this.credentArrNum.length > 0 && this.credentArrNum.indexOf(CardType) !== -1) {
        window.alert('证件类型重复')
      } else {
        this.credentVaild(CardType)
      }
    },
    /**
     * 6种证件验证
     * 军官证 (政字第00111206号)
     * 回乡证 (H0946839900)
     */
    credentVaild (CardType) {
      switch (CardType) {
        case 0 :
          /^\d{6}(18|19|20)?\d{2}(0[1-9|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(window.Miu.Trim(this.credentNum)) ? this.isCredentErr = false : this.isCredentErr = true
          break
        case 1 :
          /^1[45][0-9]{7}|G[0-9]{8}|P[0-9]{7}|S[0-9]{7,8}|D[0-9]+$/.test(window.Miu.Trim(this.credentNum)) ? this.isCredentErr = false : this.isCredentErr = true
          break
        case 2 :
          /^[a-zA-Z0-9]{2,21}|南字第(\d{8})号|北字第(\d{8})号|沈字第(\d{8})号|兰字第(\d{8})号|成字第(\d{8})号|济字第(\d{8})号|广字第(\d{8})号|海字第(\d{8})号|空字第(\d{8})号|参字第(\d{8})号|政字第(\d{8})号|后字第(\d{8})号|装字第(\d{8})号$/.test(window.Miu.Trim(this.credentNum)) ? this.isCredentErr = false : this.isCredentErr = true
          break
        case 3 :
          /^[mMhH]\d{10}$/.test(window.Miu.Trim(this.credentNum)) ? this.isCredentErr = false : this.isCredentErr = true
          break
        case 4 :
          /^[a-zA-Z0-9]{2,21}$/.test(window.Miu.Trim(this.credentNum)) ? this.isCredentErr = false : this.isCredentErr = true
          break
        case 5 :
          /^[a-zA-Z0-9]{8,10}$/.test(window.Miu.Trim(this.credentNum)) ? this.isCredentErr = false : this.isCredentErr = true
          break
      }
      if (this.isCredentErr === true) {
        this.errdata = this.credentList[CardType] + '格式错误'
      } else {
        this.add(CardType)
        this.showCredent = false
      }
    },
    /**
     * 添加证件
     */
    add (index) {
      var credentobj = {
        CardType: index,
        CardNumber: this.credentNum,
        IsDefault: index === 0 ? 'T' : 'F',
        CardPeriodStr: '',
        UID: this.userinfo.UID
      }
      this.credentArr.$set(this.credentArr.length, credentobj)
      this.credentArrNum.push(index)
    },
    /**
     * 删除证件
     * index 索引
     */
    del (index) {
      this.credentArr.splice(index, 1)
    },
    save () {
      if (!this.credentArr.length > 0) {
        this.showErr = true
        this.err = '请填写证件信息'
      } else if (window.Miu.Trim(this.CHname) === '') {
        this.showErr = true
        this.err = '姓名不能为空'
      } else {
        this.UpdatePersonInfo()
      }
    },
    // IdentityCodeValid (code) {
    //   var city = {
    //     11: '北京',
    //     12: '天津',
    //     13: '河北',
    //     14: '山西',
    //     15: '内蒙古'
    //   }
    // },
    UpdatePersonInfo () {
      /**
       * CardType
       * 0:身份证
       * 1:护照
       * 2:军官证
       * 3:回乡证
       * 4:港澳通行证
       * 5:台湾通行证
       * 6:其他
       */
      this.$http({
        method: 'POST',
        url: window.Miu.Data.ApiURL + '/User_1_0/UpdatePersonalInformation',
        data: {
          'UserName': this.CHname,
          'FirstName': this.ENname,
          'MiddleName': '',
          'LastName': '',
          'Gender': this.userinfo.Gender,
          'Country': this.userinfo.Country,
          'Birthday': this.mybirth,
          'Email': this.myemail,
          'DefaultCostCenter': '',
          'IDCardList': this.credentArr,
          'authTkn': window.Miu.Data.Token
        }
      }).then(function (response) {
        console.log(response.data)
        if (response.data.errorMessage === null && response.data.Success === true) {
          window.alert('保存信息成功')
          this.ReGetUserLoginInfo()
        }
      }, function (response) {
        console.log(response.data)
      })
    },
    /**
     * 获取成本中心列表
     */
    GetCorpCost () {
      var that = this
      this.$http({
        method: 'Get',
        url: window.Miu.Data.ApiURL + '/User_1_0/GetCorpCost',
        data: {token: window.Miu.Data.Token}
      }).then(function (response) {
        // console.log(response.data)
        that.freeArr = response.data.costs[0].SelectItem
      }, function (response) {
        console.log(response.data)
      })
    },
    /**
     * 更新修改后的用户信息
     */
    ReGetUserLoginInfo () {
      this.$http({
        methods: 'GET',
        url: window.Miu.Data.ApiURL + '/User_1_0/GetUserLoginInfo',
        data: {token: window.Miu.Data.Token}
      }).then(function (response) {
        console.log(response.data)
        window.localStorage.removeItem('USERINFO')
        window.localStorage.setItem('USERINFO', JSON.stringify(response.data))
      }, function (response) {
        console.log(response.data)
      })
    }
  }
}
</script>
<style lang='less'>
  @import '../../styles/user/userinfo/userinfo.less';
  div.dp-container {
    position: absolute;
    width: 80%;
    left: 0;bottom: 0;right: 0;top: 0;
    height: 20rem;
    margin: auto;
    border-radius: 5px;
    z-index: 10000;
    background-color: #fff;
  }
  div.weui_dialog_confirm .weui_dialog .weui_dialog_hd{
    text-align: left;
  }
</style>