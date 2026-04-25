import { useState, useEffect } from 'react';
import { useDebounce } from '../../hooks/useDebounce.ts';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = 'Search products…',
}: SearchInputProps) {
  const [local, setLocal] = useState<string>(value ?? '');
  const debounced = useDebounce(local, 400);

  useEffect(() => {
    onChange(debounced);
  }, [debounced, onChange]);

  return (
    <div className="field" style={{ marginBottom: 0, flex: 1 }}>
      <label htmlFor="search-input" className="sr-only">
        Search products
      </label>
      <input
        id="search-input"
        type="search"
        data-testid="search-input"
        placeholder={placeholder}
        value={local}
        onChange={(e) => setLocal(e.target.value)}
      />
    </div>
  );
}
