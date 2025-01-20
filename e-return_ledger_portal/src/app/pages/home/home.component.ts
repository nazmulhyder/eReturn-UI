import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FaqContent } from '../../faq-content';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  islogoShown: boolean = true;
  isFaqShown: boolean = false;
  languageList = require('../../faq-content').languageList;
  content = require("../../faq-content").content;

  notice = "Update your source tax & then view them in your Tax Payment Status";

  constructor(private router: Router, private spinner: NgxUiLoaderService) { }

  ngOnInit(): void {
    this.spinner.start();
    this.spinner.stop();
  }

  languageClick(code: string) {
    this.islogoShown = false;
    this.isFaqShown = true;
    FaqContent.selectedLanguageCode = code;
  }

  getSelectedLanguagesCode(): string {
    return FaqContent.selectedLanguageCode;
  }

}
