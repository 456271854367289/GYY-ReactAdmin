import React, { Component } from 'react'
import { Button, Card, Table, Modal, message } from 'antd'
import LinkButton from '../../components/link-button'
import { PAGE_SIZE } from '../../utils/contains'
import { formateDate } from '../../utils/dataUnlis'
import { reqGetUsers, reqDeleteUser, reqAddUser, reqUpdateUser } from '../../api/index'
import UserForm from './user-form';
import { ExclamationCircleOutlined } from '@ant-design/icons'

export default class User extends Component {
    state = {
        users: [],  //所有用户列表
        isShowUser: false,  //是否显示框
        roles: [],    //所有角色列表
    }
    //初始化columns
    initColumns = () => {
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username',
            }, {
                title: '邮箱',
                dataIndex: 'email'
            }, {
                title: '电话',
                dataIndex: 'phone'
            }, {
                title: '注册时间',
                dataIndex: 'create_time',
                render: (creat_time) => formateDate(creat_time)
            }, {
                title: '所属角色',
                dataIndex: 'role_id',
                render: (role_id) => this.RoleNames[role_id]
            }, {
                title: '操作',
                render: (user) => (
                    <span>
                        <LinkButton onClick={()=>this.showUpdate(user)}>修改</LinkButton>
                        <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
                    </span>
                )
            },
        ]
    }

    //展示更新用户对话框
    showUpdate = (user)=>{
        //显示对话框
        this.setState({isShowUser:true})
        //存储user
        this.user = user
        
    }

    //删除用户
    deleteUser = (user) => {
        Modal.confirm({
            title: `你确定要删除${user.username}用户吗?`,
            icon: <ExclamationCircleOutlined />,
             onOk:async () =>{
                const result = await reqDeleteUser(user._id)
                if (result.status === 0) {
                    this.getUsers()
                    message.success("删除成功")
                } else {
                    message.error("删除失败")
                }
            },
        })
    }

    //根据role的数组，生成包含所有角色名的对象（属性名用角色id）
    initRoleNames = (roles) => {
        const RoleNames = roles.reduce((pre, role) => {
            pre[role._id] = role.name
            return pre
        }, {})
        this.RoleNames = RoleNames
    }

    //添加或更新user的方法
    addOrUpdateUser = async () => {
        this.setState({isShowUser:false})
        //收集数据
        const user = this.form.getFieldsValue()
        console.log(user);
        let result
        //判断是更新还是创建用户
        if(this.user){
            user._id = this.user._id
            result = await reqUpdateUser(user)
        }else {
            result = await reqAddUser(user)
        }
        //判定是否成功
        if(result.status===0){
            this.getUsers()
            message.success(`${user._id?"更新用户成功！":"创建用户成功！"}`)
        }
    }
    //关闭用户对话框
    offuser = () => {
        this.setState({ isShowUser: false })
    }
    //打开添加用户对话框
    openUser = () => {
        //创建用户前清空之前打开修改用户对user的残留数据
        this.user = null
        this.setState({ isShowUser: true })
    }
    //得到users并存入状态中
    getUsers = async () => {
        const result = await reqGetUsers()
        if (result.status === 0) {
            const { users, roles } = result.data
            //初始化创建一个RoleNames数组专门用来存储role角色     id为roles._id  值为roles.name 
            this.initRoleNames(roles)

            this.setState({ users, roles })
        }
    }

    componentDidMount() {
        this.getUsers()
    }

    render() {
        //从状态中去值
        const { users, isShowUser, roles } = this.state
        //取出user   用来传给子组件UserForm
        const user = this.user || {}
        //执行初始化Columns
        this.initColumns()

        const title = (
            <Button type="primary" onClick={this.openUser}>
                创建用户
            </Button>
        )
        return (
            <Card title={title}>
                <Table
                    onRow={this.onRow}
                    dataSource={users}
                    columns={this.columns}
                    bordered //表格边框
                    rowKey="_id"  //z指定key值
                    pagination={{ defaultPageSize: PAGE_SIZE, showQuickJumper: true }}>

                </Table>
                <Modal
                    title={user._id?"修改用户":"创建用户"}
                    visible={isShowUser}
                    onOk={this.addOrUpdateUser}
                    onCancel={this.offuser}
                    okText="确定"
                    cancelText="取消"
                    destroyOnClose={true} //让input清除缓存  下次打开是更新后的值 默认关闭后状态不会自动清空, 如果希望每次打开都是新内容，请设置 destroyOnClose
                >
                    {/* <AddRoleForm setForm={form => this.form = form} /> */}
                    <UserForm setForm={form => this.form = form} roles={roles} user={user} />
                </Modal>
            </Card>
        )
    }
}
