import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaidTaxUs19AAAAAListComponent } from './paid-tax-us19-aaaaa-list.component';

describe('PaidTaxUs19AAAAAListComponent', () => {
  let component: PaidTaxUs19AAAAAListComponent;
  let fixture: ComponentFixture<PaidTaxUs19AAAAAListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaidTaxUs19AAAAAListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaidTaxUs19AAAAAListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
