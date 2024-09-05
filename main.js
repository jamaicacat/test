"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var PaymentEventsGenerator_1 = require("./PaymentEventsGenerator");
var PaymentNotificationService_1 = require("./PaymentNotificationService");
var PAYMENT_STATUS;
(function (PAYMENT_STATUS) {
    PAYMENT_STATUS["PROCESSING"] = "processing";
    PAYMENT_STATUS["SUCCESS"] = "success";
    PAYMENT_STATUS["AUTHORIZED"] = "authorized";
    PAYMENT_STATUS["DECLINED"] = "declined";
    PAYMENT_STATUS["UNKNOWN_STATUS"] = "unknown_status";
})(PAYMENT_STATUS || (PAYMENT_STATUS = {}));
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var paymentEventsGenerator, notificationService, paymentEvents, processEvent, updateStatus, paymentRecords;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                paymentEventsGenerator = new PaymentEventsGenerator_1.PaymentEventsGenerator();
                notificationService = new PaymentNotificationService_1.PaymentNotificationService();
                paymentEvents = new Map();
                processEvent = function (_a) {
                    var paymentId = _a.paymentId, eventName = _a.eventName;
                    var paymentRecord = paymentEvents.get(paymentId);
                    if (!paymentRecord) {
                        paymentRecord = {
                            paymentId: paymentId,
                            status: null,
                            isAuthorized: false,
                            isSuccessfull: false,
                        };
                        paymentEvents.set(paymentId, paymentRecord);
                    }
                    var currStatus = paymentRecord.status;
                    switch (eventName) {
                        case PAYMENT_STATUS.AUTHORIZED:
                            updateStatus(paymentRecord, PAYMENT_STATUS.AUTHORIZED);
                            break;
                        case PAYMENT_STATUS.SUCCESS:
                            updateStatus(paymentRecord, PAYMENT_STATUS.SUCCESS);
                            break;
                        case PAYMENT_STATUS.PROCESSING:
                            if (currStatus === null ||
                                currStatus === PAYMENT_STATUS.UNKNOWN_STATUS) {
                                updateStatus(paymentRecord, PAYMENT_STATUS.PROCESSING);
                            }
                            break;
                        case PAYMENT_STATUS.DECLINED:
                            updateStatus(paymentRecord, PAYMENT_STATUS.DECLINED);
                            break;
                        default:
                            updateStatus(paymentRecord, PAYMENT_STATUS.UNKNOWN_STATUS);
                            break;
                    }
                };
                updateStatus = function (paymentRecord, newStatus) {
                    var currStatus = paymentRecord.status;
                    if (currStatus === PAYMENT_STATUS.DECLINED ||
                        currStatus === PAYMENT_STATUS.SUCCESS) {
                        // 9
                        if (newStatus !== PAYMENT_STATUS.DECLINED &&
                            newStatus !== PAYMENT_STATUS.SUCCESS)
                            return;
                    }
                    // 2
                    if (newStatus === PAYMENT_STATUS.AUTHORIZED) {
                        paymentRecord.isAuthorized = true;
                    }
                    if (newStatus === PAYMENT_STATUS.SUCCESS) {
                        paymentRecord.isSuccessfull = true;
                    }
                    if (paymentRecord.status === null && newStatus === PAYMENT_STATUS.SUCCESS) {
                        newStatus = PAYMENT_STATUS.UNKNOWN_STATUS;
                    }
                    if (paymentRecord.isAuthorized &&
                        paymentRecord.isSuccessfull &&
                        newStatus !== PAYMENT_STATUS.DECLINED) {
                        newStatus = PAYMENT_STATUS.SUCCESS;
                    }
                    // 11
                    if (newStatus === PAYMENT_STATUS.UNKNOWN_STATUS && currStatus !== null)
                        return;
                    paymentRecord.status = newStatus;
                    // 7
                    if (newStatus === PAYMENT_STATUS.SUCCESS ||
                        newStatus === PAYMENT_STATUS.DECLINED) {
                        // 8
                        if (paymentRecord.status === PAYMENT_STATUS.SUCCESS ||
                            paymentRecord.status === PAYMENT_STATUS.DECLINED) {
                            paymentRecord.status = newStatus;
                        }
                        notificationService.sendNotification(paymentRecord.paymentId, newStatus);
                    }
                };
                paymentEventsGenerator.on('payment-event', processEvent);
                paymentEventsGenerator.startEventGeneration();
                return [4 /*yield*/, paymentEventsGenerator.waitForEventGeneratorStopped()
                    /**
                     * Fill in paymentRecords variable with payment records processed
                     */
                ];
            case 1:
                _a.sent();
                paymentRecords = Array.from(paymentEvents.values()).map(function (record) {
                    return { paymentId: record.paymentId, status: record.status };
                });
                console.log('final', paymentRecords);
                return [2 /*return*/];
        }
    });
}); };
main();
