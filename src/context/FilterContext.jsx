import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useColleges } from '../controllers/collegesController';

export const FilterContext = createContext(null);

// ── Academic-year helpers ────────────────────────────────────────────────────
// Generates strings like ['2025-26', '2024-25', ...] anchored to the current
// calendar year.  Academic year starts in June, so before June we still show
// the previous cycle as "current".
function generateAYOptions(count = 4) {
  const now = new Date();
  const startYear = now.getMonth() >= 5 ? now.getFullYear() : now.getFullYear() - 1;
  return Array.from({ length: count }, (_, i) => {
    const y = startYear - i;
    return `${y}-${String(y + 1).slice(-2)}`;
  });
}

function generateBatchOptions(count = 4) {
  const now = new Date();
  const latest = now.getMonth() >= 5 ? now.getFullYear() + 1 : now.getFullYear();
  return Array.from({ length: count }, (_, i) => `Batch ${latest - i}`);
}

// ── Provider ─────────────────────────────────────────────────────────────────
export function FilterProvider({ children }) {
  const { user, isSuperAdmin } = useAuth();

  // Fetch colleges only when the logged-in user is a super-admin
  const { data: colleges = [], isLoading: collegesLoading } = useColleges(
    undefined,
    { enabled: isSuperAdmin }
  );

  const ayOptions    = useMemo(() => generateAYOptions(4), []);
  const batchOptions = useMemo(() => generateBatchOptions(4), []);

  // ── Selected college ───────────────────────────────────────────────────────
  // Super-admin: starts on the first college returned by the API.
  // College-admin: always pinned to their own college object.
  const [selectedCollege, setSelectedCollege] = useState(null);

  useEffect(() => {
    if (isSuperAdmin && colleges.length > 0 && !selectedCollege) {
      setSelectedCollege(colleges[0]);
    }
  }, [isSuperAdmin, colleges, selectedCollege]);

  useEffect(() => {
    if (!isSuperAdmin && user?.college) {
      setSelectedCollege(user.college);
    }
  }, [isSuperAdmin, user]);

  // ── AY / Batch ─────────────────────────────────────────────────────────────
  const [selectedAY,    setSelectedAY]    = useState(ayOptions[0]);
  const [selectedBatch, setSelectedBatch] = useState(batchOptions[0]);

  return (
    <FilterContext.Provider
      value={{
        // Colleges
        colleges,
        collegesLoading,
        selectedCollege,
        setSelectedCollege: isSuperAdmin ? setSelectedCollege : undefined,

        // Academic year
        ayOptions,
        selectedAY,
        setSelectedAY,

        // Batch
        batchOptions,
        selectedBatch,
        setSelectedBatch,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────────────────────
export function useFilters() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useFilters must be used within FilterProvider');
  return ctx;
}
