
  function truncateString(str: string, num: number): string {
    return str;//str.length <= num ? str : `${str.slice(0, num)}...`;
  }

  function assertNotUndefined(value: any, expected: string) : asserts value {
    if (typeof value === 'undefined')
      throw new Error(`Value type 'undefined' is not an '${expected}'`);
  }

  export function assertIsString(value: string): asserts value {
    assertNotUndefined(value, 'string');
    if (typeof value !== 'string') {
      throw new Error(`Value type '${typeof value}' is not an string ('${truncateString(JSON.stringify(value), 25)}')`);
    }
  }

  export function assertIsArray(value: any[]): asserts value {
    assertNotUndefined(value, 'array');
    if (!Array.isArray(value)) {
      throw new Error(`Value type '${typeof value}' is not an array ('${truncateString(JSON.stringify(value), 25)}')`);
    }
  }

  export function assertIsArrayArray(value: any[]): asserts value {
    assertNotUndefined(value, 'array of arrays');
    if (value.length && !Array.isArray(value[0]))
      throw new Error(`Value type '${typeof value}' is not an array of arrays ('${truncateString(JSON.stringify(value), 25)}')`);
  }

  export function assertIsNumber(value: number): asserts value {
    assertNotUndefined(value, 'number');
    if (typeof value !== 'number') {
      throw new Error(`Value type '${typeof value}' is not an number ('${truncateString(JSON.stringify(value), 25)}')`);
    }
  }