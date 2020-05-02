// pages/info/detail/detail.js
var app=getApp();
Page({
  data: {
    ViewHeight: wx.getSystemInfoSync().screenHeight
  },
  getResult: function (id,func) {
    var apiKey ='CtKRhUKeef3db4f1fda1eb4125fa2ec16a503b915c9a827'
    wx.request({
      url: 'https://api.apishop.net/common/plantFamily/queryPlantInfo?apiKey='+apiKey+'&plantID='+id, //仅为示例，并非真实的接口地址
      method: "get",
      success(res) {
        console.log(res.data);
        func(res.data.result)
      }
    });
  },
  onLoad: function (options) {
    var that= this, idInformationInfo
    //获取植物id
    var id=options.id;

      //调用接口请求植物详情
      that.getResult(id, data => {
          that.setData({
            res: data,
            imgurl: options.img
          })
      })
    
  },

  //顶部标题被双击返回顶部
  doubleClick(e) {
    doubleClick++
    if (doubleClick == 2) {
      doubleClick = 0
      this.setData({ scrollTop: 0 })
    } else {
      setTimeout(() => {
        doubleClick = 0
      }, 450);
    }
  },
})