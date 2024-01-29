import { isPlatformBrowser } from '@angular/common';
import { ThisReceiver } from '@angular/compiler';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from '../models/Category';
import { AppService } from '../services/app.service';
import { CartNotificationService } from '../services/cart.notification.service';
import { LocalstorageService } from '../services/local-storage.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  categoryCode: string = '';
  categories: any;
  category: any = new Category();
  constructor(private _cartNotification:CartNotificationService, @Inject(PLATFORM_ID) private platformId: any,private router: Router, private appService: AppService, private localStorage:LocalstorageService ) {
    if(isPlatformBrowser(platformId))
    {
      this.categories = JSON.parse(this.localStorage.getItem("categories") || '');


    }
  }

  ngOnInit(): void {
    this._cartNotification.MainHeader.next(true);
    this.router.routerState.root.queryParams.subscribe((params: any) => {
      this.categoryCode = params['categoryCode'];

      if (this.categoryCode) {

        // this.category = this.categories.find((ij:any)=>ij.slug == this.categoryCode)
        this.getCategoryDetails(this.categoryCode);
      }
    });
  }
  public getCategoryDetails(code: string)
  {
      this.appService.LoadCategoryDetail(code).subscribe((response: any) => {


        if(response.subCategories && response.subCategories.length > 0  )
        {
          this.category = response;
          this.categories = JSON.parse(this.localStorage.getItem("categories") || '');

          this.categories = this.categories.filter((i:any)=>i.slug == this.categoryCode)
          if(this.categories && this.categories.length>0)
          {

          }
          else{
            this.categories = JSON.parse(this.localStorage.getItem("categories") || '');
            this.categories = this.categories.filter((i:any)=> i.subCategories.find((s:any)=>s.slug == this.categoryCode) != null)
          }
        }
        else{
          this.router.navigate(['/products'],{ queryParams: { categoryCode: code} });
        }

      },
      (error) =>{

      });
  }
  openCategoryDetail(categoryCode:any)
  {
    this.router.navigate(["/category"], { queryParams: { categoryCode:categoryCode} });
  }
}
