import { useState, useRef } from "react";
import { Send, Bot, User, Sparkles, Plus, Menu, Paperclip, Image as ImageIcon, FileText, X } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  files?: FileAttachment[];
}

interface FileAttachment {
  name: string;
  type: string;
  size: number;
  url: string;
}

interface ChatSession {
  id: string;
  title: string;
  createdAt: Date;
  messages: Message[];
}

const exampleQuestions = [
  "Еңбек шартын қалай бұзуға болады?",
  "Некеден ажырасу үшін не істеу керек?",
  "Тұрғын үй жалдау шартын қалай жасауға болады?",
  "Жол қозғалысы ережелерін бұзғаным үшін айыппұл алдым, не істеуім керек?"
];

// Mock AI responses
const mockResponses: { [key: string]: string } = {
  "еңбек": "Еңбек шартын бұзу туралы сұрағыңызға жауап берейін. Қазақстан Республикасының Еңбек кодексіне сәйкес, еңбек шартын бұзуға бірнеше жолы бар:\n\n1. **Екі жақтың келісімі бойынша** - жұмыскер мен жұмыс беруші келісімге келсе, кез келген уақытта шартты бұзуға болады.\n\n2. **Жұмыскердің бастамасы бойынша** - жұмыскер 1 ай бұрын жазбаша ескертуі керек. Демалыс кезеңінде немесе уақытша еңбекке жарамсыздық кезеңінде де еңбек шартын бұзуға болады.\n\n3. **Жұмыс берушінің бастамасы бойынша** - белгілі бір жағдайларда ғана (мысалы, жұмыскердің міндеттерін бірнеше рет орындамауы).\n\nСізге қандай жағдай қатысты деп айтсаңыз, нақтырақ кеңес бере аламын.",
  "неке": "Некені бұзу (ажырасу) туралы сұрағыңызға жауап берейін. Қазақстан Республикасының Неке және отбасы туралы кодексіне сәйкес:\n\n1. **Егер балаларыңыз жоқ болса:**\n   - АХҚО (ЗАГС) арқылы ажырасуға болады\n   - Екі жақ та келісім берсе, процесс 1 айда аяқталады\n\n2. **Егер балаларыңыз бар болса:**\n   - Міндетті түрде сот арқылы ажырасу керек\n   - Сот баланың тұру орнын, алименттерді белгілейді\n   - Процесс 2-3 ай алуы мүмкін\n\n3. **Қажетті құжаттар:**\n   - Арыз (өтініш)\n   - Неке туралы куәлік\n   - Туу туралы куәліктер (балалар үшін)\n   - Мемлекеттік баж төлеу квитанциясы\n\nҚосымша сұрақтарыңыз болса, сұраңыз!",
  "тұрғын": "Тұрғын үй жалдау туралы сұрағыңызға жауап берейін. Тұрғын үй жалдау шартын дұрыс жасау үшін:\n\n1. **Шартта міндетті түрде болуы тиіс:**\n   - Жалдаушы мен жалға берушінің толық деректері\n   - Тұрғын үйдің нақты мекенжайы\n   - Жалдау мерзімі\n   - Айлық жалдау ақысының мөлшері\n   - Коммуналдық төлемдерді кім төлейтіні\n   - Депозит (кепілдік) мөлшері\n\n2. **Маңызды ережелер:**\n   - Шартты жазбаша түрде жасаңыз\n   - Үй-жайдың жағдайын тексеріңіз (фото/видео түсіріңіз)\n   - Барлық ақауларды шартқа жазыңыз\n   - Қолхат алыңыз (жалдау ақысын төлегенде)\n\n3. **Құқықтарыңыз:**\n   - Уақытында төлесеңіз, сізді шығара алмайды\n   - Иесі ескертусіз үйге кіре алмайды\n   - Ақау болса, жөндеуді талап етуге құқығыңыз бар\n\nБасқа сұрақтарыңыз бар ма?",
  "жол": "Жол қозғалысы ережелерін бұзу және айыппұл туралы сұрағыңызға жауап берейін:\n\n1. **Айыппұлды тексеру:**\n   - egov.kz порталы арқылы\n   - Полиция мобильдік қосымшасы арқылы\n   - SMS арқылы (1414 нөміріне)\n\n2. **Айыппұлды төлеу:**\n   - 15 күн ішінде 50% жеңілдікпен төлеуге болады\n   - Egov.kz, Kaspi, Halyk банктері арқылы\n   \n3. **Егер айыппұлмен келіспесеңіз:**\n   - 10 күн ішінде сотқа шағымдануға болады\n   - Дәлелдемелеріңізді (фото, видео, куәгерлер) дайындаңыз\n   - Заңгерден кеңес алыңыз\n\n4. **Төлемесеңіз не болады:**\n   - Айыппұл мөлшері екі есеге артады\n   - Сот орындаушылары өндіреді\n   - Шетелге шығуға тыйым салынуы мүмкін\n\nҚандай бұзушылық үшін айыппұл алдыңыз?",
  "виза": "Виза алу үшін қажетті құжаттар туралы ақпарат берейін. Виза түріне байланысты құжаттар өзгереді:\n\n1. **Туристік виза үшін:**\n   - Толтырылған анкета\n   - Паспорт (6 айдан артық жарамдылығы бар)\n   - Фото (3x4 см)\n   - Әуе билеті брондауы\n   - Қонақ үй брондауы\n   - Несиелік карта көшірмесі немесе банк шоты\n   - Медициналық сақтандыру полисі\n\n2. **Жұмыс визасы үшін:**\n   - Шақыру хаты (компаниядан)\n   - Жұмыс шарты көшірмесі\n   - Білім туралы дипломдар\n   - Еңбек кітапшасы\n\n3. **Студенттік виза үшін:**\n   - Оқу орнынан шақыру хаты\n   - Білім туралы құжаттар\n   - Төлем растамасы\n   - Тұрғылықты жері туралы анықтама\n\nҚай елге виза алғыңыз келеді? Нақтырақ ақпарат беремін.",
  "алимент": "Алимент туралы сұрағыңызға жауап берейін. ҚР Неке және отбасы туралы кодексіне сәйкес:\n\n1. **Алимент мөлшері:**\n   - 1 балаға - табыстың 25%\n   - 2 балаға - табыстың 33%\n   - 3 және одан көп балаға - табыстың 50%\n\n2. **Алимент өндіру жолдары:**\n   - Ерікті келісім (нотариус арқылы)\n   - Сот арқылы (егер келіспесе)\n   - Сот орындаушылары арқылы мәжбүрлеу\n\n3. **Алимент төлемесе:**\n   - Әкімшілік жауапкершілік (айыппұл)\n   - Қылмыстық жауапкершілік (6 айдан артық төлемесе)\n   - Мүлік тәркілеу\n   - Шетелге шығуға тыйым\n\n4. **Қажетті құжаттар:**\n   - Арыз\n   - Ажырасу туралы куәлік\n   - Баланың туу туралы куәлігі\n   - Табыс туралы анықтама\n\nҚосымша сұрақтарыңыз болса, сұраңыз!",
  "мұра": "Мұра туралы сұрағыңызға жауап берейін. ҚР Азаматтық кодексіне сәйкес:\n\n1. **Мұрагерлік тәртібі:**\n   - Өсиет бойынша (егер өсиет жазылса)\n   - Заң бойынша (өсиет болмаса)\n\n2. **Заң бойынша мұрагерлер (кезектілік):**\n   - 1-ші кезек: зайыбы/жұбайы, балалары, ата-анасы\n   - 2-ші кезек: ағалары/қарындастары, әжелері/аталары\n   - 3-ші кезек: әкелері/апалары, нағашылары\n\n3. **Мұраны ресімдеу:**\n   - 6 ай ішінде нотариусқа жүгіну керек\n   - Қажетті құжаттар: өлім туралы куәлік, мұрагерлікті растайтын құжаттар\n   - Мүлік құнының 0.1%-0.5% мемлекеттік баж\n\n4. **Міндетті мұралық үлес:**\n   - Кәмелетке толмаған балалар\n   - Мүгедек балалары, ата-анасы, жұбайы\n   - Заң бойынша мұраның 50%-ін алады\n\nНақты жағдайыңызды айтсаңыз, егжей-тегжейлі кеңес беремін.",
  "жер": "Жер туралы сұрағыңызға жауап берейін. ҚР Жер кодексіне сәйкес:\n\n1. **Жер сатып алу:**\n   - ҚР азаматтары ауыл шаруашылығы жерін сатып ала алады\n   - Шетелдіктер тек жалдау құқығы бар\n   - Қала жерін меншікке алуға болады\n\n2. **Жер жалдау:**\n   - Мерзімді жалдау (5, 10, 49 жылға дейін)\n   - Шартты нотариуста ресімдеу\n   - Жыл сайын жалдау ақысын төлеу\n\n3. **Жерге меншік құқығын тіркеу:**\n   - Құжаттар жинау (сатып алу-сату шарты, кадастрлық паспорт)\n   - ЖКО (кеңсеге) немесе egov.kz арқылы өтініш\n   - 1-5 күн ішінде тіркеу\n\n4. **Жер даулары:**\n   - Алдымен бітімгершілік арқылы шешу\n   - Сот арқылы шешу\n   - Кадастрлық өлшем жүргізу\n\nНақты сұрағыңызды егжей-тегжейлі жазсаңыз, көмектесемін.",
  "бизнес": "Бизнес ашу туралы сұрағыңызға жауап берейін:\n\n1. **ЖК/ЖШС тіркеу:**\n   - egov.kz немесе ЦОН арқылы\n   - Құжаттар: жеке куәлік, ЖСН\n   - Тіркеу тегін\n   - 1-3 күн ішінде дайын\n\n2. **Салық режимдері:**\n   - ҚҚС (қарапайым қолма-қол салық) - 3% немесе 1 АЕК х 12 ай\n   - СТЖ (салықтық төлем жөніндегі жеке шот) - 1% + әлеуметтік салық\n   - ЖАС (жалпы айырмашылық салық) - 20% ҚҚС + 10% КТС\n\n3. **Қажетті рұқсаттар:**\n   - Кейбір қызмет түрлеріне лицензия керек\n   - Өрт қауіпсіздігі рұқсаты\n   - Санитариялық рұқсат\n\n4. **Қызметкерлер:**\n   - Еңбек шарты жасау\n   - МӘМС (міндетті әлеуметтік медициналық сақтандыру) төлеу\n   - ЗН (зейнетақы) салығы\n   - Әлеуметтік салық (9.5%)\n\nҚандай бизнес түрін ашқыңыз келеді? Нақтырақ кеңес беремін.",
  "default": "Сәлеметсіз бе! Мен Zanai жасанды интеллект заң консультантымын. Сіздің мәселеңізді егжей-тегжейлі жазыңыз, мен Қазақстан Республикасының заңдарына сәйкес кеңес беремін.\n\nМысалы:\n- Еңбек құқықтары туралы сұрақтар\n- Отбасы және неке мәселелері\n- Тұрғын үй жалдау/сату\n- Әкімшілік құқық бұзушылықтар\n- Азаматтық құқықтар\n\nСұрағыңызды жазыңыз!"
};

