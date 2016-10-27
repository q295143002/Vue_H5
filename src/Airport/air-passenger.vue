<template>
<!-- 选择出行人 -->
  <choose-psg  
    :data-list.sync='List' 
    :max= '9'
    @on-submit='init'>
  </choose-psg>
  <!-- 选择政策 -->
  <choose-policy 
    v-ref:policy
    :show.sync = 'PolicyShow'>
  ></choose-policy>
</template>
<script>
  import ChoosePsg from '../User/choose-psg/choose-psg'
  import ChoosePolicy from './passenger/choose-policy'
  export default {
    components: {
      ChoosePsg,
      ChoosePolicy
    },
    data () {
      return {
        Self: {
          Info: JSON.parse(window.localStorage.getItem('USERINFO'))
        },
        /* 差旅政策 */
        List: [],
        PolicyShow: false
      }
    },
    methods: {
      mapItem (obj) {
        return obj
      },
      init () {
        this.List.forEach((item) => {
          console.log(JSON.stringify(item))
        })
        this.$refs.policy.List = this.List.map(this.mapItem)
        this.$refs.policy.init()
      }
    }
  }
</script>