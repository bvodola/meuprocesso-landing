import React from "react"
import "./style.sass"
import VMasker from "vanilla-masker"

const replaceTags = (message, formData) => {
  if (typeof message == "string") {
    const tags = message.match(/{\w+}/g)
    if (tags) {
      tags.forEach(tag => {
        tag = tag.slice(1, -1)
        message = message.replace(`{${tag}}`, formData[tag] || "")
      })
    }
  }

  return message
}

export default props => {
  const {
    type,
    children,
    formData,
    avatar,
    avatarSrc,
    fields,
    setFormData,
    sendQueuedMessages,
    currentMessage,
    lastMessage,
    setLastMessage,
    sendFormData,
    url,
  } = props

  let message = children

  if (type === "received" || type === "sent")
    message = replaceTags(children, formData)
  if (type === "redirect") window.location.href = url

  return (
    // ====
    // Sent
    // ====
    type === "sent" ? (
      <div className="message-content">
        <div className="message-sent">{message}</div>
      </div>
    ) : // ========
    // Received
    // ========
    type === "received" ? (
      <div className="message-wrapper">
        <div
          style={{
            ...(avatar &&
              avatarSrc && { backgroundImage: `url(${avatarSrc})` }),
          }}
          className={avatar ? "avatar" : "placeholder"}
        ></div>
        <div className="message-content">
          <div className="message-received">{message}</div>
        </div>
      </div>
    ) : // ====
    // Form
    // ====
    type === "form" ? (
      <div className="message-form">
        {currentMessage === lastMessage ? (
          fields.map((field, i) =>
            field.type === "text" ? (
              <form
                key={i}
                onSubmit={ev => {
                  ev.preventDefault()
                  sendFormData()
                  sendQueuedMessages()
                }}
              >
                <input
                  required
                  autoFocus={field.autoFocus}
                  type={field.htmlType || "text"}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={ev => {
                    const newValue = field.mask
                      ? VMasker.toPattern(ev.target.value, field.mask)
                      : ev.target.value
                    setFormData(field.name, newValue)
                  }}
                />
                {(typeof field.submit === "undefined" || field.submit) && (
                  <button type="submit">OK</button>
                )}
              </form>
            ) : field.type === "options" ? (
              <div key={i}>
                {field.options.map((option, i) => (
                  <button
                    key={i}
                    onClick={ev => {
                      setFormData(field.name, option, () => {
                        sendQueuedMessages()
                        sendFormData()
                      })
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : null
          )
        ) : (
          <div
            className="answer-again"
            onClick={() => setLastMessage(currentMessage)}
          >
            Responder novamente
          </div>
        )}
      </div>
    ) : // =======
    // Default
    // =======
    null
  )
}
