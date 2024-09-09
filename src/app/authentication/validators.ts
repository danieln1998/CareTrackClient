import { AbstractControl, ValidatorFn } from '@angular/forms';

export function passwordValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const password = control.value;
      const errors: {[key: string]: boolean} = {};
      if (!/\d/.test(password)) errors['requireDigit'] = true;
      if (!/[a-z]/.test(password)) errors['requireLowercase'] = true;
      if (!/[A-Z]/.test(password)) errors['requireUppercase'] = true;
      if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) errors['requireNonAlphanumeric'] = true;
      if (password.length < 6) errors['requiredLength'] = true;
      if (new Set(password).size < 1) errors['requiredUniqueChars'] = true;

      return Object.keys(errors).length ? errors : null;
    };
  }


