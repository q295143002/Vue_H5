  <template>
  <div class ='pos-r m-taxi-placeinput'>
  <group>
    <cell
      @click='ChoosePlace(0)' 
      placeholder='出发点'
      :title.sync ='from.addr'
      :inline-desc = 'from.addr?"":"您在哪儿"'>
      <i class='theme-color-green iconfont icon-yuanxingweixuanzhong mr-05' slot='icon'></i>
    </cell>
    <cell
      @click='ChoosePlace(1)' 
      :inline-desc = 'to.addr?"":"您要去哪儿"'
      :title.sync='to.addr' 
      :show-clear="false"
      >
        <i class='theme-color-red iconfont icon-yuanxingweixuanzhong mr-05' slot='icon'></i>
      </cell> 
    <time :provide-data.sync='ProvideData'></time>
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
        <x-button type='primary' @click='carPriceShow = false'>确定</x-button>
      </div>
    </dialog>
  </group>
  </div>
  <!-- 在哪 -->  
  <choosepoi 
    :Pop.sync='Pop' 
    :Place.sync='choose' 
    :Now ='now' 
    :ddcode='DDCODE'
    v-ref:choosep></choosepoi>
  <slide-picker
    v-if='carTypeShow[0]'  
    :show.sync ='carTypePop' 
    :data.sync='carTypeShow' 
    :column='1' 
    :value.sync='carType' ></slide-picker>
  <loading :show.sync ='Loading.show' text = '估价中'></loading>
