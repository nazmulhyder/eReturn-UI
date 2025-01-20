import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })

  export class CommonUtilService {

    public static onValueChange(event: any){
      event.target.value = CommonUtilService.commaSeperator(event.target.value);
    }
  
    public static commaSeperator(value: any): string {

        let valueStr: string = this.commaRemover(value.toString());
        let finalStr: string = "";
        let length = valueStr.length;

        if(valueStr[0] == "0" && length > 1){
          return "";
        }
    
        if(length > 3){
    
          finalStr = "," + (valueStr[length - 3] + valueStr[length - 2] + valueStr[length - 1]) + finalStr;
          length -= 3;
    
          while(length > 2){
    
            finalStr = "," + (valueStr[length - 2] + valueStr[length - 1]) + finalStr;
            length -= 2;
    
          }
    
          length--;
    
          while(length >= 0){
    
            finalStr = valueStr[length] + finalStr;
            length -= 1;
    
          }
          
    
          return finalStr;
    
        }
        else{
          return valueStr;
        }
    
      }
    
      public static commaRemover(value: string): string {
        return value.replaceAll(",", '');
      }

      public commaSeperator(value: any): string {

        let valueStr: string = this.commaRemover(value.toString());
        let length = valueStr.length;
        let finalStr: string = "";

        if(valueStr[0] == "0" && length > 1){
          return "";
        }
    
        if(length > 3){
    
          finalStr = "," + (valueStr[length - 3] + valueStr[length - 2] + valueStr[length - 1]) + finalStr;
          length -= 3;
    
          while(length > 2){
    
            finalStr = "," + (valueStr[length - 2] + valueStr[length - 1]) + finalStr;
            length -= 2;
    
          }
    
          length--;
    
          while(length >= 0){
    
            finalStr = valueStr[length] + finalStr;
            length -= 1;
    
          }
          
    
          return finalStr;
    
        }
        else{
          return valueStr;
        }
    
      }
    
      public commaRemover(value: string): string {
        return value.replaceAll(",", '');
      }

  }