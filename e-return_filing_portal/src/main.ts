import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { AuthUtilService } from './app/service/auth-util/auth.util.service';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule, {
  useJit: true,
  preserveWhitespaces: true
})
  .catch(err => console.log(err));

// platformBrowserDynamic().bootstrapModule(AppModule, {
//   useJit: true,
//   preserveWhitespaces: true
// }).then(ref => {
//   //Inject any Service here which needs to be Constructed at App Startup
//   ref.injector.get(AuthUtilService);
// })
//   .catch(err => console.log(err));
