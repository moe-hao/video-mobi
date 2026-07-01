import { Button, Input, Modal, Spinner } from "@heroui/react";
import { useState } from "react";

interface PixButtonProps {
  onSubmit: (data: { cpf: string; firstName: string; lastName: string }) => Promise<void>;
}

export default function PixButton({ onSubmit }: PixButtonProps) {
  const [cpf, setCpf] = useState("");
  const [fullName, setFullName] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);

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
    <Modal>
      <Button
        size="lg"
        className="w-full h-[52px] bg-[rgba(45,46,47)] text-[16px] text-white font-bold mb-4 px-4 rounded-[16px] relative justify-start"
      >
        <img src="https://i.bluearcshow.com/images/PIX_BR.png" alt="Pix" className="w-8" />
        <span className="ml-2">
          Pix
        </span>
      </Button>
      <Modal.Backdrop>
        <Modal.Container placement="center">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading className="px-2">
                CPF
                {isInvalid && <div className="text-[12px] font-bold text-red-500" >Dados incorretos. Por favor, verifique o CPF ou Nome.</div>}
              </Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <Input
                variant="secondary"
                className="w-full mb-4"
                type="text"
                placeholder="CPF"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
              />
              <Input
                variant="secondary"
                className="w-full mb-4"
                type="text"
                placeholder="Nome completo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <Button variant="primary" className="w-full" type="submit" onPress={handleSubmit} isPending={isPending} isDisabled={!cpf.trim() || !fullName.trim()}>
                {isPending ? <Spinner color="current" size="sm" /> : null}
                Confirmar
              </Button>
            </Modal.Body>
            <Modal.Footer />
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
