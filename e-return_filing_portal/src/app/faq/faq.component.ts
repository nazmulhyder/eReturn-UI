import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { PageContent } from '../page-content';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FAQComponent implements OnInit {

  languageList = require('../page-content').languageList;
  content = require("../page-content").content;

  constructor(private router:Router, private spinner: NgxUiLoaderService) { }

  ngOnInit(): void {
    this.spinner.start();
    this.spinner.stop();
  }

  languageClick(code: string) {
    PageContent.selectedLanguageCode = code;
  }

  getSelectedLanguagesCode(): string {
    return PageContent.selectedLanguageCode;
  }

  onBacktoMainPage() {
    this.router.navigate(["/auth/sign-in"]);
  }

}
