<template>
  <div class="gx-body">
    <div class="gx-b-block1">
      <flexbox>
      <flexbox-item >
        <span class="gx-bb gx-bb-1 color999">申请人</span>
        <br>
        <span class="gx-bb gx-bb-2 margin-1">{{bodyData.applyName}}</span>
      </flexbox-item>

      <flexbox-item >
        <span class="gx-bb gx-bb-1 color999">提交时间</span>
        <br>
        <span class="gx-bb gx-bb-2 margin-1">{{bodyData.ApprovalDate|date}}</span>
      </flexbox-item>
    </flexbox>
      <flexbox>
        <flexbox-item >
          <span class="gx-bb gx-bb-1 color999">审批截止日期</span>
          <br>
          <span class="gx-bb gx-bb-2 margin-1" >{{bodyData.EffectiveTimeSpan|date}}</span>
        </flexbox-item>
        <flexbox-item >
          <span class="gx-bb gx-bb-1 color999">审批状态</span>
          <br>
          <span class="gx-bb gx-bb-2 colorf90 margin-1" v-if="b(bodyData.EffectiveTimeSpan)||bodyData.ApprovalStatus!=0">
            <span v-if="bodyData.ApprovalStatus===0">待审批</span>
            <span v-if="bodyData.ApprovalStatus===1">已通过</span>
            <span v-if="bodyData.ApprovalStatus===2">已驳回</span>
            <span v-if="bodyData.ApprovalStatus===3">已转审</span>
            <span v-if="bodyData.ApprovalStatus===4">已取消</span>
            <span style="visibility: hidden;">这是一个占位符哈！</span>
          </span>
          <span class="gx-bb gx-bb-2 colorf90 margin-1" v-if="!b(bodyData.EffectiveTimeSpan)&&bodyData.ApprovalStatus===0">
                   <span class=" x_f_big">审批超时</span>
          </span>
        </flexbox-item>
      </flexbox>

    </div>
    <div class="gx-b-block2" v-for="item in bodyData.fltInfo">
      <p class="title font-8">
        <span class="cell_air"></span>
        <span class="cell_air_text">机票</span>
        <a v-link="'/user/order/airDetail/'+item.orderNo" class="cell_air_href">查看订单详情&gt;</a>      </p>
      <flexbox>
        <flexbox-item :span="2/12">
          <span class="gx-bb gx-bb-1">{{item.departDate}}</span>
        </flexbox-item>
        <flexbox-item :span="4/12">
          <span class="gx-bb gx-bb-1">{{item.cityInfo}}</span>
        </flexbox-item>
        <flexbox-item :span="1/12">

        </flexbox-item>
        <flexbox-item :span="5/12">
          <span class="gx-bb gx-bb-1">订单总额:</span>
          <span style="font-size: 0.9rem" class="gx-bb gx-bb-2 colorf60">&yen;</span><span class="gx-bb gx-bb-2 colorf60">{{item.total}}</span>

        </flexbox-item>
      </flexbox>
      <flexbox>
        <flexbox-item :span="11/12">
          <p  class="gx-bb color999"> <span>登机人:</span><span v-for="man in item.Passengers">{{man.CustomerName}}</span></p>
        </flexbox-item>
      </flexbox>

      <div class="gx-bb-policy font-8">
        <p>违规原因: <span class="colorf60">{{item.IsOutOfLine===true?'政策违规':'出行审批'}}</span> </p>
        <ul>
          <li  v-for="ai in item.policy">
            <span class="gx-bb-point"></span>{{ai}}
          </li>

        </ul>

      </div>

    </div>
    <div class="gx-b-block4 font-8">
      <p class="title">审批轨迹</p>
      <div>
        <x-timeline>
          <x-timeline-item v-for="item in bodyData.ApprovalLogList" >
            <h4 class='line-word-1' >{{item.Name}} <span class="timeline_states">{{d(item.OperationType)}}</span></h4>
            <p class='line-word-2' v-if="c(item.Remark)">备注：{{item.Remark|remark}}</p>
            <p class='line-word-2' >审批时间：{{item.CreateDate|date}}</p>
          </x-timeline-item>
        </x-timeline>
      </div>
    </div>
  </div>
