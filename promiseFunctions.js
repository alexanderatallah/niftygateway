import {AbiCoder} from 'web3-eth-abi';
import * as Utils from 'web3-utils';

import messagePopUpWindow from './window/windowFunctions.js';
import {castArg, prepareArgs,
retrieveCurrentABIFromEndpoint, locateJSONInterface,
checkForDisplayInfoReplaceDefaults, generateJSONInterfaceFromSig,
testAndCleanTransactionObject,testAndCleanPurchaseForObject,
testAndCleanOpenSeaObject} from './validationFunctions.js'

import {niftyGatewayOrigin, niftyGatewayRinkebyOrigin,niftyGatewayRinkebyOriginNewNew} from './util/config.js';

const abiCoder = new AbiCoder();

export function getWalletAndEmailAddressPromise(_this) {
    // url to open
    var url = niftyGatewayOrigin + '/#/loginwithniftygateway/'

    if (_this.network == 'rinkeby') {

      var url = niftyGatewayRinkebyOrigin + '/#/loginwithniftygateway/'


    }
    var timestampOriginal = new Date();
    var timestampInUnixTime = timestampOriginal.getTime();

    var popup = window.open(url,timestampInUnixTime,'width=500,height=800');
    // message Nifty Gateway so it can store this window location
    var counter = 0
    var seconds_interval = 1500
    var number_of_times = 30
    var authInfo = {
      network: _this.network,
      authKey: _this.auth_key
    }
    window.messageConfirmed = false
    //messaging is recursive
    window.messagePopUpWindow(popup, counter, number_of_times, seconds_interval, authInfo);
    //once contact has been made, wait for wallet info to be returned
    var promise1 = new Promise(function(resolve, reject) {
      window.addEventListener("message", function(event) {
        if (checkEventOrigin(event.origin) == false)
          return;
        if (event.data.msg_id == "confirmation") {
          window.messageConfirmed = true
          return;
        }
        if (event.data.msg_id == 'wallet') {

          var wallet_info = {
            didSucceed: event.data.didSucceed,
            emailAddress: event.data.emailAddress,
            walletAddress: event.data.walletAddress}
          }
          resolve(wallet_info);
      }, false);
    });
    return(promise1);
  }

export function createRegularTransactionPromise(regularTransactionObject, _this) {
  return new Promise(function(resolve,reject) {
     regularTransactionObject.network = _this.network
     regularTransactionObject.authKey = _this.auth_key
     var ret = testAndCleanTransactionObject(regularTransactionObject)
     if (ret.isValid == false) {
       reject(ret.errorsList);
     }
     //get url
     var url = niftyGatewayOrigin + '/#/tx'
     if (_this.network == 'rinkeby') {


      url = niftyGatewayRinkebyOrigin + '/#/tx/'




     }
     var timestampOriginal = new Date();
     var timestampInUnixTime = timestampOriginal.getTime();
     var popup = window.open(url,timestampInUnixTime,'width=400,height=800');
     // message Nifty Gateway with purchase object
     var counter = 0
     var seconds_interval = 1500
     var number_of_times = 10
     window.messageConfirmedPurchaseObj = false
     //messaging is recursive
     window.messagePopUpWindowWithRegularTxObject(popup, counter, number_of_times, seconds_interval, regularTransactionObject);
     //once contact has been made, wait for res to be returned
      window.addEventListener("message", function(event) {
         if (checkEventOrigin(event.origin) == false) {
           return;
         }
         if (event.data.msg_id == 'tx_res') {
           var info = event.data.response;
           resolve(info);
         }
      });
  });
}

export function createOpenSeaPromise(openSeaObject, _this) {
  return new Promise(function(resolve, reject) {
    openSeaObject.network = _this.network
    openSeaObject.authKey = _this.auth_key
    openSeaObject.isOpenSea = true
    //test and clean
    var ret = testAndCleanOpenSeaObject(openSeaObject)
    console.log(ret)
    if (ret.isValid == false) {
      reject(ret.errorsList);
      return;
    }
    // url to open
    var url = niftyGatewayOrigin + '/#/purchase'

    var url = 'http://localhost:3001/#/purchase' //delete this

    if (_this.network == 'rinkeby') {
      url = 'https://rinkeby.niftygateway.com/#/purchase';


    }
    var timestampOriginal = new Date();
    var timestampInUnixTime = timestampOriginal.getTime();
    var popup = window.open(url,timestampInUnixTime,'width=400,height=800');
    // message Nifty Gateway so it can store this window location
    var counter = 0
    var seconds_interval = 1500
    var number_of_times = 10
    window.messageConfirmedPurchaseObj = false
    //messaging is recursive
    window.messagePopUpWindowWithPurchaseForObject(popup, counter, number_of_times, seconds_interval, openSeaObject);
    //once contact has been made, wait for wallet info to be returned
    window.addEventListener("message", function(event) {
        if (checkEventOrigin(event.origin) == false) {
          return;
        }
        console.log('after event check')
        if (event.data.msg_id == 'purchase_res') {
          var info = event.data.response
          var info_res = {
            didSucceed: event.data.didSucceed,
            transactionURL: event.data.transactionURL
          }
          console.log(event)
          resolve(info_res);
        }
      });
  });
}

export function createPurchaseForPromise(purchaseForObject, _this) {
 return new Promise(function(resolve, reject) {
   purchaseForObject.network = _this.network
   purchaseForObject.authKey = _this.auth_key
   //test and clean
   var ret = testAndCleanPurchaseForObject(purchaseForObject)
   console.log(ret)
   if (ret.isValid == false) {
     reject(ret.errorsList);
     return;
   }
   // url to open
   var url = niftyGatewayOrigin + '/#/purchase'




   if (_this.network == 'rinkeby') {
     url = niftyGatewayRinkebyOrigin + '/#/purchase/'


   }
   var timestampOriginal = new Date();
   var timestampInUnixTime = timestampOriginal.getTime();
   var popup = window.open(url,timestampInUnixTime,'width=400,height=800');
   // message Nifty Gateway so it can store this window location
   var counter = 0
   var seconds_interval = 1500
   var number_of_times = 10
   window.messageConfirmedPurchaseObj = false
   //messaging is recursive
   window.messagePopUpWindowWithPurchaseForObject(popup, counter, number_of_times, seconds_interval, purchaseForObject);
   //once contact has been made, wait for wallet info to be returned
   window.addEventListener("message", function(event) {
       if (checkEventOrigin(event.origin) == false) {
         return;
       }
       console.log('after event check')
       if (event.data.msg_id == 'purchase_res') {
         var info = event.data.response
         var info_res = {
           didSucceed: event.data.didSucceed,
           transactionURL: event.data.transactionURL
         }
         console.log(event)
         resolve(info_res);
       }
     });
 });
}

function checkEventOrigin(origin) {
  console.log(origin, "given origin")
  console.log(niftyGatewayRinkebyOrigin, "rinkeby")
  console.log(origin==niftyGatewayRinkebyOrigin)
  if (origin == "http://localhost:3001" | origin == niftyGatewayOrigin | origin == niftyGatewayRinkebyOrigin) {
    return true
  } else {
    return false
  }
}
