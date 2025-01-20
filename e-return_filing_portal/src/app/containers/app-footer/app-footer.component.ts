import {Component} from "@angular/core";

@Component({
  selector: 'app-custom-footer',
  templateUrl: 'app-footer.component.html',
  styleUrls: ['app-footer.component.css']
})
export class AppFooterComponent {
  year: number;

  ngOnInit(): void {
    this.year = new Date().getFullYear();
  }
}
