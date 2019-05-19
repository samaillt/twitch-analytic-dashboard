import { location as router } from '@hyperapp/router'
const format = require('format-number');

const API_URL = "https://api.twitch.tv/kraken/"
const CLIENT_ID = "v4la970ztrif17s6tvu56zb1gyticw"

export default {
	location: router.actions,

	getTopData: () => (state,actions) => {
		console.log("getTopData actions", API_URL)
		console.log('actions',actions)
		actions.getTopGames()
		actions.getTopStreams()
		return {...state}
	},

	getTopGames: () => (state, actions) => {
		console.log("getTopGames actions", API_URL)

		const headers = {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Client-ID': CLIENT_ID
		}

		const options = {
			method: 'GET',
			headers: headers,
			mode: 'cors',
			cache: 'default'
		}

		const response = fetch(API_URL + 'games/top?limit=5', options)
			.then(response => response.json())
			.catch(function(error) {
				console.log(error)
			})

		response.then((data) => {
			const games = data.top
			const newGames = games.map(g => ({
				...g,
				viewers_formated: format({integerSeparator: ' ', suffix: ' viewers'})(g.viewers) // Number formatting
			}))
			actions.setTopGames(newGames)
		})

		return {
			...state,
			topGamesLoading: true
		}
	},

	setTopGames: (payload) => {
		console.log("payload", payload)
		return (state) => ({
			...state,
			topGames: payload,
			topGamesLoading: false
		})
	},

	getTopStreams: () => (state, actions) => {
		console.log("getTopStreams actions", API_URL)
		const headers = {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Client-ID': CLIENT_ID
		}

		const options = {
			method: 'GET',
			headers: headers,
			mode: 'cors',
			cache: 'default'
		}

		const response = fetch(API_URL + 'streams?limit=5', {
			headers,
			...options
		}).then(response => response.json())
			.catch(function(error) {
				console.log(error)
			});

		response.then((data) => {
			const streams = data.streams
			console.log('STREAMS', streams)
			const newStreams = streams.map(s => ({
				...s,
				viewers_formated: format({integerSeparator: ' ', suffix: ' viewers'})(s.viewers) // Number formatting
			}))
			actions.setTopStreams(newStreams)
		})

		return {
			...state,
			topStreamsLoading: true
		}
	},

	setTopStreams: (payload) => {
		console.log("payload", payload)
		return (state) => ({
			...state,
			topStreams: payload,
			topStreamsLoading: false
		})
	},

	getTopStreamsFromGame: (game) => (state, actions) => {
		console.log("getTopStreamsFromGame actions", API_URL)
		const headers = {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Client-ID': CLIENT_ID
		}

		const options = {
			method: 'GET',
			headers: headers,
			mode: 'cors',
			cache: 'default'
		}

		const response = fetch(API_URL + 'streams?limit=5&game=' + game, {
			headers,
			...options
		}).then(response => response.json())
			.catch(function(error) {
				console.log(error)
			});

		response.then((data) => {
			const streams = data.streams.map(s => ({
				...s,
				viewers_formated: format({integerSeparator: ' ', suffix: ' viewers'})(s.viewers) // Number formatting
			}))
			const newStreams = {
				searchedGame:game,
				results:[...streams]
			}
			actions.setTopStreamsFromGame(newStreams)
		})

		return {
			...state,
			topStreamsFromGameLoading: true
		}
	},

	setTopStreamsFromGame: (payload) => {
		console.log("payload", payload)
		return (state) => ({
			...state,
			topStreamsFromGame: payload,
			topStreamsFromGameLoading: false
		})
	},

	setProfileValue: (value) => (state) => {
		return {
			...state,
			profileInput: {
				...state.profileInput,
				value
			}
		}
	},

	setComparedProfileValue: (value) => (state) => {
		return {
			...state,
			comparedProfileInput: {
				...state.comparedProfileInput,
				value
			}
		}
	},

	setProfile: (payload) => {
		return (state) => ({
			...state,
			channelLoaded: true,
			profiles: [
				payload
			]
		})
	},

	addProfile: (payload) => {
		return (state) => ({
			...state,
			profiles: [
				...state.profiles,
				payload
			]
		})
	},

	resetChannel: (state) => {
		return (state) => ({
			...state,
			channelLoaded: false,
			profiles : []
		})
	},

	getChannelByName: () => (state, actions) => {
		const headers = {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Client-ID': CLIENT_ID
		}

		const options = {
			method: 'GET',
			headers: headers,
			mode: 'cors',
			cache: 'default'
		}

		const response = fetch(API_URL + 'channels/' + state.profileInput.value, options)
			.then(response => response.json())
			.catch(function(error) {
				console.log(error)
			})

		response.then((data) => {
			"error" in data ? actions.resetChannel() : actions.setProfile(data)
		})

		return state
	},

	getComparedChannelByName: () => (state, actions) => {
		const headers = {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Client-ID': CLIENT_ID
		}

		const options = {
			method: 'GET',
			headers: headers,
			mode: 'cors',
			cache: 'default'
		}

		const response = fetch(API_URL + 'channels/' + state.comparedProfileInput.value, options)
			.then(response => response.json())
			.catch(function(error) {
				console.log(error)
			})

		response.then((data) => {
			"error" in data ? actions.resetChannel() : actions.addProfile(data)
		})

		return state
	},

	searchGameValueUpdate: (value) => (state) => {
		return {
			...state,
			searchGame: {
				...state.searchGame,
				value: value
			}
		}
	},

	searchGameQuery: () => (state, actions) => {
		const headers = {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Client-ID': CLIENT_ID
		}

		const options = {
			method: 'GET',
			headers: headers,
			mode: 'cors',
			cache: 'default'
		}

		const response = fetch(API_URL + 'search/games?type=suggest&query=' + state.searchGame.value, options)
			.then(response => response.json())
			.catch(function(error) {
				console.log(error)
			})

		response.then((data) => {
			actions.setSearchGamesResults(data.games)
		})

		return state
	},

	setSearchGamesResults: (payload) => (state) => {
		return {
			...state,
			searchGame: {
				...state.searchGame,
				results: payload
			}
		}
	},

	resetSearchedGames: () => (state) => {
		return {
			...state,
			searchGame: {
				...state.searchGame,
				results: []
			}
		}
	},
};