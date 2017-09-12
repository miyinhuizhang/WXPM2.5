//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    index1: 0,
    array: ['北京', '上海', '广州', '深圳', '杭州', '天津', '成都', '南京', '西安', '武汉'],
    objectArray: [
      {
        id: 0,
        name: '北京'
      },
      {
        id: 1,
        name: '上海'
      },
      {
        id: 2,
        name: '广州'
      },
      {
        id: 3,
        name: '深圳'
      },
      {
        id: 4,
        name: '杭州'
      }
      ,
      {
        id: 5,
        name: '天津'
      }
      ,
      {
        id: 6,
        name: '成都'
      }
      ,
      {
        id: 7,
        name: '南京'
      }
      ,
      {
        id: 8,
        name: '西安'
      }
      ,
      {
        id: 9,
        name: '武汉'
      }
    ],
    
    motto: 'Hello World',
    weatherList: [
      {
        date: '',
        type: '',
        high: ''
      }
    ],
    index:0,
    weatherType: '--',
    wenDu: '--',
    city: '--'
  },
  //下拉框的改变值
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index1: e.detail.value,
    })
    this.onLoad();
    console.log(this.data.index1);
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onShareAppMessage: function () {

    return {

      title: 'pm2.5',

      desc: '分享我身边的pm2.5',

      path: '/page/user?id=123'

    }

  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
    console.log(that.data.index1);
    var index=this.data.index1;
    var city;
    if (index==0)
      city ='北京'
    if (index == 1)
      city = '上海'
    if (index == 2)
      city = '广州'
    if (index == 3)
      city = '深圳'
    if (index == 4)
      city = '杭州'
    if (index == 5)
      city = '天津'
    if (index == 6)
      city = '成都'
    if (index == 7)
      city = '南京'
    if (index == 8)
      city = '西安'
    if (index == 9)
      city = '武汉'
    //根据城市名称请求天气
    wx.request({
      url: 'https://route.showapi.com/104-29?showapi_appid=40135&showapi_sign=e18723aba3dd41ed8812d7b6122aaa45&city='+city,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        //请求天气成功
        var city1 = res.data.showapi_res_body.pm.area;
        var wendu = res.data.showapi_res_body.pm.pm2_5;
        var weatherType = res.data.showapi_res_body.pm.quality;
        var forecastList = res.data.showapi_res_body.siteList;
        setWeather(wendu, weatherType);
        console.log(res.data);

        that.setData({
          'weatherList': forecastList
        })

        console.log(forecastList)
        },
        fail: function (res) {
          // fail
        },
        complete: function (res) {
        // complete
        },
      fail: function (res) {
        console.log('get location failed')
      },
      complete: function (res) {
        console.log('get location complete')
      }
      })
      var setWeather = function (wendu, weatherType,city) {
        that.setData({
          wenDu: wendu,
       })
        that.setData({
          weatherType: weatherType,
        })
        that.setData({
          city: city,
        })
    }
  }
})
