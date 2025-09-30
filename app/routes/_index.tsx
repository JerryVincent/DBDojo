import type { MetaFunction } from "@remix-run/node";
import Sidebar from "~/components/Sidebar";
import MainContent from "~/components/MainContent";
import { useActionData } from "@remix-run/react";
import { GoogleGenAI } from "@google/genai";
import { executeQuery } from "~/utils/db.server";
import { useToast } from "~/hooks/use-toast";


export const meta: MetaFunction = () => {
  return [
    { title: "DBDojo" },
    { name: "description", content: "Welcome to DBDojo!" },
  ];
};

export const action = async ({request}:{request: Request}) => {
  const formdata = await request.formData();
  const action = formdata.get("_action");
  
  if (action === "ai"){
    const prompt = formdata.get("prompt") as string;
    const ai = new GoogleGenAI({apiKey: process.env.GOOGLE_GENAI_API_KEY});
    const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
    });
    const generatedText = response.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated";
    return Response.json({
        message: generatedText,
        status: "success",
        type: "ai"
    });
  }
  else if (action === "query") {
    const query = formdata.get("query") as string;
    const response = await executeQuery(query);
    if(response?.alert){
      return Response.json({
        message: response.message,
        status: response.status,
        alert: response.alert,
        type: "alert"
      })
    }
  }
  return null;
}

export default function Index() {
  const { toast } = useToast()
  const response = useActionData<typeof action>();
  if(response?.alert){
    if(response.status >=400){
      toast({
        description: "❌ " + response.alert,
        variant: "destructive"
      });
      response.alert = null; // Clear alert after showing it
      return null;
    }
    toast({
      description: "✅ " + response.alert,
      variant: "default"
    });
    response.alert = null; // Clear alert after showing it
  }
  return (
    <div className="min-h-screen bg-gray-400">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        <Sidebar />
        <MainContent response={response} />
      </div>
    </div>
  );
}



// import type { MetaFunction } from "@remix-run/node";
// import Sidebar from "~/components/Sidebar"
// import { Card } from "~/components/ui/card";
// import { Badge } from "~/components/ui/badge";
// import { Bot, Database, Globe, Play, TrendingUp, Users } from "lucide-react";
// import { Form, useActionData, useNavigation } from "@remix-run/react";
// import { GoogleGenAI } from "@google/genai";
// import { Button } from "~/components/ui/button";
// import { useState, useRef } from "react";

// export const meta: MetaFunction = () => {
//   return [
//     { title: "DBDojo" },
//     { name: "description", content: "Welcome to DBDojo!" },
//   ];
// };

// export const action = async ({request}:{request: Request}) => {
//   const formdata = await request.formData();
//   const action = formdata.get("_action");
//   if (action === "ai"){
//     const prompt = formdata.get("prompt") as string;
//     const ai = new GoogleGenAI({apiKey: process.env.GOOGLE_GENAI_API_KEY});
//     const response = await ai.models.generateContent({
//             model: "gemini-2.5-flash",
//             contents: prompt,
//     });
//     const generatedText = response.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated";
//     return Response.json({
//         message: generatedText,
//         status: "success"
//     });
//   }
//   else if (action === "query") {
//     // Handle SQL query submission here
//     const query = formdata.get("query") as string;
//     console.log("Received SQL query:", query);
//     return null;
//   }
// }

// export default function Index() {
//   const response = useActionData<typeof action>();
//   const navigation = useNavigation();
//   const [query, setQuery] = useState('');
//   const inputRef = useRef<HTMLInputElement>(null);

//   // Check if we're submitting the AI form specifically
//   const isAiLoading = navigation.state === "submitting" && 
//     navigation.formData?.get("_action") === "ai";

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     const { key, target } = e;
//     const { selectionStart, selectionEnd, value } = target as HTMLInputElement;
    
//     // Define bracket pairs
//     const bracketPairs: { [key: string]: string } = {
//       '{': '}',
//       '[': ']',
//       '(': ')',
//       '"': '"',
//       "'": "'"
//     };

//     if (bracketPairs[key]) {
//       e.preventDefault();
      
//       const closingBracket = bracketPairs[key];
//       const beforeCursor = value.substring(0, selectionStart || 0);
//       const afterCursor = value.substring(selectionEnd || 0);
      
//       // For quotes, check if we should close or just insert
//       if ((key === '"' || key === "'") && selectionStart === selectionEnd) {
//         // Count occurrences of the quote before cursor
//         const quoteCount = (beforeCursor.match(new RegExp('\\' + key, 'g')) || []).length;
        