</template>
<script>
import SlidePicker from 'public/SlidePicker'
import {Cell, Group, Popup, XInput, Switch, PopupPicker, Icon, Flexbox, FlexboxItem, Dialog, XButton, Loading} from 'vux-c/'
import choosepoi from './place/choosepoi'
import Time from './place/time'
export default {
  components: {
    Loading,
    Time,
    XButton,
    Dialog,
    SlidePicker,
    Flexbox,
    FlexboxItem,
    Icon,
    PopupPicker,
    Group,
    Cell,
    Popup,
    XInput,
    Switch,
    choosepoi
  },
  data: function () {
    return {
      carType: [],
      carPriceShow: false,
      carTypePop: false,
      carTypeShow: [],
      carTypeInfo: [],
      carTypePut: {
        code: null,
        dynamic_md5: '',
        dynamic_price: null,
        name: '',
        normal_unit_price: null,
        price: null,
        price_tip: '',
        start_price: null
      },
      Loading: {
        show: false
      },
      Step: 1,
      Pop: false,
      DDCITY: [], // 城市列表
      DDCODE: {},
      DDversion: '0.0.1',
      CityFlNav: [], // 用于choosecity模块
      now: {
        type: 0,
        city: '',
        citycode: '2', // 城市代码
        district: '', // 城市区号
        addr: '',
        lng: null,
        lat: null,
        poi: []
      },
      /* 在哪 */
      from: {
        type: 0,
        city: '',
        citycode: '', // 滴滴城市代码
        district: '', // 城市区号
        addr: '定位中...',
        poi: []
      },
      /* 去哪 */
      to: {
        type: 1,
        city: '',
        citycode: '', // 滴滴城市代码
        district: '', // 城市区号
        addr: '',
        poi: []
      },
      /* 发送到选择组件里的数据 */
      choose: {},
      expenseType: 1,
      ProvideData: {
        order_type: 1,
        order_time: null
      }
    }
  },
  props: {
    placeData: Object
  },
  watch: {
    'now' () {
      console.log(JSON.stringify(this.now))
    },
    'ProvideData' () {
      console.log(JSON.stringify(this.ProvideData))
    },
    'carType' () {
      this.carTypePut = this.carTypeInfo[this.carType]
    }
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
  ready () {
    this.ProvideData.order_time = new Date()
    this.$root.WechatInit()
    window.wx.ready(() => {
      this.getLocation(false)
    })
    window.wx.error(() => {
      this.getCitylist()
    })
  },
  methods: {
    getLocation (bool) {
      let that = this
      window.wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          that.now.lng = res.longitude
          that.now.lat = res.latitude
          that.init()
        },
        fail: function (res) {
          that.init()
        }
      })
    },
    /* 页面初始化 */
    init () {
      switch (this.Step) {
        case 1:
          this.getCitylist('DDCODE')
          break
        case 2:
          this.getNowLocation() // 设置当前位置
          break
        default:
          break
      }
    },
    /* 获取城市列表 */
    getCitylist (str) {
      if (window.localStorage.getItem(str)) {
        console.log('has' + str)
        this.errCitylist(str)
        this.timeOutCitylist(str)
      } else {
        console.log('no' + str)
        this.getCityCar(str)
      }
    },
    /* 列表数据完整性检查 */
    errCitylist (str) {
      try {
        JSON.parse(window.localStorage.getItem(str))
      } catch (e) {
        window.localStorage.removeItem(str)
        this.getCitylist(str)
        return
      }
    },
    /* 列表过期检测 */
    timeOutCitylist (str) {
      var obj = JSON.parse(window.localStorage.getItem(str))
      if (obj.version !== this.DDversion) {
        window.localStorage.removeItem(str)
        this.getCitylist(str)
        return
      }
      if (obj.processTime) {
        var dateNow = new Date()
        // 兼容safari date写法yyyy/MM/dd
        var dateOld = new Date(obj.processTime.replace(/-/g, '/').slice(0, 10))
        if ((dateNow.getTime() - dateOld.getTime()) / 2592000000 < 1) {
          console.log('ready:' + str + ',version:' + obj.version)
          this[str] = obj.data // 设置城市列表
          this.Step = 2  // 完成城市列表分配
          this.init()
        } else {
          window.localStorage.removeItem(str)
          this.getCitylist(str)
        }
      } else {
        window.localStorage.removeItem(str)
        this.getCitylist(str)
      }
    },
    /* 调取城市code*/
    getCityCar (str) {
      console.log(str)
      window.localStorage.removeItem(str)
      this.$http({
        method: 'GET',
        url: window.Miu.Data.ApiURL + '/TravelCar_1_0/GetCityCar',
        params: {token: window.Miu.Data.Token}
      }).then(function (response) {
        response.data.processTime = new Date()
        response.data.version = this.DDversion
        window.localStorage.setItem(str, JSON.stringify(response.data))
        this.getCitylist(str)
      },
      function (response) {
        console.log(response)
      })
    },
    /* 获取当前POI */
    getNowLocation () {
      if (this.now.lng && this.now.lat) {
        // 获取到位置
        this.$http({
          method: 'GET',
          url: 'http://restapi.amap.com/v3/geocode/regeo',
          params: {
            key: window.Miu.Data.MapTkn,
            location: this.now.lng + ',' + this.now.lat,
            radius: 200,
            extensions: 'all'
          }
        }).then(function (response) {
          var x = response.data
          // 当前位置
          for (var i in this.DDCODE) {
            for (var j = 0; j < this.DDCODE[i].length; j++) {
              if (x.regeocode.addressComponent.citycode === this.DDCODE[i][j].district) {
                this.setNowArea(this.DDCODE[i][j].area, this.DDCODE[i][j].name, this.DDCODE[i][j].district, x.regeocode.formatted_address)
                return
              }
            }
          }
          // 获取不到当前poi
          this.failNowLocation()
        }, function (response) {
          this.failNowLocation()
        })
      } else {
        this.failNowLocation()
      }
    },
    /* 获取poi失败 */
    failNowLocation () {
      this.$root.Alert('定位失败', '请输入地址')
      this.setNowArea('4', '上海市', '021', '')
    },
    /* 滴滴城市 */
    setNowArea (ddcode, ddcity, ddstrict, addr) {
      this.now.city = ddcity
      this.now.district = ddstrict
      this.now.addr = addr
      this.to.city = this.from.city = this.now.city
      this.to.district = this.from.district = ddstrict
      this.from.addr = this.now.addr
      this.from.lng = this.now.lng
      this.from.lat = this.now.lat
      this.to.citycode = this.from.citycode = this.now.citycode = ddcode
      this.Step = 3
      console.log(JSON.stringify(this.now))
      /**/
      this.init()
    },
    /* 获取当前预估费用 */
    getFees () {
      if (this.$route.params.open === 'place') {
        window.history.back()
      }
      if (this.from.addr !== '' && this.to.addr !== '') {
        var FeesData = {
          Expense_type: this.expenseType,
          type: this.ProvideData.order_type - 1,
          phone: window.Miu.Data.UserInfo.Mobilephone,
          flng: this.from.lng,
          flat: this.from.lat,
          tlng: this.to.lng,
          tlat: this.to.lat,
          authTkn: window.Miu.Data.Token,
          city: this.from.citycode,
          departure_time: this.ProvideData.order_time
        }
        this.Loading.show = true
        this.$http.post(window.Miu.Data.ApiURL + '/TravelCar_1_0/CarEstimatePrice', FeesData, {DisableLoading: true}).then(function (response) {
          this.Loading.show = false
          this.carTypeShow = []
          function isEmptyObject (obj) {
            for (let key in obj) {
              key
              return false
            }
            return true
          }
          if (isEmptyObject(response.data.data)) {
            this.$parent.InfoShow = false
            this.$root.Alert('估价失败', '地址无效,请更换')
          } else {
            this.carTypeInfo = response.data.data
            this.$parent.InfoShow = true
            for (let i in response.data.data) {
              this.carTypeShow.push({name: response.data.data[i].name.slice(0, 4) + ' ¥' + response.data.data[i].price, value: i, parent: 0, price: response.data.data[i].price})
            }
            this.carTypeShow.sort(function (a, b) {
              return a.price - b.price
            })
            if (this.carType.length > 0) {
              console.log(this.carType)
              this.carTypePut = this.carTypeInfo[this.carType]
            }
          }
        },
        function (response) {
          console.log(response)
        })
      }
    },
    /* 打开地址选择器 */
    ChoosePlace (index) {
      this.$router.go('/taxi/place')
      if (index === 0) {
        this.choose = this.from
        this.$refs.choosep.into(this.from)
      } else if (index === 1) {
        this.choose = this.to
        this.$refs.choosep.into(this.to)
      }
    },
    /* 配置本模块所有数据 */
    setPlaceData () {
      this.placeData = {
        dynamic_md5: this.carTypePut.dynamic_md5,
        order_time: this.ProvideData.order_time,
        order_type: this.ProvideData.order_type,
        start_loc: '{addr:"' + this.from.addr + '",lat:' + this.from.lat + ',lng:' + this.from.lng + '}',
        dest_loc: '{addr:"' + this.to.addr + '",lat:' + this.to.lat + ',lng:' + this.to.lng + '}',
        Products: [{
          name: this.carTypePut.name,
          priceDetail: ['2.0'],
          estDistance: 0,
          price: this.carTypePut.price * 1,
          price2: this.carTypePut.price * 1,
          estTimeUsage: this.carTypePut.normal_unit_price,
          prodId: 0,
          props: 0,
          sProdId: this.carTypePut.code * 1
        }],
        require_level: this.carTypePut.code,
        city_name: this.from.city,
        city_id: this.from.citycode + '',
        dest_city_id: this.to.citycode + ''
      }
      console.log(JSON.stringify(this.placeData))
    }
  },
  events: {
    'getFee' () {
      this.getFees()
    }
  }
}
</script>
<style>
  .m-taxi-placeinput p{
    text-overflow: ellipsis;
  }
</style>