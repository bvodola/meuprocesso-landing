import React from "react"
import axios from "axios"
import Message from "../Message"
import Nav from "../Nav"
import "./Chat.sass"

const BACKEND_URL = "https://www.leadmaster.com.br"

function getParam(name, url = window.location.href) {
  if (!url) url = window.location.href
  name = name.replace(/[\[\]]/g, "\\$&")
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ""
  return decodeURIComponent(results[2].replace(/\+/g, " "))
}

const received = (messages, firstMessageId = null) =>
  messages.map((content, i) => ({
    type: "received",
    content,
    id: i === 0 ? firstMessageId : null,
  }))

const sent = (messages, firstMessageId) =>
  messages.map((content, i) => ({
    type: "sent",
    content,
    id: i === 0 ? firstMessageId : null,
  }))

const question = (content, name, options, messageId = null) => [
  {
    id: messageId,
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
const yesOrNoQuestion = (content, name, messageId) =>
  question(content, name, ["Sim", "Não"], messageId)

const _switch = name => [
  {
    type: "if",
    name,
  },
]

const _skip = (skip_id, id = null) => [
  {
    type: "skip",
    skip_id,
    id,
  },
]

const defaultMessageDatabase = [
  {
    type: "received",
    content:
      "Olá, meu nome é Douglas. Sou consultor especialista em erros médicos",
  },
  {
    type: "received",
    content:
      "Vou te ajudar a resolver seu problema. Mas primeiro preciso entender um pouco sobre seu caso.",
  },
  {
    type: "received",
    content:
      "Quem foi a vítima do erro médico, você ou alguém que você conhece?",
  },
  {
    type: "form",
    fields: [
      {
        type: "options",
        name: "victim",
        options: ["Eu", "Outra pessoa"],
      },
    ],
  },
  {
    type: "sent",
    content: "{victim}.",
  },
  {
    type: "received",
    content: "Entendo. Foi um procedimento estético?",
  },
  {
    type: "form",
    fields: [
      {
        type: "options",
        name: "procedure",
        options: ["Sim", "Não"],
      },
    ],
  },
  {
    type: "sent",
    content: "{procedure}.",
  },
  {
    type: "received",
    content:
      "E você já procurou a opinião de um segundo profissional da saúde?",
  },
  {
    type: "form",
    fields: [
      {
        type: "options",
        name: "second_opinion",
        options: ["Sim", "Não"],
      },
    ],
  },
  {
    type: "sent",
    content: "{second_opinion}.",
  },
  {
    type: "received",
    content: "Certo! Obrigado pelas informações.",
  },
  {
    type: "received",
    content: "Como você se chama?",
  },
  {
    type: "form",
    fields: [
      {
        type: "text",
        name: "name",
        placeholder: "Nome",
      },
    ],
  },
  {
    type: "sent",
    content: "Meu nome é {name}.",
  },
  {
    type: "received",
    content:
      "Obrigado, {name}. Qual seu celular para que possamos manter contato?",
  },
  {
    type: "form",
    fields: [
      {
        type: "text",
        name: "phone",
        placeholder: "DDD + Celular",
      },
    ],
  },
  {
    type: "sent",
    content: "{phone}",
  },
  {
    type: "received",
    content: "Olá! Gostaria de conversar por Whatsapp?",
  },
  {
    type: "form",
    fields: [
      {
        type: "options",
        name: "whatsapp",
        options: ["Sim", "Não"],
      },
    ],
  },
]

class Chat extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      messages: [],
      lastMessage: -1,
      formData: {
        ...props.initialFormData,
      },
      timeout: null,
    }

    this.setFormData = this.setFormData.bind(this)
    this.sendQueuedMessages = this.sendQueuedMessages.bind(this)
    this.setLastMessage = this.setLastMessage.bind(this)
    this.sendFormData = this.sendFormData.bind(this)
  }

  sendQueuedMessages() {
    const { formData, lastMessage } = this.state
    const messageDatabase = this.props.messageDatabase || defaultMessageDatabase

    let currentMessageIndex = lastMessage + 1
    let currentMessage = { ...messageDatabase[currentMessageIndex] }

    // If the message is a header
    while (currentMessage.type === "header") {
      // If we have the header type, we just skip to the next message
      currentMessageIndex = currentMessageIndex + 1
      currentMessage = { ...messageDatabase[currentMessageIndex] }
    }

    // If the message is an IF or SKIP
    if (currentMessage && currentMessage.type) {
      if (currentMessage.type === "if" || currentMessage.type === "skip") {
        const msgId =
          currentMessage.type === "if"
            ? `${currentMessage.name}_${formData[currentMessage.name]}`
            : currentMessage.skip_id

        if (currentMessage[formData[currentMessage.name]]) {
          console.log("if")
          currentMessage.type = "received"
          currentMessage.content = currentMessage[formData[currentMessage.name]]
        } else {
          console.log("else", msgId)
          currentMessage = messageDatabase.find((msg, i) => {
            if (msgId === msg.id) {
              currentMessageIndex = i
              return true
            }
            return false
          })
        }
      }

      currentMessage.key = currentMessageIndex
      const messages = [...this.state.messages, currentMessage]

      this.setState({ messages, lastMessage: currentMessageIndex })
      window.scrollTo(0, document.body.scrollHeight)

      this.setState({
        timeout: setTimeout(() => {
          if (currentMessage.type !== "form") this.sendQueuedMessages()
        }, this.props.messageInterval || 1000),
      })
    }
  }

  setFormData(key, val, cb = () => {}) {
    let formData = {
      ...this.state.formData,
      [key]: val,
    }
    this.setState({ formData }, cb)
  }

  componentDidMount() {
    this.sendQueuedMessages()

    const name = getParam("name")
    const phone = getParam("phone")
    this.setFormData("name", name, () => this.setFormData("phone", phone))
  }

  componentWillUnmount() {
    clearTimeout(this.state.timeout)
  }

  setLastMessage(messageKey) {
    let { messages, timeout } = this.state
    clearTimeout(timeout)

    let messageIndex, lastMessage

    messages.forEach((msg, i) => {
      if (msg.key === messageKey) {
        messageIndex = i
        lastMessage = messageKey
      }
    })

    messages = messages.slice(0, messageIndex + 1)
    this.setState({ lastMessage, messages })
  }

  async sendFormData() {
    try {
      const { formData } = this.state
      if (!formData._id) {
        const _id = (await axios.post(
          `${BACKEND_URL}/api/leads/`,
          formData,
          {}
        )).data._id
        this.setFormData("_id", _id)
      } else {
        await axios.put(
          `${BACKEND_URL}/api/leads/${formData._id}`,
          formData,
          {}
        )
      }
      // axios
      //   .post(BACKEND_URL + "/api/mail/send/", {
      //     from: "leads@indenizamais.com.br",
      //     to: formData.to,
      //     subject: "Lead IndenizaMais",
      //     text: `Nome: ${formData.name}, Telefone: ${formData.phone} \n\nMensagem,: ${formData.content}`,
      //   })
      //   .then(function() {
      //     gtag_report_conversion()
      //     setFormState(form, "DEFAULT")
      //     toggleSuccessAlert()
      //   })
      //   .catch(function(err) {
      //     console.log("Error", err)
      //     setFormState(form, "DEFAULT")
      //   })
    } catch (err) {
      console.log(err)
    }
  }

  render() {
    const { messages, lastMessage, formData } = this.state
    const { nav, avatarSrc } = this.props

    return (
      <div className="chat">
        <span className="background"></span>
        <Nav {...nav} />

        {messages.map((message, i) => {
          const avatar = !(
            messages[i - 1] && messages[i - 1].type === message.type
          )

          return (
            <div key={i}>
              <Message
                key={message.key}
                avatar={avatar}
                avatarSrc={avatarSrc}
                formData={formData}
                currentMessage={message.key}
                lastMessage={lastMessage}
                setFormData={this.setFormData}
                setLastMessage={this.setLastMessage}
                sendQueuedMessages={this.sendQueuedMessages}
                sendFormData={this.sendFormData}
                {...message}
              >
                {message.content}
              </Message>

              {message.key === lastMessage &&
                message.type !== "form" &&
                !message.last && (
                  <Message key={`typing${i}`} type="received">
                    <img
                      style={{ width: "50px", margin: "-20px 0" }}
                      src="/img/typing.gif"
                      alt=""
                    />
                  </Message>
                )}
            </div>
          )
        })}
      </div>
    )
  }
}

export { received, sent, question, yesOrNoQuestion, _switch, _skip }
export default Chat
