"use client";

import { useGetUsersQuery } from "@/state/api";
import Header from "@/app/(components)/Header";
import { GridColDef } from "@mui/x-data-grid";
import ThemedDataGrid from "@/app/(components)/ThemedDataGrid";

const columns: GridColDef[] = [
  { field: "userId", headerName: "ID", width: 90 },
  { field: "name", headerName: "Name", width: 200 },
  { field: "email", headerName: "Email", width: 200 },
];

const Users = () => {
  const { data: users, isError, isLoading } = useGetUsersQuery();

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !users) {
    return (
      <div className="text-center text-red-500 py-4">Failed to fetch users</div>
    );
  }

  return (
    <div className="flex flex-col">
      <Header name="Users" />
      <ThemedDataGrid
        rows={users}
        columns={columns}
        getRowId={(row) => row.userId}
        checkboxSelection
        className="shadow rounded-lg border mt-5"
      />
    </div>
  );
};

export default Users;