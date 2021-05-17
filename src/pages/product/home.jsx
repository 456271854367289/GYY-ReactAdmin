import React, { Component } from 'react'
import { Card, Button, Table, Select,Input, message,Cascader } from 'antd';
import Linkbutton from '../../components/link-button/'
import { PlusCircleFilled } from '@ant-design/icons';
import {PAGE_SIZE} from '../../utils/contains'
import {reqProduct,reqSearchProducts,reqProductUpdateStatus} from '../../api/index'

export default class ProductHome extends Component {
    state = {
        tatol:0 ,//数据总数量
        products: [] , //商品数据
        loading: false ,//页面是否加载中
        searchName:"" ,//搜索的关键字
        searchType: "productName", //通过什么方式搜索  默认是 productName
    }

    //对商品进行上架/下架处理
    updateStatus = async (productId,status)=>{
        let result
        //判断是否上下架  
        if(status === 2){
             result = await reqProductUpdateStatus(productId,status-1) 
        }else {
             result = await reqProductUpdateStatus(productId,status+1) 
        }
        if(result.status === 0){
            message.success("操作成功")
            //更新页面  使用之前存起来的页数 确定是第几页
            this.getProducuts(this.pageNum)
        }else {
            message.error("操作失败")
        }
    }


        //初始化标题数据方法
    initProducts = () => {
        this.columns = [//创建标题数据
            {
                title: '商品名称',
                width: 455,
                dataIndex: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
            },            {
                title: '商品价格',
                dataIndex: 'price',
                render: (price)=>(
                    "￥" + price
                )
            },
            {
                title: '状态',
                width: 100,
                render:(product) => (
                    <span>
                        {/* 通过product.status判断是否上下架 */}
                    <Button type="primary" onClick={()=>this.updateStatus(product._id,product.status)} >{product.status === 2?"上架":"下架"}</Button>
                    <span>{product.status === 2?"已下架":"在售"}</span>
                    </span>
                )
             },
            {
                title: '操作',
                width: 100,
                render: (product) => 
                     (
                    <span>
                        {/* 通过history.push()第二个参数传递product的值 用location.state接收*/}
                    <Linkbutton onClick={()=>this.props.history.push("/product/detail",{product})} >详情</Linkbutton>
                    <Linkbutton onClick={()=>this.props.history.push("/product/addproduct",product)} >修改</Linkbutton>
                    </span>
                )
            }
        ];
    }
    //初始化商品数据方法
    getProducuts = async (pageNum) =>{
        //将页数存起来 让每个方法知道
        this.pageNum = pageNum
        //获取数据时 将loading改为true
        this.setState({ loading: true })
        const {searchName,searchType} = this.state
        let result
        //判断是用什么请求

        if(searchName){
            //如果searchName有值就根据searchName搜索
        result = await reqSearchProducts({pageNum,pageSize:PAGE_SIZE,searchName,searchType})
        }else{  
        //如果searchName没有值就直接搜索全部
         result = await reqProduct(pageNum,PAGE_SIZE)
        }
        if(result.status === 0)
        {
            //获取数据成功后将loading改为false
            this.setState({ loading: false })
            // console.log("ok",result.data);
            const {total,list} = result.data  //抽取data中的值
            this.setState({total,products:list})  //更新状态
        }
    }
    componentDidMount(){
        //运行初始化商品数据方法
        this.getProducuts(1)
    }


    render() {
        const {products,total,loading,searchName,searchType} = this.state
        //读取Option
        const { Option } = Select;
        //商品extra
        const btn = (
            <Button type="primary"  onClick={ ()=>this.props.history.push("/product/addproduct")}  >
            <PlusCircleFilled/>
                     添加商品
            </Button>
        )
        //initProducts方法
        this.initProducts()
        //商品title
        const title = (
            <span>
                {/* 通过onChange更新状态 */}
                <Select defaultValue={searchType} style={{width:150}} onChange={value=>{
                    this.setState({searchType:value}) 
                }}>  
                    <Option value="productName">按名称搜索</Option>
                    <Option value="productDesc">按描述搜索</Option>
                </Select>
                <Input placeholder="关键字" style={{width:150,margin: '0 15px'}} value={searchName}
                 onChange={e=>{this.setState({searchName:e.target.value})}} />
                <Button type="primary" onClick={()=> this.getProducuts(this.pageNum)}>
                    搜索
                </Button>
            </span>
        )
        this.initProducts()
        return (
            <Card title={title} extra={btn} style={{ width: '100%' }}>{/* 绑定数据 */}
                <Table 
                    dataSource={products}
                    columns={this.columns}
                    bordered //表格边框
                    rowKey="_id"  //z指定key值
                    loading={loading}            //指定是否在loading
                    pagination={{ 
                        total,                         //总数
                        defaultPageSize: PAGE_SIZE,   //每页显示数量
                        showQuickJumper: true,       //跳转功能
                        onChange:this.getProducuts  //定义点击页数方法  这里用到了简写   （pageNUM）=>  this.getProducuts(pageNUM)
                    }}
                   
                ></Table>
            </Card>
        )
    }
}
