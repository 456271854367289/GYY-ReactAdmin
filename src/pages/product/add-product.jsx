import React, { PureComponent } from 'react'
import { Card, Input, Form, Button, Cascader, message } from 'antd'
import {
    ArrowLeftOutlined
} from '@ant-design/icons';
import LinkButton from '../../components/link-button/';
import { reqCategorys } from '../../api/index';
import PicturesWall from './pictures-wall';
import RichTextEditor from './rich-text-editor';
import {reqAddOrUpdateProduct} from '../../api/index'

const Item = Form.Item
const { TextArea } = Input


export default class AddProduct extends PureComponent {
    state = {
        options: [] //分类值
    }

    constructor(props){
        super(props)
        //定义子组件ref
        this.pw = React.createRef()
        this.editor = React.createRef()
    }

    //初始化options
    initOptions = async (categorys) => {
        //根据categorys生成options
        const options = categorys.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: false,
        }))
        const { product, isUpdate } = this
        const { pCategoryId } = product
        if (isUpdate && pCategoryId !== "0") {
                //获取对应的二级分类列表
                const subCategorys = await this.getCategorys(pCategoryId)
                 //遍历subCategorys取出值
                const cOptions = subCategorys.map(c => ({
                    value: c._id,
                    label: c.name,
                    isLeaf: true,
                }))
                // 找到当前商品对应的一级option对象
                const targetOption = options.find(option=>option.value===pCategoryId)
                //关联对应的一级对象
                targetOption.children = cOptions
        
        }

        //更新状态
        this.setState({ options })
    }

    //获取一级分类或二级分类
    getCategorys = async (parentId) => {
        const result = await reqCategorys(parentId)
        if (result.status === 0) {
            const categorys = result.data
            //判断是否是一级列表
            if (parentId === "0") {//是一级列表调用初始化options列表方法
                this.initOptions(categorys)
            } else {  //不是一级列表 返回 结果值
                return categorys
            }
        }
    }
    //提交功能
    onFinish = async (values) => {
        //读取values里面的值
        const {name,desc,price,categoryIds} = values
        let categoryId,pCategoryId
        //判断有几个ID  一个代表只有一级列表
        if(categoryIds.length === 1){
            pCategoryId = "0"
            categoryId = categoryIds[0]
        }else{
            pCategoryId = [0]
            categoryId = [1]
        }
        //通过ref组件使用子组件方法  通过方法得到值
        const imgs = this.pw.current.getPicture()
        const detail = this.editor.current.getDetial()
        // console.log(detail)
        //将值赋值给product
        const product = {name,desc,price,imgs,detail,pCategoryId,categoryId} 
        //判断是否是更新    是更新读取二级_id
        if(this.isUpdate){
            product._id = this.product._id
        }
        //发请求 更新或添加商品
        const result = await reqAddOrUpdateProduct(product)
        if(result.status===0){
            message.success(`${this.isUpdate?"更新":"添加"}商品成功！`)
        }else{
            message.error(`${this.isUpdate?"更新":"添加"}商品失败！`)

        }
        // console.log('Received values of form: ', values,"imgs",imgs)
    }

    //更新选择状态
    loadData = async selectedOptions => {
        //得到option对象
        const targetOption = selectedOptions[selectedOptions.length - 1];
        //显示loading
        targetOption.loading = true;
        //调用getCategorys方法
        const subCategorys = await this.getCategorys(targetOption.value)
        //判断subCategorys是否有二级列表
        if (subCategorys && subCategorys.length > 0) {//如果有二级列表 
            //取消显示loading
            targetOption.loading = false;
            //遍历subCategorys取出值
            const cOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true,
            }))
            // 将二级列表值赋值给 targetOption.children 更新状态
            targetOption.children = cOptions

        } else {//如果没有二级列表  将targetOption.isLeaf设置为true 
            //取消显示loading
            targetOption.loading = false;
            // 将targetOption.isLeaf设置为true 
            targetOption.isLeaf = true
        }

        //更新状态
        this.setState({ options: [...this.state.options] });
    }

    //自定义检验
    validatorPrice = async (_, value) => {
        //如果数字小于0  不通过
        if (value * 1 < 0) {
            return await Promise.reject(new Error('价格必须大于0!'))
        }
    }

    componentDidMount() {
        //初始化分类数值默认一级分类
        this.getCategorys("0")
    }

    render() {
        //获取home组件穿过来的product
        const product = this.props.location.state
        //保存是否是更新的标签
        this.isUpdate = !!product
        //保存product  如果没有值赋值空对象  防止报错
        this.product = product || {}
        //取出ID值
        const { pCategoryId, categoryId ,imgs,detail} = this.product
        //初始化一个空的Id数组
        const categoryIds = []

        if (this.isUpdate) {
            if (pCategoryId === "0") {
                categoryIds.push(categoryId)
            } else {
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }
        }
        // console.log(categoryIds);
    

        //Card title 
        const title = (
            <span>
                <LinkButton style={{ margin: "0 20px" }} onClick={() => this.props.history.goBack()}>
                    <ArrowLeftOutlined />
                </LinkButton>
                <span>{this.isUpdate ? "修改商品" : "添加商品"}</span>
            </span>
        )
        const layout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 8 },
        };
        return (
            <Card title={title}>
                <Form {...layout} onFinish={this.onFinish}
                >
                    <Item label="商品名称" name="name"
                        rules={[
                            {
                                required: true,
                                message: '商品名称是必须输入的',
                            },
                        ]}
                        initialValue={
                            this.product.name
                        } >
                        <Input placeholder="请输入商品名称" />
                    </Item>
                    <Item label="商品描述" name="desc"
                        rules={[
                            {
                                required: true,
                                message: '商品描述是必须输入的',
                            },
                        ]}
                        initialValue={
                            this.product.desc
                        }
                    >
                        <TextArea placeholder="请输入商品描述" />
                    </Item>
                    <Item label="商品价格" name="price"
                        initialValue={
                            this.product.price
                        }
                        rules={[
                            {
                                required: true,
                                message: '商品价格是必须输入的',
                            }, {
                                validator: this.validatorPrice
                            }
                        ]}>
                        <Input type="number" placeholder="请输入商品价格" addonAfter="元" />
                    </Item>
                    <Item label="商品分类" name="categoryIds"
                        initialValue={
                            categoryIds
                        }
                    >
                        <Cascader placeholder="请指定商品分类" options={this.state.options} loadData={this.loadData} />
                    </Item>
                    <Item label="商品图片" >
                        <PicturesWall ref={this.pw}  imgs={imgs} />
                    </Item>
                    <Item label="商品详情" labelCol={{span:2}} wrapperCol={{span:20}} >
                       <RichTextEditor ref={this.editor} detail={detail} />
                    </Item>
                    <Item>
                        <Button type="primary" htmlType="submit" style={{ margin: "0 60px" }} >提交</Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}
