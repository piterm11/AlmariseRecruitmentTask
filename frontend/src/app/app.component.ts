import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';
import {ElementDto, ElementService} from './element.service';

const authConfig: AuthConfig = {
  issuer: 'http://localhost:8180/realms/recruitment-realm',
  redirectUri: window.location.origin,
  clientId: 'frontend-client',
  responseType: 'code',
  scope: 'openid profile email',
  requireHttps: false
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container" *ngIf="isLoggedIn; else loginTpl">
      <h1>Panel Zarządzania Elementami</h1>
      <button (click)="logout()">Wyloguj</button>

      <hr>

      <div class="card">
        <h3>Stwórz Element</h3>
        <input [(ngModel)]="newElement.businessKey" placeholder="Unikalny Klucz (np. E-101)">
        <input [(ngModel)]="newElement.content" placeholder="Treść">
        <button (click)="createElement()">Zapisz</button>

        <p *ngIf="errorMessage" class="error">{{ errorMessage }}</p>
        <p *ngIf="successMessage" class="success">{{ successMessage }}</p>
      </div>

      <hr>

      <div class="card">
        <h3>Pobierz Element</h3>
        <div class="load-box">
            <select [(ngModel)]="selectedKey">
                <option *ngFor="let id of keys" [value]="id">{{ id }}</option>
            </select>
            <button (click)="loadElement()">Wczytaj</button>
            <button (click)="refreshIds()">Odśwież listę ID</button>
        </div>

        <div *ngIf="loadedElement" class="result">
          <p><strong>Klucz:</strong> {{ loadedElement.businessKey }}</p>
          <p><strong>Treść:</strong> {{ loadedElement.content }}</p>
        </div>
      </div>
    </div>

    <ng-template #loginTpl>
      <button (click)="login()">Zaloguj przez Keycloak</button>
    </ng-template>
  `,
  styles: [`
    .container { max-width: 600px; margin: 2rem auto; font-family: sans-serif; }
    .card { border: 1px solid #ccc; padding: 1rem; margin-bottom: 1rem; border-radius: 8px; }
    .error { color: red; font-weight: bold; }
    .success { color: green; }
    input, select, button { margin: 5px; padding: 8px; }
  `]
})
export class AppComponent {
  newElement: ElementDto = { businessKey: '', content: '' };
  loadedElement: ElementDto | null = null;
  keys: string[] = [];
  selectedKey: string | null = null;

  errorMessage = '';
  successMessage = '';

  constructor(
      private oauthService: OAuthService,
      private elementService: ElementService,
      private cd: ChangeDetectorRef
  ) {
    this.configureAuth();
  }

  private configureAuth() {
    this.oauthService.configure(authConfig);
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (this.isLoggedIn) {
        this.refreshIds();
      }
    });
  }

  get isLoggedIn() { return this.oauthService.hasValidAccessToken(); }
  login() { this.oauthService.initLoginFlow(); }
  logout() { this.oauthService.logOut(); }

  createElement() {
    this.errorMessage = '';
    this.successMessage = '';

    this.elementService.create(this.newElement).subscribe({
      next: (res) => {
        this.successMessage = `Utworzono element o kluczu: ${res.businessKey}`;
        this.newElement = { businessKey: '', content: '' };
        this.refreshIds();
        this.cd.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.cd.detectChanges();
      }
    });
  }

  loadElement() {
    if (!this.selectedKey) return;
    this.elementService.getByKey(this.selectedKey).subscribe({
      next: (res) => {
        this.loadedElement = res;
        this.cd.detectChanges();
      },
      error: () => this.cd.detectChanges()
    });
  }

  refreshIds() {
    this.elementService.getAll().subscribe(keys => {
      this.keys = keys;
      this.cd.detectChanges();
    });
  }
}
