export default function HomePage() {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="mx-auto w-full max-w-2xl rounded-3xl border p-6 shadow-2xl">
        <div className="mb-6 text-center">
          <div className="mb-4 inline-block rounded-full bg-blue-100 px-4 py-2 text-xs font-semibold tracking-wide text-blue-700 shadow">
            Mobile Demo
          </div>
          <h1 className="mb-2 text-4xl font-extrabold text-primary drop-shadow-sm">
            Hamilton Aviator
          </h1>
          <div className="mx-auto max-w-lg">
            <p className="mt-2 text-base font-extralight text-muted-foreground">
              A walkthrough of the mobile app built with React Native &amp; Expo
            </p>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="flex h-[680px] w-[330px] items-center justify-center overflow-hidden rounded-[55px] bg-black shadow-xl">
            <video
              muted
              autoPlay
              playsInline
              loop
              controls
              className="h-full w-full object-cover"
              style={{ objectPosition: "center" }}
            >
              <source src="/api/video" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </div>
  );
}
