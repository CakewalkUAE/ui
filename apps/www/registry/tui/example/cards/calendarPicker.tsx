"use client"
import { Card, CardContent } from "@/registry/tui/ui/card"

import { addDays } from "date-fns"
import { CalenderPicker } from "../../ui/calendarPicker"

export function CardsCalendarPicker() {
    return (
        <div className="flex space-x-3">
            <Card>
                <CalenderPicker startDate={5} endDate={13} numberOfMonths={1} />
            </Card>

            <Card>
                <CalenderPicker numberOfMonths={2} />
            </Card>

        </div>
    )
}