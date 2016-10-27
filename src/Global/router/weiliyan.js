/* WeiLiYan */
import User from '../../User/user'
import Travel from '../../Travel/travel'
/* User */
import Logout from '../../User/logout/logout'
import Policy from '../../User/policy/policy'
import Personal from '../../User/personal/personal'
import Order from '../../User/order/order'
// import Order2 from '../../User/order/order2'
import UnpaidOrder from '../../User/unpaid-order/unpaidorder'
import Contact from '../../User/contact/contact'
import Traveller from '../../User/traveller/traveller'
// import Userinfo from '../../User/userinfo/userinfo'
import PhoneNum from '../../User/phoneNum/phonenum'
import ModifyPsd from '../../User/modify-psd/modify-psd'
import Address from '../../User/address/address'
import Staff from '../../User/staff/staff'
import Passenger from '../../User/passenger/passenger'
import ChoosePsg from '../../User/choose-psg/choose-psg'
/* User/order */
import AirDetail from '../../User/order/orderDetail/airDetail'
import CarDetail from '../../User/order/orderDetail/carDetail'
/* User/contact */
import AddContact from '../../User/contact/addContact/add-contact'
import EditContact from '../../User/contact/editContact/edit-contact'
/* User/Passenger */
import PsgPage from '../../User/Passenger/editPsg/psgPage'
/* User/address */
import Newadd from '../../User/address/newadd/newadd.vue'
/* 夏钢 */
import Report from '../../User/Report/Report'
import ApprDetail from '../../User/report/sub_page/apprDetail/ApprovalDetail'
import ApprSearch from '../../User/report/search'

function mapRoute (router) {
  router.map({
    '/user': {
      component: User,
      name: '个人中心'
    },
    /**
     * 夏钢
     */
    '/report': {
      component: Report,
      name: '多级审批'
    },
    '/report/:listType/:apprType/:apprId': {
      component: ApprDetail
    },
    '/apprsearch/:uid/:approvalId/:corpId/:remark': {
      component: ApprSearch
    },
    /**
     * WeiLiYan
     */
    '/travel': {
      component: Travel,
      name: '行程'
    },
    '/user/logout': {
      component: Logout
    },
    '/user/personal': {
      component: Personal,
      name: '出行人'
    },
    '/user/order': {
      component: Order,
      name: '全部订单'
    },
    '/user/unpaidorder': {
      component: UnpaidOrder,
      name: '未支付订单'
    },
    '/user/phonenum': {
      component: PhoneNum
    },
    '/user/modify-psd': {
      component: ModifyPsd,
      name: '修改公司账户密码'
    },
    '/user/traveller': {
      component: Traveller
    },
    '/user/contact': {
      component: Contact,
      name: '联系人'
    },
    '/user/staff': {
      component: Staff
    },
    '/user/passenger': {
      component: Passenger,
      name: '出行人'
    },
    '/user/policy': {
      component: Policy,
      name: '差旅政策'
    },
    '/user/choose-psg': {
      component: ChoosePsg
    },
    '/user/contact/add-contact': {
      component: AddContact,
      name: '添加联系人'
    },
    '/user/contact/edit-contact/:name/:tel/:id': {
      name: '编辑联系人',
      component: EditContact
    },
    '/user/address/newadd': {
      component: Newadd,
      name: '添加地址'
    },
    '/user/address/editadd/:addressData': {
      component: Newadd,
      name: '编辑地址'
    },
    '/user/address/editadd': {
      component: Newadd,
      name: '编辑地址'
    },
    '/user/address': {
      component: Address,
      name: '配送地址'
    },
    '/user/passenger/edit': {
      component: PsgPage,
      name: '编辑出行人'
    },
    '/user/passenger/add': {
      component: PsgPage,
      name: '添加出行人'
    },
    '/user/order/carDetail/:id': {
      name: '用车详情',
      component: CarDetail
    },
    '/user/order/airDetail/:id': {
      name: '机票详情',
      component: AirDetail
    }
  })
}
exports.mapRoute = mapRoute
