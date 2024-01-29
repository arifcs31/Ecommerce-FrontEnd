import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { CategoryComponent } from './category/category.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ContactComponent } from './contact/contact.component';
import { DeliveryAddressComponent } from './delivery-address/delivery-address.component';
import { DeliveryInfoComponent } from './delivery-info/delivery-info.component';
import { LandingComponent } from './landing/landing.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { PaymentPolicyComponent } from './payment-policy/payment-policy.component';
import { PaymentComponent } from './payment/payment.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductComponent } from './product/product.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { RetrunExchangeComponent } from './retrun-exchange/retrun-exchange.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { TermComponent } from './term/term.component';

const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  { path: 'landing', component: LandingComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'category', component: CategoryComponent },
  { path: 'products', component: ProductComponent },
  { path: 'product-detail', component: ProductDetailComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'resetpassword', component: ResetpasswordComponent },
  { path: 'delivery', component: DeliveryAddressComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'terms', component: TermComponent },
  { path: 'delivery-information', component: DeliveryInfoComponent },
  { path: 'return-policy', component: RetrunExchangeComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'payment-policy', component: PaymentPolicyComponent },
  {path:'order-detail',component: OrderDetailComponent},
  {path:'order-history',component: OrderHistoryComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
