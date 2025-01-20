import { Component, OnInit } from "@angular/core";
import { Announcement } from "../../model/announcement.model";

@Component({
  selector: "app-background-default-layout",
  templateUrl: "./background-default-layout.component.html",
  styleUrls: ["./background-default-layout.component.css"],
})
export class BackgroundDefaultLayoutComponent {
  announcementList: Announcement[] = [
    new Announcement(
      1,
      "Return Submission",
      "File your tax return by 30th November (Tax day).",
      new Date(2021, 2, 20).toLocaleDateString()
    ),
    new Announcement(
      2,
      "Verified Mobile",
      "If you have a TIN and NID-verified mobile number, you can register to this eReturn system right away. If your TIN is registered using your passport, please get the token from this system and visit the support center with your active mobile number and other credentials.",
      new Date(2021, 2, 22).toLocaleDateString()
    ),
    new Announcement(
      3,
      "iBAS++ Integration",
      "Government employees receiving salary from iBAS++ are entitled to populate data in eReturn system.",
      new Date(2021, 2, 27).toLocaleDateString()
    ),
  ];

  constructor() {}
}
