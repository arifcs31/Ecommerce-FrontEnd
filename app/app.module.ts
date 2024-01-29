import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CategoryComponent } from './category/category.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { LandingComponent } from './landing/landing.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductComponent } from './product/product.component';
import { AppService } from './services/app.service';
import { CartNotificationService } from './services/cart.notification.service';
import { LocalstorageService } from './services/local-storage.service';
import { SignupComponent } from './signup/signup.component';
import { NgHttpLoaderModule, SpinnerVisibilityService } from 'ng-http-loader';
import { DeliveryAddressComponent } from './delivery-address/delivery-address.component';
import { PaymentComponent } from './payment/payment.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { NgxPayPalModule } from 'ngx-paypal';
import { DeliveryInfoComponent } from './delivery-info/delivery-info.component';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { TermComponent } from './term/term.component';
import { RetrunExchangeComponent } from './retrun-exchange/retrun-exchange.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { NgxRerenderModule } from 'ngx-rerender';
import { PrivacyComponent } from './privacy/privacy.component';
import { PaymentPolicyComponent } from './payment-policy/payment-policy.component';
import { SigninComponent } from './signin/signin.component';
@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    CategoryComponent,
    ProductComponent,
    ProductDetailComponent,
    CheckoutComponent,
    SignupComponent,
    ResetpasswordComponent,
    DeliveryAddressComponent,
    PaymentComponent,
    OrderDetailComponent,
    OrderHistoryComponent,
    DeliveryInfoComponent,
    ContactComponent,
    AboutComponent,
    TermComponent,
    RetrunExchangeComponent,
    PrivacyComponent,
    PaymentPolicyComponent,
    SigninComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    NgHttpLoaderModule.forRoot(),
    NgxPayPalModule
  ],
  providers: [SpinnerVisibilityService,AppService,LocalstorageService,CartNotificationService],
  bootstrap: [AppComponent]
})

export class AppModule { }
