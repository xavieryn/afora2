'use client'

import React, { useState } from 'react'
import { Button } from './ui/button'
import DeleteOrg from './DeleteOrg'
import InviteUserToOrganization from './InviteUserToOrganization'
import { matching } from '@/ai_scripts/matching'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
    <div className="overflow-x-hidden">
      <div className="flex items-center justify-between mb-10">
        <span>Organization ID: {id}</span>

        <div className="flex items-center gap-2">
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
        </div>
      </div>
      <Tabs defaultValue="about-us" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="about-us">About Us</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="about-us">Information about the organization.</TabsContent>
        <TabsContent value="groups">Details about the groups within the organization.</TabsContent>
        <TabsContent value="members">List of members in the organization.</TabsContent>
        <TabsContent value="settings">Organization settings and preferences.</TabsContent>
      </Tabs>
    </div>
  )
}

export default Organization
