import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-e-tds',
  templateUrl: './e-tds.component.html',
  styleUrls: ['./e-tds.component.css']
})
export class ETdsComponent implements OnInit {

  constructor(private router:Router, private spinner: NgxUiLoaderService) { }

  ngOnInit(): void {
    this.spinner.start();
    this.spinner.stop();
  }

  onBacktoMainPage() {
    this.router.navigate(["/landing-page"]);
  }

}
