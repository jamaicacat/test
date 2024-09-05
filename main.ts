import { PaymentEventsGenerator, PaymentStatus } from './PaymentEventsGenerator'
import { PaymentNotificationService } from './PaymentNotificationService'

interface PaymentRecord {
	paymentId: string
	status: PaymentStatus
}

interface PaymentEvent extends PaymentRecord {
	isAuthorized: boolean
	isSuccessfull: boolean
}

enum PAYMENT_STATUS {
	PROCESSING = 'processing',
	SUCCESS = 'success',
	AUTHORIZED = 'authorized',
	DECLINED = 'declined',
	UNKNOWN_STATUS = 'unknown_status',
}

const main = async () => {
	const paymentEventsGenerator = new PaymentEventsGenerator()
	const notificationService = new PaymentNotificationService()
	/**
	 * Add handler for 'payment-event' here before starting events generation
	 */
	const paymentEvents: Map<string, PaymentEvent> = new Map()

	const processEvent = ({ paymentId, eventName }) => {
		let paymentRecord = paymentEvents.get(paymentId)

		if (!paymentRecord) {
			paymentRecord = {
				paymentId,
				status: null,
				isAuthorized: false,
				isSuccessfull: false,
			}
			paymentEvents.set(paymentId, paymentRecord)
		}

		const currStatus = paymentRecord.status

		switch (eventName) {
			case PAYMENT_STATUS.AUTHORIZED:
				updateStatus(paymentRecord, PAYMENT_STATUS.AUTHORIZED)
				break
			case PAYMENT_STATUS.SUCCESS:
				updateStatus(paymentRecord, PAYMENT_STATUS.SUCCESS)
				break
			case PAYMENT_STATUS.PROCESSING:
				if (
					currStatus === null ||
					currStatus === PAYMENT_STATUS.UNKNOWN_STATUS
				) {
					updateStatus(paymentRecord, PAYMENT_STATUS.PROCESSING)
				}
				break
			case PAYMENT_STATUS.DECLINED:
				updateStatus(paymentRecord, PAYMENT_STATUS.DECLINED)
				break
			default:
				updateStatus(paymentRecord, PAYMENT_STATUS.UNKNOWN_STATUS)
				break
		}
	}

	const updateStatus = (
		paymentRecord: PaymentEvent,
		newStatus: PaymentStatus,
	) => {
		const currStatus = paymentRecord.status

		if (
			currStatus === PAYMENT_STATUS.DECLINED ||
			currStatus === PAYMENT_STATUS.SUCCESS
		) {
			// 9
			if (
				newStatus !== PAYMENT_STATUS.DECLINED &&
				newStatus !== PAYMENT_STATUS.SUCCESS
			)
				return
		}

		// 2
		if (newStatus === PAYMENT_STATUS.AUTHORIZED) {
			paymentRecord.isAuthorized = true
		}
		if (newStatus === PAYMENT_STATUS.SUCCESS) {
			paymentRecord.isSuccessfull = true
		}

		if (paymentRecord.status === null && newStatus === PAYMENT_STATUS.SUCCESS) {
			newStatus = PAYMENT_STATUS.UNKNOWN_STATUS
		}

		if (
			paymentRecord.isAuthorized &&
			paymentRecord.isSuccessfull &&
			newStatus !== PAYMENT_STATUS.DECLINED
		) {
			newStatus = PAYMENT_STATUS.SUCCESS
		}

		// 11
		if (newStatus === PAYMENT_STATUS.UNKNOWN_STATUS && currStatus !== null)
			return

		paymentRecord.status = newStatus

		// 7
		if (
			newStatus === PAYMENT_STATUS.SUCCESS ||
			newStatus === PAYMENT_STATUS.DECLINED
		) {
			// 8
			if (
				paymentRecord.status === PAYMENT_STATUS.SUCCESS ||
				paymentRecord.status === PAYMENT_STATUS.DECLINED
			) {
				paymentRecord.status = newStatus
			}

			notificationService.sendNotification(paymentRecord.paymentId, newStatus)
		}
	}

	paymentEventsGenerator.on('payment-event', processEvent)

	paymentEventsGenerator.startEventGeneration()
	await paymentEventsGenerator.waitForEventGeneratorStopped()
	/**
	 * Fill in paymentRecords variable with payment records processed
	 */

	const paymentRecords: Array<PaymentRecord> = Array.from(
		paymentEvents.values(),
	).map((record) => {
		return { paymentId: record.paymentId, status: record.status }
	})
	console.log('final', paymentRecords)
}

main()
