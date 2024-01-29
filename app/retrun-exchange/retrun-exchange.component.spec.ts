import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetrunExchangeComponent } from './retrun-exchange.component';

describe('RetrunExchangeComponent', () => {
  let component: RetrunExchangeComponent;
  let fixture: ComponentFixture<RetrunExchangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetrunExchangeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetrunExchangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
