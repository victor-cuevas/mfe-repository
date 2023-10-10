import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Route } from "@angular/router";
import { LandingPageComponent } from "./landing-page/landing-page.component";
import { LandingRoutingModule } from "./landing-routing.module";
import { ProgressSpinnerModule } from 'primeng/progressspinner';

export const sharedLandingRoutes: Route[] = [];

@NgModule({
  declarations: [LandingPageComponent],
  exports: [
    LandingPageComponent
  ],
  imports: [CommonModule, LandingRoutingModule, ProgressSpinnerModule]
})
export class SharedLandingModule {}
