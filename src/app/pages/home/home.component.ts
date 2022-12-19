import {Component, OnInit} from "@angular/core";
import {ApiService} from "../../core/services/api/api.service";
import {LoaderService} from "../../core/services/interface/loader.service";
import {Router} from "@angular/router";
import * as _ from "lodash";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  pageContent: any;
  fetchingPage = false;
  categories: any = [];
  workPosts: any = [];
  educationPosts: any = [];
  workModalVisible = false;
  workModalContent: any = null;

  constructor(private apiService: ApiService, private loaderService: LoaderService,
              private router: Router) {}

  ngOnInit(): void {
    this.findFrontPage();
    this.fetchCategories();
  }

  findFrontPage() {
    this.fetchingPage = true;
    this.loaderService.emitLoader();

    this.apiService.get("pages", []).subscribe({
      next: (data) => {
        this.fetchingPage = false;
        this.pageContent = _.find(data, {slug: "home"});
        this.loaderService.deEmitLoader();
      }
    });
  }

  fetchPosts() {
    this.apiService.get("posts", []).subscribe({
      next: (data) => {
        _.forEach(data, (post) => {
          if (this.findCategory("work") && post.categories.includes(this.findCategory("work").id)) {
            this.workPosts.push(post);
          }
        });

        this.workPosts = _.sortBy(this.workPosts, (o) => {
          return Number(o.acf.start_year);
        }).reverse();
      }
    })
  }

  findCategory(category: string) {
    return _.find(this.categories, {slug: category});
  }

  fetchCategories() {
    this.apiService.get("categories", []).subscribe({
      next: (data) => {
        this.categories = data;
        this.fetchPosts();
      }
    })
  }

  showWorkModal(content: any) {
    this.workModalVisible = true;
    this.workModalContent = content;
  }

  fixTextBR(text: string) {
    return text.replace(/\r\n/g, '<br>');
  }

  openLink(link: string) {
    window.open(link, '_blank');
  }
}
