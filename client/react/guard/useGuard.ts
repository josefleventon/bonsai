import { useContext } from "react";
import { GuardCtx } from "./GuardContext";

export default function useGuard() {
  const value = useContext(GuardCtx);
  return value;
}
