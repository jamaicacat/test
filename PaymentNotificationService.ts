export class PaymentNotificationService {
	private _notifs: { paymentId: string; paymentStatus: string }[] = []

	sendNotification(paymentId: string, paymentStatus: string) {
		this._notifs.push({ paymentId, paymentStatus })
	}
}
