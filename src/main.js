import Vue from 'vue'
Vue.config.devtools = true
require('./Global/vux.js')
/* base64解码器 */
const base64 = require('base-64')
window.base64 = base64

/* 加密器 */
window.CryptoJS = require('crypto-js')

const FastClick = require('fastclick')
FastClick.attach(document.body)

require('./Global/router.js')
require('./Global/resource.js')
