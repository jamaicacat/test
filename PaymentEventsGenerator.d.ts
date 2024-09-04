/// <reference types="node" />
import { EventEmitter } from 'node:events'
export type PaymentEventName =
	| 'processing'
	| 'success'
	| 'authorized'
	| 'declined'
	| 'mastercard_processing_4850'
	| 'amex_processing_p04'
export type PaymentStatus =
	| Exclude<
			PaymentEventName,
			'mastercard_processing_4850' | 'amex_processing_p04'
	  >
	| 'unknown_status'
	| null
export type PaymentEventPayload = Record<
	'payment-event',
	{
		paymentId: string
		eventName: PaymentEventName
	}
>
export declare class PaymentEventsGenerator extends EventEmitter {
	private _isRunning
	private readonly _payments
	private _paymentsProcessedTracking
	private selectNextRandomPaymentIdx
	private runEventLoop
	startEventGeneration(): void
	stopEventGeneration(): void
	waitForEventGeneratorStopped(): Promise<void>
}
