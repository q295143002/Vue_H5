<template>
  <div >  
    <group v-el:stuff @click="CheckStaff($event)">
      <div v-for = 'that in Staff.list' >
        <cell
          
          :title="item.UserName"
          v-for="item in that"
          :inline-desc="item.PolicyName+'差旅标准 , '+ApprovalType[item.ApprovalType]"
        >
          <span class="w-deptName" slot="after-title">{{item.DeptName}}</span>
          <icon v-if="!item.choose" slot="icon" type="circle" class="w-staff-icon"></icon>
          <icon v-else slot="icon" type="success" class="w-staff-icon2"></icon>  
        </cell>
      </div>
    </group>
  </div>
</template>
<script>
import {Group, Cell, Icon, Search, Scroller} from 'vux-c'
export default {
  components: {
    Group,
    Cell,
    Icon,
    Search,
    Scroller
  },
  data () {
    return {
      userinfo: window.Miu.Data.UserInfo,
      staffId: '',   /* 员工ID */
      staffArr: [],
      ApprovalType: ['免审', '出行审批', '违规审批'],
      PageNum: 1,
      /* 所有的员工 */
      Staff: {
        list: [],
        idList: []
      },
      /* 当前页面展示的员工 */
      DisplayStaff: {
        page: 0,
        list: [],
        showList: []
      },
      /* 选中的员工 */
      ChooseStaff: {
        list: [],
        idList: []
      }
    }
  },
  props: {
    isChoose: Boolean,
    ContactList1: Array,
    keys: String,
    type: String,
    delArr: Array,
    addArr: Array
  },
  ready () {
    // this.GetCorpStaff('')
  },
  watch: {
    'DisplayStaff.page' (val, oldval) {
      for (var i = oldval; i < this.DisplayStaff.page; i++) {
        this.DisplayStaff.list.push(this.Staff.list[this.DisplayStaff.showList[i]])
      }
    }
  },
  methods: {
    CheckStaff (event) {
      console.log(event)
      console.log(this.$els.stuff)
    },
    GetCorpStaff () {
      this.$http({
        method: 'GET',
        url: window.Miu.Data.ApiURL + '/User_1_0/GetCorpStaff',
        params: {
          token: window.Miu.Data.Token,
          pageNumber: 1,
          pageSize: 500,
          keys: ''
        }
      }).then(function (response) {
        let StaffList = []
        for (var i = 0; i < Math.ceil(response.data.customers.length / 5); i++) {
          StaffList[i] = response.data.customers.slice(i * 5, (i + 1) * 5)
          this.Staff.list.$set([i], StaffList[i])
        }
        this.DisplayStaff.page = 1
      }, function (response) {
        this.$root.Toast('加载错误请刷新页面重试')
      })
    },
    mapObj () {

    },
    GetCostCenterList (obj) {
      this.$http.post(window.Miu.Data.ApiURL + '/Approval_1_0/GetCostCenterList',
        {
          'corpId': this.userinfo.CorpID,
          'uid': this.staffId,
          'authTkn': window.Miu.Data.Token
        }
      ).then(function (response) {
        if (response.data.errorCode === null && response.data.errorMessage === null) {
          // if (!obj.costList) {
          obj.costList = response.data.result
          this.ContactList1.push(obj)
          // }
        }
      }, function (response) {
        console.log(response.data)
      })
    }
  }
}
</script>
<style lang='less'>
  /*@import '../../styles/user/staff/staff.less';*/
  .w-staff .w-staff-icon2:before{
    background-color: #fff;
    font-size: 3rem;
    border-radius: 50%;
    color:#666;
    margin:0 1rem 0 -0.2rem;
  }
  .w-staff .w-staff-icon.weui_icon_circle:before{
    width:2.8rem;
    height:2.8rem;
    border-radius: 50%;
    color:#fff;
    background-color:#4a9ef7;
    content:attr(data);
    line-height: 2.5rem;
    font-size: 1.2rem;
    margin:0 1rem 0 0;
  }
  .w-staff .weui_cell:nth-of-type(2n) .w-staff-icon.weui_icon_circle:before{
    background-color:#f19ec2;
  }
  .w-staff .w-psg-search{
    position: relative;
    right:2rem;
  }
  .w-staff .weui_icon_clear:before,.w-staff .weui_icon_search:before{
    font-size: 1.5rem;
  }
  .w-psg-search {
    background: transparent;
    border:none;
    outline: none;
    box-sizing: border-box;
    height:2rem;
    width:11rem;
    font-size: 1rem;
  }
  .w-staff .weui_icon_search.w-psg-search-icon:before{
    font-size: 1rem;
  }
</style>