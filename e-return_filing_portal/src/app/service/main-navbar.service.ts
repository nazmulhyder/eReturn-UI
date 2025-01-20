import { Injectable } from '@angular/core';
import { HeadsOfIncomeService } from '../user-pannel/heads-of-income.service';
import { IncomeHeads } from './main-navbar';

@Injectable({
  providedIn: 'root'
})
export class mainNavbarListService {
  private incomeHeads:IncomeHeads = new IncomeHeads(this.headService);
  mainNavbarList=[];
  
  selectedMainNavbar=[];
  constructor(private headService: HeadsOfIncomeService) {
   }


  getMainNavbarList() : any[] {
    const result = [];
    for (let i = 0; i<this.selectedMainNavbar.length; i++) {
      this.mainNavbarList.forEach(item => {
        if (item['id'] === this.selectedMainNavbar[i]['id']) {
          result.push(item);
        }
      })
    }
    return result;
  }

  addSelectedMainNavbar(heads: any) {
    // debugger;
    this.mainNavbarList= this.incomeHeads.getAllMainNavbar();
    this.selectedMainNavbar = [];
    this.selectedMainNavbar.push(this.mainNavbarList[0]);
    if(this.headService.getHeads().length >= 1) {
      this.selectedMainNavbar.push(this.mainNavbarList[1]);
    } if (heads['isInvestmentforTaxRebate']==true) {
      this.selectedMainNavbar.push(this.mainNavbarList[2]);
    } if (true) {
      this.selectedMainNavbar.push(this.mainNavbarList[3]);
    } if (heads['isGrossWealthOver4Lakhs']==1 || heads['isOwnmotorCar']==1 || heads['isHaveHouseProperty']==1 || heads['isIT10BNotMandatory']==1) {
      this.selectedMainNavbar.push(this.mainNavbarList[4]);
    } 
    this.selectedMainNavbar.push(this.mainNavbarList[5]);
    this.selectedMainNavbar.push(this.mainNavbarList[6]);
    // this.selectedMainNavbar.push(this.mainNavbarList[7]);
    return this.selectedMainNavbar;
  }

  // this is only write for page reload
  // we can use previos function but it sometimes occur problem for navbar where income button not showing
  addSelectedMainNavbarOnPageReload(heads: any,headTitle:string) {
    this.mainNavbarList= this.incomeHeads.getAllMainNavbar();
    this.selectedMainNavbar = [];
    this.selectedMainNavbar.push(this.mainNavbarList[0]);
    if(headTitle!='') {
      this.selectedMainNavbar.push(this.mainNavbarList[1]);
    } if (heads['isInvestmentforTaxRebate']==true) {
      this.selectedMainNavbar.push(this.mainNavbarList[2]);
    } if (true) {
      this.selectedMainNavbar.push(this.mainNavbarList[3]);
    } if (heads['isGrossWealthOver4Lakhs']==1 || heads['isOwnmotorCar']==1 || heads['isHaveHouseProperty']==1 || heads['isIT10BNotMandatory']==1) {
      this.selectedMainNavbar.push(this.mainNavbarList[4]);
    } 
    this.selectedMainNavbar.push(this.mainNavbarList[5]);
    this.selectedMainNavbar.push(this.mainNavbarList[6]);
    // this.selectedMainNavbar.push(this.mainNavbarList[7]);
    return this.selectedMainNavbar;
  }

}
