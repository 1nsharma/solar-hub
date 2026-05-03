import { Download, MonitorDown } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function PwaInstallButton() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };

    const handleInstalled = () => {
      setInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

  if (installed || !installPrompt) return null;

  return (
    <button
      onClick={handleInstall}
      className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm font-bold text-text-dim hover:text-primary hover:border-primary/40 transition-all"
      title="Install SolarHub provider app in Chrome"
    >
      <MonitorDown size={16} />
      Install
      <Download size={14} />
    </button>
  );
}
