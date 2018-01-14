import Neon, { api } from '@cityofzion/neon-js'

function string2Hex(tmp) {
  let str = ''
  for (let i = 0; i < tmp.length; i++) {
    str += tmp[i].charCodeAt(0).toString(16)
  }
  return str
}

export function callInvoke (network, account, input) {
  // Set Asset Type
  let assetType
  if (input.assetType === 0) {
    assetType = 'NEO'
  } else {
    assetType = 'GAS'
  }

  const txArgs = [input.arg1, input.arg2]
  const args = []
  txArgs.forEach((arg) => {
    if (arg !== '') args.push(string2Hex(arg))
  })

  const myAccount = Neon.create.account(account.wif)

  const config = {
    net: network.name,
    privateKey: myAccount.privateKey,
    address: myAccount.address,
    intents: [{
      assetId: Neon.CONST.ASSET_ID[assetType],
      value: parseFloat(input.amount),
      scriptHash: input.scriptHash,
    }],
    script: { scriptHash: input.scriptHash, operation: input.operation, args: args },
    gas: 0,
  }

  return api.doInvoke(config)
}
