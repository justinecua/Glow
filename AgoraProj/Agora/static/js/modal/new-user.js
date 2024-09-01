export function switchModal(activeModal, Modals){
    for (let i = 0; i < Modals.length; i++) {
        Modals[i].style.display = "none";
    }
    activeModal.style.display = "flex";

}