<template>
  <x-input :value.sync="username" :required="true" type="text" class="w-line" is-type=china-mobile  placeholder="用户名" keyboard="number" v-ref:user></x-input>
</template>
<script>
  import { Group, XInput, Cell } from 'vux-c'
  export default {
    components: {
      XInput,
      Cell,
      Group
    },
    data () {
      return {
      }
    },
    props: ['username'],
    methods: {
      change () {
        this.$dispatch('errs', this.$refs.user.valid)
      }
    }
  }
</script>
