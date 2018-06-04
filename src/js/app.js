App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fall back to Ganache
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);
    return App.initContract();
  },

  initContract: function() {
    $.getJSON('KuniLord.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var kuniLordArtifact = data;
      var kuniLordContract = web3.eth.contract(kuniLordArtifact);

      App.contracts.kuniLordInstance = kuniLordContract.at("0x913ca0577cdc5e14e4019cd3e5fb9d1cc8ca99e4")
    
      // Set the provider for our contract
      // App.contracts.KuniLord.setProvider(App.web3Provider);
    });
  },

  buyKuni: function(event) {
    console.log(event.target)
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
