<template>
<div>
  <group >  
    <!-- <flexbox class='vux-1px-t'>
      <flexbox-item>
        <cell title='因公出行' @click='expenseType=1' class='m-taxi-choosecity' >
          <icon slot='icon' type='success' v-if ='expenseType === 1'></icon>
          <icon slot='icon' type='circle' v-else></icon>
        </cell>
      </flexbox-item>
      <flexbox-item>
        <cell title='因私出行' @click='expenseType=2' class='m-taxi-choosecity' >
          <icon slot='icon' type='success' v-if ='expenseType === 2'></icon>
          <icon slot='icon' type='circle' v-else></icon>
        </cell>
      </flexbox-item>
    </flexbox> -->
    <cell is-link title='乘客' @click = 'actual.show = true' >
      {{actual.Index===0?'自己':''}} {{actual.User.UserName}}
      <i class="theme-color-blue iconfont icon-user mr-05" slot='icon'></i>
    </cell>
    <cell title ='成本中心' @click ='pickCost.show = true' is-link>
      {{pickCost.result.CostCenterListName?pickCost.result.CostCenterListName:'请选择成本中心'}}
      <i class="theme-color-blue iconfont icon-contact mr-05" slot='icon'></i>
    </cell>
    <cell :title='"支付方式"'>
      {{payType === 1?'公司代扣':'支付宝'}}
      <i class="theme-color-blue iconfont icon-pay mr-05" slot='icon'></i>
      <icon type='info_circle' @click='showDialog= true'></icon>
    </cell>
  </group>
  <group>
    <x-input 
      :placeholder='MoreRemark.NoteToolTipOne'
      v-show='MoreRemark.NoteToolTipOne !==""'
      :value.sync = 'MoreRemark.MoreRemarkOne'
      :max="24"
      :required = 'false'
    ></x-input>
    <x-input 
      :placeholder='MoreRemark.NoteToolTipTwo'
      v-show='MoreRemark.NoteToolTipTwo !==""'
      :value.sync = 'MoreRemark.MoreRemarkTwo'
      :required = 'false'
    :max="24"
    ></x-input>
    <x-input
      :placeholder='MoreRemark.NoteToolTipThree'
      v-show='MoreRemark.NoteToolTipThree !==""'
      :value.sync = 'MoreRemark.MoreRemarkThree'
      :required = 'false'
      :max="24"
    ></x-input>
  </group>
</div>
<dialog 
:show.sync='showDialog' 
@click ='CloseDialog($event, "showDialog")'
>
  <div class="pd-05">
      <h3 class="pd-05 theme-color-blue">支付提示</h3>
      <div class=" ta-l" style="height:200px;">
      <span>1.用车目前仅支持公司账户支付。</span><br>
      <span>2.公司账户支付时仅支持因公用车。若您的账户支持公司账户支付，则默认选择公司账户代扣，您下单时将直接从您所在的公司账户中代扣费用，扣除您预估用车费用的倍数，待用车结束后再返还多扣除的费用或再次扣除未支付的费用。</span><br>
      <!-- <small>3.如果您的公司账户代扣失败（如余额不足），可选择用车结束后使用支付宝继续下单用车</small><br>
      <small>若您的账户不支持公司账户支付，则默认使用支付宝。用车服务完成后请在本应用内使用支付宝完成支付。</small><br>
      <small>若支付方式为使用支付宝，下单前请确保您能完成该次用车费用。若您在用车是后未支付完成的用车订单，则无法继续使用用车服务</small> -->
    </div>
  </div>
  <div class=" pd-05">
    <x-button  @click="showDialog=false" type='primary'> 知道了 </x-button>
  </div>
</dialog>
<dialog-plus :show.sync ='actual.show' :title = 'actual.title'>
  <pick-Actual  @on-close = 'actual.show = false' :actual.sync = 'actual'></pick-Actual>
</dialog-plus>
<dialog-plus :show.sync ='pickCost.show' :title = 'pickCost.title'>
  <pick-cost  @on-close = 'pickCost.show = false' :result.sync ='pickCost.result' ></pick-cost>
