import React from "react";

export default function CommentForm() {
  return (
    <section className={`flex w-full flex-col pb-3 text-white`}>
      <div className="flex w-full">
        <form className="flex w-full flex-col gap-2.5">
          <textarea
            name="comment"
            id="comment"
            placeholder="Tell us about you, maxs 150 character."
            className={`h-32 w-full rounded-md border border-[#F5F5F540] bg-[#686464] p-2 text-sm text-white transition-colors duration-300 placeholder:text-sm placeholder:font-bold placeholder:text-[#979797]`}
            defaultValue={""}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
              }
            }}
            required
          />
          <button
            type="submit"
            className={`flex w-full cursor-pointer items-center justify-center rounded-md border-2 border-[#F5F5F540] bg-[#0E5BA8] py-2 text-sm font-bold text-white`}
          >
            Kirim Komentar
          </button>
        </form>
      </div>
    </section>
  );
}
