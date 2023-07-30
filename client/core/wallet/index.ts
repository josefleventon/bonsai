import { Coin } from "@cosmjs/amino";

export interface WalletData {
  readonly address: string;
  readonly pubKey: string;
  readonly name?: string;
  readonly balance?: Coin;
  readonly type: string;
}
