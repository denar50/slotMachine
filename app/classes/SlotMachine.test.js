import { expect } from 'chai'
import SlotMachine from 'classes/SlotMachine'
import Slot from 'classes/Slot'
import sinon from 'sinon'
import { animationRunnerFactory } from 'services/utils'
import state from 'services/state'
import API from 'services/api'
import { events as slotMachineEvents } from 'services/stateModifiers/slotMachine'
import { removeFromArray } from 'services/utils'
const { REMOVE_RUNNING_SLOT } = slotMachineEvents

describe('SlotMachine', () => {
	let slotMachine
	before(() => {
		slotMachine = new SlotMachine([{}, {}, {}])
		sinon.spy(Slot.prototype, 'play')
	})

	after(() => {
		Slot.prototype.play.restore()
	})

	describe('constructor', () => {
		it('Should have three slots', () => {
			const { slots } = slotMachine
			expect(slots).to.have.lengthOf(3)
			slots.forEach((slot) => {
				expect(slot).to.be.instanceof(Slot)
			})
		})

		it('Should have a play method', () => {
			expect(slotMachine.play).to.be.instanceof(Function)
		})

		it('Should have a stop method', () => {
			expect(slotMachine.stop).to.be.instanceof(Function)
		})
	})

	describe('play', () => {
		let apiThenCallback
		before(() => {
			sinon.stub(SlotMachine.prototype, 'playSlots')
			sinon.stub(SlotMachine.prototype, 'stop', () => {
				return {
					then: () => {}
				}
			})
			sinon.stub(API, 'play', () => {
				return {
					then: (callback) => {
						apiThenCallback = callback
					}
				}
			})
			slotMachine.play()
		})

		after(() => {
			SlotMachine.prototype.playSlots.restore()
			SlotMachine.prototype.stop.restore()
			API.play.restore()
		})

		it('Should play the slots (fire their animation)', () => {
			expect(slotMachine.playSlots.calledOnce).to.be.true
		})

		it('Should call stop when the API responds', () => {
			apiThenCallback()
			expect(slotMachine.stop.calledOnce).to.be.true
		})

		it('Should call the API with the right parameters when it is bonus', () => {
			slotMachine.play(true)
			expect(API.play.calledWith(true)).to.be.true
		})

		it('Should call the API with the right parameters when it is not bonus', () => {
			slotMachine.play(false)
			expect(API.play.calledWith(false)).to.be.true
		})
	})

	describe('playSlots', () => {
		let animationRunner
		before(() => {
			sinon.stub(animationRunnerFactory, 'create', () => {
				animationRunner =  {
					runAnimation: sinon.spy(),
					stopAnimation: sinon.spy()
				}
				return animationRunner
			})
		})

		after(() => {
			animationRunnerFactory.create.restore()
		})

		beforeEach(() => {
			slotMachine.playSlots()
		})

		it('Should execute the play method on every slot', () => {
			const { slots } = slotMachine
			slots.forEach(slot => expect(slot.play.calledThrice).to.be.true)
		})

		it('Should create an animation runner and run the slot animations', () => {
			expect(animationRunnerFactory.create.calledWith(slotMachine.changeSlotsBackground)).to.be.true
			expect(animationRunner.runAnimation.calledOnce).to.be.true
		})
	})

	describe('changeSlotsBackground', () => {
		let runningSlots
		before(() => {
			sinon.stub(SlotMachine.prototype, 'removeStoppedSlotsFromRunningSlots')
		})
		after(() => {
			SlotMachine.prototype.removeStoppedSlotsFromRunningSlots.restore()
		})

		beforeEach(() => {
			runningSlots = state.runningSlots = []
			runningSlots.push.apply(runningSlots, slotMachine.slots)
			sinon.stub(Slot.prototype, 'changeSlotBackground')
		})

		afterEach(() => {
			Slot.prototype.changeSlotBackground.restore()
		})

		it('Should change the slot image of each running slot', () => {
			slotMachine.changeSlotsBackground()
			runningSlots.forEach((slot) => {
				expect(slot.changeSlotBackground.calledOnce).to.be.true
			})
		})

		it('Should stop the animation when there are not slots running', () => {
			const animationRunner = {
				stopAnimation: sinon.spy()
			}
			slotMachine.changeSlotsBackground(animationRunner)
			runningSlots.forEach((slot) => expect(slot.changeSlotBackground.called).to.be.false)
			expect(animationRunner.calledOnce).to.be.true
		})

	})

	describe('removeStoppedSlotsFromRunningSlots', () => {
		before(() => {
			const runningSlots = state.runningSlots = []
			runningSlots.push.apply(runningSlots, slotMachine.slots)
			sinon.stub(state, 'fireEvent', (eventName, slot) => {
				if(eventName === REMOVE_RUNNING_SLOT) {
					removeFromArray(runningSlots, slot)
				}
			})
		})

		after(() => {
			state.fireEvent.restore()
		})

		it('Should remove all the slots that stopped from the running slots array', (done) => {
			const { runningSlots } = state
			Promise.all(runningSlots.map((slot) => {
				const stopPromise = slot.stop(0)
				stopPromise.then(() => {
					slotMachine.removeStoppedSlotsFromRunningSlots()
					expect(state.fireEvent.lastCall.args[1]).to.deep.equal(slot)
				})
			})).then(() => done())
		})
	})

	describe('stop', () => {
		it('Should call stop on each slot', () => {

		})

		it('Should call play again if it is a bonus game', () => {

		})
	})
})
