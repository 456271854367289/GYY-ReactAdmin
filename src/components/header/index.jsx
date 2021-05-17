import React, { Component } from 'react'
import { formateDate } from '../../utils/dataUnlis'
import memoryUntils from '../../utils/memoryUntils'
import { withRouter } from 'react-router-dom';
import storageUntils from '../../utils/storageUntils';
import { message, Modal } from 'antd';
import LinkButton from '../../components/link-button';
import './index.less';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import menuList from '../../config/menuConfig'
//头部导航组件
class Header extends Component {
    state = {//初始化时间数据
        currentTime: formateDate(Date.now())
    }
    //退出登录
    logout = ()=> {
        //从内存中获取username
        const username = memoryUntils.user.username
        const { confirm } = Modal;
        confirm({
          title: '确定要退出吗',
          icon: <ExclamationCircleOutlined />,
          okText:"确定",
          cancelText: "取消",
          onOk : () => {
              //删除location中的数据
            storageUntils.removeUser(username)
            //删除内存中的数据
            memoryUntils.user = {}
            //跳转路由到登录界面
            this.props.history.push("/login")
            message.success("退成成功")
          }
        });
      }
    //创建更新时间数据函数
    getTime = () => {
        //创建定时器
        this.timer = setInterval(() => {
            const time = formateDate(Date.now())
            this.setState({ currentTime: time })
        }, 1000)
    }
    //得到title
    getTitle = () => {
        //得到当前的路径
        const path = this.props.location.pathname
        //创建接收的title
        let title
        //便利所有路径
        menuList.forEach(item => {
            //判断是否有相同的路径
            if (path.indexOf(item.key) === 0) {
                title = item.title
            } else if (item.children) {
                const citem = item.children.find(citem => path.indexOf(citem.key) === 0)
                if (citem) {
                    //如果有citem  取出citem
                    title = citem.title
                }

            }
        })
        //返回title
        return title
    }

    //启动定时器每秒更新时间数据
    componentDidMount() {

        this.getTime()
    }
    //组件销毁前 销毁定时器
    componentWillUnmount() {
        clearInterval(this.timer)
    }
    render() {
        const { currentTime } = this.state
        const username = memoryUntils.user.username
        const title = this.getTitle()
        return (
            <div className='header'>
                <div className="header-top">
                    <span>欢迎，{username}</span>
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">
                        <h1>{title}</h1>
                    </div>
                    <div className="header-bottom-center">
                        {/* 调用和风天气完成天气 */}
                        <div id="he-plugin-simple" className="header-bottom-right-weather">
                        </div>
                    </div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(Header)