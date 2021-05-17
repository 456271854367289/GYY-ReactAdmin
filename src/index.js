import App from './App'
import React from 'react'
import ReactDOM from 'react-dom'
import 'antd/dist/antd.less'; // or 'antd/dist/antd.less'
import memoryUntils from './utils/memoryUntils';
import storageUntils from './utils/storageUntils';

import {BrowserRouter} from 'react-router-dom';
    //local中获取user  
    const user = storageUntils.getUser()    
    //将user赋值到内存中
    memoryUntils.user = user

ReactDOM.render(

<BrowserRouter>
<App></App>
</BrowserRouter>,
document.getElementById('root'))