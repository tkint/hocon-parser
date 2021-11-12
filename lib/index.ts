export const TOKENS = {
  COLON: '__COLON__',
  COMMA: '__COMMA__',
  ARRAY_OPEN: '__ARRAY_OPEN__',
  ARRAY_CLOSE: '__ARRAY_CLOSE__',
  OBJECT_OPEN: '__OBJECT_OPEN__',
  OBJECT_CLOSE: '__OBJECT_CLOSE__',
};

const HOCON_COLON = [':', '='];
const HOCON_COMMA = [',', '\n'];

const hoconChars = [
  { token: TOKENS.ARRAY_OPEN, matches: ['['] },
  { token: TOKENS.ARRAY_CLOSE, matches: [']'] },
  { token: TOKENS.OBJECT_OPEN, matches: ['{'] },
  { token: TOKENS.OBJECT_CLOSE, matches: ['}'] },
  { token: TOKENS.COLON, matches: HOCON_COLON },
  { token: TOKENS.COMMA, matches: HOCON_COMMA },
];

function isValidArrayValueToken(value: any) {
  return !hoconChars.flatMap(c => c.token).includes(value)
    || value === TOKENS.ARRAY_OPEN
    || value === TOKENS.OBJECT_OPEN;
}

function isValidObjectKeyToken(key: any) {
  return typeof key === 'string' && !hoconChars.flatMap(c => c.token).includes(key);
}

export function parseHocon(hocon: string) {
  const sanitized = hocon.replace(/\r\n/g, '\n');

  const tokens = [TOKENS.OBJECT_OPEN, ...lexHocon(sanitized), TOKENS.OBJECT_CLOSE];
  const rawResult = parseTokens(tokens)[0];

  const substitutionRegex = /__SUBSTITUTION\((\??[a-zA-Z0-9.]*)\)__/;
  Object.keys(rawResult).forEach((key) => {
    const value = rawResult[key];
    if (typeof value === 'string') {
      const substitutionMatch = substitutionRegex.exec(value);
      if (substitutionMatch && substitutionMatch.length > 1) {
        const isOptional = substitutionMatch[1].startsWith('?');
        const path = substitutionMatch[1].substring(isOptional ? 1 : 0);
        const substitute = deepFind(rawResult, path);
        if (substitute !== undefined) {
          rawResult[key] = value.replace(substitutionRegex, substitute);
          if (rawResult[key] == substitute) {
            rawResult[key] = substitute;
          }
        } else {
          rawResult[key] = value.replace(substitutionRegex, `\${${substitutionMatch[1]}}`);
        }
      }
    }
  });

  return rawResult;
}

export function deepFind(obj: any, path: string): any {
  const pathArray = path.split('.');

  let current = obj;
  for (const pathItem of pathArray) {
    if (!current[pathItem]) return undefined;
    current = current[pathItem];
  }

  return current;
}

export function lexKeyword(hocon: string): [any | undefined, string] {
  const keywords = [
    null,
    true,
    false,
  ];

  for (const keyword of keywords) {
    const strKeyword = String(keyword);
    if (hocon.startsWith(strKeyword)
      && (hocon.length === strKeyword.length || HOCON_COMMA.includes(hocon[strKeyword.length]))) {
      return [keyword, hocon.substring(strKeyword.length)];
    }
  }

  return [undefined, hocon];
}

export function lexNumber(hocon: string): [number | undefined, string] {
  let token = '';
  let rest = hocon;

  for (const char of rest) {
    if (/[0-9-.]/.test(char)) {
      token = `${token}${char}`;
    } else if (HOCON_COMMA.includes(char)) {
      if (token === '') return [undefined, rest];
      break;
    } else {
      return [undefined, rest];
    }
  }

  return [Number(token), rest.substring(token.length)];
}

