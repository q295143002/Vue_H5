<template>
<popup height="100%" :show.sync="popshow">
  <div class="w-editpsg">
    <flexbox v-if="popshow === true" orient="vertical" class="w-before">
      <!-- item1 -->
      <flexbox-item class="w-item1">
        <cell>
          <span class="first-name" slot="after-title">
          {{currentPsg.change===1?'中文姓名':'英文姓名'}}</span>
          <span slot="value" class="w-editpsg-explain" @click="currentPsg.showTip=true">填写说明</span>
        </cell>
        <flexbox class="w-Names">
          <flexbox-item :span="0.7">
            <!-- 中文名 -->
            <x-input v-if="currentPsg.change===1" placeholder="中文姓名" 
            :value.sync="currentPsg.Cname"></x-input>
            <!-- 英文名 -->
            <x-input v-if="currentPsg.change===0" placeholder="英文姓名"
            :value.sync="currentPsg.Ename">
            </x-input>
          </flexbox-item>
          <flexbox-item class="changeName">
            <span :class="{active: currentPsg.change === 1}" @click="currentPsg.change = 1">中文</span>
            <span :class="{active: currentPsg.change === 0}" @click="currentPsg.change = 0">英文</span>
          </flexbox-item>
        </flexbox>
      </flexbox-item>
      <!-- item2 -->
      <flexbox-item class="w-item2">
        <group>
          <datetime placeholder="出生日期" title="出生日期"  cancel-text="取消" confirm-text="确定" year-row="{value}年" month-row="{value}月" day-row="{value}日"
          :min-year="1900" :max-year="2016" :value.sync="currentPsg.Birthvalue" >
          </datetime>
        </group>
      </flexbox-item>
      <!-- item3 -->
      <flexbox-item class="w-item3">
        <flexbox class="w-item-first">
          <!-- 添加icon -->
          <flexbox-item class='w-add-icon'>
            <i class='iconfont icon-jiahao2fill w-addicon' @click='credent.showCredent=true'></i>
          </flexbox-item>
        </flexbox>
        <flexbox orient='vertical' v-for ='(index,item) in credent.credentArr'>
          <flexbox-item v-if ='item.length!==0'> 
            <flexbox class='w-editpsg-shadow' >
              <!-- 删除证件 -->
              <flexbox-item :span='2'>
                <i class='iconfont icon-guanbi2fill w-delicon' @click='del(index)'></i>
              </flexbox-item>
              <flexbox-item :span='8'>
                <p>{{item.CardType===9?'其他':credent.credentList[item.CardType]}}</p>
                <p style="color:#999;">{{item.CardNumber}}</p>
              </flexbox-item>
            </flexbox>
          </flexbox-item>
        </flexbox>
      </flexbox-item>
      <flexbox-item>
        <div class="pd-05">
          <x-button class="mt-3" type="primary" :disabled="isDisable" @click="save">保存</x-button>
        </div>
      </flexbox-item>
    </flexbox>
    <!-- 添加证件 -->
    <popup :show.sync='credent.showCredent' height="100%" style="background:#fff;">
      <div class="w-after-credent">
        <flexbox orient="vertical">
          <flexbox-item>
            <div><i @click="credent.showCredent=false" class="iconfont icon-guanbi1 fl-l"></i><span>添加证件</span></div>
          </flexbox-item>
          <flexbox-item>
            <group>
              <selector @change="changed()" :options='credent.credentList' :value.sync='credent.credentName'></selector>
            </group>
          </flexbox-item>
          <flexbox-item>
            <x-input class="vux-1px-b" type='text'
            :class='{credentErr:errorTerm.isCredentErr}' 
            :errData.sync="errorTerm.errdata"
            :placeholder="credent.credentName==='军官证'?credent.credentTip[1]:credent.credentTip[0]" 
            :value.sync='credent.credentNum'
            @change="credent.credentNum!==''?errorTerm.isCredentErr=false:''"></x-input>
          </flexbox-item>
          <flexbox-item>
            <x-button class="mt-3" @click="addCredentVaild">保存</x-button>
          </flexbox-item>
        </flexbox>
      </div>
    </popup>
    <!-- err toast-->
    <alert :show.sync='errorTerm.showErr' title='' button-text='确定'>
      <p style='text-align:center;'>{{errorTerm.err}}</p>
    </alert>
    <toast :show.sync="showToast1" :time="500" type="text">保存成功</toast>
    <toast :show.sync="showToast2" :time="500" type="text">编辑成功</toast>
    <!-- 填写说明 -->
    <div class="w-tip-name">
      <alert :show.sync="currentPsg.showTip" button-text='确定' title="输入提示">
        <div class="w-editpsg-tip">
          <p>1.请确保姓名与证件上的一致</p>
          <p>2.若用护照登机，请确保护照上有中文姓名</p>
          <p>3.中文姓名中的生僻字可用拼音代替，拼音之后不可再输入汉字，拼音后面的汉字都用拼音代替。如:"张燊林"可输入为:"张shenlin"</p>
          <p>4.姓名中如有".-"等特殊字符，不用输入。如"沙塔尔·买买提"可输入为"沙塔尔买买提"</p>
          <p>5.英文姓名总长度为55个字符，若过长请使用缩写。</p>
          <p>6.英文名填写说明:请按照lastname(姓),middleName(中间名),firstname(名)格式填写,之间用空格区分。如果姓名中有特殊字符".-()"等，可不用输入。
          如"steve p.(aul) jobs"输入为"jobs steve paul"。</p>
          <p>7.姓名过长时请使用缩写,如：Sheikn khalifa bin Zayed Alyle Nahyan 简写为Sheikh khalifa b Z A N;"买买提不拉多娜萨日娜阿诺凡"简写为"买买提不拉多娜萨日娜阿"</p>
        </div>
      </alert>
    </div>
  </div>
