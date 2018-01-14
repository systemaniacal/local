import React from 'react'

import { shallow } from 'enzyme'

import NetworkSwitcher from '../../src/app/components/NetworkSwitcher'

const setup = () => {
  const props = {
    network: { name: 'MainNet' },
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

    expect(networkSelectorElement.props.defaultValue).toEqual('MainNet')
  })

  test('switches to the correct network when chosen from the dropdown', async () => {
    const { wrapper } = setup()

    const instance = wrapper.instance()
    const networkSelector = wrapper.find('select')
    networkSelector.simulate('change', { target: { value: 'TestNet' } })

    expect(instance.props.setNetwork).toHaveBeenCalledWith('TestNet')

    networkSelector.simulate('change', { target: { value: 'MainNet' } })

    expect(instance.props.setNetwork).toHaveBeenCalledWith('MainNet')
  })
})
