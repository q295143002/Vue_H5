<template>
<div v-for ='AirInfo in AirInfo' track-by ='$index' class='reserve-bg'>
  <div class='pd-1 color-white'>
    <flexbox>
      <flexbox-item class='ta-c' ><span class='fsz-2'>{{AirInfo.TakeOffTime}}</span>
        <br>
        <small>{{AirInfo.DAirport|Airport}}{{AirInfo.DPortBuilding}}</small>
      </flexbox-item>
      <flexbox-item class='ta-c'>
        <div><i class='iconfont icon-air fsz-2'></i></div>
      </flexbox-item>
      <flexbox-item class='ta-c'><span class='fsz-2'>{{AirInfo.ArriveTime}}</span><br><small>{{AirInfo.AAirport|Airport}}{{AirInfo.APortBuilding}}</small></flexbox-item>
    </flexbox>
  </div>
  <group>
  <div class="pd-05" style="font-size:12px">
    <flexbox>
      <flexbox-item :span='1/4'>
        <span v-if='$index === 0'>
          {{$route.params.flightway==='D'?'去程':'单程'}}
        </span>
        <span v-else>返程</span>
        <br>
        <b>{{AirInfo.TakeOffDate}}</b>
      </flexbox-item>
      <flexbox-item :span='1/4'>{{AirInfo.AirlineCode|AirCompany}}<br>{{AirInfo.Flight}}</flexbox-item>
      <flexbox-item :span='1/4'>
        <div>{{AirInfo.Class + '/' + AirInfo.SubClass}}</div>
        <div>
          <small class="color-gray-middle">{{AirInfo.Rate|Rate}}</small>
          <small>¥</small>
          <big class='color-red'>{{AirInfo.Price}}</big>
        </div>
      </flexbox-item>
      <flexbox-item :span='1/4'>
        <div>机建</div>
        <div>
          <small>¥</small>
          <big  class='color-red'>{{AirInfo.AdultTax}}</big>
        </div>
      </flexbox-item>
    </flexbox>
    </div>
  </group>
</div>
</template>
<script>
  import { Flexbox, FlexboxItem, Group } from 'vux-c/'
  export default {
    components: {
      FlexboxItem,
      Flexbox,
      Group
    },
    props: {
      InfoData: Object
    },
    filters: {
      Rate (obj) {
        if (obj < 10) {
          return obj + '折'
        } else {
          return '全价'
        }
      },
      Airport (obj) {
        if (obj.indexOf('国际机场') !== -1) {
          return obj.slice(0, obj.indexOf('国际机场'))
        } else if (obj.indexOf('机场') !== -1) {
          return obj.slice(0, obj.indexOf('机场'))
        }
      },
      AirCompany (obj) {
        for (var i = 0; i < this.AirCompany.length; i++) {
          if (this.AirCompany[i].k === obj) {
            return this.AirCompany[i].v
          }
        }
      }
    },
    data () {
      return {
        AirCompany: JSON.parse(window.sessionStorage.getItem('AirCompany')),
        FlightCities: JSON.parse(window.sessionStorage.getItem('SearchCity')),
        AirInfo: JSON.parse(window.sessionStorage.getItem('AirOrder'))
      }
    },
    methods: {
      getInfoData () {
        console.log(this.FlightCities)
        this.InfoData.ArriveCity1 = [this.FlightCities[1].cityName, this.AirInfo[0].APortCode, this.AirInfo[0].APortCode]
        this.InfoData.DepartCity1 = [this.FlightCities[0].cityName, this.AirInfo[0].DPortCode, this.AirInfo[0].DPortCode]
        this.InfoData.DepartDate1 = this.AirInfo[0].TakeOffDate
        this.InfoData.FirstRoute = mapRoute(this.AirInfo[0])
        if (this.$route.params.flightway === 'D') {
          this.InfoData.ArriveCity2 = this.InfoData.DepartCity1
          this.InfoData.DepartCity2 = this.InfoData.ArriveCity1
          this.InfoData.DepartDate2 === this.AirInfo[1].TakeOffDate
          this.InfoData.SecRoute = mapRoute(this.AirInfo[1])
        }
        console.log(JSON.stringify(this.InfoData))
        function mapRoute (obj) {
          return {
            APortBuilding: obj.APortBuilding,
            APortCode: obj.APortCode,
            TakeOffTime: obj.TakeOffTime,
            TakeOffDate: obj.TakeOffDate,
            SubClass: obj.SubClass,
            AirlineCode: obj.AirlineCode,
            ArriveCityCode: obj.APortCode,
            ArriveDate: obj.ArriveDate,
            ArriveTime: obj.ArriveTime,
            Class: obj.Class,
            CraftType: obj.CraftType,
            DPortBuilding: obj.DPortBuilding,
            DPortCode: obj.DPortCode,
            DepartCityCode: obj.DPortCode,
            Flight: obj.Flight,
            FlyTime: obj.FlyTime,
            Guid: obj.Guid,
            MiutripGuid: obj.MiutripGuid,
            OTAType: obj.OTAType,
            Quantity: obj.Quantity,
            ChildTax: obj.ChildTax,
            ChildStandardPrice: obj.ChildStandardPrice,
            ChildPrice: obj.ChildPrice,
            ChildOilFee: obj.ChildOilFee,
            Rate: obj.Rate,
            AdultTax: obj.AdultTax,
            StopTimes: obj.StopTimes,
            AdultStandardPrice: obj.AdultStandardPrice,
            AdultPrice: obj.AdultPrice,
            AdultOilFee: obj.AdultOilFee,
            ServerFee: obj.ServerFee,
            Tax: obj.AdultTax,
            OilFee: obj.AdultOilFee
          }
        }
      }
    }
  }
</script>
<style>
  .reserve-bg{
    background: url(../../assets/air-reserve-bg.png) top center no-repeat;
    -webkit-background-size: cover;
    background-size: cover;
  }
</style>