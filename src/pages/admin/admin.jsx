import React, { Component } from 'react'
import { Layout } from 'antd';
import {Switch, Route ,Redirect} from 'react-router-dom';
import memoryUntils from '../../utils/memoryUntils';
import Header from '../../components/header';
import LeftNav from '../../components/left-nav';
import Category from '../category/category';
import Bar from '../charts/bar';
import Pie from '../charts/pie';
import Line from '../charts/line';
import Home from '../home/home';
import Product from '../product/product';
import Role from '../role/role';
import User from '../user/user';

const {  Footer, Sider, Content } = Layout;

// 后台管理路由组建
export default class admin extends Component {

    render() {
        const user = memoryUntils.user
        //如果内存中没有user或者user——id  ==》当前没有登录
        if(!user || !user._id){
            //自动跳转到登录（render中用Redirect）
            return <Redirect to="/login"></Redirect>
        }
        return (
            <Layout style={{minHeight: '100%'}}>
            <Sider><LeftNav/></Sider>
            <Layout>
              <Header>Header</Header>
              <Content style={{margin:'20px',backgroundColor: '#fff'}}>
              <Switch>
                  <Route path="/home" component={Home}></Route>
                  <Route path="/category" component={Category}></Route>
                  <Route path="/product" component={Product}></Route>
                  <Route path="/role" component={Role}></Route>
                  <Route path="/user" component={User}></Route>
                  <Route path="/charts/bar" component={Bar}></Route>
                  <Route path="/charts/pie" component={Pie}></Route>
                  <Route path="/charts/line" component={Line}></Route>
                  <Redirect to="/home"/>
                </Switch>
              </Content>
              <Footer style={{textAlign: 'center',backgroundColor: '#cccccc'}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
            </Layout>
          </Layout>
        )
    }
}
