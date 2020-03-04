//app.js
App({
  onLaunch: function () {

    wx.getSystemInfo({
      success: res => {
        //导航高度
        this.globalData.navHeight = res.statusBarHeight + 46;
        this.globalData.clientHeight = res.windowHeight;
        this.globalData.clientWidth = res.windowWidth;
      }, fail(err) {
        console.log(err);
      }
    })
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log('login',res)
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log('user',res)
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }else{
          console.log('user', "null")
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    userPhone:"",
    iv:"",
    encryptedData:""
  }
  //  {
  //       "pagePath": "pages/logs/logs",
  //       "text": "管理",
  //       "iconPath": "images/manager.png",
  //       "selectedIconPath": "images/manager_selected.png",
  //       "selectedColor": "#31BA8B"
  //     },
})