import React, { Component } from 'react'
import { Form, Input, } from 'antd';
import PropTypes from "prop-types";

const { Item } = Form;

export default class AddRoleForm extends Component {


  formRef = React.createRef()

  static propTypes = {
    roleName: PropTypes.string,
    setForm: PropTypes.func,
  }

  componentDidMount(){
    // console.log(this.formRef);
    this.props.setForm(this.formRef.current);
  }

  render() {
    const layout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 15 },
      }
    return (
      <Form ref={this.formRef} >
        <Item
        name="roleName" 
        label="角色名称"
        rules={[
                {
                 required: true,
                 message: '请输入角色名称!',
                 whitespace: true
                },
              ]}
        {...layout}
              >
          <Input placeholder="请输入角色名称" />
        </Item>
      </Form>

    )
  }
}