</dialog-plus>
</template>
<script>
import { Flexbox, FlexboxItem, XButton, Icon, PopupPicker, Group, Cell, Dialog, XInput, Swiper, SwiperItem, Switch, Popup, Scroller, XHeader } from 'vux-c/'
import PickCost from './info/PickCost'
import PickActual from './info/pickActual'
import DialogPlus from 'public/DialogPlus'
export default {
  components: {
    PickActual,
    DialogPlus,
    Dialog,
    PickCost,
    XButton,
    Icon,
    XHeader,
    Swiper,
    SwiperItem,
    XInput,
    Cell,
    Group,
    PopupPicker,
    Switch,
    Popup,
    Scroller,
    Flexbox,
    FlexboxItem
  },
  props: {
    infoData: Object,
    ready: Array
  },
  data () {
    return {
      Step: 0,
      showDialog: false,
      expenseType: 1, // 因公：1 因私：2
      /* 成本中心 */
      pickCost: {
        title: '选择成本中心',
        show: false,
        result: {}
      },
      /* 支付方式 */
      payType: 1, // 公司账户：1 | 支付宝：2
      /* 乘客电话 */
      actual: {
        title: '选择联系人',
        show: false,
        Index: 0,
        User: {
          UserName: window.Miu.Data.UserInfo.UserName,
          Mobilephone: window.Miu.Data.UserInfo.Mobilephone
        }, // 选中信息
        UserList: [{
          UserName: window.Miu.Data.UserInfo.UserName,
          Mobilephone: window.Miu.Data.UserInfo.Mobilephone
        }] // 乘客列表
      },
      dialogShow: false,
      dialogTitle: '',
      /* 备注 */
      MoreRemark: {}
    }
  },
  watch: {
    'costCenterIndex' () {
      this.costCenterPush = this.costAll[(+this.costCenterIndex)]
    },
    'expenseType' () {
      this.$parent.$refs.place.expenseType = this.expenseType
      this.$parent.$refs.place.getFees()
    }
  },
  ready () {
    this.init()
  },
  methods: {
    init () {
      this.getNoteToolTip()
    },
    /* 备注 */
    getNoteToolTip () {
      this.$http({
        method: 'GET',
        url: window.Miu.Data.ApiURL + '/User_1_0/GetCorpNoteToolTip',
        params: {
          token: window.Miu.Data.Token,
          corpId: window.Miu.Data.UserInfo.CorpID
        }
      }).then(function (response) {
        this.MoreRemark = {
          MoreRemarkOne: '',
          MoreRemarkTwo: '',
          MoreRemarkThree: '',
          NoteToolTipOne: response.data.NoteToolTips[0],
          NoteToolTipTwo: response.data.NoteToolTips[1],
          NoteToolTipThree: response.data.NoteToolTips[2]
        }
      })
    },
    /* 配置infoData */
    setInfoData () {
      this.infoData = {
        expense_type: this.expenseType,
        pay_type: this.payType,
        actual_user_name: this.actual.User.UserName,
        tp_customer_phone: this.actual.User.Mobilephone,
        cost_center_id: this.pickCost.result.CostCenterListId,
        cost_center_name: this.pickCost.result.CostCenterListName,
        more_remark_one: this.MoreRemark.MoreRemarkOne,
        more_remark_two: this.MoreRemark.MoreRemarkTwo,
        more_remark_three: this.MoreRemark.MoreRemarkThree,
        NoteToolTipOne: this.MoreRemark.NoteToolTipOne,
        NoteToolTipTwo: this.MoreRemark.NoteToolTipTwo,
        NoteToolTipThree: this.MoreRemark.NoteToolTipThree
      }
      console.log(this.infoData)
    },
    CloseDialog (event, obj) {
      if (event.target.className === 'weui_mask') {
        this[obj] = false
      }
    }
  }
}
</script>
<style>
  .m-contact-icon{ 
    width: 40px;
    font-weight: bold;
    color: #fff;
    background: #cbcbcb;
    text-align: center;
    height: 40px;
    margin-right: 10px;
    line-height: 40px;
    text-align: center;
    border-radius: 50%;
  }
  .m-contact-icon.active{
    background: red;
  }
</style>