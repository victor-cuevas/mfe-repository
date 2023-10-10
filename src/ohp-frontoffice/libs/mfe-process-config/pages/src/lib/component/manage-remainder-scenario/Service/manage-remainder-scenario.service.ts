import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SpinnerService } from '@close-front-office/mfe-process-config/core';
import { Observable } from 'rxjs';
import { GetRemainderScenarioDto } from '../Models/getremainder-scenario.model';
import { RemainderScenarios } from '../Models/remainder-scenariodto.model';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';
@Injectable({
  providedIn: 'root'
})
export class ManageRemainderScenarioService {

  envapiUrl !: string;
  constructor(private http: HttpClient, private processService: ConfigContextService,private spinnerService:SpinnerService) {

    const mfeConfig = this.processService.getConfigContext() && this.processService.getConfigContext().REMOTE_MFES.find(item => item.path === 'process') as MfeModel;
    this.envapiUrl = mfeConfig?.apiUrl;
  }
  getRemainderScenario(){
    this.spinnerService.setIsLoading(true);
    return this.http.get(this.envapiUrl+'api/ProcessConfig/reminderscenario');
  }

  saveRemainderScenario(remainderScenarioList : RemainderScenarios[]):Observable<RemainderScenarios[]>{
    this.spinnerService.setIsLoading(true);
    return this.http.put<RemainderScenarios[]>(this.envapiUrl +'api/processconfig/reminderscenario',remainderScenarioList);
  }

}
