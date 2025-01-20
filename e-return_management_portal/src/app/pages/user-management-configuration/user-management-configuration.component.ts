import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { ApiUrl } from '../../custom-services/api-url/api-url';
import { ApiService } from '../../custom-services/ApiService';

@Component({
  selector: 'app-user-management-configuration',
  templateUrl: './user-management-configuration.component.html',
  styleUrls: ['./user-management-configuration.component.scss']
})
export class UserManagementConfigurationComponent implements OnInit {

  userManagementConfigForm: FormGroup;
  isDeleteBtnShow : boolean = false;
  minDateLen: any;
  maxDateLen: any;
  incomeYearFrom : any;
  apiService: ApiService;
  private serviceUrl: string;

  //validation error checking
  filing_showError = [];

  constructor(private fb: FormBuilder,
    apiService: ApiService,
    private datepipe: DatePipe,
    private toastr: ToastrService,
    private apiUrl: ApiUrl,
    private router: Router) { 
      this.apiService = apiService;
    }

  ngOnInit(): void {
    this.apiUrl.getUrl().subscribe(res => {
      
    });
    var date = new Date();
    this.minDateLen = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    this.maxDateLen = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    this.userManagementConfigForm = this.fb.group({

      UserMgt_Config: this.fb.array([this.fb.group({
        id : new FormControl(),
        Lbl_Name: new FormControl(),
        type: new FormControl(),
        value: new FormControl(),
        is_nullable : [false],
        has_validity : [true],
        valid_from: new FormControl(),
        valid_to: new FormControl(),
      })]),
    })
    this.GenerateErrorIndexes();

    this.getData();

  }

  getData()
  {
    let getData: any;
    this.apiService.get(environment.management_base_url + '/ereturnmanagement/v2/api/get-module-wise-config-info/'+'USER_MANAGEMENT')
      .subscribe(result => {
            getData = result.replyMessage;
            console.log('get data', getData);
            if(getData.length != 0)
            {
              
              this.isDeleteBtnShow = getData.length  == 1 ? false : true;
              this.table_1_List.clear();
              getData.forEach((element,index) => {    
                this.table_1_List.push(this.fb.group({
                  id: new FormControl(element.id),
                  Lbl_Name: new FormControl(element.key),
                  type: new FormControl(element.configKeyType),
                  value: new FormControl(element.value),
                  is_nullable : [element.nullable],
                  has_validity : [element.hasValidity],
                  valid_from: new FormControl(new Date(element.validFrom.toString())),
                  valid_to:  element.hasValidity == false ? null :   new FormControl(new Date(element.validTo.toString())),
                }));
                this.checkHasValidity(index); 
                this.GenerateErrorIndexes();
              })
            }

      })
  }

  get table_1_List() {
    return this.userManagementConfigForm.get('UserMgt_Config') as FormArray;
  }

  add_row_table_1() 
    {
      if(this.validateErrorIndexes())
      {
        this.table_1_List.push(this.fb.group({
          id : new FormControl(),
        Lbl_Name: new FormControl(),
        type: new FormControl(),
        value: new FormControl(),
        is_nullable : [false],
        has_validity : [true],
        valid_from: new FormControl(),
        valid_to: new FormControl(),
        }));
        this.isDeleteBtnShow = this.table_1_List.length === 1 ? false : true;
        this.GenerateErrorIndexes();
      }
  }

