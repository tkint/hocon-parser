const COLON_TOKEN = '__COLON__';
const SEPARATOR_TOKEN = '__SEPARATOR__';

const HOCON_COLON = [':', '='];
const HOCON_FIELD_SEPARATOR = [',', '\n'];

function parseHocon(hocon) {
  return parseTokens(lexHocon(hocon));
}

function lexNumber(hocon) {
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

function lexString(hocon) {
  let token = '';
  let _hocon = hocon;

  let inQuotes = false;

  if (!/[a-zA-Z0-9"]/.test(_hocon[0])) return [undefined, _hocon];

  for (const char of _hocon) {
    if (char === '"') {
      inQuotes = !inQuotes;
      _hocon = _hocon.substring(1);
    } else {
      if (!inQuotes && (HOCON_COLON.includes(char) || HOCON_FIELD_SEPARATOR.includes(char))) {
        return [token, _hocon.substring(token.length)];
      } else {
        token = `${token}${char}`;
      }
    }
  }

  if (inQuotes) throw Error('Expected end-of-string quote');
  return [token, _hocon.substring(token.length)];
}

function lexHocon(hocon) {
  const tokens = [];

  let i = 0;

  let _hocon = hocon;
  while (_hocon.length > 0 && i++ < hocon.length) {
    const numResult = lexNumber(_hocon);
    const numToken = numResult[0];
    _hocon = numResult[1];
    if (numToken !== undefined) {
      tokens.push(numToken);
      continue;
    }

    const strResult = lexString(_hocon);
    const strToken = strResult[0];
    _hocon = strResult[1];
    if (strToken !== undefined) {
      tokens.push(strToken.trim());
      continue;
    }

    if (HOCON_FIELD_SEPARATOR.includes(_hocon[0])) {
      tokens.push(SEPARATOR_TOKEN);
      _hocon = _hocon.substring(1);
    } else if (/\s/.test(_hocon[0])) {
      _hocon = _hocon.substring(1);
    } else if (HOCON_COLON.includes(_hocon[0])) {
      tokens.push(COLON_TOKEN);
      _hocon = _hocon.substring(1);
    } else {
      throw Error(`Unexpected character: ${_hocon[0]}`);
    }
  }

  return tokens;
}

function parseTokens(tokens) {
  const result = {};

  let _tokens = tokens;

  // jump to the next key
  while (_tokens[0] === SEPARATOR_TOKEN) {
    _tokens = _tokens.slice(1);
  }

  while (_tokens.length > 0) {
    const [key, colon, value] = _tokens;

    if (key === COLON_TOKEN)
      throw Error(`Invalid key: ${key}`);

    if (colon !== COLON_TOKEN)
      throw Error(`Expected colon after key \`${key}\`: ${colon}`);

    if (value === COLON_TOKEN)
      throw Error(`Invalid value for key \`${key}\`: ${value}`);

    if (value === undefined)
      throw Error(`Expected value after colon for key \`${key}\`: ${value}`);

    result[key] = value;
    _tokens = _tokens.slice(3);

    // jump to the next key
    while (_tokens[0] === SEPARATOR_TOKEN) {
      _tokens = _tokens.slice(1);
    }
  }

  return result;
}

module.exports = {
  parseHocon,
  parseTokens,
  lexNumber,
  lexString,
  lexHocon,
  COLON_TOKEN,
  SEPARATOR_TOKEN,
};