//         // If odd number of quotes, just insert one quote (we're closing)
//         if (quoteCount % 2 === 1) {
//           const newValue = beforeCursor + key + afterCursor;
//           setQuery(newValue);
          
//           // Set cursor position after the inserted quote
//           setTimeout(() => {
//             if (inputRef.current) {
//               inputRef.current.setSelectionRange((selectionStart ?? 0) + 1, (selectionStart ?? 0) + 1);
//             }
//           }, 0);
//           return;
//         }
//       }
      
//       // Insert opening and closing bracket/quote
//       const newValue = beforeCursor + key + closingBracket + afterCursor;
//       setQuery(newValue);
      
//       // Set cursor position between the brackets
//       setTimeout(() => {
//         if (inputRef.current) {
//           inputRef.current.setSelectionRange((selectionStart || 0) + 1, (selectionStart || 0) + 1);
//         }
//       }, 0);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-400">
//       <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
//         {/* Sidebar - Hidden on mobile, 3 columns on desktop */}
//         <Sidebar/>
        
//         {/* Main Content - Full width on mobile, 9 columns on desktop */}
//         <div className="col-span-1 lg:col-span-9 p-4 lg:p-6 pt-16 lg:pt-6">
//           <div className="max-w-6xl mx-auto">
//             {/* Header */}
//             <div className="mb-8">
//               <div className="flex items-center gap-3 mb-4">
//                 <div className="p-3 bg-gradient-primary rounded-xl shadow-glow">
//                   <Database className="h-6 w-6 text-white" />
//                 </div>
//                 <div>
//                   <h1 className="text-3xl font-bold bg-gradient-data bg-clip-text text-dark-foreground">
//                     SQL Learning Playground
//                   </h1>
//                   <p className="text-muted-foreground">
//                     Learn SQL with real environmental data from openSenseMap
//                   </p>
//                 </div>
//               </div>              
//               <div className="flex gap-2">
//                 <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
//                   <Globe className="h-3 w-3 mr-1" />
//                   Live Data
//                 </Badge>
//                 <Badge variant="secondary" className="bg-accent/10 text-accent hover:bg-accent/20">
//                   <TrendingUp className="h-3 w-3 mr-1" />
//                   Real-time Updates
//                 </Badge>
//                 <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
//                   <Users className="h-3 w-3 mr-1" />
//                   Interactive Learning
//                 </Badge>
//               </div>
//             </div>

//             <div className="my-3 h-12 w-full">
//                 <Form className="w-full flex items-center justify-start" method="post">
//                   <input 
//                     ref={inputRef}
//                     type="text" 
//                     name="query"
//                     value={query}
//                     onChange={(e) => setQuery(e.target.value)}
//                     onKeyDown={handleKeyDown}
//                     className="w-3/4 bg-black text-lime-300 h-12 rounded-md"
//                   />
//                   <Button type="submit" variant={"destructive"} className="ms-2 bg-teal-500 w-32" name="_action" value={"query"}><Play/>Run Query</Button>
//                 </Form>
//               </div>
//                 <div className="my-3 h-12 w-full">
//                 <Form className="w-full flex items-center justify-start" method="post">
//                   <input 
//                     type="text" 
//                     name="prompt"
//                     className="w-3/4 bg-black text-lime-300 h-12 rounded-md"
//                   />
//                   <Button 
//                     type="submit" 
//                     variant={"destructive"} 
//                     className="ms-2 bg-teal-500 w-32 disabled:opacity-50" 
//                     name="_action" 
//                     value={"ai"}
//                     disabled={isAiLoading}
//                   >
//                     {isAiLoading ? (
//                       <>
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                         Loading...
//                       </>
//                     ) : (
//                       <>
//                         <Bot />
//                         Ask AI
//                       </>
//                     )}
//                   </Button>
//                 </Form>
//               </div>

//               {(response || isAiLoading) && (
//                 <div className="my-4 w-full">
//                   <Card className="p-6 bg-black shadow-elegant">
//                     <div className="flex items-center gap-2 mb-4">
//                       <Bot className="h-5 w-5 text-blue-500" />
//                       <h3 className="text-lg font-semibold text-blue-500">AI Response</h3>
//                       {!isAiLoading && response && (
//                         <Badge variant="secondary" className="ml-auto">
//                           {response?.status}
//                         </Badge>
//                       )}
//                     </div>
                    
