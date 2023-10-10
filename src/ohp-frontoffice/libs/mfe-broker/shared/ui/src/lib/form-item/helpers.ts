export const pushClass = (classList: string[], className: string | string[]): void => {
  if (typeof className === 'string') classList.push(className);
  else classList.push(...className);
};

export const Required = (target: object, propertyKey: string) => {
  Object.defineProperty(target, propertyKey, {
    get() {
      throw new Error(`Attribute ${propertyKey} is required`);
    },
    set(value) {
      Object.defineProperty(target, propertyKey, {
        value,
        writable: true,
        configurable: true,
      });
    },
    configurable: true,
  });
};
