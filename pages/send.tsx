import { useGuard, useStargazeClient, useWallet } from "client";
import { getInventory, NFT } from "client/query";
import { MediaView, Spinner } from "components";
import { useTx } from "contexts/tx";
import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { fromBech32, toBech32, toUtf8 } from "cosmwasm";
import useToaster, { ToastTypes } from "hooks/useToaster";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { COLLECTION_ADDRESS } from "util/constants";
import { uuid as uuidv4 } from "uuidv4";

export default function Home() {
  const { wallet } = useWallet();
  const { guard } = useGuard();
  const { client } = useStargazeClient();
  const router = useRouter();

  const { tx } = useTx();
  const toaster = useToaster();

  const [inventory, setInventory] = useState<NFT[]>();
  const [selectedNft, setSelectedNft] = useState<string>();

  useEffect(() => {
    if (!wallet) return;
    getInventory(wallet.address).then((inventory) => setInventory(inventory));
  }, [wallet]);

  const [recipient, setRecipient] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSend = useCallback(async () => {
    if (!wallet || !guard || !selectedNft || !recipient || !message) return;

    let peer;

    // Get address from name
    try {
      fromBech32(recipient);
      peer = recipient;
    } catch {
      try {
        if (!client?.cosmWasmClient) await client?.connect();
        const data = await client?.cosmWasmClient.queryContractSmart(
          process.env.NEXT_PUBLIC_NAMES_CONTRACT_ADDRESS!,
          {
            associated_address: {
              name: recipient.replaceAll(
                /(\.([a-z]{2,24}))(\.([a-z]{2,24}))?/g,
                ""
              ),
            },
          }
        );
        peer = data;
      } catch (e) {
        return toaster.toast({
          title: "Recipient address/name invalid",
          type: ToastTypes.Error,
          dismissable: true,
        });
      }
    }

    const msg = MsgExecuteContract.fromPartial({
      sender: wallet?.address,
      contract: COLLECTION_ADDRESS,
      msg: toUtf8(
        JSON.stringify({
          transfer_nft: {
            recipient: peer,
            token_id: selectedNft,
          },
        })
      ),
      funds: [],
    });

    const wasmMsg = {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: msg,
    };

    const uuid = uuidv4();

    await guard.put(
      uuid,
      JSON.stringify({
        nft: selectedNft,
        message,
      }),
      "bonsai"
    );

    const unzippedAddress = fromBech32(peer);
    const junoAddress = toBech32("juno", unzippedAddress.data);

    await guard.authorize("address", junoAddress);

    tx([wasmMsg], {}, async () => {
      router.push(
        `/success?id=${uuid}&sender=${guard.sig?.msg[0].value.signer}`
      );
    });
  }, [wallet, guard, selectedNft, recipient, message, tx]);

  return inventory ? (
    <div className="flex flex-col justify-center h-screen max-w-xl mx-8 lg:mx-auto">
      <p className="text-3xl font-bold text-center text-white">Send a flower</p>
      <div className="mt-4">
        <p className="text-sm font-medium mb-0.5 text-white">
          Who are you sending this to?
        </p>
        <input
          id="recipient"
          type="text"
          placeholder="Enter STARS address or name"
          className="w-full p-2 text-sm text-white bg-black rounded-lg focus:border-white/25 border-white/25 placeholder-white/50 focus:ring-2 focus:ring-primary"
          value={recipient}
          onChange={(e) => setRecipient(e.currentTarget.value)}
          required
        />
      </div>
      <div className="mt-2">
        <p className="text-sm font-medium mb-0.5 text-white">Choose a flower</p>
        <div className="grid grid-cols-3 gap-4 p-4 border rounded-md border-white/25">
          {inventory.map((nft) => (
            <MediaView
              key={nft.tokenId}
              nft={nft}
              onClick={() => setSelectedNft(nft.tokenId)}
              selected={selectedNft == nft.tokenId}
              small
            />
          ))}
          {inventory.length < 1 && (
            <div className="text-sm font-bold text-white">None available</div>
          )}
        </div>
      </div>
      <input
        id="message"
        type="text"
        placeholder="Enter a message to be attached to your flower"
        className="w-full p-2 mt-4 text-sm text-white bg-black rounded-lg focus:border-white/25 border-white/25 placeholder-white/50 focus:ring-2 focus:ring-primary"
        value={message}
        onChange={(e) => setMessage(e.currentTarget.value)}
        required
      />
      <button
        onClick={handleSend}
        className="inline-flex items-center justify-center w-full py-3 mt-4 text-sm font-medium text-black bg-white rounded-lg hover:bg-white/80"
      >
        Send flower
      </button>
      {!wallet && (
        <p className="w-48 mt-3 text-xs text-center text-white">
          You need to connect a wallet before you can send a flower.
        </p>
      )}
    </div>
  ) : (
    <div className="flex items-center justify-center w-screen h-screen">
      <Spinner className="w-12 h-12 text-white" />
    </div>
  );
}
