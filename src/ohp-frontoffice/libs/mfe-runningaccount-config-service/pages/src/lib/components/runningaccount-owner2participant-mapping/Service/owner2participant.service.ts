import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
import { getOwner2ParticipantMappingList } from '../Models/getOwner2participant.model';
import { owner2Participant } from '../Models/owner2participant.model';

@Injectable({
  providedIn: 'root'
})
export class Owner2participantService {


  protected envApiUrl: string;

  constructor(private http: HttpClient, private commonService: ConfigContextService) {
    const mfeConfig = this.commonService.getConfigContext() && this.commonService.getConfigContext().REMOTE_MFES.find(item => item.path === 'runningaccount') as MfeModel;
    this.envApiUrl = mfeConfig?.apiUrl;
  }

  public getOwner2ParticipantList(): Observable<getOwner2ParticipantMappingList> {
    return this.http.get<getOwner2ParticipantMappingList>(this.envApiUrl + 'api/RunningAccount/Owner2ParticipantMapping'
    );
  }

  public saveOwner2Participant(request: owner2Participant[]) {
    return this.http.put(this.envApiUrl + 'api/RunningAccount/Owner2ParticipantMapping', request)
  }
}
