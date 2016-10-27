<flexbox class= 'vux-1px-t' v-if='carTypePut.name'  :gutter="0">
  <flexbox-item class= 'vux-1px-r'>
    <cell is-link @click='carTypePop=true'>
      {{carTypePut.name}}
      <i class="theme-color-blue iconfont icon-che" slot='icon'></i>
    </cell>
  </flexbox-item>
  <flexbox-item>
    <cell  is-link @click='carPriceShow = true'>
      <small>约</small><b class ="theme-color-red">{{carTypePut.price}}</b><small>元</small>
      <i class="theme-color-blue iconfont icon-price" slot='icon'></i>
    </cell>
  </flexbox-item>
</flexbox>
<dialog :show.sync = 'carPriceShow'>
  <div class="pd-05">
    <h3 class="theme-color-blue">预估说明</h3>
    <div class="mt-3 ta-c mb-3">
      <div>{{carTypePut.name}}</div>
      <div class="mt-1">预估<b class="theme-color-blue">{{carTypePut.price}}</b>元</div>
      <div>{{carTypePut.start_price}}元起步费</div>
      <div>{{carTypePut.normal_unit_price}}元/公里</div>
      <div>{{carTypePut.dynamic_price}}元动调溢价</div>
    </div>
  </div>
</dialog>
<slide-picker
    v-if='carList.option[0]'  
    :show.sync ='carList.show'
    :data.sync='carList.option'
    :column='1'
    :value.sync='carList.value' >
</slide-picker>

<loading :show.sync ='Loading.show' text = '正在预估'></loading>
<script>
  import {Flexbox, Cell, FlexboxItem, Dialog, Loading} from 'vux-c'
  import SlidePicker from 'public/SlidePicker'
  export default {
    components: {
      Flexbox, Cell, FlexboxItem, Dialog, Loading, SlidePicker
    },
    filters: {
      'carTypeShow' (val) {
        if (this.carTypeInfo[val]) {
          return this.carTypeInfo[val].name
        } else {
          return ''
        }
      },
      'carTypePrice' (val) {
        if (this.carTypeInfo[val]) {
          return '约' + this.carTypeInfo[val].price + '元'
        } else {
          return ''
        }
      }
    },
    props: {
      carTypePut: Object
    },
    data () {
      return {
        Loading: {
          show: false
        },
        carList: {
          infolist: [],
          option: [],
          value: {},
          show: false
        }
      }
    },
    methods: {
      getFees (obj) {
        this.Loading.show = true
        this.$http.post(window.Miu.Data.ApiURL + '/TravelCar_1_0/CarEstimatePrice', obj, {DisableLoading: true}).then(function (response) {
          this.Loading.show = false
          let List = []
          for (let i in response.data.data) {
            List.push(response.data.data[i])
          }
          List.sort(function (a, b) {
            return a.price - b.price
          })
          /* 数据初始化 */
          this.carList = {
            infolist: List,
            option: [],
            value: {},
            show: false
          }
          /* pop内容设置 */
          List.forEach((item) => {
            this.carList.option.push({name: `${item.name.slice(0, 4)}¥${item.price}`, value: item.code, parent: 0})
          })
        },
        function (response) {
          console.log(response)
        })
      }
    }
  }
</script>