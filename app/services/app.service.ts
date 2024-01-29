import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from '../../environments/environment';
import { Category } from "../models/Category";
@Injectable()
export class AppService {
     
    constructor(private http: HttpClient) {
    }
    
    LoadCategories() {
        return this.http.get<Category>(environment.qt_api+'/api/categories');
    }
    LoadCategoryDetail(code:string) {
        return this.http.get<Category>(environment.qt_api+'/api/categories/GetBySlug/'+code);
    }
    LoadProductDetail(code:string) {
        return this.http.get<Category>(environment.qt_api+'/api/products/GetById/'+code);
    }
    LoadProducts(code:string) {
        return this.http.get<Category>(environment.qt_api+'/api/products?condition='+code);
    }
    LoadLandingProducts(code:string) {
        return this.http.get<Category>(environment.qt_api+'/api/products/GetLanding?condition='+code);
    }
    SearchProducts(search:string) {
        return this.http.get<Category>(environment.qt_api+'/api/products/Search?filter='+search);
    }
    LoadCartDetail(user_id:any) {
        return this.http.get<any>(environment.qt_api+'/api/cart/'+user_id);
    }
    AddToCart(cartItem:any) {
        return this.http.post<any>(environment.qt_api+'/api/cart',cartItem);
    }
    ModifyCart(cartItem:any) {
        return this.http.put<any>(environment.qt_api+'/api/cart/ModifyCart',cartItem);
    }
    CreateSession(cartItem:any) {
        return this.http.post<any>(environment.qt_api+'/api/session',cartItem);
    }
    SignUp(user:any) {
        return this.http.post<any>(environment.qt_api+'/api/users',user);
    }
    Login(user:any) {
        return this.http.post<any>(environment.qt_api+'/api/account',user);
    }
    ForgotPassword(user:any) {
        return this.http.post<any>(environment.qt_api+'/api/forgotpassword',user);
    }
    ResetPassword(user:any) {
        return this.http.put<any>(environment.qt_api+'/api/forgotpassword',user);
    }
    AssignCart(user:any) {
        return this.http.put<any>(environment.qt_api+'/api/cart',user);
    }
    RemoveCart(user:any) {
        return this.http.post<any>(environment.qt_api+'/api/cart/remove',user);
    }
    AddAddress(address:any) {
        return this.http.post<any>(environment.qt_api+'/api/address',address);
    }
    AddOrder(address:any) {
        return this.http.post<any>(environment.qt_api+'/api/order',address);
    }
    AddOrderLog(address:any) {
        return this.http.post<any>(environment.qt_api+'/api/OrderLog',address);
    }
    UpdateAddress(address:any) {
        return this.http.put<any>(environment.qt_api+'/api/address',address);
    }
    AssignAddress(cart:any) {
        return this.http.put<any>(environment.qt_api+'/api/cart/AssignAddress',cart);
    }
    MarkAsBillingAddress(cart:any) {
        return this.http.put<any>(environment.qt_api+'/api/address/MarkAsBilling',cart);
    }
    LoadUserAddress(user_id:any) {
        return this.http.get<any>(environment.qt_api+'/api/address/GetBy/'+user_id);
    }
    LoadAddress(address_id:any) {
        return this.http.get<any>(environment.qt_api+'/api/address/'+address_id);
    }
    LoadFindAddress(postCode:any) {
        return this.http.get<any>(environment.qt_api+'/api/FindAddress/""/'+postCode);
    }
    LoadOrder(order_id:any) {
        return this.http.get<any>(environment.qt_api+'/api/order/'+order_id);
    }
    LoadOrders(user_id:any) {
        return this.http.get<any>(environment.qt_api+'/api/order/GetMine?Filter='+user_id);
    }
    GetUser(user_id:any) {
        return this.http.get<any>(environment.qt_api+'/api/users/'+user_id);
    }
      
}