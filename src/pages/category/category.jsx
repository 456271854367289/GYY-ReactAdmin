import React, { Component } from 'react'
import { Card, Button, Table, message, Modal } from 'antd';
import { PlusCircleFilled, ArrowRightOutlined } from '@ant-design/icons';
import Linkbutton from '../../components/link-button/'
import { reqUpdateCategory,reqAddCategory } from '../../api/index';
import { reqCategorys } from '../../api'
import AddForm from './add-form';
import UpdateForm from './update-form';

export default class Category extends Component {

    state = {
        categorys: [], //一级分类列表
        loading: false,  //窗口是否正在加载数据
        parentId: '0', //初始默认为一级列表
        subCategorys: [], //二级分类列表
        name: "",  //二级分类名称
        isModalVisible: 0, //0列表不打开  1代表打开添加列表  2代表打开更新列表
    }


    //初始化标题数据
    initCategorys = () => {
        this.columns = [//创建标题数据
            {
                title: '分类的名称',
                dataIndex: 'name',
            },
            {
                title: '操作',
                width: 300,
                render: (category) => (
                    this.state.parentId === "0" ?
                    (<span>
                        <Linkbutton onClick={() => this.updateCate(category)}>修改分类</Linkbutton>
                        <Linkbutton             //如何向事件回调函数传递参数：先定义一个匿名函数，在函数调用处理的函数并传入数据 （定义展示二级分类列表点击事件）
                            onClick={() => { this.showSubCategorys(category) }} >查看子分类</Linkbutton>
                    </span> ):( <span>
                        <Linkbutton onClick={() => this.updateCate(category)}>修改分类</Linkbutton>
                    </span>)
                )
            },
        ];
    }
    //展示指定一级列表的二级分类列表
    showSubCategorys = (category) => {
        //根据传来的category 修改状态 
        this.setState({ parentId: category._id, name: category.name },
            () => {//在状态更新且重新render（）后执行
                //获取二级分类列表
                this.getCategorys()
            })
        //setState()不能立即获取最新的状态，因为setState()是异步更新状态的
    }
    //展示一级分类列表
    showCategory = () => {
        this.setState({ parentId: "0" },
            () => {//在状态更新且重新render（）后执行
                //获取二级分类列表
                this.getCategorys()
            })
    }

    //更新分类列表回调函数
    updateCategory = () => {
        this.form
            .validateFields()
            .then(async (values) => {
                console.log("zhi",values);
                // 1.隐藏弹框
                this.setState({
                    isModalVisible: 0,
                });
                // 2.发请求更新
                const categoryId = this.category._id;
                const { categoryName } = values;
                //重置数据  
                // this.form.resetFields();



                const result = await reqUpdateCategory({ categoryId, categoryName });
                if (result.status === 0) {
                    // 3.重新显示列表
                    this.getCategorys();
                    console.log("ok");
                }
            })
            .catch((err) => {
                console.log(err);
                message.info("请输入分类名称");
            });
    }

    //添加分类列表回调函数
    addCategory = () => {
            this.form
            .validateFields()
            .then(async (values) => {
                console.log("zhi",values);
                // 1.隐藏弹框
                this.setState({
                    isModalVisible: 0,
                });
                const { categoryName,parentId } = values;//从子元素获取id和input值
                // console.log("11",categoryName,parentId);
                //重置数据  
                // this.form.resetFields();
                // 2.发请求更新
                const result = await reqAddCategory({ parentId, categoryName });
                if (result.status === 0&&parentId===this.state.parentId ) {//判断如果当前分类是你选择的分类 就直接刷新分类 如果不是不刷新
                    // 3.重新显示列表
                    this.getCategorys();
                    console.log("ok");
                }
            })
            .catch((err) => {
                console.log(err);
                message.info("请输入分类名称");
            });
    }

    //打开添加分类列表
    addCate = () => {
        const is = 1
        this.setState({ isModalVisible: is })
    }

    //打开更新分类列表
    updateCate = (category) => {
        //保存分类对象
        this.category = category
        //更新状态
        this.setState({ isModalVisible: 2})
    }

    //退出分类列表
    exitCategory = () => {
        //更新状态
        const is = 0
        this.setState({ isModalVisible: is })
    }

    //获取一级列表
    getCategorys = async () => {
        const { parentId } = this.state
        //发请求之前显示loading
        this.setState({ loading: true })
        //异步发起请求获取列表数据
        const result = await reqCategorys(parentId)
        if (result.status === 0) {
            //获取数据成功 更新状态  loading改为false
            this.setState({ loading: false })
            //取出分类数据的数据（可能 是一级的也可能是二级的）
            const categorys = result.data

            if (parentId === "0") {

                this.setState({ categorys })
            } else {
                this.setState({ subCategorys: categorys })
            }

        }
        else {
            message.error("获取数据失败")
        }
    }
    //发送异步请求
    componentDidMount() {
        this.getCategorys()
    }

    render() {
        // 为第一次render（）准备数据
        this.initCategorys()

        const { loading, categorys, name, parentId, subCategorys, isModalVisible } = this.state
        const category = this.category || {}  //如果没数据先给个空对象
        const title = parentId === "0" ? "一级分类列表" : (
            <span>
                <Linkbutton onClick={this.showCategory}>一级分类列表</Linkbutton>
                <ArrowRightOutlined style={{ marginRight: 10 }} />
                <span>{name}</span>
            </span>
        )
        //创建标题
        const btn = (//创建添加按钮
            <Button type="primary" onClick={this.addCate}>
                <PlusCircleFilled />
                添加
            </Button>
        )
        return (
            <Card title={title} extra={btn} style={{ width: '100%' }} > {/* 绑定数据 */}
                <Table
                    dataSource={parentId === "0" ? categorys : subCategorys}
                    columns={this.columns}
                    loading={loading}
                    bordered //表格边框
                    rowKey="_id"  //z指定key值
                    pagination={{ defaultPageSize: 5, showQuickJumper: true }}
                />
                {/* 添加分类列表 */}
                <Modal title="添加分类" 
                visible={isModalVisible === 1}
                onOk={this.addCategory}
                onCancel={this.exitCategory}
                destroyOnClose={true} //让input清除缓存  下次打开是更新后的值 默认关闭后状态不会自动清空, 如果希望每次打开都是新内容，请设置 destroyOnClose
                >
                    <AddForm categorys={categorys} parentId={parentId} setForm={form => this.form = form} />
                </Modal>
                {/* 更新分类列表 */} <Modal
                    title="更新分类"
                    visible={isModalVisible === 2}
                    onOk={this.updateCategory}
                    onCancel={this.exitCategory}
                    okText="确定"
                    cancelText="取消"
                    destroyOnClose={true} //让input清除缓存  下次打开是更新后的值 默认关闭后状态不会自动清空, 如果希望每次打开都是新内容，请设置 destroyOnClose
                >
                    <UpdateForm categoryName={category.name} setForm={form => this.form = form} />
                </Modal>
            </Card>

        )
    }

}
