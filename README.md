
# NeoLink

This is a Chrome extension wallet for the Neo Smart Economy.

Currently the project is undergoing heavy development and is hardcoded to only operate on TestNet.

[logo]: (https://github.com/phetter/NeoLink/neolink_alpha_ss.png "Example Screen Shot")

## Setup

yarn install

yarn run start &#35; (for development with live reload)

yarn run build &#35; (production)


Your unpacked extension will be in the ./build/ folder.

See https://developer.chrome.com/extensions/getstarted#unpacked for instructions on manually loading an unpacked Chrome extension in developer mode.

## Use NeoLink with your dApp

Add the following code to your dApp:


```
<input type='text' id='contractScriptHash' />
<input type='text' id='operationName' />
<input type='text' id='runInvokeArgument1' />
<input type='text' id='runInvokeArgument2' />
<input type='text' id='assetType' />
<input type='text' id='assetAmount' />

<button id="runInvokeButton">Invoke</button>
<script>
document.getElementById("runInvokeButton).addEventListener("click",
    function() {
      var scriptHash = document.getElementById("contractScriptHash").value
      var operation = document.getElementById("operationName").value
      var invokeArg1 = document.getElementById("runInvokeArgument1").value
      var invokeArg2 = document.getElementById("runInvokeArgument2").value
      var type = document.getElementById("assetType").value
      var amount = document.getElementById("assetAmount").value

      var invocationObject = {
        'scriptHash': scriptHash,
        'operation': operation,
        'arg1': invokeArg1,
        'arg2': invokeArg2,
        'assetType': type,
        'assetAmount': amount
      }
      window.postMessage({ type: "FROM_PAGE", text: invocationObject }, "*");
}, false);
</script>
```


Please note that currently the code is limited to a maximum of three arguments to the smart contract.

TODO: add arbritrary number of arguments
