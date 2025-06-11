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
