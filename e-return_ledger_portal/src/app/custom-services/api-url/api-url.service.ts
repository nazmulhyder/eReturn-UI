import { ApiUrl } from "./api-url";
import { observable, Observable, of as observableOf } from "rxjs";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

@Injectable()
export class ApiUrlService extends ApiUrl {
  private urls = {
    eReturnAuth: {
      serviceName: "eReturnAuth",
      url: environment.eReturnAuth_api_url ,
    },
    eLedger: {
      serviceName: "eLedger",
      url: environment.eLedger_api_url ,
    },
    eReturn: {
      serviceName: "eReturn",
      url: environment.eReturn_api_url ,
    },
    eReturnPortalUrl: {
      serviceName: "eReturnPortalUrl",
      url: environment.eReturn_portal_url ,
    },
    eLedgerPortalUrl: {
      serviceName: "eLedgerPortalUrl",
      url: environment.eLedger_portal_url ,
    },
  };

  getUrl(): Observable<any> {
    return observableOf(this.urls);
  }
}
