import {Component} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ApiUrl } from "../../custom-services/api-url/api-url";
import { ApiService } from "../../custom-services/ApiService";

@Component({
  selector: 'app-custom-header',
  templateUrl: 'app-header.component.html',
  styleUrls: ['app-header.component.css']
})
export class AppHeaderComponent {
  isLoggedIn:any;
  tin:any;
  name:any;
  apiService: ApiService;
  private serviceUrl: string;
  apiUrl: ApiUrl;
  checkIsLoggedIn: any;
  userTin: any;
  data : any;

  taxpayerProfileImg:any;
  taxpayerName : any;
  taxpayerTIN : any;

  constructor(private router: Router,
    apiService: ApiService,
    apiUrl: ApiUrl,
    private toastr: ToastrService,
    private sanitizer:DomSanitizer
    ) {
      this.apiService = apiService;
      this.apiUrl = apiUrl;
    }

  ngOnInit(): void {
    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eReturnPortal'].url;
    });

    this.checkIsLoggedIn = localStorage.getItem('isLogged');
    if (this.checkIsLoggedIn === 'not logged in') {
      this.router.navigate(["/auth/sign-in"]);
    }
    if (this.checkIsLoggedIn === 'logged in') {
      this.userTin = localStorage.getItem('tin');
      this.getData();
    }
  
  }

  getData() {
    // debugger;
    this.apiService.get(this.serviceUrl + 'api/user-panel/taxpayer-profile/short') // + this.userTin)
      .subscribe(result => {
        if (JSON.stringify(result) != '{}') {
         // console.log('header',result);
          this.data=result;
          this.taxpayerProfileImg = this.data.image == null || this.data.image == "" ? "No image found"
          : this.imgTransform();
          this.taxpayerName = this.data.assesName;
          this.taxpayerTIN = this.data.tin;

        }
      },
        error => {
         // console.log(error['error'].errorMessage);
          this.toastr.error(error['error'].message,);
        });
  }

  // goToAssessmentPage(){
  //   this.router.navigate(["/user-panel/assessment"]);
  // }

  goToHomePage(){
    this.router.navigate(["/user-panel/home"]);
  }

  imgTransform(){
    return 'data:image/jpg;base64,' + (this.sanitizer.bypassSecurityTrustResourceUrl(this.data.image) as any).changingThisBreaksApplicationSecurity;
  }

}
