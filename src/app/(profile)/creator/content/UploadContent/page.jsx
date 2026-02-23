import Footer from "@/components/Footer/MainFooterEntertaint";
import FormUploadContentPage from "@/components/FormUploadContent/page";
import NavbarLogin from "@/components/NavbarLogin/page";

/* eslint-disable react/react-in-jsx-scope */
export default function UploadContentPage() {
  return (
    <div className="top-0 right-0 bottom-0 left-0 flex h-screen w-screen flex-col overflow-x-hidden overflow-y-auto">
      <NavbarLogin />
      <main className="mx-5">
        <FormUploadContentPage />
      </main>
      <Footer />
    </div>
  );
}
