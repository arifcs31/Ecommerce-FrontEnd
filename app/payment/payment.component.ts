import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../services/app.service';
import { LocalstorageService } from '../services/local-storage.service';
import * as $ from "jquery";
import { CartNotificationService } from '../services/cart.notification.service';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { paypal_order, unit_amount } from '../models/paypal-order';
import { environment } from 'src/environments/environment';
import { SpinnerVisibilityService } from 'ng-http-loader';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  productCode: string = '';
  categories: any;
  addressList: any;
  bank: any = {payment_reference:''};
  priceRanges: any;
  count: number = 0;
  cart: any;
  tab:boolean=false;
  deliveryNote: any;
  selectedAddress:any={post_code:'',contact_name:'',region:'',company_name:'',town:'',address:'',country:'',phone:''};
  billingAddress:any={post_code:'',contact_name:'',region:'',company_name:'',town:'',address:'',country:'',phone:''};

  editAddress:any={address_id:'',post_code:'',contact_name:'',region:'',company_name:'',town:'',address:'',country:'',phone:''};
  bankForm: FormGroup = new FormGroup({});
  orderId:any='';
  qtn:any='';
  paymentModeTab:boolean = true;
  platform:boolean = false;
  public payPalConfig?: IPayPalConfig;

  constructor(private spinner:SpinnerVisibilityService,private fb: FormBuilder,private _cartNotification:CartNotificationService,@Inject(PLATFORM_ID) private platformId: any,private router: Router, private appService: AppService, private localStorage:LocalstorageService ) {
    if(isPlatformBrowser(platformId))
    {
      this.platform = true;
      this.categories = JSON.parse(this.localStorage.getItem("categories") || '');
      this.qtn = 'QTN'+'500'+this.localStorage.getItem('user_id');

    }
    this._cartNotification.ATC.subscribe((res)=>{
      this.cart = res;
    });
  }

ngOnInit(): void {
  this._cartNotification.OrderSteps.next(3);
  this._cartNotification.MainHeader.next(false);
  this.LoadBankForm();
  this.LoadCart();

  if(this.cart && this.cart.cartIems[0].address_id)
  {

  }
  this.getAddressList();
  this.router.routerState.root.queryParams.subscribe((params: any) => {
   // this.productCode = params['productCode'];

    // if (this.productCode)
    // {
    //   // this.category = this.categories.find((ij:any)=>ij.slug == this.categoryCode)
    //   //this.getCategoryDetails(this.productCode);
    // }
  });
}
LoadBankForm(): void {
  this.bankForm = this.fb.group({
    payment_reference: [this.bank.payment_reference],
  });
}
LoadCart()
  {
    let userId = this.localStorage.getItem('user_id');
    let sessionId = this.localStorage.getItem('session_id');
    if(userId)
    {
      sessionId = userId;
    }
    this.appService.LoadCartDetail(sessionId).subscribe((response) =>{
      //
      this.cart = response;
      this.initConfig();
      this.getAddress(this.cart.cartIems[0].address_id)
    },
    (error) => {

    });
  }
openCategoryDetail(categoryCode:any)
{
  this.router.navigate(["/category"], { queryParams: { categoryCode:categoryCode} });
}
PaymentModeDecision(str:any)
{
  if(str == 'bank')
  {
    this.paymentModeTab = false;
  }
  else{
    this.paymentModeTab = true;
  }
}
openModal()
{
  this.tab = true;
}
closeModal()
{
  this.tab = false;
}
public getAddressList()
{

  let userId = this.localStorage.getItem('user_id');
    let sessionId = this.localStorage.getItem('session_id');
    if(userId)
    {
      sessionId = userId;
    }
    this.appService.LoadUserAddress(userId).subscribe((response: any) => {
        this.addressList = response;
        if( this.addressList && this.addressList.length>0)
        {
          var temp = this.addressList.find((ij:any)=>ij.type == 'Billing');
          if(temp)
          {
            this.billingAddress = temp;
          }
        }
    },
    (error) =>{

    });
}
ignoreBank:boolean=false;
AddLogs(error:any)
{
  if(!error)
  {
    error = '{Result: AllGood}'
  }

  let userId = this.localStorage.getItem('user_id');
    let sessionId = this.localStorage.getItem('session_id');
    if(userId)
    {
      sessionId = userId;
    }
    let orderLog = {
      sub_total:this.cart.subTotal,
      total: this.cart.total,
      total_tax:this.cart.totalTax,
      delivery_fee:this.cart.deliveryFee,
      note:this.deliveryNote,
      user_id:userId,
      payment_reference:this.bank.payment_reference,
      status: "PendingDelivery",
      address_id: this.cart.cartIems[0].address_id,
      is_active:true,
      orderLines:this.getOrderLines()


    };
  this.appService.AddOrderLog({
    error:JSON.stringify(error),
    request: JSON.stringify(orderLog),
    extra_info:'',
    external_id:'',
    user_id:userId,


  }).subscribe((response) => {

     // this.closeModal();
     // this.router.navigate(['/order-detail'],{ queryParams: { orderId:response} });
  });


}
onBankSubmit(){
  if (this.bankForm.valid) {
    let userId = this.localStorage.getItem('user_id');
    let sessionId = this.localStorage.getItem('session_id');
    if(userId)
    {
      sessionId = userId;
    }
    this.bank = this.bankForm.value;
    this.bank = this.qtn;

    this.appService.AddOrder({
      sub_total:this.cart.subTotal,
      total: this.cart.total,
      total_tax:this.cart.totalTax,
      delivery_fee:this.cart.deliveryFee,
      note:this.deliveryNote,
      user_id:userId,
      payment_reference:this.bank,
      status: "PendingDelivery",
      address_id: this.cart.cartIems[0].address_id,
      is_active:true,
      orderLines:this.getOrderLines()


    }).subscribe((response) => {
        this.closeModal();
        this._cartNotification.Cart.next(true);
        this.router.navigate(['/order-detail'],{ queryParams: { orderId:response} });
    });

  }
}
onPaypalSubmit(that:any){

  that.tab = true;
   that.spinner.show();
   that.openModal();
    let userId = this.localStorage.getItem('user_id');
    let sessionId = this.localStorage.getItem('session_id');
    if(userId)
    {
      sessionId = userId;
    }
   // this.bank = this.bankForm.value;


    this.appService.AddOrder({
      sub_total:this.cart.subTotal,
      total: this.cart.total,
      total_tax:this.cart.totalTax,
      delivery_fee:this.cart.deliveryFee,
      note:this.deliveryNote,
      user_id:userId,
      payment_reference:this.bank.payment_reference,
      status: "PendingDelivery",
      address_id: this.cart.cartIems[0].address_id,
      is_active:true,
      orderLines:this.getOrderLines()


    }).subscribe((response) => {
      this.orderId = response;
      this.openModal();
      this._cartNotification.Cart.next(true);
     // window.location.href = "https://google.com/about";
      window.location.href  = '/order-detail?orderId='+response;
       // this.router.navigate(['/order-detail'],{ queryParams: { orderId:response} });
    });


}
ViewOrder()
{
  this.router.navigate(["/order-detail"], { queryParams: { orderId:this.orderId} });
}

