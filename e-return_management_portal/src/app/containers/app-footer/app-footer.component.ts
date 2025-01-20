import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-custom-footer',
  templateUrl: './app-footer.component.html',
  styleUrls: ['./app-footer.component.scss']
})
export class AppFooterComponent implements OnInit {
  
  year: number;

  constructor() { }

  ngOnInit(): void {
    this.year = new Date().getFullYear();
  }
}
