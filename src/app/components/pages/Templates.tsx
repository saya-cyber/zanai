import { useState } from "react";
import { FileText, Download, Copy, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { toast } from "sonner";

interface Template {
  id: string;
  title: string;
  description: string;
  category: "complaint" | "application";
  fields: TemplateField[];
  template: string;
}

interface TemplateField {
  id: string;
  label: string;
  placeholder: string;
  type: "text" | "textarea" | "date";
}

const templates: Template[] = [
  {
    id: "labor-complaint",
    title: "Еңбекақы төленбеген туралы шағым",
    description: "Жұмыс беруші еңбекақыны уақытында төлемеген жағдайда",
    category: "complaint",
    fields: [
      { id: "fullName", label: "Толық аты-жөніңіз", placeholder: "Иванов Иван Иванович", type: "text" },
      { id: "address", label: "Мекенжайыңыз", placeholder: "Алматы қ., Абай даңғылы 1", type: "text" },
      { id: "phone", label: "Телефон нөміріңіз", placeholder: "+7 (777) 123-45-67", type: "text" },
      { id: "employer", label: "Жұмыс берушінің атауы", placeholder: "\"Компания\" ЖШС", type: "text" },
      { id: "employerAddress", label: "Жұмыс берушінің мекенжайы", placeholder: "Алматы қ., Достық даңғылы 10", type: "text" },
      { id: "amount", label: "Төленбеген еңбекақы сомасы", placeholder: "250 000 теңге", type: "text" },
      { id: "period", label: "Кезеңі", placeholder: "Қаңтар 2026", type: "text" },
      { id: "details", label: "Қосымша мәліметтер", placeholder: "Мысалы: еңбек шартының нөмірі, төлем күні т.б.", type: "textarea" }
    ],
    template: `Еңбек инспекциясына

ШАҒЫМ

Мен, {fullName}, {address} мекенжайында тұратын азамат, {employer} ұйымында жұмыс істеймін. 

{period} кезеңі үшін {amount} мөлшерінде еңбекақым уақытында төленбеді. Еңбек кодексінің талаптарына сәйкес, еңбекақы айына екі рет - алдын ала төлем және түпкілікті төлем түрінде берілуі тиіс.

Жұмыс беруші: {employer}
Мекенжайы: {employerAddress}

{details}

Қазақстан Республикасының Еңбек кодексінің 113-бабына сәйкес, еңбекақыны уақытында төлемегені үшін жұмыс беруші жауапты болады.

Сұраймын:
1. {employer} ұйымына тексеру жүргізуді;
2. Менің төленбеген еңбекақымды өндіруді;
3. Жұмыс берушіні әкімшілік жауапкершілікке тартуды.

Құжаттар қоса беріледі:
1. Еңбек шартының көшірмесі
2. Жұмыс орнының анықтамасы
3. Басқа да дәлелдемелер

Күні: {date}
Қолы: _______________
{fullName}`
  },
  {
    id: "housing-complaint",
    title: "Тұрғын үй жағдайы туралы шағым",
    description: "Тұрғын үйдің жағдайы санитарлық нормаларға сәйкес келмейтін жағдайда",
    category: "complaint",
    fields: [
      { id: "fullName", label: "Толық аты-жөніңіз", placeholder: "Иванов Иван Иванович", type: "text" },
      { id: "address", label: "Тұрғын үйдің мекенжайы", placeholder: "Алматы қ., Абай даңғылы 1, 15-үй", type: "text" },
      { id: "phone", label: "Телефон нөміріңіз", placeholder: "+7 (777) 123-45-67", type: "text" },
      { id: "problem", label: "Мәселенің сипаттамасы", placeholder: "Мысалы: жылу жоқ, су ағып жатыр, шатыр ағады", type: "textarea" },
      { id: "duration", label: "Мәселе қашан басталды", placeholder: "2 айдан бері", type: "text" },
      { id: "management", label: "Үй басқармасының атауы", placeholder: "\"КСК-15\" ТОО", type: "text" }
    ],
    template: `Санитарлық-эпидемиологиялық қызметке

ШАҒЫМ

Мен, {fullName}, {address} мекенжайында тұратын азамат, тұрғын үйдің санитарлық жағдайы туралы шағыммен жүгінемін.

Мәселенің сипаттамасы:
{problem}

Бұл жағдай {duration} жалғасуда. Үй басқармасы ({management}) бірнеше рет өтініш жасағанымызға қарамастан, шаралар қолданған жоқ.

Тұрғын үйдің қазіргі жағдайы санитарлық нормалар мен ережелерге сәйкес келмейді және тұрғындардың денсаулығына қауіп төндіреді.

Сұраймын:
1. {address} мекенжайы бойынша тұрғын үй жағдайына тексеру жүргізуді;
2. Үй басқармасын ({management}) проблеманы шешуге міндеттеуді;
3. Санитарлық нормалар мен ережелерді бұзғаны үшін жауапкершілік шараларын қолдануды.

Байланыс телефоны: {phone}

Күні: {date}
Қолы: _______________
{fullName}`
  },
  {
    id: "vacation-application",
    title: "Еңбек демалысына арыз",
    description: "Кезектегі немесе қосымша демалысқа өтініш",
    category: "application",
    fields: [
      { id: "fullName", label: "Толық аты-жөніңіз", placeholder: "Иванов Иван Иванович", type: "text" },
      { id: "position", label: "Қызметіңіз", placeholder: "Менеджер", type: "text" },
      { id: "department", label: "Бөлімі", placeholder: "Сату бөлімі", type: "text" },
      { id: "startDate", label: "Демалыс басталатын күні", placeholder: "01.06.2026", type: "date" },
      { id: "endDate", label: "Демалыс аяқталатын күні", placeholder: "14.06.2026", type: "date" },
      { id: "days", label: "Күндер саны", placeholder: "14", type: "text" },
      { id: "type", label: "Демалыс түрі", placeholder: "Кезектегі еңбек демалысы", type: "text" }
    ],
    template: `Директорға

АРЫЗ

Сұраймын {startDate} бастап {endDate} дейін {days} күнтізбелік күнге {type} беруді.

Қызметі: {position}
Бөлімі: {department}

Күні: {date}
Қолы: _______________
{fullName}

Келісемін:
Бөлім басшысы: _______________
Кадр бөлімі: _______________`
  },
  {
    id: "alimony-application",
    title: "Алименттер өндіру туралы арыз",
    description: "Бала асырауға алименттер өндіру үшін сотқа өтініш",
    category: "application",
    fields: [
      { id: "fullName", label: "Толық аты-жөніңіз (арызгердің)", placeholder: "Иванова Мария Петровна", type: "text" },
      { id: "address", label: "Мекенжайыңыз", placeholder: "Алматы қ., Абай даңғылы 1", type: "text" },
      { id: "phone", label: "Телефон нөміріңіз", placeholder: "+7 (777) 123-45-67", type: "text" },
      { id: "defendant", label: "Жауапкердің аты-жөні", placeholder: "Иванов Иван Иванович", type: "text" },
      { id: "defendantAddress", label: "Жауапкердің мекенжайы", placeholder: "Алматы қ., Достық даңғылы 10", type: "text" },
      { id: "childName", label: "Баланың аты-жөні", placeholder: "Иванов Петр Иванович", type: "text" },
      { id: "childBirthDate", label: "Баланың туған күні", placeholder: "15.03.2020", type: "date" },
      { id: "amount", label: "Сұратылатын сома", placeholder: "Жалақының 25%", type: "text" }
    ],
    template: `_______________________ ауданы/қаласы әділет соты

Арызгер: {fullName}
Мекенжайы: {address}
Телефоны: {phone}

Жауапкер: {defendant}
Мекенжайы: {defendantAddress}

АРЫЗ
Алименттер өндіру туралы

Мен, {fullName}, кәмелетке толмаған бала - {childName}, {childBirthDate} туған, асырау үшін алименттер өндіру туралы сотқа жүгінемін.

{defendant} - баланың әкесі/анасы болып табылады. Қазіргі уақытта ол баланы ерікті түрде асырамайды және материалдық көмек көрсетпейді.

Қазақстан Республикасының Неке және отбасы туралы кодексінің 137-бабына сәйкес, ата-аналар кәмелетке толмаған балаларын асырауға міндетті.

Жауапкер қазіргі уақытта жұмыс істейді және тұрақты табысы бар.

Осыған байланысты, Неке және отбасы туралы кодекске сүйене отырып,

СҰРАЙМЫН:

1. {defendant}-тен кәмелетке толмаған бала {childName} пайдасына {amount} мөлшерінде алименттер өндіруді;
2. Алименттерді баланың 18 жасқа толғанына дейін ай сайын төлеуді міндеттеуді.

Құжаттар қоса беріледі:
1. Баланың туу туралы куәлігінің көшірмесі
2. Некені бұзу туралы куәліктің көшірмесі (болған жағдайда)
3. Арыздың көшірмесі (жауапкерге)

Күні: {date}
Қолы: _______________
{fullName}`
  },
  {
    id: "certificate-application",
    title: "Анықтама сұрау туралы арыз",
    description: "Жұмыс орнынан анықтама алу үшін",
    category: "application",
    fields: [
      { id: "fullName", label: "Толық аты-жөніңіз", placeholder: "Иванов Иван Иванович", type: "text" },
      { id: "position", label: "Қызметіңіз", placeholder: "Менеджер", type: "text" },
      { id: "department", label: "Бөлімі", placeholder: "Сату бөлімі", type: "text" },
      { id: "certificateType", label: "Анықтама түрі", placeholder: "2-НДФЛ анықтамасы немесе жұмыс орны туралы анықтама", type: "text" },
      { id: "purpose", label: "Анықтама қажет ету себебі", placeholder: "Несие алу үшін", type: "text" }
    ],
    template: `Кадр қызметінің басшысына

АРЫЗ

Сұраймын маған {certificateType} беруді.

Анықтама қажет ету себебі: {purpose}

Қызметі: {position}
Бөлімі: {department}

Күні: {date}
Қолы: _______________
{fullName}`
  }
];

export function Templates() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [copied, setCopied] = useState(false);

  const handleFieldChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const generateDocument = () => {
    if (!selectedTemplate) return "";
    
    let result = selectedTemplate.template;
    const currentDate = new Date().toLocaleDateString("kk-KZ");
    result = result.replace("{date}", currentDate);
    
    selectedTemplate.fields.forEach(field => {
      const value = formData[field.id] || `[${field.label}]`;
      result = result.replace(new RegExp(`{${field.id}}`, "g"), value);
    });
    
    return result;
  };

  const handleCopy = () => {
    const text = generateDocument();
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Мәтін көшірілді!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = generateDocument();
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedTemplate?.title || "document"}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Құжат жүктелді!");
  };

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setFormData({});
    setCopied(false);
  };

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl mb-4">Арыз және шағым шаблондары</h1>
          <p className="text-xl text-gray-600">
            Дайын шаблондар арқылы өз құжатыңызды жасаңыз
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Templates list */}
          <div>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">Барлығы</TabsTrigger>
                <TabsTrigger value="complaint">Шағымдар</TabsTrigger>
                <TabsTrigger value="application">Арыздар</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-4 mt-6">
                {templates.map(template => (
                  <Card
                    key={template.id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedTemplate?.id === template.id ? "ring-2 ring-blue-600" : ""
                    }`}
                    onClick={() => handleSelectTemplate(template)}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">{template.title}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                        {template.category === "complaint" ? "Шағым" : "Арыз"}
                      </span>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="complaint" className="space-y-4 mt-6">
                {templates.filter(t => t.category === "complaint").map(template => (
                  <Card
                    key={template.id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedTemplate?.id === template.id ? "ring-2 ring-blue-600" : ""
                    }`}
                    onClick={() => handleSelectTemplate(template)}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">{template.title}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="application" className="space-y-4 mt-6">
                {templates.filter(t => t.category === "application").map(template => (
                  <Card
                    key={template.id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedTemplate?.id === template.id ? "ring-2 ring-blue-600" : ""
                    }`}
                    onClick={() => handleSelectTemplate(template)}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">{template.title}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Form and preview */}
          <div>
            {selectedTemplate ? (
              <Card>
                <CardHeader>
                  <CardTitle>{selectedTemplate.title}</CardTitle>
                  <CardDescription>Өрістерді толтырып, құжатыңызды жасаңыз</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Form fields */}
                  <div className="space-y-4">
                    {selectedTemplate.fields.map(field => (
                      <div key={field.id}>
                        <Label htmlFor={field.id}>{field.label}</Label>
                        {field.type === "textarea" ? (
                          <Textarea
                            id={field.id}
                            placeholder={field.placeholder}
                            value={formData[field.id] || ""}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            className="mt-1"
                          />
                        ) : (
                          <Input
                            id={field.id}
                            type={field.type}
                            placeholder={field.placeholder}
                            value={formData[field.id] || ""}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            className="mt-1"
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Preview */}
                  <div>
                    <Label>Құжат көрінісі</Label>
                    <div className="mt-2 p-4 bg-white border rounded-lg max-h-96 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm font-mono">
                        {generateDocument()}
                      </pre>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button onClick={handleCopy} className="flex-1 gap-2">
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? "Көшірілді" : "Көшіру"}
                    </Button>
                    <Button onClick={handleDownload} variant="outline" className="flex-1 gap-2">
                      <Download className="w-4 h-4" />
                      Жүктеу
                    </Button>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Кеңес:</strong> Құжатты басып шығарып, қолыңызды қойып, қажетті мекемеге тапсыра аласыз.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center min-h-[400px]">
                <CardContent className="text-center">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Шаблонды таңдаңыз
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
