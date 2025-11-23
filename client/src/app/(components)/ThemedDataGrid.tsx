"use client";

import { DataGrid, DataGridProps } from "@mui/x-data-grid";
import { useAppSelector } from "@/app/redux";
import { ThemeProvider, createTheme } from "@mui/material/styles";

export default function ThemedDataGrid(props: DataGridProps) {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <DataGrid {...props} />
    </ThemeProvider>
  );
}