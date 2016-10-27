<template>
  <div class="mt-2" style="border-bottom:1px solid #ccc;">
    <!-- <group>
      <datetime placeholder="出生日期" title="出生日期"  cancel-text="取消" confirm-text="确定" year-row="{value}年" month-row="{value}月" day-row="{value}日"
      :min-year="1900" :max-year="2016" :value.sync="birthDate" >
      </datetime>
    </group> -->
    <group title="">
      <calendar :value.sync="birthDate" title="出生日期" disable-future></calendar>
      <!-- <span v-show="birthDate===''" class="pos-r fl-r" style="right:30px;top:-2rem;">请选择日期</span> -->
    </group>
  </div>
</template>
<script>
import {Group, Datetime} from 'vux-c'
import Calendar from '../../components/calendar'
export default {
  components: {
    Group,
    Datetime,
    Calendar
  },
  data () {
    return {
      // currentBirth: '请选择日期'
    }
  },
  props: {
    birthDate: String
  },
  methods: {}
}
</script>