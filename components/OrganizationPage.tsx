'use client'

import React, { useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCollection, useDocument } from 'react-firebase-hooks/firestore'
import { collection, doc } from 'firebase/firestore'
import { db } from '@/firebase'
import MemberList from './MemberList'
import ProjPage from './ProjPage'
import ProjOnboarding from './ProjOnboarding'
import { UserOrgData } from '@/types/types'
import { useUser } from '@clerk/nextjs'

const OrganizationPage = ({ id }: { id: string }) => {
  const { user } = useUser();
  const userId = user?.primaryEmailAddress?.emailAddress;
  if (!userId) {
    return <div>Loading...</div>;
  }
  const [org, loading, error] = useDocument(doc(db, 'organizations', id));
  const [projectsData, projLoading, projError] = useCollection(collection(db, 'organizations', id, 'projs'));
  const [data] = useDocument(doc(db, 'users', userId, 'orgs', id));

  const [userRole, setUserRole] = React.useState('');
  useEffect(() => {
    if (data) {
      const userOrg = data.data() as UserOrgData;
      setUserRole(userOrg.role);
    }
  }, [data])
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!org) {
    return <div>No organization found</div>;
  }

  const orgData = org!.data()!;

  if (!orgData) {
    return <div>No organization found</div>;
  }


  return (
    <div className="overflow-x-hidden">
      <div className="flex items-center justify-between mb-10">
        <ProjOnboarding orgId={id} />
        <h1 className="text-4xl font-bold">
          {orgData && orgData.title}
        </h1>
      </div>
      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="projects"><ProjPage userRole={userRole} orgId={id} projectsData={projectsData} loading={projLoading} error={projError} /></TabsContent>
        <TabsContent value="members">{orgData && <MemberList userRole={userRole} admins={orgData.admins} members={orgData.members} />}</TabsContent>
        <TabsContent value="settings">Organization settings and preferences.</TabsContent>
      </Tabs>
    </div>
  )
}

export default OrganizationPage