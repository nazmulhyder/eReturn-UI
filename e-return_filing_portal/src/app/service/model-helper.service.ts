import { Injectable } from '@angular/core';
import { BasicInformationDTO } from '../model/dto/basic-information-dto';

@Injectable({
  providedIn: 'root'
})
export class ModelHelperService {
  basicInformationDto : BasicInformationDTO;
  constructor() { }
   
  setBasicInformation(helperModel:BasicInformationDTO)
  {
      this.basicInformationDto=helperModel;
  }
  getBasicInformation()
  {
    return this.basicInformationDto;
  }

}
