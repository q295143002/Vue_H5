<template>
  <x-input :value.sync="password" type="password" @change="psdVaild" class="w-line" is-type=china-mobile  placeholder="密码" v-ref:user></x-input>
</template>
<script>
  import { XInput } from 'vux-c'
  export default {
    components: {
      XInput
    },
    data () {
      return {
      }
    },
    props: ['password'],
    methods: {
      psdVaild () {
        // console.log(this.password)
      }
    }
  }
</script>