//                     {isAiLoading ? (
//                       <div className="flex items-center justify-center py-8">
//                         <div className="flex flex-col items-center gap-3">
//                           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//                           <p className="text-blue-500 text-sm">AI is thinking...</p>
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="prose prose-invert max-w-none">
//                         <div 
//                           className="text-slate-200 leading-relaxed"
//                           dangerouslySetInnerHTML={{
//                             __html: response?.message
//                               // First handle code blocks to prevent interference
//                               ?.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-black rounded-lg p-4 overflow-x-auto my-4 border border-gray-700"><code class="text-lime-300 text-sm whitespace-pre">$2</code></pre>')
//                               // Handle inline code
//                               ?.replace(/`([^`]+)`/g, '<code class="bg-black/50 text-lime-300 px-1.5 py-0.5 rounded text-sm border border-gray-600">$1</code>')
//                               // Handle headers
//                               ?.replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold text-white mt-6 mb-3 border-b border-gray-600 pb-1">$1</h3>')
//                               ?.replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold text-white mt-8 mb-4 border-b border-gray-600 pb-2">$1</h2>')
//                               ?.replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold text-white mt-8 mb-6 border-b border-gray-600 pb-2">$1</h1>')
//                               // Handle lists with proper indentation
//                               ?.replace(/^(\s*)[*\-+] (.*)$/gm, (match: string, indent: string, content: string) => {
//                                 const level = Math.floor(indent.length / 2);
//                                 return `<div class="flex items-start mb-1" style="margin-left: ${level * 20}px;"><span class="text-blue mr-2 mt-1">•</span><span>${content}</span></div>`;
//                               })
//                               ?.replace(/^(\s*)(\d+)\. (.*)$/gm, (match: string, indent: string, num: string, content: string) => {
//                                 const level = Math.floor(indent.length / 2);
//                                 return `<div class="flex items-start mb-1" style="margin-left: ${level * 20}px;"><span class="text-blue mr-2 mt-1 min-w-6">${num}.</span><span>${content}</span></div>`;
//                               })
//                               // Handle bold and italic
//                               ?.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
//                               ?.replace(/\*([^*]+)\*/g, '<em class="text-slate-300 italic">$1</em>')
//                               // Handle line breaks
//                               ?.replace(/\n\n/g, '<br/><br/>')
//                               ?.replace(/\n/g, '<br/>')
//                           }}
//                         />
//                       </div>
//                     )}
//                   </Card>
//                 </div>
//               )}

//             {/* Welcome Content */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <Card className="p-6 bg-gradient-card shadow-elegant hover:shadow-glow transition-all duration-300">
//                 <h3 className="text-xl font-semibold mb-3 text-foreground">
//                   Explore Real Data
//                 </h3>
//                 <p className="text-slate-200 mb-4">
//                   Access live environmental sensor data from openSenseMap. Learn SQL by querying 
//                   real measurements from IoT devices worldwide.
//                 </p>
//                 <div className="text-sm text-primary font-medium">
//                   → Select a table from the sidebar to get started
//                 </div>
//               </Card>

//               <Card className="p-6 bg-gradient-card shadow-elegant hover:shadow-glow transition-all duration-300">
//                 <h3 className="text-xl font-semibold mb-3 text-foreground">
//                   Interactive Learning
//                 </h3>
//                 <p className="text-slate-200 mb-4">
//                   Practice SQL queries with immediate feedback. Explore schemas, browse data, 
//                   and export results from real environmental datasets.
//                 </p>
//                 <div className="text-sm text-primary font-medium">
//                   → Use dropdown menus for table operations
//                 </div>
//               </Card>
//             </div>

//             {/* Stats Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
//               <Card className="p-4 text-center bg-gradient-card shadow-elegant">
//                 <div className="text-2xl font-bold text-primary">5</div>
//                 <div className="text-sm text-muted-foreground">Database Tables</div>
//               </Card>
//               <Card className="p-4 text-center bg-gradient-card shadow-elegant">
//                 <div className="text-2xl font-bold text-accent">1.3M+</div>
//                 <div className="text-sm text-muted-foreground">Records Available</div>
//               </Card>
//               <Card className="p-4 text-center bg-gradient-card shadow-elegant">
//                 <div className="text-2xl font-bold text-foreground">Real-time</div>
//                 <div className="text-sm text-muted-foreground">Data Updates</div>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

