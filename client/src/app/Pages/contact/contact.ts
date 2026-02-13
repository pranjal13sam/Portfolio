import { Component, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { ViewportScroller } from '@angular/common';

import { environment } from '../../../environments/environment';

const CONTACT_API = environment.contactApiUrl;

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    FormsModule, // ⭐ ADD THIS
    HttpClientModule,
  ],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact implements OnDestroy {
  submitted = false;
  sending = false;
  error: string | null = null;
  notification: { type: 'success' | 'error'; message: string } | null = null;
  private notificationTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private scroller: ViewportScroller,
  ) {}

  showNotification(type: 'success' | 'error', message: string): void {
    this.ngZone.run(() => {
      if (this.notificationTimeout) clearTimeout(this.notificationTimeout);
      this.notification = { type, message };
      this.cdr.detectChanges();
      this.notificationTimeout = setTimeout(() => {
        this.notification = null;
        this.notificationTimeout = null;
        this.cdr.detectChanges();
      }, 5000);
    });
  }

  ngOnDestroy(): void {
    if (this.notificationTimeout) clearTimeout(this.notificationTimeout);
  }

  onSubmit(form: HTMLFormElement): void {
    if (!form || this.sending) return;
    const name = (form.elements.namedItem('name') as HTMLInputElement)?.value?.trim();
    const email = (form.elements.namedItem('email') as HTMLInputElement)?.value?.trim();
    const service = (form.elements.namedItem('service') as HTMLSelectElement)?.value;
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement)?.value?.trim();
    if (!name || !email || !message) return;

    this.error = null;
    this.sending = true;
    const serviceLabel =
      (form.elements.namedItem('service') as HTMLSelectElement)?.selectedOptions?.[0]?.text ??
      service ??
      '';

    const body = { name, email, service: serviceLabel, message };

    this.http.post(CONTACT_API, body, { responseType: 'text' }).subscribe({
      next: () => {
        this.ngZone.run(() => {
          this.submitted = true;
          this.sending = false;
          form.reset();
          this.showNotification('success', 'Email sent successfully');

          setTimeout(() => {
            this.scroller.scrollToAnchor('home');
          }, 300);

          this.cdr.markForCheck();
        });
      },
      error: () => {
        this.ngZone.run(() => {
          this.error =
            'Something went wrong. Please try again or email pandeypranjal264@gmail.com directly.';
          this.sending = false;
          this.showNotification('error', 'Failed to send. Try again or email directly.');
        });
      },
    });
  }
}
