
import { INavData } from '@coreui/angular';


export const circle_officer_navItems: INavData[] =
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
      url: 'pages/return-list',
      icon: 'icon-cursor',
    },
    // {
    //   name: 'Payment',
    //   url: '/verification',
    //   icon: 'icon-cursor',
    //   children: [
    //     {
    //       name: 'Company Challan',
    //       url: '/pages/company-challan-request',
    //       icon: 'icon-puzzlee'
    //     },
    //     {
    //       name: 'Others',
    //       url: '/pages/others-request-list',
    //       icon: 'icon-puzzlee'
    //     },
    //   ]
    // },

    {
      name: 'Time Extension',
      url: 'pages/time-extension',
      icon: 'icon-cursor',
      children: [
        {
          name: 'Pending List',
          url: 'pages/time-extension-pending-list',
          icon: 'icon-puzzlee'
        },
        {
          name: 'Approval Status',
          url: '/pages/time-extension-approval-status',
          icon: 'icon-puzzlee'
        },
      ]
    },
    {
      name: 'Challan Approval',
      url: '/pages/challan-approval',
      icon: 'icon-cursor',
    },
    {
      name: 'Search',
      url: 'pages/search',
      icon: 'icon-cursor',
    },
    // {
    //   name: 'Report',
    //   url: 'pages/report',
    //   icon: 'icon-cursor',
    //   children: [
    //     {
    //       name: 'Return Register',
    //       url: 'pages/return-register',
    //       icon: 'icon-puzzlee'
    //     },
    //     {
    //       name: 'Return Summary',
    //       url: 'pages/return-summary',
    //       icon: 'icon-puzzlee'
    //     },
    //     {
    //       name: 'Non-Filer Taxpayer No.',
    //       url: 'pages/non-filer-taxpayer-no',
    //       icon: 'icon-puzzlee'
    //     },
    //     {
    //       name: 'Non-Filer Taxpayer List',
    //       url: 'pages/non-filer-taxpayer-list',
    //       icon: 'icon-puzzlee'
    //     },
    //     {
    //       name: 'Top 100 Individual By Gross Wealth',
    //       url: 'pages/top100-individual-by-gross-wealth',
    //       icon: 'icon-puzzlee'
    //     },
    //     {
    //       name:'Top 100 Individual By Net Wealth',
    //       url:'pages/top100-individual-by-net-wealth',
    //       icon:'icon-puzzlee'
    //     },
    //     {
    //       name:'Top 100 Individual By Gross Wealth Liability',
    //       url:'pages/top100-individual-by-gross-wealth-liability',
    //       icon:'icon-puzzlee'
    //     },
    //     {
    //       name:'Top 100 Individual By Tax Paid',
    //       url:'pages/top100-individual-by-tax-paid',
    //       icon:'icon-puzzlee'
    //     },
    //     {
    //       name:'Top 100 Company By Tax Paid',
    //       url:'pages/top100-company-by-tax-paid',
    //       icon:'icon-puzzlee'
    //     },
    //     {
    //       name:'Top 100 Female By Tax Paid',
    //       url:'pages/top100-female-by-tax-paid',
    //       icon:'icon-puzzlee'
    //     },
    //     {
    //       name:'Top 100 Male By Tax Paid',
    //       url:'pages/top100-male-by-tax-paid',
    //       icon:'icon-puzzlee'
    //     }
    //   ]
    // },
    {
      name: 'Report',
      url: 'pages/report',
      icon: 'icon-cursor',
    },
    {
      name: 'Approval',
      url: 'pages/approved-request',
      icon: 'icon-cursor',
    },
    {
      name: 'Upload Data',
      url: 'pages/upload-offline-data',
      icon: 'icon-cursor',
    }
  ];