import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface ApiServiceInterface {
	getHttpHeaders(): HttpHeaders;
	setHttpHeaders(httpHeaders: HttpHeaders): HttpHeaders;
	get(url: string, params?: HttpParams, httpHeaders?: HttpHeaders): Observable<any>;
	post(url: string, data: any, httpHeaders?: HttpHeaders): Observable<any>;
	put(url: string, data: any, httpHeaders?: HttpHeaders): Observable<any>;
	delete(url: string, httpHeaders?: HttpHeaders): Observable<any>;
	patch(url: string, data: any, httpHeaders?: HttpHeaders): Observable<any>;

}

@Injectable({
	providedIn: 'root',
})
export class ApiService implements ApiServiceInterface {
	constructor(private httpClient: HttpClient) { }

	private httpHeaders: HttpHeaders = new HttpHeaders(
		{
			'Content-Type': 'application/json'
			/*'Authorization': 'jwt-token'*/
		});


	public getHttpHeaders(): HttpHeaders {
		return this.httpHeaders;
	}
	public setHttpHeaders(httpHeaders: HttpHeaders): HttpHeaders {
		this.httpHeaders = httpHeaders;
		return this.getHttpHeaders();
	}

	public getAuthHeader() {
		const headers = new HttpHeaders()
		  .set('Authorization', 'Bearer ' + localStorage.getItem("BearerToken"));
		if (headers) {
		  return headers;
		}
	}

	public customGet(url: string, params?: HttpParams): Observable<any> {
		let headers = this.getAuthHeader();
		if (params != null) {
			return this.httpClient.get<any>(url, { headers: headers, params: params });
		} else {
			return this.httpClient.get<any>(url, { headers: headers });
		}

	}

	public get(url: string, params?: HttpParams, httpHeaders?: HttpHeaders): Observable<any> {
		let headers = httpHeaders != null ? httpHeaders : this.httpHeaders;
		if (params != null) {
			return this.httpClient.get<any>(url, { headers: headers, params: params });
		} else {
			return this.httpClient.get<any>(url, { headers: headers });
		}

	}
	public post(url: string, data: any, httpHeaders?: HttpHeaders): Observable<any> {
		let headers: HttpHeaders = httpHeaders != null ? httpHeaders : this.httpHeaders;
		return this.httpClient.post<any>(url, JSON.stringify(data), { headers: headers });
	}
	public put(url: string, data: any, httpHeaders?: HttpHeaders): Observable<any> {
		let headers = httpHeaders != null ? httpHeaders : this.httpHeaders;
		return this.httpClient.put<any>(url, JSON.stringify(data), { headers: headers });
	}
	public delete(url: string, httpHeaders?: HttpHeaders, params?: HttpParams): Observable<any> {
		let headers = httpHeaders != null ? httpHeaders : this.httpHeaders;
		if (params != null) {
			return this.httpClient.delete<any>(url, { headers: headers, params: params });
		} else {
			return this.httpClient.delete<any>(url, { headers: headers });
		}
		// return this.httpClient.delete<any>(url, { headers: headers });
	}
	public patch(url: string, data: any, httpHeaders?: HttpHeaders): Observable<any> {
		let headers = httpHeaders != null ? httpHeaders : this.httpHeaders;
		return this.httpClient.patch<any>(url, JSON.stringify(data), { headers: headers });
	}

}




