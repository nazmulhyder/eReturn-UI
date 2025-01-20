// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  eReturnAuth_api_url: 'http://103.92.84.139:5000/ereturnauth/v2/',
  eLedger_api_url: 'http://103.92.84.139:5000/ereturnledger/v2/',
  eReturn_api_url: 'http://103.92.84.139:5000/ereturnfiling/v2/',
  // eReturnAuth_api_url: 'http://103.92.84.210:8082/',
  //eLedger_api_url: 'http://103.92.84.210:8083/',

  // eLedger_api_url: 'http://localhost:8083/v2/',

  // eReturn_api_url: 'http://103.92.84.210:8080/',

  eReturn_portal_url: 'http://103.92.84.210',
  // eReturn_portal_url: 'http://localhost:4200/',

  eLedger_portal_url:'http://103.92.84.210:82',
};
