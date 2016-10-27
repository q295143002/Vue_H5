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
    <car-price 
      v-ref:carprice
      :car-type-put = 'carTypePut'
    ></car-price>
  </group>
  </div>
  <!-- 在哪 -->
  <choosepoi 
    :Pop.sync='Pop' 
    :Place.sync='choose' 
    :Now ='now' 
    :ddcode='DDCODE'
    v-ref:choosep></choosepoi>
</template>
<script>
import SlidePicker from 'public/SlidePicker'
import {Cell, Group, Popup, XInput, Switch, PopupPicker, Icon, Flexbox, FlexboxItem, Dialog, XButton} from 'vux-c/'
import choosepoi from './place/choosepoi'
import CarPrice from './place/carPrice'
import Time from './place/time'
export default {
  components: {
    CarPrice,
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
      Step: 1,
      Pop: false,
      DDCITY: [], // 城市列表
      DDCODE: {},
      DDversion: '0.0.1',
      CityFlNav: [], // 用于choosecity模块
      now: {
        type: 0,
        city: '',
        citycode: '', // 城市代码
        district: '', // 城市区号
        addr: '',
        lng: 121.4116,
        lat: 31.24392,
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
    }
  },
  ready: function () {
    this.ProvideData.order_time = new Date()
    this.init()
  },
  methods: {
    /* 页面初始化 */
    init () {
      switch (this.Step) {
        case 1:
          this.getCitylist('DDCODE', 2)
          break
        case 2:
          this.getNowLocation() // 设置当前位置
          break
        default:
          break
      }
    },

    /* 获取城市列表 */
    getCitylist (str, num) {
      if (window.localStorage.getItem(str)) {
        console.log('has' + str)
        this.errCitylist(str, num)
        this.timeOutCitylist(str, num)
      } else {
        console.log('no' + str)
        this.httpCity(str, num)
      }
    },
    /* 拉取城市 */
    httpCity (str, num) {
      switch (str) {
        case 'DDCITY': this.httpCitylist(str, num)
          break
        case 'DDCODE': this.getCityCar(str, num)
          break
      }
    },
    /* 列表数据完整性检查 */
    errCitylist (str, num) {
      try {
        JSON.parse(window.localStorage.getItem(str))
      } catch (e) {
        window.localStorage.removeItem(str)
        this.getCitylist(str, num)
        return
      }
    },
    /* 列表过期检测 */
    timeOutCitylist (str, num) {
      var obj = JSON.parse(window.localStorage.getItem(str))
      if (obj.version !== this.DDversion) {
        window.localStorage.removeItem(str)
        this.getCitylist(str, num)
        return
      }
      if (obj.processTime) {
        var dateNow = new Date()
        // 兼容safari date写法yyyy/MM/dd
        var dateOld = new Date(obj.processTime.replace(/-/g, '/').slice(0, 10))
        if ((dateNow.getTime() - dateOld.getTime()) / 2592000000 < 1) {
          console.log('ready:' + str + ',version:' + obj.version)
          this[str] = obj.data // 设置城市列表
          this.Step = num  // 完成城市列表分配
          this.init()
        } else {
          window.localStorage.removeItem(str)
          this.getCitylist(str, num)
        }
      } else {
        window.localStorage.removeItem(str)
        this.getCitylist(str, num)
      }
    },
    /* 调取城市code*/
    getCityCar (str, num) {
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
        this.getCitylist(str, num)
      },
      function (response) {
        console.log(response)
      })
    },
    /* 调取城市列表 */
    httpCitylist (str, num) {
      window.localStorage.removeItem(str)
      this.$http({
        method: 'GET',
        url: window.Miu.Data.ApiURL + '/TravelCar_1_0/GetCityList',
        params: {token: window.Miu.Data.Token}
      }).then(function (response) {
        response.data.processTime = new Date()
        window.localStorage.setItem(str, JSON.stringify(response.data))
        console.log('http ' + str)
        this.getCitylist(str, num)
      },
      function (response) {
        console.log(response)
      })
    },

    /* 获取当前POI */
    getNowLocation () {
      var that = this
      this.$http({
        method: 'GET',
        url: 'http://restapi.amap.com/v3/geocode/regeo',
        params: {
          key: window.Miu.Data.MapTkn,
          location: that.now.lng + ',' + that.now.lat,
          radius: 200,
          extensions: 'all'
        }
      }).then(function (response) {
        var x = response.data
        // 当前位置
        for (var i in this.DDCODE) {
          for (var j = 0; j < this.DDCODE[i].length; j++) {
            if (x.regeocode.addressComponent.citycode === this.DDCODE[i][j].district) {
              this.setNowArea(this.DDCODE[i][j].area, this.DDCODE[i][j].name, this.DDCODE[i][j].district, x)
              return
            }
          }
        }
        window.alert('抱歉，当前城市暂无滴滴专车覆盖')
      },
      function (response) {
        console.log(response)
      })
    },
    /* 滴滴城市 */
    setNowArea (ddcode, ddcity, ddstrict, map) {
      console.log(ddcode + ddcity + ddstrict)
      this.now.city = ddcity
      this.now.district = ddstrict
      this.now.addr = map.regeocode.formatted_address
      this.now.poi = map.regeocode.pois
      this.to.city = this.from.city = this.now.city
      this.to.district = this.from.district = ddstrict
      this.from.addr = this.now.addr
      this.from.lng = this.now.lng
      this.from.lat = this.now.lat
      this.to.citycode = this.from.citycode = this.now.citycode = ddcode
      this.Step = 3
      this.init()
    },
    /* 获取当前预估费用 */
    getFees () {
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
        this.$refs.carprice.getFees(FeesData)
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