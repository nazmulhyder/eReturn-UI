import { TestBed } from '@angular/core/testing';

import { MainNavbarService } from './main-navbar.service';

describe('MainNavbarService', () => {
  let service: MainNavbarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MainNavbarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
