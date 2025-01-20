import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
   })

export class CommonUtilService {

    constructor(){}

    public static numberOnly(event): boolean {

        const charCode = (event.which) ? event.which : event.keyCode;

        if (charCode > 31 && (charCode < 48 || charCode > 57))
        {
            return false;
        }

        return true;

    }

    public static removeZero(mobileNo: string): string{

        if(mobileNo[0] === "0")
          mobileNo = mobileNo.substr(1);
    
          return mobileNo;
    
      }
    
      public static addZero(mobileNo: string): string{
    
        if(mobileNo[0] !== "0")
          mobileNo = "0" + mobileNo;
    
          return mobileNo;
    
      }

      public static dateValidator(date: string): boolean{
    
        return false;
    
      }

}