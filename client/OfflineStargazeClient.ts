import { StargazeClient } from 'client/core'
import chainInfo from './ChainInfo'

import { CONTRACT_ADDRESS, SG721_CODEID } from 'util/constants'

const client = new StargazeClient({
  wallet: null,
  signingCosmWasmClient: null,
  chainInfo,
  tradeContract: CONTRACT_ADDRESS,
  sg721CodeId: SG721_CODEID,
})

export default client
