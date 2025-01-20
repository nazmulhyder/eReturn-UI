import {Injectable} from "@angular/core";
import {HeadsOfIncome} from "./heads-of-income";
import {FirmItems} from "./firm-items"

@Injectable({
  providedIn: 'root',
})
export class HeadsOfIncomeService {
  headsOfIncome = HeadsOfIncome;
  firmItems = FirmItems;
  selectedItems = [];
  selectedFirmItems= [];
  firstSelectedFirm = 0;

  getHeads() : any[] {
    const result = [];
    for (let i = 0; i<this.selectedItems.length; i++) {
      this.headsOfIncome.forEach(item => {
        if (item['id'] === this.selectedItems[i]['id']) {
          result.push(item);
        }
      })
    }
    return result;
  }

  getFirmItems() : any[] {
    const result = [];
    for (let i = 0; i<this.selectedFirmItems.length; i++) {
      this.firmItems.forEach(item => {
        if (item['id'] === this.selectedFirmItems[i]['id']) {
          if(i == 0) {
            this.firstSelectedFirm = item['id'];
          }
          result.push(item);
        }
      })
    }
    return result;
  }

  getFirstSelectedFirmItem() {
    return this.firstSelectedFirm;
  }

  addSelectedItems(heads: any) {
    this.selectedItems = [];
    this.selectedFirmItems = [];
    if (heads['salaries'].value) {
      this.selectedItems.push(this.headsOfIncome[0]);
    } if (heads['security'].value) {
      this.selectedItems.push(this.headsOfIncome[1]);
    } if (heads['houseProperty'].value) {
      this.selectedItems.push(this.headsOfIncome[2]);
    } if (heads['agriculture'].value) {
      this.selectedItems.push(this.headsOfIncome[3]);
    } if (heads['businessProfession'].value) {
      this.selectedItems.push(this.headsOfIncome[4]);
    } if (heads['capital'].value) {
      this.selectedItems.push(this.headsOfIncome[5]);
    } if (heads['others'].value) {
      this.selectedItems.push(this.headsOfIncome[6]);
    }
    if (heads['firm'].value || heads['aop'].value || heads['outsideIncome'].value || heads['spouseChild'].value) {
      this.selectedItems.push(this.headsOfIncome[7]);
      if(heads['firm'].value) this.selectedFirmItems.push(this.firmItems[0]);
      if(heads['aop'].value) this.selectedFirmItems.push(this.firmItems[1]);
      if(heads['outsideIncome'].value) this.selectedFirmItems.push(this.firmItems[2]);
      if(heads['spouseChild'].value) this.selectedFirmItems.push(this.firmItems[3]);
    } 
    if (heads['taxExemptedIncome'].value) {
      this.selectedItems.push(this.headsOfIncome[8]);
    }
  }
}
