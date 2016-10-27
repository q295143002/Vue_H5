<template>
 <div id="creport">
   <tab>
     <tab-item v-on:click='type="toMe"' @click='change(type)' :selected='type=== "toMe"'>发给我的</tab-item>
     <tab-item v-on:click='type="toOther"' @click='change(type)' :selected='type=== "toOther"'>我发起的</tab-item>
   </tab>
   <div class="scroller-wrap" v-show="isToMe">
     <flexbox class="tc"  v-show="toMe1">
       <flexbox-item> 没有审批单</flexbox-item>
     </flexbox>
   <x-scroller  v-show="!toMe1" lock-x scrollbar-y use-pullup use-pulldown  height=""  @pullup:loading="loadMore" @pulldown:loading="refresh" v-ref:scroller>
     <div class="x_report">
       <group v-for="items in toMeData" track-by="$index" class="animated" v-if="items.ApprovalType==='国内机票'">
         <cell @click="$router.go('/report/toMe/flight/'+items.ApprovalID)"><!--假数据传参-->
           <flexbox class="flx1">
             <flexbox-item :span="4" class="tl">
               <icon class="icon_big tc"></icon><span style="vertical-align: 60%">{{items.ApprovalType==='国内机票'?'机票':items.ApprovalType}}</span>
             </flexbox-item>
             <flexbox-item :span="5">
             </flexbox-item>
             <flexbox-item :span="3" class="tl">
              <div v-if="b(items.ApprovalDate)||items.ApprovalStatus!=0">
               <span class=" x_f_big colorf90" v-if="items.ApprovalStatus===0">待审批</span>
               <span class=" x_f_big" v-if="items.ApprovalStatus===2">已驳回</span>
               <span class=" x_f_big" v-if="items.ApprovalStatus===1">已通过</span>
               <span class=" x_f_big" v-if="items.ApprovalStatus===3">已转审</span>
               <span class=" x_f_big" v-if="items.ApprovalStatus===4">已取消</span>
              </div>
              <div v-if="!b(items.ApprovalDate)&&items.ApprovalStatus===0">
                <span class=" x_f_big">审批超时</span>
              </div>
             </flexbox-item>
           </flexbox>
           <flexbox>
             <flexbox-item :span="12">
               <div class="x_icon_word">
                 <flexbox :gutter="0" style="margin: 5px 0;">
                   <flexbox-item :span="7" class='tl'>
                     <span class="x_c_black x_f_big">申请人：<span >{{items.ApprovalLogList[0].Name}}&nbsp;</span></span>
                   </flexbox-item>
                   <flexbox-item :span="5" class='tl'>
                     <span class=" x_f_small" v-if="items.ApprovalStatus===0&&b(items.ApprovalDate)">剩余审批时间{{items.ApprovalDate|timeLeft items.EffectiveTimeSpan}}分钟</span>
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
   </x-scroller>
</div>
   <div class="scroller-wrap" v-show="!isToMe">

     <flexbox class="tc"  v-show="toOther1">
       <flexbox-item> 没有审批单</flexbox-item>
     </flexbox>
     <x-scroller  v-show="!toOther1" lock-x scrollbar-y use-pullup use-pulldown  @pullup:loading="loadMore" @pulldown:loading="refresh" v-ref:scroller>

       <div class="x_report">
         <group v-for="items in toOtherData" track-by="$index" class="animated" v-if="items.ApprovalType==='国内机票'">

           <cell @click="$router.go('/report/toOther/flight/'+items.ApprovalID)"><!--假数据传参-->

             <flexbox class="flx1">
               <flexbox-item :span="4" class="tl">
                 <icon class="icon_big tc"></icon><span style="vertical-align: 60%">{{items.ApprovalType==='国内机票'?'机票':items.ApprovalType}}</span>
               </flexbox-item>
               <flexbox-item :span="5">
               </flexbox-item>
               <flexbox-item :span="3" class="tl">
                <div v-if="b(items.ApprovalDate)||items.ApprovalStatus!=0">
                 <span class=" x_f_big colorf90" v-if="items.ApprovalStatus===0">待审批</span>
                 <span class=" x_f_big" v-if="items.ApprovalStatus===2">已驳回</span>
                 <span class=" x_f_big" v-if="items.ApprovalStatus===1">已通过</span>
                 <span class=" x_f_big" v-if="items.ApprovalStatus===3">已转审</span>
                 <span class=" x_f_big" v-if="items.ApprovalStatus===4">已取消</span>
                </div>
                <div v-if="!b(items.ApprovalDate)&&items.ApprovalStatus===0">
                  <span class=" x_f_big">审批超时</span>
                </div>
               </flexbox-item>
             </flexbox>
             <flexbox>
               <flexbox-item :span="12">
                 <div class="x_icon_word">
                   <flexbox :gutter="0" style="margin: 5px 0;">
                     <flexbox-item :span="7" class='tl'>
                       <span class="x_c_black x_f_big">申请人：<span >{{items.ApprovalLogList[0].Name}}&nbsp;</span></span>
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
     </x-scroller>
