import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { clearInterval } from 'timers';
import { ApiService } from '../custom-services/ApiService';

@Component({
  selector: 'app-request-monitoring',
  templateUrl: './request-monitoring.component.html',
  styleUrls: ['./request-monitoring.component.scss']
})
export class RequestMonitoringComponent implements OnInit {

  subscription : any;
  result1: any = 0;
  result2: any = 0;
  result3: any = 0;
  show_result1: any = 0;
  show_result2: any = 0;
  show_result3: any = 0;

  prevVal1: any = 0;
  prevVal2: any = 0;
  prevVal3: any = 0;

  activeConnections : any = 0;

  reading : any = 0;
  writing : any = 0;
  waiting : any = 0;

  currentVal1: any = 0;
  currentVal2: any = 0;
  currentVal3: any = 0;

  devApiUrl = "http://103.92.84.210:88/nginx_status";
  liveApiUrl = "https://filing.etaxnbr.gov.bd/nginx_status";


  constructor(
    private apiService: ApiService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    localStorage.removeItem('prevItem1');
    localStorage.removeItem('prevItem2');
    localStorage.removeItem('prevItem3');
  }

  timeChange(event) {
    if(event.target.value === '1')
    {
     interval(1000).subscribe(x => {
        this.callingStatusMonitoringAPI();
      });
    }
    if(event.target.value === '5')
    {
      interval(5000).subscribe(x => {
        this.callingStatusMonitoringAPI();
      });
    }
    else if(event.target.value === '10')
    {
      interval(10000).subscribe(x => {
        this.callingStatusMonitoringAPI();
      });
    }
   else if(event.target.value === '15')
    {
      interval(15000).subscribe(x => {
        this.callingStatusMonitoringAPI();
      });
    }
    else if(event.target.value === '20')
    {
      interval(20000).subscribe(x => {
        this.callingStatusMonitoringAPI();
      });
    }
    else
    {
      interval(5000).subscribe(x => {
        this.callingStatusMonitoringAPI();
      });
    }
  }


  callingStatusMonitoringAPI() {

    let request = new XMLHttpRequest();
    request.open("GET", this.liveApiUrl);
    request.send();
    request.onload = () => {
        console.log(request.response);
        let myArray = [];
        myArray = request.response.split(" ");
        console.log(myArray);

        this.activeConnections = parseInt(myArray[2]);
        this.currentVal1 = parseInt(myArray[7]);
        this.currentVal2 = parseInt(myArray[8]);
        this.currentVal3 = parseInt(myArray[9]);
        this.reading =  parseInt(myArray[11]);
        this.writing =  parseInt(myArray[13]);
        this.waiting =  parseInt(myArray[15]);
    }

    this.show_result1 = this.currentVal1 - (parseInt(localStorage.getItem('prevItem1')) ?  parseInt(localStorage.getItem('prevItem1')) : 0);
    this.show_result2 = this.currentVal2 - (parseInt(localStorage.getItem('prevItem2')) ?  parseInt(localStorage.getItem('prevItem2')) : 0);
    this.show_result3 = this.currentVal3 - (parseInt(localStorage.getItem('prevItem3')) ?  parseInt(localStorage.getItem('prevItem3')) : 0);

    console.log('current item 1 ',this.currentVal1+ ' current item 2 ',this.currentVal2+ ' current item 3 ',this.currentVal3);
    console.log(' prev item 1 ',parseInt(localStorage.getItem('prevItem1'))+ ' prev item 2 ',parseInt(localStorage.getItem('prevItem2'))+ ' prev item 3 ',parseInt(localStorage.getItem('prevItem3')));
  
    localStorage.setItem('prevItem1',this.currentVal1);
    localStorage.setItem('prevItem2',this.currentVal2);
    localStorage.setItem('prevItem3',this.currentVal3);
  }

}
