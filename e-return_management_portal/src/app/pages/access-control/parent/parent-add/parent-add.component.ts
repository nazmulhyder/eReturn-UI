import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from '../../../../custom-services/api-url/api-url';
import { ApiService } from '../../../../custom-services/ApiService';

@Component({
  selector: 'app-parent-add',
  templateUrl: './parent-add.component.html',
  styleUrls: ['./parent-add.component.scss']
})
export class ParentAddComponent implements OnInit {

  public parentAddForm: FormGroup;
  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;

  constructor(private fb: FormBuilder, private router: Router, apiService: ApiService, apiUrl: ApiUrl,
    private toastrService: ToastrService) {
    this.apiUrl = apiUrl;
    this.apiService = apiService;
    this.parentAddForm = fb.group({
      accessName: ['', Validators.required],
      accessType: ['', Validators.required],
      accessValue: ['', Validators.required],
      position: ['', Validators.required],
      icon: [''],
      pack: [''],

    });
  }

  ngOnInit(): void {
    this.parentAddForm.patchValue({ accessType: 'PARENT' });
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57))
    // if (charCode > 31 && (charCode < 45 || charCode == 47 || charCode > 57)) 
    {
      return false;
    }
    return true;
  }


  reset() {
    this.parentAddForm.reset();
  }

  submittedData(){

  }

}
