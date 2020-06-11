import {

  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
export class ValidPassword implements ValidatorConstraintInterface {
  validate(text: string, ): boolean {
    const passwordReqEx: RegExp = new RegExp(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/);
    return passwordReqEx.test(text);
  }

  defaultMessage(): string {
    return 'Password must contain at least one number, one uppercase letter, and one lowercase letter';
  }
}
