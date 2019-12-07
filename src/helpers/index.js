// import StateHandler from "./stateHandler"

const setFormField = (scope, name) => {
  // const _ = new StateHandler(scope)

  return {
    onChange: ev => {
      if (scope) {
        scope.set(
          `form.${name}`,
          ev.target.type === "number"
            ? Number(ev.target.value)
            : ev.target.value
        )
      }
    },
    value: scope ? scope.get(`form.${name}`) : "",
  }
}

export { setFormField }
