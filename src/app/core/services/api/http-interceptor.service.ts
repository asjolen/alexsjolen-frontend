import { Injectable } from "@angular/core";
import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpClient, HttpResponse} from "@angular/common/http";
import {ApiService} from "./api.service";
import {delay, finalize, Observable, of, retryWhen, tap} from "rxjs";
import {CacheService} from "../cache/cache.service";
import * as _ from "lodash";

@Injectable({
  providedIn: "root"
})
export class HttpInterceptorService implements HttpInterceptor {
  skipCache = ["/assets/i18n/"];
  hideErrorOn: any = []
  pendingRequests: any = [];

  constructor(private http: HttpClient, private apiService: ApiService,
              private cacheService: CacheService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): any {
    if (req.method === "GET" && !this.cacheService.cacheExpired(req) && this.useCache(req) && this.cacheService.getCache(req)) {
      console.log("%c >> Using cache ",
        "background: green; color: white", req.urlWithParams, this.cacheService.getCache(req));
      return of(this.cacheService.getCache(req));
    }

    this.pendingRequests.push(req);
    return this.next(req, next, this.cacheService);
  }

  next(req: HttpRequest<any>, next: HttpHandler, cache: CacheService): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          this.cacheService.setCache(req, event);
          console.log("%c >> " + event.statusText + " (" + event.status + ")",
            "background: green; color: white", event.url);
        }
      }),
      retryWhen(errors =>
        errors.pipe(
          delay(500),
          tap(error => {
            console.log("Error", error);
            throw error;
          })
        )
      ), finalize(() => {
        _.remove(this.pendingRequests, {url: req.url});
      })
    );
  }

  useCache(req: HttpRequest<any>) {
    let shouldUseCache = true;

    // @ts-ignore
    _.forEach(this.skipCache, (skip) => {
      if (req.urlWithParams.includes(skip)) {
        shouldUseCache = false;
      }
    })

    return shouldUseCache;
  }
}
