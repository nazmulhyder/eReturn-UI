import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from '../../custom-services/api-url/api-url';
import { ApiService } from '../../custom-services/ApiService';
// import { navItems } from '../../_nav';
import { navItems } from '../../side-bar-menu';

@Component({
  selector: 'app-layout',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.css']
})
export class DefaultLayoutComponent {
  public sidebarMinimized = false;
  public navItems = navItems;

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  userTin: any;
  data: any;

  apiService: ApiService;
  private serviceUrl: string;
  private eReturnAuthUrl : string;
  apiUrl: ApiUrl;
  taxpayerProfileImg: any;
  taxpayerName: any;
  taxpayerTIN: any;

  hasImage: boolean = true;

  constructor(private router: Router,
    apiService: ApiService,
    apiUrl: ApiUrl,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer
  ) {
    this.apiService = apiService;
    this.apiUrl = apiUrl;
  }

  ngOnInit(): void {
    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eReturnPortal'].url;
      this.eReturnAuthUrl = res['eReturnAuth'].url;
    });
    this.userTin = localStorage.getItem('tin');
    this.taxpayerProfileImg = '';
    this.getData();
  }

  getData() {
    // debugger;
    this.apiService.get(this.serviceUrl + 'api/user-panel/taxpayer-profile/short')// + this.userTin)
      .subscribe(result => {
        if (JSON.stringify(result) != '{}') {
         // console.log('header', result);
          this.data = result;
          this.taxpayerProfileImg = this.data.image == null || this.data.image == "" ? "No image found"
            : this.imgTransform();
          this.taxpayerName = this.data.assesName;
          this.taxpayerTIN = this.data.tin;

          if (this.taxpayerProfileImg == "No image found") {
            this.hasImage = false;
          }
        }
      },
        error => {
        //  console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].errorMessage,);
        });
  }

  imgTransform() {
    return 'data:image/jpg;base64,' + (this.sanitizer.bypassSecurityTrustResourceUrl(this.data.image) as any).changingThisBreaksApplicationSecurity;
  }

  logOut() {
    this.apiService.post(this.eReturnAuthUrl + 'api/logout',"") //+this.userTin, "")
    .subscribe(result => { 
        if(result.success)
        {
          localStorage.removeItem('token');
          this.router.navigate(["/auth/sign-in"]);
        }
    })
  }
}