</template>
<script>
  import {Flexbox, FlexboxItem} from 'vux-c'
  import XTimelineItem from '../../../component/x-timeline/x-timeline-item'
  import XTimeline from '../../../component/x-timeline/x-timeline'
  var Xvue = require('vue')
  Xvue.filter('remark', function (value) {
    try {
      value = value.match(/\([\W\w]+\)$/g)[0]
      value = value.replace(/\(|\)/g, '')
      return value
    } catch (e) {}
  })
  export default {
    components: {
      Flexbox,
      FlexboxItem,
      XTimeline,
      XTimelineItem
    },
    props: {
      bodyData: Object
    },
    data () {
      return {
        items: [{name: '张三（卖西瓜的）', extra: '我是一只西瓜', date: '2022-12-20 20:15'},
          {name: '王五（卖小鸡的）', extra: '我有病', date: '2022-12-20 20:15'},
          {name: '李四（买飞机的）', extra: '我是傻逼', date: '2022-12-20 20:15'}],
        itemsX: 1
      }
    },
    methods: {
      b: function (val1) {
        try {
          val1 = val1.toString().match(/(\d)/g).join('')
          var now = Date.parse(new Date())
          var leftTime = 0
          leftTime = val1 - now
        } catch (e) {

        }
        if (leftTime < 0) {
          return false
        } else {
          return true
        }
      },
      c: function (remark) {
        var result = false
        result = /\([\W\w]+\)$/g.test(remark)
        return result
      },
      d: function (val) {
        if (val === 0) {
          return '发起审批'
        } else if (val === 1) {
          return '通过审批'
        } else if (val === 2) {
          return '驳回'
        } else if (val === 3) {
          return '已转审'
        } else if (val === 4) {
          return '取消'
        } else {
          return '通过'
        }
      }
    }
  }
</script>

<style>
  .colorf00 {
    color: #f00;
  }
  .colorf60 {
    color: #f60;
  }
  .color999 {
    color: #ccc !important;
  }

  .color6af {
     color: #6af;
   }
  .color9cf {
    color: #9cf;
  }
  .recent {
    color: rgb(4, 190, 2)
  }

  .gx-bb-policy ul {
    list-style: none;
  }

  /*.gx-bb-policy li {
    padding-left: 1.5rem;
  }*/

  .gx-b-block1 {
    padding-left: 1rem;
    background-color: #fff;
    box-shadow: 0px 1px 3px #ccc;
  }

  .gx-b-block2 {
    margin-top: 1rem;
    padding-left: 1rem;
    background-color: #fff;
    box-shadow: 0px 1px 3px #ccc;
  }

  .gx-b-block3 {
    margin-top: 1rem;
    padding-left: 1rem;
    background-color: #fff;
    box-shadow: 0px 1px 3px #ccc;
  }
  .gx-b-block4 {
    margin-top: 1rem;
    padding-left: 1rem;
    margin-bottom: 3rem;
    background-color: #fff;
    box-shadow: 0px 1px 3px #ccc;
  }

  .gx-b-block3 > p,.gx-b-block4 > p {
    border-bottom: 1px solid #eee;
    margin-left: -20px;
    padding-left: 20px;
  }
  .gx-b-block3 .title,.gx-b-block4 .title,.gx-b-block2 .title{
    line-height: 40px;
    height:40px;
    text-align: left;
    border-bottom: 1px solid #eee;
    margin-left: -20px;
    padding-left: 20px;
    color: #666;

  }
  .gx-b-block2 .cell_air{
    display: inline-block;
    height: 30px;
    width: 30px;
    background: url('../../../assets/planeicon1.png') no-repeat;
    background-size: 90%;
    margin-left: 0px;
    margin-top: 7px;

  }
  .gx-b-block2 .cell_air_text{
    vertical-align: top;
  }
  .gx-b-block2 .cell_air_href{
    color: #27a5fe;
    float: right;
    margin-right: 20px;
  }
  .gx-b-block3 .details>p>span{
    margin-left: 20px;
  }
  .gx-b-block3 .details>div{
    padding-bottom: 10px;
    color: #666;
  }
  .gx-b-block3 .details>p>span:nth-child(1){
     margin-left: 0;
   }
  .gx-b-block4 .line-word-1{
    font-weight: 100;
  }
  .gx-b-block4 .line-word-2{
    color: #666;
    font-size: 0.9rem;

  }

  .gx-bb-1 {
    height: 4rem;
    color: #666;
  }.gx-bb-2 {
    font-weight: 900;
   }

  .gx-bb {
    font-size: 0.8rem;
    position: relative;

  }
  .font-8{
    font-size: 0.8rem !important;
  }
  .margin-1{
    margin-top: 1px;
    display: block;
  }


.timeline_states{
  float: right;
}
/*  .gx-bb-point::before {
    content: "";
    position: absolute;
    width: .3rem;
    height: .3rem;
    background-color: #ff0000;
    border-radius: 50%;
    left: -2.3rem;
    top: .45rem;
  }*/
  .gx-body .vux-timeline-item-head, .vux-timeline-item-head-first{
    z-index:0;
    position: absolute;
    content: '';
    border-radius: 99px;
    height:20px;
    width:20px;
    left:-5px;
    top:-8px;
    background-color: #fff !important;
    border:1px solid #999;
  }
  .gx-body .vux-timeline-item-tail{
    background-color: #999 !important;
    top:12px;
  }




</style>
