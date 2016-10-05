import { expect } from 'chai'
import SlotMachine from 'classes/SlotMachine'
import Slot from 'classes/Slot'
import sinon from 'sinon'
import { animationRunnerFactory } from 'services/utils'
import state from 'services/state'
import API from 'services/api'
import { events as slotMachineEvents } from 'services/stateModifiers/slotMachine'
import { removeFromArray } from 'services/utils'
import { STOP_SLOT_DELAY, PLAY_AFTER_BONUS_DEBOUNCE_TIME } from 'services/constants'
const { REMOVE_RUNNING_SLOT, NEW_DATA_RECEIVED, IS_BONUS_CHANGE } = slotMachineEvents

const promiseStubThatRunsThenImmediately = () =>  {
	return {
		then: thenCallback => thenCallback.apply(null, arguments)
	}
}

describe('SlotMachine', () => {
	let slotMachine
	before(() => {
		slotMachine = new SlotMachine([{}, {}, {}])
		sinon.stub(state, 'fireEvent', (eventName, slot) => {
			const { runningSlots } = state
			if(eventName === REMOVE_RUNNING_SLOT) {
				removeFromArray(runningSlots, slot)
			}
		})
	})

	after(() => {
		state.fireEvent.restore()
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
		before(() => {
			sinon.stub(SlotMachine.prototype, 'playSlots')
			sinon.stub(SlotMachine.prototype, 'stop', promiseStubThatRunsThenImmediately)
			sinon.stub(API, 'play', promiseStubThatRunsThenImmediately)
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
			sinon.stub(Slot.prototype, 'play')
			sinon.stub(animationRunnerFactory, 'create', () => {
				animationRunner =  {
					runAnimation: sinon.spy()
				}
				return animationRunner
			})
		})

		after(() => {
			Slot.prototype.play.restore()
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
			sinon.stub(Slot.prototype, 'changeSlotBackground')
		})

		afterEach(() => {
			Slot.prototype.changeSlotBackground.restore()
		})

		it('Should change the slot image of each running slot', () => {
			runningSlots.push.apply(runningSlots, slotMachine.slots)
			slotMachine.changeSlotsBackground()
			expect(Slot.prototype.changeSlotBackground.callCount).to.equal(runningSlots.length)
		})

		it('Should stop the animation when there are not slots running', () => {
			const animationRunner = {
				stopAnimation: sinon.spy()
			}
			slotMachine.changeSlotsBackground(animationRunner)
			runningSlots.forEach((slot) => expect(slot.changeSlotBackground.called).to.be.false)
			expect(animationRunner.stopAnimation.calledOnce).to.be.true
		})

	})

	describe('removeStoppedSlotsFromRunningSlots', () => {
		before(() => {
			const runningSlots = state.runningSlots = []
			runningSlots.push.apply(runningSlots, slotMachine.slots)
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
		const outcomeArray = [0, 1, 2]
		const isBonus = true
		let stopPromise
		beforeEach(() => {
			stopPromise = slotMachine.stop({outcome: outcomeArray, isBonus})
		})

		before(() => {
			sinon.stub(SlotMachine.prototype, 'stopSlotsSequentially', promiseStubThatRunsThenImmediately)
			sinon.stub(SlotMachine.prototype, 'play', promiseStubThatRunsThenImmediately)
		})

		after(() => {
			SlotMachine.prototype.stopSlotsSequentially.restore()
			SlotMachine.prototype.play.restore()
		})

		it('Should stop all the slots after some time', function(done){
			stopPromise.then(() => {
				expect(slotMachine.stopSlotsSequentially.calledWith(outcomeArray)).to.be.true
				done()
			})
		})

		it('Should call play again if it is a bonus game', function(done){
			stopPromise.then(() => {
				expect(slotMachine.play.calledWith(true))
				done()
			})
		})

		it('Should fire a new data received event', function(done){
			stopPromise.then(() => {
				expect(state.fireEvent.calledWith(NEW_DATA_RECEIVED, {outcome: outcomeArray, isBonus}))
				done()
			})
		})

		it('Should fire a new data received event', function(done){
			stopPromise.then(() => {
				expect(state.fireEvent.calledWith(IS_BONUS_CHANGE, true))
				done()
			})
		})
	})
})
