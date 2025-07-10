// components/ui/timeline.tsx
import * as React from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "vertical" | "horizontal";
}

const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(
  ({ className, orientation = "vertical", children, ...props }, ref) => {
    const lineVerticalPosition = "16px";

    return (
      <div
        ref={ref}
        className={cn(
          "relative",
          orientation === "vertical"
            ? "space-y-6"
            : "flex overflow-x-auto pb-6 px-4",
          className
        )}
        {...props}
      >
        {orientation === "horizontal" && (
          <Separator
            className="absolute left-0 right-0 h-px bg-gray-300 dark:bg-gray-700 z-0"
            style={{ top: lineVerticalPosition }}
          />
        )}

        <ol className={cn(
          "flex min-w-max",
          orientation === "horizontal" ? "space-x-20" : "flex-col space-y-6",
          "items-start"
        )}>
          {React.Children.map(children, (child, idx) => {
            if (!React.isValidElement<TimelineItemProps>(child)) {
              return null;
            }
            return <li key={idx}>{child}</li>;
          })}
        </ol>
      </div>
    );
  }
);
Timeline.displayName = "Timeline";

interface TimelineItemProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  date: string;
  content?: string;
  maxTitleWidth?: number;
}

const TimelineItem = React.forwardRef<HTMLDivElement, TimelineItemProps>(
  ({ className, title, date, maxTitleWidth = 100, ...props }, ref) => {
    const defaultIcon = (
      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
        <div className="h-3 w-3 rounded-full bg-primary-foreground" />
      </div>
    );

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex flex-col items-center",
          "min-w-[100px] max-w-[180px]",
          className
        )}
        {...props}
      >
        <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full mb-2 z-10">
          {defaultIcon}
        </div>

        <div className="flex flex-col items-center text-center w-full">
          <div
            className="text-l font-medium mb-1 truncate w-full"
            title={title}
            style={{ maxWidth: `${maxTitleWidth}px` }}
          >
            {title}
          </div>
          <time className="text-sm text-muted-foreground">{date}</time>
        </div>
      </div>
    );
  }
);
TimelineItem.displayName = "TimelineItem";

export { Timeline, TimelineItem };