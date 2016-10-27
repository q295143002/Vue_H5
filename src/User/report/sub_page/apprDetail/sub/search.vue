<template>
  <div class="X-search">
<div class="search-model">
    <input v-model="searchFilter" type="search" placeholder="search" style="width: 100%;overflow: scroll;white-space: nowrap;height: 30px;text-align: center">
</div>
    <div class='scroll-wrap1' >
    <div  class='scroll-wrap2'>
      <ul class="bread">
        <li v-for="bread in breads" track-by="$index">
          <span  v-if="breads.length==$index+1">{{bread}}</span>
          <a v-if="breads.length!==$index+1" href="javascript:;" @click="breadRedirct($index)">{{bread}}</a>
          <span class='gt' v-if="breads.length!==$index+1">&gt;</span>
        </li>

      </ul>

    </div>
      </div>
    <div class="search-list">
      <ul>
        <li v-for="item in items|filterBy searchFilter in 'CostCenterListToGrade.Name' 'value'">
          <flexbox :gutter="5">
            <flexbox-item :span="1/12" style="text-align: right;">
          <input type="radio" v-bind:disabled=item.flag  name="search" :value='item.CostCenterListToGrade.Name' @click="searchRadio(item.CostCenterListToGrade.Name)" v-model="check" >
            </flexbox-item>
            <flexbox-item :span="11/12">
          <span class="searchCon" @click="toNext(item.ChiledNodes,item.CostCenterListToGrade.Name)"><span >{{item.CostCenterListToGrade.Name}}</span><br><span  class="span1" >{{item.CostCenterListApprovers.value}}</span></span>
            </flexbox-item>
          </flexbox>

        </li>
      </ul>

    </div>

  </div>
<div style="position: absolute;width:100%;bottom: 0;">
  <x-button @click="admit" type="primary">确认转审到该成本中心</x-button>
</div>
  <loading :show="showX" :text="toastText1"></loading>
  <toast :show.sync="show3" type="cancel">网络异常提交失败，请重试</toast>
  <toast :show.sync="show1" type="warn">请选择成本中心，逗逼！</toast>
</template>

