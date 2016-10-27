<template>
  <flexbox orient="vertical" class="w-contact">
    <flexbox-item v-for="item in arr|orderBy 'name'" track-by="$index">
      <div class="w-contact-item" :data='item.name.charAt(0)'>
      {{item.name}} {{item.tel}}
      </div>
    </flexbox-item>
  </flexbox>
  <search @result-click="" @on-change="getResult" :results="results" :value.sync="value"></search>
</template>
<script>
import {Flexbox, FlexboxItem, Search} from 'vux-c'
export default {
  components: {
    Flexbox,
    FlexboxItem,
    Search
  },
  data () {
    return {
      arr: [],
      results: [],
      value: ''
    }
  },
  ready () {
    this.SearchPassengersByPage()
  },
  methods: {
    resultClick (item) {
      window.alert('you click the result item: ' + JSON.stringify(item))
    },
    getResult (val) {
      this.results = getResult(this.value)
    },
    SearchPassengersByPage () {
      this.$http({
        method: 'GET',
        url: window.Miu.Data.ApiURL + '/User_1_0/SearchPassengersByPage',
        params: {
          token: window.Miu.Data.Token,
          pageIndex: 2,
          pageSize: 2,
          keys: 'd'
        }
      }, function (response) {
        console.log(response.data)
      }, function (response) {
        console.log(response.data)
      })
    }
  }
}
function getResult (val) {
  let rs = []
  for (let i = 0; i < 40; i++) {
    rs.push({
      title: `${val} result: ${i + 1} `,
      other: i
    })
  }
  return rs
}
</script>