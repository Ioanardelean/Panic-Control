import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
export class ValidEmail implements ValidatorConstraintInterface {
  validate(emailList: string, args: ValidationArguments): boolean {
    const emails = emailList.replace(/\s/g, '').split(',');
    let valid = true;
    const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    for (let i = 0; i < emails.length; i++) {
      if (emails[i] === '' || !regex.test(emails[i])) {
        valid = false;
      }
    }
    return valid;
  }

  defaultMessage(args: ValidationArguments): string {
    return 'Email must be valid';
  }
}
