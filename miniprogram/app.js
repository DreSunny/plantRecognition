//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }

    /**
      * 流程
      * 1、用户点击授权后，获取用户信息和openId,匹配云数据库，
      * 2、如果没有就获取用户信息保存 
      * 3、然后再使用openId去查找用户信息，再将用户信息存入app.js公共变量里 实现登陆
      */
    this.globalData = {
      //用户id
      userId: '',
      //用户信息
      userInfo: null,
      //是否注册个人信息
      registerd: false,
      //登陆状态
      logged: false,
      //授权状态
      auth: {
        'scope.userInfo': false
      },
      mark: 0,
      isGetUser: false,
      msgNum: 0
    }
  },
  /**
    * 获取数据
    * @param pageSize 每条条数
    * @param pageNum 第几页
    * @param dbName  数据库名称（集合名称）
    * @param where 查询条件
    */
  getData: function (pageSize, pageNum, dbName, where, func) {
    var that = this
    //调用云函数读取数据库数据 自定义分页函数
    wx.cloud.callFunction({
      name: 'getData',
      data: {
        dbName: dbName,
        pageIndex: pageNum,
        pageSize: pageSize,
        filter: where,
        // orderfiled: 'createTime'
      },
      success: res => {
        //判断云函数是否返回成功
        if (res.errMsg == "cloud.callFunction:ok") {
          // console.log(res.result.data)
          func(res.result);
        }
      }
    })
  },
  /**
    * 新增数据
    */
  addData: function (dbName, data, funcs) {
    var that = this
    //调用云函数
    wx.cloud.callFunction({
      name: 'doData',
      data: {
        dbName: dbName,
        options: 'add',
        data: data
      },
      success: res => {
        if (res.errMsg == "cloud.callFunction:ok") {
          // console.log(data);
          funcs(res);
        }
      }
    })
  },
})
