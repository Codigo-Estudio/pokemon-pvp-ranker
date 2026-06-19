type IconName =
  | "check"
  | "close"
  | "chevronDown"
  | "chevronLeft"
  | "chevronRight"
  | "download"
  | "file"
  | "filter"
  | "search"
  | "upload"
  | "warning";

type Props = {
  name: IconName;
  size?: number;
};

const paths: Record<IconName, React.ReactNode> = {
  check: <path d="m5 12 4 4L19 6" />,
  close: <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  chevronLeft: <path d="m15 18-6-6 6-6" />,
  chevronRight: <path d="m9 18 6-6-6-6" />,
  download: <><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></>,
  file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6" /></>,
  filter: <path d="M4 5h16l-6.5 7.3V19l-3 1.5v-8.2Z" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  upload: <><path d="M12 16V4" /><path d="m7 9 5-5 5 5" /><path d="M5 20h14" /></>,
  warning: <><path d="M10.3 3.7 2.6 18a2 2 0 0 0 1.8 3h15.2a2 2 0 0 0 1.8-3L13.7 3.7a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></>
};

export default function Icon({ name, size = 20 }: Props) {
  return (
    <svg
      aria-hidden="true"
      className="icon"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
        {paths[name]}
      </g>
    </svg>
  );
}
