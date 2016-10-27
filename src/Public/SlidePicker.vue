<template>
<dialog height='50%' :show.sync='show' style='z-index:1;position:relative' v-ref:dialog @click ='Active($event)'>
  <div class="pd-1">
    <picker height='100%' class='fsz-05' :columns='column' :data='data' :value.sync='value'></picker>
  </div>
  <div  class="pd-05">
    <x-button @click='onSubmit' type='primary'>{{submitText}}</x-button>
  </div>
</dialog>
</template>
<script>
  import { Picker, Dialog, XButton, Flexbox, FlexboxItem } from 'vux-c/'
	export default {
    components: {
      Dialog,
      Picker,
      XButton,
      Flexbox,
      FlexboxItem
    },
    props: {
      confirm: {
        type: Boolean,
        default: false
      },
      show: Boolean,
      value: Array,
      data: Array,
      column: Number,
      submitText: {
        type: String,
        default: '确定'
      }
    },
    methods: {
      onCancel () {
        this.show = false
        this.$emit('on-cancel')
      },
      onSubmit () {
        this.show = false
        this.$emit('on-submit')
      },
      Active (event) {
        if (event.target.className === 'weui_mask') {
          this.onCancel()
        }
      }
    }
  }
</script>