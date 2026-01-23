import {Component, OnInit} from '@angular/core';
import {SwUpdate} from "@angular/service-worker";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    standalone: false
})

export class AppComponent implements OnInit {
	title = 'CJ Mayes - Data Director & Tableau Visionary';

	constructor(private swUpdate: SwUpdate) {}

	ngOnInit(): void {
		if (this.swUpdate.isEnabled) {
			this.swUpdate.versionUpdates.subscribe((event) => {
				if (event.type === "VERSION_READY") {
					if (confirm("New update available. Load New Version?")) {
						this.swUpdate.activateUpdate().then(() => {
							window.location.reload();
						});
					}
				}
			});
		}
		this.addCanonicalLink();
		this.logConsoleMessage();
	}

	private addCanonicalLink(): void {
		const link: HTMLLinkElement = document.createElement('link');
		link.setAttribute('rel', 'canonical');
		link.setAttribute('href', document.URL);
		document.head.appendChild(link);
	}

	private logConsoleMessage(): void {
		console.log(`%c${this.title}`, "color:#F56540; font-size:27px");
		console.log("%chttps://github.com/CJ-Mayes/CJ-CV", "font-size:17px");
	}
}
