import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";

import {ApplicationComponent} from './application.component';
import {HomeComponent} from "../home/home.component";
import {NavbarComponent} from "../navbar/navbar.component";
import {AboutComponent} from "../about/about.component";
import {SocialComponent} from "../social/social.component";
import {FooterComponent} from "../footer/footer.component";
import {TypewriterComponent} from "../home/typewriter.component";
import {AccordionComponent} from "../about/accordion.component";
import {AccordionItemComponent} from "../about/accordion-item.component";
import {AccordionTriggerComponent} from "../about/accordion-trigger.component";
import {AccordionContentComponent} from "../about/accordion-content.component";
import {PolaroidTickerComponent} from "../about/polaroid-ticker.component";
import {RouterModule, Routes} from "@angular/router";

const routes: Routes = [{ path: '', component: ApplicationComponent }];

@NgModule({
	declarations: [
		ApplicationComponent,
		HomeComponent,
		NavbarComponent,
		AboutComponent,
		SocialComponent,
		FooterComponent,
		TypewriterComponent,
		AccordionComponent,
		AccordionItemComponent,
		AccordionTriggerComponent,
		AccordionContentComponent,
		PolaroidTickerComponent
	],
	imports: [
		RouterModule.forChild(routes),
		CommonModule,
		NgbTooltipModule
	]
})
export class ApplicationModule { }
