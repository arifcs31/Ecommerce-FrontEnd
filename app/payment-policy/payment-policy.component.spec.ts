import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentPolicyComponent } from './payment-policy.component';

describe('PrivacyComponent', () => {
  let component: PaymentPolicyComponent;
  let fixture: ComponentFixture<PaymentPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentPolicyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
