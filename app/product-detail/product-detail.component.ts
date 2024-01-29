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
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  productCode: string = '';
  categories: any;
  products: any;
  product: any = {image_url:''};
  priceRanges: any;
  count: number = 0;
  cart: any;
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
ViewMoreOpions()
{
  this.router.navigate(["/product-detail"], { queryParams: { productCode:this.product.link_product_id} });
}
showMoreOptions: boolean = false;
public getCategoryDetails(code: string)
{

    this.appService.LoadProductDetail(code).subscribe((response: any) => {
        this.product = response;
       this.priceRanges =  response.product_Sizes;
       this.state = this.priceRanges[0].size1+ '('+this.priceRanges[0].size2+')';
       this.selectedSize = this.priceRanges[0].size1;
       this.showMoreOptions = this.product.link_product_id != null? true: false
      //  this.product.produc_prices.reduce((group:any, product:any) => {
      //     const { size1 } = product;
      //     group[size1] = group[size1] ?? [];
      //     group[size1].push(product);
      //     return group;
      //   }, {});
        console.log(this.priceRanges);
    },
    (error) =>{

    });
}
state:any;
selectedSize:any;
CurrentState(price:any)
{
  this.state = price.size1+ ' ('+price.size2+')';
  this.selectedSize = price.size1;
  
}
openCategoryDetail(categoryCode:any)
{
  this.router.navigate(["/category"], { queryParams: { categoryCode:categoryCode} });
}
openCategorBack()
{
  this.router.navigate(["/category"], { queryParams: { categoryCode:this.product.category.slug} });
}
openProductDetail(productCode:any)
{
  ;
  this.router.navigate(["/product-detail"], { queryParams: { categoryCode:productCode} });
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
  let userId = this.localStorage.getItem('user_id');
  let sessionId = this.localStorage.getItem('session_id');
  let sessionIdNumber = 0;
  if(sessionId)
  {
    sessionIdNumber = parseInt(sessionId);
  }
  let userIdNumber = 0;
  if(userId)
  {
    userIdNumber = parseInt(userId);
  }
  this.appService.AddToCart({cart_id:0,user_id:userIdNumber,
    session_id:sessionIdNumber,
    product_id:this.product.product_id,
    product_price_id:pack.product_price_id,
    price:pack.price,
    qty:pack.pack_range[0] }).subscribe((response)=>{
      this._cartNotification.Cart.next(true);
     // alert('Done');
    });
}
IsItemSelected(price_id : any)
{
  if(!this.cart)
  {
    return false;
  }
  if(!this.cart.cartIems)
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
