import {
  createContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useChain } from "@cosmos-kit/react";
import Guard from "@swiftprotocol/guard";
import useWallet from "../wallet/useWallet";
import { CHAIN_ID, GUARD_API } from "util/constants";

// Guard context

export interface GuardContext {
  guard: Guard | undefined;
  refreshGuard: () => void;
}

export const GuardCtx = createContext<GuardContext>({
  guard: undefined,
  refreshGuard: () => {},
});

export const GuardProvider = ({ children }: { children: ReactNode }) => {
  const [guard, setGuard] = useState<GuardContext["guard"]>(undefined);
  const { wallet } = useWallet();
  const { signArbitrary } = useChain(process.env.NEXT_PUBLIC_NETWORK!);

  useEffect(() => {
    refreshGuard();
  }, [wallet]);

  const refreshGuard = useCallback(() => {
    if (!wallet || !signArbitrary) return setGuard(undefined);
    const newGuard = new Guard({
      api: GUARD_API,
      wallet: wallet.type as "keplr" | "cosmostation" | "leap",
      // chainId: CHAIN_ID,
    });
    setGuard(newGuard);
  }, [setGuard, wallet, GUARD_API /*CHAIN_ID*/]);

  return (
    <GuardCtx.Provider
      value={{
        guard,
        refreshGuard,
      }}
    >
      {children}
    </GuardCtx.Provider>
  );
};
