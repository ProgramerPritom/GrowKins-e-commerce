import React from 'react';
import type { OrderTimelineEvent } from '../../../types/admin';
import { StatusBadge } from './StatusBadge';

interface OrderTimelineProps {
  events: OrderTimelineEvent[];
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ events }) => {
  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {events.map((event, eventIdx) => {
          const isLast = eventIdx === events.length - 1;

          return (
            <li key={event.id || eventIdx}>
              <div className="relative pb-8">
                {!isLast && (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-[#E8E0D2]"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex space-x-3 items-start">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-[#E7EDFB] text-[#1C4CB8] flex items-center justify-center ring-4 ring-white">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#1C4CB8]" />
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-[#24221F]">{event.title}</p>
                      <time className="text-[11px] text-[#8C8478]">{event.timestamp}</time>
                    </div>

                    <div className="mt-1 flex items-center gap-2">
                      <StatusBadge status={event.status} size="sm" />
                      <span className="text-[11px] text-[#7D766C]">by {event.actor}</span>
                    </div>

                    {event.description && (
                      <p className="mt-1.5 text-xs text-[#635E55] bg-[#FAF7F1] p-2.5 rounded-xl border border-[#E8E0D2]/60">
                        {event.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
