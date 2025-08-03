import { SurveyTypes } from "@/types/survey.interface";
import React, { createContext, ReactNode, useContext, useState } from "react";

export interface FilterState {
  selectedType: SurveyTypes | null;
}

interface FilterContextType {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  clearFilters: () => void;
  toggleFilterType: (type: SurveyTypes) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return context;
};

interface FilterProviderProps {
  children: ReactNode;
}

export const FilterProvider: React.FC<FilterProviderProps> = ({ children }) => {
  const [filters, setFilters] = useState<FilterState>({
    selectedType: null,
  });

  const clearFilters = () => {
    setFilters({
      selectedType: null,
    });
  };

  const toggleFilterType = (type: SurveyTypes) => {
    setFilters((prev) => ({
      ...prev,
      selectedType: prev.selectedType === type ? null : type,
    }));
  };

  return (
    <FilterContext.Provider
      value={{
        filters,
        setFilters,
        clearFilters,
        toggleFilterType,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};
