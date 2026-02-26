import { Header } from "./components/Header";
import { ErrorCard } from "./components/ErrorCard";
import { PlayerTable } from "./components/PlayerTable";
import { usePlayersTable, PAGE_SIZE_OPTIONS } from "./hooks/usePlayersTable";

// Thin shell — all data logic lives in usePlayersTable, UI in child components
const App = () => {
  const {
    table,
    totalPlayers,
    totalPages,
    currentPage,
    isLoading,
    isError,
    error,
    searchTerm,
    handleSearchChange,
    pageSize,
    handlePageSizeChange,
    rowClassName,
    refetch,
  } = usePlayersTable();

  // Early return: show error card with retry when API is unreachable
  if (isError) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return <ErrorCard message={message} />;
  }

  return (
    <div className="bg-mesh flex h-screen flex-col overflow-hidden">
      <Header />
      <PlayerTable
        table={table}
        totalPlayers={totalPlayers}
        totalPages={totalPages}
        currentPage={currentPage}
        isLoading={isLoading}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        rowClassName={rowClassName}
        onRefresh={refetch}
        pageSize={pageSize}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
};

export default App;
