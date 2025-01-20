import { INavData } from '@coreui/angular';


export const super_admin_navItems: INavData[] =
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
      name: 'Report',
      url: '/return-report',
      icon: 'icon-cursor',
      children: [
        {
          name: 'Return Report',
          url: 'pages/return-report',
          icon: 'icon-cursor__',
        },
        {
          name: 'Return Register',
          url: 'pages/return-register',
          icon: 'icon-cursor_',
        },
        {
          name: 'Extension Report',
          url: 'pages/extension-report',
          icon: 'icon-cursor_',
        },
      ]
    },
    {
      name: 'Add Admin',
      url: 'pages/add-admin',
      icon: 'icon-cursor',
    },
    {
      name: 'Re-Assign Admin',
      url: 'pages/reassign-admin',
      icon: 'icon-cursor',
    },
  ];