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
                        <TableCell className="font-medium flex items-center">
                        <img src="https://static.vecteezy.com/system/resources/previews/024/983/914/non_2x/simple-user-default-icon-free-png.png" alt="default icon" className="w-6 h-6 mr-2 rounded-full" />
                        {admin}
                    </TableCell>
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
                            <TableCell className="font-medium flex items-center">
                                <img src="https://static.vecteezy.com/system/resources/previews/024/983/914/non_2x/simple-user-default-icon-free-png.png" alt="default icon" className="w-6 h-6 mr-2 rounded-full" />
                                {member}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default MemberList