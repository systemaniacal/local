// popup.js - Chrome extension action button and main menu

// NOTE: popup.js is stateless between button presses so all activity has to
// sync to background.js (see getBackgroundState() / setBackgroundState())

import "../css/popup.css"
import util from "util"

import * as mainNav from "../html/mainNav.html"
import * as sendHtml from "../html/send.html"
import * as testInvokeContractHtml from "../html/testInvokeContract.html"
import * as sendInvokeContractHtml from "../html/sendInvokeContract.html"
import * as txsHtml from "../html/transactions.html"
import * as balanceHtml from "../html/balance.html"
import * as loginHtml from "../html/login.html"
import * as loggedInHtml from "../html/loggedIn.html"
import * as createWalletHtml from "../html/createWallet.html"
import * as importWalletHtml from "../html/importWallet.html"
import * as exportWalletHtml from "../html/exportWallet.html"
import * as configHtml from "../html/config.html"
import * as authHtml from "../html/authorize.html"

var curNavHtml = mainNav
var curNavLocation = 'Home'
var loggedIn = false
var modalContentCache = ''
var network = ''
var useLoginAddress = false
var address = null
var formCache = {}
var authPending = false
var authQueue = []

getBackgroundState()

document.getElementById("nav").innerHTML = curNavHtml

if (network) document.getElementById("activeNetwork").value = network

if (!loggedIn) {
    // document.getElementById("loginNav").innerHTML = 'Login'
    document.getElementById("content").innerHTML = loginHtml
    addLoginButtonEvent()
} else {
    if (!authPending) {
      // document.getElementById("loginNav").innerHTML = 'Log Out'
      document.getElementById("content").innerHTML = loggedInHtml
      document.getElementById("loginModalContent").innerHTML = modalContentCache
      addLogoutButtonEvent()
    } else {
      document.getElementById("content").innerHTML = authHtml
    }
}

// Send a message to background.js to get all state and store it locally in popup.js

function getBackgroundState () {
  chrome.runtime.sendMessage({'msg': 'getState'}, function(response) {
    loggedIn = response.loggedIn
    console.log('popup loggedIn: '+loggedIn)

    modalContentCache = response.modalContentCache
    console.log('popup modalContentCache: '+modalContentCache)

    network = response.network
    console.log('popup active network: '+network)
    document.getElementById("activeNetwork").value = network

    useLoginAddress = response.useLoginAddress
    console.log('popup useLoginAddress: '+useLoginAddress)
    // document.getElementById("useLoginAddress").innerHTML = useLoginAddress

    address = response.address
    console.log('popup address: '+address)

    curNavLocation = response.curNavLocation
    console.log('popup curNavLocation: '+curNavLocation)

    formCache = response.formCache
    console.log('formCache: '+formCache)

    authPending = response.auth.pending
    console.log('auth pending: '+authPending)

    authQueue = response.auth.queue
    console.log('auth queue: '+authQueue)

    if (curNavLocation === 'Home') {
      if (!loggedIn) {
        // document.getElementById("loginNav").innerHTML = 'Login'
        document.getElementById("content").innerHTML = loginHtml
        addLoginButtonEvent()
      } else {
        if (!authPending) {
            // document.getElementById("loginNav").innerHTML = 'Log Out'
            document.getElementById("content").innerHTML = loggedInHtml
            document.getElementById("loginModalContent").innerHTML = modalContentCache
            addLogoutButtonEvent()
          } else {
            document.getElementById("content").innerHTML = authHtml
            document.getElementById('modalContent').innerHTML = util.inspect(authQueue, {depth: null})
              // var tx = {'operation': operation.value, 'args': args, 'scriptHash': scriptHash.value, 'amount': sendAmount.value, 'type': assetType.value }

            document.getElementById('authYesButton').addEventListener('click', () => {
              chrome.runtime.sendMessage({'msg': 'sendInvoke', 'authorized': true}, function(response) {
                if (response.error) {
                  console.log('error: '+response.error)
                  document.getElementById("modalContent").innerHTML = '<br>error: ' + response.error
                } else {
                  console.log(response.msg)
                  var content = response.msg
                  document.getElementById('modalContent').innerHTML = content
                }
              })
            })
            document.getElementById('authNoButton').addEventListener('click', () => {
              chrome.runtime.sendMessage({'msg': 'sendInvoke', 'authorized': false}, function(response) {
                if (response.error) {
                  console.log('error: '+response.error)
                  document.getElementById("modalContent").innerHTML = '<br>error: ' + response.error
                } else {
                  console.log(response.msg)
                  var content = response.msg
                  document.getElementById('modalContent').innerHTML = content
                }
              })
            })
          }
      }
    } else if (curNavLocation === 'Config') {
      if (useLoginAddress) document.getElementById('configUseLoggedInAddress').checked = true
      else document.getElementById('configUseLoggedInAddress').checked = false
    }
    // callback()
  })
}

