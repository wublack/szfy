//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')
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
    windowHeight: 0,
    isRegist: false
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  //人员登记
  registerTap: function() {
    if (this.checkLoginInfo()) {
      if (!this.data.isRegist){
        wx.navigateTo({
          url: '../regist/regist'
        })
      }else{
        wx.navigateTo({
          url: '../registed/registed'
        })
      }
     
    }
  },
  //梯控
  liftTap: function() {
    if (this.checkLoginInfo()) {
      wx.navigateTo({
        url: '../liftlist/liftlist'
      })
    }
  },
  //通行记录
  passTap: function() {
    if (this.checkLoginInfo()) {
      wx.navigateTo({
        url: '../record/record'
      })
    }
  },
  //通行证
  epassTap: function() {
    if (this.checkLoginInfo()) {}
  },
  //社区排查
  troubleTap: function() {
    if (this.checkLoginInfo()) {

    }
  },
  //居家限行
  homeTap: function() {
    if (this.checkLoginInfo()) {

    }
  },
  //问诊
  diagnoseTap: function() {
    if (this.checkLoginInfo()) {

    }
  },
  onLoad: function (options) {
    console.log('options',options)
    if(options.scene){
      let scene = decodeURIComponent(options.scene)
      let array =  scene.split("=")
      if (array&&array[1]){
        console.log(array[1])
        app.globalData.projectId = array[1]
        wx.setStorageSync("projectId", array[1])
      }else{
        let projectId = wx.getStorageSync("projectId")
        app.globalData.projectId = projectId
      }      
    }
    
    // 算出比例
    let ratio = 750 / app.globalData.clientWidth;
    // 算出高度(单位rpx)
    let height = app.globalData.clientHeight * ratio;
    let navigationBarHeight = app.globalData.navHeight * ratio
    this.setData({
      windowHeight: height - navigationBarHeight
    })

    let phone = wx.getStorageSync("phone")
    if (phone) {
      let data = {
        FUserName: phone,
        FAction: "APP",
        FVersion: "1.0.0"
      }
      this.loginByPhone(data)
    }

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
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
  checkLoginInfo: function() {
    let phone = wx.getStorageSync("phone")
    app.globalData.userPhone = phone
    console.log('userPhone', app.globalData.userPhone)
    if (phone || app.globalData.userInfo) {
      return true
    } else {
      // wx.switchTab({
      //   url: '../mine/mine',
      // })
      this.showSettingToast('请先到个人中心进行登录')
      return false
    }
  },
  loginByPhone(data) {
    console.log('login-data', data)
    let that = this
    wx.request({
      url: util.BaseUrl + 'checkloginPhone',
      data: data,
      method: "POST",
      success(res) {
        console.log('suc', res)
        if (res && res.data && res.data.Result == 200) {
          let userInfo = res.data.FObject
          app.globalData.userInfo = userInfo
          if (userInfo && userInfo.FCard) {
            that.setData({
              isRegist:true
            })
          }
        }
      },
      fail(err) {
        console.log('suc', err)
      }
    })
  },
  showSettingToast: function (e) {
    wx.showModal({
      title: '温馨提示',
      confirmText: '去登录',
      showCancel: false,
      content: e,
      success: function (res) {
        if (res.confirm) {
          wx.switchTab({
            url: '../mine/mine',
          })
        }
      }
    })
  },
})