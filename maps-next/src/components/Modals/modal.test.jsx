import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Modal from '.'
import { CustomerContext } from '@/contexts/CustomerContext'

const mockCustomerContextValue = {
  customer: {
    title: 'Dev College', 
    zipCode: '62040744', 
    number: '56',
    address: 'Rua teste', 
    active: true 
  },
  setCustomer: jest.fn(),
  setCustomers: jest.fn() 
}

test('loads and displays greeting', async () => {
  render(
    <CustomerContext.Provider value={mockCustomerContextValue}>
      <Modal />
    </CustomerContext.Provider>
  )

  const titleInput = await screen.getByRole('title')  
  expect(titleInput).toHaveValue('Dev College')

  const zipCodeInput = await screen.getByRole('zipCode')  
  expect(zipCodeInput).toHaveValue('62040744')

  const numberInput = await screen.getByRole('number')  
  expect(numberInput).toHaveValue('56')

  const addressTextArea = await screen.getByRole('address')  
  expect(addressTextArea).toHaveValue('Rua teste')

  const activeSelect = await screen.getByRole('active')  
  expect(activeSelect).toHaveValue('true')
})
