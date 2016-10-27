<template>
  <div class="gx-footer">
  <div class="" v-if="bodyData.ApprovalStatus!==0">
    <flexbox class="gx-b-top1 " :gutter="0">
      <flexbox-item :span="1/24">

      </flexbox-item>
      <flexbox-item :span="10/24">
        <x-button type="primary" @click="agree">通过审批</x-button>

      </flexbox-item>
      <flexbox-item :span="1/24">

      </flexbox-item>

      <flexbox-item :span="10/24">
        <x-button type="primary"  @click="disagreeAppr" class="bgcolorf22">驳回申请</x-button>

      </flexbox-item>
    </flexbox>
  </div>
  <div class="gf-dialog">
    <x-dialog :show.sync="show" class="dialog-demo">
      <p class="gfd-close"><span @click="show=false">&times;</span></p>
      <p class="dialog-title">驳回申请</p>
      <div class="img-box">
        <p class="gf-dialog-hint">驳回原因</p>
       <!-- <selector placeholder="请选择驳回原因" :options.sync="list"></selector>-->
       <div class="gf-dialog-sel">
         <x-select :place-holder.sync="pHodler" :x-input.sync="xInputData" :xsp-head.sync="xspHead" :xsp-data.sync="xspData" :isx-show.sync="bxsShow"></x-select>
       </div>

          <div class="weui_cell_bd weui_cell_primary">
            <textarea class="weui_textarea" placeholder="备注" rows="3" cols="30" v-model="arText" > </textarea>
          </div>
        </div>
      <div class="gf-dialog-btn">
        <flexbox  :gutter="0" class="btn-group">
          <flexbox-item :span="3/9">

          </flexbox-item>
          <flexbox-item :span="3/9">
            <x-button type="primary" class="agree" @click="reject">确定</x-button>
          </flexbox-item>


        </flexbox>

      </div>
    </x-dialog>
  </div>
  <div class="gf-dialog1">
    <x-dialog :show.sync="show1" class="dialog-demo">
      <p class="gfd-close"><span @click="show1=false">&times;</span></p>
      <div class="img-box">
        <p>确认通过审批？</p>
        <div class="weui_cell_bd weui_cell_primary">
          <textarea class="weui_textarea" placeholder="备注" rows="1" cols="30" v-model="arTextAgr" > </textarea>
        </div>
        <flexbox  :gutter="0" class="btn-group">
          <flexbox-item :span="7/15">
            <x-button type="primary" class="agree font-8" @click="agreeAppr">通过</x-button>
          </flexbox-item>
          <flexbox-item :span="1/15">

          </flexbox-item>
          <flexbox-item :span="7/15" v-if="true">
            <x-button type="primary" class="agree-transform font-8"  @click="agreeTrans">通过并转审</x-button>
          </flexbox-item>
        </flexbox>
      </div>
      <p class="gfd-hint">注：审批提交前请确认是否需要转交上一级审批</p>

    </x-dialog>
  </div>
    <x-alert :show.sync="showA" title="该审批申请已经被批准" :button-text='buttonText' @on-show="" @on-hide="onHide"></x-alert>
    <x-alert :show.sync="showB" title="审批已取消" :button-text='buttonText' @on-show="" @on-hide="onHide"></x-alert>
    <loading :show="showL" :text="toastText"></loading>
    <toast :show.sync="show3" type="cancel">网络异常提交失败，请重试</toast>
    <loading :show="showX" :text="toastText1"></loading>
  </div>


