export interface OracleCard {
  title: string;
  description: string;
  prompt: string;
}

export const defaultDeck: OracleCard[] = [
  {
    title: "Sol",
    description: "Claridade e vitalidade",
    prompt: "O que ilumina seu caminho hoje?",
  },
  {
    title: "Lua",
    description: "Mistério e intuição",
    prompt: "Que segredo pede sua atenção?",
  },
  {
    title: "Estrela",
    description: "Esperança e inspiração",
    prompt: "Onde você busca orientação?",
  },
];

export function drawCards(count = 1, deck: OracleCard[] = defaultDeck): OracleCard[] {
  const cards: OracleCard[] = [];
  for (let i = 0; i < count; i++) {
    cards.push(deck[Math.floor(Math.random() * deck.length)]);
  }
  return cards;
}
