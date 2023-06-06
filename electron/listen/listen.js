import {openDirAction} from "./action/openDirAction";
import {localSettingAction} from "./action/localSettingAction";
import {dataSyncAction} from "./action/dataSyncAction";

const listen = () => {
    //settings
    openDirAction()

    localSettingAction()

    dataSyncAction()
}


export {
    listen
}