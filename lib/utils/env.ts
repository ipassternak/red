type Cast = 'string' | 'number' | 'boolean' | 'int' | 'set';

const CASTERS = {
  string: (value: string) => value,
  number: (value: string, key: string) => {
    const number = parseFloat(value);
    if (isNaN(number))
      throw new TypeError(`env ${key}=${value} cannot be cast to a number`);
    return number;
  },
  boolean: (value: string) => value === 'true',
  int: (value: string, key: string) => {
    const int = parseInt(value);
    if (isNaN(int))
      throw new TypeError(`env ${key}=${value} cannot be cast to an integer`);
    return int;
  },
  set: (value: string) => value.split(','),
};

type Caster<Type extends Cast> = (typeof CASTERS)[Type];
type Casted<Type extends Cast> = ReturnType<Caster<Type>>;

export const env = <Type extends Cast>(
  key: string,
  cast: Type = <Type>'string',
  defaultValue?: Casted<Type>,
): Casted<Type> => {
  const value = process.env[key];
  if (!value) {
    if (defaultValue !== undefined) return defaultValue;
    throw new TypeError(`env ${key} is required`);
  }
  const caster = CASTERS[cast];
  return <Casted<Type>>caster(value, key);
};
