import { useState } from "react";
import * as schemas from '~/db'
import { getTableColumns } from "drizzle-orm";
import { 
  Database, 
  Table as TableIcon, 
  Eye, 
  Search, 
  Download, 
  BarChart3, 
  Settings,
  ChevronDown,
  Menu,
  X,
  DatabaseZap,
  Copy
} from "lucide-react";
import { Button } from "../components/ui/button";
import { ScrollArea } from "./ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Card } from "../components/ui/card";
import { useToast } from "~/hooks/use-toast";

interface TableOption {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
}

interface DatabaseTable {
  name: string;
  description: string;
  recordCount: number;
}

const Sidebar = () => {
  const toast = useToast();
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [schemaPopover, setSchemaPopover] = useState<{ table: string; columns: string } | null>(null);


  // Sample database tables for openSenseMap
  const tables: DatabaseTable[] = [
    {
      name: "user",
      description: "Registered users of the platform",
      recordCount: 12000
    },

    {
      name: "sensors",
      description: "Environmental sensor data",
      recordCount: 15420
    },
    {
      name: "measurement", 
      description: "Sensor measurement records",
      recordCount: 892340
    },
    {
      name: "locations",
      description: "Geographic sensor locations", 
      recordCount: 3240
    },
    {
      name: "devices",
      description: "IoT device registry",
      recordCount: 2180
    }
  ];

  const getTableOptions = (tableName: string): TableOption[] => [
    {
      label: "View Schema",
      icon: Eye,
      action: () => {
        const schema = (schemas as Record<string, any>)[tableName];
        if(!schema){
          return toast.toast({
            description: `❌ Schema for ${tableName} not found.`,
            variant: "destructive"
          })
        }
        const cols = getTableColumns(schema);
        const columns = Object.values(cols).map((col: any) => {
        return `${col.name} : ${col.columnType}`;
       });
        const text = columns.join("\n");
        setSchemaPopover({ table: tableName, columns: text });
      }
    },
    {
      label: "Browse Data",
      icon: Search,
      action: () => alert(`Browsing data for ${tableName}`)
    },
    {
      label: "Export Table",
      icon: Download,
      action: () => alert(`Exporting ${tableName}`)
    },
    {
      label: "View Stats",
      icon: BarChart3,
      action: () => alert(`Viewing stats for ${tableName}`)
    },
    {
      label: "Table Settings",
      icon: Settings,
      action: () => alert(`Opening settings for ${tableName}`)
    }
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden hover:bg-white/20 bg-transparent"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-5 w-5 bg-red-500" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          role="button"
          tabIndex={0}
          aria-label="Close sidebar overlay"
          onClick={() => setIsMobileOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setIsMobileOpen(false);
            }
          }}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-40 w-80 lg:w-full
        transform transition-transform duration-300 ease-in-out
        bg-zinc-950
        lg:transform-none lg:col-span-3 h-full bg-gradient-card border-r border-border
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Card className="h-full rounded-none border-0 shadow-none bg-transparent">
        {/* Header */}
        <div className='flex items-center justify-center p-2 gap-2'>
            <DatabaseZap className='w-10 h-10 text-blue-500' />
             <h1 className='text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-blue-500' style={{fontSize:"35px"}}>DBDojo</h1>
             </div>
        <div className='mt-3 p-2'>
             <p className='text-justify text-wrap text-lime-200 tracking-tighter'>SQL-Learning Platform with live data from openSenseMap</p>
        </div>

        {/* Tables List */}
        <div className="p-4 space-y-3">
          {tables.map((table) => (
            <div key={table.name} className="group">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`
                      w-100 justify-between p-4 h-auto text-left
                      hover:bg-primary/5 hover:shadow-slate-100
                      transition-all duration-300
                      ${selectedTable === table.name ? 'bg-primary/10 shadow-glow' : ''}
                      group-hover:scale-[1.02]
                    `}
                    onClick={() => setSelectedTable(table.name)}
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 bg-gradient-data rounded-lg shadow-sm">
                        <TableIcon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Database className="h-3 w-3 text-slate-400" />
                          <span className="font-medium text-blue-400">{table.name}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                          {table.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-md font-medium">
                            {table.recordCount.toLocaleString()} rows
                          </div>
                        </div>
                      </div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-blue-400 group-hover:light transition-colors" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent 
                  align="start" 
                  className="w-56 bg-card/95 backdrop-blur-lg border-border shadow-elegant"
                  sideOffset={4}
                >
                  {getTableOptions(table.name).map((option, index) => (
                    <DropdownMenuItem 
                      key={index}
                      onClick={option.action}
                      className="flex items-center gap-3 cursor-pointer hover:bg-primary/5"
                    >
                      <option.icon className="h-4 w-4 text-primary" />
                      <span className="text-sm">{option.label}</span>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-xs text-muted-foreground justify-center">
                    Table: {table.name}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
        </Card>
      </div>
      {/* Schema Popover */}
      {schemaPopover && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="bg-card border border-border rounded-xl shadow-xl max-w-lg w-full p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-lg text-primary">
              Schema for {schemaPopover.table}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSchemaPopover(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <ScrollArea className="h-48 border rounded-md bg-blue-500/20 p-2">
            <pre className="text-sm font-mono whitespace-pre-wrap">
            {schemaPopover.columns}
            </pre>
          </ScrollArea>
          <div className="flex justify-end">
           <Button
            variant="outline"
            size="sm"
            onClick={() => {
            navigator.clipboard.writeText(schemaPopover.columns);
            toast.toast({ description: "✅ Schema copied to clipboard!" });
            }}
            >
            <Copy className="h-4 w-4 mr-2" /> Copy
            </Button>
          </div>
        </div>
    </div>
  )}

    </>
  );
};

export default Sidebar;






