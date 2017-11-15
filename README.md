# NeoLink

This is a Chrome extension wallet for the Neo cryptocurrency.



## Setup

yarn install

yarn run start (for development with live reload)

yarn run build (production)


## Use NeoLink with your dApp

Add the following javascript to your dApp:


```
<input type='text' id='runInvokeArgument' placeholder="setting"/>
<button id="runInvokeButton">Invoke</button>
<script>
document.getElementById("runInvokeButton).addEventListener("click",
    function() {
      var invokeArg = document.getElementById("runInvokeArgument").value

      var invocationObject = {
        'scriptHash': '_your script hash here_',
        'operation': 'putvalue',
        'arg1': 'test',
        'arg2': actionValue,
        'assetType': 'GAS',
        'assetAmount': '<%= action.price %>'
      }
      window.postMessage({ type: "FROM_PAGE", text: actionPack }, "*");
}, false);
</script>
```
