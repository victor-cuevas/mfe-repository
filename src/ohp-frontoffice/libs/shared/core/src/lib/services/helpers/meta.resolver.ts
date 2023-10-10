import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { ConfigContextService } from '@close-front-office/shared/config';
import { ClientConfigService } from './client-config.service';

type Meta = {
  title?: string;
  prefix?: string;
  description?: string;
};

const isMeta = (val: unknown): val is Meta => {
  return !!(val as Meta)?.title || !!(val as Meta)?.prefix || !!(val as Meta)?.description;
};

@Injectable({
  providedIn: 'root',
})
export class MetaResolver {
  homePageId = 'home';
  appshellCode = 'appshell';
  isDev = this.config.getConfigContext().STAGE === 'dev';
  appsConfig = 'APPS';

  constructor(private config: ConfigContextService, private clientConfig: ClientConfigService) {}

  resolve(route: ActivatedRouteSnapshot): void {
    //Recursively find the pageId in the route
    const meta = this.findMetaByRouteId(route);

    if (!meta) return;

    const { prefix, title, description } = meta;

    // compose the title and description
    let parsedPrefix = '';
    if (prefix) {
      parsedPrefix = this.resolveParam(prefix, route);

      if (parsedPrefix) parsedPrefix += ' | ';
    }

    if (title) {
      document.title = `${parsedPrefix}${this.resolveParam(title, route)}`;
    }

    if (description) {
      document.querySelector('meta[name="description"]')?.setAttribute('content', this.resolveParam(description, route));
    }
  }

  /** Parse the string to resolve parameters in the config. Params must be surrounded by angle brackets (<param>). */
  private resolveParam(str: string, route: ActivatedRouteSnapshot): string {
    const routeParams: string[] = str.match(/(?<=<)(.*?)(?=>)/g) ?? [];
    const configParams: string[] = str.match(/(?<={{)(.*?)(?=}})/g) ?? [];

    const parsedRouteParams = routeParams.reduce<[string, string][]>((acc, param) => {
      param = param.trim();
      const paramValue: string | undefined = this.findRouteParam(param, route);

      if (this.isDev && !paramValue) {
        console.error(`The provided parameter ${param} doesn't exist in the current URL.`);
      }

      return paramValue ? [...acc, [param, paramValue]] : acc;
    }, []);

    const parsedConfigParams = configParams.reduce<[string, string][]>((acc, param) => {
      param = param.trim();
      const paramValue: string | undefined = this.clientConfig.getConfig(`PARAMS.${param}`);
      if (this.isDev && !paramValue) {
        console.error(`The provided parameter ${param} doesn't exist in the current client configuration.`);
      }

      return paramValue ? [...acc, [param, paramValue]] : acc;
    }, []);

    [...parsedRouteParams, ...parsedConfigParams].forEach(param => {
      const [key, value] = param;

      str = str.replaceAll(new RegExp('<\\s*' + key + '\\s*>', 'g'), value);
      str = str.replaceAll(new RegExp('{{\\s*' + key + '\\s*}}', 'g'), value);
    });

    return str;
  }

  /** Recursively finds if the param exists in the current route. Short-circuits as soon as a matching param is found */
  private findRouteParam(param: string, route: ActivatedRouteSnapshot): string | undefined {
    if (route.params[param]) return route.params[param];
    if (!route.firstChild) return;
    return this.findRouteParam(param, route.firstChild);
  }

  /** Recursively finds the last pageId in the current route. If the last route has no pageId, it returns the closest ID in the parent routes */
  private findMetaByRouteId(route: ActivatedRouteSnapshot): Meta | undefined {
    // Find meta information of the last route element
    let meta: Meta | undefined;
    if (route.firstChild) {
      meta = this.findMetaByRouteId(route.firstChild);
    }
    if (meta) return meta;

    // override with data.pageId
    if (route.data['pageId']) {
      const [appCode, pageId] = route.data['pageId'].split('.');

      const pageAccessor = `${this.appsConfig}.${appCode || this.appshellCode}.${pageId || this.homePageId}`;

      const pageConfig = this.clientConfig.getConfig<{ meta: Meta }>(pageAccessor);

      if (!pageConfig) return;
      if (!isMeta(pageConfig.meta)) return;

      return pageConfig.meta;
    }

    // If there's no meta, calculate the page ID and return the associated meta information
    const pathElements = route.pathFromRoot.reduce<string[]>((acc, el) => {
      return el.routeConfig?.path ? [...acc, el.routeConfig.path] : acc;
    }, []);

    const pagePath = pathElements.reduce((acc, el, i) => {
      const lower = el.replaceAll(/[^a-z]/gi, '').toLowerCase();
      if (i === 0) return `${lower}.`;
      if (i === 1) return acc + lower;
      return acc + `${lower[0].toUpperCase()}${lower.slice(1)}`;
    }, '');

    const [appCode, pageId] = pagePath.split('.');
    const pageAccessor = `${this.appsConfig}.${appCode || this.appshellCode}.${pageId || this.homePageId}`;

    const pageConfig = this.clientConfig.getConfig<{ meta: Meta }>(pageAccessor);

    if (!pageConfig) return;
    if (!isMeta(pageConfig.meta)) return;

    return pageConfig.meta;
  }
}
