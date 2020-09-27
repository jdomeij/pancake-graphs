
  function truncateString(str: string, num: number): string {
    return str;//str.length <= num ? str : `${str.slice(0, num)}...`;
  }

  function assertNotUndefined(name: string, value: any, expected: string) : asserts value {
    if (typeof value === 'undefined')
      throw new Error(`${name}: Value type 'undefined' is not an '${expected}'`);
  }

  export function assertIsString(name: string, value: string): asserts value {
    assertNotUndefined(name, value, 'string');
    if (typeof value !== 'string') {
      throw new Error(`${name}: Value type '${typeof value}' is not an string ('${truncateString(JSON.stringify(value), 25)}')`);
    }
  }

  export function assertIsArray(name: string, value: any[]): asserts value {
    assertNotUndefined(name, value, 'array');
    if (!Array.isArray(value)) {
      throw new Error(`${name}: Value type '${typeof value}' is not an array ('${truncateString(JSON.stringify(value), 25)}')`);
    }
  }

  export function assertIsArrayArray(name: string, value: any[]): asserts value {
    assertNotUndefined(name, value, 'array of arrays');
    if (value.length && !Array.isArray(value[0]))
      throw new Error(`${name}: Value type '${typeof value}' is not an array of arrays ('${truncateString(JSON.stringify(value), 25)}')`);
  }

  export function assertIsNumber(name: string, value: number): asserts value {
    assertNotUndefined(name, value, 'number');
    if (typeof value !== 'number') {
      throw new Error(`${name}: Value type '${typeof value}' is not an number ('${truncateString(JSON.stringify(value), 25)}')`);
    }
  }