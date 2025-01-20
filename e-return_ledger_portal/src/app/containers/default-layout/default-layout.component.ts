import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { JwtHelperService } from '@auth0/angular-jwt';
// import { navItems } from '../../_nav';
import { company_navItems } from '../../company_sideMenu';
import { ApiUrl } from '../../custom-services/api-url/api-url';
import { ApiService } from '../../custom-services/ApiService';
import { dct_level2_navItems } from '../../dct_level2_sideMenu';
import { dct_navItems } from '../../dct_sideMenu';
import { tax_payer_navItems } from '../../tax_payer_sideMenu';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.css']
})
export class DefaultLayoutComponent {

  apiService: ApiService;
  private serviceUrl: string;
  private eReturnUrl: string;
  apiUrl: ApiUrl;

  tinNo: any;
  isCompany: boolean;
  notDCT: boolean = false;
  isDCT1: boolean = false;
  isDCT2: boolean = false;

  token:any;
  tokenInfo: any;
  userType: any;

  public sidebarMinimized = false;

  public navCompany = company_navItems;
  public navTaxPayer = tax_payer_navItems;
  public navDCT = dct_navItems;
  public navDctLevel2 = dct_level2_navItems;

  public navItems: any;

  hasImage:boolean=true;

  data:any;
  taxpayerProfileImg:any;
  userFullName : any;
  userIdentity : any;

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  constructor(
    apiService: ApiService,
    apiUrl: ApiUrl,
    private jwtHelper: JwtHelperService,
    private sanitizer:DomSanitizer
  ) {
    this.apiService = apiService;
    this.apiUrl = apiUrl;
  }

  ngOnInit(): void {
    this.apiUrl.getUrl().subscribe(res => {
      this.eReturnUrl = res['eReturn'].url;
    });

    this.tinNo = localStorage.getItem('winOrTinNo');
    console.log('tinNo', this.tinNo);

    this.token= this.jwtHelper.decodeToken(localStorage.getItem('access_token'));
    //static token for company : temporary
    // this.token = this.jwtHelper.decodeToken('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJUQVhQQVlFUiIsInN1YiI6IjEyMzU4NTIzNTc2NCIsImlzcyI6Ik5CUiIsImNsYWltcyI6eyJ1c2VyUm9sZXMiOlsiQ09NUEFOWSJdLCJ1c2VyRnVsbE5hbWUiOiJTeW5lc2lzIElUIExpbWl0ZWQiLCJ1c2VySWRlbnRpdHkiOiIxMjM1ODUyMzU3NjQiLCJ1c2VyVHlwZSI6IkNPTVBBTlkifSwiZXhwIjo2NjUzNDcxMTg5fQ.pvb-PCVSK-585tsbh28Rbx32-fp-dBxSHzn1Mvcztnw');
    this.tokenInfo=this.token['claims'];
    console.log('tokenInfo', this.tokenInfo);
    this.userType = this.tokenInfo['userType'];
    this.userFullName = this.tokenInfo['userFullName'];
    this.userIdentity = this.tokenInfo['userIdentity'];
    console.log('userType', this.userType);

    // this.token= this.jwtHelper.decodeToken(localStorage.getItem('access_token'));
    // this.tokenInfo=this.token['claims'];
    // console.log('tokenInfo', this.tokenInfo);
    // this.userType = this.tokenInfo['userType'];
    // console.log('userType', this.userType);

    this.tinNo = localStorage.getItem('userType');

    if (this.userType === 'TAXPAYER') {
      this.isCompany = false;
      this.notDCT = true;
      this.navItems = this.navTaxPayer;
      this.getTaxpayerImage();
    }

    if (this.userType === 'COMPANY') {
      this.isCompany = true;
      this.navItems = this.navCompany;
    }

    // else if (this.userType === 'DCT_LVL1') {
    //   this.isCompany = false;
    //   this.isDCT1 = true;
    //   this.navItems = this.navDCT;
    // }

    // else if (this.userType === 'DCT_LVL2') {
    //   this.isCompany = false;
    //   this.isDCT2 = true;
    //   this.navItems = this.navDctLevel2;
    // }

    // else {
    //   this.isCompany = true;
    //   this.navItems = this.navCompany;
    // }

    else if (this.userType === 'DCT_LVL1') {
      this.isCompany = false;
      this.isDCT1 = true;
      this.navItems = this.navDCT;
    }

    else if (this.userType === 'DCT_LVL2') {
      this.isCompany = false;
      this.isDCT2 = true;
      this.navItems = this.navDctLevel2;
    }

    // else {
    //   this.isCompany = true;
    //   this.navItems = this.navCompany;
    // }
  }

  getTaxpayerImage() {
    // debugger;
    this.apiService.get(this.eReturnUrl + 'api/user-panel/taxpayer-profile/short/')
      .subscribe(result => {
        if (JSON.stringify(result) != '{}') {
          console.log('header',result);
          this.data=result;
          this.taxpayerProfileImg = this.data.image == null || this.data.image == "" ? "No image found"
          : this.imgTransform();

          if (this.taxpayerProfileImg =="No image found") {
            this.hasImage=false;
          }
        }
      },
        error => {
          console.log(error['error'].errorMessage);
        });
  }

  imgTransform(){
    return 'data:image/jpg;base64,' + (this.sanitizer.bypassSecurityTrustResourceUrl(this.data.image) as any).changingThisBreaksApplicationSecurity;
  }
}
