export default function Loader({ w = 12, h = 12 }) {
  return (
    <div
      style={{ width: `${w * 0.25}rem`, height: `${h * 0.25}rem` }} // Tailwind's scale: 1 = 0.25rem
      className="rounded-full border-4 border-t-transparent border-gray-500 animate-spin"
    ></div>
  );
}
