export const TOKENS = {
  COLON: '__COLON__',
  SEPARATOR: '__SEPARATOR__',
  ARRAY_OPEN: '__ARRAY_OPEN__',
  ARRAY_CLOSE: '__ARRAY_CLOSE__',
  OBJECT_OPEN: '__OBJECT_OPEN__',
  OBJECT_CLOSE: '__OBJECT_CLOSE__',
};

const HOCON_COLON = [':', '='];
const HOCON_FIELD_SEPARATOR = [',', '\n'];

const hoconChars = [
  { token: TOKENS.ARRAY_OPEN, matches: ['['] },
  { token: TOKENS.ARRAY_CLOSE, matches: [']'] },
  { token: TOKENS.OBJECT_OPEN, matches: ['{'] },
  { token: TOKENS.OBJECT_CLOSE, matches: ['}'] },
  { token: TOKENS.COLON, matches: HOCON_COLON },
  { token: TOKENS.SEPARATOR, matches: HOCON_FIELD_SEPARATOR },
];


export function parseHocon(hocon: string) {
  return parseTokens(lexHocon(hocon))[0];
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
      && (hocon.length === strKeyword.length || HOCON_FIELD_SEPARATOR.includes(hocon[strKeyword.length]))) {
      return [keyword, hocon.substring(strKeyword.length)];
    }
  }

  return [undefined, hocon];
}

export function lexNumber(hocon: string): [number | undefined, string] {
  let token = '';
  let _hocon = hocon;

  for (const char of _hocon) {
    if (/[0-9-.]/.test(char)) {
      token = `${token}${char}`;
    } else if (HOCON_FIELD_SEPARATOR.includes(char)) {
      if (token === '') return [undefined, _hocon];
      break;
    } else {
      return [undefined, _hocon];
    }
  }

  return [Number(token), _hocon.substring(token.length)];
}

export function lexString(hocon: string): [string | undefined, string] {
  let token = '';
  let _hocon = hocon;

  let inQuotes = false;

  if (!/[a-zA-Z0-9"]/.test(_hocon[0])) return [undefined, _hocon];

  for (const char of _hocon) {
    if (char === '"') {
      inQuotes = !inQuotes;
      _hocon = _hocon.substring(1);
    } else {
      if (!inQuotes && (hoconChars.flatMap((it) => it.matches).includes(char))) {
        return [token, _hocon.substring(token.length)];
      } else {
        token = `${token}${char}`;
      }
    }
  }

  if (inQuotes) throw Error('Expected end-of-string quote');
  return [token, _hocon.substring(token.length)];
}

export function lexHocon(hocon: string): any[] {
  const tokens = [];

  const lexers = [lexNumber, lexKeyword, lexString];

  let _hocon = hocon;
  let i = 0;
  let token: any;
  hoconLoop:
    while (_hocon.length > 0 && i++ < hocon.length) {
      token = undefined;
      for (const lexer of lexers) {
        ([token, _hocon] = lexer(_hocon));
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
        if (hoconChar.matches.includes(_hocon[0])) {
          tokens.push(hoconChar.token);
          _hocon = _hocon.substring(1);
          continue hoconLoop;
        }
      }

      if (/\s/.test(_hocon[0])) {
        _hocon = _hocon.substring(1);
        continue;
      }

      throw Error(`Unexpected character: ${_hocon[0]}`);
    }

  return [TOKENS.OBJECT_OPEN, ...tokens, TOKENS.OBJECT_CLOSE];
}

export function parseTokensAsArray(tokens: any[]): any[] {
  const result = [];
  let _tokens = tokens;

  if (_tokens[0] === TOKENS.ARRAY_CLOSE) return [result, _tokens.slice(1)];

  while (_tokens[0] === TOKENS.SEPARATOR) _tokens = _tokens.slice(1);

  while (_tokens.length > 0) {
    const parseResult = parseTokens(_tokens);
    const parsedTokens = parseResult[0];
    _tokens = parseResult[1];
    result.push(parsedTokens);

    if (_tokens[0] === TOKENS.ARRAY_CLOSE) return [result, _tokens.slice(1)];
    if (_tokens[0] !== TOKENS.SEPARATOR) throw Error('Expected comma in array');

    _tokens = _tokens.slice(1);

    while (_tokens[0] === TOKENS.SEPARATOR) _tokens = _tokens.slice(1);
  }

  throw Error('Expected end of array');
}

export function parseTokensAsObject(tokens: any[]): object {
  const result: any = {};

  let _tokens = tokens;

  if (_tokens[0] === TOKENS.OBJECT_CLOSE) return [result, _tokens.slice(1)];

  while (_tokens[0] === TOKENS.SEPARATOR) _tokens = _tokens.slice(1);

  while (_tokens.length > 0) {
    const [key, colon, ...value] = _tokens;
    if (key === TOKENS.COLON) throw Error(`Invalid key: ${key}`);
    if (key === TOKENS.OBJECT_CLOSE) return [result, _tokens.slice(1)];

    if (colon !== TOKENS.COLON) throw Error(`Expected colon after key \`${key}\`: ${colon}`);

    const parseResult = parseTokens(value);
    const parsedTokens = parseResult[0];
    _tokens = parseResult[1];
    result[key] = parsedTokens;

    if (_tokens[0] === TOKENS.OBJECT_CLOSE) return [result, _tokens.slice(1)];
    if (_tokens[0] !== TOKENS.SEPARATOR) throw Error(`Expected comma in object, got ${_tokens[0]}`);

    _tokens = _tokens.slice(1);

    // jump to the next key
    while (_tokens[0] === TOKENS.SEPARATOR) _tokens = _tokens.slice(1);
  }

  throw Error('Expected end of object');
}

export function parseTokens(tokens: any[]): any[] | object {
  switch (tokens[0]) {
    case TOKENS.ARRAY_OPEN:
      return parseTokensAsArray(tokens.slice(1));
    case TOKENS.OBJECT_OPEN:
      return parseTokensAsObject(tokens.slice(1));
    default:
      return [tokens[0], tokens.slice(1)];
  }
}
