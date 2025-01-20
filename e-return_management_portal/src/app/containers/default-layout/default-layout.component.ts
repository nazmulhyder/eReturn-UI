import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { admin_navItems } from '../../admin_side_menu';
import { circle_inspector_navItems } from '../../circle_inspector_side_menu';
import { circle_officer_navItems } from '../../circle_officer_side_menu';
import { ApiUrl } from '../../custom-services/api-url/api-url';
import { ApiService } from '../../custom-services/ApiService';
import { range_navItems } from '../../range_side_menu';
import { super_admin_navItems } from '../../super_admin_side_menu';
import { system_admin_navItems } from '../../system_admin_side_menu';
import { systemManager_navItems } from '../../system_manager_menu';
import { zonal_head_navItems } from '../../zonal_head_side_menu';
import { navItems } from '../../_nav';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.css']
})
export class DefaultLayoutComponent {
  public sidebarMinimized = false;
  public navCircleInspector = circle_inspector_navItems;
  public navCircleOfficer = circle_officer_navItems;
  public navRange = range_navItems;
  public navZonalHead = zonal_head_navItems;
  public navAdmin = admin_navItems;
  public navSuperAdmin = super_admin_navItems;
  public navSystemManager = systemManager_navItems;
  public navSystemAdmin = system_admin_navItems;

  public navItems: any;
  public userName: any;
  public userRoles: any;
  public userType: any;
  private serviceUrl: string;

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  constructor(
    private toastr: ToastrService,
    private apiService: ApiService,
    private apiUrl: ApiUrl,
  ) {
  }

  ngOnInit(): void {
    this.apiUrl.getUrl().subscribe(res => {
      
    });
    this.userName = localStorage.getItem('userName');
    this.userRoles = localStorage.getItem('userRoles');
    this.userType = localStorage.getItem('userType');
    this.getAlertData();
    // console.log('range nav items',this.navRange[5].badge.text);
    // .then(() => this.loadSideMenubar());
  }

  loadSideMenubar(): Promise<void> {
    return new Promise((resolve) => {
      if (this.userRoles == 'CIRCLE_INSPECTOR') {
        this.navItems = this.navCircleInspector;
        resolve();
      }
      else if (this.userRoles == 'CIRCLE_OFFICER') {
        this.navItems = this.navCircleOfficer;
        resolve();
      }
      else if (this.userRoles == 'RANGE_OFFICER') {
        this.navItems = this.navRange;
        resolve();
      }
      else if (this.userRoles == 'ZONAL_HEAD') {
        this.navItems = this.navZonalHead;
        resolve();
      }
      else if (this.userRoles == 'SS_ICT_SUPER_ADMIN' && this.userName!='SYSTEM SUPER ADMIN') {
        this.navItems = this.navSuperAdmin;
        resolve();
      }
      else if (this.userRoles == 'SS_ICT_SUPER_ADMIN' && this.userName=='SYSTEM SUPER ADMIN') {
        this.navItems = this.navSystemAdmin;
        resolve();
      }
      else if (this.userRoles == 'SYSTEM_MANAGER') {
        this.navItems = this.navSystemManager;
        resolve();
      }
      else if (this.userRoles == 'DCT_HQ_ZONE_LTU_ADMIN' || this.userRoles == 'DCT_HQ_CIC_INSPECTION_ADMIN' || this.userRoles == 'SS_ICT_ADMIN') {
        this.navItems = this.navAdmin;
        resolve();
      }
    });
  }

  getAlertData(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.get(environment.management_base_url + '/ereturnmanagement/v2/api/returns/alerts')
        .subscribe(result => {
          // console.log('alert', result);
          localStorage.setItem('notificationNumber', result.replyMessage.length);
          this.navRange[4].badge.text = result.replyMessage.length;
          this.loadSideMenubar();
          resolve();

        },
          error => {
            // reject();
            this.loadSideMenubar();
            console.log(error['error'].errorMessage);
            // this.toastr.error(error['error'].errorMessage, '', {
            //   timeOut: 3000,
            // });
          });
    });
  }
}