// Update background.js with any state changes

function setBackgroundState () {
  var state = {
    loggedIn: loggedIn,
    modalContentCache: modalContentCache,
    useLoginAddress: useLoginAddress,
    address: address,
    curNavLocation: curNavLocation,
    formCache: formCache,
    network: network
  }
  chrome.runtime.sendMessage({'msg': 'setState', 'state': state}, function(response) {
    console.log('setting state')
  })
}

function setCurNavLocation (nav) {
  curNavLocation = nav
  setBackgroundState()
}

document.getElementById('activeNetwork').addEventListener('change', () => {
  network = activeNetwork.value
  console.log('active network changed to: '+activeNetwork.value)
  setBackgroundState()
})

// Setup onClick event listeners for the main navigation buttons by name.
// This will load the HTML into popup.js for each page

document.getElementById('homeNav').addEventListener('click', () => {
  setCurNavLocation('Home')

  if (!loggedIn) {
    // document.getElementById("loginNav").innerHTML = 'Login'
    document.getElementById("content").innerHTML = loginHtml
    addLoginButtonEvent()
  } else {
    // document.getElementById("loginNav").innerHTML = 'Log Out'
    document.getElementById("content").innerHTML = loggedInHtml
    document.getElementById("loginModalContent").innerHTML = modalContentCache
    addLogoutButtonEvent()
  }
})

// Setup onClick event listeners for the main navigation buttons by name.
// This will load the HTML into popup.js for each page

document.getElementById('sendNav').addEventListener('click', () => {
  setCurNavLocation('Send')

  if (!loggedIn) {
    document.getElementById("content").innerHTML = "<div class='content'><h3>Please login</h3></div>"
  }
  else {
    document.getElementById("content").innerHTML = sendHtml

    getBackgroundState()

    // TODO: automate and abstract caching using prototype chains and form field scoping
    if (formCache) {
      if (formCache.address) sendAddress.value = formCache.address
      if (formCache.amount) sendAmount.value = formCache.amount
      if (formCache.type) sendType.value = formCache.type
    }

    document.getElementById('sendAddress').addEventListener('change', () => {
      formCache.address = sendAddress.value
      console.log('address:'+sendAddress.value)
      setBackgroundState()
    })

    document.getElementById('sendAmount').addEventListener('change', () => {
      formCache.amount = sendAmount.value
      console.log('amount:'+sendAmount.value)
      setBackgroundState()
    })

    document.getElementById('sendType').addEventListener('change', () => {
      formCache.amount = sendType.value
      console.log('type:'+sendType.value)
      setBackgroundState()
    })

    document.getElementById('sendButton').addEventListener('click', () => {

      var tx = {'address': sendAddress.value, 'amount': sendAmount.value, 'type': sendType.value }

      chrome.runtime.sendMessage({'msg': 'send', 'tx': tx}, function(response) {
        if(response.error) {
          console.log('error: '+response.error)
          document.getElementById("modalContent").innerHTML = '<br>error: ' + response.error
        } else {
          console.log(response.msg)

          var content = response.msg
          document.getElementById('modalContent').innerHTML = content
          // document.getElementById("modalContent").innerHTML = "<ul>" + content + "</ul>"
        }
      })
      formCache = {}
      sendAddress.value = ''
      sendAmount.value = ''
      sendType.value = 'Neo'
    })
  }
})

