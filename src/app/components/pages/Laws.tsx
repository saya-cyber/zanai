import { useState } from "react";
import { Search, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "../ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Button } from "../ui/button";

const lawsData = [
{
  id: "labor",
  title: "Қазақстан Республикасының Еңбек кодексі",
  category: "Еңбек құқығы",
  description: "Жұмысшылар мен жұмыс берушілердің құқықтары мен міндеттері",
  sections: [
    // Бірінші сұрақ
    {
      title: "Жұмыстан заңсыз шығарып жіберсе не істеу керек?",
      content: "Егер жұмыс беруші қызметкерді заңсыз жұмыстан шығарса, қызметкер өз құқығын қорғау үшін бірнеше әрекет жасай алады:\n1. Жұмыстан шығару туралы бұйрықтың көшірмесін талап ету.\n2. Еңбек инспекциясына шағым беру.\n3. Сотқа жүгініп, жұмысқа қайта қабылдауды немесе өтемақы талап ету.\n\nҚазақстан Республикасының заңнамасына сәйкес, жұмыс беруші қызметкерді тек заңда көрсетілген негіздер бойынша ғана жұмыстан шығара алады.",
      source: "Қазақстан Республикасының Еңбек кодексі, 52-бап — еңбек шартын жұмыс берушінің бастамасы бойынша бұзу негіздері."
    },
    // Екінші сұрақ (жаңа)
    {
      title: "Жалақы кешіктірілсе не істеу керек?",
      content: "Жұмыс беруші қызметкерге жалақыны уақытында төлеуге міндетті. Егер жалақы кешіктірілсе:\n1. Жұмыс берушіге жазбаша түрде жүгіну.\n2. Еңбек инспекциясына шағым беру.\n3. Сот арқылы жалақыны өндіріп алу.",
      source: "Қазақстан Республикасының Еңбек кодексі, 113-бап — жалақы төлеу тәртібі."
    }
  ]
},
  {
  id: "family",
  title: "Қазақстан Республикасының Неке және отбасы туралы кодексі",
  category: "Отбасы құқығы",
  description: "Неке, ажырасу және алимент мәселелері",
  sections: [
    {
      title: "Ажырасу қалай рәсімделеді?",
      content: "Егер ерлі-зайыптылар ажырасуға келіссе және ортақ кәмелетке толмаған балалары болмаса, ажырасу тіркеу органында (АХАТ) рәсімделеді. Егер балалар болса немесе келісім болмаса, ажырасу сот арқылы жүргізіледі.",
      source: "Қазақстан Республикасының Неке (ерлі-зайыптылық) және отбасы туралы кодексі, 16–17-баптар — некені бұзу тәртібі."
    },
    {
      title: "Алимент төленбесе не істеу керек?",
      content: "Егер алимент төленбесе:\n1. Сот орындаушысына жүгіну.\n2. Борышкердің мүлкіне немесе табысына өндіріп алу қолданылуы мүмкін.\n3. Қасақана төлемеген жағдайда әкімшілік немесе қылмыстық жауапкершілік қарастырылуы мүмкін.",
      source: "Қазақстан Республикасының Неке және отбасы туралы кодексі, 139-бап — алимент төлеу міндеті."
    }
  ]
},
  {
  id: "housing",
  title: "Тұрғын үй қатынастары",
  category: "Тұрғын үй құқығы",
  description: "Жалдау шарты және тараптардың құқықтары",
  sections: [
    {
      title: "Пәтерді жалға алу келісімшарты міндетті ме?",
      content: "Пәтерді жалға алу кезінде жалға беруші мен жалға алушы арасында жазбаша келісімшарт жасалғаны дұрыс. Бұл екі тараптың құқықтары мен міндеттерін анықтайды және дау туындаған жағдайда дәлел ретінде қолданылады.",
      source: "Қазақстан Республикасының Азаматтық кодексі, 540-бап — мүлікті жалға алу шарты."
    },
    {
      title: "Үй иесі жалға алушыны бірден шығара ала ма?",
      content: "Жалға беруші жалға алушыны бірден шығара алмайды. Егер келісімшарт талаптары бұзылса немесе мерзімі аяқталса, мәселе заңға сәйкес шешіледі. Кей жағдайда мәселе тек сот арқылы ғана шешілуі мүмкін.",
      source: "Қазақстан Республикасының Азаматтық кодексі, 556-бап — жалдау шартын бұзу тәртібі."
    }
  ]
},
  {
  id: "administrative",
  title: "Айыппұлдар және әкімшілік құқық",
  category: "Әкімшілік құқық",
  description: "Әкімшілік жауапкершілік және айыппұлдар",
  sections: [
    {
      title: "Айыппұлды қанша уақыт ішінде төлеу керек?",
      content: "Әкімшілік айыппұл белгіленген мерзімде төленуі тиіс. Егер айыппұл уақытында төленбесе, ол мәжбүрлеп өндіріп алынуы мүмкін.",
      source: "Қазақстан Республикасының Әкімшілік құқық бұзушылық туралы кодексі, 893-бап — әкімшілік айыппұлды төлеу тәртібі."
    },
    {
      title: "Айыппұлға шағым жасауға бола ма?",
      content: "Иә, азамат әкімшілік айыппұл туралы қаулыға шағым жасай алады. Шағымды жоғары тұрған органға немесе сотқа беруге болады.",
      source: "Қазақстан Республикасының Әкімшілік құқық бұзушылық туралы кодексі, 826-бап — әкімшілік іс бойынша шағым жасау құқығы."
    }
  ]
},
];

export function Laws() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(lawsData.map(law => law.category)));

  const filteredLaws = lawsData.filter(law => {
    const matchesSearch = law.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         law.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || law.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <BookOpen className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl mb-4">Қазақстан Республикасының заңдары</h1>
          <p className="text-xl text-gray-600">
            Негізгі заңдар түсінікті және қарапайым тілде
          </p>
        </div>

        {/* Search and filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Заңдарды іздеу..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              size="sm"
            >
              Барлығы
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Laws list */}
        <div className="space-y-6">
          {filteredLaws.map(law => (
            <Card key={law.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="mb-2">{law.title}</CardTitle>
                    <CardDescription>{law.description}</CardDescription>
                  </div>
                  <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full whitespace-nowrap ml-4">
                    {law.category}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {law.sections.map((section, index) => (
                    <AccordionItem key={index} value={`section-${index}`}>
                      <AccordionTrigger>{section.title}</AccordionTrigger>
                      <AccordionContent>
  <div className="space-y-4">
    {/* Толық жауап */}
    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
      {section.content}
    </p>
    
    {/* Дереккөз блогы */}
    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
      <p className="text-sm text-blue-900">
        <strong className="block mb-1">Дереккөз:</strong> 
        {section.source}
      </p>
    </div>
  </div>
</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredLaws.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Іздеу бойынша нәтиже табылмады</p>
          </div>
        )}
      </div>
    </div>
  );
}
