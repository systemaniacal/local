import React, {Component} from 'react'
import {connect} from 'react-redux'

import {api} from '@cityofzion/neon-js'
import Button from 'preact-material-components/Button'
import 'preact-material-components/Button/style.css'
import 'preact-material-components/Theme/style.css'
import TextField from 'preact-material-components/TextField'
import 'preact-material-components/TextField/style.css'

@connect(
	state => ({
		network: state.network
	})
)

export default class Balance extends Component {
	state = {
		errorMsg: '',
		loading: false,
		haveBalance: false,
		NEO: 0,
		GAS: 0,
		balanceAddress: ''
	}

	_handleTextFieldChange = (e) => {
		const key = e.target.id
		this.setState({
			[key]: e.target.value
		})
	}

	resetState = () => {
		this.setState({
			errorMsg: '',
			loading: false,
			haveBalance: false,
			NEO: 0,
			GAS: 0,
			address: '',
			balanceAddress: ''
		})
	}

	handleSubmit = (event) => {
		event.preventDefault()
		const {network} = this.props
		this.setState({
			loading: true,
			haveBalance: false,
			errorMsg: '',
			address: ''
		})
		api.neonDB.getBalance(network.name, this.state.balanceAddress)
			.then((result) => {
				this.setState({
					loading: false,
					haveBalance: true,
					NEO: result.NEO.balance,
					GAS: result.GAS.balance,
					address: this.state.balanceAddress
				})
			})
			.catch((e) => {
				this.setState({loading: false, errorMessage: 'Could not retrieve the balance for this address.'})
			})
	}

	render() {
		const {haveBalance, errorMsg, loading, NEO, GAS, address} = this.state

		return (
			<div>
				<form onSubmit={this.handleSubmit}>
					<TextField
						type='text'
						placeholder='Address'
						value={this.state.balanceAddress}
						id="balanceAddress"
						onChange={this._handleTextFieldChange}
					/>
					<Button raised ripple>Get Balance</Button>
				</form>
				{haveBalance &&
				<div>
					<div>NEO: {NEO}</div>
					<div>GAS: {GAS}</div>
					<div>Address: {address}</div>
				</div>
				}
				{loading === true &&
				<div>loading...</div>
				}
				{errorMsg !== '' &&
				<div>ERROR: {errorMsg}</div>
				}
			</div>
		)
	}
}
