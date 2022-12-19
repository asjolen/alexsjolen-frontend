import {Component} from "@angular/core";
import {ApiService} from "./core/services/api/api.service";
import {Meta, Title} from "@angular/platform-browser";
import {LoaderService} from "./core/services/interface/loader.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  showFullScreenLoader: boolean = false;

  constructor(private apiService: ApiService, private title: Title, private meta: Meta,
              private loaderService: LoaderService) {
    this.fetchWebsiteDetails();

    this.loaderService.showFullscreenLoader.subscribe((val) => {
      this.showFullScreenLoader = val.length;
    })
  }

  fetchWebsiteDetails() {
    this.apiService.get("", [], {}, true).subscribe({
      next: (res) => {
        if (res) {
          if (res.name) { this.title.setTitle(res.name); }
          if (res.description) { this.meta.addTag({name: "description", content: res.description}); }
          if (res.keywords) { this.meta.addTag({name: "keywords", content: res.keywords}); }
        }
      }
    })
  }
}
