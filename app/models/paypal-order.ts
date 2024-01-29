export class paypal_order {
  name:string= '';
  quantity:string ='';
  category:string= '';
  unit_amount:unit_amount = new unit_amount();
}


export class unit_amount {
  currency_code:string= '';
    value:string= '';
}
