export class User {
  public etin: string;
  public mobilenumber: string;
  public password: string;
  public confirmpassword: string;

  constructor(
    etin: string,
    mobilenumber: string,
    password: string,
    confirmpassword: string
  ) {
    this.etin = etin;
    this.mobilenumber = mobilenumber;
    this.password = password;
    this.confirmpassword = confirmpassword;
  }
}
