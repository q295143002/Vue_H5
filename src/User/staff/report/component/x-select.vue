<template>
  <div class="x-select">
      <input :placeholder="placeHolder" @click="showPanel"  readonly class="x-input"  :value="xInput">
      <div class="xs-panel"  v-show="isxShow" animation>
        <ul>
          <li v-for="item in xspData" @click="getItem(item,$index)" v-bind:class='{rightIcon:$index==indexS}'>{{item}}</li>
        </ul>
      </div>

  </div>

</template>

<script>
  export default {
    components: {
    },
    props: {
      placeHolder: String,
      xspHead: String,
      xspData: Array,
      isxShow: Boolean,
      xInput: String
    },
    ready () {
      this.xInput = this.xspData[0]
    },
    data () {
      return {
        xsShow: false,
        indexS: 0
      }
    },
    methods: {
      getItem (val, index) {
        this.xInput = val
        this.indexS = index
        // this.isxShow = false
      },
      showPanel () {
        // this.isxShow = !this.isxShow
      }
    }
  }
</script>

<style>
  .x-select{
    width:100%;
    position: relative;
  }
  .x-input{
    display: none;
    box-sizing: border-box;
    width:100%;
    padding:0px 0 0px 0px;
    margin-top:.5rem;
    border:none;
    border-bottom: 1px solid #eee;
    height: 2rem;
    font-size: 1rem;
  }
  .rightIcon::before{
    content: '';
    width:5px;
    height:15px;
    transform: rotate(45deg);
    background-color: #fff;
    border-right: 2px solid #00ff00;
    border-bottom: 2px solid #00ff00;
    position: absolute;
    right: 0;
  }
  .xs-panel{
    background-color: #fff;
    padding:0 0 0 0;
  }
  .xs-panel ul{
    list-style: none;
  }
  .xs-panel li{
    position: relative;
    border-bottom:1px solid #eee;
    color: #666;
  }
  .xs-panel p, .xs-panel li{
    text-align: left;
  }
  .xs-panel p{
    color: #999;
    font-size: 0.9rem;
  }

</style>
