<template>
<div v-if="isServerErr === false" style="height:100%;overflow:hidden;">
  <!-- <span @click="isShow=false">×</span> -->
<div style="height:100%;width:100%;">
  <!-- 搜索 -->
  <div class="pos-r nomargin" style="top:0;left:0;" v-if="isChoose === true">
    <group>
      <search-filter :value.sync="keyVal" cancel-text="取消" placeholder="搜索联系人"></search-filter>
    </group>
  </div>
  <!-- 新增联系人 -->
  <div class="pos-r" style="top:0;left:0;" v-if="isChoose !== true">
    <group>
      <cell title="新增联系人" is-link @click="jumpNewContact">
        <i slot="icon" class="iconfont mg-05">&#xe608;</i>
      </cell>
    </group>
  </div>
  <!-- 内容 -->
  <div class="pos-a w-contact" :style="{top:getTOP+'px'}">
    <!-- 无联系人时 -->
    <div v-if="isShowEmpty===true">
      <none-info-bg type="contact">您目前暂无任何联系人</none-info-bg>
    </div>
    <!-- 有联系人时 -->
    <scroller lock-x scrollbar-y :bounce='false' v-ref:scroller v-if="isChoose===true&&isShow===true">
    <div>
      <div class="w-contact-list bg-white vux-1px-b" @click="checking(item,Max)"
      v-for="(index,item) in arr">
        <!-- <group> -->
          <cell :title="item.name" :inline-desc="item.tel">
            <icon slot="icon" type="circle" class="iconfont w-contact-icon1 fsz-2 pr-1"
            :data='item.name.charAt(0)'
            v-if="item.choose === true">
            </icon>
            <icon slot="icon" type="success" class="iconfont w-contact-icon2 fsz-2 pr-1"
            v-else>
            </icon>
          </cell>
        <!-- </group> -->
      </div>
      <div style="height:58px;"></div>
      </div>
    </scroller>
    <scroller v-else lock-x scrollbar-y :bounce='false' v-ref:scroller>
      <!-- <div style="height:600px;overflow:auto"> -->
      <div>
        <div class="w-contact-list bg-white vux-1px-b" 
        v-for="(index,item) in arr| filterBy keyVal in 'name'">
          <scroller lock-y scrollbar-x :bounce=false :scrollbar-x='false' 
          v-if="isShow&&isChoose||!isChoose" :prevent-default="true">
            <div style="width:200%;">
              <div class="fl-l" style="width:50%"
              >
                <cell :title="item.name" :inline-desc="item.tel" @click="jumpEditContact(item)">
                  <icon slot="icon" type="circle" class="iconfont w-contact-icon1 fsz-2 pr-1"
                  :data='item.name.charAt(0)'
                  v-if="item.choose === true">
                  </icon>
                  <icon slot="icon" type="success" class="iconfont w-contact-icon2 fsz-2 pr-1"
                  v-else>
                  </icon>
                </cell>
              </div>
              <div class="w-cot-del fl-r" @click="getDeleteIndex(item.name)">
                <span>删除</span>
              </div>
            </div>
          </scroller>
        </div>
      </div>
    </scroller>
    <div style="height:4rem;" class="bg-white"></div>
  </div>
  <!-- 确认按钮 -->
  <div class="pos-a bg-gray pt-05 pb-05 pl-2 pr-2" 
  style="width:100%;bottom:0;left:0;box-sizing:border-box"
  v-if="isChoose === true">
    <x-button type="primary" @click="getContactData">确定</x-button>
  </div>
  <!-- 提示 -->
  <toast :show.sync="TOAST.show1" type="text" width="10rem">最多只能选{{Max}}个哦</toast>
  <toast :show.sync="TOAST.show2" type="text" :time="500">删除成功</toast>
  <toast :show.sync="TOAST.show3" type="text" :time="500">删除失败</toast>
  <!-- 确认删除对话框 -->
  <div class="w-confirm">
    <confirm title="" :show.sync="confirm.show" confirm-text="确定" cancel-text="取消" 
    @on-confirm="DeleteContact" @on-cancel="getNameList">
    <p style="text-align:center">确定要删除该项吗?</p>
    </confirm>
  </div>
  <div>
