
import { INavData } from '@coreui/angular';
var noOfNotification = localStorage.getItem('notificationNumber');

export const range_navItems: INavData[] =
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
    //   name: 'Time Extension',
    //   url: 'pages/time-extension-list',
    //   icon: 'icon-cursor',
    // },

    {
      name: 'Search',
      url: 'pages/search',
      icon: 'icon-cursor',
    },
    // {
    //   name: 'Reports',
    //   url: 'pages/report',
    //   icon: 'icon-cursor',
    // },
    {
      name: 'Report',
      url: 'pages/return-report',
      icon: 'icon-cursor',
    },
    {
      name: 'Notification',
      url: 'pages/alert-list',
      icon: 'icon-cursor',
      badge: {
        variant: 'info',
        text: noOfNotification,
      }
    },
  ];