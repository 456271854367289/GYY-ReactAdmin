import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import logo from '../../assets/imges/logo.png'
import menuList from '../../config/menuConfig'
import './index.less'
import { Layout, Menu } from 'antd';
import memoryUntils from '../../utils/memoryUntils'
const { Sider } = Layout;
const { SubMenu } = Menu;
//左侧导航的组件
class LeftNav extends Component {
  state = {
    collapsed: false, //当前收起状态 默认没收起
  }
  onCollapse = collapsed => {
    console.log("1", collapsed)
    this.setState({ collapsed })
  }
  //判断当前用户是否有item权限
  hasAuth = (item) => {
    const { key, isPublic } = item
    const menus = memoryUntils.user.role.menus
    console.log(menus);
    const username = memoryUntils.user.username
    // 如果当前用户是admin
    // 如果当前item是公开的
    // 当前用户有item的权限，key有没有menu中
    if (username === 'admin' || isPublic || menus.indexOf(key) !== -1) {
      console.log("ok");
      return true
    } else if(item.children) {//如果当前用户有次item的某个子item的权限
      return !!item.children.find(child => menus.indexOf(child.key) !== -1)
    }
      return false
  }
  // 根据menuList生产组件
  // 根据map+递归调用
  getMenuNodes = (menuList) => {
    //   {
    //     title: '首页',
    //     key: '/home',
    //     icon: <PieChartOutlined />children:[{
    //         title: '品类管理',
    //         key: '/category',
    //         icon: <UnorderedListOutlined />,
    // }
    // }
    return menuList.map(item => {
      //如果用户有item对应的权限，才需要显示对应的菜单项
      if (this.hasAuth(item)) {
        if (!item.children) {//没有子组件添加menu。item
          return (<Menu.Item key={item.key} icon={item.icon}>
            <Link to={item.key}>{item.title}</Link>
          </Menu.Item>)
        } else {//有子组件添加SubMenu
          const path = this.props.location.pathname
          //判断子组件是否被选中 如果被选中就展开父组件 
          const cItem = item.children.find(cImte => path.indexOf(cImte.key) === 0)
          if (cItem) {//如果被选中    定义isUnfold传给父组件
            this.isUnfold = item.key
          }
          return (
            <SubMenu key={item.key} icon={item.icon} title={item.title}>
              {this.getMenuNodes(item.children)}
            </SubMenu>
          )
        }
      }
      return []
    })
  }
  render() {//得到当前的路径
    let path = this.props.location.pathname
    if (path.indexOf("/product") === 0) {
      path = "/product"
    }
    console.log(path);
    //在render之前执行一次   为第一个render准备数据（必须同步）
    this.MenuNodes = this.getMenuNodes(menuList)
    return (
      <div className='left-nav'>
        <Link to='/home' className='left-nav-heard'>
          <img src={logo} alt="logo" />
          <h1>硅谷后台</h1>
        </Link>
        <Layout style={{ minHeight: '100vh' }}>
          <Sider collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
            <Menu theme="dark" defaultSelectedKeys={[path]} selectedKeys={[path]} defaultOpenKeys={[this.isUnfold]} mode="inline">
              {
                this.MenuNodes
              }
            </Menu>
          </Sider>
        </Layout>
      </div>
    )
  }
}
//高阶组件withRouter  提供location history match
export default withRouter(LeftNav)