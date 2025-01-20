import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaidTaxUs19AAAAANoComponent } from './paid-tax-us19-aaaaa-no.component';

describe('PaidTaxUs19AAAAANoComponent', () => {
  let component: PaidTaxUs19AAAAANoComponent;
  let fixture: ComponentFixture<PaidTaxUs19AAAAANoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaidTaxUs19AAAAANoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaidTaxUs19AAAAANoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
