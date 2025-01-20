
import { INavData } from '@coreui/angular';


export const dct_level2_navItems: INavData[] =
  [
    {
      name: 'Home',
      url: '/pages/home',
      icon: 'icon-home',
    },

    {

      name: 'Verification',
      url: '/verification',
      icon: 'icon-cursor',
      children: [
        {
          name: 'Pay Order',
          url: '/pages/pay-order-verification',
          icon: 'icon-puzzle'
        },
      ]
    },

    // {
    //   name: 'Pay Order Entry',
    //   url: '/pages/pay-order-entry',
    //   icon: 'icon-cursor',
    // },
  ];