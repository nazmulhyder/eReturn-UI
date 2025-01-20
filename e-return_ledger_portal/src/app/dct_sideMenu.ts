
import { INavData } from '@coreui/angular';


export const dct_navItems: INavData[] =
  [
    {
      name: 'Home',
      url: '/pages/home',
      icon: 'icon-home',
    },

    {
      // name: 'Request List',
      // url: '/request-list',
      name: 'Verification',
      url: '/verification',
      icon: 'icon-cursor',
      children: [
        {
          name: 'Company Challan',
          url: '/pages/company-challan-request',
          icon: 'icon-puzzle'
        },
        // {
        //   name: 'Others Source Tax',
        //   url: '/pages/AIT/paid-car-ownership',
        //   icon: 'icon-puzzle'
        // },
        // {
        //   name: 'Advance Tax AIT',
        //   url: '/pages/AIT/advance-tax-ait',
        //   icon: 'icon-puzzle'
        // },
        // {
        //   name: 'Regular Tax AIT',
        //   url: '/pages/AIT/regular-tax-ait',
        //   icon: 'icon-puzzle'
        // },
      ]
    },

    {
      name: 'Pay Order Entry',
      url: '/pages/pay-order-entry',
      icon: 'icon-cursor',
    },
  ];