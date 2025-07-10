/* eslint-disable react/react-in-jsx-scope */
export default function ButtonRegister() {
  return (
    <div className="my-5 flex flex-col gap-3 py-5 text-white">
      <button
        className="rounded-md bg-blue-600 p-2 py-1.5 font-mono text-xl hover:bg-blue-700"
        type="button"
      >
        Sign Up
      </button>
      <button
        className="rounded-md bg-blue-400 p-2 py-1.5 font-mono text-xl hover:bg-blue-500"
        type="button"
      >
        Sign Up with Google
      </button>
    </div>
  );
}
