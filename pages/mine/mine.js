// pages/mine/mine.js
const app = getApp()
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('scence',options)
     var scene = decodeURIComponent(options.scene);
    console.log('scence', scene)
    let phone = wx.getStorageSync("phone")
    console.log(app.globalData.userPhone)
    if (phone ){
      this.setData({
        isLogin:true
      })
    }else{
      this.setData({
        isLogin: false
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //获取openid
  getOpenId() {
    let that = this
    wx.showLoading({
      title: '正在登录...',
    })
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log('code', res.code)
        let data = {
          JsCode: res.code
        }

        wx.request({
          url: util.BaseUrl+'Users/Code2Session',
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

          },
          fail(err){
            wx.hideLoading()
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
    console.log('data', JSON.stringify(data))
    wx.request({
      url: util.BaseUrl +'Users/decodeUserInfo',
      method: "POST",
      data: data,
      success(res) {
        console.log('getUnionId', res)
        if (res.data.Result === 200 && res.data.FObject) {
          let phone = res.data.FObject.phoneNumber
          app.globalData.userPhone = phone
          let data = { FUserName: phone, FAction: "APP", FVersion:"1.0.0"}
          that.loginByPhone(data)
          wx.setStorageSync("phone", phone)
         
        } else {
          // that.getUnionId(edata, key, iv)
          wx.showLoading({
            title: '正在登录...',
          })
          wx.showToast({
            title: '登录失败',
            icon:'none'
          })
        }
      },
      fail(err){
        wx.hideLoading()
      }
    })
  },
  getPhoneNumber: function (e) {
    console.log('phone', e)
    var that = this;
    console.log(e.detail.errMsg == "getPhoneNumber:ok");
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      app.globalData.encryptedData = e.detail.encryptedData
      app.globalData.iv = e.detail.iv
      that.getOpenId()
    }
  },
  loginByPhone(data){
    console.log('login-data',data)
    let that = this
    wx.request({
      url: util.BaseUrl +'checkloginPhone',
      data:data,
      method:"POST",
      success(res){
        console.log('suc',res)
        wx.hideLoading()
        if(res&&res.data&&res.data.Result==200){
          wx.showToast({
            title: '登录成功',
            icon: 'success'
          })
          that.setData({
            isLogin:true
          })
          app.globalData.userInfo = res.data.FObject
        }else{
          wx.showToast({
            title: '登录失败',
            icon:'none'
          })
        }
      },
      fail(err){
        console.log('suc', err)
        wx.hideLoading()
        wx.showToast({
          title: '登录失败',
          icon: 'none'
        })
      }
    })
  },
  logout:function(){
    console.log('logout')
    this.setData({
      isLogin: false
    })
    app.globalData.userPhone=""
    app.globalData.userInfo=null
    console.log('finish')
    wx.clearStorageSync()
  },
  gotoAbout(){
    wx.navigateTo({
      url: '../about/about',
    })
  }
})