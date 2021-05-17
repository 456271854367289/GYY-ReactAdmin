import React from 'react'
import './index.less'
//创建一个类似于a标签的button
export default function LinkButton(props){
    return <button className="linkbotton" {...props}>{props.children}</button>
}