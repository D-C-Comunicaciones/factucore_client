"use client";

import * as React from "react";
import { SortDesc, Calendar, MoreHorizontal } from "lucide-react";

export type FilterOption = {
  value: string;
  label: string;
  icon: React.ElementType;
};

export const RETURN_FILTER_OPTIONS: FilterOption[] = [
  { value: "numero",  label: "Número",           icon: SortDesc       },
  { value: "fecha",   label: "Fecha de creación", icon: Calendar       },
  { value: "estado",  label: "Estado DIAN",       icon: MoreHorizontal },
];
