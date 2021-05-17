import React from 'react'
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {reqDeleteP} from '../../api/index'
import { BASE_IMG } from '../../utils/contains';

//子组件调用父组件的方法：将父组件的方法以函数属性的形式传递给子组件，子组件就可以调用
//父组件调用子组件的方法：在父组件中定义子组件ref通过ref获得子组件标签对象，调用其方法



function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
//用于图片上传

export default class PicturesWall extends React.Component {

  constructor(props){
    super(props)
    let fileList = []
    const {imgs} = this.props
    if(imgs&&imgs.length>0){
      fileList = imgs.map((img,index)=>({
        
          uid: -index,      // 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
          name: img,  // 文件名
          status: 'done', // 状态有：uploading done error removed，被 beforeUpload 拦截的文件没有 status 属性
          url:    BASE_IMG+img 
      }))
    }
    this.state = {
      previewVisible: false,   //标识是否显示大图预览
      previewImage: '',       //大图的url
      previewTitle: '',       //图片标题
      fileList,           //所有已上传图片数据
    }
  }



  //隐藏Model
  handleCancel = () => this.setState({ previewVisible: false });
  //显示指定file对应的大图
  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };
//file：当前操作的图片文件（上传/删除）
//filelist：所有上传图片文件对象的数据
  handleChange = async ({ file,fileList }) => {
  console.log(file.status,"sss",fileList);
  //判断file是否上传成功
  if(file.status === "done"){
    //读取当前图片的内容
    const result= file.response
        //   {   
    //     "status": 0,
    //     "data": {
    //         "name": "image-1620540204131.jfif",
    //         "url": "http://localhost:5000/upload/image-1620540204131.jfif"
    //     }
    // }
    //判断内容是否成功
    if(result.status === 0){
      const { name ,url } = result.data

      message.success("上传图片成功！")
      
      file = fileList[fileList.length-1]
      file.name = name
      file.url = url
    }else{
      message.error("上次图片失败！")
    }
  }else if(file.status === "removed"){//删除图片
    const result = await reqDeleteP(file.name)
    if(result.status === 0){
      message.success("图片删除成功！")
    }else{
      message.error("图片删除失败！")
    }
  }

  //在操作（上传 删除 ）过程中更新filelist状态
    this.setState({ fileList });
  }
  //将子组件图片路径传给父组件方法   父组件利用ref使用此方法
  getPicture = ()=>{
    return this.state.fileList.map(list=>list.name)
  }

  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return (
      <>
        <Upload
          accept="image/*"        //设置只接受图片
          action="/manage/img/upload"   //上传图片的接口地址
          listType="picture-card"       //显示样式
          fileList={fileList}           //所有已上传图片对象的数组
          name="image"                  //请求参数名
          onPreview={this.handlePreview}    //显示指定file对应的大图
          onChange={this.handleChange}      //
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </>
    );
  }
}
