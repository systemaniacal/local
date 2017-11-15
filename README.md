# NeoLink

This is a Chrome extension wallet for the Neo cryptocurrency.



## Setup

yarn install

yarn run start (for development with live reload)

yarn run build (production)


## Use NeoLink with your dApp

Add the following javascript to your dApp:

<input type='text' id='actionPayInput_<%= action.id %>' placeholder="setting"/>
<button id="actionPayButton_<%= action.id %>">Pay</button>
<!-- </form> -->
<script>
document.getElementById("actionPayButton_<%= action.id %>").addEventListener("click",
    function() {
      var actionValue = document.getElementById("actionPayInput_<%= action.id %>").value

      var actionPack = {
        'scriptHash': '<%= action.scriptHash %>',
        'operation': 'putvalue',
        'arg1': 'test',
        'arg2': actionValue,
        'assetType': 'GAS',
        'assetAmount': '<%= action.price %>'
      }
      window.postMessage({ type: "FROM_PAGE", text: actionPack }, "*");
}, false);
</script>
