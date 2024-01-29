import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../services/app.service';
import { LocalstorageService } from '../services/local-storage.service';
import * as $ from "jquery";
import { CartNotificationService } from '../services/cart.notification.service';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';

@Component({
  selector: 'app-delivery-address',
  templateUrl: './delivery-address.component.html',
  styleUrls: ['./delivery-address.component.css']
})
export class DeliveryAddressComponent implements OnInit {

  productCode: string = '';
  postalCode: string = '';
  erroMsg: string = '';
  categories: any;
  addressList: any;
  signup: any = {postCode:'',post_code:'',contact_name:'',region:'',company_name:'',town:'',address:'',country:'',phone:''};
  priceRanges: any;
  count: number = 0;
  cart: any;
  tab:boolean=false;
  selectedAddress:any={post_code:'',contact_name:'',region:'',company_name:'',town:'',address:'',country:'',phone:''};
  editAddress:any={address_id:'',post_code:'',contact_name:'',region:'',company_name:'',town:'',address:'',country:'',phone:''};
  deliveryForm: FormGroup = new FormGroup({});
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
  this._cartNotification.MainHeader.next(false);
  this._cartNotification.OrderSteps.next(2);
  this.LoadForm();
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
LoadForm(): void {
  this.deliveryForm = this.fb.group({
    reference: [this.signup.reference, [Validators.required,Validators.minLength(1), Validators.maxLength(100)]],
    contact_name: [this.signup.contact_name, [Validators.required,Validators.minLength(1), Validators.maxLength(100)]],
    region: [this.signup.region, [Validators.required,Validators.minLength(1), Validators.maxLength(50)]],
    post_code: [this.signup.post_code, [Validators.required,Validators.minLength(1), Validators.maxLength(100)]],
    town: [this.signup.town, [Validators.required,Validators.minLength(1), Validators.maxLength(50)]],
    address: [this.signup.address, [Validators.required,Validators.minLength(1), Validators.maxLength(500)]],
    country: [this.signup.country, [Validators.required,Validators.minLength(1), Validators.maxLength(50)]],
    phone: [this.signup.phone, [Validators.required,Validators.minLength(10), Validators.maxLength(15)]],
    postCode: [this.signup.postCode]
  });
}

openCategoryDetail(categoryCode:any)
{
  this.router.navigate(["/category"], { queryParams: { categoryCode:categoryCode} });
}
back()
{
  this.router.navigate(["/checkout"]);
}
openModal()
{
  this.deliveryForm.reset();
  this.tab = true;
}
closeModal()
{
  this.tab = false;
}
onDeliverySubmit(){
  if (this.deliveryForm.valid) {
    let userId = this.localStorage.getItem('user_id');
    let sessionId = this.localStorage.getItem('session_id');
    if(userId)
    {
      sessionId = userId;
    }
    this.signup = this.deliveryForm.value;

    if(this.editAddress && this.editAddress.address != '')
    {
      this.appService.UpdateAddress({address_id:this.editAddress.address_id,reference:this.signup.reference,contact_name:this.signup.contact_name,
        region:this.signup.region,
        address:this.signup.address,
        town:this.signup.town,
        country:this.signup.country,
        post_code:this.signup.post_code,
        user_id:userId,
        phone:this.signup.phone}).subscribe((response) => {
          this.closeModal();
          this.getAddressList();
      });
    }
    else{
    this.appService.AddAddress({reference:this.signup.reference,contact_name:this.signup.contact_name,
      region:this.signup.region,
      address:this.signup.address,
      town:this.signup.town,
      country:this.signup.country,
      post_code:this.signup.post_code,
      user_id:userId,
      phone:this.signup.phone}).subscribe((response) => {
        this.closeModal();
        this.getAddressList();
    });
  }
  }
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
public AssignAddress(addressId:any)
{

  this.appService.AssignAddress({addressId:addressId,cartId:this.cart.cartIems[0].cart_id}).subscribe(()=>{
      this.router.navigate(['/payment']);
  });
}
public MarkAsBillingAddress(addressId:any)
{

  this.appService.MarkAsBillingAddress(addressId).subscribe(()=>{
      this.getAddressList();
  });
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
      this.deliveryForm.patchValue({ 'reference': response.reference });
      this.deliveryForm.patchValue({ 'contact_name': response.contact_name });
      this.deliveryForm.patchValue({ 'region': response.region });
      this.deliveryForm.patchValue({ 'post_code': response.post_code });
      this.deliveryForm.patchValue({ 'town': response.town });
      this.deliveryForm.patchValue({ 'address': response.address });
      this.deliveryForm.patchValue({ 'country': response.country });
      this.deliveryForm.patchValue({ 'phone': response.phone });
     this.editAddress = response;
    },
    (error) =>{

    });
}
selectAddress(adr:any)
{
  let adrs = parseInt(adr);

this.deliveryForm.patchValue({ 'post_code': this.tempAddressList[adrs].postcode });
      this.deliveryForm.patchValue({ 'town': this.tempAddressList[adrs].post_town });
      this.deliveryForm.patchValue({ 'address': this.tempAddressList[adrs].thoroughfare });
      this.deliveryForm.patchValue({ 'country': this.tempAddressList[adrs].country });
      if(this.tempAddressList[adrs].building_number!=''){
      this.deliveryForm.patchValue({ 'region': this.tempAddressList[adrs].building_number + ' ' + this.tempAddressList[adrs].building_name});
      }
      else{
      this.deliveryForm.patchValue({ 'region': this.tempAddressList[adrs].sub_building_name + ' ' + this.tempAddressList[adrs].building_name});

      }
}
tempAddressList : any=[];
public findAddress()
{
  this.erroMsg= '';

this.signup = this.deliveryForm.value;
  if(!this.signup.postCode)
  return;
  let userId = this.localStorage.getItem('user_id');
    let sessionId = this.localStorage.getItem('session_id');
    if(userId)
    {
      sessionId = userId;
    }
    this.appService.LoadFindAddress(this.signup.postCode).subscribe((response: any) => {

      if(response.result != "Failure"){
        this.tempAddressList = response.result;
        this.deliveryForm.patchValue({ 'post_code': response.result[0].postcode });
        this.deliveryForm.patchValue({ 'town': response.result[0].post_town });
        this.deliveryForm.patchValue({ 'address': response.result[0].thoroughfare });
        this.deliveryForm.patchValue({ 'country': response.result[0].country });
        if(this.tempAddressList[0].building_number!=''){
          this.deliveryForm.patchValue({ 'region': response.result[0].building_number + ' ' + response.result[0].building_name});
          }
          else{
            this.deliveryForm.patchValue({ 'region': response.result[0].sub_building_name + ' ' + response.result[0].building_name});

          }

      }
      else{
        this.erroMsg = response.erroMsg;
      }
    },
    (error) =>{
        this.erroMsg = 'Invalid PostCode, you may manualy enter your address.'
    });
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
          if(!temp)
          {
            this.selectedAddress = this.addressList[0];
          }
          else{
            this.selectedAddress = temp;
          }
        }
    },
    (error) =>{

    });
}
}