</div>
   <loading :show="showL" :text="toastText"></loading>
   <toast :show.sync="show3" type="cancel">{{alertMsg}}</toast>
 </div>
</template>
<script>
  import { Tab, TabItem, Group, Loading, XButton, Flexbox, FlexboxItem, Cell, Icon, Toast } from 'vux-c'
  import XScroller from '../component/x-scroller'
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
      Loading,
      Toast,
      XScroller
    },
    ready: function (uuid) {
      this.showL = true
      var _self = this
      var obj = {
        'init': true,
        'type': 'toMe',
        'fn': this.setInit,
        'method': 'refresh',
        'fn1': function () {
          _self.$nextTick(() => {
            _self.$broadcast('pulldown:reset', uuid)
          })
        }
      }
      var obj1 = {
        'init': true,
        'type': 'toOther',
        'method': 'refresh',
        'fn1': function () {
          _self.$nextTick(() => {
            _self.$broadcast('pulldown:reset', uuid)
          })
        }
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
        alertMsg: '获取数据失败',
        show3: false,
        toOther1: false,
        toMe1: false
      }
    },
    watch: {
    },
    methods: {
      b: function (val1) {
        val1 = val1.toString().match(/(\d)/g).join('')
        var now = Date.parse(new Date())
        var leftTime = 0
        leftTime = val1 - now
        if (leftTime < 0) {
          return false
        } else {
          return true
        }
      },
      loadMore (uuid) {
        var _self = this
        this.showL = true
        var obj = {
          'type': this.type,
          'fn1': function () {
            _self.$nextTick(() => {
              _self.$broadcast('pullup:reset', uuid)
            })
          },
          'method': 'more'
        }
        if (this.isNull) {
          obj.fn1()
          if (obj.type === 'toMe') {  // scroller 下拉到最后一个的时候会遮罩 这里通过修改transform 来改变
            document.querySelectorAll('.xs-container')[0].style.marginTop = '-33px'
          } else {
            document.querySelectorAll('.xs-container')[1].style.marginTop = '-33px'
          }
          this.alertMsg = '没有更多数据啦'
          this.show3 = true
          this.showL = false
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
        document.querySelectorAll('.xs-container')[0].style.marginTop = '0'
        document.querySelectorAll('.xs-container')[1].style.marginTop = '0'
        var url = '/Approval_1_0/GetOperatedApprovalList'
        if (obj.type === 'toOther') {
          url = '/Approval_1_0/GetApprovalList'
        }
        this.$http.post(window.Miu.Data.weiXin + url, {
          authTkn: window.Miu.Data.Token,
          uid: window.Miu.Data.UserInfo.UID,
          pageIndex: this.pageIndex,
          ApprovalType: '国内机票',
          pageSize: 10
        }, {DisableLoading: true}).then((res) => {
          if (res.data.list.Tag === null || res.data.list.Tag.Approvals.length === 0) {
            if (obj.init) {
              if (obj.type === 'toMe') {
                this.toMe1 = true
              } else {
                this.toOther1 = true
              }
            }
            obj.fn1()
            this.isNull = true
            this.showL = false
            return
          }
          if (obj.type === 'toMe') {
            this.toMe1 = false
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
            this.toOther1 = false
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
          this.alertMsg = '获取数据失败'
          this.show3 = true
        })
      }

    }
  }

</script>
<style >
  body{
    /*background-color: #ddd;*/
  }
  .colorf90{
    color: #ff750d
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
  .x_report>div:first-child{
    margin-top: 59px;
  }
  #creport .vux-tab{
    position: fixed;
    z-index: 999;
    width: 100%;
  }
  .x_report  .flx1{
    border-bottom: 1px solid #ccc;
    padding-left: 100px;
    padding-right: 100px;
    margin-left: -100px;
    margin-right: -100px;

  }

  #creport {
    border-top: 1px solid #fff;
    position:absolute;
    top:0;bottom:0;
    width:100%;
    height:100%;
    background:#eee;
  }
  #creport .weui_cells{
    border-radius:10px;
  }
  .scroller-wrap{
    padding:0 10px !important;
  }
  .x_report .icon_big:before{font-size:44px;}
  .x_report  .weui_icon_undefined {
    width: 40px;
    display: inline-block;
    height:40px;
    background: url('../assets/planeicon.png') no-repeat center;
    background-size: 70%;
  }

  .x_report div.weui_cell_ft{vertical-align:middle;width:100%;}

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
  #creport .weui_loading{
    top:50% !important;
  }



</style>
