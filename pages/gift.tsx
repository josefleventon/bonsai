import axios from "axios";
import { useGuard, useWallet } from "client";
import { getToken, NFT } from "client/query";
import { Spinner } from "components";
import { MintImage } from "components/MediaView";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { GUARD_API } from "util/constants";
import { StdTx, fromBech32, toBech32 } from "cosmwasm";

export default function Gift() {
  const { wallet, connect } = useWallet();
  const { guard } = useGuard();

  const router = useRouter();
  const { id, sender } = router.query;

  const [nft, setNft] = useState<NFT>();
  const [message, setMessage] = useState<string>();

  useEffect(() => {
    async function effect() {
      if (!guard || !wallet) return;

      const now = new Date().toISOString();
      const body = `I am authorizing Swift Guard, at ${now}, to share my data with the owner of this webpage or application. I acknowledge that that they may at any point store my data on their own servers. I understand that they may at any point share my data with other parties. Through this wallet signature, I am expressly authorizing the owner of this webpage or application to access my data.`;

      const unzippedAddress = fromBech32(wallet.address);
      const junoAddress = toBech32("juno", unzippedAddress.data);

      const sig = await window.wallet.signArbitrary(
        "juno-1",
        junoAddress,
        body
      );

      const msg: StdTx = {
        msg: [
          {
            type: "sign/MsgSignData",
            value: {
              signer: junoAddress,
              data: btoa(body),
            },
          },
        ],
        fee: { gas: "0", amount: [] },
        memo: "",
        signatures: [sig],
      };

      const { data, status } = await axios.post(
        GUARD_API + `/retrieve/${sender}/${id}`,
        {
          namespace: "bonsai",
          type: "address",
          msg,
        }
      );

      console.log(data, status);

      if (status !== 200) {
        alert("Something went wrong. Please try again later.");
        router.push("/");
      }

      const result = JSON.parse(data.value);
      const token = await getToken(result.nft.toString());

      console.log(token, result);

      setNft(token);
      setMessage(result.message);
    }
    effect();
  }, [guard, wallet]);

  useEffect(() => {
    console.log("Updated!", message, nft);
  }, [message, nft]);

  return Boolean(message) && Boolean(nft) ? (
    <div className="flex flex-col justify-center h-screen max-w-xl mx-4 lg:mx-auto">
      <p className="mb-2 text-xl font-semibold text-center">
        You've received a flower!
      </p>

      <div className="grid grid-cols-3 gap-4 p-4">
        <div></div>
        <MintImage src={nft?.media.image.jpgLink} alt={nft?.name} />
      </div>

      <p className="mt-4 italic font-medium text-center">{message}</p>

      {!wallet && (
        <button
          onClick={connect}
          className="inline-flex items-center justify-center w-full py-3 mt-4 text-sm font-medium text-black bg-white rounded-lg hover:bg-white/80"
        >
          Connect wallet
        </button>
      )}
    </div>
  ) : (
    <div className="flex items-center justify-center w-screen h-screen">
      <Spinner className="w-12 h-12 text-white" />
    </div>
  );
}
