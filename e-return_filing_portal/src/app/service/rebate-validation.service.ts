import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class RebateValidationService {
  returnData = {
    "validate": false,
    "input_id": "",
    "indexNo": "0"
  }

  constructor(
    private toastr: ToastrService,
    private datepipe: DatePipe,
  ) { }

  validateLifeInsurancePremium(lipData : any ) : any
  {
    this.returnData.validate = true;
    lipData.controls.forEach((element, index) => {
      if((element.value.policyNumber == null || element.value.policyNumber == '' || element.value.policyNumber == 0) &&  this.returnData.validate)
      {
        this.toastr.warning('Life Insurance Policy Number is required!.', '', {
          timeOut: 1000,
        });
        this.returnData.validate = false;
        this.returnData.indexNo = index;
        // this.returnData.input_id = "lip_policyNo_"+index;
        this.returnData.input_id = "";
        return;
      }
      else if((element.value.insuranceCompany == null || element.value.insuranceCompany == '') &&  this.returnData.validate)
      {
        this.toastr.warning('Insurance Company is required!.', '', {
          timeOut: 1000,
        });
        this.returnData.validate = false;
        this.returnData.indexNo = index;
        this.returnData.input_id = "";
        return;
      }
      else if((element.value.policyValue == null || element.value.policyValue == '') &&  this.returnData.validate)
      {
        this.toastr.warning('Policy Value is required!.', '', {
          timeOut: 1000,
        });
        this.returnData.validate = false;
        this.returnData.indexNo = index;
        this.returnData.input_id = "";
        return;
      }
      else if((element.value.premiumPaid == null || element.value.premiumPaid == '') &&  this.returnData.validate)
      {
        this.toastr.warning('Premium Paid is required!.', '', {
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

  validateDepositPensionScheme(dpsData : any ) : any
  {
    this.returnData.validate = true;
    dpsData.controls.forEach((element, index) => {
      if((element.value.bankorFI == null || element.value.bankorFI == '') &&  this.returnData.validate)
      {
        this.toastr.warning('Bank/FI is required!.', '', {
          timeOut: 1000,
        });
        this.returnData.validate = false;
        this.returnData.indexNo = index;
        this.returnData.input_id = "";
        return;
      }
      else if((element.value.accountNo == null || element.value.accountNo == '') &&  this.returnData.validate)
      {
        this.toastr.warning('Account No is required!.', '', {
          timeOut: 1000,
        });
        this.returnData.validate = false;
        this.returnData.indexNo = index;
        this.returnData.input_id = "";
        return;
      }
      else if((element.value.depositAmount == null || element.value.depositAmount == '' || element.value.depositAmount == 0) &&  this.returnData.validate)
      {
        this.toastr.warning('Deposit Amount is required!.', '', {
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

  validateSavingCertificate(savingCertificateData : any) : any
  {
    this.returnData.validate = true;
    savingCertificateData.controls.forEach((element, index) => {
      if((element.value.name == null || element.value.name == '') &&  this.returnData.validate)
      {
        this.toastr.warning('Name is required!.', '', {
          timeOut: 1000,
        });
        this.returnData.validate = false;
        this.returnData.indexNo = index;
        this.returnData.input_id = "";
        return;
      }
      else if((element.value.registrationNo == null || element.value.registrationNo == '') &&  this.returnData.validate)
      {
        this.toastr.warning('Registration No is required!.', '', {
          timeOut: 1000,
        });
        this.returnData.validate = false;
        this.returnData.indexNo = index;
        this.returnData.input_id = "";
        return;
      }
      else if((element.value.issueDate == null || element.value.issueDate == '') &&  this.returnData.validate)
      {
        this.toastr.warning('Issue Date is required!.', '', {
          timeOut: 1000,
        });
        this.returnData.validate = false;
        this.returnData.indexNo = index;
        this.returnData.input_id = "";
        return;
      }
      else if((element.value.investment == null || element.value.investment == '' || element.value.investment == 0) &&  this.returnData.validate)
      {
        this.toastr.warning('Investment Amount is required!.', '', {
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
  validateGeneralProvidentFund(gpfData : any) : any
  {
    this.returnData.validate = true;
    gpfData.controls.forEach((element, index) => {
      if((element.value.gpfAccountNo == null || element.value.gpfAccountNo == '') &&  this.returnData.validate)
      {
        this.toastr.warning('Account No is required!.', '', {
          timeOut: 1000,
        });
        this.returnData.validate = false;
        this.returnData.indexNo = index;
        this.returnData.input_id = "";
        return;
      }
      else if((element.value.contribution == null || element.value.contribution == '' || element.value.contribution == 0) &&  this.returnData.validate)
      {
        this.toastr.warning('Contribution is required!.', '', {
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

 validateBenevolentFund(dataObj : any):any
 {
  this.returnData.validate = true;
  if(dataObj != null)
  {
    if(dataObj.RB_BENEVOLENT_AMT ==null || dataObj.RB_BENEVOLENT_AMT == ''){
      this.toastr.warning('Contribution of Benevolent Fund is required!.', '', {
        timeOut: 1000,
      });
      this.returnData.validate = false;
      this.returnData.input_id = "";
      return;
    }
    else if(dataObj.RB_INVESTMENT_AMT == null || dataObj.RB_INVESTMENT_AMT == ''){
      this.toastr.warning('Group Insurance Premium is required!.', '', {
        timeOut: 1000,
      });
      this.returnData.validate = false;
      this.returnData.input_id = "";
      return;
    }
  }
  return this.returnData;
 } 

  validateRecognizedProvidentFund(rpfData : any) : any
  {
    this.returnData.validate = true;
    rpfData.controls.forEach((element, index) => {
      if((element.value.employerName == null || element.value.employerName == '') &&  this.returnData.validate)
      {
        this.toastr.warning('Employer Name is required!.', '', {
          timeOut: 1000,
        });
        this.returnData.validate = false;
        this.returnData.indexNo = index;
        this.returnData.input_id = "";
        return;
      }
      else if((element.value.selfContribution == null || element.value.selfContribution == '') &&  this.returnData.validate)
      {
        this.toastr.warning('Self Contribution is required!.', '', {
          timeOut: 1000,
        });
        this.returnData.validate = false;
        this.returnData.indexNo = index;
        this.returnData.input_id = "";
        return;
      }
      else if((element.value.employerContribution == null || element.value.employerContribution == '') &&  this.returnData.validate)
      {
        this.toastr.warning('Employer Contribution is required!.', '', {
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

  validateApprovedStocksShares(assData : any) : any
  {
    this.returnData.validate = true;
    assData.controls.forEach((element, index) => {
      if((element.value.boAccountNo == null || element.value.boAccountNo == '') &&  this.returnData.validate)
      {
        this.toastr.warning('BO Account No is required!.', '', {
          timeOut: 1000,
        });
        this.returnData.validate = false;
        this.returnData.indexNo = index;
        this.returnData.input_id = "";
        return;
      }
      else if((element.value.brokerageHouseName == null || element.value.brokerageHouseName == '') &&  this.returnData.validate)
      {
        this.toastr.warning('Brokerage House Name is required!.', '', {
          timeOut: 1000,
        });
        this.returnData.validate = false;
        this.returnData.indexNo = index;
        this.returnData.input_id = "";
        return;
      }
      else if((element.value.investmentDuringtheYear == null || element.value.investmentDuringtheYear == '') &&  this.returnData.validate)
      {
        this.toastr.warning('Investment During the Year is required!.', '', {
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

  validateOther_schedule6(schedule6Data : any) : any
  {
    this.returnData.validate = true;
    schedule6Data.controls.forEach((element, index) => {
      if((element.value.paragraphNumber == null || element.value.paragraphNumber == '') &&  this.returnData.validate)
      {
        this.toastr.warning('Paragraph Number is required!.', '', {
          timeOut: 1000,
        });
        this.returnData.validate = false;
        this.returnData.indexNo = index;
        this.returnData.input_id = "";
        return;
      }
      else if((element.value.description == null || element.value.description == '') &&  this.returnData.validate)
      {
        this.toastr.warning('Description is required!.', '', {
          timeOut: 1000,
        });
        this.returnData.validate = false;
        this.returnData.indexNo = index;
        this.returnData.input_id = "";
        return;
      }
      else if((element.value.amount == null || element.value.amount == '') &&  this.returnData.validate)
      {
        this.toastr.warning('Amount is required!.', '', {
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
  validateOther_UnderSRO(otherSROData : any) : any
  {
    this.returnData.validate = true;
    otherSROData.controls.forEach((element, index) => {
      if((element.value.sroNo == null || element.value.sroNo == '') &&  this.returnData.validate)
      {
        this.toastr.warning('SRO No is required!.', '', {
          timeOut: 1000,
        });
        this.returnData.validate = false;
        this.returnData.indexNo = index;
        this.returnData.input_id = "";
        return;
      }
      else if((element.value.sroYear == null || element.value.sroYear == '') &&  this.returnData.validate)
      {
        this.toastr.warning('Year is required!.', '', {
          timeOut: 1000,
        });
        this.returnData.validate = false;
        this.returnData.indexNo = index;
        this.returnData.input_id = "";
        return;
      }
      else if((element.value.sroDescription == null || element.value.sroDescription == '') &&  this.returnData.validate)
      {
        this.toastr.warning('Description is required!.', '', {
          timeOut: 1000,
        });
        this.returnData.validate = false;
        this.returnData.indexNo = index;
        this.returnData.input_id = "";
        return;
      }
      else if((element.value.sroAmount == null || element.value.sroAmount == '') &&  this.returnData.validate)
      {
        this.toastr.warning('Amount is required!.', '', {
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
