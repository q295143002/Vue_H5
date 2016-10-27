<template>
<!-- <div v-if="isServerErr === false"> -->
  <div v-if="showEmpty===true">
    <none-info-bg>您目前暂无任何出行人</none-info-bg>
  </div>
  <div v-else class="w-passenger">
    <group class="mb-1" v-show="isChoose === false">
      <cell title="新增出行人" is-link @click="jumpNewPsg">
        <i slot="icon" class="iconfont mr-05">&#xe608;</i>
      </cell>
    </group>
    <group v-if="isChoose === true">
      <cell @click="checking(item)" v-for="item in psgArr | filterBy keys" :title="item.UserName" inline-desc="不受差旅政策限制,无需审批">
        <span style="color:#999;font-size:0.9rem;" slot="after-title">(非员工)</span>
        <icon v-if="item.choose === false" slot="icon" type="circle" class="w-psg-icon1" :data='item.UserName.charAt(0)'></icon>
        <icon v-else slot="icon"type="success" class="w-psg-icon2"></icon>
      </cell>
    </group>
    <!-- 个人中心 -->
    <group v-for="item in psgArr" v-else>
      <swiper :index="indexPage" style="height:5rem" class="vux-1px-b">
        <swiper-item>
          <cell @click="jumpEditPsg(item)" 
          :title="item.UserName" 
          :inline-desc="item.IDCardList[0].CardType === 9 ?'其他':credentList[item.IDCardList[0].CardType]+item.IDCardList[0].CardNumber">
            <icon type="circle" slot="icon" class="w-psg-icon" :data='item.UserName.charAt(0)'></icon>
          </cell>
        </swiper-item>
        <swiper-item>
          <div class="fl-r w-psg-del" @click="getDeleteIndex(item.UserName)">
            <span>删除</span>
          </div>
        </swiper-item>
      </swiper>
    </group>
      
    <!-- </group> -->
    <!-- 确认删除对话框 -->
    <confirm :show.sync="confirm.show" 
    confirm-text="确定" cancel-text="取消" 
    @on-confirm="DeletePassenger"
    @on-cancel="GetPassengers" title=""><p>确定要删除该项吗</p></confirm>
    
    <loading :show="isShowLoading"></loading>
  </div>
<!-- </div>
<div v-else class="w-serverErr">
  <span>获取数据失败，</span>
  <span class="reTry">请刷新页面重试</span>
