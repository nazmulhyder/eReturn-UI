import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurchargePayingTaxpayersNoComponent } from './surcharge-paying-taxpayers-no.component';

describe('SurchargePayingTaxpayersNoComponent', () => {
  let component: SurchargePayingTaxpayersNoComponent;
  let fixture: ComponentFixture<SurchargePayingTaxpayersNoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SurchargePayingTaxpayersNoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SurchargePayingTaxpayersNoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
