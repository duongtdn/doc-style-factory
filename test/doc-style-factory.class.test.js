" use strict"

import DocStyleFactory from "../src";
import COLOR from '../src/color';

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

test('Test with color pattern', () => {
  const factory = new DocStyleFactory();
  const str = 'Test [blue]text [red]color[/red] in blue[/blue].';
  expect(
    factory.create(str)
  ).toEqual([
    { text: 'Test ' },
    { text: 'text ', style: { color: COLOR.blue } },
    { text: 'color', style: { color: COLOR.red } },
    { text: ' in blue', style: { color: COLOR.blue } },
    { text: '.' },
  ])
});


test('Test with background color pattern', () => {
  const factory = new DocStyleFactory();
  const str = 'Test [bgblue]text [red]color[/red] in blue[/bgblue].';
  expect(
    factory.create(str)
  ).toEqual([
    { text: 'Test ' },
    { text: 'text ', style: { backgroundColor: COLOR.blue } },
    { text: 'color', style: { backgroundColor: COLOR.blue, color: COLOR.red } },
    { text: ' in blue', style: { backgroundColor: COLOR.blue } },
    { text: '.' },
  ])
});

test('Test three cascaded level', () => {
  const factory = new DocStyleFactory();
  const str = 'Test [blue][u][i]text[/i][/u][/blue]';
  expect(
    factory.create(str)
  ).toEqual([
    { text: 'Test ' },
    { text: 'text', style: { color: COLOR.blue, fontStyle: 'italic', textDecoration: 'underline' } },
  ])
});
