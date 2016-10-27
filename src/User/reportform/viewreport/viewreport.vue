<template>
	<group class="w-report-head">
   <cell title="技术研发中心" inline-desc="2014全年">
     <span slot="icon" class="w-air"></span>
     <span slot="after-title">周杰</span>
     <span slot="value" class="iconfont">编辑</span>
   </cell>
  </group>
  <div>
    <chart></chart>
  </div>
</template>
<script>
import {Cell, Group} from 'vux-c'
import Chart from '../../../Chart/Chart'
export default {
  components: {
    Cell,
    Group,
    Chart
  }
}
</script>
<style lang="less">
  .w-report-head{
    .weui_cells.vux-no-group-title{
      margin:0;
    }
  }
  .w-air{
    background:url(../../../assets/airicon.png) no-repeat left top;
    width:2.5rem;
    height:2.7rem;
    display: block;
    margin-right:1rem;
    border-right: 1px dashed #ccc;
    background-size: 70% 65%;
    position:relative;
    &:after{
      position:absolute;
      font-size: 80%;
      content: '机票';
      bottom:-5px;
      left:2px;
      color:#ccc;
    }
  }
</style>