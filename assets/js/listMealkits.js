window.onload = (event) => {
    setInstructionTitle()
}
function setInstructionTitle(){
    let $lableTitle = document.querySelector('.lable-title')
    $lableTitle.innerText = "click here to start..."
}
class App{
    constructor(){
        this.$lableTitle = document.querySelector('.lable-title')
        this.$noteTitle = document.querySelector('.note-title')
        this.$form = document.querySelector('#form')
        this.$noteText = document.querySelector('.note-text')
        this.$formButtons = document.querySelector('#form-buttons')
        this.$formCloseButton = document.querySelector('#form-close-button')
        this.addEventListeners()
    }

    addEventListeners(){
        document.body.addEventListener('click', event =>{
            this.handleFormClick(event)
        })
        this.$formCloseButton.addEventListener('click', event =>{
            event.stopPropagation()
            this.closeForm()
        })
        
    }

    handleFormClick(event){
        const isFormClicked = this.$form.contains(event.target)
        if(isFormClicked)
        {
            this.openForm()
        }
        else{
            this.closeForm()
        }
    }
    
    openForm(){
        this.$lableTitle.innerText = "Title"
        this.$form.classList.add('form-open')
        this.$noteText.style.display = 'block'
        this.$formButtons.style.display = 'block'

    }
    closeForm(){
       
        this.$form.classList.remove('form-open')
        this.$noteText.style.display = 'none'
        this.$formButtons.style.display = 'none'
        this.$lableTitle.innerText = "click here to start..."

    }

}

new App()