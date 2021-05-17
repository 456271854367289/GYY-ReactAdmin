// 能发送异步ajax请求的函数模块
// 封装ajax库
// 函数的返回值是promise对象
//  1 优化1： 统一处理请求异常？
//             在外层包一个自己创建的Promise对象
//             在请求出错时不调用reject
// 2  优化2： 异步得到不是response 而是response.data
//             在请求成功时：resolve（response.data）

import axios from 'axios';
import {message} from 'antd';

export default function ajax(url,data={},type='GET'){

    return new Promise((resolve,reject)=>{
        let promise
        //执行异步ajax请求
        if(type==='GET')
        //发送get请求
        {
            promise = axios.get(url,{  //配置对象
            params: data     //指定请求参数
        })
     } else
        //发送post请求
        {
           
            promise = axios.post(url,data)
        
        }
        //如果成功了
        promise.then(response =>{
            resolve(response.data)
        }).catch(error=>{
            message.error(error.message)
        })
    })



}