</div>
</template>
<script>
import {Popup, Group, Switch, XButton, XHeader, Cell, Icon, Swiper, SwiperItem, Confirm, Loading, Toast, Scroller} from 'vux-c'
// import AddContact from './addContact/add-contact'
// import editContact from './editContact/edit-contact'
import SearchFilter from '../../Public/SearchFilter'
import NoneInfoBg from '../../Public/NoneInfoBg'
export default {
  components: {
    Popup,
    Group,
    Switch,
    // AddContact,
    // editContact,
    XButton,
    XHeader,
    Cell,
    Icon,
    Swiper,
    Confirm,
    SwiperItem,
    SearchFilter,
    Loading,
    NoneInfoBg,
    Toast,
    Scroller
  },
  data () {
    return {
      userinfo: window.Miu.Data.UserInfo,
      top: 80,
      TOAST: {
        show1: false,
        show2: false,
        show3: false
      },
      arr: [],          /* 联系人数组 */
      chooseArr: [],
      showEditContact: false,   /* 编辑联系人popup */
      showAddContact: false,    /* 添加联系人popup */
      isServerErr: false,    /* 请求数据失败 */
      showloading: false,   /* 显示加载中... */
      isSave: 0,          /* 是否需要刷新  0不刷新, 1刷新 */
      isShowEmpty: false,   /* 无联系人时显示 */
      Contact: '',          /* 当前编辑联系人 */
      keyVal: '',
      // limit: false,
      deleteIndex: '',
      // indexPage: 0,
      confirm: {
        show: false,
        delete: false
      },
      errName: '',
      errPhone: '',
      nameErr: {
        err1: '用户名为空'
      },
      phoneErr: {
        err1: '手机号为空',
        err2: '手机号格式不正确'
      },
      name: '',
      phone: '',
      ContactData: ''
    }
  },
  computed: {
    getTOP () {
      let result = this.isChoose === false ? this.TOP = 80 : this.TOP = 60
      return result
    }
  },
  props: {
    isChoose: Boolean,
    ContactList: Array,
    Max: Number,
    isShow: Boolean
  },
  ready () {
    this.init()
  },
  watch: {
    'isShow' (newVal, oldVal) {
      if (newVal === true && this.ContactList.length > 0) {
        if (this.ContactList.length > this.chooseArr.length) {
          this.addChecking()
        } else if (this.ContactList.length < this.chooseArr.length) {
          this.cancelChecking()
        }
      }
    },
    'arr' (newVal) {
      this.arr.length === 0 ? this.isShowEmpty = true
      : this.isShowEmpty = false
      if (!this.isChoose) this.$refs.scroller.reset()
    },
    '$route.path' (newVal, oldVal) {
      console.log(this.$route.path)
      // this.judgeRouting()
    },
    'ContactList' (newVal, oldVal) {
      this.cancelChecking()
    }
  },
  methods: {
    init () {
      this.getNameList()
    },
    ckeckInit () {
      console.log(this.isChoose)
      if (this.isChoose === true) {
        let nameObj = {
          name: this.userinfo.UserName,
          tel: this.userinfo.Mobilephone,
          choose: false
        }
        this.chooseArr.push(nameObj)
        this.arr.splice(0, 0, nameObj)
        this.ContactList.push(nameObj)
      }
      console.log(this.ContactList)
      console.log(this.arr)
    },
    /* 订票添加联系人 >>>>>>> */
    checking (obj, num) {
      console.log(this.chooseArr)
      if (this.isChoose === true && obj.choose === true) {
        obj.choose = false
        if (this.chooseArr.length < num) {
          this.chooseArr.push(obj)
        } else {
          obj.choose = true
          this.TOAST.show1 = true
        }
      } else if (this.isChoose === true) {
        for (let i in this.chooseArr) {
          if (this.chooseArr[i] === obj) {
            this.chooseArr.splice(i, 1)
          }
        }
        obj.choose = true
      }
    },
    /* 取消勾选联系人 */
    cancelChecking () {
      let deleteArr = []
      const that = this
      /* 获取删除项数组 */
      for (let [k, v] of this.chooseArr.entries()) {
        if (Array.indexOf(this.ContactList, v, 0) === -1) {
          that.chooseArr.splice(k, 1)
          deleteArr.push(v)
        }
      }
      /* 取消勾选 */
      deleteArr.map(function (item, index) {
        for (let i in that.arr) {
          if (that.arr[i] === item) {
            that.arr[i].choose = true
          }
        }
      })
    },
    /* 添加勾选联系人 */
    addChecking () {
      let addArr = []
      const that = this
      /* 获取添加项数组 */
      for (let [k, v] of this.ContactList.entries()) {
        if (Array.indexOf(this.chooseArr, v, 0) === -1) {
          that.chooseArr.splice(k, 0, v)
          addArr.push(v)
        }
      }
      /* 添加勾选 */
      addArr.map(function (item, index) {
        for (let i in that.arr) {
          if (that.arr[i] === item) {
            that.arr[i].choose = false
          }
        }
      })
    },
    /* 获取联系人数据 */
    getContactData (num) {
      this.isShow = false
      this.ContactList = this.chooseArr.concat()
      if (num === 1) {
      } else {
        this.$emit('on-close')
      }
      console.log(this.ContactList)
    },
    /* 订票添加联系人 <<<<<<<< */
    /* 个人中心部分 */
    /**
     * 获取联系人列表
     */
    getNameList () {
      const that = this
      // that.showloading = true
      this.$http({
        methods: 'GET',
        url: window.Miu.Data.ApiURL + '/User_1_0/GetContact',
        params: {
          token: window.Miu.Data.Token
          // corpId: that.userinfo.CorpID
        }
      }).then(function (response) {
        // that.showloading = false
        console.log(response.data)
        that.arr = []
        if (response.data.errorMessage === null) {
          let items = response.data
          items.result.map(function (item) {
            let nameObj = {
              name: item.UserName,
              tel: item.Mobilephone,
              ID: item.PassengerID,
              email: item.Email,
              choose: true
            }
            that.arr.push(nameObj)
          })
          that.arr.length === 0 ? that.isShowEmpty = true : that.isShowEmpty = false
          this.getContactData(1)
          this.isServerErr = false
        } else {
          console.log(response.data.errorMessage)
          this.isServerErr = true
        }
        that.ckeckInit()
      }, function (response) {
        console.log('err')
      })
    },
    /* 获取删除项索引 */
    getDeleteIndex (itemName) {
      for (let k in this.arr) {
        if (this.arr[k].name === itemName) {
          this.deleteIndex = k
          this.confirm.show = true
          console.log(k)
        }
      }
    },
    /* 删除联系人 */
    DeleteContact () {
      const that = this
      this.$root.Loading(true)
      this.$http({
        method: 'GET',
        url: window.Miu.Data.ApiURL + '/User_1_0/DeleteMemberPassenger',
        params: {
          token: window.Miu.Data.Token,
          passengerID: that.arr[that.deleteIndex].ID
        }, DisableLoading: true
      }).then(function (response) {
        console.log(response.data)
        if (response.data.errorMessage === null && response.data.errorCode === null) {
          that.$root.Loading(false)
          that.TOAST.show2 = true
          that.arr.splice(that.deleteIndex, 1)
        } else {
          that.TOAST.show3 = true
        }
      }, function (response) {
        window.alert('请刷新页面重试')
      })
    },
    /* 跳转到添加页 */
    jumpNewContact () {
      this.$router.go({path: '/user/contact/add-contact'})
    },
    /* 跳转到编辑页 */
    jumpEditContact (item) {
      console.log(item)
      this.$router.go({
        name: '编辑联系人',
        params: {
          name: item.name,
          tel: item.tel,
          id: item.ID
        }
      })
      // }
    }
  }
}
</script>
<style lang="less">
  @import '../../styles/user/contact/contact.less';
  .w-cot-del{
    width: 24%;
    background-color: red;
    color: #fff;
    display: block;
    height: 5rem;
    line-height: 5rem;
    text-align: center;
  }
  .weui_dialog_alert div.weui_mask{
    z-index:3
  }
</style>
