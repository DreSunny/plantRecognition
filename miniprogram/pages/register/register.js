// pages/register/register.js
var util = require("../../utils/util.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gender: ['男', '女'],
    gIndex: 0,
    tIndex:0,
    listData: '',
    username: '',
    tel: '',
    address: '',
    title: '',
    buttonname: '注册',
    userInfo:'',
    manageStatus:true
  },
  /*
   * 获取用户信息方法
   */
  //获取用户信息方法
  getUser(func) {
    //从云数据库获取云端用户信息 判断用户是否注册过个人信息（姓名，身份证号等）
    var _this = this
    wx.cloud.callFunction({
      //云函数名称
      name: 'login',
      //请求数据
      data: {
        getSelf: true
      },
      success: res => {
        //判断云函数是否请求成功
        var data = res.result.data
        if (res.errMsg == "cloud.callFunction:ok" && data) {
          func(data);
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    
    var userInfo=app.globalData.userInfo
    this.setData({
      userInfo:userInfo
    })
    //判断是否有传入指定页面标题
    var title = e.title
    if (title) {
      //有的话设置页面标题
      wx.setNavigationBarTitle({
        title: title,
      })
      //把数据写入页面参数
      this.setData({
        title: title,
        buttonname: '修改'
      })
    }

    //判断用户是否登陆
    if(!userInfo){
      wx.showToast({
        icon:"none",
        title: '请先登陆'
      })
      setTimeout(() => {
        wx.navigateBack({
          delta: 1
        })
      }, 1500)
    }else{
        //从云数据库获取云端用户信息 判断用户是否注册过个人信息（姓名，身份证号等）
        var _this = this
        // _this.getUser(function (data) {
        //获取用户信息
        var userInfo = app.globalData.userInfo
        //获取传入用户id
        var id = e.id;
        if(id){
          _this.getUser(id,res=>{
            _this.setData({
              manageStatus:false,
              userInfo:res
            })
            _this.intoPage(res)
          })
        }else{
          _this.intoPage(userInfo)  
        }

      // })
    }  
  },
  //向页面写数据
  intoPage(data){
    //如果成功获取到
    //如果个人信息不为空
    if (data.userData) {
      //如果不为空 显示到页面
      this.setData({
        username: data.userData.username,
        tel: data.userData.tel,
        // gender: ['' + data.userData.gender + '']
      })
    }
  },
  // 选择性别
  pickGender: function (e) {
    this.setData({
      gIndex: e.detail.value
    })
  },
  // 买家卖家
  pickType: function (e) {
    this.setData({
      tIndex: e.detail.value
    })
  },
  //注册
  formSubmit: function (e) {
    //获取表单提交的相关信息
    var username = e.detail.value.username;
    var tel = e.detail.value.tel;

    //判断姓名非空
    if (username.length < 1) {
      util.alertViewWithCancel("提示", "请输入您的真实姓名", function () { }, "true");
      return;
    }
    //判断手机号非空
    if (tel.length < 1 && qq.length < 1 && email.length < 1) {
      util.alertViewWithCancel("提示", "需要您至少留一个联系方式", function () { }, "true");
      return;
    }


    //注册中
    wx.showLoading({
      title: '提交中...',
    })

    //判断当前页面提交的操作是哪种类型
    //如果页面是个人中心 提交就修改当前数据 
    //如果是注册就进行注册操作
    if (this.data.title) {
      this.register({
        data: e.detail.value
      })
    } else {
      this.registerPage(e);
    }

  },
  /**
   * 如果当前页面为注册使用 就进行注册操作
   */
  registerPage: function (e) {
    var _this = this
    //调用方法获取个人信息
    var data = app.globalData.userInfo;
    //判断用户 个人信息是否为空
    if (data.userData) {
      //隐藏弹窗
      wx.hideLoading()

      wx.showToast({
        title: '成功',
        icon: 'success',
        duration: 2000
      })

      //跳转页面
      wx.switchTab({
        url: '/pages/index/index',
      })

    } else {
      //未成功获取到用户信息
      //调用注册方法
      _this.register({
        data: e.detail.value
      })
    }
  },
  /**
   * 调用云函数添加用户个人信息
   */
  register: function (e) {
    let _this = this
    //调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {
        update: true,
        userData: e.data
      },
      success: res => {
        //判断是否请求成功 是否有数据返回
        if (res.errMsg == "cloud.callFunction:ok" && res.result) {
          _this.getUser(function (data) {
            //新获取的用户信息方入全局变量
            app.globalData.userInfo = data
            app.globalData.userId = data._id
            _this.data.registered = true
          })
          //隐藏弹窗
          wx.hideLoading()
          wx.switchTab({
            url: '/pages/index/index'
          })
        } else {
          console.log("注册失败", res)
        }
      }
    })
  },
})