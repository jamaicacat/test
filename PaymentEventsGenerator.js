'use strict'
var __extends =
		(this && this.__extends) ||
		(function () {
			var e = function (t, n) {
				return (e =
					Object.setPrototypeOf ||
					({ __proto__: [] } instanceof Array &&
						function (e, t) {
							e.__proto__ = t
						}) ||
					function (e, t) {
						for (var n in t)
							Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
					})(t, n)
			}
			return function (t, n) {
				if ('function' != typeof n && null !== n)
					throw TypeError(
						'Class extends value ' +
							String(n) +
							' is not a constructor or null',
					)
				function s() {
					this.constructor = t
				}
				e(t, n),
					(t.prototype =
						null === n
							? Object.create(n)
							: ((s.prototype = n.prototype), new s()))
			}
		})(),
	__assign =
		(this && this.__assign) ||
		function () {
			return (__assign =
				Object.assign ||
				function (e) {
					for (var t, n = 1, s = arguments.length; n < s; n++)
						for (var r in (t = arguments[n]))
							Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r])
					return e
				}).apply(this, arguments)
		},
	__awaiter =
		(this && this.__awaiter) ||
		function (e, t, n, s) {
			return new (n || (n = Promise))(function (r, o) {
				function i(e) {
					try {
						c(s.next(e))
					} catch (t) {
						o(t)
					}
				}
				function a(e) {
					try {
						c(s.throw(e))
					} catch (t) {
						o(t)
					}
				}
				function c(e) {
					var t
					e.done
						? r(e.value)
						: ((t = e.value) instanceof n
								? t
								: new n(function (e) {
										e(t)
								  })
						  ).then(i, a)
				}
				c((s = s.apply(e, t || [])).next())
			})
		},
	__generator =
		(this && this.__generator) ||
		function (e, t) {
			var n,
				s,
				r,
				o,
				i = {
					label: 0,
					sent: function () {
						if (1 & r[0]) throw r[1]
						return r[1]
					},
					trys: [],
					ops: [],
				}
			return (
				(o = { next: a(0), throw: a(1), return: a(2) }),
				'function' == typeof Symbol &&
					(o[Symbol.iterator] = function () {
						return this
					}),
				o
			)
			function a(a) {
				return function (c) {
					return (function a(c) {
						if (n) throw TypeError('Generator is already executing.')
						for (; o && ((o = 0), c[0] && (i = 0)), i; )
							try {
								if (
									((n = 1),
									s &&
										(r =
											2 & c[0]
												? s.return
												: c[0]
												? s.throw || ((r = s.return) && r.call(s), 0)
												: s.next) &&
										!(r = r.call(s, c[1])).done)
								)
									return r
								switch (((s = 0), r && (c = [2 & c[0], r.value]), c[0])) {
									case 0:
									case 1:
										r = c
										break
									case 4:
										return i.label++, { value: c[1], done: !1 }
									case 5:
										i.label++, (s = c[1]), (c = [0])
										continue
									case 7:
										;(c = i.ops.pop()), i.trys.pop()
										continue
									default:
										if (
											!(r = (r = i.trys).length > 0 && r[r.length - 1]) &&
											(6 === c[0] || 2 === c[0])
										) {
											i = 0
											continue
										}
										if (3 === c[0] && (!r || (c[1] > r[0] && c[1] < r[3]))) {
											i.label = c[1]
											break
										}
										if (6 === c[0] && i.label < r[1]) {
											;(i.label = r[1]), (r = c)
											break
										}
										if (r && i.label < r[2]) {
											;(i.label = r[2]), i.ops.push(c)
											break
										}
										r[2] && i.ops.pop(), i.trys.pop()
										continue
								}
								c = t.call(e, i)
							} catch (u) {
								;(c = [6, u]), (s = 0)
							} finally {
								n = r = 0
							}
						if (5 & c[0]) throw c[1]
						return { value: c[0] ? c[1] : void 0, done: !0 }
					})([a, c])
				}
			}
		}
Object.defineProperty(exports, '__esModule', { value: !0 }),
	(exports.PaymentEventsGenerator = void 0)
