import React, { PureComponent } from 'react'
import { Form, Input, Tree } from 'antd';
import menuList from '../../config/menuConfig';

const { Item } = Form;
//PureComponent 提供了一个具有浅比较的shouldComponentUpdate方法
export default class SetRoleAuth extends PureComponent {

    constructor(props){
        super(props)
        const {menus} = this.props.role
        this.state={
            checkedKeys:menus, 
        }
    }
    formRef = React.createRef()
    //通过menuList创建一个treeData
    getTreeDatas = (menuList) =>{
        return menuList.map(item=>{
            if(item.children){
              return  {title:item.title,key:item.key,children:item.children}
            }else{
                return  {title:item.title,key:item.key}
            }})
    }
        //选择权限回调函数  （点击复选框触发）
     onCheck = (checkedKeys, info) => {
         this.setState({checkedKeys})
        // console.log('onCheck', checkedKeys, info);
      }

      //为父组件获取最新menus的方法
      getMenus = ()=>this.state.checkedKeys

    render() {

        const {checkedKeys} = this.state
        //创建一个treeData
        let treeData = [{title:"平台权限",key:"all",children:this.getTreeDatas(menuList)}]
        
        // console.log(treeData);

        //获取父组件传过来的role数据
        const role = this.props.role    
        //设置样式
        const layout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 15 },
        }

        

        return (
            <Form ref={this.formRef} >
                <Item
                    initialValue={role.name}
                    name="roleName"
                    label="角色名称"
                    {...layout}
                >
                    <Input disabled />
                </Item>
                <Tree
                    checkable
                    defaultExpandAll
                    checkedKeys={checkedKeys}
                    onCheck={this.onCheck}
                    treeData={treeData}
                />
            </Form>

        )
    }
}
