// pages/info/info.js
var pageNum=1,pageSize=600;
var that = '';
var name;
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  toDetail(e){
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
      var data = e.currentTarget.dataset.item
      //用户查看详情后将数据写入云数据库
      var hisdata = {
        openid: userInfo._id,
        data: data
      }
      app.addData('history', hisdata, res => {
        wx.navigateTo({
          url: './detail/detail?id=' + data.plantID + '&img=' + data.coverURL
        })
      })
    }
  },
  search() {
    this.getDataByName(name);
  },
  /**
   * 用于当更新input组件中的值时同时更新对应变量的值
   */
  bindKeyInputContent: function (e) {
    name = e.detail.value
  },
  getResult: function () {
    var apiKey ='CtKRhUKeef3db4f1fda1eb4125fa2ec16a503b915c9a827'
    wx.request({
      url: 'https://api.apishop.net/common/plantFamily/queryPlantList?apiKey='+apiKey+'&page='+pageNum+'&pageSize='+pageSize, //仅为示例，并非真实的接口地址
      method: "get",
      success(res) {
        console.log(res.data);
        that.setData({
          info_list: res.data.result.plantList
        });
      }
    });
  },

  getDataByName: function (keyword) {
    var apiKey = 'CtKRhUKeef3db4f1fda1eb4125fa2ec16a503b915c9a827'
    wx.request({
      url: 'https://api.apishop.net/common/plantFamily/queryPlantListByKeyword?apiKey=' + apiKey + '&page=' + pageNum + '&pageSize=' + pageSize+'&keyword='+keyword, 
      method: "get",
      success(res) {
        console.log(res.data);
        that.setData({
          info_list: res.data.result.plantList
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that= this
    that.getResult()
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