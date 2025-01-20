import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CapitalGainValidationService {

  returnData = {
    "validate": false,
    "input_id": "",
    "indexNo": "0"
  }

  constructor(
    private toastr: ToastrService,
    private datepipe: DatePipe,
  ) { }

  capitalGainValidate(capitalData: any): any {
    this.returnData.validate = true;
    capitalData.controls.forEach((element, index) => {
      if (element.value.gainType === 0 && this.returnData.validate) {
        this.toastr.warning('Please select a type!', '', {
          timeOut: 1000,
        });
        this.returnData.validate = false;
        this.returnData.indexNo = index;
        this.returnData.input_id = "";
        return;
      }
      else if ((element.value.gainType === 'Transfer_of_Property_Land' || element.value.gainType === 'Transfer_of_Property_House_Apartment') && this.returnData.validate) {
        if (element.value.descriptionofProperty == '' || element.value.descriptionofProperty == null) {
          this.toastr.warning('Description of the Property is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
        }
        else if (element.value.gainType === 'Transfer_of_Property_Land' && (element.value.totalArea == '' || element.value.totalArea == null)) {
          this.toastr.warning('Total Area is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
        }
        else if (element.value.gainType === 'Transfer_of_Property_House_Apartment' && (element.value.landArea == '' || element.value.landArea == null)) {
          this.toastr.warning('Land Area is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
        }
        else if (element.value.gainType === 'Transfer_of_Property_House_Apartment' && (element.value.flatArea == '' || element.value.flatArea == null)) {
          this.toastr.warning('Flat/Building Area is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
        }
        else if (element.value.tinofBuyer == '' || element.value.tinofBuyer == null || element.value.tinofBuyer.length != 12) {
          this.toastr.warning('TIN of Buyer is required!.It should be 12 digit.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
        }
        else if (element.value.deedNo == '' || element.value.deedNo == null) {
          this.toastr.warning('Deed No is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
        }
        else if (element.value.dateofDeed == '' || element.value.dateofDeed == null) {
          this.toastr.warning('Date of Deed is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
        }
        else if (element.value.subRegisterOffice == '' || element.value.subRegisterOffice == null) {
          this.toastr.warning('Sub Registrar Office entry is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
        }
        else if (element.value.saleDeedValue == '' || element.value.saleDeedValue == null) {
          this.toastr.warning('Sale Deed Value is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
        }
        else if (element.value.taxDeductatSource == '' || element.value.taxDeductatSource == null) {
          this.toastr.warning('Tax Deducted/Collected at Source is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
        }
      }
      else if (element.value.gainType === 'Signing_Money_from_Developer' && this.returnData.validate) {
        if (element.value.descriptionofProperty == '' || element.value.descriptionofProperty == null) {
          this.toastr.warning('Description of the Property is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
        }
        else if (element.value.totalArea == '' || element.value.totalArea == null) {
          this.toastr.warning('Total Area is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
        }
        else if (element.value.nameofDeveloper == '' || element.value.nameofDeveloper == null) {
          this.toastr.warning('Name of Real Estate Developer is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
        }
        else if (element.value.grossAmount == '' || element.value.grossAmount == null) {
          this.toastr.warning('Gross Amount is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
        }
        else if (element.value.taxDeductatSource == '' || element.value.taxDeductatSource == null) {
          this.toastr.warning('Tax Deducted/Collected at Source is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
        }
      }
      else if (element.value.gainType === 'Compensation_Against_Property_Acquisition' && this.returnData.validate) {
        if (element.value.descriptionofProperty == '' || element.value.descriptionofProperty == null) {
          this.toastr.warning('Description of the Property is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
        }
        else if (element.value.totalArea == '' || element.value.totalArea == null) {
          this.toastr.warning('Total Area is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
        }
        else if (element.value.acquisitionAuthority == '' || element.value.acquisitionAuthority == null) {
          this.toastr.warning('Acquisition Authority is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
        }
        else if (element.value.orderNo == '' || element.value.orderNo == null) {
          this.toastr.warning('Order no is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
        }
        else if (element.value.date == '' || element.value.date == null) {
          this.toastr.warning('Date is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
        }
        else if (element.value.grossAmount == '' || element.value.grossAmount == null) {
          this.toastr.warning('Gross Amount is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
        }
        else if (element.value.taxDeductatSource == '' || element.value.taxDeductatSource == null) {
          this.toastr.warning('Tax Deducted/Collected at Source is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
        }
      }
      else if (element.value.gainType === 'Transfer_of_Share_Securities_of_Listed_Company' && this.returnData.validate) {
        if (element.value.nameOfCompany == '' || element.value.nameOfCompany == null) {
          this.toastr.warning('Name of the Company is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
        }
        else if (element.value.transferNo == '' || element.value.transferNo == null) {
          this.toastr.warning('Transfer No is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
        }
        else if (element.value.dateofTransfer == '' || element.value.dateofTransfer == null) {
          this.toastr.warning('Date of Transfer is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
        }
        else if (element.value.numberofShares == '' || element.value.numberofShares == null) {
          this.toastr.warning('No of Share Transfer is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
        }
        else if (element.value.saleValueofShare == '' || element.value.saleValueofShare == null) {
          this.toastr.warning('Sale Value of Share is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
        }
        else if (element.value.costValueofShare == '' || element.value.costValueofShare == null) {
          this.toastr.warning('Cost Value of Share is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
        }
        else if (element.value.taxDeductatSource == '' || element.value.taxDeductatSource == null) {
          this.toastr.warning('Tax Deducted/Collected at Source is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
        }
      }
      else if ((element.value.gainType === 'Other_Capital_Gain' || element.value.gainType === 'Gain_Exempted_or_Reduced_Tax_Rate_by_SRO') && this.returnData.validate) {
        let acquisitionDate: any, convertedAcqDate: any, alienationDate: any, convertedAliDate: any; let isAliDateGreateThnAcqDate: boolean;
        acquisitionDate = element.value.dateofAcquisition ? moment(element.value.dateofAcquisition, 'DD-MM-YYYY') : '';
        convertedAcqDate = this.datepipe.transform(acquisitionDate, 'dd-MM-yyyy');

        alienationDate = element.value.dateofAlienation ? moment(element.value.dateofAlienation, 'DD-MM-YYYY') : '';
        convertedAliDate = this.datepipe.transform(alienationDate, 'dd-MM-yyyy');
        isAliDateGreateThnAcqDate = (convertedAcqDate == null || convertedAliDate == null) ? false : this.dateValidation(convertedAcqDate, convertedAliDate);

        if (element.value.descriptionofAsset == '' || element.value.descriptionofAsset == null) {
          this.toastr.warning('Description of the Asset is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
        }
        else if (element.value.descriptionofAsset == '' || element.value.descriptionofAsset == null) {
          this.toastr.warning('Description of the Asset is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
        }
        else if((element.value.tinorNid != null && element.value.tinorNid != "") &&  (element.value.tinorNid.length != 10 && element.value.tinorNid.length != 12 && element.value.tinorNid.length != 13 && element.value.tinorNid.length != 17))
        {
          this.toastr.warning('TIN/NID should be 10/12/13/17 digit', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
        }
        else if (element.value.dateofAcquisition == '' || element.value.dateofAcquisition == null) {
          this.toastr.warning('Date of Acquisition is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
        }
        else if (element.value.dateofAlienation == '' || element.value.dateofAlienation == null) {
          this.toastr.warning('Date of Alienation is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
        }
        else if (!isAliDateGreateThnAcqDate) {
          this.toastr.warning('Date of Alienation always greater than Date of Acquisition!', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
        }
        else if (element.value.salesValue == '' || element.value.salesValue == null) {
          this.toastr.warning('Sales Value/Fair Market Value is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
        }
        else if (element.value.gainType === 'Gain_Exempted_or_Reduced_Tax_Rate_by_SRO' && (element.value.sroNo == '' || element.value.sroNo == null)) {
          this.toastr.warning('SRO No is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
        }
        else if (element.value.gainType === 'Gain_Exempted_or_Reduced_Tax_Rate_by_SRO' && (element.value.year == '' || element.value.year == null)) {
          this.toastr.warning('Year is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
        }
        else if (element.value.gainType === 'Gain_Exempted_or_Reduced_Tax_Rate_by_SRO' && (element.value.particularofSro == '' || element.value.particularofSro == null)) {
          this.toastr.warning('Particular of the SRO is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
        }
        else if (element.value.gainType === 'Gain_Exempted_or_Reduced_Tax_Rate_by_SRO' && (element.value.incomeExemptedfromTax == '' || element.value.incomeExemptedfromTax == null)) {
          this.toastr.warning('Income Exempted from Tax is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
        }
        else if (element.value.gainType === 'Gain_Exempted_or_Reduced_Tax_Rate_by_SRO' && (element.value.applicableTaxasperSro == '' || element.value.applicableTaxasperSro == null)) {
          this.toastr.warning('Applicable Tax as per SRO is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
        }
      }
    });

    return this.returnData;
  }

  dateValidation(dateOfAcq, dateOfAli,): boolean {
    let acquisitionDate = +(new Date()) - +(this.formattingDate(dateOfAcq));
    let alienationDate = +(new Date()) - +(this.formattingDate(dateOfAli));

    if (acquisitionDate > alienationDate)
      return true;
    else
      return false;
  }

  formattingDate(inputDate: string): Date {
    let _day: any, _month: any, _year: any, formatDate: any;
    _day = inputDate.substring(0, 2);
    _month = inputDate.substring(3, 5);
    _year = inputDate.substring(6, 12);
    formatDate = _month + '/' + _day + '/' + _year;
    return new Date(formatDate);
  }
}

