import { Validators, FormControl } from '@angular/forms';
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

export function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
