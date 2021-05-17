import React, { Component } from 'react'
import {Switch,Route,Redirect} from 'react-router-dom'
import ProductHome from './home'
import AddProduct from './add-product'
import ProductDetail from './detail'
import './product.less'

export default class Product extends Component {
    render() {
        return (
            <div>
               <Switch>
                   <Route path="/product" component={ProductHome} exact></Route>
                   <Route path="/product/detail" component={ProductDetail}></Route>
                   <Route path="/product/addproduct" component={AddProduct}></Route>
                   <Redirect to="/product"></Redirect>
               </Switch>
            </div>
        )
    }
}
