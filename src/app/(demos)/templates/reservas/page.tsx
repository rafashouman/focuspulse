import KobraTableBooking from "@/components/KobraTableBooking";
import { ScrollProgress } from "@/components/ui/MotionKit";

export default function ReservasStandalonePage() {
  return (
    <main id="conteudo">
      <ScrollProgress />
      <h1 className="sr-only">Kobra.Fire: reservas, pedidos e operação do restaurante</h1>
      <KobraTableBooking initialTab="booking" />
    </main>
  );
}