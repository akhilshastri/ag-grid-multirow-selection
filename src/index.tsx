"use client";

import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  StrictMode,
} from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  RowSelectionModule,
  RowSelectionOptions,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  RowGroupingModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  RowSelectionModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const gridApi = useRef<GridApi | null>(null);
  const [count, setCount] = useState(0);

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "athlete" },
    { field: "sport" },
    { field: "year", maxWidth: 120 },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 100,
    };
  }, []);
  const rowSelection = useMemo<
    RowSelectionOptions | "singleRow" | "multiple"
  >(() => {
    return {
      mode: "multiRow",
      checkboxes: false,
      headerCheckbox: false,
      enableClickSelection: true,
    };
  }, []);

  const onGridReady: GridOptions<IOlympicData>["onGridReady"] = (param) => {
    gridApi.current = param.api;
    console.log("debugger", "load", param.api);
  };
  const onSelectionChanged = () => {
    console.log(
      "debugger",
      gridApi.current,
      gridApi.current?.getSelectedRows()
    );
    if (gridApi) setCount(gridApi.current?.getSelectedRows().length);
  };

  const { data, loading } = useFetchJson<IOlympicData>(
    "https://www.ag-grid.com/example-assets/small-olympic-winners.json"
  );

  return (
    <div style={containerStyle}>
      <div>selected rows : {count}</div>
      <div style={gridStyle}>
        <AgGridReact<IOlympicData>
          onGridReady={onGridReady}
          rowData={data}
          loading={loading}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowSelection={rowSelection}
          onSelectionChanged={onSelectionChanged}
        />
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>
);
