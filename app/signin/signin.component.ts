import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../services/app.service';
import { LocalstorageService } from '../services/local-storage.service';
import * as $ from "jquery";
import { CartNotificationService } from '../services/cart.notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// declare global {
//     interface Window {
//         jQuery: typeof jQuery;
//         $: typeof jQuery;
//     }
// }
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  returnUrl: string = '';
  categories: any;
  products: any;
  signup: any = {firstName:'',lastName:'',password:'',confirmPassword:'',phone:'',customerType:false};
  login: any = {password:'',email:''};
  forgotpassword: any = {email:''};
  priceRanges: any;
  count: number = 0;
  cart: any;
  tab:boolean=false;
  signupForm: FormGroup = new FormGroup({});
  loginForm: FormGroup = new FormGroup({});
  forgotpasswordForm: FormGroup = new FormGroup({});

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

  this.LoadForm();
  this.LoadLoginForm();
  this.LoadForgotPasswordForm();
  this.router.routerState.root.queryParams.subscribe((params: any) => {
    this.returnUrl = params['return'];
    if(this.returnUrl)
    {
      this._cartNotification.MainHeader.next(false);
      this._cartNotification.OrderSteps.next(1);
    }
    let userId = this.localStorage.getItem('user_id');
    let sessionId = this.localStorage.getItem('session_id');

    if(userId)
    {
      sessionId = userId;
    }
    if (this.returnUrl && userId)
    {

    this.router.navigate(["/"+this.returnUrl]);

    }
    // else{
    //   if(userId && userId != "0")
    //   {
    //   this.router.navigate(["/landing"]);
    //   }
    // }
  });
}
LoadForm(): void {
  this.signupForm = this.fb.group({
    firstName: [this.signup.firstName, [Validators.required,Validators.minLength(4), Validators.maxLength(50)]],
    lastName: [this.signup.lastName, [Validators.required,Validators.minLength(4), Validators.maxLength(50)]],
    email: [this.signup.email, [Validators.required,Validators.minLength(4), Validators.maxLength(99),
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
    password: [this.signup.password, [Validators.required,Validators.required,Validators.minLength(5), Validators.maxLength(50)]],
    confirmPassword: [this.signup.confirmPassword, [Validators.required,Validators.required,Validators.minLength(5), Validators.maxLength(50)]],
    phone: [this.signup.phone, [Validators.required,Validators.minLength(5), Validators.maxLength(14)]],
   // customerType: [this.signup.customerType, [Validators.required]],
  });
}
LoadLoginForm(): void {
  this.loginForm = this.fb.group({
    email: [this.login.email, [Validators.required]],
    password: [this.login.password, [Validators.required]]
  });
}
LoadForgotPasswordForm(): void {
  this.forgotpasswordForm = this.fb.group({
    email: [this.forgotpassword.email, [Validators.required,Validators.minLength(4), Validators.maxLength(99),
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]]
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
Toggle(page:any){
  this.msg = '';

  this.router.navigate(["/signup"]);
// if(page == "signup")
// {
//   this.tab = true;
// }
// else{
//   this.tab = false;
// }
}
msg:string='';
onSignupSubmit(){
  this.msg = '';
  if (this.signupForm.valid) {
    this.signup = this.signupForm.value;
    this.appService.SignUp({first_name:this.signup.firstName,
    last_name:this.signup.lastName,password:this.signup.password,email:this.signup.email,phone:this.signup.phone}).subscribe((response) => {
      let session_id = this.localStorage.getItem('session_id');
      this.localStorage.setItem('user_id',response.userId);
      this.localStorage.setItem('token',response.token);
      this.appService.AssignCart({anonymousUserId:session_id,userId:response.userId}).subscribe((resp)=>{
        this._cartNotification.RefreshUser.next(true);
        this._cartNotification.Cart.next(true);
        if(this.returnUrl)
        {
          this.router.navigate(["/"+this.returnUrl]);
        }
        else{
          this.router.navigate(["/landing"]);
        }
      });

    },(err)=>{

      this.msg = 'Somthing wrong! Email already reserved!';
    });
  }
}
onLoginSubmit(){
  this.msg = '';
  if (this.loginForm.valid) {
    this.login = this.loginForm.value;
    this.appService.Login(this.login).subscribe((response)=>{
      if(response.userId == 0)
      {
        this.msg = 'Email or password incorrect, please try again';
      }
      let session_id = this.localStorage.getItem('session_id');
      this.localStorage.setItem('user_id',response.userId);
      this.localStorage.setItem('token',response.token);
      this.appService.AssignCart({anonymousUserId:session_id,userId:response.userId}).subscribe((resp)=>{
        this._cartNotification.Cart.next(true);
        this._cartNotification.RefreshUser.next(true);
        if(this.returnUrl)
        {
          this.router.navigate(["/"+this.returnUrl]);
        }
        else{
          this.router.navigate(["/landing"]);
        }
      });


    },(err)=>{
      this.msg = 'Email or password incorrect, please try again';
    });
  }
}
onForgotPasswordSubmit(){
  this.msg = '';
  if (this.forgotpasswordForm.valid) {
    this.forgotpassword = this.forgotpasswordForm.value;
    this.appService.ForgotPassword(this.forgotpassword).subscribe((response)=>{

      console.log(response);
      if(response.userId == 0)
      {
        this.msg = 'Email or password incorrect, please try again';
      }
      else
      {
        this.msg = 'Reset password link sent successfully, please check your inbox and proceed with reset password.';

      }
    },(err)=>{
      this.msg = 'Email or password incorrect, please try again';
    });
  }
}
}
