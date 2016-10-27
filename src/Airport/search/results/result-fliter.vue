<template>
  <tabbar style='overflow:hidden' class='vux-1px-t bgc-gray-light'>
    <div style="width:100%">
      <div class= 'fl-l' style="width:80%;display:inline-block">
        <button-tab class='mg-05'>
          <button-tab-item selected @click='orderChoose(0)'><small>起飞时间</small></button-tab-item>
          <button-tab-item @click='orderChoose(2)'><small>价格升序</small></button-tab-item>
          <button-tab-item @click='orderChoose(1)'><small>价格降序</small></button-tab-item>
          <button-tab-item @click='orderChoose(3)'><small>飞行时长</small></button-tab-item>
        </button-tab>
      </div>
      <div class= 'fl-l vux-center ta-c' style="width:20%;display:inline-block;height:48px;line-height:48px">
        <x-button mini @click='pop=true'>筛选</x-button>
      </div>
    </div>
  </tabbar>
  <popup height='60%' :show.sync='pop'>
    <div style="height:100%;width:100%;bottom:58px;" class="pos-a bg-white of-y-s" >
      <group title='航空公司'>
          <radio :options="companyShow" @on-change="changeCompany"></radio>
      </group>
    </div>
    <tabbar style='background:none; border: none;'><x-button type="primary" style='margin:8px;' @click='submitFilter'>确定</x-button></tabbar>
  </popup>
</template>
<script>
import { Tabbar, TabbarItem, Flexbox, FlexboxItem, ButtonTab, ButtonTabItem, XButton, Popup, Cell, Group, Radio } from 'vux-c/'
export default {
  components: {
    Cell,
    Group,
    Radio,
    Tabbar,
    TabbarItem,
    Flexbox,
    FlexboxItem,
    ButtonTab,
    ButtonTabItem,
    XButton,
    Popup
  },
  props: {
    orderobj: Number,
    company: Array,
    AirCompany: Array
  },
  data: function () {
    return {
      pop: false,
      filterChoose: {
        type: 0,
        company: ''
      },
      companyShow: []
    }
  },
  ready () {
    this.submitFilter()
  },
  watch: {
    'company' () {
      this.companyShow = [{key: '', value: '不限'}]
      for (let i = 0; i < this.company.length; i++) {
        for (var j = 0; j < this.AirCompany.length; j++) {
          if (this.AirCompany[j].k === this.company[i]) {
            this.companyShow.push({key: this.company[i], value: this.AirCompany[j].v})
          }
        }
      }
    }
  },
  methods: {
    changeCompany: function (val) {
      this.filterChoose.company = val
    },
    submitFilter: function () {
      this.$dispatch('filterchoose', this.filterChoose)
      this.orderChoose(this.orderobj)
      this.pop = false
    },
    orderChoose: function (val) {
      this.orderobj = val
      this.$dispatch('orderchoose', val)
    }
  }
}
</script>