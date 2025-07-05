export interface PokeApiType {
  type: { name: string };
}

export interface PokeApiSpecies {
  url: string;
}

export interface PokeApiResponse {
  name: string;
  weight: number;
  types: PokeApiType[];
  species: PokeApiSpecies;
}

export interface PokeApiSpeciesResponse {
  evolution_chain: { url: string };
}

export interface PokeApiEvoChainSpecies {
  name: string;
}

export interface PokeApiEvoChain {
  species: PokeApiEvoChainSpecies;
  evolves_to: PokeApiEvoChain[];
}

export interface PokeApiEvoChainResponse {
  chain: PokeApiEvoChain;
}
