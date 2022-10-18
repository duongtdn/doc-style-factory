"use strict"

import StyleFactory from '@duongtdn/style-factory';

import COLOR from './color';

export default class DocStyleFactory {

  factory = new StyleFactory();

  constructor() {
    this.factory
    .useStyle(/\[b\](?:\[\w+\])?[^,\[]*(?:\[\/\w+\])?\[\/b\]/, { fontWeight: 'bold' })
    .useStyle(/\[i\](?:\[\w+\])?[^,\[]*(?:\[\/\w+\])?\[\/i\]/, { fontStyle: 'italic' })
    .useStyle(/\[u\](?:\[\w+\])?[^,\[]*(?:\[\/\w+\])?\[\/u\]/, { textDecoration: 'underline' })
    .useCleaner(/\[\/?\w+\]/);

    const colors = ['blue', 'red', 'green'];
    colors.forEach(color => {
      this.factory
      .useStyle(`\\[${color}\\](?:\\[\\w+\\])?[^,\\[]*(?:\\[\\/\\w+\\])?\\[\\/${color}\\]`, { color: COLOR[color] })
      .useStyle(`\\[bg${color}\\](?:\\[\\w+\\])?[^,\\[]*(?:\\[\\/\\w+\\])?\\[\\/bg${color}\\]`, { backgroundColor: COLOR[color] })
    })
  }

  create(text) {
    return this.factory.create(normalize(text));
  }

  useStyle(pattern, style) {
    this.factory.useStyle(pattern, style);
    return this;
  }

  useCleaner(pattern) {
    this.factory.useCleaner(pattern);
    return this;
  }

}

function normalize(text) {
  const words = text.split(/(\[\/?\w+\])/).filter(s => s && s.length > 0);

  const tags = [];
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (isOpenTag(word)) {
      if (tags.length > 0 && (i > 0 && !isOpenTag(words[i-1]) ) ) {
        words[i] = createCloseTags(tags) + tags.join('') +  word;
      }
      tags.push(word);
    }
    if (isCloseTag(word)) {
      if (tags.length > 0) {
        tags.pop();
      }
      if (tags.length > 0 && (i + 1 < words.length && !isCloseTag(words[i + 1])) ) {
        words[i] += createCloseTags(tags) + tags.join('');
      }
    }

  }

  return words.join('');
}

function isOpenTag(tag) {
  return /^\[\w+\]$/.test(tag);
}

function isCloseTag(tag) {
  return /^\[\/\w+\]$/.test(tag);
}

function createCloseTags(openTags) {
  return openTags.map(tag => tag.replace(/^\[/,'[/')).reverse().join('');
}
