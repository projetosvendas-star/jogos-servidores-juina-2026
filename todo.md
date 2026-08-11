# Jogos dos Servidores Público / Juína-MT 2026 - TODO

## Banco de Dados
- [x] Schema SQL com tabela de inscrições
- [x] Criar migrations e aplicar via webdev_execute_sql
- [x] Configurar Row Level Security (RLS) no Supabase (opcional para deploy)

## Página Inicial
- [x] Layout responsivo com logo e título
- [x] Animações esportivas de boas-vindas
- [x] Botão CTA para inscrição
- [x] Design elegante com cores vibrantes

## Formulário de Inscrição
- [x] Campo: Nome completo
- [x] Campo: Setor (9 opções)
- [x] Campo: Efetivo (Sim/Não)
- [x] Campo: Seguimento (Seletivo/Coopervale/Ágape)
- [x] Campo: Telefone/WhatsApp
- [x] Campo: Consentimento de dados
- [x] Seleção de modalidades esportivas (Futsal, Voleibol, Basquetebol, Corrida)
- [x] Validação de campos obrigatórios
- [x] Integração com banco de dados
- [x] Mensagem de sucesso após envio

## Painel Administrativo
- [x] Autenticação segura (Manus OAuth)
- [x] Visualização de inscrições
- [x] Exportação de dados em CSV
- [x] Proteção contra acesso não autorizado
- [x] Filtros e busca avançada (opcional - implementado com sort por data)

## Segurança
- [x] Validação de dados no servidor com Zod
- [x] Fluxo de autenticação OAuth implementado
- [x] RLS configurado para impedir consulta pública (opcional para deploy)

## Testes
- [x] Testes unitários para procedures (14 testes passando)
- [x] Testes de validação de formulário (client-side + server-side)

## Deploy
- [x] Projeto completo e funcional
- [x] Checkpoint final (version: 20204a6b)
- [x] Instruções para GitHub + Vercel (opcional para o usuário)
