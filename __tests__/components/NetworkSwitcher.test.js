import React from 'react'

import { shallow } from 'enzyme'

import NetworkSwitcher from '../../src/app/components/NetworkSwitcher'

const setup = () => {
  const props = {
    networkId: 0,
    networks: [
      { name: 'MainNet', url: 'http://api.wallet.cityofzion.io', canDelete: false },
      { name: 'TestNet', url: 'http://testnet-api.wallet.cityofzion.io', canDelete: false },
      { name: 'CoZ TestNet', url: 'http://coz-privatenet.herokuapp.com/', canDelete: false },
    ],
    setNetwork: jest.fn(),
  }
  const wrapper = shallow(<NetworkSwitcher { ...props } />)

  return {
    wrapper,
  }
}

describe('NetworkSwitch', () => {
  test('renders without crashing', (done) => {
    const { wrapper } = setup()
    expect(wrapper).toMatchSnapshot()
    done()
  })

  test('correctly renders MainNet initially', () => {
    const { wrapper } = setup()

    const networkSelectorElement = wrapper.find('select').getElement()

    expect(networkSelectorElement.props.defaultValue).toEqual(0)
  })

  test('switches to the correct network when chosen from the dropdown', async () => {
    const { wrapper } = setup()

    const instance = wrapper.instance()
    const networkSelector = wrapper.find('select')
    networkSelector.simulate('change', { target: { value: 1 } })

    expect(instance.props.setNetwork).toHaveBeenCalledWith(1)

    networkSelector.simulate('change', { target: { value: 0 } })

    expect(instance.props.setNetwork).toHaveBeenCalledWith(0)
  })
})
