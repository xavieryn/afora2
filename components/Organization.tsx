'use client'

import React from 'react'
import { Button } from './ui/button'
import DeleteOrg from './DeleteOrg'

const Organization = ({ id }: { id: string }) => {
  return (
    <><div>Organization {id}</div><Button onClick={() => console.log('Generate Teams clicked')}>
      Generate Teams
    </Button>
      <DeleteOrg /></>
  )
}

export default Organization