</popup>
</template>
<script>
import {Flexbox, FlexboxItem, XInput, XButton, Cell, Group, Datetime, Confirm, Selector, Popup, Alert, Toast} from 'vux-c'
import {CnameVaild, EnameVaild, IDVaild, PassportReg, OfficerReg} from './vaild.js'
export default {
  components: {
    Flexbox,
    FlexboxItem,
    XInput,
    XButton,
    Cell,
    Group,
    Datetime,
    Confirm,
    Selector,
    Popup,
    Alert,
    Toast
  },
  data () {
    return {
      popshow: false,
      showToast1: false,        /* 保存 */
      showToast2: false,        /* 编辑 */
      isDisable: false,         /* 是否禁用button */
      EDITDATA: JSON.parse(window.sessionStorage.getItem('editPassenger')), /* 存储的编辑人信息 */
      userinfo: window.Miu.Data.UserInfo,
      /* 当前页信息 */
      currentPsg: {
        showTip: false,         /* 弹出填写说明 */
        change: 1,              /* 中英文切换, 1为中文, 0为英文 */
        Cname: '',              /* 中文名 */
        Ename: '',              /* 完整英文名 */
        E_firstname: '',        /* 英文名拆分 (firstname, middlename, lastname) */
        E_middlename: '',
        E_lastname: '',
        Birthvalue: '请选择日期'
      },
      /* 证件 */
      credent: {
        showCredent: false,     /* 弹出添加证件框 */
        credentArr: [],         /* 证件数组 */
        credentList: ['身份证', '护照', '军官证', '回乡证', '港澳通行证', '台湾通行证', '其他'],
        credentName: '身份证',  /* 证件名(默认身份证) */
        credentNum: '',         /* 证件号 */
        credentArrCarType: [],  /* 存放证件CarType */
        credentTip: ['证件号码', '例：海字第XXXXXXXX号']  /* 动态placeholder */
      },
      /* 错误显示 */
      errorTerm: {
        showErr: false,          /* alert错误 */
        err: '',                 /* alert错误内容 */
        isCredentErr: false,     /* 证件错误 */
        errdata: '1231'          /* 证件错误内容 */
      },
      BirthSub: ''               /* 截取出生日期字符串 */
    }
  },
  ready () {
    this.judgeState()
  },
  watch: {
    'credent.showCredent' (newVal, oldVal) {
      [this.credent.credentName, this.credent.credentNum] =
      ['身份证', '']
    }
  },
  methods: {
    /* 状态判断 */
    judgeState () {
      this.popshow = true
      if (this.$route.path === '/user/passenger/editPsg') {
        this.init()
      }
    },
    /* 用于切换证件时做的改变 */
    changed () {
      this.credent.credentNum = ''
      this.errorTerm.isCredentErr = false
    },
    /* 编辑状态初始化 */
    init () {
      // this.popshow = true
      console.log(this.EDITDATA);
      [this.currentPsg.Cname, this.currentPsg.Birthvalue, this.credent.credentArrCarType] =
      [this.EDITDATA.UserName, this.EDITDATA.Birthday, []]
      if (this.EDITDATA.IDCardList.length > 0) {
        this.credent.credentArr = this.EDITDATA.IDCardList
        for (let value of Object.values(this.EDITDATA.IDCardList)) {
          this.credent.credentArrCarType.push(value.CardType)
        }
      }
      if (this.currentPsg.Cname === '') {
        this.currentPsg.change = 0
      }
      this.currentPsg.Ename = this.EDITDATA.FullENName.replace('/', ' ')
    },
    /* 再次添加证件时的初始化 */
    clear () {
      this.currentPsg.Cname = ''
      this.currentPsg.Birthvalue = '请选择日期'
      this.credent.credentName = ''
      this.credent.credentArr = []
      this.credent.credentName = '身份证'
      this.credent.credentNum = ''
      this.credent.credentArrCarType = []
    },
    /* 弹出错误信息 */
    Errfun (msg) {
      this.errorTerm.showErr = true
      this.errorTerm.err = msg
    },
    /* 证件错误 */
    credentErrfun (msg) {
      this.errorTerm.errdata = msg
      this.errorTerm.isCredentErr = true
    },
    /* 证件正确 */
    credentOK (card) {
      this.add(card)
      this.credent.showCredent = false
    },
    /**
     * 添加证件时验证
     * (if empty验证, else 证件格式验证)
     */
    addCredentVaild () {
      let CardType = this.credent.credentList.indexOf(this.credent.credentName)   /* 获取数字编号 */
      CardType === 6 ? CardType = 9 : ''
      if (this.credent.credentNum === '') {
        const name = this.credent.credentList[CardType]
        this.credentErrfun(`请填入${name}号码`)
      } else {
        this.errorTerm.isCredentErr = false
        this.isrepeatCredent(CardType)
      }
    },
     /* 判断是否重复添加证件 */
    isrepeatCredent (CardType) {
      if (this.credent.credentArrCarType.length > 0 && this.credent.credentArrCarType.indexOf(CardType) !== -1) {
        this.$root.Toast('证件类型重复')
      } else {
        this.credentVaild(CardType)
      }
    },
    /**
     * 6种证件验证
     * 身份证 18位校验规则 6位地址编码+8位出生日期+3位顺序号+1位校验位
     * 护照 (G12345678)
     * 军官证 (政字第00111206号, 海字第23475212号)
     * 回乡证 (H0946839900)
     * 台湾通行证 (T12345678)
     */
    credentVaild (CardType) {
      console.log(this.credent.credentNum)
      switch (CardType) {
        case 0 :
          if (this.credent.credentNum.length !== 18 && this.credent.credentNum.length !== 15) {
            this.credentErrfun('身份证长度不正确')
          } else {
            let msg = IDVaild(this.credent.credentNum, this.errorTerm.errdata, this.BirthSub)
            if (msg !== false) {
              this.BirthSub = msg
              this.credentOK(CardType)
            } else {
              this.credentErrfun('身份证格式不正确')
            }
          }
          break
        case 1 :
          !PassportReg.test(this.credent.credentNum) ? this.credentErrfun('护照格式不正确') : this.credentOK(CardType)
          break
        case 2 :
          !OfficerReg.test(this.credent.credentNum) ? this.credentErrfun('军官证格式不正确') : this.credentOK(CardType)
          break
        case 3 :
          !/^[mMhH]\d{10}$/.test(this.credent.credentNum) ? this.credentErrfun('回乡证格式不正确') : this.credentOK(CardType)
          break
        case 4 :
          !/^[a-zA-Z0-9]{2,21}$/.test(this.credent.credentNum) ? this.credentErrfun('港澳通行证格式不正确') : this.credentOK(CardType)
          break
        case 5 :
          !/^[a-zA-Z0-9]{8,10}$/.test(this.credent.credentNum) ? this.credentErrfun('台湾通行证格式不正确') : this.credentOK(CardType)
          break
        case 9 :
          this.credentOK(CardType)
          break
      }
    },
    /**
     * 添加证件
     */
    add (index) {
      var credentobj = {
        CardType: index,
        CardNumber: this.credent.credentNum,
        IsDefault: index === 0 ? 'T' : 'F',
        // CardPeriodStr: '',
        UID: this.userinfo.UID
      }
      this.credent.credentArr.push(credentobj)
      this.credent.credentArrCarType.push(index)
    },
    /**
     * 删除证件
     * index 索引
     */
    del (index) {
      this.credent.credentArr.splice(index, 1)
      this.credent.credentArrCarType.splice(index, 1)
    },
    /* 保存编辑信息并验证 */
    save () {
      if (!this.credent.credentArr.length > 0) {
        this.Errfun('请填写证件信息')
      } else {
        this.BasicValid()
      }
    },
    /**
     * 姓名格式验证
     * 中文名  中文姓名中的生僻字可用拼音代替，拼音之后不再有汉字,长度限制为26个
     * 英文名  限制长度为55  firstname lastname
     */
    /* 姓名格式验证 */
    nameFormatVaild () {
      /* 中文名 */
      let flag = false
      if (this.currentPsg.Cname !== '') {
        let res = CnameVaild(this.currentPsg.Cname)
        if (res !== true) {
          this.Errfun(res)
          flag = true
          return
        }
      }
      /* 英文名 */
      if (this.currentPsg.Ename !== '') {
        let res = EnameVaild(this.currentPsg.Ename, this.errorTerm.err)
        if (res !== true) {
          this.Errfun(res)
          flag = true
          return
        } else {
          this.spiltName()
        }
      }
      if (flag === false) {
        this.birthValid()
      }
    },
    /* 英文名拆分 */
    spiltName () {
      if (this.currentPsg.Ename.trim() !== '') {
        console.log(typeof this.currentPsg.Ename)
        let arr = this.currentPsg.Ename.split(' ')
        console.log(arr)
        this.currentPsg.E_lastname = arr[0]
        if (arr.length > 2) {
          this.currentPsg.E_firstname = arr[1] + ' ' + arr[2]
        } else {
          this.currentPsg.E_middlename = ''
          this.currentPsg.E_firstname = arr[1]
        }
      }
    },
    /* 基本信息验证 */
    BasicValid () {
      if (this.currentPsg.Cname === '' && this.currentPsg.Ename === '') {
        this.Errfun('中文名和英文名必须至少有一个不能为空')
        return
      } else {
        this.NeedCName()
      }
    },
    /* 军官证及身份证必须含中文名验证 */
    NeedCName () {
      const that = this
      const Type = this.credent.credentArrCarType
      let arr = []
      for (var k in Type) {
        if (Type[k] === 0 || Type[k] === 2) {
          arr.push(Type[k])
        }
      }
      if (arr.length > 0) {
        if (that.currentPsg.Cname === '') {
          that.Errfun('必须含有中文名')
          return
        } else {
          that.nameFormatVaild()
        }
      } else {
        that.nameFormatVaild()
      }
    },
    /* 判断是否存在身份证 */
    isIDcard () {
      for (var k in this.credent.credentArr) {
        if (this.credent.credentArr[k].CardType === 0) {
          this.credent.credentArr[k].CardNumber.length === 18
          ? this.BirthSub = this.credent.credentArr[k].CardNumber.substr(6, 8)
          : this.BirthSub = this.credent.credentArr[k].CardNumber.substr(6, 6)
          return true
        }
      }
      return false
    },
    /* 出生日期验证 */
    birthValid () {
      if (this.currentPsg.Birthvalue === '请选择日期' || this.currentPsg.Birthvalue === null) {
        this.Errfun('请选择出生日期')
      } else {
        if (this.isIDcard()) {
          this.birthDateValid()
        } else {
          this.$route.path === '/user/passenger/newPsg' ? this.savePsgInfo() : this.EditPsgInfo()
        }
      }
    },
    /* 判断出生日期与身份证是否相符 */
    birthDateValid () {
      if (this.BirthSub.length === 8) {
        if (this.currentPsg.Birthvalue.replace(/\-/g, '') !== this.BirthSub) {
          this.Errfun('出生日期与身份证不符')
        } else {
          this.$route.path === '/user/passenger/newPsg' ? this.savePsgInfo() : this.EditPsgInfo()
        }
      } else if (this.BirthSub.length === 6) {
        if (('19' + this.BirthSub) !== this.currentPsg.Birthvalue.replace(/\-/g, '')) {
          this.Errfun('出生日期与身份证不符')
        }
      }
    },
    /* 编辑出行人信息 */
    EditPsgInfo () {
      this.$http.post(window.Miu.Data.ApiURL + '/User_1_0/SavePassengerList',
        {
          Passengers: [
            {
              IDCardList: this.credent.credentArr,
              Name: this.currentPsg.Cname,
              FirstName: this.currentPsg.E_firstname,
              MiddleName: this.currentPsg.E_middlename,
              LastName: this.currentPsg.E_lastname,
              MobilePhone: this.EDITDATA.Mobilephone,
              PassengerID: this.EDITDATA.PassengerID,
              IsEmoloyee: this.EDITDATA.IsEmoloyee,
              Birthday: this.currentPsg.Birthvalue
            }
          ],
          authTkn: window.Miu.Data.Token
        }, {DisableLoading: true}
      ).then(function (response) {
        console.log(response.data)
        if (response.data.errorMessage === null && response.data.errorCode === null) {
          const that = this
          that.showToast2 = true
          setTimeout(function () {
            window.history.back()
          }, 500)
        }
      }, function (response) {
        console.log(response.data)
      })
    },
    /* 添加出行人 */
    savePsgInfo () {
      this.isDisable = true
      console.log(this.credent.credentArr)
      this.$http.post(window.Miu.Data.ApiURL + '/User_1_0/SavePassengerList',
        {
          Passengers: [
            {
              IDCardList: this.credent.credentArr,
              Name: this.currentPsg.Cname,
              FirstName: this.currentPsg.E_firstname,
              MiddleName: this.currentPsg.E_middlename,
              LastName: this.currentPsg.E_lastname,
              PassengerID: 0,
              IsEmoloyee: false,
              Birthday: this.currentPsg.Birthvalue,
              Type: 0
            }
          ],
          authTkn: window.Miu.Data.Token
        }, {DisableLoading: true}
      ).then(function (response) {
        if (response.data.errorMessage === null && response.data.errorCode === null) {
          const that = this
          that.showToast1 = true
          setTimeout(function () {
            that.isDisable = false
            window.history.back()
          }, 500)
        }
      }, function (response) {
        this.isDisable = false
        this.$root.Toast(response.data.errorMessage)
      })
    }
  }
}
</script>
<style lang="less">
  @import '../../../styles/user/passenger/editpsg.less';
</style>