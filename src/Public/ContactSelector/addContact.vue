<template>
  <dialog :show.sync = 'show'>
  <h3 class="pt-05 theme-color-blue">添加联系人</h3>
  <group>
    <x-input placeholder='姓名' :value.sync = 'UserName' :required = 'false'></x-input>
    <x-input placeholder='手机号码'  keyboard='number'  is-type='china-mobile' :value.sync = 'Mobilephone' :required = 'false'></x-input>
  <group>
    <div class="pd-05">
      <x-button type ='primary' @click= 'submitAdd'>确定</x-button>
    </div>
  </dialog>
</template>
<script>
  import {Group, XButton, XInput, Dialog} from 'vux-c'
  import DialogPlus from 'public/DialogPlus'
  export default {
    components: {
      Group,
      Dialog,
      DialogPlus,
      XInput,
      XButton
    },
    props: {
      show: Boolean
    },
    data () {
      return {
        UserName: '',
        Mobilephone: ''
      }
    },
    methods: {
      vailAdd () {

      },
      submitAdd () {
        this.$parent.Contact.List.unshift({
          UserName: this.UserName,
          Mobilephone: this.Mobilephone,
          isChoose: false
        })
        this.UserName = ''
        this.Mobilephone = ''
        this.show = false
      }
    }
  }
</script>