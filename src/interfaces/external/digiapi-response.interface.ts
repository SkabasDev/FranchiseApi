export interface DigiApiLevel {
  level: string;
}

export interface DigiApiNextEvolution {
  digimon: string;
}

export interface DigiApiResponse {
  name: string;
  levels?: DigiApiLevel[];
  nextEvolutions?: DigiApiNextEvolution[];
}
