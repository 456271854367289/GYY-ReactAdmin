import React, { Component } from 'react'
import { Form, Input, Select } from 'antd';
import PropTypes from "prop-types";

const { Option } = Select;
const { Item } = Form;
//添加/修改用户界面
export default class UserForm extends Component {


  formRef = React.createRef()

  static propTypes = {
    roleName: PropTypes.string,
    setForm: PropTypes.func,
  }

  componentDidMount() {
    // console.log(this.formRef);
    this.props.setForm(this.formRef.current)
    
  }

  render() {
    const layout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 15 },
    }
    const roles = this.props.roles
    //接收父组件传过来的user 
    const user = this.props.user
    return (
      <Form ref={this.formRef} >
        <Item
          name="username"
          label="用户名称"
          initialValue={user.username}
          {...layout}
        >
          <Input placeholder="请输入用户名称" />
        </Item>
        {user._id ? null : (       <Item
          name="password"
          label="密码"
          initialValue={user.password}
          {...layout}
        >
            <Input.Password placeholder="请输入密码！" />
        </Item>)
      }
        <Item
          name="phone"
          label="手机号"
          initialValue={user.phone}
          {...layout}
        >
          <Input placeholder="请输入手机号！" />
        </Item>
        <Item
          name="email"
          label="电子邮箱"
          initialValue={user.email}
          {...layout}
        >
          <Input placeholder="请输入电子邮箱！" />
        </Item>
        <Item
          name="role_id"
          label="角色"
          initialValue={user.role_id}
            {...layout}
        >
          <Select>
            {
              roles.map(role => 
                (
                <Option key={role._id} value={role._id}>{role.name}</Option>
                )
              )
            }
          </Select>
        </Item>
      </Form>

    )
  }
}
