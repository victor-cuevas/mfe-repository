import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Assistant } from '../models/assistant';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';

@Injectable({
  providedIn: 'root',
})
export class CaseMockService {
  private mfeConfig = this.configService.getConfigContext().REMOTE_MFES.find(item => item.path === 'panel') as MfeModel;
  private usersUrl = this.mfeConfig.remoteUrl + '/assets/mock-data/organisation/assistants.json';

  constructor(private http: HttpClient, private configService: ConfigContextService) {}

  getUsers(): Observable<Assistant[]> {
    return this.http.get<Assistant[]>(this.usersUrl);
  }
}
