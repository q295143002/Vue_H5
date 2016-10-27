<template>
  <div class="w-psg pos-a">
    <!-- 新增出行人 -->
    <div class="pos-a" style="width:100%;" v-link="'/user/passenger/add'" v-if="isChoose !== true">
      <group title="">
        <cell title="新增出行人" is-link>
          <i slot="icon" class="iconfont icon-jiahao1 pr-05"></i>
        </cell>
      </group>
    </div>
    <!-- 出行人列表 -->
    <div class="w-psglist pos-a" :style="{top:getTOP+'px'}">
      <!-- 无出行人 -->
      <div v-if="isNoPsg === true">
        <none-info-bg>您目前暂无任何出行人</none-info-bg>
      </div>
      <!-- 有出行人 -->
      <div style="height:100%;">
        <psg-list :is-none.sync="isNoPsg" :check-list.sync="ContactList2" 
        :key="keys" :number="num" :is-check="isChoose"></psg-list>
      </div>
    </div>
  </div>
</template>
<script>
import {Group, Cell} from 'vux-c'
import NoneInfoBg from '../../Public/NoneInfoBg'
import PsgList from './list/psgList'
export default{
  components: {
    Group,
    Cell,
    NoneInfoBg,
    PsgList
  },
  data () {
    return {
      isNoPsg: false,
      show: {
        popup: false
      },
      TOP: 0
    }
  },
  ready () {
  },
  computed: {
    getTOP () {
      let result = (this.isChoose === true ? 0 : 63)
      return result
    }
  },
  props: {
    isChoose: Boolean,
    ContactList2: Array,
    keys: String,
    num: Number
  },
  watch: {
  },
  methods: {
  }
}
</script>
<style lang="less">
  .w-psg{
    width:100%;height:100%;
    top:0;bottom:0;left:0;
  }
  .w-psglist{
    // top:63px;
    width:100%;
    overflow:hidden;
    bottom:0;
  }
</style>