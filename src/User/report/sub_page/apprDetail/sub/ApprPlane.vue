<template>
 <div class="planWrap">
   <appr-body :body-data="bodyD"></appr-body>
   <appr-bottom :bottom-data="bottomD" :body-data="bodyD"></appr-bottom>
   <div style="display: none;" id="InfoTempl"></div>
   <div class="toastwrap">
     <loading :show="showL" :text="toastText"></loading>
   </div>
 </div>
</template>
<!--<appr-head :head-data="headD"></appr-head>-->
<!--import ApprHead from '../sub_comp/appr-head'-->
<script>
  import {Loading} from 'vux-c'
  import ApprBody from '../sub_comp/appr-body'
  import ApprBottom from '../sub_comp/appr-bottom'
  // var $$ = require('jquery')
  var Xvue = require('vue')
  Xvue.filter('date', function (value) {
    value = value || 0
    var date = value.toString().match(/(\d)/g).join('')
    date = parseInt(date)
    date = new Date(date)
    date = window.Miu.dateFormat(date)
    return date
  })
  export default {
    components: {
      ApprBody,
      ApprBottom,
      Loading
    },
    methods: {
      getData (fn) {
        this.showL = true
        this.$http.post(window.Miu.Data.ApiURL + '/Approval_1_0/GetApprovalInfo', {
          authTkn: window.Miu.Data.Token,
          approvalId: this.$route.params.apprId, // this.$route.params.apprId
          shortLinkType: 9
        }).then((res) => {
          var data = res.data.approvalInfo
          // $$('#InfoTempl').append(data.OrderDetail)
          document.querySelectorAll('#InfoTempl')[0].innerHTML = data.OrderDetail
          this.collectInfo(data)
          this.showL = false
        }, (res) => {
          window.alert('wrong')
        })
      },
      collectInfo (data) {
        var listType = this.$route.params.listType
        this.bodyD = {
          ApprovalName: data.ApprovalName || '樱木花道',
          ApprovalDate: data.ApprovalDate,
          EffectiveTimeSpan: data.EffectiveTimeSpan,
          ApprovalStatus: data.ApprovalStatus,
          type: listType,
          fltInfo: [],
          // timeLine
          ApprovalLogList: data.ApprovalLogList.sort(function (a, b) {
            var a1 = a.CreateDate.match(/[\d]+/)
            var b1 = b.CreateDate.match(/[\d]+/)
            if (a1 - b1 > 0) {
              return 1
            } else {
              return -1
            }
          })
        }
        this.bodyD.applyName = this.bodyD.ApprovalLogList[0].Name
        var timeInfo, a, cityInfo, ele, policy
        for (var i = 0; i < (document.querySelectorAll('.go-trip').length) / 2; i++) { // $$('.go-trip>div')
          a = {}
          // timeInfo = $$('.go-trip0' + (i + 1) + ' p').eq(1).find('span').html()
          timeInfo = document.querySelectorAll('.go-trip0' + (i + 1) + ' p')[1].querySelectorAll('span')[0].innerHTML
          // cityInfo = $$('.go-trip0' + (i + 1) + ' p').eq(2).find('span').eq(0).html()
          cityInfo = document.querySelectorAll('.go-trip0' + (i + 1) + ' p')[2].querySelectorAll('span')[0].innerHTML
          // var cost = $$('.go-trip01 p').eq(2).find('span').eq(3).html()
          // $$('.illegal-tit').eq(i).remove()
          var ss = document.querySelectorAll('.illegal-tit')[i]
          try {
            ss.parentNode.removeChild(ss)
          } catch (e) {}
          // ele = $$('.illegal').eq(i).find('p')
          policy = []
          try {
            ele = document.querySelectorAll('.illegal')[i].querySelectorAll('p')[0]
            for (var s = 0; s < ele.length; s += 2) {
              var str = ele.eq(s).text() + ' ' + ele.eq(s + 1).text()
              console.log(str)
              policy.push(str)
            }
          } catch (e) {}
          a.departDate = timeInfo.substring(5, 10).replace(/-/, '月')
          a.orderNo = data.OrderList[i]
          a.cityInfo = cityInfo
          a.IsOutOfLine = data.IsOutOfLine
          a.total = data.OrderAmount
          a.policy = policy
          a.Passengers = data.Passengers
          this.bodyD.fltInfo.push(a)
        }
        this.bottomD = {
          uid: data.ApprovalUID,
          approvalId: data.ApprovalID,
          corpId: data.CorpId,
          shortLinkType: data.shortLinkType || 6
        }
      }
    },
    ready () {
      this.getData()
    },
    data () {
      return {
        totleD: {},
        bodyD: {},
        bottomD: {},
        showL: true,
        toastText: ''
      }
    }
  }
</script>
<style scoped>
  .planWrap{
    background-color: #ddd;
  }
  .toastwrap .weui_loading{
    top:50%
  }
</style>
