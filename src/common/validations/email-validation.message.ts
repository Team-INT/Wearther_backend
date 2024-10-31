import { ValidationArguments } from 'class-validator';

export const emailValidationMessage = (args: ValidationArguments) => {
  return `${args.property}에는 정확한 이메일이 입력되어야 합니다.`;
};
