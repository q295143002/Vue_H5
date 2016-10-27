<template>
<div class="pos-a" style="top:0;bottom:0; width:100%;overflow:hidden;">
  <!-- up -->
  <article class="personal-up pos-a">
    <dl>
      <dt class="personal-up-logo">
        <img v-if="userinfo.logo!==null" :src="'data:image/png;base64,'+userinfo.logo" alt=""/>
        <span v-else class="dp-b color-white ta-c fsz-1_5">logo</span>
      </dt>
      <dd class="pt-05" v-text="userinfo.username"></dd>
      <dd v-text="userinfo.company"></dd>
    </dl> 
  </article>
  <!-- down -->
  <div class='pos-a' style="bottom:0;width:100%;top:12rem">
  <section style="top:0;" class="personal-down pos-r bgc-gray-light">
    <scroller height="100%" use-pulldown lock-x v-ref:scroller
    :pulldown-status.sync="pulldownStatus" @pulldown:loading="load">
    <div>
      <group class="color-gray-middle">
        <cell title="全部订单" is-link v-link="'/user/order'">
          <i slot="icon" class="iconfont icon-pcarorder personal-pcarorder mr-05 fsz-1_5"></i>
        </cell>
        <!-- <cell title="待支付" is-link v-link="'/user/unpaidorder'">
          <i slot="icon" class="iconfont icon-punpaid personal-punpaid mr-05 fsz-1_5"></i>
        </cell> -->
        <cell title="多级审批" is-link v-link="'/report'">
          <i slot="icon" class="iconfont icon-papproval personal-papproval mr-05 fsz-1_5"></i>
        </cell>
      </group>
      
      <group class="color-gray-middle">
        <cell title="差旅政策" is-link v-link="'/user/policy'">
          <i slot="icon" class="iconfont icon-ppolicy personal-ppolicy mr-05 fsz-1_5"></i>
        </cell>
        <cell title="修改公司支付密码" @click="showPay = true">
          <i slot="icon" class="iconfont icon-ppay personal-ppay mr-05 fsz-1_5" ></i>
        </cell>
        <cell title="常用出行人" is-link v-link="'/user/passenger'">
          <i class="iconfont icon-ppassenger personal-ppassenger mr-05 fsz-1_5" slot="icon"></i>
        </cell>
      </group>
      
      <group class="color-gray-middle">
        <cell title="常用联系人" is-link v-link="'/user/contact'">
          <i slot="icon" class="iconfont icon-contact personal-contact mr-05 fsz-1_5"></i>
        </cell>
        <cell class="color-gray-middle" title="常用配送地址" is-link v-link="'/user/address'">
          <i class="iconfont icon-paddress personal-paddress mr-05 fsz-1_5" slot="icon"></i>
        </cell>
      </group>
      <p style="height:40px;"></p>
      </div>
      <solt :pdown-status="pulldownStatus"></solt>
    </scroller>
  </section>
  </div>
  <!-- 修改公司账户密码 -->
  <dialog :show.sync="showPay" height="100%" >
    <div class="pd-05">
      <edit-paycode @close = 'showPay = false' @edit-success="showPay = false"></edit-paycode>
    </div>
  </dialog>
</div>
</template>
<script>
import {Group, Cell, Scroller, Dialog} from 'vux-c'
import EditPaycode from '../../Public/EditPaycode'
import Solt from '../order/list/solt'
export default {
  components: {
    Group,
    Cell,
    Scroller,
    EditPaycode,
    Solt,
    Dialog
  },
  data () {
    return {
      USERINFO: window.Miu.Data.UserInfo,
      showPay: false,
      userinfo: {
        username: '',
        company: '',
        logo: ''
      },
      pulldownStatus: 'default'
    }
  },
  ready () {
    this.init()
  },
  methods: {
    init () {
      [this.userinfo.username, this.userinfo.company, this.userinfo.logo] =
      [this.USERINFO.UserName, this.USERINFO.CorpName, this.USERINFO.Logo]
    },
    getUserInfo () {
      window.Miu.init()
      this.USERINFO = window.Miu.Data.UserInfo
      this.init()
    },
    load (uuid) {
      setTimeout(() => {
        this.getUserInfo()
        this.$broadcast('pulldown:reset', uuid)
      }, 1000)
    }
  }
}
</script>