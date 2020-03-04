// pages/registed/registed.js
const util = require('../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log('onshow')
    let phone = wx.getStorageSync("phone")
    if (phone) {
      let data = {
        FUserName: phone,
        FAction: "APP",
        FVersion: "1.0.0"
      }
      this.loginByPhone(data)
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

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
          that.setData({
            userInfo: userInfo
          })
        }
      },
      fail(err) {
        console.log('suc', err)
      }
    })
  },
  update(){
    wx.navigateTo({
      url: '../regist/regist',
    })
  }
})