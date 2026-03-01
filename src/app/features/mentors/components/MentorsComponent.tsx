import React from 'react'

interface Mentor {
  id: number
  name: string
  role: string
  description: string
  image: string
}

const mentors: Mentor[] = [
  {
    id: 1,
    name: "დემიდ ფასიეშვილი",
    role: "აკადემიის დამფუძნებელი",
    description: "",
    image: "/mentors1.jpeg",
  },
  {
    id: 2,
    name: "ზურაბ მესხიძე",
    role: "აკადემიის დამფუძნებელი",
    description: "",
    image: "/mentors3.jpeg",
  },
  {
    id: 3,
    name: "კახი კახიძე",
    role: "სტაჟირების პროგრამის მენეჯერი",
    description: "",
    image: "/kaxi.jpg",
  },
  {
    id: 4,
    name: "სოფიო დუმბაძე",
    role: "აკადემიის მასწავლებელი",
    description: "",
    image: "/mentorsofio.jpg",
  },
  {
    id: 5,
    name: "სოფია სურმანიძე",
    role: "მოდის დიზაინის მენეჯერი",
    description: "",
    image: "/sofia.jpg",
  },
  {
    id: 6,
    name: "დიანა ანანიძე",
    role: "აკადემიის მასწავლებელი",
    description: "",
    image: "/mentordiana.jpg",
  },
]

const MentorsComponent = () => {
  return (
    <section className="bg-[#0F172A] pb-30 pt-38 px-6">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl text-white font-bold mb-4">
            ჩვენი <span className="text-cyan-500">მენტორები</span>
          </h2>
          <div className="h-1.5 w-20 bg-cyan-500 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {mentors.map((mentor) => (
            <div 
              key={mentor.id} 
              className="group relative h-[450px] w-full overflow-hidden rounded-2xl bg-slate-800"
            >
              <img
                src={mentor.image}
                alt={mentor.name}
                /* hover: პრეფიქსი უზრუნველყოფს რომ ეფექტი მხოლოდ მაუსის დროს ჩაირთოს */
                className="h-full w-full object-cover transition-transform duration-500 lg:group-has-[:hover]:scale-110"
              />

              {/* ფონი: მობილურზე (სტატიკურად) მუქია, დესკტოპზე ჰოვერამდე უფრო გამჭვირვალე */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-100 lg:opacity-60 lg:group-hover:opacity-90 transition-opacity duration-300" />

              {/* ტექსტი: მობილურზე default-ად ჩანს ბოლოში, დესკტოპზე (lg) იმალება/ჩადის დაბლა */}
              <div className="absolute inset-x-0 bottom-0 p-6 transition-transform duration-500 ease-out translate-y-0 lg:translate-y-[60%] lg:group-hover:translate-y-0">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-white">{mentor.name}</h3>
                  <p className="text-cyan-400 font-medium">{mentor.role}</p>
                </div>
                
                {/* აღწერა: მობილურზე ჩანს, დესკტოპზე მხოლოდ ჰოვერზე */}
                <div className="transition-opacity duration-500 opacity-100 lg:opacity-0 lg:group-hover:opacity-100">
                  {mentor.description && (
                    <p className="text-gray-300 text-sm leading-relaxed border-t border-white/10 pt-4">
                      {mentor.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  )
}

export default MentorsComponent