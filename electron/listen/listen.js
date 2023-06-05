import {openDirAction} from "./action/openDirAction";
import {localSettingAction} from "./action/localSettingAction";

const listen = () => {
    //settings
    openDirAction()

    localSettingAction()


}


export {
    listen
}