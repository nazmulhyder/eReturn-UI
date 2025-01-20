import { ApiUrl } from "./api-url";
import { observable, Observable, of as observableOf } from "rxjs";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

@Injectable()
export class ApiUrlService extends ApiUrl {
  private urls = {
    eReturnPortal: {
      serviceName: "eReturnPortal",
      url: environment.eReturn_api_url ,
    },
    eLedger: {
      serviceName: "eLedger",
      url: environment.eLedger_api_url ,
    },
    eReturnAuth: {
      serviceName: "eReturnAuth",
      url: environment.eReturnAuth_api_url ,
    },
    eReturnPortalUrl: {
      serviceName: "eReturnPortalUrl",
      url: environment.eReturn_portal_url ,
    },
    eLedgerPortalUrl: {
      serviceName: "eLedgerPortalUrl",
      url: environment.eLedger_portal_url ,
    },
    sonaliBankePaymentPortalUrl: {
      serviceName: "sonaliBankePaymentPortalUrl",
      url: environment.sonaliBankePayment_portal_url ,
    },
    checkIsCaptchaValidationOpen:{
      serviceName:"checkIsCaptchaValidationOpen",
      isOpen:environment.isCaptchaValidationOpen,
    }
  };

  getUrl(): Observable<any> {
    return observableOf(this.urls);
  }
}
