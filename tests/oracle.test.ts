import { drawCards, defaultDeck } from '../src/oracle';

test('draw card from default deck', () => {
  const [card] = drawCards(1);
  expect(defaultDeck).toContainEqual(card);
});
