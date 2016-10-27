<template>
 <div id="C-report ">

   <tab>
     <tab-item v-on:click='type="toMe"' @click='change(type)' :selected='type=== "toMe"'>发给我的</tab-item>
     <tab-item v-on:click='type="toOther"' @click='change(type)' :selected='type=== "toOther"'>我发起的</tab-item>
   </tab>
   <div class="scroller-wrap" v-show="isToMe">
   <scroller lock-x scrollbar-y use-pullup use-pulldown  height=""  @pullup:loading="loadMore" @pulldown:loading="refresh" v-ref:scroller>
     <div class="x_report">
       <group v-for="items in toMeData" class="animated" v-if="items.ApprovalType==='国内机票'">

         <cell :link={path:'/report/flight/'+items.ApprovalID+''}><!--假数据传参-->
           <flexbox class="flx1">
             <flexbox-item :span="4" class="tl">
               <icon class="icon_big tc"></icon><span style="vertical-align: 60%">{{items.ApprovalType==='国内机票'?'机票':items.ApprovalType}}</span>
             </flexbox-item>
             <flexbox-item :span="5">
             </flexbox-item>
             <flexbox-item :span="3" class="tl">
               <span class=" x_f_big colorf90" v-if="items.ApprovalStatus===0">待审批</span>
               <span class=" x_f_big" v-if="items.ApprovalStatus===2">已驳回</span>
               <span class=" x_f_big" v-if="items.ApprovalStatus===1">已通过</span>
               <span class=" x_f_big" v-if="items.ApprovalStatus===3">已转审</span>
               <span class=" x_f_big" v-if="items.ApprovalStatus===4">已取消</span>
             </flexbox-item>
           </flexbox>

           <flexbox>
             <flexbox-item :span="12">
               <div class="x_icon_word">
                 <flexbox :gutter="0" style="margin: 5px 0;">
                   <flexbox-item :span="7" class='tl'>
                     <span class="x_c_black x_f_big">申请人：<span  v-for="item1 in items.Passengers">{{item1.CustomerName}}&nbsp;</span></span>
                   </flexbox-item>
                   <flexbox-item :span="5" class='tl'>
                     <span class=" x_f_small" v-if="items.ApprovalStatus===0">剩余审批时间{{items.ApprovalDate|timeLeft items.EffectiveTimeSpan}}分钟</span>
                   </flexbox-item>

                 </flexbox>
                 <flexbox :gutter="0" style="margin: 5px 0;">
                   <flexbox-item :span="11" class='tl'>
                     <span class=" x_f_middle">{{items.OrderHead}}</span>

                   </flexbox-item>
                 </flexbox>
                 <flexbox :gutter="0" style="margin: 5px 0;">
                   <flexbox-item :span="12" class='tl'>
                     <span class=" x_f_middle">申请提交时间：{{items.ApprovalDate|date}}</span>
                   </flexbox-item>
                 </flexbox>

               </div>
             </flexbox-item>
           </flexbox>

         </cell>
       </group>
     </div>
   </scroller>
</div>
   <div class="scroller-wrap" v-show="!isToMe">
     <scroller lock-x scrollbar-y use-pullup use-pulldown  @pullup:loading="loadMore" @pulldown:loading="refresh" v-ref:scroller>
       <div class="x_report">
         <group v-for="items in toOtherData" class="animated" v-if="items.ApprovalType==='国内机票'">

           <cell :link={path:'/report/flight/'+items.ApprovalID+''}><!--假数据传参-->

             <flexbox class="flx1">
               <flexbox-item :span="4" class="tl">
                 <icon class="icon_big tc"></icon><span style="vertical-align: 60%">{{items.ApprovalType==='国内机票'?'机票':items.ApprovalType}}</span>
               </flexbox-item>
               <flexbox-item :span="5">
               </flexbox-item>
               <flexbox-item :span="3" class="tl">
                 <span class=" x_f_big colorf90" v-if="items.ApprovalStatus===0">待审批</span>
                 <span class=" x_f_big" v-if="items.ApprovalStatus===2">已驳回</span>
                 <span class=" x_f_big" v-if="items.ApprovalStatus===1">已通过</span>
                 <span class=" x_f_big" v-if="items.ApprovalStatus===3">已转审</span>
                 <span class=" x_f_big" v-if="items.ApprovalStatus===4">已取消</span>
               </flexbox-item>
             </flexbox>

             <flexbox>
               <flexbox-item :span="12">
                 <div class="x_icon_word">
                   <flexbox :gutter="0" style="margin: 5px 0;">
                     <flexbox-item :span="7" class='tl'>
                       <span class="x_c_black x_f_big">申请人：<span  v-for="item1 in items.Passengers">{{item1.CustomerName}}&nbsp;</span></span>
                     </flexbox-item>
                     <flexbox-item :span="5" class='tl'>
                       <span class=" x_f_small" v-if="items.ApprovalStatus===0">剩余审批时间{{items.ApprovalDate|timeLeft items.EffectiveTimeSpan}}分钟</span>
                     </flexbox-item>

                   </flexbox>
                   <flexbox :gutter="0" style="margin: 5px 0;">
                     <flexbox-item :span="11" class='tl'>
                       <span class=" x_f_middle">{{items.OrderHead}}</span>

                     </flexbox-item>
                   </flexbox>
                   <flexbox :gutter="0" style="margin: 5px 0;">
                     <flexbox-item :span="12" class='tl'>
                       <span class=" x_f_middle">申请提交时间：{{items.ApprovalDate|date}}</span>
                     </flexbox-item>
                   </flexbox>

                 </div>
               </flexbox-item>
             </flexbox>

           </cell>
         </group>
       </div>
     </scroller>
