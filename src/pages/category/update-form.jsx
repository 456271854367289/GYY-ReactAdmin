import React, { Component } from 'react'
import { Form, Input, } from 'antd';
import PropTypes from "prop-types";

const { Item } = Form;

export default class UpdateForm extends Component {


  formRef = React.createRef()

  static propTypes = {
    categoryName: PropTypes.string,
    setForm: PropTypes.func,
  }

  componentDidMount(){
    // console.log(this.formRef);
    this.props.setForm(this.formRef.current);
  }

  render() {
    const { categoryName } = this.props

    return (
      <Form ref={this.formRef}>
        <Item name="categoryName" initialValue={categoryName}
        rules={[
                                {
                                    required: true,
                                    message: '请输入分类名称!',
                                    whitespace: true
                                },
                            ]}>
          <Input placeholder="请输入分类名称" />
        </Item>
      </Form>

    )
  }
}
