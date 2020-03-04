// pages/regist/regist.js
const app = getApp()
const util = require('../../utils/util.js')
// 引入SDK核心类
var QQMapWX = require('../../sdk/qqmap-wx-jssdk.min.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    multiArray: [],
    multiIndex: [0, 0, 0],
    selectAddress: "请选择",
    images: [],
    sex: 0,
    userType: "常住居民",
    phone: "",
    imgAddress: [],
    cWidth: 0,
    cHeight: 0,
    description:"身体健康",
    tem:"37.3℃以下",
    isRead:false,
    detailInfo:"",
    unit:"",
    identy:"",
    name:"",
    city:"",
    area:"",
    avatarUrl:"",
    nickName:"",
    userInfo:null
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let phone = wx.getStorageSync("phone")
    this.setData({
      phone:phone
    })
    if (phone) {
      let data = {
        FUserName: phone,
        FAction: "APP",
        FVersion: "1.0.0"
      }
      this.loginByPhone(data)
    }
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'Q3OBZ-SZXCP-M4ED7-VU7QZ-WKUZF-PXF2G'
    });
    this.getAllCitys()
  },
  bindName:function(e){
    this.setData({
      name: e.detail.value
    })
  },
  inputUnit:function(e){
    this.setData({
      unit: e.detail.value
    })
  },
  inputId:function(e){
    this.setData({
      identy: e.detail.value
    })
  },
  inputDetail:function(e){
      this.setData({
        detailInfo: e.detail.value
      })
  },
  readTxt:function(){
    this.setData({
      isRead:!this.data.isRead
    })
  },
  getPhoto: function() {
    let that = this
    console.log('photo', this.data.phone)
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['camera'],
      success: function(photo) {
        // wx.getImageInfo({
        //   src: photo.tempFilePaths[0],
        //   success: function(res) {
        //     //---------利用canvas压缩图片--------------
        //     var ratio = 2;
        //     var canvasWidth = res.width //图片原始长宽
        //     var canvasHeight = res.height
        //     while (canvasWidth > 400 || canvasHeight > 400) { // 保证宽高在400以内
        //       canvasWidth = Math.trunc(res.width / ratio)
        //       canvasHeight = Math.trunc(res.height / ratio)
        //       ratio++;
        //     }
        //     that.setData({
        //       cWidth: canvasWidth,
        //       cHeight: canvasHeight
        //     })
        //     //----------绘制图形并取出图片路径--------------
        //     var ctx = wx.createCanvasContext('canvas')
        //     ctx.drawImage(res.path, 0, 0, canvasWidth, canvasHeight)
        //     ctx.draw(false, setTimeout(function() {
        //       wx.canvasToTempFilePath({
        //         canvasId: 'canvas',
        //         destWidth: canvasWidth,
        //         destHeight: canvasHeight,
        //         success: function(res) {
        //           console.log(res.tempFilePath) //最终图片路径
        //           let allImages = that.data.images
        //           allImages = allImages.concat(res.tempFilePaths)
        //           that.uploadFile(res.tempFilePaths[0])
        //           that.setData({
        //             images: allImages
        //           })
        //         },
        //         fail: function(res) {
        //           console.log(res.errMsg)
        //         }
        //       })
        //     }, 100)) //留一定的时间绘制canvas
        //   },
        //   fail: function(res) {
        //     console.log(res.errMsg)
        //   }
        // })
        let allImages = that.data.images
        allImages = allImages.concat(photo.tempFilePaths)
        wx.showLoading({
          title: '上传中',
        })
        that.uploadFile(photo.tempFilePaths[0])
        that.setData({
          images: allImages
        })
      },
    })
  },
  getAllCitys: function() {
    let that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://www.szqianren.com/H5/citys.json',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideLoading()
        console.log('citys', res.data)
        if (res.data) {
          //获取云数据库数据
          var temp = res.data.data;
          //初始化更新数据
          that.setData({
            provinces: temp,
            multiArray: [temp, temp[0].citys, temp[0].citys[0].areas],
            multiIndex: [0, 0, 0]
          })
          console.log(that.data.provinces)
        }
      },
      fail() {
        wx.hideLoading()
      }
    })
  },
  checkInfo:function(){
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (!this.data.name){
      wx.showToast({
        title: '请输入您的姓名',
        icon:'none'
      })
      return false
    } else if (!this.data.identy){
      wx.showToast({
        title: '请输入您的身份证号',
        icon: 'none'
      })
      return false
    } else if (reg.test(this.data.identy) === false){
      wx.showToast({
        title: '您输入的身份证号不合法',
        icon: 'none'
      })
      return false
    } else if (!this.data.selectAddress){
      wx.showToast({
        title: '请选择居住区域',
        icon: 'none'
      })
      return false
    } else if (!this.data.detailInfo){
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none'
      })
      return false
    } else if (!this.data.unit) {
      wx.showToast({
        title: '请输入单位或者学校名称',
        icon: 'none'
      })
      return false
    } else if (!this.data.isRead) {
      wx.showToast({
        title: '请勾选填写内容是否正确属实',
        icon: 'none'
      })
      return false
    }else{
      return true
    }
  },
  submitInfo: function() {
    if(!this.checkInfo())return
    let userInfo  = app.globalData.userInfo
    let that = this
    let data = {
      FTokenID: userInfo.FTokenID,
      FAction: "AddOrUpdateUser",
      FVersion: "1.0.0",
      TUsers: {
        FGUID: userInfo.FUserGUID,
        FUserName: this.data.phone,
        FUserNickname: this.data.name,
        FContacts: this.data.name,
        FTelephone: this.data.phone,
        FIMGPath: this.data.avatarUrl,
        FAddressDetail:this.data.detailInfo,
        ProjectIDs: app.globalData.projectId,
        FGender: this.data.sex,
        FCard: this.data.identy,
        FLiveType: this.data.userType,
        FCity: this.data.city,
        FArea: this.data.area,
        FTemperature:this.data.tem,
        FDescribe:this.data.unit
      }
    }
    console.log('submit',JSON.stringify(data))
    wx.request({
      url: util.BaseUrl +'Users/AddOrUpdateUser',
      data: data,
      method:"POST",
      success(res){
        console.log('success',res)
        if(res&&res.data&&res.data.Result===200){
          let userInfo = app.globalData.userInfo
          userInfo.FCard = that.data.identy
          app.globalData.userInfo = userInfo
          wx.showToast({
            title: '提交成功',
            icon:'success'
          })
          wx.redirectTo({
            url: '../registed/registed',
          })
        }else{
          wx.showToast({
            title: '提交失败',
            icon: 'none'
          })
        }
      },fail(fail){
        wx.showToast({
          title: '提交失败',
          icon: 'none'
        })
      }
    })
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
    this.getUserLocation()
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
  // 判断用户是否拒绝地理位置信息授权，拒绝的话重新请求授权
  getUserLocation: function() {
    let that = this;
    wx.getSetting({
      success: (res) => {
        console.log(JSON.stringify(res))
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function(res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function(dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      that.getLocation();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //调用wx.getLocation的API
          that.getLocation();
        } else {
          //调用wx.getLocation的API
          that.getLocation();
        }
      }
    })
  },
  // 获取定位当前位置的经纬度
  getLocation: function() {
    let that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        let latitude = res.latitude
        let longitude = res.longitude
        app.globalData.lat = res.latitude; //
        app.globalData.lng = res.longitude; //把onload定位时候的经纬度存到全局
        let speed = res.speed
        let accuracy = res.accuracy;
        that.getLocal(latitude, longitude)
      },
      fail: function(res) {
        console.log('fail' + JSON.stringify(res))
      }
    })
  },
  // 获取当前地理位置
  getLocal: function(latitude, longitude) {
    let that = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function(res) {
        console.log('location', res)
        let province = res.result.ad_info.province
        let city = res.result.ad_info.city
        let district = res.result.ad_info.district;
        // 保存一下当前定位的位置留着后面重新定位的时候搜索附近地址用

        let detailAddress = province + city + district
        that.setData({
          selectAddress: detailAddress,
          city:city,
          area:district
        })

      },
      fail: function(res) {
        console.log(res);
      },
      complete: function(res) {
        // console.log(res);
      }
    });
  },
  //点击确定
  bindMultiPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let selectIndex = e.detail.value
    let provinceName = this.data.multiArray[0][selectIndex[0]].name
    let cityName = this.data.multiArray[1].length > 0 ? (this.data.multiArray[1][selectIndex[1]].name) : ""
    let areaName = this.data.multiArray[2].length > 0 ? (this.data.multiArray[2][selectIndex[2]].name) : ""
    let detailAddress = provinceName + cityName + areaName
    this.setData({
      multiIndex: e.detail.value,
      selectAddress: detailAddress
    })
  },
  //滑动
  bindMultiPickerColumnChange: function(e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    //更新滑动的第几列e.detail.column的数组下标值e.detail.value
    data.multiIndex[e.detail.column] = e.detail.value;
    //如果更新的是第一列“省”，第二列“市”和第三列“区”的数组下标置为0
    if (e.detail.column == 0) {
      data.multiIndex = [e.detail.value, 0, 0];
    } else if (e.detail.column == 1) {
      //如果更新的是第二列“市”，第一列“省”的下标不变，第三列“区”的数组下标置为0
      data.multiIndex = [data.multiIndex[0], e.detail.value, 0];
    } else if (e.detail.column == 2) {
      //如果更新的是第三列“区”，第一列“省”和第二列“市”的值均不变。
      data.multiIndex = [data.multiIndex[0], data.multiIndex[1], e.detail.value];
    }
    var temp = this.data.provinces;
    data.multiArray[0] = temp;
    if ((temp[data.multiIndex[0]].citys).length > 0) {
      //如果第二列“市”的个数大于0,通过multiIndex变更multiArray[1]的值
      data.multiArray[1] = temp[data.multiIndex[0]].citys;
      var areaArr = (temp[data.multiIndex[0]].citys[data.multiIndex[1]]).areas;
      //如果第三列“区”的个数大于0,通过multiIndex变更multiArray[2]的值；否则赋值为空数组
      data.multiArray[2] = areaArr.length > 0 ? areaArr : [];
    } else {
      //如果第二列“市”的个数不大于0，那么第二列“市”和第三列“区”都赋值为空数组
      data.multiArray[1] = [];
      data.multiArray[2] = [];
    }
    //data.multiArray = [temp, temp[data.multiIndex[0]].citys, temp[data.multiIndex[0]].citys[data.multiIndex[1]].areas];
    //setData更新数据
    this.setData(data);
  },
  uploadFile: function(filePath) {
    let that = this
    let file = {
      uri: filePath,
      type: "multipart/form-data",
      name: "image.jpg"
    }
    wx.uploadFile({
      url: util.BaseUrl+'UploadFile',
      filePath: filePath,
      name: "file",
      formData: {
        "FTokenID": "c7e7a412-a5c5-41d4-9386-42ca57509145",
        "ProjectID": 1,
        "FVersion": "1.0.0",
        "FName": "image.jpg",
        "FAction": "UploadFile",
      },
      header: {
        'Content-Type': 'multipart/form-data',
      },
      success(res) {
        console.log('success', res)
        wx.hideLoading()
        if (res && res.data) {
          let resData = JSON.parse(res.data)
          if (resData.Result === 200) {
            wx.showToast({
              title: '上传成功',
              icon: 'success'
            })
            let imgAddress = that.data.imgAddress

            let url = resData.FObject
            console.log('url',url)
            imgAddress.push(url)
            that.setData({
              imgAddress: imgAddress,
              avatarUrl: url
            })
          } else {
            let images = that.data.images
            images.pop()
            that.setData({
              images: images
            })
            wx.showToast({
              title: '上传失败',
              icon: 'none'
            })

          }

        } else {
          let images = that.data.images
          images.pop()
          that.setData({
            images: images
          })
          wx.showToast({
            title: '上传失败',
            icon: 'none'
          })
        }
      },
      fail(err) {
        let images = that.data.images
        wx.hideLoading()
        images.pop()
        that.setData({
          images: images
        })
        console.log('fail')
        wx.showToast({
          title: '上传失败',
          icon: 'none'
        })
      }
    })
  },
  delPhoto: function(e) {
    console.log('index', e)
    let index = e.currentTarget.dataset['index'];
    let allImages = this.data.images
    allImages.splice(index, 1)
    this.setData({
      images: allImages
    })
  },
  sexCheckboxChange(e) {
    console.log(e)
    this.setData({
      sex: e.detail.value
    })
  },
  homeCheckboxChange(e) {
    this.setData({
      userType: e.detail.value==0?'常住居民':'外来人员'
    })
  },
  inputPhone(e) {
    // console.log('phone', e)
    this.setData({
      phone: e.detail.value
    })
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
          let images = that.data.images
          images.push(util.BaseUrl+ userInfo.FIMGPath)
          that.setData({
            userInfo: userInfo,
            phone: userInfo.FUserName,
            name:userInfo.FContacts,
            avatarUrl: userInfo.FIMGPath,
            detailInfo: userInfo.FAddressDetail,
            projectId: userInfo.ProjectIDs,
            sex: userInfo.FGender,
            identy: userInfo.FCard,
            userType: userInfo.FLiveType,
            city: userInfo.FCity ,
            area: userInfo.FArea,
            tem: userInfo.FTemperature,
            unit: userInfo.FDescribe,
            images: images
          })
        }
      },
      fail(err) {
        console.log('suc', err)
      }
    })
  },

})