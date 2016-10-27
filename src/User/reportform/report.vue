<template>
<div class="w-report">
  <Group>
    <!-- <cell class="vux-1px-tb" title="报表内容" value="选择查看内容" is-link></cell> -->
    <!-- <cell class="vux-1px-tb" title="选择部门" value="全公司" is-link></cell> -->
    <!-- <cell class="vux-1px-tb" title="选择年份" value="2016" is-link></cell> -->
    <popup-picker title="报表内容" :data="conData" :value.sync="contact"></popup-picker>
    <popup-picker title="选择部门" :data="departData" :value.sync="dept.department"></popup-picker>
    <cell @click="popup.checkStaff=true" class="vux-1px-tb" title="选择员工" value="录入员工姓名(非必填)" is-link></cell>
    <popup-picker v-if="contact[0] !== '差旅违规'" title="选择年份" :data="yearData" :value.sync="year"></popup-picker>
    <!-- 差旅违规显示 -->
    <group v-if="contact[0] === '差旅违规'">
      <datetime :value.sync="yearDateS" @on-change="" title="开始时间"></datetime>
      <datetime :value.sync="yearDateE" @on-change="" title="结束时间"></datetime>
    </group>
    <x-button class="w-report-query mt-4" @click="viewreport">查询</x-button>
  </Group>
  <!-- 选择员工 -->
  <popup :show.sync="popup.checkStaff" height="100%">
    <div>
      <div>
        <ul class="w-checkstaff-title">
          <li>关闭</li>
          <li>选择员工</li>
          <li>确认</li>
        </ul>
      </div>
      <search-filter :value.sync="keyValue" placeholder="输入名称进行搜索" cancel-text="取消"></search-filter>
    </div>
    <div style="overflow:auto;height:100%;">
      <staff :close.sync="popup.checkStaff" :type="staff" :keys="keyValue"></staff>
    </div> 
  </popup>
  <!-- 查看报表 -->
  <popup :show.sync="popup.viewreport" height="100%" style="overflow:auto;">
    <viewreport></viewreport>
  </popup>
</div>
</template>
<script>
import {Group, Cell, XButton, PopupPicker, Popup, Datetime} from 'vux-c'
import Staff from '../staff/staff'
import SearchFilter from '../../Public/SearchFilter'
import Viewreport from './viewreport/viewreport'
export default {
  components: {
    Group,
    Cell,
    XButton,
    PopupPicker,
    Popup,
    Staff,
    SearchFilter,
    Datetime,
    Viewreport
  },
  ready () {
    this.start()
  },
  data () {
    return {
      step: 0,
      popup: {
        checkStaff: false,
        viewreport: false
      },
      userinfo: window.Miu.Data.UserInfo,
      staff: 'staff',
      contact: ['选择查看内容'],
      keyValue: '',
      dept: {
        department: ['全公司'],
        deptID: '',
        corpID: ''
      },
      year: ['2016'],
      conData: [['机票', '用车', '保险', '差旅违规']],
      departData: [['技术部', '市场部', '销售部', '公共部']],
      yearData: [['2013', '2014', '2015', '2016']],
      yearDateS: '2016-07-08',
      yearDateE: '2016-08-09'
    }
  },
  methods: {
    start () {
      switch (this.step) {
        case 0:
          this.GetCorpDeptsListByUID()
          break
        case 1:
          this.GetCorpDeptsListByDept()
          break
      }
    },
    /* 根据员工UID获取员工对应部门以及下属部门 */
    GetCorpDeptsListByUID () {
      let that = this
      this.$http({
        method: 'POST',
        url: 'http://192.168.0.108:200/Approval_1_0/GetCorpDeptsListByUID',
        data: {
          'uid': this.userinfo.UID,
          'authTkn': window.Miu.Data.Token
        }
      }).then(function (response) {
        console.log(response.data)
        if (response.data.errorMessage === null && response.data.errorCode === null) {
          that.dept = {
            department: [response.data.list[0].DeptName],
            deptID: response.data.list[0].DeptID,
            corpID: response.data.list[0].CorpID
          }
          that.step = 1
          that.start()
        }
      }, function (response) {
        console.log(response.data)
      })
    },
    GetCorpDeptsListByDept () {
      let that = this
      this.$http({
        method: 'POST',
        url: window.Miu.Data.ApiURL + '/Approval_1_0/GetCorpDeptsListByDept',
        data: {
          'corpId': that.dept.corpID,
          'deptID': that.dept.deptID,
          'authTkn': window.Miu.Data.Token
        }
      }).then(function (response) {
        console.log(response.data)
        console.log(2)
      }, function (response) {
        console.log(response.data)
      })
    },
    viewreport () {
      this.popup.viewreport = true
    }
  }
}
</script>
<style lang="less">
  @import '../../styles/user/report/report.less';
</style>