getOrderLines()
{
  let orderLines:Array<any>=[{}];
  orderLines.splice(0);
  this.cart.cartIems.forEach((element:any) => {

    orderLines.push({product_id:element.product_id,
      product_price_id:element.product_price_id,price:element.price,qty:element.qty,
      is_active:true,
      count:element.count
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

back()
{
  this.router.navigate(["/delivery"]);
}
public getAddress(addressId:any)
{

  let userId = this.localStorage.getItem('user_id');
    let sessionId = this.localStorage.getItem('session_id');
    if(userId)
    {
      sessionId = userId;
    }
    this.appService.LoadAddress(addressId).subscribe((response: any) => {
     this.selectedAddress = response;
    },
    (error) =>{

    });
}
private initConfig(): void {

  let that = this;
  if(isPlatformBrowser(this.platformId)){
  let  orderlines = new Array<paypal_order>();
  this.cart.cartIems.forEach((item:any) => {
    let pitem:paypal_order  = {name:item.product.name,category:'DIGITAL_GOODS',quantity:item.count,unit_amount:{currency_code:'GBP',value:item.price}};

    orderlines.push(pitem);
  });
  this.payPalConfig = {
  currency: 'GBP',
  clientId: environment.client_id,
  createOrderOnClient: (data) => <ICreateOrderRequest>{
    intent: 'CAPTURE'.toLowerCase(),
    purchase_units: [
      {
        amount: {
          currency_code: 'GBP',
          value: this.cart.total,
          breakdown: {
            item_total: {
              currency_code: 'GBP',
              value: this.cart.subTotal
            },
            tax_total: {
              currency_code: "GBP",
              value: this.cart.totalTax
          },
          shipping:{
            currency_code: "GBP",
              value: this.cart.deliveryFee
          }
          }
        },
        items: orderlines
      }
    ]
  },
  advanced: {
    commit: 'true',
    extraQueryParams: [
    {
    name: 'intent',
    value: 'capture'
    }
    ]
  },
  style: {
    label: 'paypal',
    layout: 'vertical'
  },
  onApprove: (data, actions) => {

    console.log('onApprove - transaction was approved, but not authorized', data, actions);
    actions.order.get().then((details:any) => {

      this.bank.payment_reference = details.id;
      this.AddLogs(details);
      this.onPaypalSubmit(that);
      console.log('onApprove - you can get full order details inside onApprove: ', details);
    });
  },
  onClientAuthorization: (data) => {

    //this.bank.payment_reference = data.id;
    //that.onBankSubmit();
    //console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
    //this.showSuccess = true;
  },
  onCancel: (data, actions) => {
    console.log('OnCancel', data, actions);
  },
  onError: err => {
    this.AddLogs(err);
    console.log('OnError', err);
  },
  onClick: (data, actions) => {
    console.log('onClick', data, actions);
  },
};
  }
}

// public getAddressList()
// {

//   let userId = this.localStorage.getItem('user_id');
//     let sessionId = this.localStorage.getItem('session_id');
//     if(userId)
//     {
//       sessionId = userId;
//     }
//     this.appService.LoadUserAddress(userId).subscribe((response: any) => {
//         this.addressList = response;
//         if(this.selectedAddress.address == '' && this.addressList && this.addressList.length>0)
//         {
//           this.selectedAddress = this.addressList[0];
//         }
//     },
//     (error) =>{

//     });
// }
}
