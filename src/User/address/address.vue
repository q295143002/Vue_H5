<template>
<div style="height:100%;width:100%;">
  <!-- <div style="height:100%;width:100%;"> -->
  <!-- 头部 -->
    <div class="pos-r nomargin" style="top:0;left:0;" v-if="isChoose === true">
      <group>
        <search-filter cancel-text="取消" placeholder="搜索联系人"></search-filter>
      </group>
    </div>
    <div class="pos-r" style="top:0;left:0;z-index:2">
      <group @click="jumpNewadd">
        <cell title="新增配送地址" is-link>
          <i slot="icon" class="iconfont mr-05">&#xe608;</i>
        </cell>
      </group>
    </div>
    <!-- 内容区域 -->
    <div class="pos-a w-address" style="top:60px;">
      <!-- 无内容时 -->
      <div v-if="isShowEmpty === true">
        <none-info-bg type="address">您目前暂无配送地址</none-info-bg>
      </div>
      <!-- 有内容时 -->
      <div class="po" style="height:100%;">
      <scroller height="100%" v-else lock-x scrollbar-y :bounce='false' v-ref:scroller>
        <div>
          <div v-for="(index, item) in addressList" class="bg-white vux-1px-b">
          <!-- <span>{{addressList.length}}</span> -->
            <scroller  lock-y :bounce='false' :scrollbar-x='false' >
              <div style="width:150%;" 
              >
                <div class="fl-l" @click="jumpEditaddd(item)" style="width:66%">
                  <!-- <span>{{index}}</span> -->
                  <cell :title="item.RecipientName" 
                  :inline-desc="(item.Canton_Name===null?item.ProvinceName+item.CityName:item.ProvinceName+item.CityName+item.Canton_Name)+item.Address">
                    <span slot="after-title">{{item.Mobile}}</span>
                    <i class="iconfont fsz-1_5">&#xe63d;</i>
                  </cell>
                </div>
                <div class="fl-r w-del-address" @click="getDeleteIndex(item.AddID,index)">
                  <span>删除</span>
                </div>
              </div>
            </scroller>
          </div>
        </div>
      </scroller>
      </div>
    </div>
    <!-- 确认删除对话框 -->
    <div class="w-confirm">
      <confirm :show.sync="Confirm.show"
      confirm-text="确定" cancel-text="取消" 
      @on-confirm="DeleteDeliver"
      @on-cancel="GetMemberDeliverList" title="">
      <p style="text-align:center;">确定要删除该项吗?</p></confirm>
    </div>
  <!-- </div> -->
</div>
</template>
<script>
import {Popup, Group, Cell, Icon, Confirm, Loading, Scroller} from 'vux-c'
import Newadd from './newadd/newadd'
import NoneInfoBg from '../../Public/NoneInfoBg'
import SearchFilter from '../../Public/SearchFilter'
export default {
  components: {
    Popup,
    Newadd,
    Group,
    Cell,
    Icon,
    SearchFilter,
    NoneInfoBg,
    Confirm,
    Loading,
    Scroller
  },
  data () {
    return {
      isShowEmpty: false,
      showLoad: true,
      Popup: {
        showAddress: false,
        showEdit: false,
        isEdit: false
      },
      Confirm: {
        show: false
      },
      addressList: [],
      Addadd: {
        isSave: false
      },
      Editadd: {},
      Delete: {
        id: '',
        index: 0
      },
      EditIndex: null,
      sDistance: 0,
      eDistance: 0
      // listPCC: [],
      // PCC: ['AirDeliveryProvinces.js', 'AirDeliveryCities.js', 'AirDeliveryCantons.js']
    }
  },
  watch: {
    '$route.path' (newVal, oldVal) {
      // this.judgeRouting()
    },
    'addressList' (newVal, oldVal) {
      this.addressList.length === 0 ? this.isShowEmpty = true
      : this.isShowEmpty = false
      // console.log('9')
      this.$refs.scroller.reset()
    }
  },
  ready () {
    this.init(0)
    this.shieldPhone()
  },
  methods: {
    shieldPhone () {
      const meta = document.createElement('meta')
      meta.setAttribute('name', 'format-detection')
      meta.setAttribute('content', 'telephone=no')
      document.head.appendChild(meta)
    },
    displayNone () {
      let sessionData = JSON.parse(window.sessionStorage.getItem('PCC'))
      if (sessionData === null) {
        this.getPCC()
      }
      this.init(1)
    },
    init (step) {
      switch (step) {
        case 0 :
          this.displayNone()
          console.log(this.Popup.showAddress)
          break
        case 1 :
          this.GetMemberDeliverList()
          break
        default :
          break
      }
    },
    /* 获取配送地址列表 */
    GetMemberDeliverList () {
      this.$http({
        method: 'GET',
        url: window.Miu.Data.ApiURL + '/User_1_0/GetMemberDeliverList',
        params: {token: window.Miu.Data.Token}
      }).then(function (response) {
        console.log(response.data)
        this.showLoad = false
        if (response.data.errorMessage === null && response.data.delivers.length > 0) {
          this.addressList = response.data.delivers
          this.isShowEmpty = false
        } else if (response.data.errorMessage !== null) {
          console.log(response.data.errorMessage)
        } else {
          this.isShowEmpty = true
        }
        this.init(3)
      }, function (response) {
        console.log(response.data)
      })
    },
    /* 获取删除项索引 */
    getDeleteIndex (id, index) {
      this.Delete.id = id
      this.Delete.index = index
      this.Confirm.show = true
    },
    /* 删除配送地址 */
    DeleteDeliver () {
      this.$http({
        method: 'GET',
        url: window.Miu.Data.ApiURL + '/User_1_0/DeleteDeliver',
        params: {
          token: window.Miu.Data.Token,
          deliverID: this.Delete.id
        }
      }).then(function (response) {
        if (response.data.errorMessage === null && response.data.errorCode === null) {
          this.addressList.splice(this.Delete.index, 1)
        }
      }, function (response) {
        console.log(response.data)
      })
    },
    /* 编辑地址 */
    jumpEditaddd (item) {
      window.sessionStorage.setItem('Editaddd', JSON.stringify(item))
      this.$router.go({path: '/user/address/editadd'})
    },
    /* 跳转到添加地址页 */
    jumpNewadd () {
      this.$router.go({path: '/user/address/newadd'})
      // this.Popup.showAddress = true
    },
    /* 获取省市区列表 */
    getPCC () {
      // console.log('A')
      // const that = this
      // let pcc = []
      let xhr = new window.XMLHttpRequest()
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          const DATA = JSON.parse(xhr.responseText)
          // console.log(xhr.responseText)
          window.sessionStorage.setItem('PCC', JSON.stringify(DATA))
        }
      }
      xhr.open('get', window.Miu.Data.ApiURL + '/H5_Store/address.js', true)
      xhr.send()
    }
  }
}
</script>
<style lang="less">
  // @import '../../styles/user/address/address.less';
  .w-address{
    left:0;
    height:86%;
    width:100%;
    overflow:hidden;
  }
  .w-del-address{
    width: 24%;
    background-color: red;
    color: #fff;
    display: block;
    height: 5rem;
    line-height: 5rem;
    text-align: center;
  }
  .bg-white{
    &:first-of-type{
      border-top: 1px solid #e0e0e0;
      // background:red
    }
  }
  .w-confirm {
    a.weui_btn_dialog.default{
      color:#1885fc
    }
  }
</style>