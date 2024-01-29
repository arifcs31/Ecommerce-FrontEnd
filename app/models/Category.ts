export class Category {
  category_id:number = 0
  name : string = ''
  description : string = ''
  slug : string = ''
  image_url : string = ''
  parent_id : number = 0
  order : number = 0
  external_id : string = ''
  external_parent_id : string = ''
  is_active : boolean = false
  subCategories: Array<SubCategory> = new Array<SubCategory>
}


export class SubCategory {
  category_id:number = 0
  name : string = ''
  description : string = ''
  slug : string = ''
  image_url : string = ''
  parent_id : number = 0
  order : number = 0
  external_id : string = ''
  external_parent_id : string = ''
  is_active : boolean = false
}
  enum BannerPlacements {
    Top = 0, Bottom = 1, Center = 2, Left = 3, Right = 4
  }