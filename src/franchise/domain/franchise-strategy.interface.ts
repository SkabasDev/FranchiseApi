export interface FranchiseStrategy {
  getData(metadata: any, config: any): Promise<any>;
}
