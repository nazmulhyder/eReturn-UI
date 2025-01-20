import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonFilerTaxpayerNoComponent } from './non-filer-taxpayer-no.component';

describe('NonFilerTaxpayerNoComponent', () => {
  let component: NonFilerTaxpayerNoComponent;
  let fixture: ComponentFixture<NonFilerTaxpayerNoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonFilerTaxpayerNoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NonFilerTaxpayerNoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
