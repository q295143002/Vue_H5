<template>
  <slot name = 'main'></slot>
  <div 
    v-for = 'child in popList' 
    class='miu-pagepop-child ts-02 of-s' 
    :class = "[popShow === child.name?'active':'']"
  >
    <slot :name = 'child.name'></slot>
  </div>
</template>
<script>
  export default {
    props: {
      popShow: String,
      popList: Array
    },
    watch: {
      'popShow' () {
        this.show(this.popShow)
      }
    },
    methods: {
      show (obj) {
        this.active = obj.name
      },
      onClose () {
        this.history.back()
        this.$emit('on-close')
      }
    }
  }
</script>
<style lang='less'>
  .miu-pagepop-child{
    -webkit-overflow-scrolling : touch; 
    position: fixed;
    right: -100%;
    top:0;
    bottom:0;
    background: #f7f7f7;
    width: 100%;
    &.active{
      right: 0;
    }
  }
</style>