'use client'

import React, { useState, useRef, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2)
    const minute = i % 2 === 0 ? '00' : '30'
    return `${hour.toString().padStart(2, '0')}:${minute}`
})

interface TimeSlot {
    selected: boolean
}

interface DayColumn {
    day: string
    timeSlots: TimeSlot[]
}

const TimeSlotSelector = () => {
    const [columns, setColumns] = useState<DayColumn[]>(DAYS.map(day => ({
        day,
        timeSlots: TIME_SLOTS.map(() => ({ selected: false }))
    })))
    const [isDragging, setIsDragging] = useState(false)
    const [dragStartPos, setDragStartPos] = useState<{ day: number; slot: number } | null>(null)
    const [dragEndPos, setDragEndPos] = useState<{ day: number; slot: number } | null>(null)
    const [selectedBoxes, setSelectedBoxes] = useState<Set<string>>(new Set())
    const gridRef = useRef<HTMLDivElement>(null)

    const toggleSelectedBoxes = () => {
        setColumns(prevColumns => {
            const newColumns = [...prevColumns]
            selectedBoxes.forEach(key => {
                const [day, slot] = key.split('-').map(Number)
                newColumns[day] = {
                    ...newColumns[day],
                    timeSlots: newColumns[day].timeSlots.map((timeSlot, index) =>
                        index === slot ? { ...timeSlot, selected: !timeSlot.selected } : timeSlot
                    )
                }
            })
            return newColumns
        })
        setSelectedBoxes(new Set())
    }

    const handleMouseDown = (dayIndex: number, slotIndex: number) => {
        setIsDragging(true)
        setDragStartPos({ day: dayIndex, slot: slotIndex })
        setDragEndPos({ day: dayIndex, slot: slotIndex })
        setSelectedBoxes(new Set([`${dayIndex}-${slotIndex}`]))
    }

    const handleMouseEnter = (dayIndex: number, slotIndex: number) => {
        if (isDragging) {
            setDragEndPos({ day: dayIndex, slot: slotIndex })
            setSelectedBoxes(prevSelected => {
                const newSelected = new Set(prevSelected)
                const minDay = Math.min(dragStartPos!.day, dayIndex)
                const maxDay = Math.max(dragStartPos!.day, dayIndex)
                const minSlot = Math.min(dragStartPos!.slot, slotIndex)
                const maxSlot = Math.max(dragStartPos!.slot, slotIndex)

                for (let day = minDay; day <= maxDay; day++) {
                    for (let slot = minSlot; slot <= maxSlot; slot++) {
                        newSelected.add(`${day}-${slot}`)
                    }
                }
                return newSelected
            })
        }
    }

    const handleMouseUp = () => {
        if (isDragging) {
            toggleSelectedBoxes()
        }
        setIsDragging(false)
        setDragStartPos(null)
        setDragEndPos(null)
    }

    return (
        <Card className="w-full max-w-5xl mx-auto" style={{ userSelect: 'none' }}>
            <CardContent className="overflow-hidden">
                <div className="flex flex-col h-[60vh]">
                    <div className="flex-none grid grid-cols-[auto_1fr] gap-x-0.5">
                        <div className="w-12"></div>
                        <div className="grid grid-cols-7 gap-x-2 pl-2">
                            {DAYS.map((day) => (
                                <h3 key={day} className="font-semibold">{day}</h3>
                            ))}
                        </div>
                    </div>
                    <div className="flex-grow overflow-auto">
                        <div className="flex h-full">
                            <div className="flex-none pr-2 space-y-0">
                                {TIME_SLOTS.map((time, index) => (
                                    <div key={time} className={`h-6 flex items-center justify-end text-sm text-muted-foreground ${index % 2 === 0 ? '' : 'invisible'}`}>
                                        {time}
                                    </div>
                                ))}
                            </div>
                            <div
                                className="flex-grow"
                                ref={gridRef}
                                onMouseLeave={handleMouseUp}
                                onMouseUp={handleMouseUp}
                            >
                                <div className="grid grid-cols-7 gap-x-0.5 gap-y-0 h-full">
                                    {columns.map((column, dayIndex) => (
                                        <div key={column.day} className="flex flex-col items-center">
                                            <div className="flex flex-col items-center">
                                                {column.timeSlots.map((slot, slotIndex) => (
                                                    <div
                                                        key={`${column.day}-${slotIndex}`}
                                                        className={`w-16 h-6 rounded-sm transition-colors cursor-pointer ${slot.selected
                                                            ? 'bg-primary hover:bg-primary/90'
                                                            : 'bg-secondary hover:bg-secondary/80'
                                                            } ${selectedBoxes.has(`${dayIndex}-${slotIndex}`)
                                                                ? 'ring-2 ring-offset-1 ring-primary'
                                                                : ''
                                                            }`}
                                                        onMouseDown={() => handleMouseDown(dayIndex, slotIndex)}
                                                        onMouseEnter={() => handleMouseEnter(dayIndex, slotIndex)}
                                                        aria-label={`${column.day} ${TIME_SLOTS[slotIndex]} ${slot.selected ? 'selected' : 'not selected'}`}
                                                        role="checkbox"
                                                        aria-checked={slot.selected}
                                                        tabIndex={0}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' || e.key === ' ') {
                                                                setSelectedBoxes(new Set([`${dayIndex}-${slotIndex}`]))
                                                                toggleSelectedBoxes()
                                                            }
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default TimeSlotSelector