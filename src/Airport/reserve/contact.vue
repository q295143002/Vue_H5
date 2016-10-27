<template>
<group>
  <cell title='联系人' class='vux-1px-b'></cell>
  <div>
    <cell v-for='(index, cont) in contact' :title.sync='cont.UserName'>{{cont.Mobilephone}}
      <icon v-if = 'contact.length > 1' @click='deleteContact(index)'  type='cancel'  class='mr-05'></icon>
    </cell>
  </div>
  <cell :title='"添加联系人"' is-link @click='$parent.pageRoute("Contact")'>
    <small>最多可添加3个联系人</small>
  </cell>
</group>
<div class="m-contact-window  of-y-s ts-02" :class= 'addContact.show?"active": ""'>
  <div>
    <contact
      v-ref:contactselect
      @on-submit = 'back()'
      :contact-list.sync='contact'
      :max="max"
      :min="min"
      >
    </contact>
  </div>
</div>
</template>
<script>
  import { Cell, Icon, Popup, Group, Toast, XButton } from 'vux-c'
  import Contact from 'public/Contact'
  export default {
    components: {
      Contact,
      Popup,
      Group,
      Icon,
      Cell,
      Toast,
      XButton
    },
    props: {
      ContactData: Array
    },
    data () {
      return {
        addContact: {
          show: false
        },
        toast: {
          show: false,
          type: 'cancel',
          text: ''
        },
        choose: true,
        max: 3,
        min: 1,
        contact: [{
          UID: window.Miu.Data.UserInfo.UID,
          UserName: window.Miu.Data.UserInfo.UserName,
          Mobilephone: window.Miu.Data.UserInfo.Mobilephone,
          isChoose: true
        }],
        contactAll: []
      }
    },
    watch: {
      'addContact.show' () {
        switch (this.addContact.show) {
          case true :this.$refs.contactselect.init()
            break
          default: break
        }
      }
    },
    methods: {
      deleteContact (index) {
        this.contact.splice(index, 1)
      },
      back () {
        if (this.addContact.show) {
          this.$parent.pageRoute()
        }
      },
      getContactData () {
        function returnContact (x) {
          return {
            UserName: x.UserName,
            Mobilephone: x.Mobilephone
            // ContactID: x.UID
          }
        }
        this.ContactData = this.contact.map(returnContact)
        this.vailContactData()
      },
      vailContactData () {
        if (this.ContactData.length < 1) {
          this.$root.Toast('请添加联系人')
          return
        }
      }
    }
  }
</script>
<style scope lang='less'>
  .m-contact-window{
    z-index: 99;
    background: #fff;
    width: 100%;
    position: fixed;
    top:0;
    left: 100%;
    bottom: 0;
    &.active{
      left: 0;
    }
    >div{
      overflow-x:hidden;
      position: relative;
      height: 100%
    }
  }
</style>