import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})

export class BasicInfoService {
  id: any;
  tin: any;
  oldTin: any;
  email: any;
  phone: any;
  nid: any;
  passportNumber: any;
  assesName: any;
  smartId: any;
  circle: any;
  circleNo: any;
  zone: any;
  zoneNo: any;
  status: any;
  gender: any;
  fathersName: any;
  mothersName: any;
  spouseName: any;
  spouseTin: any;
  image: any;
  dob: any;
  nationality: any;
  presentAddress: any;
  permanentAddress: any;
  return_under_82BB: any;
  assessmentYear: any;
  residentStatus: any;
  startOfIncomeYr: any;
  endOfIncomeYr: any;
  businessIdNumber: any;
  mandatoryITTenB: any;
  grossWealth: any;
  warWoundedFreedomFighter: any;
  personWithDisability: any;
  guardianOfDisablePerson: any;
  isALApplicable: any;
  twenty_four_a: any;
  twenty_four_b: any;
  twenty_four_c: any;
  twenty_four_d: any;
  IT10BB_Mandatory: any;
  age: any;
  totalEmployerAndOffice: any;
  referenceNo: any;
  submissionDate: any;

  patchValue(data: any) {
    console.log('Called');
    this.id = data.id;
    this.tin = data.tin;
    this.oldTin = data.oldTin;
    this.email = data.email;
    this.phone = data.phone;
    this.nid = data.nid;
    this.passportNumber = data.passportNumber;
    this.assesName = data.assesName;
    this.smartId = data.smartId;
    this.circle = data.circle;
    this.circleNo = data.circleNo;
    this.zone = data.zone;
    this.zoneNo = data.zoneNo;
    this.status = data.status;
    this.gender = data.gender;
    this.fathersName = data.fathersName;
    this.mothersName = data.mothersName;
    this.spouseName = data.spouseName;
    this.spouseTin = data.spouseTin;
    this.image = data.image;
    this.dob = data.dob;
    this.nationality = data.nationality;
    this.presentAddress = data.presentAddress;
    this.permanentAddress = data.permanentAddress;
    this.return_under_82BB = data.return_under_82BB;
    this.assessmentYear = data.assessmentYear;
    this.residentStatus = data.residentStatus;
    this.startOfIncomeYr = data.startOfIncomeYr;
    this.endOfIncomeYr = data.endOfIncomeYr;
    this.businessIdNumber = data.businessIdNumber;
    this.mandatoryITTenB = data.mandatoryITTenB;
    this.grossWealth = data.grossWealth;
    this.warWoundedFreedomFighter = data.warWoundedFreedomFighter;
    this.personWithDisability = data.personWithDisability;
    this.guardianOfDisablePerson = data.guardianOfDisablePerson;
    this.isALApplicable = data.isALApplicable;
    this.twenty_four_a = data.twenty_four_a;
    this.twenty_four_b = data.twenty_four_b;
    this.twenty_four_c = data.twenty_four_c;
    this.twenty_four_d = data.twenty_four_d;
    this.IT10BB_Mandatory = data.IT10BB_Mandatory;
    this.age = data.age;
    this.totalEmployerAndOffice = data.totalEmployerAndOffice;
    this.referenceNo = data.referenceNo;
    this.submissionDate = data.submissionDate;

  }

}