var node_events_1 = require('node:events'),
	crypto_1 = require('crypto'),
	PREDEFINED_PAYMENT_SEQUENCES = [
		{ seqId: 1, seq: ['authorized', 'processing', 'success'] },
		{ seqId: 2, seq: ['success', 'authorized'] },
		{ seqId: 3, seq: ['authorized', 'success', 'processing', 'authorized'] },
		{ seqId: 4, seq: ['success', 'processing', 'authorized'] },
		{
			seqId: 5,
			seq: ['authorized', 'processing', 'success', 'declined', 'success'],
		},
		{
			seqId: 6,
			seq: [
				'authorized',
				'processing',
				'success',
				'declined',
				'success',
				'mastercard_processing_4850',
			],
		},
		{ seqId: 7, seq: ['success'] },
		{ seqId: 8, seq: ['authorized', 'processing', 'success', 'declined'] },
		{ seqId: 9, seq: ['processing', 'declined'] },
		{ seqId: 10, seq: ['authorized', 'declined', 'processing'] },
		{ seqId: 11, seq: ['declined'] },
		{ seqId: 12, seq: ['authorized', 'processing'] },
		{ seqId: 13, seq: ['authorized'] },
		{ seqId: 14, seq: ['processing'] },
		{ seqId: 15, seq: ['amex_processing_p04'] },
		{ seqId: 16, seq: ['authorized', 'mastercard_processing_4850'] },
		{ seqId: 17, seq: ['processing', 'amex_processing_p04'] },
	],
	PaymentEventsGenerator = (function (e) {
		function t() {
			var t = (null !== e && e.apply(this, arguments)) || this
			return (
				(t._isRunning = !1),
				(t._payments = PREDEFINED_PAYMENT_SEQUENCES.map(function (e) {
					return __assign({ id: (0, crypto_1.randomUUID)(), seqIdx: 0 }, e)
				})),
				(t._paymentsProcessedTracking = 0),
				t
			)
		}
		return (
			__extends(t, e),
			(t.prototype.selectNextRandomPaymentIdx = function () {
				for (;;) {
					var e = Math.trunc(this._payments.length * Math.random())
					if (this._payments[e].seqIdx < this._payments[e].seq.length) return e
				}
			}),
			(t.prototype.runEventLoop = function () {
				return __awaiter(this, void 0, void 0, function () {
					var e, t, n
					return __generator(this, function (s) {
						switch (s.label) {
							case 0:
								if (!this._isRunning) return [3, 2]
								return (
									(e = this.selectNextRandomPaymentIdx()),
									(n = (t = this._payments[e]).seq[t.seqIdx]),
									t.seqIdx++,
									t.seqIdx >= t.seq.length && this._paymentsProcessedTracking++,
									this.emit('payment-event', { paymentId: t.id, eventName: n }),
									[
										4,
										new Promise(function (e) {
											return setTimeout(e, 200 + 300 * Math.random())
										}),
									]
								)
							case 1:
								return (
									s.sent(),
									this._paymentsProcessedTracking >= this._payments.length &&
										(console.log('PaymentEventsGenerator: Finished'),
										(this._isRunning = !1)),
									[3, 0]
								)
							case 2:
								return [2]
						}
					})
				})
			}),
			(t.prototype.startEventGeneration = function () {
				;(this._isRunning = !0), this.runEventLoop()
			}),
			(t.prototype.stopEventGeneration = function () {
				this._isRunning = !1
			}),
			(t.prototype.waitForEventGeneratorStopped = function () {
				return __awaiter(this, void 0, void 0, function () {
					return __generator(this, function (e) {
						switch (e.label) {
							case 0:
								if (!this._isRunning) return [3, 2]
								return [
									4,
									new Promise(function (e) {
										return setTimeout(e, 200)
									}),
								]
							case 1:
								return e.sent(), [3, 0]
							case 2:
								return [2]
						}
					})
				})
			}),
			t
		)
	})(node_events_1.EventEmitter)
exports.PaymentEventsGenerator = PaymentEventsGenerator
