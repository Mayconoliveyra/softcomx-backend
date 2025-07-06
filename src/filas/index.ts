import Bottleneck from 'bottleneck';
import { Worker, Queue, Job } from 'bullmq';
import { RedisOptions } from 'ioredis';

import { Util } from '../util';

// 💡 CONCURRENCY_WORKER:
// Define quantos jobs podem ser processados *em paralelo* no mesmo worker.
// IMPORTANTE: cada job é isolado por empresa via Bottleneck, mas o worker pode rodar vários de empresas diferentes simultaneamente.
//
// RECOMENDAÇÕES:
// - 🧠 Tarefa leve (I/O-bound, ex: chamadas HTTP, leitura disco, etc):
//   > 100 a 500 (em máquinas médias com 4 a 8 núcleos)
// - 🔢 Tarefa CPU-bound (ex: cálculos intensivos, compressão):
//   > 1 a 2 × número de núcleos de CPU (ex: 4 CPUs → concurrency entre 4 e 8)
//
// ATENÇÃO:
// - Evite valores muito altos se estiver em ambiente com Redis limitado.
// - Teste a escalabilidade de forma gradual.
// - Use monitoramento de fila e recursos (ex: bull-board, Prometheus, etc.)
const CONCURRENCY_WORKER = 100;

// Quantidade de requisições permitidas por minuto por empresa
const LIMITE_RESERVOIR = 50;

// Quantas requisições são recarregadas por ciclo (normalmente igual ao RESERVOIR)
const LIMITE_RESERVOIR_REFRESH = 50;

// Intervalo (em ms) para recarregar o reservoir (ex: 60_000 = 1 minuto)
const INTERVALO_REFRESH_MS = 60_000;

// ==========================
// 🔧 Configuração de conexão Redis
// ==========================
const redisConnection: RedisOptions = {
  host: 'localhost',
  port: 6379,
  // password: 'suaSenhaAqui' // Se necessário
};

// ==========================
// 📦 Fila global única (BullMQ)
// ==========================
const fila = new Queue('plug4market', {
  connection: redisConnection,
});

// ==========================
// 🧠 Cache local de limitadores por empresa
// ==========================
const limitadores = new Map<string, Bottleneck>();

// ==========================
// 📋 Tipagem dos dados do job
// ==========================
interface IDadosJob {
  pedidoId: string;
  produtos: { sku: string; quantidade: number }[];
}

// ==========================
// 📘 Logger padronizado
// ==========================
export const Log = {
  info: (msg: string) => console.log(`[INFO] ${Util.DataHora.obterDataAtual('DD/MM/YYYY HH:mm:ss')} - ${msg}`),
  error: (msg: string, err?: any) => {
    console.error(`[ERROR] ${Util.DataHora.obterDataAtual('DD/MM/YYYY HH:mm:ss')} - ${msg}`);
    if (err) console.error(err);
  },
};

// ==========================
// ⏳ Gera ou retorna um limitador por empresa
// ==========================
function getLimiter(empresaId: string): Bottleneck {
  if (!limitadores.has(empresaId)) {
    const limiter = new Bottleneck({
      id: `softcomhubs:limiter:${empresaId}`,
      maxConcurrent: 1, // Execução sequencial por empresa
      reservoir: LIMITE_RESERVOIR,
      reservoirRefreshAmount: LIMITE_RESERVOIR_REFRESH,
      reservoirRefreshInterval: INTERVALO_REFRESH_MS,
      datastore: 'ioredis',
      clearDatastore: false,
      clientOptions: redisConnection,
    });
    limitadores.set(empresaId, limiter);
  }

  const result = limitadores.get(empresaId);
  if (!result) throw new Error(`Limiter não encontrado para empresa: ${empresaId}`);
  return result;
}

// ==========================
// 🤖 Worker para processar jobs
// ==========================
const worker = new Worker(
  'plug4market',
  async (job: Job<{ empresaId: string; dados: IDadosJob }>) => {
    const { empresaId, dados } = job.data;
    await getLimiter(empresaId).schedule(() => integrar(empresaId, dados));
  },
  {
    connection: redisConnection,
    concurrency: CONCURRENCY_WORKER,
  },
);

// ==========================
// 🔁 Simulação da tarefa (ex: integração externa)
// ==========================
const integrar = async (empresaId: string, dados: IDadosJob) => {
  await new Promise((res) => setTimeout(res, 3000)); // simula tempo de processamento

  const match = dados.pedidoId.match(/-(\d{3,})$/);
  const final = match ? parseInt(match[1], 10) : null;
  if (final && final % 50 === 0) {
    /* Log.info(`✅ [SIMULADO] Resposta: 200 - ${empresaId} - pedido ${dados.pedidoId}`); */
  }

  /* if (empresaId == 'empresa001') {
    Log.info(`✅ [SIMULADO] Resposta: 200 - ${empresaId} - pedido ${dados.pedidoId}`);
  }

  if (empresaId == 'empresa005') {
    Log.info(`✅ [SIMULADO] Resposta: 200 - ${empresaId} - pedido ${dados.pedidoId}`);
  } */

  Log.info(`✅ [SIMULADO] Resposta: 200 - ${empresaId} - pedido ${dados.pedidoId}`);
};

// ==========================
// 📡 Eventos do Worker
// ==========================
worker.on('completed', (job) => {
  if (process.env.LOG_COMPLETED === 'true') {
    Log.info(`✔️ Job concluído: ${job.id} (${job.name})`);
  }
});

worker.on('failed', (job, err) => {
  Log.error(`❌ Job falhou: ${job?.id}`, err);
});

// ==========================
// 🧪 Função de carga para testes
// ==========================
export const testarFila = async () => {
  const totalEmpresas = 2;
  const totalPorEmpresa = 150;
  const lote = 50;

  const empresas = Array.from({ length: totalEmpresas }, (_, i) => `empresa${String(i + 1).padStart(3, '0')}`);

  for (let offset = 0; offset < totalPorEmpresa; offset += lote) {
    const jobsLote: Promise<any>[] = [];

    for (const empresaId of empresas) {
      for (let i = offset + 1; i <= Math.min(offset + lote, totalPorEmpresa); i++) {
        const pedidoId = `${empresaId}-${i.toString().padStart(4, '0')}`;

        const job = fila.add('novo-pedido', {
          empresaId,
          dados: {
            pedidoId,
            produtos: [{ sku: `sku-${i}`, quantidade: 1 }],
          },
        });

        job.then(() => {
          Log.info(`📦 Job adicionado - ${empresaId} - pedido ${pedidoId}`);
        });

        jobsLote.push(job);
      }
    }

    await Promise.all(jobsLote);
  }

  Log.info('✅ Todos os jobs foram adicionados.');
};
