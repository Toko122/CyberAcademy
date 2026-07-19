import React from 'react';
import Link from 'next/link';
import LogoutButton from './LogoutButton';

const cards = [
  {
    title: 'Gallery',
    description: 'მართე საიტის გალერიის სურათები',
    href: '/admin/features/gallery',
    color: 'from-blue-500 to-blue-700',
  },
  {
    title: 'Courses',
    description: 'კურსების დამატება, რედაქტირება და წაშლა',
    href: '/admin/features/courses',
    color: 'from-emerald-500 to-emerald-700',
  },
  {
    title: 'Partners',
    description: 'პარტნიორი ორგანიზაციებისა და ბრენდების მართვა',
    href: '/admin/features/partners',
    color: 'from-violet-500 to-violet-700',
  },
  {
    title: 'Team',
    description: 'ადმინისტრაციის და მასწავლებლების მართვა',
    href: '/admin/features/group',
    color: 'from-amber-500 to-amber-700',
  },
];

const AdminDashboardComponent = () => {
  return (
    <div className="min-h-screen w-full bg-slate-950 py-8 sm:py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5 sm:gap-6">
          <div><h1 className="text-3xl md:text-4xl font-bold text-white">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-slate-300 text-sm md:text-base">
            აირჩიე ერთ-ერთი მოდული შიგთავსის სამართავად.
          </p></div>
          <div className="w-full sm:w-auto"><LogoutButton /></div>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group relative rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-950 p-[1px] shadow-lg shadow-slate-950/40 hover:border-slate-600 transition-colors"
            >
              <div className="relative h-full rounded-2xl bg-slate-950/80 p-5 flex flex-col">
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none`}
                />

                <div className="relative flex-1 flex flex-col">
                  <h2 className="text-lg font-semibold text-white mb-2">
                    {card.title}
                  </h2>
                  <p className="text-sm text-slate-300 mb-4">
                    {card.description}
                  </p>

                  <span className="mt-auto inline-flex items-center text-xs font-medium text-blue-300 group-hover:text-blue-200">
                    შედი პანელში
                    <span className="ml-1 transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardComponent;
