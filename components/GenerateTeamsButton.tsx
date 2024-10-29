'use client'
import { matching } from '@/ai_scripts/matching';
import React from 'react'
import { Button } from './ui/button';

const GenerateTeamsButton = ({ setOutput }: { setOutput: (output: string) => void }) => {
  const handleGenerateTeams = () => {
    matching()
      .then((output: string) => {
        console.log("API Response:", output); // Log the output from the matching function
        setOutput(output);
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
    </>
  )
}

export default GenerateTeamsButton