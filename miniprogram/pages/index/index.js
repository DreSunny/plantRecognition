var app = getApp();
var that = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: '/images/back.jpeg',
    imgB64: '',
    content: '',
    ishow: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
  },
  /**
   * 选择图片
   */
  chooseimgTap: function () {
    that.setData({
      ishow: false,
      content: ''
    });
    wx.showActionSheet({
      itemList: ['拍照', '从相册中选择'],
      success(res) {
        console.log(res.tapIndex)
        if (res.tapIndex == 0) { //0是拍照
          wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['camera'],
            success: function (res) {
              const tempFilePaths = res.tempFilePaths[0];
              that.getB64ByUrl(tempFilePaths);
              that.setData({
                img: tempFilePaths
              });
            },
          })
        } else if (res.tapIndex == 1) {
          wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album'],
            success: function (res) {
              const tempFilePaths = res.tempFilePaths[0];
              that.getB64ByUrl(tempFilePaths);

              that.setData({
                img: tempFilePaths
              });
            },
          })
        }
      }
    })

    // wx.chooseImage({
    //   count: 1,
    //   sizeType: ['original', 'compressed'],
    //   sourceType: ['album', 'camera'], //可以指定来源是相册还是相机，默认二者都有
    //   success(res) {
    //     const tempFilePaths = res.tempFilePaths[0];
    //     that.getB64ByUrl(tempFilePaths);

    //     that.setData({
    //       img: tempFilePaths
    //     });

    //   }
    // })
  },
  /**
   * 转b64
   */
  getB64ByUrl: function (url) {
    const FileSystemManager = wx.getFileSystemManager();
    FileSystemManager.readFile({
      filePath: url,
      encoding: 'base64',
      success(res) {
        // console.log(res.data);
        that.setData({
          imgB64: res.data
        });
      }
    })
  },

  /**
   * 植物识别
   */
  plantTap: function (e) {
    const imgB64 = that.data.imgB64;
    if (!imgB64) {
      that.setData({
        ishow: true
      });
      return;
    };

    that.getToken(function (token) {
      that.getResult(token);
    });
  },
  getToken: function (callback) {
    var apiKey ='S9RDmxScy6dGSu86OaGLkv7Q'
    var secretKey ='Tzf4B6mSKFKHTiiS1LL4EgLT2gN8ccCN'
    wx.request({
      url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=' + apiKey + '&client_secret=' + secretKey,
      data: {},
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        var token = res.data.access_token;
        console.log(token);

        return callback(token);
      }
    });
  },
  getResult: function (token) {
    wx.request({
      url: 'https://aip.baidubce.com/rest/2.0/image-classify/v1/plant?access_token=' + token, //仅为示例，并非真实的接口地址
      method: "post",
      data: {
        image: that.data.imgB64,
        baike_num:3
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        console.log(res.data);
        var data=res.data.result
        if(data[0].name==='非植物'){
          wx.showModal({
            title: '提示',
            content: '您提交的图片不是植物哟，请换张图片吧'
          });
        }else{
          that.setData({
            info_list: data
          });
        }
      }
    });
  }

})