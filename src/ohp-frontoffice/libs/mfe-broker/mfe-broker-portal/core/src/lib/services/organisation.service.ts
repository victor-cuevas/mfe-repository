import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Model imports
import { Assistant } from '../models/assistant';
import { FirmMember } from '../models/firm-member';
import { ApplicantMock } from '../models/applicant-mock';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';

@Injectable({
  providedIn: 'root',
})
export class OrganisationService {
  private mfeConfig = this.configService.getConfigContext()?.REMOTE_MFES.find(item => item.path === 'panel') as MfeModel;
  private firmMembersUrl = this.mfeConfig?.remoteUrl + '/assets/mock-data/organisation/firm-members.json';
  private assistantsUrl = this.mfeConfig?.remoteUrl + '/assets/mock-data/organisation/assistants.json';
  private applicantsUrl = this.mfeConfig?.remoteUrl + '/assets/mock-data/organisation/applicants.json';

  constructor(private http: HttpClient, private configService: ConfigContextService) {}
  /**GET firm Members from the server */
  getFirmMembers(): Observable<FirmMember[]> {
    return this.http.get<FirmMember[]>(this.firmMembersUrl);
  }

  /**GET assistants from the server */
  getAssistants(): Observable<Assistant[]> {
    return this.http.get<Assistant[]>(this.assistantsUrl);
  }

  /**PUT update firmMember on the server */
  updateFirmMember(firmMember: FirmMember): Observable<FirmMember> {
    return this.http.put<FirmMember>(this.firmMembersUrl, firmMember);
  }

  /**GET firm Members from the server */
  getApplicants(): Observable<ApplicantMock[]> {
    return this.http.get<ApplicantMock[]>(this.applicantsUrl);
  }
}
