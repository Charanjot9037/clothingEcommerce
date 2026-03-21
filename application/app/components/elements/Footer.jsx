import FooterColumn from "../atoms/FooterColumn";
import Image from "next/image";
import Wrapper from "../atoms/Wrapper";
import { footerData } from "../../constants/footer";

export default function Footer() {
  return (
    <div className="bg-gray-100 py-10">
      <Wrapper>
        <footer className="text-gray-600">
          {/* Main Footer */}
          <div className="py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8  sm:text-left">
            <div className="flex flex-col items-start">
              <Image
                src="/global/logo.svg"
                alt="logo"
                width={160}
                height={60}
              />

              <p className="text-sm pt-4 mb-4 max-w-xs">
                We have clothes that suits your style and which you are proud to
                wear. From women to men.
              </p>

              {/* Social Icons */}
              <div className="flex gap-3 justify-center sm:justify-start">
                {footerData.social.map((icon) => (
                  <a key={icon.name} href={icon.link}>
                    <div
                      className={`w-9 h-9 flex items-center justify-center border rounded-full transition group cursor-pointer
                        ${icon.name === "facebook" ? "bg-black" : "bg-white"}
                        ${icon.name === "facebook" ? "" : "hover:bg-black"}
                      `}
                    >
                      <Image
                        src={icon.src}
                        alt={icon.name}
                        width={16}
                        height={16}
                        className={`object-contain transition
                          ${
                            icon.name === "facebook"
                              ? "invert"
                              : "group-hover:invert"
                          }
                        `}
                      />
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Columns */}
            {footerData.sections.map((section) => (
              <FooterColumn
                key={section.title}
                title={section.title}
                items={section.items}
              />
            ))}
          </div>

          {/* Bottom */}
          <div className="border-t border-gray-300 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <p className="text-sm">
              Shop.co © {new Date().getFullYear()}, All Rights Reserved
            </p>

            {/* Payment Icons */}
            <div className="flex flex-wrap justify-center md:justify-end gap-3">
              {footerData.payments.map((item) => (
                <Image
                  key={item.name}
                  src={item.src}
                  alt={item.name}
                  width={60}
                  height={50}
                  className="object-contain"
                />
              ))}
            </div>
          </div>
        </footer>
      </Wrapper>
    </div>
  );
}
