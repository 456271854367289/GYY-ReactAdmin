import React, { Component } from 'react'
import {Button,Card,Table,Modal, message} from 'antd'
import {reqRoles} from '../../api/index'
import {PAGE_SIZE} from '../../utils/contains';
import AddRoleForm from './add-role-form'
import SetRoleAuth from './set-role-auth';
import {reqUpdateRole} from '../../api/index';
import memoryUntils from '../../utils/memoryUntils'
import storageUntils from '../../utils/storageUntils'
import {formateDate} from '../../utils/dataUnlis';

export default class Role extends Component {
    state = {
        roles:[] , //角色数据
        role:{},  //选中的role
        idShowAdd:false , // 是否打开添加角色对话框
        idShowAuth:false , //是否打开设置角色权限对话框
    }

    constructor(props){
        super(props)
        //定义子组件ref
        this.sra = React.createRef()
    }

    initColumns = ()=>{
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name',
            },            {
                title: '创建时间',
                dataIndex: 'create_time',
                render:formateDate
            },            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render:(creat_time)=>formateDate(creat_time)
            },            {
                title: '授权人',
                dataIndex: 'auth_name',
            },
        ]
    }
    //选中了哪个row
    onRow = (role)=>{
        return {
            onClick:event=>{
                this.setState({role})
            }
        }
    }
    //异步得到数据
    getRoles = async ()=>{
        const result = await reqRoles()
        if(result.status === 0) {
            const roles = result.data
            this.setState({roles})
        }
    }
    //打开添加角色对话框
    openAdd = ()=>{
        this.setState({idShowAdd:true})
    }
    //关闭添加角色对话框
    offAdd = ()=>{
        this.setState({idShowAdd:false})
    }
    //打开给角色设置权限对话框
    openAuth = ()=>{
        this.setState({idShowAuth:true})
    }
    //关闭给角色设置权限对话框
    offAuth = ()=>{
        this.setState({idShowAuth:false})
    }

    //角色设置权限对话框 点击 确定的回调函数
    setRoleAuth = async ()=>{
        const role = this.state.role
        //得到最新的menus
        const menus = this.sra.current.getMenus()

        role.menus = menus
        //得到给权利的name
        role.auth_name = memoryUntils.user.username
        //得到当前时间
        role.auth_time = Date.now()

        //请求更新
        const result = await reqUpdateRole(role)
        if(result.status === 0){
            //隐藏对话框
            this.offAuth()
            //如果当前更新的是自己的角色，强制退出
            if(role._id === memoryUntils.user.role_id){
                memoryUntils.user = {}
                storageUntils.removeUser()
                this.props.history.replace(`/login`)
                message.success("当前用户权限修改了，请重新登录")
            }else{
                message.success("设置权限成功！")
                this.getRoles()
            }
        }
    }

    componentDidMount(){
        //初始化
        this.getRoles()
    }

    render() {
        const {roles,role,idShowAdd,idShowAuth} = this.state

        this.initColumns()

        const title = (
            <span>
                <Button type="primary" style={{marginRight: 10}} onClick={this.openAdd} >创建角色</Button>
                <Button type="primary" disabled={!role._id} onClick={this.openAuth} >设置角色权限</Button>
            </span>
        )
        return (
            <Card title={title}>
                <Table
                 onRow={this.onRow}
                 dataSource={roles}
                 rowSelection={{type:"radio" ,
                 columnWidth: 70, 
                 selectedRowKeys:[role._id],
                 onSelect:(role)=>{
                    this.setState({
                        role
                    })
                 }}}
                 columns={this.columns}
                 bordered //表格边框
                 rowKey="_id"  //z指定key值
                 pagination={{ defaultPageSize: PAGE_SIZE, showQuickJumper: true }}>

                </Table>
                <Modal
                    title="添加角色"
                    visible={idShowAdd}
                    onOk={this.addRole}
                    onCancel={this.offAdd}
                    okText="确定"
                    cancelText="取消"
                    destroyOnClose={true} //让input清除缓存  下次打开是更新后的值 默认关闭后状态不会自动清空, 如果希望每次打开都是新内容，请设置 destroyOnClose
                >
                    <AddRoleForm setForm={form => this.form = form} />
                </Modal>
                <Modal
                    title="设置角色权限"
                    visible={idShowAuth}
                    onOk={this.setRoleAuth}
                    onCancel={this.offAuth}
                    okText="确定"
                    cancelText="取消"
                    destroyOnClose={true} //让input清除缓存  下次打开是更新后的值 默认关闭后状态不会自动清空, 如果希望每次打开都是新内容，请设置 destroyOnClose
                >
                    <SetRoleAuth role={role} ref={this.sra} />
                </Modal>
            </Card>
        )
    }
}
