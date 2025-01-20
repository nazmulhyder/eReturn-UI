export const environment = {
  production: true,

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
