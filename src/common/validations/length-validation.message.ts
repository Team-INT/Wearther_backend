import { ValidationArguments } from 'class-validator';

export const lengthValidationMessage = (args: ValidationArguments) => {
  return `${args.constraints[0]}~${args.constraints[1]} 사이의 값을 입력해 주세요.`;
};
