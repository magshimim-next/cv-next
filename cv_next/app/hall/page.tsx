const contributors = [
  { name: "Alice", contribution: "Frontend Development" },
  { name: "Bob", contribution: "Backend Development" },
  { name: "Charlie", contribution: "UI/UX Design" },
  // Add more contributors as needed
];

const hall: React.FC = () => {
  return (
    <div className="relative mx-auto h-full w-[700px] max-w-full xl:w-[1400px]">
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h1 style={{ fontSize: "2.5em", marginBottom: "20px" }}>
          A Huge Thank You to Our Contributors
        </h1>
        <ul>
          <div className="justify-center xl:flex">
            <div
              id="grid-container"
              className="w450:grid-cols-1 w450:gap-7 grid w-full grid-cols-2 gap-10 md:grid-cols-3 xl:w-1/2 xl:pb-16"
            >
              {contributors.map((contributor, index) => (
                <a
                  key={index}
                  target="_blank"
                  className="rounded-base mb-3 rounded-lg border-2 border-b border-gray-200 bg-white p-6 text-base dark:bg-theme-800"
                  style={{
                    borderColor: "#000",
                    boxShadow: "4px 4px 0px 0px #000",
                    transform: "translate(4px, 4px)",
                  }}
                >
                  <p
                    className="mt-3 text-lg sm:text-xl"
                    style={{ fontWeight: "700" }}
                  >
                    {contributor.name}
                  </p>
                  <p
                    className="mt-1 text-sm sm:text-base"
                    style={{ fontWeight: "500" }}
                  >
                    {contributor.contribution}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default hall;
