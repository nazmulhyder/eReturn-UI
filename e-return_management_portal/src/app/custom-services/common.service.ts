import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from './api-url/api-url';
import { ApiService } from './ApiService';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private serviceUrl: string;
  public static captchaElements: string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

  constructor(private router: Router, private apiService: ApiService, private toastr: ToastrService, private apiUrl: ApiUrl,
    private sanitizer: DomSanitizer) {

    this.apiUrl.getUrl().subscribe(res => {
      this.serviceUrl = res['eReturn'].url;
    },
      error => {

        this.toastr.error(error['error'].errorMessage, 'Error', {
          timeOut: 1000
        });

      });

  }

  public static getRandomIntInclusive(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  public static generateCaptchaString(requiredCaptchaLength: number): string {

    let captchaBuilder: string = "";
    let captchaLength: number = this.captchaElements.length - 1;

    while (requiredCaptchaLength > 0) {
      let index: number = this.getRandomIntInclusive(0, captchaLength);
      captchaBuilder += this.captchaElements[index];
      requiredCaptchaLength--;
    }

    return captchaBuilder;

  }

  public captchaGenerator(): string {

    let captcha: string = CommonService.generateCaptchaString(6);

    var canv = document.createElement("canvas");
    canv.id = "captchaImg";
    canv.width = 120;
    canv.height = 30;
    var ctx = canv.getContext("2d");
    ctx.font = "20px Sherif";
    ctx.strokeText(captcha, 22, 21);
    canv.style.pointerEvents = "none";

    var existingElem = document.getElementById("captchaImg");

    if (existingElem != null)
      document.getElementById("captchaImg").remove();

    document.getElementById("captcha").appendChild(canv);

    return captcha;

  }

  public decodeCaptcha(encodedCaptcha: any) {
    return 'data:image/jpg;base64,' + (this.sanitizer.bypassSecurityTrustResourceUrl(encodedCaptcha) as any).changingThisBreaksApplicationSecurity;
  }

  public static numberOnly(event): boolean {

    const charCode = (event.which) ? event.which : event.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }

    return true;

  }

  public static removeZero(mobileNo: string): string {

    if (mobileNo[0] === "0")
      mobileNo = mobileNo.substr(1);

    return mobileNo;

  }

  public static addZero(mobileNo: string): string {

    if (mobileNo[0] !== "0")
      mobileNo = "0" + mobileNo;

    return mobileNo;

  }


}
