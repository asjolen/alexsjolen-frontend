import { Injectable } from "@angular/core";
import { HttpRequest, HttpResponse } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import * as moment from "moment";
import * as _ from "lodash";


@Injectable({
  providedIn: "root"
})
export class CacheService {
  cacheContent: any = {};
  cacheTTL = 30; // In minutes
  momentFormat = "YYYY-MM-DD HH:mm:ss";

  constructor() {}

  setCache(req: HttpRequest<any>, response: HttpResponse<any>): void {
    const endpoint = req.urlWithParams;
    const entry = {endpoint, response};

    this.cacheContent[endpoint] = _.assign(entry, {
      ttl: this.cacheTTL, cachedAt: moment().format(this.momentFormat),
      expiresAt: moment().add(this.cacheTTL, "minutes").format(this.momentFormat)
    });
  }

  deleteCacheByUrl(url: string) {
    const builtUrl = environment.apiUrl + "/" + url;

    if (this.cacheContent.hasOwnProperty(builtUrl)) {
      console.log("Deleting cache for ", builtUrl);
      delete this.cacheContent[builtUrl];
    }
  }

  // @ts-ignore
  getCache(req: any): HttpResponse<any> | undefined | null {
    if (!this.checkCache(req) || this.cacheExpired(req)) {
      return null;
    }

    return this.cacheContent[req.urlWithParams].response;
  }

  getCacheByUrl(url: string) {
    return this.cacheContent[url];
  }

  /**
   * Delete cache.
   *
   * @param req: HttpRequest
   */
  deleteCache(req: HttpRequest<any>) {
    if (this.checkCache(req)) {
      delete this.cacheContent[req.urlWithParams];
      return true;
    }

    return false;
  }

  /**
   * Delete cache.
   *
   * @param match: string
   */
  deleteModelCache(match: string) {
    const keys = _.keys(this.cacheContent);
    for (const key of keys) {
      if (key.includes(match)) {
        delete this.cacheContent[key];
      }
    }

    return false;
  }

  /**
   * Check if cache exists.
   *
   * @param req: HttpRequest
   */
  checkCache(req: HttpRequest<any>) {
    return !!this.cacheContent[req.urlWithParams];
  }

  /**
   * Check if cached data has expired.
   *
   * @param req: HttpRequest
   */
  cacheExpired(req: HttpRequest<any>) {
    const expiresAt = this.cacheContent[req.urlWithParams] ? this.cacheContent[req.urlWithParams].expiresAt : null;

    if (expiresAt && moment().isAfter(expiresAt)) {
      console.log("Cache for endpoint has expired", req.urlWithParams);

      this.deleteCache(req);
      return true;
    }

    return false;
  }
}