</div> -->
</template>
<script>
import {Group, Cell, Icon, Popup, Swiper, SwiperItem, Flexbox, FlexboxItem, Confirm, Loading} from 'vux-c'
import NoneInfoBg from 'public/NoneInfoBg'
export default {
  components: {
    Group,
    Cell,
    Icon,
    Popup,
    Swiper,
    SwiperItem,
    Flexbox,
    FlexboxItem,
    Confirm,
    Loading,
    NoneInfoBg
  },
  props: {
    isChoose: Boolean,
    ContactList2: Array,
    keys: String,
    num: Number
  },
  data () {
    return {
      isServerErr: false,
      isShowLoading: false,
      psgArr: [],
      reedit: 1,
      showEmpty: false,
      showEditPsg: false,
      Psg: {},
      showAddPsg: false,
      // chooseArr: [],
      FirstLetterArr: [],
      isShowSearch: false,
      ApprovalType: ['免审', '出行审批', '违规审批'],
      credentList: ['身份证', '护照', '军官证', '回乡证', '港澳通行证', '台湾通行证', '其他'],
      confirm: {
        show: false
      },
      saveNum: 0, /* 0不刷新, 1刷新 */
      editNum: 0 /* 0不刷新, 1刷新 */
    }
  },
  watch: {
    'saveNum' (newVal) {
      if (this.saveNum === 1) {
        this.GetPassengers()
        this.saveNum = 0
      }
    },
    'editNum' (newVal) {
      if (this.editNum === 1) {
        this.GetPassengers()
        this.editNum = 0
      }
    },
    '$route.path' (newVal, oldVal) {
      console.log(this.$route.path)
      if (this.$route.path === '/user/passenger') {
        this.showAddPsg = false
        this.showEditPsg = false
      }
      if (this.$route.path === '/user/passenger/editPsg') {
        console.log(this.$route.path === '/user/passenger/editPsg')
        this.showEditPsg = true
      }
    }
  },
  ready () {
    // this.GetPassengers()
    this.init()
  },
  methods: {
    init () {
      document.body.style.backgroundColor = '#f7f7f7'
    },
    checking (obj) {
      if (obj.choose === false && this.isChoose === true) {
        obj.choose = true
        this.ContactList2.push(obj)
      } else {
        for (let i in this.ContactList2) {
          if (this.ContactList2[i] === obj) {
            this.ContactList2.splice(i, 1)
          }
        }
        obj.choose = false
      }
    },
    /* 联系人列表 */
    GetPassengers () {
      this.isShowLoading = true
      this.$http({
        method: 'GET',
        url: window.Miu.Data.ApiURL + '/User_1_0/SearchPassengersByPage',
        params: {
          token: window.Miu.Data.Token,
          pageIndex: 1,
          pageSize: 999,
          keys: ''
        }
      }).then(function (response) {
        console.log(response.data.result)
        this.isShowLoading = false
        if (response.data.result !== null) {
          this.showEmpty = false
          for (let i in response.data.result) {
            response.data.result[i].choose = false
          }
          this.psgArr = response.data.result
        } else {
          this.showEmpty = true
        }
      }, function (response) {
        console.log(response.data)
      })
    },
    /* 获取删除项索引 */
    getDeleteIndex (itemName) {
      for (let [k, value] of this.psgArr.entries()) {
        if (value.UserName === itemName) {
          this.deleteIndex = k
          this.confirm.show = true
        }
      }
    },
    /* 删除出行人 */
    DeletePassenger () {
      this.$http({
        method: 'GET',
        url: window.Miu.Data.ApiURL + '/User_1_0/DeleteMemberPassenger',
        params: {
          token: window.Miu.Data.Token,
          passengerID: this.psgArr[this.deleteIndex].PassengerID
        }
      }).then(function (response) {
        console.log(response.data)
        if (response.data.errorMessage === null && response.data.errorCode === null) {
          this.psgArr.splice(this.deleteIndex, 1)
        }
      }, function (response) {
        window.alert('请刷新页面重试')
      })
    },
    /* 跳到新增出行人页 */
    jumpNewPsg () {
      this.showAddPsg = true
      this.$router.go({path: '/user/passenger/newPsg'})
    },
    /* 跳到编辑出行人页 */
    jumpEditPsg (item) {
      this.Psg = item
      this.showEditPsg = true
      this.$router.go({path: '/user/passenger/editPsg'})
    }
  }
}
</script>
<style lang='less'>
  /*@import '../../styles/user/passenger/passenger.less';*/
  .w-passenger{
    .weui_cells{
      margin:0;
      &.vux-no-group-title{
        margin:0;
      }
    }
  }
  .w-passenger .w-psg-icon2:before{
    background-color: #fff;
    font-size: 3rem;
    border-radius: 50%;
    color:#666;
    margin:0.2rem 1rem 0 -0.2rem;
  }
  .w-passenger .w-psg-icon.weui_icon_circle:before,
  .w-passenger .w-psg-icon1.weui_icon_circle:before{
    width:2.8rem;
    height:2.8rem;
    border-radius: 50%;
    color:#fff;
    background-color:#4a9ef7;
    content:attr(data);
    line-height: 2.5rem;
    font-size: 1.2rem;
    margin:0.4rem 1rem 0;
  }
  .w-passenger .w-psg-icon1.weui_icon_circle:before{
     margin:0.4rem 1rem 0 0;
  }
  .w-psg-card{
    color:#666;
    font-size: 90%;
  }
  .w-passenger .vux-flexbox-item:nth-of-type(2n) .w-psg-icon.weui_icon_circle:before,
  .w-passenger .weui_cell:nth-of-type(2n) .w-psg-icon1.weui_icon:before{
    background-color:#f19ec2;
  }
  .w-passenger .w-psg-search{
    position: relative;
    right:2rem;
  }
  .w-psg-ok{ 
    float: right;
  }
  .w-psg-del {
    width: 24%;
    background-color: red;
    color: #fff;
    display: block;
    height: 5rem;
    line-height: 5rem;
    text-align: center;
  }
  .w-passenger>div:nth-child(2n) .weui_cells .vux-swiper-item .w-psg-icon.weui_icon_circle:before{
      background-color:#f19ec2;
    }
</style>