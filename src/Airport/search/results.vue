 <template>
 <div></div>
  <result-content
  v-ref:air-result-content
  :airlist='AirList'
  :orderobj='OrderObj' 
  :filterobj='FilterObj' 
  :order-step.sync='OrderStep'  
  :pass-way.sync ='PassWay'
  ></result-content>
  </div>
  <result-filter 
  :orderobj.sync='OrderObj'  
  :company='CompanyKwd' 
  :air-company='AirCompany'>
  </result-filter>
  <loading :show.sync = 'Loading.show' :text.sync='Loading.text'></loading>
</template>
<script>
  import ResultContent from './results/result-content'
  import ResultFilter from './results/result-fliter'
  import {Loading} from 'vux-c'
  export default {
    components: {
      Loading,
      ResultContent,
      ResultFilter
    },
    props: {
      PassWay: Object,
      OrderStep: Number
    },
    data () {
      return {
        Loading: {
          show: false,
          text: '检索航班中'
        },
        AirList: [], // 展示的数据
        Flights: [], // 航司缓存
        OrderObj: null,
        FilterCompany: [1],
        CompanyKwd: [],
        FilterObj: {
          type: 0, // 座位类型
          company: '' // 航空公司
        },
        AirCompany: []
      }
    },
    ready () {
      this.getAirCompany()
    },
    methods: {
      /* 设置title */
      setMainTitle () {
        let Page, DepartCity, ArriveCity
        if (this.$route.params.FlightWay === 'D') {
          switch (this.$route.params.Page) {
            case '0': Page = '去程'
              break
            case '1': Page = '返程'
              break
          }
        } else {
          Page = '单程'
        }
        let SearchCity = JSON.parse(window.sessionStorage.getItem('SearchCity'))
        for (var i = 0; i < SearchCity.length; i++) {
          if (SearchCity[i].cityCode === this.$route.params.DepartCity) {
            DepartCity = SearchCity[i].title
          }
          if (SearchCity[i].cityCode === this.$route.params.ArriveCity) {
            ArriveCity = SearchCity[i].title
          }
        }
        window.Miu.SetTitle(Page + ': ' + DepartCity + '-' + ArriveCity)
      },
      setSubTitle () {
        let Time, DepartCity, ArriveCity
        Time = JSON.parse(window.sessionStorage.getItem('MoreData')).DepartDate
        let SearchCity = JSON.parse(window.sessionStorage.getItem('SearchCity'))
        for (var i = 0; i < SearchCity.length; i++) {
          if (SearchCity[i].cityCode === this.$route.params.DepartCity) {
            DepartCity = SearchCity[i].title
          }
          if (SearchCity[i].cityCode === this.$route.params.ArriveCity) {
            ArriveCity = SearchCity[i].title
          }
        }
        window.Miu.SetTitle(DepartCity + '-' + ArriveCity + '|' + Time)
      },
      /* 搜索航班 */
      getFlights (timeKey = this.$route.params.DepartDateTo) {
        this.setMainTitle()
        this.Loading.show = true
        this.$http.post(window.Miu.Data.ApiURL + '/Flight_1_0/GetNormalFlights', {
          Airline: '',
          authTkn: window.Miu.Data.Token,
          ClassNo: '',
          DepartCity: this.$route.params.DepartCity,
          ArriveCity: this.$route.params.ArriveCity,
          DepartDate: timeKey,
          FlightWay: this.$route.params.FlightWay
        }, {
          DisableLoading: true
        }).then(response => {
          this.Loading.show = false
          console.log(response)
          if (this.$refs.airResultContent.$els.content.scrollTop) {
            this.$refs.airResultContent.$els.content = 0
          }
          if (response.data.flights.length === 0) {
            this.AirList = ['noresult']
          } else {
            this.AirList = response.data.flights
            for (let i = 0; i < this.AirList.length; i++) {
              for (let j = 0; j < this.AirCompany.length; j++) {
                if (this.AirList[i].AirlineCode === this.AirCompany[j].k) {
                  this.AirList[i].CompanyName = this.AirCompany[j].v
                }
              }
              this.AirList[i].StandardPrice = this.AirList[i].TakeOffTime // 无法自动生成json对象 先用StandradPrice替代
              this.CompanyKwd.push(this.AirList[i].AirlineCode)
            }
            this.CompanyKwd = this.CompanyKwd.unique()
          }
        }, response => {
          this.Loading.show = false
          console.log(response)
          this.AirList = ['errresult']
        })
      },
      getAirCompany () {
        this.$http.get(
          window.Miu.Data.Store + '/AirCompany.js', {
            emulateJSON: true
          }
        ).then(function (response) {
          var that = this
          var blob = new window.Blob([response.data], {type: 'text/plain'})
          window.Miu.readBlobAsText(blob, function (dataText) {
            that.AirCompany = JSON.parse(dataText)
            window.sessionStorage.setItem('AirCompany', dataText)
          })
        },
        function (response) {
          console.log(response)
        })
      },
      companyInit () {
        for (let i = 0; i < this.CompanyKwd.length; i++) {
          for (let j = i + 1; j < this.CompanyKwd.length; j++) {
            if (this.CompanyKwd[i].key === this.CompanyKwd[j].key) {
              this.CompanyKwd.splice(j, 1)
              j--
            }
          }
        }
      }
    },
    events: {
      'orderchoose': function (msg) {
        this.OrderObj = msg
      },
      'filterchoose': function (msg) {
        this.FilterObj = msg
      }
    }
  }
</script>