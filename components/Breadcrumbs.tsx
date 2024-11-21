'use client';

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { usePathname } from "next/navigation";
import { Fragment } from "react";

function Breadcrumbs() {
    // Adds a path that a user can refer to know where they are and click to "parent" directories
    const path = usePathname();

    const segments = path.split("/");
    return (
        <Breadcrumb>
            <BreadcrumbList className="text-white">
                <BreadcrumbItem>
                    <BreadcrumbLink href="/" className="text-white">Home</BreadcrumbLink>
                </BreadcrumbItem>
                {segments.map((segment, index) => {
                    if (!segment) return null;
                    segment = segment.charAt(0).toUpperCase() + segment.slice(1);
                    const href = `${segments.slice(0, index + 1).join("/")}`
                    const isLast = index === segments.length - 1
                    return (
                        <Fragment key={segment}>
                            <BreadcrumbSeparator className="text-white" />
                            <BreadcrumbItem key={segment}>
                                {isLast ? (
                                    <BreadcrumbPage className="text-white"> {segment} </BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink href={href} className="text-white">{segment}</BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </Fragment>
                    )
                })}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
export default Breadcrumbs