// System prompt for Gemini-like behavior
const SYSTEM_PROMPT = `Сен Қазақстан Республикасының заңнамасына негізделген AI заң консультантысың.
Жауаптарды қарапайым, түсінікті тілде бер.
Нақты әрекет қадамдарын көрсет.
Жауап қысқа әрі құрылымды болсын. Жауабыңды дереккөзбен, баппен бер.
Кәсіби заңгердің қызметін алмастырмайтыныңды ескер.`;

export function AIConsultant() {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: "1",
      title: "Жаңа сұхбат",
      createdAt: new Date(),
      messages: [
        {
          id: "1",
          role: "assistant",
          content: "Сәлеметсіз бе! Мен Zanai ЖИ заң кеңесшісімін. Сіздің заң бойынша мәселеңізді жазыңыз, мен көмектесуге тырысамын. Еңбек, отбасы, тұрғын үй, әкімшілік құқық және басқа да заң салалары бойынша кеңес бере аламын.",
          timestamp: new Date()
        }
      ]
    }
  ]);
  const [currentSessionId, setCurrentSessionId] = useState<string>("1");
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [attachedFiles, setAttachedFiles] = useState<FileAttachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentSession = chatSessions.find(s => s.id === currentSessionId);
  const messages = currentSession?.messages || [];

  const getMockResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("еңбек") || lowerMessage.includes("жұмыс") || lowerMessage.includes("шарт")) {
      return mockResponses["еңбек"];
    } else if (lowerMessage.includes("неке") || lowerMessage.includes("ажырас")) {
      return mockResponses["неке"];
    } else if (lowerMessage.includes("тұрғын") || lowerMessage.includes("үй") || lowerMessage.includes("жалдау")) {
      return mockResponses["тұрғын"];
    } else if (lowerMessage.includes("жол") || lowerMessage.includes("айыппұл") || lowerMessage.includes("көлік")) {
      return mockResponses["жол"];
    } else if (lowerMessage.includes("виза")) {
      return mockResponses["виза"];
    } else if (lowerMessage.includes("алимент")) {
      return mockResponses["алимент"];
    } else if (lowerMessage.includes("мұра")) {
      return mockResponses["мұра"];
    } else if (lowerMessage.includes("жер")) {
      return mockResponses["жер"];
    } else if (lowerMessage.includes("бизнес")) {
      return mockResponses["бизнес"];
    } else {
      return mockResponses["default"];
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles: FileAttachment[] = Array.from(files).map(file => ({
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file)
    }));

    setAttachedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const createNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: "Жаңа сұхбат",
      createdAt: new Date(),
      messages: [
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "Сәлеметсіз бе! Мен Zanai ЖИ заң кеңесшісімін. Сіздің заң бойынша мәселеңізді жазыңыз, мен көмектесуге тырысамын.",
          timestamp: new Date()
        }
      ]
    };
    setChatSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setAttachedFiles([]);
  };

  const handleSend = () => {
    if (!input.trim() && attachedFiles.length === 0) return;

    // Save input value before clearing
    const userInputText = input;
    const userFiles = [...attachedFiles];

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userInputText,
      timestamp: new Date(),
      files: userFiles.length > 0 ? userFiles : undefined
    };

    // Update current session messages
    setChatSessions(prev => prev.map(session => {
      if (session.id === currentSessionId) {
        const updatedMessages = [...session.messages, userMessage];
        // Update title based on first user message
        const title = session.messages.length === 1 && userInputText.trim() 
          ? userInputText.substring(0, 50) + (userInputText.length > 50 ? "..." : "")
          : session.title;
        return { ...session, messages: updatedMessages, title };
      }
      return session;
    }));

    setInput("");
    setAttachedFiles([]);
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      let responseContent = getMockResponse(userInputText);
      
      // If files are attached, mention them in response
      if (userFiles.length > 0) {
        const fileTypes = userFiles.map(f => {
          if (f.type.startsWith('image/')) return 'сурет';
          if (f.type.includes('pdf')) return 'PDF құжат';
          return 'құжат';
        });
        responseContent = `Сіз ${fileTypes.join(', ')} жібердіңіз. Мен оны қарап шықтым.\n\n` + responseContent + 
          `\n\n📄 Құжатты толық талдау үшін нақты мәселеңізді егжей-тегжейлі жазыңыз.`;
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseContent,
        timestamp: new Date()
      };
      
      setChatSessions(prev => prev.map(session => {
        if (session.id === currentSessionId) {
          return { ...session, messages: [...session.messages, aiResponse] };
        }
        return session;
      }));
      setIsTyping(false);
    }, 1500);
  };

  const handleExampleClick = (question: string) => {
    setInput(question);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 bg-gray-900 text-white flex flex-col overflow-hidden`}>
        <div className="p-4 border-b border-gray-700">
          <button
            onClick={createNewChat}
            className="w-full flex items-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Жаңа сұхбат</span>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {chatSessions.map((session) => (
            <button
              key={session.id}
              onClick={() => setCurrentSessionId(session.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                session.id === currentSessionId 
                  ? 'bg-gray-700' 
                  : 'hover:bg-gray-800'
              }`}
            >
              <div className="text-sm truncate">{session.title}</div>
              <div className="text-xs text-gray-400 mt-1">
                {session.createdAt.toLocaleDateString('kk-KZ')}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold">ЖИ Заң кеңесшісі</h2>
              <p className="text-xs text-gray-500">Gemini арқылы жұмыс істейді</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Example questions - show only on first message */}
            {messages.length === 1 && (
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-3">Мысал сұрақтар:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {exampleQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(question)}
                      className="text-left p-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    message.role === "user"
                      ? "bg-blue-600"
                      : "bg-gradient-to-r from-blue-600 to-purple-600"
                  }`}
                >
                  {message.role === "user" ? (
                    <User className="w-6 h-6 text-white" />
                  ) : (
                    <Bot className="w-6 h-6 text-white" />
                  )}
                </div>
                <div
                  className={`flex-1 ${
                    message.role === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block max-w-[80%] p-4 rounded-2xl ${
                      message.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-900 border border-gray-200"
                    }`}
                  >
                    {message.files && message.files.length > 0 && (
                      <div className="mb-3 space-y-2">
                        {message.files.map((file, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg">
                            {file.type.startsWith('image/') ? (
                              <ImageIcon className="w-4 h-4" />
                            ) : (
                              <FileText className="w-4 h-4" />
                            )}
                            <span className="text-sm text-gray-700">{file.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {message.timestamp.toLocaleTimeString("kk-KZ", {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="bg-white border border-gray-200 p-4 rounded-2xl">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-4xl mx-auto">
            {/* Attached Files Preview */}
            {attachedFiles.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {attachedFiles.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm">
                    {file.type.startsWith('image/') ? (
                      <ImageIcon className="w-4 h-4 text-gray-600" />
                    ) : (
                      <FileText className="w-4 h-4 text-gray-600" />
                    )}
                    <span className="text-gray-700">{file.name}</span>
                    <button
                      onClick={() => removeFile(idx)}
                      className="ml-1 text-gray-500 hover:text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2 items-end">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-3 hover:bg-gray-100 rounded-lg transition-colors"
                title="Файл тіркеу"
              >
                <Paperclip className="w-5 h-5 text-gray-600" />
              </button>
              <textarea
                placeholder="Мәселеңізді мұнда жазыңыз..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                className="flex-1 resize-none border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[60px] max-h-[200px]"
                rows={1}
              />
              <button
                onClick={handleSend}
                disabled={(!input.trim() && attachedFiles.length === 0) || isTyping}
                className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Gemini құжат, сурет қабылдай алады • Enter - жіберу, Shift+Enter - жаңа жол
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 border-t border-yellow-200 px-4 py-3">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs text-yellow-800">
              <strong>Ескерту:</strong> Бұл ЖИ кеңесші ақпараттық мақсатта ғана жасалған. 
              Нақты заң мәселелері бойынша кәсіби заңгерден кеңес алуыңызды ұсынамыз.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}