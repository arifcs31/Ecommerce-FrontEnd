import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { AppService } from '../services/app.service';
import { CartNotificationService } from '../services/cart.notification.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor(private router: Router,private _appService: AppService, private _cartNotification:CartNotificationService) { }
  categories: any;
  cart: any;
  products:any;
  ngOnInit(): void {
    this._cartNotification.MainHeader.next(true);
    if(AppComponent.isBrowser){
      this.LoadCategories();
      this.LoadLandingProducts();
    }
  }
  LoadCategories()
  {
    this._appService.LoadCategories().subscribe((response) =>{
      //
      this.categories = response;
    },
    (error) => {

    });
  }
  LoadLandingProducts()
  {
    this._appService.LoadLandingProducts('').subscribe((response) =>{
      //
      this.products = response;
    },
    (error) => {

    });
  }
  LoadCart()
  {
    this._appService.LoadCartDetail(1).subscribe((response) =>{
      //
      this.cart = response;
      this._cartNotification.ATC.next(this.cart);
    },
    (error) => {

    });
  }
  openProductDetail(productCode:any)
  {
    this.router.navigate(["/product-detail"], { queryParams: { productCode:productCode} });
  }
}
