<template>
<div class="pos-a" style="top:0;bottom:0; width:100%;overflow:hidden;">
	<tab active-color="#fc378c" :line-width="2" style="top:0;left:0;">
    <tab-item :selected="type===item" v-for="item in list" @click="type=item">{{item}}</tab-item>
  </tab>
  <div class="pos-a" style="bottom:0;width:100%;top:44px;">
    <div class="order-list">
      <div v-show="type==='机票'">
        <air-list></air-list>
      </div>
      <div v-show="type==='用车'">
        <car-list :fre="fresh"></car-list>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import {Tab, TabItem} from 'vux-c'
import airList from './list/airList.vue'
import carList from './list/carList.vue'
export default {
  components: {
    Tab,
    TabItem,
    airList,
    carList
  },
  data () {
    return {
      type: '机票',
      list: ['机票', '用车'],
      fresh: 0
    }
  },
  ready () {
    this.session()
  },
  watch: {
    'type' (newVal, oldVal) {
      if (newVal === '用车') {
        this.fresh = 1
      }
    }
  },
  methods: {
    session () {
      let s = window.sessionStorage.getItem('type')
      if (s === 'car') {
        this.type = '用车'
      }
      window.sessionStorage.removeItem('type')
    }
  }
}
</script>
<style lang="less">
  .order-list{
    height:100%;
    width:100%;
    background:#eee;
    overflow:hidden;
    &> div{
      height:100%;
    }
  }
</style>