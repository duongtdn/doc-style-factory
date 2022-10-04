" use strict"

import DocStyleFactory from "../src";

test('Test if corrrect style patterns and cleaner patterns are used', () => {
  const factory = new DocStyleFactory();
  const str = 'Test [b]bold[/b] and [i]italic[/i] and [u]underline[/u]';

  expect(
    factory.create(str)
  ).toEqual([
    { text: 'Test ' },
    { text: 'bold', style: { fontWeight: 'bold' } },
    { text: ' and ' },
    { text: 'italic', style: { fontStyle: 'italic' } },
    { text: ' and ' },
    { text: 'underline', style: { textDecoration: 'underline' } },
  ])
});

test('Test if simple cascaded style is used', () => {
  const factory = new DocStyleFactory();
  const str = 'Test [b][i]bold and italic[/i][/b] and [u]underline[/u]';

  expect(
    factory.create(str)
  ).toEqual([
    { text: 'Test ' },
    { text: 'bold and italic', style: { fontWeight: 'bold', fontStyle: 'italic' } },
    { text: ' and ' },
    { text: 'underline', style: { textDecoration: 'underline' } },
  ])
});

test('Test if complex cascaded style is used', () => {
  const factory = new DocStyleFactory();
  const str = 'Test [b]bold and [i]italic[/i][/b] and [b][u]underline[/u] with bold[/b].';
  expect(
    factory.create(str)
  ).toEqual([
    { text: 'Test ' },
    { text: 'bold and ', style: { fontWeight: 'bold' } },
    { text: 'italic', style: { fontWeight: 'bold', fontStyle: 'italic' } },
    { text: ' and ' },
    { text: 'underline', style: { fontWeight: 'bold', textDecoration: 'underline' } },
    { text: ' with bold', style: { fontWeight: 'bold' } },
    { text: '.' },
  ])
});