export function lexString(hocon: string): [string | undefined, string] {
  let token = '';
  let substitutionToken = '';
  let rest = hocon;

  let inComment = false;
  let inQuotes = false;
  let inSubstitution = false;
  const substitutionPart = '__SUBSTITUTION({})__';

  if (!/[a-zA-Z0-9"$#/]/.test(rest[0])) return [undefined, rest];

  while (rest.length > 0) {
    if (inComment) {
      if (rest[0] === '\n') inComment = false;
      rest = rest.substring(1);
    } else if (inQuotes) {
      if (rest[0] === '"') inQuotes = false;
      else token = `${token}${rest[0]}`;
      rest = rest.substring(1);
    } else if (inSubstitution) {
      if (!/[a-zA-Z0-9.}?]/.test(rest[0])) throw Error('Unexpected character in substitution');
      if (substitutionToken !== '' && rest[0] === '?') throw Error('Substitution path invalid: question mark only available as first character');
      if (substitutionToken.endsWith('.') && ['.', '}'].includes(rest[0])) throw Error('Substitution path invalid');
      if (rest[0] === '}') {
        inSubstitution = false;
        token = `${token}${substitutionPart.replace('{}', substitutionToken)}`;
        substitutionToken = '';
      } else substitutionToken = `${substitutionToken}${rest[0]}`;
      rest = rest.substring(1);
    } else if (hoconChars.flatMap((it) => it.matches).includes(rest[0])) {
      return [token, rest];
    } else if (rest[0] === '#' || rest.substring(0, 2) === '//') {
      inComment = true;
      if (rest[0] === '#') rest = rest.substring(1);
      else rest = rest.substring(2);
    } else if (rest.substring(0, 2) === '${') {
      inSubstitution = true;
      rest = rest.substring(2);
    } else {
      if (rest[0] === '"') inQuotes = true;
      else token = `${token}${rest[0]}`;
      rest = rest.substring(1);
    }
  }

  if (inQuotes) throw Error('Expected end-of-string quote');
  if (inSubstitution) throw Error('Expected end-of-substitution brace');

  return [token, rest];
}

export function lexHocon(hocon: string): any[] {
  const tokens = [];

  const lexers = [lexNumber, lexKeyword, lexString];

  let rest = hocon;
  let i = 0;
  let token: any;
  hoconLoop:
  while (rest.length > 0 && i++ < hocon.length) {
    token = undefined;
    for (const lexer of lexers) {
      ([token, rest] = lexer(rest));
      if (token !== undefined) {
        switch (typeof token) {
          case 'string':
            tokens.push(token.trim());
            break;
          default:
            tokens.push(token);
        }
        continue hoconLoop;
      }
    }

    for (const hoconChar of hoconChars) {
      if (hoconChar.matches.includes(rest[0])) {
        tokens.push(hoconChar.token);
        rest = rest.substring(1);
        continue hoconLoop;
      }
    }

    if (/\s/.test(rest[0])) rest = rest.substring(1);
  }

  return tokens;
}

export function parseTokensAsArray(tokens: any[]): any[] {
  const result: any = [];

  if (tokens[0] !== TOKENS.ARRAY_OPEN) throw Error(`Expected array opening token, got ${tokens[0]}`);

  let rest = tokens.slice(1);
  while (rest.length > 0) {
    while (rest[0] === TOKENS.COMMA) rest = rest.slice(1);

    if (rest[0] === TOKENS.ARRAY_CLOSE) return [result, rest.slice(1)];

    if (!isValidArrayValueToken(rest[0]))
      throw Error(`Invalid array value, got ${rest[0]}`);

    const [parsedValue, newRest] = parseTokens(rest);
    result.push(parsedValue);
    rest = newRest;
  }

  throw Error('Expected end of array');
}

export function parseTokensAsObject(tokens: any[]): [object, any[]] {
  const result: any = {};

  if (tokens[0] !== TOKENS.OBJECT_OPEN) throw Error(`Expected object opening token, got ${tokens[0]}`);

  let isLastValueArray = false;
  let isLastValueObject = false;
  let lastKey = undefined;

  let rest = tokens.slice(1);
  while (rest.length > 0) {
    while (rest[0] === TOKENS.COMMA) rest = rest.slice(1);

    let parsedValue, newRest;
    const key = rest[0];
    switch (key) {
      case TOKENS.OBJECT_CLOSE:
        return [result, rest.slice(1)];
      case TOKENS.ARRAY_OPEN:
        if (isLastValueObject) throw Error('Cannot concatenate array with object');
        if (!isLastValueArray) throw Error('Cannot concatenate array with string or number');
        ([parsedValue, newRest] = parseTokensAsArray(rest));
        result[lastKey] = Array.from(result[lastKey]).concat(parsedValue);
        rest = newRest;
        break;
      case TOKENS.OBJECT_OPEN:
        if (isLastValueArray) throw Error('Cannot concatenate object with array');
        if (!isLastValueObject) throw Error('Cannot concatenate object with string or number');
        ([parsedValue, newRest] = parseTokensAsObject(rest));
        result[lastKey] = Object.assign(result[lastKey], parsedValue);
        rest = newRest;
        break;
      default:
        if (!isValidObjectKeyToken(key)) throw Error(`Expected string as key, got ${key}`);
        rest = rest.slice(1);

        if (rest[0] !== TOKENS.COLON) throw Error(`Expected colon, got ${rest[0]}`);
        rest = rest.slice(1);

        isLastValueArray = rest[0] === TOKENS.ARRAY_OPEN;
        isLastValueObject = rest[0] === TOKENS.OBJECT_OPEN;

        ([parsedValue, newRest] = parseTokens(rest));
        result[key] = parsedValue;
        lastKey = key;
        rest = newRest;
        break;
    }
  }

  throw Error('Expected end of object');
}

export function parseTokens(tokens: any[]) {
  let result: any;
  let rest = tokens;
  if (rest[0] === TOKENS.ARRAY_OPEN) {
    const [arr, newRest] = parseTokensAsArray(rest);
    result = arr;
    rest = newRest;
  } else if (rest[0] === TOKENS.OBJECT_OPEN) {
    const [obj, newRest] = parseTokensAsObject(rest);
    result = obj;
    rest = newRest;
  } else {
    result = rest[0];
    rest = rest.slice(1);
  }
  return [result, rest];
}
