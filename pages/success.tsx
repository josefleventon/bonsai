import { CheckIcon, ClipboardIcon } from "@heroicons/react/24/outline";
import copy from "copy-to-clipboard";
import { useRouter } from "next/router";
import { useState } from "react";
import { BASE_URL } from "util/constants";

export default function Success() {
  const [copied, setCopied] = useState<boolean>(false);
  const router = useRouter();
  const { id, sender } = router.query;
  return (
    <div className="flex flex-col justify-center h-screen max-w-xl mx-4 lg:mx-auto">
      <p className="mb-2 text-lg font-medium text-center">
        Success! Your flower has been sent.
      </p>
      <div className="w-full">
        <label
          htmlFor="email"
          className="block text-sm font-medium leading-6 text-center text-white"
        >
          Send this link to your recipient
        </label>
        <div className="flex mt-3 rounded-md shadow-sm">
          <div className="relative flex items-stretch flex-grow focus-within:z-10">
            <input
              type="text"
              name="link"
              id="link"
              disabled
              className="block w-full border rounded-none rounded-l-md border-white py-1.5 pl-4 text-white ring-1 ring-inset bg-black sm:text-sm sm:leading-6"
              value={BASE_URL + `/gift?id=${id}&sender=${sender}`}
            />
          </div>
          <button
            type="button"
            onClick={() => {
              copy(BASE_URL + `/gift?id=${id}&sender=${sender}`);
              setCopied(true);
              setTimeout(() => setCopied(false), 3000);
            }}
            className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-white ring-1 ring-inset ring-gray-300 hover:bg-white/10"
          >
            {copied ? (
              <CheckIcon
                className="-ml-0.5 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            ) : (
              <ClipboardIcon
                className="-ml-0.5 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            )}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}
