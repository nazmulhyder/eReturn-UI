
import { INavData } from '@coreui/angular';


export const circle_inspector_navItems: INavData[] =
  [
    {
      name: 'Dashboard',
      url: '/pages/dashboard',
      icon: 'icon-speedometer',
    },
    // {
    //   name: 'Home',
    //   url: '/pages/home',
    //   icon: 'icon-home',
    // },
    {
      name: 'Return',
      url: '/return',
      icon: 'icon-cursor',
      children: [
        {
          name: 'Return List',
          url: 'pages/approval-request',
          icon: 'icon-cursorrr',
        },
        {
          name: 'Pending Approval',
          url: 'pages/pending-approval',
          icon: 'icon-cursorrr',
        },
        {
          name: 'Approved Returns',
          url: 'pages/approved-return',
          icon: 'icon-cursorrr',
        },
      ]
    },
    {
      name: 'Payment',
      url: '/verification',
      icon: 'icon-cursor',
      children: [
        {
          name: 'Pay Order Entry',
          url: '/pages/pay-order-entry',
          icon: 'icon-cursorr',
        },
        {
          name: 'Company TDS',
          url: '/pages/company-challan-request',
          icon: 'icon-puzzlee'
        },
        {
          name: 'AIT U/S 64',
          url: '/pages/ait-us64',
          icon: 'icon-puzzlee'
        },
        {
          name: 'Regular Tax U/S 74',
          url: '/pages/regular-tax-us74',
          icon: 'icon-puzzlee'
        },
        {
          name: 'Other TDS',
          url: '/pages/other-request-list',
          icon: 'icon-puzzlee'
        },
      ]
    },
    {
      name: 'Challan Approval',
      url: '/pages/challan-approval',
      icon: 'icon-cursor',
    },

    // {
    //   name: 'Time Extension',
    //   url: 'pages/time-extension-list',
    //   icon: 'icon-cursor',
    // },
    {
      name: 'Search',
      url: 'pages/search',
      icon: 'icon-cursor',
    },
  ];