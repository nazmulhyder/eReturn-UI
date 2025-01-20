import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-non-nid-holder-submission-complete',
  templateUrl: './non-nid-holder-submission-complete.component.html',
  styleUrls: ['./non-nid-holder-submission-complete.component.css']
})
export class NonNidHolderSubmissionCompleteComponent implements OnInit {

  public mobileNoLastDigits: string;

  constructor(){}

  ngOnInit(): void {
    this.mobileNoLastDigits = localStorage.getItem('mobile');
    let len: number = this.mobileNoLastDigits.length;
    this.mobileNoLastDigits = this.mobileNoLastDigits[len - 3] + this.mobileNoLastDigits[len - 2] + this.mobileNoLastDigits[len - 1];
  }

}
