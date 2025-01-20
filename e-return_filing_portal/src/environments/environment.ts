// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  eReturn_api_url: 'http://103.92.84.139:5000/ereturnfiling/v2/',
  eLedger_api_url: 'http://103.92.84.139:5000/ereturnledger/v2/',
  eReturnAuth_api_url: 'http://103.92.84.139:5000/ereturnauth/v2/',
  base_api_url: 'http://103.92.84.139:5000',

  // localhost
  // eReturn_api_url: 'http://localhost:5000/ereturnfiling/v2/',
  // eLedger_api_url: 'http://localhost:5000/ereturnledger/v2/',
  // eReturnAuth_api_url: 'http://localhost:5000/ereturnauth/v2/',

  eReturn_portal_url: 'http://103.92.84.139:42001',
  eLedger_portal_url: 'http://103.92.84.139:42002',
  // eLedger_portal_url: 'http://localhost:55432',
  sonaliBankePayment_portal_url: 'http://27.147.153.82:9001/',
  isCaptchaValidationOpen: false,
};
