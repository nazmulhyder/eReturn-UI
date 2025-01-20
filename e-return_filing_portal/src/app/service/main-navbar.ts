import { HeadsOfIncomeService } from "../user-pannel/heads-of-income.service";

export class IncomeHeads {
  constructor(private headService: HeadsOfIncomeService) {}
  MainNavbarList = [
    {
      id: 1,
      // name: "Home",
      name: "Assessment",
      link: "/user-panel/assessment",
    },
    // {
    //   id: 1,
    //   name: "Home",
    //   link: "/user-panel/home",
    // },
    {
      id: 2,
      name: "Income",
      link: "",
    },
    {
      id: 3,
      name: "Rebate",
      link: "/user-panel/rebate",
    },
    {
      id: 4,
      name: "Expenditure",
      link: "/user-panel/expenditure",
    },
    {
      id: 5,
      name: "Assets & Liabilities",
      link: "/user-panel/assets-and-liabilities",
    },
    {
      id: 6,
      name: "Tax & Payment",
      link: "/user-panel/tax-and-payment",
    },
    // {
    //   id: 7,
    //   name: "Return View",
    //   link: "/user-panel/final-return-view",
    // },
    {
      id: 7,
      // name: "Post Submission Return View",
      name: "Return View",
      // link: "/user-panel/pre-post-sub-return-view",
      link:"/user-panel/post-sub-return-view",
    },
  ];
  getAllMainNavbar() {
    // debugger;
    if (this.headService.getHeads().length <= 0) {
      this.MainNavbarList[1]["link"] = "";
    }
    else
    {
        this.MainNavbarList[1]["link"]=this.headService.getHeads()[0]['link'];
    }
    return this.MainNavbarList;
  }
}
