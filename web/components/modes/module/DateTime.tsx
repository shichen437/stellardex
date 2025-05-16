"use client";

import { useState, useEffect } from 'react';
import dayjs from 'dayjs';

interface DateTimeProps {
  showClock: boolean;
  showCalendar: boolean;
  calendarFormat: 'YYYY-MM-DD' | 'MM/DD/YYYY' | 'DD.MM.YYYY' | 'YYYY年MM月DD日';
}

export function DateTime({ showClock, showCalendar, calendarFormat }: DateTimeProps) {
  const [currentTime, setCurrentTime] = useState<dayjs.Dayjs | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    setCurrentTime(dayjs());
    const timer = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);

    return () => clearInterval(timer);
  }, [mounted]);

  const formattedDate = () => {
    if (!currentTime) return '';
    return currentTime.format(`${calendarFormat} dddd`);
  };

  if (!showClock && !showCalendar) {
    return null;
  }

  if (!mounted) return null;

  return (
    <div className="text-center mb-6">
      {showClock && (
        <div className="text-4xl font-medium mb-2 text-gray-800 dark:text-gray-100">
          {currentTime ? currentTime.format('HH:mm:ss') : '--:--:--'}
        </div>
      )}
      {showCalendar && (
        <div className="text-lg text-gray-500 dark:text-gray-400 mt-1">
          {currentTime ? formattedDate() : ''}
        </div>
      )}
    </div>
  );
}

export default DateTime;