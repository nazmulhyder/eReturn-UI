
import { INavData } from '@coreui/angular';


export const admin_navItems: INavData[] =
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
      name: 'Add User',
      url: 'pages/add-user',
      icon: 'icon-cursor',
    },
    {
      name: 'Re-Assign User',
      url: 'pages/reassign-user',
      icon: 'icon-cursor',
    },
    {
      name: 'Report',
      url: 'pages/return-report',
      icon: 'icon-cursor',
    },
  ];