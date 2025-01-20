import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnSummaryComponent } from './return-summary.component';

describe('ReturnSummaryComponent', () => {
  let component: ReturnSummaryComponent;
  let fixture: ComponentFixture<ReturnSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReturnSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
