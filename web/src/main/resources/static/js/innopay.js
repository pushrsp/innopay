const FORM_NAME = "InnopayForm"

function setPadding() {
}

function createForm(name, method, action, target) {
    let form = $(`form[name=${name}]`)
    if (form.length === 0) {
        form = document.createElement("form")
    }

    form.name = name
    form.method = method
    form.target = target

    document.body.appendChild(form)
    return form
}

function setEdiDate(form) {
    const date = new Date()
    const h = date.getHours()
    const m = date.getMinutes()
    const s = date.getSeconds()
}

const innopay = {
    goPay: (data) => {
        const form = createForm(FORM_NAME, "", "", "")
        setEdiDate(form)
    },
    close: () => {
    }
}