// Setup onClick event listeners for the main navigation buttons by name.
// This will load the HTML into popup.js for each page

document.getElementById('testInvokeNav').addEventListener('click', () => {
  setCurNavLocation('Test Invoke Contract')

  if (!loggedIn) {
    document.getElementById("content").innerHTML = "<div class='content'><h3>Please login</h3></div>"
  }
  else {
    document.getElementById("content").innerHTML = testInvokeContractHtml

    getBackgroundState()

    // TODO: automate and abstract caching using prototype chains and form field scoping
    if (formCache) {
      if (formCache.operation) operation.value = formCache.operation
      if (formCache.arg1) arg1.value = formCache.arg1
      if (formCache.arg2) arg2.value = formCache.arg2
      if (formCache.scriptHash) scriptHash.value = formCache.scriptHash
    }

    document.getElementById('operation').addEventListener('change', () => {
      formCache.operation = operation.value
      console.log('operation:'+operation.value)
      setBackgroundState()
    })

    document.getElementById('arg1').addEventListener('change', () => {
      formCache.arg1 = arg1.value
      console.log('arg1:'+arg1.value)
      setBackgroundState()
    })

    document.getElementById('arg2').addEventListener('change', () => {
      formCache.arg2 = arg2.value
      console.log('arg2:'+arg2.value)
      setBackgroundState()
    })

    document.getElementById('scriptHash').addEventListener('change', () => {
      formCache.scriptHash = scriptHash.value
      console.log('scriptHash:'+scriptHash.value)
      setBackgroundState()
    })

    document.getElementById('testInvokeContractButton').addEventListener('click', () => {
      var args = [arg1.value, arg2.value]
      console.log('args:'+args)

      var tx = { 'operation': operation.value, 'args': args, 'scriptHash': scriptHash.value }

      chrome.runtime.sendMessage({'msg': 'testInvoke', 'tx': tx}, function(response) {
        if(response.error) {
          console.log('error: '+response.error)
          document.getElementById("modalContent").innerHTML = '<br>error: ' + response.error
        } else {
          console.log(response.msg)

          var content = response.msg
          document.getElementById('modalContent').innerHTML = content
          // document.getElementById("modalContent").innerHTML = "<ul>" + content + "</ul>"
        }
      })
      formCache = {}
      operation.value = ''
      arg1.value = ''
      arg2.value = ''
      scriptHash.value = ''
    })
  }
})

// Setup onClick event listeners for the main navigation buttons by name.
// This will load the HTML into popup.js for each page

