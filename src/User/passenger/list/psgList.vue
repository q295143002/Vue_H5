<template>
<!-- <scroller v-if="isCheck===true" height="100%" :bounce='false' lock-x scrollbar-y v-ref:scroller> -->
  <div style="height:100%;overflow:auto;" v-if="isCheck===true">
    <group>
      <div class="sp" @click="checking(item)" v-for="item in psgObj.list | filterBy key">
        <cell :title="getname(item)" :inline-desc="item.PolicyName + ',' + ApprovalType[item.ApprovalType]">
          <span style="color:#999;font-size:0.9rem;" slot="after-title">(非员工)</span>
          <icon v-if="item.choose === false" slot="icon" type="circle" class="w-psg-icon" :data='getname(item).charAt(0)|uppercase'></icon>
          <icon v-else slot="icon" type="success" class="w-psg-icon2"></icon>
        </cell>
      </div>
      <div style="height:143px;"></div>
    </group>
  </div>
<!-- </scroller> -->

  <scroller v-else height="100%" :bounce='false' lock-x scrollbar-y enable-horizontal-swiping v-ref:scroller>
    <div>
      <!-- // -->
      <div  class="ps" v-for="(index,item) in psgObj.list">
        <swiper style="width:200%;overflow:hidden;" 
        :index="item.swiper"
        @on-index-change="back(item, $index, do)">
          <swiper-item style="width:50%;">
            <cell @click="jumpEditPsg(item)" :title="getname(item)" :inline-desc="getCard(item)">
              <icon type="circle" slot="icon" class="w-psg-icon" 
              :data='getname(item).charAt(0)|uppercase'></icon>
            </cell>
          </swiper-item>
          <swiper-item>
            <div class="w-psg-del fl-r" @click="getDelIndex(item.PassengerID)">
              <span>删除</span>
            </div>
          </swiper-item>
        </swiper>
      </div>
    </div>
  </scroller>
  <!-- 确认删除对话框 -->
  <div class="w-confirm">
    <confirm :show.sync="show.confirm" 
    confirm-text="确定" cancel-text="取消"
    @on-confirm="DeletePsg"
    @on-cancel="cancel" title="">
    <p style="text-align:center;">确定要删除该项吗?</p></confirm>
  </div>
  <loading :show.sync="showLoad"></loading>
