import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class FirmEtcValidationService {
  returnData = {
    "validate": false,
    "input_id": "",
    "indexNo": "0"
  }
  constructor(
    private toastr: ToastrService,
    private datepipe: DatePipe,
  ) { }

  firmValidate(firmData: any): any {
    this.returnData.validate = true;
    firmData.controls.forEach((element, index) => {
      if (element.value.FirmName == null || element.value.FirmName == '') {
        this.toastr.warning('Name of the Firm is required!', '', {
          timeOut: 1000,
        });
        this.returnData.validate = false;
        this.returnData.indexNo = index;
        this.returnData.input_id = "";
        return;
      }
      else if (element.value.tinOfFirm == null || element.value.tinOfFirm.length != 12) {
        this.toastr.warning('12 digit TIN is required!', '', {
          timeOut: 1000,
        });
        this.returnData.validate = false;
        this.returnData.indexNo = index;
        this.returnData.input_id = "";
        return;
      }
      else if (element.value.FirmTotalIncome == null || element.value.FirmTotalIncome == '') {
        this.toastr.warning('Total Income of the Firm is required!', '', {
          timeOut: 1000,
        });
        this.returnData.validate = false;
        this.returnData.indexNo = index;
        this.returnData.input_id = "";
        return;
      }
      else if (element.value.FirmTaxpayerSharedIncome == null || element.value.FirmTaxpayerSharedIncome == '') {
        this.toastr.warning("Taxpayer's Share of Income is required!", '', {
          timeOut: 1000,
        });
        this.returnData.validate = false;
        this.returnData.indexNo = index;
        this.returnData.input_id = "";
        return;
      }
    })

    return this.returnData;
  }
  aopValidate(aopData: any): any {
    this.returnData.validate = true;
    aopData.controls.forEach((element, index) => {
      if (element.value.AoPName == null || element.value.AoPName == '') {
        this.toastr.warning('Name of the AoP is required!', '', {
          timeOut: 1000,
        });
        this.returnData.validate = false;
        this.returnData.indexNo = index;
        this.returnData.input_id = "";
        return;
      }
      else if (element.value.tinOfAoP == null || element.value.tinOfAoP.length != 12) {
        this.toastr.warning('12 digit TIN is required!', '', {
          timeOut: 1000,
        });
        this.returnData.validate = false;
        this.returnData.indexNo = index;
        this.returnData.input_id = "";
        return;
      }
      else if (element.value.AoPTotalIncome == null || element.value.AoPTotalIncome == '') {
        this.toastr.warning('Total Income of the Firm is required!', '', {
          timeOut: 1000,
        });
        this.returnData.validate = false;
        this.returnData.indexNo = index;
        this.returnData.input_id = "";
        return;
      }
      else if (element.value.AoPTaxpayerSharedIncome == null || element.value.AoPTaxpayerSharedIncome == '') {
        this.toastr.warning("Taxpayer's Share of Income is required!", '', {
          timeOut: 1000,
        });
        this.returnData.validate = false;
        this.returnData.indexNo = index;
        this.returnData.input_id = "";
        return;
      }
    })
    return this.returnData;
  }
  foreignIncomeValidate(foreignIncomeData: any): any {
    this.returnData.validate = true;
    foreignIncomeData.controls.forEach((element, index) => {
      if (element.value.ForeignIncome == null || element.value.ForeignIncome == '') {
        this.toastr.warning("Gross Foreign Income is required!", '', {
          timeOut: 1000,
        });
        this.returnData.validate = false;
        this.returnData.indexNo = index;
        this.returnData.input_id = "";
        return;
      }
      else if (element.value.ForeignSourceIncome == null || element.value.ForeignSourceIncome == '') {
        this.toastr.warning("Source of Income is required!", '', {
          timeOut: 1000,
        });
        this.returnData.validate = false;
        this.returnData.indexNo = index;
        this.returnData.input_id = "";
        return;
      }
      else if (element.value.CountryOrigin == null || element.value.CountryOrigin == '' || element.value.CountryOrigin == '0') {
        this.toastr.warning("Country of Origin is required!", '', {
          timeOut: 1000,
        });
        this.returnData.validate = false;
        this.returnData.indexNo = index;
        this.returnData.input_id = "";
        return;
      }
    })
    return this.returnData;
  }
  spouseIncomeValidate(spouseData: any): any {
    this.returnData.validate = true;
    spouseData.controls.forEach((element, index) => {
      if (element.value.SpouseChildIncome == null || element.value.SpouseChildIncome == '') {
        this.toastr.warning("Net Income of Spouse/Minor Children is required!", '', {
          timeOut: 1000,
        });
        this.returnData.validate = false;
        this.returnData.indexNo = index;
        this.returnData.input_id = "";
        return;
      }
    })
    return this.returnData;
  }
 
}
