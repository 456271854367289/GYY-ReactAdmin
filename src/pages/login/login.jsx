import React, { Component } from 'react'
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Redirect } from 'react-router';
import 'antd/dist/antd.less';

import "./login.less"
import logo from '../../assets/imges/logo.png'
import {reqLogin} from '../../api';
import memoryUntils from '../../utils/memoryUntils';
import storageUntils from '../../utils/storageUntils';

// 登录路由组建
export default class login extends Component {

     onFinish = async (values) => {
        const {username,password} = values
        const result = await reqLogin(username,password)//{status:0 data：user}  {status:1  msg:""}
        console.log(result);
        if(result.status===0){
            message.success("登录成功")

            const user = result.data

            memoryUntils.user = user //保存user到内存中

            storageUntils.saveUser(user)//保存到local中

            //使用history跳转到管理页面（想要有回退用push  不想要回退用replace）
            this.props.history.replace("/")
        }else{//登录失败
            //提示错误信息
            message.error(result.msg)
        }
        }

      onFinishFailed = (values) => {
        console.log('Received values of form: ', values);
      };


    render() {
        //获取内存中的user
        const user = memoryUntils.user
        //如果内存中有user则返回主页  
        if(user._id){
            return <Redirect to="/"></Redirect>
        }

        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo" />
                    <h1>React项目：后台管理系统</h1>
                </header>
                <section className="login-content">
                    <h2>用户登录</h2>
                    {/* 登录表格 */}
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={this.onFinish}
                        onFinishFailed={this.onFinishFailed}
                    >
                        {/* 用户名 */}
                        <Form.Item
                            name="username"
                            // 声明式验证
                            rules={[
                                {
                                    required: true,
                                    message: '请输入用户名!',
                                    whitespace: true
                                },{
                                   pattern: /^[a-zA-Z0-9_]+$/, message: "用户名必须是数字 英文 _组成 不能有空格"
                                },
                            ]}
                        >
                            <Input  prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
                        </Form.Item>
                        {/* 密码 */}
                        <Form.Item
                            name="password"
                            // 自定义检验
                            // validator: (_,value)=>{
                            //     value = (value).toString()
                            //   if(!value){
                            //       return Promise.reject(new Error('请输入密码!'))
                            //   }else if(value.length<4){
                            //       return Promise.reject(new Error('密码长度不能小于4!'))
                            //   }else if(value.length>12){
                            //       return Promise.reject(new Error('密码长度不能大于12!'))
                            //   }else if(!/^[a-zA-Z0-9_]+$/.test(value)) {
                            //       return Promise.reject(new Error('密码必须是数字 英文 _组成不能有空格!'))
                            //   }else {
                            //       return Promise.resolve(value)
                            //   }
                            // }
                            rules={[
                                { // 声明式验证
                                    required: true,
                                    message: '请输入密码!',
                                    whitespace: true
                                },{
                                    min: 4,message: "密码至少四位"
                                },{
                                    max: 12,message: "密码最多十二位"
                                },{
                                   pattern: /^[a-zA-Z0-9_]+$/, message: "密码必须是数字 英文 _组成 不能有空格"
                                },
                            ]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="密码"
                            />
                        </Form.Item>
                        {/* 登录按钮 */}
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}
