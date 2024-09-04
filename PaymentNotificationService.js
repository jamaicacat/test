"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentNotificationService = void 0;
var PaymentNotificationService = /** @class */ (function () {
    function PaymentNotificationService() {
        this._notifs = [];
    }
    PaymentNotificationService.prototype.sendNotification = function (paymentId, paymentStatus) {
        this._notifs.push({ paymentId: paymentId, paymentStatus: paymentStatus });
    };
    return PaymentNotificationService;
}());
exports.PaymentNotificationService = PaymentNotificationService;
