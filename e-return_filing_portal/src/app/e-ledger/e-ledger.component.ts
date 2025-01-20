import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-e-ledger',
  templateUrl: './e-ledger.component.html',
  styleUrls: ['./e-ledger.component.css']
})
export class ELedgerComponent implements OnInit {

  constructor(private router:Router, private spinner: NgxUiLoaderService) { }

  ngOnInit(): void {
    this.spinner.start();
    this.spinner.stop();
  }

  onBacktoMainPage() {
    this.router.navigate(["/landing-page"]);
  }

}
