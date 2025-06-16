"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";

import "react-day-picker/dist/style.css";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  // 'classNames' prop을 여기서 삭제했다.
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <div>
      <style>{`
        .rdp {
          --rdp-cell-size: 40px;
          --rdp-accent-color: #D1B681; /* accent-gold */
          --rdp-background-color: #CABCE0; /* accent-lavender */
          --rdp-accent-color-dark: #D1B681;
          --rdp-background-color-dark: #CABCE0;
          border-radius: 0.5rem;
          border: 1px solid #F6F4F120;
          background-color: #1B1F2A;
        }
        .rdp-head_cell, .rdp-day {
          color: #F6F4F1;
        }
        .rdp-caption_label, .rdp-nav_button {
          color: #F6F4F1;
        }
        .rdp-day_outside {
          color: #BFC1C5;
        }
      `}</style>
      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn("p-3", className)}
        // 여기서도 classNames를 사용하지 않으므로 props에서 제거했다.
        {...props}
      />
    </div>
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
