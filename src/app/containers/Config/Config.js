import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { TabBar, Tab } from 'rmwc/Tabs'
import '@material/tabs/dist/mdc.tabs.min.css'

import CustomNetworkList from '../../components/CustomNetworkList'
import AddCustomNetwork from '../../components/AddCustomNetwork'

import style from './Config.css'

class Config extends Component {
  state = {
    activeTabIndex: 0,
  }

  render() {
    const { activeTabIndex } = this.state
    const { addCustomNetwork, deleteCustomNetwork, setNetwork, config, network } = this.props

    let tabContent = null
    if (activeTabIndex === 1) {
      tabContent = <AddCustomNetwork addCustomNetwork={ addCustomNetwork } />
    } else {
      tabContent = <CustomNetworkList
        deleteCustomNetwork={ deleteCustomNetwork }
        setNetwork={ setNetwork }
        network={ network }
        networks={ config.networks }
      />
    }

    return (
      <div>
        <TabBar
          className={ style.tabBar }
          activeTabIndex={ this.state.activeTabIndex || 0 }
          onChange={ evt => this.setState({ 'activeTabIndex': evt.target.value }) }
        >
          <Tab style={ { display: 'table-cell' } }>Networks</Tab>
          <Tab style={ { display: 'table-cell' } }>Add</Tab>
        </TabBar>
        { tabContent }
      </div>
    )
  }
}

Config.propTypes = {
  network: PropTypes.object,
  config: PropTypes.object,
  setNetwork: PropTypes.func,
  addCustomNetwork: PropTypes.func,
  deleteCustomNetwork: PropTypes.func,
}

export default Config
