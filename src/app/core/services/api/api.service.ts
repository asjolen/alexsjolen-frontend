import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { throwError } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ApiService {
  restPath: string = "wp-json/wp/v2/";

  constructor(private http: HttpClient) {}

  buildUrl(path: string, arrayPath: any, skipV2 = false) {
    let url = environment.apiUrl + this.restPath;
    if (skipV2) { url = url.replace("/wp/v2/", ""); }

    url = url + path;

    for (const single of arrayPath) {
      url = url + "/" + single;
    }

    return url;
  }

  get(path: string, arrayPath: any = [], params = {}, skipV2 = false ) {
    return this.http.get(this.buildUrl(path, arrayPath, skipV2), {params}).pipe(map(
      (response: any) => {
        return response;
      }), catchError((err => {
      return throwError(err);
    })));
  }
}
