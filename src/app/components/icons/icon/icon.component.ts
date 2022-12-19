import {Component, OnInit, Input} from "@angular/core";
import {HeroIconName} from "ng-heroicon";

@Component({
  selector: "app-icon",
  templateUrl: "./icon.component.html",
  styleUrls: ["./icon.component.scss"]
})
export class IconComponent implements OnInit {
  @Input() icon: HeroIconName | any;
  @Input() size: number = 20;
  @Input() clickable: boolean = false;
  @Input() color: any;
  @Input() solid = false;

  constructor() { }

  ngOnInit(): void {}

  renderSizing(): any {
    return String('0 ' + '0 ' + (24) + ' ' + (24));
  }
}
