import PartnersComponent from "./components/PartnersComponent";
import Link from "next/link";
import { listPartners } from "@/lib/repositories/content";

export const revalidate = 60;
export const dynamic = "force-dynamic";

export default async function PartnersPage() {
  const rawPartners = await listPartners(50);
  const partners = rawPartners.map((partner) => ({
    id: partner.id,
    name: partner.name,
    logo: partner.logo,
    color: partner.color || "",
  }));

  return (
    <main className="min-h-screen bg-[#020617] pt-16 sm:pt-20 lg:pt-24 pb-12">
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4 max-w-2xl">
            <span className="text-cyan-400 font-mono text-sm tracking-widest uppercase block mb-4">
              ჩვენი პარტნიორები
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-[1.1]">
              ვისთან <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                ვთანამშრომლობთ
              </span>
            </h1>
          </div>

          <div>
            <Link href="/" passHref>
              <span className="flex min-h-11 w-full sm:w-auto items-center justify-center px-6 sm:px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-full border border-white/10 transition-all backdrop-blur-md shadow-lg cursor-pointer">
                მთავარი გვერდი
              </span>
            </Link>
          </div>
        </div>

        <PartnersComponent partners={partners} />
      </div>
    </main>
  );
}
