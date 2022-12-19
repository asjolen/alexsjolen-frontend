import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {IconComponent} from "./icon.component";
import {HeroIconModule, allIcons} from "ng-heroicon";

@NgModule({
  declarations: [
    IconComponent
  ],
  entryComponents: [],
  imports: [
    CommonModule,
    HeroIconModule.withIcons({
      ...allIcons
    }, {
      defaultHostDisplay: 'inlineBlock', // default 'none'
      attachDefaultDimensionsIfNoneFound: true // default 'false'
    })
  ],
  exports: [
    IconComponent
  ]
})
export class IconModule { }
