export const popOverRedirects = () => {

    document.querySelectorAll('.popOverRedirect').forEach((element) => {
        element.addEventListener('click', (e) => {
            // e.preventDefault()
            element.parentElement.parentElement.hidePopover()
        })
    })
}