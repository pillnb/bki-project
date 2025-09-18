// file: c:/Users/vasky/bki-cv/src/components/SearchableSelect.tsx

import { Fragment, useState } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';

export type ComboboxOption = {
  value: string;
  label: string;
};

type SearchableSelectProps = {
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isLoading?: boolean; // 1. Tambahkan prop isLoading di sini
};

export default function SearchableSelect({ 
  options, 
  value, 
  onChange, 
  placeholder = "Pilih...", 
  isLoading = false // 2. Jadikan isLoading sebagai prop
}: SearchableSelectProps) {
  const [query, setQuery] = useState('');

  const selectedOption = options.find(option => option.value === value);

  const filteredOptions =
    query === ''
      ? options
      : options.filter((option) =>
          option.label
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        );
  
  const handleComboboxChange = (selectedValue: string | null) => {
    onChange(selectedValue ?? '');
  };

  return (
    // 3. Nonaktifkan komponen saat loading
    <Combobox value={value} onChange={handleComboboxChange} disabled={isLoading}>
      <div className="relative">
        <div className={`relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent ${isLoading ? 'bg-gray-100' : ''}`}>
          <Combobox.Input
            className="w-full border-none py-3 pl-3 pr-10 text-sm leading-5 text-black focus:ring-0 disabled:bg-gray-100"
            // 4. Tampilkan teks "Memuat data..." saat loading
            displayValue={() => isLoading ? 'Memuat data...' : selectedOption?.label || ''}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={placeholder}
            disabled={isLoading}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            {/* 5. Tampilkan ikon spinner saat loading */}
            {isLoading ? (
              <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
            ) : (
              <ChevronsUpDown
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            )}
          </Combobox.Button>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery('')}
        >
          <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-10">
            {isLoading ? (
              <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                Memuat data pegawai...
              </div>
            ) : filteredOptions.length === 0 && query !== '' ? (
              <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                Tidak ada hasil.
              </div>
            ) : (
              filteredOptions.map((option) => (
                <Combobox.Option
                  key={option.value}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-blue-600 text-white' : 'text-gray-900'
                    }`
                  }
                  value={option.value}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {option.label}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? 'text-white' : 'text-blue-600'
                          }`}
                        >
                          <Check className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
}