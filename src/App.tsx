import { Header } from "./components/Header";
import { ErrorCard } from "./components/ErrorCard";
import { PlayerTable } from "./components/PlayerTable";
import { usePlayersTable } from "./hooks/usePlayersTable";

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
    rowClassName,
  } = usePlayersTable();

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
      />
    </div>
  );
};

export default App;
