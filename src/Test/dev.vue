<template>
<div style="height:100%;background:#fff;position:relative">
  <tab active-color="#37f" :line-width="2" style="width:100%">
    <tab-item :selected="psg === item" v-for="item in psgArr" @click="psg = item">{{item}}</tab-item>
  </tab>
  <group class="w-search-psg">
    <search placeholder="搜索出行人" :value.sync="keysValue" cancel-text="取消"></search>
  </group>
</div>
<div style="overflow:scroll;height:100%;position:absolute;width:100%;width:100%;top:110px;left:0;">
  <div v-show="psg === '员工'">
    <staff 
    :is-choose="true" :Contact-list1.sync="List" 
    :keys="keysValue" :type="sta"
    :del-arr="deleteArr"
    :add-arr="addArr"></staff>
    <div style="height:42px;"></div>
  </div>
  <div v-else="psg === '常用出行人'">
  <div style="height:15px;"></div>
    <passenger :is-choose="true" :Contact-list2.sync="List" :keys="keysValue" :num="2"></passenger>
    <div style="height:42px;"></div>
  </div>
  <div style="height:7rem;"></div>
</div>
<!-- 底部确认按钮 -->
<div class="pos-a fsz-05" style="bottom:0;left:0;height:42px;width:100%;background:#666;overflow:hidden;">
    <div class="w-leftPeople">
      <span class="pd-05 ml-05 color-white w-psgPeople"
      v-for="item in List">
        {{item.UserName}}
      </span>
    </div>
    <div class="w-psgbtn pos-a">
      <x-button type="primary" @click="getPsgData">确定</x-button>
    </div>
</div>
</template>
<script>
  import {Tab, TabItem, Cell, Icon, Group, XButton, Search} from 'vux-c'
  import Staff from './ChoosePsg/staff'
  import Passenger from './ChoosePsg/passenger'
  export default {
    components: {
      Search,
      Tab,
      TabItem,
      Cell,
      Icon,
      Group,
      Staff,
      Passenger,
      XButton
    },
    data () {
      return {
        psg: '员工',
        psgArr: ['员工', '常用出行人'],
        List: [],
        keysValue: '',
        deleteArr: [],
        addArr: []
      }
    },
    props: {
      dataList: Array,
      max: Number,
      chooseCost: Boolean,
      isShow: Boolean
    },
    watch: {
      'dataList' (newVal, oldVal) {
        this.change()
      },
      'isShow' (newVal, oldVal) {
        if (newVal === true) {
          if (this.dataList.length > this.List.length) {
            this.change()
          }
        }
      }
    },
    methods: {
      getPsgData () {
        this.dataList = this.List.concat()
        this.chooseCost = true
        this.isShow = false
      },
      change (str) {
        // const that = this
        /* 获取删除项数组 */
        for (let v of Object.values(this.List)) {
          if (Array.indexOf(this.dataList, v, 0) === -1) {
            this.deleteArr.push(v)
          }
        }
      }
    }
  }
</script>
<style lang="less">
  .w-psgbtn{
    right:0;
    bottom:0;
  }
  .w-psgPeople{
    border:1px solid #ccc;
    box-sizing:border-box;
    text-align: center;
    height:42px;
    line-height: 42px;
  }
  .w-leftPeople{
    overflow:auto;
    padding-right:64px;
    // background:#ccc;
    width:80%;
    height:100%;
    white-space:nowrap;
  }
</style>