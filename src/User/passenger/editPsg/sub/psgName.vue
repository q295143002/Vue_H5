<template>
<div class="bg-white pb-1" style="border-bottom:1px solid #ccc;">
  <ul class="psg_nametip">
    <li>{{curname==='1'?'中文姓名':'英文姓名'}}</li><li @click="showTip=true">填写说明</li>
  </ul>
  <ul class="psg_name">
    <li>
      <x-input v-show="curname==='1'" placeholder="中文姓名" :value.sync="cname"></x-input>
      <x-input v-show="curname==='2'" placeholder="英文姓名" :value.sync="ename"></x-input>
    </li>
    <li>
      <checker :value.sync="curname" default-item-class="default_name" selected-item-class="active_name">
        <checker-item value="1">中文</checker-item>
        <checker-item value="2">英文</checker-item>
      </checker>
    </li>
  </ul>
  <psgtip :show.sync="showTip"></psgtip>
</div>
</template>
<script>
import {XInput, Checker, CheckerItem} from 'vux-c'
import Psgtip from './psgtip'
export default {
  components: {
    XInput,
    Checker,
    CheckerItem,
    Psgtip
  },
  data () {
    return {
      // curname: '1',
      showTip: false,
      Cname: '',
      Ename: ''
    }
  },
  props: {
    cname: String,
    ename: String,
    curname: String
  }
}
</script>
<style lang="less">
  .psg_nametip,.psg_name{
    box-sizing: border-box;
    display: flex;
    -webkit-flex-direction:row;
    -webkit-justify-content:space-between;
    justify-content:space-between;
  }
  .psg_nametip{
    padding: 10px 15px 10px;
    li:nth-child(1) {
      color:#ccc;
      font-size: 0.8rem;
    }
    li:nth-child(2) {
      color:#37f;
      font-size: 0.8rem;
    }
  }
  .psg_name{
    padding:0 15px;
    .weui_cell{
      padding:0;
      width:100%;
      &:before{
        border:none;
      }
    }
    .weui_cell_ft{
      display:none;
    }
    li:nth-child(1) {
      flex-grow:0.9;
      border-bottom:1px solid #000;
      // background:green;
    }
  }
  .default_name{
    border: 1px solid #37f;
    color:#37f;
    padding: 2px 5px;
    border-radius: 3px;
  }
  .active_name{
    background:#37f;
    color:#fff;
    border-radius: 3px;
  }
</style>