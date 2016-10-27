<template>
<popup height="100%" :show.sync="show">
  <div class="w-editContact">
  	<flexbox orient="vertical" class="pt-1 pb-1 bg-white w-bottom">
     <flexbox-item class="vux-1px-b" :class='{addErr:isErr1}' :errData.sync="err1">
       <x-input @change="$route.params.name!==''?isErr1=false:''" placeholder="姓名" :value.sync="$route.params.name"></x-input>
     </flexbox-item>
     <flexbox-item class="vux-1px-b" :class='{addErr:isErr2}' :errData.sync="err2">
       <x-input @change="$route.params.tel!==''?isErr2=false:''" placeholder="手机号码" :value.sync="$route.params.tel"></x-input>
     </flexbox-item>
     <flexbox-item>
      <div class="pd-05">
       <x-button type="primary" @click="Valid">确定</x-button>
      </div>
     </flexbox-item>
    </flexbox>
  </div>
</popup>
</template>
<script>
import {Flexbox, FlexboxItem, XInput, XButton, XHeader, Popup} from 'vux-c'
export default {
  components: {
    Flexbox,
    FlexboxItem,
    XInput,
    XButton,
    XHeader,
    Popup
  },
  data () {
    return {
      show: false,
      showEditContact: true,
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
  methods: {
    judgeRouting () {
      if (this.$route.name === '编辑联系人') {
        this.show = true
      } else {
        this.show = false
      }
    },
    Valid () {
      let name = this.$route.params.name
      let tell = this.$route.params.tel
      if (name === '') {
        this.isErr1 = true
        this.err1 = this.Err[0]
      } else if (!(/[a-zA-Z0-9\u4E00-\u9FA5\uf900-\ufa2d]/.test(name))) {
        this.isErr1 = true
        this.err1 = this.Err[1]
      } else if (!/^[A-z]{2,16}$|^[\u4E00-\u9FA5]{2,4}$/.test(name)) {
        this.isErr1 = true
        this.err1 = this.Err[2]
      } else if (tell === '') {
        this.isErr2 = true
        this.err2 = this.Err[3]
      } else if (!((/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/).test(tell))) {
        this.isErr2 = true
        this.err2 = this.Err[4]
      } else {
        this.SavePassengerList()
        // this.close = false
      }
    },
    SavePassengerList () {
      this.$http.post(window.Miu.Data.ApiURL + '/User_1_0/SavePassengerList',
        {
          Passengers: [
            {
              IDCardList: [],
              Name: this.$route.params.name,
              MobilePhone: this.$route.params.tel,
              PassengerID: this.$route.params.id,
              IsEmoloyee: false,
              Type: 1
            }
          ],
          authTkn: window.Miu.Data.Token
        }
      ).then(function (response) {
        console.log(response.data)
        window.history.back()
        // this.save = 1
      })
    }
  }
}
</script>
<style>
  .w-editContact {
    height:100%;
    background:#f7f7f7;
  }
  .w-editContact .vux-flexbox.w-top .vux-flexbox-item{
    padding-top: 0;
  }
  .w-editContact .vux-flexbox.w-bottom {
   box-sizing: border-box;
  }
  .w-editContact .vux-flexbox-item {
    padding:1rem 0;
  }
 /* .w-editContact .w-editContact-btn {
    background-color: #2196f3;
    height:3rem;
    color:#fff;
    font-size: 1.5rem;
    margin-top: 2rem;
  }*/
</style>