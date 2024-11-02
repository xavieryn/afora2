'use client'
import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import InviteUserToOrganization from './InviteUserToOrganization';
const MemberList = ({ admins, members, userRole }: { admins: string[]; members: string[]; userRole: string }) => {
    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px] text-xl font-bold">Admins</TableHead>
                        {userRole === 'admin' && (
                            <TableHead className="text-right">
                                <InviteUserToOrganization />
                            </TableHead>
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {admins.map((admin, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">{admin}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px] text-xl font-bold">Members</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {members.map((member, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">{member}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default MemberList