</div>
   <loading :show="showL" :text="toastText"></loading>
   <toast :show.sync="show3" type="cancel">获取数据失败</toast>
 </div>
</template>
<script>
  import { Tab, TabItem, Group, Loading, Scroller, XButton, Flexbox, FlexboxItem, Cell, Icon, Toast } from 'vux-c'
  import Xvue from 'vue'
  import Xresource from 'vue-resource'
  Xvue.use(Xresource)
  Xvue.filter('filterArr', function (value, index) {
    var arr = value.split('、')
    arr = arr[arr.length - 1]
    let result = null
    if (index === 1) {
      result = arr.substring(5, 7) + '月' + arr.substring(8, 10) + '日'
    } else if (index === 2) {
      result = arr.match(/到[\d\D]*的/)[0].split('')
      result.pop()
      result.shift()
      result = result.join('')
    } else if (index === 3) {
      if (value.indexOf('往返') > 0) {
        return '往返'
      } else {
        return '单程'
      }
    } else {
      result = 'ToT没数据ToT'
    }
    return result
  })
  Xvue.filter('date', function (value) {
    var date = value.toString().match(/(\d)/g).join('')
    date = parseInt(date)
    date = new Date(date)
    date = window.Miu.dateFormat(date)
    return date
  })
  Xvue.filter('timeLeft', function (value, value1) {
    // var date = value.toString().match(/(\d)/g).join('')
    var date1 = value1.toString().match(/(\d)/g).join('')
    var now = Date.parse(new Date())
    var leftTime = 0
    leftTime = date1 - now
    if (leftTime < 0) {
      return 0
    } else {
      return Math.floor(leftTime / 60000)
    }
  })
  export default {
    components: {
      Icon,
      Cell,
      Flexbox,
      FlexboxItem,
      XButton,
      Tab,
      TabItem,
      Group,
      Scroller,
      Loading,
      Toast
    },
    ready: function () {
      this.showL = true
      var obj = {
        'type': 'toMe',
        'fn': this.setInit,
        'method': 'refresh'
      }
      var obj1 = {
        'type': 'toOther',
        'method': 'refresh'
      }
      this.getData(obj)
      this.getData(obj1)
    },
    data: function () {
      return {
        // 往返情况
        val: {},
        reData: 11,
        type: 'toMe',
        drawData: {},
        toMeData: [],
        toOtherData: [],
        pageIndex: 1,
        isNull: false,
        isToMe: true,
        height: '280px',
        showL: false,
        toastText: '',
        show3: false
      }
    },
    watch: {
    },
    methods: {
      loadMore (uuid) {
        var _self = this
        var obj = {
          'type': this.type,
          'fn1': function () {
            _self.$nextTick(() => {
              _self.$broadcast('pullup:reset', uuid)
              document.querySelectorAll('.xs-plugin-pullup-up')[0].innerHTML = 'No more'
            })
          },
          'method': 'more'
        }
        if (this.isNull) {
          obj.fn1()
          return
        }
        this.pageIndex += 1
        this.getData(obj)
      },
      refresh (uuid) {
        var _self = this
        this.isNull = false
        this.showL = true
        if (this.type === 'toMe') {
          this.toMeData = []
        } else {
          this.toOtherData = []
        }
        var obj = {
          'type': this.type,
          'fn1': function () {
            _self.$nextTick(() => {
              _self.$broadcast('pulldown:reset', uuid)
            })
          },
          'method': 'refresh'
        }
        this.pageIndex = 1
        this.getData(obj)
      },
      change (val) {
        this.isNull = false
        if (val === 'toMe') {
          this.isToMe = true
          this.reData = this.toMeData
        } else {
          this.isToMe = false
          this.reData = this.toOtherData
        }
      },
      setInit: function () {
        this.reData = this.toMeData
        document.querySelectorAll('.scroller-wrap')[0].querySelector('div').style.height = (document.documentElement ? document.documentElement.clientHeight : document.body.clientHeight) - 44 + 'px'
        document.querySelectorAll('.scroller-wrap')[1].querySelector('div').style.height = (document.documentElement ? document.documentElement.clientHeight : document.body.clientHeight) - 44 + 'px'
        window.scrollTo(0, 0)
      },
      getData (obj) {
        var url = '/Approval_1_0/GetOperatedApprovalList'
        if (obj.type === 'toOther') {
          url = '/Approval_1_0/GetApprovalList'
        }
        this.$http.post(window.Miu.Data.weiXin + url, {
          authTkn: window.Miu.Data.Token,
          uid: window.Miu.Data.UserInfo.UID,
          pageIndex: this.pageIndex,
          pageSize: 3
        }).then((res) => {
          if (res.data.list.Tag === null) {
            obj.fn1()
            this.isNull = true
            return
          }
          if (obj.type === 'toMe') {
            if (obj.method === 'more') {
              for (var i in res.data.list.Tag.Approvals) {
                this.toMeData.push(res.data.list.Tag.Approvals[i])
              }
              this.reData = this.toMeData
            } else if (obj.method === 'refresh') {
              this.toMeData = res.data.list.Tag.Approvals
              this.reData = this.toMeData
              this.showL = false
            }
          } else {
            if (obj.method === 'more') {
              for (var m in res.data.list.Tag.Approvals) {
                this.toOtherData.push(res.data.list.Tag.Approvals[m])
              }
              this.reData = this.toOtherData
            } else if (obj.method === 'refresh') {
              this.toOtherData = res.data.list.Tag.Approvals
              this.reData = this.toOtherData
              this.showL = false
            }
          }
          if (obj.fn) {
            obj.fn()
          }
          if (obj.fn1) {
            obj.fn1()
          }
          this.showL = false
        }, (res) => {
          this.show3 = true
        })
      }

    }
  }

