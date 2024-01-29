import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../services/app.service';
import { LocalstorageService } from '../services/local-storage.service';
import * as $ from "jquery";
import { CartNotificationService } from '../services/cart.notification.service';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  orderId: string = '';
  categories: any;
  addressList: any;
  bank: any = {payment_reference:''};
  priceRanges: any;
  count: number = 0;
  cart: any;
  tab:boolean=false;
  deliveryNote: any;
  orders:any;
  constructor(private fb: FormBuilder,private _cartNotification:CartNotificationService,@Inject(PLATFORM_ID) private platformId: any,private router: Router, private appService: AppService, private localStorage:LocalstorageService ) {
    if(isPlatformBrowser(platformId))
    {
      this.categories = JSON.parse(this.localStorage.getItem("categories") || '');

    }
    this._cartNotification.ATC.subscribe((res)=>{
      this.cart = res;
    });
  }

ngOnInit(): void {
  this._cartNotification.MainHeader.next(true);
  this.getOrders();
  this.router.routerState.root.queryParams.subscribe((params: any) => {
   this.orderId = params['orderId'];


  });
}

openCategoryDetail(categoryCode:any)
{
  this.router.navigate(["/category"], { queryParams: { categoryCode:categoryCode} });
}
openModal()
{
  this.tab = true;
}
closeModal()
{
  this.tab = false;
}
getOrderLines()
{
  let orderLines:Array<any>=[{}];
  orderLines.splice(0);
  this.cart.cartIems.forEach((element:any) => {
    
    orderLines.push({product_id:element.product_id,
      product_price_id:element.product_price_id,price:element.price,qty:element.qty,
      is_active:true
    });

  }); 
  return orderLines;
}
 getFormValidationErrors(form: FormGroup) {

  const result:any = [];
  Object.keys(form.controls).forEach(key => {

    const controlErrors: ValidationErrors = form?.get(key)?.errors || {};
    if (controlErrors) {
      Object.keys(controlErrors).forEach(keyError => {
        result.push(keyError);
        // result.push({
        //   'control': key,
        //   'error': keyError,
        //   'value': controlErrors[keyError]
        // });
      });
    }
  });

  return result;
}
ViewOrder(order_id:any)
{
  this.router.navigate(["/order-detail"], { queryParams: { orderId:order_id} });
}
public getOrders()
{

  let userId = this.localStorage.getItem('user_id');
    let sessionId = this.localStorage.getItem('session_id');
    if(userId)
    {
      sessionId = userId;
    }
    this.appService.LoadOrders(userId).subscribe((response: any) => {
     this.orders = response.orders;
    },
    (error) =>{

    });
}

}
