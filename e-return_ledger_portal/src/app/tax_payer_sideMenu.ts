import { INavData } from '@coreui/angular';


export const tax_payer_navItems: INavData[] =
    [
        {
            name: 'Home',
            url: '/pages/home',
            icon: 'icon-home',
        },

        {
            name: 'Verify Source Tax',
            url: '/source-tax',
            icon: 'icon-check',
            children: [
                {
                    name: 'iBAS++ (Salary)',
                    url: '/pages/source-tax/tds-on-salary',
                    // icon: 'icon-puzzle'
                    icon: 'icon-puzzlee'
                },
                {
                    name: 'Bank Interest/Profit',
                    url: '/pages/source-tax/bank',
                    icon: 'icon-puzzlee'
                },
                {
                    name: 'Savings Certificate',
                    url: '/pages/source-tax/saving-certificate',
                    icon: 'icon-puzzlee'
                },
                {
                    name: 'Others',
                    url: '/pages/source-tax/others',
                    icon: 'icon-puzzlee'
                },
                {
                    name: 'Company TDS',
                    url: '/pages/source-tax/company-tds',
                    icon: '---',
                },
            ]
        },

        {
            name: 'Verify AIT',
            url: '/advance-income-tax',
            icon: 'icon-check',
            children: [
                {
                    name: 'AIT on Car',
                    url: '/pages/AIT/paid-car-ownership',
                    icon: 'icon-puzzlee'
                },
                {
                    name: 'AIT U/S 64',
                    url: '/pages/AIT/advance-tax-ait',
                    icon: 'icon-puzzlee'
                },
                // {
                //     name: 'Regular Tax AIT',
                //     url: '/pages/AIT/regular-tax-ait',
                //     icon: 'icon-puzzle'
                // },
            ]
        },
        {
            name: 'Regular Tax U/S 74',
            url: '/pages/AIT/regular-tax-ait',
            icon: 'icon-cursor',
        },
        // {
        //     name: 'Regular Payment',
        //     url: '/pages/regular-payment',
        //     icon: 'icon-drop',
        // },
        {
            name: 'Tax Payment Status',
            url: '/pages/dashboard',
            icon: 'icon-speedometer',
        },
    ];