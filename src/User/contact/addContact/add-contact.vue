<template>
<popup height="100%" :show.sync="show">
<div class="w-editContact pd-1">  
  <flexbox orient="vertical" class="w-bottom">
   <flexbox-item class="vux-1px-b" :class='{addErr:isErr1}' :errData.sync="err1">
     <x-input @change="name!==''?isErr1=false:''" placeholder="姓名" :value.sync="name"></x-input>
   </flexbox-item>
   <flexbox-item class="vux-1px-b" :class='{addErr:isErr2}' :errData.sync="err2">
     <x-input @change="tel!==''?isErr2=false:''" placeholder="手机号码" :value.sync="phone"></x-input>
   </flexbox-item>
   <flexbox-item>
    <flexbox>
      <flexbox-item>
        <x-button type="primary" @click="Valid">确定</x-button>
        <!-- <x-button class="w-editContact-btn" @click="Valid">确定</x-button> -->
      </flexbox-item>
      <flexbox-item>
        <x-button type="primary" @click="del">取消</x-button>
        <!-- <x-button class="w-editContact-btn" @click="close=false">取消</x-button> -->
      </flexbox-item>
    </flexbox>
   </flexbox-item>
  </flexbox>
</div>
</popup>
</template>
<script>
import {Group, XInput, XButton, Flexbox, FlexboxItem, Popup} from 'vux-c'
export default {
  components: {
    Group,
    XInput,
    XButton,
    Flexbox,
    FlexboxItem,
    Popup
  },
  data () {
    return {
      err: {
        errName: '',
        errPhone: ''
      },
      show: false,
      msg: '',
      name: '',
      phone: '',
      isErr1: false,
      isErr2: false,
      err1: '',
      err2: '',
      Err: ['请输入姓名', '姓名中不能包含特殊字符', '姓名格式錯誤', '请输入手机号码', '手机格式错误']
    }
  },
  ready () {
    this.judgeRouting()
  },
  watch: {
    // 'close' (newVal) {
    //   this.clear()
    // },
    // '$route.path' (newVal) {
    //   console.log(this.$route.path)
    //   this.judgeRouting()
    // }
  },
  methods: {
    clear () {
      this.name = ''
      this.phone = ''
      this.isErr1 = false
      this.isErr2 = false
    },
    del () {
      window.history.back()
    },
    judgeRouting () {
      if (this.$route.path === '/user/contact/add-contact') {
        this.show = true
      } else {
        this.show = false
      }
    },
    Valid () {
      if (this.name === '') {
        this.isErr1 = true
        this.err1 = this.Err[0]
      } else if (!(/[a-zA-Z0-9\u4E00-\u9FA5\uf900-\ufa2d]/.test(this.name))) {
        this.isErr1 = true
        this.err1 = this.Err[1]
      } else if (!/^[A-z]{2,16}$|^[\u4E00-\u9FA5]{2,4}$/.test(this.name)) {
        this.isErr1 = true
        this.err1 = this.Err[2]
      } else if (this.phone === '') {
        this.isErr2 = true
        this.err2 = this.Err[3]
      } else if (!((/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/).test(this.phone))) {
        this.isErr2 = true
        this.err2 = this.Err[4]
      } else {
        this.SavePassengerList()
      }
    },
    SavePassengerList () {
      this.$http.post(window.Miu.Data.ApiURL + '/User_1_0/SavePassengerList',
        {
          Passengers: [
            {
              IDCardList: [],
              Name: this.name,
              MobilePhone: this.phone,
              PassengerID: 0,
              IsEmoloyee: false,
              Type: 1
            }
          ],
          authTkn: window.Miu.Data.Token
        }
      ).then(function (response) {
        console.log(response.data)
        if (response.data.errorCode === '-1') {
          window.alert(response.data.errorMessage)
        } else {
          // this.close = false
          // this.save = 1
          window.history.back()
        }
      })
    }
  }
}
</script>