  delete_table_1_row(index,id) {
    this.isDeleteBtnShow = this.table_1_List.length === 1 ? false : true;
    if(id>0)
    {
      this.apiService.delete(environment.management_base_url + '/ereturnmanagement/v2/api/delete-config-info?id='+id)
      .subscribe(result => {
          if(result.success)
          {
            this.toastr.success( result.replyMessage, '', {
              timeOut: 1000,
            });
            this.table_1_List.removeAt(index);
           //#region navigate current url without reloading
           let currentUrl = this.router.url;
           this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
             this.router.navigate([currentUrl]);
           });
           //#endregion
          }
      })
    }
    else
    {
      this.table_1_List.removeAt(index);
    }

  }
  

  saveData()
  {
     let userMgt_config = [];

       this.table_1_List.controls.forEach((element, index) => {
        let validFrom = element.value.valid_from ? moment(element.value.valid_from, 'DD-MM-YYYY') : '';
        let validTo = element.value.valid_to ? moment(element.value.valid_to, 'DD-MM-YYYY') : '';
         let obj = {
          // "id": element.value.id? element.value.id :0,
          "moduleType":'USER_MANAGEMENT',
          "activeStatus": true,
          "afterSubmissionLockStatus": true,
           "key": element.value.Lbl_Name ? element.value.Lbl_Name : '',
           "configKeyType": element.value.type ? element.value.type : '',
           "value": element.value.value ? element.value.value : '',
           "nullable" : element.value.is_nullable,
            "hasValidity" : element.value.has_validity,
            "validFrom": new Date(element.value.valid_from),
            "validTo": element.value.has_validity == false? null : new Date(element.value.valid_to),
         };
         userMgt_config.push(obj);
       });


       if(this.validateErrorIndexes())
       {
        this.apiService.post(environment.management_base_url + '/ereturnmanagement/v2/api/save-config-info-list', userMgt_config)
        .subscribe(result => {
          if (result != null) {
            this.toastr.success('Data Saved Successfully!', '', {
              timeOut: 1000,
            });
             //#region navigate current url without reloading
           let currentUrl = this.router.url;
           this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
             this.router.navigate([currentUrl]);
           });
           //#endregion
          }
 
         });
       }
     
       console.log("json result ",userMgt_config);
     
  }

  checkHasValidity(i)
  {
    if(!this.table_1_List.controls[i].value.has_validity)
    {
      this.table_1_List.at(i).get('valid_to').disable();
      this.table_1_List.at(i).get('valid_to').setValue(null);
    }
  }


  GenerateErrorIndexes()
  {
    this.table_1_List.controls.forEach((element, index) => {
      let data = 
      {
       "level_showError" : false,
       "type_showError" : false,
       "value_showError" : false,
       "validFrom_showError" : false,
       "validTo_showError" : false,
     }
     this.filing_showError.push(data);
    });
  }

  initializeErrorIndexes(i)
  {
    this.filing_showError[i].level_showError = false;
    this.filing_showError[i].type_showError = false;
    this.filing_showError[i].value_showError = false;
    this.filing_showError[i].validFrom_showError = false;
    this.filing_showError[i].validTo_showError = false;
  }

  validateErrorIndexes() : boolean
  {
      let validationSuccess : boolean = true; 
      validationSuccess = true; 
      this.table_1_List.controls.forEach((element, index) => {
      this.initializeErrorIndexes(index);
      if(element.value.Lbl_Name == null || element.value.Lbl_Name == '')
      {
          this.filing_showError[index].level_showError = true;
          validationSuccess = false; 
      }
      if(element.value.type == null || element.value.type == '')
      {
          this.filing_showError[index].type_showError = true;
          validationSuccess = false;
      }
      if(element.value.value == null || element.value.value == '')
      {
          this.filing_showError[index].value_showError = true;
          validationSuccess = false;
      }
      if(element.value.valid_from == null || element.value.valid_from == '')
      {
          this.filing_showError[index].validFrom_showError = true;
          validationSuccess = false;
      }
    if(element.value.has_validity == true && (element.value.valid_to == null || element.value.valid_to == ''))
{
    this.filing_showError[index].validTo_showError = true;
    validationSuccess = false;
}
      })
      
      if(validationSuccess)
      return true;
      else
      return false;
  }

  changeHasValidity(event:any,i)
  {
    if (event.target.checked)
    {
      this.table_1_List.at(i).get('valid_to').enable();
    }
    else
    {
      this.table_1_List.at(i).get('valid_to').disable();
      this.table_1_List.at(i).get('valid_to').setValue(null);
    }
  }

  rowCheckingError(i,formControlName)
  {

    if(formControlName == 'Lbl_Name')
    this.filing_showError[i].level_showError = false;
    if(formControlName == 'type')
    this.filing_showError[i].type_showError = false;
    if(formControlName == 'value')
    this.filing_showError[i].value_showError = false;
    if(formControlName == 'valid_from')
    this.filing_showError[i].validFrom_showError = false;
    if(formControlName == 'valid_to')
    this.filing_showError[i].validTo_showError = false;
  }

  keyPressNumbers(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }
}
