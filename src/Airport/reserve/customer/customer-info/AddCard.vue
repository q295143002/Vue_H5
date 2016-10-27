<template>
  <dialog  :show.sync='show' >
    <div class="pd-05">
    <h3 class='theme-color-blue'>添加证件</h3>
    <group class='ta-l'>
      <cell title='证件类型' is-link @click ='radio.show = true' >{{addCard.cardType|IDshow}}</cell>
    </group>
    <group  v-show='radio.show' :transition="fade">
      <radio :value.sync='addCard.cardType'  @click = 'radio.show = false' :options='radio.options' ></radio>
    </group>
    <group>
      <x-input :value.sync='addCard.cardNumber|cardFilter' :required = 'false' placeholder='证件号码'></x-input>
    </group>
    <group>
      <div class='pd-05'>
        <flexbox>
          <flexbox-item>
            <x-button type='primary' @click='vailAddCard'>保存</x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button type='cancel' @click='cancelAddCard'>取消</x-button>
          </flexbox-item>
        </flexbox>
      </div>
    </group>
    </div>
  </dialog>
</template>
<script>
import {Dialog, Cell, Radio, Flexbox, FlexboxItem, XButton, Group, XInput} from 'vux-c'
export default {
  components: {
    Dialog, Cell, Radio, Flexbox, FlexboxItem, XButton, Group, XInput
  },
  data () {
    return {
      radio: {
        options: [
          {key: '0', value: '身份证'},
          {key: '1', value: '护照'},
          {key: '2', value: '军官证'},
          {key: '3', value: '回乡证'},
          {key: '4', value: '港澳通行证'},
          {key: '5', value: '台湾通行证'},
          {key: '9', value: '其他'}
        ],
        show: false
      },
      fade: 'fade',
      addCard: {
        cardType: '0',
        cardNumber: ''
      }
    }
  },
  watch: {
    'addCard.cardNumber' (str) {
      let reg = new RegExp("[`.~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&mdash;—|{}【】‘；：”“'。，、？]")
      let x = str.replace(reg, '')
      console.log(x)
      return x
    }
  },
  props: {
    show: Boolean
  },
  filters: {
    'IDshow' (obj) {
      switch (obj) {
        case '0': return '身份证'
        case '1': return '护照'
        case '2': return '军官证'
        case '3': return '回乡证'
        case '4': return '港澳通行证'
        case '5': return '台湾通行证'
        case '9': return '其他'
      }
    },
    'cardFilter' (str) {
      let reg = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&mdash;—|{}【】‘；：”“'。，、？]")
      let x = str.replace(reg, '')
      console.log(x)
      return x
    }
  },
  methods: {
    cancelAddCard () {
      this.show = false
      this.addCard.cardType = '0'
      this.addCard.cardNumber = ''
    },
    IDCardVail () {
      let result = window.Miu.checkID(this.addCard.cardNumber)
      if (result === 'pass') {
        console.log(111)
        this.pushIDCard()
      } else {
        this.$root.Toast('身份证格式错误')
      }
    },
    pushIDCard () {
      this.$dispatch('push-idcard', this.addCard)
      this.addCard.cardType = '0'
      this.addCard.cardNumber = ''
      this.show = false
    },
    vailAddCard () {
      if (this.addCard.cardNumber.length === 0) {
        this.$root.Toast('输入不能为空')
      } else {
        this.submitAddCard()
      }
    },
    submitAddCard () {
      switch (this.addCard.cardType) {
        case '0': this.IDCardVail()
          break
        default: this.pushIDCard()
          break
      }
    }
  }
}
</script>
<style scope>
  .fade-transition {
    transition: all .3s ease;
    height: 325px;
    overflow: hidden;
    opacity: 1;
  }

  /* .expand-enter 定义进入的开始状态 */
  /* .expand-leave 定义离开的结束状态 */
  .fade-enter, .fade-leave {
    height: 0;
    opacity: 0;
  }
</style>