</script>
<style>
  .colorf90{
    color: #ff750d
  }
  html body{
    font-size: 17px;
    font-family: 华文黑体 !important;
  }

  .fade-transition {
    transition: all .3s ease;
    -webkit-backface-visibility: hidden;
    opacity: 1;
  }

  .fade-enter, .fade-leave {
    opacity: 0;
  }

  .content-block {
    padding: 1rem;
  }

  .mt-3 {
    margin-top: 3rem;
  }

  .tl {
    text-align: left;
  }

  .tc {
    text-align: center;
  }

  .tr {
    text-align: right;
  }
  .x_c_black{
    color: #000;}
  .x_f_big{
    font-size: 1rem}
  .x_f_middle{
    font-size: 0.9rem}
  .x_f_small{
    font-size: 0.80rem}
  .x_icon_word{
    display:inline-block;
    font-size: 0.90rem;
    width:100%;

  }
  .x_report  .flx1{
    border-bottom: 1px solid #ccc;
    padding-left: 100px;
    padding-right: 100px;
    margin-left: -100px;
    margin-right: -100px;

  }
  #C-report .vux-tab{
    position: fixed;
    z-index:999;
    width:100%;
    top:0;

  }
  #C-report {
    border-top: 1px solid #fff;
  }
  #C-report .scroller-wrap{
    top: 44px;
    position: absolute;
    width:100%;
  }
  .x_report .icon_big:before{font-size:44px;}
  .x_report  .weui_icon_undefined {
    width: 40px;
    display: inline-block;
    height:40px;
    background: url('../assets/planeicon.png') no-repeat center;
    background-size: 70%;
  }

  .x_report .weui_cell_ft{vertical-align:middle;width:100%;}

/*  .x_report .weui_cell_ft.with_arrow:after {
    content: "";
    display: inline-block;
    transform: rotate(45deg);
    height: 15px;
    width: 15px;
    border-width: 2px 2px 0 0;
    border-color: #c8c8cd;
    border-style: solid;
    position: absolute;
    margin-top: -7px;
    right:10px;
    top: 50%;
    margin-left: .3em;
  }*/

 .x_report .weui_cell_ft.with_arrow:after {
   content:'';
   display: inherit;
   height: 0px;
   width: 0px;
  }
  #C-report .weui_loading{
    top:50%
  }



</style>
