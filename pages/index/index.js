//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 500,
    windowHeight:0
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  //人员登记
  registerTap:function(){
    wx.navigateTo({
      url: '../regist/regist'
    })
  },
  //梯控
  liftTap:function(){
    wx.navigateTo({
      url: '../liftlist/liftlist'
    })
  },
  //通行记录
  passTap:function(){
    wx.navigateTo({
      url: '../record/record'
    })
  },
  //通行证
  epassTap:function(){

  },
  //社区排查
  troubleTap:function(){

  },
  //居家限行
  homeTap:function(){

  },
  //问诊
  diagnoseTap:function(){

  },
  onLoad: function () {
    // 算出比例
    let ratio = 750 /app.globalData. clientWidth;
    // 算出高度(单位rpx)
    let height = app.globalData. clientHeight * ratio;
    let navigationBarHeight = app.globalData.navHeight*ratio
    this.setData({
      windowHeight:height-navigationBarHeight
    })

    this.getOpenId()
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {

          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //获取openid
  getOpenId() {
    let that = this
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log('code', res.code)
        let data = {
          JsCode: res.code
        }

        wx.request({
          url:  'http://47.107.224.8:9092/Users/Code2Session',
          method: "POST",
          data: data,
          success(uInfo) {
            console.log('uInfo', uInfo)
            let openId = uInfo.data.FObject.openid
            let key = uInfo.data.FObject.session_key
            app.globalData.openId = openId
            // alert.show(that, 'success', openId)
            // that.getSiyuanInfo(openId)
            // console.log('before', app.globalData.encryptedData)
            //函数调用
            var edata = app.globalData.encryptedData;
            // console.log('after', edata)
            that.getUnionId(edata, key, app.globalData.iv)
            // that.checkOpenId("", openId)

          }
        })
      }
    })
  },

  getUnionId(edata, key, iv) {
    let that = this
    let data = {
      FData: edata,
      FKey: key,
      FIv: iv
    }
    console.log('data', data)
    wx.request({
      url: 'http://47.107.224.8:9092/Users/decodeUserInfo',
      method: "POST",
      data: data,
      success(res) {
        console.log('getUnionId', res)
        if (res.data.Result === 200 && res.data.FObject) {
          let unionId = res.data.FObject.unionId
          // let unionId = "oo3AJ1vmJYhmK0Lz-bmDrIhSQRqo"
          console.log('unionid', unionId)
          console.log('openid', app.globalData.openId)
          that.getSiyuanInfo(unionId)
        } else if (res.data.Result === 104) {
          // that.getUnionId(edata, key, iv)
          that.getQuanxian()
        } else {
          if (!app.globalData.loginInfo) {
            console.log('loginInfo-null')
            wx.reLaunch({
              url: '../login/login'
            })
          }
        }
      }
    })
  },
})
