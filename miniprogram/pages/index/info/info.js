const app = getApp(),allData = getApp().globalData
var doubleClick = 0
Page({

  data: {
    ViewHeight: wx.getSystemInfoSync().screenHeight
  },

  onLoad: function (options) {
    var t = this, idInformationInfo


    this.setData({
      idInformationInfo: {
        title: options.title, content: options.content
      }, imgurl: options.img
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