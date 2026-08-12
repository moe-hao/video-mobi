import { useState } from "react";

interface PixButtonProps {
  onSubmit: (data: { cpf: string; firstName: string; lastName: string }) => Promise<void>;
}

export default function PixButton({ onSubmit }: PixButtonProps) {
  const [cpf, setCpf] = useState("");
  const [fullName, setFullName] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async () => {
    setIsPending(true);
    try {
      const nameParts = fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      await onSubmit({ cpf, firstName, lastName });
    } catch (error) {
      setIsInvalid(true);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <button
        className="w-full h-[52px] bg-[rgba(255,255,255,0.1)] text-[16px] text-white font-bold mb-4 px-4 rounded-[16px] relative flex items-center justify-start border-none cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <img src="https://i.bluearcshow.com/images/PIX_BR.png" alt="Pix" className="w-8" />
        <span className="ml-2">
          Pix
        </span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="fixed inset-0 bg-black/60" onClick={() => setIsOpen(false)} />
          <div className="relative bg-[#1a1f2e] rounded-[16px] py-4 px-4 w-[90%] max-w-[400px] z-[70]">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold text-white px-2">
                CPF
                {isInvalid && <div className="text-[12px] font-bold text-red-500">Dados incorretos. Por favor, verifique o CPF ou Nome.</div>}
              </h2>
              <button className="bg-transparent border-none cursor-pointer text-white/70 hover:text-white p-2" onClick={() => setIsOpen(false)}>
                ✕
              </button>
            </div>
            <div>
              <input
                className="w-full mb-4 px-4 py-3 bg-[rgba(255,255,255,0.1)] text-white rounded-lg border-none outline-none placeholder-white/50"
                type="text"
                placeholder="CPF"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
              />
              <input
                className="w-full mb-4 px-4 py-3 bg-[rgba(255,255,255,0.1)] text-white rounded-lg border-none outline-none placeholder-white/50"
                type="text"
                placeholder="Nome completo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <button
                className="w-full py-3 bg-[#3D77FF] text-white rounded-lg border-none cursor-pointer font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                onClick={handleSubmit}
                disabled={!cpf.trim() || !fullName.trim() || isPending}
              >
                {isPending ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                ) : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
