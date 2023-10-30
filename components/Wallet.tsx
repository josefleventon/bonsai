import { SyntheticEvent, useCallback } from "react";

import copy from "copy-to-clipboard";
import { useWallet } from "client";
import { useState } from "react";
import { microAmountMultiplier } from "util/constants";

import {
  ArrowRightOnRectangleIcon as LogoutIcon,
  CheckIcon,
  ClipboardIcon as CopyIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";

const Action = ({
  name,
  icon,
  action,
}: {
  name: string;
  icon: React.ReactElement<any, any>;
  action: (e?: SyntheticEvent<Element | Event, Event>) => void;
}) => (
  <>
    <a
      onClick={action}
      data-tip={name}
      data-for="wallet"
      className="cursor-pointer w-7 h-7 rounded p-1.5 text-white hover:bg-white/10 transition duration-75 ease-in-out"
    >
      {icon}
    </a>
  </>
);

export default function Wallet() {
  const [copied, setCopied] = useState<boolean>(false);
  const router = useRouter();
  const { wallet, connect, disconnect } = useWallet();

  const handleCopy = useCallback(
    (e: SyntheticEvent<Element | Event, Event> | undefined) => {
      if (!wallet) return;

      e?.preventDefault();

      copy(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    },
    [wallet]
  );

  const handleDisconnect = () => {
    disconnect();
    router.push("/");
  };

  return wallet ? (
    <div className="flex flex-row items-center justify-between w-56 px-4 py-3 mt-4 mb-4 text-white transition duration-150 ease-in-out border rounded-lg cursor-pointer h-14 lg:mx-3 lg:mb-0 group hover:border-white/50 border-white/10">
      <div>
        <p className="w-full text-xs font-medium truncate">{wallet.name}</p>
        <p className="text-xs font-light">
          {new Intl.NumberFormat(`en-US`, {
            style: "currency",
            currency: "USD",
          })
            .format(
              parseFloat(wallet.balance?.amount || "0") / microAmountMultiplier
            )
            .replace("$", "")}{" "}
          STARS
        </p>
      </div>

      <div className="flex flex-row space-x-2">
        <Action
          name="Copy Address"
          icon={copied ? <CheckIcon /> : <CopyIcon />}
          action={handleCopy}
        />
        <Action
          name="Disconnect"
          icon={<LogoutIcon />}
          action={handleDisconnect}
        />
      </div>
    </div>
  ) : (
    <button
      onClick={connect}
      className="inline-flex items-center justify-center w-56 mt-4 mb-4 text-sm font-medium text-white rounded-lg h-14 lg:mb-0 lg:mx-4 bg-primary hover:bg-primary/80"
    >
      Connect
    </button>
  );
}