<script>
const $ = require('jquery')
import {Flexbox, FlexboxItem, XButton, Loading, Toast} from 'vux-c'
export default{
  components: {
    Flexbox,
    FlexboxItem,
    XButton,
    Loading,
    Toast
  },
  data () {
    return {
      toastText1: '加载中',
      showX: false,
      show1: false,
      show3: false,
      dataX: [{name: '市场部', value: '审批人：110', ChiledNodes: [{name: '卖西瓜', value: '审批人：110', ChiledNodes: [{name: '卖菠萝', value: '审批人：110'}]}, {name: '卖小计', value: '审批人：110'}]},
        {name: '技术部', value: '审批人：110', ChiledNodes: [{name: '市场部', value: '审批人：110'}]},
        {name: '产品部', value: '审批人：110', ChiledNodes: [{name: '市场部', value: '审批人：110'}]}],
      breads: ['觅优技术'],
      breadsData: [],
      itemsBridge: [],
      items: [],
      check: '',
      checkArr: [],
      searchFilter: '',
      costCenterType: '',
      costCenterId: true
    }
  },
  methods: {
    toNext (datac, name) {
      console.log(datac.length)
      if (datac === undefined || datac === null || datac.length === 0) {
        return
      }
      this.check = 'off'
      this.searchFilter = ''
      if (name) {
        this.breads.push(name)
        var bLength = this.breads.length - 1
        console.log(this.breads)
      }
      this.items = []
      for (var i = 0; i < datac.length; i++) {
        var obj = {}
        obj.CostCenterListToGrade = {}
        obj.CostCenterListApprovers = []
        console.log(datac[i].CostCenterListApprovers)
        var value = '本级不能选，请向下选择'
        var flag = true
        datac[i].CostCenterListApprovers = datac[i].CostCenterListApprovers || []
        if (datac[i].CostCenterListApprovers.length > 0) {
          value = ''
          flag = false
          this.costCenterType = []
          this.CostCenterListId = []
          for (var x = 0; x < datac[i].CostCenterListApprovers.length; x++) {
            obj.CostCenterListApprovers[x] = {}
            obj.CostCenterListApprovers[x].ApproverName = datac[i].CostCenterListApprovers[x].ApproverName
            this.costCenterType.push(datac[i].CostCenterListApprovers[x].CostCenterListType)
            this.CostCenterListId.push(datac[i].CostCenterListApprovers[x].CostCenterListId)
            value += datac[i].CostCenterListApprovers[x].ApproverName + ' '
          }
        }
        obj.CostCenterListToGrade.Name = datac[i].CostCenterListToGrade.Name
        obj.CostCenterListApprovers.value = value
        obj.flag = flag
        obj.ChiledNodes = datac[i].ChiledNodes
        this.items.push(obj)
      }
      if (name) {
        this.breadsData[bLength] = this.items
      }
    },
    breadRedirct (index) {
      var data = null
      this.breads = this.breads.splice(0, index + 1)
      console.log(this.breads)
      if (index === 0) {
        data = this.dataX
      } else {
        data = this.breadsData[index]
      }
      console.log(this.breadsData)
      this.toNext(data)
    },
    searchRadio (name) {
      this.checkArr.push(name)
    },
    admit () {
      if (this.check !== 'off') {
        var a = this.checkArr.pop()
        var b = []
        $.extend(b, this.breads)
        b.push(a)
        console.log(this.costCenterType) // this.$route.params.apprId
        console.log(this.CostCenterListId) // this.$route.params.apprId
        console.log(b) // this.$route.params.apprId
        this.$http.post(window.Miu.Data.ApiURL + '/Approval_1_0/ForwardingApproval', {
          authTkn: window.Miu.Data.Token,
          uid: this.$route.params.uid, // this.$route.params.apprId
          approvalId: this.$route.params.approvalId, // this.$route.params.apprId
          corpId: this.$route.params.corpId, // this.$route.params.apprId
          remark: this.$route.params.remark, // this.$route.params.apprId
          costCenterType: this.costCenterType, // this.$route.params.apprId
          costCenterId: this.CostCenterListId, // this.$route.params.apprId
          shortLinkType: 6
        }).then((res) => {
          console.log(res)
          this.$router.go('/report/flight/' + this.$route.params.approvalId)
        }, (res) => {
          this.show3 = true
        })
      } else {
        this.show1 = true
      }
    },
    init (fn) {
      this.showX = true
      this.$http.post(window.Miu.Data.ApiURL + '/Approval_1_0/GetCostCenterListToGrades', {
        authTkn: window.Miu.Data.Token,
        corpId: this.$route.params.corpId, // this.$route.params.apprId
        uid: this.$route.params.uid
      }).then((res) => {
        this.dataX = res.data.list
        fn()
        this.showX = false
      }, (res) => {
        this.showX = false
        this.show3 = true
      })
    }
  },
  ready () {
    var _this = this
    this.init(function () { _this.toNext(_this.dataX) })
  }
}
</script>
<style>
  .X-search .search-model{
    padding:8px 10px;
    background-color: #f0f0f0;
  }
  .X-search input[type='search']{
    border:none;
    background-color: #ccc;
    border-radius: 8px;
    height:39px;
    outline: none;
  }
  .X-search .scroll-wrap1{
    padding:8px 10px;
    overflow: hidden;
    white-space: nowrap;
    height: 30px;
    background-color: #fff;
    border-bottom: 1px solid #ccc;
    position: relative;
    z-index:15;
  }
  .X-search .scroll-wrap2{
   width: 100%;
    overflow: auto;
    white-space: nowrap;
    background-color: #fff;
    height: 60px;
    font-size: 20px;
    position: relative;
  }
  .X-search .search-list{
    padding:0px 10px 0 10px;
    background-color: #fff;
    margin-top: 10px;
  }
  .X-search .search-list ul{
   list-style: none;
  }
  .X-search .search-list li{
    padding-top: 10px;
  }


  .X-search input[type='radio']{
    -webkit-appearance: none;
    width:30px;
    height: 30px;
    border-radius: 50%;
    border:2px solid #999;
    outline: none;
    position: relative;
  }
  .X-search input[type='radio']:checked{
    background-color: #5f97f6;
    border:2px solid #5f97f6;
  }
  .X-search input[type='radio']:checked::after{
    content: '';
    background-color: transparent;
    position: absolute;
    width:6px;
    height: 15px;
    top:2px;
    left:10px;
    border-bottom: 2px solid #fff;
    border-right: 2px solid #fff;
    transform: rotate(45deg);
  }
  .X-search .searchCon{
    display: inline-block;
    border-bottom: 1px solid #ccc;
    padding-left: 20px;
    width:110%;
  }
  .X-search .searchCon .span1{
    color: #ccc;
  }
  .X-search .bread{
    list-style: none;
  }
  .X-search .bread li{
   display: inline-block;

  }
  .X-search .bread li a,.X-search .bread .gt{
    color: #0099ee;

  }
  .X-search{
    padding:0;
    background-color: #f5f5f5;
  }


</style>
