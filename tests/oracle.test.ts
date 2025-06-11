import { drawCards, defaultDeck } from '../src/oracle';

test('draw card from default deck', () => {
  const [card] = drawCards(1);
  expect(defaultDeck).toContainEqual(card);
});

test('draw card from custom deck', () => {
  const custom = [
    { title: 'A', description: 'B', prompt: 'C' },
    { title: 'D', description: 'E', prompt: 'F' },
  ];
  const [card] = drawCards(1, custom);
  expect(custom).toContainEqual(card);
});

test('draw card from deckJSON data', () => {
  const deck = [
    { title: 'G', description: 'H', prompt: 'I' },
    { title: 'J', description: 'K', prompt: 'L' },
  ];
  const parsed = JSON.parse(JSON.stringify(deck));
  const [card] = drawCards(1, parsed);
  expect(deck).toContainEqual(card);
});
