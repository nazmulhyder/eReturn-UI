// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,

  //localhost url
  // eReturnAuth_api_url:'http://localhost:8082/v2/',
  // eLedger_api_url:'http://localhost:8083/v2/',
  // eReturn_api_url:'http://localhost:8080/v2/',
  // management_api_url:'http://localhost:8084/v2/',

  //staging-v2 url
  eReturn_api_url: 'http://103.92.84.139:5000/ereturnfiling/v2/',
  eLedger_api_url: 'http://103.92.84.139:5000/ereturnledger/v2/',
  // eReturnAuth_api_url:'http://103.92.84.139:5000/ereturnauth/v2/',
  // management_api_url:'http://103.92.84.139:8000/ereturnmanagement/v2/',
  management_base_url:'http://103.92.84.139:8000',

  //localhost url
  // management_base_url:'http://localhost:8000',
  // eReturnAuth_api_url:'http://localhost:5000/ereturnauth/v2/',
  // management_api_url:'http://localhost:8000/ereturnmanagement/v2/',

  isCaptchaValidationOpen: false,
};
