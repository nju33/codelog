const chalk = require('chalk');
const columnify = require('columnify');

module.exports = function codelog(section) {
  return function(name, raw, lang) {
    const nodeDebug = process.env.NODE_DEBUG ?
                      process.env.NODE_DEBUG.split(',') :
                      [];
    if (nodeDebug.indexOf(section) === -1) {
      return;
    }

    const code = ensureCode(raw);
    const formatted = format(code, lang);
    const column = columnify(formatted, {
      showHeaders: false,
      columnSplitter: chalk.gray(' | '),
      preserveNewLines: false,
      config: {key: {align: 'right'}},
    });

    const splitterIndex = column.split('\n')[0].indexOf('|') - 13;
    let space = '';
    for (let i = 0; i < splitterIndex; i++) {
      space += ' ';
    }

    console.log();
    console.log(space + chalk.white.underline(` ${section + ':' + name} `));
    console.log(column);
  }
}

function ensureCode(raw) {
  if (typeof raw === 'object') {
    return JSON.stringify(raw, null, 2);
  } else if (typeof raw === 'function' || typeof raw === 'number') {
    return raw.toString()
  }
  return raw;
}

function format(code, lang = 'js') {
  return code.trim().split('\n').reduce((result, line, idx) => {
    const addedSyntax = syntax(line, lang);
    // const key = chalk.bgYellow(' ') + chalk.hidden(' ') + chalk.gray(idx + 1);
    const key = chalk.gray(idx + 1);
    result[key] = addedSyntax.replace(/\s/g, match => {
      return chalk.hidden(match);
    });
    return result;
  }, {});
}

function syntax(code, lang) {
  switch (lang) {
    case 'js':
    case 'javascript': {
      return processJavascript(code);
      break;
    }
    default: {
      return (code) => code;
    }
  }
}

function processJavascript(code) {
  const words = [
    '.+?:',
    '[\'"].+?[\'"]',
    '[A-Z].+?\\b',
    '\\w+\s?\\(',
    '\\d+',
    // '[A-Z][a-z]+\b',
    'true',
    'false',
    'await',
    'async',
    'class',
    'new',
    'if',
    'else',
    'while',
    'for',
    'throw',
    'var',
    'let',
    'const',
    'import',
    'from',
    'function',
    'static',
    'in',
    'null',
    'undeefined',
    'return',
    'switch',
    'case',
    'default',
    'delete',
    'try',
    'catch',
    'finally',
    'this',
    'instanceof',
    'typeof',
    'break',
    'continue',
    '{',
    '}',
    '\\[',
    '\\]',
    '\\(',
    '\\)',
    // '\.\w+(?=\()',
    // '\b.+(?=:)'
  ].join('|');
  const result = code.replace(new RegExp(words, 'g'), match => {
    const BRACKET = '{}[]\\(\\)'.split('')
    const RESERVED = [
      'true',
      'false',
      'await',
      'async',
      'class',
      'new',
      'if',
      'else',
      'while',
      'for',
      'throw',
      'var',
      'let',
      'const',
      'import',
      'from',
      'function',
      'static',
      'in',
      'null',
      'undeefined',
      'return',
      'switch',
      'case',
      'default',
      'delete',
      'try',
      'catch',
      'finally',
      'this',
      'instanceof',
      'typeof',
      'break',
      'continue'
    ].join('|');

    if (BRACKET.indexOf(match) > -1) {
      return chalk.gray.bold(match);
    } else if (match.endsWith('(')) {
      // object key
      return chalk.green(match.slice(0, match.length - 1)) +
             chalk.gray.bold('(');
    } else if (match.endsWith(':')) {
      // object key
      return chalk.yellow(match.slice(0, match.length - 1)) + ':';
    } else if (/[A-Z].+\b/.test(match)) {
      // class
      return chalk.yellow(match);
    } else if (new RegExp(RESERVED).test(match)) {
      // reserved
      return chalk.magenta.bold(match);
    } else if (/^['"]/.test(match) || /\d+/.test(match)) {
      // string
      return chalk.bold.red(match);
    }

    return match;
  });
  return result;
}
