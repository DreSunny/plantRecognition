// pages/login/login.js
var util = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //隐藏授权按钮
    hiddenButton: true
  },
  /**
   * 公共方法 获取用户信息 调取云函数查询用户
   * @param func 回调方法
   */
  getUser(func) {
    //从云端获取用户资料
    wx.cloud.callFunction({
      name: 'login',
      data: {
        getSelf: true
      },
      success: res => {
        if (res.errMsg == "cloud.callFunction:ok") {
          //如果成功获取到
          //将获取到的用户资料写入app.js全局变量
          //data.user注册
          wx.hideLoading()
          if (res.result) {
            //将获取到的用户资料写入app.js全局变量
            app.globalData.userInfo = res.result.data
            app.globalData.userId = res.result.data._id
            app.globalData.logged = true
            //回调方法返回数据 result
          }
          func(res.result)
        } else {
          this.setData({
            hiddenButton: false
          })
          console.log("未注册")
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   * 登陆页逻辑 ： 进入页面后先判断用户授权 如果默认以及授权了就查询用户注册数据 没有的话就进注册页面
   * 有的话就进入主页 如果没有授权 就会显示授权按钮来进行下一步
   */
  onLoad: function () {
    let _this = this
    //需要用户同意授权获取自身相关信息
    wx.getSetting({
      success: function (res) {
        //判断是否获取了用户授权
        if (res.authSetting['scope.userInfo']) {
          //将授权结果写入app.js全局变量
          app.globalData.auth['scope.userInfo'] = true
          //登陆中
          wx.showLoading({
            title: '登录中...',
          })
          //调用获取用户数据方法
          _this.getUser(function (result) {
            wx.hideLoading()
            //判断是否获取到注册数据
            if (result.data.userData) {
              //跳转主页面
              wx.switchTab({
                url: '/pages/index/index',
              })
            } else {
              //没有的话就跳转注册页面
              wx.navigateTo({
                url: '/pages/register/register',
              })
            }
          })
        } else {
          _this.setData({
            hiddenButton: false
          })
        }
      }
    })
  },
  /**
   * 授权登陆方法 绑定授权按钮
   * 从云端获取资料
   * 如果没有获取到则尝试新建用户资料
   */
  onGotUserInfo: function (e) {
    var _this = this
    //需要用户同意授权获取自身相关信息
    if (e.detail.errMsg == "getUserInfo:ok") {
      //将授权结果写入app.js全局变量
      app.globalData.auth['scope.userInfo'] = true
      //登陆中
      wx.showLoading({
        title: '登录中...',
      })
      //尝试获取云端用户信息
      _this.getUser(function (result) {
        wx.hideLoading()
        //判断是否存在数据
        if (result) {
          //判断是否存在用户注册信息
          if (result.data.userData) {
            //跳转主页面
            wx.switchTab({
              url: '/pages/index/index',
            })
          } else {
            //没有的话就跳转注册页面
            wx.navigateTo({
              url: '/pages/settings/register/register',
            })
          }
        } else {
          //不存在的话先保存用户基础数据
          var date = util.formatTime(new Date());
          _this.register({
            nickName: e.detail.userInfo.nickName,
            gender: e.detail.userInfo.gender,
            avatarUrl: e.detail.userInfo.avatarUrl,
            createTime: date,
            admin: false
          })
        }
      })

    } else {
      console.log("未授权")
    }
  },
  /**
    * 注册用户微信相关信息
    */
  register: function (e) {
    let _this = this
    //调用函数
    wx.cloud.callFunction({
      name: 'login',
      data: {
        setSelf: true,
        userData: e
      },
      //成功后的返回结果
      success: res => {
        //判断请求是否成功 是否获取到数据
        if (res.errMsg == "cloud.callFunction:ok" && res.result) {
          //请求成功隐藏授权按钮避免重复点击
          _this.setData({
            hiddenButton: true
          })
          //将用户微信信息写入全局变量
          app.globalData.userInfo = e
          app.globalData.userId = res.result._id
          wx.hideLoading()
          //跳转页面
          wx.navigateTo({
            url: '/pages/register/register'
          })
        } else {
          console.log("注册失败", res)
        }
      }
    })
  },
})