</template>
<script>
import {Scroller, SwiperItem, Cell, Icon, Confirm, Group, Loading} from 'vux-c'
import Swiper from '../swiper'
export default {
  components: {
    Scroller,
    Swiper,
    SwiperItem,
    Cell,
    Icon,
    Confirm,
    Group,
    Loading
  },
  data () {
    return {
      psgArr: [],
      userinfo: window.Miu.Data.UserInfo,
      credentList: ['身份证', '护照', '军官证', '回乡证', '港澳通行证', '台湾通行证', '其他'],
      ApprovalType: ['免审', '出行审批', '违规审批'],
      CostCenterList: [], /* 成本中心数组 */
      deleteIndex: 0,   /* 删除索引 */
      swiperIndex: null,
      do: true,
      showLoad: false,
      show: {
        confirm: false
      },
      confirm: {
        show: false
      },
      psgObj: {
        number: 0,
        list: []
      }
    }
  },
  ready () {
    this.getPsgList(this.psgObj, true)
  },
  props: {
    isNone: Boolean,
    isCheck: Boolean,
    checkList: Array,
    key: String,
    number: Number
  },
  watch: {
    'psgObj.list' (newVal, oldVal) {
      if (this.isCheck !== true) {
        this.$refs.scroller.reset()
      }
      this.psgObj.list.length > 0 ? this.isNone = false : this.isNone = true
    }
  },
  methods: {
    /* swiper自动切换回去 */
    back (item, index, bool) {
      if (bool === true) {
        this.dosomething(item, index)
      } else {
        this.do = true
      }
    },
    /* 设置swiper切换索引 */
    dosomething (item, index) {
      if (item.swiper === 0) {
        item.swiper = 1
        if (this.swiperIndex === null) {
          this.swiperIndex = index
        } else {
          this.psgObj.list[this.swiperIndex].swiper = 0
          this.swiperIndex = index
          this.do = false
        }
      } else {
        item.swiper = 0
        this.swiperIndex = null
      }
    },
    checking (obj) {
      if (obj.choose === false && this.isCheck === true) {
        obj.choose = true
        if (this.checkList.length < this.number) {
          this.checkList.push(obj)
        } else {
          obj.choose = false
          this.$root.Toast('不能再选了哦')
        }
      } else {
        for (let i in this.checkList) {
          if (this.checkList[i] === obj) {
            this.checkList.splice(i, 1)
          }
        }
        obj.choose = false
      }
    },
    /* 获取姓第一位 */
    getname (item) {
      let Ename = item.FullENName.replace('/', ' ')
      let name = item.UserName !== '' ? item.UserName : Ename
      return name
    },
    /* 获取证件 */
    getCard (item) {
      if (item.IDCardList[0] !== '' && item.IDCardList[0] !== undefined) {
        const cardtype = item.IDCardList[0].CardType
        const cardNumber = item.IDCardList[0].CardNumber
        let cardname = '其他'
        cardtype === 9 ? '' : cardname = this.credentList[cardtype]
        return cardname + ' ' + cardNumber
      }
    },
    /* 获取删除项索引 */
    getDelIndex (psgid) {
      const LIST = this.psgObj.list
      for (var k in LIST) {
        if (LIST[k].PassengerID === psgid) {
          this.deleteIndex = k
          this.show.confirm = true
        }
      }
    },
    getPsgList (obj) {
      this.showLoad = true
      this.$http.post(window.Miu.Data.ApiURL + '/User_1_0/SearchPassengersByPage', {
        authTkn: window.Miu.Data.Token,
        PageNumber: obj.number,
        pageSize: 20,
        key: '',
        CorpID: this.userinfo.CorpID
      }, {DisableLoading: true}).then((res) => {
        this.showLoad = false
        const totalPage = res.data.TotalPage
        const list = res.data.result
        if (totalPage > obj.number) {
          for (var k in list) {
            if (k !== 'unique' && k !== 'removeRepeatAttr') {
              list[k].swiper = 0
              list[k].choose = false
              list[k].costList = this.CostCenterList
              list[k].DeptID = this.userinfo.DeptID
              list[k].DeptName = this.userinfo.DeptName
              list[k].PolicyID = this.userinfo.PolicyID
              list[k].PolicyName = this.userinfo.PolicyName
              list[k].ApprovalType = this.userinfo.ApprovalType
              obj.list.push(list[k])
            }
          }
          obj.number ++
          this.getPsgList(obj, false)
        }
      }, (res) => {
        this.showLoad = false
        console.log(res)
      })
    },
    DeletePsg () {
      this.$http({
        method: 'GET',
        url: window.Miu.Data.ApiURL + '/User_1_0/DeleteMemberPassenger',
        params: {
          token: window.Miu.Data.Token,
          passengerID: this.psgObj.list[this.swiperIndex].PassengerID
        }, DisableLoading: true
      }).then((res) => {
        if (res.status !== 411) {
          this.psgObj.list.splice(this.deleteIndex, 1)
          this.swiperIndex = null
        }
      }, (res) => {
        console.log(res.data)
      })
    },
    /* 获取成本中心 */
    GetCostCenterList () {
      this.$http.post(window.Miu.Data.ApiURL + '/Approval_1_0/GetCostCenterList',
        {
          'corpId': this.userinfo.CorpID,
          'uid': this.userinfo.UID,
          'authTkn': window.Miu.Data.Token
        }
      ).then(function (response) {
        if (response.data.errorMessage === null && response.data.errorCode === null) {
          this.CostCenterList = response.data.result
        }
        this.init(1)
        console.log(response.data)
      })
    },
    /* 取消 */
    cancel () {
      this.psgObj.list[this.swiperIndex].swiper = 0
      this.swiperIndex = null
      this.do = false
    },
    /* 跳到编辑出行人页 */
    jumpEditPsg (item) {
      // this.Psg = item
      console.log(item)
      window.sessionStorage.setItem('editPassenger', JSON.stringify(item))
      // this.showEditPsg = true
      this.$router.go('/user/passenger/edit')
    }
  }
}
</script>
<style lang="less">
  .w-psg-icon.weui_icon_circle:before,
  .w-psg-icon.weui_icon.weui_icon_success:before{
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
  .sp .w-psg-icon2:before{
    background-color: #fff;
    font-size: 3rem;
    border-radius: 50%;
    color:#666;
    margin:0 1rem 0 -0.2rem;

  }
  .ps, .sp{
    .weui_cell{
      border-bottom: 1px solid #eee;
    }
  }
  .ps:nth-of-type(2n) .w-psg-icon.weui_icon_circle:before{
    background-color:#f19ec2;
  }
  .sp:nth-of-type(2n) .w-psg-icon.weui_icon_circle:before{
    background-color:#f19ec2;
  }
  .w-psg-del {
    width: 25%;
    background-color: red;
    color: #fff;
    display: block;
    height: 5rem;
    line-height: 5rem;
    text-align: center;
    margin-right:50%;
  }
  .ps{
    .weui_cell_bd.weui_cell_primary{
      p{
        width:40%;
        text-overflow:ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }
  }
  .sp {
    .w-psg-icon.weui_icon_circle:before{
      margin: 0 1rem 0 0;
    }
    .weui_cell_bd.weui_cell_primary{
      p{
        width:100%;
        text-overflow:ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }
  }
</style>