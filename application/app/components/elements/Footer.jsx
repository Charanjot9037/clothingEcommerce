import FooterColumn from "../atoms/FooterColumn";
import Image from "next/image";
import {
  footerSections,
  paymentMethods,
  socialIcons,
} from "../../constants/footer";
import Wrapper from "../atoms/Wrapper";

export default function Footer() {
  return (
    <div className="bg-gray-100 py-10">
      <Wrapper>
        <footer className="text-gray-600">
          {/* Main Footer */}
          <div className="py-12 grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Brand */}
            <div>
              <Image
                src={"/global/logo.svg"}
                alt="logo"
                width={160}
                height={60}
              />

              <p className="text-sm pt-4 mb-4">
                We have clothes that suits your style and which you are proud to
                wear. From women to men.
              </p>

              {/* Social Icons */}
              <div className="flex gap-3">
                {socialIcons.map((icon) => (
                  <div
                    key={icon.name}
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
                        ${icon.name === "facebook" ? "invert" : "group-hover:invert"}
                      `}
                    />
                  </div>
                ))}
              </div>
            </div>{" "}
            {/* ✅ FIX: closed brand div */}
            {/* Columns */}
            {footerSections.map((section) => (
              <FooterColumn
                key={section.title}
                title={section.title}
                items={section.items}
              />
            ))}
          </div>

          {/* Bottom */}
          <div className="border-t border-gray-300 py-4 flex flex-col md:flex-row justify-between items-center text-sm">
            <p>Shop.co © {new Date().getFullYear()}, All Rights Reserved</p>

            {/* Payment Icons */}
            <div className="flex gap-3 mt-3 md:mt-0">
              {paymentMethods.map((src) => (
                <Image
                  key={src}
                  src={src}
                  alt="payment"
                  width={50}
                  height={30}
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
