import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    provideHttpClient()
  ]
})
.catch(err => console.error(err));
// This file is the entry point for the Angular application.
// It bootstraps the main application component and configures the application with necessary providers.