// pages/history/history.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */

  data: {

  },
  getData(id, func) {
    //从云数据库获取云端用户信息 判断用户是否注册过个人信息（姓名，身份证号等）
    var _this = this
    var filter = {
      openid: id
    }
    app.getData(20, 1, 'history', filter, res => {
      func(res.data)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    var userInfo = app.globalData.userInfo
    if (!userInfo) {
      wx.showModal({
        title: '登陆提示',
        content: '您还没有登陆',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login'
            })
          }
        }
      })
    } else {
      that.getData(userInfo._id,res=>{
        that.setData({
          info_list:res
        })
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

  }
})