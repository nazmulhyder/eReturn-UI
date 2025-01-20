import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class BusinessValidationService {

  returnData = {
    "validate" : false,
    "input_id" : "",
    "indexNo" : "0"
  }

  constructor(
    private toastr: ToastrService,
  ) { }

  businessValidate(businessData : any) : any
  {
    this.returnData.validate = true;
    businessData.controls.forEach((element, index) => {
      // no select any type validation
      if (element.value.businessCategoryType === 0 && this.returnData.validate) 
      {
        this.toastr.warning('Please select a type!', '', {
          timeOut: 1000,
        });
        this.returnData.validate = false;
        this.returnData.indexNo = index;
        this.returnData.input_id = "";
        return;
      }
      //AgricultureType : Cultivation,production of tea or rubber, sugar beet
      else if((element.value.businessCategoryType === 'REG_BUS_PROF' || element.value.businessCategoryType === 'BSMT_CONTRACT_OR_SUPPLY' || element.value.businessCategoryType === 'BSMT_REAL_EST_OR_LAND'  || element.value.businessCategoryType === 'BSMT_IMPORT' || element.value.businessCategoryType === 'BSMT_EXP_OF_MAN'
      || element.value.businessCategoryType === 'BSMT_EXP_US_53BB' || element.value.businessCategoryType === 'BSMT_EXP_US_53BBBB' || element.value.businessCategoryType === 'BSMT_C_F_AGENCY' || element.value.businessCategoryType === 'BSMT_SHIP_BUS'|| element.value.businessCategoryType === 'BSMT_DSTR_OF_COMP'
      || element.value.businessCategoryType === 'BSMT_AGENCY_FOREIGN_BUYER' || element.value.businessCategoryType === 'BSMT_OTHER_BUS_SUB_MIN_TAX' || element.value.businessCategoryType === 'TOBACCO_BUS' || element.value.businessCategoryType === 'TEA_RUB' || element.value.businessCategoryType === 'EXEMPT_OR_REDUCED_SRO')  && this.returnData.validate)
      // else if ((element.value.agricultureType === 'cultivation' || element.value.agricultureType === 'prod_of_tea_rubber' || element.value.agricultureType === 'prod_of_corn_sugar_beet' || element.value.agricultureType === 'other_agricultural_income') && this.returnData.validate)
      {
         if(element.value.businessCategoryType != 'TEA_RUB' && (element.value.businessTypeName == '' || element.value.businessTypeName == null))
         {
          this.toastr.warning('Business Type is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
         }
         else if(element.value.businessCategoryType === 'TEA_RUB' && (element.value.totalCultivationArea == '' || element.value.totalCultivationArea == null || element.value.totalCultivationArea == 0))
         {
          this.toastr.warning('Total Cultivation Area is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
         }
         else if(element.value.businessCategoryType === 'TEA_RUB' && (element.value.commonParticulars == '' || element.value.commonParticulars == null))
         {
          this.toastr.warning('Particular of Produces is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
         }
         else if(element.value.businessCategoryType != 'TEA_RUB' && (element.value.businessName == '' || element.value.businessName == null))
         {
          this.toastr.warning('Business Name is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
         }
         else if(element.value.businessCategoryType != 'TEA_RUB' && (element.value.businessAddress == '' || element.value.businessAddress == null))
         {
          this.toastr.warning('Business Address is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
         }
         else if(element.value.businessCategoryType != 'TEA_RUB' && (element.value.salesTurnoverReceipts == '' || element.value.salesTurnoverReceipts == null))
         {
          this.toastr.warning('Sales/Turnover/Receipts is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
         }
         else if(element.value.businessCategoryType != 'TEA_RUB' && (element.value.grossProfit == '' || element.value.grossProfit == null))
         {
          this.toastr.warning('Gross Profit is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
         }
         else if(element.value.businessCategoryType != 'TEA_RUB' && (element.value.generalAdminisSellingAndOther == '' || element.value.generalAdminisSellingAndOther == null))
         {
          this.toastr.warning('General,Administrative,Selling and Other Expenses is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
         }
         else if(element.value.businessCategoryType === 'EXEMPT_OR_REDUCED_SRO' && (element.value.sroNoReference == '' || element.value.sroNoReference == null))
         {
          this.toastr.warning('SRO No./Reference  is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
         }
         else if(element.value.businessCategoryType === 'EXEMPT_OR_REDUCED_SRO' && (element.value.year == '' || element.value.year == null))
         {
          this.toastr.warning('Year is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
         }
         else if(element.value.businessCategoryType === 'EXEMPT_OR_REDUCED_SRO' && (element.value.commonParticulars == '' || element.value.commonParticulars == null))
         {
          this.toastr.warning('Particulars is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
         }
         else if(element.value.businessCategoryType === 'EXEMPT_OR_REDUCED_SRO' && (element.value.taxApplicable == '' || element.value.taxApplicable == null))
         {
          this.toastr.warning('Tax Applicable is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
         }
         else if((element.value.businessCategoryType === 'BSMT_CONTRACT_OR_SUPPLY' || element.value.businessCategoryType === 'BSMT_REAL_EST_OR_LAND' || element.value.businessCategoryType === 'BSMT_IMPORT' || element.value.businessCategoryType === 'BSMT_EXP_OF_MAN'
         || element.value.businessCategoryType === 'BSMT_EXP_US_53BB' || element.value.businessCategoryType === 'BSMT_EXP_US_53BBBB' || element.value.businessCategoryType === 'BSMT_C_F_AGENCY' || element.value.businessCategoryType === 'BSMT_SHIP_BUS'|| element.value.businessCategoryType === 'BSMT_DSTR_OF_COMP'
         || element.value.businessCategoryType === 'BSMT_AGENCY_FOREIGN_BUYER' || element.value.businessCategoryType === 'BSMT_OTHER_BUS_SUB_MIN_TAX') && (element.value.taxToDeducted == '' || element.value.taxToDeducted == null))
         {
          this.toastr.warning('Tax Deducted/Collected at Source is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
         }
         else if(element.value.businessCategoryType === 'BSMT_OTHER_BUS_SUB_MIN_TAX' && (element.value.releventSectionTDS == '' || element.value.releventSectionTDS == null))
         {
          this.toastr.warning('Relevant Section of TDS  is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
         }

         else if(element.value.businessCategoryType === 'TEA_RUB' && (element.value.salesTurnoverReceipts == '' || element.value.salesTurnoverReceipts == null))
         {
          this.toastr.warning('Sales Proceed is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
         }

         else if(element.value.businessCategoryType === 'TEA_RUB' && (element.value.costOfProduction == '' || element.value.costOfProduction == null))
         {
          this.toastr.warning('Cost of Production is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
         }

         else if(element.value.cashInHandandAtBank == '' || element.value.cashInHandandAtBank == null)
         {
          this.toastr.warning('Cash in Hand & at Bank is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
         }
         else if(element.value.inventories == '' || element.value.inventories == null)
         {
          this.toastr.warning('Inventories is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
         }
         else if(element.value.fixedAssets == '' || element.value.fixedAssets == null)
         {
          this.toastr.warning('Fixed Assets is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
         }
         else if(element.value.otherAssets == '' || element.value.otherAssets == null)
         {
          this.toastr.warning('Other Assets is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
         }
         else if(element.value.openingCapital == '' || element.value.openingCapital == null)
         {
          this.toastr.warning('Opening Capital is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
         }
         else if(element.value.withdrawalIncomeYear == '' || element.value.withdrawalIncomeYear == null)
         {
          this.toastr.warning('Withdrawals in the Income Year is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
         }
         else if(element.value.liabilities == '' || element.value.liabilities == null)
         {
          this.toastr.warning('Liabilities is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
         }
      }
      else if (element.value.businessCategoryType === 'BSMT_EXP_CASH_SUB' && this.returnData.validate) 
      {
        if(element.value.businessTypeName == '' || element.value.businessTypeName == null)
        {
         this.toastr.warning('Business Type is required!.', '', {
           timeOut: 1000,
         });
         this.returnData.validate = false;
         this.returnData.indexNo = index;
         this.returnData.input_id = "";
         return;
        }
        else if(element.value.commonParticulars == '' || element.value.commonParticulars == null)
        {
         this.toastr.warning('Particulars is required!.', '', {
           timeOut: 1000,
         });
         this.returnData.validate = false;
         this.returnData.indexNo = index;
         this.returnData.input_id = "";
         return;
        }
        else if(element.value.netProfit_1 == '' || element.value.netProfit_1 == null || element.value.netProfit_1 == 0)
        {
         this.toastr.warning('Amount of Cash Subsidy is required!.', '', {
           timeOut: 1000,
         });
         this.returnData.validate = false;
         this.returnData.indexNo = index;
         this.returnData.input_id = "";
         return;
        }
        else if(element.value.taxToDeducted == '' || element.value.taxToDeducted == null)
        {
          this.toastr.warning('Tax Deducted/Collected at Source is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
        }
        
      }
    })
    return this.returnData;
  }
}
