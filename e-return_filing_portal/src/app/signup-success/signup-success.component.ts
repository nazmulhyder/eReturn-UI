import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup-success',
  templateUrl: './signup-success.component.html',
  styleUrls: ['./signup-success.component.css']
})
export class SignupSuccessComponent implements OnInit {
  checkIsgeneratedPass:any;
  checkIsSignedUp:any;
  constructor(
    private router:Router
  ) { }

  ngOnInit(): void {
    this.checkIsgeneratedPass = localStorage.getItem('isGeneratedPass');
    this.checkIsSignedUp = localStorage.getItem('isSignUP');
    if (this.checkIsSignedUp === 'not signed up') {
      this.router.navigate(["/auth/sign-up"]);
    }
    if (this.checkIsgeneratedPass ='not signed up' && this.checkIsgeneratedPass === 'no') {
      this.router.navigate(["/auth/generate-pass"]);
    }
    if (this.checkIsgeneratedPass === 'yes'){

    }
  }

}
