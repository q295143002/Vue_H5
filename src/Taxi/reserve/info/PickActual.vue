<template>
  <group v->
    <cell class='ta-l' :title='contact.UserName' @click = 'setContact(index)' 
      v-for ='(index, contact) in actual.UserList' is-link  track-by ='$index' :inline-desc='contact.Mobilephone'>
     <div slot="icon" :class= "['m-contact-icon', actual.Index === $index ? 'active':'']">
       {{contact.UserName.charAt(0)}}
     </div>{{$index===0?'自己 ':''}}</cell>
  </group>
</template>
<script>
  import {Group, Cell} from 'vux-c'
  export default {
    components: {
      Group,
      Cell
    },
    ready () {
      this.getContact()
    },
    props: {
      actual: Object
    },
    data () {
      return {}
    },
    methods: {
      getContact () {
        this.$http({
          method: 'GET',
          url: window.Miu.Data.ApiURL + '/User_1_0/GetContact',
          params: {
            token: window.Miu.Data.Token
          }
        }).then(function (response) {
          var res = response.data.result
          for (var i = 0; i < res.length; i++) {
            this.actual.UserList.push({UserName: res[i].UserName, Mobilephone: res[i].Mobilephone})
          }
        },
        function (response) {
          console.log(response)
        })
      },
      /* 设置联系人 */
      setContact (index) {
        this.actual.Index = index
        this.actual.User = this.actual.UserList[index]
        this.$emit('on-close')
      }
    }
  }
</script>