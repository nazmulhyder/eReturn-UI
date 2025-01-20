import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-e-tax-service-content',
  templateUrl: './e-tax-service-content.component.html',
  styleUrls: ['./e-tax-service-content.component.css']
})
export class ETaxServiceContentComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onBacktoMainPage() {
    this.router.navigate(["/landing-page"]);
  }

}
