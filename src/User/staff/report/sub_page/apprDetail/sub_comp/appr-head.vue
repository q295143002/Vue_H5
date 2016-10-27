<template>
  <div class="gx-head">
    <p  class="gx-h-top1">
          <span class="gx-h-date">{{headData.departDate}}</span>
          <span class="gx-h-title">{{headData.corpName}}</span>
          <span class="gx-h-title">CZ12345</span>
    </p>

  <flexbox class="gx-h-top2" :gutter="0">
      <flexbox-item  :span="2/12">
      </flexbox-item>
    <flexbox-item  :span="3/12"  class="tc">
      <span class="gx-h-time tc">{{headData.departTime}}</span>
    </flexbox-item>
    <flexbox-item  :span="2/12"  class="tc">
      <span class="gx-h-plan"></span>
    </flexbox-item>
    <flexbox-item  :span="3/12" class="tc">
      <span class="gx-h-time tc">{{headData.arrivalTime}}</span>
    </flexbox-item>

</flexbox>

    <flexbox class="gx-h-top3" :gutter="0">
      <flexbox-item  :span="2/12">
      </flexbox-item>
      <flexbox-item  :span="3/12"  class="tc">
        <span class="gx-h-city tc">{{headData.departCity}}</span>
      </flexbox-item>
      <flexbox-item  :span="2/12"  class="tc">

      </flexbox-item>
      <flexbox-item  :span="3/12" class="tc">
        <span class="gx-h-city tc">{{headData.arrivalCity}}</span>
      </flexbox-item>

    </flexbox>

  </div>
</template>
<script>
  import {Flexbox, FlexboxItem} from 'vux-c'
  export default {
    components: {
      Flexbox,
      FlexboxItem
    },
    props: {
      headData: Object
    },
    ready () {
      window.Miu.getAppr() // 获取加载数据
    }
  }
</script>

<style>
  .gx-head{
    width:100%;
    height:8rem;
    background: url("../../../assets/fltBcg.png") top left;
    background-size: 100%;
    position: relative;

  }

  .gx-h-top1{
    height:2.5rem;
    line-height: 2.5rem;
    padding-left: 3%;
     color: #fff;
     font-size: 1.1rem;
   }
  .gx-h-top2{
   position: relative;
    top:1.5rem;
    color: #fff;
    font-size: 1.2rem;
  }
  .gx-h-top3{
    position: relative;
    top:0.8rem;
    color: #fff;
    font-size: 1.2rem;
  }
  .tc{
    text-align: center;
  }
  .gx-h-top2 .gx-h-time{
    font-size: 1.5rem;
    color:#fff;
    font-weight: 900;
  }

  .gx-h-top2 .gx-h-plan{
display: inline-block;
    width:30px;
    height:30px;
    background: url("../../../assets/plane.png") center no-repeat;
    background-size: 80%;
  }
  .gx-h-top3 .gx-h-city{
    font-size: 1rem;
    color:#fff;
    font-weight: 100;
  }

  .gx-h-top1 .gx-h-title{
    margin-left: 15px;

  }
</style>
