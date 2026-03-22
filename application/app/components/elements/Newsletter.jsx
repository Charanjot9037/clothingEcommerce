import Wrapper from "../atoms/Wrapper";
export default function Newsletter() {
  return (
    <Wrapper>
      <section className=" relative top-14 border-red-500 ">
        <div className="bg-black text-white rounded-3xl px-6 md:px-12 py-8 md:py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <h2 className="text-2xl md:text-4xl font-extrabold leading-tight text-center md:text-left">
            STAY UP TO DATE ABOUT <br className="hidden md:block" />
            OUR LATEST OFFERS
          </h2>

          <div className="flex flex-col gap-3 w-full md:w-auto">
            <div className="flex items-center bg-white rounded-full px-4 py-2 w-full md:w-[320px]">
              <span className="text-gray-400 mr-2">✉</span>
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full outline-none text-black text-sm"
              />
            </div>

            <button className="bg-white text-black rounded-full py-2 font-medium hover:bg-gray-200 transition">
              Subscribe to Newsletter
            </button>
          </div>
        </div>
      </section>
    </Wrapper>
  );
}
