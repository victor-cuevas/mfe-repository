/**
 * Broker Panel API
 * A Microservice API to support request from the front-end broker panel.
 *
 * The version of the OpenAPI document: v1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent, HttpParameterCodec, HttpContext 
        }       from '@angular/common/http';
import { CustomHttpParameterCodec }                          from '../encoder';
import { Observable }                                        from 'rxjs';

// @ts-ignore
import { CreateNewGlobalSubmissionRouteRequestEx } from '../model/createNewGlobalSubmissionRouteRequestEx';
// @ts-ignore
import { ProblemDetails } from '../model/problemDetails';
// @ts-ignore
import { SaveSubmissionRouteAssociationsRequest } from '../model/saveSubmissionRouteAssociationsRequest';
// @ts-ignore
import { SearchGlobalSubmissionRoutesRequest } from '../model/searchGlobalSubmissionRoutesRequest';
// @ts-ignore
import { SubmissionRouteAssociationModel } from '../model/submissionRouteAssociationModel';
// @ts-ignore
import { SubmissionRouteModel } from '../model/submissionRouteModel';
// @ts-ignore
import { SubmissionRouteSearchResultPageModel } from '../model/submissionRouteSearchResultPageModel';
// @ts-ignore
import { UpdateGlobalSubmissionRouteRequest } from '../model/updateGlobalSubmissionRouteRequest';

// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';



@Injectable({
  providedIn: 'any'
})
export class SubmissionRoutesService {

    protected basePath = 'http://localhost';
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();
    public encoder: HttpParameterCodec;

    constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string|string[], @Optional() configuration: Configuration) {
        if (configuration) {
            this.configuration = configuration;
        }
        if (typeof this.configuration.basePath !== 'string') {
            if (Array.isArray(basePath) && basePath.length > 0) {
                basePath = basePath[0];
            }

            if (typeof basePath !== 'string') {
                basePath = this.basePath;
            }
            this.configuration.basePath = basePath;
        }
        this.encoder = this.configuration.encoder || new CustomHttpParameterCodec();
    }


    // @ts-ignore
    private addToHttpParams(httpParams: HttpParams, value: any, key?: string): HttpParams {
        if (typeof value === "object" && value instanceof Date === false) {
            httpParams = this.addToHttpParamsRecursive(httpParams, value);
        } else {
            httpParams = this.addToHttpParamsRecursive(httpParams, value, key);
        }
        return httpParams;
    }

    private addToHttpParamsRecursive(httpParams: HttpParams, value?: any, key?: string): HttpParams {
        if (value == null) {
            return httpParams;
        }

        if (typeof value === "object") {
            if (Array.isArray(value)) {
                (value as any[]).forEach( elem => httpParams = this.addToHttpParamsRecursive(httpParams, elem, key));
            } else if (value instanceof Date) {
                if (key != null) {
                    httpParams = httpParams.append(key, (value as Date).toISOString().substr(0, 10));
                } else {
                   throw Error("key may not be null if value is Date");
                }
            } else {
                Object.keys(value).forEach( k => httpParams = this.addToHttpParamsRecursive(
                    httpParams, value[k], key != null ? `${key}.${k}` : k));
            }
        } else if (key != null) {
            httpParams = httpParams.append(key, value);
        } else {
            throw Error("key may not be null if value is not object or array");
        }
        return httpParams;
    }

    /**
     * @param firmId 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public submissionRoutesGetSubmissionRouteAssociationsByFirmId(firmId: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<SubmissionRouteAssociationModel>;
    public submissionRoutesGetSubmissionRouteAssociationsByFirmId(firmId: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<SubmissionRouteAssociationModel>>;
    public submissionRoutesGetSubmissionRouteAssociationsByFirmId(firmId: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<SubmissionRouteAssociationModel>>;
    public submissionRoutesGetSubmissionRouteAssociationsByFirmId(firmId: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        if (firmId === null || firmId === undefined) {
            throw new Error('Required parameter firmId was null or undefined when calling submissionRoutesGetSubmissionRouteAssociationsByFirmId.');
        }

        let localVarHeaders = this.defaultHeaders;

        let localVarCredential: string | undefined;
        // authentication (JWT) required
        localVarCredential = this.configuration.lookupCredential('JWT');
        if (localVarCredential) {
            localVarHeaders = localVarHeaders.set('Authorization', localVarCredential);
        }

        let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (localVarHttpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            localVarHttpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (localVarHttpHeaderAcceptSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Accept', localVarHttpHeaderAcceptSelected);
        }

        let localVarHttpContext: HttpContext | undefined = options && options.context;
        if (localVarHttpContext === undefined) {
            localVarHttpContext = new HttpContext();
        }


        let responseType_: 'text' | 'json' | 'blob' = 'json';
        if (localVarHttpHeaderAcceptSelected) {
            if (localVarHttpHeaderAcceptSelected.startsWith('text')) {
                responseType_ = 'text';
            } else if (this.configuration.isJsonMime(localVarHttpHeaderAcceptSelected)) {
                responseType_ = 'json';
            } else {
                responseType_ = 'blob';
            }
        }

        let localVarPath = `/api/SubmissionRoutes/firms/${this.configuration.encodeParam({name: "firmId", value: firmId, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: undefined})}/associations`;
        return this.httpClient.request<SubmissionRouteAssociationModel>('get', `${this.configuration.basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: localVarHeaders,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * @param submissionRouteId 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public submissionRoutesGetSubmissionRouteById(submissionRouteId: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<SubmissionRouteModel>;
    public submissionRoutesGetSubmissionRouteById(submissionRouteId: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<SubmissionRouteModel>>;
    public submissionRoutesGetSubmissionRouteById(submissionRouteId: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<SubmissionRouteModel>>;
    public submissionRoutesGetSubmissionRouteById(submissionRouteId: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        if (submissionRouteId === null || submissionRouteId === undefined) {
            throw new Error('Required parameter submissionRouteId was null or undefined when calling submissionRoutesGetSubmissionRouteById.');
        }

        let localVarHeaders = this.defaultHeaders;

        let localVarCredential: string | undefined;
        // authentication (JWT) required
        localVarCredential = this.configuration.lookupCredential('JWT');
        if (localVarCredential) {
            localVarHeaders = localVarHeaders.set('Authorization', localVarCredential);
        }

        let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (localVarHttpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            localVarHttpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (localVarHttpHeaderAcceptSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Accept', localVarHttpHeaderAcceptSelected);
        }

        let localVarHttpContext: HttpContext | undefined = options && options.context;
        if (localVarHttpContext === undefined) {
            localVarHttpContext = new HttpContext();
        }


        let responseType_: 'text' | 'json' | 'blob' = 'json';
        if (localVarHttpHeaderAcceptSelected) {
            if (localVarHttpHeaderAcceptSelected.startsWith('text')) {
                responseType_ = 'text';
            } else if (this.configuration.isJsonMime(localVarHttpHeaderAcceptSelected)) {
                responseType_ = 'json';
            } else {
                responseType_ = 'blob';
            }
        }

        let localVarPath = `/api/SubmissionRoutes/${this.configuration.encodeParam({name: "submissionRouteId", value: submissionRouteId, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: undefined})}`;
        return this.httpClient.request<SubmissionRouteModel>('get', `${this.configuration.basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: localVarHeaders,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * @param createNewGlobalSubmissionRouteRequestEx 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public submissionRoutesPostSubmissionRoute(createNewGlobalSubmissionRouteRequestEx: CreateNewGlobalSubmissionRouteRequestEx, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any>;
    public submissionRoutesPostSubmissionRoute(createNewGlobalSubmissionRouteRequestEx: CreateNewGlobalSubmissionRouteRequestEx, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<any>>;
    public submissionRoutesPostSubmissionRoute(createNewGlobalSubmissionRouteRequestEx: CreateNewGlobalSubmissionRouteRequestEx, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<any>>;
    public submissionRoutesPostSubmissionRoute(createNewGlobalSubmissionRouteRequestEx: CreateNewGlobalSubmissionRouteRequestEx, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        if (createNewGlobalSubmissionRouteRequestEx === null || createNewGlobalSubmissionRouteRequestEx === undefined) {
            throw new Error('Required parameter createNewGlobalSubmissionRouteRequestEx was null or undefined when calling submissionRoutesPostSubmissionRoute.');
        }

        let localVarHeaders = this.defaultHeaders;

        let localVarCredential: string | undefined;
        // authentication (JWT) required
        localVarCredential = this.configuration.lookupCredential('JWT');
        if (localVarCredential) {
            localVarHeaders = localVarHeaders.set('Authorization', localVarCredential);
        }

        let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (localVarHttpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            localVarHttpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (localVarHttpHeaderAcceptSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Accept', localVarHttpHeaderAcceptSelected);
        }

        let localVarHttpContext: HttpContext | undefined = options && options.context;
        if (localVarHttpContext === undefined) {
            localVarHttpContext = new HttpContext();
        }


        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Content-Type', httpContentTypeSelected);
        }

        let responseType_: 'text' | 'json' | 'blob' = 'json';
        if (localVarHttpHeaderAcceptSelected) {
            if (localVarHttpHeaderAcceptSelected.startsWith('text')) {
                responseType_ = 'text';
            } else if (this.configuration.isJsonMime(localVarHttpHeaderAcceptSelected)) {
                responseType_ = 'json';
            } else {
                responseType_ = 'blob';
            }
        }

        let localVarPath = `/api/SubmissionRoutes`;
        return this.httpClient.request<any>('post', `${this.configuration.basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                body: createNewGlobalSubmissionRouteRequestEx,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: localVarHeaders,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * @param submissionRouteId 
     * @param updateGlobalSubmissionRouteRequest 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public submissionRoutesPutSubmissionRoute(submissionRouteId: string, updateGlobalSubmissionRouteRequest: UpdateGlobalSubmissionRouteRequest, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any>;
    public submissionRoutesPutSubmissionRoute(submissionRouteId: string, updateGlobalSubmissionRouteRequest: UpdateGlobalSubmissionRouteRequest, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<any>>;
    public submissionRoutesPutSubmissionRoute(submissionRouteId: string, updateGlobalSubmissionRouteRequest: UpdateGlobalSubmissionRouteRequest, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<any>>;
    public submissionRoutesPutSubmissionRoute(submissionRouteId: string, updateGlobalSubmissionRouteRequest: UpdateGlobalSubmissionRouteRequest, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        if (submissionRouteId === null || submissionRouteId === undefined) {
            throw new Error('Required parameter submissionRouteId was null or undefined when calling submissionRoutesPutSubmissionRoute.');
        }
        if (updateGlobalSubmissionRouteRequest === null || updateGlobalSubmissionRouteRequest === undefined) {
            throw new Error('Required parameter updateGlobalSubmissionRouteRequest was null or undefined when calling submissionRoutesPutSubmissionRoute.');
        }

        let localVarHeaders = this.defaultHeaders;

        let localVarCredential: string | undefined;
        // authentication (JWT) required
        localVarCredential = this.configuration.lookupCredential('JWT');
        if (localVarCredential) {
            localVarHeaders = localVarHeaders.set('Authorization', localVarCredential);
        }

        let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (localVarHttpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            localVarHttpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (localVarHttpHeaderAcceptSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Accept', localVarHttpHeaderAcceptSelected);
        }

        let localVarHttpContext: HttpContext | undefined = options && options.context;
        if (localVarHttpContext === undefined) {
            localVarHttpContext = new HttpContext();
        }


        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Content-Type', httpContentTypeSelected);
        }

        let responseType_: 'text' | 'json' | 'blob' = 'json';
        if (localVarHttpHeaderAcceptSelected) {
            if (localVarHttpHeaderAcceptSelected.startsWith('text')) {
                responseType_ = 'text';
            } else if (this.configuration.isJsonMime(localVarHttpHeaderAcceptSelected)) {
                responseType_ = 'json';
            } else {
                responseType_ = 'blob';
            }
        }

        let localVarPath = `/api/SubmissionRoutes/${this.configuration.encodeParam({name: "submissionRouteId", value: submissionRouteId, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: undefined})}`;
        return this.httpClient.request<any>('put', `${this.configuration.basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                body: updateGlobalSubmissionRouteRequest,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: localVarHeaders,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * @param firmId 
     * @param saveSubmissionRouteAssociationsRequest 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public submissionRoutesPutSubmissionRouteAssociations(firmId: string, saveSubmissionRouteAssociationsRequest: SaveSubmissionRouteAssociationsRequest, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any>;
    public submissionRoutesPutSubmissionRouteAssociations(firmId: string, saveSubmissionRouteAssociationsRequest: SaveSubmissionRouteAssociationsRequest, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<any>>;
    public submissionRoutesPutSubmissionRouteAssociations(firmId: string, saveSubmissionRouteAssociationsRequest: SaveSubmissionRouteAssociationsRequest, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<any>>;
    public submissionRoutesPutSubmissionRouteAssociations(firmId: string, saveSubmissionRouteAssociationsRequest: SaveSubmissionRouteAssociationsRequest, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        if (firmId === null || firmId === undefined) {
            throw new Error('Required parameter firmId was null or undefined when calling submissionRoutesPutSubmissionRouteAssociations.');
        }
        if (saveSubmissionRouteAssociationsRequest === null || saveSubmissionRouteAssociationsRequest === undefined) {
            throw new Error('Required parameter saveSubmissionRouteAssociationsRequest was null or undefined when calling submissionRoutesPutSubmissionRouteAssociations.');
        }

        let localVarHeaders = this.defaultHeaders;

        let localVarCredential: string | undefined;
        // authentication (JWT) required
        localVarCredential = this.configuration.lookupCredential('JWT');
        if (localVarCredential) {
            localVarHeaders = localVarHeaders.set('Authorization', localVarCredential);
        }

        let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (localVarHttpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            localVarHttpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (localVarHttpHeaderAcceptSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Accept', localVarHttpHeaderAcceptSelected);
        }

        let localVarHttpContext: HttpContext | undefined = options && options.context;
        if (localVarHttpContext === undefined) {
            localVarHttpContext = new HttpContext();
        }


        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Content-Type', httpContentTypeSelected);
        }

        let responseType_: 'text' | 'json' | 'blob' = 'json';
        if (localVarHttpHeaderAcceptSelected) {
            if (localVarHttpHeaderAcceptSelected.startsWith('text')) {
                responseType_ = 'text';
            } else if (this.configuration.isJsonMime(localVarHttpHeaderAcceptSelected)) {
                responseType_ = 'json';
            } else {
                responseType_ = 'blob';
            }
        }

        let localVarPath = `/api/SubmissionRoutes/firms/${this.configuration.encodeParam({name: "firmId", value: firmId, in: "path", style: "simple", explode: false, dataType: "string", dataFormat: undefined})}/associations`;
        return this.httpClient.request<any>('put', `${this.configuration.basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                body: saveSubmissionRouteAssociationsRequest,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: localVarHeaders,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * @param searchGlobalSubmissionRoutesRequest 
     * @param page 
     * @param pageSize 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public submissionRoutesSearchSubmissionRoute(searchGlobalSubmissionRoutesRequest: SearchGlobalSubmissionRoutesRequest, page?: number, pageSize?: number, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<SubmissionRouteSearchResultPageModel>;
    public submissionRoutesSearchSubmissionRoute(searchGlobalSubmissionRoutesRequest: SearchGlobalSubmissionRoutesRequest, page?: number, pageSize?: number, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<SubmissionRouteSearchResultPageModel>>;
    public submissionRoutesSearchSubmissionRoute(searchGlobalSubmissionRoutesRequest: SearchGlobalSubmissionRoutesRequest, page?: number, pageSize?: number, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<SubmissionRouteSearchResultPageModel>>;
    public submissionRoutesSearchSubmissionRoute(searchGlobalSubmissionRoutesRequest: SearchGlobalSubmissionRoutesRequest, page?: number, pageSize?: number, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        if (searchGlobalSubmissionRoutesRequest === null || searchGlobalSubmissionRoutesRequest === undefined) {
            throw new Error('Required parameter searchGlobalSubmissionRoutesRequest was null or undefined when calling submissionRoutesSearchSubmissionRoute.');
        }

        let localVarQueryParameters = new HttpParams({encoder: this.encoder});
        if (page !== undefined && page !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>page, 'page');
        }
        if (pageSize !== undefined && pageSize !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>pageSize, 'pageSize');
        }

        let localVarHeaders = this.defaultHeaders;

        let localVarCredential: string | undefined;
        // authentication (JWT) required
        localVarCredential = this.configuration.lookupCredential('JWT');
        if (localVarCredential) {
            localVarHeaders = localVarHeaders.set('Authorization', localVarCredential);
        }

        let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (localVarHttpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            localVarHttpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (localVarHttpHeaderAcceptSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Accept', localVarHttpHeaderAcceptSelected);
        }

        let localVarHttpContext: HttpContext | undefined = options && options.context;
        if (localVarHttpContext === undefined) {
            localVarHttpContext = new HttpContext();
        }


        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Content-Type', httpContentTypeSelected);
        }

        let responseType_: 'text' | 'json' | 'blob' = 'json';
        if (localVarHttpHeaderAcceptSelected) {
            if (localVarHttpHeaderAcceptSelected.startsWith('text')) {
                responseType_ = 'text';
            } else if (this.configuration.isJsonMime(localVarHttpHeaderAcceptSelected)) {
                responseType_ = 'json';
            } else {
                responseType_ = 'blob';
            }
        }

        let localVarPath = `/api/SubmissionRoutes/search`;
        return this.httpClient.request<SubmissionRouteSearchResultPageModel>('post', `${this.configuration.basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                body: searchGlobalSubmissionRoutesRequest,
                params: localVarQueryParameters,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: localVarHeaders,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}
