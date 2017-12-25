import React, {Component} from 'react'
import {connect} from 'react-redux'

import {api} from '@cityofzion/neon-js'
import Select from 'preact-material-components/Select'
import 'preact-material-components/List/style.css'
import 'preact-material-components/Menu/style.css'
import 'preact-material-components/Select/style.css'

import TextField from 'preact-material-components/TextField'
import 'preact-material-components/TextField/style.css'

import Button from 'preact-material-components/Button'
import 'preact-material-components/Button/style.css'
import 'preact-material-components/Theme/style.css'

@connect(
	state => ({
		network: state.network,
		account: state.account
	})
)

export default class Send extends Component {
	state = {
		errorMsg: '',
		loading: false,
		txid: '',
		assetType: 1,
		address: '',
		amount: ''
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
			txid: '',
			assetType: 1,
			address: '',
			amount: ''
		})
	}

	handleSubmit = (event) => {
		event.preventDefault()
		const {network, account} = this.props
		this.setState({
			loading: true,
			errorMsg: ''
		})

		if (!this.state.address || !this.state.amount) {
			this.setState({
				loading: false,
				errorMsg: 'All fields are required'
			})

			return
		}

		//Set Asset Type
		let assetType
		if(this.state.assetType === 0){
			assetType = 'NEO'
		}else{
			assetType = 'GAS'
		}

		let amounts = {}
		amounts[assetType] = parseFloat(this.state.amount)
		console.log('submit')
		console.log(network.name, this.state.address, account.wif, amounts)
		api.neonDB.doSendAsset(network.name, this.state.address, account.wif, amounts)
			.then((result) => {
				console.log(result)
				this.setState({
					loading: false,
					txid: result.txid
				})
			})
			.catch((e) => {
				console.log(e)
				this.setState({
					loading: false,
					errorMsg: e
				})
			})
	}

	render() {
		const {txid, loading, errorMsg} = this.state

		return (
			<div>
				<form onSubmit={this.handleSubmit}>
					<TextField
						type='text'
						placeholder='Address'
						value={this.state.address}
						id="address"
						onChange={this._handleTextFieldChange}
					/>
					<TextField
						type='text'
						placeholder='Amount'
						value={this.state.amount}
						id="amount"
						onChange={this._handleTextFieldChange}
					/>


					<Select hintText="Asset"
							ref={(input) => {
								this.type = input
							}}
							selectedIndex={this.state.assetType}
							onChange={(e) => {
								this.setState({
									assetType: [e.selectedIndex]
								})
							}}
					>
						<Select.Item>NEO</Select.Item>
						<Select.Item>GAS</Select.Item>
					</Select>


					<Button raised ripple>Send</Button>
				</form>

				{txid &&
				<div>
					<div>Success!</div>
					<div>txid: {txid}</div>
				</div>
				}
				{loading &&
				<div>Loading...</div>
				}
				{errorMsg !== '' &&
				<div>ERROR: {errorMsg}</div>
				}
			</div>
		)
	}
}
