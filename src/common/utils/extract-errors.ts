import { ValidationError } from '@nestjs/common';

export function extractClassValidatorErrorMessages(
  errors: ValidationError[],
): string[] {
  const messages: string[] = [];

  errors.forEach((error) => {
    if (error.children.length) {
      messages.push(...extractClassValidatorErrorMessages(error.children));
    } else {
      messages.push(error.constraints[Object.keys(error.constraints)[0]]);
    }
  });

  return messages;
}
