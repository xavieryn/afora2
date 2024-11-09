'use client'

import React from 'react'

const Stage = ({ projId, stageId }: { projId: string, stageId: string }) => {
    return (
        <div>
            <p>Project ID: {projId}</p>
            <p>Stage ID: {stageId}</p>
        </div>
    )
}

export default Stage