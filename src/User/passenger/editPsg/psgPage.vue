<template>
<popup height="100%" :show.sync="popshow">
  <div class="pos-a w-psgpage">
    <psg-name :cname.sync="ChinaName" :ename.sync="EnglishName" :curname.sync="CurrentName"></psg-name>
    <psg-date :birth-date.sync="BirthDay"></psg-date>
    <p class="mt-2"></p>
    <psg-credent :cre-arr.sync="CredentArr" :cre-car-type.sync="CredentCarType"></psg-credent>
    <div class="pd-05 pos-r mt-5">
      <x-button type="primary" :disabled="isDisable" @click="savePsg">保存</x-button>
    </div>
  </div>
  <!-- err toast-->
  <alert :show.sync='showErr' title='' button-text='确定'>
    <p style='text-align:center;'>{{err}}</p>
  </alert>
  <toast :show.sync="showToast" :time="500" type="text">{{$route.path==='/user/passenger/add'?'保存成功':'编辑成功'}}</toast>
</popup>
</template>
<script>
import {XButton, Alert, Toast, Popup} from 'vux-c'
import PsgName from './sub/psgName'
import PsgDate from './sub/psgDate'
import PsgCredent from './sub/psgCredent'
import {CnameVaild, EnameVaild} from './sub/vaild.js'
export default {
  components: {
    XButton,
    Alert,
    PsgName,
    PsgDate,
    PsgCredent,
    Toast,
    Popup
  },
  data () {
    return {
      popshow: false,
      CurrentName: '1',
      ChinaName: '',
      EnglishName: '',
      firstname: '',
      middlename: '',
      lastname: '',
      BirthDay: '',
      CredentArr: [],
      CredentCarType: [],
      showErr: false,
      showToast: false,
      err: '',
      EDITDATA: JSON.parse(window.sessionStorage.getItem('editPassenger')) /* 存储的编辑人信息 */
    }
  },
  ready () {
    this.judgeState()
  },
  watch: {
    'CredentArr' (newVal, oldVal) {
    }
  },
  methods: {
    /* 状态判断 */
    judgeState () {
      this.popshow = true
      if (this.$route.path === '/user/passenger/edit') {
        this.init()
      }
    },
    /* 弹出错误信息 */
    Errfun (msg) {
      this.showErr = true
      this.err = msg
    },
    /* 编辑状态初始化 */
    init () {
      this.popshow = true
      ;[this.ChinaName, this.BirthDay, this.CredentCarType] =
      [this.EDITDATA.UserName, this.EDITDATA.Birthday, []]
      if (this.EDITDATA.IDCardList.length > 0) {
        this.CredentArr = this.EDITDATA.IDCardList
        for (let value of Object.values(this.EDITDATA.IDCardList)) {
          this.CredentCarType.push(value.CardType)
        }
      }
      this.EnglishName = this.EDITDATA.FullENName.replace('/', ' ')
      if (this.EDITDATA.UserName === '') {
        this.CurrentName = '2'
      } else {
      }
    },
    savePsg () {
      if (!this.CredentArr.length > 0) {
        this.Errfun('请填写证件信息')
      } else {
        console.log('savePsg')
        this.BasicValid()
      }
    },
    /* 基本信息验证 */
    BasicValid () {
      if (this.ChinaName === '' && this.EnglishName === '') {
        this.Errfun('中文名和英文名必须至少有一个不能为空')
        return
      } else {
        this.NeedCName()
      }
    },
    /* 军官证及身份证必须含中文名验证 */
    NeedCName () {
      let s = this.CredentCarType.indexOf(0)
      let p = this.CredentCarType.indexOf(2)
      if ((s !== -1 || p !== -1) && this.ChinaName === '') {
        this.Errfun('必须含有中文')
        return
      } else {
        this.nameFormatVaild()
      }
    },
    nameFormatVaild () {
      console.log('nameFormatVaild')
      /* 中文名 */
      let flag = false
      if (this.ChinaName !== '') {
        let res = CnameVaild(this.ChinaName)
        if (res !== true) {
          this.Errfun(res)
          flag = true
          return
        }
      }
      /* 英文名 */
      if (this.EnglishName !== '') {
        let res = EnameVaild(this.EnglishName)
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
      if (this.EnglishName.trim() !== '') {
        let arr = this.EnglishName.split(' ')
        this.lastname = arr[0]
        if (arr.length > 2) {
          this.firstname = arr[1] + ' ' + arr[2]
        } else {
          this.middlename = ''
          this.firstname = arr[1]
        }
      }
    },
    birthValid () {
      if (this.BirthDay === '' || this.BirthDay === null) {
        this.Errfun('请选择出生日期')
      } else {
        if (this.isIDcard()) {
          this.birthDateValid()
        } else {
          this.SavePsgList()
        }
      }
    },
    /* 是否存在身份证 */
    isIDcard () {
      // let s = this.CredentCarType.find((n) => n === 0)
      let s = this.CredentCarType.indexOf(0)
      if (s !== -1) {
        this.CredentArr[s].CardNumber.length === 18
        ? this.BirthSub = this.CredentArr[s].CardNumber.substr(6, 8)
        : this.BirthSub = this.CredentArr[s].CardNumber.substr(6, 6)
        return true
      }
      return false
    },
    /* 判断出生日期与身份证是否相符 */
    birthDateValid () {
      if (this.BirthSub.length === 8) {
        if (this.BirthDay.replace(/\-/g, '') !== this.BirthSub) {
          this.Errfun('出生日期与身份证不符')
        } else {
          this.SavePsgList()
        }
      } else if (this.BirthSub.length === 6) {
        if (('19' + this.BirthSub) !== this.BirthDay.replace(/\-/g, '')) {
          this.Errfun('出生日期与身份证不符')
        }
      }
    },
    SavePsgList () {
      this.isDisable = true
      this.$http.post(window.Miu.Data.ApiURL + '/User_1_0/SavePassengerList',
        {
          Passengers: [
            {
              IDCardList: this.CredentArr,
              Name: this.ChinaName,
              FirstName: this.firstname,
              MiddleName: this.middlename,
              LastName: this.lastname,
              MobilePhone: this.$route.path === '/user/passenger/add' ? '' : this.EDITDATA.Mobilephone,
              PassengerID: this.$route.path === '/user/passenger/add' ? 0 : this.EDITDATA.PassengerID,
              IsEmoloyee: this.$route.path === '/user/passenger/add' ? false : this.EDITDATA.IsEmoloyee,
              Birthday: this.BirthDay
            }
          ],
          authTkn: window.Miu.Data.Token
        }, {DisableLoading: true}
      ).then((res) => {
        if (res.status !== 411) {
          this.showToast = true
          const that = this
          setTimeout(function () {
            that.isDisable = false
            // that.popshow = true
            window.history.back()
          }, 500)
        }
      })
    }
  }
}
</script>
<style lang="less">
  .w-psgpage{
    top:0;bottom:0;height:100%;width:100%;
    background:#eee;
  }
</style>