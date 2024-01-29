import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../services/app.service';
import { LocalstorageService } from '../services/local-storage.service';
import * as $ from "jquery";
import { CartNotificationService } from '../services/cart.notification.service';

// declare global {
//     interface Window {
//         jQuery: typeof jQuery;
//         $: typeof jQuery;
//     }
// }
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  productCode: string = '';
  categories: any;
  products: any;
  product: any;
  priceRanges: any;
  count: number = 0;
  cart: any;
  qty: any;
  constructor(private _cartNotification:CartNotificationService,@Inject(PLATFORM_ID) private platformId: any,private router: Router, private appService: AppService, private localStorage:LocalstorageService ) {
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
  this.router.routerState.root.queryParams.subscribe((params: any) => {
    this.productCode = params['productCode'];

    if (this.productCode)
    {
      // this.category = this.categories.find((ij:any)=>ij.slug == this.categoryCode)
      this.getCategoryDetails(this.productCode);
    }
  });
}
public getCategoryDetails(code: string)
{

    this.appService.LoadProductDetail(code).subscribe((response: any) => {
        this.product = response;
       this.priceRanges =  response.product_Sizes;

      //  this.product.produc_prices.reduce((group:any, product:any) => {
      //     const { size1 } = product;
      //     group[size1] = group[size1] ?? [];
      //     group[size1].push(product);
      //     return group;
      //   }, {});
    },
    (error) =>{

    });
}
openCategoryDetail(categoryCode:any)
{
  this.router.navigate(["/category"], { queryParams: { categoryCode:categoryCode} });
}
openProductDetail(productCode:any)
{
  ;
  this.router.navigate(["/product-detail"], { queryParams: { categoryCode:productCode} });
}
openSignup_Login()
{
  this.router.navigate(["/signin"], { queryParams: { return:'delivery'} });
}
openHome()
{
  this.router.navigate(["/landing"]);
}
product_id_del:any;
product_price_id_del:any;
ToBeDeleted(product_id:any,product_price_id:any)
{
this.product_id_del = product_id;
this.product_price_id_del = product_price_id;
}
RemoveItem(product_id:any,product_price_id:any)
{

  let session_id = this.localStorage.getItem('session_id');
  let user_id = this.localStorage.getItem('user_id');
  this.appService.RemoveCart({product_id:this.product_id_del,product_price_id:this.product_price_id_del,session_id : session_id,user_id:user_id}).subscribe((resp)=>{
    this._cartNotification.Cart.next(true);
  });
}
isFirst(size:any)
{
  if(this.count != 0)
  return false;
  if(this.priceRanges.findIndex((i:any)=>i.size1==size) == 0)
    return true;
   return false;
}
AddToCart(pack:any)
{
  this.appService.AddToCart({user_id:1,
    product_id:this.product.product_id,
    product_price_id:pack.product_price_id,
    price:pack.price,
    qty:pack.pack_range[0] }).subscribe((response)=>{
      this._cartNotification.Cart.next(true);
     // alert('Done');
    });
}
ModifyCart(pack:any)
{
  console.log('blurrrrrrrrrrrrrrr',pack);
  this.appService.ModifyCart({user_id:1,
    cart_id:pack.cart_id,
    product_id:pack.product.product_id,
    product_price_id:pack.product_price_id,
    price:pack.price,
    count:pack.count,
    qty:pack.qty }).subscribe((response)=>{
      this._cartNotification.Cart.next(true);
     //alert('Done');
    });
}
IsItemSelected(price_id : any)
{
  if(!this.cart)
  {
    return false;
  }
  if(this.cart.cartIems.find((i:any)=>i.product_price_id == price_id))
    return true;
  return false;
}
// $(function() {
// $('.sectionForTable h4').click(function(event) {
//   ;
//   //irfan
//   event.preventDefault();
//   $(this).addClass('active');
//   $(this).siblings().removeClass('active');

//   var ph = $(this).parent().height();
//   var ch = $(this).next().height();

//   if (ch > ph) {
//     $(this).parent().css({
//       'min-height': ch + 'px'
//     });
//   } else {
//     $(this).parent().css({
//       'height': 'auto'
//     });
//   }
// });
// });
}
