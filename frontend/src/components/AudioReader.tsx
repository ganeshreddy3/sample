import { Volume2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"

interface AudioReaderProps {
  textKey?: string;
  text?: string;
  className?: string;
}

export function AudioReader({ textKey, text, className }: AudioReaderProps) {
  const { t, i18n } = useTranslation()

  const speak = () => {
    let textToSpeak = text || "";
    if (textKey) {
       textToSpeak = t(textKey, text || "");
    }
    
    if (!textToSpeak) return;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    switch (i18n.language) {
      case 'hi':
        utterance.lang = 'hi-IN';
        break;
      case 'te':
        utterance.lang = 'te-IN';
        break;
      default:
        utterance.lang = 'en-US';
    }

    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }
    
    window.speechSynthesis.speak(utterance);
  }

  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={speak}
      className={`rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200 shadow-sm ${className}`}
      title="Read Aloud"
    >
      <Volume2 className="h-4 w-4" />
      <span className="sr-only">Read Aloud</span>
    </Button>
  )
}
