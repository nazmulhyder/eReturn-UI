import { ApiUrl } from "./api-url";
import { observable, Observable, of as observableOf } from "rxjs";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

@Injectable()
export class ApiUrlService extends ApiUrl {
  private urls = {
    eReturn: {
      serviceName: "eReturn",
      url: environment.eReturn_api_url ,
    },
    eLedger: {
      serviceName: "eLedger",
      url: environment.eLedger_api_url ,
    },
    // eReturnAuth: {
    //   serviceName: "eReturnAuth",
    //   url: environment.eReturnAuth_api_url ,
    // },
    // managementApi: {
    //   serviceName: "managementApi",
    //   url: environment.management_api_url ,
    // },
    checkIsCaptchaValidationOpen:{
      serviceName:"checkIsCaptchaValidationOpen",
      isOpen:environment.isCaptchaValidationOpen,
    }
  };

  getUrl(): Observable<any> {
    return observableOf(this.urls);
  }
}
