import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class CartNotificationService {
    public ATC: BehaviorSubject<any> = new BehaviorSubject<any>({});
    public Cart: BehaviorSubject<any> = new BehaviorSubject<any>(false);
    public MainHeader: BehaviorSubject<any> = new BehaviorSubject<any>(true);
    public RefreshUser: BehaviorSubject<any> = new BehaviorSubject<any>(false);
    public OrderSteps: BehaviorSubject<any> = new BehaviorSubject<any>(0);
    public rerun: BehaviorSubject<any> = new BehaviorSubject<any>(0);
}