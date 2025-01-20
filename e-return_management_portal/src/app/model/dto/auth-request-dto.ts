export class AuthRequestDTO {
    userIdentification: string;
    phone: string;
    oldPass: string;
    newPass: string;
    retypedNewPass: string;
    feature: string;
    userType: string;
    captcha: string;
    otp: number;
    passportNumber: string;
}