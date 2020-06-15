import {

  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
export class ValidUrl implements ValidatorConstraintInterface {
  validate(text: string, ): boolean {
    const passwordReqEx: RegExp = new RegExp(/^https?:\/\/\w+(\.\w+)*(:[0-9]+)?(\/.*)?$/);
    return passwordReqEx.test(text);
  }

  defaultMessage(): string {
    return 'Url must be http(s)';
  }
}
