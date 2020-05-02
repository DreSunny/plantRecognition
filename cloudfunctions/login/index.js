// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

//初始化云数据库
const db = cloud.database()
const userTable = db.collection('user')
const _ = db.command

/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * 
 * event 参数包含小程序端调用传入的 data
 * 
 */
//云函数入口函数
exports.main = async (event, context) => {
  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）等信息
  const wxContext = cloud.getWXContext()
  console.log(event)
  console.log(context)
  //更新当前信息
  if (event.update == true) {
    try {
      return await userTable.doc(wxContext.OPENID).update({
        data: {
          //保存用户注册的个人信息
          userData: _.set(event.userData)
        },
      })
    } catch (e) {
      //打印报错日志
      console.error(e)
    }
  }
  else if (event.getSelf == true) {
    //获取当前用户信息
    try {
      return await userTable.doc(wxContext.OPENID).field({
        openid: false
      }).get()
    } catch (e) {
      console.error(e)
    }
  }
  else if (event.setSelf == true) {
    //添加当前用户信息 注册
    try {
      return await userTable.add({
        data: {
          _id: wxContext.OPENID,
          //保存用户 微信的相关个人信息
          wechatUserData: {
            //openId
            openid: wxContext.OPENID,
            //是否管理员
            admin: event.userData.admin,
            //头像地址
            avatarUrl: event.userData.avatarUrl,
            //注册时间
            createTime: event.userData.createTime,
            //性别
            gender: event.userData.gender,
            //微信昵称
            nickName: event.userData.nickName
          }
        }
      })
    } catch (e) {
      console.error(e)
    }
  }



}

