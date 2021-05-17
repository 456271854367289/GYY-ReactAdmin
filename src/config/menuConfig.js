
import {
    PieChartOutlined,
    UserOutlined,
    ShoppingOutlined,
    UnorderedListOutlined,
    SettingOutlined,
    UserSwitchOutlined,
    AreaChartOutlined,
    BarChartOutlined,
    LineChartOutlined,
  } from '@ant-design/icons';


const menuList = [{
    title: '首页',
    key: '/home',
    icon: <PieChartOutlined />,
    isPublic:true,  //公开的
},
{
    title: '商品',
    key: '/products',
    icon:<ShoppingOutlined />,
    children:[{
            title: '品类管理',
            key: '/category',
            icon: <UnorderedListOutlined />,
    },{
            title: '商品管理',
            key: '/product',
            icon: <SettingOutlined />,
    }]
},
{
    title:'用户管理',
    key:'/user',
    icon:<UserOutlined />
},{
    title:'角色管理',
    key:'/role',
    icon:<UserSwitchOutlined />
},
{
    title:'图形图表',
    key:'/charts',
    icon:<AreaChartOutlined />,
    children:[{
        title:'柱形图',
        key:'/charts/bar',
        icon:<BarChartOutlined />
    },{
        title:'饼图',
        key:'/charts/pie',
        icon:<PieChartOutlined />
    },{
        title:'折线图',
        key:'/charts/line',
        icon:<LineChartOutlined />
    }]
}]
export default menuList