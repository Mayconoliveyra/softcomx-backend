import Bottleneck from 'bottleneck';

type EmpresaId = string;

/**
 * Map de empresa → Bottleneck
 * • reservoir = 60  ── nº máx. de “fichas” por janela
 * • reservoirRefreshAmount idem
 * • reservoirRefreshInterval = 60_000 ms (1 min)
 */
const limiters = new Map<EmpresaId, Bottleneck>();

const getLimiter = (empresaId: EmpresaId): Bottleneck => {
  if (!limiters.has(empresaId)) {
    limiters.set(
      empresaId,
      new Bottleneck({
        reservoir: 60,
        reservoirRefreshAmount: 60,
        reservoirRefreshInterval: 60_000,
        maxConcurrent: 1, // evita rajadas dentro do próprio minuto
      }),
    );
  }
  return limiters.get(empresaId)!;
};

export const Plug4market = { getLimiter };
