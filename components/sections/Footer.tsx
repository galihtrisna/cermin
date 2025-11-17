export default function Footer() {
  return (
    <footer
      className="
        mt-32 py-10 text-center 
        text-[#344270] 
        border-t border-white/40 
        backdrop-blur-md 
        bg-white/10
      "
    >
      <p className="text-sm font-medium opacity-80">
        made with 💓 by{" "}
        <a
          href="https://instagram.com/kucingduduk_"
          target="_blank"
          className="underline-offset-4 hover:underline"
        >
          @kucingduduk_
        </a>
      </p>
    </footer>
  );
}
