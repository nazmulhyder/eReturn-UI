import {Observable} from 'rxjs';

export interface Url {
  serviceName: string;
  url: string;
}

export abstract class ApiUrl {
abstract getUrl(): Observable<Url[]>;
}
