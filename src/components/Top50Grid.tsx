interface Top50GridProps {
  children: React.ReactNode;
}

function Top50Grid({ children }: Top50GridProps) {
  return (
    <div className="w-full grid gap-1 md:gap-2 grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 pt-2 px-2 sm:px-0 mb-24">
      {children}
    </div>
  );
}

export default Top50Grid;
