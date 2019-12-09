import React from "react"
import Chat from "../../components/Chat"

const received = (messages, firstMessageId = null) =>
  messages.map((content, i) => ({
    type: "received",
    content,
    id: i === 0 ? firstMessageId : null,
  }))

const question = (content, name, options) => [
  {
    type: "received",
    content,
  },
  {
    type: "form",
    fields: [
      {
        type: "options",
        name,
        options,
      },
    ],
  },
  {
    type: "sent",
    content: `{${name}}`,
  },
]
const yesOrNoQuestion = (content, name) =>
  question(content, name, ["Sim", "Não"])

const _if = name => [
  {
    type: "if",
    name,
  },
]
const _skip = (skip_id, id) => [
  {
    type: "skip",
    skip_id,
    id,
  },
]

const messageDatabase = [
  // =====
  // Intro
  // =====
  ...received([
    "Olá, {name}. Meu nome é Victor. Sou consultor especialista em DPVAT",
    "Vou te ajudar a receber a indenização DPVAT. Mas primeiro preciso entender um pouco sobre seu caso.",
    "Lembre-se de que a qualquer momento você apertar o ícone do Whatsapp acima e conversar comigo por lá.",
  ]),

  ...question("Quando ocorreu o acidente?", "accident_date", [
    "Há menos de 3 anos",
    "3 anos ou mais",
  ]),
  ...yesOrNoQuestion(
    "Certo. Você tem o boletim de ocorrência (BO) do acidente?",
    "bo"
  ),
  ...yesOrNoQuestion("A vítima faleceu devido ao acidente?", "deceased"),
  ..._if("deceased"),

  // ==============
  // Casos de Morte
  // ==============
  ...received(
    [
      "Certo. Primeiramente, meus sentimentos pela perda, {name}.",
      "Nos casos de morte, o DPVAT paga R$ 13.500 para os familiares da vítima.",
    ],
    "deceased_Sim"
  ),
  ...yesOrNoQuestion(
    "Você tem em mãos a certidão de óbito?",
    "death_certificate"
  ),
  ...yesOrNoQuestion("A vítima era casada no papel?", "married"),
  ...yesOrNoQuestion("Tinha filhos?", "children"),
  ..._skip("secondary"),

  // =========
  // Invalidez
  // =========
  ..._skip("injury", "deceased_Não"),
  ...received(
    [
      "Nesse caso, o DPVAT paga até R$ 13.500 para a vítima, de acordo com a lesão.",
    ],
    "injury"
  ),

  ...yesOrNoQuestion("A vítima teve de fazer cirurgia?", "surgery"),
  ...yesOrNoQuestion(
    "Você tem em mãos os laudos médicos do tratamento?",
    "medical"
  ),
  ..._skip("secondary"),

  // Secundárias
  ...received(
    ["Entendo. Preciso de apenas mais duas informações, {name}."],
    "secondary"
  ),
  ...yesOrNoQuestion("O veículo estava em nome da vítima?", "victim_is_owner"),
  ...question("No acidente, a vítima era", "victim_type", [
    "Motorista",
    "Passageiro",
    "Pedestre",
  ]),

  {
    type: "received",
    content:
      "Obrigado! Gostaria de continuar a conversar por Whatsapp ou prefere receber uma ligação nossa?",
  },
  {
    type: "form",
    fields: [
      {
        type: "options",
        name: "contact_preference",
        options: ["Continuar por Whatsapp", "Quero receber uma ligação"],
      },
    ],
  },
  {
    type: "sent",
    content: "{contact_preference}",
  },
  {
    type: "if",
    name: "contact_preference",
  },
  {
    id: "contact_preference_Quero receber uma ligação",
    type: "received",
    content: "Ok. Ligaremos o mais rápido possível no {phone}",
  },
  {
    type: "skip",
    skip_id: "final",
  },
  {
    id: "contact_preference_Continuar por Whatsapp",
    type: "redirect",
    url: "http://api.whatsapp.com/send?phone=5511940728896",
  },
  {
    id: "final",
    type: "received",
    content: "Obrigado pelo contato, {name}!",
    last: true,
  },
]

export default () => (
  <Chat
    nav={{
      logoHref: "http://indenizamais.com.br/landing/dpvat/1",
      whatsapp: "11963197881",
    }}
    messageInterval={1000}
    messageDatabase={messageDatabase}
    avatarSrc={"/img/victor.jpg"}
  />
)
