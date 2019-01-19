'use strict';

class Machine {
	constructor(description) {
		this.id = description.id;
		this.state = description.initialState;
		this.context = description.context;
		this.states = description.states;
		this.transitionQueue = [];
	}

	setContext(param) {
		this.context = {...this.context, ...param};
	}

	setState(newState) {
		this.state = newState;
	}

	clearTransitionQueue() {
		if (this.transitionQueue.length > 0) {
			const newTransitionName = this.transitionQueue[0][0];
			const newTransitionParam = this.transitionQueue[0][1];

			new Promise((resolve, reject) => {
				if (this.states[state].on[newTransitionName].hasOwnProperty('service')) {
					this.states[state].on[newTransitionName].service(newTransitionParam);
				} else {
					this.state = this.states[state].on[newTransitionName].target;
				}
		    }).then(() => {
		    	this.transitionQueue.shift();
		    	this.clearTransitionQueue();
		    })
		}
	}

	transition(transitionName, transitionParam) {
		this.transitionQueue.push([transitionName, transitionParam]);

		if (this.transitionQueue.length == 1) {
			clearTransitionQueue();
		}
	}
}

const machine = function(description) {
	const newMachine = new Machine(description);
	useContext = useContext.bind(newMachine);
	useState = useState.bind(newMachine);
	return newMachine;
}

let useContext = function() {
	return [this.context, this.setContext.bind(this)];
}

let useState = function() {
	return [this.state, this.setState.bind(this)];
}

const testMachine = machine({
	id: 'vacancy',
	initialState: 'first',
	context: {id: 123},
	states: {
		first: {
			on: {
				move: {
					service: (event) => {
	            		setTimeout(() => {
							[state, setState] = useState();
							setState('second');

							[state, setState] = useState();
							console.log('stated: ' + state);
	            		}, 3000);
					}
				}
			}
		},

		second: {
			on: {
				// move: {target: 'first'}
				move: {
					service: (event) => {
	            		setTimeout(() => {
							[state, setState] = useState();
							setState('first');

							[state, setState] = useState();
							console.log('stated: ' + state);
	            		}, 3000);
					}
				}
			}
		}
	}
});

let [state, setState] = useState();
console.log('start state: ' + state);

testMachine.transition('move', undefined);

[state, setState] = useState();
console.log('after state ' + state);

setTimeout(() => {
	let [state, setState] = useState();
	console.log('finish state: ' + state);
}, 5000);
