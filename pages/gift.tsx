import { useStargazeClient, useWallet } from 'client'
import { getToken, NFT } from 'client/query'
import { Spinner } from 'components'
import { MintImage } from 'components/MediaView'
import { useTx } from 'contexts/tx'
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx'
import { toUtf8 } from 'cosmwasm'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { TradeMessageComposer } from 'types/Trade.message-composer'
import { Offer } from 'types/Trade.types'
import { COLLECTION_ADDRESS, CONTRACT_ADDRESS } from 'util/constants'

export default function Success() {
  const { wallet, connect } = useWallet()
  const { client } = useStargazeClient()

  const router = useRouter()
  const { id } = router.query

  const { tx } = useTx()

  const [offer, setOffer] = useState<Offer>()
  const [nft, setNft] = useState<NFT>()

  const [accepted, setAccepted] = useState<boolean>()

  useEffect(() => {
    if (!client?.tradeClient) return
    if (!id && !accepted) router.push('/')

    console.log(id)

    client?.tradeClient.offer({ id: parseInt(id as string) }).then((result) => {
      if (accepted) return
      if (!result.offer) return router.push('/')
      console.log(result)
      getToken(result.offer.offered_nfts[0].token_id.toString()).then((nft) =>
        setNft(nft),
      )
      setOffer(result.offer)
    })
  }, [client?.tradeClient, accepted])

  const handleAccept = useCallback(() => {
    if (!wallet || !offer) return

    const messageComposer = new TradeMessageComposer(
      wallet.address,
      CONTRACT_ADDRESS,
    )
    const msg = messageComposer.acceptOffer({ id: offer.id })
    tx(
      [
        msg,
        {
          typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
          value: MsgExecuteContract.fromPartial({
            sender: wallet.address,
            msg: toUtf8(
              JSON.stringify({
                burn: {
                  token_id: String(offer.offered_nfts[0].token_id),
                },
              }),
            ),
            contract: COLLECTION_ADDRESS,
          }),
        },
      ],
      {
        toast: {
          title: 'Gift accepted',
        },
      },
      () => setAccepted(true),
    )
  }, [tx, wallet, offer])

  const handleReject = useCallback(() => {
    if (!wallet || !offer) return
    const messageComposer = new TradeMessageComposer(
      wallet.address,
      CONTRACT_ADDRESS,
    )
    const msg = messageComposer.rejectOffer({ id: offer.id })

    tx(
      [msg],
      {
        toast: {
          title: 'Gift rejected',
        },
      },
      () => router.push('/'),
    )
  }, [tx, wallet, offer])

  return offer && nft ? (
    <div className="flex flex-col justify-center h-screen max-w-xl mx-4 lg:mx-auto">
      <p className="mb-2 text-xl font-semibold text-center">
        You've received a flower!
      </p>

      <div className="grid grid-cols-3 gap-4 p-4">
        <div></div>
        <MintImage src={nft.media.image.jpgLink} alt={nft.name} />
      </div>

      <p className="mt-4 italic font-medium text-center">
        {accepted
          ? offer.message
          : 'Message is hidden. Accept the gift to unlock it.'}
      </p>

      {!wallet && !accepted && (
        <button
          onClick={connect}
          className="inline-flex items-center justify-center w-full py-3 mt-4 text-sm font-medium text-black bg-white rounded-lg hover:bg-white/80"
        >
          Connect wallet
        </button>
      )}

      {!accepted && wallet && (
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleAccept}
            className="inline-flex items-center justify-center w-full py-3 mt-4 text-sm font-medium text-black bg-white rounded-lg hover:bg-white/80"
          >
            Accept gift
          </button>
          <button
            onClick={handleReject}
            className="inline-flex items-center justify-center w-full py-3 mt-4 text-sm font-medium text-black bg-red-500 rounded-lg hover:bg-red-500/80"
          >
            Reject gift
          </button>
        </div>
      )}
    </div>
  ) : (
    <div className="flex items-center justify-center w-screen h-screen">
      <Spinner className="w-12 h-12 text-white" />
    </div>
  )
}
