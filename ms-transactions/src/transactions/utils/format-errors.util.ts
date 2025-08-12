import { ValidationError } from '@nestjs/common';

export function formatErrors(errors: ValidationError[]): string {
  const messages = errors
    .map((err) => {
      if (err.constraints) {
        return Object.values(err.constraints).join(', ');
      }
      return '';
    })
    .filter((message) => message !== '')
    .join('; ');

  return messages;
}
