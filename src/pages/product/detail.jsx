import React, { Component } from 'react'
import {Card,List} from 'antd'
import {
    ArrowLeftOutlined
  } from '@ant-design/icons';
import LinkButton from '../../components/link-button/index'
import {BASE_IMG} from '../../utils/contains'
import {reqCategory} from '../../api/index';

const Item = List.Item
export default class ProductDetail extends Component {

    state = {
        cName1:"", //一级分类名称
        cName2:"", //二级分类名称
    }

    //添加分类列表回调函数
    getCategory = async ()=>{
        const {pCategoryId,categoryId} = this.props.location.state.product  
        if(pCategoryId === "0"){//一级分类下的商品
          const  result = await reqCategory(categoryId)
            const cName1 = result.data.name
            this.setState({cName1})
        }else{//二级分类下的商品
        // const  result1 = await reqCategory(pCategoryId)  //获取一级列表 后面一个请求实在前一个完成之后再发   
        // const  result2 = await reqCategory(categoryId)   //获取二级列表
        // const cName1 = result1.data.name
        // const cName2 = result2.data.name
            //一次性发多个请求  只有成功了 才正常处理
        const resules = await Promise.all([reqCategory(pCategoryId),reqCategory(categoryId)])

        const cName1 = resules[0].data.name
        const cName2 = resules[1].data.name
        this.setState({cName1,cName2})
        }
    }

    componentDidMount(){
        this.getCategory()
    }

    render() {
        //通过this.props.location.state接收product值
        const {name,desc,price,detail,imgs} = this.props.location.state.product
        const {cName1,cName2} = this.state
        const title = (
            <span>
            <LinkButton style={{margin: "0 20px"}} onClick={()=> this.props.history.goBack()}>
            <ArrowLeftOutlined />
            </LinkButton>
            <span>商品详情</span>
            </span>
        )
        return (
            <Card title={title} className="product-card">
                <List bordered={true}>
                <Item>
                    <h2>商品名称:</h2>
                    <span>
                        {name}
                    </span>
                </Item>                
                <Item>
                    <h2>商品描述:</h2>
                    <span>
                        {desc}
                    </span>
                </Item>
                <Item>
                    <h2>商品价格:</h2>
                    <span>
                        {price}元
                    </span>
                </Item>
                <Item>
                    <h2>商品分类:</h2>
                    <span>
                        {cName1}{cName2?"-->"+cName2:""}
                    </span>
                </Item>
                <Item>
                    <h2>商品图片:</h2>
                    {
                        imgs.map(img=>
                            <img key={img} src={BASE_IMG+img} alt="img" style={{width:150 ,height: 150}} />)
                    }
                </Item>
                <Item>
                    <h2>商品详情:</h2>
                    <span dangerouslySetInnerHTML={{__html: detail}}></span>
                </Item>
                </List>
            </Card>
        )
    }
}