document.getElementById('sendInvokeNav').addEventListener('click', () => {
  setCurNavLocation('Send Invoke Contract')

  if (!loggedIn) {
    document.getElementById("content").innerHTML = "<div class='content'><h3>Please login</h3></div>"
  }
  else {
    document.getElementById("content").innerHTML = sendInvokeContractHtml

    getBackgroundState()

    // TODO: automate and abstract caching using prototype chains and form field scoping
    if (formCache) {
      if (formCache.operation) operation.value = formCache.operation
      if (formCache.arg1) arg1.value = formCache.arg1
      if (formCache.arg2) arg2.value = formCache.arg2
      if (formCache.scriptHash) scriptHash.value = formCache.scriptHash
      if (formCache.amount) sendAmount.value = formCache.amount
      if (formCache.type) assetType.value = formCache.type
    }

    document.getElementById('operation').addEventListener('change', () => {
      formCache.operation = operation.value
      console.log('operation:'+operation.value)
      setBackgroundState()
    })

    document.getElementById('arg1').addEventListener('change', () => {
      formCache.arg1 = arg1.value
      console.log('arg1:'+arg1.value)
      setBackgroundState()
    })

    document.getElementById('arg2').addEventListener('change', () => {
      formCache.arg2 = arg2.value
      console.log('arg2:'+arg2.value)
      setBackgroundState()
    })

    document.getElementById('scriptHash').addEventListener('change', () => {
      formCache.scriptHash = scriptHash.value
      console.log('scriptHash:'+scriptHash.value)
      setBackgroundState()
    })

    document.getElementById('sendAmount').addEventListener('change', () => {
      formCache.amount = sendAmount.value
      console.log('amount:'+sendAmount.value)
      setBackgroundState()
    })

    document.getElementById('assetType').addEventListener('change', () => {
      formCache.amount = assetType.value
      console.log('type:'+assetType.value)
      setBackgroundState()
    })

    document.getElementById('invokeContractButton').addEventListener('click', () => {
      var args = [arg1.value, arg2.value]
      console.log('args:'+args)

      var tx = {'operation': operation.value, 'args': args, 'scriptHash': scriptHash.value, 'amount': sendAmount.value, 'type': assetType.value }

      chrome.runtime.sendMessage({'msg': 'sendInvoke', 'tx': tx}, function(response) {
        if(response.error) {
          console.log('error: '+response.error)
          document.getElementById("modalContent").innerHTML = '<br>error: ' + response.error
        } else {
          console.log(response.msg)

          var content = response.msg
          document.getElementById('modalContent').innerHTML = content
        }
      })
      formCache = {}
      operation.value = ''
      arg1.value = ''
      arg2.value = ''
      scriptHash.value = ''
      sendAmount.value = ''
      assetType.value = ''
    })
  }
})

// Setup onClick event listeners for the main navigation buttons by name.
// This will load the HTML into popup.js for each page

document.getElementById('txsNav').addEventListener('click', () => {
  setCurNavLocation('Transactions')

  document.getElementById("content").innerHTML = txsHtml

  getBackgroundState()

  if (useLoginAddress) document.getElementById('txsAddress').value = address

  document.getElementById('getTxsButton').addEventListener('click', () => {
    var address = document.getElementById("txsAddress").value
    console.log('add:'+address)

    chrome.runtime.sendMessage({'msg': 'getTransactionHistory', 'args': address}, function(response) {
      if(response.error) {
        console.log('error: '+util.inspect(response.error, {depth: null}))
        document.getElementById("modalContent").innerHTML = '<br>Address not found'
      } else {
        console.log(response.msg)
        var txs = response.msg
        var content = "";
        for (let i = 0; i < txs.length; i++){
          if (txs[i].neo_sent === true){
            console.log("NEO: " + txs[i].txid)
            content += "<li>NEO: "+txs[i].txid+"</li>"
          }
          if (txs[i].gas_sent === true){
            console.log("GAS: " + txs[i].txid)
            content += "<li>GAS: "+txs[i].txid+"</li>"
          }
        }
        if (!content) content = "There are no transactions for this address"
        document.getElementById("modalContent").innerHTML = "<ul>" + content + "</ul>"
      }
    })
  })
})

// Setup onClick event listeners for the main navigation buttons by name.
// This will load the HTML into popup.js for each page

document.getElementById('balanceNav').addEventListener('click', () => {
  setCurNavLocation('Balance')

  document.getElementById("content").innerHTML = balanceHtml

  getBackgroundState()

  if (useLoginAddress) document.getElementById('balanceAddress').value = address

  document.getElementById('getBalanceButton').addEventListener('click', () => {
    var address = document.getElementById("balanceAddress").value
    console.log('add:'+address)

    chrome.runtime.sendMessage({'msg': 'getBalance', 'address': address}, function(response) {
      if(response.error) {
        console.log('error: '+util.inspect(response.error, {depth: null}))
        document.getElementById("modalContent").innerHTML = '<br>Address not found'
      } else {
        console.log(response)
        // document.getElementById("content").innerHTML = "<h3>" + response.msg + "</h3>";
        document.getElementById("modalContent").innerHTML = "<b>" +
    		response.address + "</b><br>NEO Balance: " + response.bals.NEO.balance +
    		"<br>GAS: " + response.bals.GAS.balance
      }
    })
  })
})

