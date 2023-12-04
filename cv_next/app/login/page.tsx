export default function Page() {
  return (
    <main>
      <div>
        <h1 className="bg-blue-300 relative p-2 text-xl">
          Select login method
        </h1>
      </div>
      <div className="flex flex-row gap-x-64">
        <div>
          <button className="bg-blue-300 relative p-2 text-xl mr-auto">Google</button>
        </div>
        <div>
          <button className="bg-blue-300 relative p-2 text-xl ml-auto">Twitter</button>
        </div>
      </div>
    </main>
  );
}
