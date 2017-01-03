'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DEFAULT_MIN_GAS = 21000;
var DEFAULT_ADDITIONAL_GAS = 10000;
var DEFAULT_WAIT_CHECK_INTERVAL = 1200;
var DEFAULT_TIMEOUT = undefined;

var Transaction = function () {
    function Transaction(web3, obj) {
        _classCallCheck(this, Transaction);

        this.web3 = web3;
        this.obj = obj;
    }

    /**
     * Send transaction with a likely-to-be correct gas value *Automatically*
     *
     * @param additionalGas amount of additional gas to avoid underestimating the amount of gas
     * @param minGas the minimum gas for the transaction
     */


    _createClass(Transaction, [{
        key: 'autoGas',
        value: function autoGas(minGas, additionalGas) {
            minGas = minGas || DEFAULT_MIN_GAS;
            additionalGas = additionalGas || DEFAULT_ADDITIONAL_GAS;
            this.prop_autoGas = new AutoGas(minGas, additionalGas);

            return this;
        }

        // TODO: Test this

    }, {
        key: 'waitForConfirmation',
        value: function waitForConfirmation(callback, timeout, checkInterval) {
            this.prop_waitForConfirmation = new WaitConfirmation.apply(arguments);
            return this;
        }
    }, {
        key: 'send',
        value: function send() {
            var _this = this;

            var args = Array.from(arguments);

            var transactionOptionPos = void 0;

            if (typeof args[args.length - 1] === 'function') {
                transactionOptionPos = args.length - 2;
            } else {
                transactionOptionPos = args.length - 1;
            }

            console.log(args);

            if (typeof this.prop_autoGas !== 'undefined') {
                args[transactionOptionPos].gas = undefined; // Manually remove the gas to avoid if there's any

                //noinspection JSUnresolvedVariable
                var estimatedGas = this.obj.estimateGas.apply(this, eliminateCallback(args));

                //noinspection JSUnresolvedFunction
                args[transactionOptionPos].gas = this.web3.toHex(Math.max(estimatedGas + this.prop_autoGas.additionalGas, this.prop_autoGas.minGas));
            }

            if (typeof this.prop_testFunction !== 'undefined') {
                this.testFunction.apply(this, [this.prop_testFunction.expectValue].concat(args));
            }

            //noinspection JSUnresolvedVariable
            var transactionHash = this.obj.sendTransaction.apply(this, args);

            if (typeof this.prop_waitForConfirmation !== 'undefined') {
                var intervalId;

                (function () {

                    var timeoutCheckId = setTimeout(function () {
                        throw 'Transaction wait timed out';
                    }, _this.prop_waitForConfirmation.timeout);

                    intervalId = setInterval(function () {
                        if (_this.web3.getTransaction(transactionHash) !== null) {
                            clearTimeout(timeoutCheckId);
                            clearInterval(intervalId);
                            _this.prop_waitForConfirmation.callback.apply(undefined, transactionHash, _this.prop_waitForConfirmation.callArgs);
                        }
                    }, _this.prop_waitForConfirmation.interval);
                })();
            }

            return transactionHash;
        }

        /**
         * Test to see whether the function will return the result we want locally
         * @param expectValue the value we expect function to return
         */

    }, {
        key: 'testFunction',
        value: function testFunction(expectValue) {
            if (this.obj.call.apply(this, eliminateCallback(Array.from(arguments).slice(1))) !== expectValue) {
                console.log(eliminateCallback(Array.from(arguments).slice(1)));
                throw 'Contract function call fails when testing the function';
            }
            return this;
        }
    }, {
        key: 'testFunctionBeforeSend',
        value: function testFunctionBeforeSend(expectValue) {
            this.prop_testFunction = new TestFunction(expectValue);
            return this;
        }
    }]);

    return Transaction;
}();

function eliminateCallback(args) {
    return typeof args[args.length - 1] === 'function' ? args.slice(0, args.length - 1) : args;
}

var TestFunction = function TestFunction(expectValue) {
    _classCallCheck(this, TestFunction);

    this.expectValue = expectValue;
};

var AutoGas = function AutoGas(minGas, additionalGas) {
    _classCallCheck(this, AutoGas);

    this.minGas = minGas;
    this.additionalGas = additionalGas;
};

var WaitConfirmation = function WaitConfirmation(callback, timeout, checkInterval) {
    _classCallCheck(this, WaitConfirmation);

    this.callback = callback;
    this.timeout = timeout || DEFAULT_TIMEOUT;
    this.interval = checkInterval || DEFAULT_WAIT_CHECK_INTERVAL;
    this.callArgs = Array.from(arguments).slice(3);
};

exports.Transaction = Transaction;
exports.DEFAULT_MIN_GAS = DEFAULT_MIN_GAS;
exports.DEFAULT_ADDITIONAL_GAS = DEFAULT_ADDITIONAL_GAS;
//# sourceMappingURL=index.js.map