</template>
<script>
  import {Flexbox, FlexboxItem, XButton, Toast, Dialog, Loading, Group, Selector} from 'vux-c'
  import XDialog from '../../../component/xdialog'
  import XSelect from '../../../component/x-select'
  import XAlert from '../../../component/x-alert'
  export default {
    components: {
      Loading,
      Flexbox,
      FlexboxItem,
      XButton,
      Dialog,
      Group,
      Selector,
      XSelect,
      Toast,
      XDialog,
      XAlert
    },
    props: {
      bottomData: Object,
      bodyData: Object
    },
    data: function () {
      return {
        showL: false,
        show: false,
        show1: false,
        show3: false,
        showA: false,
        showB: false,
        showX: false,
        toastText: '',
        toastText1: '加载中',
        buttonText: '知道了',
        arText: '',
        arTextAgr: '',
        list: [{key: 'gd', value: '广东'}],
        pHodler: '选择违规原因',
        xspHead: '违规原因',
        xspData: ['价格太高', '出差任务取消', '出差任务可能变动', '超出可审批权限范围', '其他'],
        xInputData: '',
        bxsShow: true,
        sendData: {
          xx: '',
          yy: ''

        }
      }
    },
    methods: {
      disagreeAppr () {
        // this.showX = true
        this.$http.get(window.Miu.Data.weiXin + '/Approval_1_0/GetRejectReason', {
          token: window.Miu.Data.Token
        }).then(function (res) {
          // this.showX = false
          // console.log(res)
        }, function () {
        })
        this.show = true
      },
      agree () {
        this.show1 = true
      },
      isOperate (fn) {
        this.showX = true
        this.$http.get('static/1.json', {
          authTkn: window.Miu.Data.Token,
          approvalId: this.bottomData.approvalId,
          uid: this.bottomData.uid,
          remark: this.arTextAgr,
          shortLinkType: this.bottomData.shortLinkType
        }).then((res) => {
          if (res.data.isSP === true) {
            this.showA = true
          } else if (res.data.isDeny === true) {
            this.showB = true
          } else {
            fn()
          }
          this.showX = false
        }, (res) => {
          this.showX = false
          this.show3 = true
        })
      },
      agreeAppr () {
        var _self = this
        this.isOperate(function () {
          _self.$http.post(window.Miu.Data.weiXin + '/Approval_1_0/ApprovedApproval', {
            authTkn: window.Miu.Data.Token,
            approvalId: _self.bottomData.approvalId,
            uid: _self.bottomData.uid,
            remark: _self.arTextAgr,
            shortLinkType: _self.bottomData.shortLinkType
          }).then((res) => {
            window.location.reload()
          // this.$router.go('/report/flight/' + this.bottomData.approvalId)
          }, (res) => {
            _self.show3 = true
          })
        })
      },
      diaLogDeny () {
        this.show = false
        this.bxsShow = false
        this.xInputData = ''
        this.arText = ''
      },
      diaLogAdmit () {
        this.sendData.xx = this.xInputData
        this.sendData.yy = this.arText
      },
      diaLogAgree () {
        this.show1 = true
      },
      onHide () {
        window.location.reload()
        // this.$router.go('/report/flight/' + this.bottomData.approvalId)
      },
      agreeTrans () {
        this.arTextAgr = this.arTextAgr || ' '
        console.log(this.arTextAgr)
        this.$router.go('/apprsearch/' + this.bottomData.uid + '/' + this.bottomData.approvalId + '/' + this.bottomData.corpId + '/' + this.arTextAgr)
      },
      reject () {
        var _self = this
        _self.isOperate(function () {
          _self.$http.post(window.Miu.Data.weiXin + '/Approval_1_0/TurnDownApproval', {
            authTkn: window.Miu.Data.Token,
            uid: _self.bottomData.uid,
            approvalId: _self.bottomData.approvalId,
            remark: _self.arText | ' ',
            reason: _self.xInputData,
            shortLinkType: 6
          }).then((res) => {
            _self.refresh()
          }, (res) => {
            _self.show3 = true
          })
        })
      },
      refresh () {
        window.location.reload()
        // this.$router.go('/report/flight/' + this.bottomData.approvalId)
      }
    }
  }

</script>

<style>
  .bgcolorf22{
    background-color: #f22;
  }
  .gx-footer .weui_loading{
    top:50%
  }
.gx-footer{
  width:100%;
  position: relative;
  top:0;
}
  .gx-footer .gx-b-top1{
    top:0;
    margin-bottom: 2rem;
  }

  .gf-dialog .dialog-title{
    font-size: 1.3rem;
    height:2rem;
    line-height: 2rem;
    text-align: center;
    padding-left: 1.5rem;
  }
.gf-dialog .gf-dialog-hint{
  font-size: 1.1rem;
  height:2rem;
  line-height: 2rem;
  text-align: left;
  padding-left: 1rem;
}

.gf-dialog .weui_cell_bd,.gf-dialog-sel{
  padding: 0 1rem;
}
.gf-dialog .weui_dialog,.gf-dialog1 .weui_dialog{
  background-color: #fff;
  border-radius: 10px;
}
.gf-dialog .img-box,.gf-dialog1 .img-box{
  padding:0 10%;
}
.gf-dialog-btn {
  position: relative;
}
.gf-dialog-btn a{
  display: inline-block;
}
.gf-dialog-btn a:nth-child(1){
  color: #ff9900;
  float: right;
  margin-right:2rem;
}

.gf-dialog-btn a:nth-child(2){
  color: #0099ff;
  float: right;
  margin-right:2rem;
}
  .gfd-close{
    text-align: right;
    margin-right: 12px;
    font-weight: bolder;
    font-size: 18px;
    z-index: 2;
    margin-top: 7px;

  }

.gfd-close>span{


  position: relative;
  font-weight: bolder;
  font-size: 18px;
  z-index: 2;
  color: #fff;

}
.gfd-close::before{
  content: "";
  width:22px;
  height:22px;
  position: absolute;
  background-color: #999;
  right:10px;
  top:10px;
  z-index: 1;
  border-radius: 50%;
}
.gfd-hint{
  font-size: 12px;
  color: #999;
  padding-bottom: 20px;
}

.gf-dialog1 button ,.gf-dialog button {
  background-color: #5585eb;
  font-size: 0.80rem;

}
  .gf-dialog1 textarea,.gf-dialog textarea{
    border-bottom: 1px solid #eee;
    margin:20px 0;
    font-size: 0.90rem;
  }

 .gf-dialog textarea{
    margin:0px 0 20px 0;
  }
  .gf-dialog1 .btn-group,.gf-dialog .btn-group{
    margin-bottom: 20px;
  }


</style>
