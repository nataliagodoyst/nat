import { getSuggestions } from '../src/context';

test('extracts sentences as suggestions', () => {
  const text = 'Primeira frase. Segunda frase! Terceira? Quarta.';
  const result = getSuggestions(text, 2);
  expect(result).toEqual(['Primeira frase', 'Segunda frase']);
});
