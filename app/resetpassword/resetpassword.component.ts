import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../services/app.service';
import { LocalstorageService } from '../services/local-storage.service';
import * as $ from "jquery";
import { CartNotificationService } from '../services/cart.notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {

  returnUrl: string = '';
  categories: any;
  products: any;
  userId : number = 0;
  resetPassword: any = {password:'', confirmPassword:''};
  resetPasswordForm: FormGroup = new FormGroup({});
  signupForm: FormGroup = new FormGroup({});
  cart: any;
  tab:boolean=false;
  signup: any = {firstName:'',lastName:'',password:'',confirmPassword:'',phone:'',customerType:false};
  constructor(private fb: FormBuilder,private _cartNotification:CartNotificationService,@Inject(PLATFORM_ID) private platformId: any,private router: Router, private appService: AppService, private localStorage:LocalstorageService,
  private route: ActivatedRoute ) {
    if(isPlatformBrowser(platformId))
    {
      this.categories = JSON.parse(this.localStorage.getItem("categories") || '');

    }
    this._cartNotification.ATC.subscribe((res)=>{
      this.cart = res;
    });
  }
  ngOnInit(): void {

    this.route.queryParams
    .subscribe(params => {
       this.userId = params['users'];
    }
  );
    this.LoadForm();
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
    this.resetPasswordForm = this.fb.group({
      password: [this.resetPassword.password, [Validators.required,Validators.required,Validators.minLength(5), Validators.maxLength(50)]],
      confirmPassword: [this.resetPassword.confirmPassword, [Validators.required,Validators.required,Validators.minLength(5), Validators.maxLength(50)]],
    });
  }
  Toggle(page:any){
    this.msg = '';

  if(page == "signup")
  {
    this.tab = true;
  }
  else{
    this.tab = false;
  }
  }
  msg:string='';
  onResetPasswordSubmit(){
  this.msg = '';
  if (this.resetPasswordForm.valid) {

    this.resetPassword = this.resetPasswordForm.value;
    this.appService.ResetPassword({password:this.resetPassword.password,user_id:this.userId}).subscribe((response) => {


      console.log(response);
      if(this.returnUrl)
      {
        this.router.navigate(["/"+this.returnUrl]);
      }
      else{
        this.router.navigate(["/landing"]);
      }
    },(err)=>{

      this.msg = 'Somthing wrong! Email already reserved!';
    });
  }
}

}
