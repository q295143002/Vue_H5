import Test from '../../Test/test'
import Login from '../../Login/login'
import Taxi from '../../Taxi/taxi-reserve'
import TaxiWait from '../../Taxi/taxi-wait'
import Air from '../../Airport/air-search'
import AirResult from '../../Airport/air-result'
import AirReserve from '../../Airport/air-reserve'
import AirSuccess from '../../Airport/air-success'
import AirPassenger from '../../Airport/air-passenger'
import Train from '../../Train/train'
import Chart from '../../Chart/Chart'
import ChooseContact from '../../Public/Contact'
import Wechat from '../../Test/wechat'
function mapRoute (router) {
  router.map({
    '/test': {
      component: Test,
      name: '测试环境'
    },
    '/login/:wechatid': {
      component: Login,
      name: '用户登录'
    },
    '/taxi/:open': {
      component: Taxi,
      name: '用车'
    },
    '/taxi/wait/:OrderID': {
      component: TaxiWait,
      name: '下单成功'
    },
    '/air/:status': {
      component: Air
    },
    '/train': {
      component: Train
    },
    /**
     * DepartCity: 出发城市
     * ArriveCity: 到达城市
     * FlightWay: 是否往返
     * DepartDateTo: 去程日期
     * CacheDateTo: 缓存的去程日期
     * CacheDateBack: 缓存的返程日期
     * Page: 判断往返 0:去程 1:返程
     * Show: 打开仓位列表 0:关闭 1:打开
     */
    '/air/search/:DepartCity/:ArriveCity/:FlightWay/:DepartDateTo/:CacheDateTo/:CacheDateBack/:Page/:Show': {
      component: AirResult
    },
    /**
     * 订单页
     * from:
     * 0: 因公为本人
     * 1: 因公为多人
     */
    '/air/reserve/:flightway/:from/:open': {
      component: AirReserve,
      name: '填写订单'
    },
    /* 选择出行人 */
    '/air/passenger/:flightway/:from/:open': {
      component: AirPassenger,
      name: '选择出行人'
    },
    /* 机票成功下单页面 */
    '/air/success': {
      component: AirSuccess,
      name: '下单成功'
    },
    '/chart': {
      component: Chart
    },
    '/choosecontact': {
      component: ChooseContact
    },
    '/wechat': {
      component: Wechat
    }
  })
}
exports.mapRoute = mapRoute
