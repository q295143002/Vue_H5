<template>
  <div class="w-staff">
    <group>
      <cell track-by="$index" @click="checking(item)" :title="item.UserName" v-if="item.PolicyName!==null"
      v-for="(index,item) in staffArr | filterBy keys in 'UserName'"
      :inline-desc="item.PolicyName+'差旅标准 , '+ApprovalType[item.ApprovalType]">
        <span class="w-deptName" slot="after-title">{{item.DeptName}}</span>
        <icon v-if="item.choose === false" slot="icon" type="circle" class="w-staff-icon" 
        :data='item.UserName.charAt(0)'></icon>
        <icon v-else slot="icon" type="success" class="w-staff-icon2"></icon>  
      </cell>
    </group>
    <!-- <loading :show="showloading"></loading> -->
  </div>
</template>
<script>
import {Group, Cell, Icon, Search, Loading} from 'vux-c'
export default {
  components: {
    Group,
    Cell,
    Icon,
    Search,
    Loading
  },
  data () {
    return {
      userinfo: window.Miu.Data.UserInfo,
      staffId: '',   /* 员工ID */
      staffArr: [],
      showloading: false,
      // checkArr: []
      // chooseArr: [],
      ApprovalType: ['免审', '出行审批', '违规审批']
    }
  },
  props: {
    isChoose: Boolean,
    ContactList1: Array,
    keys: String,
    type: String,
    delArr: Array,
    addArr: Array,
    num: Number
  },
  ready () {
    this.GetCorpStaff()
  },
  watch: {
    'delArr' (newVal, oldVal) {
      newVal !== undefined && newVal.length > 0 ? this.deleteCheck() : ''
    }
  },
  methods: {
    checking (obj) {
      // console.log(this.ContactList1, this.num)
      if (obj.choose === false && obj.choose === false) {
        obj.choose = true
        if (this.ContactList1.length < this.num) {
          this.staffId = obj.CorpUID
          this.GetCostCenterList(obj)
        } else {
          obj.choose = false
          this.$root.Toast('最多只能选9个哦')
        }
        // this.ContactList1.push(obj)
      } else {
        for (let i in this.ContactList1) {
          if (this.ContactList1[i] === obj) {
            this.ContactList1.splice(i, 1)
          }
        }
        obj.choose = false
      }
    },
    /* 取消勾选 */
    deleteCheck () {
      const that = this
      this.delArr.map(function (item, index) {
        for (let i in that.ContactList1) {
          if (that.ContactList1[i] === item) {
            that.ContactList1[i].choose = false
            that.ContactList1.splice(i, 1)
          }
        }
      })
      this.delArr = []
    },
    GetCorpStaff () {
      this.showloading = true
      this.$http({
        method: 'GET',
        url: window.Miu.Data.ApiURL + '/User_1_0/GetCorpStaff',
        params: {
          token: window.Miu.Data.Token,
          pageNumber: 1,
          pageSize: 999,
          keys: ''
        }
      }).then(function (response) {
        // console.log(response.data)
        this.showloading = false
        for (let i in response.data.customers) {
          response.data.customers[i].choose = false
        }
        this.staffArr.splice(0, 0, this.userinfo.UserName)
        this.staffArr = response.data.customers
      }, function (response) {
        console.log(response.data)
      })
      console.log(this.keys)
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