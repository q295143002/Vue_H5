<template>
  <appr-body :body-data="bodyD"></appr-body>
  <appr-bottom :bottom-data="bottomD" :body-data="bodyD"></appr-bottom>
  <div style="display: none;" id="InfoTempl"></div>
  <div class="toastwrap">
  <loading :show="showL" :text="toastText"></loading>
  </div>
</template>
<!--<appr-head :head-data="headD"></appr-head>-->
<!--import ApprHead from '../sub_comp/appr-head'-->
<script>
  import {Loading} from 'vux-c'
  import ApprBody from '../sub_comp/appr-body'
  import ApprBottom from '../sub_comp/appr-bottom'
  var $$ = require('jquery')
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
        this.$http.post(window.Miu.Data.weiXin + '/Approval_1_0/GetApprovalInfo', {
          authTkn: window.Miu.Data.Token,
          approvalId: 355, // this.$route.params.apprId
          shortLinkType: 6
        }).then((res) => {
          var data = res.data.approvalInfo
          $$('#InfoTempl').append(data.OrderDetail)
          this.collectInfo(data)
          this.showL = false
        }, (res) => {
          window.alert('wrong')
        })
      },
      collectInfo (data) {
        this.bodyD = {
          ApprovalName: data.ApprovalName || '樱木花道',
          ApprovalDate: data.ApprovalDate,
          EffectiveTimeSpan: data.EffectiveTimeSpan,
          ApprovalStatus: data.ApprovalStatus,
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
        var timeInfo, a, cityInfo, ele, policy
        for (var i = 0; i < ($$('.go-trip>div').length) / 2; i++) {
          a = {}
          timeInfo = $$('.go-trip0' + (i + 1) + ' p').eq(1).find('span').html()
          cityInfo = $$('.go-trip0' + (i + 1) + ' p').eq(2).find('span').eq(0).html()
          // var cost = $$('.go-trip01 p').eq(2).find('span').eq(3).html()
          $$('.illegal-tit').eq(i).remove()
          ele = $$('.illegal').eq(i).find('p')
          policy = []
          for (var s = 0; s < ele.length; s += 2) {
            var str = ele.eq(s).text() + ' ' + ele.eq(s + 1).text()
            console.log(str)
            policy.push(str)
          }
          a.departDate = timeInfo.substring(5, 10).replace(/-/, '月')
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
  body{
    background-color: #eee;
  }
  .toastwrap .weui_loading{
    top:50%
  }
</style>
