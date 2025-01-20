import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from '../../../custom-services/api-url/api-url';
import { ApiService } from '../../../custom-services/ApiService';

@Component({
  selector: 'app-company-tds',
  templateUrl: './company-tds.component.html',
  styleUrls: ['./company-tds.component.scss']
})
export class CompanyTdsComponent implements OnInit {

  isListSectionHidden : boolean = false;
  isOpenAvailableTDS : boolean = false;
  isOpenClaimedTDS : boolean  = false;

  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };

  companyAvailableTDSForm : FormGroup;
  companyClaimTDSForm : FormGroup;

  companyTDSData = [];
  claimTDS = [];

  winOrTinNo : any;
  getCompanyByWin = [];

  storeClaimedTDS = [];

  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;
  
  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    apiService: ApiService,
    apiUrl: ApiUrl,
    private router: Router,
  ) { 

    this.apiService = apiService;
    this.apiUrl = apiUrl;
  }

  ngOnInit(): void {
    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eLedger'].url;
    });
    this.winOrTinNo = localStorage.getItem('winOrTinNo');
    this.initializeCompanyTDSForm();  
  }

  loadAvailableTDSTaxpayer(tinOrWin:any)
  {
    this.isOpenAvailableTDS = true;
    this.apiService.get(this.serviceUrl + 'api/company-tds/available-tds')
    .subscribe(result => {
        this.companyTDSData =  result.replyMessage;
        this.laodAllAvailableTDS();
      
    },
    error => {
      this.isOpenAvailableTDS = false;
      this.companyAvailableTDS.clear();
      this.companyClaimTDS.clear();
      console.log(error['error'].errorMessage);
      this.toastr.error(error['error'].error, '', {
        timeOut: 3000,
      });
    });

    //this.laodAllAvailableTDS();
  }

  loadClaimedTDS(tdsClaim,tinOrWin,k)
  {
     let claimResult : any;
     this.companyAvailableTDS.controls.forEach((element,index) => {
          if(element.value.TIN_OR_WIN === tinOrWin)
          {
            let claimObj = 
            {
              "claimAmount": tdsClaim,
              "winNo": tinOrWin,
            }

            this.apiService.post(this.serviceUrl + 'api/company-tds/claim',claimObj)
            .subscribe(result => {
                console.log('claimed response',result); 
                claimResult = result.replyMessage;

              this.companyClaimTDS.push(this.fb.group({
              TIN_OR_WIN : new FormControl(claimResult.winNo),
              COM_NAME: new FormControl(claimResult.companyName),
              TDS_AMOUNT : new FormControl(),
              TDS_CLAIM: new FormControl(claimResult.claimAmount),
              CLAIM_REF : new FormControl(claimResult.claimRef),    
            }));       
            });
      
            this.isOpenClaimedTDS = true;
            this.companyAvailableTDS.removeAt(k);
            //this.validateLIP.splice(index,1);
            this.toastr.success('Claimed Successfully', '', {
              timeOut: 1000,
            });
          }
     });

     this.isOpenAvailableTDS = this.companyAvailableTDS.length > 0 ? true : false;
  }

  deleteClaim(claimRefNo,index,deleteClaim)
  {
    localStorage.setItem('claim_delete_ref',claimRefNo);
    localStorage.setItem('claim_delete_ref_index',index);
    this.changeClaim(deleteClaim);
  }

  changeClaim(deleteClaim: TemplateRef<any>) {
    this.modalRef = this.modalService.show(deleteClaim, this.config);
  }

  remove_Claim()
  {
    this.apiService.delete(this.serviceUrl + 'api/company-tds/'+localStorage.getItem('claim_delete_ref'))
    .subscribe(result => {
        this.companyTDSData =  result.replyMessage;
        this.companyAvailableTDS.push(this.fb.group({
          TIN_OR_WIN : new FormControl(result.replyMessage.winNo),
          COM_NAME: new FormControl(result.replyMessage.companyName),
          TDS_AMOUNT : new FormControl(),
          TDS_CLAIM: new FormControl(result.replyMessage.claimAmount),
          CLAIM_REF : new FormControl(result.replyMessage.claimRef),  
        }));

        this.companyClaimTDS.removeAt(parseInt(localStorage.getItem('claim_delete_ref_index')));
        this.isOpenClaimedTDS = this.companyClaimTDS.length > 0 ? true : false;
        this.isOpenAvailableTDS = this.companyAvailableTDS.length > 0 ? true : false;

        this.toastr.success('Claim Deleted Successfully', '', {
          timeOut: 1000,
        });

        localStorage.removeItem('claim_delete_ref');
        localStorage.removeItem('claim_delete_ref_index');
        // let currentUrl = this.router.url;
        //     this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        //       this.router.navigate([currentUrl]);
        //     });

             
    },
    error => {
      console.log(error['error'].errorMessage);
      this.toastr.error(error['error'].error, '', {
        timeOut: 3000,
      });
    });

    this.modalRef.hide();
  }

  unchange_Claim() {
    this.modalRef.hide();
  }


  search(event: any, searchModalShow, tinOrWin) {
      //debugger;
      this.searchSpecificCompanyByWin(tinOrWin);
      this.getVerifyIbasData(searchModalShow);
      this.isOpenAvailableTDS = true;
    }
  
    getVerifyIbasData(searchModalShow)
    {
      this.changeSearch(searchModalShow);
    }

    changeSearch(searchModalShow: TemplateRef<any>) {
      this.modalRef = this.modalService.show(searchModalShow, { class: 'modal-lg' });

    }

    searchSpecificCompanyByWin(tinOrWin: any)
    {
      this.getCompanyByWin = [];

      this.apiService.get(this.serviceUrl + 'api/company-tds/search/'+tinOrWin)
      .subscribe(result => {
        this.getCompanyByWin.push(result.replyMessage);
      },
      error => {
        console.log(error['error'].errorMessage);
        this.toastr.error(error['error'].error, '', {
          timeOut: 3000,
        });
      });
    }


    laodAllAvailableTDS()
    {
      this.companyAvailableTDS.clear();
      this.companyClaimTDS.clear();
      console.log('===',this.companyTDSData);
      this.companyTDSData.forEach(element => {
          if(!element.claimAmount)
          {
            this.companyAvailableTDS.push(this.fb.group({
              TIN_OR_WIN : new FormControl(element.winNo),
              COM_NAME: new FormControl(element.companyName),
              TDS_AMOUNT : new FormControl(),
              TDS_CLAIM: new FormControl(element.claimAmount),
              CLAIM_REF : new FormControl(element.claimRef),            
            }));
          }
          else
          {
            
            this.companyClaimTDS.push(this.fb.group({
              TIN_OR_WIN : new FormControl(element.winNo),
              COM_NAME: new FormControl(element.companyName),
              TDS_AMOUNT : new FormControl(),
              TDS_CLAIM: new FormControl(element.claimAmount),
              CLAIM_REF : new FormControl(element.claimRef),            
            }));
          }
      });

      this.isOpenAvailableTDS = this.companyAvailableTDS.controls.length>0 ? true : false;
      this.isOpenClaimedTDS = this.companyClaimTDS.controls.length>0 ? true : false;
     
    }

    initializeCompanyTDSForm()
    {
      this.companyAvailableTDSForm = this.fb.group({
       COM_TDS_Form: this.fb.array([this.fb.group({
          TIN_OR_WIN: new FormControl(),
          COM_NAME: new FormControl(),
          TDS_AMOUNT : new FormControl(),
          TDS_CLAIM: new FormControl(),    
          CLAIM_REF: new FormControl(),
        })]),
        COM_CLAIM_TDS_Form: this.fb.array([this.fb.group({
          TIN_OR_WIN: new FormControl(),
          COM_NAME: new FormControl(),
          TDS_AMOUNT : new FormControl(),
          TDS_CLAIM: new FormControl(),    
          CLAIM_REF: new FormControl(),
        })]),
      });

      this.isOpenAvailableTDS = false;
      this.isOpenClaimedTDS = false;
    }
  
    get companyAvailableTDS() {
      return this.companyAvailableTDSForm.get('COM_TDS_Form') as FormArray;
    }

    get companyClaimTDS() {
      return this.companyAvailableTDSForm.get('COM_CLAIM_TDS_Form') as FormArray;
    }

    close_Search() {
      this.modalRef.hide();
    }

    validateClaim(i,event,winNo)
    {
       let tds = localStorage.getItem('AvailableTDS-'+winNo);
       if(tds == null)
       {
         this.getAvailableByWin(winNo)
       }

        if(parseFloat(localStorage.getItem('AvailableTDS-'+winNo)) < parseFloat(event.target.value))
       {
          this.companyAvailableTDS.controls[i].patchValue
          ({
            TDS_CLAIM : ''
          });

          this.toastr.warning('TDS Claim should be less or equal to TDS Availble!', '', {
            timeOut: 2000,
          });
    
       }
    }

    getAvailableByWin(winNo)
    {
      this.apiService.get(this.serviceUrl + 'api/company-tds/search/'+winNo)
      .subscribe(result => {
        localStorage.setItem('AvailableTDS-'+winNo, result.replyMessage.claimAmount);
      },
      error => {
        console.log(error['error'].errorMessage);
        this.toastr.error(error['error'].error, '', {
          timeOut: 3000,
        });
      });
    }

    saveTDS()
    {
       this.isListSectionHidden = true;
       this.close_Search();
    }

    numberOnly(event): boolean {
      const charCode = (event.which) ? event.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
      }
      return true;
    }
  
}
