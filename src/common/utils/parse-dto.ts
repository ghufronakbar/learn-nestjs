import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export async function parseDto<T extends object>(
  cls: new () => T,
  obj: unknown,
): Promise<T> {
  const instance = plainToInstance(cls, obj);
  const errors = await validate(instance);

  if (errors.length > 0) {
    throw new Error(JSON.stringify(errors));
  }

  return instance;
}
