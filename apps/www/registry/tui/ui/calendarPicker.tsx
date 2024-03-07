import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import { Icon } from "./icon";
import { addMonths, subMonths } from 'date-fns';

type CalendarPickerProps = {
    startDate?: number;
    endDate?: number;
    numberOfMonths: number;
    yearsToDisplay?: number;
}

const CalenderPicker = ({ startDate, endDate, numberOfMonths, yearsToDisplay }: CalendarPickerProps) => {
    const currentYear = new Date().getFullYear();
    const numberOfYears = Array.from({ length: yearsToDisplay ?? 100 }, (_, index) => currentYear - index);
    const monthOptions = [
        'Jan', 'Feb', 'March', 'April', 'May', 'June',
        'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [startYearIndex, setStartYearIndex] = useState(0);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedStartDate, setSelectedStartDate] = useState<number | null>(startDate || null);
    const [selectedEndDate, setSelectedEndDate] = useState<number | null>(endDate || null);
    const [startCalendarIndex, setStartCalendarIndex] = useState(0);
    const [endCalendarIndex, setEndCalendarIndex] = useState<number | null>(null);
    const [isYearsGridVisible, setIsYearsGridVisible] = useState(false);
    const [isMonthsGridVisible, setIsMonthsGridVisible] = useState(false);

    const handleYearClick = (year: number) => {
        setSelectedYear(year);
        setCurrentDate(new Date(year, selectedMonth!, selectedDay!));
        setIsYearsGridVisible(false);
        setIsMonthsGridVisible(true);
    };

    const handleMonthClick = (month: number) => {
        setSelectedMonth(month);
        setCurrentDate(new Date(selectedYear!, month, selectedDay!));
        setIsMonthsGridVisible(false);
    };

    const handleDayClick = (day: number, selectedMonth: number, selectedYear: number, calendarIndex: number) => {
        if (selectedStartDate === null || selectedEndDate !== null) {
            setSelectedStartDate(null);
            setSelectedEndDate(null);
            setSelectedStartDate(day);
            setSelectedMonth(selectedMonth);
            setSelectedYear(selectedYear);
            setStartCalendarIndex(calendarIndex);
            setEndCalendarIndex(null);
        } else if (calendarIndex !== startCalendarIndex) {
            setSelectedEndDate(day);
            setEndCalendarIndex(calendarIndex);
        }
    };

    const formatDate = (date: Date) => {
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    const toggleMonthsAndYearsGrid = () => {
        if (isMonthsGridVisible) {
            setIsMonthsGridVisible(false);
            setIsYearsGridVisible(true);
        } else {
            setIsMonthsGridVisible(true);
            setIsYearsGridVisible(false);

        }
    };

    const handleNextYears = (isYearGrid: boolean) => {
        isYearGrid ? setStartYearIndex(startYearIndex + 20) : setCurrentDate(addMonths(currentDate, 1));
    };

    const handlePrevYears = (isYearGrid: boolean) => {
        isYearGrid ? setStartYearIndex(startYearIndex - 20) : setCurrentDate(subMonths(currentDate, 1));
    };

    const renderNavigationButtons = (handlePrevYears: (isYearGrid: any) => void, handleNextYears: (isYearGrid: any) => void, currentDate: Date, isYearGrid?: boolean) => {
        return (
            <div className='flex items-center justify-between px-1.5 pb-1.5'>
                <button className='border border-input h-7 w-7 rounded-md hover:bg-muted cursor-pointer ring-offset-background' onClick={() => handlePrevYears(isYearGrid)} disabled={isYearGrid && startYearIndex === 0}>
                    <Icon name="chevron-left-solid" className={cn(`h-3 w-3 opacity-40`)} />
                </button>

                <p className={`text-sm font-medium cursor-pointer ${isYearsGridVisible ? 'disabled' : ''}`} onClick={isYearsGridVisible ? undefined : toggleMonthsAndYearsGrid}>{formatDate(currentDate)}</p>

                <button className='border border-input h-7 w-7 rounded-md hover:bg-muted cursor-pointer ring-offset-background' onClick={() => handleNextYears(isYearGrid)} disabled={startYearIndex >= numberOfYears.length - 20}>
                    <Icon name="chevron-right-solid" className={cn(`h-3 w-3 opacity-40`)} />
                </button>
            </div>
        );
    };

    const renderYearsGrid = () => {
        const displayedYears = numberOfYears.slice(startYearIndex, startYearIndex + 20);
        return (
            <div className=' px-1 py-2.5'>
                {renderNavigationButtons(handlePrevYears, () => handleNextYears(true), currentDate, true)}
                <div className="grid grid-cols-4 gap-4 w-[17rem]">
                    {displayedYears.map((year: number) => (
                        <div
                            key={year}
                            className="text-center  py-2 text-sm font-normal cursor-pointer hover:bg-muted hover:rounded-lg"
                            onClick={() => handleYearClick(year)}
                        >
                            {year}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderMonthsGrid = () => {
        return (
            <div className='px-1 py-2.5'>
                {renderNavigationButtons(handlePrevYears, () => handleNextYears(true), currentDate)}
                <div className="grid grid-cols-3 gap-3 w-[17rem] h-[15.5rem]">
                    {monthOptions.map((month: string, index: number) => (
                        <div
                            key={index}
                            className=" py-1.5 text-center text-sm cursor-pointer h-10 w-14 flex items-center justify-center hover:bg-muted hover:rounded-lg"
                            onClick={() => handleMonthClick(index + 1)}
                        >
                            {month}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderCalendarGrid = (currentDate: Date, calendarIndex: number) => {
        const selectedYear = currentDate.getFullYear();
        const selectedMonth = currentDate.getMonth() + 1;

        if (selectedYear === null || selectedMonth === null) {
            return null;
        }
        const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
        const startingDayOfWeek = new Date(selectedYear, selectedMonth - 1, 1).getDay();
        const endingDaysOfWeek = (startingDayOfWeek + daysInMonth) % 7 !== 0 ? 7 - ((startingDayOfWeek + daysInMonth) % 7) : 0;
        const emptyCellsStart = new Array(startingDayOfWeek).fill(null);
        const emptyCellsEnd = new Array(endingDaysOfWeek).fill(null);
        const daysOfMonth = Array.from({ length: daysInMonth }, (_, index) => index + 1);
        const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

        const getAdjacentDate = (offset: number) => {
            const adjacentDate = new Date(selectedYear, selectedMonth - 1, offset);
            return adjacentDate.getDate();
        };
        const isInRange = (day: number) => {
            if (selectedStartDate !== null && selectedEndDate !== null) {
                const minDate = Math.min(selectedStartDate, selectedEndDate);
                const maxDate = Math.max(selectedStartDate, selectedEndDate);
                return day >= minDate && day <= maxDate;
            }
            return false;
        };

        const isStartDate = (day: number) => {
            return calendarIndex === startCalendarIndex && selectedStartDate !== null && day === selectedStartDate;
        };

        const isEndDate = (day: number) => {
            return calendarIndex === endCalendarIndex && selectedEndDate !== null && day === selectedEndDate;
        };

        return (
            <div className='px-2 py-1.5 w-[17.5rem]'>
                {renderNavigationButtons(handlePrevYears, () => handleNextYears(false), currentDate, false)}
                <div className="grid grid-cols-7 gap-2">
                    {weekdays.map((day: string) => (
                        <div key={day} className="text-center text-muted-foreground text-[0.8rem] font-normal p-1.5">{day}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 ">
                    {emptyCellsStart.map((_, index: number) => (
                        <div key={`empty-${index}`} className="text-center text-muted-foreground opacity-50 cursor-pointer text-sm px-1.5 py-2 my-1 font-normal">
                            {getAdjacentDate(-startingDayOfWeek + index)}
                        </div>
                    ))}
                    {daysOfMonth.map((day: number) => {
                        const inRange = isInRange(day);
                        const isStart = isStartDate(day);
                        const isEnd = isEndDate(day);

                        let cellClass = "text-center cursor-pointer text-sm py-2 my-1 font-normal";
                        if (numberOfMonths >= 2) {
                            if (inRange && !(isStart || isEnd)) {
                                cellClass += " h-9 w-9 px-5 flex items-center justify-center";
                            }
                            if (isStart || isEnd) {
                                cellClass += " bg-primary text-primary-foreground rounded-md h-9 w-9 flex items-center justify-center";
                            }
                            if (calendarIndex === startCalendarIndex && selectedStartDate !== null && day > selectedStartDate) {
                                cellClass += " bg-accent text-accent-foreground h-9 w-9 px-5 flex items-center justify-center";
                            }
                            if (calendarIndex === endCalendarIndex && selectedEndDate !== null && day < selectedEndDate) {
                                cellClass += " bg-accent text-accent-foreground h-9 w-9 px-5 flex items-center justify-center";
                            }
                        }

                        if (startDate && endDate && day >= startDate && day <= endDate) {
                            cellClass += " bg-accent text-accent-foreground h-9 w-9 px-5 flex items-center justify-center";
                        }

                        if (startDate && day === startDate) {
                            cellClass += " bg-primary text-primary-foreground z-10 rounded-md h-9 w-9 flex !px-0 items-center justify-center";
                        }

                        if (endDate && day === endDate) {
                            cellClass += " bg-primary text-primary-foreground z-10 rounded-md h-9 w-9 !px-0 flex items-center justify-center";
                        }

                        return (
                            <div
                                key={day}
                                className={cellClass}
                                onClick={() => handleDayClick(day, selectedMonth, selectedYear, calendarIndex)}
                            >
                                {day}
                            </div>
                        );
                    })}
                    {emptyCellsEnd.map((_, index: number) => (
                        <div key={`empty-end-${index}`} className="text-center text-muted-foreground opacity-50 cursor-pointer text-sm px-1.5 py-2 my-1 font-normal">
                            {getAdjacentDate(daysInMonth + index + 1)}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderCalendars = () => {
        const calendars = [];
        for (let i = 0; i < numberOfMonths; i++) {
            const isFirstCalendar = i === 0;
            const calendarStartDate = isFirstCalendar ? currentDate : addMonths(currentDate, i);
            calendars.push(
                <div key={i} className="py-1 rounded-lg">
                    {selectedYear === null && renderYearsGrid()}
                    {selectedYear !== null && selectedMonth === null && renderMonthsGrid()}
                    {selectedYear !== null && selectedMonth !== null ? (
                        <div className={cn("relative", { "start-calendar": i === startCalendarIndex, "end-calendar": i === endCalendarIndex })}>
                            {renderCalendarGrid(calendarStartDate, i)}
                        </div>
                    ) : null}
                </div>
            );
        }
        return calendars;
    };

    return (
        <>
            {isYearsGridVisible && renderYearsGrid()}
            {isMonthsGridVisible && renderMonthsGrid()}
            <div className='flex'>
                {!isYearsGridVisible && !isMonthsGridVisible && renderCalendars()}
            </div>
        </>
    );
};

CalenderPicker.displayName = "CalenderPicker";
export { CalenderPicker };
