import { EnvironmentProviders, inject, Injectable, InjectionToken, makeEnvironmentProviders } from '@angular/core';
import {
  HTTP_INTERCEPTORS,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { CacheService } from './cache.service';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

interface CacheConfig {
  // the data time-to-live (ms)
  ttl: number;
}

const CACHE_CONFIG = new InjectionToken<CacheConfig>('Cache Config');

/**
 * Inject the cache interceptor and its dependencies.
 * @param config
 */
export function provideCacheInterceptor(config: CacheConfig): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CacheInterceptorService,
      multi: true,
    },
    {
      provide: CACHE_CONFIG,
      useValue: config,
    },
  ]);
}

/**
 * Even though this app uses a service worker, the 'freshness' strategy defined on the worker
 * ensures its cache is ignored unless there is no network.
 * Thus, this cache will be used.
 */
@Injectable()
export class CacheInterceptorService implements HttpInterceptor {
  private cache = inject(CacheService);
  private cacheConfig = inject(CACHE_CONFIG);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.method !== 'GET' || req.responseType !== 'json') {
      return next.handle(req);
    }

    const cachedRes = this.cache.get(req.urlWithParams);
    if (cachedRes) {
      return of(new HttpResponse({ body: cachedRes }));
    }

    return next.handle(req).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          this.cache.set(req.urlWithParams, event.body, this.cacheConfig.ttl);
        }
      }),
    );
  }
}
