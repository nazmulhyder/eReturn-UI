import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Home',
    url: '/user-panel/home',
    icon: 'icon-side_bar_icon_3',
    // badge: {
    //   variant: 'info',
    //   text: 'NEW'
    // }
  },
  // {
  //   name: 'Return Submission',
  //   url: '/user-panel/basic-query-taxpayer',
  //   icon: 'icon-side_bar_icon_4'
  // },
  {
    name: 'Return Submission',
    url: '/user-panel/assessment',
    icon: 'icon-side_bar_icon_4'
  },

  // {
  //   name: 'Report',
  //   url: '/user-panel/report',
  //   icon: 'icon-chart'
  // },

//   {
//     title: true,
//     name: 'Components'
//   },
  {
    name: 'Tax Record',
    url: '/Certificate',
    icon: 'icon-side_bar_icon_2',
    children: [
      {
        name: 'TIN Certificate',
        url: '/user-panel/tin-certificate',
        icon: 'icon-puzzle'
      },
      {
        name: 'Tax Certificate',
        url: '/user-panel/income-tax-certificate',
        icon: 'icon-puzzle'
      },
      {
        name: 'Acknowledgement',
        url: '/user-panel/ack-receipt',
        icon: 'icon-puzzle'
      },
      {
        name: 'Return',
        url: '/user-panel/final-return-view',
        icon: 'icon-puzzle'
      },
      {
        name: 'Challan',
        url: '/user-panel/challan-history',
        icon: 'icon-puzzle'
      }
    ]
  },
  {
    name: 'Time Extension',
    url: '/user-panel/time-extension',
    icon: 'icon-side_bar_icon_1'
  },
];
