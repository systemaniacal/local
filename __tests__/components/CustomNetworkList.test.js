import React from 'react'

import { shallow } from 'enzyme'

import CustomNetworkList from '../../src/app/components/CustomNetworkList'

const setup = (networkId = 0) => {
  const props = {
    networks: [
      { name: 'MainNet', url: 'http://api.wallet.cityofzion.io', canDelete: false },
      { name: 'local', url: 'http://127.0.0.1:5000', canDelete: true },
    ],
    network: { id: networkId },
    deleteCustomNetwork: jest.fn(),
    setNetwork: jest.fn(),
  }
  const wrapper = shallow(<CustomNetworkList { ...props } />)

  return {
    wrapper,
  }
}

describe('CustomNetworkList', () => {
  test('renders without crashing', (done) => {
    const { wrapper } = setup()
    expect(wrapper).toMatchSnapshot()
    done()
  })

  test('lists networks properly', async () => {
    const { wrapper } = setup()

    // MainNet shouldn't show on this list, as it's not a custom network (canDelete = false).
    expect(wrapper.contains('MainNet')).toEqual(false)

    // Local is a custom network and should show.
    expect(wrapper.contains('local')).toEqual(true)
  })

  test('delete network works', async () => {
    const { wrapper } = setup(1)
    const instance = wrapper.instance()

    // MainNet shouldn't show on this list, as it's not a custom network (canDelete = false).
    expect(wrapper.contains('MainNet')).toEqual(false)

    // Local is a custom network and should show.
    expect(wrapper.contains('local')).toEqual(true)

    wrapper.find('a').simulate('click')
    expect(instance.props.setNetwork).toHaveBeenCalledWith(0)
    expect(instance.props.deleteCustomNetwork).toHaveBeenCalledWith(1)
  })
})
