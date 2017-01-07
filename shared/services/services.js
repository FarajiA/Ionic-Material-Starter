﻿; (function () {
    angular.module('App')
        .factory('UserStore', ['$http', '$q', function ($http, $q) {
    var data = [];
    var UserObject = {};

    UserObject.setUser = function () {
        var deffered = $q.defer();
        $http.get(baseURL_CONSTANT + "api/accounts/user/")
        .success(function (d) {
            data = d.result;
            deffered.resolve(d.result);
        })
        .error(function (data, status) {
            deffered.reject(data);
            console.log("Request failed " + status);
        });
        return deffered.promise;
    };

    UserObject.getUser = function (user) {
        var deffered = $q.defer();
        data = user;
        deffered.resolve(data);
        return deffered.promise;
    };

    UserObject.data = function () { return data; };
    return UserObject;
}])
   .factory('CentralHub', ['$q', '$rootScope', 'AuthService', function ($q, $rootScope, AuthService) {
    var proxy = null;

    var initialize = function (hubName) {
        var connection = $.hubConnection(signalRURL_CONSTANT, { useDefaultPath: false });
        connection.qs = { 'bearer_token': AuthService.authentication.token };

        proxy = connection.createHubProxy(hubName);

        proxy.on('notificationReceived', function (userName, type) {
            var notification = {
                username: userName,
                type: type
            };
            $rootScope.$emit("centralHubNotification", notification);
        });

        proxy.on('receiveMessage', function (message) {
            $rootScope.$emit("centralHubMessage", message);
        });

        connection.start({ jsonp: true }).done(function (response) {
            console.log("Connection complete");
        });

        connection.disconnected(function () {
            console.log('Connection closed. Retrying...');
            setTimeout(function () { connection.start({ jsonp: true }); }, 5000);
        });

        return proxy;
    };

    //var joinBroadcastGroup

    var joinbroadcast = function (proxyConnection, username) {
        var deffered = $q.defer();
        proxyConnection.invoke('JoinBroadcastGroup', username).done(function (result) {
            deffered.resolve(result);
        });
        return deffered.promise;
    };

    var streamBroadcast = function (proxyConnection) {        
        proxyConnection.on('receiveBroadcast', function (coords) {
            $rootScope.$emit("centralHubBroadcast", coords);
        });
    };

    return {
        initialize: initialize,
        joinbroadcast: joinbroadcast,
        streamBroadcast: streamBroadcast
    };

   }])
     .factory('Encryption', ['$http', '$q', 'localStorageService', 'AuthService', 'UserStore', function ($http, $q, localStorageService, AuthService, UserStore) {
         var EncryptionObject = this;

         var keys = [];
         var Bits = 512;

         //escape the string then encode function
         function Base64Encode(str) {
             return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
                 return String.fromCharCode('0x' + p1);
             }));
         }

         //decode the base64 string
         function Base64Decode(str) {
             return decodeURIComponent(Array.prototype.map.call(atob(str), function (c) {
                 return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
             }).join(''));
         }
         
         EncryptionObject.Key = {
             privateKey: "",
             publicKey: ""
         };

         EncryptionObject.fillKeyData = function () {
             var keyData = localStorageService.get('KeyData');
             if (!_.isEmpty(keyData)) {
                 EncryptionObject.Key.privateKey = cryptico.generateRSAKey(Base64Decode(keyData.privateKey), Bits);
                 EncryptionObject.Key.publicKey = keyData.publicKey;
                 keys.push(EncryptionObject.Key.publicKey);
             }
         };

         EncryptionObject.generatePrivateKey = function (passphrase) {
             var deffered = $q.defer();
             var RSAkey = cryptico.generateRSAKey(passphrase, Bits);
             var publicKey = cryptico.publicKeyString(RSAkey);

             if (!_.isEmpty(EncryptionObject.Key.publicKey)) {
                 EncryptionObject.Key.privateKey = RSAkey;
                 localStorageService.set('KeyData', { privateKey: Base64Encode(passphrase), publicKey: publicKey });
                 deffered.resolve(true);
             }
             else {
                 var msg = { 'key': publicKey };
                 $http.post(baseURL_CONSTANT + 'api/accounts/user/publickey', msg).success(function (response) {
                     EncryptionObject.Key.privateKey = RSAkey;
                     localStorageService.set('KeyData', { privateKey: Base64Encode(passphrase), publicKey: publicKey });
                     deffered.resolve(response);
                 }).error(function (err, status) {
                     deffered.reject(err);
                 });
             }

             return deffered.promise;
         };

         EncryptionObject.Encrypt = function (msgObject) {
             var deffered = $q.defer();
             var encrypted = cryptico.encrypt(msgObject.msg, msgObject.key, EncryptionObject.Key.privateKey);
             var object = {
                 'id': msgObject.id,
                 'key': msgObject.key,
                 'msg': encrypted.cipher
             };
             deffered.resolve(object);
             return deffered.promise;
         };

         EncryptionObject.Decrypt = function (msgEncrypted) {
             var deffered = $q.defer();
             var decrypted = cryptico.decrypt(msgEncrypted, EncryptionObject.Key.privateKey);
             deffered.resolve(decrypted.plaintext);
             return deffered.promise;
         };

         EncryptionObject.userPublicKey = function (userID) {
             var deffered = $q.defer();
             $http.get(baseURL_CONSTANT + 'api/accounts/user/publickey/' + userID).success(function (response) {
                 deffered.resolve(response);
             }).error(function (err, status) {
                 deffered.reject(err);
             });

             return deffered.promise;
         };

         EncryptionObject.verifyPassphrase = function (passphrase) {
             var deffered = $q.defer();

             var RSAkey = cryptico.generateRSAKey(passphrase, Bits);
             var publicKey = cryptico.publicKeyString(RSAkey);

             if (_.isEqual(publicKey, this.Key.publicKey))
                 deffered.resolve(true);
             else
                 deffered.resolve(false);

             return deffered.promise;
         };
         
         EncryptionObject.ActiveKeys = function () { return keys; };
         return EncryptionObject;
     }]).factory('ShareLink', [function () {
         var link = [];
         var Object = {};

         Object.setLink = function (Link){
             link = Link;
         };

         Object.getLink = function () { return link; };
         return Object;
     }]);
})();