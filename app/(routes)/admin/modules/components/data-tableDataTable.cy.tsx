import React from 'react'
import { DataTable } from './data-table'

describe('<DataTable />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<DataTable />)
  })
})