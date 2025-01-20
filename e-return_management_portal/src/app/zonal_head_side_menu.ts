
import { INavData } from '@coreui/angular';


export const zonal_head_navItems: INavData[] =
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
    {
        name: 'Search',
        url: 'pages/search',
        icon: 'icon-cursor',
    },
    {
        name: 'Report',
        url: 'pages/reports',
        icon: 'icon-cursor',
        children: [
            {
                name: 'Return Report',
                url: 'pages/return-report',
                icon: 'icon-cursorr',
            },
            // {
            //     name: 'Extension Report',
            //     url: 'pages/extension-report',
            //     icon: 'icon-cursorr',
            // },
        ]
    },
    {
        name: 'Notification',
        url: 'pages/alert-list',
        icon: 'icon-cursor',
    },
];