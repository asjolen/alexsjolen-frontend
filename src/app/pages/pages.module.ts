import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {PagesRoutingModule} from "./pages-routing.module";
import { HomeComponent } from './home/home.component';
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzTypographyModule} from "ng-zorro-antd/typography";
import {IconModule} from "../components/icons/icon/icon.module";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {NzModalModule} from "ng-zorro-antd/modal";

@NgModule({
  declarations: [
    HomeComponent,
  ],
  entryComponents: [],
  imports: [
    CommonModule,
    TranslateModule,
    PagesRoutingModule,
    NzGridModule,
    NzTypographyModule,
    IconModule,
    NzButtonModule,
    NzIconModule,
    NzDividerModule,
    NzModalModule
  ],
  exports: []
})
export class PagesModule { }
