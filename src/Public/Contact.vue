<template>
<div class= 'm-contact-body of-y-s'>
  <group>
    <cell title='添加联系人' @click = 'addContact.show = true'>+</cell>
  </group>

  <add-contact :show.sync ='addContact.show'></add-contact>
  <group class='mb-4'>
      <cell v-for = 'contact in Contact.List' @click = 'chooseContact(contact)'  :title.sync ='contact.UserName' >
        {{contact.Mobilephone}}
        <icon slot= 'icon' :type ='contact.isChoose?"success":"circle"' class= 'mr-05'></icon>
      </cell>
  </group>
</div>
<div class="m-bottom-bar">
  <div class="pd-05">
    <x-button type='primary' @click='submitChoose'>确定</x-button>
  </div>
</div>
</template>
<script>
  import addContact from './ContactSelector/addContact'
  import {XButton, Scroller, Group, Icon, Cell, Flexbox, FlexboxItem, Swiper, SwiperItem} from 'vux-c'
  export default {
    components: {
      addContact,
      Scroller, XButton,
      Group, Icon, Cell, Flexbox, FlexboxItem, Swiper, SwiperItem
    },
    data () {
      return {
        addContact: {
          show: false
        },
        Contact: {
          List: [],
          ListLength: 0
        },
        zero: 0
      }
    },
    props: {
      ContactList: Array,
      Max: Number,
      Min: Number
    },
    ready () {
      this.getContact()
    },
    methods: {
      init () {
        let TempList = this.ContactList.map((e) => {
          return e
        })
        this.Contact.ListLength = this.ContactList.length
        this.Contact.List.forEach((e) => {
          e.isChoose = false
          for (var i = 0; i < TempList.length; i++) {
            if (TempList[i].UID === e.UID) {
              TempList.splice(i, 1)
              e.isChoose = true
              break
            }
          }
        })
      },
      getContact () {
        this.$http({
          methods: 'GET',
          url: window.Miu.Data.ApiURL + '/User_1_0/GetContact',
          params: {
            token: window.Miu.Data.Token
          }
        }).then(function (response) {
          this.setContact(response)
        }, function (response) {
          console.log('err')
        })
      },
      setContact (response) {
        let showArr = []
        response.data.result.forEach((e) => {
          showArr.push({
            UID: e.UniqueID,
            UserName: e.UserName,
            Mobilephone: e.Mobilephone,
            isChoose: false
          })
        })
        showArr.unshift({
          UID: window.Miu.Data.UserInfo.UID,
          UserName: window.Miu.Data.UserInfo.UserName,
          Mobilephone: window.Miu.Data.UserInfo.Mobilephone,
          isChoose: false
        })
        this.Contact.List = showArr
        // this.init()
      },
      chooseContact (item) {
        console.log(item.isChoose)
        switch (item.isChoose) {
          /* 去联系人 */
          case true:
            if (this.Contact.ListLength <= this.Min) {
              this.$root.Toast('最少要选择' + this.Min + '个联系人')
            } else {
              item.isChoose = !item.isChoose
              this.Contact.ListLength--
            }
            break
          /* 添加联系人 */
          case false:
            if (this.Contact.ListLength >= this.Max) {
              this.$root.Toast('最多可选' + this.Max + '个联系人')
            } else {
              item.isChoose = !item.isChoose
              this.Contact.ListLength++
            }
            break
        }
      },
      submitChoose () {
        let SubmitArr = []
        this.Contact.List.forEach((e) => {
          if (e.isChoose) {
            SubmitArr.push(e)
          }
        })
        console.log(SubmitArr)
        this.ContactList = SubmitArr
        SubmitArr = null
        this.$emit('on-submit')
      }
    }
  }
</script>
<style scope>
  .m-contact-body {
    position: absolute;
    top:0;
    left: 0;
    bottom:0;
    width: 100%;
  }
  .m-bottom-bar{
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
  }
  .edit-bg-green{
    background: green;
    color:#fff;
  }
  .edit-bg-red{
    background: red;
    color: #fff
  }
</style>
