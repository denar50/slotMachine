import { expect } from 'chai'
import SlotMachine from 'classes/SlotMachine'

describe('SlotMachine', () => {
	let slotMachine
	beforeEach(() => {
		slotMachine = new SlotMachine()
	})
	describe('constructor', () => {
		it('Should create three slots', () => {

		})

		it('Should have a play method', () => {

		})

		it('Should have a stop method', () => {

		})
	})

	describe('play', () => {
		it('Should call play on each slot', () => {

		})

		describe('API interaction', () => {
			it('Should call the API', () => {

			})

			it('Should stop every slot after receiving the response form the API', () => {

			})
		})
	})

	describe('stop', () => {
		it('Should call stop on each slot', () => {

		})

		it('Should call play again if it is a bonus game', () => {

		})
	})
})
