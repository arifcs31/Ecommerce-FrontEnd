import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from '../models/Category';
import { AppService } from '../services/app.service';
import { CartNotificationService } from '../services/cart.notification.service';
import { LocalstorageService } from '../services/local-storage.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  categoryCode: string = '';
  categories: any;
  products: any;
  category: any = new Category();
  search:any;
  constructor(private _cartNotification:CartNotificationService,@Inject(PLATFORM_ID) private platformId: any,private router: Router, private appService: AppService, private localStorage:LocalstorageService ) {
    if(isPlatformBrowser(platformId))
    {
      this.categories = JSON.parse(this.localStorage.getItem("categories") || '');

    }
  }

  ngOnInit(): void {
    this._cartNotification.MainHeader.next(true);
    this.router.routerState.root.queryParams.subscribe((params: any) => {
      this.categoryCode = params['categoryCode'];
      this.search = params['search'];

      if (this.categoryCode) {

        this.getCategoryDetails(this.categoryCode);
        this.categories = JSON.parse(this.localStorage.getItem("categories") || '');
        this.categories = this.categories.filter((i:any)=> i.subCategories.find((s:any)=>s.slug == this.categoryCode) != null)
        if(this.categories.length<=0)
        {
          this.categories = JSON.parse(this.localStorage.getItem("categories") || '');
          this.categories = this.categories.filter((i:any)=> i.subCategories.filter((s:any)=>s.subCategories.find((k:any)=>k.slug ==this.categoryCode) !=null ).length>0)
        }
      }
      else if(this.search)
      {
        this.SearchResults();
      }
    });
  }
  public getCategoryDetails(code: string)
  {
      this.appService.LoadProducts(code).subscribe((response) => {
          this.products = response;

      },
      (error) =>{

      });

      this.appService.LoadCategoryDetail(code).subscribe((response: any) => {
        if(response.subCategories || response.subCategories.length > 0  )
          this.category = response;

      },
      (error) =>{

      });
  }
  public SearchResults()
  {
      this.appService.SearchProducts(this.search).subscribe((response) => {
          this.products = response;

      },
      (error) =>{

      });
  }
  openCategoryDetail(categoryCode:any)
  {

    let cat = this.categories.find((j:any)=>j.slug == categoryCode);
    if(cat && cat.subCategories && cat.subCategories.length>0)
    this.router.navigate(["/category"], { queryParams: { categoryCode:categoryCode} });
    else
    this.router.navigate(["/products"], { queryParams: { categoryCode:categoryCode} });
  }
  openProductDetail(productCode:any)
  {
    this.router.navigate(["/product-detail"], { queryParams: { productCode:productCode} });
  }

}
