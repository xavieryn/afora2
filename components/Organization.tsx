'use client'

import React, { useState } from 'react'
import { Button } from './ui/button'
import DeleteOrg from './DeleteOrg'
import InviteUserToOrganization from './InviteUserToOrganization'
import { matching } from '@/ai_scripts/matching'

const Organization = ({ id }: { id: string }) => {
  const [output, setOutput] = useState('');
  const handleGenerateTeams = () => {
    matching()
      .then((output: any) => {
        setOutput(output);
        console.log("API Response:", output); // Log the output from the matching function
      })
      .catch((error: Error) => {
        console.error("Error:", error); // Handle any errors
      });
  };

  return (
    <>
      <Button onClick={handleGenerateTeams}>
        Generate Teams
      </Button>
      {output && (
        <div>
          <h3>Generated Teams:</h3>
            <pre>{JSON.stringify(output, null, 2)}</pre>
        </div>
      )}
      <DeleteOrg />
      <InviteUserToOrganization />
    </>
  )
}

export default Organization