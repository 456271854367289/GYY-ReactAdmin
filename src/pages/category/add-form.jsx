import React, { Component } from 'react'
import { Form, Input, Select, } from 'antd';
import PropTypes from "prop-types";


export default class AddForm extends Component {
  formRef = React.createRef()

  static propTypes = {
    categoryName: PropTypes.string,
    setForm: PropTypes.func,
    parentId: PropTypes.string
  }

  componentDidMount(){
    // console.log(this.formRef);
    this.props.setForm(this.formRef.current);
  }
    render() {
        const { Option } = Select;
        const {categorys,parentId} = this.props
        console.log(parentId);
        return (
            <Form ref={this.formRef}  >
                <Form.Item name="parentId" initialValue={parentId}>
                    <Select>
                        <Option value="0">一级分类列表</Option>
                            {
                                categorys.map(c => <Option key={c._id} value={c._id}>{c.name}</Option>)
                            }
                    </Select>
                </Form.Item>
                <Form.Item name="categoryName" 
                  rules={[
                                {
                                    required: true,
                                    message: '请输入分类名称!',
                                    whitespace: true
                                },
                            ]}>
                    <Input placeholder="请输入分类名称" />
                </Form.Item>
            </Form>
        )
    }
}
