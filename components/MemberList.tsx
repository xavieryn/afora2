import React from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
interface MemberListProps {
    admins: string[];
    members: string[];
}

const MemberList: React.FC<MemberListProps> = ({ admins, members }) => {
    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px] text-xl font-bold">Admins</TableHead>
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