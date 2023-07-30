import { useGuard, useWallet } from "client";
import { getToken, NFT } from "client/query";
import { Spinner } from "components";
import { MintImage } from "components/MediaView";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Gift() {
  const { wallet, connect } = useWallet();
  const { guard } = useGuard();

  const router = useRouter();
  const { id } = router.query;

  const [nft, setNft] = useState<NFT>();
  const [message, setMessage] = useState<string>();

  useEffect(() => {
    async function effect() {
      if (!guard) return;
      const dataText = await guard.get(id as string);
      const data: { nft: number; message: string } = JSON.parse(dataText);
      const token = await getToken(data.nft.toString());
      setNft(token);
      setMessage(data.message);
    }
    effect();
  }, [guard]);

  return message && nft ? (
    <div className="flex flex-col justify-center h-screen max-w-xl mx-4 lg:mx-auto">
      <p className="mb-2 text-xl font-semibold text-center">
        You've received a flower!
      </p>

      <div className="grid grid-cols-3 gap-4 p-4">
        <div></div>
        <MintImage src={nft.media.image.jpgLink} alt={nft.name} />
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
