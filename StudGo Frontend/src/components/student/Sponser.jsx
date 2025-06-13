export default function Sponsor() {
    return (
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-center text-2xl font-semibold text-gray-900">
            Trusted by leading organizations in education, careers, and innovation
          </h2>
          <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
            <div className="col-span-2 max-h-20 w-full lg:col-span-1 flex items-center justify-center">
              <img
                alt="Wuzzuf"
                src="public/wuzzuf.png"
                width={200}
                height={100}
                className="max-h-20 object-contain"
              />
            </div>
            <div className="col-span-2 max-h-20 w-full lg:col-span-1 flex items-center justify-center">
              <img
                alt="Microsoft"
                src="public/microsoft.png"
                width={200}
                height={100}
                className="max-h-20 object-contain"
              />
            </div>
            <div className="col-span-2 max-h-20 w-full lg:col-span-1 flex items-center justify-center">
              <img
                alt="IEEE"
                src="public/ieee.png"
                width={200}
                height={100}
                className="max-h-20 object-contain"
              />
            </div>
            <div className="col-span-2 max-h-20 w-full sm:col-start-2 lg:col-span-1 flex items-center justify-center">
              <img
                alt="Google"
                src="public/google.png"
                width={200}
                height={100}
                className="max-h-20 object-contain"
              />
            </div>
            <div className="col-span-2 col-start-2 max-h-20 w-full sm:col-start-auto lg:col-span-1 flex items-center justify-center">
              <img
                alt="Nasa"
                src="public/nasa.png"
                width={200}
                height={100}
                className="max-h-20 object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
  