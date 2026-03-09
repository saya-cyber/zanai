import { Link } from "react-router";
import { Scale, MessageSquare, FileText, BookOpen } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

export function Home() {
  return (
    <div>
      {/* Hero section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl mb-6">
              Zanai
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Заңгер қызметі енді онлайн қолжетімді. 
              Сұрақ қойыңыз, жауап алыңыз, құжат дайындаңыз. Жылдам әрі заңды.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/laws">
                <Button size="lg" variant="outline" className="gap-2 bg-white text-gray-900 hover:bg-gray-100">
                  <Scale className="w-5 h-5" />
                  Заңдарды оқу
                </Button>
              </Link>
              <Link to="/ai-consultant">
                <Button size="lg" variant="outline" className="gap-2 bg-white text-blue-600 hover:bg-gray-100">
                  <MessageSquare className="w-5 h-5" />
                  Сұрақ қою
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

     {/* Features section */}
<section className="py-16 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-3xl text-center mb-12">Біздің мүмкіндіктер</h2>
    
    {/* grid-cols-3-ті 2-ге өзгерттік */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <Scale className="w-12 h-12 text-blue-600 mb-4" />
          <CardTitle>Заңдар түсінікті тілде</CardTitle>
          <CardDescription>
            Қазақстан Республикасының негізгі заңдары қарапайым және түсінікті тілмен жазылған
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/laws">
            <Button variant="link" className="px-0">
              Заңдарды оқу →
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <MessageSquare className="w-12 h-12 text-blue-600 mb-4" />
          <CardTitle>ЖИ Заң кеңесшісі</CardTitle>
          <CardDescription>
            Жасанды интеллект сіздің мәселеңізді талдап, заң жүзінде шешім ұсынады
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/ai-consultant">
            <Button variant="link" className="px-0">
              Кеңес алу →
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  </div>
</section>

      {/* About section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-center mb-6">
              <BookOpen className="w-16 h-16 text-blue-600" />
            </div>
            <h2 className="text-3xl text-center mb-6">Zanai туралы</h2>
            <p className="text-lg text-center text-gray-700 mb-6">
              Zanai – бұл дәстүрлі заңгерден 10 есе арзан және 100 есе жылдам жұмыс істейді.<br /> Біз күрделі заң терминдерін түсінікті тілге аударып, жасанды интеллект арқылы кеңес беріп, құжат жазуға көмектесеміз.
            </p>
            <div className="text-center">
              <Link to="/ai-consultant">
                <Button size="lg" className="gap-2">
                  <Scale className="w-5 h-5" />
                  Zanai-дан сұрау
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}