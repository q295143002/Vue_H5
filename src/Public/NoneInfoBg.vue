<template>
  <dl class="w-none-box">
    <dd class="w-none" :class="classes"></dd>
    <dt class="color-gray-middle"><slot></slot></dt>
  </dl>
</template>
<script>
  export default {
    props: {
      type: {
        default: 'psg'
      }
    },
    computed: {
      classes () {
        return `w-none_${this.type}`
      }
    }
  }
</script>
<style lang="less" scoped>
  .w-none_psg{
    background: url(../assets/no-passenger.png) no-repeat;
  }
  .w-none_contact{
    background: url(../assets/no-contact.png) no-repeat;
  }
  .w-none_order{
    background: url(../assets/no-order.png) no-repeat;
  }
  .w-none_unpaid{
    background: url(../assets/no-unpaidorder.png) no-repeat;
  }
  .w-none_travel{
    background: url(../assets/no-travel.png) no-repeat;
  }
  .w-none_address{
    background: url(../assets/no-address.png) no-repeat;
  }
  .w-none_psg,
  .w-none_contact,
  .w-none_order,
  .w-none_unpaid,
  .w-none_travel,
  .w-none_address{
    background-size: contain;
    height:8rem;
    width:8rem;
    margin:1rem 2rem;
  }
  .w-none-box{
    top:0;left:0;right:0;bottom:0;
    margin:auto;
    height:15rem;
    width:12rem;
    text-align: center;
    position:absolute;
  }
</style>
