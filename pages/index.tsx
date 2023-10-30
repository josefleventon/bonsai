import { useWallet } from "client";
import { useRouter } from "next/router";

export default function Home() {
  const { wallet, connect } = useWallet();
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen">
      <p className="text-3xl font-bold text-white">Bonsai Flowers</p>
      <button
        onClick={() => {
          if (wallet) router.push("/send");
          else connect();
        }}
        className="inline-flex items-center justify-center w-56 py-3 mt-4 text-sm font-medium text-black bg-white rounded-lg hover:bg-white/80"
      >
        {wallet ? "Send a flower" : "Connect wallet"}
      </button>
      {!wallet && (
        <p className="w-48 mt-3 text-xs text-center text-white">
          You need to connect a wallet before you can send a flower.
        </p>
      )}
      <p className="mt-4 text-sm">
        Built by{" "}
        <a
          href="https://josef.stars.page"
          rel="noopener noreferrer"
          target="_blank"
          className="underline hover:text-white/75"
        >
          josef.stars
        </a>{" "}
        for the{" "}
        <a
          href="https://discord.gg/TpfRkctX"
          rel="noopener noreferrer"
          target="_blank"
          className="underline hover:text-white/75"
        >
          Bonsai Crew
        </a>
      </p>
    </div>
  );
}
