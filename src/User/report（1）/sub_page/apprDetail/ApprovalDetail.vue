<template>
  <div>
    <appr-plane></appr-plane>
  </div>
 <!-- <div v-if="hello=='hotel'">
    <appr-hotel></appr-hotel>
  </div>-->
</template>

<script>
  import {Group, Cell} from 'vux-c/'
  import ApprPlane from './sub/ApprPlane'
  import ApprHotel from './sub/ApprHotel'
  export default {
    components: {
      Cell,
      Group,
      ApprPlane,
      ApprHotel
    },
    data () {
      return {
        hello: 1
      }
    },
    ready () {
    }
  }
</script>


<style>
  html{
    overflow-x: hidden;
  }

</style>
