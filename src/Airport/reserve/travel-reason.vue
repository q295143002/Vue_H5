<!-- 出行目的 -->
<template>
  <group>
    <popup-picker :title='"出行目的"'  :data="TravelReason.data" :value.sync="TravelReason.result"></popup-picker>
    <x-textarea placeholder="备注(出行目的为其他时必填)" :value.sync='TravelReason.tip' ></x-textarea>
    <x-input placeholder="OA出差申请单" :value.sync ='OATravelApplyOrder':required= 'InputRequired'></x-input>
  </group>
  <group>
    <x-input 
      :placeholder="MoreRemark.NoteTooLTipOne" 
      :value.sync = 'MoreRemark.MoreRemarkOne'
      v-show="MoreRemark.NoteTooLTipOne"
      :required= 'InputRequired'
      ></x-input>
    <x-input 
      :placeholder="MoreRemark.NoteTooLTipTwo" 
      :value.sync = 'MoreRemark.MoreRemarkTwo'
      v-show="MoreRemark.NoteTooLTipTwo"
      :required= 'InputRequired'
      ></x-input>
    <x-input 
      :placeholder="MoreRemark.NoteTooLTipThree" 
      :value.sync = 'MoreRemark.MoreRemarkThree' 
      v-show="MoreRemark.NoteTooLTipThree"
      :required= 'InputRequired'
      ></x-input>
  </group>
</template>
<script>
  import { Group, PopupPicker, XTextarea, XInput } from 'vux-c/'
  export default {
    components: { Group, PopupPicker, XTextarea, XInput },
    props: {
      TravelReasonData: Object
    },
    ready () {
      this.getNoteToolTip()
    },
    data () {
      return {
        InputRequired: false,
        OATravelApplyOrder: '',
        TravelReason: {
          result: ['商务谈判/拜访'],
          data: [['商务谈判/拜访', '商务考察/视察', '学习/培训', '技术支持', '会展/服务', '奖励/旅游', '其他']],
          tip: ''
        },
        MoreRemark: {
          MoreRemarkOne: '',
          MoreRemarkTwo: '',
          MoreRemarkThree: '',
          NoteTooLTipOne: '',
          NoteTooLTipTwo: '',
          NoteTooLTipThree: ''
        }
      }
    },
    methods: {
      getNoteToolTip () {
        this.$http({
          method: 'GET',
          url: window.Miu.Data.ApiURL + '/User_1_0/GetCorpNoteToolTip',
          params: {
            token: window.Miu.Data.Token,
            corpId: window.Miu.Data.UserInfo.CorpID
          }
        }).then(function (response) {
          console.log(response.data.NoteToolTips)
          this.$set('MoreRemark.NoteTooLTipOne', response.data.NoteToolTips[0])
          this.$set('MoreRemark.NoteTooLTipTwo', response.data.NoteToolTips[1])
          this.$set('MoreRemark.NoteTooLTipThree', response.data.NoteToolTips[2])
        })
      },
      getTravelReasonData () {
        if (this.TravelReason.result[0] === '其他' && this.TravelReason.tip === '') {
          this.$parent.ToastText('请输入备注')
        }
        this.TravelReasonData = {
          TravelReason: this.TravelReason.result[0],
          TravelReasonRemark: this.TravelReason.tip,
          MoreRemark: this.MoreRemark,
          OATravelApplyOrder: this.OATravelApplyOrder
        }
      }
    }
  }
</script>