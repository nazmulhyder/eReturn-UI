import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommaSeparatorService {

  constructor() { }

  removeComma(userInput:any, dpoint:any) {
    let count : any;
    var amountInString = "";
    if (userInput === null || userInput === "") {
        amountInString = "0.00";
    }
    else {
        amountInString = "";
        for (var i = 0; i < userInput.length; i++) {
            var char = userInput.charAt(i);
            var charForCheck = char;
            char = char.match(/\d+/g);
            if (char != null) {
                amountInString = amountInString + userInput.charAt(i);
                count = 1;
            }
            else if (charForCheck == ",") {
                continue;
            }
            else if (charForCheck == "-") {
                amountInString = amountInString + userInput.charAt(i);
            }
            else if (charForCheck == ".") {
                amountInString = amountInString + userInput.charAt(i);
            }
        }
    }
    var ntoFixed = 6;
    if (dpoint != undefined && dpoint != null)
    {
        ntoFixed = parseInt(dpoint);
    }
    return parseFloat(amountInString).toFixed(ntoFixed);
}

removeCommaExpenditure(userInput:any, dpoint:any) {
    let count : any;
    var amountInString = "";
    if (userInput === null || userInput === "") {
        return "";
    }
    else {
        amountInString = "";
        for (var i = 0; i < userInput.length; i++) {
            var char = userInput.charAt(i);
            var charForCheck = char;
            char = char.match(/\d+/g);
            if (char != null) {
                amountInString = amountInString + userInput.charAt(i);
                count = 1;
            }
            else if (charForCheck == ",") {
                continue;
            }
            else if (charForCheck == "-") {
                amountInString = amountInString + userInput.charAt(i);
            }
            else if (charForCheck == ".") {
                amountInString = amountInString + userInput.charAt(i);
            }
        }
    }
    var ntoFixed = 6;
    if (dpoint != undefined && dpoint != null)
    {
        ntoFixed = parseInt(dpoint);
    }
    return parseFloat(amountInString).toFixed(ntoFixed);
}


  // converting any number to BDT Currency Seperator
  // Example : 123445789 => 12,34,45,789
  currencySeparatorBD(nStr:any)
  {
      if(nStr === '0') 
      return '0';
      else if(nStr== null || nStr==='' || isNaN(nStr))
      return "";
      else
      return new Intl.NumberFormat('en-IN').format(parseFloat(nStr));
  }
}
