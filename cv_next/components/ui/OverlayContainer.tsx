export const OverlayBlur = ({
  blur = "1px",
  hoverBlur = true,
}: {
  blur?: string;
  hoverBlur?: boolean;
}) => (
  <div
    className={`gradient-blur-backdrop pointer-events-none absolute inset-0 rounded-lg backdrop-blur-[${blur}] ${
      hoverBlur ? "group-hover:backdrop-blur-none" : ""
    } transition`}
  />
);

export const OverlayContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <>
    <OverlayBlur blur="1px" />
    <div className="pointer-events-auto absolute bottom-0 left-0 right-0 z-20 p-6">
      <div className="rounded-t-xl bg-white/90 p-4 shadow">{children}</div>
    </div>
  </>
);
