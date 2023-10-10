import { Pipe, PipeTransform } from '@angular/core';
import { ConfigContextService, MfeModel } from '@close-front-office/shared/config';

@Pipe({
  name: 'prependEnvPath',
})
export class PrependEnvPathPipe implements PipeTransform {
  constructor(private service: ConfigContextService) {}

  transform(value: string, path: 'broker' | 'panel' = 'broker'): string {
    const mfeConfig = this.service.getConfigContext()?.REMOTE_MFES.find((item: MfeModel) => item.path === path) as MfeModel;

    return mfeConfig?.remoteUrl + value;
  }
}
