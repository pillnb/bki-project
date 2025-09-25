import React from 'react';
import { User } from 'lucide-react';

type Props = { onDuty: number; ready: number; total: number };

export function SummaryCards({ onDuty, ready, total }: Props) {
  const cards = [
    { label: 'On Duty', value: onDuty, color: 'red' },
    { label: 'Ready', value: ready, color: 'green' },
    { label: 'Total Personel', value: total, color: 'blue' },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map(card => (
        <div key={card.label} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg bg-${card.color}-100`}>
              <User className={`h-6 w-6 text-${card.color}-600`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{card.label}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}