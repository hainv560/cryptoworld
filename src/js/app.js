App = {
  web3Provider: null,
  contracts: {},
  network: '',

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
    App.network = App.getNetwork();
    return App.initContract();
  },

  initContract: function() {
    $.getJSON('KuniLord.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var kuniLordArtifact = data;
      var kuniLordContract = web3.eth.contract(kuniLordArtifact);

      App.contracts.kuniLordInstance = kuniLordContract.at("0x03d769b962efbf5f4844c161c809c41edaf3ab57")
    
      // Set the provider for our contract
      // App.contracts.KuniLord.setProvider(App.web3Provider);
      $(document).on('click', '.buy-kuni', App.buyKuni);
      $(document).on('click', '#change-nick', App.setNickname);
      return App.getNickname();
    });
  },

  getNetwork() {
    web3.version.getNetwork((err, netId) => {
      switch (netId) {
        case "1":
          console.log('This is mainnet')
          return 'mainnet'
          break
        case "2":
          console.log('This is the deprecated Morden test network.')
          break
        case "3":
          console.log('This is the ropsten test network.')
          return 'ropsten'
          break
        case "4":
        console.log('This is the rinkeby test network.')
        return 'rinkeby'
        break
        default:
          console.log('This is an unknown network.')
          return 'Unknown network or metamask is disabled now'
      }
    })
  },

  buyKuni: function(event) {
    var nation = $('.cur-name')[0].textContent;
    var price = $('.cur-price')[0].value.split(' ')[0];
    var network = App.network == 'ropsten' ? 'ropsten' : ''
    var inputPrice = web3.toBigNumber(price);
    var currentPrice = web3.toWei(inputPrice, 'gwei');
    $("#loading").show();
    App.contracts.kuniLordInstance.occupy(web3.fromAscii(nation), {
      value: web3.fromWei(currentPrice, 'gwei')
    }, function(err, res) {
      $("#loading").hide();
      if (err) {
        console.log('Error when call blockchain ', err)
        $('.alert-danger').append(err);
        $('.alert-danger').show();
      } else {
        var txUrl = 'https://' + network + 'etherscan.io/tx/' + res;
        console.log('Call to blockchain success: ', res)
        $('.alert-success').append('<a href="' + txUrl + '">' + txUrl + '</a>');
        $('.alert-success').show();  
      }
    })
  }, 

  setNickname: function(event) {
    var nickname = $('.new-nickname')[0].value;
    if (nickname == "") return;
    var network = App.network == 'ropsten' ? 'ropsten' : ''
    $("#loading").show();
    App.contracts.kuniLordInstance.setNickname(web3.fromAscii(nickname), function(err, res) {
      $("#loading").hide();
      if (err) {
        console.log('Error when call blockchain ', err)
        $('.alert-danger').append(err);
        $('.alert-danger').show();
      } else {
        var txUrl = 'https://' + network + 'etherscan.io/tx/' + res;
        console.log('Call to blockchain success: ', res)
        $('.alert-success').append('<a href="' + txUrl + '">' + txUrl + '</a>');
        $('.alert-success').show();  
      }
    })
    App.getNickname();
  },

  getNickname: function() {
    $("#loading").show();
    App.contracts.kuniLordInstance.getNickname(function(err, res) {
      $("#loading").hide();
      if (err) {
        console.log('Error when call blockchain ', err)
        // $('.alert-danger').append(err);
        // $('.alert-danger').show();
      } else {
        console.log('Call to blockchain success: ', res)
        // $('.alert-success').append('<a href="https://etherscan.io/tx/"' + res + '">https://etherscan.io/tx/' + res + '</a>');
        // $('.alert-success').show();
      }
      $('#nickname').text(web3.toAscii(res));
    })
  }
};

$(function() {
  $(window).load(function() {
    App.init();
    $('#wallet-addr').text(web3.eth.accounts[0]);
    $(document).on('click', '#nickname', function() {
      $("#set-nickname").show();
    })
    $(document).ready(function(){
      $(document).ajaxStart(function() {
        $("#loading").show();
      });
      $(document).ajaxStop(function() {
        $("#loading").hide();
      });
    });
  });
});
