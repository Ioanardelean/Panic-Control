import { Validators } from '@angular/forms';
import { CustomValidators } from './custom.validators';

const emails: string[] = [];
export const monitor = {
  id: [''],
  name: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
  description: [''],
  url: [
    '',
    Validators.compose([
      Validators.required,
      Validators.pattern(
        '^https?://(www.)?[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$'
      ),
    ]),
  ],
  receiver: [emails, [Validators.required, CustomValidators.validateArrayNotEmpty]],
  ping: ['', [Validators.required]],
  monitorInterval: ['', [Validators.required]],
  emailTemplate: [''],
  testRunning: [''],
  status: null,
  user: [''],
  histories: [''],
};
