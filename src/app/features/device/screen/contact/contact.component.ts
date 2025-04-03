import { AfterViewInit, Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ButtonHandlerService } from '../../../../services/button-handler.service';

@Component({
  selector: 'app-contact',
  imports: [FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements AfterViewInit {
  constructor(private buttonHandlerService: ButtonHandlerService) {
    this.detectMobileDevice();
  }
  fadeIn = true;
  http = inject(HttpClient);
  submitSuccess = false;
  isMobile = false;

  contactData = {
    name: '',
    email: '',
    message: '',
    privacyPolicy: false,
  };

  mailTest = false;
  post = {
    endPoint: 'sendMail.php',
    body: (payload: any) => JSON.stringify(payload),
    options: {
      headers: {
        'Content-Type': 'text/plain',
        responseType: 'text',
      },
    },
  };

  clickPrivacy(state: boolean) {
    this.buttonHandlerService.toggleImprint(state);
  }

  onSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid && !this.mailTest) {
      this.http
        .post(this.post.endPoint, this.post.body(this.contactData))
        .subscribe({
          next: (response) => {
            ngForm.resetForm();
          },
          error: (error) => {
            console.error(error);
          },
          complete: () => {
            this.handleSubmitSuccess();
          },
        });
    } else if (ngForm.submitted && ngForm.form.valid && this.mailTest) {
      ngForm.resetForm();
    }
  }

  handleSubmitSuccess() {
    this.submitSuccess = true;
  }

  detectMobileDevice(): void {
    this.isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
  }

  ngAfterViewInit() {
    this.submitSuccess = false;
    this.fadeIn = true;
    setTimeout(() => {
      this.fadeIn = false;
    }, 500);
  }
}
