/*
要求：能根据接口文档定义接口请求
包括应用中所有接口请求函数的模块
每个函数的返回值都是promise
*/
import ajax from './ajax'
import jsonp from 'jsonp';
import { message } from 'antd';
const BASE = ""


export const reqLogin = (username,password) => ajax(BASE+'/login',{username,password},'POST')

//天气
export const reqWeather = (city)  => {

    new Promise(function(resolve, reject) {
        // 异步处理
        // 处理结束后、调用resolve 或 reject
        const url = `https://www.tianqiapi.com/api?version=v1&appid=21375891&appsecret=fTYv7v5E&city=${city}`   
        //发送jsonp请求
        jsonp(url,{},(err,data)=>{
            console.log("jsonp",err,data);
            //如果成功
            if(!err){
                //传数据
                 resolve(data.data[0].wea)      
                }else{//失败了
                    message.error("获取天气失败")
                }
        })
    })
}
//添加分类
export const reqAddCategory = ({parentId,categoryName}) => ajax(BASE + "/manage/category/add",{parentId,categoryName},"POST")
//获取一级/二级分类的列表
export const reqCategorys = (parentId) => ajax(BASE + "/manage/category/list",{parentId})
//更新分类
export const reqUpdateCategory = ({categoryId,categoryName}) => ajax(BASE+ "/manage/category/update",{categoryId,categoryName},"POST")

//获取商品分页列表
export const reqProduct = (pageNum,pageSize) => ajax(BASE+"/manage/product/list",{pageNum,pageSize})

//通过商品名称或商品描述获取商品     searchType值为productName或productDesc
export const reqSearchProducts = ({pageNum,pageSize,searchName,searchType})=> ajax(BASE + "/manage/product/search",
{pageNum,pageSize,[searchType]:searchName})  //变量要当属性用 要加[]括号

//根据分类ID获取分类
export const reqCategory = (categoryId) => ajax(BASE + "/manage/category/info",{categoryId})

//对商品进行上架/下架处理
export const reqProductUpdateStatus = (productId,status) => ajax(BASE + "/manage/product/updateStatus",{productId,status},"POST")

//删除图片
export const reqDeleteP = (name) => ajax(BASE+"/manage/img/delete",{name},"POST")

//添加或更新商品
export const reqAddOrUpdateProduct = (product) =>ajax(BASE+"/manage/product/"+(product._id?"update":"add"),product,"POST")

//获取角色列表
export const reqRoles = ()=> ajax(BASE+"/manage/role/list")

//更新角色(给角色设置权限)
export const reqUpdateRole = (role) =>ajax(BASE+"/manage/role/update",role,"POST")

//获取所有用户列表
export const reqGetUsers = ()=> ajax(BASE+"/manage/user/list")

//删除用户
export const reqDeleteUser = (userId)=> ajax(BASE+"/manage/user/delete",{userId},"POST")

//添加用户
export const reqAddUser = (user) => ajax(BASE+"/manage/user/add",user,"POST")

//更新用户
export const reqUpdateUser = (user) => ajax(BASE+"/manage/user/update",user,"POST")