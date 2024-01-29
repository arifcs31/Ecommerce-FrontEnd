import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
//import { SpinnerVisibilityService } from 'ng-http-loader';
import { BehaviorSubject } from 'rxjs';
import { AppService } from './services/app.service';
import { CartNotificationService } from './services/cart.notification.service';
import { LocalstorageService } from './services/local-storage.service';
declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.css'
  ]
})

export class AppComponent {
  title = 'QTPack';
  cart: any = { subTotal: 0, count: 0 };
  user: any;
  search:any;
  cookieBar:any=false;
  constructor(private _cartNotification: CartNotificationService, private localStorageService: LocalstorageService, private router: Router, @Inject(PLATFORM_ID) private platformId: any, private _appService: AppService) {
    AppComponent.isBrowser.next(isPlatformBrowser(platformId));
  }
  categories: any;
  mainHeader: boolean = true;
  step:any = 0;
  count:any = 0;
  static isBrowser = new BehaviorSubject<boolean>(false);
  ngOnInit(): void {
   // this.spinner.show();
   if(AppComponent.isBrowser){
    this.LoadCategories();
    this.LoadCart();
    this.LoadUser();
   }
    this._cartNotification.Cart.subscribe((res) => {
      if (res) {
        this.LoadCart();
      }
    });
    this._cartNotification.RefreshUser.subscribe((res) => {
      if (res) {
        this.LoadUser();
      }
    });
    this._cartNotification.MainHeader.subscribe((res) => {

      this.mainHeader = res;

    });
    this._cartNotification.OrderSteps.subscribe((res) => {

      this.step = res;

    });
    this._cartNotification.rerun.subscribe((res)=>{
        this.count = res;
    });
    if(isPlatformBrowser(this.platformId)){
    if (this.localStorageService.getItem('session_id') == null) {
      this._appService.CreateSession({ ip: '' }).subscribe((response) => {
        this.localStorageService.setItem('session_id', response);
      });
    }

    if (this.localStorageService.getItem('cb_isCookieAccepted') == null) {
      this.cookieBar = true;
    }
    else if(this.localStorageService.getItem('cb_isCookieAccepted') == 'no')
    {
      this.cookieBar = true;
    }
    else if(this.localStorageService.getItem('cb_isCookieAccepted') == 'yes')
    {
      this.cookieBar = false;
    }
  }
  }

  LoadUser(){
    if(isPlatformBrowser(this.platformId)){
    let userId = this.localStorageService.getItem('user_id');
    let sessionId = this.localStorageService.getItem('session_id');
    if (userId) {
      sessionId = userId;
    }
    if (!sessionId)
      return;
    this._appService.GetUser(userId).subscribe((resp)=>{
        this.user = resp;
    })
  };
  }
  ngAfterViewInit() {
    //if(isPlatformBrowser(this.platformId))
   // this.spinner.hide();
}
  myclick(){
   // this.spinner.show();
    //window.location.reload();
  }
  public rerender(): void {

    this.count;
  }
  LoadCategories() {
    this._appService.LoadCategories().subscribe((response) => {
      //
      this.categories = response;
      if(isPlatformBrowser(this.platformId)){
      this.localStorageService.setItem("categories", JSON.stringify(response));
      }

    },
      (error) => {

      });
  }
  openCategoryDetail(categoryCode: any) {
    this.router.navigate(["/category"], { queryParams: { categoryCode: categoryCode } });
  }
  openMobileCategoryDetail(categoryCode: any) {
    debugger;
    let cat = this.categories.find((j:any)=>j.slug == categoryCode);
    if(cat && cat.subCategories && cat.subCategories.length>0)
    this.router.navigate(["/category"], { queryParams: { categoryCode:categoryCode} });
    else
    window.location.href ='/category?categoryCode='+categoryCode;
  }
  openSignupPage() {
    this.router.navigate(["/signin"]);
  }
  openSearchProducts() {

    this.router.navigate(["/products"], { queryParams: { search: this.search } });
  }
  logout() {
    this.user = null;
    this.localStorageService.removeItem('user_id');
    this.router.navigate(["/landing"]);
  }
  openLanding()
  {
    this.router.navigate(["/landing"]);
  }
  openAbout()
  {
    this.router.navigate(["/about"]);
  }
  openTerms()
  {
    this.router.navigate(["/terms"]);
  }
  openDeliveryInfo()
  {
    this.router.navigate(["/delivery-information"]);
  }
  openReturnPolicy()
  {
    this.router.navigate(["/return-policy"]);
  }
  openPrivacyPolicy()
  {
    this.router.navigate(["/privacy"]);
  }
  openPaymentPolicy()
  {
    this.router.navigate(["/payment-policy"]);
  }
  openContact()
  {
    this.router.navigate(["/contact"]);
  }
  LoadCart() {
    if(isPlatformBrowser(this.platformId)){
    let userId = this.localStorageService.getItem('user_id');
    let sessionId = this.localStorageService.getItem('session_id');
    if (userId) {
      sessionId = userId;
    }
    if (!sessionId)
      return;
    this._appService.LoadCartDetail(sessionId).subscribe((response) => {
      //
      this.cart = response;
      this._cartNotification.ATC.next(this.cart);
    },
      (error) => {

      });
      }
  }
  openCheckout() {
    this.router.navigate(["/checkout"]);
  }
  openOrderHistory() {
    let userId = this.localStorageService.getItem('user_id');
    if (userId) {
      this.router.navigate(["/order-history"]);
    }
    else {
      this.router.navigate(["/signin"]);
    }

  }

}
