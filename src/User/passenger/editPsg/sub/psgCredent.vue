<template>
  <div class="pos-r">
    <i style="z-index:3" class='iconfont icon-jiahao2fill psgCredent_icon pos-a pr-1 fsz-4' @click="show=true"></i>
    <div class="psgCredent_list" v-for="(index,item) in CreArr">
      <div class="pos-r">
        <cell :title="item.CardType===9?'其他':Crelist[item.CardType]" :inline-desc="item.CardNumber" class="bg-white" @click="creEdit(index)">
          <i slot="icon" class="iconfont icon-guanbi2fill fsz-3 pr-05 color-white"></i>
        </cell>
        <i style="top:1px;left:15px;" class="pos-a iconfont icon-guanbi2fill fsz-3 color-red" @click="delCredent(index)"></i>
      </div>
    </div>
  </div>
  <!-- 编辑证件 -->
  <popup :show.sync="show" height="100%">
    <div class="pos-a bg-white w-popup">
      <i class="iconfont icon-guanbi1 pos-a" style="top:0.5rem;left:1rem;" @click="show=false"></i>
      <p class="pb-2 pt-05" style="text-align:center">添加证件</p>
      <selector :options="Crelist" :value.sync="CreName" @change="changed()"></selector>
      <x-input class="psg_noPaddingBottom" :placeholder="CreName === '军官证'?CreTip[1]:CreTip[0]" 
      :value.sync='CreNum' @change="CreNum!==null?err='':''"></x-input>
      <p style="height:25px;" class="ml-1 color-red">{{err}}</p>
      <div class=" mt-2" >
        <x-button type="primary" :disabled="isDisable" @click="saveCredent">保存</x-button>
      </div>
    </div>
  </popup>
</template>
<script>
import {Popup, Selector, XInput, XButton, Cell} from 'vux-c'
import {IDVaild, PassportReg, OfficerReg} from './vaild.js'
export default {
  components: {
    Popup,
    Selector,
    XInput,
    XButton,
    Cell
  },
  data () {
    return {
      userinfo: window.Miu.Data.UserInfo,
      show: false,
      CreName: '身份证',
      Crelist: ['身份证', '护照', '军官证', '回乡证', '港澳通行证', '台湾通行证', '其他'],
      CreTip: ['证件号码', '例：海字第XXXXXXXX号'],
      CreNum: '',
      // CreArr: [],
      // CreCarType: [],
      isErr: true,
      err: '',
      BirthSub: '',               /* 截取出生日期字符串 */
      editObj: {
        CardNum: '',
        CardType: ''
      }
    }
  },
  props: {
    CreArr: Array,
    CreCarType: Array
  },
  watch: {
    'show' (newVal, oldVal) {
      if (newVal === false) {
        this.CreName = '身份证'
        this.CreNum = ''
        this.err = ''
        this.editObj.CardNum = ''
        this.editObj.CardType = ''
      }
    }
  },
  methods: {
    changed () {
      [this.err, this.CreNum] = ['']
    },
    saveCredent () {
      let CardType = this.Crelist.indexOf(this.CreName)
      CardType === 6 ? CardType = 9 : ''
      if (this.CreNum === '') {
        const name = this.CreName
        this.err = `请填入${name}号码`
      } else {
        this.err = ''
        if (this.editObj.CardNum !== '' && this.editObj.CardType === CardType) {
          this.creVaild(CardType)
        } else {
          /* 判断是否重复添加证件 */
          this.isRepeatCre(CardType)
        }
      }
    },
    isRepeatCre (CardType) {
      let HAVE = this.CreCarType.indexOf(CardType)
      if (HAVE !== -1) {
        this.$root.Toast('证件类型重复')
      } else {
        /* 证件格式验证 */
        this.creVaild(CardType)
      }
    },
    creVaild (CardType) {
      let msg = null
      switch (CardType) {
        case 0 :
          if (this.CreNum.length !== 18 && this.CreNum.length !== 15) {
            this.err = '身份证长度不正确'
            msg = false
          } else {
            msg = IDVaild(this.CreNum, this.BirthSub)
            if (msg !== false) {
              this.BirthSub = msg
              this.credentOK(CardType)
            } else {
              this.err = '身份证格式不正确'
            }
          }
          break
        case 1:
          msg = PassportReg.test(this.CreNum)
          break
        case 2:
          msg = OfficerReg.test(this.CreNum)
          break
        case 3:
          msg = /^[mMhH]\d{10}$/.test(this.CreNum)
          break
        case 4:
          msg = /^[a-zA-Z0-9]{2,21}$/.test(this.CreNum)
          break
        case 5:
          msg = /^[a-zA-Z0-9]{8,10}$/.test(this.CreNum)
          break
        case 9:
          msg = true
          break
        default:
          msg = null
      }
      if (msg !== false && CardType !== 0) {
        this.credentOK(CardType)
      } else {
        this.err = this.CreName + '格式不正确'
      }
    },
    credentOK (CardType) {
      this.addCredent(CardType)
      // this.show = false
    },
    /* 添加证件 */
    addCredent (CardType) {
      var credentobj = {
        CardType: CardType,
        CardNumber: this.CreNum,
        IsDefault: CardType === 0 ? 'T' : 'F',
        UID: this.userinfo.UID
      }
      if (this.editObj.CardNum !== '') {
        for (var k in this.CreCarType) {
          if (this.CreCarType[k] === this.editObj.CardType) {
            this.CreCarType[k] = CardType
            this.CreArr.splice(k, 1, credentobj)
            this.show = false
          }
        }
      } else {
        this.CreArr.push(credentobj)
        this.CreCarType.push(CardType)
        this.show = false
      }
    },
    /* 删除证件 */
    delCredent (index) {
      this.CreArr.splice(index, 1)
      this.CreCarType.splice(index, 1)
    },
    /* 编辑证件 */
    creEdit (index) {
      let type = this.CreArr[index].CardType
      type === 9 ? this.CreName = '其他' : this.CreName = this.Crelist[type]
      this.CreNum = this.CreArr[index].CardNumber
      this.editObj.CardNum = this.CreNum
      this.editObj.CardType = type
      this.show = true
    }
  }
}
</script>
<style lang="less">
  .w-popup{
    height:100%;width:100%;top:0;bottom:0;
    // background:green;
    box-sizing: border-box;
    padding: 0 15px;
    .weui_cell_ft{
      display:none;
    }
  }
  .weui_cell_select{
    // background:red;
    border-top: 1px solid #e1e1e1;
    border-bottom: 1px solid #e1e1e1;
    &:before{
      border-top: none;
    }
  }
  .psg_noPaddingBottom{
    // background:pink;
  }
  .psgCredent_icon{
    color:#34cb0b;
    right:0;
    top:-2rem;
  }
  .psgCredent_list{
    .weui_cell{
      padding:0 15px;
    }
  }
  .psg_noPaddingBottom.weui_cell{
    padding-bottom:0.5rem;
    border-bottom: 1px solid #e1e1e1;
    &:before{
      border-top: none;
    }
  }

</style>