function addLogoutButtonEvent () {
  document.getElementById('logoutButton').addEventListener('click', () => {
    getBackgroundState()

    if(loggedIn) {
    //   document.getElementById("loginNav").innerHTML = 'Login'
    //   document.getElementById("content").innerHTML = loginHtml
    //   addLoginButtonEvent()
    // } else {
      chrome.runtime.sendMessage({'msg': 'logout'}, function(response) {
        console.log('logged out')
        loggedIn = false
        // document.getElementById("loginNav").innerHTML = 'Login'
        document.getElementById("content").innerHTML = loginHtml
        addLoginButtonEvent()
      })
    }
    // chrome.webNavigation.onCompleted.addListener(() => {
    // })
  })
}

function addLoginButtonEvent () {
  document.getElementById('loginButton').addEventListener('click', () => {
    var wif = document.getElementById("loginWif").value
    console.log('wif:'+wif)

    var passphrase = document.getElementById("loginWifPassphrase").value
    console.log('wif:'+passphrase)

    chrome.runtime.sendMessage({'msg': 'loginWif', 'encryptedWif': wif, 'passphrase': passphrase}, function(response) {
      if(response.error) {
        console.log('error: '+util.inspect(response.error, {depth: null}))
        // document.getElementById("modalContent").innerHTML = '<br>Address not found'
      } else {
        console.log(response)
        console.log('loggedIn:'+response.loggedIn)
        loggedIn = response.loggedIn
        // document.getElementById("loginNav").innerHTML = 'Log Out'
        document.getElementById("content").innerHTML = loggedInHtml

        modalContentCache = "<b>Address:</b><br>" + response.account.address + "<br>" +
          "<b>Public Key Encoded: </b><br>" + response.account.publicKeyEncoded + "<br>" +
          "<b>Public Key Hash: </b><br>" + response.account.publicKeyHash + "<br>"
        // returns { privateKey, publicKeyEncoded, publicKeyHash, programHash, address }
        document.getElementById("loginModalContent").innerHTML = modalContentCache
        // document.getElementById("loginModalContent").innerHTML = "<b>Address:</b><br>" + response.account.address + "<br>" +
        //   "<b>Public Key Encoded: </b><br>" + response.account.publicKeyEncoded + "<br>" +
        //   "<b>Public Key Hash: </b><br>" + response.account.publicKeyHash + "<br>"
        setBackgroundState()
      }
    })
  })
}

// Setup onClick event listeners for the main navigation buttons by name.
// This will load the HTML into popup.js for each page

document.getElementById('createWalletNav').addEventListener('click', () => {
  setCurNavLocation('Create Wallet')
  document.getElementById("content").innerHTML = createWalletHtml

})

// Setup onClick event listeners for the main navigation buttons by name.
// This will load the HTML into popup.js for each page

document.getElementById('importWalletNav').addEventListener('click', () => {
  setCurNavLocation('Import Wallet')
  document.getElementById("content").innerHTML = importWalletHtml

})

// Setup onClick event listeners for the main navigation buttons by name.
// This will load the HTML into popup.js for each page

document.getElementById('exportWalletNav').addEventListener('click', () => {
  setCurNavLocation('Export Wallet')

  document.getElementById("content").innerHTML = exportWalletHtml

})

// Setup onClick event listeners for the main navigation buttons by name.
// This will load the HTML into popup.js for each page

document.getElementById('configNav').addEventListener('click', () => {
  setCurNavLocation('Config')
  getBackgroundState()

  document.getElementById("content").innerHTML = configHtml

  document.getElementById('configUseLoggedInAddress').addEventListener('change', () => {
    console.log('configUseLoggedInAddress: '+configUseLoggedInAddress.checked)
    useLoginAddress = configUseLoggedInAddress.checked
    console.log('useLoginAddress: '+useLoginAddress)
    setBackgroundState()
  })

  document.getElementById('updateConfigButton').addEventListener('click', () => {
    setBackgroundState()
  })
})
