import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AgricultureValidationService {
  returnData = {
    "validate" : false,
    "input_id" : "",
    "indexNo" : "0"
  }

  constructor(
    private toastr: ToastrService,
  ) { }

  agricultureValidate(agriData : any) : any
  {
    this.returnData.validate = true;
    agriData.controls.forEach((element, index) => {
      // no select any type validation
      if (element.value.agricultureType === 0 && this.returnData.validate) 
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
      else if ((element.value.agricultureType === 'cultivation' || element.value.agricultureType === 'prod_of_tea_rubber' || element.value.agricultureType === 'prod_of_corn_sugar_beet' || element.value.agricultureType === 'other_agricultural_income') && this.returnData.validate)
      {
         if(element.value.totalCultivationArea == '' || element.value.totalCultivationArea == null || element.value.totalCultivationArea==0)
         {
          this.toastr.warning('Total Cultivation Area is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "totalCulArea_ID";
          return;
         }
         else if(element.value.particularOfProduces == '' || element.value.totalCultivationArea == null)
         {
          this.toastr.warning('Particular of Produces is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "particular_of_produces_ID";
          return;
         }
         else if(element.value.salesProceed == '' || element.value.salesProceed == null || element.value.salesProceed == 0)
         {
          this.toastr.warning('Sales Proceed is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
         }
         else if(element.value.costOfProduction == '' || element.value.costOfProduction == null || element.value.costOfProduction == 0)
         {
          this.toastr.warning('Cost of Production is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
         }
      }
         //AgricultureType : income from barga adhi
         else if (element.value.agricultureType === 'income_form_barga_adhi' && this.returnData.validate)
         {
            if(element.value.totalCultivationArea == '' || element.value.totalCultivationArea == null || element.value.totalCultivationArea==0)
            {
             this.toastr.warning('Total Cultivation Area is required!.', '', {
               timeOut: 1000,
             });
             this.returnData.validate = false;
             this.returnData.indexNo = index;
             this.returnData.input_id = "totalCulArea_ID";
             return;
            }
            else if(element.value.particularOfProduces == '' || element.value.totalCultivationArea == null)
            {
             this.toastr.warning('Particular of Produces is required!.', '', {
               timeOut: 1000,
             });
             this.returnData.validate = false;
             this.returnData.indexNo = index;
             this.returnData.input_id = "particular_of_produces_ID";
             return;
            }
            else if(element.value.totalRecipt == '' || element.value.totalRecipt == null || element.value.totalRecipt == 0)
            {
             this.toastr.warning('Total Receipt to the Taxpayer is required!.', '', {
               timeOut: 1000,
             });
             this.returnData.validate = false;
             this.returnData.indexNo = index;
             this.returnData.input_id = "";
             return;
            }
            else if(element.value.chkTinOrNid==='0' && element.value.nidOrTIN.length != 12)
            {
              this.toastr.warning('TIN must be 12 digit!', '', {
                timeOut: 1000,
              });
             this.returnData.validate = false;
             this.returnData.indexNo = index;
             this.returnData.input_id = "";
              return;
            }
            else if((element.value.chkTinOrNid==='1' && element.value.nidOrTIN.length != 10) && (element.value.chkTinOrNid==='1' && element.value.nidOrTIN.length != 13) && (element.value.chkTinOrNid==='1' && element.value.nidOrTIN.length != 17)){
              this.toastr.warning('NID must be 10/13/17 digit!', '', {
                timeOut: 1000,
              });
             this.returnData.validate = false;
             this.returnData.indexNo = index;
             this.returnData.input_id = "";
              return;
            }
         }
          //AgricultureType : Cultivation,production of tea or rubber, sugar beet
      else if (element.value.agricultureType === 'income_exp_reduced_by_sro' && this.returnData.validate)
      {
         if(element.value.totalCultivationArea == '' || element.value.totalCultivationArea == null || element.value.totalCultivationArea==0)
         {
          this.toastr.warning('Total Cultivation Area is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "totalCulArea_ID";
          return;
         }
         else if(element.value.particularOfProduces == '' || element.value.totalCultivationArea == null)
         {
          this.toastr.warning('Particular of Produces is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "particular_of_produces_ID";
          return;
         }
         else if(element.value.salesProceed == '' || element.value.salesProceed == null || element.value.salesProceed == 0)
         {
          this.toastr.warning('Sales Proceed is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
         }
         else if(element.value.costOfProduction == '' || element.value.costOfProduction == null || element.value.costOfProduction == 0)
         {
          this.toastr.warning('Cost of Production is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
         }
         else if(element.value.sroNoReference == '' || element.value.costOfProduction == null)
         {
          this.toastr.warning('SRO No./Reference is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
         }
         else if(element.value.year == '' || element.value.year == null)
         {
          this.toastr.warning('Year is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
         }
         else if(element.value.particular == '' || element.value.particular == null)
         {
          this.toastr.warning('Particular is required!.', '', {
            timeOut: 1000,
          });
          this.returnData.validate = false;
          this.returnData.indexNo = index;
          this.returnData.input_id = "";
          return;
         }
         else if(element.value.taxApplicable == '' || element.value.taxApplicable == null || element.value.taxApplicable == 0)
         {
          this.toastr.warning('Tax Applicable is required!.', '', {
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
